// File: src/types/alert.types.ts
import React from 'react';
import {
    DollarSign, LineChart, BarChart2, Users,
    Wallet, TrendingUp, Ship
} from 'lucide-react';

// Alert interface
export interface Alert {
    id: string;
    name: string;
    type: string;
    condition: 'above' | 'below';
    value: string;
    createdAt: string;
    lastTriggered: string | null;
    isActive: boolean;
    config?: Record<string, any>;
    userId?: string;
    isRead?: boolean;
}

// Create Alert DTO
export interface CreateAlertDto {
    name: string;
    type: string;
    condition: 'above' | 'below';
    value: string;
    config: Record<string, any>;
    isActive?: boolean;
}

// Update Alert DTO
export interface UpdateAlertDto {
    name?: string;
    type?: string;
    condition?: 'above' | 'below';
    value?: string;
    config?: Record<string, any>;
    isActive?: boolean;
}

// Alert Type Configuration interface
export interface AlertTypeConfig {
    id: string;
    label: string;
    icon: React.ElementType;
    color: string;
    description: string;
    valueLabel: string;
    placeholder: string;
    customFields?: {
        name: string;
        label: string;
        type: 'text' | 'number' | 'select';
        placeholder?: string;
        options?: { value: string; label: string; }[];
    }[];
}

