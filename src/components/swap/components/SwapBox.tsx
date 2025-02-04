import {useContext, useEffect, useMemo, useState} from 'react';
import {ArrowDownUp, Info} from 'lucide-react';
import {TokenSelector} from './TokenSelector';
import {SlippageOption, TokenType} from '../../../types/swap.type';
import {formatNumberByFrac} from '../../../utils/common.util';
import {Alert, AlertIcon, Button, Skeleton, Text} from '@chakra-ui/react';
import {ZEROX_AFFILIATE_FEE} from "../../../constants";
import useTokenStore from "../../../store/useTokenStore.ts";
import use0xQuote from "../../../hooks/use0xQuote.ts";
import useGetTokenPrices from "../../../hooks/useGetTokenPrices.ts";
import useGasEstimation from "../../../hooks/useGasEstimation.ts";
import {mapChainId2ChainName, mapChainId2ExplorerUrl, mapChainId2NativeAddress} from "../../../config/networks.ts";
import {Web3AuthContext} from "../../../providers/Web3AuthContext.tsx";
import {useBalance} from "../../../hooks/useBalance.tsx";
import {useTokenApprove} from "../../../hooks/useTokenApprove.ts";
import {ethers} from "ethers";
import {useSendTransaction, useSignTypedData, useWaitForTransactionReceipt} from "wagmi";
import {BaseError, concat, Hex, numberToHex, size} from "viem";
import {TransactionModal} from "../modals/TransactionModal.tsx";

interface SwapBoxProps {
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
    isLoading: boolean;
}

const getUSDAmount = (selectedToken: TokenType | undefined, price: number, amount: string): number => {
    if (selectedToken) {
        const numAmount = Number(amount)
        return price * numAmount
    }
    return 0
}

const PreviewDetailItem = ({
                               title,
                               info,
                               value,
                               valueClassName,
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
                ) : (
                    <span className={valueClassName ? valueClassName : "text-white"}>{value}</span>
                )
            }
        </div>
    )
}

