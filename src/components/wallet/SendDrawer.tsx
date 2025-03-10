import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Skeleton, SkeletonCircle, Spinner} from '@chakra-ui/react';
import {ArrowLeft, ArrowRight, ChevronDown, Search, Wallet, XCircle} from 'lucide-react';
import {FieldValues, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {useEnsAddress, useEnsAvatar} from 'wagmi';
import {normalize} from 'viem/ens';
import {ethers} from 'ethers';

import {TransactionModal} from '../swap/modals/TransactionModal.tsx';
import useGasEstimation from "../../hooks/useGasEstimation.ts";
import useTokenStore from "../../store/useTokenStore.ts";
import useGetTokenPrices from '../../hooks/useGetTokenPrices';
import {compareWalletAddresses, formatNumberByFrac, shrinkAddress} from '../../utils/common.util';
import {Web3AuthContext} from "../../providers/Web3AuthContext.tsx";
import {mapChainId2ExplorerUrl, mapChainId2NativeAddress} from "../../config/networks.ts";
import {useSendTransactionMutation} from '../../hooks/useSendTransactionMutation.ts';
import {TransactionError} from '../../types';
import {TokenChainIcon, TokenIcon} from '../swap/components/TokenIcon.tsx';
import {cropString} from '../../utils/index.ts';
import {useStore} from '../../store/useStore.ts';
import {PageType} from '../WalletDrawer.tsx';
import useTokenBalanceStore from '../../store/useTokenBalanceStore.ts';
import makeBlockie from 'ethereum-blockies-base64';
import {SOLANA_CHAIN_ID} from "../../constants/solana.constants.ts";

interface SendDrawerProps {
    // isOpen: boolean;
    selectedAssetIndex: number;
    // onClose: () => void;
    assets: {
        name: string;
        address: string;
        symbol: string;
        amount: number;
        logo: string;
        chain: number;
        decimals: number;
        network: string;
    }[];
    setPage: (type: PageType) => void;
}

interface FormValues extends FieldValues {
    amount: number | "";
    address: string;
    searchQuery: string;
}

export const SendDrawer: React.FC<SendDrawerProps> = ({ assets, selectedAssetIndex = 0, setPage }) => {
    const [showAssetSelector, setShowAssetSelector] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(assets[selectedAssetIndex] || {})
    const [isConfirming, setIsConfirming] = useState(false);
    const [hash, setHash] = useState("")
    const [txModalOpen, setTxModalOpen] = useState(false);
    const [showEnsList, setShowEnsList] = useState(true);
    const [address, setAddress] = useState("");
    const [showSelectedEnsInfo, setShowSelectedEnsInfo] = useState(false);
    const { theme } = useStore();
    const { tokenBalances } = useTokenBalanceStore();
    const [recentAddresses, setRecentAddresses] = useState<string[]>([]);
    const { mutate: sendTransactionMutate } = useSendTransactionMutation();
    const { isChainSwitching, chainId, signer, isConnected, login, switchChain, walletType, transferSolToken } = useContext(Web3AuthContext);

    useEffect(() => {
        setSelectedAsset(assets[selectedAssetIndex] || {})
    }, [assets, selectedAssetIndex])

    useEffect(() => {
        if (assets.length > 0 && Object.keys(selectedAsset).length === 0) {
            setSelectedAsset(assets[0])
        }
    }, [assets, selectedAsset])

    useEffect(() => {
        const item = localStorage.getItem("recentSendAddresses")
        if (item) {
            const addresses = JSON.parse(item)
            setRecentAddresses(addresses)
        }
    }, [])

    const schema = z.object({
        amount: z.number({
            required_error: "Amount is required",
            invalid_type_error: "Incorrect balance"
        }).gt(0).lte(selectedAsset.amount),
        address: z.string(),
    });

    const {
        isLoading: isGasEstimationLoading,
        data: gasData
    } = useGasEstimation()

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
        mode: 'onChange',
        resolver: zodResolver(schema),
        defaultValues: {
            amount: "",
            address: "",
            searchQuery: ""
        }
    });

    const searchQuery = watch("searchQuery")
    const amount = watch("amount")

    const normalizedAddress = useMemo(() => {
        try {
            return normalize(address)
        } catch (e) {
            return ""
        }
    }, [address])

    useEffect(() => {
        setShowEnsList(true)
        setShowSelectedEnsInfo(false)
    }, [address])
    
    useEffect(() => {
        if (selectedAsset) {
            const targetChainId = Number(selectedAsset.chain)
            if (targetChainId !== SOLANA_CHAIN_ID && Number(chainId) !== targetChainId) {
                switchChain(Number(selectedAsset.chain));
            }
        }
    }, [chainId, selectedAsset, switchChain])

    const ensAddressDataResponse = useEnsAddress({
        name: normalizedAddress,
    });

    const { data: ensAddress } = ensAddressDataResponse

    const ensAvatarDataResponse = useEnsAvatar({
        name: normalizedAddress,
    });

    const { isLoading: ensAvatarLoading, data: ensAvatar } = ensAvatarDataResponse

    const submitDisabled = useMemo(() => {
        if (selectedAsset.network != "Solana") {
            return !amount || isConfirming || !(ethers.utils.isAddress(address) || showSelectedEnsInfo)
        } else {
            return !amount || isConfirming || !address || showSelectedEnsInfo
        }
    }, [amount, address, isConfirming, showSelectedEnsInfo])

    const showPreview = useMemo(() => {
        return (amount && address && (ethers.utils.isAddress(address) || showSelectedEnsInfo))
    }, [amount, address, showSelectedEnsInfo])

    const errorAddress = useMemo(() => {
        if (address.startsWith("0x")) {
            return !ethers.utils.isAddress(address);
        }
        return false;
    }, [address])

    const { getTokenPrice } = useTokenStore()

    const tokenChainId = Number(chainId);
    const nativeTokenAddress = mapChainId2NativeAddress[tokenChainId]

    const { refetch: refetchNativeTokenPrice } = useGetTokenPrices({
        tokenAddresses: [nativeTokenAddress],
        chainId: tokenChainId,
    })

    const nativeTokenPrice = useMemo(() => {
        if (tokenChainId && nativeTokenAddress) {
            return getTokenPrice(nativeTokenAddress, tokenChainId)
        }
        return 0;
    }, [getTokenPrice, nativeTokenAddress, tokenChainId])

    useEffect(() => {
        if (tokenChainId && nativeTokenAddress && nativeTokenPrice === 0) {
            refetchNativeTokenPrice()
        }
    }, [tokenChainId, nativeTokenAddress, nativeTokenPrice])

    const onSubmit = async () => {
        setIsConfirming(true);
        if (selectedAsset.network === "Solana") {
            if (Number(amount) > 0) {
                const signature = await transferSolToken(address, selectedAsset.address, Number(amount), selectedAsset.decimals)
                setHash(signature)
                setTxModalOpen(true)
                setValue("amount", "")
                saveAddress(address)
                setAddress("")
                setIsConfirming(false)
            }
        } else {
            if (Number(chainId) !== Number(selectedAsset.chain)) {
                await switchChain(Number(selectedAsset.chain)).catch(() => {
                    return setIsConfirming(false)
                });
            }
            const _address = showSelectedEnsInfo ? ensAddress as unknown as string : address

            sendTransactionMutate(
                {
                    tokenAddress: selectedAsset.address,
                    sendAddress: _address,
                    sendAmount: Number(amount),
                    signer,
                    gasLimit: gasData.gasLimit,
                    gasPrice: gasData.gasPrice,
                },
                {
                    onSuccess: (receipt) => {
                        setIsConfirming(false);
                        setHash(receipt.transactionHash)
                        setTxModalOpen(true)
                        setValue("amount", "")
                        saveAddress(address)
                        setAddress("")
                        console.log('success', receipt);
                    },
                    onError: (error: TransactionError) => {
                        setIsConfirming(false);
                        console.log(error)
                    },
                },
            );
        }
    };

    const filteredAssets = assets.filter(asset =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // if (!isOpen) return null;
    const renderUsdValue = () => {
        const price = tokenBalances.find(token => token.address === selectedAsset.address)?.usdPrice || 0
        const value = amount ? amount * price : 0
        return <span className={`${amount !== selectedAsset.amount ? "right-14" : "right-3"} absolute  top-1/2 -translate-y-1/2 text-white/60 text-xs`}>${formatNumberByFrac(value)}</span>
    }

    const saveAddress = (address: string) => {
        let addresses = JSON.parse(localStorage.getItem("recentSendAddresses") || "[]");
        if (!addresses.includes(address)) {
            addresses.unshift(address);
            addresses = addresses.slice(0, 3); // Keep only the last 3 addresses
        }

        localStorage.setItem("recentSendAddresses", JSON.stringify(addresses));
    }

    return (
        <div className="mt-4 sm:mt-5 mx-4">
            {
                hash && <TransactionModal open={txModalOpen} setOpen={setTxModalOpen}
                    link={`${mapChainId2ExplorerUrl[Number(selectedAsset.chain)]}/tx/${hash}`} />
            }
            {/* Header */}
            {/* <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <Send className="w-5 h-5" />
                        <h2 className="text-xl font-semibold">Send</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div> */}
            <button className={`rounded-full ${theme === "dark" ? "text-white/70 hover:bg-white/10" : "text-black/70 hover:bg-black/10"}  p-2`} onClick={() => setPage("main")}>
                <ArrowLeft className="w-5 h-5" />
            </button>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
                {/* Asset Selector */}
                <div>
                    <label className="block text-sm text-white/60 mb-2">Asset</label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowAssetSelector(!showAssetSelector)}
                            className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <TokenChainIcon src={selectedAsset.logo} alt={selectedAsset.name} size={"lg"}
                                chainId={Number(selectedAsset.chain)} />
                            <div className="flex-1 text-left">
                                <div className="font-medium">
                                    {selectedAsset.name}
                                    {!compareWalletAddresses(selectedAsset.address, mapChainId2NativeAddress[Number(selectedAsset.chain)]) &&
                                        <span className='ml-1 text-sm font-light'>({cropString(selectedAsset.address || "", 4)})</span>}
                                </div>
                                <div className="text-sm text-white/60">
                                    Balance: {`${formatNumberByFrac(selectedAsset.amount, 5)} ${selectedAsset.symbol}`}
                                </div>
                            </div>
                            <ChevronDown className="w-4 h-4 text-white/40" />
                        </button>

                        {showAssetSelector && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowAssetSelector(false)}
                                />
                                <div className="absolute top-full left-0 right-0 mt-2 p-2 glass rounded-lg z-20">
                                    <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg mb-2">
                                        <Search className="w-4 h-4 text-white/40" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setValue("searchQuery", e.target.value, {
                                                shouldValidate: true,
                                            })}
                                            placeholder="Search assets..."
                                            className="bg-transparent outline-none flex-1 text-sm"
                                        />
                                    </div>

                                    <div className="max-h-48 overflow-y-auto">
                                        {filteredAssets.map((asset) => (
                                            <button
                                                key={asset.name + asset.chain}
                                                type="button"
                                                onClick={async () => {
                                                    setSelectedAsset(asset)
                                                    setShowAssetSelector(false);
                                                    setValue("amount", "")
                                                }}
                                                className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors"
                                            >
                                                <TokenChainIcon src={asset.logo} alt={asset.name} size={"md"}
                                                    chainId={Number(asset.chain)} />
                                                <div className="flex-1 text-left">
                                                    <div className="font-medium">
                                                        {asset.name}
                                                        {!compareWalletAddresses(asset.address, mapChainId2NativeAddress[Number(asset.chain)]) &&
                                                            <span
                                                                className='ml-1 text-sm font-light'>({cropString(asset.address, 10)})</span>}
                                                    </div>
                                                    <div className="text-sm text-white/60">
                                                        {`${formatNumberByFrac(asset.amount, 5)} ${asset.symbol}`}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Amount Input */}
                <div>
                    <label className="block text-sm text-white/60 mb-2">Amount</label>
                    {errors.amount?.message &&
                        <p className='text-red-500 text-xs italic mb-1'>{errors.amount?.message}</p>}
                    <div className="relative">
                        <input
                            type="number"
                            step="any"
                            placeholder="0.00"
                            className={`w-full bg-white/5 border ${errors.amount ? "border-red-500" : "border-white/10"} rounded-lg px-4 py-3 outline-none focus:${errorAddress ? "border-red-500" : "border-white/10"}`}
                            {...register("amount", {
                                valueAsNumber: true,
                                validate: (value) => Number(value) > 0,

                            })}
                        />

                        {
                            (amount && amount > 0) ? renderUsdValue() : null
                        }

                        {
                            amount !== selectedAsset.amount &&
                            < button
                                type="button"
                                onClick={() =>
                                    setValue("amount", selectedAsset.amount, {
                                        shouldValidate: true,
                                    })
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-sm text-blue-400 hover:text-blue-300"
                            >
                                MAX
                            </button>
                        }
                    </div>
                    <div className="mt-1 text-sm text-white/40">
                        Available: {`${formatNumberByFrac(selectedAsset.amount, 5)} ${selectedAsset.symbol}`}
                    </div>
                </div>

                {/* Address Input */}
                <div className='relative'>
                    <label className="block text-sm text-white/60 mb-2">Send To</label>
                    {errorAddress && <p className='text-red-500 text-xs italic mb-1'>Incorrect address</p>}
                    {
                        !showSelectedEnsInfo ?
                            <input
                                type="text"
                                value={address}
                                placeholder="Enter wallet address or ENS name"
                                className={`w-full bg-white/5 border ${errorAddress ? "border-red-500" : "border-white/10"} rounded-lg px-4 py-3 outline-none focus:${errorAddress ? "border-red-500" : "border-white/10"}`}
                                onChange={(e) => {
                                    setAddress(e.target.value)
                                }}
                            />
                            :
                            <div
                                className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
                                {
                                    (ensAvatarLoading || !ensAvatar) ?
                                        <SkeletonCircle startColor="#444" endColor="#1d2837" w={'2rem'}
                                            h={'2rem'}></SkeletonCircle> :
                                        <img
                                            src={ensAvatar || ""}
                                            alt={address}
                                            className={`rounded-full ring-2 ring-white/10 group-hover:ring-blue-500/20 transition-all duration-300 w-8 h-8`}
                                        />
                                }
                                <div className="flex-1 text-left">
                                    <div className="font-medium">{address}</div>
                                    <div className="text-sm text-white/60">
                                        {cropString(ensAddress || "")}
                                    </div>
                                </div>
                                <XCircle onClick={() => {
                                    setShowSelectedEnsInfo(false);
                                    setAddress("");
                                    setShowEnsList(true);
                                }} />
                            </div>
                    }
                    {
                        showEnsList && ensAddress &&
                        <div onClick={() => setShowEnsList(false)}>
                            <div className="fixed inset-0 z-10" />
                            <div className="absolute top-full left-0 right-0 mt-2 p-2 glass rounded-lg z-20">
                                <div className="max-h-48 overflow-y-auto">
                                    <button
                                        key={ensAddress}
                                        type="button"
                                        onClick={() => {
                                            setShowEnsList(false) // close modal
                                            setShowSelectedEnsInfo(true) // render item
                                        }}
                                        className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors"
                                    >
                                        {
                                            (ensAvatarLoading || !ensAvatar) ?
                                                <SkeletonCircle startColor="#444" endColor="#1d2837" w={'2rem'}
                                                    h={'2rem'}></SkeletonCircle> :
                                                <TokenIcon src={ensAvatar as string} alt={address} size='lg' />
                                        }
                                        <div className="flex-1 text-left">
                                            <div className="font-medium">{address}</div>
                                            <div className="text-sm text-white/60">
                                                {cropString(ensAddress || "")}
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    }
                </div>

                {/* recent addresses */}
                {recentAddresses.length > 0 && <div>
                    <label className="block text-sm text-white/60 mb-2">Recent</label>
                    {
                        recentAddresses.map((address, index) => <div key={index} onClick={() => setAddress(address)} className='cursor-pointer text-sm py-2 px-1 rounded-md text-white/70 hover:bg-white/10 flex items-center gap-2'>
                            <img src={makeBlockie(address)} className='w-8 h-8 rounded-full' />
                            <span>{shrinkAddress(address)}</span>
                        </div>)
                    }
                </div>}

                {/* Preview */}
                {showPreview ? (
                    <div className="p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <TokenChainIcon src={selectedAsset.logo} alt={selectedAsset.name} size={"lg"}
                                    chainId={Number(selectedAsset.chain)} />
                                <div className='ml-3'>
                                    <div className="text-sm text-white/60">You send</div>
                                    <div className="font-medium">
                                        {`${formatNumberByFrac(Number(amount), 5)} ${selectedAsset.symbol}`}
                                    </div>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-white/40" />
                            <div>
                                <div className="text-sm text-white/60">To</div>
                                <div className="font-medium font-mono">
                                    {
                                        showSelectedEnsInfo ?
                                            <div className='flex flex-row justify-items-center items-center'>
                                                {
                                                    (ensAvatarLoading || !ensAvatar) ?
                                                        <SkeletonCircle startColor="#444" endColor="#1d2837"
                                                            w={'2rem'} h={'2rem'}></SkeletonCircle> :
                                                        <TokenIcon src={ensAvatar as string} alt={address}
                                                            size='lg' />
                                                }
                                                <div className='flex flex-col ml-2'>
                                                    <div>{address}</div>
                                                    <div>{cropString(ensAddress || "", 4)}</div>
                                                </div>
                                            </div> : `${cropString(address)}`
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='w-full flex justify-end items-end'>
                            {
                                walletType === "EMBEDDED" ?
                                    <span className='text-sm text-green-500'>Network Fee: Free</span> :
                                    <div className="text-sm text-white/60">
                                        Network Fee: {
                                            isGasEstimationLoading ?
                                                <Skeleton startColor="#444" endColor="#1d2837" w={'4rem'} h={'1rem'}></Skeleton>
                                                : `${formatNumberByFrac(nativeTokenPrice * gasData.gasEstimate, 2) === "0" ? "< 0.01$" : `$ ${formatNumberByFrac(nativeTokenPrice * gasData.gasEstimate, 2)}`}`}
                                    </div>}
                        </div>
                    </div>
                ) : null}

                {
                    isConnected ?
                        <button
                            type={`${isConfirming ? "button" : "submit"}`}
                            disabled={submitDisabled || !!errors.amount || isChainSwitching}
                            className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors font-medium flex align-center justify-center"
                        >
                            {
                                isConfirming ?
                                    (
                                        <div className='flex items-center'>
                                            <Spinner size="md" className='mr-2' /> Confirming...
                                        </div>
                                    ) : (isChainSwitching && selectedAsset.network != "Solana") ? (
                                        <div className='flex items-center'>
                                            <Spinner size="md" className='mr-2' /> Switching Chain...
                                        </div>
                                    ) : <div>Send {selectedAsset.symbol}</div>
                            }

                        </button>
                        :
                        <button
                            type="button"
                            className="w-full flex items-center justify-center py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
                            onClick={() => login()}
                        >
                            <Wallet className="w-5 h-5 mr-2" /> Connect
                        </button>
                }
            </form>
        </div>
    );
};