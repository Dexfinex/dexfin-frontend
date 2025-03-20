import React, { useState, useMemo, useContext } from 'react';
import { ChevronDown, ShoppingCart, ArrowLeft, Info } from 'lucide-react';
import { Alert, AlertIcon, Button } from '@chakra-ui/react';
import { formatNumberByFrac } from '../../../utils/common.util';
import { CheckoutSectionProps } from '../../../types/cart.type';
import { Web3AuthContext } from '../../../providers/Web3AuthContext';
import { WalletTypeEnum } from '../../../types/wallet.type';
import useTokenStore from "../../../store/useTokenStore";
import useGasEstimation from "../../../hooks/useGasEstimation";
import { mapChainId2NativeAddress } from "../../../config/networks";

const OrderSummaryItem = React.memo(({
    item,
    coinPrice
}: {
    item: any;
    coinPrice: number;
}) => (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
        <div className="flex items-center gap-3">
            <img
                src={item.logo}
                alt={item.name}
                className="w-8 h-8"
                loading="lazy"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.png';
                }}
            />
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
    const { walletType, chainId } = useContext(Web3AuthContext);
    const { getTokenPrice } = useTokenStore();

    // Get native token address for the current chain
    const tokenChainId = chainId || 8453; // Default to Base if chainId is undefined
    const nativeTokenAddress = mapChainId2NativeAddress[tokenChainId];

    // Fetch gas estimation data
    const {
        isLoading: isGasEstimationLoading,
        data: gasData
    } = useGasEstimation();

    // Check if using embedded wallet
    const isEmbeddedWallet = walletType === WalletTypeEnum.EMBEDDED;

    // Get native token price for fee calculation
    const nativeTokenPrice = getTokenPrice(nativeTokenAddress, tokenChainId) || 0;

    // Calculate network fee in USD
    const networkFeeUSD = useMemo(() => {
        if (isEmbeddedWallet) return 0; // Free for embedded wallets
        return nativeTokenPrice * gasData.gasEstimate;
    }, [isEmbeddedWallet, nativeTokenPrice, gasData.gasEstimate]);

    const { subtotal, total } = useMemo(() => {
        const subtotal = cartItems.reduce((total, item) => {
            const coinPrice = tokenPrices[`1:${item.id.toLowerCase()}`] || item.price;
            return total + (Number(coinPrice) * item.quantity);
        }, 0);

        return {
            subtotal,
            total: subtotal + networkFeeUSD
        };
    }, [cartItems, tokenPrices, networkFeeUSD]);

    return (
        <>
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h2 className="text-xl font-semibold">Checkout</h2>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <ArrowLeft className="w-4 h-4" />
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

                        {/* Wallet Type Information */}
                        {isEmbeddedWallet && (
                            <div className="p-3 bg-blue-500/20 rounded-lg text-sm">
                                <p className="font-medium">
                                    You're using an embedded wallet. Network fees are free!
                                </p>
                            </div>
                        )}

                        {/* Total Section */}
                        <div className="space-y-4 sticky bottom-0 bg-background pt-4">
                            <div className="p-4 bg-white/5 rounded-lg space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-white/60">Subtotal</span>
                                    <span>${formatNumberByFrac(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-1">
                                        <span className="text-white/60">Network Fee</span>
                                        <div className="group relative">
                                            <Info className="w-3.5 h-3.5 text-gray-500" />
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black/90 text-xs text-gray-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                Estimated network fees for processing the transaction
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {isGasEstimationLoading ? (
                                        <span>Calculating...</span>
                                    ) : isEmbeddedWallet ? (
                                        <div className="flex gap-2">
                                            <span className="text-green-500">Free!</span>
                                            <span className="text-gray-500 line-through">${formatNumberByFrac(nativeTokenPrice * gasData.gasEstimate)}</span>
                                        </div>
                                    ) : (
                                        <span>${formatNumberByFrac(networkFeeUSD)}</span>
                                    )}
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
                                isLoading={processingBuy || isBuyPending || isGasEstimationLoading}
                                loadingText={
                                    isBuyPending
                                        ? "Confirming Transaction..."
                                        : processingBuy
                                            ? "Processing Purchase..."
                                            : isGasEstimationLoading
                                                ? "Calculating Fee..."
                                                : "Preparing Transaction..."
                                }
                                isDisabled={!walletAddress || processingBuy || isBuyPending || isGasEstimationLoading}
                            >
                                {walletAddress ? "Confirm Payment" : "Connect Wallet to Continue"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

OrderSummaryItem.displayName = 'OrderSummaryItem';
PaymentMethodButton.displayName = 'PaymentMethodButton';
CheckoutSection.displayName = 'CheckoutSection';

export default CheckoutSection;