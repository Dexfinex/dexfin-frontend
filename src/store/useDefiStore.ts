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
    netApy?: number;
    chainId: number;
    id: string;
}

// Define the store's state and actions
interface DefiStoreState {
    netAPY: number;
    healthFactor: number;
    positions: Position[];
    protocolTypes: string[];
    protocol: EvmDefiProtocol[];
    setPositions: (chaindId: number, evmPositions: EvmDefiPosition[]) => void
    setProtocol: (chainId: number, protocol: EvmDefiProtocol) => void
}

// Create the store
const useDefiStore = create<DefiStoreState>((set, get) => ({
    netAPY: 0,
    healthFactor: 0,
    positions: [],
    protocolTypes: [],
    protocol: [],
    setPositions: (chainId, evmPositions) => {
        const state = get();

        let totalPositions = [...state.positions];

        for (const position of evmPositions) {
            const positionId = `chian-id-${chainId}-protocol-id-${position.protocol_id}-type-${capitalizeFirstLetter(position.position.label)}`;
            const index = totalPositions.findIndex((_) => positionId === _.id);
            if (index === -1) {
                totalPositions.push({
                    address: position.position.address,
                    protocol: position.protocol_name,
                    protocol_id: position.protocol_id,
                    type: capitalizeFirstLetter(position.position.label),
                    amount: position.position.balance_usd,
                    tokens: position.position.tokens,
                    apy: position.position?.position_details?.apy,
                    rewards: position.position?.position_details?.projected_earnings_usd?.yearly,
                    healthFactor: position.account_data?.health_factor || 0,
                    logo: position.protocol_logo,
                    factory: position.position?.position_details?.factory,
                    netApy: position?.account_data?.net_apy || 0,
                    chainId: chainId,
                    id: positionId
                })
            } else {
                totalPositions[index] = {
                    address: position.position.address,
                    protocol: position.protocol_name,
                    protocol_id: position.protocol_id,
                    type: capitalizeFirstLetter(position.position.label),
                    amount: position.position.balance_usd,
                    tokens: position.position.tokens,
                    apy: position.position?.position_details?.apy,
                    rewards: position.position?.position_details?.projected_earnings_usd?.yearly,
                    healthFactor: position.account_data?.health_factor || 0,
                    logo: position.protocol_logo,
                    factory: position.position?.position_details?.factory,
                    netApy: position?.account_data?.net_apy || 0,
                    chainId: chainId,
                    id: positionId
                }
            }
        }

        totalPositions.sort((a, b) => a.amount < b.amount ? 1 : -1)

        const netAPY = totalPositions.reduce((sum, p) => sum + (p?.netApy || 0), 0) || 0;
        const healthFactor = totalPositions.reduce((sum, p) => sum + (p?.healthFactor || 0), 0);
        const protocolTypes = [...new Set(totalPositions.map((position) => (capitalizeFirstLetter(position?.type || ""))))];

        set({ positions: totalPositions, netAPY, healthFactor, protocolTypes })
    },
    setProtocol(chainId, protocol) {
        const state = get();
        let totalProtocol = [...state.protocol];

        const index = totalProtocol.findIndex(item => item.chainId === chainId);
        if (index === -1) {
            totalProtocol.push({ ...protocol, chainId: chainId });
        } else {
            totalProtocol[index] = { ...protocol, chainId: chainId };
        }

        set({ protocol: totalProtocol });
    },
}));

export default useDefiStore;
