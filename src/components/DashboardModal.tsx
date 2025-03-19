import { useState, useContext, useMemo, useEffect } from "react"
import { X, Maximize2, Minimize2, TrendingUp, ArrowUp } from "lucide-react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Skeleton } from '@chakra-ui/react';

import { Web3AuthContext } from "../providers/Web3AuthContext"
import { useWalletBalance } from "../hooks/useBalance"
import { TokenChainIcon, TokenIcon } from "./swap/components/TokenIcon"
import { formatNumberByFrac } from "../utils/common.util"
import useTokenBalanceStore from "../store/useTokenBalanceStore"
import useDefiStore from "../store/useDefiStore"
import PNL from "./common/PNL"
import PNLPercent from "./common/PNLPercent"

import { usePortfolioPerformance } from "../hooks/usePortfolioPerformance";

import { getTypeColor } from "../utils/defi.util"
import { formatHealthFactor } from "../utils/common.util"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend)

interface DashboardModalProps {
  isOpen: boolean
  onClose: () => void
}

export const DashboardModal: React.FC<DashboardModalProps> = ({ isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h")
  const [selectedTab, setSelectedTab] = useState("tokens")

  // Get Web3Auth context
  const { isConnected, address } = useContext(Web3AuthContext)

  // Get wallet balances from your hook
  const { isLoading: isBalanceLoading, refetch: refetchBalances } = useWalletBalance();
  const { totalUsdValue, tokenBalances, pnlPercent, pnlUsd } = useTokenBalanceStore();
  const { totalLockedValue, positions: defiPositions } = useDefiStore();

  const totalPortfolioValue = totalLockedValue + totalUsdValue;

  const spotPercent = totalUsdValue * 100 / totalPortfolioValue;
  const defiPercent = totalLockedValue * 100 / totalPortfolioValue;

  const { data: portfolioData, isLoading: isLoadingPortfolio } = usePortfolioPerformance(selectedTimeframe)

  const distributionData = useMemo(() => {
    // Calculate spot value (total minus DeFi and NFT)

    // Calculate percentages
    const spotPercentage = (totalUsdValue / totalPortfolioValue) * 100 || 0;

    // Calculate DeFi type percentages 
    const stakingValue = defiPositions
      .filter(p => p.type.toLowerCase() === "staking")
      .reduce((sum, p) => sum + p.amount, 0)
    const stakingPercentage = (stakingValue / totalPortfolioValue) * 100 || 0;

    const lendingValue = defiPositions
      .filter(p => p.type.toLowerCase() === "supplied")
      .reduce((sum, p) => sum + p.amount, 0)
    const lendingPercentage = (lendingValue / totalPortfolioValue) * 100 || 0;

    const lpValue = defiPositions
      .filter(p => p.type.toLowerCase() === "liquidity")
      .reduce((sum, p) => sum + p.amount, 0)
    const lpPercentage = (lpValue / totalPortfolioValue) * 100 || 0;

    return {
      labels: ["Spot", "Staked", "Lending", "LP"],
      datasets: [
        {
          data: [
            spotPercentage,
            stakingPercentage,
            lendingPercentage,
            lpPercentage
          ],
          backgroundColor: ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B"],
          borderWidth: 0,
        },
      ],
    }
  }, [totalLockedValue, totalPortfolioValue, totalUsdValue, defiPositions])

  const performanceData = useMemo(() => {
    const labelData = (portfolioData || []).map((item) => item.time);
    const priceData = (portfolioData || []).map((item) => formatNumberByFrac(item.price));
    return {
      labels: labelData,
      datasets: [
        {
          label: "Portfolio Value",
          data: priceData,
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          fill: true,
          tension: 0.4,
        },
      ],
    }
  }, [portfolioData, selectedTimeframe])

  const pnlUsdByDate = useMemo(() => {
    if (selectedTimeframe === "24h") {
      return pnlUsd;
    }
    if (!portfolioData) {
      return 0;
    }
    return portfolioData[portfolioData.length - 1].price - portfolioData[0].price;
  }, [portfolioData, selectedTimeframe, pnlUsd])

  const pnlPercentByDate = useMemo(() => {
    if (selectedTimeframe === "24h") {
      return pnlPercent;
    }
    if (!portfolioData) {
      return 0;
    }
    return (portfolioData[portfolioData.length - 1].price - portfolioData[0].price) * 100 / portfolioData[portfolioData.length - 1].price;
  }, [portfolioData, selectedTimeframe, pnlPercent])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Refresh all data
  const refreshData = async () => {
    await refetchBalances()
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          autoSkipPadding: 15,
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
        },
        ticks: {
          callback: (value: number) => "$" + value.toLocaleString(),
          font: {
            size: 11,
          },
        },
      },
    },
  }

  const chartOptionsDistribute = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          autoSkipPadding: 15,
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
        },
        ticks: {
          callback: (value: number) => value.toLocaleString() + "%",
          font: {
            size: 11,
          },
        },
      },
    },
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
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-black/10 dark:border-white/10">
          <h2 className="text-lg md:text-xl font-semibold">
            Portfolio Dashboard
            {isConnected && address && (
              <span className="ml-2 text-sm opacity-70">
                ({address.slice(0, 6)}...{address.slice(-4)})
              </span>
            )}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshData}
              className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors"
              title="Refresh data"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6M23 20v-6h-6" />
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
              </svg>
            </button>
            <button onClick={toggleFullscreen} className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors">
              {isFullscreen ?
                <Minimize2 className="w-4 h-4" /> :
                <Maximize2 className="w-4 h-4" />}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-73px)] overflow-y-auto scrollbar-thin scrollbar-thumb-black/10 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="p-4 md:p-6 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Value */}
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-emerald-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-6h2v2h-2zm0-8h2v6h-2z" />
                    </svg>
                  </div>
                  <div className="text-sm ">Total Value</div>
                </div>
                {
                  isBalanceLoading ?
                    <Skeleton startColor="#444" endColor="#1d2837" w={'4rem'} h={'2rem'}></Skeleton>
                    : <div className="text-xl sm:text-2xl font-bold">${formatNumberByFrac(totalPortfolioValue)}</div>
                }
                {
                  isBalanceLoading ?
                    <Skeleton startColor="#444" endColor="#1d2837" w={'6rem'} h={'1rem'} className="mt-1"></Skeleton>
                    : <PNL pnlUsd={pnlUsd} pnlPercent={pnlPercent} label="Today" />
                }
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="text-sm ">PNL</div>
                </div>
                <div className="flex items-center gap-4">
                  {
                    isBalanceLoading || isLoadingPortfolio ?
                      <Skeleton startColor="#444" endColor="#1d2837" w={'4rem'} h={'2rem'}></Skeleton> :
                      <div className="text-xl sm:text-2xl font-bold">
                        {pnlUsdByDate > 0 ? "$" : "-$"}{formatNumberByFrac(Math.abs(pnlUsdByDate))}
                      </div>
                  }
                  {
                    isBalanceLoading || isLoadingPortfolio ?
                      <Skeleton startColor="#444" endColor="#1d2837" w={'3rem'} h={'1rem'}></Skeleton>
                      : <PNLPercent pnlPercent={pnlPercentByDate} />
                  }
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {["24h", "7d", "1m"].map((timeframe) => (
                    <button
                      key={timeframe}
                      onClick={() => setSelectedTimeframe(timeframe)}
                      className={`px-2 py-1 text-xs rounded-lg transition-colors ${selectedTimeframe === timeframe ? "bg-black/10 dark:bg-white/10" : "hover:bg-black/5 dark:hover:bg-white/5"
                        }`}
                    >
                      {timeframe}
                    </button>
                  ))}
                </div>
              </div>

              {/* DeFi Positions */}
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-orange-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div className="text-sm ">Spot Positions</div>
                </div>
                {
                  isBalanceLoading ?
                    <Skeleton startColor="#444" endColor="#1d2837" w={'4rem'} h={'2rem'}></Skeleton>
                    : <div className="text-xl sm:text-2xl font-bold">${formatNumberByFrac(totalUsdValue)} </div>
                }
                {
                  isBalanceLoading ?
                    <Skeleton startColor="#444" endColor="#1d2837" w={'6rem'} h={'1rem'} className="mt-1"></Skeleton>
                    : <div className="text-sm mt-1">{formatNumberByFrac((spotPercent || 0))}% of portfolio</div>
                }
              </div>

              {/* DeFi Positions */}
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-purple-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 18v-2c0-1.1-.9-2-2-2h-2v2h2v2h2zm-2 2h-2v2h2v-2zm-4 0v2h-4v-2h4zm-6 0v2H7v-2h2zm-4 0v2H3v-2h2zm0-2H3v-2h2v2zm14-4h-2v-2h2v2zm-6-6h2v2h-2V8zm0 4h2v2h-2v-2zm-6 4H7v-2h2v2zm-4-4h2v2H3v-2zm0 0" />
                    </svg>
                  </div>
                  <div className="text-sm ">DeFi Positions</div>
                </div>
                {
                  isBalanceLoading ?
                    <Skeleton startColor="#444" endColor="#1d2837" w={'4rem'} h={'2rem'}></Skeleton>
                    : <div className="text-xl sm:text-2xl font-bold">${formatNumberByFrac(totalLockedValue)}</div>
                }
                {
                  isBalanceLoading ?
                    <Skeleton startColor="#444" endColor="#1d2837" w={'6rem'} h={'1rem'} className="mt-1"></Skeleton>
                    : <div className="text-sm mt-1">{formatNumberByFrac((defiPercent || 0))}% of portfolio</div>
                }
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Chart */}
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <h3 className="font-medium">Portfolio Performance</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {["24h", "7d", "1m"].map((timeframe) => (
                      <button
                        key={timeframe}
                        onClick={() => setSelectedTimeframe(timeframe)}
                        className={`px-2 py-1 text-xs rounded-lg transition-colors ${selectedTimeframe === timeframe ? "bg-black/10 dark:bg-white/10" : "hover:bg-black/5 dark:hover:bg-white/5"
                          }`}
                      >
                        {timeframe}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-[250px] sm:h-[300px]">
                  {
                    isLoadingPortfolio ?
                      <Skeleton startColor="#444" endColor="#1d2837" w={'100%'} h={'100%'}></Skeleton> :
                      <Line data={performanceData} options={chartOptions as any} />
                  }
                </div>
              </div>

              {/* Distribution Chart */}
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Asset Distribution</h3>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-12">
                  <div className="relative w-full h-[200px] sm:w-[50%] sm:h-[250px]">
                    <Line data={distributionData} options={chartOptionsDistribute as any} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      {
                        isBalanceLoading ?
                          <Skeleton startColor="#444" endColor="#1d2837" w={'4rem'} h={'2rem'}></Skeleton>
                          : <div className="text-2xl sm:text-3xl font-bold">
                            ${formatNumberByFrac(totalPortfolioValue)}
                          </div>
                      }
                      <div className="text-sm">Total Value</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    {distributionData.labels.map((label, index) => (
                      <div key={label} className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: distributionData.datasets[0].backgroundColor[index] }}
                        />
                        <div className="flex items-center gap-2">
                          <span>{label}</span>
                          {
                            isBalanceLoading ? <Skeleton startColor="#444" endColor="#1d2837" w={'2rem'} h={'1.2rem'}></Skeleton>
                              : <span className="">{formatNumberByFrac(distributionData.datasets[0].data[index])}%</span>
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-white/5 rounded-xl">
              <div className="flex items-center gap-2 p-2">
                {["tokens", "defi"].map((tab) => (
                  // nfts
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-4 py-2 rounded-lg transition-colors capitalize ${selectedTab === tab ? "bg-black/10 dark:bg-white/10" : "hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-4">
                {selectedTab === "tokens" && (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-black/10 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {
                      tokenBalances.length === 0 && !isBalanceLoading && <div className='w-full h-full flex justify-center items-center align-center mt-10 mb-10'><h2 className='text-white/60 italic'>Empty list</h2></div>
                    }
                    {
                      tokenBalances.length === 0 && isBalanceLoading && <Skeleton startColor="#444" className='rounded-xl' endColor="#1d2837" w={'100%'} h={'5rem'}></Skeleton>
                    }
                    {tokenBalances.map((token, index) => {
                      const allocationPercent = (token.usdValue * 100 / totalUsdValue) || 0;
                      return (
                        <div
                          key={`${token.symbol}-${token.chain}-${index}`}
                          className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <TokenChainIcon src={token.logo} alt={token.name} size={"lg"} chainId={Number(token.chain)} />
                            <div className="flex-1 min-w-[120px]">
                              <div className="font-medium text-sm sm:text-md">{token.symbol}</div>
                              <div className="flex items-center gap-2 text-sm">
                                <span>
                                  {formatNumberByFrac(token.balance)} {token.symbol}
                                </span>
                                <span className="text-black/40 dark:text-white/40">•</span>
                                <span>${formatNumberByFrac(token.usdValue)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-4 flex-1">
                            <div className="text-right">
                              <div className="text-lg">${formatNumberByFrac(token.usdValue)}</div>
                              <PNLPercent pnlPercent={token.usdPrice24hrUsdChange * 100 / token.usdPrice} />
                            </div>
                            <div className="w-32">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="">Allocation</span>
                                <span>{formatNumberByFrac(allocationPercent)}%</span>
                              </div>
                              <div className="h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{ width: `${allocationPercent}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {selectedTab === "defi" && (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-black/10 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {
                      defiPositions.length === 0 && !isBalanceLoading && <div className='w-full h-full flex justify-center items-center align-center mt-10 mb-10'><h2 className='text-white/60 italic'>Empty list</h2></div>
                    }
                    {
                      defiPositions.length === 0 && isBalanceLoading && <Skeleton startColor="#444" className='rounded-xl' endColor="#1d2837" w={'100%'} h={'6rem'}></Skeleton>
                    }
                    {defiPositions.map((position, index) => {
                      const allocationPercent = ((position.amount / totalLockedValue) * 100) || 0;

                      return (
                        <div
                          key={`${position.protocol}-${position.tokens[0].symbol}-${index}`}
                          className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <TokenChainIcon
                              src={position.logo || "/placeholder.svg"}
                              alt={position.protocol}
                              chainId={Number(position.chainId)}
                              size="lg"
                            />
                            <div className="flex-1 min-w-[120px]">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{position.protocol}</span>
                                <span className={`text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 ${getTypeColor(position.type)}`}>{position.type}</span>
                                <span className="text-white/40 hidden sm:block">•</span>
                                <div className="flex">
                                  {
                                    position.tokens.map((token, index) => ((position.type === "Borrowed" || position.type === "Supplied") && index === 0) || ((position.type === "Liquidity") && index === 2) ? "" : <TokenIcon src={token.logo} alt={token.symbol} size="sm" />)
                                  }
                                </div>
                                {
                                  position.tokens.map((token, index) => ((position.type === "Borrowed" || position.type === "Supplied") && index === 0) || ((position.type === "Liquidity") && index === 2) ? "" : `${token?.symbol} `)
                                }
                              </div>
                              <div className="flex items-center gap-3 text-sm">
                                <div>
                                  <span className="text-sm text-white/60">Amount</span>
                                  <div className="text-emerald-400">${formatNumberByFrac(position.amount)}</div>
                                </div>
                                {
                                  position.apy ?
                                    <div>
                                      <span className="text-sm text-white/60">APY</span>
                                      <div className="text-emerald-400">{(formatNumberByFrac(position.apy) || "0")}%</div>
                                    </div>
                                    : null
                                }
                                {Number(position?.rewards) > 0 ?
                                  <div>
                                    <span className={`text-sm text-white/60`}>Rewards by year</span>
                                    <div className={`flex text-emerald-400 items-center gap-1`}>
                                      ${(formatNumberByFrac(position.rewards) || "0")}
                                      <ArrowUp className="w-4 h-4" />
                                    </div>
                                  </div>
                                  : null
                                }
                                {!!position.healthFactor && (
                                  <div>
                                    <span className="text-sm text-white/60">Health Factor</span>
                                    <div className="text-emerald-400">{formatHealthFactor(position.healthFactor)}</div>
                                  </div>
                                )}
                                {position.poolShare && (
                                  <div>
                                    <span className="text-sm text-white/60">Pool Share</span>
                                    <div>{formatNumberByFrac(position.poolShare, 3)}%</div>
                                  </div>
                                )}
                                {position.collateralFactor && (
                                  <div>
                                    <span className="text-sm text-white/60">Collateral Factor</span>
                                    <div>{(formatNumberByFrac(position.collateralFactor * 100))}%</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-4 flex-1">
                            <div className="w-32">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="">Allocation</span>
                                <span>{formatNumberByFrac(allocationPercent)}%</span>
                              </div>
                              <div className="h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-purple-500 rounded-full"
                                  style={{ width: `${allocationPercent}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}