export function SwapBox({
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
                        }: SwapBoxProps) {

    const [txModalOpen, setTxModalOpen] = useState(false);

    const {
        address: walletAddress,
        chainId: walletChainId,
        isConnected,
        login,
        switchChain,
    } = useContext(Web3AuthContext);

    const {getTokenPrice} = useTokenStore()
    const {
        isLoading: isQuoteLoading,
        quoteResponse,
        // refetch,
        data: quoteData,
    } = use0xQuote({
        sellToken: fromToken,
        buyToken: toToken,
        sellAmount: fromAmount
    })

    const tokenChainId = fromToken ? fromToken.chainId : toToken!.chainId
    const nativeTokenAddress = mapChainId2NativeAddress[tokenChainId]
    useGetTokenPrices({
        tokenAddresses: [fromToken?.address ?? null, toToken?.address ?? null, nativeTokenAddress],
        chainId: tokenChainId,
    })

    const {
        isLoading: isGasEstimationLoading,
        data: gasData
    } = useGasEstimation()

    const {
        isLoading: isFromBalanceLoading,
        refetch: refetchFromBalance,
        data: fromBalance
    } = useBalance({chainId: fromToken?.chainId, token: fromToken?.address})

    const {
        isLoading: isToBalanceLoading,
        refetch: refetchToBalance,
        data: toBalance
    } = useBalance({chainId: toToken?.chainId, token: toToken?.address})

    const amountToApprove =
        fromToken && fromAmount !== ''
            ? ethers.BigNumber.from(ethers.utils.parseUnits(fromAmount, fromToken!.decimals))
                .mul(100 + Number(slippage) * 2)
                .div(100)
                .toString()
            : '0';

    const {
        approve,
        isLoading: isApproveLoading,
    } = useTokenApprove({
        token: fromToken?.address as `0x${string}`,
        spender: quoteData?.spenderAddress as `0x${string}`,
        amount: amountToApprove,
        chainId: tokenChainId
    });

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
            onToAmountChange(quoteData.buyAmount.toString());
        }
    }, [quoteData, onToAmountChange]);

    const {
        nativeTokenPrice,
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
        isRequireSwitchChain,
        textSwitchChain,
    } = useMemo(() => {
        const isRequireSwitchChain = walletChainId !== tokenChainId
        const textSwitchChain = `Switch to ${mapChainId2ChainName[tokenChainId]} network`

        return {
            isRequireSwitchChain,
            textSwitchChain
        }
    }, [tokenChainId, walletChainId])

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


    const {
        data: hash,
        isPending,
        error,
        sendTransaction,
    } = useSendTransaction();
    const {signTypedDataAsync} = useSignTypedData();

    const {isLoading: isConfirming, isSuccess: isConfirmed} =
        useWaitForTransactionReceipt({
            hash,
        });

    // console.log("isPending", isPending, hash, isConfirming, isConfirmed)

    useEffect(() => {
        if (isConfirmed) {
            setTxModalOpen(true)
            refetchFromBalance()
            refetchToBalance()
        }
    }, [isConfirmed])

    const handleSwap = async () => {
        console.log("submitting quote to blockchain");
        console.log("to", quoteResponse.transaction.to);
        console.log("value", quoteResponse.transaction.value);

        // On click, (1) Sign the Permit2 EIP-712 message returned from quote
        if (quoteResponse.permit2?.eip712) {
            let signature: Hex | undefined;
            try {
                signature = await signTypedDataAsync(quoteResponse.permit2.eip712);
                console.log("Signed permit2 message from quote response");
            } catch (error) {
                console.error("Error signing permit2 coupon:", error);
            }

            // (2) Append signature length and signature data to calldata

            if (signature && quoteResponse?.transaction?.data) {
                const signatureLengthInHex = numberToHex(size(signature), {
                    signed: false,
                    size: 32,
                });

                const transactionData = quoteResponse.transaction.data as Hex;
                const sigLengthHex = signatureLengthInHex as Hex;
                const sig = signature as Hex;

                quoteResponse.transaction.data = concat([
                    transactionData,
                    sigLengthHex,
                    sig,
                ]);
            } else {
                throw new Error("Failed to obtain signature or transaction data");
            }
        }

        // (3) Submit the transaction with Permit2 signature

        sendTransaction({
            account: walletAddress as `0x${string}`,
            gas: quoteResponse?.transaction.gas
                ? BigInt(quoteResponse?.transaction.gas)
                : undefined,
            to: quoteResponse?.transaction.to,
            data: quoteResponse.transaction.data, // submit
            value: quoteResponse?.transaction.value
                ? BigInt(quoteResponse.transaction.value)
                : undefined, // value is used for native tokens
            chainId: walletChainId,
        });
    }

    return (
        <div className="space-y-2.5">
            <TokenSelector
                className="relative z-20 mb-2"
                selectedToken={fromToken}
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
                            value={`$${formatNumberByFrac(nativeTokenPrice * gasData.gasEstimate, 2)}`}
                            isLoading={isGasEstimationLoading}
                        />

                        {/* slippage */}
                        <PreviewDetailItem
                            title={'Max. slippage'}
                            info={'Allowable difference between the expected and executed prices of a trade. Your transaction will revert if price changes unfavorably by more than this percentage'}
                            value={`${slippage}%`}
                            isLoading={false}
                        />

                        {/* Route */}
                        {
                            fromToken && toToken && (
                                <>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-1">
                                            <span className="text-gray-400">Route</span>
                                            <div className="group relative">
                                                <Info className="w-3.5 h-3.5 text-gray-500"/>
                                                <div
                                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black/90 text-xs text-gray-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                    Trading route for best price execution
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <img src={fromToken?.logoURI} alt={fromToken?.symbol}
                                             className="w-5 h-5 rounded-full"/>
                                        <div className="text-xs px-2 py-1 bg-white/10 rounded-md text-gray-300">0.2%</div>
                                        <div className="flex-1 border-t border-dashed border-gray-600"/>
                                        <img src={toToken?.logoURI} alt={toToken?.symbol} className="w-5 h-5 rounded-full"/>
                                    </div>
                                </>
                            )
                        }
                    </div>
                </div>
            )}

            {
                error && (
                    <Alert status="error" variant="subtle" bg={'#511414'} borderRadius="md">
                        <AlertIcon/>
                        <Text>Error: {(error as BaseError).shortMessage || error.message}</Text>
                    </Alert>
                )
            }

            {
                !isConnected ? (
                    <Button
                        isLoading={false}
                        loadingText={'Connecting Wallet...'}
                        width="full"
                        colorScheme="blue"
                        onClick={() => {
                            login()
                            // if (approveReset) approveReset();
                        }}
                        isDisabled={false}
                    >
                        Connect Wallet
                    </Button>
                ) : (
                    isRequireSwitchChain ? (
                        <Button
                            isLoading={false}
                            loadingText={'Changing Network...'}
                            width="full"
                            colorScheme="blue"
                            onClick={() => {
                                switchChain(tokenChainId)
                                // if (approveReset) approveReset();
                            }}
                            isDisabled={false}
                        >
                            {textSwitchChain}
                        </Button>
                    ) : (
                        quoteData?.isNeedApproving ? (
                                <Button
                                    isLoading={isApproveLoading}
                                    loadingText={'Approving...'}
                                    width="full"
                                    colorScheme="blue"
                                    onClick={() => {
                                        approve?.()
                                    }}
                                    isDisabled={false}
                                >
                                    Approve {fromToken?.symbol}
                                </Button>
                            )
                            :
                            (
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
                                        isLoading={isPending || isConfirming}
                                        loadingText={isPending ? 'Confirming...' : isConfirming ? 'Waiting for confirmation...' : ''}
                                        width="full"
                                        colorScheme="blue"
                                        onClick={handleSwap}
                                        isDisabled={!(Number(fromAmount) > 0) || isPending || isConfirming}
                                    >
                                        Swap
                                    </Button>

                                )
                            )
                    )
                )
            }

            {/*
            <button
                className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-xl transition-colors"
                onClick={onSwap}
                disabled={!fromAmount || !toAmount}
            >
                Swap
            </button>
*/
            }
            {
                isConfirmed && (
                    <TransactionModal open={txModalOpen} setOpen={setTxModalOpen}
                                      link={`${mapChainId2ExplorerUrl[walletChainId!]}/tx/${hash}`}/>
                )
            }
        </div>
    )
        ;
}