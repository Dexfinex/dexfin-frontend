import { PositionToken } from "../../store/useDefiStore";

interface AllowedTokenPair {
    token: string;
    type: string;
}

export const ALLOWED_PROTOCOL_TOKEN_PAIR_BY_CHAIN: Record<number, Record<string, AllowedTokenPair[]>> = {
    56: {
        "uniswap-v2": [
            {
                "token": "USDT,USDC,UNI-V2",
                "type": "Liquidity"
            }
        ],
        "aave-v3": [
            // {
            //     "token": "aBnbWETH,WETH",
            //     "type": "Supplied"
            // },
            // {
            //     "token": "aBnbDAI,DAI",
            //     "type": "Supplied"
            // },
            // {
            //     "token": "aBnbUSDC,USDC",
            //     "type": "Supplied"
            // }
        ],
    },
    1: {
        "lido": [
            {
                "token": "stETH",
                "type": "Staking"
            }
        ],
        "aave-v3": [
            {
                "token": "aEthWETH,WETH",
                "type": "Supplied"
            },
            {
                "token": "aEthDAI,DAI",
                "type": "Supplied"
            },
            {
                "token": "aEthUSDC,USDC",
                "type": "Supplied"
            },
            {
                "token": "aEthUSDT,USDT",
                "type": "Supplied"
            }
        ],
    },
    8453: {
        "aave-v3": [
            {
                "token": "aBasWETH,WETH",
                "type": "Supplied"
            },
            {
                "token": "aBasDAI,DAI",
                "type": "Supplied"
            },
            {
                "token": "aBasUSDC,USDC",
                "type": "Supplied"
            },
            {
                "token": "aBasUSDT,USDT",
                "type": "Supplied"
            }
        ],
    },
}

export const isEnabledPosition = ({ chainId, protocol, tokenPair, type }: { chainId: number, protocol: string, tokenPair: string, type: string }) => {
    try {
        const index = ALLOWED_PROTOCOL_TOKEN_PAIR_BY_CHAIN[chainId][protocol].findIndex(item => item.token === tokenPair && item.type === type)
        return index !== -1;
    } catch (e) {
        return false;
    }
}

export interface Offering {
    protocol: string;
    protocol_id: string;
    type: string;
    amount: number;
    tokens: PositionToken[];
    address: string;
    apy: number;
    rewards?: number;
    healthFactor?: number;
    poolShare?: number;
    pairToken?: string;
    logo: string;
    borrowed?: number;
    maxBorrow?: number;
    collateralFactor?: number;
    factory?: string;
    chainId: number;
    apyToken: string;
    disabled?: boolean;
}

export const STAKING_TOKENS = [
    {
        "protocol": "Lido",
        "logo": "https://cdn.moralis.io/defi/lido.png",
        "chainId": 1,
        "tokenIn": {
            "token_type": "native",
            "name": "ETH",
            "symbol": "ETH",
            "contract_address": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            "decimals": "18",
            "logo": "/images/token/eth.png",
            "thumbnail": "/images/token/eth.png",
        },
        "tokenOut": {
            "token_type": "defi-token",
            "name": "Liquid staked Ether 2.0",
            "symbol": "stETH",
            "contract_address": "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
            "decimals": "18",
            "logo": "https://logo.moralis.io/0x1_0xae7ab96520de3a18e5e111b5eaab095312d7fe84_cd0f5053ccb543e08f65554bf642d751.png",
            "thumbnail": "https://logo.moralis.io/0x1_0xae7ab96520de3a18e5e111b5eaab095312d7fe84_cd0f5053ccb543e08f65554bf642d751.png",
        }
    }
]

