import { LineChartView } from './LineChartView';
import { TradingViewChart } from './TradingViewChart';
import { ChartLoader } from './ChartLoader';
import type { ChartType, TokenType, ChartDataPoint } from "../../../../types/swap.type";

interface ChartContainerProps {
  type: ChartType;
  data: ChartDataPoint[];
  loading: boolean;
  token?: TokenType;
}

export function ChartContainer({ type, data, loading, token }: ChartContainerProps) {
  if (loading) {
    return <ChartLoader />;
  }

  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-400 bg-[#191919] px-4 py-2 rounded-lg">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          type === 'line'
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <LineChartView
          data={data}
          token={token ?? {
            symbol: 'ETH',
            name: 'Ethereum',
            logoURI: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
          }}
        />
      </div>
      
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          type === 'tradingview'
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <TradingViewChart
          symbol={`BINANCE:${token?.symbol ?? 'ETH'}USDT`}
          data={data}
          token={token}
        />
      </div>
    </div>
  );
}