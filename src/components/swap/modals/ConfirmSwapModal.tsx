import { X, ArrowDown, Info } from 'lucide-react';
import {TokenType} from "../../../types/swap.type.ts";

interface ConfirmSwapModalProps {
  fromToken: TokenType;
  toToken: TokenType;
  fromAmount: string;
  toAmount: string;
  priceImpact: number;
  slippage: number;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmSwapModal({
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  priceImpact,
  slippage,
  onConfirm,
  onClose,
}: ConfirmSwapModalProps) {
  const formattedPriceImpact = Math.abs(priceImpact).toFixed(2);
  const isPriceImpactHigh = Math.abs(priceImpact) > 5;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#111]/95 rounded-2xl w-full max-w-md border border-white/5">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Confirm Swap</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Token amounts */}
          <div className="space-y-2">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <img src={fromToken.logoURI} alt={fromToken.symbol} className="w-8 h-8 rounded-full" />
                <div>
                  <div className="text-2xl font-medium text-white">{fromAmount}</div>
                  <div className="text-sm text-gray-400">{fromToken.symbol}</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-white/5 p-2 rounded-lg">
                <ArrowDown className="w-4 h-4" />
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <img src={toToken.logoURI} alt={toToken.symbol} className="w-8 h-8 rounded-full" />
                <div>
                  <div className="text-2xl font-medium text-white">{toAmount}</div>
                  <div className="text-sm text-gray-400">{toToken.symbol}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Swap details */}
          <div className="space-y-2 bg-white/5 rounded-xl p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Rate</span>
              <span className="text-white">
                1 {fromToken.symbol} = {(Number(toAmount) / Number(fromAmount)).toFixed(4)} {toToken.symbol}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1">
                <span className="text-gray-400">Price Impact</span>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
              <span className={`${isPriceImpactHigh ? 'text-red-500' : 'text-white'}`}>
                {formattedPriceImpact}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Slippage Tolerance</span>
              <span className="text-white">{slippage}%</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={onConfirm}
            className={`w-full py-3 px-4 rounded-xl font-medium transition-colors ${
              isPriceImpactHigh
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isPriceImpactHigh ? 'Swap Anyway' : 'Confirm Swap'}
          </button>
        </div>
      </div>
    </div>
  );
}