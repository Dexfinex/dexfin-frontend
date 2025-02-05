import { create } from "zustand";

export interface TokenBalance {
  chain: number;
  address: string;
  symbol: string;
  name: string;
  logo: string;
  balance: string;
  decimals: number;
  usdPrice: number;
  usdValue: number;
}

// Define the store's state and actions
interface TokenBalanceStoreState {
  tokenBalances: TokenBalance[];
  totalUsdValue: number;
  chainUsdValue: Record<number, number>;
  setTokenBalances: (balances: TokenBalance[]) => void
}

// Create the store
const useTokenBalanceStore = create<TokenBalanceStoreState>((set) => ({
  tokenBalances: [], // Initialize with an empty array
  totalUsdValue: 0,
  chainUsdValue: {},
  getTokenBalance: (address: string, chainId: number) => {
    const state = useTokenBalanceStore.getState() as TokenBalanceStoreState;
    const value = state.tokenBalances.find(
      (token) => token.address === address && token.chain === chainId
    );
    return value || {};
  },
  getChainUsdBalance: (chainId: number): number => {
    const state = useTokenBalanceStore.getState() as TokenBalanceStoreState;
    return state.chainUsdValue[chainId] || 0;
  },
  setTokenBalances: (balances: TokenBalance[]) => {
    const totalUsdValue = balances.reduce(
      (acc, b) => acc + Number(b.usdValue) || 0,
      0
    );
    const chainUsdValue = balances.reduce(
      (acc: Record<number, number>, current) => {
        if (!acc[current.chain]) {
          acc[current.chain] = 0;
        }
        // Add the current amount to the category's total
        acc[current.chain] += current.usdValue;
        return acc;
      },
      {}
    );

    set({
      tokenBalances: balances,
      totalUsdValue: totalUsdValue,
      chainUsdValue,
    });
  },
}));

export default useTokenBalanceStore;
