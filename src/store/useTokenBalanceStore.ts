import { create } from "zustand";
import { compareWalletAddresses } from "../utils/common.util";

export interface TokenBalance {
  chain: number;
  address: string;
  symbol: string;
  name: string;
  logo: string;
  balance: number;
  decimals: number;
  usdPrice: number;
  usdValue: number;
}

// Define the store's state and actions
interface TokenBalanceStoreState {
  tokenBalances: TokenBalance[];
  totalUsdValue: number;
  chainUsdValue: Record<number, number>;
  getTokenBalance: (address: string, chainId: number) => TokenBalance | null;
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
      (token) => compareWalletAddresses(token.address, address) && Number(token.chain) === Number(chainId)
    );
    return value || null;
  },
  getChainUsdBalance: (chainId: number): number => {
    const state = useTokenBalanceStore.getState() as TokenBalanceStoreState;
    return state.chainUsdValue[chainId] || 0;
  },
  setTokenBalances: (balances: TokenBalance[]) => {
    const sortedBalances = balances.sort((a, b) => a.usdValue >= b.usdValue ? -1 : 1)
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
      tokenBalances: sortedBalances,
      totalUsdValue: totalUsdValue,
      chainUsdValue,
    });
  },
}));

export default useTokenBalanceStore;
