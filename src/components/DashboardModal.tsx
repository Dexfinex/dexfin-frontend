import { useState, useEffect, useContext } from "react"
import { X, Maximize2, Minimize2, TrendingUp, TrendingDown } from "lucide-react"
import { Line } from "react-chartjs-2"
import { Web3AuthContext } from "../providers/Web3AuthContext"
import { useEvmWalletBalance } from "../hooks/useBalance"
import useTokenBalanceStore from "../store/useTokenBalanceStore"
import { TokenIcon, TokenChainIcon } from "./swap/components/TokenIcon"
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
} from "chart.js"
import { formatNumberByFrac } from "../utils/common.util"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend)

interface DashboardModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Token {
  name: string
  symbol: string
  amount: number
  value: number
  change24h: number
  allocation: number
  logo: string
  chainId?: number
}

interface PortfolioSummary {
  totalValue: number
  pnl: {
    value: number
    percentage: number
  }
  defiPositions: {
    value: number
    percentage: number
  }
  nftValue: {
    value: number
    percentage: number
  }
}

interface DefiPosition {
  protocol: string
  type: string // staking, lending, LP
  tokenSymbol: string
  amount: number
  value: number
  apy: number
  logo: string
  chainId?: number
}

export const DashboardModal: React.FC<DashboardModalProps> = ({ isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h")
  const [selectedTab, setSelectedTab] = useState("tokens")
  const [isLoading, setIsLoading] = useState(true)

  // Get Web3Auth context
  const {
    isConnected,
    provider,
    address,
    chainId
  } = useContext(Web3AuthContext)

  // Get wallet balances from your hook
  const { isLoading: isBalanceLoading, data: walletBalances, refetch: refetchBalances } = useEvmWalletBalance()

  // Get token balances from store
  const tokenBalances = walletBalances;
  // useTokenBalanceStore(state => state.tokenBalances)
  // State for dynamic data
  const [tokens, setTokens] = useState<Token[]>([])
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary>({
    totalValue: 0,
    pnl: { value: 0, percentage: 0 },
    defiPositions: { value: 0, percentage: 0 },
    nftValue: { value: 0, percentage: 0 },
  })
  const [performanceData, setPerformanceData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Portfolio Value",
        data: [12000, 13500, 14200, 14800, 15200, 15406],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  })
  const [distributionData, setDistributionData] = useState({
    labels: ["Spot", "Staked", "Lending", "LP"],
    datasets: [
      {
        data: [70, 15, 10, 5],
        backgroundColor: ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B"],
        borderWidth: 0,
      },
    ],
  })
  const [defiPositions, setDefiPositions] = useState<DefiPosition[]>([])

  // Process token balances from your existing hooks
  useEffect(() => {
    if (!isOpen || isBalanceLoading || !tokenBalances || tokenBalances.length === 0) return

    try {
      const processedTokens = tokenBalances.map(token => {
        return {
          name: token.name,
          symbol: token.symbol,
          amount: formatNumberByFrac(token.balanceDecimal),
          value: token.usdValue,
          change24h: token.usdPrice > 0 ? ((token.usdPrice - token.usdPrice * 0.98) / token.usdPrice) * 100 : 0,
          allocation: 0,
          logo: token.logo || `https://cryptologos.cc/logos/${token.symbol.toLowerCase()}-logo.png`,
          chainId: token?.network.chainId || 1,
        } as Token
      })

      // Calculate total value
      const totalValue = tokenBalances.reduce((sum, token) => sum + token.usdValue, 0)

      // Calculate allocation percentages
      const tokensWithAllocations = processedTokens.map(token => ({
        ...token,
        allocation: totalValue > 0 ? (token.value / totalValue) * 100 : 0,
      }))

      // Sort tokens by value (highest first)
      const sortedTokens = tokensWithAllocations.sort((a, b) => b.value - a.value)

      setTokens(sortedTokens)


      const weightedPnlPercentage = sortedTokens.reduce((sum, token) => {
        return sum + (token.change24h * (token.value / totalValue))
      }, 0)

      const pnlValue = totalValue * (weightedPnlPercentage / 100)

      // Update portfolio summary with real data
      setPortfolioSummary({
        totalValue,
        pnl: {
          value: pnlValue,
          percentage: weightedPnlPercentage,
        },
        // For DeFi and NFT, we'll estimate based on total value
        defiPositions: {
          value: totalValue * 0.3, // Assuming 30% in DeFi
          percentage: 30,
        },
        nftValue: {
          value: totalValue * 0.05, // Assuming 5% in NFTs
          percentage: 5,
        },
      })

      // Generate DeFi positions based on tokens held
      generateDefiPositions(sortedTokens, totalValue * 0.3)

      // Update asset distribution
      updateAssetDistribution(totalValue, totalValue * 0.3, totalValue * 0.05)

      generatePerformanceData(totalValue)

    } catch (error) {
      console.error("Error processing token balances:", error)
    }
  }, [isOpen, isBalanceLoading, tokenBalances])

  // DeFi positions based on tokens held
  const generateDefiPositions = (portfolioTokens: Token[], totalDefiValue: number) => {
    // Find common token types that might be in DeFi
    const ethBasedTokens = portfolioTokens.filter(token =>
      ["eth", "weth", "steth"].includes(token.symbol.toLowerCase())
    )

    const stableTokens = portfolioTokens.filter(token =>
      ["usdc", "usdt", "dai", "busd"].includes(token.symbol.toLowerCase())
    )

    const positions: DefiPosition[] = []

    // Add Lido staking if ETH tokens exist
    if (ethBasedTokens.length > 0) {
      positions.push({
        protocol: "Lido",
        type: "staking",
        tokenSymbol: "stETH",
        amount: ethBasedTokens[0].amount * 0.4, // Assume 40% of ETH is staked
        value: ethBasedTokens[0].value * 0.4,
        apy: 3.8,
        logo: "https://cryptologos.cc/logos/lido-dao-ldo-logo.png",
        chainId: ethBasedTokens[0].chainId,
      })
    }

    // Add Aave lending if stablecoins exist
    if (stableTokens.length > 0) {
      positions.push({
        protocol: "Aave",
        type: "lending",
        tokenSymbol: stableTokens[0].symbol,
        amount: stableTokens[0].amount * 0.5,
        value: stableTokens[0].value * 0.5,
        apy: 2.5,
        logo: "https://cryptologos.cc/logos/aave-aave-logo.png",
        chainId: stableTokens[0].chainId,
      })
    }

    // Add Uniswap LP position if we have both token types
    if (ethBasedTokens.length > 0 && stableTokens.length > 0) {
      positions.push({
        protocol: "Uniswap",
        type: "LP",
        tokenSymbol: `${ethBasedTokens[0].symbol}-${stableTokens[0].symbol}`,
        amount: 0.2,
        value: totalDefiValue * 0.25,
        apy: 7.2,
        logo: "https://cryptologos.cc/logos/uniswap-uni-logo.png",
        chainId: ethBasedTokens[0].chainId,
      })
    }


    if (positions.length === 0) {
      positions.push({
        protocol: "Compound",
        type: "lending",
        tokenSymbol: "USDC",
        amount: totalDefiValue / 2000, // Approximate amount based on value
        value: totalDefiValue,
        apy: 2.8,
        logo: "https://cryptologos.cc/logos/compound-comp-logo.png",
        chainId: 1, // Default to Ethereum mainnet
      })
    }

    setDefiPositions(positions)
  }

  // Update asset distribution based on portfolio
  const updateAssetDistribution = (totalValue: number, defiValue: number, nftValue: number) => {
    // Calculate spot value (total minus DeFi and NFT)
    const spotValue = totalValue - defiValue - nftValue

    // Calculate percentages
    const spotPercentage = (spotValue / totalValue) * 100

    // Calculate DeFi type percentages 
    const stakingValue = defiPositions
      .filter(p => p.type === "staking")
      .reduce((sum, p) => sum + p.value, 0)
    const stakingPercentage = (stakingValue / totalValue) * 100

    const lendingValue = defiPositions
      .filter(p => p.type === "lending")
      .reduce((sum, p) => sum + p.value, 0)
    const lendingPercentage = (lendingValue / totalValue) * 100

    const lpValue = defiPositions
      .filter(p => p.type === "LP")
      .reduce((sum, p) => sum + p.value, 0)
    const lpPercentage = (lpValue / totalValue) * 100

    setDistributionData({
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
    })
  }

  // Generate performance chart data based on current value
  const generatePerformanceData = (currentValue: number) => {
    // Generate historical data points based on current value and selected timeframe
    let timeLabels: string[] = []
    let valueData: number[] = []


    if (selectedTimeframe === "24h") {
      // Generate hourly data for last 24h
      const hours = Array.from({ length: 24 }, (_, i) => {
        const hour = new Date().getHours() - 23 + i
        return hour < 0 ? hour + 24 : hour
      })

      timeLabels = hours.map(h => `${h}:00`)

      const volatility = 0.02 // 2% daily volatility
      let prevValue = currentValue * 0.98 // Start slightly lower

      valueData = hours.map((_, i) => {
        const change = (Math.random() - 0.45) * volatility * prevValue
        prevValue = prevValue + change
        return prevValue
      })

    } else if (selectedTimeframe === "7d") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      timeLabels = days

      const volatility = 0.03 // 3% volatility
      let prevValue = currentValue * 0.93 // Start 7% lower

      valueData = days.map((_, i) => {
        const change = (Math.random() - 0.4) * volatility * prevValue
        prevValue = prevValue + change
        return prevValue
      })

    } else if (selectedTimeframe === "1m") {
      timeLabels = ["Week 1", "Week 2", "Week 3", "Week 4"]

      const volatility = 0.05 // 5% volatility
      let prevValue = currentValue * 0.9 // Start 10% lower

      valueData = timeLabels.map((_, i) => {
        const change = (Math.random() - 0.35) * volatility * prevValue
        prevValue = prevValue + change
        return prevValue
      })

    } else if (selectedTimeframe === "6m") {
      timeLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]

      const volatility = 0.08 // 8% volatility
      let prevValue = currentValue * 0.8 // Start 20% lower

      valueData = timeLabels.map((_, i) => {
        const change = (Math.random() - 0.3) * volatility * prevValue
        prevValue = prevValue + change
        return prevValue
      })

    } else if (selectedTimeframe === "1y") {
      // Generate monthly data for last year
      timeLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

      const volatility = 0.1 // 10% volatility
      let prevValue = currentValue * 0.7 // Start 30% lower

      valueData = timeLabels.map((_, i) => {
        const change = (Math.random() - 0.25) * volatility * prevValue
        prevValue = prevValue + change
        return prevValue
      })

    } else {
      timeLabels = ["2022", "2023", "2024", "2025"]

      // Start from much lower value and grow
      valueData = [
        currentValue * 0.4,
        currentValue * 0.6,
        currentValue * 0.85,
        currentValue
      ]
    }

    // Set the chart data
    setPerformanceData({
      labels: timeLabels,
      datasets: [
        {
          label: "Portfolio Value",
          data: valueData,
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          fill: true,
          tension: 0.4,
        },
      ],
    })
  }

  // Update historical data when timeframe changes
  useEffect(() => {
    if (!isOpen || isLoading || portfolioSummary.totalValue === 0) return
    generatePerformanceData(portfolioSummary.totalValue)
  }, [selectedTimeframe, portfolioSummary.totalValue, isLoading])

  // Fetch all data
  useEffect(() => {
    if (!isOpen) return

    const fetchData = async () => {
      setIsLoading(true)
      try {
        await refetchBalances()
      } catch (error) {
        console.error("Error fetching wallet balances:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [isOpen, refetchBalances])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Refresh all data
  const refreshData = async () => {
    setIsLoading(true)
    try {
      await refetchBalances()
    } catch (error) {
      console.error("Error refreshing data:", error)
    } finally {
      setIsLoading(false)
    }
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

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-0">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative w-full glass border border-black/10 dark:border-white/10 shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${isFullscreen ? "h-full rounded-none" : "max-w-7xl h-[90vh] rounded-xl"
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
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-73px)] overflow-y-auto scrollbar-thin scrollbar-thumb-black/10 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
          {isLoading || isBalanceLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
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
                  <div className="text-xl sm:text-2xl font-bold">${portfolioSummary.totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  <div className={`flex items-center gap-1 mt-1 ${portfolioSummary.pnl.percentage >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {portfolioSummary.pnl.percentage >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{Math.abs(portfolioSummary.pnl.percentage).toFixed(2)}%</span>
                  </div>
                </div>

                {/* PNL */}
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="text-sm ">PNL</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-xl sm:text-2xl font-bold">
                      {portfolioSummary.pnl.value >= 0 ? "+" : ""}
                      ${Math.abs(portfolioSummary.pnl.value).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                    <div className={`flex items-center gap-1 ${portfolioSummary.pnl.percentage >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {portfolioSummary.pnl.percentage >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>{Math.abs(portfolioSummary.pnl.percentage).toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {["24h", "7d", "1m", "6m", "1y", "All"].map((timeframe) => (
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
                  <div className="text-xl sm:text-2xl font-bold">${portfolioSummary.defiPositions.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  <div className="text-sm mt-1">{portfolioSummary.defiPositions.percentage.toFixed(1)}% of portfolio</div>
                </div>

                {/* NFT Value */}
                {/* <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
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
                    <div className="text-sm ">NFT Value</div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold">${portfolioSummary.nftValue.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  <div className="text-sm mt-1">{portfolioSummary.nftValue.percentage.toFixed(1)}% of portfolio</div>
                </div> */}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Chart */}
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <h3 className="font-medium">Portfolio Performance</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      {["24h", "7d", "1m", "6m", "1y", "All"].map((timeframe) => (
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
                    <Line data={performanceData} options={chartOptions} />
                  </div>
                </div>

                {/* Distribution Chart */}
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Asset Distribution</h3>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-12">
                    <div className="relative w-[200px] h-[200px] sm:w-[250px] sm:h-[250px]">
                      <Line data={distributionData} options={chartOptions} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-2xl sm:text-3xl font-bold">
                          ${portfolioSummary.totalValue >= 1000000
                            ? (portfolioSummary.totalValue / 1000000).toFixed(1) + 'M'
                            : portfolioSummary.totalValue >= 1000
                              ? (portfolioSummary.totalValue / 1000).toFixed(1) + 'K'
                              : portfolioSummary.totalValue.toFixed(2)
                          }
                        </div>
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
                            <span className="">{distributionData.datasets[0].data[index].toFixed(1)}%</span>
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
                  {["tokens", "defi", ""].map((tab) => (
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
                      {tokens.map((token, index) => (
                        <div
                          key={`${token.symbol}-${token.chainId}-${index}`}
                          className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            {token.chainId ? (
                              <TokenChainIcon
                                src={token.logo || "/placeholder.svg"}
                                alt={token.name}
                                chainId={token.chainId}
                                size="lg"
                              />
                            ) : (
                              <TokenIcon
                                src={token.logo || "/placeholder.svg"}
                                alt={token.name}
                                size="lg"
                              />
                            )}
                            <div className="flex-1 min-w-[120px]">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{token.name}</span>
                                <span className="">{token.symbol}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <span>
                                  {token.amount.toLocaleString(undefined, { maximumFractionDigits: 8 })} {token.symbol}
                                </span>
                                <span className="text-black/40 dark:text-white/40">•</span>
                                <span>${token.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-4 flex-1">
                            <div className="text-right">
                              <div className="text-lg">${token.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                              <div
                                className={`flex items-center gap-1 justify-end text-sm ${token.change24h >= 0 ? "text-emerald-400" : "text-red-400"
                                  }`}
                              >
                                {token.change24h >= 0 ? (
                                  <TrendingUp className="w-4 h-4" />
                                ) : (
                                  <TrendingDown className="w-4 h-4" />
                                )}
                                <span>{Math.abs(token.change24h).toFixed(2)}%</span>
                              </div>
                            </div>
                            <div className="w-32">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="">Allocation</span>
                                <span>{token.allocation.toFixed(2)}%</span>
                              </div>
                              <div className="h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{ width: `${token.allocation}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedTab === "defi" && (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-black/10 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
                      {defiPositions.map((position, index) => (
                        <div
                          key={`${position.protocol}-${position.tokenSymbol}-${index}`}
                          className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            {position.chainId ? (
                              <TokenChainIcon
                                src={position.logo || "/placeholder.svg"}
                                alt={position.protocol}
                                chainId={position.chainId}
                                size="lg"
                              />
                            ) : (
                              <TokenIcon
                                src={position.logo || "/placeholder.svg"}
                                alt={position.protocol}
                                size="lg"
                              />
                            )}
                            <div className="flex-1 min-w-[120px]">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{position.protocol}</span>
                                <span className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10">{position.type}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <span>
                                  {position.amount.toLocaleString(undefined, { maximumFractionDigits: 8 })} {position.tokenSymbol}
                                </span>
                                <span className="text-black/40 dark:text-white/40">•</span>
                                <span>${position.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-4 flex-1">
                            <div className="text-right">
                              <div className="text-lg">${position.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                              <div className="flex items-center gap-1 justify-end text-sm text-emerald-400">
                                <TrendingUp className="w-4 h-4" />
                                <span>APY: {position.apy.toFixed(2)}%</span>
                              </div>
                            </div>
                            <div className="w-32">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="">Allocation</span>
                                <span>{((position.value / portfolioSummary.defiPositions.value) * 100).toFixed(2)}%</span>
                              </div>
                              <div className="h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-purple-500 rounded-full"
                                  style={{ width: `${(position.value / portfolioSummary.defiPositions.value) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedTab === "nfts" && (
                    <div className="p-6 text-center">
                      <p>NFT data will be integrated in the next update.</p>
                      <p className="text-sm mt-2 opacity-60">Estimated value: ${portfolioSummary.nftValue.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                      <button className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">
                        Connect NFT Marketplace
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}