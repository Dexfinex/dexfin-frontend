import {tokenList as allTokenList} from "../constants/mock/all";
import {tokenList as arbitrumTokenList} from "../constants/mock/arbitrum";
import {tokenList as avalancheTokenList} from "../constants/mock/avalanche";
import {tokenList as bitcoinTokenList} from "../constants/mock/bitcoin";
import {tokenList as bscTokenList} from "../constants/mock/bsc";
import {tokenList as ethereumTokenList} from "../constants/mock/ethereum";
import {tokenList as optimismTokenList} from "../constants/mock/optimism";
import {tokenList as polygonTokenList} from "../constants/mock/polygon";
import {tokenList as baseTokenList} from "../constants/mock/base";
import {tokenList as solanaTokenList} from "../constants/mock/solana";
import {TokenType} from "../types/swap.type.ts";

export const savedTokens: Record<string, TokenType[]> = {
    'all': allTokenList as TokenType[],
    'ethereum': ethereumTokenList as TokenType[],
    'polygon': polygonTokenList as TokenType[],
    'base': baseTokenList as TokenType[],
    'bsc': bscTokenList as TokenType[],
    'avalanche': avalancheTokenList as TokenType[],
    'optimism': optimismTokenList as TokenType[],
    'arbitrum': arbitrumTokenList as TokenType[],
    'bitcoin': bitcoinTokenList as unknown as TokenType[],
    'solana': solanaTokenList as unknown as TokenType[],
}