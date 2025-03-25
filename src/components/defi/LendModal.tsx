import React, { useContext, useMemo, useEffect, useState } from "react";
import { X, ArrowLeft, } from 'lucide-react';
import { Spinner, Skeleton } from '@chakra-ui/react';

import { TransactionModal } from '../swap/modals/TransactionModal.tsx';

import { TokenChainIcon, TokenIcon } from "../swap/components/TokenIcon";
import { Position } from "../../store/useDefiStore";
import { mapChainId2NativeAddress } from "../../config/networks.ts";
import { formatNumberByFrac } from "../../utils/common.util";

import useGasEstimation from "../../hooks/useGasEstimation.ts";
import useGetTokenPrices from '../../hooks/useGetTokenPrices';
import useTokenBalanceStore from "../../store/useTokenBalanceStore";
import useTokenStore from "../../store/useTokenStore.ts";
import useDefillamaStore from "../../store/useDefillamaStore.ts";
import { useEnSoActionMutation } from '../../hooks/useActionEnSo.ts';
import { LENDING_LIST } from "../../constants/mock/defi.ts";
import { Web3AuthContext } from "../../providers/Web3AuthContext.tsx";
import SelectChain from "./SelectChain.tsx";
import { getChainIcon } from "../../utils/defi.util.ts";
import { getChainNameById } from "../../utils/defi.util.ts";

import { mapChainId2ExplorerUrl } from '../../config/networks.ts';
import { WalletTypeEnum } from "../../types/wallet.type.ts";
import { EnSoResponse } from "../../services/enso.service.ts";

interface ModalState {
    type: string | null;
    position?: Position;
    supportedChains?: number[];
    apyToken?: string;
}

interface LendModalProps {
    setModalState: (state: ModalState) => void,
    modalState: ModalState,
    setSelectedTab: (selectedTab: 'overview' | 'explore') => void,
    refetchDefiPositionByWallet: () => void,
    refetchDefiProtocolByWallet: () => void,
}

