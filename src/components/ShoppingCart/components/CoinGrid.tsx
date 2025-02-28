import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';
import { formatNumberByFrac } from '../../../utils/common.util';
import { coingeckoService } from '../../../services/coingecko.service';
import { TokenTypeB, CoinGridProps } from '../../../types/cart.type';
import debounce from 'lodash/debounce';
import Spinner from './Spinner';

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
    'celo': 'celo'
} as const;

// chainIDPlatform to platform mapping
const chainIDPlatform: Readonly<Record<string, string>> = {
    '1': 'ethereum',
    '56': 'binance-smart-chain',
    '43114': 'avalanche',
    '8453': 'base',
    '10': 'optimistic-ethereum',
    '42220': 'celo',
    '42161': 'arbitrum-one',
    '137': 'polygon-pos',
} as const;
const CoinGrid: React.FC<CoinGridProps> = React.memo(({
    searchQuery,
    selectedCategory,
    onAddToCart,
    walletChainId
}) => {
    const [loading, setLoading] = useState(false);
    const [coins, setCoins] = useState<TokenTypeB[]>([]);
    const coinsRef = useRef<TokenTypeB[]>([]);
    const abortControllerRef = useRef<AbortController | null>(null);

    const getContractAddress = useCallback((platforms: any, chainId: number, selectedcategory: string): string => {
        if (!platforms) return 'null';
        if (selectedcategory !== 'All' && selectedcategory !== 'token' && selectedcategory !== 'meme') {
            const platformKey = networkToplatform[selectedcategory.toLowerCase()];
            // console.log("selectedcategory : ", platforms[platformKey]);
            return platforms[platformKey];
        }
        else {
            // console.log("chainIDPlatform : ", chainIDPlatform[chainId.toString()]);
            const platformKey = chainIDPlatform[chainId.toString()];
            return platforms[platformKey];
        }
    }, []);

    // Fetch coins with abort controller
    useEffect(() => {
        const fetchCoins = async () => {
            if (coinsRef.current.length > 0) return;

            // Cancel previous request if exists
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            // Create new abort controller
            abortControllerRef.current = new AbortController();

            setLoading(true);
            try {
                const coinList = await coingeckoService.getTokenList();
                setCoins(coinList);
                coinsRef.current = coinList;
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
    }, []);

    // Memoized and optimized filtering
    const filteredCoins = useMemo(() => {
        const searchLower = searchQuery.toLowerCase().trim();
        return coins.filter(coin => {
            // Quick exit if coin is invalid
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
            // console.log("platformKey : ", platformKey);
            return platformKey ? coin.platforms?.[platformKey] : false;
        });
    }, [coins, selectedCategory, searchQuery]);

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

    if (loading) {
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
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                {filteredCoins.map((coin, index) => {
                    const contractAddress = getContractAddress(coin.platforms, walletChainId, selectedCategory)
                    return (
                        <div
                            key={index}
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
                                            ; (e.target as HTMLImageElement).src = "/placeholder.png"
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
                                onClick={() =>
                                    debouncedAddToCart({
                                        id: coin.id,
                                        name: coin.name,
                                        symbol: coin.symbol,
                                        price: coin.price || 0,
                                        logo: coin.logoURI,
                                        category: coin.category,
                                        quantity: 1,
                                        address: contractAddress,
                                        chainId: walletChainId,
                                        decimals: coin.decimals,
                                    })
                                }
                                className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                            >
                                Add to Cart
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )

});

CoinGrid.displayName = 'CoinGrid';

export default CoinGrid;