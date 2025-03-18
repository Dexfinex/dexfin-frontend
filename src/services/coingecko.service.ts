import {coinGeckoApi} from "./api.service.ts";
import {CoinData, CoinGeckoToken, Ganiner, Loser, SearchResult, TrendingCoin} from "../types";
import {ChartDataPoint} from "../types/swap.type.ts";
import {TokenTypeB} from "../types/cart.type.ts";
import axios from "axios";
import {MarketCapToken} from "../components/market/MarketCap.tsx";
import {NULL_ADDRESS, ZERO_ADDRESS} from "../constants";

interface CoinGeckoStableToken {
    id: string;
    name: string;
    symbol: string;
    current_price: number;
    market_cap: number;
    total_supply: number;
    image: string;
}

interface CexVolum {
    trade_volume_24h_usd_sum: number;
    trade_volume_24h_usd_normalized_sum: number;
}

// Category definitions
const AI_TOKENS = ['render-token', 'fetch-ai', 'singularitynet', 'bittensor', 'ocean-protocol', 'akash-network', 'oasis-network', 'cortex', 'iexec-rlc', 'cartesi', 'origintrail', 'numeraire', 'agoric', 'cudos', 'nunet', 'geeq', 'phala', 'nkn'];

const DEFI_TOKENS = ['uniswap', 'aave', 'maker', 'compound', 'chainlink', 'synthetix', 'yearn-finance', 'curve-dao-token', 'pancakeswap-token', 'sushi', 'balancer', 'uma', 'bancor', '1inch', '0x', 'kyber-network', 'loopring', 'ren', 'dydx', 'havven', 'badger-dao', 'perpetual-protocol', 'convex-finance', 'ellipsis', 'rook', 'alpha-finance', 'enzyme', 'frax', 'cream-2', 'anchor-protocol', 'alchemix', 'keep-network'];

const DEFI_AI_TOKENS = ['ocean-protocol', 'singularitynet', 'fetch-ai', 'numeraire', 'agoric', 'nunet', 'phala', 'nkn', 'akash-network', 'oasis-network', 'iexec-rlc', 'cortex'];

// New category definitions
const LAYER2_TOKENS = ['polygon', 'arbitrum', 'optimism', 'immutable-x', 'loopring', 'metis', 'zksync', 'starknet', 'base', 'mantle', 'scroll', 'linea', 'zkspace', 'aztec'];

const GAMEFI_TOKENS = ['the-sandbox', 'axie-infinity', 'decentraland', 'gala', 'gods-unchained', 'illuvium', 'yield-guild-games', 'star-atlas', 'my-neighbor-alice', 'ultra', 'height', 'vulcan-forged', 'plants-vs-undead', 'defi-kingdoms', 'stepn', 'gods-unchained'];

const METAVERSE_TOKENS = ['the-sandbox', 'decentraland', 'star-atlas', 'highstreet', 'mobox', 'wilder-world', 'bloktopia', 'somnium-space', 'metahero', 'nft-worlds', 'dvision-network', 'neopin', 'realm', 'matrix-ai-network', 'landshare'];

const INFRASTRUCTURE_TOKENS = ['filecoin', 'the-graph', 'arweave', 'helium', 'storj', 'theta-network', 'pocket-network', 'api3', 'nucypher', 'render-token', 'cartesi', 'ceramic', 'orbit-chain', 'golem', 'flux', 'ankr'];

const SOCIAL_TOKENS = ['mask-network', 'audius', 'rally-2', 'status', 'friend', 'dlp-duck-token', 'whale', 'community-token', 'dev-protocol', 'socios-com-fan-token', 'firo', 'steem', 'steemit'];

const SPORTS_TOKENS = ['chiliz', 'socios-com-fan-token', 'fan-token', 'football-coin', 'juventus-fan-token', 'paris-saint-germain-fan-token', 'ac-milan-fan-token', 'manchester-city-fan-token', 'fc-barcelona-fan-token', 'atletico-madrid-fan-token', 'arsenal-fan-token', 'sport-and-leisure', 'fan-arena'];

