import React, { useContext, useMemo, useEffect, useState } from "react";
import { X, ArrowLeft } from 'lucide-react';
import { Spinner, Skeleton } from '@chakra-ui/react';

import { TokenChainIcon, TokenIcon } from "../swap/components/TokenIcon";
import { Web3AuthContext } from "../../providers/Web3AuthContext";
import { Position } from "../../store/useDefiStore";
import { mapChainId2NativeAddress } from "../../config/networks.ts";
import { formatNumberByFrac } from "../../utils/common.util";
import { getChainIcon } from "../../utils/defi.util.ts";
import { getChainNameById } from "../../utils/defi.util.ts";

import useGasEstimation from "../../hooks/useGasEstimation.ts";
import useGetTokenPrices from '../../hooks/useGetTokenPrices';
import useTokenBalanceStore from "../../store/useTokenBalanceStore";
import useTokenStore from "../../store/useTokenStore.ts";
import useDefillamaStore from "../../store/useDefillamaStore.ts";

import SelectChain from "./SelectChain.tsx";

interface ModalState {
    type: string | null;
    position?: Position;
    supportedChains?: number[];
    apyToken?: string;
}

interface DepositModalProps {
    setModalState: (state: ModalState) => void,
    showPreview: boolean,
    modalState: ModalState,
    setShowPreview: (preview: boolean) => void,
    tokenAmount: string,
    token2Amount: string,
    confirming: string,
    depositHandler: () => void,
    setTokenAmount: (amount: string) => void,
    setToken2Amount: (amount: string) => void,
}

const DepositModal: React.FC<DepositModalProps> = ({ setModalState, showPreview, modalState, setShowPreview, tokenAmount, token2Amount, confirming, depositHandler, setTokenAmount, setToken2Amount }) => {
    const { getTokenBalance } = useTokenBalanceStore();
    const { chainId: connectedChainId, switchChain, isChainSwitching } = useContext(Web3AuthContext)
    const [chainId, setChainId] = useState(modalState?.supportedChains ? modalState?.supportedChains[0] : connectedChainId)
    const { getOfferingPoolByChainId } = useDefillamaStore();
    const poolInfo = getOfferingPoolByChainId(Number(chainId), modalState.position?.protocol_id || "", modalState.apyToken || "");
    const { isLoading: isGasEstimationLoading, data: gasData } = useGasEstimation(chainId)

    const tokenBalance1 = modalState?.position ? getTokenBalance(modalState.position.tokens[0]?.contract_address, Number(chainId)) : null;
    const tokenInfo1 = modalState?.position ? modalState.position.tokens[0] : null;
    const tokenBalance2 = modalState?.position ? getTokenBalance(modalState.position.tokens[1]?.contract_address, Number(chainId)) : null;
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

    const isCorrectChain = useMemo(() => {
        return Number(chainId) === Number(connectedChainId)
    }, [chainId, connectedChainId]);

    const buttonLabel = useMemo(() => {
        if (isChainSwitching) return <div className="flex justify-center"><Spinner size="md" className='mr-2' /> Switching network</div>
        return !isCorrectChain ?
            <>
                Switch Chain
                <TokenIcon src={getChainIcon(chainId) || ""} alt={getChainNameById(Number(chainId))} size="sm" className="ml-2" />
            </> :
            confirming ?
                <div><Spinner size="md" className='mr-2' /> {confirming}</div>
                : showPreview
                    ? "Deposit"
                    : "Next"

    }, [confirming, chainId, connectedChainId, isChainSwitching, showPreview])

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
                        Deposit
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
                                {formatNumberByFrac(poolInfo?.apy || 0)}% APY
                            </div>
                        </div>
                    </div>

                    <SelectChain
                        chainList={modalState?.supportedChains || []}
                        selectedChain={Number(chainId)}
                        setSelectedChain={setChainId}

                    />

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

                                <div className='flex justify-between mt-2'>
                                    <div>
                                        <span className='ml-2 text-2xl'>
                                            {`${formatNumberByFrac(Number(token2Amount), 6)} ${tokenInfo2?.symbol}`}
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
                                        <span className='ml-2 text-sm text-white/60'>
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
                                            New {tokenBalance2?.symbol || ""} Position
                                        </span>
                                    </div>
                                    <div className='items-center flex'>
                                        <TokenChainIcon src={tokenInfo2?.logo || ""} alt={tokenInfo2?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                                        <span className='ml-2'>
                                            {formatNumberByFrac(Number(modalState.position?.tokens[1]?.balance_formatted) + Number(token2Amount))}
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
                                                setToken2Amount(formatNumberByFrac(Number(e.target.value) * Number(priceRatio)));
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
                                    <div className="flex items-center justify-between mt-2 text-sm">
                                        <span className="text-white/60">
                                            {`Balance: ${formatNumberByFrac(Number(tokenBalance1?.balance) || 0)}`}
                                        </span>
                                        <button className="text-blue-400" onClick={() => {
                                            setTokenAmount((tokenBalance1?.balance || "") + "");
                                            setToken2Amount((Number(tokenBalance1?.balance) * Number(priceRatio) || 0).toString());
                                        }}>MAX</button>
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-xl p-4">
                                    <div className="text-sm text-white/60 mb-2">
                                        Amount
                                    </div>
                                    <div className='relative flex'>
                                        <input
                                            value={token2Amount}
                                            onChange={(e) => {
                                                setToken2Amount(e.target.value);
                                                setTokenAmount(formatNumberByFrac((Number(e.target.value) / Number(priceRatio)) || 0));
                                            }}
                                            type="text"
                                            className={`w-full bg-transparent text-2xl outline-none ${isErrorToken2Amount ? "text-red-500" : ""}`}
                                            placeholder="0.00"
                                        />
                                        <div className='flex items-center fixed right-12'>
                                            <TokenChainIcon src={tokenInfo2?.logo || ""} alt={tokenInfo2?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                                            <span className='ml-2'>
                                                {tokenInfo2?.symbol || ""}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 text-sm">
                                        <span className="text-white/60">
                                            {`Balance: ${formatNumberByFrac(Number(tokenBalance2?.balance) || 0)}`}
                                        </span>
                                        <button className="text-blue-400" onClick={() => {
                                            setToken2Amount((tokenBalance2?.balance || "") + "");
                                            setTokenAmount(formatNumberByFrac((Number(tokenBalance2?.balance) / Number(priceRatio)) || 0));
                                        }}>MAX</button>
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
                                                {tokenInfo2?.symbol || ""} Position
                                            </span>
                                        </div>
                                        <div className='items-center flex'>
                                            <TokenChainIcon src={tokenInfo2?.logo || ""} alt={tokenInfo2?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                                            <span className='ml-2'>
                                                {formatNumberByFrac(Number(modalState.position?.tokens[1]?.balance_formatted))}
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
                            </>
                    }

                    <button
                        className={`w-full py-3 bg-blue-500 hover:bg-blue-600 transition-colors rounded-xl font-medium flex align-center justify-center`} disabled={isErrorTokenAmount}
                        onClick={async () => {
                            if (!isCorrectChain) {
                                switchChain(Number(chainId));
                            } else if (showPreview) {
                                depositHandler();
                            } else if (!isErrorTokenAmount && !isErrorToken2Amount && !confirming) {
                                setShowPreview(true);
                            }
                        }}
                    >
                        {buttonLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DepositModal;