import {Suspense, useEffect, useState} from 'react';
import { ChartControls } from './ChartControls';
import { ChartContainer } from './ChartContainer';
import { ChartLoader } from './ChartLoader';
import { ChartErrorBoundary } from './ChartErrorBoundary';
import type { ChartType, TokenType, TimeRange } from '../../../../types/swap.type';
import {useChartData} from "../../../../hooks/useChartData.ts";
import {TokenIcon} from "../TokenIcon.tsx";
import {TokenPrice} from "../TokenPrice.tsx";
import {coingeckoService} from "../../../../services/coingecko.service.ts";

interface ChartProps {
  type: ChartType;
  onTypeChange: (type: ChartType) => void;
  token: TokenType;
}

export function Chart({ type, onTypeChange, token }: ChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [geckoId, setGeckoId] = useState<string>('')
  const { data, loading, error, refetch } = useChartData(geckoId, timeRange);

  useEffect(() => {
    (async () => {
      if (token) {
        if (token.address.startsWith('0x') || token.address.length > 40) {
          setGeckoId(await coingeckoService.getCoinGeckoIdFrom(token, token.chainId))
        } else {
          setGeckoId(token.address)
        }
      }
    })()
  }, [token, type])

  const price = data[data.length - 1]?.close ?? 0
  const change = ((data[data.length - 1]?.close ?? 0) - (data[0]?.close ?? 0)) / (data[0]?.close ?? 1) * 100

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    refetch();
  };

  if (error) {
    console.error('Chart error:', error);
    return (
      <div className="bg-[#111]/90 backdrop-blur-sm rounded-xl p-6 border border-white/5">
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <div className="text-red-500/90 bg-red-500/10 px-4 py-2 rounded-lg">
            {error.message}
          </div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
      <div className="bg-[#000]/95 backdrop-blur-sm rounded-xl overflow-hidden border border-white/5 h-full relative w-full shadow-[0_8px_32px_rgba(0,0,0,0.4)]">

        <div className="flex items-center gap-2 group px-3 py-2 relative min-w-[180px]">
          <TokenIcon
              src={token.logoURI}
              alt={token.symbol}
              size="lg"
          />
          <div>
            <div className="flex items-center gap-1">
              <span
                  className="text-base font-bold text-white group-hover:text-blue-400 transition-colors tracking-wide font-['Exo']">{token.symbol}</span>
              <span className="text-xs text-gray-400 ml-1.5 font-['Exo']">{token.name}</span>
            </div>
            <TokenPrice timeRange={timeRange} price={price} change={change}/>
          </div>
        </div>

        <ChartControls
            type={type}
            timeRange={timeRange}
            onTypeChange={onTypeChange}
            onTimeRangeChange={handleTimeRangeChange}
        />
        <div className="h-[calc(100%-100px)] overflow-hidden p-3 bg-[#000]/95 relative z-0">
          <ChartErrorBoundary>
            <Suspense fallback={<ChartLoader/>}>
              <ChartContainer
                  type={type}
                  data={data}
                  loading={loading}
                  token={token}
              />
            </Suspense>
          </ChartErrorBoundary>
        </div>
      </div>
  );
}