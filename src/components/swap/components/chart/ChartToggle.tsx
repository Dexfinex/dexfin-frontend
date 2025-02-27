import { CandlestickChart, LineChart } from "lucide-react"
import type { ChartType } from "../../../../types/swap.type"

interface ChartToggleProps {
  type: ChartType
  onTypeChange: (type: ChartType) => void
}

export function ChartToggle({ type, onTypeChange }: ChartToggleProps) {
  return (
    <div className="relative p-0.5 rounded-lg shadow-xl ring-1 ring-white/10 mr-2 shrink-0">
      {/* Background Slider */}
      <div
        className={`absolute inset-y-0.5 w-[calc(50%-2px)] bg-gradient-to-r from-blue-500/20 via-blue-400/20 to-blue-500/20 rounded-md transition-all duration-300 ease-out ${
          type === "tradingview" ? "translate-x-full" : "translate-x-0"
        }`}
      />

      {/* Buttons */}
      <div className="relative flex">
        <button
          onClick={() => onTypeChange("line")}
          className={`relative z-10 flex items-center gap-1.5 justify-center px-2 sm:px-3 py-1.5 rounded-md transition-all duration-300 min-w-[40px] ${
            type === "line" ? "text-white" : "text-white hover:text-white"
          }`}
        >
          <LineChart className="w-3.5 h-3.5 shrink-0" />
          {/*<span className="hidden sm:inline text-xs font-medium whitespace-nowrap">Line</span>*/}
        </button>
        <button
          onClick={() => onTypeChange("tradingview")}
          className={`relative z-10 flex items-center gap-1.5 justify-center px-2 sm:px-3 py-1.5 rounded-md transition-all duration-300 min-w-[40px] ${
            type === "tradingview" ? "text-white" : "text-white hover:text-white"
          }`}
        >
          <CandlestickChart className="w-3.5 h-3.5 shrink-0" />
          {/*<span className="hidden sm:inline text-xs font-medium whitespace-nowrap">Trading View</span>*/}
        </button>
      </div>
    </div>
  )
}

