import React, { useState, useEffect } from 'react';
import { coingeckoService } from '../../services/coingecko.service';
import { CoinData, SearchResult } from '../../types';
import { PriceChart } from '../PriceChart';
import { Clock, Search, ChevronDown, AlertCircle, RefreshCw } from 'lucide-react';

interface TopCoin {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
}

const defaultCoins: TopCoin[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', thumb: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', thumb: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', thumb: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' }
];

export const MarketPulseWidget: React.FC = () => {
  const [selectedCoin, setSelectedCoin] = useState<TopCoin>(defaultCoins[0]);
  const [data, setData] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (coinId: string, showRefreshState = false) => {
    try {
      if (showRefreshState) {
        setRefreshing(true);
      }
      const coinData = await coingeckoService.getCoinPrice(coinId);
      
      setData(coinData);
      setError(null);
    } catch (err) {
      console.error('Error fetching coin data:', err);
      setError('Failed to load price data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      try {
        const results = await coingeckoService.searchCoins(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching coins:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const selectCoin = (coin: SearchResult) => {
    setSelectedCoin({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      thumb: coin.thumb
    });
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
    setLoading(true);
  };

  useEffect(() => {
    fetchData(selectedCoin.id);
    const interval = setInterval(() => fetchData(selectedCoin.id), 30000);
    return () => clearInterval(interval);
  }, [selectedCoin.id]);

  if (error) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
        <p className="text-white/60 mb-4">{error}</p>
        <button
          onClick={() => fetchData(selectedCoin.id, true)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <img
                src={selectedCoin.thumb}
                alt={selectedCoin.name}
                className="w-8 h-8"
              />
              <div>
                <h3 className="font-semibold">{selectedCoin.name} ({selectedCoin.symbol})</h3>
                {data && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      ${data.price.toLocaleString()}
                    </span>
                    <span className={`text-sm ${data.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {data.priceChange24h.toFixed(2)}%
                    </span>
                  </div>
                )}
              </div>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>

            <button
              onClick={() => fetchData(selectedCoin.id, true)}
              disabled={refreshing}
              className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${
                refreshing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {showSearch && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowSearch(false)}
              />
              <div className="absolute top-full left-0 right-0 mt-2 p-2 glass rounded-lg z-20">
                <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg mb-2">
                  <Search className="w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search coins..."
                    className="bg-transparent outline-none flex-1"
                    autoFocus
                  />
                </div>

                <div className="space-y-1">
                  {searchQuery.length < 2 ? (
                    defaultCoins.map((coin) => (
                      <button
                        key={coin.id}
                        onClick={() => {
                          setSelectedCoin(coin);
                          setShowSearch(false);
                        }}
                        className={`w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors ${
                          selectedCoin.id === coin.id ? 'bg-white/10' : ''
                        }`}
                      >
                        <img
                          src={coin.thumb}
                          alt={coin.name}
                          className="w-6 h-6"
                        />
                        <span className="font-medium">{coin.name}</span>
                        <span className="text-sm text-white/60 ml-auto">
                          {coin.symbol}
                        </span>
                      </button>
                    ))
                  ) : searchResults.length > 0 ? (
                    searchResults.map((coin) => (
                      <button
                        key={coin.id}
                        onClick={() => selectCoin(coin)}
                        className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <img
                          src={coin.thumb}
                          alt={coin.name}
                          className="w-6 h-6"
                        />
                        <span className="font-medium">{coin.name}</span>
                        <span className="text-sm text-white/60 ml-auto">
                          {coin.symbol}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-4 text-sm text-white/40">
                      No results found
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Chart and Stats */}
      <div className="flex-1 flex flex-col p-4">
        {/* Chart */}
        <div className="flex-1">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-white/40 animate-spin" />
            </div>
          ) : data ? (
            <div className="h-[calc(100%-100px)]">
              <PriceChart data={data} />
            </div>
          ) : null}
        </div>

        {/* Stats */}
        {data && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-sm text-white/60 mb-1">Market Cap</div>
              <div className="font-medium">
                ${new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  maximumFractionDigits: 1
                }).format(data.marketCap)}
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-sm text-white/60 mb-1">Volume (24h)</div>
              <div className="font-medium">
                ${new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  maximumFractionDigits: 1
                }).format(data.volume24h)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};