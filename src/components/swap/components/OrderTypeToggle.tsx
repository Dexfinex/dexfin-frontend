import {OrderType} from "../../../types/swap.type.ts";

interface OrderTypeToggleProps {
  type: OrderType;
  onTypeChange: (type: OrderType) => void;
}

export function OrderTypeToggle({ type, onTypeChange }: OrderTypeToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-[#191919] rounded-lg p-1 mb-4">
      <button
        onClick={() => onTypeChange('market')}
        className={`flex-1 px-4 py-1.5 rounded-md text-sm font-medium transition-all hover-effect ${
          type === 'market'
            ? 'bg-[#222] text-white shadow-sm'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        Market
      </button>
      <button
        onClick={() => onTypeChange('limit')}
        className={`flex-1 px-4 py-1.5 rounded-md text-sm font-medium transition-all hover-effect ${
          type === 'limit'
            ? 'bg-[#222] text-white shadow-sm'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        Limit
      </button>
    </div>
  );
}