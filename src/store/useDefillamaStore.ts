import { create } from "zustand";
import { DefillamaPool, DefillamaProtocol, DeFiStats, DefillamaCategory } from "../types";

interface DeFiStats1 {
    totalTvl: number;
    totalChange24h: number;
    defiMarketCap: number;
    categories: {
        name: string;
        tvl: number;
        change24h: number;
    }[];
    protocols: {
        name: string;
        tvl: number;
        change24h: number;
        category: string;
        logo: string;
    }[];
}

// Define the store's state and actions
interface DefillamaStore {
    totalTvl: number,
    mcap: number,
    totalChange24h: number,
    pools: DefillamaPool[],
    protocols: DefillamaProtocol[],
    categories: DefillamaCategory[],
    getPools: (chainName: string) => DefillamaPool[],
    setPools: (pools: DefillamaPool[]) => void
    setProtocols: (protocols: DefillamaProtocol[]) => void,
    getDeFiStats: () => DeFiStats,
}

// Create the store
const useDefillamaStore = create<DefillamaStore>((set) => ({
    totalTvl: 0,
    mcap: 0,
    totalChange24h: 0,
    pools: [], // Initialize with an empty array
    protocols: [], // Initialize with an empty array
    categories: [], // Initialize with an empty array
    getPools: (chainName: string, limitNumber: number = 9) => {
        const state = useDefillamaStore.getState() as DefillamaStore;
        const filteredPools = state.pools.filter((pool) => chainName ? pool.chain.toUpperCase() === chainName.toUpperCase() : true);
        filteredPools.sort((a, b) => Number(a.apy) > Number(b.apy) ? -1 : 1);
        const data = filteredPools.slice(0, Math.min(filteredPools.length, limitNumber));
        return data;
    },
    setPools: (pools: DefillamaPool[]) => {
        set({ pools })
    },
    setProtocols: (protocols: DefillamaProtocol[]) => {
        const totalTvl = protocols.reduce((sum, p) => sum + p.tvl, 0);
        const mcap = protocols.reduce((sum, p) => sum + (p?.mcap || 0), 0);
        const totalChange24h = protocols.reduce((sum, p) => sum + p.change_1d, 0) / protocols.length;

        const categoriesMap = protocols.reduce((acc: Record<string, any>, p) => {
            if (!acc[p.slug]) {
                acc[p.slug] = { name: p.slug, tvl: 0, change24h: 0, count: 0 };
            }
            acc[p.slug].tvl += p.tvl;
            acc[p.slug].change24h += p.change_1d;
            acc[p.slug].count += 1;
            return acc;
        }, {});

        const categories = Object.values(categoriesMap)
            .map((cat: any) => ({
                name: cat.name,
                tvl: cat.tvl,
                change24h: cat.change24h / cat.count
            }))
            .sort((a: any, b: any) => b.tvl - a.tvl)

        set({ protocols: protocols, totalTvl, totalChange24h, categories, mcap })
    },
    getDeFiStats: () => {
        const state = useDefillamaStore.getState() as DefillamaStore;

        const protocols = state.protocols.map((protocol) => ({
            name: protocol.name,
            tvl: protocol.tvl,
            change24h: protocol.change_1d,
            category: protocol.slug,
            logo: protocol.logo,
        }))

        return {
            totalTvl: state.totalTvl,
            totalChange24h: state.totalChange24h,
            defiMarketCap: state.mcap,
            categories: state.categories,
            protocols: protocols
        }
    }
}));

export default useDefillamaStore;
