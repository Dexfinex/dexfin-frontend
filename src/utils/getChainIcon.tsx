export function getChainIcon(chainId?: number) {
    switch (chainId) {
        case 1:
            return "/images/token/eth.png";
        case 56:
            return "https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png?1696501970";
        case 137:
            return "https://assets.coingecko.com/coins/images/4713/standard/polygon.png?1698233745";
        case 43114:
            return "https://assets.coingecko.com/coins/images/12559/standard/Avalanche_Circle_RedWhite_Trans.png?1696512369";
        case 10:
            return "https://assets.coingecko.com/coins/images/25244/standard/Optimism.png?1696524385";
        case 42161:
            return "https://assets.coingecko.com/coins/images/16547/standard/arb.jpg?1721358242";
        case 8453:
            return "https://assets.coingecko.com/asset_platforms/images/131/small/base-network.png";
        case 900:
            return "https://assets.coingecko.com/coins/images/4128/small/solana.png";
        default:
            return null;
    }
}