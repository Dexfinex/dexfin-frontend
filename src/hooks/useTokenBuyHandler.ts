import { useContext, useState } from 'react';
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { Web3AuthContext } from "../providers/Web3AuthContext";
import { TokenTypeB } from "../types/cart.type";
import { nativeAddress } from '../constants';
import { zeroxService } from "../services/0x.service";
import { ethers } from 'ethers';
import { coingeckoService } from "../services/coingecko.service";

export const useTokenBuyHandler = () => {
    const [error, setError] = useState<Error | null>(null);
    const [txHashes, setTxHashes] = useState<string[]>([]);
    const [currentTxHash, setCurrentTxHash] = useState<string | null>(null);
    const { address: walletAddress, provider, chainId: walletChainId } = useContext(Web3AuthContext);
    const SLIPPAGE_TOLERANCE = 0.005; // 0.5%

    const {
        isPending,
        sendTransactionAsync
    } = useSendTransaction();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: currentTxHash as `0x${string}`,
    });

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

    const executeBatchBuy = async (tokens: { token: TokenTypeB, amount: string }[]) => {
        if (!tokens.length || !walletAddress) {
            throw new Error('Missing required parameters');
        }

        console.log("Starting batch buy for tokens:", tokens);
        const completedTxHashes: string[] = [];
        setTxHashes([]); 
        try {
            // Get ETH price once for all transactions
            const ETH_PRICE_USD = await getEthPrice();

            // Process each token sequentially
            for (let i = 0; i < tokens.length; i++) {
                console.log(`Processing token ${i + 1} of ${tokens.length}`);

                // Get current gas price for each transaction
                const gasPrice = await provider?.getGasPrice();
                if (!gasPrice) throw new Error('Could not get gas price');

                const currentToken = tokens[i];
                const tokenQuantity = parseFloat(currentToken.amount);
                const tokenPriceInUSD = currentToken.token.price || 0;
                const totalCostInUSD = tokenPriceInUSD * tokenQuantity;
                const totalCostWithSlippage = totalCostInUSD * (1 + SLIPPAGE_TOLERANCE);
                const ethAmount = (totalCostWithSlippage / ETH_PRICE_USD).toFixed(18);
                const sellTokenAmount = ethers.utils.parseEther(ethAmount).toString();

                const quoteParams = {
                    chainId: walletChainId || 8453,
                    buyTokenAddress: currentToken.token.address,
                    sellTokenAddress: nativeAddress,
                    sellTokenAmount: sellTokenAmount,
                    takerAddress: walletAddress,
                };

                console.log(`Requesting quote for token ${i + 1}:`, quoteParams);
                const quoteResponse = await zeroxService.getQuote(quoteParams);

                if (!quoteResponse?.transaction) {
                    throw new Error(`Invalid quote response for token ${i + 1}`);
                }

                const transaction = quoteResponse.transaction;
                const gasLimit = BigInt(transaction.gas || '400000');
                const gasCost = gasLimit * gasPrice.toBigInt();

                // Check balance for each transaction
                const balance = await provider?.getBalance(walletAddress);
                if (!balance) throw new Error('Could not fetch balance');

                const totalCost = BigInt(transaction.value || '0') + gasCost;
                if (balance.lt(totalCost)) {
                    const userBalance = ethers.utils.formatEther(balance);
                    const requiredAmount = ethers.utils.formatEther(totalCost);
                    throw new Error(`Insufficient ETH balance for token ${i + 1}. Have ${userBalance} ETH, need ${requiredAmount} ETH`);
                }

                // Execute transaction
                const txHash = await sendTransactionAsync({
                    account: walletAddress as `0x${string}`,
                    to: transaction.to as `0x${string}`,
                    data: transaction.data as `0x${string}`,
                    value: BigInt(transaction.value || '0'),
                    gas: gasLimit,
                    maxFeePerGas: gasPrice.toBigInt(),
                    chainId: walletChainId || 8453,
                });

                console.log(`Transaction ${i + 1} hash:`, txHash);
                completedTxHashes.push(txHash);
                setCurrentTxHash(txHash);
                setTxHashes(prevHashes => [...prevHashes, txHash]); 

                // Wait for transaction confirmation before proceeding to next token
                await provider?.waitForTransaction(txHash);
            }

            // console.log("All transactions completed:", completedTxHashes);
            return completedTxHashes[completedTxHashes.length - 1]; 
        } catch (err) {
            console.error('Batch buy execution failed:', err);
            const errorMessage = err instanceof Error ?
                err.message :
                'Transaction failed - Please ensure you have enough ETH for gas fees';
            setError(new Error(errorMessage));
            throw err;
        }
    };

    return {
        executeBatchBuy,
        error,
        txHash: currentTxHash,
        txHashes, // Return all transaction hashes
        isLoading: isPending || isConfirming,
        isConfirmed,
        isPending,
    };
};