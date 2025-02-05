export interface EvmWalletBalanceRequestType {
  chainId: string;
  address: string;
}

export interface EvmWalletBalanceResponseType {
  tokenAddress: `0x${string}`;
  symbol: string;
  name: string;
  logo: string;
  thumbnail: string;
  decimals: number;
  balance: string;
  balanceDecimal: number;
  usdPrice: number;
  usdValue: number;
  chain: string;
}
