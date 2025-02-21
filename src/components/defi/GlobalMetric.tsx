import React from "react";
import { BarChart2, Coins, Shield, TrendingUp, Wallet, } from 'lucide-react';
import { Skeleton } from '@chakra-ui/react';

import useDefiStore from "../../store/useDefiStore";

import { formatHealthFactor, formatNumberByFrac } from "../../utils/common.util";

interface GlobalMetricProps {
    isLoading: boolean,
}

const GlobalMetric: React.FC<GlobalMetricProps> = ({ isLoading, }) => {

    const { protocol, netAPY, healthFactor, } = useDefiStore();

    return (
        <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-white/60">Total Value Locked</span>
                </div>
                <div className="text-2xl font-bold mb-1">
                    {
                        isLoading ? <Skeleton startColor="#444" endColor="#1d2837" w={'100%'} h={'2rem'}></Skeleton>
                            : formatNumberByFrac(protocol.total_usd_value)
                    }
                </div>
                <div className="flex items-center gap-1 text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>0 %</span>
                    <span className="text-white/60">24h</span>
                </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <BarChart2 className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-white/60">Net APY</span>
                </div>
                <div className="text-2xl font-bold mb-1">
                    {
                        isLoading ? <Skeleton startColor="#444" endColor="#1d2837" w={'100%'} h={'2rem'}></Skeleton>
                            : `+ ${formatNumberByFrac(netAPY)}%`
                    }

                </div>
                <div className="text-sm text-white/60">
                    Across all positions
                </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Coins className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-white/60">Total Rewards</span>
                </div>
                <div className="text-2xl font-bold mb-1">
                    {
                        isLoading ? <Skeleton startColor="#444" endColor="#1d2837" w={'100%'} h={'2rem'}></Skeleton>
                            : `+$ ${protocol.total_unclaimed_usd_value}`
                    }
                </div>
                <div className="text-sm text-white/60">
                    Unclaimed rewards
                </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-white/60">Health Status</span>
                </div>
                <div className="text-2xl font-bold text-green-400 mb-1">
                    Healthy
                </div>
                <div className="text-sm text-white/60">
                    All positions safe ({formatHealthFactor(healthFactor)})
                </div>
            </div>
        </div>
    )
}

export default GlobalMetric;