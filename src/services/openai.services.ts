import { openaiApi } from "./api.service.ts";

export const openaiService = {
	getOpenAIAnalyticsData: async (command: string): Promise<any> => {
		try {
			const { data } = await openaiApi.get<any>(`?command=${command}`);
			return data;
		} catch (error) {
			console.error('Failed to fetch OpenAI Analytics data:', error);
			throw error;
		}
	},
	getOpenAISolanaData: async (command: string): Promise<any> => {
		try {
			const { data } = await openaiApi.get<any>(`/solana?command=${command}`);
			return data;
		} catch (error) {
			console.error('Failed to fetch OpenAI Solana data:', error);
			throw error;
		}
	},
}