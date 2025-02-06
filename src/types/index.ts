// Add missing types
export interface CoinData {
  id: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  chartData: {
    timestamp: number;
    price: number;
  }[];
}

export interface SearchResult {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
}

export interface Message {
  role: string;
  content: string;
  data?: CoinData;
  trending?: TrendingCoin[];
  news?: NewsItem[];
}

export interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  marketCapRank: number;
  priceUsd: number;
  volume: number;
}

export interface MarketToken {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  sparkline: number[];
}

export interface NewsItem {
  title: string;
  source: string;
  time: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  link: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
    tension: number;
  }[];
}

export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend: {
      display: boolean;
    };
    tooltip?: {
      mode: 'index';
      intersect: boolean;
    };
  };
  scales: {
    x: {
      grid: {
        display?: boolean;
        color?: string;
      };
      ticks: {
        color: string;
        maxRotation?: number;
        autoSkip?: boolean;
        maxTicksLimit?: number;
      };
    };
    y: {
      grid: {
        color: string;
      };
      ticks: {
        color: string;
        callback?: (value: number) => string;
      };
    };
  };
}

export interface CoinGeckoToken {
  name: string,
  address: string,
  chainId: number,
  decimals: number,
  logoURI: string,
  price: number,
  priceChange24h: number,
  marketCap: number,
  marketCapRank: number,
  volume24h: number,
  sparkline: number[];
  category: string;
}

export interface DeFiStats {
  totalTvl: number;
  totalChange24h: number;
  defiMarketCap: number;
  categories: {
    name: string;
    tvl: number;
    change24h: number;
  }[];
  protocols: {
    name: string;
    tvl: number;
    change24h: number;
    category: string;
    logo: string;
  }[];
}

export interface YieldData {
  protocol: string;
  symbol: string;
  chain: string;
  apy: number;
  tvlUsd: number;
  logo: string;
}

export interface TokenPool {
    id: string;
    type: string;
    attributes: {
        name: string;
        pool_created_at: string;
        price_change_percentage: {
            h24?: string;
            h1?: string;
        };
        base_token_price_usd?: string;
        transactions?: {
            h24?: number;
        };
        volume_usd?: {
            h24?: string;
        };
        reserve_in_usd?: string;
        fdv_usd?: string;
    };
    relationships: {
        base_token: {
            data: {
                id: string;
            };
        };
        quote_token: {
            data: {
                id: string;
            };
        };
    };
    included?: {
        tokens: Token[];
        dexes?: any[];
        networks?: any[];
    };
}

export interface Token {
  id: string;
  type: string;
  attributes: {
      name: string;
      symbol: string;
      logo_url?: string;
  };
}

