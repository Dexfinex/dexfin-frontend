import { Check, X } from 'lucide-react';
import {PaymentMethod} from "../../../types/swap.type.ts";

interface PaymentMethodModalProps {
  selectedMethods: PaymentMethod[];
  onMethodsChange: (methods: PaymentMethod[]) => void;
  onClose: () => void;
  methods: PaymentMethod[];
}

export function PaymentMethodModal({
  selectedMethods,
  onMethodsChange,
  onClose,
  methods,
}: PaymentMethodModalProps) {
  const handleSelectAll = () => onMethodsChange(methods);
  const handleDeselectAll = () => onMethodsChange([]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#111]/95 rounded-2xl w-full max-w-xl border border-white/5">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Select Holdings</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={selectedMethods.length === methods.length ? handleDeselectAll : handleSelectAll}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                {selectedMethods.length === methods.length ? 'Deselect All' : 'Select All'}
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          <div className="p-4 space-y-2">
            {methods.map((method) => (
              <button
                key={method.id}
                onClick={() => {
                  const isSelected = selectedMethods.some(m => m.id === method.id);
                  onMethodsChange(
                    isSelected
                      ? selectedMethods.filter(m => m.id !== method.id)
                      : [...selectedMethods, method]
                  );
                }}
                className={`w-full flex items-center justify-between p-3 rounded-lg border ${
                  selectedMethods.some(m => m.id === method.id)
                    ? 'bg-blue-500/10 border-blue-500/50'
                    : 'border-white/10 hover:border-white/20'
                } transition-colors group`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={method.icon} alt={method.name} className="w-8 h-8 rounded-full" />
                    {selectedMethods.some(m => m.id === method.id) && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{method.name}</span>
                      <span className={`text-xs ${
                        method.priceChange >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {method.priceChange >= 0 ? '+' : ''}{method.priceChange}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">${method.price.toLocaleString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{method.balance} {method.name}</div>
                  <div className="text-sm text-gray-400">
                    ${(method.balance * method.price).toLocaleString()}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-white/10 text-sm text-gray-400">
          <p>In 'Buy' mode, you can buy tokens with a combination of 5 Primary Tokens across all supported networks</p>
          <p className="mt-2">Dexfin will automatically find the payment combination with the lowest fees</p>
          <button className="mt-2 text-blue-400 hover:text-blue-300">Set default primary tokens</button>
        </div>
      </div>
    </div>
  );
}