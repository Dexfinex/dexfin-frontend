import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { coingeckoService } from '../../services/coingecko.service';
import { TrendingCoin } from '../../types';
import { formatNumberByFrac } from '../../utils/common.util';
import { useGetTopGainers, useGetTopLosers } from '../../hooks/useMarketTrend';
import { RefreshableWidget } from '../ResizableWidget';

type TrendingTab = "trending" | "gainers" | "losers";

export const TrendingWidget = forwardRef<RefreshableWidget, {}>((props, ref) => {
  const [coins, setCoins] = useState<TrendingCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TrendingTab>("trending");

  const { data: losers, isLoading: isLoadingLoser, error: errorLoser, refetch: refetchLoser } = useGetTopLosers();
  const { data: gainers, isLoading: isLoadingGainer, error: errorGainer, refetch: refetchGainer } = useGetTopGainers();

  const fetchData = async (showRefreshState = false) => {
    try {
      if (showRefreshState) {
        setRefreshing(true);
      }
      const data = await coingeckoService.getTrendingCoins();
      if (data && data.length > 0) {
        setCoins(data);
        setError(null);
      } else {
        setError('No trending data available');
      }
    } catch (err) {
      console.error('Error fetching trending coins:', err);
      setError('Unable to load trending data');
    } finally {
      setLoading(false);
      if (showRefreshState) {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 2 minutes to stay within rate limits
    const interval = setInterval(() => fetchData(), 120000);
    return () => clearInterval(interval);
  }, []);

  // Expose the handleRefresh method to the parent
  const handleRefresh = async () => {
    switch (activeTab) {
      case "trending":
        await fetchData(true);
        break;
      case "losers":
        await refetchLoser();
        break;
      case "gainers":
        await refetchGainer();
        break;
      default:
        break;
    }
  };

  // Expose the refresh method through the ref
  useImperativeHandle(ref, () => ({
    handleRefresh
  }));

  const isLoading = () => {
    switch (activeTab) {
      case "trending":
        return loading;
      case "losers":
        return isLoadingLoser;
      case "gainers":
        return isLoadingGainer;
      default:
        return false;
    }
  };

  const getError = () => {
    switch (activeTab) {
      case "trending":
        return error;
      case "losers":
        return errorLoser?.message || null;
      case "gainers":
        return errorGainer?.message || null;
      default:
        return null;
    }
  };

  if (isLoading()) {
    return (
      <div className="p-2 h-full">
        <div className="animate-pulse space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[72px] bg-white/5 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const currentError = getError();
  if (currentError) {
    return (
      <div className="p-2 h-full flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
        <p className="text-white/60 mb-4">{currentError}</p>
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
    <div className="p-2 h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-black/10 dark:border-white/10">
        <button
          onClick={() => setActiveTab('trending')}
          className={`flex items-center gap-2 flex-1 p-2 text-sm transition-colors ${activeTab === 'trending'
            ? 'bg-black/10 dark:bg-white/10 font-medium'
            : 'hover:bg-black/5 dark:hover:bg-white/5'
            }`}
        >
          Trending
        </button>
        <button
          onClick={() => setActiveTab('losers')}
          className={`flex items-center gap-2 flex-1 p-2 text-sm transition-colors ${activeTab === 'losers'
            ? 'bg-black/10 dark:bg-white/10 font-medium'
            : 'hover:bg-black/5 dark:hover:bg-white/5'
            }`}
        >
          Top Losers
        </button>
        <button
          onClick={() => setActiveTab('gainers')}
          className={`flex items-center gap-2 flex-1 p-2 text-sm transition-colors ${activeTab === 'gainers'
            ? 'bg-black/10 dark:bg-white/10 font-medium'
            : 'hover:bg-black/5 dark:hover:bg-white/5'
            }`}>Top Gainers</button>
      </div>

      {/* Trending Tab Content */}
      {activeTab === "trending" && (
        <div className="flex-1 space-y-2 overflow-y-auto ai-chat-scrollbar">
          {coins.map((coin) => (
            <div
              key={coin.id}
              className="p-2.5 rounded-xl bg-black/20 hover:bg-black/30 transition-all hover:scale-[1.02] group"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                  <img
                    src={coin.thumb}
                    alt={coin.name}
                    className="w-8 h-8 rounded-full relative"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-sm truncate">{coin.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-white/80">{coin.symbol}</span>
                        {coin.marketCapRank && (
                          <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] font-medium">
                            #{coin.marketCapRank}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className='flex gap-1 '>
                        <div className="text-sm font-medium">
                          ${formatNumberByFrac(coin.priceUsd)}
                        </div>
                        <div className="flex items-center gap-1 text-xs mt-0.5 justify-end">
                          <span
                            className={` flex ${coin.priceChaingePercentage24hUsd >= 0
                              ? 'text-green-500'
                              : 'text-red-500'
                              }`}
                          >
                            {coin.priceChaingePercentage24hUsd > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                            {formatNumberByFrac(coin.priceChaingePercentage24hUsd)}%
                          </span>
                        </div>
                      </div>

                      {coin.volume > 0 && (
                        <div className="gap-1 text-xs mt-0.5">
                          <span className="text-white/60">Vol:</span>
                          <span className="text-white/80 ml-1">
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
      )}
      {/* Top Gainers Tab Content */}
      {activeTab === "gainers" && gainers && (
        <div className="flex-1 space-y-2 overflow-y-auto ai-chat-scrollbar">
          {gainers.map((gainer) => (
            <div
              key={gainer.id}
              className="p-2.5 rounded-xl bg-black/20 hover:bg-black/30 transition-all hover:scale-[1.02] group"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                  <img
                    src={gainer.thumb}
                    alt={gainer.name}
                    className="w-8 h-8 rounded-full relative"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-sm truncate">{gainer.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-white/80">{gainer.symbol}</span>
                        {gainer.marketCapRank && (
                          <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] font-medium">
                            #{gainer.marketCapRank}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className='flex gap-1'>
                        <div className="text-sm font-medium">
                          ${formatNumberByFrac(gainer.priceUsd)}
                        </div>
                        <div className="flex items-center gap-1 text-xs mt-0.5 justify-end">
                          <span className="flex text-green-500">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            {formatNumberByFrac(Math.abs(gainer.usd24hChange))}%
                          </span>
                        </div>
                      </div>

                      {gainer.usd24hVol > 0 && (
                        <div className="gap-1 text-xs mt-0.5">
                          <span className="text-white/60">Vol:</span>
                          <span className="text-white/80 ml-1">
                            ${new Intl.NumberFormat('en-US', {
                              notation: 'compact',
                              maximumFractionDigits: 1
                            }).format(gainer.usd24hVol)}
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
      )}
      {/* Top Losers Tab Content */}
      {activeTab === "losers" && losers && (
        <div className="flex-1 space-y-2 overflow-y-auto ai-chat-scrollbar">
          {losers.map((loser) => (
            <div
              key={loser.id}
              className="p-2.5 rounded-xl bg-black/20 hover:bg-black/30 transition-all hover:scale-[1.02] group"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                  <img
                    src={loser.thumb}
                    alt={loser.name}
                    className="w-8 h-8 rounded-full relative"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-sm truncate">{loser.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-white/80">{loser.symbol}</span>
                        {loser.marketCapRank && (
                          <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] font-medium">
                            #{loser.marketCapRank}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className='flex gap-1'>
                        <div className="text-sm font-medium">
                          ${formatNumberByFrac(loser.priceUsd)}
                        </div>
                        <div className="flex items-center gap-1 text-xs mt-0.5 justify-end">
                          <span className="flex text-red-500">
                            <TrendingDown className="w-4 h-4 mr-1" />
                            {formatNumberByFrac(Math.abs(loser.usd24hChange))}%
                          </span>
                        </div>
                      </div>

                      {loser.usd24hVol > 0 && (
                        <div className="gap-1 text-xs mt-0.5">
                          <span className="text-white/60">Vol:</span>
                          <span className="text-white/80 ml-1">
                            ${new Intl.NumberFormat('en-US', {
                              notation: 'compact',
                              maximumFractionDigits: 1
                            }).format(loser.usd24hVol)}
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
      )}
    </div>
  );
});

TrendingWidget.displayName = 'TrendingWidget';