import { cryptoNewsApi } from "./api.service.ts";
import { NewsItem } from '../types';

export const cryptoNewsService = {
	getLatestNews: async () => {
		try {
			const { data } = await cryptoNewsApi.get<NewsItem[]>('/latest');
			return data;
		} catch (error) {
			console.error('Failed to fetch news:', error);
			throw error;
		}
	},
}