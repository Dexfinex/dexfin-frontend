import { createContext, useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { type SolanaWalletInfoType } from '../types/auth';
import { authService } from '../services/auth.service';
import { Web3AuthContext } from './Web3AuthContext';
import { useStore } from "../store/useStore.ts";
import { setAuthToken } from '../services/api.service';
import {WalletTypeEnum} from "../types/wallet.ts";

interface UserContextType {
  userData: {
    accessToken: string;
    userId?: string;
    walletType?: WalletTypeEnum;
  } | null;
  isLoading: boolean;
  error: Error | null;
  solanaWalletInfo: SolanaWalletInfoType | undefined;
}

const UserContext = createContext<UserContextType>({
  userData: null,
  isLoading: false,
  error: null,
  solanaWalletInfo: undefined,
});

export const useUserData = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserContextType['userData']>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { address: wagmiAddress, isConnected: isWagmiWalletConnected } = useAccount();
  const { 
    solanaWalletInfo,
    currentAccount,
    address: kernelAddress,
    walletType,
    isConnected,
  } = useContext(Web3AuthContext);

  const handleWalletAuth = async (walletType: WalletTypeEnum, evmAddress?: string, solAddress?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to login first
      try {
        const loginResponse = await authService.login(evmAddress || '');
        if (loginResponse?.accessToken) {
          setAuthToken(loginResponse.accessToken);
          setUserData({
            accessToken: loginResponse.accessToken,
            userId: loginResponse.userId,
            walletType
          });
          return;
        }
      } catch (error) {
        console.log('Login failed, attempting registration...');
      }

      // If login failed, attempt to register
      const registerResponse = await authService.register(
        walletType,
        evmAddress,
        solAddress
      );

      if (registerResponse?.accessToken) {
        setAuthToken(registerResponse.accessToken);
        setUserData({
          accessToken: registerResponse.accessToken,
          userId: registerResponse.userId,
          walletType
        });
        
        // Open username modal for new users
        useStore.getState().setIsUsernameModalOpen(true);
      }
    } catch (error) {
      console.error("Error in wallet authentication:", error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeAllVariables = () => {
    setUserData(null);
    setIsLoading(false);
    setError(null);
    setAuthToken(null); // Clear auth tokens from all API instances
  };

  // Handle Wagmi wallet connection
  useEffect(() => {
    if (isWagmiWalletConnected && wagmiAddress) {
      handleWalletAuth(walletType, wagmiAddress);
    }
  }, [isWagmiWalletConnected, wagmiAddress, walletType]);

  // Handle Kernel Account and Solana wallet connection
  useEffect(() => {
    if (currentAccount && kernelAddress && solanaWalletInfo?.publicKey) {
      handleWalletAuth(walletType, kernelAddress, solanaWalletInfo.publicKey );
    }
  }, [kernelAddress, currentAccount, solanaWalletInfo?.publicKey, walletType]);

  // Reset user state when Web3Auth disconnects
  useEffect(() => {
    if (!isConnected) {
      initializeAllVariables();
    }
  }, [isConnected]);

  const value = {
    userData,
    isLoading,
    error,
    solanaWalletInfo, // Pass through solanaWalletInfo from Web3AuthContext
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};