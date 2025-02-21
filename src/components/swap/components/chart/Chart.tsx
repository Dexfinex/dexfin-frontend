import {Suspense, useMemo, useState} from 'react';
import {ChartControls} from './ChartControls';
import {ChartLoader} from './ChartLoader';
import {ChartErrorBoundary} from './ChartErrorBoundary';
import type {ChartType, TimeRange, TokenType} from '../../../../types/swap.type';
import {TokenIcon} from "../TokenIcon.tsx";
import {TokenPrice} from "../TokenPrice.tsx";
import useTokenStore from "../../../../store/useTokenStore.ts";
import SwapTradeChart from "./SwapTradeChart.tsx";

interface ChartProps {
  type: ChartType;
  onTypeChange: (type: ChartType) => void;
  token: TokenType;
}

export function Chart({ type, onTypeChange, token }: ChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('1D');
  const {getTokenPrice} = useTokenStore()

  const price = token ? getTokenPrice(token?.address, token?.chainId) : 0
  // const change = ((data[data.length - 1]?.close ?? 0) - (data[0]?.close ?? 0)) / (data[0]?.close ?? 1) * 100

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };

  const currentTokenSymbol = useMemo(() => {
    return `${token?.name}:${token?.address}:${token?.chainId}:${token?.decimals}`
  }, [token])

  return (
      <div className="backdrop-blur-sm rounded-xl overflow-hidden h-full relative w-full">

        <div className="flex items-center gap-2 group px-3 py-2 relative min-w-[180px]">
          <TokenIcon
              src={token.logoURI}
              alt={token.symbol!}
              size="lg"
          />
          <div>
            <div className="flex items-center gap-1">
              <span
                  className="text-base font-bold text-white group-hover:text-blue-400 transition-colors tracking-wide font-['Exo']">{token.symbol}</span>
              <span className="text-xs text-gray-400 ml-1.5 font-['Exo']">{token.name}</span>
            </div>
            <TokenPrice timeRange={timeRange} price={price} change={0}/>
          </div>
        </div>

        <ChartControls
            type={type}
            timeRange={timeRange}
            onTypeChange={onTypeChange}
            onTimeRangeChange={handleTimeRangeChange}
        />
        <div className="h-[calc(100%-100px)] overflow-hidden p-3 relative z-0">
          <ChartErrorBoundary>
            <Suspense fallback={<ChartLoader/>}>
              <div className="h-full relative">
                <SwapTradeChart
                    tokenSymbol={currentTokenSymbol}
                    timeRange={timeRange}
                    type={type}
                />
              </div>
            </Suspense>
          </ChartErrorBoundary>
        </div>
      </div>
  );
}