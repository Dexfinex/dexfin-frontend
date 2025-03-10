import React from "react";

const CustomTooltip: React.FC<{ active?: boolean; payload?: any[]; }> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return <div className="text-green-500 text-sm font-bold flex flex-col items-center">
            <span>{payload[0]?.payload.time}</span>
            <span>${payload[0].value}</span>
        </div>
    }
    return null;
}

export default CustomTooltip;