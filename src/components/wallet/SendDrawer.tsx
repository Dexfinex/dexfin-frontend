import React, { useState, useMemo, useContext, useEffect } from 'react';
import { Skeleton } from '@chakra-ui/react';
import { Search, ArrowRight, ChevronDown, Wallet } from 'lucide-react';
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ethers } from "ethers";

import { TransactionModal } from '../swap/modals/TransactionModal.tsx';
import useGasEstimation from "../../hooks/useGasEstimation.ts";
import useTokenStore from "../../store/useTokenStore.ts";
import useGetTokenPrices from '../../hooks/useGetTokenPrices';
import { Drawer } from '../common/Drawer';
import { formatNumberByFrac } from '../../utils/common.util';
import { Web3AuthContext } from "../../providers/Web3AuthContext.tsx";
import { mapChainId2NativeAddress } from "../../config/networks.ts";
import { useSendTransactionMutation } from '../../hooks/useSendTransactionMutation.ts';
import { TransactionError } from '../../types';
import { mapChainId2ExplorerUrl } from '../../config/networks.ts';
import { TokenChainIcon } from '../swap/components/TokenIcon.tsx';

interface SendDrawerProps {
  isOpen: boolean;
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

export const SendDrawer: React.FC<SendDrawerProps> = ({ isOpen, onClose, assets }) => {
  const [showAssetSelector, setShowAssetSelector] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(assets[0] || {})
  const [isConfirming, setIsConfirming] = useState(false);
  const [hash, setHash] = useState("")
  const [txModalOpen, setTxModalOpen] = useState(false);

  const { mutate: sendTransactionMutate } = useSendTransactionMutation();
  const { signer, isConnected, login } = useContext(Web3AuthContext);

  const { chainId } = useContext(Web3AuthContext);

  const schema = z.object({
    amount: z.number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number"
    }).gt(0).lte(selectedAsset.amount),
    address: z.string()
      .refine((value) => ethers.utils.isAddress(value), {
        message: "Provided address is invalid.",
      }),
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
  const address = watch("address")

  const submitDisabled = useMemo(() => {
    return !amount || !address || isConfirming
  }, [amount, address, isConfirming])

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
  }, [getTokenPrice, nativeTokenAddress, tokenChainId, tokenPrices])

  useEffect(() => {
    if (tokenChainId && nativeTokenAddress && nativeTokenPrice === 0) {
      refetchNativeTokenPrice()
    }
  }, [tokenChainId, nativeTokenAddress, nativeTokenPrice])

  const onSubmit = () => {
    setIsConfirming(true);
    sendTransactionMutate(
      {
        tokenAddress: selectedAsset.address,
        sendAddress: address,
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
    asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Send Assets">
      {
        hash && <TransactionModal open={txModalOpen} setOpen={setTxModalOpen} link={`${mapChainId2ExplorerUrl[chainId!]}/tx/${hash}`} />
      }
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
                <div className="font-medium">{selectedAsset.name}</div>
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
                          <div className="font-medium">{asset.name}</div>
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
          <div className="relative">
            {errors.amount?.message && <p className='text-red-500 text-xs italic'>{errors.amount?.message}</p>}
            <input
              type="number"
              step="any"
              placeholder="0.00"
              className={`w-full bg-white/5 border ${errors.amount ? "border-red-500" : "border-white/10"} rounded-lg px-4 py-3 outline-none focus:border-white/20`}
              {...register("amount", {
                valueAsNumber: true,
                validate: (value) => Number(value) > 0,

              })}
            />
            <button
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
          </div>
          <div className="mt-1 text-sm text-white/40">
            Available: {`${formatNumberByFrac(selectedAsset.amount)} ${selectedAsset.symbol}`}
          </div>
        </div>

        {/* Address Input */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Send To</label>
          {errors.address?.message && <p className='text-red-500 text-xs italic'>{errors.address?.message}</p>}
          <input
            type="text"
            value={address}
            placeholder="Enter wallet address or ENS name"
            className={`w-full bg-white/5 border ${errors.address ? "border-red-500" : "border-white/10"} rounded-lg px-4 py-3 outline-none focus:border-white/20`}
            {...register("address")}
          />
        </div>
        {/* Preview */}
        {(amount && address && !errors.amount && !errors.address) ? (
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <TokenChainIcon src={selectedAsset.logo} alt={selectedAsset.name} size={"lg"} chainId={Number(chainId)} />
                <div>
                  <div className="text-sm text-white/60">You send</div>
                  <div className="font-medium">
                    {`${formatNumberByFrac(amount)} ${selectedAsset.symbol}`}
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/40" />
              <div>
                <div className="text-sm text-white/60">To</div>
                <div className="font-medium font-mono">
                  {address.slice(0, 6)}...{address.slice(-4)}
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
              type="submit"
              disabled={submitDisabled}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
            >
              Send {selectedAsset.symbol}
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
    </Drawer>
  );
};