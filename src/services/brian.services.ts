import { brianApi } from "./api.service.ts";

import { BrianTransactionData, BrianKnowledgeData } from '../types/index.ts';

export const brianService = {
	getBrianTransactionData: async (command: string, address: string, chainId: number | undefined): Promise<BrianTransactionData> => {
		try {
			const { data } = await brianApi.get<BrianTransactionData>(`transaction?command=${command}&address=${address}&chainId=${chainId}`);
			return data;
		} catch (error) {
			console.error('Failed to fetch fear & greed:', error);
			throw error;
		}
	},
	getBrianKnowledgeData: async (command: string): Promise<BrianKnowledgeData> => {
		try {
			const { data } = await brianApi.get<BrianKnowledgeData>(`knowledge?command=${command}`);
			return data;
		} catch (error) {
			console.error('Failed to fetch fear & greed:', error);
			throw error;
		}
	},
}