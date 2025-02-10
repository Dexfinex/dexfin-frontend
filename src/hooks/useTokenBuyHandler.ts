import { useContext, useState } from 'react';
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { Web3AuthContext } from "../providers/Web3AuthContext";
import { TokenType } from "../types/swap.type";
import { nativeAddress } from '../constants';
import { zeroxService } from "../services/0x.service";
import { ethers } from 'ethers';
import { coingeckoService } from "../services/coingecko.service";

export const useTokenBuyHandler = () => {
    const [error, setError] = useState<Error | null>(null);
    const [txHash, setTxHash] = useState<string | null>(null);
    const { address: walletAddress, provider } = useContext(Web3AuthContext);
    const SLIPPAGE_TOLERANCE = 0.005; // 0.5%

    const {
        data: hash,
        isPending,
        sendTransaction,
        sendTransactionAsync
    } = useSendTransaction();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: hash as `0x${string}`,
    });

    const getEthPrice = async (): Promise<number> => {
        try {
            console.log("Fetching ETH price...");
            const ethPrices = await coingeckoService.getTokenPrices(1, [nativeAddress]);
            const ethPrice = ethPrices[nativeAddress];
            if (!ethPrice) throw new Error('Failed to fetch ETH price');
            // console.log('ETH price:', ethPrice);
            return parseFloat(ethPrice);
        } catch (error) {
            console.error('ETH price fetch failed:', error);
            throw error;
        }
    };

    const executeBatchBuy = async (tokens: { token: TokenType, amount: string }[]) => {
        if (!tokens.length || !walletAddress) {
            throw new Error('Missing required parameters');
        }

        console.log("Starting batch buy for tokens:", tokens);

        let currentIndex = 0;

        while (currentIndex < tokens.length) {
            console.log(`Processing token ${currentIndex + 1} of ${tokens.length}`);

            try {
                // Get current gas price
                const gasPrice = await provider?.getGasPrice();
                if (!gasPrice) throw new Error('Could not get gas price');

                // Get ETH price
                const ETH_PRICE_USD = await getEthPrice();
                // console.log("ETH_PRICE_USD:", ETH_PRICE_USD);

                // Calculate amounts for current token
                const currentToken = tokens[currentIndex];
                const tokenQuantity = parseFloat(currentToken.amount);
                const tokenPriceInUSD = currentToken.token.price || 0;
                const totalCostInUSD = tokenPriceInUSD * tokenQuantity;
                const totalCostWithSlippage = totalCostInUSD * (1 + SLIPPAGE_TOLERANCE);
                const ethAmount = (totalCostWithSlippage / ETH_PRICE_USD).toFixed(18);
                const sellTokenAmount = ethers.utils.parseEther(ethAmount).toString();

                // console.log(`Sell token amount in Wei for token ${currentIndex}:`, sellTokenAmount);

                // Get quote from 0x API
                const quoteParams = {
                    chainId: 8453,
                    buyTokenAddress: currentToken.token.address,
                    sellTokenAddress: nativeAddress,
                    sellTokenAmount: sellTokenAmount,
                    takerAddress: walletAddress,
                };

                // console.log("Requesting quote with params:", quoteParams);
                const quoteResponse = await zeroxService.getQuote(quoteParams);

                if (!quoteResponse?.transaction) {
                    throw new Error(`Invalid quote response for token ${currentIndex}`);
                }

                // console.log(`Quote received for token ${currentIndex}:`, quoteResponse);

                const transaction = quoteResponse.transaction;
                const gasLimit = BigInt(transaction.gas || '400000');
                const gasCost = gasLimit * gasPrice.toBigInt();

                // Check balance
                const balance = await provider?.getBalance(walletAddress);
                if (!balance) throw new Error('Could not fetch balance');

                const totalCost = BigInt(transaction.value || '0') + gasCost;
                if (balance.lt(totalCost)) {
                    const userBalance = ethers.utils.formatEther(balance);
                    const requiredAmount = ethers.utils.formatEther(totalCost);
                    throw new Error(`Insufficient ETH balance for token ${currentIndex}. Have ${userBalance} ETH, need ${requiredAmount} ETH`);
                }

                // Send transaction
                // console.log(`Sending transaction for token ${currentIndex}...`);
                const txHash = await sendTransactionAsync({
                    account: walletAddress as `0x${string}`,
                    to: transaction.to as `0x${string}`,
                    data: transaction.data as `0x${string}`,
                    value: BigInt(transaction.value || '0'),
                    gas: gasLimit,
                    maxFeePerGas: gasPrice.toBigInt(),
                    chainId: 8453,
                })

                console.log({ txHash });

                currentIndex++;
                return txHash;
            } catch (err) {
                console.error(`Buy execution failed for token ${currentIndex}:`, err);
                const errorMessage = err instanceof Error ?
                    err.message :
                    'Transaction failed - Please ensure you have enough ETH for gas fees';
                setError(new Error(`Token ${currentIndex}: ${errorMessage}`));
                throw err;
            }
        }

        console.log("Batch buy completed successfully");
    };

    return {
        executeBatchBuy,
        error,
        txHash,
        isLoading: isPending || isConfirming,
        isConfirmed,
        isPending,
    };
};