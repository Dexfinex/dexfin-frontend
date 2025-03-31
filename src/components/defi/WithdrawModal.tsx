import React, { useMemo, useEffect } from "react";
import { X, ArrowLeft, ArrowDown } from 'lucide-react';
import { Spinner, Skeleton } from '@chakra-ui/react';

import { TokenChainIcon } from "../swap/components/TokenIcon";
import { Position } from "../../store/useDefiStore";
import { mapChainId2NativeAddress } from "../../config/networks.ts";
import { LENDING_LIST } from "../../constants/mock/defi.ts";

import { formatNumberByFrac, compareStringUppercase } from "../../utils/common.util";

import useGasEstimation from "../../hooks/useGasEstimation.ts";
import useGetTokenPrices from '../../hooks/useGetTokenPrices';
import useTokenBalanceStore from "../../store/useTokenBalanceStore";
import useTokenStore from "../../store/useTokenStore.ts";
import useDefiStore from "../../store/useDefiStore";

interface ModalState {
    type: string | null;
    position?: Position;
}

interface WithdrawModalProps {
    setModalState: (state: ModalState) => void,
    showPreview: boolean,
    modalState: ModalState,
    setShowPreview: (preview: boolean) => void,
    withdrawPercent: string,
    setWithdrawPercent: (percent: string) => void,
    tokenAmount: string,
    token2Amount: string,
    confirming: string,
    redeemHandler: () => void
}


