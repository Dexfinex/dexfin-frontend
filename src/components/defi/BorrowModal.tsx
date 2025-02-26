import React, { useContext, useMemo, useEffect } from "react";
import { X, ArrowLeft, ArrowDown, ArrowRight } from 'lucide-react';
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
import { BORROWING_LIST } from "../../constants/mock/defi.ts";

interface ModalState {
    type: string | null;
    position?: Position;
}

interface BorrowModalProps {
    setModalState: (state: ModalState) => void,
    showPreview: boolean,
    modalState: ModalState,
    setShowPreview: (preview: boolean) => void,
    tokenAmount: string,
    confirming: string,
    borrowHandler: () => void,
    setTokenAmount: (amount: string) => void,
    borrowingTokenAmount: string,
    setBorrowingTokenAmount: (amount: string) => void,
}

const BorrowModal: React.FC<BorrowModalProps> = ({ setModalState, showPreview, modalState, setShowPreview, tokenAmount, confirming, borrowHandler, setTokenAmount, setBorrowingTokenAmount, borrowingTokenAmount }) => {
    const { getTokenBalance } = useTokenBalanceStore();
    const { chainId } = useContext(Web3AuthContext);
    const { isLoading: isGasEstimationLoading, data: gasData } = useGasEstimation();
    const borrowTokenInfo = BORROWING_LIST.find((token) => {
        return token.chainId === Number(chainId) && token.protocol === modalState.position?.protocol && token.tokenOut.symbol === modalState?.position.tokens[1].symbol
    });
    const tokenInBalance = borrowTokenInfo?.tokenIn ? getTokenBalance(borrowTokenInfo?.tokenIn?.contract_address || "", Number(chainId)) : null;
    const tokenInInfo = borrowTokenInfo?.tokenIn ? borrowTokenInfo?.tokenIn : null;
    const tokenOutBalance = borrowTokenInfo?.tokenOut ? getTokenBalance(borrowTokenInfo?.tokenOut?.contract_address || "", Number(chainId)) : null;
    const tokenOutInfo = borrowTokenInfo?.tokenOut ? borrowTokenInfo?.tokenOut : null;

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

    const isErrorTokenAmount = useMemo(() => {
        if (tokenAmount === "") {
            return false;
        }
        if (0 < Number(tokenAmount) && Number(tokenAmount) <= Number(tokenInBalance?.balance)) {
            return false;
        }
        return true;
    }, [tokenAmount, tokenInBalance])

    const priceRatio = useMemo(() => {
        if (tokenInBalance?.usdPrice && tokenOutBalance?.usdPrice) {
            const ratio = tokenInBalance?.usdPrice / tokenOutBalance?.usdPrice
            return ratio;
        }
        return 1;
    }, [tokenInBalance, tokenOutBalance]);

    const availableBorrowAmount = useMemo(() => {
        return Number(formatNumberByFrac(Number(tokenAmount) *0.75 * Number(priceRatio), 2));
    }, [tokenAmount, priceRatio])

    const isErrorBorrowingTokenAmount = useMemo(() => {
        if (borrowingTokenAmount === "") {
            return false;
        }
        if (0 < Number(borrowingTokenAmount) && Number(borrowingTokenAmount) <= availableBorrowAmount) {
            return false;
        }
        return true;
    }, [borrowingTokenAmount, tokenAmount])

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
                        Borrow {tokenOutInfo?.symbol}
                    </h3>
                    <button
                        onClick={() => setModalState({ type: null })}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="gap-3 p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3 p-3">
                            <img
                                src={modalState.position?.logo}
                                alt={modalState.position?.protocol}
                                className="w-8 h-8"
                            />
                            <div>
                                <div className="font-medium">{modalState.position?.protocol}</div>
                                <div className="text-sm text-white/60 flex items-center">
                                    {tokenInInfo?.symbol} <ArrowRight className="mr-1 ml-1 w-3 h-3" /> {tokenOutInfo?.symbol}
                                </div>
                            </div>
                        </div>

                        <div className="text-sm text-white flex items-center">
                            You can deposit {tokenInInfo?.symbol} as collateral and borrow {tokenOutInfo?.symbol} token.
                        </div>
                    </div>

                    {
                        showPreview ?
                            <div className='mt-2 mb-2 flex flex-col gap-4'>
                                <div className='flex justify-between mt-2'>
                                    <div>
                                        <span className='ml-2 text-2xl'>
                                            {`${formatNumberByFrac(Number(tokenAmount), 6)} ${tokenInInfo?.symbol}`}
                                        </span>
                                    </div>
                                    <div className='items-center flex'>
                                        <TokenChainIcon src={tokenInInfo?.logo || ""} alt={tokenInInfo?.symbol || ""} size={"lg"} chainId={Number(chainId)} />
                                    </div>
                                </div>

                                <div className='flex justify-center'>
                                    <div className="bg-[#1d2837] hover:bg-blue-500/20 p-2.5 rounded-xl border border-white/10 transition-all hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl hover:border-blue-500/20 text-blue-400">
                                        <ArrowDown className="w-3 h-3" />
                                    </div>
                                </div>

                                <div className='flex justify-between mt-2'>
                                    <div>
                                        <span className='ml-2 text-2xl'>
                                            {`${borrowingTokenAmount} ${tokenOutInfo?.symbol}`}
                                        </span>
                                    </div>
                                    <div className='items-center flex'>
                                        <TokenChainIcon src={tokenOutInfo?.logo || ""} alt={tokenOutInfo?.symbol || ""} size={"lg"} chainId={Number(chainId)} />
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
                                            1 {tokenOutInfo?.symbol} = {formatNumberByFrac(1 / priceRatio, 4)} {tokenInInfo?.symbol}
                                        </span>
                                    </div>
                                </div>
                                <div className='flex justify-between'>
                                    <div>
                                        <span className='ml-2 text-sm text-white/60'>
                                            New {tokenOutBalance?.symbol || ""} amount
                                        </span>
                                    </div>
                                    <div className='items-center flex'>
                                        <TokenChainIcon src={tokenOutBalance?.logo || ""} alt={tokenOutBalance?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                                        <span className='ml-2'>
                                            {formatNumberByFrac(Number(tokenOutBalance?.balance) + Number(borrowingTokenAmount), 4)}
                                        </span>
                                        <span className='ml-1 text-sm text-white/60'>
                                            {tokenOutBalance?.symbol || ""}
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
                                        Deposit token amount
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
                                            <TokenChainIcon src={tokenInInfo?.logo || ""} alt={tokenInInfo?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                                            <span className='ml-2'>
                                                {tokenInInfo?.symbol || ""}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 text-sm">
                                        <span className="text-white/60">
                                            {`Balance: ${formatNumberByFrac(Number(tokenInBalance?.balance) || 0)}${tokenInInfo?.symbol}`}
                                        </span>
                                        <button className="text-blue-400" onClick={() => {
                                            setTokenAmount((tokenInBalance?.balance || "") + "");
                                        }}>MAX</button>
                                    </div>
                                </div>

                                <div className='flex justify-center'>
                                    <div className="bg-[#1d2837] hover:bg-blue-500/20 p-2.5 rounded-xl border border-white/10 transition-all hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl hover:border-blue-500/20 text-blue-400">
                                        <ArrowDown className="w-3 h-3" />
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-xl p-4">
                                    <div className="text-sm text-white/60 mb-2">
                                        Loan token amount
                                    </div>
                                    <div className='relative flex'>
                                        <input
                                            value={borrowingTokenAmount}
                                            onChange={(e) => {
                                                setBorrowingTokenAmount(e.target.value);
                                            }}
                                            type="text"
                                            className={`w-full bg-transparent text-2xl outline-none ${isErrorBorrowingTokenAmount ? "text-red-500" : ""}`}
                                            placeholder="0.00"
                                        />
                                        <div className='flex items-center fixed right-12'>
                                            <TokenChainIcon src={tokenOutInfo?.logo || ""} alt={tokenOutInfo?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                                            <span className='ml-2'>
                                                {tokenOutInfo?.symbol || ""}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 text-sm">
                                        <span className="text-white/60">
                                            {`Available: ${availableBorrowAmount}${tokenOutInfo?.symbol}`}
                                        </span>
                                        <button className="text-blue-400" onClick={() => {
                                            setBorrowingTokenAmount(availableBorrowAmount + "");
                                        }}>MAX</button>
                                    </div>
                                </div>

                                <div className='mt-2 mb-2 flex flex-col gap-3'>
                                    <div className='flex justify-between mt-2'>
                                        <div>
                                            <span className='ml-2 text-sm text-white/60'>
                                                Rate
                                            </span>
                                        </div>
                                        <div className='items-center flex'>
                                            <span className='ml-2 text-sm text-white/60'>
                                                1 {tokenOutInfo?.symbol} = {formatNumberByFrac(1 / priceRatio, 4)} {tokenInInfo?.symbol}
                                            </span>
                                        </div>
                                    </div>
                                    <div className='flex justify-between'>
                                        <div>
                                            <span className='ml-2 text-sm text-white/60'>
                                                Loan token balance
                                            </span>
                                        </div>
                                        <div className='items-center flex'>
                                            <TokenChainIcon src={tokenOutInfo?.logo || ""} alt={tokenOutInfo?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                                            <span className='ml-2'>
                                                {formatNumberByFrac(Number(tokenOutBalance?.balance))}
                                            </span>
                                            <span className='ml-1 text-sm text-white/60'>
                                                {tokenOutInfo?.symbol || ""}
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
                                borrowHandler()
                            } else {
                                setShowPreview(true);
                            }
                        }}
                    >
                        {confirming ? <div><Spinner size="md" className='mr-2' /> {confirming}</div> : showPreview ? "Borrow" : "Next"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BorrowModal;