import React, { useState, useContext, useRef } from 'react';
import { Maximize2, Minimize2, X, } from 'lucide-react';
import { ethers } from 'ethers';
import { erc20Abi } from "viem";

import { useDefiPositionByWallet, useDefiProtocolsByWallet } from '../hooks/useDefi';
import { Web3AuthContext } from '../providers/Web3AuthContext';
import { Position } from '../store/useDefiStore';

import useTokenBalanceStore from '../store/useTokenBalanceStore';
import { useEnSoActionMutation } from '../hooks/useActionEnSo.ts';
import useGasEstimation from "../hooks/useGasEstimation.ts";

import { TransactionModal } from './swap/modals/TransactionModal.tsx';
import { PositionList } from './defi/PositionList.tsx';
import ProtocolStatistic from './defi/ProtocolStatistic.tsx';

import { mapChainId2ExplorerUrl } from '../config/networks.ts';
import { STAKING_TOKENS, BORROWING_LIST, LENDING_LIST } from '../constants/mock/defi.ts';
import { OfferingList } from './defi/OfferlingList.tsx';
import GlobalMetric from './defi/GlobalMetric.tsx';
import RedeemModal from './defi/RedeemModal.tsx';
import WithdrawModal from './defi/WithdrawModal.tsx';
import RepayModal from './defi/RepayModal.tsx';
import DepositModal from './defi/DepositModal.tsx';
import StakeModal from './defi/StakeModal.tsx';
import BorrowModal from './defi/BorrowModal.tsx';
import UnStakeModal from './defi/UnStakeModal.tsx';
import LendModal from './defi/LendModal.tsx';

