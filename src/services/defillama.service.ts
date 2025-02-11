import { defillamaApi } from "./api.service.ts";
import { DefillamaPool, DefillamaProtocol } from "../types/index.ts";

export const defillamaService = {
	getProtocols: async (): Promise<DefillamaProtocol[]> => {
		try {
			const { data } = await defillamaApi.get<DefillamaProtocol[]>(`/protocols`);
			return data;
		} catch (error) {
			console.error('Failed to fetch defillama protocols:', error);
			throw error;
		}
	},

	getPools: async (): Promise<DefillamaPool[]> => {
		try {
			const { data } = await defillamaApi.get<DefillamaPool[]>(`/yields/pools`);
			return data;
		} catch (error) {
			console.error('Failed to fetch defillama pools:', error);
			throw error;
		}
	}
}