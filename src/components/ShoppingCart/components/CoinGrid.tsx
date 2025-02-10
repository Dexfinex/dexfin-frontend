import React, { useState, useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';
import { formatNumberByFrac } from '../../../utils/common.util';
import { coingeckoService } from '../../../services/coingecko.service';
import { TokenType } from '../../../types/swap.type';

interface CoinGridProps {
    searchQuery: string;
    selectedCategory: string;
    onAddToCart: (coin: any) => void;
}

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
};

const CoinGrid: React.FC<CoinGridProps> = React.memo(({
    searchQuery,
    selectedCategory,
    onAddToCart
}) => {
    const [loading, setLoading] = useState(false);
    const [coins, setCoins] = useState<TokenType[]>([]);

    useEffect(() => {
        const fetchCoins = async () => {
            setLoading(true);
            try {
                const coinList: TokenType[] = await coingeckoService.getTokenList();
                // console.log("coinList : ", coinList)
                setCoins(coinList);
            } catch (error) {
                console.error('Error fetching coins:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCoins();
    }, []);

    const filteredCoins = useMemo(() => {
        return coins.filter(coin => {
            const matchesCategory = selectedCategory === 'All' || coin.category === selectedCategory;
            const matchesSearch = coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [coins, selectedCategory, searchQuery]);

    const generateChartData = (sparklineData: number[] = []) => ({
        labels: Array.from({ length: sparklineData.length }, (_, i) => i.toString()),
        datasets: [{
            data: sparklineData,
            borderColor: '#10B981',
            borderWidth: 2,
            fill: true,
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4
        }]
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-lg">Loading coins...</div>
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
        <div className="grid grid-cols-2 gap-4 p-4 h-[calc(100%-89px)] overflow-y-auto">
            {filteredCoins.map((coin) => (
                <div
                    key={coin.address}
                    className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all hover:scale-[1.02]"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <img src={coin.logoURI} alt={coin.name} className="w-8 h-8" loading="lazy" />
                            <div>
                                <div className="font-medium">{coin.name}</div>
                                <div className="text-sm text-white/60">{coin.symbol}</div>
                            </div>
                        </div>
                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-white/10">
                            {coin.category}
                        </div>
                    </div>

                    <div className="h-24 mb-3">
                        <Line data={generateChartData(coin.sparkline)} options={chartOptions} />
                    </div>

                    <div className="flex items-center justify-between mb-3">
                        <div className="text-2xl font-bold">
                            ${formatNumberByFrac(coin.price || 0)}
                        </div>
                        <div className={`text-sm flex items-center gap-1 ${(coin.priceChange24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                            {(coin.priceChange24h || 0) >= 0 ?
                                <TrendingUp className="w-4 h-4" /> :
                                <TrendingDown className="w-4 h-4" />
                            }
                            {Math.abs(coin.priceChange24h || 0).toFixed(2)}%
                        </div>
                    </div>

                    <button
                        onClick={() => onAddToCart({
                            id: coin.address,
                            name: coin.name,
                            symbol: coin.symbol,
                            price: coin.price || 0,
                            logo: coin.logoURI,
                            category: coin.category,
                            quantity: 1
                        })}
                        className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                    >
                        Add to Cart
                    </button>
                </div>
            ))}
        </div>
    );
});

CoinGrid.displayName = 'CoinGrid';

export default CoinGrid;