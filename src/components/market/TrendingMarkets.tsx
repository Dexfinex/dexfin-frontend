import React, { useState } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { useGetTrendingCoins, useGetTopGainers } from '../../hooks/useMarketTrend';

export const TrendingMarkets: React.FC = () => {

  const { data: coins, isLoading: isLoadingTrend, refetch: refetchTrend, error: errorTrend } = useGetTrendingCoins();
  const { data: gainer, isLoading: isLoadingGainer, error: errorGainer, refetch: refetchGainer } = useGetTopGainers();

  const error = errorTrend || errorGainer;
  const isLoading = isLoadingTrend || isLoadingGainer;

  const [selectedTab, setSelectedTab] = useState('Trending Tokens');

  const handleRefresh = async () => {
    switch (selectedTab) {
      case "Trending Tokens":
        await refetchTrend();
        break;
      case "Top Gainers":
        await refetchGainer();
        break;
      case "Top Losers":

        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 h-full">
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-white/5 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <p className="text-white/60 mb-4">{error.message}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 h-full">
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedTab('Trending Tokens')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${selectedTab === 'Trending Tokens'
              ? 'bg-white/10'
              : 'hover:bg-white/5'
              }`}
          >
            Trending Tokens
          </button>
          <button
            onClick={() => setSelectedTab('Top Gainers')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${selectedTab === 'Top Gainers'
              ? 'bg-white/10'
              : 'hover:bg-white/5'
              }`}
          >
            Top Gainers
          </button>
          <button
            onClick={() => setSelectedTab('Top Losers')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${selectedTab === 'Top Losers'
              ? 'bg-white/10'
              : 'hover:bg-white/5'
              }`}
          >
            Top Losers
          </button>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          title="Refresh data"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {(coins || []).map((coin) => (
          <div
            key={coin.id}
            className="p-4 rounded-xl bg-black/20 hover:bg-black/30 transition-all hover:scale-[1.02] group"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                <img
                  src={coin.thumb}
                  alt={coin.name}
                  className="w-12 h-12 rounded-full relative"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg tracking-tight truncate">
                      {coin.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm text-white/80">{coin.symbol}</span>
                      {coin.marketCapRank && (
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-medium">
                          Rank #{coin.marketCapRank}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-medium text-white">
                      ${coin.priceUsd.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6
                      })}
                    </div>
                    {coin.volume > 0 && (
                      <div className="flex items-center gap-1 text-sm mt-0.5">
                        <span className="text-white/60">Vol:</span>
                        <span className="text-white/80">
                          ${new Intl.NumberFormat('en-US', {
                            notation: 'compact',
                            maximumFractionDigits: 1
                          }).format(coin.volume)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};