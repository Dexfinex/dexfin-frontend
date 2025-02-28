import { TokenPool } from "../types/index.ts";
import { geckoTerminalApi } from "./api.service.ts";

export const geckoterminalService = {
	getTrendingPools: async (network: string = 'eth'): Promise<TokenPool[]> => {
		try {
			const { data } = await geckoTerminalApi.get<TokenPool[]>(`/trending?network=${network}`);
			return data;
		} catch (error) {
			console.error('Error fetching trending pools:', {
				network,
				error: error instanceof Error ? {
					name: error.name,
					message: error.message,
					stack: error.stack
				} : error
			});
			throw error;
		}
	},

	getNewPools: async (network: string = 'eth'): Promise<TokenPool[]> => {
		try {
			const { data } = await geckoTerminalApi.get<TokenPool[]>(`/new?network=${network}`);
			return data;
		} catch (error) {
			console.error('Error fetching new pools:', error);
			throw error;
		}
	},

	getTopPools: async (network: string = 'eth'): Promise<TokenPool[]> => {
		try {
			const { data } = await geckoTerminalApi.get<TokenPool[]>(`/top?network=${network}`);
			return data;
		} catch (error) {
			console.error('Error fetching top pools:', error);
			throw error;
		}
	},
	
}