export const BORROWING_LIST = [
    {
        "protocol": "Aave V3",
        "protocol_id": "aave-v3",
        "logo": "https://cdn.moralis.io/defi/aave.png",
        "chainId": 1,
        "tokenIn": {
            "token_type": "native",
            "name": "ETH",
            "symbol": "ETH",
            "contract_address": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            "decimals": "18",
            "logo": "/images/token/eth.png",
            "thumbnail": "/images/token/eth.png",
        },
        "liquidityToken": {
            "token_type": "erc20",
            "name": "Aave Ethereum WETH",
            "symbol": "aEthWETH",
            "contract_address": "0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8",
            "decimals": "18",
            "logo": "https://etherscan.io/token/images/aave_weth.png",
            "thumbnail": "https://etherscan.io/token/images/aave_weth.png",
        },
        "borrowContract": {
            "contract_address": "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
            "abi": `[{
                "inputs": [
                {
                    "internalType": "address",
                    "name": "asset",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "interestRateMode",
                    "type": "uint256"
                },
                {
                    "internalType": "uint16",
                    "name": "referralCode",
                    "type": "uint16"
                },
                {
                    "internalType": "address",
                    "name": "onBehalfOf",
                    "type": "address"
                }
                ],
                "name": "borrow",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }]`
        },
        "tokenOut": {
            "token_type": "erc20",
            "name": "USDC",
            "symbol": "USDC",
            "contract_address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            "decimals": "6",
            "logo": "https://assets.coingecko.com/coins/images/30691/thumb/usdc.png",
            "thumbnail": "https://assets.coingecko.com/coins/images/30691/thumb/usdc.png",
        }
    },
    {
        "protocol": "Aave V3",
        "protocol_id": "aave-v3",
        "logo": "https://cdn.moralis.io/defi/aave.png",
        "chainId": 8453,
        "tokenIn": {
            "token_type": "native",
            "name": "ETH",
            "symbol": "ETH",
            "contract_address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            "decimals": "18",
            "logo": "/images/token/eth.png",
            "thumbnail": "/images/token/eth.png",
        },
        "liquidityToken": {
            "token_type": "erc20",
            "name": "Aave Ethereum WETH",
            "symbol": "aEthWETH",
            "contract_address": "0xd4a0e0b9149bcee3c920d2e00b5de09138fd8bb7",
            "decimals": "18",
            "logo": "https://etherscan.io/token/images/aave_weth.png",
            "thumbnail": "https://etherscan.io/token/images/aave_weth.png",
        },
        "borrowContract": {
            "contract_address": "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5",
            "abi": `[{
                "inputs": [
                {
                    "internalType": "address",
                    "name": "asset",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "interestRateMode",
                    "type": "uint256"
                },
                {
                    "internalType": "uint16",
                    "name": "referralCode",
                    "type": "uint16"
                },
                {
                    "internalType": "address",
                    "name": "onBehalfOf",
                    "type": "address"
                }
                ],
                "name": "borrow",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }]`
        },
        "tokenOut": {
            "token_type": "erc20",
            "name": "USDC",
            "symbol": "USDC",
            "contract_address": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
            "decimals": "6",
            "logo": "https://assets.coingecko.com/coins/images/30691/thumb/usdc.png",
            "thumbnail": "https://assets.coingecko.com/coins/images/30691/thumb/usdc.png",
        }
    }
];

