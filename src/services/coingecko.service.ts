import { coinGeckoApi } from "./api.service.ts";
import { CoinData, CoinGeckoToken, Ganiner, Loser, SearchResult, TrendingCoin } from "../types";
import { ChartDataPoint, TokenType } from "../types/swap.type.ts";
import { TokenTypeB } from "../types/cart.type.ts";
import axios from "axios";
import { MarketCapToken } from "../components/market/MarketCap.tsx";

export const coingeckoService = {
    getMemecoins: async () => {
        try {
            const { data } = await coinGeckoApi.get<CoinGeckoToken[]>('/memecoins');
            const memedata = data.map(token => ({
                category: "meme",
                chainId: token.chainId,
                decimals: 18,
                id: token.id,
                logoURI: token.logoURI,
                marketCap: token.marketCap,
                marketCapRank: token.marketCapRank,
                name: token.name,
                platforms: token.platforms,
                price: token.price,
                priceChange24h: token.priceChange24h,
                sparkline: token.sparkline,
                symbol: token.symbol.toUpperCase(),
                volume24h: token.volume24h,
                address: ""
            }));
            return memedata;
        } catch (error) {
            console.error('Failed to fetch memecoins:', error);
            throw error;
        }
    },
    getTokenList: async () => {
        console.log("getTokenList : ");
        try {
            console.log('Fetching both top tokens and memecoins...');
            const [topTokens, memeTokens] = await Promise.all([
                coinGeckoApi.get<CoinGeckoToken[]>('/tokens/all'),
                coingeckoService.getMemecoins(),
            ]);
            const tokendata = topTokens.data.map(token => ({
                category: token.category,
                chainId: token.chainId,
                decimals: 18,
                id: token.id,
                logoURI: token.logoURI,
                marketCap: token.marketCap,
                marketCapRank: token.marketCapRank,
                name: token.name,
                platforms: token.platforms,
                price: token.price,
                priceChange24h: token.priceChange24h,
                sparkline: token.sparkline,
                symbol: token.symbol.toUpperCase(),
                volume24h: token.volume24h,
                address: ""
            }));
            const validTopTokens = tokendata.filter((token): token is TokenTypeB => token !== null);
            const allTokens = [...validTopTokens, ...memeTokens];
            return allTokens;
        } catch (error) {
            console.error('Failed to fetch token list:', error);
            throw error;
        }
    },
    getOHLCV: async (tokenId: string, days = 30) => {
        try {
            // Ensure days is a valid number
            const validDays = Math.max(1, Math.min(365, days));

            const response = await coinGeckoApi.get(`/ohlcv/${tokenId}`, {
                params: {
                    vs_currency: 'usd',
                    days: validDays.toString(),
                    precision: 'full',
                },
            });

            if (!Array.isArray(response.data)) {
                throw new Error('Invalid response format');
            }

            // CoinGecko OHLC format: [timestamp, open, high, low, close]
            const chartData: ChartDataPoint[] = response.data
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
            const { data } = await coinGeckoApi.get<string>(`/token-id/${chainId}?addresses=${token.address}`);
            return data;
        } catch (e) {
            console.log(e);
        }
        return ""
    },
    getTokenPrices: async (chainId: number, address: (string | null)[]): Promise<Record<string, string>> => {
        try {
            const response = await coinGeckoApi.get<Record<string, string>>(`/prices/${chainId}?addresses=${address}`);
            return response.data;
        } catch (e) {
            console.log(e);
        }
        return {}
    },
    getTrendingCoins: async (): Promise<TrendingCoin[]> => {
        try {
            const { data } = await coinGeckoApi.get<TrendingCoin[]>('/trending/');
            return data;
        } catch (error) {
            console.error('Failed to fetch trending coins:', error);
            throw error;
        }
    },

    getTopGainers: async (): Promise<Ganiner[]> => {
        try {
            const { data } = await coinGeckoApi.get<Ganiner[]>('/top_gainers/');
            return data;
        } catch (error) {
            console.error('Failed to fetch top gainers:', error);
            throw error;
        }
    },

    getTopLosers: async (): Promise<Loser[]> => {
        try {
            const { data } = await coinGeckoApi.get<Loser[]>('/top_losers/');
            return data;
        } catch (error) {
            console.error('Failed to fetch top losers:', error);
            throw error;
        }
    },

    searchCoins: async (query: string): Promise<SearchResult[]> => {
        try {
            const { data } = await coinGeckoApi.get<SearchResult[]>(`/search?query=${encodeURIComponent(query)}`);
            return data;
        } catch (error) {
            console.error('Error searching coins:', error);
            return [];
        }
    },

    getCoinPrice: async (coinId: string): Promise<CoinData> => {
        try {
            const { data } = await coinGeckoApi.get<CoinData>(`/price/${coinId}`);
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
    getMarketCap: async (page: number): Promise<MarketCapToken[]> => {
        try {
            const { data } = await coinGeckoApi.get<MarketCapToken[]>(`/tokens/marketcap?page=${page}`);
            return data;
        } catch (error) {
            console.error('Error searching coins:', error);
            return [];
        }
    },
}
