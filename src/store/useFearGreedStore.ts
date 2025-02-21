import { create } from "zustand";
import { FearGreedData } from "../services/feargreed.service";

// Define the store's state and actions
interface CryptoNewsStoreState {
    data: FearGreedData;
    setData: (data: FearGreedData) => void
}

// Create the store
const useFearGreedStore = create<CryptoNewsStoreState>((set) => ({
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

export default useFearGreedStore;
