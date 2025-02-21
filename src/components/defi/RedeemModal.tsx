import React, { useContext, useMemo, useEffect } from "react";
import { X, ArrowLeft } from 'lucide-react';
import { Spinner, Skeleton } from '@chakra-ui/react';

import { TokenChainIcon } from "../swap/components/TokenIcon";
import { Web3AuthContext } from "../../providers/Web3AuthContext";
import { Position } from "../../store/useDefiStore";
import { mapChainId2NativeAddress } from "../../config/networks.ts";
import { formatNumberByFrac } from "../../utils/common.util";

import useGasEstimation from "../../hooks/useGasEstimation.ts";
import useGetTokenPrices from '../../hooks/useGetTokenPrices';
import useTokenBalanceStore from "../../store/useTokenBalanceStore";
import useTokenStore from "../../store/useTokenStore.ts";

interface ModalState {
    type: 'deposit' | 'redeem' | 'borrow' | 'repay' | null;
    position?: Position;
}

interface RedeemModalProps {
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


const RedeemModal: React.FC<RedeemModalProps> = ({ setModalState, showPreview, modalState, setShowPreview, withdrawPercent, setWithdrawPercent, tokenAmount, token2Amount, confirming, redeemHandler }) => {
    const { getTokenBalance } = useTokenBalanceStore();
    const { chainId } = useContext(Web3AuthContext);
    const { isLoading: isGasEstimationLoading, data: gasData } = useGasEstimation()

    const tokenBalance1 = modalState?.position ? getTokenBalance(modalState.position.tokens[0].contract_address, Number(chainId)) : null;
    const tokenInfo1 = modalState?.position ? modalState.position.tokens[0] : null;
    const tokenBalance2 = modalState?.position ? getTokenBalance(modalState.position.tokens[1].contract_address, Number(chainId)) : null;
    const tokenInfo2 = modalState?.position ? modalState.position.tokens[1] : null;

    const nativeTokenAddress = mapChainId2NativeAddress[Number(chainId)];

    const { refetch: refetchNativeTokenPrice } = useGetTokenPrices({
        tokenAddresses: [nativeTokenAddress],
        chainId: Number(chainId),
    })

    const { getTokenPrice, tokenPrices } = useTokenStore();

    const nativeTokenPrice = useMemo(() => {
        if (chainId && nativeTokenAddress) {
            return getTokenPrice(nativeTokenAddress, chainId)
        }
        return 0;
    }, [getTokenPrice, nativeTokenAddress, chainId, tokenPrices])

    const priceRatio = useMemo(() => {
        if (tokenBalance1?.usdPrice && tokenBalance2?.usdPrice) {
            const ratio = tokenBalance1?.usdPrice / tokenBalance2?.usdPrice
            return ratio > 1 ? 1 : ratio;
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
                        Redeem
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
                                {`${modalState?.position?.tokens[0].symbol}/${modalState?.position?.tokens[1].symbol} ${modalState?.position?.tokens[2].symbol}`}
                            </div>
                        </div>
                        <div className="ml-auto text-right">
                            <div className={`text-emerald-400`}>
                                {modalState?.position?.apy || 0}% APY
                            </div>
                        </div>
                    </div>

                    {
                        showPreview ?
                            <div className='mt-2 mb-2 flex flex-col gap-4'>
                                <div className='flex justify-between mt-2'>
                                    <div>
                                        <span className='ml-2 text-2xl'>
                                            {`${formatNumberByFrac(Number(modalState.position?.tokens[0].balance_formatted) * Number(withdrawPercent) / 100, 6)} ${tokenBalance1?.symbol}`}
                                        </span>
                                    </div>
                                    <div className='items-center flex'>
                                        <TokenChainIcon src={tokenBalance1?.logo || ""} alt={tokenBalance1?.symbol || ""} size={"lg"} chainId={Number(chainId)} />
                                    </div>
                                </div>

                                <div className='flex justify-between mt-2'>
                                    <div>
                                        <span className='ml-2 text-2xl'>
                                            {`${formatNumberByFrac(Number(modalState.position?.tokens[1].balance_formatted) * Number(withdrawPercent) / 100, 6)} ${tokenBalance2?.symbol}`}
                                        </span>
                                    </div>
                                    <div className='items-center flex'>
                                        <TokenChainIcon src={tokenBalance2?.logo || ""} alt={tokenBalance2?.symbol || ""} size={"lg"} chainId={Number(chainId)} />
                                    </div>
                                </div>

                                <div className='flex justify-between mt-2'>
                                    <div>
                                        <span className='ml-2'>
                                            Rate
                                        </span>
                                    </div>
                                    <div className='items-center flex'>
                                        <span className='ml-2'>
                                            1 {tokenBalance2?.symbol} = {formatNumberByFrac(1 / priceRatio, 4)} {tokenBalance1?.symbol}
                                        </span>
                                    </div>
                                </div>
                                <div className='flex justify-between'>
                                    <div>
                                        <span className='ml-2'>
                                            New {tokenBalance1?.symbol || ""} Position
                                        </span>
                                    </div>
                                    <div className='items-center flex'>
                                        <TokenChainIcon src={tokenBalance1?.logo || ""} alt={tokenBalance1?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                                        <span className='ml-2'>
                                            {formatNumberByFrac(Number(modalState.position?.tokens[0].balance_formatted) * ((100 - Number(withdrawPercent)) / 100))}
                                        </span>
                                        <span className='ml-1'>
                                            {tokenBalance2?.symbol || ""}
                                        </span>
                                    </div>
                                </div>

                                <div className='flex justify-between'>
                                    <div>
                                        <span className='ml-2'>
                                            New {tokenBalance2?.symbol || ""} Position
                                        </span>
                                    </div>
                                    <div className='items-center flex'>
                                        <TokenChainIcon src={tokenBalance2?.logo || ""} alt={tokenBalance2?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                                        <span className='ml-2'>
                                            {formatNumberByFrac(Number(modalState.position?.tokens[1].balance_formatted) * ((100 - Number(withdrawPercent)) / 100))}
                                        </span>
                                        <span className='ml-1'>
                                            {tokenBalance2?.symbol || ""}
                                        </span>
                                    </div>
                                </div>

                                <div className='flex justify-between'>
                                    <div>
                                        <span className='ml-2'>
                                            Network Fee
                                        </span>
                                    </div>
                                    <div className='items-center flex'>
                                        <span className='ml-2'>
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
                                    <div className='relative flex flex-row items-center justify-center w-full'>
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
                                        <div className='text-4xl text-black ml-2'>%</div>
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
                                            onClick={() => setWithdrawPercent("100")}>
                                            MAX
                                        </button>
                                    </div>
                                </div>

                                <div className='mt-2 mb-2 flex flex-col gap-3'>
                                    <div className='flex justify-between'>
                                        <div>
                                            <span className='ml-2 text-sm text-white/60'>
                                                {tokenBalance1?.symbol || ""} Position
                                            </span>
                                        </div>
                                        <div className='items-center flex'>
                                            <TokenChainIcon src={tokenBalance1?.logo || ""} alt={tokenBalance1?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                                            <span className='ml-2'>
                                                {formatNumberByFrac(Number(modalState.position?.tokens[0].balance_formatted))}
                                            </span>
                                            <span className='ml-1 text-sm text-white/60'>
                                                {tokenBalance2?.symbol || ""}
                                            </span>
                                        </div>
                                    </div>

                                    <div className='flex justify-between'>
                                        <div>
                                            <span className='ml-2 text-sm text-white/60'>
                                                {tokenBalance2?.symbol || ""} Position
                                            </span>
                                        </div>
                                        <div className='items-center flex'>
                                            <TokenChainIcon src={tokenBalance2?.logo || ""} alt={tokenBalance2?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                                            <span className='ml-2'>
                                                {formatNumberByFrac(Number(modalState.position?.tokens[1].balance_formatted))}
                                            </span>
                                            <span className='ml-1 text-sm text-white/60'>
                                                {tokenBalance2?.symbol || ""}
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
                        className={`w-full py-3 bg-blue-500 hover:bg-blue-600 transition-colors rounded-xl font-medium ${isErrorTokenAmount || isErrorToken2Amount || confirming ? "opacity-60" : ""} flex align-center justify-center`} disabled={isErrorTokenAmount}
                        onClick={async () => {
                            if (showPreview) {
                                redeemHandler()
                            } else {
                                setShowPreview(true);
                            }
                        }}
                    >
                        {confirming ? <div><Spinner size="md" className='mr-2' /> {confirming}</div> : showPreview ? "Redeem" : "Next"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RedeemModal;