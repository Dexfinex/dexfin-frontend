import React, { useState, useEffect } from 'react';
import {
    TrendingUp, TrendingDown, Wallet, BarChart2,
    RefreshCw, AlertCircle, DollarSign, ArrowRight,
    Shield, Activity, Globe, Users, Clock, Bell,
    ArrowUpDown, FileText, ExternalLink
} from 'lucide-react';
import { Line } from 'react-chartjs-2';

// import useFearGreedStore from '../../store/useFearGreedStore';
import useDefillamaStore from '../../store/useDefillamaStore';
import { useGetDefillamaProtocols, useGetChainTVL, useGetDexVolume } from '../../hooks/useDefillama';
import { formatNumberByFrac } from '../../utils/common.util';
import { DefillamaChainTVL } from '../../types/index';
import { set } from 'lodash';
import { coingeckoService } from '../../services/coingecko.service';



interface MarketOverview {
    totalTVL: number;
    tvlChange24h: number;
    networks: {
        name: string;
        tvl: number;
        change24h: number;
        logo: string;
    }[];
    dexVolume24h: number;
    cexVolume24h: number;
    stablecoins: {
        name: string;
        symbol: string;
        supply: number;
        logo: string;
    }[];
}
interface SpecialTVL {
    gecko_id: string;
    tvl: string;
    tokenSymbol: string;
    cmcId: string;
    name: string;
    chainId: number;
    logo: string;

}

interface Stablecoin {
    id: string;
    name: string;
    symbol: string;
    current_price: number;
    market_cap: number;
    total_supply: number;
    image: string;
    // Add other fields as needed
}

interface CoinGeckoToken {
    id: string;
    name: string;
    symbol: string;
    current_price: number;
    market_cap: number;
    total_supply: number;
    image: string;
}
interface CexVolume {
    trade_volume_24h_usd_sum: number;
    trade_volume_24h_usd_normalized_sum: number;
}

const spacialTvlLogo: { [key: string]: string } = {
    ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    BNB: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
    SOL: "https://cryptologos.cc/logos/solana-sol-logo.png",
}

// Mock data
const mockMarketOverview: MarketOverview = {
    totalTVL: 48.5,
    tvlChange24h: 2.5,
    networks: [
        {
            name: 'Ethereum',
            tvl: 25.8,
            change24h: 1.8,
            logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
        },
        {
            name: 'BSC',
            tvl: 8.2,
            change24h: 3.2,
            logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
        },
        {
            name: 'Solana',
            tvl: 4.5,
            change24h: 5.4,
            logo: 'https://cryptologos.cc/logos/solana-sol-logo.png'
        }
    ],
    dexVolume24h: 12.4,
    cexVolume24h: 45.2,
    stablecoins: [
        {
            name: 'USDT',
            symbol: 'USDT',
            supply: 82.5,
            logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
        },
        {
            name: 'USDC',
            symbol: 'USDC',
            supply: 45.2,
            logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
        },
        {
            name: 'DAI',
            symbol: 'DAI',
            supply: 12.8,
            logo: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png'
        }
    ]
};

interface Protocol {
    name: string;
    logo: string;
    category: string;
    tvl: number;
    change24h: number;
    change7d: number;
    dailyUsers: number;
    weeklyRevenue: number;
}

interface YieldOpportunity {
    protocol: string;
    logo: string;
    type: string;
    apy: number;
    asset: string;
    tvl: number;
}

interface WhaleTransaction {
    hash: string;
    type: string;
    network: string;
    networkLogo: string;
    timestamp: string;
    impact: string;
    token: string;
    tokenLogo: string;
    amount: number;
    status: string;
    from: string;
    fromType: string;
    to: string;
    toType: string;
}

const mockProtocols: Protocol[] = [
    {
        name: 'Aave',
        logo: 'https://cryptologos.cc/logos/aave-aave-logo.png',
        category: 'Lending',
        tvl: 5.2,
        change24h: 1.5,
        change7d: -2.8,
        dailyUsers: 12500,
        weeklyRevenue: 450000
    },
    {
        name: 'Uniswap',
        logo: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
        category: 'DEX',
        tvl: 4.8,
        change24h: -0.8,
        change7d: 3.2,
        dailyUsers: 85000,
        weeklyRevenue: 820000
    }
];

