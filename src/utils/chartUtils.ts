import { CandlestickData } from 'lightweight-charts';

const BASE_PRICE = 3491.25;

export const generateMockData = (count: number = 100): {
  candleData: CandlestickData[];
} => {
  const candleData: CandlestickData[] = [];
  let lastClose = BASE_PRICE;
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const time = new Date(now.getTime() - (count - i) * 60000);
    
    // Create more realistic price movements
    const volatility = 0.002; // 0.2% volatility
    const change = lastClose * volatility * (Math.random() * 2 - 1);
    const open = lastClose;
    const close = lastClose + change;
    
    // Make high/low more realistic
    const highAdd = Math.abs(Math.max(0, change)) + (lastClose * volatility * Math.random());
    const lowAdd = Math.abs(Math.min(0, change)) + (lastClose * volatility * Math.random());
    
    const high = Math.max(open, close) + highAdd;
    const low = Math.min(open, close) - lowAdd;

    candleData.push({
      time: (time.getTime() / 1000).toString(),
      open,
      high,
      low,
      close,
    });

    lastClose = close;
  }

  return { candleData };
};