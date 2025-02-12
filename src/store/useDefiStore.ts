import { create } from "zustand";
import { EvmDefiPosition } from "../types/dexfinv3.type";

export interface Position {
    protocol: string;
    type: 'LENDING' | 'BORROWING' | 'STAKING' | 'POOL';
    amount: number;
    tokens: string;
    apy: number;
    rewards?: number;
    healthFactor?: number;
    poolShare?: number;
    pairToken?: string;
    logo: string;
    borrowed?: number;
    maxBorrow?: number;
    collateralFactor?: number;
}

// Define the store's state and actions
interface DefiStoreState {
    positions: Position[];
    setPositions: (evmPositions: EvmDefiPosition[]) => void
}

// Create the store
const useDefiStore = create<DefiStoreState>((set) => ({
    positions: [],
    setPositions: (evmPositions: EvmDefiPosition[]) => {
        const positions = evmPositions.map((position) => ({
            protocol: position.protocol_name,
            type: position.position.label,
            amount: position.position.balance_usd,
            tokens: position.position.tokens.map((token) => (token.name + ", ")),
            apy: position.position?.position_details?.apy,
            rewards: position.total_projected_earnings_usd.weekly,
            healthFactor: position.account_data.health_factor,
            logo: position.protocol_logo,
        }))
        set({ positions: positions as unknown as Position[] })
    }
}));

export default useDefiStore;
