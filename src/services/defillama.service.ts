import { defillamaApi } from "./api.service.ts";
import { DefillamaPool, DefillamaProtocol, DefillamaChainTVL, DefillamaDexVolume } from "../types/index.ts";

export const defillamaService = {
	getProtocols: async (): Promise<DefillamaProtocol[]> => {
		try {
			const { data } = await defillamaApi.get<DefillamaProtocol[]>(`pro/protocols`);
			return data;
		} catch (error) {
			console.error('Failed to fetch defillama protocols:', error);
			throw error;
		}
	},

	getPools: async ({ chain }: { chain: string }): Promise<DefillamaPool[]> => {
		try {
			const { data } = await defillamaApi.get<DefillamaPool[]>(`/yields/pools?chain=${chain}`);
			return data;
		} catch (error) {
			console.error('Failed to fetch defillama pools:', error);
			throw error;
		}
	},
	getChainTVL: async (): Promise<DefillamaChainTVL[]> => {
		try {
			const { data } = await defillamaApi.get<DefillamaChainTVL[]>(`/chains`);
			// console.log("chainsdata : ", data);
			return data;
		} catch (error) {
			console.error('Failed to fetch defillama pools:', error);
			throw error;
		}
	},
	getDexVolume: async (): Promise<DefillamaDexVolume> => {
		try {
			const { data } = await defillamaApi.get<DefillamaDexVolume>('/volum');
			console.log("DEX volume dataservice:", data);
			return data;
		} catch (error) {
			console.error('Failed to fetch DEX volume:', error);
			throw error;
		}
	}
}