import { dexfinv3Api } from "./api.service.ts";
import {
  EvmWalletBalanceRequestType,
  EvmWalletBalanceResponseType,
} from "../types/dexfinv3.type.ts";
import { Transfer, TokenMetadata } from "../types/wallet.ts";

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
};
