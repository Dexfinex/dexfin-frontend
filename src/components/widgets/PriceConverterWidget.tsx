import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, ArrowDownUp } from 'lucide-react';
import { TokenSelectorModal } from '../swap/components/TokenSelectorModal';
import { TokenType } from '../../types/swap.type';
import useGetTokenPrices from '../../hooks/useGetTokenPrices';
import { NULL_ADDRESS } from "../../constants";
import { mapChainId2NativeAddress } from "../../config/networks.ts";

const formatSpecialNumber = (num: number): string => {
  if (num === 0) return '0.00';

  let str = num.toFixed(20).replace(/\.?0+$/, '');

  const match = str.match(/^0\.0+[1-9]/);
  if (match) {
    const zeroMatch = str.match(/^0\.(0+)[1-9]/);
    const zeroCount = zeroMatch ? zeroMatch[1].length : 0;

    if (zeroCount >= 3) {
      const firstNonZero = str.replace(/^0\.0+/, '');
      const subscriptNumber = zeroCount.toString().split('').map(num => {
        const subscripts = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
        return subscripts[parseInt(num)];
      }).join('');

      return `0.0${subscriptNumber}${firstNonZero.slice(0, 4)}`;
    }
  }

  return Number(str).toFixed(4).replace(/\.?0+$/, '');
};

export const PriceConverterWidget: React.FC = () => {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [showFromSelector, setShowFromSelector] = useState(false);
  const [showToSelector, setShowToSelector] = useState(false);

  const [toRealCurrency, setToRealCurrency] = useState<TokenType | null>({
    symbol: 'ETH',
    name: 'Ethereum',
    address: NULL_ADDRESS,
    chainId: 1,
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  });

  const [fromRealCurrency, setFromRealCurrency] = useState<TokenType | null>({
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    chainId: 1,
    decimals: 6,
    logoURI: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
  });

  const tokenChainId = fromRealCurrency?.chainId ?? toRealCurrency!.chainId;
  const nativeTokenAddress = mapChainId2NativeAddress[tokenChainId];

  const tokenAddresses = useMemo(() => {
    try {
      const _tokenAddresses = [
        (fromRealCurrency?.address || "").toLowerCase(),
        (toRealCurrency?.address || "").toLowerCase(),
        nativeTokenAddress.toLowerCase()
      ];
      return [...new Set(_tokenAddresses.filter(addr => addr))];
    } catch (e) {
      return [];
    }
  }, [fromRealCurrency, toRealCurrency, nativeTokenAddress]);

  const { isLoading: isLoadingTokenPrices, refetch: refetchTokenPrices, data: tokenPrices } = useGetTokenPrices({
    tokenAddresses: tokenAddresses,
    chainId: tokenChainId,
  });

  const rate = useMemo(() => {
    if (!fromRealCurrency || !toRealCurrency || !tokenPrices) return 0;

    const fromTokenPrice = Number(tokenPrices[`${tokenChainId}:${fromRealCurrency.address.toLowerCase()}`]) || 0;
    const toTokenPrice = Number(tokenPrices[`${tokenChainId}:${toRealCurrency.address.toLowerCase()}`]) || 0;

    if (fromTokenPrice && toTokenPrice) {
      const calculatedRate = fromTokenPrice / toTokenPrice;
      return calculatedRate;
    }
    return 0;
  }, [fromRealCurrency, toRealCurrency, tokenPrices, tokenChainId]);

  const calculateToAmount = (fromValue: string, currentRate: number) => {
    if (!fromValue || !currentRate) return '0.00';
    const calculated = parseFloat(fromValue) * currentRate;
    return formatSpecialNumber(calculated);
  };

  const calculateFromAmount = (toValue: string, currentRate: number) => {
    if (!toValue || !currentRate) return '0.00';
    const calculated = parseFloat(toValue) / currentRate;
    return formatSpecialNumber(calculated);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    setToAmount(calculateToAmount(value, rate));
  };

  const handleToAmountChange = (value: string) => {
    setToAmount(value);
    setFromAmount(calculateFromAmount(value, rate));
  };

  const handleSwitch = () => {
    const tempToken = fromRealCurrency;
    const tempAmount = fromAmount;
    setFromRealCurrency(toRealCurrency);
    setToRealCurrency(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const updateFetchedTime = async () => {
    setLastUpdated(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refetchTokenPrices();
      updateFetchedTime();
    }, 10000);
    return () => clearInterval(interval);
  }, [refetchTokenPrices]);

  useEffect(() => {
    if (fromAmount) {
      setToAmount(calculateToAmount(fromAmount, rate));
    }
  }, [rate]);

  return (
    <div className="p-2 h-full flex flex-col">
      <TokenSelectorModal
        isOpen={showFromSelector}
        onClose={() => setShowFromSelector(false)}
        onSelect={setFromRealCurrency}
        selectedToken={fromRealCurrency}
      />
      <TokenSelectorModal
        isOpen={showToSelector}
        onClose={() => setShowToSelector(false)}
        onSelect={setToRealCurrency}
        selectedToken={toRealCurrency}
      />
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
            </div>
            <input
              type="number"
              value={fromAmount}
              disabled={isLoadingTokenPrices}
              onChange={(e) => handleFromAmountChange(e.target.value)}
              className="flex-1 bg-transparent text-right outline-none text-sm"
              placeholder="0.00"
              min="0"
            />
          </div>
        </div>

        <div className="relative h-8 flex items-center justify-center">
          <div className="z-30 flex gap-2">
            <button
              onClick={handleSwitch}
              className="bg-[#1d2837] hover:bg-blue-500/20 p-2.5 rounded-xl border border-white/10 transition-all hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl hover:border-blue-500/20 text-blue-400"
            >
              <ArrowDownUp className="w-3 h-3" />
            </button>
          </div>
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
            </div>
            <div className="flex-1 text-right text-sm">
              {toAmount || '0.00'}
            </div>
          </div>
        </div>

        <div className="text-center mt-1">
          <div className="text-[10px] text-white/40">
            Last updated: {lastUpdated} • Rate refreshes every 10 seconds
          </div>
          <div className="text-[10px] text-white/60 mt-0.5">
            1 {fromRealCurrency?.symbol} = {formatSpecialNumber(rate)} {toRealCurrency?.symbol}
          </div>
        </div>
      </div>
    </div>
  );
};