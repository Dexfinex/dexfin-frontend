import { Position } from "../../store/useDefiStore";

export const ALLOWED_PROTOCOL_TOKEN_PAIR_BY_CHAIN: Record<number, Record<string, Record<string, string>>> = {
    56: {
        "uniswap-v2": {
            "token": "USDT,USDC,UNI-V2",
            "type": "Liquidity"
        },
    },
    1: {
        "lido": {
            "token": "stETH",
            "type": "Staking"
        },
        // "aave-v3": {
        //     "token": "aEthWETH,WETH",
        //     "type": "Supplied"
        // },
    },
}

export const isEnabledPosition = ({ chainId, protocol, tokenPair, type }: { chainId: number, protocol: string, tokenPair: string, type: string }) => {
    if (
        ALLOWED_PROTOCOL_TOKEN_PAIR_BY_CHAIN[chainId] &&
        ALLOWED_PROTOCOL_TOKEN_PAIR_BY_CHAIN[chainId][protocol] &&
        ALLOWED_PROTOCOL_TOKEN_PAIR_BY_CHAIN[chainId][protocol]?.token === tokenPair &&
        ALLOWED_PROTOCOL_TOKEN_PAIR_BY_CHAIN[chainId][protocol]?.type === type
    ) {
        return true;
    }

    return false;
}

export interface Offering extends Position {
    chainId: number[];
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

export const offerings: Offering[] = [
    {
        "chainId": [56],
        "address": "0x6ab0ae46c4b450bc1b4ffcaa192b235134d584b2",
        "protocol": "Uniswap v2",
        "protocol_id": "uniswap-v2",
        "type": "Liquidity",
        "amount": 0,
        "apy": 0,
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
    {
        "chainId": [1],
        "apy": 3.1,
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
        "chainId": [1, 8453],
        "apy": 1.63,
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
        "chainId": [1],
        "apy": 1.63,
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
        "healthFactor": 17.41,
        "logo": "https://cdn.moralis.io/defi/aave.png"
    }
];