// Alert types configuration
export const alertTypes: AlertTypeConfig[] = [
    {
        id: 'price',
        label: 'Price Alert',
        icon: DollarSign,
        color: 'bg-blue-500/20 text-blue-400',
        description: 'Get notified when token price hits your target',
        valueLabel: 'Price',
        placeholder: 'Enter price in USD',
        customFields: [
            {
                name: 'token',
                label: 'Token',
                type: 'select',
                placeholder: 'Select token',
                options: [
                    { value: 'BTC', label: 'Bitcoin (BTC)' },
                    { value: 'ETH', label: 'Ethereum (ETH)' },
                    { value: 'SOL', label: 'Solana (SOL)' }
                ]
            },
            {
                name: 'timeframe',
                label: 'Time Frame',
                type: 'select',
                options: [
                    { value: '1h', label: '1 Hour' },
                    { value: '24h', label: '24 Hours' },
                    { value: '7d', label: '7 Days' }
                ]
            }
        ]
    },
    {
        id: 'volume',
        label: 'Volume Alert',
        icon: LineChart,
        color: 'bg-purple-500/20 text-purple-400',
        description: 'Track significant volume changes',
        valueLabel: 'Volume',
        placeholder: 'Enter volume in USD',
        customFields: [
            {
                name: 'token',
                label: 'Token',
                type: 'select',
                placeholder: 'Select token',
                options: [
                    { value: 'BTC', label: 'Bitcoin (BTC)' },
                    { value: 'ETH', label: 'Ethereum (ETH)' },
                    { value: 'SOL', label: 'Solana (SOL)' }
                ]
            },
            {
                name: 'percentageChange',
                label: 'Percentage Change',
                type: 'number',
                placeholder: 'Enter % change'
            }
        ]
    },
    {
        id: 'tvl',
        label: 'TVL Alert',
        icon: Wallet,
        color: 'bg-green-500/20 text-green-400',
        description: 'Monitor Total Value Locked changes',
        valueLabel: 'TVL',
        placeholder: 'Enter TVL in USD',
        customFields: [
            {
                name: 'protocol',
                label: 'Protocol',
                type: 'select',
                placeholder: 'Select protocol',
                options: [
                    { value: 'aave-v3', label: 'Aave' },
                    { value: 'uniswap-v3', label: 'Uniswap' },
                    { value: 'curve-dex', label: 'Curve Dex' },
                    { value: 'lido', label: 'Lido' }
                ]
            },
        ]
    },
    {
        id: 'marketcap',
        label: 'Market Cap Alert',
        icon: BarChart2,
        color: 'bg-orange-500/20 text-orange-400',
        description: 'Monitor market capitalization changes',
        valueLabel: 'Market Cap',
        placeholder: 'Enter market cap in USD',
        customFields: [
            {
                name: 'token',
                label: 'Token',
                type: 'select',
                placeholder: 'Select token',
                options: [
                    { value: 'BTC', label: 'Bitcoin (BTC)' },
                    { value: 'ETH', label: 'Ethereum (ETH)' },
                    { value: 'SOL', label: 'Solana (SOL)' }
                ]
            },
            {
                name: 'timeWindow',
                label: 'Time Window',
                type: 'select',
                options: [
                    { value: '1h', label: '1 Hour' },
                    { value: '24h', label: '24 Hours' },
                    { value: '7d', label: '7 Days' }
                ]
            }
        ]
    },
    {
        id: 'social',
        label: 'Social Alert',
        icon: Users,
        color: 'bg-pink-500/20 text-pink-400',
        description: 'Track social media mentions and sentiment',
        valueLabel: 'Mentions',
        placeholder: 'Enter number of mentions',
        customFields: [
            {
                name: 'platform',
                label: 'Platform',
                type: 'select',
                options: [
                    { value: 'twitter', label: 'Twitter' },
                    { value: 'reddit', label: 'Reddit' },
                    { value: 'telegram', label: 'Telegram' }
                ]
            },
            {
                name: 'sentiment',
                label: 'Sentiment',
                type: 'select',
                options: [
                    { value: 'any', label: 'Any' },
                    { value: 'positive', label: 'Positive' },
                    { value: 'negative', label: 'Negative' }
                ]
            },
            {
                name: 'keywords',
                label: 'Keywords',
                type: 'text',
                placeholder: 'Enter keywords (comma separated)'
            }
        ]
    },
    {
        id: 'trend',
        label: 'Trend Alert',
        icon: TrendingUp,
        color: 'bg-yellow-500/20 text-yellow-400',
        description: 'Get notified when tokens start trending',
        valueLabel: 'Rank',
        placeholder: 'Enter trending rank',
        customFields: [
            {
                name: 'platform',
                label: 'Platform',
                type: 'select',
                options: [
                    { value: 'coingecko', label: 'CoinGecko' },
                    { value: 'dextools', label: 'DexTools' },
                    { value: 'dexscreener', label: 'DexScreener' }
                ]
            },
            {
                name: 'minMarketCap',
                label: 'Minimum Market Cap',
                type: 'number',
                placeholder: 'Enter min market cap in USD'
            }
        ]
    },
    {
        id: 'whale',
        label: 'Whale Alert',
        icon: Ship,
        color: 'bg-cyan-500/20 text-cyan-400',
        description: 'Track large token transfers',
        valueLabel: 'Amount',
        placeholder: 'Enter amount in tokens',
        customFields: [
            {
                name: 'token',
                label: 'Token',
                type: 'select',
                placeholder: 'Select token',
                options: [
                    { value: 'BTC', label: 'Bitcoin (BTC)' },
                    { value: 'ETH', label: 'Ethereum (ETH)' },
                    { value: 'SOL', label: 'Solana (SOL)' }
                ]
            },
            {
                name: 'transferType',
                label: 'Transfer Type',
                type: 'select',
                options: [
                    { value: 'all', label: 'All Transfers' },
                    { value: 'exchange_inflow', label: 'Exchange Inflow' },
                    { value: 'exchange_outflow', label: 'Exchange Outflow' }
                ]
            },
            {
                name: 'trackWallet',
                label: 'Track Specific Wallet',
                type: 'text',
                placeholder: 'Enter wallet address (optional)'
            }
        ]
    }
];

// Alert status types
export enum AlertStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    TRIGGERED = 'triggered'
}

// Alert condition types
export type AlertCondition = 'above' | 'below';

// Alert Type IDs for type safety
export type AlertTypeId =
    | 'price'
    | 'volume'
    | 'tvl'
    | 'social'
    | 'marketcap'
    | 'trend'
    | 'whale';