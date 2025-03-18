import React, { useMemo, useState } from 'react';
import { RefreshCw, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { Skeleton } from '@chakra-ui/react';
import { useGetTrendingCoins, useGetTopGainers, useGetTopLosers } from '../../hooks/useMarketTrend';
import { formatNumberByFrac } from '../../utils/common.util';

export const TrendingMarkets: React.FC = () => {

  const { data: coins, isLoading: isLoadingTrend, refetch: refetchTrend, error: errorTrend } = useGetTrendingCoins();
  const { data: gainers, isLoading: isLoadingGainer, error: errorGainer, refetch: refetchGainer } = useGetTopGainers();
  const { data: losers, isLoading: isLoadingLoser, error: errorLoser, refetch: refetchLoser } = useGetTopLosers();

  const error = errorTrend || errorGainer || errorLoser;

  const [selectedTab, setSelectedTab] = useState('Trending Tokens');

  const isLoading = useMemo(() => {
    switch (selectedTab) {
      case "Trending Tokens":
        return isLoadingTrend;
      case "Top Gainers":
        return isLoadingGainer;
      case "Top Losers":
        return isLoadingLoser
      default:
        return isLoadingTrend;
    }
  }, [selectedTab, isLoadingTrend, isLoadingGainer, isLoadingLoser]);

  const handleRefresh = async () => {
    switch (selectedTab) {
      case "Trending Tokens":
        await refetchTrend();
        break;
      case "Top Gainers":
        await refetchGainer();
        break;
      case "Top Losers":
        await refetchLoser();
        break;
      default:
        break;
    }
  };
  const navigateToCoinGecko = (coinId: string) => {
    window.open(`https://www.coingecko.com/en/coins/${coinId}`, '_blank', 'noopener,noreferrer');
  };

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
    <div className="p-2 sm:p-6 h-full">
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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3  lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1">

        {
          isLoading && Array.from({ length: 15 }).map((_, index) => {
            return <Skeleton startColor="#444" endColor="#1d2837" w={'100%'} h={'6rem'} key={index}></Skeleton>
          })
        }

        {selectedTab === "Trending Tokens" && (coins || []).map((coin) => (
          <div
            key={coin.id}
            className="p-3 sm:p-4 rounded-xl bg-black/20 hover:bg-black/40 transition-all hover:scale-[1.02]  group cursor-pointer"
            onClick={() => navigateToCoinGecko(coin.id)}

          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                <img
                  src={coin.thumb}
                  alt={coin.name}
                  className="w-8 h-8 sm:w-12 sm:h-12 rounded-full relative"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-md lg:text-lg  tracking-tight truncate w-[150px] sm:w-full">
                      {coin.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm text-white/80">{coin.symbol}</span>
                      <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-medium">
                        Rank #{coin.marketCapRank}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className='flex gap-1 '>
                      <div className="text-lg font-medium text-white">
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
                      <div className=" items-center gap-1 text-sm mt-0.5">
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

        {selectedTab === "Top Gainers" && (gainers || []).map((gainer) => (
          <div
            key={gainer.id}
            className="p-3 sm:p-4 rounded-xl bg-black/20 hover:bg-black/40 transition-all hover:scale-[1.02] group cursor-pointer"
            onClick={() => navigateToCoinGecko(gainer.id)}

          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                <img
                  src={gainer.thumb}
                  alt={gainer.name}
                  className="w-8 h-8 sm:w-12 sm:h-12 rounded-full relative"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-md lg:text-lg  tracking-tight truncate w-[150px] sm:w-full">
                      {gainer.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm text-white/80">{gainer.symbol}</span>
                      {gainer.marketCapRank && (
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-medium">
                          Rank #{gainer.marketCapRank}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right justify-items-end">
                    <div className="flex text-lg font-medium text-white">
                      ${formatNumberByFrac(gainer.priceUsd)}
                      <div className={`flex items-center ml-1 justify-end text-sm ${gainer.usd24hChange >= 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                        {gainer.usd24hChange > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                        {formatNumberByFrac(Math.abs(gainer.usd24hChange))} %
                      </div>
                    </div>
                    {gainer.usd24hVol > 0 && (
                      <div className="flex text-sm mt-0.5">
                        <span className="text-white/60">24H Vol:</span>
                        <span className="text-white/80 ml-2">
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

        {selectedTab === "Top Losers" && (losers || []).map((loser) => (
          <div
            key={loser.id}
            className="p-3 sm:p-4 rounded-xl bg-black/20 hover:bg-black/40 transition-all hover:scale-[1.02] group cursor-pointer"
            onClick={() => navigateToCoinGecko(loser.id)}

          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                <img
                  src={loser.thumb}
                  alt={loser.name}
                  className="w-8 h-8 md:w-10 md:h-10 sm:w-12 sm:h-12  rounded-full relative"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-md lg:text-lg  tracking-tight truncate w-[150px] sm:w-full">
                      {loser.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm text-white/80">{loser.symbol}</span>
                      {loser.marketCapRank && (
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-medium">
                          Rank #{loser.marketCapRank}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right justify-items-end">
                    <div className="flex text-lg font-medium text-white">
                      ${formatNumberByFrac(loser.priceUsd)}
                      <div className={`flex items-center ml-1 justify-end text-sm ${loser.usd24hChange >= 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                        {loser.usd24hChange > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                        {formatNumberByFrac(Math.abs(loser.usd24hChange))} %
                      </div>
                    </div>
                    {loser.usd24hVol > 0 && (
                      <div className="text-sm mt-0.5">
                        <span className="text-white/60">24H Vol:</span>
                        <span className="text-white/80 ml-2">
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
    </div>
  );
};