const LendModal: React.FC<LendModalProps> = ({
    setModalState,
    modalState,
    setSelectedTab,
    refetchDefiPositionByWallet,
    refetchDefiProtocolByWallet
}) => {
    const [tokenAmount, setTokenAmount] = useState("");
    const [confirming, setConfirming] = useState("");
    const [hash, setHash] = useState("");
    const [txModalOpen, setTxModalOpen] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const { mutate: enSoActionMutation } = useEnSoActionMutation();
    const { getTokenBalance } = useTokenBalanceStore();
    const { chainId: connectedChainId, switchChain, isChainSwitching, signer, address, walletType } = useContext(Web3AuthContext)
    const [chainId, setChainId] = useState(modalState?.supportedChains ? modalState?.supportedChains[0] : connectedChainId)
    const { getOfferingPoolByChainId } = useDefillamaStore();
    const poolInfo = getOfferingPoolByChainId(Number(chainId), modalState.position?.protocol_id || "", modalState.apyToken || "");
    const { isLoading: isGasEstimationLoading, data: gasData } = useGasEstimation();
    const lendTokenInfo = LENDING_LIST.find((token) => {
        return token.chainId === Number(chainId) && token.protocol === modalState.position?.protocol && token.tokenIn.symbol === modalState?.position.tokens[0].symbol
    });
    const tokenInBalance = lendTokenInfo?.tokenIn ? getTokenBalance(lendTokenInfo?.tokenIn?.contract_address || "", Number(chainId)) : null;
    const tokenInInfo = lendTokenInfo?.tokenIn ? lendTokenInfo?.tokenIn : null;

    const nativeTokenAddress = mapChainId2NativeAddress[Number(chainId)];

    const { refetch: refetchNativeTokenPrice } = useGetTokenPrices({
        tokenAddresses: [nativeTokenAddress],
        chainId: Number(chainId),
    })

    const { getTokenPrice, tokenPrices } = useTokenStore();
    const { refetch: refetchTokensPrices } = useGetTokenPrices({
        tokenAddresses: [tokenInInfo?.contract_address || ""],
        chainId: Number(chainId),
    })

    const nativeTokenPrice = useMemo(() => {
        if (chainId && nativeTokenAddress) {
            return getTokenPrice(nativeTokenAddress, chainId)
        }
        return 0;
    }, [getTokenPrice, nativeTokenAddress, chainId, tokenPrices])

    const tokenInPrice = useMemo(() => {
        if (chainId && tokenInInfo?.contract_address) {
            return getTokenPrice(tokenInInfo?.contract_address.toLowerCase(), Number(chainId))
        }
        return 0;
    }, [chainId, tokenInInfo, tokenPrices, getTokenPrice])

    const isErrorTokenAmount = useMemo(() => {
        if (tokenAmount === "") {
            return false;
        }
        if (0 < Number(tokenAmount) && Number(tokenAmount) <= Number(tokenInBalance?.balance)) {
            return false;
        }
        return true;
    }, [tokenAmount, tokenInBalance])

    const isCorrectChain = useMemo(() => {
        return Number(chainId) === Number(connectedChainId)
    }, [chainId, connectedChainId]);

    const buttonLabel = useMemo(() => {
        if (isChainSwitching) return <div className="flex justify-center"><Spinner size="md" className='mr-2' /> Switching network</div>
        return !isCorrectChain
            ? <>
                Switch Chain
                <TokenIcon src={getChainIcon(chainId) || ""} alt={getChainNameById(Number(chainId))} size="sm" className="ml-2" />
            </> :
            confirming ? <div><Spinner size="md" className='mr-2' /> {confirming}</div>
                : "Lend"
    }, [confirming, chainId, connectedChainId, isChainSwitching])

    useEffect(() => {
        if (chainId && nativeTokenAddress && nativeTokenPrice === 0) {
            refetchNativeTokenPrice()
        }
    }, [chainId, nativeTokenAddress, nativeTokenPrice])

    useEffect(() => {
        if (chainId && tokenInInfo) {
            refetchTokensPrices();
        }
    }, [chainId, tokenInInfo]);

    const onSuccessCallback = async (txData: EnSoResponse) => {
        if (signer) {
            setConfirming("Executing...");
            // execute defi action
            const transactionResponse = await signer.sendTransaction(txData.tx).catch(() => {
                setConfirming("")
                return null;
            });
            if (transactionResponse) {
                const receipt = await transactionResponse.wait();
                setHash(receipt.transactionHash);
                setTxModalOpen(true);
                await refetchDefiPositionByWallet();
                await refetchDefiProtocolByWallet();

                setTokenAmount("");
                setShowPreview(false);
                setModalState({ type: null });
                setSelectedTab('overview');
            }
        }
        setConfirming("");
    }

    const onErrorCallback = async (e: Error) => {
        console.error(e)
        setConfirming("");
    }

    const lendHandler = async () => {
        if (signer && Number(tokenAmount) > 0) {
            setConfirming("Approving...");
            const lendTokenInfo = LENDING_LIST.find((token) => {
                return token.chainId === Number(chainId) && token.protocol === modalState.position?.protocol && token.tokenIn.symbol === modalState?.position.tokens[0].symbol
            });
            const tokenInInfo = lendTokenInfo?.tokenIn ? lendTokenInfo?.tokenIn : null;
            const tokenOutInfo = lendTokenInfo?.tokenOut ? lendTokenInfo?.tokenOut : null;

            switch (walletType) {
                case WalletTypeEnum.EOA:
                    enSoActionMutation({
                        chainId: Number(chainId),
                        fromAddress: address,
                        routingStrategy: "router",
                        action: "deposit",
                        protocol: (modalState.position?.protocol_id || "").toLowerCase(),
                        tokenIn: [tokenInInfo?.contract_address || ""],
                        tokenOut: [tokenOutInfo?.contract_address || ""],
                        amountIn: [Number(tokenAmount)],
                        signer: signer,
                        receiver: address,
                        gasPrice: gasData.gasPrice,
                        gasLimit: gasData.gasLimit
                    }, {
                        onSuccess: onSuccessCallback,
                        onError: onErrorCallback
                    })
                    break;
                case WalletTypeEnum.EMBEDDED:
                    enSoActionMutation({
                        chainId: Number(chainId),
                        fromAddress: address,
                        routingStrategy: "router",
                        action: "deposit",
                        protocol: (modalState.position?.protocol_id || "").toLowerCase(),
                        tokenIn: [tokenInInfo?.contract_address || ""],
                        tokenOut: [tokenOutInfo?.contract_address || ""],
                        amountIn: [Number(tokenAmount)],
                        signer: signer,
                        receiver: address,
                        gasPrice: gasData.gasPrice,
                        gasLimit: gasData.gasLimit
                    }, {
                        onSuccess: onSuccessCallback,
                        onError: onErrorCallback
                    })
                    break;
                default:
                    break;
            }
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            {
                hash && <TransactionModal open={txModalOpen} setOpen={setTxModalOpen} link={`${mapChainId2ExplorerUrl[Number(chainId)]}/tx/${hash}`} checkBalance={true} />
            }
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
                        Lend
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

                    <>
                        <SelectChain
                            chainList={modalState?.supportedChains || []}
                            selectedChain={Number(chainId)}
                            setSelectedChain={setChainId}

                        />

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
                                    <TokenChainIcon src={tokenInInfo?.logo || ""} alt={tokenInInfo?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                                    <span className='ml-2'>
                                        {tokenInInfo?.symbol || ""}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-2 text-sm">
                                <span className="text-white/60">
                                    {`Balance: ${formatNumberByFrac(Number(tokenInBalance?.balance) || 0)}`}
                                </span>
                                <button className="text-blue-400" onClick={() => {
                                    setTokenAmount((tokenInBalance?.balance || "") + "");
                                }}>MAX</button>
                            </div>
                        </div>

                        <div className='mt-2 mb-2 flex flex-col gap-3'>

                            <div className='flex justify-between'>
                                <div>
                                    <span className='ml-2 text-sm text-white/60'>
                                        Collateralization
                                    </span>
                                </div>
                                <div className='items-center flex'>
                                    <span className='ml-2 text-sm text-green-500'>
                                        Enabled
                                    </span>
                                </div>
                            </div>

                            <div className='flex justify-between'>
                                <div>
                                    <span className='ml-2 text-sm text-white/60'>
                                        USD Value
                                    </span>
                                </div>
                                <div className='items-center flex'>
                                    <span className='ml-2 text-sm'>
                                        {
                                            isGasEstimationLoading ?
                                                <Skeleton startColor="#444" endColor="#1d2837" w={'4rem'} h={'1rem'}></Skeleton>
                                                : `$ ${formatNumberByFrac((Number(tokenAmount) * Number(tokenInPrice)) || 0)}`}
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

                    <button
                        className={`w-full py-3 bg-blue-500 hover:bg-blue-600 transition-colors rounded-xl font-medium ${isErrorTokenAmount || confirming ? "opacity-60" : ""} flex align-center justify-center`} disabled={isErrorTokenAmount}
                        onClick={async () => {
                            if (!isCorrectChain) {
                                switchChain(Number(chainId));
                            } else if (tokenAmount) {
                                lendHandler();
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

export default LendModal;