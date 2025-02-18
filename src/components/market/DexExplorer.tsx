import React, { useMemo, useState, useEffect } from 'react';
import { AlertCircle, Filter, RefreshCw, Search, TrendingDown, TrendingUp, ArrowUpDown } from 'lucide-react';
import _ from 'lodash';
import { formatAge, formatNumber } from '../../utils';
import { getChainIcon } from '../../utils/getChainIcon';

import { useGetTrendingPools, useGetNewPools, useGetTopPools } from '../../hooks/useGeckoTerminal';
import {LoadingSpinner} from './LoadingSpinner'


const networks = [
  { id: 'eth', name: 'Ethereum', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { id: 'base', name: 'Base', logo: getChainIcon(8453) },
  { id: 'solana', name: 'Solana', logo: 'https://cryptologos.cc/logos/solana-sol-logo.png' },

];

interface BaseToken {
  id: string;
  type: string;
  attributes: {
    name: string;
    symbol: string;
    image_url?: string;
  };
}

export const DexExplorer: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [network, setNetwork] = useState<string>('eth');
  const [view, setView] = useState<'trending' | 'new' | 'top'>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNetworkSelector, setShowNetworkSelector] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: '',
    direction: 'desc'
  });



  const handleSort = (key: string) => {
    let direction = 'desc';


    if (sortConfig.key === key) {
      direction = sortConfig.direction === 'desc' ? 'asc' : 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const { data: trendingPoolsData, error: trendingError, isLoading: isLoadingTrending, refetch: refetchTrend } = useGetTrendingPools(network);
  const { data: newPoolsData, error: newError, isLoading: isLoadingNew, refetch: refetchNew } = useGetNewPools(network);
  const { data: topPoolsData, error: topError, isLoading: isLoadingTop, refetch: refetchTop } = useGetTopPools(network);

  useEffect(() => {
    setCurrentPage(1);
  }, [network, sortConfig, searchQuery, view]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
useEffect(() => {
  const fetchInitialData = async () => {
    setIsInitialLoading(true);
    try {
      if (view === 'trending') await refetchTrend();
      if (view === 'new') await refetchNew();
      if (view === 'top') await refetchTop();
    } finally {
      setIsInitialLoading(false);
    }
  };

  fetchInitialData();
}, [network, view]);
  const SortIndicator = ({ currentKey }: { currentKey: string }) => {
    if (sortConfig.key !== currentKey) {
      return <ArrowUpDown className="w-4 h-4 ml-1 opacity-50" />;
    }
    return (
      <ArrowUpDown
        className={`w-4 h-4 ml-1 ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`}
      />
    );
  };



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
    setView('trending');
    setSearchQuery('');
  };
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
  }, [view, trendingPoolsData, newPoolsData, topPoolsData, network]);

  
  const selectedNetwork = useMemo(()=>{
    return networks.find(n=>n.id === network)
  }, [network])
  
  // const selectedNetwork = networks.find(n => n.id === network);

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
const sortedPools = useMemo(() => {
    if (!sortConfig.key || !filteredPools) return filteredPools;

    return [...filteredPools].sort((a, b) => {
      let aValue: number = 0;
      let bValue: number = 0;
      
      const parseFormattedNumber = (value: string): number => {
        if (!value) return 0;
        const cleanValue = value.replace(/,/g, '').toUpperCase();
        const multipliers = { 'K': 1000, 'M': 1000000, 'B': 1000000000 };
        const match = cleanValue.match(/^([\d.]+)([KMB])?$/);
        if (!match) return 0;
        const [, number, suffix] = match;
        const baseValue = parseFloat(number);
        return suffix && multipliers[suffix] ? baseValue * multipliers[suffix] : baseValue;
      };

      const parseAgeToMinutes = (age: string): number => {
        if (!age) return 0;
        const cleanAge = age.toLowerCase().trim();
        const match = cleanAge.match(/^(\d+)(y|mth|d|h|m)$/);
        if (!match) return 0;
        const [, value, unit] = match;
        const numValue = parseInt(value);
        const multipliers = {
          'y': 525600,
          'mth': 43800,
          'd': 1440,
          'h': 60,
          'm': 1
        };
        return numValue * (multipliers[unit] || 0);
      };

      try {
        switch (sortConfig.key) {
          case 'price':
            aValue = parseFormattedNumber(a.attributes.base_token_price_usd || '0');
            bValue = parseFormattedNumber(b.attributes.base_token_price_usd || '0');
            break;
          case '5m':
            aValue = parseFloat(a.attributes.price_change_percentage?.m5 || '0');
            bValue = parseFloat(b.attributes.price_change_percentage?.m5 || '0');
            break;
          case '1h':
            aValue = parseFloat(a.attributes.price_change_percentage?.h1 || '0');
            bValue = parseFloat(b.attributes.price_change_percentage?.h1 || '0');
            break;
          case '6h':
            aValue = parseFloat(a.attributes.price_change_percentage?.h6 || '0');
            bValue = parseFloat(b.attributes.price_change_percentage?.h6 || '0');
            break;
          case '24h':
            aValue = parseFloat(a.attributes.price_change_percentage?.h24 || '0');
            bValue = parseFloat(b.attributes.price_change_percentage?.h24 || '0');
            break;
          case 'volume':
            aValue = parseFormattedNumber(a.attributes.volume_usd?.h24 || '0');
            bValue = parseFormattedNumber(b.attributes.volume_usd?.h24 || '0');
            break;
          case 'tvl':
            aValue = parseFormattedNumber(a.attributes.reserve_in_usd || '0');
            bValue = parseFormattedNumber(b.attributes.reserve_in_usd || '0');
            break;
          case 'transactions':
            const aTransactions = typeof a.attributes.transactions?.h24 === 'string'
              ? JSON.parse(a.attributes.transactions.h24)
              : a.attributes.transactions?.h24 || { buyers: 0, sellers: 0 };
            const bTransactions = typeof b.attributes.transactions?.h24 === 'string'
              ? JSON.parse(b.attributes.transactions.h24)
              : b.attributes.transactions?.h24 || { buyers: 0, sellers: 0 };
            aValue = Number(aTransactions.buyers || 0) + Number(aTransactions.sellers || 0);
            bValue = Number(bTransactions.buyers || 0) + Number(bTransactions.sellers || 0);
            break;
          case 'age':
            aValue = parseAgeToMinutes(formatAge(a.attributes.pool_created_at));
            bValue = parseAgeToMinutes(formatAge(b.attributes.pool_created_at));
            break;
          default:
            return 0;
        }
      } catch (error) {
        console.error('Sorting error:', error);
        return 0;
      }

      const multiplier = sortConfig.direction === 'asc' ? 1 : -1;
      return (aValue - bValue) * multiplier;
    });
  }, [filteredPools, sortConfig]);

  const paginatedItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return sortedPools.slice(indexOfFirstItem, indexOfLastItem);
  }, [sortedPools, currentPage, itemsPerPage]);
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
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedPools.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedPools.length / itemsPerPage);
  
  const PaginationButton = ({ page, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg transition-colors ${
        isActive 
          ? 'bg-white/10' 
          : 'hover:bg-white/5'
      }`}
    >
      {page}
    </button>
  );
  const Pagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  
    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5 ${
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          ‹ Prev
        </button>
        
        {pages.map(page => (
          <PaginationButton
            key={page}
            page={page}
            isActive={currentPage === page}
            onClick={() => setCurrentPage(page)}
          />
        ))}
  
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5 ${
            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Next ›
        </button>
      </div>
    );
  };
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
                  src={selectedNetwork.logo ? selectedNetwork.logo : ''}
                  // src={selectedNetwork.logo}
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
                      <img src={n.logo ? n.logo : ''} alt={n.name} className="w-5 h-5" />
                      {/* <img src={n.logo} alt={n.name} className="w-5 h-5" /> */}
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
              <th className="px-4 py-3 font-medium whitespace-nowrap">Pool</th>
              <th
                className="px-4 py-3 font-medium cursor-pointer whitespace-nowrap hover:text-white"
                onClick={() => handleSort('price')}
              >
                Price{sortConfig.key === 'price' && <SortIndicator currentKey="price" />}
              </th>
              <th
                className="px-4 py-3 font-medium cursor-pointer whitespace-nowrap hover:text-white"
                onClick={() => handleSort('5m')}
              >
                5M %{sortConfig.key === '5m' && <SortIndicator currentKey="5m" />}
              </th>
              <th
                className="px-4 py-3 font-medium cursor-pointer whitespace-nowrap hover:text-white"
                onClick={() => handleSort('1h')}
              >
                1h %{sortConfig.key === '1h' && <SortIndicator currentKey="1h" />}
              </th>
              <th
                className="px-4 py-3 font-medium cursor-pointer whitespace-nowrap hover:text-white"
                onClick={() => handleSort('6h')}
              >
                6h %{sortConfig.key === '6h' && <SortIndicator currentKey="6h" />}
              </th>
              <th
                className="px-4 py-3 font-medium cursor-pointer whitespace-nowrap hover:text-white"
                onClick={() => handleSort('24h')}
              >
                24h %{sortConfig.key === '24h' && <SortIndicator currentKey="24h" />}
              </th>
              <th
                className="px-4 py-3 font-medium cursor-pointer whitespace-nowrap hover:text-white"
                onClick={() => handleSort('volume')}
              >
                Volume (24h){sortConfig.key === 'volume' && <SortIndicator currentKey="volume" />}
              </th>
              <th
                className="px-4 py-3 font-medium cursor-pointer whitespace-nowrap hover:text-white"
                onClick={() => handleSort('tvl')}
              >
                TVL{sortConfig.key === 'tvl' && <SortIndicator currentKey="tvl" />}
              </th>
              <th
                className="px-4 py-3 font-medium cursor-pointer whitespace-nowrap hover:text-white"
                onClick={() => handleSort('transactions')}
              >
                Transactions (24h){sortConfig.key === 'transactions' && <SortIndicator currentKey="transactions" />}
              </th>
              <th
                className="px-4 py-3 font-medium cursor-pointer whitespace-nowrap hover:text-white"
                onClick={() => handleSort('age')}
              >
                Age{sortConfig.key === 'age' && <SortIndicator currentKey="age" />}
              </th>
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
            ) : paginatedItems.length === 0 ? (
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
              paginatedItems.map((pool) => {
                const baseToken = pool.included?.tokens.find(t =>
                  t.id === pool.relationships.base_token.data.id
                );
                const quoteToken = pool.included?.tokens.find(t =>
                  t.id === pool.relationships.quote_token.data.id
                );
                const Token_price=parseFloat(pool.attributes.base_token_price_usd || '0');
                const priceChange5m = parseFloat(pool.attributes.price_change_percentage?.m5 || '0');
                const priceChange1h = parseFloat(pool.attributes.price_change_percentage?.h1 || '0');
                const priceChange6h = parseFloat(pool.attributes.price_change_percentage?.h6 || '0');
                const priceChange24h = parseFloat(pool.attributes.price_change_percentage?.h24 || '0');
                const volume24h = parseFloat(pool.attributes.volume_usd?.h24 || '0');
                const tvl = parseFloat(pool.attributes.reserve_in_usd || '0');
                const transactions24h_json = JSON.stringify(pool.attributes.transactions?.h24 || 0);
                const token_age = pool.attributes.pool_created_at;
                const transactions24h = Number(JSON.parse(transactions24h_json).buyers) + Number(JSON.parse(transactions24h_json).sellers)

                return (
                  <tr key={pool.id} className="transition-colors hover:bg-white/5">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {(baseToken as BaseToken)?.attributes.image_url ? (
                            <img
                              src={(baseToken as BaseToken).attributes.image_url}
                              alt={(baseToken as BaseToken).attributes.symbol}
                              className="w-8 h-8 rounded-full ring-2 ring-[#0a0a0c]"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center ring-2 ring-[#0a0a0c]">
                              <span className="text-xs font-medium">{baseToken?.attributes.symbol.charAt(0)}</span>
                            </div>
                          )}
                          {(quoteToken as BaseToken)?.attributes.image_url ? (
                            <img
                              src={(quoteToken as BaseToken).attributes.image_url}
                              alt={(quoteToken as BaseToken).attributes.symbol}
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
                      ${formatNumber(Token_price)}
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
                    <td className="px-4 py-4">{formatNumber(volume24h)}</td>
                    <td className="px-4 py-4">{formatNumber(tvl)}</td>
                    <td className="px-4 py-4">{formatNumber(transactions24h)}</td>
                    <td className="px-4 py-4 text-white/60">
                      {formatAge(token_age)}
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        </div>
  <Pagination />
  {isInitialLoading && <LoadingSpinner />}
    </div>
  );
};