import React from 'react';
import { AnalysisLoser, AnalysisGainer } from '../../../../types';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatNumberByFrac } from '../../../../utils/common.util';

interface TopCoinProps {
  coins: AnalysisLoser[] | AnalysisGainer[];
  type: string;
}

export const TopCoins: React.FC<TopCoinProps> = ({ type, coins }) => {
  return (
    <div className="mt-4 space-y-2 w-[800px] max-w-full">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-blue-400" />
        {type=="loser" && <h2 className="text-xl font-semibold">Top Losers</h2>}
        {type=="gainer" && <h2 className="text-xl font-semibold">Top Gainers</h2>}
      </div>
      <div className="grid grid-cols-1 gap-3">
        {coins.map((coin) => (
          <div
            key={coin.id}
            className="flex items-center gap-4 p-4 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 hover:bg-white/5 transition-all hover:scale-[1.02] group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl group-hover:blur-2xl transition-all" />
              <img
                src={coin.thumb}
                alt={coin.name}
                className="w-12 h-12 rounded-full relative"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-md lg:text-lg tracking-tight">{coin.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm text-white/80">{coin.symbol}</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-medium">
                      Rank #{coin.marketCapRank}
                    </span>
                  </div>
                </div>
                <div className="text-right justify-items-end">
                  <div className="flex text-md lg:text-lg font-medium text-white">
                    ${formatNumberByFrac(coin.priceUsd)}
                    <div className={`flex items-center ml-1 justify-end text-sm ${coin.usd24hChange >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                      {coin.usd24hChange > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                      {formatNumberByFrac(Math.abs(coin.usd24hChange))} %
                    </div>
                  </div>
                  {coin.usd24hVol > 0 && (
                    <div className="flex text-sm mt-0.5">
                      <span className="text-white/60">24H Vol:</span>
                      <span className="text-white/80 ml-2">
                        ${new Intl.NumberFormat('en-US', {
                          notation: 'compact',
                          maximumFractionDigits: 1
                        }).format(coin.usd24hVol)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};