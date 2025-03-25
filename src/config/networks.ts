import {
    mainnet, bsc, polygon, fantom, avalanche,
    optimism, arbitrum, kcc, celo, iotex,
    moonriver, shiden, palm, songbird, hpb, fuse, elastos, fusion,
    aurora, ronin, boba, cronos, telos, metis, ubiq, velas,
    klaytn, nahmii, meter, theta, syscoin,
    moonbeam, astar, canto, zksync, kava,
    base, linea, Chain, sepolia
} from "viem/chains";
import { TokenType } from "../types/swap.type.ts";
import {SOLANA_CHAIN_ID} from "../constants/solana.constants.ts";
import {NULL_ADDRESS} from "../constants";

export interface NETWORK {
    id: string;
    name: string;
    icon: string;
    chainId: number;
    symbol: string;
}
export const NETWORKS: NETWORK[] = [
    {
        id: 'ethereum',
        name: 'Ethereum',
        icon: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/ethereum.svg',
        chainId: 1,
        symbol: 'ETH',
    },
    {
        id: 'base',
        name: 'Base',
        icon: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/base.svg',
        chainId: 8453,
        symbol: 'ETH',
    },
    {
        id: 'polygon',
        name: 'Polygon',
        icon: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/polygon.svg',
        chainId: 137,
        symbol: 'POL',
    },
    {
        id: 'bsc',
        name: 'BSC',
        icon: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/bsc.svg',
        chainId: 56,
        symbol: 'BNB',
    },
    {
        id: 'avalanche',
        name: 'Avalanche',
        icon: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/avalanche.svg',
        chainId: 43114,
        symbol: 'AVAX',
    },
    {
        id: 'optimism',
        name: 'Optimism',
        icon: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/optimism.svg',
        chainId: 10,
        symbol: 'ETH',
    },
    {
        id: 'arbitrum',
        name: 'Arbitrum',
        icon: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/arbitrum.svg',
        chainId: 42161,
        symbol: 'ETH',
    },
/*
    {
        id: 'bitcoin',
        name: 'Bitcoin',
        icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg',
        chainId: 0,
    },
*/
    {
        id: 'solana',
        name: 'Solana',
        icon: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/solana.svg',
        chainId: SOLANA_CHAIN_ID,
        symbol: 'SOL',
    },
] as const;

export const mapChainId2Network: Record<number, NETWORK> = {}
for(const network of NETWORKS) {
    mapChainId2Network[network.chainId] = network;
}

export const mapChainName2Network: Record<string, NETWORK> = {}
for(const network of NETWORKS) {
    mapChainName2Network[network.id] = network;
}

export const mapChainId2NativeAddress: Record<number, string> = {
    1: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // Ethereum Mainnet (ETH)
    56: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // Binance Smart Chain (BNB)
    137: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // Polygon Mainnet (MATIC)
    43114: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', // Avalanche C-Chain (AVAX)
    10: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // Optimism (ETH)
    42161: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // Arbitrum (ETH)
    8453: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // Base Mainnet (ETH placeholder)
    900: '11111111111111111111111111111111', // Solana
};

export const PRICE_MATIC_ADDRESS = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'
export const NATIVE_MATIC_ADDRESS = '0x0000000000000000000000000000000000001010'

export const mapChainId2ChainName: Record<number, string> = {
    1: 'Ethereum', // Ethereum Mainnet (ETH)
    56: 'BNB Chain', // Binance Smart Chain (BNB)
    137: 'Polygon', // Polygon Mainnet (MATIC)
    43114: 'Avalanche', // Avalanche C-Chain (AVAX)
    10: 'Optimism', // Optimism (ETH)
    42161: 'Arbitrum', // Arbitrum (ETH)
    8453: 'Base', // Base Mainnet (ETH placeholder)
};