export const LENDING_LIST = [
    {
        "protocol": "Aave V3",
        "protocol_id": "aave-v3",
        "logo": "https://cdn.moralis.io/defi/aave.png",
        "chainId": 1,
        "tokenIn": {
            "token_type": "native",
            "name": "ETH",
            "symbol": "ETH",
            "contract_address": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            "decimals": "18",
            "logo": "/images/token/eth.png",
            "thumbnail": "/images/token/eth.png",
        },
        "tokenOut": {
            "token_type": "erc20",
            "name": "Aave Ethereum WETH",
            "symbol": "aEthWETH",
            "contract_address": "0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8",
            "decimals": "18",
            "logo": "https://etherscan.io/token/images/aave_weth.png",
            "thumbnail": "https://etherscan.io/token/images/aave_weth.png",
        },
    },
    {
        "protocol": "Aave V3",
        "protocol_id": "aave-v3",
        "logo": "https://cdn.moralis.io/defi/aave.png",
        "chainId": 1,
        "tokenIn": {
            "token_type": "erc20",
            "name": "USDC",
            "symbol": "USDC",
            "contract_address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            "decimals": "6",
            "logo": "https://assets.coingecko.com/coins/images/30691/thumb/usdc.png",
            "thumbnail": "https://assets.coingecko.com/coins/images/30691/thumb/usdc.png",
        },
        "tokenOut": {
            "token_type": "erc20",
            "name": "Aave Ethereum USDC",
            "symbol": "aEthUSDC",
            "contract_address": "0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c",
            "decimals": "18",
            "logo": "https://etherscan.io/token/images/aave_usdc.png",
            "thumbnail": "https://etherscan.io/token/images/aave_usdc.png",
        },
    },
    {
        "protocol": "Aave V3",
        "protocol_id": "aave-v3",
        "logo": "https://cdn.moralis.io/defi/aave.png",
        "chainId": 1,
        "tokenIn": {
            "token_type": "erc20",
            "name": "Tether USD",
            "symbol": "USDT",
            "contract_address": "0xdac17f958d2ee523a2206206994597c13d831ec7",
            "decimals": "6",
            "logo": "https://logo.moralis.io/0x38_0x55d398326f99059ff775485246999027b3197955_017c31aed33715dffcd9c5175133fbdb.png",
            "thumbnail": "https://logo.moralis.io/0x38_0x55d398326f99059ff775485246999027b3197955_017c31aed33715dffcd9c5175133fbdb.png",
        },
        "tokenOut": {
            "token_type": "erc20",
            "name": "Aave Ethereum USDT",
            "symbol": "aEthUSDT",
            "contract_address": "0x23878914EFE38d27C4D67Ab83ed1b93A74D4086a",
            "decimals": "18",
            "logo": "https://etherscan.io/token/images/aave_usdt.png",
            "thumbnail": "https://etherscan.io/token/images/aave_usdt.png",
        },
    },
    {
        "protocol": "Aave V3",
        "protocol_id": "aave-v3",
        "logo": "https://cdn.moralis.io/defi/aave.png",
        "chainId": 8453,
        "tokenIn": {
            "token_type": "native",
            "name": "ETH",
            "symbol": "ETH",
            "contract_address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            "decimals": "18",
            "logo": "/images/token/eth.png",
            "thumbnail": "/images/token/eth.png",
        },
        "tokenOut": {
            "token_type": "erc20",
            "name": "Aave Ethereum WETH",
            "symbol": "aBasWETH",
            "contract_address": "0xd4a0e0b9149bcee3c920d2e00b5de09138fd8bb7",
            "decimals": "18",
            "logo": "https://etherscan.io/token/images/aave_weth.png",
            "thumbnail": "https://etherscan.io/token/images/aave_weth.png",
        },
    },
    {
        "protocol": "Aave V3",
        "protocol_id": "aave-v3",
        "logo": "https://cdn.moralis.io/defi/aave.png",
        "chainId": 8453,
        "tokenIn": {
            "token_type": "erc20",
            "name": "USDC",
            "symbol": "USDC",
            "contract_address": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
            "decimals": "6",
            "logo": "https://assets.coingecko.com/coins/images/30691/thumb/usdc.png",
            "thumbnail": "https://assets.coingecko.com/coins/images/30691/thumb/usdc.png",
        },
        "tokenOut": {
            "token_type": "erc20",
            "name": "Aave Ethereum USDC",
            "symbol": "aBasUSDC",
            "contract_address": "0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB",
            "decimals": "18",
            "logo": "https://etherscan.io/token/images/aave_usdc.png",
            "thumbnail": "https://etherscan.io/token/images/aave_usdc.png",
        },
    },
    {
        "protocol": "Aave V3",
        "protocol_id": "aave-v3",
        "logo": "https://cdn.moralis.io/defi/aave.png",
        "chainId": 1,
        "tokenIn": {
            "token_type": "erc20",
            "name": "Dai Stablecoin",
            "symbol": "DAI",
            "contract_address": "0x6b175474e89094c44da98b954eedeac495271d0f",
            "decimals": "6",
            "logo": "https://etherscan.io/token/images/dairplce_32.svg",
            "thumbnail": "https://etherscan.io/token/images/dairplce_32.svg",
        },
        "tokenOut": {
            "token_type": "erc20",
            "name": "Aave Ethereum DAI",
            "symbol": "aEthDAI",
            "contract_address": "0x018008bfb33d285247A21d44E50697654f754e63",
            "decimals": "18",
            "logo": "https://etherscan.io/token/images/aave_dai.png",
            "thumbnail": "https://etherscan.io/token/images/aave_dai.png",
        },
    },
    {
        "protocol": "Pendle Finance",
        "protocol_id": "pendle",
        "logo": "https://cryptologos.cc/logos/pendle-pendle-logo.svg?v=040",
        "chainId": 1,
        "tokenIn": {
            "token_type": "erc20",
            "name": "USDC",
            "symbol": "USDC",
            "contract_address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            "decimals": "6",
            "logo": "https://assets.coingecko.com/coins/images/30691/thumb/usdc.png",
            "thumbnail": "https://assets.coingecko.com/coins/images/30691/thumb/usdc.png",
        },
        "tokenOut": {
            "token_type": "erc20",
            "name": "Staked USDe",
            "symbol": "sUSDe",
            "contract_address": "0x9d39a5de30e57443bff2a8307a4256c8797a3497",
            "decimals": "18",
            "logo": "https://coin-images.coingecko.com/coins/images/33669/large/sUSDe-Symbol-Color.png?1716307680",
            "thumbnail": "https://coin-images.coingecko.com/coins/images/33669/large/sUSDe-Symbol-Color.png?1716307680",
        },
    },
    {
        "protocol": "Aave V3",
        "protocol_id": "aave-v3",
        "logo": "https://cdn.moralis.io/defi/aave.png",
        "chainId": 56,
        "tokenIn": {
            "token_type": "erc20",
            "name": "USDC",
            "symbol": "USDC",
            "contract_address": "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
            "decimals": "6",
            "logo": "https://assets.coingecko.com/coins/images/30691/thumb/usdc.png",
            "thumbnail": "https://assets.coingecko.com/coins/images/30691/thumb/usdc.png",
        },
        "tokenOut": {
            "token_type": "erc20",
            "name": "Aave BNB Smart Chain USDC",
            "symbol": "aBnbUSDC",
            "contract_address": "0x00901a076785e0906d1028c7d6372d247bec7d61",
            "decimals": "18",
            "logo": "https://etherscan.io/token/images/aave_usdc.png",
            "thumbnail": "https://etherscan.io/token/images/aave_usdc.png",
        },
    },
];

