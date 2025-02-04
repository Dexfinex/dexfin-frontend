import {cryptoNewsApi} from "./api.service.ts";
import { NewsItem } from '../types';

function formatRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp * 1000;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'just now';
}

function determineImpact(title: string): 'HIGH' | 'MEDIUM' | 'LOW' {
    const highImpactWords = ['surge', 'crash', 'breakout', 'collapse', 'soar', 'plunge', 'record', 'ban', 'hack'];
    const mediumImpactWords = ['rise', 'fall', 'gain', 'drop', 'launch', 'update', 'partnership'];
    
    const titleLower = title.toLowerCase();
    
    if (highImpactWords.some(word => titleLower.includes(word))) {
      return 'HIGH';
    }
    
    if (mediumImpactWords.some(word => titleLower.includes(word))) {
      return 'MEDIUM';
    }
    
    return 'LOW';
}

export const cryptonewsService = {
    getLatestNews: async () => {
        try {
            const {data} = await cryptoNewsApi.get<NewsItem[]>('/latest');
            console.log(data);
            return data.map((item: any) => ({
                title: item.title || 'Untitled',
                source: item.source || 'Unknown Source',
                time: formatRelativeTime(item.date),
                impact: determineImpact(item.title),
                link: item.news_url || '#'
              }));
        } catch (error) {
            console.error('Failed to fetch news:', error);
            throw error;
        }
    },
    
}