export const mapChainId2ExplorerUrl: Record<number, string> = {
    1: 'https://etherscan.io', // Ethereum Mainnet Explorer
    56: 'https://bscscan.com', // Binance Smart Chain Explorer
    137: 'https://polygonscan.com', // Polygon Mainnet Explorer
    43114: 'https://snowtrace.io', // Avalanche C-Chain Explorer
    10: 'https://optimistic.etherscan.io', // Optimism Explorer
    42161: 'https://arbiscan.io', // Arbitrum Explorer
    8453: 'https://basescan.org', // Base Mainnet Explorer
    [SOLANA_CHAIN_ID]: 'https://solscan.io'
};

export const mapChainName2ExplorerUrl: Record<string, string> = {
    'ethereum': 'https://etherscan.io', // Ethereum Mainnet Explorer
    'bsc': 'https://bscscan.com', // Binance Smart Chain Explorer
    'polygon': 'https://polygonscan.com', // Polygon Mainnet Explorer
    'avalanche': 'https://snowtrace.io', // Avalanche C-Chain Explorer
    'optimism': 'https://optimistic.etherscan.io', // Optimism Explorer
    'arbitrum': 'https://arbiscan.io', // Arbitrum Explorer
    'base': 'https://basescan.org', // Base Mainnet Explorer
    'solana': 'https://solscan.io'
};

export const mapChainId2ProviderChainName: Record<number, string> = {
    1: 'ethereum',
    56: 'bsc',
    137: 'polygon',
    128: 'heco',
    250: 'fantom',
    30: 'rsk',
    88: 'tomochain',
    100: 'xdai',
    43114: 'avax',
    888: 'wan',
    1666600000: 'harmony',
    108: 'thundercore',
    66: 'okexchain',
    10: 'optimism',
    42161: 'arbitrum',
    321: 'kcc',
    42220: 'celo',
    4689: 'iotex',
    1285: 'moonriver',
    336: 'shiden',
    11297108109: 'palm',
    246: 'energyweb',
    39797: 'energi',
    19: 'songbird',
    269: 'hpb',
    60: 'gochain',
    61: 'ethereumclassic',
    200: 'xdaiarb',
    24: 'kardia',
    122: 'fuse',
    10000: 'smartbch',
    20: 'elastos',
    70: 'hoo',
    32659: 'fusion',
    1313161554: 'aurora',
    2020: 'ronin',
    288: 'boba',
    25: 'cronos',
    333999: 'polis',
    55: 'zyx',
    40: 'telos',
    1088: 'metis',
    8: 'ubiq',
    106: 'velas',
    820: 'callisto',
    8217: 'klaytn',
    52: 'csc',
    5551: 'nahmii',
    5050: 'liquidchain',
    82: 'meter',
    361: 'theta',
    42262: 'oasis',
    57: 'syscoin',
    1284: 'moonbeam',
    836542336838601: 'curio',
    592: 'astar',
    7700: 'canto',
    324: 'zksync',
    58: 'ontology',
    1101: 'polygonzkevm',
    2222: 'kava',
    369: 'pulse',
    8453: 'base',
    59144: 'linea',
}

export const mapChainId2ViemChain: Record<number, Chain> = {
    1: mainnet,
    56: bsc,
    137: polygon,
    250: fantom,
    43114: avalanche,
    10: optimism,
    42161: arbitrum,
    321: kcc,
    42220: celo,
    4689: iotex,
    1285: moonriver,
    336: shiden,
    11297108109: palm,
    19: songbird,
    269: hpb,
    122: fuse,
    20: elastos,
    32659: fusion,
    1313161554: aurora,
    2020: ronin,
    288: boba,
    25: cronos,
    40: telos,
    1088: metis,
    8: ubiq,
    106: velas,
    8217: klaytn,
    5551: nahmii,
    82: meter,
    361: theta,
    57: syscoin,
    1284: moonbeam,
    592: astar,
    7700: canto,
    324: zksync,
    2222: kava,
    8453: base,
    59144: linea,
    [sepolia.id]: sepolia,
};

