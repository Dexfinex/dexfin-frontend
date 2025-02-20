import React, { useState, useContext, useMemo, useEffect } from 'react';
import { Maximize2, Minimize2, X, } from 'lucide-react';

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
import { OfferingList } from './defi/OfferlingList.tsx';
import GlobalMetric from './defi/GlobalMetric.tsx';
import RedeemModal from './defi/RedeemModal.tsx';
import DepositModal from './defi/DepositModal.tsx';

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
  const { data: gasData } = useGasEstimation()

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
  const tokenBalance2 = modalState?.position ? getTokenBalance(modalState.position.tokens[1].contract_address, Number(chainId)) : null;

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

      {modalState?.type === 'deposit' && modalState.position && (
        <DepositModal
          setModalState={setModalState}
          showPreview={showPreview}
          modalState={modalState}
          setShowPreview={setShowPreview}
          tokenAmount={tokenAmount}
          token2Amount={token2Amount}
          confirming={confirming}
          depositHandler={depositHandler}
          setTokenAmount={setTokenAmount}
          setToken2Amount={setToken2Amount}
        />
      )}

      {modalState?.type === 'redeem' && modalState.position && (
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