export const offerings: Offering[] = [
    {
        "chainId": 1,
        "apy": 3.1,
        "apyToken": "stETH",
        "address": "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
        "protocol": "Lido",
        "protocol_id": "lido",
        "type": "Staking",
        "amount": 0,
        "tokens": [
            {
                "token_type": "defi-token",
                "name": "Liquid staked Ether 2.0",
                "symbol": "stETH",
                "contract_address": "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
                "decimals": "18",
                "logo": "https://logo.moralis.io/0x1_0xae7ab96520de3a18e5e111b5eaab095312d7fe84_cd0f5053ccb543e08f65554bf642d751.png",
                "thumbnail": "https://logo.moralis.io/0x1_0xae7ab96520de3a18e5e111b5eaab095312d7fe84_cd0f5053ccb543e08f65554bf642d751.png",
                "balance": "0",
                "balance_formatted": "0",
                "usd_price": 0,
                "usd_value": 0
            }
        ],
        "rewards": 0,
        "healthFactor": 0,
        "logo": "https://cdn.moralis.io/defi/lido.png"
    },
    {
        "chainId": 1,
        "apy": 1.63,
        "apyToken": "USDC",
        "address": "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
        "protocol": "Aave V3",
        "protocol_id": "aave-v3",
        "type": "Borrowing",
        "amount": 0,
        "tokens": [
            {
                "token_type": "native",
                "name": "ETH",
                "symbol": "ETH",
                "contract_address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "decimals": "18",
                "logo": "/images/token/eth.png",
                "thumbnail": "/images/token/eth.png",
                "balance": "0",
                "balance_formatted": "0",
                "usd_price": 0,
                "usd_value": 0
            },
            {
                "token_type": "erc20",
                "name": "USDC",
                "symbol": "USDC",
                "contract_address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "decimals": "6",
                "logo": "https://assets.coingecko.com/coins/images/30691/thumb/usdc.png",
                "thumbnail": "https://assets.coingecko.com/coins/images/30691/thumb/usdc.png",
                "balance": "0",
                "balance_formatted": "0",
                "usd_price": 0,
                "usd_value": 0
            }
        ],
        "rewards": 0,
        "healthFactor": 17.41,
        "logo": "https://cdn.moralis.io/defi/aave.png"
    },
    {
        "chainId": 8453,
        "apy": 1.63,
        "apyToken": "USDC",
        "address": "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
        "protocol": "Aave V3",
        "protocol_id": "aave-v3",
        "type": "Borrowing",
        "amount": 0,
        "tokens": [
            {
                "token_type": "native",
                "name": "ETH",
                "symbol": "ETH",
                "contract_address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "decimals": "18",
                "logo": "/images/token/eth.png",
                "thumbnail": "/images/token/eth.png",
                "balance": "0",
                "balance_formatted": "0",
                "usd_price": 0,
                "usd_value": 0
            },
            {
                "token_type": "erc20",
                "name": "USDC",
                "symbol": "USDC",
                "contract_address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "decimals": "6",
                "logo": "https://assets.coingecko.com/coins/images/30691/thumb/usdc.png",
                "thumbnail": "https://assets.coingecko.com/coins/images/30691/thumb/usdc.png",
                "balance": "0",
                "balance_formatted": "0",
                "usd_price": 0,
                "usd_value": 0
            }
        ],
        "rewards": 0,
        "healthFactor": 17.41,
        "logo": "https://cdn.moralis.io/defi/aave.png"
    },
    {
        "chainId": 1,
        "apy": 0,
        "apyToken": "wETH",
        "address": "0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8",
        "protocol": "Aave V3",
        "protocol_id": "aave-v3",
        "type": "Lending",
        "amount": 0,
        "tokens": [
            {
                "token_type": "native",
                "name": "ETH",
                "symbol": "ETH",
                "contract_address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "decimals": "18",
                "logo": "/images/token/eth.png",
                "thumbnail": "/images/token/eth.png",
                "balance": "0",
                "balance_formatted": "0",
                "usd_price": 0,
                "usd_value": 0
            }
        ],
        "rewards": 0,
        "healthFactor": 0,
        "logo": "https://cdn.moralis.io/defi/aave.png"
    },
    {
        "chainId": 8453,
        "apy": 0,
        "apyToken": "wETH",
        "address": "0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8",
        "protocol": "Aave V3",
        "protocol_id": "aave-v3",
        "type": "Lending",
        "amount": 0,
        "tokens": [
            {
                "token_type": "native",
                "name": "ETH",
                "symbol": "ETH",
                "contract_address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "decimals": "18",
                "logo": "/images/token/eth.png",
                "thumbnail": "/images/token/eth.png",
                "balance": "0",
                "balance_formatted": "0",
                "usd_price": 0,
                "usd_value": 0
            }
        ],
        "rewards": 0,
        "healthFactor": 0,
        "logo": "https://cdn.moralis.io/defi/aave.png"
    },
    {
        "chainId": 1,
        "apy": 0,
        "apyToken": "USDC",
        "address": "0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8",
        "protocol": "Aave V3",
        "protocol_id": "aave-v3",
        "type": "Lending",
        "amount": 0,
        "tokens": [
            {
                "token_type": "erc20",
                "name": "USDC",
                "symbol": "USDC",
                "contract_address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "decimals": "6",
                "logo": "https://assets.coingecko.com/coins/images/30691/thumb/usdc.png",
                "thumbnail": "https://assets.coingecko.com/coins/images/30691/thumb/usdc.png",
                "balance": "0",
                "balance_formatted": "0",
                "usd_price": 0,
                "usd_value": 0
            }
        ],
        "rewards": 0,
        "healthFactor": 0,
        "logo": "https://cdn.moralis.io/defi/aave.png"
    },
    {
        "chainId": 8453,
        "apy": 0,
        "apyToken": "USDC",
        "address": "0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8",
        "protocol": "Aave V3",
        "protocol_id": "aave-v3",
        "type": "Lending",
        "amount": 0,
        "tokens": [
            {
                "token_type": "erc20",
                "name": "USDC",
                "symbol": "USDC",
                "contract_address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "decimals": "6",
                "logo": "https://assets.coingecko.com/coins/images/30691/thumb/usdc.png",
                "thumbnail": "https://assets.coingecko.com/coins/images/30691/thumb/usdc.png",
                "balance": "0",
                "balance_formatted": "0",
                "usd_price": 0,
                "usd_value": 0
            }
        ],
        "rewards": 0,
        "healthFactor": 0,
        "logo": "https://cdn.moralis.io/defi/aave.png"
    },
    // {
    //     "chainId": 56,
    //     "apy": 0,
    //     "apyToken": "USDC",
    //     "address": "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
    //     "protocol": "Aave V3",
    //     "protocol_id": "aave-v3",
    //     "type": "Lending",
    //     "amount": 0,
    //     "tokens": [
    //         {
    //             "token_type": "erc20",
    //             "name": "USDC",
    //             "symbol": "USDC",
    //             "contract_address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    //             "decimals": "6",
    //             "logo": "https://assets.coingecko.com/coins/images/30691/thumb/usdc.png",
    //             "thumbnail": "https://assets.coingecko.com/coins/images/30691/thumb/usdc.png",
    //             "balance": "0",
    //             "balance_formatted": "0",
    //             "usd_price": 0,
    //             "usd_value": 0
    //         }
    //     ],
    //     "rewards": 0,
    //     "healthFactor": 0,
    //     "logo": "https://cdn.moralis.io/defi/aave.png"
    // },
    {
        "chainId": 1,
        "apy": 0,
        "apyToken": "USDT",
        "address": "0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8",
        "protocol": "Aave V3",
        "protocol_id": "aave-v3",
        "type": "Lending",
        "amount": 0,
        "tokens": [
            {
                "token_type": "erc20",
                "name": "Tether USD",
                "symbol": "USDT",
                "contract_address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "decimals": "6",
                "logo": "https://logo.moralis.io/0x38_0x55d398326f99059ff775485246999027b3197955_017c31aed33715dffcd9c5175133fbdb.png",
                "thumbnail": "https://logo.moralis.io/0x38_0x55d398326f99059ff775485246999027b3197955_017c31aed33715dffcd9c5175133fbdb.png",
                "balance": "0",
                "balance_formatted": "0",
                "usd_price": 0,
                "usd_value": 0
            }
        ],
        "rewards": 0,
        "healthFactor": 0,
        "logo": "https://cdn.moralis.io/defi/aave.png"
    },
    {
        "chainId": 1,
        "apy": 0,
        "apyToken": "DAI",
        "address": "0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8",
        "protocol": "Aave V3",
        "protocol_id": "aave-v3",
        "type": "Lending",
        "amount": 0,
        "tokens": [
            {
                "token_type": "erc20",
                "name": "Dai Stablecoin",
                "symbol": "DAI",
                "contract_address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "decimals": "6",
                "logo": "https://etherscan.io/token/images/dairplce_32.svg",
                "thumbnail": "https://etherscan.io/token/images/dairplce_32.svg",
                "balance": "0",
                "balance_formatted": "0",
                "usd_price": 0,
                "usd_value": 0
            }
        ],
        "rewards": 0,
        "healthFactor": 0,
        "logo": "https://cdn.moralis.io/defi/aave.png"
    },
    {
        "chainId": 1,
        "apy": 0,
        "apyToken": "SUSDE",
        "disabled": true,
        "address": "0xcdd26eb5eb2ce0f203a84553853667ae69ca29ce",
        "protocol": "Pendle Finance",
        "protocol_id": "pendle",
        "type": "Lending",
        "amount": 0,
        "tokens": [
            {
                "token_type": "erc20",
                "name": "USDC",
                "symbol": "USDC",
                "contract_address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "decimals": "6",
                "logo": "https://assets.coingecko.com/coins/images/30691/thumb/usdc.png",
                "thumbnail": "https://assets.coingecko.com/coins/images/30691/thumb/usdc.png",
                "balance": "0",
                "balance_formatted": "0",
                "usd_price": 0,
                "usd_value": 0
            }
        ],
        "rewards": 0,
        "healthFactor": 0,
        "logo": "https://cryptologos.cc/logos/pendle-pendle-logo.svg?v=040"
    },
    {
        "chainId": 56,
        "address": "0x6ab0ae46c4b450bc1b4ffcaa192b235134d584b2",
        "protocol": "Uniswap v2",
        "protocol_id": "uniswap-v2",
        "type": "Liquidity",
        "amount": 0,
        "apy": 0,
        "apyToken": "USDC-USDT",
        "tokens": [
            {
                "token_type": "supplied",
                "name": "Tether USD",
                "symbol": "USDT",
                "contract_address": "0x55d398326f99059ff775485246999027b3197955",
                "decimals": "18",
                "logo": "https://logo.moralis.io/0x38_0x55d398326f99059ff775485246999027b3197955_017c31aed33715dffcd9c5175133fbdb.png",
                "thumbnail": "https://logo.moralis.io/0x38_0x55d398326f99059ff775485246999027b3197955_017c31aed33715dffcd9c5175133fbdb.png",
                "balance": "0",
                "balance_formatted": "0",
                "usd_price": 0,
                "usd_value": 0
            },
            {
                "token_type": "supplied",
                "name": "USD Coin",
                "symbol": "USDC",
                "contract_address": "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
                "decimals": "18",
                "logo": "https://logo.moralis.io/0x38_0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d_0ebe47803189a184e87d3b2531873502.png",
                "thumbnail": "https://logo.moralis.io/0x38_0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d_0ebe47803189a184e87d3b2531873502.png",
                "balance": "0",
                "balance_formatted": "0",
                "usd_price": 0,
                "usd_value": 0
            },
            {
                "token_type": "defi-token",
                "name": "Uniswap V2",
                "symbol": "UNI-V2",
                "contract_address": "0x6ab0ae46c4b450bc1b4ffcaa192b235134d584b2",
                "decimals": "18",
                "logo": "",
                "thumbnail": "",
                "balance": "0",
                "balance_formatted": "0",
                "usd_price": 0,
                "usd_value": 0
            }
        ],
        "rewards": 0,
        "healthFactor": 0,
        "logo": "https://cdn.moralis.io/defi/uniswap.png",
        "factory": "0x8909dc15e40173ff4699343b6eb8132c65e18ec6"
    },
];