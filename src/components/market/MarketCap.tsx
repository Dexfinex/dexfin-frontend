import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { SparklineChart } from './SparklineChart';
import { coingeckoService } from '../../services/coingecko.service';

export interface MarketCapToken {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  sparkline_in_7d: {
    price: number[];
  };
  logo: string;
}

// Mock data for initial state and fallback
const mockTokens: MarketCapToken[] = [
  {
    id: 'bitcoin',
    rank: 1,
    name: 'Bitcoin',
    symbol: 'btc',
    price: 67245.80,
    priceChange24h: 2.5,
    marketCap: 1320000000000,
    volume24h: 28500000000,
    circulatingSupply: 19584362,
    sparkline_in_7d: {
      price: Array(24).fill(0).map(() => 67000 + Math.random() * 1000)
    },
    logo: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'
  },
  {
    id: 'ethereum',
    rank: 2,
    name: 'Ethereum',
    symbol: 'eth',
    price: 3245.67,
    priceChange24h: -1.2,
    marketCap: 389000000000,
    volume24h: 12800000000,
    circulatingSupply: 120250417,
    sparkline_in_7d: {
      price: Array(24).fill(0).map(() => 3200 + Math.random() * 100)
    },
    logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png'
  }
];

export const MarketCap: React.FC = () => {
  const [tokens, setTokens] = useState<MarketCapToken[]>(mockTokens);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (showRefreshState = false) => {
    try {
      if (showRefreshState) {
        setRefreshing(true);
      }
      
      const data = await coingeckoService.getMarketCap(page);
      // Transform API data to match our Token interface
      const transformedData: MarketCapToken[] = data.map((item: any) => ({
        id: item.id,
        rank: item.marketCapRank,
        name: item.name,
        symbol: item.symbol,
        price: item.price,
        priceChange24h: item.priceChange24h,
        marketCap: item.marketCap,
        volume24h: item.volume24h,
        circulatingSupply: item.circulatingSupply,
        sparkline_in_7d: {
          price: item.sparkline
        },
        logo: item.logoURI
      }));

      setTokens(transformedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError('Failed to load market data');
      // Use mock data as fallback
      setTokens(mockTokens);
    } finally {
      setLoading(false);
      if (showRefreshState) {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 2 minutes
    const interval = setInterval(() => fetchData(), 120000);
    return () => clearInterval(interval);
  }, [page]);

  const handleRefresh = () => {
    fetchData(true);
  };

  const filteredTokens = tokens.filter(token =>
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error && tokens.length === 0) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <p className="text-white/60 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tokens..."
            className="w-full bg-white/5 pl-10 pr-4 py-2 rounded-lg outline-none placeholder:text-white/40"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${
              refreshing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Market Table */}
      <div className="overflow-x-auto market-cap-scrollbar">
        <table className="w-full">
          <thead>
            <tr className="text-left text-white/60">
              <th className="py-3 px-4 whitespace-nowrap">#</th>
              <th className="py-3 px-4 whitespace-nowrap">Token</th>
              <th className="py-3 px-4 whitespace-nowrap">Price</th>
              <th className="py-3 px-4 whitespace-nowrap">24h %</th>
              <th className="py-3 px-4 whitespace-nowrap">Market Cap</th>
              <th className="py-3 px-4 whitespace-nowrap">Volume (24h)</th>
              <th className="py-3 px-4 whitespace-nowrap">Circulating Supply</th>
              <th className="py-3 px-4 whitespace-nowrap">Last 7 Days</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              [...Array(10)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-4">
                    <div className="h-4 w-4 bg-white/10 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-8 w-32 bg-white/10 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-24 bg-white/10 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-16 bg-white/10 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-28 bg-white/10 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-28 bg-white/10 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-28 bg-white/10 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-10 w-28 bg-white/10 rounded" />
                  </td>
                </tr>
              ))
            ) : (
              filteredTokens.map((token) => (
                <tr key={token.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-white/60">{token.rank}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img src={token.logo} alt={token.name} className="w-8 h-8" />
                      <div>
                        <div className="font-medium">{token.name}</div>
                        <div className="text-sm text-white/60">{token.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    ${token.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6
                    })}
                  </td>
                  <td className="py-4 px-4">
                    <div className={`flex items-center gap-1 ${
                      token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {token.priceChange24h >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>{Math.abs(token.priceChange24h).toFixed(2)}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    ${token.marketCap.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    ${token.volume24h.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    {token.circulatingSupply.toLocaleString()} {token.symbol.toUpperCase()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-[40px] w-[120px] ml-auto">
                      <SparklineChart 
                        data={token.sparkline_in_7d.price}
                        color={token.sparkline_in_7d.price[token.sparkline_in_7d.price.length - 1] - token.sparkline_in_7d.price[0] >= 0 ? '#10B981' : '#EF4444'}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-white/60">
          Showing {filteredTokens.length} tokens
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1.5 bg-white/10 rounded-lg">
            Page {page}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};