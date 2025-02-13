import React, { useMemo, useState } from 'react';
import { AlertCircle, Filter, RefreshCw, Search, TrendingDown, TrendingUp } from 'lucide-react';

import { formatAge, formatNumber } from '../../utils';
import { getChainIcon } from '../../utils/getChainIcon';

import { useGetTrendingPools, useGetNewPools, useGetTopPools } from '../../hooks/useGeckoTerminal';

const networks = [
  { id: 'eth', name: 'Ethereum', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { id: 'base', name: 'Base', logo: getChainIcon(8453) },
  { id: 'solana', name: 'Solana', logo: 'https://cryptologos.cc/logos/solana-sol-logo.png' }
];

export const DexExplorer: React.FC = () => {
  const [network, setNetwork] = useState<string>('eth');
  const [view, setView] = useState<'trending' | 'new' | 'top'>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNetworkSelector, setShowNetworkSelector] = useState(false);

  const { data: trendingPoolsData, error: trendingError, isLoading: isLoadingTrending, refetch: refetchTrend } = useGetTrendingPools(network);
  const { data: newPoolsData, error: newError, isLoading: isLoadingNew, refetch: refetchNew } = useGetNewPools(network);
  const { data: topPoolsData, error: topError, isLoading: isLoadingTop, refetch: refetchTop } = useGetTopPools(network);

  const pools = useMemo(() => {
    switch (view) {
      case 'trending':
        return trendingPoolsData;
      case 'new':
        return newPoolsData;
      case 'top':
        return topPoolsData;
      default:
        return trendingPoolsData;
    }
  }, [view, trendingPoolsData, newPoolsData, topPoolsData])

  const error = useMemo(() => {
    return trendingError || newError || topError
  }, [trendingError, newError, topError])

  const loading = useMemo(() => {
    switch (view) {
      case 'trending':
        return isLoadingTrending;
      case 'new':
        return isLoadingNew;
      case 'top':
        return isLoadingTop;
      default:
        return isLoadingTrending;
    }
  }, [isLoadingTrending, isLoadingNew, isLoadingTop, view])

  const handleRefresh = () => {
    switch (view) {
      case 'trending':
        return refetchTrend();
      case 'new':
        return refetchNew();
      case 'top':
        return refetchTop();
      default:
        return refetchTrend();
    }
  };

  const handleNetworkChange = (newNetwork: string) => {
    setNetwork(newNetwork);
    setShowNetworkSelector(false);
  };

  const selectedNetwork = networks.find(n => n.id === network);

  const filteredPools = (pools || []).filter(pool => {
    const searchLower = searchQuery.toLowerCase();
    const baseToken = pool.included?.tokens.find(t =>
      t.id === pool.relationships.base_token.data.id
    );
    const quoteToken = pool.included?.tokens.find(t =>
      t.id === pool.relationships.quote_token.data.id
    );

    return (
      pool.attributes.name.toLowerCase().includes(searchLower) ||
      baseToken?.attributes.symbol.toLowerCase().includes(searchLower) ||
      quoteToken?.attributes.symbol.toLowerCase().includes(searchLower)
    );
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <AlertCircle className="w-8 h-8 mb-2 text-red-400" />
        <p className="mb-4 text-white/60">{error.message}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="h-full p-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Network Selector */}
          <div className="relative">
            <button
              onClick={() => setShowNetworkSelector(!showNetworkSelector)}
              className="flex items-center gap-2 px-3 py-2 transition-colors rounded-lg bg-white/5 hover:bg-white/10"
            >
              {selectedNetwork && (
                <img
                  src={selectedNetwork.logo}
                  alt={selectedNetwork.name}
                  className="w-5 h-5"
                />
              )}
              <span>{selectedNetwork?.name}</span>
              <svg
                className={`w-4 h-4 transition-transform ${showNetworkSelector ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {showNetworkSelector && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowNetworkSelector(false)}
                />
                <div className="absolute left-0 z-20 w-48 py-2 mt-2 rounded-lg top-full glass">
                  {networks.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => handleNetworkChange(n.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors ${network === n.id ? 'bg-white/10' : ''
                        }`}
                    >
                      <img src={n.logo} alt={n.name} className="w-5 h-5" />
                      <span>{n.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('trending')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${view === 'trending' ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
            >
              Trending
            </button>
            <button
              onClick={() => setView('new')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${view === 'new' ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
            >
              New
            </button>
            <button
              onClick={() => setView('top')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${view === 'top' ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
            >
              Top
            </button>
          </div>

          <div className="relative">
            <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pools..."
              className="w-64 py-2 pl-10 pr-4 rounded-lg outline-none bg-white/5 placeholder:text-white/40"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button className="p-2 transition-colors rounded-lg hover:bg-white/10">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pools List */}
      <div className="overflow-x-auto market-cap-scrollbar">
        <table className="w-full">
          <thead>
            <tr className="text-left text-white/60">
              <th className="px-4 py-3 whitespace-nowrap">Pool</th>
              <th className="px-4 py-3 whitespace-nowrap">Price</th>
              <th className="px-4 py-3 whitespace-nowrap">5M %</th>
              <th className="px-4 py-3 whitespace-nowrap">1h %</th>
              <th className="px-4 py-3 whitespace-nowrap">6h %</th>
              <th className="px-4 py-3 whitespace-nowrap">24h %</th>              
              <th className="px-4 py-3 whitespace-nowrap">Volume (24h)</th>
              <th className="px-4 py-3 whitespace-nowrap">TVL</th>
              <th className="px-4 py-3 whitespace-nowrap">Transactions (24h)</th>
              <th className="px-4 py-3 whitespace-nowrap">Age</th>

            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              // Loading skeletons
              [...Array(10)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-4">
                    <div className="w-32 h-8 rounded bg-white/10" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="w-24 h-4 rounded bg-white/10" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="w-16 h-4 rounded bg-white/10" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="w-16 h-4 rounded bg-white/10" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="w-16 h-4 rounded bg-white/10" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="w-16 h-4 rounded bg-white/10" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 rounded w-28 bg-white/10" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 rounded w-28 bg-white/10" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="w-20 h-4 rounded bg-white/10" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="w-16 h-4 rounded bg-white/10" />
                  </td>

                </tr>
              ))
            ) : filteredPools.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center">
                  <Search className="w-12 h-12 mx-auto mb-4 text-white/40" />
                  <p className="mb-2 text-lg font-medium">No pools found</p>
                  <p className="text-white/60">
                    Try adjusting your search or filter criteria
                  </p>
                </td>
              </tr>
            ) : (
              filteredPools.map((pool) => {
                const baseToken = pool.included?.tokens.find(t =>
                  t.id === pool.relationships.base_token.data.id
                );
                const quoteToken = pool.included?.tokens.find(t =>
                  t.id === pool.relationships.quote_token.data.id
                );
                const priceChange5m = parseFloat(pool.attributes.price_change_percentage?.m5 || '0');
                const priceChange1h = parseFloat(pool.attributes.price_change_percentage?.h1 || '0');
                const priceChange6h = parseFloat(pool.attributes.price_change_percentage?.h6 || '0');
                const priceChange24h = parseFloat(pool.attributes.price_change_percentage?.h24 || '0');
                const volume24h = parseFloat(pool.attributes.volume_usd?.h24 || '0');
                const transactions24h = pool.attributes.transactions?.h24 || 0;
                const tvl = parseFloat(pool.attributes.reserve_in_usd || '0');



                return (
                  <tr key={pool.id} className="transition-colors hover:bg-white/5">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {baseToken?.attributes.logo_url ? (
                            <img
                              src={baseToken.attributes.logo_url}
                              alt={baseToken.attributes.symbol}
                              className="w-8 h-8 rounded-full ring-2 ring-[#0a0a0c]"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center ring-2 ring-[#0a0a0c]">
                              <span className="text-xs font-medium">{baseToken?.attributes.symbol.charAt(0)}</span>
                            </div>
                          )}
                          {quoteToken?.attributes.logo_url ? (
                            <img
                              src={quoteToken.attributes.logo_url}
                              alt={quoteToken.attributes.symbol}
                              className="w-8 h-8 rounded-full ring-2 ring-[#0a0a0c]"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center ring-2 ring-[#0a0a0c]">
                              <span className="text-xs font-medium">{quoteToken?.attributes.symbol.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {baseToken?.attributes.symbol}/{quoteToken?.attributes.symbol}
                          </div>
                          <div className="text-sm text-white/60">
                            {pool.attributes.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      ${formatNumber(pool.attributes.base_token_price_usd || '0')}
                    </td>
                    <td className="px-4 py-4">
                      <div className={`flex items-center gap-1 ${priceChange5m >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                        {priceChange5m >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span>{Math.abs(priceChange5m).toFixed(2)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className={`flex items-center gap-1 ${priceChange1h >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                        {priceChange1h >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span>{Math.abs(priceChange1h).toFixed(2)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className={`flex items-center gap-1 ${priceChange6h >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                        {priceChange6h >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span>{Math.abs(priceChange6h).toFixed(2)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className={`flex items-center gap-1 ${priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                        {priceChange24h >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span>{Math.abs(priceChange24h).toFixed(2)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">${formatNumber(volume24h)}</td>
                    <td className="px-4 py-4">${formatNumber(tvl)}</td>
                    <td className="px-4 py-4">{formatNumber(transactions24h)}</td>
                    <td className="px-4 py-4 text-white/60">
                      {formatAge(pool.attributes.pool_created_at)}
                    </td>
                    
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};