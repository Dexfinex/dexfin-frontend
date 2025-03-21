import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';
import { formatNumberByFrac } from '../../../utils/common.util';
import { coingeckoService } from '../../../services/coingecko.service';
import { TokenTypeB } from '../../../types/cart.type';
import debounce from 'lodash/debounce';
import Spinner from './Spinner';
import { SortConfig } from './SearchHeader';

// Base chart options
const getChartOptions = () => ({
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
} as const);

// Network to platform mapping
const networkToplatform: Readonly<Record<string, string>> = {
    'Ethereum': 'ethereum',
    'Bsc': 'binance-smart-chain',
    'Avalanche': 'avalanche',
    'Base': 'base',
    'Optimism': 'optimistic-ethereum',
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

// Platform to chainId mapping (reverse of chainIDPlatform)
const platformToChainId: Readonly<Record<string, number>> = {
    'ethereum': 1,
    'binance-smart-chain': 56,
    'avalanche': 43114,
    'base': 8453,
    'optimistic-ethereum': 10,
    'arbitrum-one': 42161,
    'polygon-pos': 137,
    // 'celo': 42220,
} as const;

// List of non-EVM tokens to exclude (case-insensitive symbols)
const nonEvmTokenSymbols = [
    'btc', 'sol', 'xrp', 'ada', 'dot', 'xlm', 'algo', 'hbar', 'xmr', 'bch', 'ltc', 'near',
    'ton', 'miota', 'klay', 'xtz', 'cosmos', 'atom', 'trx', 'eos', 'xec', 'zec', 'xem', 'dcr'
];

// Category background colors for badges
const categoryColors: Record<string, string> = {
    'Meme': 'bg-purple-500/30',
    'DeFi': 'bg-blue-500/30',
    'AI': 'bg-green-500/30',
    'DeFi AI': 'bg-teal-500/30',
    'Layer 2': 'bg-indigo-500/30',
    'GameFi': 'bg-pink-500/30',
    'Metaverse': 'bg-cyan-500/30',
    'Infrastructure': 'bg-orange-500/30',
    'Social': 'bg-red-500/30',
    'Sports': 'bg-emerald-500/30',
    'token': 'bg-white/10'
};

// Updated props interface with separate token and network category props
interface CoinGridWithSortProps {
    searchQuery: string;
    activeTokenCategory: string;
    activeNetworkCategory: string | null;
    onAddToCart: (item: any) => void;
    walletChainId: number;
    sortConfig: SortConfig;
}

const CoinGrid: React.FC<CoinGridWithSortProps> = ({
    searchQuery,
    activeTokenCategory,
    activeNetworkCategory,
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
    const loadingIndicatorRef = useRef<HTMLDivElement | null>(null);
    const coinsRef = useRef<TokenTypeB[]>([]);
    const abortControllerRef = useRef<AbortController | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Check if a token is available on a specific network/platform
    const isTokenAvailableOnNetwork = useCallback((coin: TokenTypeB, networkName: string): boolean => {
        if (!coin.platforms) return false;

        const platformKey = networkToplatform[networkName];
        return !!coin.platforms[platformKey];
    }, []);

    // Get contract address based on active filters
    const getContractAddress = useCallback((platforms: any): string => {
        if (!platforms) return 'null';

        // If a network category is active, use that platform's contract address specifically
        if (activeNetworkCategory) {
            const platformKey = networkToplatform[activeNetworkCategory];
            return platforms[platformKey] || 'null';
        }

        // Otherwise, get the first available platform
        for (const platformKey of Object.values(chainIDPlatform)) {
            if (platforms[platformKey]) {
                return platforms[platformKey];
            }
        }

        return 'null';
    }, [activeNetworkCategory]);

    // Get chainId based on active filters
    const getChainId = useCallback((platforms: any): number => {
        // If a network category is active, use that specific network's chain ID
        if (activeNetworkCategory) {
            const platformKey = networkToplatform[activeNetworkCategory];
            // Check if the platform exists for this token
            if (platforms[platformKey]) {
                // Return the chainId that corresponds to the selected network
                return platformToChainId[platformKey];
            }
        }

        // If no network is selected or the selected network doesn't have this token,
        // find the first available platform's chainId
        for (const [chainId, platformKey] of Object.entries(chainIDPlatform)) {
            if (platforms[platformKey]) {
                return parseInt(chainId);
            }
        }

        // Default to wallet chainId if no platforms found
        return walletChainId;
    }, [activeNetworkCategory, walletChainId]);

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
    }, [searchQuery, activeTokenCategory, activeNetworkCategory, sortConfig]);

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
                console.log("evmTokens : ", evmTokens);
            } catch (error) {
                if (error instanceof DOMException && error.name === "AbortError") return;
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

        // Log for debugging
        console.log("Filtering with token category:", activeTokenCategory);
        console.log("Filtering with network category:", activeNetworkCategory);
        console.log("Total coins before filtering:", coins.length);

        // Filter the coins based on both token category and network category
        const filtered = coins.filter(coin => {
            if (!coin) return false;

            // Search matching
            const matchesSearch = searchLower === '' ||
                coin.name.toLowerCase().includes(searchLower) ||
                coin.symbol.toLowerCase().includes(searchLower);

            if (!matchesSearch) return false;

            // Token category filtering
            const matchesTokenCategory = activeTokenCategory === 'All' ||
                coin.category === activeTokenCategory;

            if (!matchesTokenCategory) return false;

            // Network category filtering (if selected)
            if (activeNetworkCategory) {
                return isTokenAvailableOnNetwork(coin, activeNetworkCategory);
            }

            // If we pass all filters
            return true;
        });

        console.log("Filtered coins count:", filtered.length);

        // Sort the filtered coins
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
    }, [coins, activeTokenCategory, activeNetworkCategory, searchQuery, sortConfig, isTokenAvailableOnNetwork]);

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

    // Setup load more trigger when scrolling near the bottom
    useEffect(() => {
        if (loading) return;

        const handleScroll = () => {
            if (!scrollContainerRef.current || !hasMore) return;

            const container = scrollContainerRef.current;
            const scrollPosition = container.scrollTop + container.clientHeight;
            const scrollThreshold = container.scrollHeight - 300; // Load more when within 300px of bottom

            if (scrollPosition > scrollThreshold) {
                setPage(prevPage => prevPage + 1);
            }
        };

        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, [hasMore, loading]);

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

    // Get category background color class
    const getCategoryBgColor = useCallback((category: string): string => {
        return categoryColors[category] || 'bg-white/10';
    }, []);

    // Memoized chart data generation with conditional colors based on price change
    const generateChartData = useCallback((sparklineData: number[] = [], priceChange24h: number = 0) => {
        // Determine color based on price change
        const isPositiveChange = priceChange24h >= 0;
        const borderColor = isPositiveChange ? '#10B981' : '#EF4444'; // Green for positive, red for negative
        const backgroundColor = isPositiveChange ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';

        return {
            labels: Array.from({ length: sparklineData.length }, (_, i) => i.toString()),
            datasets: [{
                data: sparklineData,
                borderColor: borderColor,
                borderWidth: 2,
                fill: true,
                backgroundColor: backgroundColor,
                tension: 0.4
            }]
        };
    }, []);

    // Debounced add to cart handler
    const debouncedAddToCart = useCallback(
        debounce((item: any) => {
            // console.log("item : ", item);
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
            className={`h-full overflow-y-auto transition-all duration-300 overscroll-contain ${isScrolling
                ? "scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent"
                : "scrollbar-none"
                }`}
            onScroll={handleScroll}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 pb-10">
                {visibleCoins.map((coin, index) => {
                    // Get contract address
                    const contractAddress = getContractAddress(coin.platforms);

                    // Skip coins without contract addresses if a network category is active
                    if (activeNetworkCategory && contractAddress === 'null') {
                        return null;
                    }

                    // Get chain ID
                    const chainId = getChainId(coin.platforms);

                    // Determine if price change is positive or negative
                    const isPricePositive = (coin.priceChange24h || 0) >= 0;

                    return (
                        <div
                            key={`${coin.id}-${index}`}
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
                                            (e.target as HTMLImageElement).src = "/placeholder.png";
                                        }}
                                    />
                                    <div>
                                        <div className="font-medium">{coin.name}</div>
                                        <div className="text-sm text-white/60">{coin.symbol}</div>
                                    </div>
                                </div>
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBgColor(coin.category)}`}>
                                    {coin.category}
                                </div>
                            </div>

                            <div className="h-16 sm:h-24 mb-3">
                                <Line
                                    data={generateChartData(coin.sparkline, coin.priceChange24h)}
                                    options={getChartOptions()}
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                                <div className="text-xl sm:text-2xl font-bold">${formatNumberByFrac(coin.price || 0)}</div>
                                <div
                                    className={`text-sm flex items-center gap-1 ${isPricePositive ? "text-green-400" : "text-red-400"}`}
                                >
                                    {isPricePositive ? (
                                        <TrendingUp className="w-4 h-4" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4" />
                                    )}
                                    {Math.abs(coin.priceChange24h || 0).toFixed(2)}%
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    // Get the network-specific data
                                    const CchainId = getChainId(coin.platforms);
                                    // Log for debugging
                                    // console.log(`Adding ${coin.symbol} with chainId: ${CchainId} for network: ${activeNetworkCategory || 'none'}`);
                                    debouncedAddToCart({
                                        id: coin.id,
                                        name: coin.name,
                                        symbol: coin.symbol,
                                        price: coin.price || 0,
                                        logo: coin.logoURI,
                                        category: coin.category,
                                        quantity: 1,
                                        address: contractAddress,
                                        chainId: CchainId,
                                        decimals: coin.decimals,
                                        marketCap: coin.marketCap,
                                        marketCapRank: coin.marketCapRank,
                                        priceChange24h: coin.priceChange24h,
                                        sparkline: coin.sparkline,
                                        volume24h: coin.volume24h,
                                        platforms: coin.platforms
                                    });
                                }}
                                className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                                disabled={contractAddress === 'null'}
                            >
                                Add to Cart
                            </button>
                        </div>
                    );
                }).filter(Boolean)}
            </div>

            {/* Loading indicator at the bottom */}
            <div
                ref={loadingIndicatorRef}
                className="flex justify-center p-4 mt-4 mb-8 h-16"
            >
                {hasMore && <Spinner />}
            </div>
        </div>
    );
};

CoinGrid.displayName = 'CoinGrid';

export default React.memo(CoinGrid);