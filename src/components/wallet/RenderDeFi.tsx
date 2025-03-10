import React from "react";

import { PositionList } from "./PositionList.tsx";

import useDefiStore from "../../store/useDefiStore";
import { formatNumberByFrac, formatHealthFactor } from "../../utils/common.util";

const RenderDefi: React.FC = () => {

    const { protocol, netAPY, healthFactor, } = useDefiStore();
    const total_usd_value = protocol.reduce((sum, p) => sum + Number(p.total_usd_value) || 0, 0);
    const total_unclaimed_usd_value = protocol.reduce((sum, p) => sum + Number(p.total_unclaimed_usd_value) || 0, 0);
    const isHealthy = formatHealthFactor(healthFactor) === "∞";

    return (
        <div className="space-y-6 mt-4 sm:mt-5 mx-4 flex-1 overflow-y-auto ai-chat-scrollbar sm:max-h-[calc(100vh-350px)] max-h-[calc(100vh-290px)]">
            {/* DeFi Overview */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs sm:text-sm text-white/60">Total Value Locked</div>
                    <div className="text-xl sm:text-2xl font-bold mt-1">
                        {`$${formatNumberByFrac(total_usd_value)}`}
                    </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs sm:text-sm text-white/60">Net APY</div>
                    <div className="text-xl sm:text-2xl font-bold mt-1">
                        {`${formatNumberByFrac(netAPY)}%`}
                    </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs sm:text-sm text-white/60">Total Rewards</div>
                    <div className="text-xl sm:text-2xl font-bold mt-1">
                        {`$ ${total_unclaimed_usd_value}`}
                    </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs sm:text-sm text-white/60">Health Status</div>
                    <div className={`text-xl sm:text-2xl font-bold mt-1 ${isHealthy ? "text-green-400" : "text-red-400"}`}>
                        {isHealthy ? "Healthy" : "Risk"}
                    </div>
                </div>
            </div>

            {/* DeFi Positions */}
            <div className="space-y-3">
                <PositionList isLoading={false} />
            </div>
        </div>
    )
}



export default RenderDefi;