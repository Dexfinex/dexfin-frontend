export interface EvmWalletBalanceRequestType {
  chainId: number;
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
  account_data: {
    net_apy: string;
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