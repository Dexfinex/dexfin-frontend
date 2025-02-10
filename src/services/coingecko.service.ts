import { coinGeckoApi } from "./api.service";
import { CoinGeckoToken } from "../types/thirdparty.type";
import { TokenType } from "../types/swap.type";
import axios from "axios";
import { mapCoingeckoAssetPlatforms } from "../constants/mock/coingeckoAssetPlatforms";
import { mapCoingeckoNetworks } from "../constants/mock/coingeckoNetworks";
import { NULL_ADDRESS } from "../constants";

interface ChartDataPoint {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
}

interface CoinGeckoTokenDetail {
    id: string;
    symbol: string;
    name: string;
    platforms: {
        [key: string]: string;  // platform -> contract address mapping
    };
}

export const coingeckoService = {
    getMemecoins: async () => {
        try {
            console.log('Fetching memecoins from CoinGecko...');
            const { data } = await coinGeckoApi.get<CoinGeckoToken[]>('/coins/markets', {
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

            // console.log('Initial memecoin data:', data.slice(0, 2));

            const detailedTokens = await Promise.all(
                data.map(async token => {
                    try {
                        // console.log(`Fetching detailed info for memecoin: ${token.name} (${token.id})`);
                        const { data: tokenDetail } = await coinGeckoApi.get<CoinGeckoTokenDetail>(
                            `/coins/${token.id}`,
                            { params: { localization: false, tickers: false, market_data: false, community_data: false, developer_data: false } }
                        );

                        const contractAddress = tokenDetail.platforms['base'] || token.id;

                        const formattedToken: TokenType = {
                            symbol: token.symbol.toUpperCase(),
                            name: token.name,
                            address: contractAddress,
                            chainId: 8453,
                            // 1,
                            decimals: 18,
                            logoURI: token.image,
                            price: Number(token.current_price) || 0,
                            priceChange24h: Number(token.price_change_percentage_24h) || 0,
                            marketCap: Number(token.market_cap) || 0,
                            marketCapRank: Number(token.market_cap_rank) || 0,
                            volume24h: Number(token.total_volume) || 0,
                            sparkline: token.sparkline_in_7d.price.map(Number),
                            category: 'meme',
                            geckoId: token.id
                        };

                        return formattedToken;
                    } catch (error) {
                        console.error(`Failed to fetch details for memecoin ${token.id}:`, error);
                        return null;
                    }
                })
            );

            const validTokens = detailedTokens.filter((token): token is TokenType => token !== null);
            // console.log(`Successfully processed ${validTokens.length} memecoins`);
            return validTokens;
        } catch (error) {
            console.error('Failed to fetch memecoins:', error);
            throw error;
        }
    },

    getTokenList: async () => {
        try {
            console.log('Fetching both top tokens and memecoins...');
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

            const topTokensDetails = await Promise.all(
                topTokens.data.map(async token => {
                    try {
                        // console.log(`Fetching detailed info for top token: ${token.name} (${token.id})`);
                        const { data: tokenDetail } = await coinGeckoApi.get<CoinGeckoTokenDetail>(
                            `/coins/${token.id}`,
                            { params: { localization: false, tickers: false, market_data: false, community_data: false, developer_data: false } }
                        );

                        const contractAddress = tokenDetail.platforms['base'] || token.id;
                        // const contractAddress = tokenDetail.platforms['ethereum'] || token.id;

                        const formattedToken: TokenType = {
                            symbol: token.symbol.toUpperCase(),
                            name: token.name,
                            address: contractAddress,
                            chainId: 8453,
                            // 1,
                            decimals: 18,
                            logoURI: token.image,
                            price: Number(token.current_price) || 0,
                            priceChange24h: Number(token.price_change_percentage_24h) || 0,
                            marketCap: Number(token.market_cap) || 0,
                            marketCapRank: Number(token.market_cap_rank) || 0,
                            volume24h: Number(token.total_volume) || 0,
                            sparkline: token.sparkline_in_7d.price.map(Number),
                            category: token.categories?.includes('meme-token') ? 'meme' : 'token',
                            geckoId: token.id
                        };

                        return formattedToken;
                    } catch (error) {
                        console.error(`Failed to fetch details for top token ${token.id}:`, error);
                        return null;
                    }
                })
            );

            const validTopTokens = topTokensDetails.filter((token): token is TokenType => token !== null);
            // console.log(`Successfully processed ${validTopTokens.length} top tokens`);

            // Combine and deduplicate tokens
            const allTokens = [...validTopTokens, ...memeTokens];

            const uniqueTokens = Array.from(
                new Map(allTokens.map(token => [token.address.toLowerCase(), token])).values()
            );

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
    }
}