import React, { useContext, useMemo } from "react";
import { Skeleton } from '@chakra-ui/react';

import { Web3AuthContext } from "../../providers/Web3AuthContext";
import useDefiStore, { Position } from '../../store/useDefiStore';
import { getTypeIcon, getTypeColor } from "../../utils/defi.util";
import { formatNumberByFrac, formatHealthFactor } from "../../utils/common.util";

import { isEnabledPosition } from "../../constants/mock/defi";


interface PositionListProps {
    setSelectedPositionType: (position: Position['type'] | 'ALL') => void,
    selectedPositionType: Position['type'] | 'ALL',
    isLoading: boolean,
    setShowPreview: (showPreview: boolean) => void;
    handleAction: (type: string, position: Position) => void,

}

export const PositionList: React.FC<PositionListProps> = ({ setSelectedPositionType, selectedPositionType, isLoading, handleAction, setShowPreview }) => {

    const { chainId } = useContext(Web3AuthContext)
    const { positions, protocolTypes } = useDefiStore();

    const getAddLabelName = ({ type }: { type: string }) => {
        switch (type.toLowerCase()) {
            case "staking":
                return "Stake";
            case "liquidity":
                return "Deposit";
            case "supplied":
                return "Deposit";
            default:
                return "";
        }
    }

    const getRemoveLabelName = ({ type }: { type: string }) => {
        switch (type.toLowerCase()) {
            case "staking":
                return "Withdraw";
            case "liquidity":
                return "Redeem";
            case "supplied":
                return "Withdraw";
            default:
                return "";
        }
    }

    const getAddActionName = ({ type }: { type: string }) => {
        switch (type.toLowerCase()) {
            case "staking":
                return "stake";
            case "liquidity":
                return "deposit";
            case "supplied":
                return "deposit";
            default:
                return "";
        }
    }

    const getRemoveActionName = ({ type }: { type: string }) => {
        switch (type.toLowerCase()) {
            case "staking":
                return "unstake";
            case "liquidity":
                return "redeem";
            case "supplied":
                return "redeem";
            default:
                return "";
        }
    }

    return (
        <div className="space-y-3">
            {
                positions.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center gap-2 mb-6">
                        <button
                            onClick={() => setSelectedPositionType('ALL')}
                            className={`w-full sm:w-auto px-3 py-1.5 rounded-lg transition-colors ${selectedPositionType === 'ALL'
                                ? 'bg-white/10'
                                : 'hover:bg-white/5'
                                }`}
                        >
                            All Types
                        </button>
                        {protocolTypes.map(type => (
                            <button
                                key={type}
                                onClick={() => setSelectedPositionType(type)}
                                className={`w-full sm:w-auto px-3 py-1.5 rounded-lg transition-colors ${selectedPositionType === type
                                    ? 'bg-white/10'
                                    : 'hover:bg-white/5'
                                    }`}
                            >
                                {getTypeIcon(type)}
                                <span>{type.charAt(0) + type.slice(1).toLowerCase()}</span>
                            </button>
                        ))}
                    </div>
                )
            }

            {
                positions.length === 0 && isLoading && <Skeleton startColor="#444" className='rounded-xl' endColor="#1d2837" w={'100%'} h={'7rem'}></Skeleton>
            }
            {
                positions
                    .filter(p => selectedPositionType === 'ALL' || p.type === selectedPositionType)
                    .map((position, index) => {
                        const tokenList = position.tokens.map((token) => token.symbol);
                        const isEnabled = isEnabledPosition({ chainId: Number(chainId), protocol: position.protocol_id, tokenPair: tokenList.toString() || "", type: position.type })
                        return (
                            isLoading ? <Skeleton startColor="#444" className='rounded-xl' endColor="#1d2837" w={'100%'} h={'7rem'} key={`sk-${index}`}></Skeleton>
                                : <div
                                    key={index}
                                    className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
                                >
                                    <div className="flex items-between sm:items-center justify-between flex-col sm:flex-row">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                            <img
                                                src={position.logo}
                                                alt={position.protocol}
                                                className="w-10 h-10"
                                            />
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-medium">{position.protocol}</h3>
                                                    <span className={`text-sm ${getTypeColor(position.type)} hidden sm:block`}>
                                                        {position.type}
                                                    </span>
                                                    <span className="text-white/40 hidden sm:block">•</span>
                                                    {
                                                        position.tokens.map((token) => {
                                                            return (
                                                                `${token?.symbol} `
                                                            )
                                                        })
                                                    }
                                                </div>

                                                <div className="flex items-center justify-items-stretch gap-4 sm:gap-6 flex-wrap">
                                                    <div>
                                                        <span className="text-sm text-white/60">Amount</span>
                                                        <div className="text-lg">${formatNumberByFrac(position.amount)}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-white/60">APY</span>
                                                        <div className="text-emerald-400">{(formatNumberByFrac(position.apy) || "0")}%</div>
                                                    </div>
                                                    {position.rewards && (
                                                        <div>
                                                            <span className="text-sm text-white/60">Rewards</span>
                                                            <div className="text-blue-400">+{(formatNumberByFrac(position.rewards) || "0")}% APR</div>
                                                        </div>
                                                    )}
                                                    {!!position.healthFactor && (
                                                        <div>
                                                            <span className="text-sm text-white/60">Health Factor</span>
                                                            <div className="text-green-400">{formatHealthFactor(position.healthFactor)}</div>
                                                        </div>
                                                    )}
                                                    {position.poolShare && (
                                                        <div>
                                                            <span className="text-sm text-white/60">Pool Share</span>
                                                            <div>{formatNumberByFrac(position.poolShare, 3)}%</div>
                                                        </div>
                                                    )}
                                                    {position.collateralFactor && (
                                                        <div>
                                                            <span className="text-sm text-white/60">Collateral Factor</span>
                                                            <div>{(formatNumberByFrac(position.collateralFactor * 100))}%</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                            <button
                                                onClick={() => {
                                                    handleAction(getAddActionName({ type: position.type }), position);
                                                    setShowPreview(false);
                                                }}
                                                className={`px-3 py-1.5 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg text-sm ${isEnabled ? "" : "opacity-70"}`}
                                                disabled={!isEnabled}
                                            >
                                                {getAddLabelName({ type: position.type })}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleAction(getRemoveActionName({ type: position.type }), position);
                                                    setShowPreview(false);
                                                }}
                                                className={`px-3 py-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-sm ${isEnabled ? "" : "opacity-70"}`}
                                                disabled={!isEnabled}
                                            >
                                                {getRemoveLabelName({ type: position.type })}
                                            </button>
                                        </div>
                                    </div>

                                    {position.type === 'BORROWING' && (
                                        <div className="mt-3">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-white/60">Borrow Utilization</span>
                                                <span>{(formatNumberByFrac((position.borrowed! / position.maxBorrow!) * 100))}%</span>
                                            </div>
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all ${(position.borrowed! / position.maxBorrow!) >= 0.8 ? 'bg-red-500' :
                                                        (position.borrowed! / position.maxBorrow!) >= 0.6 ? 'bg-yellow-500' :
                                                            'bg-green-500'
                                                        }`}
                                                    style={{ width: `${(position.borrowed! / position.maxBorrow!) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                        )
                    })
            }
        </div >
    )
}