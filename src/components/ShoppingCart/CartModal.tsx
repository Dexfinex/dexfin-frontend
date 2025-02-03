import React, { useEffect, useState } from 'react';
import { ChevronDown, Minus, Plus, Search, ShoppingCart, Trash2, TrendingDown, TrendingUp, X } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { useStore } from '../../store/useStore';
import { coingeckoService } from '../../services/coingecko.service';
import { formatNumberByFrac } from '../../utils/common.util';
import { CartModalProps, CoinData, ChartData, ChartOptions } from '../../types/cart.type';

const chartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: false
    }
  },
  scales: {
    x: {
      display: false
    },
    y: {
      display: false
    }
  },
  elements: {
    point: {
      radius: 0
    }
  }
};

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet');
  const [loading, setLoading] = useState(false);
  const [coins, setCoins] = useState<CoinData[]>([]);
  
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  } = useStore();

  useEffect(() => {
    const fetchCoins = async () => {
      if (!isOpen) return;
      
      setLoading(true);
      try {
        const coinList = await coingeckoService.getTokenList();
        setCoins(coinList);
      } catch (error) {
        console.error('Error fetching coins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [isOpen]);

  const categories = ['All', 'token', 'meme'];
  
  const filteredCoins = coins.filter(coin => {
    const matchesCategory = selectedCategory === 'All' || coin.category === selectedCategory;
    const matchesSearch = 
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const generateChartData = (sparklineData: number[]): ChartData => {
    return {
      labels: Array.from({ length: sparklineData.length }, (_, i) => i.toString()),
      datasets: [{
        data: sparklineData,
        borderColor: '#10B981',
        borderWidth: 2,
        fill: true,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      }]
    };
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const coin = coins.find(c => c.address === item.id);
      return total + ((coin?.price || item.price) * item.quantity);
    }, 0);
  };

  const renderTokenGrid = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-lg">Loading coins...</div>
        </div>
      );
    }

    if (filteredCoins.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <Search className="w-12 h-12 text-white/40 mb-4" />
          <p className="text-lg font-medium mb-2">No coins found</p>
          <p className="text-white/60">
            Try adjusting your search or filter criteria
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-4 p-4 h-[calc(100%-89px)] overflow-y-auto">
        {filteredCoins.map((coin) => (
          <div
            key={coin.address}
            className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <img src={coin.logoURI} alt={coin.name} className="w-8 h-8" />
                <div>
                  <div className="font-medium">{coin.name}</div>
                  <div className="text-sm text-white/60">{coin.symbol}</div>
                </div>
              </div>
              <div className="px-2 py-1 rounded-full text-xs font-medium bg-white/10">
                {coin.category}
              </div>
            </div>

            <div className="h-24 mb-3">
              <Line data={generateChartData(coin.sparkline)} options={chartOptions} />
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl font-bold">
                ${formatNumberByFrac(coin.price)}
              </div>
              <div className={`text-sm flex items-center gap-1 ${
                coin.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
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
              onClick={() => addToCart({
                id: coin.address,
                name: coin.name,
                symbol: coin.symbol,
                price: coin.price,
                logo: coin.logoURI,
                category: coin.category,
                quantity: 1
              })}
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderCheckout = () => (
    <>
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-xl font-semibold">Checkout</h2>
        <button
          onClick={() => setShowCheckout(false)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Order Summary</h3>
            <div className="space-y-3">
              {cartItems.map((item) => {
                const coin = coins.find(c => c.address === item.id);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <img src={item.logo} alt={item.name} className="w-8 h-8" />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-white/60">
                          {item.quantity} × ${formatNumberByFrac(coin?.price || item.price)}
                        </div>
                      </div>
                    </div>
                    <div className="font-medium">
                      ${formatNumberByFrac((coin?.price || item.price) * item.quantity)}
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
                className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${
                  paymentMethod === 'wallet'
                    ? 'bg-blue-500'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5" />
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
                onClick={() => setPaymentMethod('card')}
                className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${
                  paymentMethod === 'card'
                    ? 'bg-blue-500'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium">Credit Card</div>
                    <div className="text-sm text-white/60">
                      Pay with Visa, Mastercard, etc.
                    </div>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mb-8">
            <div className="p-4 bg-white/5 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-white/60">Subtotal</span>
                <span>${formatNumberByFrac(calculateTotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Network Fee</span>
                <span>~$2.50</span>
              </div>
              <div className="h-px bg-white/10 my-2" />
              <div className="flex justify-between text-lg font-medium">
                <span>Total</span>
                <span>${formatNumberByFrac(calculateTotal() + 2.50)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              clearCart();
              onClose();
            }}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors font-medium"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass border border-white/10 shadow-lg w-[90%] h-[90%] rounded-xl">
        {showCheckout ? renderCheckout() : (
          <div className="flex h-full">
            {/* Left Side - Token Grid */}
            <div className="flex-1 flex flex-col border-r border-white/10">
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        selectedCategory === category
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search coins..."
                    className="w-full bg-white/5 pl-10 pr-4 py-2 rounded-lg outline-none placeholder:text-white/40"
                  />
                </div>
              </div>

              {renderTokenGrid()}
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
                    {loading && (
                      <div className="text-sm text-white/60 text-center mb-3">
                        Updating prices...
                      </div>
                    )}
                    {cartItems.map((item) => {
                      const coin = coins.find(c => c.address === item.id);
                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-3 bg-white/5 rounded-lg"
                        >
                          <img src={item.logo} alt={item.name} className="w-10 h-10" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{item.name}</div>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-1 hover:bg-white/10 rounded-md transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="p-1 hover:bg-white/10 rounded-md transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="p-1 hover:bg-white/10 rounded-md transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">
                                    ${formatNumberByFrac(coin?.price || item.price)}
                                  </span>
                                  {coin?.priceChange24h !== undefined && (
                                    <span className={`text-sm flex items-center gap-0.5 ${
                                      coin.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                      {coin.priceChange24h >= 0 ? (
                                        <TrendingUp className="w-3 h-3" />
                                      ) : (
                                        <TrendingDown className="w-3 h-3" />
                                      )}
                                      {Math.abs(coin.priceChange24h).toFixed(2)}%
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-white/60">
                                  Total: ${formatNumberByFrac((coin?.price || item.price) * item.quantity)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg">Total</span>
                  <span className="text-2xl font-bold">
                    ${formatNumberByFrac(calculateTotal())}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={clearCart}
                    className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={() => setShowCheckout(true)}
                    disabled={cartItems.length === 0}
                    className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};