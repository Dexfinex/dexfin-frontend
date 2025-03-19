import {useContext, useEffect, useMemo, useState} from 'react';
import {ArrowDownUp} from 'lucide-react';
import {TokenSelector} from './TokenSelector';
import {DebridgeOrderStatus, SlippageOption, TokenType} from '../../../types/swap.type';
import {formatNumberByFrac, isValidAddress, shrinkAddress} from '../../../utils/common.util';
import {Alert, AlertIcon, Button, Skeleton, Text} from '@chakra-ui/react';
import useTokenStore from "../../../store/useTokenStore.ts";
import useGetTokenPrices from "../../../hooks/useGetTokenPrices.ts";
import {
    mapChainId2ChainName,
    mapChainId2ExplorerUrl,
    mapChainId2NativeAddress,
    mapChainId2Network
} from "../../../config/networks.ts";
import {TransactionModal} from "../modals/TransactionModal.tsx";
import {SOLANA_CHAIN_ID} from "../../../constants/solana.constants.ts";
import {getBridgingSpendTime, getUSDAmount} from "../../../utils/swap.util.ts";
import {DestinationAddressInputModal} from "../modals/DestinationAddressInputModal.tsx";
import {useAllBalance} from "../../../hooks/useAllBalance.tsx";
import {Web3AuthContext} from "../../../providers/Web3AuthContext.tsx";
import {useTokenApprove} from "../../../hooks/useTokenApprove.ts";
import BigNumber from "bignumber.js";
import {toFixedFloat} from "../../../utils/trade.util.ts";
import useDebridgeOrderStatus from "../../../hooks/useDebridgeOrderStatus.ts";
import useDebridgeQuote from "../../../hooks/useDebridgeQuote.ts";
import useLocalStorage from "../../../hooks/useLocalStorage.ts";
import {BridgeRecentWalletType} from "../../../types/bridge.type.ts";
import {LOCAL_STORAGE_BRIDGE_RECENT_WALLETS} from "../../../constants";
import {PreviewDetailItem} from "./SwapBox.tsx";

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
                                  }: CrossChainSwapBoxProps) {
    const {
        solanaWalletInfo,
        signer,
        transferSolToken,
        chainId: walletChainId,
        switchChain,
    } = useContext(Web3AuthContext);

    const [destinationAddress, setDestinationAddress] = useState<string>('');
    const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);
    const [recentWallets, setRecentWallets] = useLocalStorage<Array<BridgeRecentWalletType> | null>(LOCAL_STORAGE_BRIDGE_RECENT_WALLETS, [])
    const [sendToAnotherAddress, setSendToAnotherAddress] = useState<boolean>(false);
    const [txModalOpen, setTxModalOpen] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [isBridging, setIsBridging] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);

    const {getTokenPrice} = useTokenStore()
    const {
        isLoading: isQuoteLoading,
        quoteResponse,
    } = useDebridgeQuote({
        sellToken: fromToken,
        buyToken: toToken,
        sellAmount: fromAmount,
        destinationAddress: sendToAnotherAddress ? destinationAddress : null,
    })
    const {
        isLoading: isTracking,
        orderStatus,
        completionHash,
    } = useDebridgeOrderStatus(quoteResponse.orderId, isBridging)

    const nativeTokenAddressFromChain = mapChainId2NativeAddress[fromToken!.chainId]
    useGetTokenPrices({
        tokenAddresses: [fromToken?.address ?? null, nativeTokenAddressFromChain],
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
    const {
        data: nativeBalance
    } = useAllBalance({tokenOrMintAddress: nativeTokenAddressFromChain, chainId: fromToken?.chainId});

    // Update toAmount when calculation changes
    useEffect(() => {
        if (quoteResponse) {
            onToAmountChange(quoteResponse.outputAmount);
        }
    }, [quoteResponse, onToAmountChange, toToken]);

    useEffect(() => {
        if (isBridging && countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isBridging, countdown]);

    useEffect(() => {
        if (toToken &&
            sendToAnotherAddress &&
            toToken.chainId === SOLANA_CHAIN_ID &&
            !isValidAddress(destinationAddress, SOLANA_CHAIN_ID)
        ) {
            setDestinationAddress('')
        }
    }, [toToken, destinationAddress, sendToAnotherAddress]);

    useEffect(() => {
        if (orderStatus === DebridgeOrderStatus.Fulfilled) {
            // open tx modal
            setTxModalOpen(true)
            // save used wallet address
            if ((recentWallets ?? []).filter(wallet => wallet.address === destinationAddress).length <= 0) {
                setRecentWallets([
                    ...(recentWallets ?? []),
                    {
                        chainId: toToken!.chainId,
                        address: destinationAddress,
                    }
                ])
            }
        }
    }, [orderStatus])

    const {
        fromUsdAmount,
        toUsdAmount,
        fromNetwork,
        toNetwork,
        solverGasCostAmount,
        solverGasText,
        debridgeFeeText,
        totalSpentText,
        priceImpact,
    } = useMemo(() => {
        const fromTokenPrice = fromToken ? getTokenPrice(fromToken?.address, fromToken?.chainId) : 0
        const toTokenPrice = toToken ? getTokenPrice(toToken?.address, toToken?.chainId) : 0
        const nativeTokenPrice = fromToken ? getTokenPrice(nativeTokenAddressFromChain, fromToken?.chainId) : 0
        const fromUsdAmount = fromToken ? getUSDAmount(fromToken, fromTokenPrice, fromAmount) : 0
        const toUsdAmount = toToken ? getUSDAmount(toToken, toTokenPrice, toAmount) : 0
        const fromNetwork = fromToken ? mapChainId2Network[fromToken.chainId] : null
        const toNetwork = toToken ? mapChainId2Network[toToken.chainId] : null
        const solverGasCostAmount = quoteResponse.solverGasCosts
        const solverGasUsdAmount = fromTokenPrice * solverGasCostAmount
        const priceImpact = fromUsdAmount > 0 ? ((toUsdAmount - fromUsdAmount) / fromUsdAmount) * 100 : 0

        let feeAmountInUsd = 0
        if (quoteResponse) {
            feeAmountInUsd = nativeTokenPrice * quoteResponse.feeAmount
        }

        const solverGasText = `${formatNumberByFrac(solverGasCostAmount, 4)} ${fromToken?.symbol} ($${formatNumberByFrac(solverGasUsdAmount, 3)})`
        const debridgeFeeText = `${formatNumberByFrac(quoteResponse.feeAmount, 4)} ${fromNetwork?.symbol} ($${formatNumberByFrac(feeAmountInUsd, 3)})`
        const totalSpentText = `${formatNumberByFrac(solverGasCostAmount + Number(fromAmount), 4)} ${fromToken?.symbol}`

        return {
            fromUsdAmount,
            toUsdAmount,
            toNetwork,
            fromNetwork,
            solverGasCostAmount,
            priceImpact,
            solverGasText,
            debridgeFeeText,
            totalSpentText,
        }
    }, [nativeTokenAddressFromChain, fromToken, getTokenPrice, toToken, fromAmount, toAmount, quoteResponse])

    const {
        isRequireSwitchChain,
        textSwitchChain,
    } = useMemo(() => {
        const isRequireSwitchChain = walletChainId !== fromToken?.chainId
        const textSwitchChain = `Switch to ${mapChainId2ChainName[fromToken!.chainId]} network`

        return {
            isRequireSwitchChain,
            textSwitchChain
        }
    }, [fromToken, walletChainId])

    const insufficientNativeBalance =
        !isNaN(Number(nativeBalance?.formatted))
            ? ((nativeTokenAddressFromChain !== fromToken?.address ? 0 : Number(fromAmount)) + Number(quoteResponse.feeAmount)) > Number(nativeBalance?.formatted)
            : false;
    const insufficientBalance =
        !isNaN(Number(fromBalance?.formatted)) ? (Number(fromAmount) + solverGasCostAmount) > Number(fromBalance?.formatted)
            : false;
    const isZeroAmount = !fromAmount || Number(fromAmount) <= 0 || Number(quoteResponse.outputAmount) <= 0

    useEffect(() => {
        if (!txModalOpen) {
            setCountdown(0)
            setIsBridging(false)
            onFromAmountChange?.('')
            onToAmountChange?.('')
        }
    }, [onFromAmountChange, onToAmountChange, txModalOpen])

    const spenderAddress = quoteResponse.tx?.allowanceTarget || quoteResponse.tx?.to

    const {
        isApproved: isEvmApproved,
        isLoading: isApproving,
        approve
    } = useTokenApprove({
        token: fromToken?.address as `0x${string}`,
        spender: spenderAddress as `0x${string}`,
        amount: new BigNumber(toFixedFloat(fromAmount, 4))
            .times(new BigNumber(10)
                .pow(fromToken?.decimals ?? 1))
            .toFixed(0),
        chainId: fromToken?.chainId ?? 1
    });

    const isApproved =
        (fromToken?.chainId === SOLANA_CHAIN_ID || nativeTokenAddressFromChain === fromToken?.address || !spenderAddress) // chain is solana or native token or don't have spenderAddress
            ? true
            : isEvmApproved

    const handleSwap = async () => {
        if (!isApproved) {
            approve?.()
            return
        }

        try {
            setIsConfirming(true)
            if (fromToken?.chainId === SOLANA_CHAIN_ID && destinationAddress) { // solana transaction
                await transferSolToken(
                    destinationAddress,
                    fromToken.address,
                    Number(fromAmount),
                    fromToken.decimals
                )
            } else if (quoteResponse.tx) {
                await signer!.sendTransaction(quoteResponse.tx)
            } else {
                throw new Error('tx not provided')
            }
            // set estimated completion time in unixtimestamp
            setIsBridging(true)
            setCountdown(quoteResponse.estimatedTime)
        } catch (e) {
            //
        } finally {
            setIsConfirming(false)
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
                deductionAmount={solverGasCostAmount}
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
                onClick={() => sendToAnotherAddress && setIsAddressModalOpen(true)}
            >
                <div className={`flex justify-between ${sendToAnotherAddress ? 'mb-4' : ''}`} onClick={(e) => {
                    e.stopPropagation()
                }}>
                    <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={sendToAnotherAddress}
                            onChange={(e) => setSendToAnotherAddress(e.target.checked)}
                            className="appearance-none h-6 w-6 rounded-md border-2 border-blue-500/60 checked:bg-blue-500 checked:border-transparent relative checked:after:content-['✔'] checked:after:absolute checked:after:left-[4px] checked:after:top-[-2px] checked:after:text-white checked:after:text-lg"
                        />
                        <span className="group-hover:text-gray-300 transition-colors">Send to Another Address</span>
                    </label>
                    {/*
                    <span
                        className="text-blue-400/90 text-[10px] font-semibold tracking-wider uppercase bg-blue-500/10 px-2 py-0.5 rounded-md">Destination Address</span>
*/}
                </div>
                {
                    sendToAnotherAddress && (
                        <div className="flex items-center">
                            {(destinationAddress && toNetwork) ? (
                                <>
                                    <img src={toNetwork.icon} alt={toNetwork.name} className="w-6 h-6 mr-2 rounded-full"/>
                                    <span className="font-medium">
                                {shrinkAddress(destinationAddress)}
                            </span>
                                </>
                            ) : (
                                <span className="text-gray-400">Click to enter Address</span>
                            )}
                        </div>
                    )
                }
            </div>

            {
                (fromNetwork && toNetwork && !isZeroAmount) && (
                    <div className="space-y-2.5 mt-4">
                        {/* Exchange Rate */}
                        <div
                            className="px-4 py-3 text-sm rounded-lg border border-white/5 hover:border-blue-500/20 transition-all">
                            {
                                isQuoteLoading ? (
                                    <Skeleton startColor="#444" endColor="#1d2837" w={'100%'} h={'3rem'}></Skeleton>
                                ) : (
                                    <>
                                        {
                                            solverGasCostAmount > 0 && (
                                                <PreviewDetailItem
                                                    title={'Solver gas fee'}
                                                    info={'A fee paid to the solver who processes your cross-chain transaction and covers gas costs on both blockchains.'}
                                                    value={solverGasText}
                                                    isLoading={isQuoteLoading}
                                                />
                                            )
                                        }

                                        <PreviewDetailItem
                                            title={`deBridge Fee`}
                                            info={'A small fee charged by deBridge for handling your cross-chain transaction and ensuring secure transfer between blockchains.'}
                                            value={debridgeFeeText}
                                            isLoading={isQuoteLoading}
                                        />

                                        <PreviewDetailItem
                                            title={`Total spent`}
                                            info={'The total amount deducted from your wallet, which includes the selling token amount plus the solver gas fee needed to process the cross-chain transaction.'}
                                            value={totalSpentText}
                                            isLoading={isQuoteLoading}
                                        />

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

                                        {/*
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
                                                <span className="ml-2 text-sm">Debridge</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mb-3">
                                    <span
                                        className="text-sm text-gray-400">You receive: {formatNumberByFrac(Number(quoteResponse.outputAmount), 5)} {toToken?.symbol}</span>
                                        </div>

                                        <div className="flex justify-between text-xs text-gray-400">
                                            <div className="flex items-center">
                                                <Clock size={12} className="mr-1"/>
                                                <span>{`estimated time: ${formatEstimatedTimeBySeconds(quoteResponse.estimatedTime)}`}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span>Fee: {formatNumberByFrac(feeAmountInUsd, 5)}</span>
                                                <DollarSign size={12} className="mr-1"/>
                                            </div>
                                        </div>
*/}
                                    </>
                                )
                            }
                        </div>
                    </div>
                )
            }
            {
                quoteResponse.errorMessage && (
                    <Alert status="error" variant="subtle" borderRadius="md">
                        <AlertIcon/>
                        <Text width={'calc(100% - 20px)'}>{quoteResponse.errorMessage}</Text>
                    </Alert>
                )
            }
            {
                (walletChainId === SOLANA_CHAIN_ID && !solanaWalletInfo) ? (
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
                    isBridging ? (
                        <Button
                            isLoading={isBridging || isTracking}
                            loadingText={getBridgingSpendTime(countdown)}
                            width="full"
                            colorScheme="blue"
                            onClick={handleSwap}
                            isDisabled={true}
                        >
                            {orderStatus}
                        </Button>
                    ) : isConfirming ? (
                        <Button
                            isLoading={isConfirming}
                            loadingText={'Confirming...'}
                            width="full"
                            colorScheme="blue"
                            isDisabled={true}
                        >
                        </Button>
                    ) : (
                        isRequireSwitchChain ? (
                            <Button
                                isLoading={false}
                                loadingText={'Changing Network...'}
                                width="full"
                                colorScheme="blue"
                                onClick={() => {
                                    switchChain(fromToken!.chainId)
                                    // if (approveReset) approveReset();
                                }}
                                isDisabled={false}
                            >
                                {textSwitchChain}
                            </Button>
                        ) : (insufficientBalance || insufficientNativeBalance) ? (
                            <Button
                                width="full"
                                colorScheme="blue"
                                isDisabled={true}
                            >
                                Insufficient {insufficientNativeBalance ? 'Native' : ''} Balance
                            </Button>
                        ) : (
                            <Button
                                isLoading={isQuoteLoading || isApproving}
                                loadingText={(isApproving ? 'Approving...' : 'Computing...')}
                                width="full"
                                colorScheme="blue"
                                onClick={() => {
                                    if (isApproved) handleSwap()
                                    else approve?.()
                                }}
                                isDisabled={!(Number(fromAmount) > 0) || isQuoteLoading || isApproving || !!quoteResponse.errorMessage || Number(quoteResponse.outputAmount) <= 0}
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
                              link={`${mapChainId2ExplorerUrl[toToken!.chainId]}/tx/${completionHash}`}
                              checkBalance={true}/>
        </div>
    )
        ;
}