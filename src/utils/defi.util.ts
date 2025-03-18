import { mapChainId2ChainName } from "../config/networks";
import { Position } from "../store/useDefiStore";

export const capitalizeFirstLetter = (val: string) => {
    return String(val).charAt(0).toUpperCase() + String(val.toLowerCase()).slice(1);
}

export const formatUsdValue = (value: number): string => {
    return `$${Math.abs(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

export const getTypeIcon = (type: Position['type']) => {
    switch (type.toUpperCase()) {
        case 'LENDING':
            return '💰';
        case 'BORROWING':
            return '🏦';
        case 'STAKING':
            return '🔒';
        case 'LIQUIDITY':
            return '🌊';
        default:
            return '🎁'
    }
};

export const getTypeColor = (type: Position['type']) => {
    switch (type.toUpperCase()) {
        case 'LENDING':
            return 'text-purple-400';
        case 'BORROWING':
            return 'text-red-400';
        case 'BORROWED':
            return 'text-red-400';
        case 'STAKING':
            return 'text-blue-400';
        case 'LIQUIDITY':
            return 'text-green-400';
        case 'SUPPLIED':
            return 'text-green-400';
    }
};

// export const getRiskColor = (risk: Offering['risk']) => {
//   switch (risk) {
//     case 'LOW':
//       return 'text-green-400';
//     case 'MEDIUM':
//       return 'text-yellow-400';
//     case 'HIGH':
//       return 'text-red-400';
//   }
// };

export const getChainName = (chainName: string) => {
    switch (chainName) {
        case "BNB Chain":
            return "bsc"
        default:
            return chainName;
    }
}

export const getChainNameById = (chaiId: number): string => {
    return getChainName(mapChainId2ChainName[chaiId]);
}

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

export const getAddActionName = ({ type }: { type: string }) => {
    switch (type.toLowerCase()) {
        case "staking":
            return "stake";
        case "liquidity":
            return "deposit";
        case "supplied":
            return "deposit";
        case "borrowing":
            return "borrow";
        case "lending":
            return "lend";
        default:
            return "";
    }
}

export const getApyTokenFromDefiPosition = (position: Position) => {
    switch (position.protocol_id) {
        case "pendle":
            return "SUSDE";
        case "lido":
            return "stETH";
        default:
            const filteredTokens = position.tokens.filter(token => token.token_type !== "defi-token");
            const apyTokens = filteredTokens.map(token => token.symbol);
            const apyToken = apyTokens.join("-");
            return apyToken;
    }
}