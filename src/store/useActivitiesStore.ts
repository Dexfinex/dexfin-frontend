import { create } from "zustand";
import { WalletActivityType } from "../types/dexfinv3.type";

// Define the store's state and actions
interface ActivitiesStoreState {
    activities: WalletActivityType[];
    setActivities: (data: WalletActivityType[]) => void
}

// Create the store
const useActivitiesStore = create<ActivitiesStoreState>((set) => ({
    activities: [], // Initialize with an empty array
    setActivities: (activities) => set({ activities })
}));

export default useActivitiesStore;
