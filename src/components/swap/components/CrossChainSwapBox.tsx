import {useContext, useEffect, useMemo, useState} from 'react';
import {ArrowDownUp, ArrowRight, Clock, DollarSign} from 'lucide-react';
import {TokenSelector} from './TokenSelector';
import {SlippageOption, TokenType} from '../../../types/swap.type';
import {formatNumberByFrac, shrinkAddress} from '../../../utils/common.util';
import {Alert, AlertIcon, Button, Skeleton, Text} from '@chakra-ui/react';
import useTokenStore from "../../../store/useTokenStore.ts";
import useGetTokenPrices from "../../../hooks/useGetTokenPrices.ts";
import {mapChainId2ExplorerUrl, mapChainId2Network} from "../../../config/networks.ts";
import {TransactionModal} from "../modals/TransactionModal.tsx";
import {SOLANA_CHAIN_ID} from "../../../constants/solana.constants.ts";
import {
    formatEstimatedTimeBySeconds,
    getBridgingSpendTime,
    getUSDAmount,
    needDestinationAddress
} from "../../../utils/swap.util.ts";
import {DestinationAddressInputModal} from "../modals/DestinationAddressInputModal.tsx";
import useSwapkitQuote from "../../../hooks/useSwapkitQuote.ts";
import {useAllBalance} from "../../../hooks/useAllBalance.tsx";
import {Web3AuthContext} from "../../../providers/Web3AuthContext.tsx";
import useSwapkitBridgeStatus from "../../../hooks/useSwapkitBridgeStatus.ts";
import {useTokenApprove} from "../../../hooks/useTokenApprove.ts";
import BigNumber from "bignumber.js";
import {toFixedFloat} from "../../../utils/trade.util.ts";

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
    const {
        chainId,
        solanaWalletInfo,
        address: evmAddress,
        transferSolToken,
    } = useContext(Web3AuthContext);

    const [destinationAddress, setDestinationAddress] = useState<string>('');
    const [estimatedCompletionTime, setEstimatedCompletionTime] = useState<number>(0);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);
    const [txModalOpen, setTxModalOpen] = useState(false);
    const [isPreparing, setIsPreparing] = useState(false);
    const [swapkitTradeHash, setSwapkitTradeHash] = useState<string | undefined>(undefined);

    const {getTokenPrice} = useTokenStore()
    const {
        isLoading: isQuoteLoading,
        quoteResponse,
    } = useSwapkitQuote({
        sellToken: fromToken,
        buyToken: toToken,
        sellAmount: fromAmount,
        slippage,
        destinationAddress,
    })
    const {
        isLoading: isTracking,
        trackingStatus,
        completionHash,
    } = useSwapkitBridgeStatus(fromToken?.chainId, swapkitTradeHash)


    useGetTokenPrices({
        tokenAddresses: [fromToken?.address ?? null],
        chainId: fromToken?.chainId,
    })
    useGetTokenPrices({
        tokenAddresses: [toToken?.address ?? null],
        chainId: toToken?.chainId,
    })

    const {
        isLoading: isFromBalanceLoading,
        // refetch: refetchFromBalance,
        data: fromBalance
    } = useAllBalance({tokenOrMintAddress: fromToken?.address, chainId: fromToken?.chainId})

    const {
        isLoading: isToBalanceLoading,
        // refetch: refetchToBalance,
        data: toBalance
    } = useAllBalance({tokenOrMintAddress: toToken?.address, chainId: toToken?.chainId})

    const insufficientBalance =
        !isNaN(Number(fromBalance?.formatted)) ? Number(fromAmount) > Number(fromBalance?.formatted)
            : false;

    // Update toAmount when calculation changes
    useEffect(() => {
        if (quoteResponse) {
            onToAmountChange(quoteResponse.expectedBuyAmount);
        }
    }, [quoteResponse, onToAmountChange, toToken]);

    useEffect(() => {
        if (toToken) {
            if (toToken.chainId === SOLANA_CHAIN_ID && solanaWalletInfo) {
                setDestinationAddress(solanaWalletInfo.publicKey)
            } else {
                setDestinationAddress(evmAddress)
            }
        }
    }, [toToken, solanaWalletInfo, evmAddress]);

    useEffect(() => {
        if (trackingStatus === 'completed') {
            setTxModalOpen(true)
        }
    }, [trackingStatus])

    const {
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
            toNetwork,
            fromNetwork,
        }
    }, [fromToken, getTokenPrice, toToken, fromAmount, toAmount])

    useEffect(() => {
        if (!txModalOpen) {
            setSwapkitTradeHash(undefined)
            setEstimatedCompletionTime(0)
            onFromAmountChange?.('')
            onToAmountChange?.('')
        }
    }, [onFromAmountChange, onToAmountChange, txModalOpen])

    const {
        isApproved: isEvmApproved,
        isLoading: isApproving,
        approve
    } = useTokenApprove({
        token: fromToken?.address as `0x${string}`,
        spender: (quoteResponse?.depositInfo?.depositAddress ?? (quoteResponse?.tx?.to ?? '')) as `0x${string}`,
        amount: new BigNumber(toFixedFloat(fromAmount, 4))
            .times(new BigNumber(10)
                .pow(fromToken?.decimals ?? 1))
            .toFixed(0),
        chainId: fromToken?.chainId ?? 1
    });

    const isApproved = fromToken?.chainId === SOLANA_CHAIN_ID ? true : isEvmApproved

    const handleSwap = async () => {
        if (!isApproved) {
            approve?.()
            return
        }

        // set estimated completion time in unixtimestamp
        setEstimatedCompletionTime(Math.floor(Date.now() / 1000) + quoteResponse.estimatedTime)

        if (fromToken?.chainId === SOLANA_CHAIN_ID && quoteResponse.depositInfo) { // solana transaction

            const signature = await transferSolToken(
                quoteResponse.depositInfo.depositAddress,
                fromToken.address,
                Number(fromAmount),
                fromToken.decimals
            )
            setSwapkitTradeHash(signature)

        } else if (quoteResponse.tx) {
            //
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
                (fromNetwork && toNetwork && quoteResponse.providerName) && (
                    <div
                        className={`rounded-xl p-4 border border-blue-500`}
                    >
                        {
                            isQuoteLoading ? (
                                <Skeleton startColor="#444" endColor="#1d2837" w={'7rem'} h={'1rem'}></Skeleton>
                            ) : (
                                <>
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
                                            <span className="ml-2 text-sm">{quoteResponse.providerName}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mb-3">
                                    <span
                                        className="text-sm text-gray-400">You receive: {formatNumberByFrac(Number(quoteResponse.expectedBuyAmount), 5)} {toToken?.symbol}</span>
                                    </div>

                                    <div className="flex justify-between text-xs text-gray-400">
                                        <div className="flex items-center">
                                            <Clock size={12} className="mr-1"/>
                                            <span>{`estimated time: ${formatEstimatedTimeBySeconds(quoteResponse.estimatedTime)}`}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span>Fee: {quoteResponse.formattedFeeInUsd}</span>
                                            <DollarSign size={12} className="mr-1"/>
                                        </div>
                                    </div>
                                </>
                            )
                        }
                    </div>
                )
            }

            {
                (needDestinationAddress(fromToken?.chainId, toToken?.chainId)) && !destinationAddress && (
                    <Alert status="info" variant="subtle" borderRadius="md">
                        <AlertIcon/>
                        <Text width={'calc(100% - 20px)'}>You Should Input Destination Address</Text>
                    </Alert>
                )
            }

            {
                quoteResponse.errorMessage && (
                    <Alert status="error" variant="subtle" borderRadius="md">
                        <AlertIcon/>
                        <Text width={'calc(100% - 20px)'}>Error: {quoteResponse.errorMessage}</Text>
                    </Alert>
                )
            }

            {
                (chainId === SOLANA_CHAIN_ID && !solanaWalletInfo) ? (
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
                    swapkitTradeHash ? (
                        <Button
                            isLoading={isTracking}
                            loadingText={getBridgingSpendTime(estimatedCompletionTime)}
                            width="full"
                            colorScheme="blue"
                            onClick={handleSwap}
                            isDisabled={true}
                        >
                            {trackingStatus}
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
                                isLoading={isQuoteLoading || isApproving}
                                loadingText={(isApproving ? 'Approving...' : 'Computing...')}
                                width="full"
                                colorScheme="blue"
                                onClick={handleSwap}
                                isDisabled={!(Number(fromAmount) > 0) || isQuoteLoading || isApproving || !isApproved || !!quoteResponse.errorMessage}
                            >
                                {isApproved ? 'Bridge' : 'Approve'}
                            </Button>
                        )
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
                              link={`${mapChainId2ExplorerUrl[toToken!.chainId]}/tx/${completionHash}`}/>
        </div>
    )
        ;
}