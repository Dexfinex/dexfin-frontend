export type TokenType = {
  symbol: string;
  name: string;
  address: string;
  chainId: number;
  decimals: number;
  logoURI: string;
  priceUSD: number;
  coinKey: string;
};

export type Protocol = {
  key: string;
  logoURI: string;
  name: string;
}

export type Step = {
  blockNumber: number;
  chainId: number;
  data: string;
  from: string;
  gasLimit: string;
  to: string;
  value: string;
}

export interface BrianCoinData {
  id: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  symbol: string;
  logoURI: string;
  name: string;
  chartData: {
    timestamp: number;
    price: number;
  }[];
  analysis: string;
}