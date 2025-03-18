import { create } from "zustand";
import { TokenType } from "../types/swap.type";

// Define the store's state and actions
interface ActivitiesStoreState {
    trendingTokens: Record<string, TokenType[]>;
    setTrendingTokens: (data: Record<string, TokenType[]>) => void
}

// Create the store
const useTrendingTokensStore = create<ActivitiesStoreState>((set) => ({
    trendingTokens: {
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
    }, // Initialize with an empty array
    setTrendingTokens: (trendingTokens) => set({ trendingTokens })
}));

export default useTrendingTokensStore;
