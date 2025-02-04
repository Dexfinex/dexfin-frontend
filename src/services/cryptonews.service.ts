import {cryptoNewsApi} from "./api.service.ts";
import { NewsItem } from '../types';

export const cryptonewsService = {
    getLatestNews: async () => {
        try {
            const {data} = await cryptoNewsApi.get<NewsItem[]>('/latest');
            return data.map((item: any) => ({
                title: item.title,
                source: item.source,
                time: item.time,
                impact: item.impact,
                link: item.link
              }));
        } catch (error) {
            console.error('Failed to fetch news:', error);
            throw error;
        }
    },
    
}