import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import { formatNumberByFrac } from '../../../utils/common.util';
import { Input } from '@chakra-ui/react';
import debounce from 'lodash/debounce';
import { CartListProps, CartItemProps } from '../../../types/cart.type';

interface ExtendedCartItemProps extends CartItemProps {
  isDarkMode?: boolean;
}

interface ExtendedCartListProps extends CartListProps {
  isDarkMode?: boolean;
}

const CartItem = React.memo(({
    item,
    coinPrice,
    onRemove,
    onUpdateQuantity,
    isDarkMode
}: ExtendedCartItemProps) => {
    const MIN_QUANTITY = useMemo(() => 1 / coinPrice, [coinPrice]);
    const STEP = 0.1;
    const [inputValue, setInputValue] = useState(item.quantity.toString());

    useEffect(() => {
        setInputValue(item.quantity.toString());
    }, [item.quantity]);

    // Debounced update handler
    const debouncedUpdateQuantity = useCallback(
        debounce((id: string, quantity: number) => {
            onUpdateQuantity(id, quantity);
        }, 300),
        [onUpdateQuantity]
    );

    const handleQuantityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        if (value === '' || isNaN(Number(value))) return;

        const newValue = Number(value);
        if (newValue < MIN_QUANTITY) {
            debouncedUpdateQuantity(item.id, MIN_QUANTITY);
        } else {
            debouncedUpdateQuantity(item.id, Number(newValue.toFixed(4)));
        }
    }, [item.id, MIN_QUANTITY, debouncedUpdateQuantity]);

    const handleBlur = useCallback(() => {
        const newValue = Number(inputValue);
        if (isNaN(newValue) || newValue < MIN_QUANTITY) {
            onUpdateQuantity(item.id, MIN_QUANTITY);
            setInputValue(MIN_QUANTITY.toString());
        } else {
            const formattedValue = Number(newValue.toFixed(4));
            onUpdateQuantity(item.id, formattedValue);
            setInputValue(formattedValue.toString());
        }
    }, [inputValue, item.id, MIN_QUANTITY, onUpdateQuantity]);

    const adjustQuantity = useCallback((increment: boolean) => {
        const adjustment = increment ? STEP : -STEP;
        const newValue = Number((item.quantity + adjustment).toFixed(4));

        if (!increment && newValue < MIN_QUANTITY) {
            onUpdateQuantity(item.id, MIN_QUANTITY);
        } else {
            onUpdateQuantity(item.id, newValue);
        }
    }, [item.id, item.quantity, MIN_QUANTITY, onUpdateQuantity]);

    return (
        <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
            <img
                src={item.logo}
                alt={item.name}
                className="w-10 h-10"
                loading="lazy"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.png';
                }}
            />
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div className="font-medium">{item.name}</div>
                    <button
                        onClick={() => onRemove(item.id)}
                        className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-md transition-colors"
                    >
                        <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => adjustQuantity(false)}
                            className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-md transition-colors"
                            disabled={item.quantity <= MIN_QUANTITY}
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <Input
                            value={inputValue}
                            onChange={handleQuantityChange}
                            onBlur={handleBlur}
                            min={MIN_QUANTITY}
                            step={STEP}
                            type="number"
                            placeholder="Enter token amount"
                            _placeholder={{ fontSize: 'xs' }}
                            
                            _focus={{ borderColor: 'blue.300', boxShadow: 'none' }}
                            width="24"
                            textAlign="center"
                        />
                        <button
                            onClick={() => adjustQuantity(true)}
                            className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-md transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="font-medium">
                        ${formatNumberByFrac(Number(coinPrice) * item.quantity)}
                    </div>
                </div>
            </div>
        </div>
    );
});

const CartList: React.FC<ExtendedCartListProps> = React.memo(({
    cartItems,
    tokenPrices,
    onRemove,
    onUpdateQuantity,
    onCheckout,
    onClose,
    isDarkMode
}) => {
    const total = useMemo(() => {
        return cartItems.reduce((total, item) => {
            const coinPrice = tokenPrices[`1:${item.id.toLowerCase()}`] || item.price;
            return total + (Number(coinPrice) * item.quantity);
        }, 0);
    }, [cartItems, tokenPrices]);

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col h-full glass">
                <div className="md:hidden flex justify-end p-2 pt-4">
                    <button onClick={onClose} className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex flex-col items-center glass justify-center flex-1 text-center p-8">
                    <ShoppingCart className="w-12 h-12  mb-4" />
                    <p className="text-lg font-medium mb-2">Your cart is empty</p>
                    <p className="">Add some coins to get started</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full glass">
            <div className="md:hidden flex justify-end p-2 pt-4">
                <button onClick={onClose} className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg">
                    <X className="w-5 h-5" />
                </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-3">
                    {cartItems.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            coinPrice={tokenPrices[`1:${item.id.toLowerCase()}`] || item.price}
                            onRemove={onRemove}
                            onUpdateQuantity={onUpdateQuantity}
                            isDarkMode={isDarkMode}
                        />
                    ))}
                </div>
            </div>
            <div className="p-4 border-t border-black/10 dark:border-white/10 glass">
                <div className="text-lg font-semibold mb-4">Total: ${formatNumberByFrac(total)}</div>
                <button
                    onClick={onCheckout}
                    className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-white font-medium"
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
    )
});

CartList.displayName = 'CartList';
CartItem.displayName = 'CartItem';

export default CartList;