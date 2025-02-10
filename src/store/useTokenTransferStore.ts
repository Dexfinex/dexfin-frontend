import { create } from "zustand";

import { Transfer } from "../types/wallet";

// Define the store's state and actions
interface TokenBalanceStoreState {
  transfers: Transfer[];
  setTransfers: (transfers: Transfer[]) => void;
}

// Create the store
const useTokenTransferStore = create<TokenBalanceStoreState>((set) => ({
  transfers: [],
  setTransfers: (transfers: Transfer[]) => {
    set({
      transfers: transfers,
    });
  },
}));

export default useTokenTransferStore;
