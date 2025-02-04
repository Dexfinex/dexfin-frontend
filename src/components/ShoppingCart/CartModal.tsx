import React, { useEffect, useState, useContext, useMemo, useCallback, useRef } from 'react';
import { ChevronDown, Minus, Plus, Search, ShoppingCart, Trash2, TrendingDown, TrendingUp, X, Wallet, CreditCard } from 'lucide-react';
import * as echarts from 'echarts';
import { useStore } from '../../store/useStore';
import { coingeckoService } from '../../services/coingecko.service';
import { formatNumberByFrac } from '../../utils/common.util';
import { CartModalProps, CoinData, PurchaseStatus } from '../../types/cart.type';
import useGetTokenPrices from '../../hooks/useGetTokenPrices';
import useTokenStore from '../../store/useTokenStore';
import { Web3AuthContext } from "../../providers/Web3AuthContext";

// Constants
const ITEMS_PER_PAGE = 10;
const DEBOUNCE_DELAY = 300;

// Custom hook for debouncing
function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Custom hook for ECharts
function useChart(initialData: number[]) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts>();

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize chart
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const option = {
      animation: false, // Disable animation for better performance
      grid: {
        top: 8,
        right: 8,
        bottom: 8,
        left: 8,
        show: false
      },
      xAxis: {
        type: 'category',
        show: false,
        data: Array.from({ length: initialData.length }, (_, i) => i)
      },
      yAxis: {
        type: 'value',
        show: false
      },
      series: [{
        data: initialData,
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          color: '#10B981',
          width: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(16, 185, 129, 0.2)'
          }, {
            offset: 1,
            color: 'rgba(16, 185, 129, 0)'
          }])
        }
      }]
    };

    chartInstance.current.setOption(option);

    // Cleanup
    return () => {
      chartInstance.current?.dispose();
      chartInstance.current = undefined;
    };
  }, [initialData]);

  return chartRef;
}

