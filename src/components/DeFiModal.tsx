import React, { useState, useContext, useMemo, useEffect } from 'react';
import { Maximize2, Minimize2, X, ArrowLeft } from 'lucide-react';
import { Spinner, Skeleton } from '@chakra-ui/react';

import { TokenChainIcon } from './swap/components/TokenIcon';

import { useDefiPositionByWallet, useDefiProtocolsByWallet } from '../hooks/useDefi';
import { Web3AuthContext } from '../providers/Web3AuthContext';
import useDefiStore, { Position } from '../store/useDefiStore';
import useTokenBalanceStore from '../store/useTokenBalanceStore';
import { useSendDepositMutation } from '../hooks/useDeposit';
import { useRedeemEnSoMutation } from '../hooks/useRedeemEnSo.ts';
import useGasEstimation from "../hooks/useGasEstimation.ts";
import useGetTokenPrices from '../hooks/useGetTokenPrices';
import useTokenStore from "../store/useTokenStore.ts";
import { TransactionModal } from './swap/modals/TransactionModal.tsx';
import { PositionList } from './defi/PositionList.tsx';
import ProtocolStatistic from './defi/ProtocolStatistic.tsx';

import { mapChainId2ExplorerUrl } from '../config/networks.ts';
import { mapChainId2NativeAddress } from "../config/networks.ts";
import { formatNumberByFrac } from '../utils/common.util';
import { OfferingList } from './defi/OfferlingList.tsx';
import GlobalMetric from './defi/GlobalMetric.tsx';
import RedeemModal from './defi/RedeemModal.tsx';

interface DeFiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ModalState {
  type: 'deposit' | 'redeem' | 'borrow' | 'repay' | null;
  position?: Position;
}

