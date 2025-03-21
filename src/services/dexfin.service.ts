import {dexfinv3Api} from "./api.service.ts";
import {
  EvmDefiPosition,
  EvmDefiProtocol,
  EvmWalletBalanceRequestType,
  EvmWalletBalanceResponseType,
  SolanaTokensType,
  SolanaWalletReponseType,
} from "../types/dexfinv3.type.ts";
import {coingeckoService} from "./coingecko.service.ts";
import { birdeyeService } from "./birdeye.service.ts";
import { Transfer, TokenMetadata } from "../types/wallet.type.ts";
import { TokenType } from "../types/swap.type.ts";
import { SOLANA_CHAIN_ID } from "../constants/solana.constants.ts";
import { NETWORKS } from "../config/networks.ts";

export const dexfinv3Service = {
  getEvmWalletBalance: async ({
    chainId,
    address,
  }: EvmWalletBalanceRequestType): Promise<EvmWalletBalanceResponseType[]> => {
    try {
      const { data } = await dexfinv3Api.get<EvmWalletBalanceResponseType[]>(
        `/evm/wallet/${chainId}/${address}/balances`
      );
      return data;
    } catch (error) {
      console.log("Failed to fetch evm wallet balance:", error);
    }

    return [];
  },

  getEvmWalletBalanceAll: async ({ address }: { address: string }): Promise<EvmWalletBalanceResponseType[]> => {
    try {
      const { data } = await dexfinv3Api.get<EvmWalletBalanceResponseType[]>(
        `/evm/wallet/${address}/balances`
      );

      return data;
    } catch (error) {
      console.log("Failed to fetch evm wallet balance:", error);
    }

    return [];
  },

  getSolanaWalletBalance: async ({ address }: { address: string }): Promise<EvmWalletBalanceResponseType[]> => {
    let result: EvmWalletBalanceResponseType[] = [];

    try {
      const { data } = await dexfinv3Api.get<SolanaWalletReponseType>(
        `/solana/wallet/mainnet/${address}/balances`
      );

      if (data.native?.amount) {
        result.push({
          tokenAddress: data.native.mint,
          symbol: data.native.symbol,
          name: data.native.name,
          logo: data.native.logo,
          thumbnail: data.native.thumbnail,
          decimals: data.native.decimals,
          balance: data.native.lamports,
          balanceDecimal: Number(data.native.amount),
          usdPrice: data.native.usdPrice,
          usdValue: data.native.usdValue,
          chain: `0x${SOLANA_CHAIN_ID.toString(16)}`,
        } as EvmWalletBalanceResponseType)
      }

      if (data.token.length > 0) {
        const solTokenData: EvmWalletBalanceResponseType[] = data.token.map((token: SolanaTokensType) => {
          return {
            tokenAddress: token.mint,
            symbol: token.symbol,
            name: token.name,
            logo: token.logo,
            thumbnail: "",
            decimals: token.decimals,
            balance: token.amountRaw,
            balanceDecimal: Number(token.amount),
            usdPrice: token.usdPrice,
            usdValue: token.usdValue,
            chain: `0x${SOLANA_CHAIN_ID.toString(16)}`
          } as EvmWalletBalanceResponseType
        })

        result = [...result, ...solTokenData]
      }
    } catch (error) {
      console.log("Failed to fetch solana wallet balance:", error);
    }

    return result;
  },

  getEvmWalletTransfer: async ({
    chainId,
    address,
  }: {
    chainId: number;
    address: string;
  }): Promise<Transfer[]> => {
    try {
      const { data } = await dexfinv3Api.get<Transfer[]>(
        `/evm/wallet/${chainId}/${address}/transfer`
      );
      return data;
    } catch (error) {
      console.log("Failed to fetch evm wallet transfer:", error);
    }

    return [];
  },

  getEvmTokenMetadata: async ({
    chainId,
    tokenAddress,
  }: {
    chainId: number;
    tokenAddress: string;
  }): Promise<TokenMetadata | null> => {
    try {
      const { data } = await dexfinv3Api.get<[TokenMetadata]>(
        `/evm/token/metadata/${chainId}/${tokenAddress}`
      );
      return data[0];
    } catch (error) {
      console.log("Failed to fetch evm wallet transfer:", error);
    }

    return null;
  },

  getEvmDeifPositionByWallet: async (chainId: number, walletAddress: string) => {
    try {
      const { data } = await dexfinv3Api.get<EvmDefiPosition[]>(
        `/evm/defi/positions/${chainId}/${walletAddress}`
      );

      return data;
    } catch (error) {
      console.log("Failed to fetch evm defi position:", error);
      throw error;
    }
  },

  getEvmDeifProtocolsByWallet: async (chainId: number, walletAddress: string) => {
    try {
      const { data } = await dexfinv3Api.get<EvmDefiProtocol>(
        `/evm/defi/protocols/${chainId}/${walletAddress}`
      );
      return data;
    } catch (error) {
      console.log("Failed to fetch evm defi protocols:", error);
      throw error;
    }
  },

  getAllWalletTokens: async (evmAddress: string, solAddress: string) => {
    const result: EvmWalletBalanceResponseType[] = [];

    try {
      const { data } = await dexfinv3Api.get<any[]>(
        `/wallet/tokens?evmAddress=${evmAddress}&solAddress=${solAddress}`
      );

      if (data.length > 0) {
        const currentTime = Math.round(Date.now() / 1000) - 60
        const fromTime = currentTime - 24 * 3600;

        for (const token of data) {
          if (token.network.id == "solana") {
            const tokenAddress: string = (token.mint === "solana" ? "So11111111111111111111111111111111111111112" : token.mint)
            const data = await birdeyeService.getOHLCV(tokenAddress, "12H", fromTime, currentTime)
            const priceChange24h = data.length > 0 ? (data[data.length - 1]?.close - data[0]?.close) : 0;

            result.push({
              tokenAddress,
              symbol: token.symbol,
              name: token.name,
              logo: token.logo,
              thumbnail: "",
              decimals: token.decimals,
              balance: token.amountRaw,
              balanceDecimal: Number(token.amount),
              usdPrice: token.usdPrice,
              usdPrice24hrUsdChange: priceChange24h,
              usdValue: token.usdValue,
              usdValue24hrUsdChange: Number(priceChange24h) * Number(token.amount),
              chain: `0x${SOLANA_CHAIN_ID.toString(16)}`,
              network: {
                ...token.network,
                chainId: SOLANA_CHAIN_ID
              },
              tokenId: token.tokenId
            } as EvmWalletBalanceResponseType)
          } else {
            const tokenId = token.tokenId === "ethereum" ? (Number(token.chain) === 1 ? token.tokenId : ("w" + token.symbol.toLowerCase())) : token.tokenId;
            let priceChange24h = 0, usdPrice = 0, usdValue = 0
            try {
              const data = await coingeckoService.getOHLCV(tokenId, "12H", fromTime, currentTime)
              priceChange24h = data.length > 0 ? (data[data.length - 1]?.close - data[0]?.close) : 0;
              usdPrice = Number(data[data.length - 1]?.close);
              usdValue = usdPrice * Number(token.balanceDecimal);
            } catch(e) {
              console.log(e)
            }

            result.push({
              ...token,
              ...{
                usdPrice24hrUsdChange: priceChange24h,
                usdValue24hrUsdChange: Number(priceChange24h) * Number(token.balanceDecimal),
                usdPrice,
                usdValue,
              }
            })
          }
        }
      }

      return result
    } catch (error) {
      console.log("Failed to fetch evm wallet balance:", error);
    }

    return [];
  },

  getAllActivities: async (evmAddress: string, solAddress: string) => {
    try {
      const { data } = await dexfinv3Api.get<any>(
        `/wallet/activities?evmAddress=${evmAddress}&solAddress=${solAddress}`
      );

      if (data.length > 0) {
        return data.map((e: any) => ({
          ...e,
          network: {
            ...e.network,
            chainId: e.network.id === "solana" ? SOLANA_CHAIN_ID : e.network.chainId
          }
        }
        ));
      }
    } catch (error) {
      console.log("Failed to fetch evm wallet balance:", error);
    }

    return [];
  },

  getTrendingTokens: async (skip: number, chainId?: number) => {
    const take = 30;

    try {
      const { data } = await dexfinv3Api.get<any>(
        `/tokenlist?skip=${skip}&take=${take}&chainId=${chainId}`
      );

      return data;
    } catch (error) {
      console.log("Failed to fetch token list:", error);
    }

    return [];
  },

  getAllTrendingTokens: async () => {
    const result = {
      'all': [] as TokenType[],
      'ethereum': [] as TokenType[],
      'polygon': [] as TokenType[],
      'base': [] as TokenType[],
      'bsc': [] as TokenType[],
      'avalanche': [] as TokenType[],
      'optimism': [] as TokenType[],
      'arbitrum': [] as TokenType[],
      'bitcoin': [] as TokenType[],
      'solana': [] as TokenType[]
    };

    try {
      const { data } = await dexfinv3Api.get<TokenType[]>(
        `/tokenlist?skip=${0}&take=${1600}&chainId=`
      );

      if (data && data.length > 0) {
        const keys = Object.keys(result);
        keys.forEach(key => {
          if (key === "all") {
            result[key] = data;
          } else {
            const network = NETWORKS.find(net => net.id == key);
            const filtered: TokenType[] = data.filter((d: TokenType) => d.chainId == network?.chainId);
            result[key as keyof typeof result] = filtered;
          }
        })
      }

      return result;
    } catch (error) {
      console.log("Failed to fetch token list:", error);
    }

    return null;
  },

  searchTrendingTokens: async (query: string, chainId?: number) => {
    const limit = 10;

    try {
      const { data } = await dexfinv3Api.get<any>(
        `/tokenlist/search?query=${query}&chainId=${chainId}&limit=${limit}`
      );

      return data;
    } catch (error) {
      console.log("Failed to search token:", error);
    }

    return [];
  }
};
