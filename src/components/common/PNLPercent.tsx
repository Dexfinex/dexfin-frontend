import React from "react";

import NumberFormat from "./NumberFormat";

interface PNLPercentProps {
    pnlPercent: number;
}

const PNLPercent: React.FC<PNLPercentProps> = ({ pnlPercent }) => {
    return (
        <div className={`flex items-center gap-1 mt-1 ${pnlPercent > 0 ? "text-green-400" : "text-red-400"}`}>
            <span className="text-xs sm:text-sm">
                <NumberFormat number={pnlPercent || 0} suffix="%" />
            </span>
        </div>
    )
}

export default PNLPercent;