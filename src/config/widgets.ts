import {
  Wallet,
  Newspaper,
  LineChart,
  Bot,
  TrendingUp,
  ArrowLeftRight,
  Coins,
  DollarSign,
} from 'lucide-react';

export const widgets = [
  { 
    id: 'portfolio', 
    name: 'Portfolio Overview', 
    icon: Wallet, 
    description: 'Display portfolio value and positions' 
  },
  { 
    id: 'market-news', 
    name: 'Market News', 
    icon: Newspaper, 
    description: 'Latest crypto news and updates' 
  },
  { 
    id: 'crypto-prices', 
    name: 'Price Widget', 
    icon: LineChart, 
    description: 'Live cryptocurrency price charts' 
  },
  { 
    id: 'fear-greed', 
    name: 'Fear & Greed Index', 
    icon: TrendingUp, 
    description: 'Market sentiment indicator' 
  },
  { 
    id: 'quick-swap', 
    name: 'Quick Swap', 
    icon: ArrowLeftRight, 
    description: 'Instant token swaps' 
  },
  { 
    id: 'price-converter', 
    name: 'Price Converter', 
    icon: DollarSign, 
    description: 'Convert between tokens and fiat' 
  },
  { 
    id: 'ask-anything', 
    name: 'Ask Anything', 
    icon: Bot, 
    description: 'AI-powered crypto assistant' 
  },
  {
    id: 'gas-tracker',
    name: 'Gas Tracker',
    icon: Coins,
    description: 'Real-time gas prices and estimates'
  }
];