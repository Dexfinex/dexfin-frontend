import { PaymentMethodSelector } from './PaymentMethodSelector';
import { OrderTypeToggle } from './OrderTypeToggle';
import { TokenSelector } from './TokenSelector';
import type { TokenType, PaymentMethod, OrderType } from '../../../types/swap.type';
import {useState} from "react";

interface BuyBoxProps {
  selectedToken: TokenType | null
  onTokenSelect: (token: TokenType) => void;
  usdAmount: string;
  onUsdAmountChange: (amount: string) => void;
}

const QUICK_AMOUNTS = [10, 20, 100];

export function BuyBox({
  selectedToken,
  onTokenSelect,
  usdAmount,
  onUsdAmountChange,
}: BuyBoxProps) {
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<PaymentMethod[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('market');
  const [limitPrice, setLimitPrice] = useState('');
  
  const exchangeRate = selectedToken?.price ?? 0;
  const tokenAmount = exchangeRate ? Number(usdAmount) / exchangeRate : 0;

  const handleQuickAmount = (amount: number) => {
    onUsdAmountChange(amount.toString());
  };

  const handleMaxAmount = () => {
    // TODO: Implement max amount based on payment method limits
    onUsdAmountChange('5000');
  };

  const handleHalfAmount = () => {
    // TODO: Implement half amount based on payment method limits
    onUsdAmountChange('2500');
  };

  return (
    <div className="space-y-4">
      <OrderTypeToggle type={orderType} onTypeChange={setOrderType} />

      <TokenSelector
        selectedToken={selectedToken}
        onSelect={onTokenSelect}
        amount=""
        usdAmount=""
        onAmountChange={() => {}}
        label="You Buy"
        disabled={true}
      />
      
      {orderType === 'limit' && (
        <div className="bg-[#191919] rounded-xl p-4">
          <div className="text-gray-400 mb-2">Limit Price</div>
          <div className="relative">
            <input
              type="number"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              placeholder="Enter limit price"
              className="w-full bg-transparent text-xl font-medium text-white placeholder-gray-500 outline-none"
            />
            <div className="text-sm text-gray-500 mt-1">
              Current price: ${selectedToken?.price?.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Amount Input */}
      <div className="bg-[#191919] rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-gray-400 text-sm font-medium">Amount in USD</div>
          <div className="text-sm text-gray-400">
            1 {selectedToken?.symbol} = ${exchangeRate.toLocaleString()}
          </div>
        </div>
        <div className="relative">
          <input
            type="number"
            value={usdAmount}
            onChange={(e) => onUsdAmountChange(e.target.value)}
            placeholder="0.00"
            className="w-full bg-transparent text-2xl font-medium text-white placeholder-gray-500 outline-none focus:placeholder-primary-400/50 transition-all"
          />
          <div className="text-sm text-gray-400 mt-1 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-white/5">USD</span>
            ≈ {tokenAmount.toFixed(6)} {selectedToken?.symbol}
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-[#191919] rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-gray-400 text-sm font-medium">Pay with</div>
          <span className="text-gray-400">Balance: $5,000.00</span>
        </div>
        <PaymentMethodSelector
          selectedMethods={selectedPaymentMethods}
          onMethodsChange={setSelectedPaymentMethods}
        />
      </div>

      {/* Quick Amount Buttons */}
      <div className="flex items-center gap-2 mt-2">
        {QUICK_AMOUNTS.map((amount) => (
          <button
            key={amount}
            onClick={() => handleQuickAmount(amount)}
            className="flex-1 py-2 px-4 rounded-lg bg-[#191919] hover:bg-[#222] text-gray-400 hover:text-white transition-all hover:shadow-lg active:scale-95"
          >
            ${amount}
          </button>
        ))}
        <button onClick={handleHalfAmount} className="flex-1 py-2 px-4 rounded-lg bg-[#191919] hover:bg-[#222] text-gray-400 hover:text-white transition-colors">Half</button>
        <button onClick={handleMaxAmount} className="flex-1 py-2 px-4 rounded-lg bg-[#191919] hover:bg-[#222] text-gray-400 hover:text-white transition-colors">Max</button>
      </div>

      <button
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-all hover:shadow-lg active:scale-[0.99]"
        onClick={() => console.log('Buy', { token: selectedToken, usdAmount, tokenAmount, paymentMethods: selectedPaymentMethods })}
        disabled={!usdAmount || Number(usdAmount) <= 0 || selectedPaymentMethods.length === 0}
      >
        {!usdAmount || Number(usdAmount) <= 0
          ? 'Enter amount'
          : selectedPaymentMethods.length === 0
            ? 'Select payment method'
            : `Buy ${selectedToken?.symbol}`}
      </button>
    </div>
  );
}