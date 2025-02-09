import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, RefreshCw, } from 'lucide-react';
import { TokenSelectorModal } from '../swap/components/TokenSelectorModal';
import { TokenType } from '../../types/swap.type';
import useGetTokenPrices from '../../hooks/useGetTokenPrices';
import { NULL_ADDRESS } from "../../constants";
import { mapChainId2NativeAddress } from "../../config/networks.ts";
import { formatNumberByFrac } from '../../utils/common.util.ts';

export const PriceConverterWidget: React.FC = () => {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');

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

  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [showFromSelector, setShowFromSelector] = useState(false);
  const [showToSelector, setShowToSelector] = useState(false);

  const tokenChainId = fromRealCurrency ? fromRealCurrency.chainId : toRealCurrency!.chainId

  const nativeTokenAddress = mapChainId2NativeAddress[tokenChainId];

  const { isLoading: isLoadingTokenPrices, refetch: refetchTokenPrices, data: tokenPrices } = useGetTokenPrices({
    tokenAddresses: [fromRealCurrency?.address ?? null, toRealCurrency?.address ?? null, nativeTokenAddress],
    chainId: tokenChainId,
  })

  const rate = useMemo(() => {
    const fromTokenPrice = fromRealCurrency && tokenPrices ? Number(tokenPrices[`${tokenChainId}:${fromRealCurrency?.address.toLowerCase()}`]) : 0

    const toTokenPrice = toRealCurrency && tokenPrices ? Number(tokenPrices[`${tokenChainId}:${toRealCurrency?.address.toLowerCase()}`]) : 0

    if (fromTokenPrice && toTokenPrice) {
      return (fromTokenPrice / toTokenPrice) || 0;
    }

    return 0
  }, [fromRealCurrency, toRealCurrency, tokenPrices])

  const updateFetchedTime = async () => {
    setLastUpdated(new Date().toLocaleTimeString());
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    if (rate && value) {
      const newToAmount = (parseFloat(value) * rate) || 0;
      setToAmount(formatNumberByFrac(newToAmount));
    } else {
      setToAmount('0');
    }
  };

  const handleToAmountChange = (value: string) => {
    setToAmount(value);
    if (rate && value) {
      const newFromAmount = (parseFloat(value) / rate) || 0;
      setFromAmount(formatNumberByFrac(newFromAmount));
    } else {
      setFromAmount('0');
    }
  };

  const refetchHandler = async () => {
    await refetchTokenPrices();
  }

  useEffect(() => {
    const interval = setInterval(updateFetchedTime, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (rate && fromAmount) {
      const newToAmount = (parseFloat(fromAmount) * rate) || 0;
      setToAmount(formatNumberByFrac(newToAmount));
    } else {
      setToAmount('');
    }
  }, [fromRealCurrency, toRealCurrency, rate])


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

        <div className="flex justify-center -my-1 relative z-[1]">
          <button
            onClick={refetchHandler}
            className={`p-1 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors ${isLoadingTokenPrices ? 'opacity-50' : ''
              }`}
            disabled={isLoadingTokenPrices}
          >
            <RefreshCw className={`w-3 h-3 ${isLoadingTokenPrices ? 'animate-spin' : ''}`} />
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
            </div>
            <input
              type="number"
              disabled={isLoadingTokenPrices}
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