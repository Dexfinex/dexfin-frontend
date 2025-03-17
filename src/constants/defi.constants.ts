// Mock data for wallet transactions and DeFi positions
import {DeFiPosition} from '../types/wallet.type';
// DeFi positions mock data - Adjusted to match total of $15,650.32
export const mockDeFiPositions: DeFiPosition[] = [
    // // Layer 1s
    // {
    //   id: 'eth-holding',
    //   protocol: 'Ethereum',
    //   type: 'STAKING',
    //   address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    //   token: {
    //     symbol: 'ETH',
    //     logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    //   },
    //   amount: 2.5,
    //   value: 8125.50,
    //   apy: 3.8,
    //   protocolLogo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    //   startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 90 days ago
    // },

    // Stablecoins
    {
        id: 'usdc-lending',
        protocol: 'Aave V3',
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
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
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
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
