import { fearGreedApi } from "./api.service.ts";

import { FearGreedData } from "../lib/fearGreed.ts";

export const feargeedService = {
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