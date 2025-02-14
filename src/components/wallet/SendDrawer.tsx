import React, { useState, useMemo, useContext, useEffect } from 'react';
import { Skeleton, Spinner, SkeletonCircle, useMediaQuery } from '@chakra-ui/react';
import { X, Search, ArrowRight, ChevronDown, Wallet, XCircle, Send } from 'lucide-react';
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
import { formatNumberByFrac } from '../../utils/common.util';
import { Web3AuthContext } from "../../providers/Web3AuthContext.tsx";
import { mapChainId2NativeAddress } from "../../config/networks.ts";
import { useSendTransactionMutation } from '../../hooks/useSendTransactionMutation.ts';
import { TransactionError } from '../../types';
import { mapChainId2ExplorerUrl } from '../../config/networks.ts';
import { TokenChainIcon, TokenIcon } from '../swap/components/TokenIcon.tsx';
import { cropString } from '../../utils/index.ts';
import { compareWalletAddresses } from '../../utils/common.util';

interface SendDrawerProps {
  isOpen: boolean;
  selectedAssetIndex: number;
  onClose: () => void;
  assets: {
    name: string;
    address: string;
    symbol: string;
    amount: number;
    logo: string;
  }[];
}

interface FormValues extends FieldValues {
  amount: number | "";
  address: string;
  searchQuery: string;
}

export const SendDrawer: React.FC<SendDrawerProps> = ({ isOpen, onClose, assets, selectedAssetIndex = 0 }) => {
  const [showAssetSelector, setShowAssetSelector] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(assets[selectedAssetIndex] || {})
  const [isConfirming, setIsConfirming] = useState(false);
  const [hash, setHash] = useState("")
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [showEnsList, setShowEnsList] = useState(true);
  const [address, setAddress] = useState("");
  const [showSelectedEnsInfo, setShowSelectedEnsInfo] = useState(false);

  const { mutate: sendTransactionMutate } = useSendTransactionMutation();
  const { signer, isConnected, login } = useContext(Web3AuthContext);

  const { chainId } = useContext(Web3AuthContext);

  const [isLargerThan1200] = useMediaQuery('(min-width: 1200px)');
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)');

  const walletContainerWidth = useMemo(() => {
    if (isLargerThan1200) return 'w-[50%] rounded-xl';
    if (isLargerThan800) return 'w-[80%] rounded-xl';

    return 'w-full h-full rounded-none';

  }, [isLargerThan1200, isLargerThan800])

  useEffect(() => {
    setSelectedAsset(assets[selectedAssetIndex] || {})
  }, [selectedAssetIndex])

  useEffect(() => {
    if (assets.length > 0 && Object.keys(selectedAsset).length === 0) {
      setSelectedAsset(assets[0])
    }
  }, [assets, selectedAsset])

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

  const ensAddressDataResponse = useEnsAddress({
    name: normalizedAddress,
  });

  const { data: ensAddress } = ensAddressDataResponse

  const ensAvatarDataResponse = useEnsAvatar({
    name: normalizedAddress,
  });

  const { isLoading: ensAvatarLoading, data: ensAvatar } = ensAvatarDataResponse

  const submitDisabled = useMemo(() => {
    return !amount || !!errors.amount || isConfirming || !(ethers.utils.isAddress(address) || showSelectedEnsInfo)
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

  const { getTokenPrice, tokenPrices } = useTokenStore()

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

  const onSubmit = () => {
    setIsConfirming(true);
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
          setHash(receipt.blockHash)
          setTxModalOpen(true)
          setValue("amount", "")
          setValue("address", "")
          // onClose();
          console.log('success', receipt);
        },
        onError: (error: TransactionError) => {
          setIsConfirming(false);
          console.log(error)
        },
      },
    );
  };

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative glass border border-white/10 shadow-lg transition-all duration-300 ease-in-out ${walletContainerWidth}`}
      >
        {
          hash && <TransactionModal open={txModalOpen} setOpen={setTxModalOpen} link={`${mapChainId2ExplorerUrl[chainId!]}/tx/${hash}`} />
        }
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
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
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
          {/* Asset Selector */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Asset</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAssetSelector(!showAssetSelector)}
                className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <TokenChainIcon src={selectedAsset.logo} alt={selectedAsset.name} size={"lg"} chainId={Number(chainId)} />
                <div className="flex-1 text-left">
                  <div className="font-medium">
                    {selectedAsset.name}
                    {!compareWalletAddresses(selectedAsset.address, nativeTokenAddress) && <span className='ml-1 text-sm font-light'>({cropString(selectedAsset.address || "", 4)})</span>}
                  </div>
                  <div className="text-sm text-white/60">
                    Balance: {`${formatNumberByFrac(selectedAsset.amount)} ${selectedAsset.symbol}`}
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
                          key={asset.name}
                          type="button"
                          onClick={() => {
                            setSelectedAsset(asset)
                            setShowAssetSelector(false);
                          }}
                          className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <TokenChainIcon src={asset.logo} alt={asset.name} size={"md"} chainId={Number(chainId)} />
                          <div className="flex-1 text-left">
                            <div className="font-medium">
                              {asset.name}
                              {!compareWalletAddresses(asset.address, nativeTokenAddress) && <span className='ml-1 text-sm font-light'>({cropString(asset.address, 4)})</span>}
                            </div>
                            <div className="text-sm text-white/60">
                              {`${formatNumberByFrac(asset.amount)} ${asset.symbol}`}
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
            {errors.amount?.message && <p className='text-red-500 text-xs italic mb-1'>{errors.amount?.message}</p>}
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
              Available: {`${formatNumberByFrac(selectedAsset.amount)} ${selectedAsset.symbol}`}
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
                <div className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
                  {
                    (ensAvatarLoading || !ensAvatar) ? <SkeletonCircle startColor="#444" endColor="#1d2837" w={'2rem'} h={'2rem'}></SkeletonCircle> :
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
                        (ensAvatarLoading || !ensAvatar) ? <SkeletonCircle startColor="#444" endColor="#1d2837" w={'2rem'} h={'2rem'}></SkeletonCircle> :
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
          {/* Preview */}
          {showPreview ? (
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <TokenChainIcon src={selectedAsset.logo} alt={selectedAsset.name} size={"lg"} chainId={Number(chainId)} />
                  <div className='ml-3'>
                    <div className="text-sm text-white/60">You send</div>
                    <div className="font-medium">
                      {`${formatNumberByFrac(Number(amount))} ${selectedAsset.symbol}`}
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
                            (ensAvatarLoading || !ensAvatar) ? <SkeletonCircle startColor="#444" endColor="#1d2837" w={'2rem'} h={'2rem'}></SkeletonCircle> :
                              <TokenIcon src={ensAvatar as string} alt={address} size='lg' />
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
              <div className="text-sm text-white/60">
                Network Fee: {isGasEstimationLoading ? <Skeleton startColor="#444" endColor="#1d2837" w={'4rem'} h={'1rem'}></Skeleton> : `$${formatNumberByFrac(nativeTokenPrice * gasData.gasEstimate, 2)}`}
              </div>
            </div>
          ) : null}

          {
            isConnected ?
              <button
                type={`${isConfirming ? "button" : "submit"}`}
                disabled={submitDisabled}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors font-medium flex align-center justify-center"
              >
                {
                  isConfirming ?
                    <div><Spinner size="md" className='mr-2' /> Loading...</div>
                    : <div>Send {selectedAsset.symbol}</div>
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
    </div>
    // </Drawer>
  );
};