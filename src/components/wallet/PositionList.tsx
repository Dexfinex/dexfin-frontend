import React from "react";
import { Skeleton } from '@chakra-ui/react';

import useDefiStore from '../../store/useDefiStore';
import { getTypeColor } from "../../utils/defi.util";
import { formatNumberByFrac, formatHealthFactor } from "../../utils/common.util";
import { TokenChainIcon, TokenIcon } from "../swap/components/TokenIcon";


interface PositionListProps {
    isLoading: boolean,

}

export const PositionList: React.FC<PositionListProps> = ({ isLoading }) => {
    const { positions } = useDefiStore();

    return (
        <div className="space-y-3">

            {
                positions.length === 0 && isLoading && <Skeleton startColor="#444" className='rounded-xl' endColor="#1d2837" w={'100%'} h={'7rem'}></Skeleton>
            }
            {
                positions
                    .map((position, index) => {
                        return (
                            isLoading ? <Skeleton startColor="#444" className='rounded-xl' endColor="#1d2837" w={'100%'} h={'7rem'} key={`sk-${index}`}></Skeleton>
                                : <div
                                    key={index}
                                    className="p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <TokenChainIcon
                                                src={position.logo}
                                                alt={position.protocol}
                                                chainId={position.chainId}
                                                size="lg"
                                                className="w-8 h-8"
                                            />
                                            <div className="items-center justify-between ">
                                                <div className="flex items-center justify-between mb-1 gap-2">
                                                    <div className="text-sm sm:text-md font-medium">{position.protocol}</div>
                                                    <div className={`text-xs sm:text-sm ${getTypeColor(position.type)} text-white/60`}>{position.type}</div>
                                                </div>
                                                <div className="flex text-right gap-1 ml-3">
                                                    <div className="flex text-md sm:text-lg font-medium">
                                                        {
                                                            position.tokens.map((token, index) => ((position.type === "Borrowed" || position.type === "Supplied") && index === 0) || ((position.type === "Liquidity") && index === 2) ? "" : <TokenIcon src={token.logo} alt={token.symbol} size="sm" />)
                                                        }
                                                    </div>
                                                    <div className="text-xs sm:text-sm text-green-400">
                                                        {
                                                            position.tokens.map((token, index) => ((position.type === "Borrowed" || position.type === "Supplied") && index === 0) || ((position.type === "Liquidity") && index === 2) ? "" : `${token?.symbol} `)
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>



                                    <div className="flex items-center gap-4 text-xs sm:text-sm">
                                        <div>
                                            <span className="text-sm text-white/60">Amount</span>
                                            <div className="text-lg">${formatNumberByFrac(position.amount)}</div>
                                        </div>
                                        {position.apy && (
                                            <div>
                                                <span className="text-sm text-white/60">APY</span>
                                                <div className="text-emerald-400">{(formatNumberByFrac(position.apy) || "0")}%</div>
                                            </div>
                                        )}
                                        {Number(position?.rewards) > 0 && (
                                            <div>
                                                <span className="text-sm text-white/60">APY</span>
                                                <div className="text-emerald-400">{(formatNumberByFrac(position.apy) || "0")}%</div>
                                            </div>
                                        )}
                                        {!!position.healthFactor && (
                                            <div>
                                                <span className="text-sm text-white/60">Health Factor</span>
                                                <div className="text-emerald-400">{formatHealthFactor(position.healthFactor)}</div>
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