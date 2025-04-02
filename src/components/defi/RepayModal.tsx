import React, { useMemo, useEffect } from "react";
import { X, ArrowRight } from 'lucide-react';
import { Spinner, Skeleton } from '@chakra-ui/react';

import { TokenChainIcon } from "../swap/components/TokenIcon";
import { Position } from "../../store/useDefiStore";
import { mapChainId2NativeAddress } from "../../config/networks.ts";
import { BORROWING_LIST } from "../../constants/mock/defi.ts";

import { formatNumberByFrac, compareStringUppercase } from "../../utils/common.util";

import useGasEstimation from "../../hooks/useGasEstimation.ts";
import useGetTokenPrices from '../../hooks/useGetTokenPrices';
import useTokenBalanceStore from "../../store/useTokenBalanceStore";
import useTokenStore from "../../store/useTokenStore.ts";

interface ModalState {
    type: string | null;
    position?: Position;
}

interface RepayModalProps {
    setModalState: (state: ModalState) => void,
    modalState: ModalState,
    withdrawPercent: string,
    setWithdrawPercent: (percent: string) => void,
    confirming: string,
    repayHandler: () => void
}


const RepayModal: React.FC<RepayModalProps> = ({ setModalState, modalState, withdrawPercent, setWithdrawPercent, confirming, repayHandler }) => {
    const { getTokenBalance } = useTokenBalanceStore();
    const chainId = Number(modalState.position?.chainId);
    const { isLoading: isGasEstimationLoading, data: gasData } = useGasEstimation(chainId)

    const protocolId = modalState.position?.protocol_id?.toUpperCase() || "";

    const borrowTokenInfo = BORROWING_LIST.find((token) => {
        return token.chainId === Number(chainId)
            && compareStringUppercase(token?.protocol_id, protocolId)
            && compareStringUppercase(token.tokenOut.symbol, modalState?.position?.tokens[1].symbol || "");
    });

    const borrowedTokenInfo = modalState.position?.tokens[1];
    const repayTokenBalance = borrowTokenInfo?.tokenIn ? getTokenBalance(borrowTokenInfo?.tokenOut?.contract_address, Number(borrowTokenInfo.chainId)) : null;

    const nativeTokenAddress = mapChainId2NativeAddress[Number(chainId)];

    const { refetch: refetchNativeTokenPrice } = useGetTokenPrices({
        tokenAddresses: [nativeTokenAddress],
        chainId: Number(chainId),
    })

    const { getTokenPrice, tokenPrices } = useTokenStore();

    const maxPercent = "100";

    const nativeTokenPrice = useMemo(() => {
        if (chainId && nativeTokenAddress) {
            return getTokenPrice(nativeTokenAddress, chainId)
        }
        return 0;
    }, [getTokenPrice, nativeTokenAddress, chainId, tokenPrices])


    const repayAmount = useMemo(() => {
        return formatNumberByFrac(Number(repayTokenBalance?.balance) * Number(withdrawPercent) / 100)
    }, [formatNumberByFrac, repayTokenBalance, withdrawPercent])

    const remainDebtAmount = useMemo(() => {
        return formatNumberByFrac(Number(borrowedTokenInfo?.balance_formatted) - Number(repayAmount || 0))
    }, [formatNumberByFrac, repayAmount])


    const isErrorPercent = useMemo(() => {
        return Number(withdrawPercent) > Number(maxPercent)
    }, [withdrawPercent, maxPercent])

    const isDisabledAction = isErrorPercent;

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
                    <h3 className="text-xl font-medium">
                        Repay
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
                        </div>
                        <div className="ml-auto text-right">
                            <div className={`text-emerald-400`}>
                                {formatNumberByFrac(modalState?.position?.apy) || 0}% APY
                            </div>
                        </div>
                    </div>

                    <>
                        <div className="bg-white/5 rounded-xl p-4">
                            <div className="text-sm text-white/60 mb-2">
                                Repay amount
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
                                        Balance
                                    </span>
                                </div>
                                <div className='items-center flex'>
                                    <TokenChainIcon src={repayTokenBalance?.logo || ""} alt={repayTokenBalance?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                                    <span className='ml-2'>
                                        {repayTokenBalance?.balance}
                                    </span>
                                    <span className='ml-1 text-sm text-white/60'>
                                        {repayTokenBalance?.symbol || ""}
                                    </span>
                                </div>
                            </div>

                            <div className='flex justify-between'>
                                <div>
                                    <span className='ml-2 text-sm text-white/60'>
                                        Borrowed {borrowedTokenInfo?.symbol || ""}
                                    </span>
                                </div>
                                <div className='items-center flex'>
                                    <TokenChainIcon src={borrowedTokenInfo?.logo || ""} alt={borrowedTokenInfo?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                                    <span className='ml-2'>
                                        {formatNumberByFrac(Number(borrowedTokenInfo?.balance_formatted))}
                                    </span>
                                    <span className='ml-1 text-sm text-white/60'>
                                        {borrowedTokenInfo?.symbol || ""}
                                    </span>
                                </div>
                            </div>

                            <div className='flex justify-between'>
                                <div>
                                    <span className='ml-2 text-sm text-white/60'>
                                        Remaining debt
                                    </span>
                                </div>
                                <div className='items-center flex'>
                                    <span>
                                        {`${formatNumberByFrac(Number(borrowedTokenInfo?.balance_formatted))} ${borrowedTokenInfo?.symbol || ""}`}
                                    </span>
                                    <ArrowRight className="ml-1 mr-1" size={14} />
                                    <span>
                                        {`${remainDebtAmount} ${borrowedTokenInfo?.symbol || ""}`}
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

                    <button
                        className={`w-full py-3 bg-blue-500 hover:bg-blue-600 transition-colors rounded-xl font-medium ${(isDisabledAction || confirming) ? "opacity-60" : ""} flex align-center justify-center`} disabled={isDisabledAction}
                        onClick={async () => {
                            repayHandler()
                        }}
                    >
                        {confirming ? <div><Spinner size="md" className='mr-2' /> {confirming}</div> : "Repay"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RepayModal;