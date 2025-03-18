import React, { useState, useContext, useMemo, useEffect } from 'react';
import { Maximize2, Minimize2, X, } from 'lucide-react';
import { ethers } from 'ethers';
import { erc20Abi } from "viem";

import { useDefiPositionByWallet, useDefiProtocolsByWallet } from '../hooks/useDefi';
import { Web3AuthContext } from '../providers/Web3AuthContext';
import useDefiStore, { Position } from '../store/useDefiStore';
import useTokenBalanceStore from '../store/useTokenBalanceStore';
import { useEnSoActionMutation } from '../hooks/useActionEnSo.ts';
import useGasEstimation from "../hooks/useGasEstimation.ts";
import useGetTokenPrices from '../hooks/useGetTokenPrices';
import useTokenStore from "../store/useTokenStore.ts";
import { TransactionModal } from './swap/modals/TransactionModal.tsx';
import { PositionList } from './defi/PositionList.tsx';
import ProtocolStatistic from './defi/ProtocolStatistic.tsx';

import { mapChainId2ExplorerUrl } from '../config/networks.ts';
import { mapChainId2NativeAddress } from "../config/networks.ts";
import { STAKING_TOKENS, BORROWING_LIST, LENDING_LIST } from '../constants/mock/defi.ts';
import { OfferingList } from './defi/OfferlingList.tsx';
import GlobalMetric from './defi/GlobalMetric.tsx';
import RedeemModal from './defi/RedeemModal.tsx';
import DepositModal from './defi/DepositModal.tsx';
import StakeModal from './defi/StakeModal.tsx';
import BorrowModal from './defi/BorrowModal.tsx';
import UnStakeModal from './defi/UnStakeModal.tsx';
import LendModal from './defi/LendModal.tsx';

interface DeFiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ModalState {
  type: string | null;
  position?: Position;
  apyToken?: string;
  supportedChains?: number[];
}

const DEFI_CHAIN_LIST = [
  1, // Ethereum Mainnet (ETH)
  56, // Binance Smart Chain (BNB)
  137, // Polygon Mainnet (MATIC)
  8453, // Base Mainnet (ETH placeholder)
]

