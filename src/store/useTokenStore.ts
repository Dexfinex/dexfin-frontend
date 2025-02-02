import {create} from "zustand";

// Define the store's state and actions
interface TokenStoreState {
    tokenPrices: Record<string, string>;
    setTokenPrices: (prices: Record<string, string>) => void;
    getTokenPrice: (address: string, chainId: number) => number;
}

// Create the store
const useTokenStore = create<TokenStoreState>((set) => ({
    tokenPrices: {}, // Initialize with an empty object
    setTokenPrices: (prices: Record<string, string>) => set(() => ({ tokenPrices: prices })), // Update the token prices
    getTokenPrice: (address: string, chainId: number) => {
        const state = useTokenStore.getState() as TokenStoreState;
        const value = state.tokenPrices[`${chainId}:${address.toLowerCase()}`];
        return value ? Number(value) : 0;
        },
}));

export default useTokenStore;