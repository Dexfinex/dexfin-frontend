import React, { useState, useContext, useMemo, useEffect } from 'react';
import { BarChart2, Coins, Maximize2, Minimize2, Shield, TrendingUp, Wallet, X, ArrowLeft } from 'lucide-react';
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

import { mapChainId2ExplorerUrl } from '../config/networks.ts';
import { mapChainId2NativeAddress } from "../config/networks.ts";
import { formatNumberByFrac } from '../utils/common.util';

interface DeFiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ModalState {
  type: 'deposit' | 'redeem' | 'borrow' | 'repay' | null;
  position?: Position;
}

const offerings: Position[] = [
  {
    "address": "0x6ab0ae46c4b450bc1b4ffcaa192b235134d584b2",
    "protocol": "Uniswap v2",
    "protocol_id": "uniswap-v2",
    "type": "liquidity",
    "amount": 0,
    "apy": 0,
    "tokens": [
      {
        "token_type": "supplied",
        "name": "Tether USD",
        "symbol": "USDT",
        "contract_address": "0x55d398326f99059ff775485246999027b3197955",
        "decimals": "18",
        "logo": "https://logo.moralis.io/0x38_0x55d398326f99059ff775485246999027b3197955_017c31aed33715dffcd9c5175133fbdb.png",
        "thumbnail": "https://logo.moralis.io/0x38_0x55d398326f99059ff775485246999027b3197955_017c31aed33715dffcd9c5175133fbdb.png",
        "balance": "0",
        "balance_formatted": "0",
        "usd_price": 0,
        "usd_value": 0
      },
      {
        "token_type": "supplied",
        "name": "USD Coin",
        "symbol": "USDC",
        "contract_address": "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
        "decimals": "18",
        "logo": "https://logo.moralis.io/0x38_0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d_0ebe47803189a184e87d3b2531873502.png",
        "thumbnail": "https://logo.moralis.io/0x38_0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d_0ebe47803189a184e87d3b2531873502.png",
        "balance": "0",
        "balance_formatted": "0",
        "usd_price": 0,
        "usd_value": 0
      },
      {
        "token_type": "defi-token",
        "name": "Uniswap V2",
        "symbol": "UNI-V2",
        "contract_address": "0x6ab0ae46c4b450bc1b4ffcaa192b235134d584b2",
        "decimals": "18",
        "logo": "",
        "thumbnail": "",
        "balance": "0",
        "balance_formatted": "0",
        "usd_price": 0,
        "usd_value": 0
      }
    ],
    "rewards": 0,
    "healthFactor": 0,
    "logo": "https://cdn.moralis.io/defi/uniswap.png",
    "factory": "0x8909dc15e40173ff4699343b6eb8132c65e18ec6"
  }
];

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

  const { chainId, address, signer } = useContext(Web3AuthContext);
  const { positions, protocol, netAPY, healthFactor, protocolTypes } = useDefiStore();

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

  const getTypeIcon = (type: Position['type']) => {
    switch (type.toUpperCase()) {
      case 'LENDING':
        return '💰';
      case 'BORROWING':
        return '🏦';
      case 'STAKING':
        return '🔒';
      case 'POOL':
        return '🌊';
      default:
        return '🎁'
    }
  };

  const getTypeColor = (type: Position['type']) => {
    switch (type) {
      case 'LENDING':
        return 'text-purple-400';
      case 'BORROWING':
        return 'text-red-400';
      case 'STAKING':
        return 'text-blue-400';
      case 'POOL':
        return 'text-green-400';
    }
  };

  // const getRiskColor = (risk: Offering['risk']) => {
  //   switch (risk) {
  //     case 'LOW':
  //       return 'text-green-400';
  //     case 'MEDIUM':
  //       return 'text-yellow-400';
  //     case 'HIGH':
  //       return 'text-red-400';
  //   }
  // };

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

  const renderPositions = () => (
    <div className="space-y-3">
      {
        positions.length === 0 && isLoading && <Skeleton startColor="#444" className='rounded-xl' endColor="#1d2837" w={'100%'} h={'7rem'}></Skeleton>
      }
      {positions
        .filter(p => selectedPositionType === 'ALL' || p.type === selectedPositionType)
        .map((position, index) => (
          isLoading ? <Skeleton startColor="#444" className='rounded-xl' endColor="#1d2837" w={'100%'} h={'7rem'} key={`sk-${index}`}></Skeleton>
            : <div
              key={index}
              className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={position.logo}
                    alt={position.protocol}
                    className="w-10 h-10"
                  />
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{position.protocol}</h3>
                      <span className={`text-sm ${getTypeColor(position.type)}`}>
                        {position.type}
                      </span>
                      <span className="text-white/40">•</span>
                      <span className="text-sm text-white/60">
                        {`${position.tokens[0]?.symbol}/${position.tokens[1]?.symbol} ${position.tokens[2]?.symbol}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-6">
                      <div>
                        <span className="text-sm text-white/60">Amount</span>
                        <div className="text-lg">${(position.amount || "0").toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-sm text-white/60">APY</span>
                        <div className="text-emerald-400">{(position.apy || "0")}%</div>
                      </div>
                      {position.rewards && (
                        <div>
                          <span className="text-sm text-white/60">Rewards</span>
                          <div className="text-blue-400">+{(position.rewards || "0")}% APR</div>
                        </div>
                      )}
                      {!!position.healthFactor && (
                        <div>
                          <span className="text-sm text-white/60">Health Factor</span>
                          <div className="text-green-400">{position.healthFactor}</div>
                        </div>
                      )}
                      {position.poolShare && (
                        <div>
                          <span className="text-sm text-white/60">Pool Share</span>
                          <div>{(position.poolShare * 100).toFixed(3)}%</div>
                        </div>
                      )}
                      {position.collateralFactor && (
                        <div>
                          <span className="text-sm text-white/60">Collateral Factor</span>
                          <div>{(position.collateralFactor * 100)}%</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {position.type === 'BORROWING' ? (
                    <>
                      <button
                        onClick={() => handleAction('borrow', position)}
                        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg text-sm"
                      >
                        Borrow More
                      </button>
                      <button
                        onClick={() => handleAction('repay', position)}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-sm"
                      >
                        Repay
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleAction('deposit', position)}
                        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg text-sm"
                      >
                        Deposit
                      </button>
                      <button
                        onClick={() => handleAction('redeem', position)}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-sm"
                      >
                        Redeem
                      </button>
                    </>
                  )}
                </div>
              </div>

              {position.type === 'BORROWING' && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/60">Borrow Utilization</span>
                    <span>{((position.borrowed! / position.maxBorrow!) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${(position.borrowed! / position.maxBorrow!) >= 0.8 ? 'bg-red-500' :
                        (position.borrowed! / position.maxBorrow!) >= 0.6 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                      style={{ width: `${(position.borrowed! / position.maxBorrow!) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
        ))}
    </div>
  );

  const renderOfferings = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setSelectedPositionType('ALL')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${selectedPositionType === 'ALL'
            ? 'bg-white/10'
            : 'hover:bg-white/5'
            }`}
        >
          All Types
        </button>
        {/* {(['LENDING', 'BORROWING', 'STAKING', 'POOL'] as Position['type'][]).map(type => (
          <button
            key={type}
            onClick={() => setSelectedPositionType(type)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${selectedPositionType === type
              ? 'bg-white/10'
              : 'hover:bg-white/5'
              }`}
          >
            {getTypeIcon(type)}
            <span>{type.charAt(0) + type.slice(1).toLowerCase()}</span>
          </button>
        ))} */}
      </div>

      <div className="space-y-3">
        {offerings
          .filter(o => selectedPositionType === 'ALL' || o.type === selectedPositionType)
          .map((offering, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <img
                  src={offering.logo}
                  alt={offering.protocol}
                  className="w-10 h-10"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{offering.protocol}</h3>
                    <span className={`text-sm ${getTypeColor(offering.type)}`}>
                      {offering.type}
                    </span>
                    <span className="text-white/40">•</span>
                    <span className="text-sm text-white/60">
                      {`${offering.tokens[0]?.symbol}/${offering.tokens[1]?.symbol} ${offering.tokens[2]?.symbol}`}
                    </span>
                  </div>

                  {/* <p className="text-sm text-white/60 mb-2">
                    this is description
                  </p> */}

                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-sm text-white/60">Base APY</span>
                      <div className={`${offering.type === 'BORROWING' ? 'text-red-400' : 'text-emerald-400'
                        }`}>
                        {offering.apy || "0"} %
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const position = positions.find(position => position.address === offering.address && position.protocol === offering.protocol)

                    handleAction(
                      'deposit',
                      position || offering
                    );
                  }
                  }
                  className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg`}
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

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
              <div className="grid grid-cols-4 gap-6 mb-6">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-white/60">Total Value Locked</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">
                    {
                      isLoading ? <Skeleton startColor="#444" endColor="#1d2837" w={'100%'} h={'2rem'}></Skeleton>
                        : formatNumberByFrac(protocol.total_usd_value)
                    }
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>+5.82%</span>
                    <span className="text-white/60">24h</span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart2 className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-white/60">Net APY</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">
                    {
                      isLoading ? <Skeleton startColor="#444" endColor="#1d2837" w={'100%'} h={'2rem'}></Skeleton>
                        : `+ ${netAPY}%`
                    }

                  </div>
                  <div className="text-sm text-white/60">
                    Across all positions
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Coins className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-white/60">Total Rewards</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">
                    {
                      isLoading ? <Skeleton startColor="#444" endColor="#1d2837" w={'100%'} h={'2rem'}></Skeleton>
                        : `+$ ${protocol.total_unclaimed_usd_value}`
                    }
                  </div>
                  <div className="text-sm text-white/60">
                    Unclaimed rewards
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-white/60">Health Status</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    Healthy
                  </div>
                  <div className="text-sm text-white/60">
                    All positions safe ({healthFactor})
                  </div>
                </div>
              </div>

              {/* Position Type Filter */}
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setSelectedPositionType('ALL')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${selectedPositionType === 'ALL'
                    ? 'bg-white/10'
                    : 'hover:bg-white/5'
                    }`}
                >
                  All Types
                </button>
                {protocolTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedPositionType(type)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${selectedPositionType === type
                      ? 'bg-white/10'
                      : 'hover:bg-white/5'
                      }`}
                  >
                    {getTypeIcon(type)}
                    <span>{type.charAt(0) + type.slice(1).toLowerCase()}</span>
                  </button>
                ))}
              </div>

              {/* Positions */}
              {renderPositions()}

              {/* Protocol Statistics */}
              <div className="grid grid-cols-2 gap-6 mt-6">
                {/* Protocol Breakdown */}
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-lg font-medium mb-4">Protocol Breakdown</h3>
                  <div className="space-y-3">
                    {positions.map((position) => {
                      const protocol = position.protocol;
                      const protocolPositions = positions.filter(p => p.protocol === protocol);
                      const totalValue = protocolPositions.reduce((sum, p) => sum + p.amount, 0);
                      const totalTVL = positions.reduce((sum, p) => sum + p.amount, 0);

                      return (
                        <div key={protocol} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                          <img
                            src={protocolPositions[0]?.logo}
                            alt={protocol}
                            className="w-8 h-8"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{protocol}</span>
                              <span>${totalValue.toLocaleString()}</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 transition-all"
                                style={{ width: `${(totalValue / totalTVL) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Type Distribution */}
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-lg font-medium mb-4">Type Distribution</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {protocolTypes.map((type) => {
                      const typePositions = positions.filter(p => p.type === type);
                      const totalValue = typePositions.reduce((sum, p) => sum + p.amount, 0);
                      const totalTVL = positions.reduce((sum, p) => sum + p.amount, 0);

                      return (
                        <div key={type} className="p-4 bg-white/5 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(type)}
                              <span className="font-medium">{type}</span>
                            </div>
                            <span className="text-sm text-white/60">
                              {typePositions.length} positions
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/60">TVL Share</span>
                            <span>{((totalValue / totalTVL) * 100).toFixed(1)}%</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden mt-2">
                            <div
                              className="h-full bg-blue-500 transition-all"
                              style={{ width: `${(totalValue / totalTVL) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          ) : (
            renderOfferings()
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
                Redeem
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
                          {`${formatNumberByFrac(Number(modalState.position.tokens[0].balance_formatted) * Number(withdrawPercent) / 100, 6)} ${tokenBalance1?.symbol}`}
                        </span>
                      </div>
                      <div className='items-center flex'>
                        <TokenChainIcon src={tokenBalance1?.logo || ""} alt={tokenBalance1?.symbol || ""} size={"lg"} chainId={Number(chainId)} />
                      </div>
                    </div>

                    <div className='flex justify-between mt-2'>
                      <div>
                        <span className='ml-2 text-2xl'>
                          {`${formatNumberByFrac(Number(modalState.position.tokens[1].balance_formatted) * Number(withdrawPercent) / 100, 6)} ${tokenBalance2?.symbol}`}
                        </span>
                      </div>
                      <div className='items-center flex'>
                        <TokenChainIcon src={tokenBalance2?.logo || ""} alt={tokenBalance2?.symbol || ""} size={"lg"} chainId={Number(chainId)} />
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
                          1 {tokenBalance2?.symbol} = {formatNumberByFrac(1 / priceRatio, 4)} {tokenBalance1?.symbol}
                        </span>
                      </div>
                    </div>
                    <div className='flex justify-between'>
                      <div>
                        <span className='ml-2'>
                          New {tokenBalance1?.symbol || ""} Position
                        </span>
                      </div>
                      <div className='items-center flex'>
                        <TokenChainIcon src={tokenBalance1?.logo || ""} alt={tokenBalance1?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                        <span className='ml-2'>
                          {formatNumberByFrac(Number(modalState.position.tokens[0].balance_formatted) * ((100 - Number(withdrawPercent)) / 100))}
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
                        <TokenChainIcon src={tokenBalance2?.logo || ""} alt={tokenBalance2?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                        <span className='ml-2'>
                          {formatNumberByFrac(Number(modalState.position.tokens[1].balance_formatted) * ((100 - Number(withdrawPercent)) / 100))}
                        </span>
                        <span className='ml-1'>
                          {tokenBalance2?.symbol || ""}
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
                        Withdrawal amount
                      </div>
                      <div className='relative flex flex-row items-center justify-center w-full'>
                        <input
                          minLength={1}
                          maxLength={3}
                          inputMode="numeric" autoComplete="off" autoCorrect="off" type="text" pattern="^\d*$"
                          placeholder="0" spellCheck="false"
                          value={withdrawPercent}
                          onChange={(e) => {
                            if (0 < Number(e.target.value) && Number(e.target.value) <= 100 && !isNaN(Number(e.target.value))) {
                              setWithdrawPercent(e.target.value)
                            }
                          }}
                          className={`bg-transparent text-5xl outline-none`}
                          style={{ width: (withdrawPercent.length || 1) * 30 }}
                        />
                        <div className='text-4xl text-black ml-2'>%</div>
                      </div>
                      <div className='flex w-full items-center justify-center mt-4 gap-4'>
                        <button className="text-gray-100 border-[1px] border-gray-200 rounded-xl px-2"
                          onClick={() => setWithdrawPercent("25")}>
                          25%
                        </button>
                        <button className="text-gray-100 border-[1px] border-gray-200 rounded-xl px-2"
                          onClick={() => setWithdrawPercent("50")}>
                          50%
                        </button>
                        <button className="text-gray-100 border-[1px] border-gray-200 rounded-xl px-2"
                          onClick={() => setWithdrawPercent("75")}>
                          75%
                        </button>
                        <button className="text-gray-100 border-[1px] border-gray-200 rounded-xl px-2"
                          onClick={() => setWithdrawPercent("100")}>
                          MAX
                        </button>
                      </div>
                    </div>

                    <div className='mt-2 mb-2 flex flex-col gap-3'>
                      <div className='flex justify-between'>
                        <div>
                          <span className='ml-2'>
                            {tokenBalance1?.symbol || ""} Position
                          </span>
                        </div>
                        <div className='items-center flex'>
                          <TokenChainIcon src={tokenBalance1?.logo || ""} alt={tokenBalance1?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                          <span className='ml-2'>
                            {formatNumberByFrac(Number(modalState.position.tokens[0].balance_formatted))}
                          </span>
                          <span className='ml-1'>
                            {tokenBalance2?.symbol || ""}
                          </span>
                        </div>
                      </div>

                      <div className='flex justify-between'>
                        <div>
                          <span className='ml-2'>
                            {tokenBalance2?.symbol || ""} Position
                          </span>
                        </div>
                        <div className='items-center flex'>
                          <TokenChainIcon src={tokenBalance2?.logo || ""} alt={tokenBalance2?.symbol || ""} size={"md"} chainId={Number(chainId)} />
                          <span className='ml-2'>
                            {formatNumberByFrac(Number(modalState.position.tokens[1].balance_formatted))}
                          </span>
                          <span className='ml-1'>
                            {tokenBalance2?.symbol || ""}
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
                    redeemHandler()
                  } else {
                    setShowPreview(true);
                  }
                }}
              >
                {confirming ? <div><Spinner size="md" className='mr-2' /> {confirming}</div> : showPreview ? "Redeem" : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};