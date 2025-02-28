import {useState} from 'react';
import {TokenSelector} from './TokenSelector';
import {PaymentMethodSelector} from './PaymentMethodSelector';
import {OrderTypeToggle} from './OrderTypeToggle';
import {OrderType, PaymentMethod, TokenType} from "../../../types/swap.type";

interface SellBoxProps {
    selectedToken: TokenType | null;
    onTokenSelect: (token: TokenType) => void;
    amount: string;
    usdAmount: string;
    onAmountChange: (amount: string) => void;
}

export function SellBox({
                            selectedToken,
                            onTokenSelect,
                            amount,
                            usdAmount,
                            onAmountChange,
                        }: SellBoxProps) {
    const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<PaymentMethod[]>([]);
    const [orderType, setOrderType] = useState<OrderType>('market');
    const [limitPrice, setLimitPrice] = useState('');
    const usdValue = Number(amount) * (selectedToken?.price ?? 0);

    /*
      const handleMaxAmount = () => {
        if (selectedToken.balance) {
          onAmountChange(selectedToken.balance.toString());
        }
      };
    */

    return (
        <div className="space-y-4">
            <OrderTypeToggle type={orderType} onTypeChange={setOrderType}/>

            {/*
      <div className="flex items-center justify-end text-sm text-gray-400">
        <span>Available Balance: {selectedToken.balance ?? '0'} {selectedToken.symbol}</span>
      </div>
*/}

            <TokenSelector
                selectedToken={selectedToken}
                onSelect={onTokenSelect}
                amount={amount}
                usdAmount={usdAmount}
                onAmountChange={onAmountChange}
                label="Amount to Sell"
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

            {amount && (
                <div className="text-sm text-gray-400 px-2">
                    ≈ ${usdValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </div>
            )}

            <div className="bg-[#191919] rounded-xl p-4">
                <div className="text-gray-400 mb-2 text-sm font-medium">Receive Payment In</div>
                <PaymentMethodSelector
                    selectedMethods={selectedPaymentMethods}
                    onMethodsChange={setSelectedPaymentMethods}
                />
            </div>

            <button
                onClick={() => console.log('Sell', {
                    token: selectedToken,
                    amount,
                    paymentMethods: selectedPaymentMethods
                })}
                disabled={!amount || Number(amount) <= 0 || selectedPaymentMethods.length === 0}
                className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors"
            >
                {amount && Number(amount) > 0
                    ? `Sell ${selectedToken?.symbol}`
                    : `Enter amount`}
            </button>
        </div>
    );
}