export const DeFiModal: React.FC<DeFiModalProps> = ({ isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'explore'>('overview');
  const [selectedPositionType, setSelectedPositionType] = useState<Position['type'] | 'ALL'>('ALL');
  const [modalState, setModalState] = useState<ModalState>({ type: null });
  const [tokenAmount, setTokenAmount] = useState("");
  const [token2Amount, setToken2Amount] = useState("");
  const [confirming, setConfirming] = useState("");
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [hash, setHash] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const [withdrawPercent, setWithdrawPercent] = useState("1");

  const { mutate: sendDepositMutate } = useSendDepositMutation();
  const { mutate: redeemEnSoMutate } = useRedeemEnSoMutation();

  const { chainId, address, signer, } = useContext(Web3AuthContext);
  const { positions, } = useDefiStore();

  const { getTokenBalance } = useTokenBalanceStore();
  const { isLoading: isGasEstimationLoading, data: gasData } = useGasEstimation()

  const { isLoading: isLoadingPosition, refetch: refetchDefiPositionByWallet } = useDefiPositionByWallet({ chainId: chainId, walletAddress: address });
  const { isLoading: isLoadingProtocol, refetch: refetchDefiProtocolByWallet } = useDefiProtocolsByWallet({ chainId, walletAddress: address });

  const nativeTokenAddress = mapChainId2NativeAddress[Number(chainId)];

  const { refetch: refetchNativeTokenPrice } = useGetTokenPrices({
    tokenAddresses: [nativeTokenAddress],
    chainId: Number(chainId),
  })

  const { getTokenPrice, tokenPrices } = useTokenStore()

  const nativeTokenPrice = useMemo(() => {
    if (chainId && nativeTokenAddress) {
      return getTokenPrice(nativeTokenAddress, chainId)
    }
    return 0;
  }, [getTokenPrice, nativeTokenAddress, chainId, tokenPrices])

  useEffect(() => {
    if (chainId && nativeTokenAddress && nativeTokenPrice === 0) {
      refetchNativeTokenPrice()
    }
  }, [chainId, nativeTokenAddress, nativeTokenPrice])

  const isLoading = isLoadingPosition || isLoadingProtocol;

  const tokenBalance1 = modalState?.position ? getTokenBalance(modalState.position.tokens[0].contract_address, Number(chainId)) : null;
  const tokenInfo1 = modalState?.position ? modalState.position.tokens[0] : null;
  const tokenBalance2 = modalState?.position ? getTokenBalance(modalState.position.tokens[1].contract_address, Number(chainId)) : null;
  const tokenInfo2 = modalState?.position ? modalState.position.tokens[1] : null;

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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleAction = (type: 'deposit' | 'redeem' | 'borrow' | 'repay', position: Position) => {
    setModalState({ type, position });
  };

  const depositHandler = async () => {
    if (signer && Number(tokenAmount) > 0 && Number(token2Amount) > 0) {
      setConfirming("Approving...");

      sendDepositMutate({
        chainId: Number(chainId),
        fromAddress: address,
        routingStrategy: "router",
        action: "deposit",
        protocol: (modalState.position?.protocol_id || "").toLowerCase(),
        tokenIn: [tokenBalance1?.address || "", tokenBalance2?.address || ""],
        tokenOut: modalState?.position?.address || "",
        amountIn: [Number(tokenAmount), Number(token2Amount || 0)],
        primaryAddress: modalState.position?.factory || "",
        signer: signer,
        receiver: address,
        gasPrice: gasData.gasPrice,
        gasLimit: gasData.gasLimit
      }, {
        onSuccess: async (txData) => {
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
              setToken2Amount("");
              setShowPreview(false);
              setModalState({ type: null });
            }

          }
          setConfirming("");
        },
        onError: async (e) => {
          console.error(e)
          setConfirming("");
        }
      })
    }
  }

  const redeemHandler = async () => {
    if (!signer) return;

    setConfirming("Approving...");

    redeemEnSoMutate({
      chainId: Number(chainId),
      fromAddress: address,
      routingStrategy: "router",
      action: "redeem",
      protocol: (modalState.position?.protocol_id || "").toLowerCase(),
      tokenIn: modalState?.position?.address || "",
      tokenOut: [tokenBalance1?.address || "", tokenBalance2?.address || ""],
      withdrawPercent: Number(withdrawPercent),
      signer: signer,
      receiver: address,
      gasPrice: gasData.gasPrice,
      gasLimit: gasData.gasLimit
    }, {
      onSuccess: async (txData) => {
        if (signer) {
          setConfirming("Redeeming...");
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

            setWithdrawPercent("1");
            setShowPreview(false);
            setModalState({ type: null })
          }

        }
        setConfirming("");
      },
      onError: async (e) => {
        console.error(e)
        setConfirming("");
      }
    })
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative glass border border-white/10 shadow-lg transition-all duration-300 ease-in-out ${isFullscreen
          ? 'w-full h-full rounded-none'
          : 'w-[90%] h-[90%] rounded-xl'
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {
            hash && <TransactionModal open={txModalOpen} setOpen={setTxModalOpen} link={`${mapChainId2ExplorerUrl[Number(chainId)]}/tx/${hash}`} />
          }
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedTab('overview')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${selectedTab === 'overview'
                  ? 'bg-white/10'
                  : 'hover:bg-white/5'
                  }`}
              >
                Overview
              </button>
              <button
                onClick={() => setSelectedTab('explore')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${selectedTab === 'explore'
                  ? 'bg-white/10'
                  : 'hover:bg-white/5'
                  }`}
              >
                Explore
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 h-[calc(100%-73px)] overflow-y-auto">
          {selectedTab === 'overview' ? (
            <>
              {/* Global Metrics */}
              <GlobalMetric isLoading={isLoading} />

              {/* Positions */}
              <PositionList setSelectedPositionType={setSelectedPositionType} selectedPositionType={selectedPositionType} isLoading={isLoading} handleAction={handleAction} />

              {/* Protocol Statistics */}
              {
                positions.length > 0 && <ProtocolStatistic />
              }
            </>
          ) : (
            <OfferingList setSelectedPositionType={setSelectedPositionType} selectedPositionType={selectedPositionType} handleAction={handleAction} />
          )}
        </div>
      </div>

      {modalState.type && modalState.type === 'deposit' && modalState.position && (
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
                  src={modalState.position.logo}
                  alt={modalState.position.protocol}
                  className="w-8 h-8"
                />
                <div>
                  <div className="font-medium">{modalState.position.protocol}</div>
                  <div className="text-sm text-white/60">
                    {`${modalState.position.tokens[0].symbol}/${modalState.position.tokens[1].symbol} ${modalState.position.tokens[2].symbol}`}
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <div className={`text-emerald-400`}>
                    {modalState.position.apy || 0}% APY
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
                        <span className='ml-2'>
                          Rate
                        </span>
                      </div>
                      <div className='items-center flex'>
                        <span className='ml-2'>
                          1 {tokenInfo2?.symbol} = {formatNumberByFrac(1 / priceRatio, 4)} {tokenInfo1?.symbol}
                        </span>
                      </div>
                    </div>
                    <div className='flex justify-between'>
                      <div>
                        <span className='ml-2'>
                          New {tokenInfo1?.symbol || ""} Position
                        </span>
                      </div>
                      <div className='items-center flex'>
                        <TokenChainIcon src={tokenInfo1?.logo || ""} alt={tokenInfo1?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                        <span className='ml-2'>
                          {formatNumberByFrac(Number(modalState.position.tokens[0].balance_formatted) + Number(tokenAmount))}
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
                        <TokenChainIcon src={tokenInfo2?.logo || ""} alt={tokenInfo2?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                        <span className='ml-2'>
                          {formatNumberByFrac(Number(modalState.position.tokens[1].balance_formatted) + Number(token2Amount))}
                        </span>
                        <span className='ml-1'>
                          {tokenInfo2?.symbol || ""}
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
                        Amount
                      </div>
                      <div className='relative flex'>
                        <input
                          value={tokenAmount}
                          onChange={(e) => {
                            setTokenAmount(e.target.value);
                            setToken2Amount((Number(e.target.value) * Number(priceRatio)).toString());
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
                            setTokenAmount(((Number(e.target.value) / Number(priceRatio)) || 0).toString());
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
                          setTokenAmount(((Number(tokenBalance2?.balance) / Number(priceRatio)) || 0).toString());
                        }}>MAX</button>
                      </div>
                    </div>

                    <div className='mt-2 mb-2 flex flex-col gap-3'>
                      <div className='flex justify-between'>
                        <div>
                          <span className='ml-2'>
                            {tokenInfo1?.symbol || ""} Position
                          </span>
                        </div>
                        <div className='items-center flex'>
                          <TokenChainIcon src={tokenInfo1?.logo || ""} alt={tokenInfo1?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                          <span className='ml-2'>
                            {formatNumberByFrac(Number(modalState.position.tokens[0].balance_formatted))}
                          </span>
                          <span className='ml-1'>
                            {tokenInfo1?.symbol || ""}
                          </span>
                        </div>
                      </div>

                      <div className='flex justify-between'>
                        <div>
                          <span className='ml-2'>
                            {tokenInfo2?.symbol || ""} Position
                          </span>
                        </div>
                        <div className='items-center flex'>
                          <TokenChainIcon src={tokenInfo2?.logo || ""} alt={tokenInfo2?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                          <span className='ml-2'>
                            {formatNumberByFrac(Number(modalState.position.tokens[1].balance_formatted))}
                          </span>
                          <span className='ml-1'>
                            {tokenInfo2?.symbol || ""}
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
                  </>
              }

              <button
                className={`w-full py-3 bg-blue-500 hover:bg-blue-600 transition-colors rounded-xl font-medium ${isErrorTokenAmount || isErrorToken2Amount || confirming ? "opacity-60" : ""} flex align-center justify-center`} disabled={isErrorTokenAmount}
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
      )}

      {modalState.type && modalState.type === 'redeem' && modalState.position && (
        <RedeemModal
          setModalState={setModalState}
          showPreview={showPreview}
          modalState={modalState}
          setShowPreview={setShowPreview}
          withdrawPercent={withdrawPercent}
          setWithdrawPercent={setWithdrawPercent}
          tokenAmount={tokenAmount}
          token2Amount={token2Amount}
          confirming={confirming}
          redeemHandler={redeemHandler}
        />
      )}
    </div>
  );
};