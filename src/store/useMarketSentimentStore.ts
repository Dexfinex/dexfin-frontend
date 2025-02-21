import { create } from "zustand";
import { MarketSentimentData } from "../services/marketsentiment.service";

// Define the store's state and actions
interface CryptoNewsStoreState {
    data: MarketSentimentData;
    setData: (data: MarketSentimentData) => void
}

// Create the store
const useMarketSentimentStore = create<CryptoNewsStoreState>((set) => ({
    data: {
        value: 0,
        valueClassification: "Neutral",
        timestamp: "",
        previousClose: 0,
        dailyChange: 0,
        formattedTime: ""
    }, // Initialize with an empty array
    setData: (data) => set({ data })
}));

export default useMarketSentimentStore;