const WithdrawModal: React.FC<WithdrawModalProps> = ({ setModalState, showPreview, modalState, setShowPreview, withdrawPercent, setWithdrawPercent, tokenAmount, token2Amount, confirming, redeemHandler }) => {
    const { getTokenBalance } = useTokenBalanceStore();
    const chainId = Number(modalState.position?.chainId);
    const { isLoading: isGasEstimationLoading, data: gasData } = useGasEstimation(chainId)

    const protocolId = modalState.position?.protocol_id?.toUpperCase() || "";

    const tokenBalance1 = modalState?.position ? modalState.position.tokens[0] : null;
    const tokenInfo1 = modalState?.position ? modalState.position.tokens[0] : null;

    const lendTokenInfo = LENDING_LIST.find((token) => {
        return token.chainId === Number(chainId)
            && compareStringUppercase(token?.protocol_id, protocolId)
            && compareStringUppercase(token.tokenOut.symbol, modalState?.position?.tokens[0].symbol || "");
    });

    const tokenBalance2 = lendTokenInfo?.tokenIn ? getTokenBalance(lendTokenInfo?.tokenIn?.contract_address, Number(lendTokenInfo.chainId)) : null;
    const tokenInfo2 = lendTokenInfo?.tokenIn ? lendTokenInfo?.tokenIn : null;

    const nativeTokenAddress = mapChainId2NativeAddress[Number(chainId)];

    const { refetch: refetchNativeTokenPrice } = useGetTokenPrices({
        tokenAddresses: [nativeTokenAddress],
        chainId: Number(chainId),
    })

    const { getTokenPrice, tokenPrices } = useTokenStore();
    const { getProtocolById } = useDefiStore();

    const protocolInfo = getProtocolById(chainId, protocolId);

    const maxPercent = useMemo(() => {
        const unclaimedUsd = protocolInfo?.total_usd_value;
        if (Number(unclaimedUsd) > Number(tokenBalance1?.usd_value)) {
            return "100";
        }
        const unclaimedBalance = Number(unclaimedUsd) / Number(tokenBalance1?.usd_price);
        const availablePercent = 100 - 15;
        return formatNumberByFrac(unclaimedBalance * availablePercent / Number(tokenBalance1?.balance_formatted), 0);
    }, [protocolInfo, tokenBalance1])

    const nativeTokenPrice = useMemo(() => {
        if (chainId && nativeTokenAddress) {
            return getTokenPrice(nativeTokenAddress, chainId)
        }
        return 0;
    }, [getTokenPrice, nativeTokenAddress, chainId, tokenPrices])

    const priceRatio = useMemo(() => {
        if (tokenBalance1?.usd_price && tokenBalance2?.usdPrice) {
            const ratio = tokenBalance1?.usd_price / tokenBalance2?.usdPrice
            return ratio;
        }
        return 1;
    }, [tokenBalance1, tokenBalance2]);

    const isErrorTokenAmount = useMemo(() => {
        if (tokenAmount === "") {
            return false;
        }
        if (0 < Number(tokenAmount) && Number(tokenAmount) <= Number(tokenBalance1?.balance)) {
            return false;
        }
        return true;
    }, [tokenAmount, tokenBalance1])

    const isErrorToken2Amount = useMemo(() => {
        if (token2Amount === "") {
            return false;
        }
        if (0 < Number(token2Amount) && Number(token2Amount) <= Number(tokenBalance2?.balance)) {
            return false;
        }
        return true;
    }, [token2Amount, tokenBalance2])

    const isErrorPercent = useMemo(() => {
        return Number(withdrawPercent) > Number(maxPercent)
    }, [withdrawPercent, maxPercent])

    const isDisabledAction = isErrorTokenAmount || isErrorToken2Amount || isErrorPercent;

    useEffect(() => {
        if (chainId && nativeTokenAddress && nativeTokenPrice === 0) {
            refetchNativeTokenPrice()
        }
    }, [chainId, nativeTokenAddress, nativeTokenPrice])

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalState({ type: null })} />
            <div className="relative glass w-[400px] rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    {
                        showPreview &&
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" onClick={() => setShowPreview(false)}>
                            <ArrowLeft />
                        </button>
                    }
                    <h3 className="text-xl font-medium">
                        Withdraw
                    </h3>
                    <button
                        onClick={() => setModalState({ type: null })}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <img
                            src={modalState?.position?.logo}
                            alt={modalState?.position?.protocol}
                            className="w-8 h-8"
                        />
                        <div>
                            <div className="font-medium">{modalState?.position?.protocol}</div>
                            <div className="text-sm text-white/60">
                                {
                                    modalState?.position?.tokens?.map(item => item.symbol + " ")
                                }
                            </div>
                        </div>
                        <div className="ml-auto text-right">
                            <div className={`text-emerald-400`}>
                                {formatNumberByFrac(modalState?.position?.apy) || 0}% APY
                            </div>
                        </div>
                    </div>

                    {
                        showPreview ?
                            <div className='mt-2 mb-2 flex flex-col gap-4'>
                                <div className='flex justify-between mt-2'>
                                    <div>
                                        <span className='ml-2 text-2xl'>
                                            {`${formatNumberByFrac(Number(modalState.position?.tokens[0].balance_formatted) * Number(withdrawPercent) / 100, 6)} ${tokenInfo1?.symbol}`}
                                        </span>
                                    </div>
                                    <div className='items-center flex'>
                                        <TokenChainIcon src={tokenInfo1?.logo || ""} alt={tokenInfo1?.symbol || ""} size={"lg"} chainId={Number(chainId)} />
                                    </div>
                                </div>
                                <div className='flex mt-2 w-full items-center justify-center'>
                                    <ArrowDown />
                                </div>

                                <div className='flex justify-between mt-2'>
                                    <div>
                                        <span className='ml-2 text-2xl'>
                                            {`${formatNumberByFrac(Number(modalState.position?.tokens[0].balance_formatted) * Number(withdrawPercent) / 100, 6)} ${tokenInfo2?.symbol}`}
                                        </span>
                                    </div>
                                    <div className='items-center flex'>
                                        <TokenChainIcon src={tokenInfo2?.logo || ""} alt={tokenInfo2?.symbol || ""} size={"lg"} chainId={Number(chainId)} />
                                    </div>
                                </div>

                                <div className='flex justify-between mt-2'>
                                    <div>
                                        <span className='ml-2 text-sm text-white/60'>
                                            Rate
                                        </span>
                                    </div>
                                    <div className='items-center flex'>
                                        <span className='ml-2 text-sm'>
                                            1 {tokenInfo2?.symbol} = {formatNumberByFrac(1 / priceRatio, 4)} {tokenInfo1?.symbol}
                                        </span>
                                    </div>
                                </div>
                                <div className='flex justify-between'>
                                    <div>
                                        <span className='ml-2 text-sm text-white/60'>
                                            New {tokenInfo1?.symbol || ""} Position
                                        </span>
                                    </div>
                                    <div className='items-center flex'>
                                        <TokenChainIcon src={tokenInfo1?.logo || ""} alt={tokenInfo1?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                                        <span className='ml-2'>
                                            {formatNumberByFrac(Number(modalState.position?.tokens[0].balance_formatted) * ((100 - Number(withdrawPercent)) / 100))}
                                        </span>
                                        <span className='ml-1 text-sm text-white/60'>
                                            {tokenInfo1?.symbol || ""}
                                        </span>
                                    </div>
                                </div>

                                <div className='flex justify-between'>
                                    <div>
                                        <span className='ml-2 text-sm text-white/60'>
                                            New {tokenInfo2?.symbol || ""} Position
                                        </span>
                                    </div>
                                    <div className='items-center flex'>
                                        <TokenChainIcon src={tokenInfo2?.logo || ""} alt={tokenInfo2?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                                        <span className='ml-2'>
                                            {
                                                formatNumberByFrac(
                                                    Number(tokenBalance2?.balance) + (Number(modalState.position?.tokens[0].balance_formatted) * Number(priceRatio) * Number(withdrawPercent) / 100),
                                                    6
                                                )
                                            }
                                        </span>
                                        <span className='ml-1 text-sm text-white/60'>
                                            {tokenInfo2?.symbol || ""}
                                        </span>
                                    </div>
                                </div>

                                <div className='flex justify-between'>
                                    <div>
                                        <span className='ml-2 text-sm text-white/60'>
                                            Network Fee
                                        </span>
                                    </div>
                                    <div className='items-center flex'>
                                        <span className='ml-2 text-sm'>
                                            {
                                                isGasEstimationLoading ?
                                                    <Skeleton startColor="#444" endColor="#1d2837" w={'4rem'} h={'1rem'}></Skeleton>
                                                    : `${formatNumberByFrac(nativeTokenPrice * gasData.gasEstimate, 2) === "0" ? "< 0.01$" : `$ ${formatNumberByFrac(nativeTokenPrice * gasData.gasEstimate, 2)}`}`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            :
                            <>
                                <div className="bg-white/5 rounded-xl p-4">
                                    <div className="text-sm text-white/60 mb-2">
                                        Withdrawal amount
                                    </div>
                                    <div className={`relative flex flex-row items-center justify-center w-full ${isDisabledAction ? "text-red-400" : ""}`}>
                                        <input
                                            minLength={1}
                                            maxLength={3}
                                            inputMode="numeric" autoComplete="off" autoCorrect="off" type="text" pattern="^\d*$"
                                            placeholder="0" spellCheck="false"
                                            value={withdrawPercent}
                                            onChange={(e) => {
                                                if (0 < Number(e.target.value) && Number(e.target.value) <= 100 && !isNaN(Number(e.target.value))) {
                                                    setWithdrawPercent(e.target.value)
                                                }
                                            }}
                                            className={`bg-transparent text-5xl outline-none`}
                                            style={{ width: (withdrawPercent.length || 1) * 30 }}
                                        />
                                        <div className={`text-4xl ${isDisabledAction ? "text-red-400" : "text-black"} ml-2`}>%</div>
                                    </div>
                                    <div className='flex w-full items-center justify-center mt-4 gap-4'>
                                        <button className="text-gray-100 border-[1px] border-gray-200 rounded-xl px-2"
                                            onClick={() => setWithdrawPercent("25")}>
                                            25%
                                        </button>
                                        <button className="text-gray-100 border-[1px] border-gray-200 rounded-xl px-2"
                                            onClick={() => setWithdrawPercent("50")}>
                                            50%
                                        </button>
                                        <button className="text-gray-100 border-[1px] border-gray-200 rounded-xl px-2"
                                            onClick={() => setWithdrawPercent("75")}>
                                            75%
                                        </button>
                                        <button className="text-gray-100 border-[1px] border-gray-200 rounded-xl px-2"
                                            onClick={() => setWithdrawPercent(maxPercent)}>
                                            MAX
                                        </button>
                                    </div>
                                </div>

                                <div className='mt-2 mb-2 flex flex-col gap-3'>
                                    <div className='flex justify-between'>
                                        <div>
                                            <span className='ml-2 text-sm text-white/60'>
                                                {tokenInfo1?.symbol || ""} Position
                                            </span>
                                        </div>
                                        <div className='items-center flex'>
                                            <TokenChainIcon src={tokenInfo1?.logo || ""} alt={tokenInfo1?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                                            <span className='ml-2'>
                                                {formatNumberByFrac(Number(modalState.position?.tokens[0].balance_formatted))}
                                            </span>
                                            <span className='ml-1 text-sm text-white/60'>
                                                {tokenInfo2?.symbol || ""}
                                            </span>
                                        </div>
                                    </div>

                                    <div className='flex justify-between'>
                                        <div>
                                            <span className='ml-2 text-sm text-white/60'>
                                                {tokenInfo2?.symbol || ""} Position
                                            </span>
                                        </div>
                                        <div className='items-center flex'>
                                            <TokenChainIcon src={tokenInfo2?.logo || ""} alt={tokenInfo2?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                                            <span className='ml-2'>
                                                {formatNumberByFrac(Number(tokenBalance2?.balance), 6)}
                                            </span>
                                            <span className='ml-1 text-sm text-white/60'>
                                                {tokenInfo2?.symbol || ""}
                                            </span>
                                        </div>
                                    </div>

                                    <div className='flex justify-between'>
                                        <div>
                                            <span className='ml-2 text-sm text-white/60'>
                                                Network Fee
                                            </span>
                                        </div>
                                        <div className='items-center flex'>
                                            <span className='ml-2 text-sm '>
                                                {
                                                    isGasEstimationLoading ?
                                                        <Skeleton startColor="#444" endColor="#1d2837" w={'4rem'} h={'1rem'}></Skeleton>
                                                        : `${formatNumberByFrac(nativeTokenPrice * gasData.gasEstimate, 2) === "0" ? "< 0.01$" : `$ ${formatNumberByFrac(nativeTokenPrice * gasData.gasEstimate, 2)}`}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </>
                    }

                    <button
                        className={`w-full py-3 bg-blue-500 hover:bg-blue-600 transition-colors rounded-xl font-medium ${(isDisabledAction || confirming) ? "opacity-60" : ""} flex align-center justify-center`} disabled={isDisabledAction}
                        onClick={async () => {
                            if (showPreview) {
                                redeemHandler()
                            } else {
                                setShowPreview(true);
                            }
                        }}
                    >
                        {confirming ? <div><Spinner size="md" className='mr-2' /> {confirming}</div> : showPreview ? "Withdraw" : "Next"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default WithdrawModal;