import { Position } from "../../store/useDefiStore";

export const ALLOWED_PROTOCOL_TOKEN_PAIR_BY_CHAIN: Record<number, Record<string, string>> = {
    56: {
        "uniswap-v2": "USDT,USDC,UNI-V2"
    }
}

export const isEnabledPosition = ({ chainId, protocol, tokenPair }: { chainId: number, protocol: string, tokenPair: string }) => {
    if (ALLOWED_PROTOCOL_TOKEN_PAIR_BY_CHAIN[chainId] && ALLOWED_PROTOCOL_TOKEN_PAIR_BY_CHAIN[chainId][protocol] && ALLOWED_PROTOCOL_TOKEN_PAIR_BY_CHAIN[chainId][protocol] === tokenPair) {
        return true;
    }

    return false;
}

export interface Offering extends Position {
    chainId: number;
}

export const offerings: Offering[] = [
    {
        "chainId": 56,
        "address": "0x6ab0ae46c4b450bc1b4ffcaa192b235134d584b2",
        "protocol": "Uniswap v2",
        "protocol_id": "uniswap-v2",
        "type": "liquidity",
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
    }
];