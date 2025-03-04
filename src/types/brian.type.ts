import { string } from "zod";

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

export type Yield = {
  protocol: string;
  protocolSlug: string;
  token: {
    chainId: number;
    address: string;
    decimals: number;
    name: string;
    symbol: string;
    logosUri: string[],
    type: string;
    protocolSlug: string;
    underlyingTokens: [
      {
        address: string;
        chainId: number;
        type: string;
        decimals: number;
        name: string;
        symbol: string;
        logosUri: string[];
      }
    ],
    primaryAddress: string;
    apy: number;
    tvl: number;
  }
  logoURI: string;
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