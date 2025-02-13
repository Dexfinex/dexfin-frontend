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

export type Step = {
  blockNumber: number;
  chainId: number;
  data: string;
  from: string;
  gasLimit: string;
  to: string;
  value: string;
}
