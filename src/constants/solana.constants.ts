import { PublicKey } from "@solana/web3.js";
import {SolanaTokenInfo} from "../types/jupiter-swap.type.ts";

export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

/** Address of the SPL Token 2022 program */
export const TOKEN_2022_PROGRAM_ID = new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');

/** Address of the SPL Associated Token Account program */
export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

/** Address of the special mint for wrapped native SOL in spl-token */
export const NATIVE_MINT = new PublicKey('So11111111111111111111111111111111111111112');

/** Address of the special mint for wrapped native SOL in spl-token-2022 */
export const NATIVE_MINT_2022 = new PublicKey('9pan9bMn5HatX4EJdBwg9VgCa7Uz5HL8N1m5D3NdXejP');

/** Check that the token program provided is not `Tokenkeg...`, useful when using extensions */
export function programSupportsExtensions(programId: PublicKey): boolean {
    if (programId.equals(TOKEN_PROGRAM_ID)) {
        return false;
    } else {
        return true;
    }
}


export const SOL_INFO: SolanaTokenInfo = {
    chainId: 101,
    address: PublicKey.default.toBase58(),
    programId: TOKEN_PROGRAM_ID.toBase58(),
    decimals: 9,
    symbol: "SOL",
    name: "solana",
    logoURI: `https://img.raydium.io/icon/So11111111111111111111111111111111111111112.png`,
    tags: [],
    priority: 2,
    type: "raydium",
    extensions: {
        coingeckoId: "solana",
    },
};

export const TOKEN_WSOL: SolanaTokenInfo = {
    chainId: 101,
    address: "So11111111111111111111111111111111111111112",
    programId: TOKEN_PROGRAM_ID.toBase58(),
    decimals: 9,
    symbol: "WSOL",
    name: "Wrapped SOL",
    logoURI: `https://img.raydium.io/icon/So11111111111111111111111111111111111111112.png`,
    tags: [],
    priority: 2,
    type: "raydium",
    extensions: {
        coingeckoId: "solana",
    },
};