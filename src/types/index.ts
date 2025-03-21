import { BrianCoinData } from "./brian.type";

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
  tip?: string;
  priceData?: BrianCoinData;
  technicalAnalysis?: TechnicalAnalysisData;
  sentimentAnalysis?: SentimentAnalysisData;
  predictionAnalysis?: PredictionAnalysisData;
  marketOverview?: MarketOverviewData;
  trending?: AnalysisTrendingCoin[];
  losers?: AnalysisLoser[];
  gainers?: AnalysisGainer[];
  news?: NewsItem[];
  link?: string;
}

export interface AnalysisLoser {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  marketCapRank: number;
  priceUsd: number;
  usd24hChange: number;
  usd24hVol: number;
  analysis: string;
}

export interface AnalysisGainer {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  marketCapRank: number;
  priceUsd: number;
  usd24hChange: number;
  usd24hVol: number;
  analysis: string;
}

export interface AnalysisTrendingCoin {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  marketCapRank: number;
  priceUsd: number;
  volume: number;
  analysis: string;
}

export interface MarketOverviewData {
  market: {
    total_market_cap: number;
    total_volume: number;
    btc_dominance: number;
    total_value_locked: number;
    market_cap_change_percentage_24h: number;
  }
  fear: {
    value: number;
    previous_value: number;
    previous_week_value: number;
  }
}

export interface PredictionAnalysisData {
  predictions: {
    price_24h: number;
    confidence_24h: number;
    price_7d: number;
    confidence_7d: number;
  };
  signals: {
    moving_averages: number;
    moving_averages_direction: 'up' | 'down';
    rsi: number;
    rsi_direction: 'up' | 'down';
    macd: number;
    macd_direction: 'up' | 'down';
  };
  current_price: number;
  price_change_percentage_24h: number;
  price_history: number[];
}

export interface SentimentAnalysisData {
  social_sentiment: number;
  trading_sentiment: number;
  technical_sentiment: number;
  current_price: number;
  price_change_percentage_24h: number;
  price_history: any[];
  volume_24h: number;
  market_cap: number;
  name: string;
}

export interface TechnicalAnalysisData {
  analysis: {
    technicalIndicators: {
      rsi: {
        value: number;
        signal: string;
      };
      macd: {
        value: number;
        signal: string;
        histogram?: number;
        signalLine?: number;
      };
      stochasticRsi: {
        value: number;
        signal: string;
      };
      bollingerBands: {
        value: number;
        signal: string;
        upperBand?: number;
        lowerBand?: number;
      };
    };
  }
  moving_averages: {
    price: number;
    priceChange: number;
    priceChangePercent: number;
    movingAverages: {
      ma20: number;
      ma40: number;
      ma60: number;
      ma80: number;
    };
    chartData: {
      time: number;
      price: number;
      ma20?: number;
      ma50?: number;
      ma100?: number;
      ma200?: number;
    }[];
  }
  signals: {
    signals: {
      buySignals: number;
      sellSignals: number;
      neutralSignals: number;
      recommendation: string;
    };
    indicators: {
      name: string;
      value: number;
      signal: string;
    }[];
  }
  summary: {
    shortTerm: string;
    mediumTerm: string;
    overallTrend: string;
  }
}

export interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  marketCapRank: number;
  priceUsd: number;
  volume: number;
  priceChaingePercentage24hUsd: number;
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

export interface PlatformAddresses {
  'arbitrum-one'?: string;
  'avalanche'?: string;
  'binance-smart-chain'?: string;
  'ethereum'?: string;
  'fantom'?: string;
  'harmony-shard-0'?: string;
  'huobi-token'?: string;
  'milkomeda-cardano'?: string;
  'near-protocol'?: string;
  'optimistic-ethereum'?: string;
  'osmosis'?: string;
  'polygon-pos'?: string;
  'sora'?: string;
  'xdai'?: string;
  [key: string]: string | undefined;
}

export interface CoinGeckoToken {
  category: string;
  chainId: number;
  decimals: number;
  id: string;
  logoURI: string;
  marketCap: number;
  marketCapRank: number;
  name: string;
  platforms: PlatformAddresses;
  price: number;
  priceChange24h: number;
  sparkline: number[];
  symbol: string;
  volume24h: number;
}
export interface CoinGeckoNativeToken {
  tokenPrice: string,
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

export interface TokenPool {
  id: string;
  type: string;
  attributes: {
    name: string;
    pool_created_at: string;
    price_change_percentage: {
      h24?: string;
      h1?: string;
      h6?: string;
      m5?: string;
    };
    base_token_price_usd?: string;
    transactions?: {
      h24?: string;
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

export interface TransactionError extends Error {
  code?: string;
}
export interface BrianTransactionData {
  message: string;
  type: string;
  data: {};
}

export interface Network {
  id: string;
  name: string;
  logo: string;
}

export interface DefillamaProtocol {
  name: string;
  slug: string;
  address: string | null;
  symbol: string;
  logo: string;
  tvl: number;
  change_1h: number;
  change_1d: number;
  change_7d: number;
  tokenBreakdowns: Object;
  mcap?: number;
  category: string;
  dailyUsers: number;
  weeklyRevenue: number;
}

export interface DefillamaPool {
  protocol: string;
  symbol: string;
  chain: string;
  apy: number;
  tvlUsd: number;
  logo: string[];
  underlyingTokens: string[];
}
export interface DefillamaCategory {
  name: string;
  tvl: number;
  change24h: number;
}
export interface DefillamaChainTVL {
  gecko_id: string;
  tvl: string;
  tokenSymbol: string;
  cmcId: string;
  name: string;
  chainId: number;
}
export interface DefillamaDexVolume {
  total24h: number;
  totalDataChart?: any[];
  change_1d: number;
  allChains?: any[];
  protocols?: any[];
}


export interface BrianKnowledgeData {
  message: string;
}

export interface Ganiner {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  marketCapRank: number;
  priceUsd: number;
  usd24hChange: number;
  usd24hVol: number;
}
export interface Loser {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  marketCapRank: number;
  priceUsd: number;
  usd24hChange: number;
  usd24hVol: number;
}

export interface TwitterInfo {
  name: string;
  username: string;
  content: string;
  timestamp: string;
  data: {};
  legacy: {};
  last_seen: {
    timestamp: string;
  }
  profile_image_url: string;
}

export interface SignificantTransactions {
  from_address: string;
  to_address: string;
  amount: number;
  timestamp: string;
  transaction_type: string;
  blockchain: string;
  hash: string;
  data: {}
}