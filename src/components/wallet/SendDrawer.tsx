import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Skeleton, SkeletonCircle, Spinner, useToast } from '@chakra-ui/react';
import { ArrowLeft, ArrowRight, ChevronDown, Search, Wallet, XCircle, Camera, Loader } from 'lucide-react';
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEnsAddress, useEnsAvatar } from 'wagmi';
import { normalize } from 'viem/ens';
import { ethers } from 'ethers';

import { TransactionModal } from '../swap/modals/TransactionModal.tsx';
import useGasEstimation from "../../hooks/useGasEstimation.ts";
import useTokenStore from "../../store/useTokenStore.ts";
import useGetTokenPrices from '../../hooks/useGetTokenPrices';
import { formatNumberByFrac, isValidAddress, shrinkAddress } from '../../utils/common.util';
import { Web3AuthContext } from "../../providers/Web3AuthContext.tsx";
import { mapChainId2ExplorerUrl, mapChainId2NativeAddress } from "../../config/networks.ts";
import { useSendTransactionMutation } from '../../hooks/useSendTransactionMutation.ts';
import { TransactionError } from '../../types';
import { TokenChainIcon, TokenIcon } from '../swap/components/TokenIcon.tsx';
import { useStore } from '../../store/useStore.ts';
import { PageType } from '../WalletDrawer.tsx';
import useTokenBalanceStore, { TokenBalance } from '../../store/useTokenBalanceStore.ts';
import makeBlockie from 'ethereum-blockies-base64';
import { SOLANA_CHAIN_ID } from "../../constants/solana.constants.ts";
import { LOCAL_STORAGE_RECENT_ADDRESSES } from '../../constants';
import { getGasEstimationForNativeTokenTransfer } from '../../utils/chains.util.tsx';
import { getRealNativeTokenAddress } from "../../utils/token.util.ts";
import { Html5QrcodeScanner } from "html5-qrcode";

interface SendDrawerProps {
    setPage: (type: PageType) => void;
}

interface FormValues extends FieldValues {
    amount: number | "";
    address: string;
    searchQuery: string;
}

