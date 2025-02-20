import { Position } from "../store/useDefiStore";

export const getTypeIcon = (type: Position['type']) => {
    switch (type.toUpperCase()) {
        case 'LENDING':
            return '💰';
        case 'BORROWING':
            return '🏦';
        case 'STAKING':
            return '🔒';
        case 'POOL':
            return '🌊';
        default:
            return '🎁'
    }
};

export const getTypeColor = (type: Position['type']) => {
    switch (type) {
        case 'LENDING':
            return 'text-purple-400';
        case 'BORROWING':
            return 'text-red-400';
        case 'STAKING':
            return 'text-blue-400';
        case 'POOL':
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