const mockYieldOpportunities: YieldOpportunity[] = [
    {
        protocol: 'Compound',
        logo: 'https://cryptologos.cc/logos/compound-comp-logo.png',
        type: 'Lending',
        apy: 4.5,
        asset: 'USDC',
        tvl: 850000000
    },
    {
        protocol: 'Curve',
        logo: 'https://cryptologos.cc/logos/curve-dao-token-crv-logo.png',
        type: 'Liquidity Pool',
        apy: 8.2,
        asset: '3pool',
        tvl: 1250000000
    }
];

const mockWhaleTransactions: WhaleTransaction[] = [
    {
        hash: '0x1234...5678',
        type: 'swap',
        network: 'Ethereum',
        networkLogo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        timestamp: '2 mins ago',
        impact: 'high',
        token: 'ETH',
        tokenLogo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        amount: 5000000,
        status: 'completed',
        from: '0xabcd...efgh',
        fromType: 'wallet',
        to: '0xijkl...mnop',
        toType: 'exchange'
    }
];

const formatLargeNumber = (num: number | undefined | null): string => {
    if (num === undefined || num === null) return '$0';

    if (num >= 1000000000) {
        return `$${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
        return `$${(num / 1000000).toFixed(2)}M`;
    }
    return `$${num.toFixed(2)}`;
};

const DeFiMarketDashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    useGetDefillamaProtocols();


    //usegetdexvolume
    const { DexVolume: dexVolume } = useGetDexVolume();
    const { ChainTVLdata: chainTvlData, isLoading } = useGetChainTVL();
    const { Protocolsdata: protocolsData, ProtocolsisLoading } = useGetDefillamaProtocols();
    const [topProtocols, setTopProtocols] = useState<any[]>([]);
    const { getDeFiStats, getChainTVL, setChainTVLs } = useDefillamaStore();
    const [tradeVolume, setTradeVolume] = useState<CexVolume | null>(null);
    const DefistatusData = getDeFiStats();
    const [spacialTvl, setSpacialTvl] = useState<SpecialTVL[]>([]);
    useEffect(() => {
        if (chainTvlData) {
            setChainTVLs(chainTvlData);
        }
    }, [chainTvlData]);
    useEffect(() => {
        if (chainTvlData && Array.isArray(chainTvlData)) {
            console.log("filtering chain tvl data");
            const formattedSpecialTVL = chainTvlData
                .filter(chain => {
                    console.log("filterchain......")
                    // Add null check and filter by tokenSymbol
                    if (!chain || !chain.tokenSymbol) return false;

                    return ['ETH', 'SOL', 'BNB'].includes(chain.tokenSymbol);
                })
                .map(chain => {
                    const tokenSymbol = chain.tokenSymbol || '';
                    let logoUrl = spacialTvlLogo[tokenSymbol] || ''; // Directly use tokenSymbol to get logo

                    return {
                        gecko_id: chain.gecko_id || '',
                        cmcId: chain.cmcId || '',
                        name: chain.name || '',
                        tvl: formatNumberByFrac(Number(chain.tvl || 0)),
                        tokenSymbol: tokenSymbol,
                        chainId: chain.chainId || 0,
                        logo: logoUrl
                    };
                });

            setSpacialTvl(formattedSpecialTVL);
        }
    }, [chainTvlData]);
    const [stablecoins, setStablecoins] = useState<CoinGeckoToken[]>([]);
    useEffect(() => {
        const fetchStablecoins = async () => {
            try {
                const data = await coingeckoService.getStablecoins();
                // Filter for USDT, USDC, and DAI
                const filteredStablecoins: CoinGeckoToken[] = data.filter(coin =>
                    ['usdt', 'usdc', 'dai'].includes(coin.id.toLowerCase())
                );
                // console.log("filteredStablecoins : ", filteredStablecoins);
                setStablecoins(data);
            } catch (error) {
                console.error('Error fetching stablecoins:', error);
            }
        };

        fetchStablecoins();
    }, []);
    useEffect(() => {
        const fetchTradeVolume = async () => {
            try {
                const data = await coingeckoService.getCexVolume();
                // console.log("data -----------", data)
                setTradeVolume(data); // Get first item if you only need one
            } catch (error) {
                console.error('Error fetching exchange volumes:', error);
            }
        };

        fetchTradeVolume();
    }, []);
    //top protocols
    useEffect(() => {
        if (protocolsData && Array.isArray(protocolsData)) {
            // Filter out CEX protocols and sort by TVL
            const sortedProtocols = [...protocolsData]
                .filter(protocol =>
                    // Filter out protocols with CEX category
                    protocol.category?.toLowerCase() !== 'cex' &&
                    protocol.slug?.toLowerCase() !== 'cex'
                )
                .sort((a, b) => b.tvl - a.tvl)
                // .slice(0, 3)  // Take top 3 non-CEX protocols
                .map(protocol => ({
                    name: protocol.name,
                    logo: protocol.logo,
                    category: protocol.category || protocol.slug || '-',
                    tvl: protocol.tvl,
                    change24h: protocol.change_1d || 0,
                    change7d: protocol.change_7d || 0,
                    dailyUsers: protocol.dailyUsers || '-',
                    weeklyRevenue: protocol.weeklyRevenue || '-'
                }));

            setTopProtocols(sortedProtocols);
            console.log("Top non-CEX protocols:", sortedProtocols);
        }
    }, [protocolsData]);
    // console.log("stablecoins : ", stablecoins);
    const formattedTotalTvl = DefistatusData?.totalTvl
        ? formatLargeNumber(DefistatusData.totalTvl)
        : '$0';

    const fetchData = async (showRefreshState = false) => {
        try {
            if (showRefreshState) {
                setRefreshing(true);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLastUpdated(new Date());
            setError(null);
        } catch (err) {
            console.error('Error fetching DeFi market data:', err);
            setError('Failed to load market data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => fetchData(), 60000);
        return () => clearInterval(interval);
    }, []);

    const handleRefresh = () => {
        fetchData(true);
    };

    const getTransactionTypeColor = (type: string) => {
        switch (type) {
            case 'transfer':
                return 'bg-blue-500/20 text-blue-400';
            case 'swap':
                return 'bg-purple-500/20 text-purple-400';
            case 'stake':
                return 'bg-green-500/20 text-green-400';
            case 'borrow':
                return 'bg-orange-500/20 text-orange-400';
            case 'repay':
                return 'bg-yellow-500/20 text-yellow-400';
        }
    };

    const getImpactColor = (impact: string) => {
        switch (impact) {
            case 'high':
                return 'text-red-400';
            case 'medium':
                return 'text-yellow-400';
            case 'low':
                return 'text-green-400';
        }
    };

    const getAddressTypeIcon = (type: string) => {
        switch (type) {
            case 'wallet':
                return <Wallet className="w-4 h-4 text-white/40" />;
            case 'exchange':
                return <ArrowUpDown className="w-4 h-4 text-white/40" />;
            case 'contract':
                return <FileText className="w-4 h-4 text-white/40" />;
        }
    };

    if (error) {
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
        <div className="p-6 h-full overflow-y-auto ai-chat-scrollbar">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl f0ont-semibold">DeFi Market Overview</h2>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                        <Clock className="w-4 h-4" />
                        <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                    </div>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${refreshing ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
            </div>
            <div className="space-y-6">
                {/* chain TVL */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-white/5 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Wallet className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-white/60">Total Value Locked</span>
                        </div>
                        <div className="text-2xl font-bold mb-1">
                            {formattedTotalTvl}
                        </div>
                        <div className={`flex items-center gap-1 text-sm ${DefistatusData?.totalChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                            {DefistatusData?.totalChange24h >= 0 ? (
                                <TrendingUp className="w-4 h-4" />
                            ) : (
                                <TrendingDown className="w-4 h-4" />
                            )}
                            <span>{Math.abs(DefistatusData?.totalChange24h).toFixed(2)}%</span>
                            <span className="text-white/60">24h</span>
                        </div>
                    </div>

                    {spacialTvl.map((network) => (
                        <div key={network.name} className="bg-white/5 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <img src={network.logo} alt={network.name} className="w-4 h-4" />
                                <span className="text-sm text-white/60">{network.name} TVL</span>
                            </div>
                            <div className="text-2xl font-bold mb-1">
                                {formatLargeNumber(Number(network.tvl))}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Exchange Volume (24h) */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-xl p-6">
                        <h3 className="text-lg font-medium mb-4">Exchange Volume (24h)</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Globe className="w-4 h-4 text-blue-400" />
                                    <span className="text-sm">CEX Volume</span>
                                </div>
                                <div className="text-2xl font-bold">
                                    {tradeVolume ? formatLargeNumber(tradeVolume.trade_volume_24h_usd_sum) : '0'}
                                </div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity className="w-4 h-4 text-purple-400" />
                                    <span className="text-sm">DEX Volume</span>
                                </div>
                                <div className="text-2xl font-bold">
                                    {dexVolume && dexVolume[0].total24h ? formatLargeNumber(dexVolume[0].total24h) : '$0'}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* stablecoin martket */}
                    <div className="bg-white/5 rounded-xl p-6">
                        <h3 className="text-lg font-medium mb-4">Stablecoin Market Supply</h3>
                        <div className="space-y-4">
                            {stablecoins.map((stablecoin) => {
                                const supplyInBillions = stablecoin.total_supply / 1000000000;
                                const totalSupply = stablecoins.reduce((acc, curr) =>
                                    acc + (curr.total_supply / 1000000000), 0
                                );

                                return (
                                    <div key={stablecoin.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                                        <img src={stablecoin.image} alt={stablecoin.name} className="w-8 h-8" />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{stablecoin.name}</span>
                                                <span>${supplyInBillions.toFixed(1)}B</span>
                                            </div>
                                            <div className="h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500"
                                                    style={{
                                                        width: `${(supplyInBillions / totalSupply) * 100}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
                {/* Top Protocols */}
                <div className="bg-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-medium mb-4">Top Protocols</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-white/60">
                                    <th className="pb-4 font-medium">Protocol</th>
                                    <th className="pb-4 font-medium">Category</th>
                                    <th className="pb-4 font-medium text-right">TVL</th>
                                    <th className="pb-4 font-medium text-right">24h Change</th>
                                    <th className="pb-4 font-medium text-right">7d Change</th>
                                    <th className="pb-4 font-medium text-right">Daily Users</th>
                                    <th className="pb-4 font-medium text-right">Weekly Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {topProtocols.map((protocol) => (
                                    <tr key={protocol.name} className="hover:bg-white/5">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={protocol.logo}
                                                    alt={protocol.name}
                                                    className="w-8 h-8"
                                                    onError={(e) => {
                                                        // Fallback if image fails to load
                                                        (e.target as HTMLImageElement).src = 'https://placeholder.com/assets/images/placeholder.png';
                                                    }}
                                                />
                                                <span className="font-medium">{protocol.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className="px-2 py-1 rounded-full text-sm bg-white/10">
                                                {protocol.category}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right font-medium">
                                            {formatLargeNumber(protocol.tvl)}
                                        </td>
                                        <td className={`py-4 text-right ${protocol.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {protocol.change24h >= 0 ? '+' : ''}{protocol.change24h.toFixed(2)}%
                                        </td>
                                        <td className={`py-4 text-right ${protocol.change7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {protocol.change7d >= 0 ? '+' : ''}{protocol.change7d.toFixed(2)}%
                                        </td>
                                        <td className="py-4 text-right">
                                            {typeof protocol.dailyUsers === 'number'
                                                ? protocol.dailyUsers.toLocaleString()
                                                : '-'}
                                        </td>
                                        <td className="py-4 text-right">
                                            {typeof protocol.weeklyRevenue === 'number'
                                                ? `$${(protocol.weeklyRevenue / 1000).toFixed(1)}K`
                                                : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white/5 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium">Significant Transactions</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-white/60">
                                <Clock className="w-4 h-4" />
                                <span>Auto-updates every minute</span>
                            </div>
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${refreshing ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {mockWhaleTransactions.map((tx) => (
                            <div key={tx.hash} className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTransactionTypeColor(tx.type)}`}>
                                            {tx.type.toUpperCase()}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <img src={tx.networkLogo} alt={tx.network} className="w-4 h-4" />
                                            <span className="text-sm text-white/60">{tx.network}</span>
                                        </div>
                                        <span className="text-sm text-white/60">{tx.timestamp}</span>
                                        <span className={`text-sm ${getImpactColor(tx.impact)}`}>
                                            {tx.impact.toUpperCase()} IMPACT
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <img src={tx.tokenLogo} alt={tx.token} className="w-5 h-5" />
                                            <span className="font-medium">
                                                ${(tx.amount / 1000000).toFixed(2)}M
                                            </span>
                                            <span className="text-white/60">{tx.token}</span>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${tx.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {tx.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <div className="flex items-center gap-1">
                                        {getAddressTypeIcon(tx.fromType)}
                                        <span className="text-white/60">{tx.from}</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-white/40" />
                                    <div className="flex items-center gap-1">
                                        {getAddressTypeIcon(tx.toType)}
                                        <span className="text-white/60">{tx.to}</span>
                                    </div>
                                    <a
                                        href={`https://etherscan.io/tx/${tx.hash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-auto p-1 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4 text-white/40" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeFiMarketDashboard;