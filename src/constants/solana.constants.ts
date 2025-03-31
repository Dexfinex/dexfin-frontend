import { PublicKey } from "@solana/web3.js";
import { SolanaTokenInfo } from "../types/jupiterSwap.type.ts";

export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

export const RAYMint = new PublicKey('4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R')
export const PAIMint = new PublicKey('Ea5SjE2Y6yvCeW5dYTn7PYMuW5ikXkvbGdcmSnXeaLjS')
export const SRMMint = new PublicKey('SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt')
export const USDCMint = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
export const USDTMint = new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB')
export const mSOLMint = new PublicKey('mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So')
export const stSOLMint = new PublicKey('7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj')
export const USDHMint = new PublicKey('USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX')
export const NRVMint = new PublicKey('NRVwhjBQiUPYtfDT5zRBVJajzFQHaBUNtC7SNVvqRFa')
export const ANAMint = new PublicKey('ANAxByE6G2WjFp7A4NqtWYXb3mgruyzZYg3spfxe6Lbo')
export const ETHMint = new PublicKey('7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs')
export const WSOLMint = new PublicKey('So11111111111111111111111111111111111111112')
export const SOLMint = PublicKey.default

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

export const SOLANA_CHAIN_ID = 900 // predefined id for solana mainnet
export const BITCOIN_CHAIN_ID = 0 // predefined id for solana mainnet

export const SOLANA_TOKEN_ID = "solana"

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