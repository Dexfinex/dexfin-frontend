import React, { useState, useMemo } from 'react';
import { CreditCard, ChevronDown, Search, X } from 'lucide-react';
import { useMediaQuery } from '@chakra-ui/react';

interface BuyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  assets: {
    id: string;
    name: string;
    symbol: string;
    logo: string;
  }[];
}

export const BuyDrawer: React.FC<BuyDrawerProps> = ({ isOpen, onClose, assets }) => {
  const [selectedAsset, setSelectedAsset] = useState(assets[0]);
  const [amount, setAmount] = useState('');
  const [showAssetSelector, setShowAssetSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [isLargerThan1200] = useMediaQuery('(min-width: 1200px)');
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)');

  const walletContainerWidth = useMemo(() => {
    if (isLargerThan1200) return 'w-[50%] rounded-xl';
    if (isLargerThan800) return 'w-[80%] rounded-xl';

    return 'w-full h-full rounded-none';

  }, [isLargerThan1200, isLargerThan800])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle buy transaction
    onClose();
  };

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative glass border border-white/10 shadow-lg transition-all duration-300 ease-in-out ${walletContainerWidth}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Buy</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-4">
          {/* Asset Selector */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Asset</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAssetSelector(!showAssetSelector)}
                className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <img src={selectedAsset.logo} alt={selectedAsset.name} className="w-8 h-8" />
                <div className="flex-1 text-left">
                  <div className="font-medium">{selectedAsset.name}</div>
                  <div className="text-sm text-white/60">{selectedAsset.symbol}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-white/40" />
              </button>

              {showAssetSelector && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowAssetSelector(false)}
                  />
                  <div className="absolute top-full left-0 right-0 mt-2 p-2 glass rounded-lg z-20">
                    <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg mb-2">
                      <Search className="w-4 h-4 text-white/40" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search assets..."
                        className="bg-transparent outline-none flex-1 text-sm"
                      />
                    </div>

                    <div className="max-h-48 overflow-y-auto">
                      {filteredAssets.map((asset) => (
                        <button
                          key={asset.id}
                          type="button"
                          onClick={() => {
                            setSelectedAsset(asset);
                            setShowAssetSelector(false);
                          }}
                          className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <img src={asset.logo} alt={asset.name} className="w-6 h-6" />
                          <div className="flex-1 text-left">
                            <div className="font-medium">{asset.name}</div>
                            <div className="text-sm text-white/60">{asset.symbol}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Amount (USD)</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-white/20"
            />
            <div className="flex items-center gap-2 mt-2">
              {[100, 500, 1000, 5000].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAmount(value.toString())}
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm"
                >
                  ${value}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Payment Method</label>
            <button
              type="button"
              className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">Credit Card</div>
                <div className="text-sm text-white/60">Visa, Mastercard, etc.</div>
              </div>
              <ChevronDown className="w-4 h-4 text-white/40" />
            </button>
          </div>

          {/* Preview */}
          {amount && (
            <div className="p-4 bg-white/5 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Amount</span>
                <span>${parseFloat(amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Network Fee</span>
                <span>~$2.50</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Processing Fee (2.5%)</span>
                <span>${(parseFloat(amount) * 0.025).toFixed(2)}</span>
              </div>
              <div className="h-px bg-white/10 my-2" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${(parseFloat(amount) * 1.025 + 2.5).toFixed(2)}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!amount}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
          >
            Buy {selectedAsset.symbol}
          </button>
        </form>
      </div>
    </div>
  );
};