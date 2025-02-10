import { create } from "zustand";
import { NewsItem } from "../types";

// Define the store's state and actions
interface CryptoNewsStoreState {
    latest: NewsItem[];
    setLatestCryptoNews: (latestCryptoNews: NewsItem[]) => void
}

// Create the store
const useCryptoNewsStore = create<CryptoNewsStoreState>((set) => ({
    latest: [], // Initialize with an empty array
    setLatestCryptoNews: (latestCryptoNews: NewsItem[]) => set({ latest: latestCryptoNews })
}));

export default useCryptoNewsStore;
