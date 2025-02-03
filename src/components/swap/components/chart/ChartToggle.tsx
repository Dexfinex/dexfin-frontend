import {CandlestickChart, LineChart} from 'lucide-react';
import {ChartType} from "../../../../types/swap.type.ts";

interface ChartToggleProps {
    type: ChartType;
    onTypeChange: (type: ChartType) => void;
}

export function ChartToggle({type, onTypeChange}: ChartToggleProps) {

    return (
        <div className="relative p-0.5 bg-[#191919] rounded-lg shadow-xl ring-1 ring-white/10">
            {/* Background Slider */}
            <div
                className={`absolute inset-y-0.5 w-[calc(50%-2px)] bg-gradient-to-r from-blue-500/20 via-blue-400/20 to-blue-500/20 rounded-md transition-all duration-300 ease-out ${
                    type === 'tradingview' ? 'translate-x-full' : 'translate-x-0'
                }`}
            />

            {/* Buttons */}
            <div className="relative flex">
                <button
                    onClick={() => onTypeChange('line')}
                    className={`relative z-10 flex items-center gap-1.5 w-32 justify-center px-3 py-1.5 rounded-md transition-all duration-300 ${
                        type === 'line'
                            ? 'text-white'
                            : 'text-white hover:text-white'
                    }`}
                >
                    <LineChart className="w-3.5 h-3.5"/>
                    <span className="text-xs font-medium">Line</span>
                </button>
                <button
                    onClick={() => onTypeChange('tradingview')}
                    className={`relative z-10 flex items-center gap-1.5 w-32 justify-center px-3 py-1.5 rounded-md transition-all duration-300 ${
                        type === 'tradingview'
                            ? 'text-white'
                            : 'text-white hover:text-white'
                    }`}
                >
                    <CandlestickChart className="w-3.5 h-3.5"/>
                    <span className="text-xs font-medium">Trading View</span>
                </button>
            </div>
        </div>
    );
}