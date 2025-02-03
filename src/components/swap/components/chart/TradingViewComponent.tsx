import  { useEffect, useRef, useCallback } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { CHART_COLORS } from './config';
import type { ChartDataPoint } from './types';

interface TradingViewComponentProps {
  symbol: string;
  data: ChartDataPoint[];
  theme?: 'light' | 'dark';
  autosize?: boolean;
}

export function TradingViewComponent({
  symbol,
  data,
  theme = 'dark',
  autosize = true,
}: TradingViewComponentProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  const handleResize = useCallback(() => {
    if (chartContainerRef.current && chartRef.current) {
      chartRef.current.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });
    }
  }, []);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chartOptions = {
      layout: {
        background: { type: ColorType.Solid, color: CHART_COLORS.background },
        textColor: CHART_COLORS.text,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      },
      grid: {
        vertLines: { color: CHART_COLORS.grid },
        horzLines: { color: CHART_COLORS.grid },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          width: 1,
          color: CHART_COLORS.primary,
          style: 2,
        },
        horzLine: {
          width: 1,
          color: CHART_COLORS.primary,
          style: 2,
        },
      },
      timeScale: {
        borderColor: CHART_COLORS.grid,
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: number) => {
          const date = new Date(time);
          return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        },
      },
      rightPriceScale: {
        borderColor: CHART_COLORS.grid,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    };

    chartRef.current = createChart(chartContainerRef.current, chartOptions);

    const candleSeries = chartRef.current.addCandlestickSeries({
      upColor: CHART_COLORS.success,
      downColor: CHART_COLORS.error,
      borderVisible: false,
      wickUpColor: CHART_COLORS.success,
      wickDownColor: CHART_COLORS.error,
    });
    
    candleSeries.setData(data);

    // Fit content
    chartRef.current.timeScale().fitContent();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [theme, data, handleResize]);

  return <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />;
}