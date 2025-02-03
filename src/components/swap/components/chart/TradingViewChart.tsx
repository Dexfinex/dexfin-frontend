import { useEffect, useRef, useCallback } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { CHART_COLORS } from '../../../../config/chart';
import {ChartDataPoint, TokenType} from "../../../../types/swap.type.ts";

interface TradingViewChartProps {
  symbol: string;
  data: ChartDataPoint[];
  token?: TokenType;
}

export function TradingViewChart({ symbol, data, token }: TradingViewChartProps) {
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

    const handleZoom = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    chartContainerRef.current.addEventListener('wheel', handleZoom, { passive: false });

    const colors = {
      background: CHART_COLORS.background,
      text: CHART_COLORS.text,
      grid: CHART_COLORS.grid,
      primary: CHART_COLORS.primary,
      success: CHART_COLORS.success,
      error: CHART_COLORS.error,
    };

    const chartOptions = {
      layout: {
        background: { type: ColorType.Solid, color: colors.background },
        textColor: colors.text,
        fontFamily: 'Exo, system-ui, sans-serif',
        fontSize: 13,
        fontWeight: '500',
      },
      grid: {
        vertLines: { color: colors.grid },
        horzLines: { color: colors.grid },
        opacity: 0.15,
      },
      crosshair: {
        mode: 1,
        vertLine: {
          width: 2,
          color: colors.primary,
          style: 3,
          labelBackgroundColor: colors.background,
        },
        horzLine: {
          width: 2,
          color: colors.primary,
          style: 3,
          labelBackgroundColor: colors.background,
        },
      },
      timeScale: {
        borderColor: colors.grid,
        timeVisible: true,
        secondsVisible: true,
        tickMarkFormatter: (time: number) => {
          const date = new Date(time * 1000);
          return date.toLocaleString();
        },
      },
      handleScale: {
        axisPressedMouseMove: {
          time: false,
          price: true,
        },
        mouseWheel: true,
        pinch: true,
      },
      rightPriceScale: {
        borderColor: colors.grid,
        scaleMargins: {
          top: 0.2,
          bottom: 0.2,
        },
        ticksVisible: true,
        borderVisible: true,
        entireTextOnly: true,
      },
      leftPriceScale: {
        visible: true,
        borderColor: colors.grid,
        textColor: colors.primary,
        scaleMargins: { top: 0.2, bottom: 0.2 },
        ticksVisible: true,
        borderVisible: true,
        entireTextOnly: true,
      },
      watermark: {
        color: 'rgba(255, 255, 255, 0.1)',
        visible: true,
        text: token?.symbol || 'ETH/USD',
        fontSize: 96,
        fontFamily: 'Exo, system-ui, sans-serif',
        fontStyle: 'bold',
      },
    };

    chartRef.current = createChart(chartContainerRef.current, chartOptions);

    const candleSeries = chartRef.current.addCandlestickSeries({
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
        formatter: (price: number) => price.toFixed(2),
      },
      upColor: colors.success,
      downColor: colors.error,
      borderVisible: false,
      wickUpColor: colors.success,
      wickDownColor: colors.error,
      priceLineVisible: true,
      lastValueVisible: true,
      lastValueVisible: true,
      priceLineWidth: 1,
      priceLineColor: colors.primary,
      priceLineStyle: 2,
    });
    
    // Format data for trading view
    const formattedData = data.map(point => ({
      time: Math.floor(point.time / 1000), // Convert to seconds and ensure integer
      open: point.open,
      high: point.high,
      low: point.low,
      close: point.close,
    }));
    
    candleSeries.setData(formattedData);
    
    // Zoom out to show more data
    chartRef.current.timeScale().applyOptions({
      barSpacing: 12,
      rightOffset: 12,
      borderVisible: true,
      ticksVisible: true,
      fixLeftEdge: true,
      fixRightEdge: true,
    });

    // Apply price formatting to the price scale
    chartRef.current.priceScale('right').applyOptions({
      borderColor: colors.grid,
      borderVisible: true,
      scaleMargins: {
        top: 0.1,
        bottom: 0.2,
      },
      formatPrice: (price: number) => {
        return price.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        });
      },
    });
    window.addEventListener('resize', handleResize);
    return () => {
      chartContainerRef.current?.removeEventListener('wheel', handleZoom);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data, handleResize]);

  return <div ref={chartContainerRef} className="w-full h-full" />;
}