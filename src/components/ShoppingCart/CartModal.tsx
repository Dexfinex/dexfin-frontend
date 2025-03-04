import React, { useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { Web3AuthContext } from '../../providers/Web3AuthContext';
import { TransactionModal } from './components/TransactionModal';
import { mapChainId2ExplorerUrl } from '../../config/networks';
import { CartModalProps, TokenPurchaseDetails } from '../../types/cart.type';
import { useTokenBuyHandler } from '../../hooks/useTokenBuyHandler';
import { useStore } from '../../store/useStore';
import useTokenStore from '../../store/useTokenStore';
import { X, ShoppingCart, Minimize2, Maximize2 } from 'lucide-react';
import Spinner from './components/Spinner';
import SearchHeader from './components/SearchHeader';
import CoinGrid from './components/CoinGrid';
import CartList from './components/CartList';
import CheckoutSection from './components/CheckoutSection';


const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [transactionHashes, setTransactionHashes] = useState<string[]>([]);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [processingBuy, setProcessingBuy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allTransactionsComplete, setAllTransactionsComplete] = useState(false);
  const [tokenDetails, setTokenDetails] = useState<TokenPurchaseDetails[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { address: walletAddress, chainId: walletChainId } = useContext(Web3AuthContext);
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useStore();
  const { tokenPrices } = useTokenStore();

  const {
    executeBatchBuy,
    error: buyHandlerError,
    txHashes,
    isPending: isBuyPending,
    isConfirmed
  } = useTokenBuyHandler();

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Check if document exists and set up a listener for theme changes
  useEffect(() => {
    const checkTheme = () => {
      if (document.documentElement.classList.contains('dark')) {
        setIsDarkMode(true);
      } else {
        setIsDarkMode(false);
      }
    };

    // Check initial theme
    checkTheme();

    // Set up MutationObserver to watch for class changes on the html element
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            checkTheme();
          }
        });
      });

      observer.observe(document.documentElement, { attributes: true });
      return () => observer.disconnect();
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Memoize formatted token prices
  const formattedTokenPrices = useMemo(() => {
    const prices: Record<string, number> = {};
    Object.entries(tokenPrices).forEach(([key, value]) => {
      prices[key] = Number(value);
    });
    return prices;
  }, [tokenPrices]);

  useEffect(() => {
    if (!isOpen) {
      setShowCheckout(false);
      setTxModalOpen(false);
      setTransactionHashes([]);
      setBuyError(null);
      setProcessingBuy(false);
      setTokenDetails([]);
      setAllTransactionsComplete(false);
    }
  }, [isOpen]);

  // Update transaction hashes when they change in the handler
  useEffect(() => {
    if (txHashes.length > 0) {
      setTransactionHashes(txHashes);
    }
  }, [txHashes]);

  // Handle transaction confirmation and completion
  useEffect(() => {
    if (isConfirmed && txHashes.length > 0 && txHashes.length === cartItems.length) {
      setAllTransactionsComplete(true);
    }
  }, [isConfirmed, txHashes, cartItems.length]);

  // Handle cart clearing after all transactions
  useEffect(() => {
    if (allTransactionsComplete && !txModalOpen) {
      clearCart();
      setShowCheckout(false);
    }
  }, [allTransactionsComplete, txModalOpen, clearCart]);

  const handleTxModalClose = useCallback(() => {
    setTxModalOpen(false);
    if (allTransactionsComplete) {
      setTransactionHashes([]);
      setTokenDetails([]);
    }
  }, [allTransactionsComplete]);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleBuyExecution = useCallback(async () => {
    if (!walletAddress || !cartItems.length) return;

    setProcessingBuy(true);
    setBuyError(null);

    try {
      const tokenPurchases = cartItems.map(item => ({
        token: {
          address: item.address,
          symbol: item.symbol,
          name: item.name,
          chainId: item.chainId,
          decimals: 18,
          logoURI: item.logo,
          price: item.price,
          id: item.id,
          category: item.category,
          marketCap: item.marketCap,
          marketCapRank: item.marketCapRank,
          priceChange24h: item.priceChange24h,
          sparkline: item.sparkline,
          volume24h: item.volume24h,
          platforms: item.platforms
        },
        amount: item.quantity.toString()
      }));

      if (tokenPurchases.some(({ token }) => !token.address || !token.price)) {
        throw new Error('Invalid token data found in cart');
      }

      // Prepare token details for all purchases
      const details = tokenPurchases.map(purchase => ({
        tokenSymbol: purchase.token.symbol,
        amount: Number(purchase.amount),
        costInUSD: Number(purchase.amount) * (purchase.token.price || 0)
      }));
      setTokenDetails(details);

      const result = await executeBatchBuy(tokenPurchases);
      if (result) {
        setTxModalOpen(true);
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      setBuyError(error instanceof Error ? error.message : 'Transaction failed');
    } finally {
      setProcessingBuy(false);
    }
  }, [walletAddress, cartItems, executeBatchBuy]);

  const [showCart, setShowCart] = useState(false)

  const toggleCart = useCallback(() => {
    setShowCart((prev) => !prev)
  }, [])
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className={`relative glass border border-black/10 shadow-lg  rounded-xl overflow-hidden  ${isFullscreen
        ? 'w-full h-full rounded-none'
        : 'w-[90%] h-[90%] rounded-xl'
        }`}>
        <span className="flex justify-end p-2">
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          <button onClick={onClose} className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </span>

        {isLoading ? (
          <div className="h-[calc(100%-48px)] flex items-center justify-center">
            <Spinner />
          </div>
        ) : showCheckout ? (
          <div className="h-[calc(100%-48px)] overflow-auto">
            <CheckoutSection
              cartItems={cartItems}
              tokenPrices={formattedTokenPrices}
              walletAddress={walletAddress}
              buyError={buyError}
              processingBuy={processingBuy}
              isBuyPending={isBuyPending}
              onClose={() => setShowCheckout(false)}
              onExecuteBuy={handleBuyExecution}
            />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row h-[calc(100%-48px)]">
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <SearchHeader
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
                onCategoryChange={handleCategoryChange}
                onSearchChange={handleSearchChange}
              />
              <div className="flex-1 min-h-0">
                <CoinGrid
                  searchQuery={searchQuery}
                  selectedCategory={selectedCategory}
                  onAddToCart={addToCart}
                  walletChainId={walletChainId ?? 8453}
                />
              </div>
            </div>

            {/* Mobile Cart Toggle Button */}
            <button
              onClick={toggleCart}
              className="fixed bottom-4 right-4 md:hidden z-[60] bg-blue-500 p-4 rounded-full shadow-lg"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>

            {/* Cart Section */}
            <div
              className={`
                fixed md:relative inset-0 md:inset-auto z-50
                w-full md:w-[400px] h-full md:h-full
                glass
                transform transition-transform duration-300 ease-in-out
                border-l border-black/10 dark:border-white/10
                ${showCart ? "translate-y-0" : "translate-y-full md:translate-y-0"}
              `}
            >
              <CartList
                cartItems={cartItems}
                tokenPrices={formattedTokenPrices}
                onRemove={removeFromCart}
                onUpdateQuantity={updateQuantity}
                onCheckout={() => {
                  setShowCheckout(true)
                  setShowCart(false)
                }}
                onClose={() => setShowCart(false)}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        )}
      </div>

      {transactionHashes.length > 0 && (
        <TransactionModal
          open={txModalOpen}
          setOpen={handleTxModalClose}
          transactionHashes={transactionHashes}
          chainExplorerUrl={mapChainId2ExplorerUrl[walletChainId!]}
          tokenDetails={tokenDetails}
        />
      )}
    </div>
  )

};

export default React.memo(CartModal);