// Cart Item Component
const CartItem = React.memo(({
  item,
  coinPrice,
  onRemove,
  onUpdateQuantity
}: {
  item: any;
  coinPrice: number;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}) => (
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
            onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
            className="p-1 hover:bg-white/10 rounded-md transition-colors"
            disabled={item.quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span>{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
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
));

// Coin Card Component
const CoinCard = React.memo(({
  coin,
  onAddToCart
}: {
  coin: CoinData;
  onAddToCart: (coin: CoinData) => void;
}) => {
  const chartRef = useChart(coin.sparkline);

  return (
    <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img src={coin.logoURI} alt={coin.name} className="w-8 h-8" loading="lazy" />
          <div>
            <div className="font-medium">{coin.name}</div>
            <div className="text-sm text-white/60">{coin.symbol}</div>
          </div>
        </div>
        <div className="px-2 py-1 rounded-full text-xs font-medium bg-white/10">
          {coin.category}
        </div>
      </div>

      <div className="h-24 mb-3" ref={chartRef} />

      <div className="flex items-center justify-between mb-3">
        <div className="text-2xl font-bold">
          ${formatNumberByFrac(coin.price)}
        </div>
        <div className={`text-sm flex items-center gap-1 ${coin.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
          {coin.priceChange24h >= 0 ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {Math.abs(coin.priceChange24h).toFixed(2)}%
        </div>
      </div>

      <button
        onClick={() => onAddToCart(coin)}
        className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
      >
        Add to Cart
      </button>
    </div>
  );
});

// Checkout Section Component
const CheckoutSection = React.memo(({
  cartItems,
  tokenPrices,
  onClose,
  address,
  purchaseStatus,
  isProcessing
}: {
  cartItems: any[];
  tokenPrices: any;
  onClose: () => void;
  address: string;
  purchaseStatus: PurchaseStatus;
  isProcessing: boolean;
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet');

  const total = useMemo(() => (
    cartItems.reduce((sum, item) => {
      const coinPrice = tokenPrices[`${1}:${item.id.toLowerCase()}`] || item.price;
      return sum + (Number(coinPrice) * item.quantity);
    }, 0)
  ), [cartItems, tokenPrices]);

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-xl font-semibold">Checkout</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          {purchaseStatus.status !== 'idle' && (
            <div className={`mb-4 p-4 rounded-lg ${purchaseStatus.status === 'error'
                ? 'bg-red-500/10 text-red-500'
                : 'bg-white/5 text-white'
              }`}>
              {purchaseStatus.message}
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Order Summary</h3>
            <div className="space-y-3">
              {cartItems.map((item) => {
                const coinPrice = tokenPrices[`${1}:${item.id.toLowerCase()}`] || item.price;
                return (
                  <div key={item.id} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between">
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
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Payment Method</h3>
            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod('wallet')}
                className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${paymentMethod === 'wallet'
                    ? 'bg-blue-500'
                    : 'bg-white/5 hover:bg-white/10'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium">Crypto Wallet</div>
                    <div className="text-sm text-white/60">
                      Pay with your connected wallet
                    </div>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5" />
              </button>

              <button
                disabled
                className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 opacity-50 cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium">Credit Card</div>
                    <div className="text-sm text-white/60">
                      Coming soon...
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="mb-8">
            <div className="p-4 bg-white/5 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-white/60">Subtotal</span>
                <span>${formatNumberByFrac(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Network Fee</span>
                <span>~$2.50</span>
              </div>
              <div className="h-px bg-white/10 my-2" />
              <div className="flex justify-between text-lg font-medium">
                <span>Total</span>
                <span>${formatNumberByFrac(total + 2.50)}</span>
              </div>
            </div>
          </div>

          <button
            disabled={isProcessing || cartItems.length === 0 || !address}
            className={`w-full py-3 rounded-lg transition-colors font-medium ${isProcessing || !address || cartItems.length === 0
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
              }`}
          >
            {!address
              ? 'Connect Wallet'
              : cartItems.length === 0
                ? 'Cart is Empty'
                : purchaseStatus.status === 'quoting'
                  ? 'Getting Quote...'
                  : isProcessing
                    ? 'Processing...'
                    : 'Confirm Purchase'}
          </button>
        </div>
      </div>
    </>
  );
});

// Main CartModal Component
export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [purchaseStatus, setPurchaseStatus] = useState<PurchaseStatus>({
    status: 'idle',
    message: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const { address } = useContext(Web3AuthContext);
  const { cartItems, addToCart, removeFromCart, updateQuantity } = useStore();
  const { tokenPrices } = useTokenStore();

  const debouncedSearch = useDebounce(searchInput, DEBOUNCE_DELAY);

  const tokenAddresses = useMemo(() => (
    cartItems.map(item => item.id)
  ), [cartItems]);

  const { isLoading: isTokenPricesLoading } = useGetTokenPrices({
    chainId: 1,
    tokenAddresses,
  });

  // Memoized filtered coins
  const filteredCoins = useMemo(() => {
    return coins.filter(coin => {
      const matchesCategory = selectedCategory === 'All' || coin.category === selectedCategory;
      const matchesSearch = coin.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [coins, selectedCategory, debouncedSearch]);

  // Calculate total
  const total = useMemo(() => (
    cartItems.reduce((total, item) => {
      const coinPrice = tokenPrices[`${1}:${item.id.toLowerCase()}`] || item.price;
      return total + (Number(coinPrice) * item.quantity);
    }, 0)
  ), [cartItems, tokenPrices]);

  const handleAddToCart = useCallback((coin: CoinData) => {
    addToCart({
      id: coin.address,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.price,
      logo: coin.logoURI,
      category: coin.category,
      quantity: 1,
      chainId: coin.chainId,
      decimals: coin.decimals
    });
  }, [addToCart]);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchCoins = async () => {
      if (!isOpen) return;

      setLoading(true);
      try {
        const coinList = await coingeckoService.getTokenList();
        if (mounted) {
          setCoins(coinList);
        }
      } catch (error) {
        console.error('Error fetching coins:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchCoins();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass border border-white/10 shadow-lg w-[90%] h-[90%] rounded-xl">
        {showCheckout ? (
          <CheckoutSection
            cartItems={cartItems}
            tokenPrices={tokenPrices}
            onClose={() => setShowCheckout(false)}
            address={address}
            purchaseStatus={purchaseStatus}
            isProcessing={isProcessing}
          />
        ) : (
          <div className="flex h-full">
            {/* Left Side - Token Grid */}
            <div className="flex-1 flex flex-col border-r border-white/10">
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  {['All', 'token', 'meme'].map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 rounded-lg transition-colors ${selectedCategory === category
                          ? 'bg-white/10'
                          : 'hover:bg-white/5'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search coins..."
                    className="w-full bg-white/5 pl-10 pr-4 py-2 rounded-lg outline-none placeholder:text-white/40"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-lg">Loading coins...</div>
                  </div>
                ) : filteredCoins.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <Search className="w-12 h-12 text-white/40 mb-4" />
                    <p className="text-lg font-medium mb-2">No coins found</p>
                    <p className="text-white/60">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 p-4">
                    {filteredCoins.map((coin) => (
                      <CoinCard
                        key={coin.address}
                        coin={coin}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Cart */}
            <div className="w-[400px] flex flex-col">
              <div className="flex-1 p-4 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingCart className="w-12 h-12 text-white/40 mb-4" />
                    <p className="text-lg font-medium mb-2">Your cart is empty</p>
                    <p className="text-white/60">
                      Add some coins to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {isTokenPricesLoading && (
                      <div className="text-sm text-white/60 text-center mb-3">
                        Updating prices...
                      </div>
                    )}
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        coinPrice={tokenPrices[`${1}:${item.id.toLowerCase()}`] || item.price}
                        onRemove={removeFromCart}
                        onUpdateQuantity={updateQuantity}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-white/10">
                <div className="text-lg font-semibold">
                  Total: ${formatNumberByFrac(total)}
                </div>
                <button
                  onClick={() => setShowCheckout(true)}
                  disabled={cartItems.length === 0}
                  className={`w-full py-2 mt-4 rounded-lg transition-colors ${cartItems.length === 0
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(CartModal);