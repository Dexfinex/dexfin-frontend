import { coinGeckoApi, coinGeckoApi2 } from "./api.service.ts";
import { CoinGeckoToken, TrendingCoin, SearchResult, CoinData } from "../types";
import { ChartDataPoint, TokenType } from "../types/swap.type.ts";
import axios from "axios";
import { mapCoingeckoAssetPlatforms } from "../constants/mock/coingeckoAssetPlatforms.ts";
import { NULL_ADDRESS } from "../constants";
import { mapCoingeckoNetworks } from "../constants/mock/coingeckoNetworks.ts";


function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp * 1000;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}


export const coingeckoService = {
  getMemecoins: async () => {
    try {
      const { data } = await coinGeckoApi2.get<CoinGeckoToken[]>('/memecoins');
      return data.map(token => ({
        name: token.name,
        address: token.address,
        chainId: 1,
        decimals: 18,
        logoURI: token.logoURI,
        price: token.price,
        priceChange24h: token.priceChange24h,
        marketCap: token.marketCap,
        marketCapRank: token.marketCapRank,
        volume24h: token.volume24h,
        sparkline: token.sparkline,
        category: 'meme',
      }));
    } catch (error) {
      console.error('Failed to fetch memecoins:', error);
      throw error;
    }
  },
  getTokenList: async () => {
    try {
      const [topTokens, memeTokens] = await Promise.all([
        coinGeckoApi2.get<CoinGeckoToken[]>('/tokens'),
        coingeckoService.getMemecoins(),
      ]);

      const topTokensFormatted = topTokens.data;

      // Combine and deduplicate tokens
      const allTokens = [...topTokensFormatted, ...memeTokens];
      const uniqueTokens = Array.from(new Map(allTokens.map(token => [token.address, token])).values());

      return uniqueTokens;
    } catch (error) {
      console.error('Failed to fetch token list:', error);
      throw error;
    }
  },
  getOHLCV: async (tokenId: string, days = 30) => {
    try {
      // Ensure days is a valid number
      const validDays = Math.max(1, Math.min(365, days));

      const response = await coinGeckoApi2.get(`/ohlcv/${tokenId}`, {
        params: {
          days: validDays.toString(),
        },
      });

      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format');
      }

      // CoinGecko OHLC format: [timestamp, open, high, low, close]
      const chartData: ChartDataPoint[] = response.data;

      // Sort by timestamp ascending
      return chartData.sort((a, b) => a.time - b.time);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (axios.isAxiosError(error)) {
        /*
                        const message = error.response?.data?.error as string || 'Failed to fetch chart data';
                        console.error('Chart data error:', error.response?.data);
                        throw new Error(message);
        */
      }
      throw error;
    }
  },
  getCoinGeckoIdFrom: async (token: TokenType, chainId: number): Promise<string> => {
    try {
      if (token.address === NULL_ADDRESS) {
        return mapCoingeckoAssetPlatforms[chainId].native_coin_id;
      }
      const assetId = mapCoingeckoAssetPlatforms[chainId].id;
      const { data } = await coinGeckoApi.get<{ id: string }>(`/coins/${assetId}/contract/${token.address}`);
      return data.id;
    } catch (e) {
      console.log(e);
    }
    return ""
  },
  getTokenPrices: async (chainId: number, addresses: (string | null)[]): Promise<Record<string, string>> => {
    try {
      const filteredAddresses = addresses.filter(address => !!address)
      const assetId = mapCoingeckoAssetPlatforms[chainId].id;
      const networkId = mapCoingeckoNetworks[assetId].id;
      const { data } = await coinGeckoApi.get<{ data: { attributes: { token_prices: Record<string, string> } } }>(`/onchain/simple/networks/${networkId}/token_price/${filteredAddresses.join(',')}`);
      return data?.data?.attributes?.token_prices ?? {};
    } catch (e) {
      console.log(e);
    }
    return {}
  },
  getTrendingCoins: async (): Promise<TrendingCoin[]> => {
    try {
      const { data } = await coinGeckoApi2.get<TrendingCoin[]>('/trending/');
      return data;
    } catch (error) {
      console.error('Failed to fetch trending coins:', error);
      throw error;
    }
  },

  searchCoins: async (query: string): Promise<SearchResult[]> => {
    try {
      const { data } = await coinGeckoApi2.get<SearchResult[]>(`/search?query=${encodeURIComponent(query)}`);
      return data;
    } catch (error) {
      console.error('Error searching coins:', error);
      return [];
    }
  },

  getCoinPrice: async (coinId: string): Promise<CoinData> => {
    try {
      const { data } = await coinGeckoApi2.get<CoinData>(`/price/${coinId}`);
      return data;
    } catch (error) {
      console.error('CoinGecko API Error:', {
        endpoint: '/simple/price',
        coinId,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },
}