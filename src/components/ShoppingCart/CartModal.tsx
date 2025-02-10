import React, { useContext, useState, useCallback, useEffect } from 'react';
import { Web3AuthContext } from '../../providers/Web3AuthContext';
import { TransactionModal } from './components/TransactionModal';
import { mapChainId2ExplorerUrl } from '../../config/networks';
import { CartModalProps } from '../../types/cart.type';
import { useTokenBuyHandler } from '../../hooks/useTokenBuyHandler';
import { useStore } from '../../store/useStore';
import useTokenStore from '../../store/useTokenStore';

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
  const [isLoading, setIsLoading] = useState(false);

  const [transactionDetails, setTransactionDetails] = useState<{
    tokenSymbol: string;
    amount: number;
    costInUSD: number;
  } | null>(null);

  const { address: walletAddress, chainId: walletChainId } = useContext(Web3AuthContext);
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useStore();
  const { tokenPrices } = useTokenStore();
  
  const formattedTokenPrices: Record<string, number> = {};
  Object.entries(tokenPrices).forEach(([key, value]) => {
    formattedTokenPrices[key] = Number(value);
  });

  const { executeBatchBuy, error: buyHandlerError, txHash: buyHandlerTxHash, isPending: isBuyPending, isConfirmed } = useTokenBuyHandler();

  // Reset states when modal is closed
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
      // Clear cart after confirmation
      clearCart();
      
      // Keep modal open briefly before closing everything
      const timer = setTimeout(() => {
        setTxModalOpen(false);
        setCurrentTxHash(null);
        setTransactionDetails(null);
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isConfirmed, currentTxHash, clearCart, onClose]);

  // Handle transaction modal close
  const handleTxModalClose = useCallback(() => {
    setTxModalOpen(false);
    setCurrentTxHash(null);
    setTransactionDetails(null);
  }, []);

  const handleBuyExecution = useCallback(async () => {
    if (!walletAddress || !cartItems.length) return;

    console.log("🚀 Starting purchase for cart items:", cartItems);
    setProcessingBuy(true);
    setBuyError(null);
    setIsLoading(true);

    try {
      const tokenPurchases = cartItems.map(item => ({
        token: {
          address: item.id,
          symbol: item.symbol,
          name: item.name,
          chainId: 1,
          decimals: 18,
          logoURI: item.logo,
          price: item.price
        },
        amount: item.quantity.toString()
      }));

      const hasInvalidTokens = tokenPurchases.some(({ token }) => !token.address || !token.price);
      if (hasInvalidTokens) {
        throw new Error(`Invalid token data found in cart`);
      }

      const result = await executeBatchBuy(tokenPurchases);
      if (result) {
        console.log("✅ Batch buy result:", result);
        
        // Set transaction details first
        const currentPurchase = tokenPurchases[0];
        setTransactionDetails({
          tokenSymbol: currentPurchase.token.symbol,
          amount: Number(currentPurchase.amount),
          costInUSD: Number(currentPurchase.amount) * (currentPurchase.token.price || 0)
        });

        // Return to main view
        // setShowCheckout(false);
        
        // Show transaction modal after a brief delay
        setTimeout(() => {
          setCurrentTxHash(result as `0x${string}`);
          setTxModalOpen(true);
        }, 100);
      } else {
        throw new Error('Transaction failed');
      }

    } catch (error) {
      console.error('❌ Buy execution failed:', error);
      setBuyError(error instanceof Error ? error.message : 'Transaction failed');
    } finally {
      setProcessingBuy(false);
      setIsLoading(false);
    }
  }, [walletAddress, cartItems, executeBatchBuy]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass border border-white/10 shadow-lg w-[90%] h-[90%] rounded-xl">
        {showCheckout ? (
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
          <div className="flex h-full">
            <div className="flex-1 flex flex-col border-r border-white/10">
              <SearchHeader
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
                onCategoryChange={setSelectedCategory}
                onSearchChange={setSearchQuery}
              />
              <CoinGrid
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                onAddToCart={addToCart}
              />
            </div>
            <div className="w-[400px] flex flex-col">
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