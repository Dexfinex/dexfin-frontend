import {useContext, useEffect, useMemo, useState} from 'react';
import {ArrowDownUp, ArrowRight, Clock, DollarSign} from 'lucide-react';
import {TokenSelector} from './TokenSelector';
import {SlippageOption, TokenType} from '../../../types/swap.type';
import {formatNumberByFrac, shrinkAddress} from '../../../utils/common.util';
import {Button, Skeleton} from '@chakra-ui/react';
import useTokenStore from "../../../store/useTokenStore.ts";
import useGetTokenPrices from "../../../hooks/useGetTokenPrices.ts";
import {mapChainId2ExplorerUrl, mapChainId2NativeAddress, mapChainId2Network} from "../../../config/networks.ts";
import {Web3AuthContext} from "../../../providers/Web3AuthContext.tsx";
import useJupiterQuote from "../../../hooks/useJupiterQuote.ts";
import {useSolanaBalance} from "../../../hooks/useSolanaBalance.tsx";
import {VersionedTransaction} from "@solana/web3.js";
import {connection} from "../../../config/solana.ts";
import {TransactionModal} from "../modals/TransactionModal.tsx";
import {SOLANA_CHAIN_ID} from "../../../constants/solana.constants.ts";
import {getUSDAmount} from "../../../utils/swap.util.ts";
import {DestinationAddressInputModal} from "../modals/DestinationAddressInputModal.tsx";

interface CrossChainSwapBoxProps {
    fromToken: TokenType | null;
    toToken: TokenType | null;
    fromAmount: string;
    toAmount: string;
    onFromTokenSelect: (token: TokenType) => void;
    onToTokenSelect: (token: TokenType) => void;
    onFromAmountChange: (amount: string) => void;
    onToAmountChange: (amount: string) => void;
    onSwitch: () => void;
    slippage: SlippageOption;
}

