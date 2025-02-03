import {TrendingUp, TrendingDown} from 'lucide-react';
import {TimeRange} from "../../../types/swap.type.ts";
import {formatNumberByFrac} from "../../../utils/common.util.ts";

interface TokenPriceProps {
    price: number;
    change: number;
    showChange?: boolean;
    timeRange?: TimeRange;
}

export function TokenPrice({price, change, showChange = true, timeRange = '24h'}: TokenPriceProps) {
    const Icon = change >= 0 ? TrendingUp : TrendingDown;

    return (
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold tracking-tight text-white group-hover:text-blue-400/90 transition-colors">
            ${formatNumberByFrac(price, 5)}
          </span>
            {showChange && (
                <div className={`flex items-center gap-1.5 ${change >= 0 ? 'text-green-500' : 'text-red-500'} ml-2`}>
                    <Icon className="w-3.5 h-3.5"/>
                    <span className="text-xs">{change >= 0 ? '+' : ''}{formatNumberByFrac(change, 2)}%</span>
                    <span className="text-white text-[10px]">Last {timeRange}</span>
                </div>
            )}
        </div>
    );
}