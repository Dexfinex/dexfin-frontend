import { fearGreedApi } from "./api.service.ts";

export interface FearGreedData {
	value: number;
	valueClassification: string;
	timestamp: string;
	previousClose: number;
}

export const fearGreedService = {
	getFearGreedIndex: async (): Promise<FearGreedData> => {
		try {
			const { data } = await fearGreedApi.get<{ "value": 65, "valueClassification": "Greed", "timestamp": "1644237600", "previousClose": 62 }>('');

			return data;
		} catch (error) {
			console.error('Failed to fetch fear & greed:', error);
			throw error;
		}
	},
}