export function CrossChainSwapBox({
                                      fromToken,
                                      toToken,
                                      fromAmount,
                                      toAmount,
                                      onFromTokenSelect,
                                      onToTokenSelect,
                                      onFromAmountChange,
                                      onToAmountChange,
                                      onSwitch,
                                      slippage,
                                  }: CrossChainSwapBoxProps) {

    const [destinationAddress, setDestinationAddress] = useState<string>('');
    const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);
    const [txModalOpen, setTxModalOpen] = useState(false);
    const [transactionHash, setTransactionHash] = useState<string | undefined>(undefined);
    const [confirmationLoading, setConfirmationLoading] = useState(false);

    const {
        solanaWalletInfo,
        signSolanaTransaction,
    } = useContext(Web3AuthContext);

    const {getTokenPrice} = useTokenStore()
    const {
        isLoading: isQuoteLoading,
        data: quoteData,
    } = useJupiterQuote({
        sellToken: fromToken,
        buyToken: toToken,
        sellAmount: fromAmount,
        slippage,
    })

    const tokenChainId = fromToken ? fromToken.chainId : toToken!.chainId
    const nativeTokenAddress = mapChainId2NativeAddress[tokenChainId]
    useGetTokenPrices({
        tokenAddresses: [fromToken?.address ?? null, toToken?.address ?? null, nativeTokenAddress],
        chainId: tokenChainId,
    })

    const {
        isLoading: isFromBalanceLoading,
        // refetch: refetchFromBalance,
        data: fromBalance
    } = useSolanaBalance({mintAddress: fromToken?.address})

    const {
        isLoading: isToBalanceLoading,
        // refetch: refetchToBalance,
        data: toBalance
    } = useSolanaBalance({mintAddress: toToken?.address})

    const insufficientBalance =
        !isNaN(Number(fromBalance?.formatted)) ? Number(fromAmount) > Number(fromBalance?.formatted)
            : false;

    /*
        const insufficientNativeBalance =
            !isNaN(Number(fromBalance?.formatted)) ?  Number(fromAmount) > Number(fromBalance?.formatted)
                : false;
    */


    // console.log("gasData", mapPrices, gasData, isGasEstimationLoading)

    // Update toAmount when calculation changes
    useEffect(() => {
        if (quoteData) {
            onToAmountChange(quoteData.formattedOutputAmount);
        }
    }, [quoteData, onToAmountChange, toToken]);

    const {
        // nativeTokenPrice,
        fromUsdAmount,
        toUsdAmount,
        fromNetwork,
        toNetwork,
    } = useMemo(() => {
        const fromTokenPrice = fromToken ? getTokenPrice(fromToken?.address, fromToken?.chainId) : 0
        const toTokenPrice = toToken ? getTokenPrice(toToken?.address, toToken?.chainId) : 0
        const fromUsdAmount = fromToken ? getUSDAmount(fromToken, fromTokenPrice, fromAmount) : 0
        const toUsdAmount = toToken ? getUSDAmount(toToken, toTokenPrice, toAmount) : 0
        const fromNetwork = fromToken ? mapChainId2Network[fromToken.chainId] : null
        const toNetwork = toToken ? mapChainId2Network[toToken.chainId] : null

        return {
            fromUsdAmount,
            toUsdAmount,
            nativeTokenPrice: getTokenPrice(nativeTokenAddress, tokenChainId) ?? 0,
            toNetwork,
            fromNetwork,
        }
    }, [fromToken, getTokenPrice, toToken, fromAmount, toAmount, nativeTokenAddress, tokenChainId, quoteData])

    useEffect(() => {
        if (!txModalOpen) {
            setTransactionHash(undefined)
            onFromAmountChange?.('')
            onToAmountChange?.('')
        }
    }, [onFromAmountChange, onToAmountChange, txModalOpen])

    const handleSwap = async () => {
        try {
            setConfirmationLoading(true);
            // ----- I think we need it----------

            const {swapTransaction} = await (
                await fetch('https://quote-api.jup.ag/v6/swap', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        quoteResponse: quoteData,
                        userPublicKey: solanaWalletInfo?.publicKey,
                        asLegacyTransaction: false,
                        dynamicComputeUnitLimit: true,
                        prioritizationFeeLamports: 1, // "auto",
                        wrapAndUnwrapSol: true
                    })
                })
            ).json()

            // ----- ----------

            // Serialize the transaction
            const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
            const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
            const signedTransaction = await signSolanaTransaction(transaction)

            try {
                const txid = await connection.sendRawTransaction(signedTransaction!.serialize(), {
                    skipPreflight: false, // Set to true to skip validation checks
                    preflightCommitment: "confirmed",
                });

                console.log(`✅ Transaction Sent! TXID: ${txid}`);

                // 5️⃣ Confirm the transaction
                await connection.confirmTransaction(txid, "confirmed");
                console.log("✅ Transaction Confirmed!");

                setTransactionHash(txid)
                setTxModalOpen(true)
            } catch (error) {
                console.error("❌ Error Sending Transaction:", error);
            }

            setConfirmationLoading(false)

            // Sign the transaction
            // transaction.sign([wallet.payer]);
            /*
                        const solanaTransaction = new Transaction();
                        const { blockhash } = await connection.getLatestBlockhash();
                        solanaTransaction.recentBlockhash = blockhash;
                        solanaTransaction.feePayer = new PublicKey(solanaWalletInfo!.publicKey);
                        solanaTransaction.add(
                            SystemProgram.transfer({
                                fromPubkey: new PublicKey(solanaWalletInfo!.publicKey),
                                toPubkey: new PublicKey('9oTgsYFJVaitPEZh6Qku78DJKX8LQHa52XZB6kDY3noU'),
                                lamports: LAMPORTS_PER_SOL / 100, // Transfer 0.01 SOL
                            })
                        );
            */
            const sig = await signSolanaTransaction(transaction);
            console.log("sig", sig)

            /*
                        const signature = getSignature(transaction);
                        console.log(`https://solscan.io/tx/${signature}`);

                        // We first simulate whether the transaction would be successful
                        const { value: simulatedTransactionResponse } =
                            await connection.simulateTransaction(transaction, {
                                replaceRecentBlockhash: true,
                                commitment: "processed",
                            });
                        const { err, logs } = simulatedTransactionResponse;

                        if (err) {
                            // Simulation error, we can check the logs for more details
                            // If you are getting an invalid account error, make sure that you have the input mint account to actually swap from.
                            console.error("Simulation Error:", err);
                            console.error({ err, logs });
                            throw new Error("Simulation Error:");
                        }

                        const serializedTransaction = Buffer.from(transaction.serialize());
                        const blockhash = transaction.message.recentBlockhash;

                        const transactionResponse = await transactionSenderAndConfirmationWaiter({
                            connection,
                            serializedTransaction,
                            blockhashWithExpiryBlockHeight: {
                                blockhash,
                                lastValidBlockHeight: swapObj.lastValidBlockHeight,
                            },
                        });

                        // If we are not getting a response back, the transaction has not confirmed.
                        if (!transactionResponse) {
                            throw new Error('Transaction not confirmed');
                            // console.error("Transaction not confirmed");
                        }

                        if (transactionResponse.meta?.err) {
                            throw transactionResponse.meta?.err;
                            // console.error(transactionResponse.meta?.err);
                        }

                        console.log(`https://solscan.io/tx/${signature}`);
                        console.log('Transaction confirmed');
                        showSuccessMessage('Transaction Confirmed');
                        forceRefreshTokenBalance();
            */

        } catch (e: any) {
            console.log('Error', e);
        }
    }

    return (
        <div className="space-y-2.5">
            <TokenSelector
                className="relative z-20 mb-2"
                selectedToken={fromToken}
                selectedChainId={fromToken?.chainId ?? toToken?.chainId}
                onSelect={onFromTokenSelect}
                amount={fromAmount}
                usdAmount={fromUsdAmount.toString()}
                onAmountChange={onFromAmountChange}
                balance={fromBalance?.formatted}
                isBalanceLoading={isFromBalanceLoading}
                label="You sell"
            />
            <div className="relative h-8 flex items-center justify-center">
                <div className="z-30">
                    <button
                        onClick={onSwitch}
                        className="bg-[#1d2837] hover:bg-blue-500/20 p-2.5 rounded-xl border border-white/10 transition-all hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl hover:border-blue-500/20 text-blue-400"
                    >
                        <ArrowDownUp className="w-4 h-4"/>
                    </button>
                </div>
            </div>

            <TokenSelector
                className="relative z-10"
                selectedToken={toToken}
                selectedChainId={fromToken?.chainId ?? toToken?.chainId}
                onSelect={onToTokenSelect}
                amount={toAmount}
                usdAmount={toUsdAmount.toString()}
                onAmountChange={() => {
                }} // Disabled for now - only calculate based on fromAmount
                label="You buy"
                disabled={true}
                isLoading={isQuoteLoading}
                balance={toBalance?.formatted}
                isBalanceLoading={isToBalanceLoading}
            />

            <div
                className="rounded-xl p-4 mb-4 cursor-pointer border border-white/5 hover:border-blue-500/20 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(59,130,246,0.15)]"
                onClick={() => setIsAddressModalOpen(true)}
            >
                <div className="flex justify-between mb-2">
                    <span
                        className="text-blue-400/90 text-[10px] font-semibold tracking-wider uppercase bg-blue-500/10 px-2 py-0.5 rounded-md">Destination Address</span>
                </div>
                <div className="flex items-center">
                    {(destinationAddress && toNetwork) ? (
                        <>
                            <img src={toNetwork.icon} alt={toNetwork.name} className="w-6 h-6 mr-2"/>
                            <span className="font-medium">
                                {shrinkAddress(destinationAddress)}
                            </span>
                        </>
                    ) : (
                        <span className="text-gray-400">Click to enter Address</span>
                    )}
                </div>
            </div>

            {
                (fromNetwork && toNetwork) && (
                    <div
                        className={`rounded-xl p-4 border border-blue-500`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div
                                className="bg-blue-500 text-xs font-medium text-white px-2 py-1 rounded-full inline-block mb-2">
                                Best Route
                            </div>
                            <div className="flex items-center">
                                <img src={fromNetwork.icon} alt={fromNetwork.name} className="w-5 h-5"/>
                                <ArrowRight size={14} className="mx-1 text-gray-400"/>
                                <img src={toNetwork.icon} alt={toNetwork.name}
                                     className="w-5 h-5"/>
                                <span className="ml-2 text-sm">{'birdgeName'}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-400">You receive: 0.998 USDC</span>
                        </div>

                        <div className="flex justify-between text-xs text-gray-400">
                            <div className="flex items-center">
                                <Clock size={12} className="mr-1"/>
                                <span>{'estimated time'}</span>
                            </div>
                            <div className="flex items-center">
                                <DollarSign size={12} className="mr-1"/>
                                <span>Fee: {'fee'}</span>
                            </div>
                        </div>
                    </div>
                )
            }


            {fromToken && toToken && fromAmount && Number(fromAmount) > 0 && (
                <div className="space-y-2.5 mt-4">
                    {/* Exchange Rate */}
                    <div
                        className="px-4 py-3 text-sm bg-[#1d2837]/20 rounded-lg border border-white/5 hover:border-blue-500/20 transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400">Exchange Rate</span>
                            {
                                isQuoteLoading ? (
                                    <Skeleton startColor="#444" endColor="#1d2837" w={'7rem'} h={'1rem'}></Skeleton>
                                ) : (
                                    <span className="text-white font-mono">
                                        1 {fromToken?.symbol} = {formatNumberByFrac(Number(quoteData?.exchangeRate), 2)} {toToken?.symbol}
                                    </span>
                                )
                            }
                        </div>
                    </div>
                </div>
            )}

            {/*
            {
                error && (
                    <Alert status="error" variant="subtle" bg={'#511414'} borderRadius="md">
                        <AlertIcon/>
                        <Text>Error: {(error as BaseError).shortMessage || error.message}</Text>
                    </Alert>
                )
            }
*/}

            {
                !solanaWalletInfo ? (
                    <Button
                        width="full"
                        colorScheme="blue"
                        onClick={() => {
                        }}
                        isDisabled={true}
                    >
                        Please Use Embedded Wallet
                    </Button>
                ) : (
                    insufficientBalance ? (
                        <Button
                            width="full"
                            colorScheme="blue"
                            isDisabled={true}
                        >
                            Insufficient Balance
                        </Button>
                    ) : (
                        <Button
                            isLoading={confirmationLoading || isQuoteLoading}
                            loadingText={confirmationLoading ? 'Confirming...' : 'Computing...'}
                            width="full"
                            colorScheme="blue"
                            onClick={handleSwap}
                            isDisabled={!(Number(fromAmount) > 0) || confirmationLoading || isQuoteLoading}
                        >
                            Swap
                        </Button>
                    )
                )
            }
            {
                (toNetwork && isAddressModalOpen) && (
                    <DestinationAddressInputModal
                        open={isAddressModalOpen}
                        setOpen={setIsAddressModalOpen}
                        destinationNetwork={toNetwork}
                        address={destinationAddress}
                        setAddress={setDestinationAddress}
                    />
                )
            }
            <TransactionModal open={txModalOpen} setOpen={setTxModalOpen}
                              link={`${mapChainId2ExplorerUrl[SOLANA_CHAIN_ID]}/tx/${transactionHash}`}/>
        </div>
    )
        ;
}