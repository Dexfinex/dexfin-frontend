import {Suspense, useEffect, useRef, useState} from 'react';
import {ChartControls} from './ChartControls';
import {ChartLoader} from './ChartLoader';
import {ChartErrorBoundary} from './ChartErrorBoundary';
import {ChartDataPoint, ChartType, TimeRange, TokenType} from '../../../../types/swap.type';
import {TokenIcon} from "../TokenIcon.tsx";
import {TokenPrice} from "../TokenPrice.tsx";
import useTokenStore from "../../../../store/useTokenStore.ts";
import {SOLANA_CHAIN_ID} from "../../../../constants/solana.constants.ts";
import {birdeyeService} from "../../../../services/birdeye.service.ts";
import {coingeckoService} from "../../../../services/coingecko.service.ts";
import {mapTimeRangeToSeconds, mapTimeRangeToSecondsForBirdEye} from "../../../../constants/chart.constants.ts";
import {ColorType, createChart, CrosshairMode} from "lightweight-charts";
import {useStore} from "../../../../store/useStore.ts";

interface ChartProps {
  type: ChartType;
  onTypeChange: (type: ChartType) => void;
  token: TokenType;
}
const redColor = '#f03349', greenColor = '#179981'


export function Chart({ type, onTypeChange, token }: ChartProps) {
  const { theme } = useStore();

  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('1D');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const {getTokenPrice} = useTokenStore()

  const price = token ? getTokenPrice(token?.address, token?.chainId) : 0
  // const change = ((data[data.length - 1]?.close ?? 0) - (data[0]?.close ?? 0)) / (data[0]?.close ?? 1) * 100

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };

  const refetchChartData = async () => {
    let _chartData: ChartDataPoint[] = []
    const currentTime = Math.round(Date.now() / 1000) - 60

    if (token) {
      if (token.chainId === SOLANA_CHAIN_ID) {
        const timeFrom = currentTime - mapTimeRangeToSecondsForBirdEye[timeRange]
        _chartData = await birdeyeService.getOHLCV(token.address, timeRange, timeFrom, currentTime)
      } else if (token.address.startsWith('0x')) {
        const timeFrom = currentTime - mapTimeRangeToSeconds[timeRange]
        const symbol = await coingeckoService.getCoinGeckoIdFrom(token.address, token.chainId)
        _chartData = await coingeckoService.getOHLCV(symbol.toLowerCase(), timeRange, timeFrom, currentTime);
      }
    }
    
    setChartData(_chartData)
  }

  const redrawChart = () => {
    if (chartContainerRef.current && chartData) {

      const chart = createChart(chartContainerRef.current, {
        width: 680,
        height: 420,
        layout: {
          background: {
            type: ColorType.Solid,
            color: theme === 'dark' ? '#101011' : '#fff',
          },
          textColor: '#555963',
        },
        watermark: {
          visible: true,
          fontSize: 48,
          horzAlign: 'center',
          vertAlign: 'center',
          color: 'rgba(86,86,86,0.3)',
          text: 'Dexfin',
        },
        grid: {
          vertLines: {
            color: 'rgba(45,45,49,.55)',
          },
          horzLines: {
            color: 'rgba(45,45,49,.55)',
          },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
        },
        rightPriceScale: {
          borderColor: 'rgba(45,45,49,.55)',
        },
        timeScale: {
          visible: true,
          timeVisible: true,
          secondsVisible: true,
          borderColor: 'rgba(45,45,49,.55)',
          barSpacing: 18
        },
      });
      const candleSeries = chart.addCandlestickSeries({
            upColor: greenColor,
            downColor: redColor,
            borderDownColor: redColor,
            borderUpColor: greenColor,
            wickDownColor: redColor,
            wickUpColor: greenColor,
          })

      console.log("chartData", chartData)

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      candleSeries.setData(chartData);

      return () => {
        chart.remove();
      }
    }
  }


  useEffect(() => {
    // console.log("useEffect");
    if (token && timeRange) {
      refetchChartData()
    } else {
      setChartData([]);
    }
  }, [type, token, timeRange]);


  useEffect(() => {
    // console.log("params", params);
    if (chartContainerRef.current) {
      chartContainerRef.current.innerHTML = "";
    }
    redrawChart();
  }, [chartData, redrawChart, theme]);






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
                <div ref={chartContainerRef}
                ></div>
{/*
                <SwapTradeChart
                    tokenSymbol={currentTokenSymbol}
                    timeRange={timeRange}
                    type={type}
                />
*/}
              </div>
            </Suspense>
          </ChartErrorBoundary>
        </div>
      </div>
  );
}