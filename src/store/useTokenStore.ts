import { create } from "zustand";
import { TokenMetadata } from "../types/wallet.type";
import {solToWSol} from "../utils/solana.util.ts";

// Define the store's state and actions
interface TokenStoreState {
  tokenPrices: Record<string, string>;
  tokenMetadataList: Record<string, Record<string, TokenMetadata>>;
  setTokenPrices: (prices: Record<string, string>) => void;
  getTokenPrice: (address: string, chainId: number) => number;
  setTokenMetadata: (metadata: TokenMetadata, chainId: number) => void;
  getTokenMetadata: (
    chainId: number,
    tokenAddress: string
  ) => TokenMetadata | null;
}

// Create the store
const useTokenStore = create<TokenStoreState>((set) => ({
  tokenPrices: {}, // Initialize with an empty object
  setTokenPrices: (prices: Record<string, string>) =>
    set((state) => {
      return {
        tokenPrices: { ...state.tokenPrices, ...prices },
      };
    }), // Update the token prices
  getTokenPrice: (address: string, chainId: number) => {
    const state = useTokenStore.getState() as TokenStoreState;
    const value = state.tokenPrices[`${chainId}:${solToWSol(address)?.toLowerCase()}`];
    return value ? Number(value) : 0;
  },
  tokenMetadataList: {},
  getTokenMetadata: (chainId: number, tokenAddress: string) => {
    const state = useTokenStore.getState() as TokenStoreState;
    return state.tokenMetadataList[chainId][tokenAddress] || null;
  },
  setTokenMetadata: (metadata: TokenMetadata, chainId: number) =>
    set((state) => ({
      tokenMetadataList: {
        ...state.tokenMetadataList,
        ...{ [chainId]: { [metadata.address]: metadata } },
      },
    })),
}));

export default useTokenStore;
