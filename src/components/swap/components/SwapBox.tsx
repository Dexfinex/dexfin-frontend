import {useContext, useEffect, useMemo, useState} from 'react';
import {ArrowDownUp, Info, PencilLine} from 'lucide-react';
import {TokenSelector} from './TokenSelector';
import {
    GaslessQuoteResponse,
    PreviewDetailItemProps,
    QuoteResponse,
    SlippageOption,
    TokenType
} from '../../../types/swap.type';
import {formatNumberByFrac} from '../../../utils/common.util';
import {Button, Flex, Skeleton} from '@chakra-ui/react';
import {ZEROX_AFFILIATE_FEE} from "../../../constants";
import useTokenStore from "../../../store/useTokenStore.ts";
import use0xQuote from "../../../hooks/use0xQuote.ts";
import useGetTokenPrices from "../../../hooks/useGetTokenPrices.ts";
import useGasEstimation from "../../../hooks/useGasEstimation.ts";
import {mapChainId2ChainName, mapChainId2ExplorerUrl, mapChainId2NativeAddress} from "../../../config/networks.ts";
import {Web3AuthContext} from "../../../providers/Web3AuthContext.tsx";
import {useBalance} from "../../../hooks/useBalance.tsx";
import {ethers} from "ethers";
import {concat, Hex, numberToHex, size} from "viem";
import {TransactionModal} from "../modals/TransactionModal.tsx";
import {use0xTokenApprove} from "../../../hooks/use0xTokenApprove.ts";
import {zeroxService} from "../../../services/0x.service.ts";
import use0xGaslessSwapStatus from "../../../hooks/use0xGaslessSwapStatus.ts";
import {getSlippageBigNumber, signTradeObject, tradeSplitSigDataToSubmit} from "../../../utils/swap.util.ts";
import {WalletTypeEnum} from "../../../types/wallet.type.ts";
import {SlippageDialog} from "../SlippageSettings.tsx";

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
}

const getUSDAmount = (selectedToken: TokenType | undefined, price: number, amount: string): number => {
    if (selectedToken) {
        const numAmount = Number(amount)
        return price * numAmount
    }
    return 0
}

