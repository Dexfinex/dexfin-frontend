import React, { useContext } from "react";
import { Skeleton } from '@chakra-ui/react';

import { Web3AuthContext } from "../../providers/Web3AuthContext";
import { TokenChainListIcon } from '../swap/components/TokenIcon';
import useDefiStore, { Position } from '../../store/useDefiStore';
import { getTypeIcon, getTypeColor, } from "../../utils/defi.util";
import { offerings } from "../../constants/mock/defi";
import { TokenIcon } from "../swap/components/TokenIcon";
import { useGetDefillamaPoolByInfo } from "../../hooks/useDefillama";
import useDefillamaStore from "../../store/useDefillamaStore";
import { formatNumberByFrac, formatNumber } from "../../utils/common.util";
import { getAddActionName } from "../../utils/defi.util";

interface OfferingListProps {
    setSelectedPositionType: (position: Position['type'] | 'ALL') => void,
    selectedPositionType: Position['type'] | 'ALL',
    handleAction: (type: string, position: Position, apyToken: string, supportedChains: number[]) => void,
}

export const OfferingList: React.FC<OfferingListProps> = ({ setSelectedPositionType, selectedPositionType, handleAction }) => {

    const CATEGORY_LIST = ['LENDING', 'BORROWING', 'STAKING', 'LIQUIDITY'] as Position['type'][]

    const { isConnected } = useContext(Web3AuthContext);
    const { positions } = useDefiStore();
    const { getOfferingPoolByChainId } = useDefillamaStore();

    const offeringLoading = offerings.map((item) => {
        const result: Record<string, boolean> = {};
        const chainId = item.chainId;
        const id = `chain-id-${chainId}-protocol-${item.protocol_id}-symbol-${item.apyToken}`;
        const { isLoading } = useGetDefillamaPoolByInfo({
            "chainId": chainId,
            "protocol": item.protocol_id,
            "symbol": item.apyToken
        });
        result[id] = isLoading;
        return result;
    });

    const offeringLoadingList = offeringLoading.reduce((obj, current) => ({ ...obj, ...current }), {});


    const filteredOfferings = offerings.filter(o => selectedPositionType === 'ALL' || o.type.toLowerCase() === selectedPositionType.toLowerCase());


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
                <div className="flex-row hidden md:flex items-start text-white">
                    <div className="flex w-full">Assets</div>
                    <div className="flex w-full">Yield Type</div>
                    <div className="flex w-full">Tokens</div>
                    <div className="flex w-full">TVL</div>
                    <div className="flex w-full">APY</div>
                    <div className="flex w-full"></div>
                </div>
                {filteredOfferings.map((offering, index) => {
                    const isEnabled = isConnected && !offering?.disabled;
                    const chainId = offering.chainId;
                    const poolInfo = getOfferingPoolByChainId(chainId, offering.protocol_id, offering.apyToken);
                    const id = `chain-id-${offering.chainId}-protocol-${offering.protocol_id}-symbol-${offering.apyToken}`;
                    const isLoading = offeringLoadingList[id];

                    return (
                        <div
                            key={chainId + offering.protocol_id + offering.apyToken + index}
                            className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
                        >
                            <div className="md:flex md:flex-row grid grid-cols-2 sm:grid-cols-3 items-start items-center gap-4">
                                <div className="flex w-full items-center gap-2">
                                    <TokenChainListIcon src={offering.logo || ""} alt={offering.protocol || ""} size={"lg"} chainIds={[offering.chainId]} />
                                    <h3 className="font-medium">{offering.protocol}</h3>
                                </div>
                                <div className="flex w-full items-center gap-2">
                                    <span className={`text-sm ${getTypeColor(offering.type)}`}>
                                        {offering.type}
                                    </span>
                                </div>
                                <div className="flex w-full items-center">
                                    {
                                        offering.tokens.map((token, index) => ((offering.type === "Borrowed" || offering.type === "Supplied") && index === 0) || ((offering.type === "Liquidity") && index === 2) ? "" : <TokenIcon src={token.logo} alt={token.symbol} size="sm" key={offering.address + index} />)
                                    }
                                    <span className="ml-2 text-sm text-white/60">
                                        {
                                            offering.tokens.map((token, index) => ((offering.type === "Borrowed" || offering.type === "Supplied") && index === 0) || ((offering.type === "Liquidity") && index === 2) ? "" : `${token?.symbol} `)
                                        }
                                    </span>
                                </div>
                                <div className="flex w-full items-center gap-2">
                                    <div className={'text-emerald-400'}>
                                        {
                                            isLoading ? <Skeleton startColor="#444" endColor="#1d2837" w={'4rem'} h={'1rem'}></Skeleton>
                                                : <div className="flex gap-1"><span className="block md:hidden">TVL</span>{`$${formatNumber(Number(poolInfo?.tvlUsd) || 0)}`}</div>
                                        }
                                    </div>
                                </div>
                                <div className="flex w-full items-center gap-2">
                                    <div className={`${offering?.type?.toUpperCase() === 'BORROWING' ? 'text-red-400' : 'text-emerald-400'
                                        }`}>
                                        {isLoading ? <Skeleton startColor="#444" endColor="#1d2837" w={'4rem'} h={'1rem'}></Skeleton>
                                            : <div className="flex gap-1"><span className="block md:hidden">APY</span> {`${formatNumberByFrac(poolInfo?.apy) || "0"}%`}</div>
                                        }
                                    </div>
                                </div>

                                <div className="flex w-full items-center">
                                    <button
                                        onClick={async () => {
                                            const position = positions.find(position => position.address === offering.address && position.protocol === offering.protocol);
                                            let data = (position && offering.protocol_id !== "pendle")
                                                ? { ...position, apy: Number(poolInfo?.apy) }
                                                : { ...offering, apy: Number(poolInfo?.apy), id: index + "", chainId: offering.chainId }
                                            const supportedChains = [... new Set(offerings.filter((item => item.protocol_id === offering.protocol_id && item.address === offering.address)).map(item => item.chainId))];
                                            handleAction(
                                                getAddActionName({ type: offering.type }),
                                                data,
                                                offering.apyToken,
                                                supportedChains,
                                            );
                                        }}
                                        className={`truncate text-sm px-4 py-2 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg ${isEnabled ? "" : "opacity-70"}`}
                                        disabled={!isEnabled}
                                    >
                                        Get Started
                                    </button>
                                </div>
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