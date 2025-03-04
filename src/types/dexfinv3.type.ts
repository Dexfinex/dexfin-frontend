export interface EvmWalletBalanceRequestType {
  chainId: number;
  address: string;
}

export type NetworkType = {
  id: string,
  name: string,
  icon: string,
  chainId: string
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
  network: NetworkType;
  tokenId: string;
}

export type SolanaNativeCoinType = {
  amount: string,
  decimals: number,
  lamports: string,
  logo: string,
  mint: string,
  name: string,
  solana: string,
  symbol: string,
  thumbnail: string,
  usdPrice: number
  usdValue: number
}

export type SolanaTokensType = {
  amount: string,
  amountRaw: string,
  associatedTokenAddress: string,
  decimals: number,
  logo: string,
  mint: string,
  name: string,
  symbol: string,
  usdPrice: number,
  usdValue: number,
}

export interface SolanaWalletReponseType {
  native: SolanaNativeCoinType,
  token: Array<SolanaTokensType>
}

export interface EvmToken {
  token_type: string;
  name: string;
  symbol: string;
  contract_address: string;
  decimals: string;
  logo: string;
  thumbnail: string;
  balance: string;
  balance_formatted: string;
  usd_price: number;
  usd_value: number;
}

export interface EvmDefiPosition {
  protocol_name: string;
  protocol_id: string;
  protocol_url: string;
  protocol_logo: string;
  account_data?: {
    net_apy: number;
    health_factor: number;
  },
  total_projected_earnings_usd: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  },
  position: {
    label: string;
    tokens: EvmToken[],
    address: string;
    balance_usd: number;
    total_unclaimed_usd_value: number | null;
    position_details: {
      market: string;
      is_debt: boolean;
      is_variable_debt: boolean;
      is_stable_debt: boolean;
      apy: number;
      factory: string;
      projected_earnings_usd: {
        daily: number;
        weekly: number;
        monthly: number;
        yearly: number;
      },
      is_enabled_as_collateral: boolean;
    }
  }
}

export interface EvmProtocol {
  protocol_name: string;
  protocol_id: string;
  protocol_url: string;
  protocol_logo: string;
  account_data?: {
    net_apy: number;
    health_faction: number;
  },
  total_usd_value: 2.6056262968836006e-15,
  total_unclaimed_usd_value: null,
  total_projected_earnings_usd: {
    daily: null,
    weekly: null,
    monthly: null,
    yearly: null
  },
  positions: 1
}
export interface EvmDefiProtocol {
  active_protocols: number;
  total_positions: number;
  total_usd_value: number;
  total_unclaimed_usd_value: number;
  protocols: EvmProtocol[];
}