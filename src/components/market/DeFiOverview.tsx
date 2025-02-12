import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  BarChart2,
  Wallet,
  PieChart,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

import { useGetDefillamaPools, useGetDefillamaProtocols } from '../../hooks/useDefillama';
import useDefillamaStore from '../../store/useDefillamaStore';
import { mapChainId2ChainName } from '../../config/networks';
import { getChainIcon } from '../../utils/getChainIcon';

export const DeFiOverview: React.FC = () => {
  const { isLoading: isLoadingPool, error: errorPool, refetch: refetchPool } = useGetDefillamaPools();
  const { isLoading: isLoadingProtocol, error: errorProtocol, refetch: refetchProtocol } = useGetDefillamaProtocols();

  const [selectedChain, setSelectedChain] = useState({ name: "", icon: "" });
  const [showChainList, setShowChainList] = useState(false);

  const { getDeFiStats, pools } = useDefillamaStore();
  const defiStats = getDeFiStats();
  const yieldData = pools.filter((pool) => pool.chain.toUpperCase().includes(selectedChain.name.toUpperCase())).slice(0,9);

  const chainNameList = [{ name: "", icon: "" }].concat(Object.keys(mapChainId2ChainName).map((key) => ({
    name: mapChainId2ChainName[Number(key)],
    icon: getChainIcon(Number(key)) as string
  })));

  const loading = isLoadingPool || isLoadingProtocol;
  const error = errorPool || errorProtocol;

  const refetch = async () => {
    await refetchPool();
    await refetchProtocol();
  }

  if (error) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
        <p className="text-white/60">{error.message}</p>
      </div>
    );
  }

  if (loading || !defiStats) {
    return (
      <div className="p-6 h-full">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-white/5 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-96 bg-white/5 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto ai-chat-scrollbar">
      {/* Global Metrics */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-white/60">Total Value Locked</span>
          </div>
          <div className="text-2xl font-bold mb-1">
            ${(defiStats.totalTvl / 1e9).toFixed(2)}B
          </div>
          <div className={`flex items-center gap-1 text-sm ${defiStats.totalChange24h >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
            {defiStats.totalChange24h >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{Math.abs(defiStats.totalChange24h).toFixed(2)}%</span>
            <span className="text-white/60">24h</span>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-white/60">DeFi Market Cap</span>
          </div>
          <div className="text-2xl font-bold mb-1">
            ${(defiStats.defiMarketCap / 1e9).toFixed(2)}B
          </div>
          <div className="text-sm text-white/60">
            {((defiStats.defiMarketCap / defiStats.totalTvl) * 100).toFixed(1)}% TVL Ratio
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-4 h-4 text-green-400" />
            <span className="text-sm text-white/60">Category Distribution</span>
          </div>
          <div className="space-y-2">
            {defiStats.categories.slice(0, 3).map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <span>{cat.name}</span>
                <span>${(cat.tvl / 1e9).toFixed(2)}B</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Top Protocols */}
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Top Protocols by TVL</h3>
            <button
              onClick={refetch}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {defiStats.protocols.map((protocol) => (
              <div
                key={protocol.name}
                className="flex items-center gap-4 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                {
                  protocol.logo ?
                    <img
                      src={protocol.logo}
                      alt={protocol.name}
                      className="w-8 h-8 rounded-full"
                    />
                    :
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center ring-2 ring-[#0a0a0c]">
                      <span className="text-xs font-medium">{protocol.name.charAt(0)}</span>
                    </div>
                }
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{protocol.name}</span>
                      <span className="ml-2 text-sm text-white/60">{protocol.category}</span>
                    </div>
                    <div className="text-right">
                      <div>${(protocol.tvl / 1e9).toFixed(2)}B</div>
                      <div className={`text-sm ${protocol.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                        {protocol.change24h >= 0 ? '↑' : '↓'}
                        {Math.abs(protocol.change24h).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/40" />
              </div>
            ))}
          </div>
        </div>

        {/* Top Yields */}
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Top Yield Opportunities</h3>
            <a
              href="https://defillama.com/yields"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className='w-full flex'>
            <div className="top-full left-0 right-0 p-2 glass rounded-lg z-20 w-full">
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg mb-2">
                <button
                  key={selectedChain.name}
                  type="button"
                  onClick={() => { setShowChainList(true) }}
                  className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <div className="flex text-left w-full">
                    {
                      selectedChain.icon &&
                      <img
                        src={selectedChain.icon}
                        alt={selectedChain.name}
                        className="w-5 h-5 rounded-full"
                      />
                    }
                    <span className="text-sm text-white/60 ml-2">
                      {selectedChain.name || "All Networks"}
                    </span>
                  </div>
                </button>
              </div>

              {
                showChainList &&
                <div className="max-h-68 overflow-y-auto">
                  {chainNameList.map((chain, index) => (
                    <button
                      key={chain.name}
                      type="button"
                      onClick={() => {
                        setSelectedChain(chain);
                        setShowChainList(false)
                      }}
                      className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <div className="flex text-left w-full">
                        {
                          chain.icon &&
                          <img
                            src={chain.icon}
                            alt={chain.name}
                            className="w-5 h-5 rounded-full"
                          />
                        }
                        <span className="text-sm text-white/60 ml-2">
                          {chain.name || "All"}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              }

            </div>
          </div>

          <div className="space-y-3 mt-2">
            {(yieldData || []).map((pool) => (
              <div
                key={`${pool.protocol}-${pool.symbol}`}
                className="flex items-center gap-4 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center ring-2 ring-[#0a0a0c]">
                  <span className="text-xs font-medium">{pool.symbol.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{pool.symbol}</div>
                      <div className="text-sm text-white/60">
                        {pool.symbol} • {pool.chain}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400">{pool.apy.toFixed(2)}% APY</div>
                      <div className="text-sm text-white/60">
                        TVL: ${(pool.tvlUsd / 1e6).toFixed(2)}M
                      </div>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div >
  );
};