import BaseChainIcon from "./assets/base.svg"
import ArbitrumChainIcon from "./assets/arbitrum.svg"

export function getChainIcon(chainId?: number) {
    switch (chainId) {
        case 1:
            return "https://cdn.moralis.io/eth/0x.png";
        case 56:
            return "https://cdn.moralis.io/bsc/0x.png";
        case 137:
            return "https://cdn.moralis.io/polygon/0x.png";
        case 43114:
            return "https://cdn.moralis.io/avalanche/0x.png";
        case 10:
            return "https://cdn.moralis.io/optimism/0x.png";
        case 42161:
            return ArbitrumChainIcon;
        case 8453:
            return BaseChainIcon;
        default:
            return null;
    }
}