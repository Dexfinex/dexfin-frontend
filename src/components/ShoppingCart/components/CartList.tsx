import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { formatNumberByFrac } from '../../../utils/common.util';
import { Input } from '@chakra-ui/react';

interface CartListProps {
    cartItems: any[];
    tokenPrices: Record<string, number>;
    onRemove: (id: string) => void;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onCheckout: () => void;
}
interface CartItemProps {
    item: any;
    coinPrice: number;
    onRemove: (id: string) => void;
    onUpdateQuantity: (id: string, quantity: number) => void;
}



const CartItem = React.memo(({
    item,
    coinPrice,
    onRemove,
    onUpdateQuantity
}: CartItemProps) => {
    const MIN_QUANTITY = 1 / coinPrice;
    // console.log("MIN_QUANTITY : ", MIN_QUANTITY);
    const STEP = 0.1;
    const [inputValue, setInputValue] = useState(item.quantity.toString());

    useEffect(() => {
        setInputValue(item.quantity.toString());
    }, [item.quantity]);

    const handleQuantityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value); 

        if (value === '' || isNaN(Number(value))) {
            return;
        }

        const newValue = Number(value);
        if (newValue < MIN_QUANTITY) {
            onUpdateQuantity(item.id, MIN_QUANTITY);
        } else {
            onUpdateQuantity(item.id, Number(newValue.toFixed(4)));
        }
    }, [item.id, onUpdateQuantity]);

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
    }, [inputValue, item.id, onUpdateQuantity]);

    const decrementQuantity = useCallback(() => {
        const newValue = Number((item.quantity - STEP).toFixed(4));
        if (newValue < MIN_QUANTITY) {
            onUpdateQuantity(item.id, MIN_QUANTITY);
        } else {
            onUpdateQuantity(item.id, newValue);
        }
    }, [item.id, item.quantity, onUpdateQuantity]);

    const incrementQuantity = useCallback(() => {
        const newValue = Number((item.quantity + STEP).toFixed(4));
        onUpdateQuantity(item.id, newValue);
    }, [item.id, item.quantity, onUpdateQuantity]);

    return (
        <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
            <img src={item.logo} alt={item.name} className="w-10 h-10" loading="lazy" />
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div className="font-medium">{item.name}</div>
                    <button
                        onClick={() => onRemove(item.id)}
                        className="p-1 hover:bg-white/10 rounded-md transition-colors"
                    >
                        <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={decrementQuantity}
                            className="p-1 hover:bg-white/10 rounded-md transition-colors"
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
                            bg="whiteAlpha.100"
                            border="1px solid"
                            borderColor="whiteAlpha.300"
                            color="white"
                            _hover={{ borderColor: 'whiteAlpha.400' }}
                            _focus={{ borderColor: 'blue.300', boxShadow: 'none' }}
                            width="24"
                            textAlign="center"
                        />
                        <button
                            onClick={incrementQuantity}
                            className="p-1 hover:bg-white/10 rounded-md transition-colors"
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

const CartList: React.FC<CartListProps> = React.memo(({
    cartItems,
    tokenPrices,
    onRemove,
    onUpdateQuantity,
    onCheckout
}) => {
    const total = useMemo(() => {
        return cartItems.reduce((total, item) => {
            const coinPrice = tokenPrices[`1:${item.id.toLowerCase()}`] || item.price;
            return total + (Number(coinPrice) * item.quantity);
        }, 0);
    }, [cartItems, tokenPrices]);

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="w-12 h-12 text-white/40 mb-4" />
                <p className="text-lg font-medium mb-2">Your cart is empty</p>
                <p className="text-white/60">Add some coins to get started</p>
            </div>
        );
    }
    return (
        <div className='flex flex-col h-full'>
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-3">
                    {cartItems.map((item) => {
                        const coinPrice = tokenPrices[`1:${item.id.toLowerCase()}`] || item.price;
                        return (
                            <CartItem
                                key={item.id}
                                item={item}
                                coinPrice={coinPrice}
                                onRemove={onRemove}
                                onUpdateQuantity={onUpdateQuantity}
                            />
                        );
                    })}
                </div>
            </div>
            <div className="mt-auto p-4 border-t border-white/10">
                <div className="text-lg font-semibold">
                    Total: ${formatNumberByFrac(total)}
                </div>
                <button
                    onClick={onCheckout}
                    className="w-full py-2 mt-4 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
});

CartList.displayName = 'CartList';
CartItem.displayName = 'CartItem';

export default CartList;