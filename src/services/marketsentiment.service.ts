import { marketSentimentApi } from "./api.service.ts";

export interface MarketSentimentData {
	value: number;
	valueClassification: string;
	timestamp: string;
	previousClose: number;
	dailyChange: number;
	formattedTime: string;
}

export const marketSentimentService = {
	getMarketSentimentIndex: async (): Promise<MarketSentimentData> => {
		try {
			const { data } = await marketSentimentApi.get<MarketSentimentData>('');

			return data;
		} catch (error) {
			console.error('Failed to fetch fear & greed:', error);
			throw error;
		}
	},
}