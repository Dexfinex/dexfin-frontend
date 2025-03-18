import { dexfinv3Api } from "./api.service.ts";
import {
  EvmWalletBalanceRequestType,
  EvmWalletBalanceResponseType,
  EvmDefiPosition,
  EvmDefiProtocol,
  SolanaTokensType,
  SolanaWalletReponseType,
} from "../types/dexfinv3.type.ts";
import { birdeyeService } from "./birdeye.service.ts";
import { coingeckoService } from "./coingecko.service.ts";
import { Transfer, TokenMetadata } from "../types/wallet.type.ts";
import { SOLANA_CHAIN_ID } from "../constants/solana.constants.ts";

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
    let result: EvmWalletBalanceResponseType[] = [];

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
            const data = await coingeckoService.getOHLCV(tokenId, "12H", fromTime, currentTime)
            const priceChange24h = data.length > 0 ? (data[data.length - 1]?.close - data[0]?.close) : 0;
            const usdPrice = Number(data[data.length - 1]?.close);
            const usdValue = usdPrice * Number(token.balanceDecimal);

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

    return []
  }
};
