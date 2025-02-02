import { NewsItem } from '../types';

const CRYPTONEWS_API_KEY = 'ele4yjtlyhnwepwgiqwnggau0faimhbyhxfvn97p';
const BASE_URL = 'https://cryptonews-api.com/api/v1';

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

const fetchWithRetry = async (url: string, options: RequestInit = {}, retries = 3) => {
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorText = await response.text();
        
        if (response.status === 429) {
          const retryAfter = response.headers.get('retry-after');
          await new Promise(resolve => setTimeout(resolve, (parseInt(retryAfter || '60') * 1000)));
          continue;
        }

        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      lastError = error;
      
      if (error instanceof Error && error.message.includes('status: 4') && !error.message.includes('status: 429')) {
        throw error;
      }

      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }

  throw lastError;
};

export async function getLatestNews(): Promise<NewsItem[]> {
  try {
    const response = await fetchWithRetry(
      `${BASE_URL}/category?section=alltickers&items=10&page=1&token=${CRYPTONEWS_API_KEY}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid response format from news API');
    }

    return response.data.map((item: any) => ({
      title: item.title || 'Untitled',
      source: item.source_name || 'Unknown Source',
      time: formatRelativeTime(item.date),
      impact: determineImpact(item.title),
      link: item.news_url || '#'
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}