export const mapPopularTokens: Record<number, TokenType[]> = {
    [mainnet.id]: [
        {
            symbol: 'ETH',
            name: 'Ethereum',
            address: NULL_ADDRESS,
            chainId: 1,
            decimals: 18,
            logoURI: '/images/token/eth.png',
        },
        {
            symbol: 'WETH',
            name: 'Wrapped Ether',
            address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            chainId: 1,
            decimals: 18,
            logoURI: '/images/token/weth.png',
        },
        {
            symbol: 'USDT',
            name: 'Tether USDT',
            address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
            chainId: 1,
            decimals: 6,
            logoURI: '/images/token/usdt.png',
        },
        {
            symbol: 'USDC',
            name: 'USDC',
            address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            chainId: 1,
            decimals: 6,
            logoURI: '/images/token/usdc.png',
        },
        {
            symbol: 'DAI',
            name: 'DAI',
            address: '0x6b175474e89094c44da98b954eedeac495271d0f',
            chainId: 1,
            decimals: 18,
            logoURI: '/images/token/dai.png',
        },
    ],
    [base.id]: [
        {
            symbol: 'ETH',
            name: 'Ethereum',
            address: NULL_ADDRESS,
            chainId: 8453,
            decimals: 18,
            logoURI: '/images/token/eth.png',
        },
        {
            symbol: 'WETH',
            name: 'Wrapped Ether',
            address: '0x4200000000000000000000000000000000000006',
            chainId: 8453,
            decimals: 18,
            logoURI: '/images/token/weth.png',
        },
        {
            symbol: 'USDC',
            name: 'USDC',
            address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
            chainId: 8453,
            decimals: 6,
            logoURI: '/images/token/usdc.png',
        },
        {
            symbol: 'DAI',
            name: 'DAI',
            address: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb',
            chainId: 8453,
            decimals: 18,
            logoURI: '/images/token/dai.png',
        },
        {
            symbol: 'USDbC',
            name: 'USD Base Coin',
            address: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
            chainId: 8453,
            decimals: 6,
            logoURI: '/images/token/usdc.png',
        },
    ],
    [arbitrum.id]: [
        {
            symbol: 'ETH',
            name: 'Ethereum',
            address: NULL_ADDRESS,
            chainId: 42161,
            decimals: 18,
            logoURI: '/images/token/eth.png',
        },
        {
            symbol: 'WETH',
            name: 'Wrapped Ether',
            address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
            chainId: 42161,
            decimals: 18,
            logoURI: '/images/token/weth.png',
        },
        {
            symbol: 'USDT',
            name: 'Tether USDT',
            address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
            chainId: 42161,
            decimals: 6,
            logoURI: '/images/token/usdt.png',
        },
        {
            symbol: 'USDC',
            name: 'USDC',
            address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
            chainId: 42161,
            decimals: 6,
            logoURI: '/images/token/usdc.png',
        },
        {
            symbol: 'DAI',
            name: 'DAI',
            address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
            chainId: 42161,
            decimals: 18,
            logoURI: '/images/token/dai.png',
        },
    ],
    [polygon.id]: [
        {
            symbol: 'POL',
            name: 'Polygon Native Coin',
            address: NULL_ADDRESS,
            chainId: 137,
            decimals: 18,
            logoURI: '/images/token/pol.png',
        },
        {
            symbol: 'WMATIC',
            name: 'Wrapped Matic',
            address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
            chainId: 137,
            decimals: 18,
            logoURI: '/images/token/wmatic.png',
        },
        {
            symbol: 'USDT',
            name: 'Tether USDT',
            address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
            chainId: 137,
            decimals: 6,
            logoURI: '/images/token/usdt.png',
        },
        {
            symbol: 'USDC',
            name: 'USDC',
            address: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
            chainId: 137,
            decimals: 6,
            logoURI: '/images/token/usdc.png',
        },
        {
            symbol: 'DAI',
            name: 'DAI',
            address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
            chainId: 137,
            decimals: 18,
            logoURI: '/images/token/dai.png',
        },
    ],
    [bsc.id]: [
        {
            symbol: 'BNB',
            name: 'BNB',
            address: NULL_ADDRESS,
            chainId: 56,
            decimals: 18,
            logoURI: '/images/token/bnb.png',
        },
        {
            symbol: 'WBNB',
            name: 'Wrapped BNB',
            address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
            chainId: 56,
            decimals: 18,
            logoURI: '/images/token/wbnb.png',
        },
        {
            symbol: 'USDT',
            name: 'Tether USDT',
            address: '0x55d398326f99059ff775485246999027b3197955',
            chainId: 56,
            decimals: 18,
            logoURI: '/images/token/usdt.png',
        },
        {
            symbol: 'USDC',
            name: 'USDC',
            address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
            chainId: 56,
            decimals: 18,
            logoURI: '/images/token/usdc.png',
        },
        {
            symbol: 'DAI',
            name: 'DAI',
            address: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
            chainId: 56,
            decimals: 18,
            logoURI: '/images/token/dai.png',
        },
    ],
    [avalanche.id]: [
        {
            symbol: 'AVAX',
            name: 'Avalanche',
            address: NULL_ADDRESS,
            chainId: 43114,
            decimals: 18,
            logoURI: '/images/token/avax.png',
        },
        {
            symbol: 'WAVAX',
            name: 'Wrapped AVAX',
            address: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
            chainId: 43114,
            decimals: 18,
            logoURI: '/images/token/wavax.png',
        },
        {
            symbol: 'USDT.e',
            name: 'Tether USD (Bridged)',
            address: '0x55d398326f99059ff775485246999027b3197955',
            chainId: 43114,
            decimals: 6,
            logoURI: '/images/token/usdt.png',
        },
        {
            symbol: 'USDC.e',
            name: 'USD Coin (Bridged)',
            address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
            chainId: 43114,
            decimals: 6,
            logoURI: '/images/token/usdc.png',
        },
        {
            symbol: 'DAI.e',
            name: 'Dai Stablecoin (Bridged)',
            address: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
            chainId: 43114,
            decimals: 18,
            logoURI: '/images/token/dai.png',
        },
    ],
    [optimism.id]: [
        {
            symbol: 'ETH',
            name: 'Ethereum',
            address: NULL_ADDRESS,
            chainId: 10,
            decimals: 18,
            logoURI: '/images/token/eth.png',
        },
        {
            symbol: 'WETH',
            name: 'Wrapped Ether',
            address: '0x4200000000000000000000000000000000000006',
            chainId: 10,
            decimals: 18,
            logoURI: '/images/token/weth.png',
        },
        {
            symbol: 'USDT',
            name: 'Tether USDT',
            address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
            chainId: 10,
            decimals: 6,
            logoURI: '/images/token/usdt.png',
        },
        {
            symbol: 'USDC',
            name: 'USDC',
            address: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
            chainId: 10,
            decimals: 6,
            logoURI: '/images/token/usdc.png',
        },
        {
            symbol: 'DAI',
            name: 'DAI',
            address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
            chainId: 10,
            decimals: 18,
            logoURI: '/images/token/dai.png',
        },
    ],
    [SOLANA_CHAIN_ID]: [
        {
            address: "11111111111111111111111111111111",
            chainId: 900,
            decimals: 9,
            logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
            name: "SOL",
            symbol: "SOL"
        },
        {
            address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            chainId: 900,
            decimals: 6,
            logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
            name: "USD Coin",
            symbol: "USDC"
        },
        {
            address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
            chainId: 900,
            decimals: 6,
            logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg",
            name: "USDT",
            symbol: "USDT"
        },
    ],

}