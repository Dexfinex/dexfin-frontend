// import { useContext, useState, useCallback } from 'react';
// import { Web3AuthContext } from '../providers/Web3AuthContext';
// import useTokenBalanceStore from '../store/useTokenBalanceStore';
// import { zeroxService } from "../services/0x.service";
// import { TokenTypeB } from "../types/cart.type";
// import { ethers } from 'ethers';
// import { nativeAddress } from '../constants';
// import { coingeckoService } from "../services/coingecko.service";
// import { WalletTypeEnum } from "../types/wallet.type.ts";

// export const useWalletTokenPurchase = () => {
//   const [isPending, setIsPending] = useState(false);
//   const [isConfirmed, setIsConfirmed] = useState(false);
//   const [txHashes, setTxHashes] = useState<string[]>([]);
//   const [error, setError] = useState<string | null>(null);
  
//   const { 
//     address, 
//     chainId, 
//     provider, 
//     signer, 
//     walletType,
//     getWalletType
//   } = useContext(Web3AuthContext);
  
//   const { tokenBalances } = useTokenBalanceStore();
//   const SLIPPAGE_TOLERANCE = 0.005; // 0.5%
  
//   // Check if user has enough balance for a purchase
//   const hasEnoughBalance = useCallback((requiredAmount: number, tokenSymbol: string = 'USDC') => {
//     // Find the token in user's wallet
//     const token = tokenBalances.find(t => t.symbol.toUpperCase() === tokenSymbol.toUpperCase());
//     if (!token) return false;
    
//     // Convert balance to number and compare
//     return Number(token.balance) >= requiredAmount;
//   }, [tokenBalances]);
  
//   const getEthPrice = async (): Promise<number> => {
//     try {
//         const ethPrices = await coingeckoService.getTokenPrices(1, [nativeAddress]);
//         const ethPrice = ethPrices[nativeAddress];
//         if (!ethPrice) throw new Error('Failed to fetch ETH price');
//         return parseFloat(ethPrice);
//     } catch (error) {
//         console.error('ETH price fetch failed:', error);
//         throw error;
//     }
//   };
  
//   // Execute token purchase with the embedded wallet
//   const executePurchase = useCallback(async (tokens: { token: TokenTypeB, amount: string }[]) => {
//     if (!address || !provider || !signer || getWalletType() !== WalletTypeEnum.EMBEDDED) {
//       setError('Embedded wallet not connected');
//       return false;
//     }
    
//     if (!tokens.length) {
//       throw new Error('No tokens to purchase');
//     }
    
//     setIsPending(true);
//     setError(null);
//     setTxHashes([]);
    
//     try {
//       const completedTxHashes: string[] = [];
      
//       // Get ETH price once for all transactions
//       const ETH_PRICE_USD = await getEthPrice();

//       // Process each token sequentially
//       for (let i = 0; i < tokens.length; i++) {
//         console.log(`Processing token ${i + 1} of ${tokens.length}`);

//         // Get current gas price for each transaction
//         const gasPrice = await provider.getGasPrice();
//         if (!gasPrice) throw new Error('Could not get gas price');

//         const currentToken = tokens[i];
//         const tokenQuantity = parseFloat(currentToken.amount);
//         const tokenPriceInUSD = currentToken.token.price || 0;
//         const totalCostInUSD = tokenPriceInUSD * tokenQuantity;
//         const totalCostWithSlippage = totalCostInUSD * (1 + SLIPPAGE_TOLERANCE);
//         const ethAmount = (totalCostWithSlippage / ETH_PRICE_USD).toFixed(18);
//         const sellTokenAmount = ethers.utils.parseEther(ethAmount).toString();

//         const quoteParams = {
//           chainId: chainId || 8453,
//           buyTokenAddress: currentToken.token.address,
//           sellTokenAddress: nativeAddress,
//           sellTokenAmount: sellTokenAmount,
//           takerAddress: address,
//         };

//         console.log(`Requesting quote for token ${i + 1}:`, quoteParams);
//         const quoteResponse = await zeroxService.getQuote(quoteParams);

//         if (!quoteResponse?.transaction) {
//           throw new Error(`Invalid quote response for token ${i + 1}`);
//         }

//         const transaction = quoteResponse.transaction;
//         const gasLimit = BigInt(transaction.gas || '400000');
//         const gasCost = gasLimit * gasPrice.toBigInt();

