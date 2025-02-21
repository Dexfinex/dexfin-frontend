import { create } from "zustand";
import { EvmDefiPosition, EvmDefiProtocol } from "../types/dexfinv3.type";
import { capitalizeFirstLetter } from "../utils/defi.util";

export interface PositionToken {
    token_type: string;
    name: string;
    symbol: string;
    contract_address: string;
    decimals: string;
    logo: string;
    thumbnail: string;
    balance: string;
    balance_formatted: string;
    usd_price: number;
    usd_value: number;
}

export interface Position {
    protocol: string;
    protocol_id: string;
    type: string;
    amount: number;
    tokens: PositionToken[];
    address: string;
    apy: number;
    rewards?: number;
    healthFactor?: number;
    poolShare?: number;
    pairToken?: string;
    logo: string;
    borrowed?: number;
    maxBorrow?: number;
    collateralFactor?: number;
    factory?: string;
}

// Define the store's state and actions
interface DefiStoreState {
    netAPY: number;
    healthFactor: number;
    positions: Position[];
    protocolTypes: string[];
    protocol: EvmDefiProtocol;
    setPositions: (evmPositions: EvmDefiPosition[]) => void
    setProtocol: (protocol: EvmDefiProtocol) => void
}

// Create the store
const useDefiStore = create<DefiStoreState>((set) => ({
    netAPY: 0,
    healthFactor: 0,
    positions: [],
    protocolTypes: [],
    protocol: {
        active_protocols: 0,
        total_positions: 0,
        total_usd_value: 0,
        total_unclaimed_usd_value: 0,
        protocols: [],
    },
    setPositions: (evmPositions) => {
        const netAPY = evmPositions.reduce((sum, p) => sum + (p?.account_data?.net_apy || 0), 0) / evmPositions.length || 0;
        const healthFactor = evmPositions.reduce((sum, p) => sum + (p?.account_data?.health_factor || 0), 0);
        const protocolTypes = [...new Set(evmPositions.map((position) => (capitalizeFirstLetter(position.position.label))))];
        const positions = evmPositions.map((position) => ({
            address: position.position.address,
            protocol: position.protocol_name,
            protocol_id: position.protocol_id,
            type: capitalizeFirstLetter(position.position.label),
            amount: position.position.balance_usd,
            tokens: position.position.tokens,
            apy: position.position?.position_details?.apy,
            rewards: position.total_projected_earnings_usd.weekly,
            healthFactor: position.account_data?.health_factor || 0,
            logo: position.protocol_logo,
            factory: position.position?.position_details?.factory,
        }))
        set({ positions: positions as unknown as Position[], netAPY, healthFactor, protocolTypes })
    },
    setProtocol(protocol) {

        set({ protocol })
    },
}));

export default useDefiStore;
