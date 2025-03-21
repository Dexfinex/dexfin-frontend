import React from "react";

import useDefiStore from '../../store/useDefiStore';

import { getTypeIcon } from "../../utils/defi.util";
import { formatNumberByFrac } from "../../utils/common.util";
import { TokenIcon } from "../swap/components/TokenIcon";

interface ProtocolStatisticProps {

}

const ProtocolStatistic: React.FC<ProtocolStatisticProps> = () => {
    const { positions, protocolTypes } = useDefiStore();
    const protocolList = [...new Set(positions.map((position) => (position.protocol)))]

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Protocol Breakdown */}
            {
                protocolList.length > 0 &&
                <div className="bg-white/5 rounded-xl p-4">
                    <h3 className="text-lg font-medium mb-4">Protocol Breakdown</h3>
                    <div className="space-y-3">
                        {protocolList.map((protocol) => {
                            const protocolPositions = positions.filter(p => p.protocol === protocol);
                            const totalValue = protocolPositions.reduce((sum, p) => sum + p.amount, 0);
                            const totalTVL = positions.reduce((sum, p) => sum + p.amount, 0);

                            return (
                                <div key={protocol} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                                    <TokenIcon
                                        src={protocolPositions[0]?.logo}
                                        alt={protocol}
                                        className="w-8 h-8"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium">{protocol}</span>
                                            <span>${formatNumberByFrac(totalValue)}</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 transition-all"
                                                style={{ width: `${(totalValue / totalTVL) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {
                            protocolList.length === 0 &&
                            <div className='w-full h-[100px] flex justify-center items-center align-center'>
                                <h2 className='text-white/60 italic'>No data</h2>
                            </div>
                        }
                    </div>
                </div>
            }

            {/* Type Distribution */}
            {
                protocolTypes.length > 0 &&
                <div className="bg-white/5 rounded-xl p-4">
                    <h3 className="text-lg font-medium mb-4">Type Distribution</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {protocolTypes.map((type) => {
                            const typePositions = positions.filter(p => p.type === type);
                            const totalValue = typePositions.reduce((sum, p) => sum + p.amount, 0);
                            const totalTVL = positions.reduce((sum, p) => sum + p.amount, 0);

                            return (
                                <div key={type} className="p-4 bg-white/5 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(type)}
                                            <span className="font-medium">{type}</span>
                                        </div>
                                        <span className="text-sm text-white/60">
                                            {typePositions.length} positions
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/60">TVL Share</span>
                                        <span>{formatNumberByFrac((totalValue / totalTVL) * 100)}%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden mt-2">
                                        <div
                                            className="h-full bg-blue-500 transition-all"
                                            style={{ width: `${(totalValue / totalTVL) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {
                        protocolTypes.length === 0 &&
                        <div className='w-full h-[100px] flex justify-center items-center align-center'>
                            <h2 className='text-white/60 italic'>No data</h2>
                        </div>
                    }
                </div>
            }
        </div>
    )
}


export default ProtocolStatistic;