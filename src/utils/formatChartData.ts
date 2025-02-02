// Generate mock price data with realistic variations
import {ChartDataPoint, TimeRange} from "../types/swap.type.ts";

function generateMockPriceData(basePrice: number, count: number): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  let currentPrice = basePrice;
  const now = Date.now();
  const interval = 300000; // 5 minutes in milliseconds

  for (let i = 0; i < count; i++) {
    const time = now - (count - i) * interval;
    const volatility = 0.002; // 0.2% price movement
    const change = currentPrice * volatility * (Math.random() * 2 - 1);
    currentPrice += change;

    const point: ChartDataPoint = {
      time,
      open: currentPrice - change * Math.random(),
      close: currentPrice,
      high: currentPrice + Math.abs(change) * Math.random(),
      low: currentPrice - Math.abs(change) * Math.random(),
    };

    data.push(point);
  }

  return data;
}

export function formatChartData(data: ChartDataPoint[] | null, timeRange: TimeRange): ChartDataPoint[] {
  // If no data provided, generate mock data
  if (!data || data.length === 0) {
    const basePrice = 1800; // Base ETH price
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const dataPoints = {
      '24h': 288,  // 5-minute intervals
      '7d': 168,   // 1-hour intervals
      '30d': 180,  // 4-hour intervals
      '1y': 365,   // 1-day intervals
    }[timeRange] || 288;

    return generateMockPriceData(basePrice, dataPoints);
  }

  // Sort data by timestamp ascending
  const sortedData = [...data].sort((a, b) => a.time - b.time);

  // Calculate interval based on time range to avoid overcrowding
  const interval = Math.max(1, Math.floor(sortedData.length / 100));

  // Sample data points
  return sortedData.filter((_, index) => index % interval === 0);
}