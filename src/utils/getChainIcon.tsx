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
            return "https://cryptologos.cc/logos/arbitrum-arb-logo.svg";
        case 8453:
            return "https://assets.coingecko.com/asset_platforms/images/131/small/base-network.png";
        case 900:
            return "https://assets.coingecko.com/coins/images/4128/small/solana.png";
        default:
            return null;
    }
}