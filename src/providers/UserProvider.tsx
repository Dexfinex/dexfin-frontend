import { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { type SolanaWalletInfoType } from "../types/auth.type";
import { authService } from "../services/auth.service";
import { Web3AuthContext } from "./Web3AuthContext";
import { useStore } from "../store/useStore.ts";
import { setAuthToken } from "../services/api.service";
import { WalletTypeEnum } from "../types/wallet.type.ts";
import { clearReferralCode, getReferralCodeFromStorage } from '../components/ReferralHandler.tsx';
import {useToast} from "@chakra-ui/react";

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

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userData, setUserData] = useState<UserContextType["userData"]>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isNewRegistration, setIsNewRegistration] = useState(false);
  const [authenticatedWallets, setAuthenticatedWallets] = useState<Set<string>>(new Set());
  const toast = useToast()
  const { address: wagmiAddress, isConnected: isWagmiWalletConnected } =
    useAccount();
  const {
    solanaWalletInfo,
    currentAccount,
    address: kernelAddress,
    walletType,
    isConnected,
    logout,
  } = useContext(Web3AuthContext);

  const handleWalletAuth = async (
    walletType: WalletTypeEnum,
    evmAddress?: string,
    solAddress?: string
  ) => {
    // Skip if already authenticated with this wallet
    if (evmAddress && authenticatedWallets.has(evmAddress.toLowerCase())) {
      console.log("Wallet already authenticated:", evmAddress);
      return;
    }

    if (solAddress && authenticatedWallets.has(solAddress)) {
      console.log("Solana wallet already authenticated:", solAddress);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      let authResponse;
      try {
        // Attempt login first
        authResponse = await authService.login(evmAddress || "");
        if (authResponse?.accessToken) {
          console.log("Login successful");
          setAuthToken(authResponse.accessToken);
          setUserData({
            accessToken: authResponse.accessToken,
            userId: authResponse.userId,
            walletType,
          });
          setIsNewRegistration(false);
          
          // Track the authenticated wallet
          if (evmAddress) {
            setAuthenticatedWallets(prev => {
              const updated = new Set(prev);
              updated.add(evmAddress.toLowerCase());
              return updated;
            });
          }
          if (solAddress) {
            setAuthenticatedWallets(prev => {
              const updated = new Set(prev);
              updated.add(solAddress);
              return updated;
            });
          }
          
          return;
        }
      } catch (loginError) {
        console.log("Login failed, attempting registration...", loginError);
      }
      // ------------- for invite only mode ------------
      logout()
      toast({
        status: 'info',
        description: `Please signup before you connect your wallet`,
        duration: 3500
      })
      return
      // ------------- end of invite only mode ------------

/*      // If login fails, attempt registration
      authResponse = await authService.register(
        walletType,
        evmAddress,
        solAddress
      );

      if (authResponse?.accessToken) {
        console.log("Registration successful");
        setAuthToken(authResponse.accessToken);
        setUserData({
          accessToken: authResponse.accessToken,
          userId: authResponse.userId,
          walletType,
        });
        setIsNewRegistration(true);
        
        // Track the authenticated wallet
        if (evmAddress) {
          setAuthenticatedWallets(prev => {
            const updated = new Set(prev);
            updated.add(evmAddress.toLowerCase());
            return updated;
          });
        }
        if (solAddress) {
          setAuthenticatedWallets(prev => {
            const updated = new Set(prev);
            updated.add(solAddress);
            return updated;
          });
        }
      }*/
    } catch (error) {
      console.error("Error in wallet authentication:", error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const registerUsername = async () => {
    if (isNewRegistration && userData?.accessToken) {
      try {
        let username = localStorage.getItem("username");
        if (!username) {
          username = useStore.getState().username;
        }
        const referralCode = getReferralCodeFromStorage();
        const referralCodeOrUndefined =
          referralCode === null ? undefined : referralCode;
        if (username) {
          const response = await authService.registerUsername(
            username,
            referralCodeOrUndefined
          );

          if (response) {
            setIsNewRegistration(false);
            clearReferralCode();
            localStorage.removeItem("username");
            useStore.getState().setUserName("");
          }
        } else {
          console.log("No username found to register");
          setIsNewRegistration(false);
        }
      } catch (error) {
        console.error("Error registering username:", error);
      }
    }
  };

  useEffect(() => {
    registerUsername();
  }, [isNewRegistration, userData, currentAccount]);

  const initializeAllVariables = () => {
    setUserData(null);
    setIsLoading(false);
    setError(null);
    setAuthToken(null);
    setIsNewRegistration(false);
    setAuthenticatedWallets(new Set());
  };

  useEffect(() => {
    if (isWagmiWalletConnected && wagmiAddress) {
      handleWalletAuth(walletType, wagmiAddress);
    }
  }, [isWagmiWalletConnected, wagmiAddress, walletType]);

  useEffect(() => {
    if (currentAccount && kernelAddress && solanaWalletInfo?.publicKey) {
      handleWalletAuth(walletType, kernelAddress, solanaWalletInfo.publicKey);
    }
  }, [kernelAddress, currentAccount, solanaWalletInfo?.publicKey, walletType]);

  useEffect(() => {
    if (!isConnected) {
      initializeAllVariables();
    }
  }, [isConnected]);

  const value = {
    userData,
    isLoading,
    error,
    solanaWalletInfo,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};