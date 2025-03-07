import React, { useContext, useState, useEffect } from "react"
import { TrendingUp, Wallet, Landmark } from "lucide-react"
import { useWalletBalance } from "../../hooks/useBalance"
import { Web3AuthContext } from "../../providers/Web3AuthContext"
import { Skeleton } from "@chakra-ui/react"
import { TokenChainIcon } from "../swap/components/TokenIcon"
import { formatNumberByFrac } from "../../utils/common.util"
import { useDefiPositionByWallet } from "../../hooks/useDefi"
import useDefiStore from "../../store/useDefiStore"

interface AllocationData {
  type: string
  percentage: number
  color: string
}

type WalletTab = "assets" | "defi"

export const PortfolioWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<WalletTab>("assets")
  const { chainId, address } = useContext(Web3AuthContext)
  const { isLoading, data: balanceData } = useWalletBalance({
    chainId: chainId,
    address: address,
  })
  const { isLoading: isLoadingPositions } = useDefiPositionByWallet({
    chainId: chainId,
    walletAddress: address
  })

  const { positions } = useDefiStore()
  console.log("positions : ", positions)

  // Calculate total portfolio value from balance data
  const portfolioValue = React.useMemo(() => {
    if (!balanceData) return 0
    return balanceData.reduce((sum, token) => sum + (token.usdValue || 0), 0)
  }, [balanceData])

  // Calculate total DeFi positions value
  const defiPositionsValue = React.useMemo(() => {
    if (!positions) return 0
    return positions.reduce((sum, position) => sum + position.value, 0)
  }, [positions])

  // Calculate combined portfolio value
  const totalPortfolioValue = React.useMemo(() => {
    return portfolioValue + defiPositionsValue
  }, [portfolioValue, defiPositionsValue])

  // Calculate allocation percentages based on real balances
  const allocation: AllocationData[] = React.useMemo(() => {
    if (!balanceData) return []

    const total = totalPortfolioValue

    if (total === 0) {
      return [
        {
          type: "Spot",
          percentage: 100,
          color: "#10B981",
        }
      ]
    }

    // Filter positions by type
    const lendingPositions = positions.filter(position => position.type === 'LENDING')
    const stakingPositions = positions.filter(position => position.type === 'STAKING')

    // Calculate values for each category
    const lendingValue = lendingPositions.reduce((sum, position) => sum + position.value, 0)
    const stakingValue = stakingPositions.reduce((sum, position) => sum + position.value, 0)
    const spotValue = portfolioValue

    // Calculate percentages
    const spotPercentage = Math.round((spotValue / total) * 100)
    const stakingPercentage = Math.round((stakingValue / total) * 100)
    const lendingPercentage = Math.round((lendingValue / total) * 100)

    return [
      {
        type: "Spot",
        percentage: spotPercentage,
        color: "#10B981",
      },
      {
        type: "Staked",
        percentage: stakingPercentage,
        color: "#3B82F6",
      },
      {
        type: "Lending",
        percentage: lendingPercentage,
        color: "#8B5CF6",
      },
    ].filter((item) => item.percentage > 0)
  }, [balanceData, positions, portfolioValue, totalPortfolioValue])

  const createPieSegments = () => {
    const radius = 40
    const circumference = 2 * Math.PI * radius
    let currentAngle = 0

    return allocation.map((item) => {
      const angle = (item.percentage / 100) * 360
      const length = (angle / 360) * circumference
      const gap = 1

      const segment = {
        offset: currentAngle,
        length: length - gap,
        color: item.color,
      }

      currentAngle += length
      return segment
    })
  }

  const pieSegments = createPieSegments()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  if (isLoading || isLoadingPositions) {
    return (
      <div className="p-2 h-full flex flex-col">
        <Skeleton height="100px" />
      </div>
    )
  }

  return (
    <div className="h-full">
      <div className="flex flex-col h-full">
        <div className="flex-none">
          {/* Total Balance */}
          <div className="p-4">
            <div className="text-sm">Total Balance</div>
            <div className="text-2xl font-bold mt-1">
              {formatCurrency(totalPortfolioValue)}
            </div>
            {/* <div className="flex items-center gap-1 mt-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+1.57% TODAY</span>
            </div> */}
          </div>

          {/* Chart Section */}
          <div className="flex gap-4 p-4">
            <div className="relative">
              <svg className="w-[120px] h-[120px] -rotate-90">
                {pieSegments.map((segment, index) => (
                  <circle
                    key={index}
                    cx="60"
                    cy="60"
                    r="35"
                    fill="none"
                    stroke={segment.color}
                    strokeWidth="28"
                    strokeDasharray={`${segment.length} ${251.2 - segment.length}`}
                    strokeDashoffset={-segment.offset}
                    className="transition-all duration-1000 ease-out"
                  />
                ))}
              </svg>
            </div>

            <div className="flex flex-col justify-center gap-1">
              {allocation.map(item => (
                <div key={item.type} className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs ">{item.type}</span>
                  <span className="text-xs">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-black/10 dark:border-white/10">
            <button
              onClick={() => setActiveTab('assets')}
              className={`flex items-center gap-2 flex-1 p-2 text-sm transition-colors ${activeTab === 'assets'
                ? 'bg-black/10 dark:bg-white/10 font-medium'
                : 'hover:bg-black/5 dark:hover:bg-white/5'
                }`}
            >
              <Wallet className="w-4 h-4" />
              Assets
            </button>
            <button
              onClick={() => setActiveTab('defi')}
              className={`flex items-center gap-2 flex-1 p-2 text-sm transition-colors ${activeTab === 'defi'
                ? 'bg-black/10 dark:bg-white/10 font-medium'
                : 'hover:bg-black/5 dark:hover:bg-white/5'
                }`}
            >
              <Landmark className="w-4 h-4" />
              DeFi
            </button>
          </div>
        </div>

        {/* Scrollable Content Section */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {activeTab === "assets" ? (
              // Assets Tab
              <div className="space-y-2">
                {isLoading ? (
                  <Skeleton startColor="#444" endColor="#1d2837" w={"100%"} h={"4rem"} />
                ) : (
                  balanceData?.map((token, index) =>
                  (
                    <button
                      key={token.chain + token.symbol}
                      className="flex w-full items-center justify-between p-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <TokenChainIcon src={token.logo} alt={token.name} size="lg" chainId={token?.network?.chainId} />
                        <div className="flex flex-col justify-start items-start">
                          <div className="font-medium">{token.symbol}</div>
                          <div className="text-sm">
                            {`${formatNumberByFrac(token.balanceDecimal)} ${token.symbol}`}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div>{formatCurrency(token.usdValue)}</div>
                      </div>
                    </button>
                  )
                  )
                )}
              </div>
            ) : (
              // DeFi Tab
              <div className="space-y-2">
                {isLoadingPositions ? (
                  <Skeleton startColor="#444" endColor="#1d2837" w={"100%"} h={"4rem"} />
                ) : positions.length === 0 ? (
                  <div className="text-center py-6 text-sm opacity-60">
                    No DeFi positions found
                  </div>
                ) : (
                  positions.map((position, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={position.logo || "/placeholder.svg"}
                          alt={position.protocol}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex flex-col justify-start items-start">
                          <div className="font-medium">{position.protocol}</div>
                          <div className="text-sm">
                            {position.tokens && position.tokens.length > 0 &&
                              `${formatNumberByFrac(position.tokens[0].amount)} ${position.tokens[0].symbol}`
                            }
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div>{formatCurrency(position.value)}</div>
                        <div className="text-xs text-green-400">{position.apy}% APY</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioWidget