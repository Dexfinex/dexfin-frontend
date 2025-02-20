import {PublicKey} from "@solana/web3.js";
import {SOL_INFO, SOLMint, TOKEN_WSOL, WSOLMint} from "../constants/solana.constants.ts";
import {ApiV3Token} from "../types/jupiterSwap.type.ts";

export const wSolToSol = (key?: string): string | undefined => (key === WSOLMint.toBase58() ? SOLMint.toBase58() : key)
export const solToWSol = (key?: string): string | undefined => (key === SOLMint.toBase58() ? WSOLMint.toBase58() : key)
export const wSolToSolString = (name?: string) => (name ? name.replace(/WSOL/gi, 'SOL') : '')
export const solToWsolString = (name?: string) => (name ? name.replace(/^SOL/gi, 'WSOL') : '')

export const isSolWSol = (mint?: string | PublicKey) => {
    if (!mint) return false
    return mint.toString() === TOKEN_WSOL.address || mint.toString() === SOL_INFO.address
}

export const solToWSolToken = (token: ApiV3Token): ApiV3Token => {
    if (token.address === SOLMint.toBase58()) {
        return {
            ...token,
            address: TOKEN_WSOL.address,
            symbol: TOKEN_WSOL.symbol,
            name: TOKEN_WSOL.name
        }
    }
    return token
}

export const wsolToSolToken = (token: ApiV3Token): ApiV3Token => {
    if (token.address === WSOLMint.toBase58()) {
        return {
            ...token,
            address: SOL_INFO.address,
            symbol: SOL_INFO.symbol,
            name: SOL_INFO.name
        }
    }
    return token
}