export const SendDrawer: React.FC<SendDrawerProps> = ({ setPage }) => {
    const toast = useToast()
    const { theme } = useStore();
    const { mutate: sendTransactionMutate } = useSendTransactionMutation();
    const { isChainSwitching, chainId, signer, isConnected, login, switchChain, walletType, transferSolToken } = useContext(Web3AuthContext);
    const { tokenBalances, setTokenBalances } = useTokenBalanceStore();
    const [showAssetSelector, setShowAssetSelector] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(tokenBalances[0] || {})
    const [isConfirming, setIsConfirming] = useState(false);
    const [hash, setHash] = useState("")
    const [txModalOpen, setTxModalOpen] = useState(false);
    const [showEnsList, setShowEnsList] = useState(true);
    const [address, setAddress] = useState("");
    const [showSelectedEnsInfo, setShowSelectedEnsInfo] = useState(false);
    const [recentAddresses, setRecentAddresses] = useState<string[]>([]);
    const [isTokenSwitching, setIsTokenSwitching] = useState(false);
    const [currentNativeTokenGasfee, setCurrentNativeTokenGasfee] = useState(0); //only used for native tokens
    const [scanning, setScanning] = useState(false);

    useEffect(() => {
        if (tokenBalances.length > 0 && Object.keys(selectedAsset).length === 0) {
            setSelectedAsset(tokenBalances[0])
        }
    }, [tokenBalances, selectedAsset])

    useEffect(() => {
        const item = localStorage.getItem(LOCAL_STORAGE_RECENT_ADDRESSES)
        if (item) {
            const addresses = JSON.parse(item)
            setRecentAddresses(addresses)
        }
    }, [])

    const switching = useMemo(() => {
        return isTokenSwitching || isChainSwitching
    }, [isTokenSwitching, isChainSwitching])

    const schema = z.object({
        amount: z.number({
            required_error: "Amount is required",
            invalid_type_error: "Incorrect balance"
        }).gt(0).lte(selectedAsset.balance),
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
            // if (targetChainId !== SOLANA_CHAIN_ID && Number(chainId) !== targetChainId) {
            const nativeTokenAddress = getRealNativeTokenAddress(tokenChainId)
            if (Number(chainId) !== targetChainId) {
                switchToken(nativeTokenAddress)
            }
        }
    }, [chainId, selectedAsset])

    const setNativeTokenGasFee = async (nativeTokenAddress: string) => {
        if (selectedAsset.network?.name === "Solana") {
            if (selectedAsset.tokenId === "solana") {
                const gasFee = await getGasEstimationForNativeTokenTransfer(address, selectedAsset.balance.toString(), selectedAsset.decimals, selectedAsset.network?.chainId || 0)
                setCurrentNativeTokenGasfee(gasFee)
            } else if (currentNativeTokenGasfee != 0) {
                setCurrentNativeTokenGasfee(0)
            }
        } else {
            if (nativeTokenAddress.toLowerCase() == selectedAsset.address) {
                const _address = showSelectedEnsInfo ? ensAddress as unknown as string : address
                const gasFee = await getGasEstimationForNativeTokenTransfer(_address, selectedAsset.balance.toString(), selectedAsset.decimals, selectedAsset.network?.chainId || 0)
                setCurrentNativeTokenGasfee(gasFee)
            } else if (currentNativeTokenGasfee != 0) {
                setCurrentNativeTokenGasfee(0)
            }
        }
    }

    const switchToken = async (nativeTokenAddress: string) => {
        setIsTokenSwitching(true)
        await setNativeTokenGasFee(nativeTokenAddress)
        if (selectedAsset.network?.name != "Solana" && nativeTokenAddress.toLowerCase() != selectedAsset.address) {
            await switchChain(Number(selectedAsset.chain))
        }
        setIsTokenSwitching(false)
    }

    const ensAddressDataResponse = useEnsAddress({
        name: normalizedAddress,
    });

    const { data: ensAddress } = ensAddressDataResponse

    const ensAvatarDataResponse = useEnsAvatar({
        name: normalizedAddress,
    });

    const { isLoading: ensAvatarLoading, data: ensAvatar } = ensAvatarDataResponse

    const submitDisabled = useMemo(() => {
        if (selectedAsset.network?.name != "Solana") {
            return !amount || isConfirming || !(ethers.utils.isAddress(address) || showSelectedEnsInfo)
        } else {
            return !amount || isConfirming || !isValidAddress(address, SOLANA_CHAIN_ID) || showSelectedEnsInfo
        }
    }, [amount, address, isConfirming, showSelectedEnsInfo])

    const showPreview = useMemo(() => {
        if (selectedAsset.network?.name != "Solana") {
            return (amount && address && (ethers.utils.isAddress(address) || showSelectedEnsInfo))
        } else {
            return (amount && address && isValidAddress(address, SOLANA_CHAIN_ID) || showSelectedEnsInfo)
        }
    }, [amount, address, showSelectedEnsInfo])

    const errorAddress = useMemo(() => {
        if (address.startsWith("0x")) {
            return !ethers.utils.isAddress(address);
        }
        return false;
    }, [address])

    const { getTokenPrice } = useTokenStore()

    const tokenChainId = Number(selectedAsset.network?.chainId || '0');
    const priceNativeTokenAddress = mapChainId2NativeAddress[tokenChainId]

    const { refetch: refetchNativeTokenPrice } = useGetTokenPrices({
        tokenAddresses: [priceNativeTokenAddress],
        chainId: tokenChainId,
    })

    const nativeTokenPrice = useMemo(() => {
        if (tokenChainId && priceNativeTokenAddress) {
            return getTokenPrice(priceNativeTokenAddress, tokenChainId)
        }
        return 0;
    }, [getTokenPrice, priceNativeTokenAddress, tokenChainId])

    useEffect(() => {
        if (tokenChainId && priceNativeTokenAddress && nativeTokenPrice === 0) {
            refetchNativeTokenPrice()
        }
    }, [tokenChainId, priceNativeTokenAddress, nativeTokenPrice])

    const updateBalance = () => {
        const updated = tokenBalances.map(token => {
            if (token.address == selectedAsset.address) {
                return {
                    ...token,
                    balance: token.balance - Number(amount)
                } as TokenBalance
            }

            return token
        })

        setSelectedAsset(prev => {
            return {
                ...prev,
                balance: prev.balance - Number(amount)
            }
        })
        setTokenBalances([...updated])
    }

    const onSubmit = async () => {
        setIsConfirming(true)
        if (selectedAsset.network?.name === "Solana") {
            if (Number(amount) > 0) {
                let realAmount: number = Number(amount)

                if (currentNativeTokenGasfee) {
                    realAmount -= currentNativeTokenGasfee
                }

                const signature = await transferSolToken(address, selectedAsset.address, realAmount, selectedAsset.decimals)
                if (signature) {
                    updateBalance()
                    setHash(signature)
                    setTxModalOpen(true)
                    setValue("amount", "")
                    saveAddress(address)
                    setAddress("")
                } else {
                    toast({
                        status: 'error',
                        description: `Something went wrong. Please check your wallet connection.`,
                        duration: 4000
                    })
                }

                setIsConfirming(false)
            }
        } else {
            if (Number(chainId) !== Number(selectedAsset.chain)) {
                await switchChain(Number(selectedAsset.chain)).catch(() => {
                    return setIsConfirming(false)
                });
            }
            const _address = showSelectedEnsInfo ? ensAddress as unknown as string : address
            let realAmount: number = Number(amount)

            if (currentNativeTokenGasfee) {
                realAmount -= currentNativeTokenGasfee
            }

            sendTransactionMutate(
                {
                    tokenAddress: selectedAsset.address,
                    sendAddress: _address,
                    sendAmount: Number(realAmount),
                    signer,
                    gasLimit: gasData.gasLimit,
                    gasPrice: gasData.gasPrice,
                },
                {
                    onSuccess: (receipt) => {
                        updateBalance()
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
                        toast({
                            status: 'error',
                            description: `Something went wrong. Please check your wallet connection.`,
                            duration: 4000
                        })
                    },
                },
            );
            setIsConfirming(false);
        }
    };

    const filteredAssets = useMemo(() => {
        return tokenBalances.filter(token =>
            token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            token.address.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [tokenBalances, searchQuery]);

    const startScanner = () => {
        const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
        console.log('scanner = ', scanner)
        scanner.render(
            (decodedText) => {
                setAddress(decodedText)
                setScanning(false)
                scanner.clear()
            },
            (error) => {
                console.log(error)
                setScanning(false)
            }
        );
    };

    const handleQrCodeScan = () => {
        setScanning(true);
        setTimeout(() => {
            startScanner()
        }, 1000);
    }

    // if (!isOpen) return null;
    const renderUsdValue = () => {
        const price = tokenBalances.find(token => token.address === selectedAsset.address && token.tokenId === selectedAsset.tokenId)?.usdPrice || 0
        const value = amount ? amount * price : 0
        return <span className={`${amount !== selectedAsset.balance ? "right-14" : "right-3"} absolute  top-1/2 -translate-y-1/2 text-white/60 text-xs`}>${formatNumberByFrac(value)}</span>
    }

    const renderRecent = () => {
        let filtered: string[] = []

        if (selectedAsset.network?.name === "Solana") {
            filtered = recentAddresses.filter(address => /^[1-9A-HJ-NP-Za-km-zZ]{32,44}$/.test(address))
        } else {
            filtered = recentAddresses.filter(address => /^0x[a-fA-F0-9]{40}$/.test(address))
        }

        return filtered.map((address, index) => <div key={index} onClick={() => setAddress(address)} className='cursor-pointer text-sm py-2 px-1 rounded-md text-white/70 hover:bg-white/10 flex items-center gap-2'>
            <img src={makeBlockie(address)} className='w-8 h-8 rounded-full' />
            <span>{shrinkAddress(address)}</span>
        </div>)
    }

    const saveAddress = (address: string) => {
        let addresses = JSON.parse(localStorage.getItem(LOCAL_STORAGE_RECENT_ADDRESSES) || "[]");
        if (!addresses.includes(address)) {
            addresses.unshift(address);
            addresses = addresses.slice(0, 5); // Keep only the last 5 addresses
        }

        localStorage.setItem(LOCAL_STORAGE_RECENT_ADDRESSES, JSON.stringify(addresses));
    }

    return (
        <div className="mt-4 sm:mt-5 mx-4">
            {
                hash && <TransactionModal open={txModalOpen} setOpen={setTxModalOpen}
                    link={`${mapChainId2ExplorerUrl[Number(selectedAsset.chain)]}/tx/${hash}`} checkBalance={true} />
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
                                    {/* {!compareWalletAddresses(selectedAsset.address, mapChainId2NativeAddress[Number(selectedAsset.chain)]) &&
                                        <span className='ml-1 text-sm font-light'>({shrinkAddress(selectedAsset.address || "", 4)})</span>} */}
                                </div>
                                <div className="text-sm text-white/60">
                                    Balance: {`${formatNumberByFrac(selectedAsset.balance, 5)} ${selectedAsset.symbol}`}
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
                                                        {/* {!compareWalletAddresses(asset.address, mapChainId2NativeAddress[Number(asset.chain)]) &&
                                                            <span
                                                                className='ml-1 text-sm font-light'>({shrinkAddress(asset.address, 10)})</span>} */}
                                                    </div>
                                                    <div className="text-sm text-white/60">
                                                        {`${formatNumberByFrac(asset.balance, 5)} ${asset.symbol}`}
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
                            disabled={switching ? true : false}
                        />

                        {
                            (amount && amount > 0) ? renderUsdValue() : null
                        }

                        {
                            amount !== selectedAsset.balance &&
                            < button
                                type="button"
                                onClick={() =>
                                    setValue("amount", selectedAsset.balance, {
                                        shouldValidate: true,
                                    })
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-sm text-blue-400 hover:text-blue-300"
                                disabled={switching ? true : false}
                            >
                                MAX
                            </button>
                        }
                    </div>
                    <div className="mt-1 text-sm text-white/40">
                        Available: {`${formatNumberByFrac(selectedAsset.balance, 5)} ${selectedAsset.symbol}`}
                    </div>
                </div>

                {/* Address Input */}
                <div className='relative'>
                    <div className='mb-2 flex justify-between items-center'>
                        <label className="text-sm text-white/60">Send To</label>
                        {!scanning ?
                            <button className='text-white/80 mr-3 bg-white/10 p-2 rounded-full hover:bg-white/15' onClick={handleQrCodeScan}>
                                <Camera />

                            </button>
                            :
                            <Loader className="w-8 h-8 animate-spin text-blue-400" />}
                    </div>
                    {scanning && <div id="reader" className='!w-screen !h-screen !fixed !top-0 !left-0 !z-[100]'></div>}

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
                                        {shrinkAddress(ensAddress || "")}
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
                                                {shrinkAddress(ensAddress || "")}
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
                        renderRecent()
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
                                        {`${formatNumberByFrac(Number(amount) - currentNativeTokenGasfee, 5)} ${selectedAsset.symbol}`}
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
                                                    <div>{shrinkAddress(ensAddress || "", 4)}</div>
                                                </div>
                                            </div> : `${shrinkAddress(address)}`
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
                            disabled={submitDisabled || !!errors.amount || switching}
                            className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors font-medium flex align-center justify-center"
                        >
                            {
                                isConfirming ?
                                    (
                                        <div className='flex items-center'>
                                            <Spinner size="md" className='mr-2' /> Confirming...
                                        </div>
                                    ) : (switching && selectedAsset.network?.name != "Solana") ? (
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