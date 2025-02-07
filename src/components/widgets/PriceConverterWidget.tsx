import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, RefreshCw} from 'lucide-react';
import {TokenSelectorModal} from '../swap/components/TokenSelectorModal';
import {TokenType} from '../../types/swap.type';
import useTokenStore from '../../store/useTokenStore';
import useGetTokenPrices from '../../hooks/useGetTokenPrices';
import {NULL_ADDRESS} from "../../constants";
import {mapChainId2NativeAddress} from "../../config/networks.ts";

export const PriceConverterWidget: React.FC = () => {
  const [fromAmount, setFromAmount] = useState('0');
  const [toAmount, setToAmount] = useState('0');
 
  const [toRealCurrency, setToRealCurrency] = useState<TokenType | null> ({
    symbol: 'ETH',
    name: 'Ethereum',
    address: NULL_ADDRESS,
    chainId: 1,
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  });
  const [fromRealCurrency, setFromRealCurrency] = useState<TokenType | null> ({
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    chainId: 1,
    decimals: 6,
    logoURI: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
});

  const [rate, setRate] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [showFromSelector, setShowFromSelector] = useState(false);
  const [showToSelector, setShowToSelector] = useState(false);
  const [loading, setLoading] = useState(false);

  const {getTokenPrice} = useTokenStore();
  const tokenChainId = fromRealCurrency ? fromRealCurrency.chainId : toRealCurrency!.chainId
  
  const nativeTokenAddress = mapChainId2NativeAddress[tokenChainId];

  useGetTokenPrices({
      tokenAddresses: [fromRealCurrency?.address ?? null, toRealCurrency?.address ?? null, nativeTokenAddress],
      chainId: tokenChainId,
  })

  const updateRate = async () => {
    try {
      
      const fromTokenPrice = fromRealCurrency ? getTokenPrice(fromRealCurrency?.address, fromRealCurrency?.chainId) : 0
      console.log(fromTokenPrice)

      const toTokenPrice = toRealCurrency ? getTokenPrice(toRealCurrency?.address, toRealCurrency?.chainId) : 0
      console.log(toTokenPrice);

      setLoading(true);
      
      if (fromTokenPrice && toTokenPrice) {
        const newRate = fromTokenPrice/ toTokenPrice;
        setRate(newRate);
        setLastUpdated(new Date().toLocaleTimeString());

        // Update amounts
        if (fromAmount !== '0') {
          const newToAmount = (parseFloat(fromAmount) * newRate).toString();
          setToAmount(newToAmount);
        }
      }
    } catch (error) {
      console.error('Error updating rate:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    if (rate && value) {
      const newToAmount = (parseFloat(value) * rate).toString();
      setToAmount(newToAmount);
    } else {
      setToAmount('0');
    }
  };

  const handleToAmountChange = (value: string) => {
    setToAmount(value);
    if (rate && value) {
      const newFromAmount = (parseFloat(value) / rate).toString();
      setFromAmount(newFromAmount);
    } else {
      setFromAmount('0');
    }
  };
  const {fromTokenPrice, toTokenPrice} = useMemo(() => {
    const fromTokenPrice = fromRealCurrency ? getTokenPrice(fromRealCurrency?.address, fromRealCurrency?.chainId) : 0
    const toTokenPrice = toRealCurrency ? getTokenPrice(toRealCurrency?.address, toRealCurrency?.chainId) : 0
    return {
      fromTokenPrice,
      toTokenPrice
    }
  }, [fromRealCurrency, getTokenPrice, toRealCurrency, tokenChainId])

  useEffect(() => {
    updateRate();
    const interval = setInterval(updateRate, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [fromRealCurrency, toRealCurrency, fromTokenPrice, toTokenPrice]);

  return (
    <div className="p-2 h-full flex flex-col">
      <div className="space-y-2">
        <div className="bg-white/5 rounded-xl p-2">
          <div className="text-xs text-white/60 mb-1">You have</div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => {
                  setShowFromSelector(true);
                  setShowToSelector(false);
                }}
                className="flex items-center gap-1.5 px-1.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <img src={fromRealCurrency?.logoURI} alt={fromRealCurrency?.symbol} className="w-4 h-4" />
                <span className="text-xs">{fromRealCurrency?.symbol}</span>
                <ChevronDown className="w-3 h-3 text-white/60" />
              </button>
              <TokenSelectorModal
                isOpen={showFromSelector}
                onClose={() => setShowFromSelector(false)}
                onSelect={setFromRealCurrency}
                selectedToken={fromRealCurrency}
              />
            </div>
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => handleFromAmountChange(e.target.value)}
              className="flex-1 bg-transparent text-right outline-none text-sm"
              placeholder="0.00"
              min="0"
            />
          </div>
        </div>

        <div className="flex justify-center -my-1 relative z-[1]">
          <button 
            onClick={updateRate}
            className={`p-1 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors ${
              loading ? 'opacity-50' : ''
            }`}
            disabled={loading}
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="bg-white/5 rounded-xl p-2">
          <div className="text-xs text-white/60 mb-1">You get</div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => {
                  setShowToSelector(true);
                  setShowFromSelector(false);
                }}
                className="flex items-center gap-1.5 px-1.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <img src={toRealCurrency?.logoURI} alt={toRealCurrency?.symbol} className="w-4 h-4" />
                <span className="text-xs">{toRealCurrency?.symbol}</span>
                <ChevronDown className="w-3 h-3 text-white/60" />
              </button>
              <TokenSelectorModal
                isOpen={showToSelector}
                onClose={() => setShowToSelector(false)}
                onSelect={setToRealCurrency}
                selectedToken={toRealCurrency}
              />
            </div>
            <input
              type="number"
              value={toAmount}
              onChange={(e) => handleToAmountChange(e.target.value)}
              className="flex-1 bg-transparent text-right outline-none text-sm"
              placeholder="0.00"
              min="0"
            />
          </div>
        </div>

        <div className="text-center mt-1">
          <div className="text-[10px] text-white/40">
            Last updated: {lastUpdated} • Rate refreshes every 10 seconds
          </div>
          <div className="text-[10px] text-white/60 mt-0.5">
            1 {fromRealCurrency?.symbol} = {rate?.toFixed(8)} {toRealCurrency?.symbol}
          </div>
        </div>
      </div>
    </div>
  );
};