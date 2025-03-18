import {arbitrum, avalanche, base, bsc, linea, mainnet, optimism, polygon} from "viem/chains";
import {SOLANA_CHAIN_ID} from "./solana.constants.ts";

export const mapDebridgeFeeCosts: Record<number, number> = {
    [arbitrum.id]: 0.001,
    [avalanche.id]: 0.05,
    [bsc.id]: 0.005,
    [mainnet.id]: 0.001,
    [polygon.id]: 0.5,
    [SOLANA_CHAIN_ID]: 0.015,
    [linea.id]: 0.001,
    [base.id]: 0.001,
    [optimism.id]: 0.001,
}