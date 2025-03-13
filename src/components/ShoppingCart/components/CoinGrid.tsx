import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';
import { formatNumberByFrac } from '../../../utils/common.util';
import { coingeckoService } from '../../../services/coingecko.service';
import { TokenTypeB, CoinGridProps } from '../../../types/cart.type';
import debounce from 'lodash/debounce';
import Spinner from './Spinner';
import { SortConfig } from './SearchHeader';

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
    },
    scales: {
        x: { display: false },
        y: { display: false }
    },
    elements: {
        point: { radius: 0 }
    }
} as const;

// Network to platform mapping
const networkToplatform: Readonly<Record<string, string>> = {
    'ethereum': 'ethereum',
    'bsc': 'binance-smart-chain',
    'avalanche': 'avalanche',
    'base': 'base',
    'optimism': 'optimistic-ethereum',
    // 'celo': 'celo'
} as const;

// chainIDPlatform to platform mapping
const chainIDPlatform: Readonly<Record<string, string>> = {
    '1': 'ethereum',
    '56': 'binance-smart-chain',
    '43114': 'avalanche',
    '8453': 'base',
    '10': 'optimistic-ethereum',
    // '42220': 'celo',
    '42161': 'arbitrum-one',
    '137': 'polygon-pos',
} as const;

// List of non-EVM tokens to exclude (case-insensitive symbols)
const nonEvmTokenSymbols = [
    'btc', 'sol', 'xrp', 'ada', 'dot', 'xlm', 'algo', 'hbar', 'xmr', 'bch', 'ltc', 'near',
    'ton', 'miota', 'klay', 'xtz', 'cosmos', 'atom', 'trx', 'eos', 'xec', 'zec', 'xem', 'dcr'
];

interface CoinGridWithSortProps extends CoinGridProps {
    sortConfig: SortConfig;
}

