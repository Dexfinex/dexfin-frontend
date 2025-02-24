import { mapChainId2ChainName } from "../config/networks";
import { Position } from "../store/useDefiStore";

export const capitalizeFirstLetter = (val: string) => {
    return String(val).charAt(0).toUpperCase() + String(val.toLowerCase()).slice(1);
}

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
        case 'STAKING':
            return 'text-blue-400';
        case 'LIQUIDITY':
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