import React, { useState, useMemo } from 'react';
import { ChevronDown, ShoppingCart, X } from 'lucide-react';
import { Alert, AlertIcon, Button } from '@chakra-ui/react';
import { formatNumberByFrac } from '../../../utils/common.util';
import { CheckoutSectionProps } from '../../../types/cart.type';

const OrderSummaryItem = React.memo(({
    item,
    coinPrice
}: {
    item: any;
    coinPrice: number;
}) => (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
        <div className="flex items-center gap-3">
            <img src={item.logo} alt={item.name} className="w-8 h-8" loading="lazy" />
            <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-white/60">
                    {item.quantity} × ${formatNumberByFrac(coinPrice)}
                </div>
            </div>
        </div>
        <div className="font-medium">
            ${formatNumberByFrac(Number(coinPrice) * item.quantity)}
        </div>
    </div>
));

const PaymentMethodButton = React.memo(({
    method,
    selectedMethod,
    onSelect
}: {
    method: 'wallet' | 'card';
    selectedMethod: string;
    onSelect: (method: 'wallet' | 'card') => void;
}) => (
    <button
        onClick={() => onSelect(method)}
        className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${selectedMethod === method ? 'bg-blue-500' : 'bg-white/5 hover:bg-white/10'
            }`}
    >
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
                <div className="font-medium">
                    {method === 'wallet' ? 'Crypto Wallet' : 'Credit Card'}
                </div>
                <div className="text-sm text-white/60">
                    {method === 'wallet' ? 'Pay with your connected wallet' : 'Coming soon.'}
                </div>
            </div>
        </div>
        <ChevronDown className="w-5 h-5" />
    </button>
));

const CheckoutSection: React.FC<CheckoutSectionProps> = React.memo(({
    cartItems,
    tokenPrices,
    walletAddress,
    buyError,
    processingBuy,
    isBuyPending,
    onClose,
    onExecuteBuy
}) => {
    const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet');

    const { subtotal, total } = useMemo(() => {
        const subtotal = cartItems.reduce((total, item) => {
            const coinPrice = tokenPrices[`1:${item.id.toLowerCase()}`] || item.price;
            return total + (Number(coinPrice) * item.quantity);
        }, 0);
        return {
            subtotal,
            total: subtotal + 2.50 // Network fee
        };
    }, [cartItems, tokenPrices]);

    return (
        <>
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h2 className="text-xl font-semibold">Checkout</h2>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Order Summary */}
                    <div className="mb-6 md:mb-8">
                        <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                            {cartItems.map((item) => (
                                <OrderSummaryItem
                                    key={item.id}
                                    item={item}
                                    coinPrice={tokenPrices[`1:${item.id.toLowerCase()}`] || item.price}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                            <div className="space-y-3">
                                <PaymentMethodButton method="wallet" selectedMethod={paymentMethod} onSelect={setPaymentMethod} />
                                <PaymentMethodButton method="card" selectedMethod={paymentMethod} onSelect={setPaymentMethod} />
                            </div>
                        </div>

                        {/* Total Section */}
                        <div className="space-y-4 sticky bottom-0 bg-background pt-4">
                            <div className="p-4 bg-white/5 rounded-lg space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-white/60">Subtotal</span>
                                    <span>${formatNumberByFrac(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/60">Network Fee</span>
                                    <span>~$2.50</span>
                                </div>
                                <div className="h-px bg-white/10 my-2" />
                                <div className="flex justify-between text-lg font-medium">
                                    <span>Total</span>
                                    <span>${formatNumberByFrac(total)}</span>
                                </div>
                            </div>

                            {buyError && (
                                <Alert status="error" variant="subtle" bg="#511414" borderRadius="md" fontSize="sm" padding="2">
                                    <AlertIcon boxSize="4" />
                                    <div className="overflow-x-hidden text-ellipsis overflow-y-auto max-h-24">{buyError}</div>
                                </Alert>
                            )}

                            <Button
                                width="full"
                                colorScheme="blue"
                                onClick={onExecuteBuy}
                                isLoading={processingBuy || isBuyPending}
                                loadingText={
                                    isBuyPending
                                        ? "Confirming Transaction..."
                                        : processingBuy
                                            ? "Processing Purchase..."
                                            : "Preparing Transaction..."
                                }
                                isDisabled={!walletAddress || processingBuy || isBuyPending}
                            >
                                {walletAddress ? "Confirm Payment" : "Connect Wallet to Continue"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

});

OrderSummaryItem.displayName = 'OrderSummaryItem';
PaymentMethodButton.displayName = 'PaymentMethodButton';
CheckoutSection.displayName = 'CheckoutSection';

export default CheckoutSection;