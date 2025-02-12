import React, { useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { Web3AuthContext } from '../../providers/Web3AuthContext';
import { TransactionModal } from './components/TransactionModal';
import { mapChainId2ExplorerUrl } from '../../config/networks';
import { CartModalProps } from '../../types/cart.type';
import { useTokenBuyHandler } from '../../hooks/useTokenBuyHandler';
import { useStore } from '../../store/useStore';
import useTokenStore from '../../store/useTokenStore';
import { X } from 'lucide-react';
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
  const [currentTxHash, setCurrentTxHash] = useState<string | null>(null);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [processingBuy, setProcessingBuy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { address: walletAddress, chainId: walletChainId } = useContext(Web3AuthContext);
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useStore();
  const { tokenPrices } = useTokenStore();

  // Initial loading effect
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

  const { executeBatchBuy, error: buyHandlerError, txHash: buyHandlerTxHash, isPending: isBuyPending, isConfirmed } = useTokenBuyHandler();

  const [transactionDetails, setTransactionDetails] = useState<{
    tokenSymbol: string;
    amount: number;
    costInUSD: number;
  } | null>(null);

  // Reset modal state
  useEffect(() => {
    if (!isOpen) {
      setShowCheckout(false);
      setTxModalOpen(false);
      setCurrentTxHash(null);
      setBuyError(null);
      setProcessingBuy(false);
      setTransactionDetails(null);
    }
  }, [isOpen]);

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && currentTxHash) {
      clearCart();
      const timer = setTimeout(() => {
        setTxModalOpen(false);
        setCurrentTxHash(null);
        setTransactionDetails(null);
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isConfirmed, currentTxHash, clearCart, onClose]);

  const handleTxModalClose = useCallback(() => {
    setTxModalOpen(false);
    setCurrentTxHash(null);
    setTransactionDetails(null);
  }, []);

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
          chainId: 1,
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

      const result = await executeBatchBuy(tokenPurchases);

      if (result) {
        const currentPurchase = tokenPurchases[0];
        setTransactionDetails({
          tokenSymbol: currentPurchase.token.symbol,
          amount: Number(currentPurchase.amount),
          costInUSD: Number(currentPurchase.amount) * (currentPurchase.token.price || 0)
        });

        setTimeout(() => {
          setCurrentTxHash(result as `0x${string}`);
          setTxModalOpen(true);
        }, 100);
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      setBuyError(error instanceof Error ? error.message : 'Transaction failed');
    } finally {
      setProcessingBuy(false);
    }
  }, [walletAddress, cartItems, executeBatchBuy]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative glass border border-white/10 shadow-lg w-[90%] h-[90%] rounded-xl">
        <span className='flex justify-end p-2'>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </span>

        {isLoading ? (
          <div className="h-[calc(100%-48px)] flex items-center justify-center">
            <Spinner />
          </div>
        ) : showCheckout ? (
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
        ) : (
          <div className="flex h-[calc(100%-48px)]">
            <div className="flex-1 flex -mt-9 flex-col border-r border-white/10">
              <SearchHeader
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
                onCategoryChange={handleCategoryChange}
                onSearchChange={handleSearchChange}
              />
              <div className="flex-1 overflow-hidden">
                <CoinGrid
                  searchQuery={searchQuery}
                  selectedCategory={selectedCategory}
                  onAddToCart={addToCart}
                  walletChainId={walletChainId ?? 8453}
                />
              </div>
            </div>
            <div className="w-[400px] flex flex-col h-full">
              <CartList
                cartItems={cartItems}
                tokenPrices={formattedTokenPrices}
                onRemove={removeFromCart}
                onUpdateQuantity={updateQuantity}
                onCheckout={() => setShowCheckout(true)}
              />
            </div>
          </div>
        )}
      </div>
      {currentTxHash && (
        <TransactionModal
          open={txModalOpen}
          setOpen={handleTxModalClose}
          link={`${mapChainId2ExplorerUrl[walletChainId!]}/tx/${currentTxHash}`}
          transactionDetails={transactionDetails || undefined}
        />
      )}
    </div>
  );
};

export default React.memo(CartModal);