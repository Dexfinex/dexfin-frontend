import { fearGreedApi } from "./api.service.ts";

export interface FearGreedData {
	value: number;
	valueClassification: string;
	timestamp: string;
	previousClose: number;
	dailyChange: number;
	formattedTime: string;
}

export const fearGreedService = {
	getFearGreedIndex: async (): Promise<FearGreedData> => {
		try {
			const { data } = await fearGreedApi.get<FearGreedData>('');

			return data;
		} catch (error) {
			console.error('Failed to fetch fear & greed:', error);
			throw error;
		}
	},
}