//         // Check balance for each transaction
//         const balance = await provider.getBalance(address);
//         if (!balance) throw new Error('Could not fetch balance');

//         const totalCost = BigInt(transaction.value || '0') + gasCost;
//         if (balance.lt(totalCost)) {
//           const userBalance = ethers.utils.formatEther(balance);
//           const requiredAmount = ethers.utils.formatEther(totalCost);
//           throw new Error(`Insufficient ETH balance for token ${i + 1}. Have ${userBalance} ETH, need ${requiredAmount} ETH`);
//         }

//         // Execute transaction using embedded wallet signer
//         const tx = await signer.sendTransaction({
//           to: transaction.to,
//           data: transaction.data,
//           value: transaction.value ? BigInt(transaction.value) : BigInt(0),
//           gasLimit,
//           gasPrice
//         });

//         console.log(`Transaction ${i + 1} hash:`, tx.hash);
//         completedTxHashes.push(tx.hash);
        
//         // Add to the txHashes state
//         setTxHashes(prevHashes => [...prevHashes, tx.hash]);

//         // Wait for transaction confirmation before proceeding to next token
//         await tx.wait();
//       }
      
//       setTxHashes(completedTxHashes);
//       setIsConfirmed(true);
//       return true;
//     } catch (err) {
//       console.error('Purchase error:', err);
//       setError(err instanceof Error ? err.message : 'Failed to process purchase');
//       return false;
//     } finally {
//       setIsPending(false);
//     }
//   }, [address, chainId, provider, signer, getWalletType]);
  
//   return {
//     executePurchase,
//     isPending,
//     isConfirmed,
//     txHashes,
//     error,
//     hasEnoughBalance
//   };
// };

// export default useWalletTokenPurchase;



import { useContext, useState, useCallback } from 'react';
import { Web3AuthContext } from '../providers/Web3AuthContext';
import useTokenBalanceStore from '../store/useTokenBalanceStore';
import { zeroxService } from "../services/0x.service";
import { TokenTypeB } from "../types/cart.type";
import { ethers } from 'ethers';
import { nativeAddress } from '../constants';
import { coingeckoService } from "../services/coingecko.service";
import { WalletTypeEnum } from "../types/wallet.type";

