import React,{ useState } from 'react';
import { Settings, Info } from 'lucide-react';
import {SlippageOption} from "../../types/swap.type";

interface SlippageSettingsProps {
  value: SlippageOption;
  onChange: (value: SlippageOption) => void;
}

const PRESET_OPTIONS: SlippageOption[] = [0.1, 0.5, 1];

export function SlippageSettings({ value, onChange }: SlippageSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomValue(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      onChange(num);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-white/5 transition-all hover:scale-110 active:scale-95"
      >
        <Settings className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[200]">
          <div className="bg-[#111]/95 rounded-2xl w-full max-w-md border border-white/5 shadow-2xl">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">Slippage Settings</h3>
                <div className="group relative">
                  <Info className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-black/90 text-xs text-gray-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Slippage is the difference between expected and actual price due to market volatility
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-2xl text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Slippage Tolerance</label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_OPTIONS.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        onChange(option);
                        setCustomValue('');
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        value === option && !customValue
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {option}%
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Custom Value</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={customValue}
                      onChange={handleCustomChange}
                      placeholder="Enter custom percentage"
                      className="w-full bg-white/5 rounded-xl px-4 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Higher slippage increases chance of successful trade but may result in worse price
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}