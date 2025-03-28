import {TimeRange} from "../../../../types/swap.type";

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: '1H', label: '1H' },
  { value: '1D', label: '1D' },
  { value: '1W', label: '1W' },
  { value: '1M', label: '1M' },
  { value: '1Y', label: '1Y' },
];

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="flex items-center gap-0.5 rounded-lg p-1 ring-1 ring-white/10">
      {TIME_RANGES.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
            value === range.value
              ? 'bg-blue-500/20 text-blue-400 shadow-inner shadow-blue-500/10 font-semibold'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}