export const useWalletTokenPurchase = () => {
  const [isPending, setIsPending] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [txHashes, setTxHashes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    address, 
    chainId, 
    provider, 
    signer, 
    kernelAccount,
    getWalletType
  } = useContext(Web3AuthContext);
  
  const { tokenBalances } = useTokenBalanceStore();
  const SLIPPAGE_TOLERANCE = 0.005; // 0.5%
  
  // Check if user has enough balance for a purchase
  const hasEnoughBalance = useCallback((requiredAmount: number, tokenSymbol: string = 'USDC') => {
    // Find the token in user's wallet
    const token = tokenBalances.find(t => t.symbol.toUpperCase() === tokenSymbol.toUpperCase());
    if (!token) return false;
    
    // Convert balance to number and compare
    return Number(token.balance) >= requiredAmount;
  }, [tokenBalances]);
  
  const getEthPrice = async (): Promise<number> => {
    try {
      const ethPrices = await coingeckoService.getTokenPrices(1, [nativeAddress]);
      const ethPrice = ethPrices[nativeAddress];
      if (!ethPrice) throw new Error('Failed to fetch ETH price');
      return parseFloat(ethPrice);
    } catch (error) {
      console.error('ETH price fetch failed:', error);
      throw error;
    }
  };
  
  // Execute token purchase with the embedded wallet
  const executePurchase = useCallback(async (tokens: { token: TokenTypeB, amount: string }[]) => {
    console.log("[WalletTokenPurchase] Starting purchase with:", {
      address,
      hasProvider: !!provider,
      hasSigner: !!signer,
      walletType: getWalletType(),
      isEmbedded: getWalletType() === WalletTypeEnum.EMBEDDED,
      hasKernelAccount: !!kernelAccount,
      chainId
    });
    
    // Check if we can process with embedded wallet
    if (!address || !provider || !signer) {
      setError('Wallet not connected');
      return false;
    }
    
    const currentWalletType = getWalletType();
    console.log("Current wallet type in executePurchase:", currentWalletType);
    console.log("Is embedded wallet?:", currentWalletType === WalletTypeEnum.EMBEDDED);
    
    if (currentWalletType !== WalletTypeEnum.EMBEDDED) {
      setError('Can only purchase with embedded wallet in this function');
      return false;
    }
    
    if (!tokens.length) {
      throw new Error('No tokens to purchase');
    }
    
    setIsPending(true);
    setError(null);
    setTxHashes([]);
    
    try {
      const completedTxHashes: string[] = [];
      
      // Get ETH price once for all transactions
      const ETH_PRICE_USD = await getEthPrice();

      // Process each token sequentially
      for (let i = 0; i < tokens.length; i++) {
        console.log(`Processing token ${i + 1} of ${tokens.length}`);

        // Get current gas price for each transaction
        const gasPrice = await provider.getGasPrice();
        if (!gasPrice) throw new Error('Could not get gas price');

        const currentToken = tokens[i];
        console.log("[WalletTokenPurchase] Token purchase data:", currentToken);
        
        const tokenQuantity = parseFloat(currentToken.amount);
        const tokenPriceInUSD = currentToken.token.price || 0;
        const totalCostInUSD = tokenPriceInUSD * tokenQuantity;
        const totalCostWithSlippage = totalCostInUSD * (1 + SLIPPAGE_TOLERANCE);
        const ethAmount = (totalCostWithSlippage / ETH_PRICE_USD).toFixed(18);
        const sellTokenAmount = ethers.utils.parseEther(ethAmount).toString();

        const quoteParams = {
          chainId: chainId || 8453,
          buyTokenAddress: currentToken.token.address,
          sellTokenAddress: nativeAddress,
          sellTokenAmount: sellTokenAmount,
          takerAddress: address,
        };

        console.log(`Requesting quote for token ${i + 1}:`, quoteParams);
        const quoteResponse = await zeroxService.getQuote(quoteParams);
        console.log(`Quote response for token ${i + 1}:`, quoteResponse);

        if (!quoteResponse?.transaction) {
          throw new Error(`Invalid quote response for token ${i + 1}`);
        }

        const transaction = quoteResponse.transaction;
        const gasLimit = BigInt(transaction.gas || '400000');
        const gasCost = gasLimit * gasPrice.toBigInt();

        // Check balance for each transaction
        const balance = await provider.getBalance(address);
        if (!balance) throw new Error('Could not fetch balance');

        const transactionValue = transaction.value ? 
          (typeof transaction.value === 'string' ? BigInt(transaction.value) : transaction.value) : 
          BigInt(0);
          
        const totalCost = transactionValue + gasCost;
        
        console.log("Transaction parameters:", {
          to: transaction.to,
          dataLength: transaction.data?.length || 0,
          value: transactionValue.toString(),
          valueHex: transaction.value,
          gasLimit: gasLimit.toString(),
          gasPrice: gasPrice.toString()
        });
        
        if (balance.lt(totalCost)) {
          const userBalance = ethers.utils.formatEther(balance);
          const requiredAmount = ethers.utils.formatEther(totalCost);
          throw new Error(`Insufficient ETH balance for token ${i + 1}. Have ${userBalance} ETH, need ${requiredAmount} ETH`);
        }

        // Execute transaction using embedded wallet signer
        console.log("Sending transaction with embedded wallet signer");
        const tx = await signer.sendTransaction({
          to: transaction.to,
          data: transaction.data,
          value: transactionValue,
          gasLimit,
          gasPrice
        });

        console.log(`Transaction ${i + 1} hash:`, tx.hash);
        completedTxHashes.push(tx.hash);
        
        // Add to the txHashes state
        setTxHashes(prevHashes => [...prevHashes, tx.hash]);

        // Wait for transaction confirmation before proceeding to next token
        console.log(`Waiting for transaction ${i + 1} confirmation...`);
        const receipt = await tx.wait();
        console.log(`Transaction ${i + 1} confirmed:`, receipt);
      }
      
      setTxHashes(completedTxHashes);
      setIsConfirmed(true);
      return true;
    } catch (err) {
      console.error('Purchase error details:', {
        message: err instanceof Error ? err.message : String(err),
        error: err,
        token: tokens[0]?.token?.symbol,
        amount: tokens[0]?.amount
      });
      setError(err instanceof Error ? err.message : 'Failed to process purchase');
      return false;
    } finally {
      setIsPending(false);
    }
  }, [address, chainId, provider, signer, kernelAccount, getWalletType]);
  
  return {
    executePurchase,
    isPending,
    isConfirmed,
    txHashes,
    error,
    hasEnoughBalance
  };
};

export default useWalletTokenPurchase;