// Base URL and API key
import {CoinData, SearchResult, TrendingCoin} from "../types";

const BASE_URL = 'https://pro-api.coingecko.com/api/v3';
const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;

// Mock data for fallback
const mockCoinData: Record<string, {
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  sparkline: number[];
}> = {
  'bitcoin': {
    price: 67245.80,
    priceChange24h: 2.5,
    marketCap: 1320000000000,
    volume24h: 28500000000,
    sparkline: Array(24).fill(0).map(() => 67000 + Math.random() * 1000)
  },
  'ethereum': {
    price: 3245.67,
    priceChange24h: -1.2,
    marketCap: 389000000000,
    volume24h: 12800000000,
    sparkline: Array(24).fill(0).map(() => 3200 + Math.random() * 100)
  }
};

// Improved fetch with retry mechanism and rate limit handling
const fetchWithRetry = async (endpoint: string, options: RequestInit = {}, retries = 3) => {
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          'x-cg-pro-api-key': API_KEY,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = response.headers.get('retry-after');
          await new Promise(resolve => setTimeout(resolve, (parseInt(retryAfter || '60') * 1000)));
          continue;
        }

        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      lastError = error;
      
      // Don't retry on 4xx errors except rate limiting
      if (error instanceof Error && error.message.includes('status: 4') && !error.message.includes('status: 429')) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }

  // Return mock data if available, otherwise throw the error
  const coinId = endpoint.split('/').pop()?.split('?')[0];
  if (coinId && mockCoinData[coinId]) {
    console.warn('Using mock data for', coinId);
    return { [coinId]: mockCoinData[coinId] };
  }

  throw lastError;
};

// Get coin price and market data
export async function getCoinPrice(coinId: string): Promise<CoinData> {
  try {
    const data = await fetchWithRetry(
      `/simple/price?ids=${coinId}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`
    );

    if (!data[coinId]) {
      throw new Error('Invalid response format');
    }

    // Get OHLCV data for the chart
    const chartData = await getOHLCV(coinId);
    
    return {
      id: coinId,
      price: data[coinId].usd,
      priceChange24h: data[coinId].usd_24h_change || 0,
      marketCap: data[coinId].usd_market_cap || 0,
      volume24h: data[coinId].usd_24h_vol || 0,
      chartData: chartData.map(candle => ({
        timestamp: candle.time,
        price: candle.close
      }))
    };
  } catch (error) {
    console.error('CoinGecko API Error:', {
      endpoint: '/simple/price',
      coinId,
      message: error instanceof Error ? error.message : 'Unknown error'
    });

    // Return mock data as fallback
    if (coinId in mockCoinData) {
      const mock = mockCoinData[coinId];
      return {
        id: coinId,
        price: mock.price,
        priceChange24h: mock.priceChange24h,
        marketCap: mock.marketCap,
        volume24h: mock.volume24h,
        chartData: mock.sparkline.map((price, i) => ({
          timestamp: Date.now() - (24 - i) * 3600000,
          price
        }))
      };
    }

    throw error;
  }
}

// Get OHLCV data
export async function getOHLCV(coinId: string, days: number = 1): Promise<{
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}[]> {
  try {
    // Note: CoinGecko Pro API doesn't support custom intervals for OHLC
    // It automatically adjusts the interval based on the days parameter
    const data = await fetchWithRetry(
      `/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`
    );

    // CoinGecko returns data in format [timestamp, open, high, low, close]
    return data.map((candle: number[]) => ({
      time: candle[0],
      open: candle[1],
      high: candle[2],
      low: candle[3],
      close: candle[4],
      volume: 0 // OHLC endpoint doesn't include volume data
    }));
  } catch (error) {
    console.error('CoinGecko API Error:', {
      endpoint: '/ohlc',
      coinId,
      message: error instanceof Error ? error.message : 'Unknown error'
    });

    // Return mock data as fallback
    if (coinId in mockCoinData) {
      const mock = mockCoinData[coinId];
      return Array(24).fill(0).map((_, i) => {
        const basePrice = mock.price;
        const time = Date.now() - (24 - i) * 3600000;
        const randomFactor = 0.98 + Math.random() * 0.04; // ±2%

        return {
          time,
          open: basePrice * randomFactor,
          high: basePrice * (randomFactor + 0.01),
          low: basePrice * (randomFactor - 0.01),
          close: basePrice * (randomFactor + (Math.random() * 0.02 - 0.01)),
          volume: mock.volume24h / 24
        };
      });
    }

    throw error;
  }
}

// Search coins
export async function searchCoins(query: string): Promise<SearchResult[]> {
  try {
    const data = await fetchWithRetry(`/search?query=${encodeURIComponent(query)}`);
    return data.coins.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      thumb: coin.thumb
    }));
  } catch (error) {
    console.error('Error searching coins:', error);
    // Return empty array instead of throwing
    return [];
  }
}

// Get trending coins with mock data fallback
export async function getTrendingCoins(): Promise<TrendingCoin[]> {
  try {
    const data = await fetchWithRetry('/search/trending');
    return data.coins.map((item: any) => ({
      id: item.item.id,
      name: item.item.name,
      symbol: item.item.symbol.toUpperCase(),
      thumb: item.item.thumb,
      marketCapRank: item.item.market_cap_rank,
      priceUsd: item.item.price_btc * 40000, // Rough estimate based on BTC price
      volume: item.item.price_btc * 40000 * 1000000 // Mock volume
    }));
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    // Return mock trending data
    return [
      {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        thumb: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
        marketCapRank: 1,
        priceUsd: 67245.80,
        volume: 28500000000
      },
      {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        thumb: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
        marketCapRank: 2,
        priceUsd: 3245.67,
        volume: 12800000000
      }
    ];
  }
}