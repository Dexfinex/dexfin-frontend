import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

import { formatNumberByFrac } from "../../utils/common.util";

interface PNLProps {
    pnlUsd: number;
    pnlPercent?: number;
    label?: string;
}

const PNL: React.FC<PNLProps> = ({ pnlUsd, pnlPercent, label = "" }) => {
    return (
        <div className={`flex items-center gap-1 mt-1 ${pnlUsd > 0 ? "text-green-400" : "text-red-400"}`}>
            {
                pnlUsd === 0 ? null : pnlUsd > 0 ? <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            }
            <span className="text-xs sm:text-sm">
                {pnlUsd >= 0 ? "$" : "-$"}{formatNumberByFrac(Math.abs(pnlUsd))} {`(${formatNumberByFrac(pnlPercent || 0)}%)`} {label}
            </span>
        </div>
    )
}

export default PNL;