import { compareStringUppercase } from '../utils/common.util.ts';
import { getTokenOutAmountByPercent } from '../utils/token.util.ts';

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

  const { chainId, address, signer, switchChain } = useContext(Web3AuthContext);

  const { getTokenBalance } = useTokenBalanceStore();
  const { data: gasData } = useGasEstimation(chainId);

  const positionHandlerList = useRef<{ isLoading: boolean, refetch: () => void, chainId: number }[]>([]);
  for (const chainId of DEFI_CHAIN_LIST) {
    const { isLoading, refetch } = useDefiPositionByWallet({ chainId: Number(chainId), walletAddress: address });
    positionHandlerList.current.push({ isLoading, refetch, chainId: chainId })
  }

  const refetchDefiPositionByWallet = positionHandlerList.current.find(item => Number(item.chainId) === chainId)?.refetch || function () { };

  const isLoadingPosition = positionHandlerList.current.reduce((sum, p) => sum + (p.isLoading ? 1 : 0), 0) === positionHandlerList.current.length;

  const protocolHandlerList = useRef<{ isLoading: boolean, refetch: () => void, chainId: number }[]>([]);

  for (const chainId of DEFI_CHAIN_LIST) {
    const { isLoading, refetch } = useDefiProtocolsByWallet({ chainId: Number(chainId), walletAddress: address });
    protocolHandlerList.current.push({ isLoading, refetch, chainId: chainId });
  }

  const isLoadingProtocol = protocolHandlerList.current.reduce((sum, p) => sum + (p.isLoading ? 1 : 0), 0) === protocolHandlerList.current.length;

  const refetchDefiProtocolByWallet = protocolHandlerList.current.find(item => Number(item.chainId) === chainId)?.refetch || function () { };

  const isLoading = isLoadingPosition || isLoadingProtocol;

  const tokenBalance1 = modalState?.position ? getTokenBalance(modalState.position.tokens[0]?.contract_address, Number(chainId)) : null;
  const tokenBalance2 = modalState?.position ? getTokenBalance(modalState.position.tokens[1]?.contract_address, Number(chainId)) : null;

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleAction = (type: string, position: Position, apyToken: string, supportedChains: number[]) => {
    switchChain(supportedChains[0]);
    setModalState({ type, position, apyToken, supportedChains: [...new Set(supportedChains)] });
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
            const transactionResponse = await signer.sendTransaction(txData.tx).catch((e) => {
              console.error(e)
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
      try {
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
      } catch (e) {
        console.error(e);
        setConfirming("");
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
      tokenOut: [modalState?.position?.tokens[0]?.contract_address || "", modalState?.position?.tokens[1]?.contract_address || ""],
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
            await refetchDefiPositionByWallet();
            await refetchDefiProtocolByWallet();
            setHash(receipt.transactionHash);
            setTxModalOpen(true);

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

  const withdrawHandler = async () => {
    if (!signer) return;

    setConfirming("Approving...");

    const protocolId = modalState.position?.protocol_id?.toLowerCase() || "";

    const lendTokenInfo = LENDING_LIST.find((token) => {
      return token.chainId === Number(chainId)
        && compareStringUppercase(token?.protocol_id, protocolId)
        && compareStringUppercase(token.tokenOut.symbol, modalState?.position?.tokens[0].symbol || "");
    });

    enSoActionMutation({
      chainId: Number(chainId),
      fromAddress: address,
      routingStrategy: "router",
      action: "redeem",
      protocol: protocolId,
      tokenIn: [lendTokenInfo?.tokenOut.contract_address || ""],
      tokenOut: [lendTokenInfo?.tokenIn.contract_address || ""],
      amountIn: [Number(withdrawPercent)],
      signer: signer,
      receiver: address,
      gasPrice: gasData.gasPrice,
      gasLimit: gasData.gasLimit
    }, {
      onSuccess: async (txData) => {
        if (signer) {
          setConfirming("Withdrawing...");
          // execute defi action
          const transactionResponse = await signer.sendTransaction(txData.tx).catch((e) => {
            console.error(e)
            setConfirming("")
            return null;
          });

          if (transactionResponse) {
            const receipt = await transactionResponse.wait();
            await refetchDefiPositionByWallet();
            await refetchDefiProtocolByWallet();
            setHash(receipt.transactionHash);
            setTxModalOpen(true);

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

  const repayHandler = async () => {
    if (!signer) return;

    setConfirming("Repaying...");

    try {
      const protocolId = modalState.position?.protocol_id?.toLowerCase() || "";

      const borrowTokenInfo = BORROWING_LIST.find((token) => {
        return token.chainId === Number(chainId)
          && compareStringUppercase(token?.protocol_id, protocolId)
          && compareStringUppercase(token.tokenOut.symbol, modalState?.position?.tokens[1].symbol || "");
      });

      if (borrowTokenInfo?.borrowContract?.abi) {
        const borrowContract = new ethers.Contract(borrowTokenInfo?.borrowContract?.contract_address || "", borrowTokenInfo?.borrowContract?.abi, signer);

        const amountValue = await getTokenOutAmountByPercent(Number(withdrawPercent), address, borrowTokenInfo?.tokenOut.contract_address, signer);
        const tx = {
          to: borrowTokenInfo?.borrowContract?.contract_address,
          data: borrowContract.interface.encodeFunctionData("repay", [
            borrowTokenInfo?.tokenOut.contract_address, amountValue, 2, address
          ]),
          // gasPrice: ethers.parseUnits('10', 'gwei'),
          gasPrice: gasData.gasPrice,
          gasLimit: Number(gasData.gasLimit) * 2, // Example static gas limit
          value: 0n,
        };

        const transactionResponse = await signer?.sendTransaction(tx);
        const receipt = await transactionResponse.wait();

        setHash(receipt.transactionHash);
        setTxModalOpen(true);
        await refetchDefiPositionByWallet();
        await refetchDefiProtocolByWallet();

        setWithdrawPercent("");

        setShowPreview(false);
        setModalState({ type: null });
        setSelectedTab('overview');
        setConfirming("");

      } else {
        setConfirming("");
        throw Error("borrow token contract error")
      }
    } catch (e) {
      setConfirming("");
      throw Error("transaction error");
    }
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
          modalState={modalState}
          refetchDefiPositionByWallet={refetchDefiPositionByWallet}
          refetchDefiProtocolByWallet={refetchDefiProtocolByWallet}
          setSelectedTab={setSelectedTab}
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

      {modalState?.type === 'withdraw' && modalState.position && (
        <WithdrawModal
          setModalState={setModalState}
          showPreview={showPreview}
          modalState={modalState}
          setShowPreview={setShowPreview}
          withdrawPercent={withdrawPercent}
          setWithdrawPercent={setWithdrawPercent}
          tokenAmount={tokenAmount}
          token2Amount={token2Amount}
          confirming={confirming}
          redeemHandler={withdrawHandler}
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

      {modalState?.type === 'repay' && modalState.position && (
        <RepayModal
          setModalState={setModalState}
          modalState={modalState}
          withdrawPercent={withdrawPercent}
          setWithdrawPercent={setWithdrawPercent}
          confirming={confirming}
          repayHandler={repayHandler}
        />
      )}
    </div>
  );
};