import { create } from "zustand";
import { DefillamaPool, DefillamaProtocol, DeFiStats, DefillamaCategory, DefillamaChainTVL, DefillamaDexVolume } from "../types";

interface DefillamaStore {
    totalTvl: number;
    mcap: number;
    totalChange24h: number;
    chainTVLs: DefillamaChainTVL[];
    dexVolume: DefillamaDexVolume | null; // Changed from dexVoulme to dexVolume and made it nullable
    pools: DefillamaPool[];
    protocols: DefillamaProtocol[];
    categories: DefillamaCategory[];
    getPools: (chainName: string) => DefillamaPool[];
    setPools: (pools: DefillamaPool[]) => void;
    setProtocols: (protocols: DefillamaProtocol[]) => void;
    setChainTVLs: (chainTVLs: DefillamaChainTVL[]) => void;
    setDexVolume: (volume: DefillamaDexVolume) => void; // Updated parameter name and type
    getDeFiStats: () => DeFiStats;
    getChainTVL: () => { chainTVLs: DefillamaChainTVL[] };
    getDexVolume: () => DefillamaDexVolume | null; // Updated return type
}

const useDefillamaStore = create<DefillamaStore>((set, get) => ({
    totalTvl: 0,
    mcap: 0,
    totalChange24h: 0,
    pools: [],
    protocols: [],
    categories: [],
    chainTVLs: [],
    dexVolume: null, // Initialize as null

    getPools: (chainName: string, limitNumber: number = 9) => {
        const state = get();
        const filteredPools = state.pools.filter((pool) => 
            chainName ? pool.chain.toUpperCase() === chainName.toUpperCase() : true
        );
        filteredPools.sort((a, b) => Number(a.apy) > Number(b.apy) ? -1 : 1);
        return filteredPools.slice(0, Math.min(filteredPools.length, limitNumber));
    },

    setPools: (pools: DefillamaPool[]) => set({ pools }),

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
            .sort((a: any, b: any) => b.tvl - a.tvl);

        set({ protocols, totalTvl, totalChange24h, categories, mcap });
    },

    setChainTVLs: (chainTVLs: DefillamaChainTVL[]) => set({ chainTVLs }),

    setDexVolume: (volume: DefillamaDexVolume) => set({ dexVolume: volume }),

    getDeFiStats: () => {
        const state = get();
        return {
            totalTvl: state.totalTvl,
            totalChange24h: state.totalChange24h,
            defiMarketCap: state.mcap,
            categories: state.categories,
            protocols: state.protocols.map(protocol => ({
                name: protocol.name,
                tvl: protocol.tvl,
                change24h: protocol.change_1d,
                category: protocol.slug,
                logo: protocol.logo,
            }))
        };
    },

    getChainTVL: () => {
        const state = get();
        return { chainTVLs: state.chainTVLs };
    },

    getDexVolume: () => {
        const state = get();
        return state.dexVolume;
    }
}));

export default useDefillamaStore;