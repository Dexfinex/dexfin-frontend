// Mock data for wallet transactions and DeFi positions
import { TransactionType, Transaction, DeFiPosition, DeFiStats } from '../types/wallet';

// Transaction mock data
export const mockTransactions: Transaction[] = [
  {
    id: '0x742d...f44e',
    type: TransactionType.SEND,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    token: {
      symbol: 'ETH',
      logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    },
    amount: -1.5,
    value: 4868.51,
    to: 'vitalik.eth',
    status: 'confirmed',
    hash: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    fee: 2.15
  },
  {
    id: '0x8Ba7...FF29',
    type: TransactionType.NFT_PURCHASE,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    token: {
      symbol: 'ETH',
      logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    },
    amount: -2.5,
    value: 8114.18,
    collection: 'Bored Ape Yacht Club',
    tokenId: '#8817',
    status: 'confirmed',
    hash: '0x8Ba7935Ce2F38FF29E3C1417A4b33F5A67F74329',
    fee: 3.25
  },
  {
    id: '0x3B4...a5d0',
    type: TransactionType.SWAP,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    fromToken: {
      symbol: 'ETH',
      logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    },
    toToken: {
      symbol: 'USDC',
      logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
    },
    amount: 0,
    fromAmount: -5,
    toAmount: 16228.35,
    status: 'confirmed',
    hash: '0x3B4d92F5C5B5a5d0E8F8F8F8F8F8F8F8F8F8F8F8',
    fee: 4.50
  }
];

// DeFi positions mock data - Adjusted to match total of $15,650.32
export const mockDeFiPositions: DeFiPosition[] = [
  // Layer 1s
  {
    id: 'eth-holding',
    protocol: 'Ethereum',
    type: 'STAKING',
    token: {
      symbol: 'ETH',
      logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    },
    amount: 2.5,
    value: 8125.50,
    apy: 3.8,
    protocolLogo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 90 days ago
  },
  {
    id: 'sol-holding',
    protocol: 'Solana',
    type: 'STAKING',
    token: {
      symbol: 'SOL',
      logo: 'https://cryptologos.cc/logos/solana-sol-logo.png'
    },
    amount: 25,
    value: 2762.50,
    apy: 5.2,
    protocolLogo: 'https://cryptologos.cc/logos/solana-sol-logo.png',
    startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000) // 45 days ago
  },

  // Stablecoins
  {
    id: 'usdc-lending',
    protocol: 'Aave V3',
    type: 'LENDING',
    token: {
      symbol: 'USDC',
      logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
    },
    amount: 3000,
    value: 3000,
    apy: 4.12,
    protocolLogo: 'https://cryptologos.cc/logos/aave-aave-logo.png',
    rewards: {
      token: 'AAVE',
      amount: 0.5,
      value: 50
    },
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    healthFactor: 1.8
  },
  {
    id: 'usdt-holding',
    protocol: 'Tether',
    type: 'STAKING',
    token: {
      symbol: 'USDT',
      logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
    },
    amount: 1762.32,
    value: 1762.32,
    apy: 0,
    protocolLogo: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
    startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
  }
];

// DeFi stats mock data
export const mockDeFiStats: DeFiStats = {
  totalValueLocked: 15650.32, // Matches portfolio widget
  totalBorrowed: 0,
  netWorth: 15650.32, // Matches portfolio widget
  dailyYield: 18.85,
  averageApy: 4.8,
  riskLevel: 'Medium',
  distribution: {
    lending: 35,
    borrowing: 15,
    staking: 30,
    liquidity: 20
  },
  topPerforming: {
    protocol: 'Uniswap',
    apy: 8.5
  },
  rewardsEarned: {
    daily: 45.80,
    weekly: 320.60,
    monthly: 1250.25
  }
};

// Helper functions
export const formatTransactionAmount = (amount: number, symbol: string): string => {
  const absAmount = Math.abs(amount);
  return `${amount > 0 ? '+' : '-'}${absAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  })} ${symbol}`;
};

export const formatUsdValue = (value: number): string => {
  return `$${Math.abs(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export const formatApy = (apy: number): string => {
  return `${apy.toFixed(2)}%`;
};

export const getHealthFactorColor = (healthFactor: number): string => {
  if (healthFactor >= 1.5) return 'text-green-400';
  if (healthFactor >= 1.1) return 'text-yellow-400';
  return 'text-red-400';
};

export const getTransactionStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'text-green-400';
    case 'pending':
      return 'text-yellow-400';
    case 'failed':
      return 'text-red-400';
    default:
      return 'text-white/60';
  }
};