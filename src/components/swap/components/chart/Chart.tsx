import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ChartControls} from './ChartControls';
import {ChartDataPoint, ChartType, TimeRange, TokenType} from '../../../../types/swap.type';
import {TokenIcon} from "../TokenIcon.tsx";
import {TokenPrice} from "../TokenPrice.tsx";
import useTokenStore from "../../../../store/useTokenStore.ts";
import {SOLANA_CHAIN_ID} from "../../../../constants/solana.constants.ts";
import {birdeyeService} from "../../../../services/birdeye.service.ts";
import {coingeckoService} from "../../../../services/coingecko.service.ts";
import {mapTimeRangeToSeconds, mapTimeRangeToSecondsForBirdEye} from "../../../../constants/chart.constants.ts";
import {ColorType, createChart, CrosshairMode, IChartApi, ISeriesApi, SeriesType} from "lightweight-charts";
import {useStore} from "../../../../store/useStore.ts";
import {useBreakpointValue} from "@chakra-ui/react";
import {solToWSol} from "../../../../utils/solana.util.ts";
import {findClosestClosedValue} from "../../../../utils/swap.util.ts";

export interface ChartProps {
    type: ChartType;
    onTypeChange: (type: ChartType) => void;
    token: TokenType;
    isMaximized: boolean;
}

const redColor = '#f03349', greenColor = '#179981'


export function Chart({type, onTypeChange, token, isMaximized}: ChartProps) {

    const isMobile = useBreakpointValue({base: true, md: false})
    const {theme} = useStore();
    const chartParentContainerRef = useRef<HTMLDivElement | null>(null);
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Default to 5M
    const [timeRange, setTimeRange] = useState<TimeRange>('1D');
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [chart, setChart] = useState<IChartApi | null>(null)
    const seriesRef = useRef<ISeriesApi<SeriesType> | null>(null);
    const {getTokenPrice} = useTokenStore()

    const price = token ? getTokenPrice(token?.address, token?.chainId) : 0
    const change = useMemo(() => {
        const lastValue = chartData[chartData.length - 1]?.close ?? 0
        const previousValue = findClosestClosedValue(chartData, timeRange)
        return (lastValue - previousValue) / (previousValue > 0 ? previousValue : 1) * 100
    }, [chartData, timeRange])

    const handleTimeRangeChange = (range: TimeRange) => {
        setTimeRange(range);
    };

    const refetchChartData = async () => {
        setIsLoading(true)
        if (chartContainerRef.current) {
            chartContainerRef.current.innerHTML = "";
        }


        let _chartData: ChartDataPoint[] = []
        const currentTime = Math.round(Date.now() / 1000) - 60

        if (token) {
            if (token.chainId === SOLANA_CHAIN_ID) {
                const timeFrom = currentTime - mapTimeRangeToSecondsForBirdEye[timeRange]
                _chartData = await birdeyeService.getOHLCV(solToWSol(token.address)!, timeRange, timeFrom, currentTime)
            } else if (token.address.startsWith('0x')) {
                const timeFrom = currentTime - mapTimeRangeToSeconds[timeRange]
                const symbol = await coingeckoService.getCoinGeckoIdFrom(token.address, token.chainId)
                _chartData = await coingeckoService.getOHLCV(symbol.toLowerCase(), timeRange, timeFrom, currentTime);
            }
        }

        setChartData(_chartData)
        setIsLoading(false)
    }

    useEffect(() => {
        // console.log("useEffect");
        if (token && timeRange) {
            refetchChartData()
        } else {
            setChartData([]);
        }
    }, [token, timeRange]);


    useEffect(() => {
        if (!chartContainerRef.current) return;
        const chartWidget = createChart(chartContainerRef.current, {
            width: isMobile ? window.innerWidth : 600,
            height: isMobile ? window.innerHeight * .45 : 420,
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
        // Initial series creation
        if (type === 'tradingview') {
            const candlestickSeries = chartWidget.addCandlestickSeries({
                upColor: greenColor,
                downColor: redColor,
                borderDownColor: redColor,
                borderUpColor: greenColor,
                wickDownColor: redColor,
                wickUpColor: greenColor,
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            candlestickSeries.setData(chartData);
            seriesRef.current = candlestickSeries;

        } else {

            const lineSeries = chartWidget.addLineSeries({
                color: '#2962FF',
                lineWidth: 2,
            });

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            lineSeries.setData(chartData.map(item => ({
                time: item.time,
                value: item.close,
            })));
            seriesRef.current = lineSeries;
        }

        // Fit the chart content
        // chartWidget.timeScale().fitContent();
        setChart(chartWidget)
    }, [chartData, theme, type]); // Empty dependency array to create chart only once


    const resizeChartWidth = useCallback(() => {
        if (chartContainerRef.current && !isMobile) {
            const width = (chartParentContainerRef.current?.parentElement?.parentElement?.parentElement?.parentElement?.clientWidth ?? chartContainerRef.current?.clientWidth) - 520
            chart?.applyOptions({
                width,
            });
        }
    }, [chart, isMobile])

    useEffect(() => {
        const container = chartParentContainerRef.current;
        if (!container) return;

        const observer = new ResizeObserver(() => {
            resizeChartWidth()
        });

        observer.observe(container);

        return () => observer.disconnect();
    }, [chart]);

    useEffect(() => {
        resizeChartWidth()
    }, [isMaximized]);

    useEffect(() => {
        window.addEventListener('resize', resizeChartWidth);

        return () => {
            window.removeEventListener('resize', resizeChartWidth);
            chart?.remove();
        };
    }, [chart]);

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
                    <TokenPrice timeRange={timeRange} price={price} change={change}/>
                </div>
            </div>

            <ChartControls
                type={type}
                timeRange={timeRange}
                onTypeChange={onTypeChange}
                onTimeRangeChange={handleTimeRangeChange}
            />
            <div className="h-[calc(100%-100px)] overflow-hidden p-3 relative z-0" ref={chartParentContainerRef}>
                {
                    isLoading ? (
                        <div className="flex items-center justify-center p-8 h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"/>
                        </div>
                    ) : (
                        <div ref={chartContainerRef}
                        ></div>
                    )
                }
            </div>
        </div>
    );
}