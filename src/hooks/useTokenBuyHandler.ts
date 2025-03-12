import { useContext, useState, useEffect } from 'react';
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { Web3AuthContext } from "../providers/Web3AuthContext";
import { TokenTypeB } from "../types/cart.type";
import { nativeAddress } from '../constants';
import { zeroxService } from "../services/0x.service";
import { ethers } from 'ethers';
import { coingeckoService } from "../services/coingecko.service";
import { WalletTypeEnum } from '../types/wallet';
import { concat, Hex, numberToHex, size } from "viem";

export const useTokenBuyHandler = () => {
    const [error, setError] = useState<Error | null>(null);
    const [txHashes, setTxHashes] = useState<string[]>([]);
    const [currentTxHash, setCurrentTxHash] = useState<string | null>(null);
    
    const { 
        address: walletAddress, 
        provider, 
        chainId: walletChainId,
        walletClient,
        kernelAccount,
        signer,
        walletType,
        currentAccount,
        authMethod,
        initSession
    } = useContext(Web3AuthContext);
    
    const SLIPPAGE_TOLERANCE = 0.005; // 0.5%

    const {
        isPending,
        sendTransactionAsync
    } = useSendTransaction();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: currentTxHash as `0x${string}`,
        enabled: !!currentTxHash
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
            setError(new Error('Missing required parameters'));
            return false;
        }

        // Determine wallet type for gasless transactions
        const isEmbeddedWallet = walletType === WalletTypeEnum.EMBEDDED;
        console.log("Using wallet type:", walletType);
        console.log("Is embedded wallet:", isEmbeddedWallet);

        const completedTxHashes: string[] = [];
        setTxHashes([]);
        
        try {
            // If using embedded wallet, try to refresh the session
            if (isEmbeddedWallet && authMethod && currentAccount) {
                try {
                    console.log("Refreshing session before executing batch buy");
                    await initSession(authMethod, currentAccount);
                    console.log("Session refreshed successfully");
                } catch (refreshError) {
                    console.warn("Session refresh failed, attempting transaction anyway:", refreshError);
                }
            }
            
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

                // Set isGasLess parameter based on wallet type
                const quoteParams = {
                    chainId: walletChainId || 8453,
                    buyTokenAddress: currentToken.token.address,
                    sellTokenAddress: nativeAddress,
                    sellTokenAmount: sellTokenAmount,
                    takerAddress: walletAddress,
                    isGasLess: !isEmbeddedWallet // Set to true for embedded wallets
                };

                console.log(`Requesting quote for token ${i + 1} with isGasLess:`, quoteParams);
                const quoteResponse = await zeroxService.getQuote(quoteParams);

                if (!quoteResponse?.transaction) {
                    throw new Error(`Invalid quote response for token ${i + 1}`);
                }

                const transaction = quoteResponse.transaction;

                // Check balance only for non-embedded wallets
                if (!isEmbeddedWallet) {
                    const gasLimit = BigInt(transaction.gas || '400000');
                    const gasCost = gasLimit * gasPrice.toBigInt();
                    const balance = await provider?.getBalance(walletAddress);
                    
                    if (!balance) throw new Error('Could not fetch balance');

                    const totalCost = BigInt(transaction.value || '0') + gasCost;
                    if (balance.lt(totalCost)) {
                        const userBalance = ethers.utils.formatEther(balance);
                        const requiredAmount = ethers.utils.formatEther(totalCost);
                        throw new Error(`Insufficient ETH balance for token ${i + 1}. Have ${userBalance} ETH, need ${requiredAmount} ETH`);
                    }
                }

                let txHash = '';

                // Handle permit2 signing similar to swap
                if (quoteResponse.permit2?.eip712) {
                    let signature: Hex | undefined;
                    
                    try {
                        if (isEmbeddedWallet && kernelAccount) {
                            // For embedded wallets
                            signature = await kernelAccount.signTypedData(quoteResponse.permit2.eip712);
                        } else if (walletClient) {
                            // For EOA wallets
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-expect-error
                            signature = await walletClient.signTypedData(quoteResponse.permit2.eip712);
                        }
                        console.log("Signed permit2 message");
                    } catch (error) {
                        console.error("Error signing permit2:", error);
                        throw new Error("Failed to sign the transaction");
                    }

                    // Append signature to calldata
                    if (signature && transaction.data) {
                        const signatureLengthInHex = numberToHex(size(signature), {
                            signed: false,
                            size: 32,
                        });

                        const transactionData = transaction.data as Hex;
                        const sigLengthHex = signatureLengthInHex as Hex;
                        const sig = signature as Hex;

                        transaction.data = concat([
                            transactionData,
                            sigLengthHex,
                            sig,
                        ]);
                    }
                }

                // Submit the transaction with the appropriate method
                if (isEmbeddedWallet && signer) {
                    console.log("Using embedded wallet signer for transaction");
                    try {
                        const tx = await signer.sendTransaction({
                            gasLimit: transaction.gas ? BigInt(transaction.gas) : undefined,
                            to: transaction.to,
                            data: transaction.data,
                            value: transaction.value ? BigInt(transaction.value) : undefined,
                        });
                        
                        txHash = tx.hash;
                        const receipt = await tx.wait();
                        
                        if (!receipt.status) {
                            throw new Error(`Transaction failed for token ${i + 1}`);
                        }
                    } catch (txError: any) {
                        // If we get a session error, try to refresh the session one more time
                        if (txError.message && txError.message.includes('Invalid sessionSigs') && authMethod && currentAccount) {
                            console.log("Session expired during transaction, refreshing and retrying");
                            await initSession(authMethod, currentAccount);
                            
                            // Retry the transaction with refreshed session
                            const tx = await signer.sendTransaction({
                                gasLimit: transaction.gas ? BigInt(transaction.gas) : undefined,
                                to: transaction.to,
                                data: transaction.data,
                                value: transaction.value ? BigInt(transaction.value) : undefined,
                            });
                            
                            txHash = tx.hash;
                            const receipt = await tx.wait();
                            
                            if (!receipt.status) {
                                throw new Error(`Transaction failed for token ${i + 1}`);
                            }
                        } else {
                            throw txError;
                        }
                    }
                } else {
                    // For EOA wallets
                    console.log("Using EOA wallet for transaction");
                    txHash = await sendTransactionAsync({
                        account: walletAddress as `0x${string}`,
                        to: transaction.to as `0x${string}`,
                        data: transaction.data as `0x${string}`,
                        value: BigInt(transaction.value || '0'),
                        gas: BigInt(transaction.gas || '400000'),
                        maxFeePerGas: gasPrice.toBigInt(),
                        chainId: walletChainId || 8453,
                    });
                    
                    // Wait for transaction confirmation
                    await provider?.waitForTransaction(txHash);
                }

                console.log(`Transaction ${i + 1} hash:`, txHash);
                completedTxHashes.push(txHash);
                setCurrentTxHash(txHash);
                setTxHashes(prevHashes => [...prevHashes, txHash]);
            }

            console.log("All transactions completed:", completedTxHashes);
            return true;
        } catch (err) {
            console.error('Batch buy execution failed:', err);
            const errorMessage = err instanceof Error ?
                err.message :
                'Transaction failed - Please ensure you have enough ETH for gas fees';
            setError(new Error(errorMessage));
            return false;
        }
    };

    return {
        executeBatchBuy,
        error,
        txHash: currentTxHash,
        txHashes,
        isLoading: isPending || isConfirming,
        isConfirmed,
        isPending,
    };
};