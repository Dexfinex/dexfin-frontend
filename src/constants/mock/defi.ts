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