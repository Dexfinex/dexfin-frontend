import React, { useContext, useMemo, useEffect } from "react";
import { X, ArrowLeft } from 'lucide-react';
import { Spinner, Skeleton, position } from '@chakra-ui/react';

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
    type: string | null;
    position?: Position;
}

interface StakeModalProps {
    setModalState: (state: ModalState) => void,
    showPreview: boolean,
    modalState: ModalState,
    setShowPreview: (preview: boolean) => void,
    tokenAmount: string,
    confirming: string,
    depositHandler: () => void,
    setTokenAmount: (amount: string) => void,
    setToken2Amount: (amount: string) => void,
}

const StakeModal: React.FC<StakeModalProps> = ({ setModalState, showPreview, modalState, setShowPreview, tokenAmount, confirming, depositHandler, setTokenAmount, setToken2Amount }) => {
    const { getTokenBalance } = useTokenBalanceStore();
    const { chainId } = useContext(Web3AuthContext);
    const { isLoading: isGasEstimationLoading, data: gasData } = useGasEstimation()
    const tokenBalance1 = modalState?.position ? getTokenBalance(modalState.position.tokens[0]?.contract_address, Number(chainId)) : null;
    const tokenInfo1 = modalState?.position ? modalState.position.tokens[0] : null;

    const nativeTokenAddress = mapChainId2NativeAddress[Number(chainId)];
    console.log("##############", modalState.position)

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

    const isErrorTokenAmount = useMemo(() => {
        if (tokenAmount === "") {
            return false;
        }
        if (0 < Number(tokenAmount) && Number(tokenAmount) <= Number(tokenBalance1?.balance)) {
            return false;
        }
        return true;
    }, [tokenAmount, tokenBalance1])

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
                        Stake
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
                            src={modalState.position?.logo}
                            alt={modalState.position?.protocol}
                            className="w-8 h-8"
                        />
                        <div>
                            <div className="font-medium">{modalState.position?.protocol}</div>
                            <div className="text-sm text-white/60">
                                {
                                    modalState.position?.tokens.map((token) => `${token?.symbol} `)
                                }
                            </div>
                        </div>
                        <div className="ml-auto text-right">
                            <div className={`text-emerald-400`}>
                                {modalState.position?.apy || 0}% APY
                            </div>
                        </div>
                    </div>

                    {
                        showPreview ?
                            <div className='mt-2 mb-2 flex flex-col gap-4'>
                                <div className='flex justify-between mt-2'>
                                    <div>
                                        <span className='ml-2 text-2xl'>
                                            {`${formatNumberByFrac(Number(tokenAmount), 6)} ${tokenInfo1?.symbol}`}
                                        </span>
                                    </div>
                                    <div className='items-center flex'>
                                        <TokenChainIcon src={tokenInfo1?.logo || ""} alt={tokenInfo1?.symbol || ""} size={"lg"} chainId={Number(chainId)} />
                                    </div>
                                </div>

                                <div className='flex justify-between'>
                                    <div>
                                        <span className='ml-2 text-sm text-white/60'>
                                            New {tokenInfo1?.symbol || ""} amount
                                        </span>
                                    </div>
                                    <div className='items-center flex'>
                                        <TokenChainIcon src={tokenInfo1?.logo || ""} alt={tokenInfo1?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                                        <span className='ml-2'>
                                            {formatNumberByFrac(Number(modalState.position?.tokens[0]?.balance_formatted) + Number(tokenAmount))}
                                        </span>
                                        <span className='ml-1 text-sm text-white/60'>
                                            {tokenBalance1?.symbol || ""}
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
                                        Amount
                                    </div>
                                    <div className='relative flex'>
                                        <input
                                            value={tokenAmount}
                                            onChange={(e) => {
                                                setTokenAmount(e.target.value);
                                            }}
                                            type="text"
                                            className={`w-full bg-transparent text-2xl outline-none ${isErrorTokenAmount ? "text-red-500" : ""}`}
                                            placeholder="0.00"
                                        />
                                        <div className='flex items-center fixed right-12'>
                                            <TokenChainIcon src={tokenInfo1?.logo || ""} alt={tokenInfo1?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                                            <span className='ml-2'>
                                                {tokenInfo1?.symbol || ""}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className='mt-2 mb-2 flex flex-col gap-3'>
                                    <div className='flex justify-between'>
                                        <div>
                                            <span className='ml-2 text-sm text-white/60'>
                                                Staked {tokenInfo1?.symbol || ""}
                                            </span>
                                        </div>
                                        <div className='items-center flex'>
                                            <TokenChainIcon src={tokenInfo1?.logo || ""} alt={tokenInfo1?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                                            <span className='ml-2'>
                                                {formatNumberByFrac(Number(modalState.position?.tokens[0]?.balance_formatted))}
                                            </span>
                                            <span className='ml-1 text-sm text-white/60'>
                                                {tokenInfo1?.symbol || ""}
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
                            </>
                    }

                    <button
                        className={`w-full py-3 bg-blue-500 hover:bg-blue-600 transition-colors rounded-xl font-medium ${isErrorTokenAmount || confirming ? "opacity-60" : ""} flex align-center justify-center`} disabled={isErrorTokenAmount}
                        onClick={async () => {
                            if (showPreview) {
                                depositHandler()
                            } else {
                                setShowPreview(true);
                            }
                        }}
                    >
                        {confirming ? <div><Spinner size="md" className='mr-2' /> {confirming}</div> : showPreview ? "Deposit" : "Next"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default StakeModal;