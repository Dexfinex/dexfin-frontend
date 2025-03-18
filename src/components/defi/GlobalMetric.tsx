import React from "react";
import { BarChart2, Coins, Shield, TrendingUp, Wallet, } from 'lucide-react';
import { Skeleton } from '@chakra-ui/react';

import useDefiStore from "../../store/useDefiStore";

import { formatHealthFactor, formatNumberByFrac } from "../../utils/common.util";

interface GlobalMetricProps {
    isLoading: boolean,
}

const GlobalMetric: React.FC<GlobalMetricProps> = ({ isLoading, }) => {

    const { protocol, netAPY, healthFactor, totalLockedValue } = useDefiStore();
    const total_usd_value = totalLockedValue;
    const total_unclaimed_usd_value = protocol.reduce((sum, p) => sum + Number(p.total_unclaimed_usd_value) || 0, 0);
    const isHealthy = formatHealthFactor(healthFactor) === "∞";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-white/60">Total Value Locked</span>
                </div>
                <div className="text-2xl font-bold mb-1">
                    {
                        isLoading ? <Skeleton startColor="#444" endColor="#1d2837" w={'100%'} h={'2rem'}></Skeleton>
                            : `$${formatNumberByFrac(total_usd_value)}`
                    }
                </div>
                {/* <div className="flex items-center gap-1 text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>0 %</span>
                    <span className="text-white/60">24h</span>
                </div> */}
            </div>

            <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <BarChart2 className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-white/60">Net APY</span>
                </div>
                {
                    isLoading ? <Skeleton startColor="#444" endColor="#1d2837" w={'100%'} h={'2rem'}></Skeleton>
                        :
                        <>
                            <div className="text-2xl font-bold mb-1">
                                {`${formatNumberByFrac(netAPY)}%`}
                            </div>
                            <div className="text-sm text-white/60">
                                Across all positions
                            </div>
                        </>
                }
            </div>

            <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Coins className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-white/60">Total Rewards</span>
                </div>
                {
                    isLoading ? <Skeleton startColor="#444" endColor="#1d2837" w={'100%'} h={'2rem'}></Skeleton>
                        :
                        <>
                            <div className="text-2xl font-bold mb-1">
                                {`$ ${total_unclaimed_usd_value}`}
                            </div>
                            <div className="text-sm text-white/60">
                                Unclaimed rewards
                            </div>
                        </>
                }
            </div>

            <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-white/60">Health Status</span>
                </div>
                {
                    isLoading ? <Skeleton startColor="#444" endColor="#1d2837" w={'100%'} h={'2rem'}></Skeleton>
                        : <div className={`text-2xl font-bold ${isHealthy ? "text-green-400" : "text-red-400"} mb-1`}>
                            {isHealthy ? "Healthy" : "Risk"}
                        </div>
                }
                {
                    isLoading ? <Skeleton startColor="#444" className="mt-2" endColor="#1d2837" w={'40%'} h={'1rem'}></Skeleton>
                        : isHealthy ?
                            <div className="text-sm text-white/60">
                                All positions safe ({formatHealthFactor(healthFactor)})
                            </div>
                            : null
                }
            </div>
        </div>
    )
}

export default GlobalMetric;