export const coingeckoService = {
    getMemecoins: async () => {
        try {
            const {data} = await coinGeckoApi.get<CoinGeckoToken[]>('/memecoins');
            const memedata = data.map(token => ({
                category: "Meme", // Match UI category name
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
            return []; // Return empty array instead of throwing
        }
    },

    // Method to fetch AI tokens
    getAITokens: async () => {
        try {
            const promises = AI_TOKENS.map(async (tokenId) => {
                try {
                    const tokenData = await coingeckoService.getInfo(tokenId);
                    if (tokenData) {
                        return {
                            category: "AI", // Match UI category name
                            chainId: 1, // Default to Ethereum
                            decimals: 18,
                            id: tokenId,
                            logoURI: tokenData.image?.small || "",
                            marketCap: tokenData.market_data?.market_cap?.usd || 0,
                            marketCapRank: tokenData.market_cap_rank || 9999,
                            name: tokenData.name,
                            platforms: tokenData.platforms,
                            price: tokenData.market_data?.current_price?.usd || 0,
                            priceChange24h: tokenData.market_data?.price_change_percentage_24h || 0,
                            sparkline: tokenData.market_data?.sparkline_7d?.price || [],
                            symbol: tokenData.symbol?.toUpperCase() || "",
                            volume24h: tokenData.market_data?.total_volume?.usd || 0,
                            address: ""
                        };
                    }
                    return null;
                } catch (err) {
                    console.error(`Failed to fetch AI token ${tokenId}:`, err);
                    return null;
                }
            });

            const results = await Promise.all(promises);
            return results.filter((token): token is TokenTypeB => token !== null);
        } catch (error) {
            console.error('Failed to fetch AI tokens:', error);
            return [];
        }
    },

    // Method to fetch DeFi tokens
    getDefiTokens: async () => {
        try {
            const promises = DEFI_TOKENS.map(async (tokenId) => {
                try {
                    const tokenData = await coingeckoService.getInfo(tokenId);
                    if (tokenData) {
                        return {
                            category: "DeFi", // Match UI category name
                            chainId: 1, // Default to Ethereum
                            decimals: 18,
                            id: tokenId,
                            logoURI: tokenData.image?.small || "",
                            marketCap: tokenData.market_data?.market_cap?.usd || 0,
                            marketCapRank: tokenData.market_cap_rank || 9999,
                            name: tokenData.name,
                            platforms: tokenData.platforms,
                            price: tokenData.market_data?.current_price?.usd || 0,
                            priceChange24h: tokenData.market_data?.price_change_percentage_24h || 0,
                            sparkline: tokenData.market_data?.sparkline_7d?.price || [],
                            symbol: tokenData.symbol?.toUpperCase() || "",
                            volume24h: tokenData.market_data?.total_volume?.usd || 0,
                            address: ""
                        };
                    }
                    return null;
                } catch (err) {
                    console.error(`Failed to fetch DeFi token ${tokenId}:`, err);
                    return null;
                }
            });

            const results = await Promise.all(promises);
            return results.filter((token): token is TokenTypeB => token !== null);
        } catch (error) {
            console.error('Failed to fetch DeFi tokens:', error);
            return [];
        }
    },

    // Method to fetch DeFi AI tokens
    getDefiAITokens: async () => {
        try {
            const promises = DEFI_AI_TOKENS.map(async (tokenId) => {
                try {
                    const tokenData = await coingeckoService.getInfo(tokenId);
                    if (tokenData) {
                        return {
                            category: "DeFi AI", // Match UI category name
                            chainId: 1, // Default to Ethereum
                            decimals: 18,
                            id: tokenId,
                            logoURI: tokenData.image?.small || "",
                            marketCap: tokenData.market_data?.market_cap?.usd || 0,
                            marketCapRank: tokenData.market_cap_rank || 9999,
                            name: tokenData.name,
                            platforms: tokenData.platforms,
                            price: tokenData.market_data?.current_price?.usd || 0,
                            priceChange24h: tokenData.market_data?.price_change_percentage_24h || 0,
                            sparkline: tokenData.market_data?.sparkline_7d?.price || [],
                            symbol: tokenData.symbol?.toUpperCase() || "",
                            volume24h: tokenData.market_data?.total_volume?.usd || 0,
                            address: ""
                        };
                    }
                    return null;
                } catch (err) {
                    console.error(`Failed to fetch DeFi AI token ${tokenId}:`, err);
                    return null;
                }
            });

            const results = await Promise.all(promises);
            return results.filter((token): token is TokenTypeB => token !== null);
        } catch (error) {
            console.error('Failed to fetch DeFi AI tokens:', error);
            return [];
        }
    },

    // Method to fetch Layer 2 tokens
    getLayer2Tokens: async () => {
        try {
            const promises = LAYER2_TOKENS.map(async (tokenId) => {
                try {
                    const tokenData = await coingeckoService.getInfo(tokenId);
                    if (tokenData) {
                        return {
                            category: "Layer 2", // Match UI category name
                            chainId: 1, // Default to Ethereum
                            decimals: 18,
                            id: tokenId,
                            logoURI: tokenData.image?.small || "",
                            marketCap: tokenData.market_data?.market_cap?.usd || 0,
                            marketCapRank: tokenData.market_cap_rank || 9999,
                            name: tokenData.name,
                            platforms: tokenData.platforms,
                            price: tokenData.market_data?.current_price?.usd || 0,
                            priceChange24h: tokenData.market_data?.price_change_percentage_24h || 0,
                            sparkline: tokenData.market_data?.sparkline_7d?.price || [],
                            symbol: tokenData.symbol?.toUpperCase() || "",
                            volume24h: tokenData.market_data?.total_volume?.usd || 0,
                            address: ""
                        };
                    }
                    return null;
                } catch (err) {
                    console.error(`Failed to fetch Layer 2 token ${tokenId}:`, err);
                    return null;
                }
            });

            const results = await Promise.all(promises);
            return results.filter((token): token is TokenTypeB => token !== null);
        } catch (error) {
            console.error('Failed to fetch Layer 2 tokens:', error);
            return [];
        }
    },

    // Method to fetch GameFi tokens
    getGameFiTokens: async () => {
        try {
            const promises = GAMEFI_TOKENS.map(async (tokenId) => {
                try {
                    const tokenData = await coingeckoService.getInfo(tokenId);
                    if (tokenData) {
                        return {
                            category: "GameFi", // Match UI category name
                            chainId: 1, // Default to Ethereum
                            decimals: 18,
                            id: tokenId,
                            logoURI: tokenData.image?.small || "",
                            marketCap: tokenData.market_data?.market_cap?.usd || 0,
                            marketCapRank: tokenData.market_cap_rank || 9999,
                            name: tokenData.name,
                            platforms: tokenData.platforms,
                            price: tokenData.market_data?.current_price?.usd || 0,
                            priceChange24h: tokenData.market_data?.price_change_percentage_24h || 0,
                            sparkline: tokenData.market_data?.sparkline_7d?.price || [],
                            symbol: tokenData.symbol?.toUpperCase() || "",
                            volume24h: tokenData.market_data?.total_volume?.usd || 0,
                            address: ""
                        };
                    }
                    return null;
                } catch (err) {
                    console.error(`Failed to fetch GameFi token ${tokenId}:`, err);
                    return null;
                }
            });

            const results = await Promise.all(promises);
            return results.filter((token): token is TokenTypeB => token !== null);
        } catch (error) {
            console.error('Failed to fetch GameFi tokens:', error);
            return [];
        }
    },

    // Method to fetch Metaverse tokens
    getMetaverseTokens: async () => {
        try {
            const promises = METAVERSE_TOKENS.map(async (tokenId) => {
                try {
                    const tokenData = await coingeckoService.getInfo(tokenId);
                    if (tokenData) {
                        return {
                            category: "Metaverse", // Match UI category name
                            chainId: 1, // Default to Ethereum
                            decimals: 18,
                            id: tokenId,
                            logoURI: tokenData.image?.small || "",
                            marketCap: tokenData.market_data?.market_cap?.usd || 0,
                            marketCapRank: tokenData.market_cap_rank || 9999,
                            name: tokenData.name,
                            platforms: tokenData.platforms,
                            price: tokenData.market_data?.current_price?.usd || 0,
                            priceChange24h: tokenData.market_data?.price_change_percentage_24h || 0,
                            sparkline: tokenData.market_data?.sparkline_7d?.price || [],
                            symbol: tokenData.symbol?.toUpperCase() || "",
                            volume24h: tokenData.market_data?.total_volume?.usd || 0,
                            address: ""
                        };
                    }
                    return null;
                } catch (err) {
                    console.error(`Failed to fetch Metaverse token ${tokenId}:`, err);
                    return null;
                }
            });

            const results = await Promise.all(promises);
            return results.filter((token): token is TokenTypeB => token !== null);
        } catch (error) {
            console.error('Failed to fetch Metaverse tokens:', error);
            return [];
        }
    },

    // Method to fetch Infrastructure tokens
    getInfrastructureTokens: async () => {
        try {
            const promises = INFRASTRUCTURE_TOKENS.map(async (tokenId) => {
                try {
                    const tokenData = await coingeckoService.getInfo(tokenId);
                    if (tokenData) {
                        return {
                            category: "Infrastructure", // Match UI category name
                            chainId: 1, // Default to Ethereum
                            decimals: 18,
                            id: tokenId,
                            logoURI: tokenData.image?.small || "",
                            marketCap: tokenData.market_data?.market_cap?.usd || 0,
                            marketCapRank: tokenData.market_cap_rank || 9999,
                            name: tokenData.name,
                            platforms: tokenData.platforms,
                            price: tokenData.market_data?.current_price?.usd || 0,
                            priceChange24h: tokenData.market_data?.price_change_percentage_24h || 0,
                            sparkline: tokenData.market_data?.sparkline_7d?.price || [],
                            symbol: tokenData.symbol?.toUpperCase() || "",
                            volume24h: tokenData.market_data?.total_volume?.usd || 0,
                            address: ""
                        };
                    }
                    return null;
                } catch (err) {
                    console.error(`Failed to fetch Infrastructure token ${tokenId}:`, err);
                    return null;
                }
            });

            const results = await Promise.all(promises);
            return results.filter((token): token is TokenTypeB => token !== null);
        } catch (error) {
            console.error('Failed to fetch Infrastructure tokens:', error);
            return [];
        }
    },

    // Method to fetch Social tokens
    getSocialTokens: async () => {
        try {
            const promises = SOCIAL_TOKENS.map(async (tokenId) => {
                try {
                    const tokenData = await coingeckoService.getInfo(tokenId);
                    if (tokenData) {
                        return {
                            category: "Social", // Match UI category name
                            chainId: 1, // Default to Ethereum
                            decimals: 18,
                            id: tokenId,
                            logoURI: tokenData.image?.small || "",
                            marketCap: tokenData.market_data?.market_cap?.usd || 0,
                            marketCapRank: tokenData.market_cap_rank || 9999,
                            name: tokenData.name,
                            platforms: tokenData.platforms,
                            price: tokenData.market_data?.current_price?.usd || 0,
                            priceChange24h: tokenData.market_data?.price_change_percentage_24h || 0,
                            sparkline: tokenData.market_data?.sparkline_7d?.price || [],
                            symbol: tokenData.symbol?.toUpperCase() || "",
                            volume24h: tokenData.market_data?.total_volume?.usd || 0,
                            address: ""
                        };
                    }
                    return null;
                } catch (err) {
                    console.error(`Failed to fetch Social token ${tokenId}:`, err);
                    return null;
                }
            });

            const results = await Promise.all(promises);
            return results.filter((token): token is TokenTypeB => token !== null);
        } catch (error) {
            console.error('Failed to fetch Social tokens:', error);
            return [];
        }
    },

    // Method to fetch Sports tokens
    getSportsTokens: async () => {
        try {
            const promises = SPORTS_TOKENS.map(async (tokenId) => {
                try {
                    const tokenData = await coingeckoService.getInfo(tokenId);
                    if (tokenData) {
                        return {
                            category: "Sports", // Match UI category name
                            chainId: 1, // Default to Ethereum
                            decimals: 18,
                            id: tokenId,
                            logoURI: tokenData.image?.small || "",
                            marketCap: tokenData.market_data?.market_cap?.usd || 0,
                            marketCapRank: tokenData.market_cap_rank || 9999,
                            name: tokenData.name,
                            platforms: tokenData.platforms,
                            price: tokenData.market_data?.current_price?.usd || 0,
                            priceChange24h: tokenData.market_data?.price_change_percentage_24h || 0,
                            sparkline: tokenData.market_data?.sparkline_7d?.price || [],
                            symbol: tokenData.symbol?.toUpperCase() || "",
                            volume24h: tokenData.market_data?.total_volume?.usd || 0,
                            address: ""
                        };
                    }
                    return null;
                } catch (err) {
                    console.error(`Failed to fetch Sports token ${tokenId}:`, err);
                    return null;
                }
            });

            const results = await Promise.all(promises);
            return results.filter((token): token is TokenTypeB => token !== null);
        } catch (error) {
            console.error('Failed to fetch Sports tokens:', error);
            return [];
        }
    },

    getTokenList: async () => {
        console.log("getTokenList : ");
        try {
            console.log('Fetching tokens for all categories...');
            const [
                topTokens,
                memeTokens,
                aiTokens,
                defiTokens,
                defiAITokens,
                layer2Tokens,
                gameFiTokens,
                metaverseTokens,
                infrastructureTokens,
                socialTokens,
                sportsTokens
            ] = await Promise.all([
                coinGeckoApi.get<CoinGeckoToken[]>('/tokens/all'),
                coingeckoService.getMemecoins(),
                coingeckoService.getAITokens(),
                coingeckoService.getDefiTokens(),
                coingeckoService.getDefiAITokens(),
                coingeckoService.getLayer2Tokens(),
                coingeckoService.getGameFiTokens(),
                coingeckoService.getMetaverseTokens(),
                coingeckoService.getInfrastructureTokens(),
                coingeckoService.getSocialTokens(),
                coingeckoService.getSportsTokens()
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

            // Log token counts for debugging
            console.log("Meme tokens:", memeTokens.length);
            console.log("AI tokens:", aiTokens.length);
            console.log("DeFi tokens:", defiTokens.length);
            console.log("DeFi AI tokens:", defiAITokens.length);
            console.log("Layer 2 tokens:", layer2Tokens.length);
            console.log("GameFi tokens:", gameFiTokens.length);
            console.log("Metaverse tokens:", metaverseTokens.length);
            console.log("Infrastructure tokens:", infrastructureTokens.length);
            console.log("Social tokens:", socialTokens.length);
            console.log("Sports tokens:", sportsTokens.length);

            // Combine all token categories
            const allTokens = [
                ...validTopTokens,
                ...memeTokens,
                ...aiTokens,
                ...defiTokens,
                ...defiAITokens,
                ...layer2Tokens,
                ...gameFiTokens,
                ...metaverseTokens,
                ...infrastructureTokens,
                ...socialTokens,
                ...sportsTokens
            ];

            console.log("Total tokens after merging:", allTokens.length);

            return allTokens;
        } catch (error) {
            console.error('Failed to fetch token list:', error);
            return []; // Return empty array instead of throwing
        }
    },

    getStablecoins: async (): Promise<CoinGeckoStableToken[]> => {
        try {
            const {data} = await coinGeckoApi.get<CoinGeckoStableToken[]>('/stablecoin?ids=tether%2Cusd-coin%2Cdai');
            const stableTokens = data.map(token => ({
                id: token.id,
                name: token.name,
                symbol: token.symbol,
                current_price: token.current_price,
                market_cap: token.market_cap,
                total_supply: token.total_supply,
                image: token.image,
            }));
            return stableTokens;
        } catch (error) {
            console.error('Failed to fetch stablecoins:', error);
            return [];
        }
    },
    getCexVolume: async (): Promise<CexVolum[]> => {
        console.log("getCexVolume ....");
        try {
            const response = await coinGeckoApi.get<CexVolum[]>('/exchanges');
            const data: CexVolum[] = response.data;
            return data;
        } catch (error) {
            console.error('Failed to fetch exchange volume:', error);
            return [];
        }
    },

    getTokenIds: async (): Promise<any[]> => {
        try {
            const response = await coinGeckoApi.get<any[]>('/tokens/list');
            const data = response.data;
            return data;
        } catch (error) {
            console.error('Failed to fetch memecoins:', error);
            throw error;
        }
    },

    getOHLCV: async (
        tokenId: string,
        timeInterval = '1H',
        unixTimeFrom: number | undefined = undefined,
        unixTimeTo: number | undefined = undefined) => {
        try {
            const response = await coinGeckoApi.get(`/ohlcv/${tokenId}`, {
                params: {
                    ...{
                        type: timeInterval,
                        time_from: unixTimeFrom,
                        time_to: unixTimeTo,
                    }
                },
            });

            if (!Array.isArray(response.data)) {
                throw new Error('Invalid response format');
            }

            // CoinGecko OHLC format: [timestamp, open, high, low, close]
            const chartData: ChartDataPoint[] = response.data.map((item) => ({
                ...item,
                time: item.time / 1000,
            }));
            return chartData;
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
    getCoinGeckoIdFrom: async (tokenAddress: string, chainId: number): Promise<string> => {
        try {
            const {data} = await coinGeckoApi.get<string>(`/token-id/${chainId}?addresses=${tokenAddress}`);
            return data;
        } catch (e) {
            console.log(e);
        }
        return "";
    },
    getTokenPrices: async (chainId: number, addresses: (string | null)[]): Promise<Record<string, string>> => {
        try {
            const modifiedAddresses = addresses.map(addr => addr?.toLowerCase() === NULL_ADDRESS ? ZERO_ADDRESS : addr);
            if (modifiedAddresses.length <= 0)
                throw new Error('address not provided');
            const {data} = await coinGeckoApi.get<Record<string, string>>(`/prices/${chainId}?addresses=${modifiedAddresses}`);
            const updatedResponse: Record<string, string> = {};
            for (const [key, value] of Object.entries(data)) {
                updatedResponse[key === ZERO_ADDRESS ? NULL_ADDRESS : key] = value;
            }
            return updatedResponse;
        } catch (e) {
            console.log(e);
        }
        return {};
    },
    getTrendingCoins: async (): Promise<TrendingCoin[]> => {
        try {
            const {data} = await coinGeckoApi.get<TrendingCoin[]>('/trending/');
            return data;
        } catch (error) {
            console.error('Failed to fetch trending coins:', error);
            return [];
        }
    },

    getTopGainers: async (): Promise<Ganiner[]> => {
        try {
            const {data} = await coinGeckoApi.get<Ganiner[]>('/top_gainers/');
            return data;
        } catch (error) {
            console.error('Failed to fetch top gainers:', error);
            return [];
        }
    },

    getTopLosers: async (): Promise<Loser[]> => {
        try {
            const {data} = await coinGeckoApi.get<Loser[]>('/top_losers/');
            return data;
        } catch (error) {
            console.error('Failed to fetch top losers:', error);
            return [];
        }
    },

    searchCoins: async (query: string): Promise<SearchResult[]> => {
        try {
            const {data} = await coinGeckoApi.get<SearchResult[]>(`/search?query=${encodeURIComponent(query)}`);
            return data;
        } catch (error) {
            console.error('Error searching coins:', error);
            return [];
        }
    },

    getCoinPrice: async (coinId: string): Promise<CoinData> => {
        try {
            const {data} = await coinGeckoApi.get<CoinData>(`/price/${coinId}`);
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
            const {data} = await coinGeckoApi.get<MarketCapToken[]>(`/tokens/marketcap?page=${page}`);
            return data;
        } catch (error) {
            console.error('Error searching coins:', error);
            return [];
        }
    },
    getInfo: async (tokenId: string): Promise<any> => {
        try {
            const {data} = await coinGeckoApi.get<any>(`/coin?coinId=${tokenId}`);
            return data;
        } catch (err) {
            console.log('get token info err: ', err);
        }

        return null;
    }
};