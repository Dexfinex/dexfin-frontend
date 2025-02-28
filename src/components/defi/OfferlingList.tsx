import React, { useContext } from "react";
import { numberToHex } from "viem";

import { Web3AuthContext } from "../../providers/Web3AuthContext";
import { TokenChainIcon } from '../swap/components/TokenIcon';
import useDefiStore, { Position } from '../../store/useDefiStore';
import { getTypeIcon, getTypeColor, } from "../../utils/defi.util";
import { offerings } from "../../constants/mock/defi";

interface OfferingListProps {
    setSelectedPositionType: (position: Position['type'] | 'ALL') => void,
    selectedPositionType: Position['type'] | 'ALL',
    handleAction: (type: string, position: Position) => void,
}

export const OfferingList: React.FC<OfferingListProps> = ({ setSelectedPositionType, selectedPositionType, handleAction }) => {

    const CATEGORY_LIST = ['LENDING', 'BORROWING', 'STAKING', 'LIQUIDITY'] as Position['type'][]

    const { chainId, switchChain } = useContext(Web3AuthContext);
    const { positions, } = useDefiStore();

    const filteredOfferings = offerings.filter(o => selectedPositionType === 'ALL' || o.type.toLowerCase() === selectedPositionType.toLowerCase());

    const getAddActionName = ({ type }: { type: string }) => {
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


    return (
        <div className="space-y-4">
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
                {CATEGORY_LIST.map(type => (
                    <button
                        key={type}
                        onClick={() => setSelectedPositionType(type)}
                        className={`w-full sm:w-auto px-3 py-1.5 rounded-lg transition-colors  ${selectedPositionType === type
                            ? 'bg-white/10'
                            : 'hover:bg-white/5'
                            }`}
                    >
                        {getTypeIcon(type)}
                        <span>{type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}</span>
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {filteredOfferings.map((offering, index) => {
                    const isEnabled = offering.chainId === Number(chainId);
                    return (
                        <div
                            key={index}
                            className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
                        >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <TokenChainIcon src={offering.logo || ""} alt={offering.protocol || ""} size={"lg"} chainId={Number(offering.chainId)} />

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-medium">{offering.protocol}</h3>
                                        <span className={`text-sm ${getTypeColor(offering.type)} hidden sm:block`}>
                                            {offering.type}
                                        </span>
                                        <span className="text-white/40 hidden sm:block">•</span>
                                        <span className="text-sm text-white/60">
                                            {
                                                offering.tokens.map((token) => `${token.symbol} `)
                                            }
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div>
                                            <span className="text-sm text-white/60">Base APY</span>
                                            <div className={`${offering.type === 'BORROWING' ? 'text-red-400' : 'text-emerald-400'
                                                }`}>
                                                {offering.apy || "0"} %
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={async () => {
                                        if (Number(chainId) === Number(offering.chainId)) {
                                            const position = positions.find(position => position.address === offering.address && position.protocol === offering.protocol)
                                            handleAction(
                                                getAddActionName({ type: offering.type }),
                                                position || offering
                                            );
                                        } else {
                                            await switchChain(parseInt(numberToHex(Number(offering.chainId)), 16));
                                        }
                                    }
                                    }
                                    className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg ${isEnabled ? "" : "opacity-70"}`}
                                    disabled={!isEnabled}
                                >
                                    Get Started
                                </button>
                            </div>
                        </div>
                    )
                })}
                {
                    filteredOfferings.length === 0 &&
                    <div className='w-full h-[30vh] flex justify-center items-center align-center'>
                        <h2 className='text-white/60 italic'>Empty list</h2>
                    </div>
                }
            </div>
        </div>
    )
}