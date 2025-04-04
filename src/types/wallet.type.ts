export enum WalletTypeEnum {
  EOA = 'EOA',
  EMBEDDED = 'EMBEDDED',
  UNKNOWN = 'UNKNOWN'
}

export interface TokenMetadata {
  address: string;
  name: string;
  symbol: string;
  decimals: string;
  logo: string;
  thumbnail: string;
}

export interface Transfer {
  transactionType: string;
  transferAmount: number;
  fromAddress: string;
  toAddress: string;
  tokenSymbol: string;
  value: string;
  valueDecimal: number;
  time: string;
  txHash: string;
}

// Transaction types
export enum TransactionType {
  Sent = "Sent",
  Received = "Received",
  SWAP = "SWAP",
  NFT_PURCHASE = "NFT_PURCHASE",
  NFT_SALE = "NFT_SALE",
  STAKE = "STAKE",
  UNSTAKE = "UNSTAKE",
  LEND = "LEND",
  BORROW = "BORROW",
  REPAY = "REPAY",
  CLAIM = "CLAIM",
}

export interface Token {
  symbol: string;
  logo: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  timestamp: Date;
  token?: Token;
  fromToken?: Token;
  toToken?: Token;
  amount: number;
  fromAmount?: number;
  toAmount?: number;
  value?: number;
  to?: string;
  from?: string;
  collection?: string;
  tokenId?: string;
  protocol?: string;
  protocolLogo?: string;
  status: "confirmed" | "pending" | "failed";
  hash: string;
  fee: number;
}

// DeFi position types
export type DeFiPositionType =
  | "LENDING"
  | "BORROWING"
  | "STAKING"
  | "LIQUIDITY";

export interface DeFiReward {
  token: string;
  amount: number;
  value: number;
}

export interface DeFiPosition {
  id: string;
  protocol: string;
  address: string;
  type: DeFiPositionType;
  token: Token;
  amount: number;
  value: number;
  apy: number;
  protocolLogo: string;
  rewards?: DeFiReward;
  startDate: Date;
  healthFactor?: number;
  collateralRatio?: number;
}

// DeFi statistics
export interface DeFiStats {
  totalValueLocked: number;
  totalBorrowed: number;
  netWorth: number;
  dailyYield: number;
  averageApy: number;
  riskLevel: "Low" | "Medium" | "High";
  distribution: {
    lending: number;
    borrowing: number;
    staking: number;
    liquidity: number;
  };
  topPerforming: {
    protocol: string;
    apy: number;
  };
  rewardsEarned: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}


export interface AllocationData {
  type: string
  percentage: number
  color: string
}