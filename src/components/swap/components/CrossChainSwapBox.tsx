import {useContext, useEffect, useMemo, useState} from 'react';
import {ArrowDownUp, Info} from 'lucide-react';
import {TokenSelector} from './TokenSelector';
import {SlippageOption, TokenType} from '../../../types/swap.type';
import {formatNumberByFrac} from '../../../utils/common.util';
import {Button, Flex, Skeleton} from '@chakra-ui/react';
import {ZEROX_AFFILIATE_FEE} from "../../../constants";
import useTokenStore from "../../../store/useTokenStore.ts";
import useGetTokenPrices from "../../../hooks/useGetTokenPrices.ts";
import {mapChainId2ExplorerUrl, mapChainId2NativeAddress} from "../../../config/networks.ts";
import {Web3AuthContext} from "../../../providers/Web3AuthContext.tsx";
import useJupiterQuote from "../../../hooks/useJupiterQuote.ts";
import {useSolanaBalance} from "../../../hooks/useSolanaBalance.tsx";
import {VersionedTransaction} from "@solana/web3.js";
import {connection} from "../../../config/solana.ts";
import {TransactionModal} from "../modals/TransactionModal.tsx";
import {SOLANA_CHAIN_ID} from "../../../constants/solana.constants.ts";
import {getUSDAmount} from "../../../utils/swap.util.ts";

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

interface PreviewDetailItemProps {
    title: string;
    info: string;
    value: string;
    valueClassName?: string;
    isFree?: boolean;
    isLoading: boolean;
}

const PreviewDetailItem = ({
                               title,
                               info,
                               value,
                               valueClassName,
                               isFree,
                               isLoading,
                           }: PreviewDetailItemProps) => {
    return (
        <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1">
                <span className="text-gray-400">{title}</span>
                <div className="group relative">
                    <Info className="w-3.5 h-3.5 text-gray-500"/>
                    <div
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black/90 text-xs text-gray-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {info}
                    </div>
                </div>
            </div>
            {
                isLoading ? (
                    <Skeleton startColor="#444" endColor="#1d2837" w={'4rem'} h={'1rem'}></Skeleton>
                ) : isFree ? (
                    <Flex gap={2}>
                        <span className={'text-green-500'}>Free!</span>
                        <span
                            className={(valueClassName ? valueClassName : "text-white") + ' line-through'}>{value}</span>
                    </Flex>
                ) : (
                    <span className={valueClassName ? valueClassName : "text-white"}>{value}</span>
                )
            }
        </div>
    )
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
        affiliateFeeUsdAmount,
        priceImpact,
    } = useMemo(() => {
        const fromTokenPrice = fromToken ? getTokenPrice(fromToken?.address, fromToken?.chainId) : 0
        const toTokenPrice = toToken ? getTokenPrice(toToken?.address, toToken?.chainId) : 0
        const fromUsdAmount = fromToken ? getUSDAmount(fromToken, fromTokenPrice, fromAmount) : 0
        const toUsdAmount = toToken ? getUSDAmount(toToken, toTokenPrice, toAmount) : 0
        const affiliateFeeUsdAmount = quoteData?.affiliateFee ? quoteData?.affiliateFee * toTokenPrice : 0
        const priceImpact = fromUsdAmount > 0 ? ((toUsdAmount - fromUsdAmount) / fromUsdAmount) * 100 : 0

        return {
            fromUsdAmount,
            toUsdAmount,
            priceImpact,
            affiliateFeeUsdAmount,
            nativeTokenPrice: getTokenPrice(nativeTokenAddress, tokenChainId) ?? 0
        }
    }, [fromToken, getTokenPrice, toToken, fromAmount, toAmount, nativeTokenAddress, tokenChainId, quoteData])

    const {
        buyTaxPercentage,
        buyTaxUsdAmount,
        sellTaxPercentage,
        sellTaxUsdAmount,
    } = useMemo(() => {
        const buyTaxPercentage = quoteData?.buyTax ? formatNumberByFrac(quoteData?.buyTax, 2) : 0
        const buyTaxUsdAmount = quoteData?.buyTax ? formatNumberByFrac(quoteData?.buyTax * toUsdAmount / 100, 2) : 0
        const sellTaxPercentage = quoteData?.sellTax ? formatNumberByFrac(quoteData?.sellTax, 2) : 0
        const sellTaxUsdAmount = quoteData?.sellTax ? formatNumberByFrac(quoteData?.sellTax * fromUsdAmount / 100, 2) : 0

        return {
            buyTaxPercentage,
            buyTaxUsdAmount,
            sellTaxPercentage,
            sellTaxUsdAmount,
        }
    }, [quoteData, toUsdAmount, fromUsdAmount])

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

                        {/* Price Impact */}
                        <PreviewDetailItem
                            title={'Price Impact'}
                            info={'The difference between market price and estimated price due to trade size'}
                            value={`${formatNumberByFrac(priceImpact, 2)}%`}
                            valueClassName={`${
                                priceImpact < -5
                                    ? 'text-red-500'
                                    : priceImpact < -3
                                        ? 'text-yellow-500'
                                        : 'text-green-500'
                            }`}
                            isLoading={isQuoteLoading}
                        />

                        {/* Affiliate Fee */}
                        {
                            quoteData?.affiliateFee && (
                                <PreviewDetailItem
                                    title={`Affiliate Fee (${ZEROX_AFFILIATE_FEE / 100}%)`}
                                    info={'A small percentage of the transaction fee shared with affiliates who bring users to the platform'}
                                    value={`$${formatNumberByFrac(affiliateFeeUsdAmount, 2)}`}
                                    isLoading={isQuoteLoading}
                                />
                            )
                        }
                        {/* Sell Tax */}
                        {
                            quoteData?.sellTax && (
                                <PreviewDetailItem
                                    title={`Sell Fee (${sellTaxPercentage}%)`}
                                    info={`${fromToken?.symbol} charges a ${sellTaxPercentage}% fee when bought. Swapping it may result in a loss of funds. Dexfin does not receive any of these fees.`}
                                    value={`$${sellTaxUsdAmount}`}
                                    isLoading={isQuoteLoading}
                                />
                            )
                        }
                        {/* Buy Tax */}
                        {
                            quoteData?.buyTax && (
                                <PreviewDetailItem
                                    title={`Buy Fee (${buyTaxPercentage}%)`}
                                    info={`${toToken?.symbol} charges a ${buyTaxPercentage}% fee when bought. Swapping it may result in a loss of funds. Dexfin does not receive any of these fees.`}
                                    value={`$${buyTaxUsdAmount}`}
                                    isLoading={isQuoteLoading}
                                />
                            )
                        }

                        {/* Network Fee */}
                        <PreviewDetailItem
                            title={'Network Fee'}
                            info={'Estimated network fees for processing the transaction'}
                            value={`0.00000 SOL`}
                            isLoading={false}
                        />

                        {/* slippage */}
                        <PreviewDetailItem
                            title={'Max. slippage'}
                            info={'Allowable difference between the expected and executed prices of a trade. Your transaction will revert if price changes unfavorably by more than this percentage'}
                            value={`${slippage}%`}
                            isLoading={false}
                        />
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
                <TransactionModal open={txModalOpen} setOpen={setTxModalOpen}
                                  link={`${mapChainId2ExplorerUrl[SOLANA_CHAIN_ID]}/tx/${transactionHash}`}/>
            }
        </div>
    )
        ;
}