const CoinGrid: React.FC<CoinGridWithSortProps> = React.memo(({
    searchQuery,
    selectedCategory,
    onAddToCart,
    walletChainId,
    sortConfig
}) => {
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [loading, setLoading] = useState(false);
    const [coins, setCoins] = useState<TokenTypeB[]>([]);
    const [visibleCoins, setVisibleCoins] = useState<TokenTypeB[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const itemsPerPage = 6; // Show 6 coins per page (3x2 grid)
    const observer = useRef<IntersectionObserver | null>(null);
    const lastCoinElementRef = useRef<HTMLDivElement | null>(null);
    const coinsRef = useRef<TokenTypeB[]>([]);
    const abortControllerRef = useRef<AbortController | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const getContractAddress = useCallback((platforms: any, chainId: number, selectedcategory: string): string => {
        if (!platforms) return 'null';
        if (selectedcategory !== 'All' && selectedcategory !== 'token' && selectedcategory !== 'meme') {
            const platformKey = networkToplatform[selectedcategory.toLowerCase()];
            return platforms[platformKey];
        }
        else {
            const platformKey = chainIDPlatform[chainId.toString()];
            return platforms[platformKey];
        }
    }, []);

    // Check if a token is an EVM-compatible token
    const isEvmToken = useCallback((coin: TokenTypeB): boolean => {
        if (!coin) return false;

        // Check if symbol is in our non-EVM list
        if (nonEvmTokenSymbols.includes(coin.symbol.toLowerCase())) {
            return false;
        }

        // Check if the token has any EVM platform addresses
        if (coin.platforms) {
            const hasEvmPlatform = Object.keys(chainIDPlatform).some(chainId => {
                const platformKey = chainIDPlatform[chainId];
                return !!coin.platforms[platformKey];
            });

            return hasEvmPlatform;
        }

        return true;
    }, []);

    useEffect(() => {
        setPage(1);
        setHasMore(true);
        setVisibleCoins([]);

        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [searchQuery, selectedCategory, sortConfig]);

    // Fetch coins with abort controller
    useEffect(() => {
        const fetchCoins = async () => {
            if (coinsRef.current.length > 0) return;

            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            abortControllerRef.current = new AbortController();

            setLoading(true);
            try {
                const coinList = await coingeckoService.getTokenList();
                // Filter out non-EVM tokens before setting state
                const evmTokens = coinList.filter(isEvmToken);
                setCoins(evmTokens);
                coinsRef.current = evmTokens;
                console.log("evmTokens : ", evmTokens)
            } catch (error) {
                if (error === 'AbortError') return;
                console.error('Error fetching coins:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCoins();

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [isEvmToken]);

    // Memoized and optimized filtering
    const filteredCoins = useMemo(() => {
        const searchLower = searchQuery.toLowerCase().trim();

        // First filter the coins
        const filtered = coins.filter(coin => {
            if (!coin) return false;

            // Search matching
            const matchesSearch = searchLower === '' ||
                coin.name.toLowerCase().includes(searchLower) ||
                coin.symbol.toLowerCase().includes(searchLower);

            if (!matchesSearch) return false;

            // Category filtering
            if (selectedCategory === 'All') return true;
            if (selectedCategory === 'token' || selectedCategory === 'meme') {
                return coin.category === selectedCategory;
            }
            // Network-based filtering
            const platformKey = networkToplatform[selectedCategory.toLowerCase()];
            return platformKey ? coin.platforms?.[platformKey] : false;
        });

        // Then sort the filtered coins
        return [...filtered].sort((a, b) => {
            const { option, direction } = sortConfig;
            const multiplier = direction === 'asc' ? 1 : -1;

            switch (option) {
                case 'marketCap':
                    return multiplier * ((a.marketCap || 0) - (b.marketCap || 0));
                case 'price':
                    return multiplier * ((a.price || 0) - (b.price || 0));
                case 'priceChange24h':
                    return multiplier * ((a.priceChange24h || 0) - (b.priceChange24h || 0));
                case 'marketCapRank': {
                    // For rank, lower is better regardless of direction
                    const aRank = a.marketCapRank || 9999;
                    const bRank = b.marketCapRank || 9999;
                    return direction === 'asc' ? aRank - bRank : bRank - aRank;
                }
                default:
                    return multiplier * ((a.marketCap || 0) - (b.marketCap || 0));
            }
        });
    }, [coins, selectedCategory, searchQuery, sortConfig]);

    // Load more coins when page changes
    useEffect(() => {
        if (page === 1) {
            setVisibleCoins(filteredCoins.slice(0, itemsPerPage));
        } else {
            const nextCoins = filteredCoins.slice(0, page * itemsPerPage);
            setVisibleCoins(nextCoins);
        }

        setHasMore(page * itemsPerPage < filteredCoins.length);
    }, [filteredCoins, page, itemsPerPage]);

    // Setup intersection observer for infinite scroll
    useEffect(() => {
        if (loading) return;

        // Disconnect previous observer
        if (observer.current) {
            observer.current.disconnect();
        }

        // Create new observer
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                // User has scrolled to the last item, load more
                setPage(prevPage => prevPage + 1);
            }
        }, { threshold: 0.5 });

        // Observe the last coin element
        if (lastCoinElementRef.current) {
            observer.current.observe(lastCoinElementRef.current);
        }

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [hasMore, loading, visibleCoins]);

    // Handle scroll events to show/hide scrollbar
    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        // Show scrollbar
        setIsScrolling(true);

        // Clear existing timeout
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        // Set timeout to hide scrollbar after scrolling stops
        scrollTimeoutRef.current = setTimeout(() => {
            setIsScrolling(false);
        }, 1000); // Hide after 1 second of inactivity
    }, []);

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    // Memoized chart data generation
    const generateChartData = useCallback((sparklineData: number[] = []) => ({
        labels: Array.from({ length: sparklineData.length }, (_, i) => i.toString()),
        datasets: [{
            data: sparklineData,
            borderColor: '#10B981',
            borderWidth: 2,
            fill: true,
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4
        }]
    }), []);

    // Debounced add to cart handler
    const debouncedAddToCart = useCallback(
        debounce((item: any) => {
            onAddToCart(item);
        }, 300),
        [onAddToCart]
    );

    if (loading && visibleCoins.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-lg"><Spinner /> Loading coins...</div>
            </div>
        );
    }

    if (filteredCoins.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <Search className="w-12 h-12 text-white/40 mb-4" />
                <p className="text-lg font-medium mb-2">No coins found</p>
                <p className="text-white/60">Try adjusting your search or filter criteria</p>
            </div>
        );
    }

    return (
        <div
            ref={scrollContainerRef}
            className={`h-full overflow-y-auto transition-all duration-300 ${isScrolling
                ? "scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent"
                : "scrollbar-none"
                }`}
            onScroll={handleScroll}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                {visibleCoins.map((coin, index) => {
                    const contractAddress = getContractAddress(coin.platforms, walletChainId, selectedCategory);
                    // Skip coins without contract addresses
                    if (contractAddress === 'null' && selectedCategory !== 'All' &&
                        selectedCategory !== 'token' && selectedCategory !== 'meme') {
                        return null;
                    }

                    // Set ref for the last element to detect when it's visible
                    const isLastElement = index === visibleCoins.length - 1;

                    return (
                        <div
                            key={`${coin.id}-${index}`}
                            ref={isLastElement ? lastCoinElementRef : null}
                            className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all hover:scale-[1.02]"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={coin.logoURI || "/placeholder.svg"}
                                        alt={coin.name}
                                        className="w-8 h-8"
                                        loading="lazy"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/placeholder.png"
                                        }}
                                    />
                                    <div>
                                        <div className="font-medium">{coin.name}</div>
                                        <div className="text-sm text-white/60">{coin.symbol}</div>
                                    </div>
                                </div>
                                <div className="px-2 py-1 rounded-full text-xs font-medium bg-white/10">{coin.category}</div>
                            </div>

                            <div className="h-16 sm:h-24 mb-3">
                                <Line data={generateChartData(coin.sparkline)} options={chartOptions} />
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                                <div className="text-xl sm:text-2xl font-bold">${formatNumberByFrac(coin.price || 0)}</div>
                                <div
                                    className={`text-sm flex items-center gap-1 ${(coin.priceChange24h || 0) >= 0 ? "text-green-400" : "text-red-400"}`}
                                >
                                    {(coin.priceChange24h || 0) >= 0 ? (
                                        <TrendingUp className="w-4 h-4" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4" />
                                    )}
                                    {Math.abs(coin.priceChange24h || 0).toFixed(2)}%
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    console.log("coin : ", coin)
                                    debouncedAddToCart({
                                        id: coin.id,
                                        name: coin.name,
                                        symbol: coin.symbol,
                                        price: coin.price || 0,
                                        logo: coin.logoURI,
                                        category: coin.category,
                                        quantity: 1,
                                        address: contractAddress,
                                        chainId: coin.chainId,
                                        decimals: coin.decimals,
                                    })
                                }

                                }
                                className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                                disabled={contractAddress === 'null'}
                            >
                                Add to Cart
                            </button>
                        </div>
                    )
                }).filter(Boolean)}
            </div>

            {/* Loading indicator at the bottom */}
            {hasMore && (
                <div className="flex justify-center p-4">
                    <Spinner />
                </div>
            )}
        </div>
    );
});

CoinGrid.displayName = 'CoinGrid';

export default CoinGrid;