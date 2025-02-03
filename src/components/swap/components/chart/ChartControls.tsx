import { ChartToggle } from './ChartToggle';
import { TimeRangeSelector } from './TimeRangeSelector';
import {ChartType, TimeRange} from "../../../../types/swap.type";
interface ChartControlsProps {
  type: ChartType;
  timeRange: TimeRange;
  className?: string;
  onTypeChange: (type: ChartType) => void;
  onTimeRangeChange: (range: TimeRange) => void;
}

export function ChartControls({
  type,
  timeRange,
  className = '',
  onTypeChange,
  onTimeRangeChange,
}: ChartControlsProps) {
  return (
    <div className={"flex items-center justify-between ps-6 py-3 border-b border-white/5 bg-gradient-to-r from-black via-[#1d2837]/20 to-black relative z-40 " + className}>
      <TimeRangeSelector value={timeRange} onChange={onTimeRangeChange} />
      <ChartToggle type={type} onTypeChange={onTypeChange} />
    </div>
  );
}