export const PreviewDetailItem = ({
                                      title,
                                      info,
                                      value,
                                      valueClassName,
                                      isFree,
                                      isLoading,
                                      isSlippageItem,
                                      openDialog,
                                  }: PreviewDetailItemProps) => {
    return (
        <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
                <span className="text-gray-400">{title}</span>
                <div className="group relative">
                    <Info className="peer w-3.5 h-3.5 text-gray-500 cursor-pointer"/>
                    <div
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black/90 text-xs text-gray-300 rounded-lg opacity-0 peer-hover:opacity-100 transition-opacity pointer-events-none">
                        {info}
                    </div>
                </div>
                {
                    isSlippageItem && (
                        <PencilLine className="w-3.5 h-3.5 text-gray-500 hover:text-gray-200 cursor-pointer" onClick={() => openDialog?.(true)}/>
                    )
                }
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
                        }: SwapBoxProps) {

    const [slippage, setSlippage] = useState<SlippageOption>(0.5);
    const [isOpenSlippageDialog, setIsOpenSlippageDialog] = useState<boolean>(false);
    const [txModalOpen, setTxModalOpen] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isSuccessNormalSwapAction, setIsSuccessNormalSwapAction] = useState(false)
    const [transactionHash, setTransactionHash] = useState<string | undefined>(undefined);
    const [gaslessTradeHash, setGaslessTradeHash] = useState<string | undefined>(undefined);

    const {
        walletClient,
        kernelAccount,
        walletType,
        signer,
        chainId: walletChainId,
        isConnected,
        login,
        switchChain,
        isChainSwitching,
    } = useContext(Web3AuthContext);

    const {getTokenPrice} = useTokenStore()
    const {
        isLoading: isQuoteLoading,
        quoteResponse,
        isGasLess: isGasLessSwap,
        refetch: refetchQuoteData,
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
    } = useGasEstimation(fromToken?.chainId)

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
                .mul(ethers.BigNumber.from(10000).add(getSlippageBigNumber(slippage)))
                .div(10000)
                .toString()
            : '0';
    const {
        approve,
        approvalDataToSubmit,
        isLoading: isApproveLoading,
    } = use0xTokenApprove({
        token: fromToken?.address as `0x${string}`,
        spender: quoteData?.spenderAddress as `0x${string}`,
        amount: amountToApprove,
        chainId: tokenChainId,
        gaslessQuote: quoteResponse as GaslessQuoteResponse,
        isGaslessApprove: isGasLessSwap,
        gaslessApprovalAvailable: quoteData?.gaslessApprovalAvailable ?? false
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

    useEffect(() => {
        if (!isApproveLoading) {
            let count = 0;
            const interval = setInterval(() => {
                if (count < 3) {
                    refetchQuoteData();
                    count ++;
                } else {
                    clearInterval(interval); // Stop after 3 calls
                }
            }, 1000); // 1 second interval
            return () => clearInterval(interval); // Clean up interval on unmount or when dependencies change
        }
    }, [isApproveLoading, refetchQuoteData]);

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
        isLoading: isGaslessTransactionPending,
        status: gaslessTransactionStatus,
        hash: gaslessTransactionHash
    } = use0xGaslessSwapStatus(gaslessTradeHash)

    useEffect(() => {
        if (gaslessTransactionHash) {
            setTransactionHash(gaslessTransactionHash)
        }
    }, [gaslessTransactionHash])

    // initialize all after closing success modal
    useEffect(() => {
        if (!txModalOpen) {
            setTransactionHash(undefined)
            setGaslessTradeHash(undefined)
            onFromAmountChange?.('')
            onToAmountChange?.('')
        }
    }, [onFromAmountChange, onToAmountChange, txModalOpen])

    const isConfirmed = isSuccessNormalSwapAction || gaslessTransactionStatus === 'confirmed'

    useEffect(() => {
        if (isConfirmed) {
            setTxModalOpen(true)
            refetchFromBalance()
            refetchToBalance()
        }
    }, [isConfirmed, refetchFromBalance, refetchToBalance])

    const handleSwap = async () => {
        if (isGasLessSwap)
            await handleGaslessSwap()
        else
            await handleNormalSwap()
    }

    const handleNormalSwap = async () => {
        setIsConfirming(true)
        const normalSwapQuoteResponse = quoteResponse as QuoteResponse
        // On click, (1) Sign the Permit2 EIP-712 message returned from quote
        if (normalSwapQuoteResponse.permit2?.eip712) {
            let signature: Hex | undefined;
            try {
                if (walletType === WalletTypeEnum.EMBEDDED) {
                    signature = await kernelAccount!.signTypedData(normalSwapQuoteResponse.permit2.eip712);
                } else {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    signature = await walletClient!.signTypedData(normalSwapQuoteResponse.permit2.eip712);
                }
                console.log("Signed permit2 message from quote response");
            } catch (error) {
                console.error("Error signing permit2 coupon:", error);
            }

            // (2) Append signature length and signature data to calldata

            if (signature && normalSwapQuoteResponse?.transaction?.data) {
                const signatureLengthInHex = numberToHex(size(signature), {
                    signed: false,
                    size: 32,
                });

                const transactionData = normalSwapQuoteResponse.transaction.data as Hex;
                const sigLengthHex = signatureLengthInHex as Hex;
                const sig = signature as Hex;

                normalSwapQuoteResponse.transaction.data = concat([
                    transactionData,
                    sigLengthHex,
                    sig,
                ]);
            } else {
                throw new Error("Failed to obtain signature or transaction data");
            }
        }
        // (3) Submit the transaction with Permit2 signature
        try {
            const tx = await signer!.sendTransaction({
                gasLimit: normalSwapQuoteResponse?.transaction.gas
                    ? BigInt(normalSwapQuoteResponse?.transaction.gas)
                    : undefined,
                to: normalSwapQuoteResponse?.transaction.to,
                data: normalSwapQuoteResponse.transaction.data, // submit
                value: normalSwapQuoteResponse?.transaction.value
                    ? BigInt(normalSwapQuoteResponse.transaction.value)
                    : undefined, // value is used for native tokens
            })

            setTransactionHash(tx.hash)
            const receipt = await tx.wait();

            if (receipt.status) {
                setIsSuccessNormalSwapAction(true)
            } else {
                setIsSuccessNormalSwapAction(false)
            }
        } catch (e) {
            //
        } finally {
            setIsConfirming(false)
        }
    }

    const handleGaslessSwap = async () => {
        if (kernelAccount || walletClient) {
            const gaslessQuote = quoteResponse as GaslessQuoteResponse
            const tradeSignature = await signTradeObject(walletType === WalletTypeEnum.EMBEDDED ? kernelAccount! : walletClient!, gaslessQuote); // Function to sign trade object
            const tradeDataToSubmit = await tradeSplitSigDataToSubmit(tradeSignature, gaslessQuote);
            zeroxService.submitTrade(walletChainId, tradeDataToSubmit, approvalDataToSubmit).then(tradeHash => setGaslessTradeHash(tradeHash))
        }
    }

    const approvalRequired = (!isGasLessSwap && quoteData?.tokenApprovalRequired) || (isGasLessSwap && quoteData?.tokenApprovalRequired && !approvalDataToSubmit);

    return (
        <>
            <div className="space-y-2.5">
                <TokenSelector
                    className="relative z-20 mb-2"
                    selectedToken={fromToken}
                    disabledToken={toToken}
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
                            className="hover:bg-blue-500/20 p-2.5 rounded-xl border border-white/10 transition-all hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl hover:border-blue-500/20 text-blue-400"
                        >
                            <ArrowDownUp className="w-4 h-4"/>
                        </button>
                    </div>
                </div>

                <TokenSelector
                    className="relative z-10"
                    selectedToken={toToken}
                    disabledToken={fromToken}
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
                            className="px-4 py-3 text-sm rounded-lg border border-white/5 hover:border-blue-500/20 transition-all">
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
                                valueClassName={`${priceImpact < -5
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
                                        title={`Dexfin fee (${ZEROX_AFFILIATE_FEE / 100}%)`}
                                        info={'A small percentage fee for Dexfin.'}
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
                                isFree={isGasLessSwap || walletType === WalletTypeEnum.EMBEDDED}
                            />

                            {/* slippage */}
                            <PreviewDetailItem
                                title={'Max. slippage'}
                                info={'Allowable difference between the expected and executed prices of a trade. Your transaction will revert if price changes unfavorably by more than this percentage'}
                                value={`${slippage}%`}
                                isLoading={false}
                                isSlippageItem={true}
                                openDialog={setIsOpenSlippageDialog}
                            />

                            {/* Route */}
                            {/*
                        {
                            fromToken && toToken && (
                                <>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-1">
                                            <span className="text-gray-400">Route</span>
                                            <div className="group relative">
                                                <Info className="w-3.5 h-3.5 text-gray-500" />
                                                <div
                                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black/90 text-xs text-gray-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                    Trading route for best price execution
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <img src={fromToken?.logoURI} alt={fromToken?.symbol}
                                            className="w-5 h-5 rounded-full" />
                                        <div className="text-xs px-2 py-1 bg-white/10 rounded-md text-gray-300">0.2%</div>
                                        <div className="flex-1 border-t border-dashed border-gray-600" />
                                        <img src={toToken?.logoURI} alt={toToken?.symbol} className="w-5 h-5 rounded-full" />
                                    </div>
                                </>
                            )
                        }
*/}
                        </div>
                    </div>
                )}

                {/*
            {
                error && (
                    <Alert status="error" variant="subtle" borderRadius="md">
                        <AlertIcon/>
                        <Text>Error: {(error as BaseError).shortMessage || error.message}</Text>
                    </Alert>
                )
            }
*/}

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

                            insufficientBalance ? (
                                <Button
                                    width="full"
                                    colorScheme="blue"
                                    isDisabled={true}
                                >
                                    Insufficient Balance
                                </Button>

                            ) : (
                                approvalRequired ? (
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
                                ) : (
                                    <Button
                                        isLoading={isChainSwitching || isConfirming || isGaslessTransactionPending}
                                        loadingText={
                                            isConfirming
                                                ? 'Confirming...'
                                                : isChainSwitching
                                                    ? 'Switching Chain...'
                                                    : (isGaslessTransactionPending)
                                                        ? 'Waiting for confirmation...'
                                                        : ''
                                        }
                                        width="full"
                                        colorScheme="blue"
                                        onClick={handleSwap}
                                        isDisabled={!(Number(fromAmount) > 0) || isConfirming}
                                    >
                                        Swap
                                    </Button>
                                )
                            )
                        )
                    )
                }
                {
                    isConfirmed && (
                        <TransactionModal open={txModalOpen} setOpen={(value: boolean) => {
                            setIsSuccessNormalSwapAction(false)
                            setTxModalOpen(value)
                        }}
                                          link={`${mapChainId2ExplorerUrl[walletChainId!]}/tx/${transactionHash}`}
                                          checkBalance={true}
                        />
                    )
                }
            </div>
            <SlippageDialog
                isOpen={isOpenSlippageDialog}
                setIsOpen={setIsOpenSlippageDialog}
                value={slippage}
                onChange={setSlippage}
            />
        </>
    );
}