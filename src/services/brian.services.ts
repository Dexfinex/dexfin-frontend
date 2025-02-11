import { brianApi } from "./api.service.ts";

import { BrianData } from '../types/index.ts';

export const brianService = {
	getBrianTransactionData: async (command: string, address: string, chainId: number | undefined): Promise<BrianData> => {
		try {
			const { data } = await brianApi.get<BrianData>(`transaction?command=${command}&address=${address}&chainId=${chainId}`);
			return data;
		} catch (error) {
			console.error('Failed to fetch fear & greed:', error);
			throw error;
		}
	},
	getBrianKnowledgeData: async (command: string): Promise<BrianData> => {
		try {
			const { data } = await brianApi.get<BrianData>(`knowledge?command=${command}`);
			return data;
		} catch (error) {
			console.error('Failed to fetch fear & greed:', error);
			throw error;
		}
	},
}