export const DeFiModal: React.FC<DeFiModalProps> = ({ isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'explore'>('explore');
  const [selectedPositionType, setSelectedPositionType] = useState<Position['type'] | 'ALL'>('ALL');
  const [modalState, setModalState] = useState<ModalState>({ type: null });
  const [tokenAmount, setTokenAmount] = useState("");
  const [borrowingTokenAmount, setBorrowingTokenAmount] = useState("");
  const [token2Amount, setToken2Amount] = useState("");
  const [confirming, setConfirming] = useState("");
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [hash, setHash] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const [withdrawPercent, setWithdrawPercent] = useState("1");

  const { mutate: enSoActionMutation } = useEnSoActionMutation();

  const { chainId, address, signer, } = useContext(Web3AuthContext);
  useDefiStore();

  const { getTokenBalance } = useTokenBalanceStore();
  const { data: gasData } = useGasEstimation()

  const positionHandlerList = DEFI_CHAIN_LIST.map(chainId => {
    const { isLoading, refetch } = useDefiPositionByWallet({ chainId: Number(chainId), walletAddress: address });
    return { isLoading, refetch, chainId: chainId }
  });

  const refetchDefiPositionByWallet = positionHandlerList.find(item => Number(item.chainId) === chainId)?.refetch || function () { };

  const isLoadingPosition = positionHandlerList.reduce((sum, p) => sum + (p.isLoading ? 1 : 0), 0) === positionHandlerList.length;

  const protocolHandlerList = DEFI_CHAIN_LIST.map(chainId => {
    const { isLoading, refetch } = useDefiProtocolsByWallet({ chainId: Number(chainId), walletAddress: address });
    return { isLoading, refetch, chainId: chainId }
  });

  const isLoadingProtocol = protocolHandlerList.reduce((sum, p) => sum + (p.isLoading ? 1 : 0), 0) === protocolHandlerList.length;

  const refetchDefiProtocolByWallet = protocolHandlerList.find(item => Number(item.chainId) === chainId)?.refetch || function () { };

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

  const tokenBalance1 = modalState?.position ? getTokenBalance(modalState.position.tokens[0]?.contract_address, Number(chainId)) : null;
  const tokenBalance2 = modalState?.position ? getTokenBalance(modalState.position.tokens[1]?.contract_address, Number(chainId)) : null;

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleAction = (type: string, position: Position, apyToken: string, supportedChains: number[]) => {
    setModalState({ type, position, apyToken, supportedChains });
  };

  const depositHandler = async () => {
    if (signer && Number(tokenAmount) > 0 && Number(token2Amount) > 0) {
      setConfirming("Approving...");

      enSoActionMutation({
        chainId: Number(chainId),
        fromAddress: address,
        routingStrategy: "router",
        action: "deposit",
        protocol: (modalState.position?.protocol_id || "").toLowerCase(),
        tokenIn: [tokenBalance1?.address || "", tokenBalance2?.address || ""],
        tokenOut: [modalState?.position?.address || ""],
        amountIn: [Number(tokenAmount), Number(token2Amount || 0)],
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
              setSelectedTab('overview');
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

  const lendHandler = async () => {
    if (signer && Number(tokenAmount) > 0) {
      setConfirming("Approving...");
      const lendTokenInfo = LENDING_LIST.find((token) => {
        return token.chainId === Number(chainId) && token.protocol === modalState.position?.protocol && token.tokenIn.symbol === modalState?.position.tokens[0].symbol
      });
      const tokenInInfo = lendTokenInfo?.tokenIn ? lendTokenInfo?.tokenIn : null;
      const tokenOutInfo = lendTokenInfo?.tokenOut ? lendTokenInfo?.tokenOut : null;

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
              setSelectedTab('overview');
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

  const stakeHandler = async () => {
    if (signer && Number(tokenAmount) > 0) {
      setConfirming("Approving...");
      const stakeTokenInfo = STAKING_TOKENS.find((token) => token.chainId === Number(chainId) && token.protocol === modalState.position?.protocol && token.tokenOut.symbol === modalState?.position.tokens[0].symbol);

      enSoActionMutation({
        chainId: Number(chainId),
        fromAddress: address,
        routingStrategy: "router",
        action: "deposit",
        protocol: (modalState.position?.protocol_id || "").toLowerCase(),
        tokenIn: [stakeTokenInfo?.tokenIn?.contract_address || ""],
        tokenOut: [stakeTokenInfo?.tokenOut?.contract_address || ""],
        amountIn: [Number(tokenAmount)],
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
              setSelectedTab('overview');
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

  const unStakeHandler = async () => {
    if (signer && Number(tokenAmount) > 0) {
      setConfirming("Approving...");
      const stakeTokenInfo = STAKING_TOKENS.find((token) => token.chainId === Number(chainId) && token.protocol === modalState.position?.protocol && token.tokenOut.symbol === modalState?.position.tokens[0].symbol);

      enSoActionMutation({
        chainId: Number(chainId),
        fromAddress: address,
        routingStrategy: "router",
        action: "unstake",
        protocol: (modalState.position?.protocol_id || "").toLowerCase(),
        tokenIn: [stakeTokenInfo?.tokenOut?.contract_address || ""],
        tokenOut: [stakeTokenInfo?.tokenIn?.contract_address || ""],
        amountIn: [Number(tokenAmount)],
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
              setSelectedTab('overview');
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

  const borrowDepositHandler = async () => {
    if (signer && Number(tokenAmount) > 0) {
      setConfirming("Approving...");
      const borrowTokenInfo = BORROWING_LIST.find((token) => {
        return token.chainId === Number(chainId) && token.protocol === modalState.position?.protocol && token.tokenOut.symbol === modalState?.position.tokens[1].symbol
      });

      enSoActionMutation({
        chainId: Number(chainId),
        fromAddress: address,
        routingStrategy: "router",
        action: "deposit",
        protocol: (modalState.position?.protocol_id || "").toLowerCase(),
        tokenIn: [borrowTokenInfo?.tokenIn?.contract_address || ""],
        tokenOut: [borrowTokenInfo?.liquidityToken?.contract_address || ""],
        amountIn: [Number(tokenAmount)],
        signer: signer,
        receiver: address,
        gasPrice: gasData.gasPrice,
        gasLimit: gasData.gasLimit
      }, {
        onSuccess: async (txData) => {
          if (signer) {
            setConfirming("Depositing...");
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

              setShowPreview(true);
              setConfirming("");
            } else {
              setConfirming("");
              throw Error("transaction sign issue")
            }

          }
        },
        onError: async (e) => {
          console.error(e)
          setConfirming("");
        }
      })
    }
  }

  const borrowHandler = async () => {
    if (signer && Number(tokenAmount) > 0) {
      setConfirming("Borrowing...");
      const borrowTokenInfo = BORROWING_LIST.find((token) => {
        return token.chainId === Number(chainId) && token.protocol === modalState.position?.protocol && token.tokenOut.symbol === modalState?.position.tokens[1].symbol
      });
      if (borrowTokenInfo?.borrowContract?.abi) {
        const borrowContract = new ethers.Contract(borrowTokenInfo?.borrowContract?.contract_address || "", borrowTokenInfo?.borrowContract?.abi, signer);
        const tokenContract = new ethers.Contract(
          borrowTokenInfo?.tokenOut.contract_address,
          erc20Abi,
          signer
        );
        const decimals = await tokenContract.decimals();
        const amountValue = Number(ethers.utils.parseUnits(
          Number(borrowingTokenAmount).toFixed(8).replace(/\.?0+$/, ""),
          decimals
        ));
        const tx = {
          to: borrowTokenInfo?.borrowContract?.contract_address,
          data: borrowContract.interface.encodeFunctionData("borrow", [
            borrowTokenInfo?.tokenOut.contract_address, amountValue, 2, 0, address
          ]),
          // gasPrice: ethers.parseUnits('10', 'gwei'),
          gasPrice: gasData.gasPrice,
          gasLimit: Number(gasData.gasLimit) * 2, // Example static gas limit
          value: 0n,
        };

        const transactionResponse = await signer?.sendTransaction(tx);
        const receipt = await transactionResponse.wait().catch(() => {
          setConfirming("");
          throw Error("transaction error");
        });

        setHash(receipt.transactionHash);
        setTxModalOpen(true);
        await refetchDefiPositionByWallet();
        await refetchDefiProtocolByWallet();

        setTokenAmount("");
        setToken2Amount("");

        setBorrowingTokenAmount("");

        setShowPreview(false);
        setModalState({ type: null });
        setSelectedTab('overview');
        setConfirming("");

      } else {
        setConfirming("");
        throw Error("borrow token contract error")
      }
    }
  }

  const redeemHandler = async () => {
    if (!signer) return;

    setConfirming("Approving...");

    enSoActionMutation({
      chainId: Number(chainId),
      fromAddress: address,
      routingStrategy: "router",
      action: "redeem",
      protocol: (modalState.position?.protocol_id || "").toLowerCase(),
      tokenIn: [modalState?.position?.address || ""],
      tokenOut: [tokenBalance1?.address || "", tokenBalance2?.address || ""],
      amountIn: [Number(withdrawPercent)],
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
            setSelectedTab('overview');
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
            hash && <TransactionModal open={txModalOpen} setOpen={setTxModalOpen} link={`${mapChainId2ExplorerUrl[Number(chainId)]}/tx/${hash}`} checkBalance={true} />
          }
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedTab('explore');
                  setSelectedPositionType("ALL");
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors ${selectedTab === 'explore'
                  ? 'bg-white/10'
                  : 'hover:bg-white/5'
                  }`}
              >
                Explore
              </button>
              <button
                onClick={() => {
                  setSelectedTab('overview');
                  setSelectedPositionType("ALL");
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors ${selectedTab === 'overview'
                  ? 'bg-white/10'
                  : 'hover:bg-white/5'
                  }`}
              >
                Overview
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
              <PositionList setSelectedPositionType={setSelectedPositionType} selectedPositionType={selectedPositionType} isLoading={isLoading} handleAction={handleAction} setShowPreview={setShowPreview} />

              {/* Protocol Statistics */}
              {
                <ProtocolStatistic />
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

      {modalState?.type === 'lend' && modalState.position && (
        <LendModal
          setModalState={setModalState}
          showPreview={showPreview}
          modalState={modalState}
          setShowPreview={setShowPreview}
          tokenAmount={tokenAmount}
          confirming={confirming}
          lendHandler={lendHandler}
          setTokenAmount={setTokenAmount}
        />
      )}

      {modalState?.type === 'stake' && modalState.position && (
        <StakeModal
          setModalState={setModalState}
          showPreview={showPreview}
          modalState={modalState}
          setShowPreview={setShowPreview}
          tokenAmount={tokenAmount}
          confirming={confirming}
          stakeHandler={stakeHandler}
          setTokenAmount={setTokenAmount}
        />
      )}

      {modalState?.type === 'borrow' && modalState.position && (
        <BorrowModal
          setModalState={setModalState}
          showPreview={showPreview}
          modalState={modalState}
          setShowPreview={setShowPreview}
          tokenAmount={tokenAmount}
          confirming={confirming}
          borrowHandler={borrowHandler}
          depositHandler={borrowDepositHandler}
          setConfirming={setConfirming}
          setTokenAmount={setTokenAmount}
          borrowingTokenAmount={borrowingTokenAmount}
          setBorrowingTokenAmount={setBorrowingTokenAmount}
        />
      )}

      {modalState?.type === 'unstake' && modalState.position && (
        <UnStakeModal
          setModalState={setModalState}
          showPreview={showPreview}
          modalState={modalState}
          setShowPreview={setShowPreview}
          tokenAmount={tokenAmount}
          confirming={confirming}
          unStakeHandler={unStakeHandler}
          setTokenAmount={setTokenAmount}
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