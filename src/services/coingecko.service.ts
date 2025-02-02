import {coinGeckoApi} from "./api.service.ts";
import {CoinGeckoToken} from "../types/thirdparty.type.ts";
import {ChartDataPoint, TokenType} from "../types/swap.type.ts";
import axios from "axios";
import {mapCoingeckoAssetPlatforms} from "../constants/mock/coingeckoAssetPlatforms.ts";
import {NULL_ADDRESS} from "../constants";
import {mapCoingeckoNetworks} from "../constants/mock/coingeckoNetworks.ts";

export const coingeckoService = {
    getMemecoins: async () => {
        try {
            const {data} = await coinGeckoApi.get<CoinGeckoToken[]>('/coins/markets', {
                params: {
                    vs_currency: 'usd',
                    category: 'meme-token',
                    order: 'market_cap_desc',
                    per_page: 100,
                    sparkline: true,
                    price_change_percentage: '24h',
                    precision: 'full',
                },
            });

            return data.map(token => ({
                symbol: token.symbol.toUpperCase(),
                name: token.name,
                address: token.id,
                chainId: 1,
                decimals: 18,
                logoURI: token.image,
                price: token.current_price,
                priceChange24h: token.price_change_percentage_24h,
                marketCap: token.market_cap,
                marketCapRank: token.market_cap_rank,
                volume24h: token.total_volume,
                sparkline: token.sparkline_in_7d.price,
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
                coinGeckoApi.get<CoinGeckoToken[]>('/coins/markets', {
                    params: {
                        vs_currency: 'usd',
                        order: 'market_cap_desc',
                        per_page: 50,
                        sparkline: true,
                        price_change_percentage: '24h',
                        precision: 'full',
                    },
                }),
                coingeckoService.getMemecoins(),
            ]);

            const topTokensFormatted = topTokens.data.map(token => ({
                symbol: token.symbol.toUpperCase(),
                name: token.name,
                address: token.id,
                chainId: 1,
                decimals: 18,
                logoURI: token.image,
                price: token.current_price,
                priceChange24h: token.price_change_percentage_24h,
                marketCap: token.market_cap,
                marketCapRank: token.market_cap_rank,
                volume24h: token.total_volume,
                sparkline: token.sparkline_in_7d.price,
                category: token.categories?.includes('meme-token') ? 'meme' : 'token',
            }));

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

            const response = await coinGeckoApi.get(`/coins/${tokenId}/ohlc`, {
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
            const chartData: ChartDataPoint[] = response.data.map(
                ([timestamp, open, high, low, close]: number[]) => ({
                    time: timestamp,
                    open,
                    high,
                    low,
                    close,
                })
            );

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
            const {data} = await coinGeckoApi.get<{id: string}>(`/coins/${assetId}/contract/${token.address}`);
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
            const {data} = await coinGeckoApi.get<{data:{attributes: { token_prices: Record<string, string>}}}>(`/onchain/simple/networks/${networkId}/token_price/${filteredAddresses.join(',')}`);
            return data?.data?.attributes?.token_prices ?? {};
        } catch (e) {
            console.log(e);
        }
        return {}
    }
}