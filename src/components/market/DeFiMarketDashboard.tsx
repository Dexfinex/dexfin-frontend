import React, { useState, useEffect } from 'react';
import {
    TrendingUp, TrendingDown, Wallet, BarChart2,
    RefreshCw, AlertCircle, DollarSign, ArrowRight,
    Shield, Activity, Globe, Users, Clock, Bell,
    ArrowUpDown, FileText, ExternalLink
} from 'lucide-react';
import useDefillamaStore from '../../store/useDefillamaStore';
import { useGetDefillamaProtocols, useGetChainTVL, useGetDexVolume } from '../../hooks/useDefillama';
import { useGetSignificantTransactions } from '../../hooks/useGetSignificantTransactions';
import { formatNumberByFrac } from '../../utils/common.util';
import { coingeckoService } from '../../services/coingecko.service';

interface SpecialTVL {
    gecko_id: string;
    tvl: string;
    tokenSymbol: string;
    cmcId: string;
    name: string;
    chainId: number;
    logo: string;

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
const formatLargeNumber = (num: number | undefined | null): string => {
    if (num === undefined || num === null) return '$0';

    if (num >= 1000000000) {
        return `$${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
        return `$${(num / 1000000).toFixed(2)}M`;
    }
    return `$${num.toFixed(2)}`;
};


const formatApiTransaction = (tx: any, blockchain: 'ethereum' | 'bitcoin'): WhaleTransaction => {
    const isEth = blockchain === 'ethereum';
    const logoBaseUrl = 'https://cryptologos.cc/logos/';
    const networkLogo = isEth ? `${logoBaseUrl}ethereum-eth-logo.png` : `${logoBaseUrl}bitcoin-btc-logo.png`;
    const tokenLogo = networkLogo;

    // Format time
    const txTime = tx.timestamp ? new Date(tx.timestamp * 1000) : new Date();
    const minsAgo = Math.floor((Date.now() - txTime.getTime()) / 60000);
    const timeDisplay = minsAgo < 60 ? `${minsAgo} mins ago` : `${Math.floor(minsAgo / 60)} hours ago`;

    // Format addresses
    const shortenAddress = (addr: string) => addr ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}` : '';

    return {
        hash: tx.hash || '',
        type: tx.transaction_type?.toLowerCase() || 'transfer',
        network: isEth ? 'Ethereum' : 'Bitcoin',
        networkLogo,
        timestamp: timeDisplay,
        impact: 'high',
        token: isEth ? 'ETH' : 'BTC',
        tokenLogo,
        amount: parseFloat(tx.amount_usd || tx.amount || '0'),
        status: 'completed',
        from: shortenAddress(tx.from_address || tx.from_owner || ''),
        fromType: tx.from_owner?.toLowerCase().includes('binance') ? 'exchange' : 'wallet',
        to: shortenAddress(tx.to_address || tx.to_owner || ''),
        toType: tx.to_owner?.toLowerCase().includes('binance') ? 'exchange' : 'wallet'
    };
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
    const { ethData, btcData, topEthData, topBtcData } = useGetSignificantTransactions();
    const getTransactions = () => {
        const transactions = [];
        if (topEthData) transactions.push(formatApiTransaction(topEthData, 'ethereum'));
        if (topBtcData) transactions.push(formatApiTransaction(topBtcData, 'bitcoin'));
        return transactions;
    };

    // console.log("topEthData  transaction -----: ", topEthData);
    // console.log("topBtcData  transaction -----: ", topBtcData);


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
            <div className="p-4 h-full flex flex-col items-center justify-center text-center">
                <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
                <p className="text-white/60 mb-3">{error}</p>
                <button
                    onClick={handleRefresh}
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="p-3 sm:p-6 h-full overflow-y-auto ai-chat-scrollbar">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <h2 className="text-lg sm:text-xl font-semibold">DeFi Market Overview</h2>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-white/60">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
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

            <div className="space-y-4 sm:space-y-6">
                {/* Chain TVL - Mobile-responsive grid */}
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-white/5 rounded-xl p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Wallet className="w-4 h-4 text-blue-400" />
                            <span className="text-xs sm:text-sm text-white/60">Total Value Locked</span>
                        </div>
                        <div className="text-xl sm:text-2xl font-bold mb-1">
                            {formattedTotalTvl}
                        </div>
                        <div className={`flex items-center gap-1 text-xs sm:text-sm ${DefistatusData?.totalChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                            {DefistatusData?.totalChange24h >= 0 ? (
                                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                            ) : (
                                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                            )}
                            <span>{Math.abs(DefistatusData?.totalChange24h).toFixed(2)}%</span>
                            <span className="text-white/60">24h</span>
                        </div>
                    </div>

                    {spacialTvl.map((network) => (
                        <div key={network.name} className="bg-white/5 rounded-xl p-3 sm:p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <img src={network.logo} alt={network.name} className="w-4 h-4" />
                                <span className="text-xs sm:text-sm text-white/60">{network.name} TVL</span>
                            </div>
                            <div className="text-xl sm:text-2xl font-bold mb-1">
                                {formatLargeNumber(Number(network.tvl))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Exchange Volume (24h) - Responsive layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-white/5 rounded-xl p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Exchange Volume (24h)</h3>
                        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                            <div className="p-3 sm:p-4 bg-white/5 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Globe className="w-4 h-4 text-blue-400" />
                                    <span className="text-xs sm:text-sm">CEX Volume</span>
                                </div>
                                <div className="text-lg sm:text-2xl font-bold">
                                    {tradeVolume ? formatLargeNumber(tradeVolume.trade_volume_24h_usd_sum) : '0'}
                                </div>
                            </div>
                            <div className="p-3 sm:p-4 bg-white/5 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity className="w-4 h-4 text-purple-400" />
                                    <span className="text-xs sm:text-sm">DEX Volume</span>
                                </div>
                                <div className="text-lg sm:text-2xl font-bold">
                                    {dexVolume && dexVolume[0].total24h ? formatLargeNumber(dexVolume[0].total24h) : '$0'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stablecoin market - Responsive */}
                    <div className="bg-white/5 rounded-xl p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Stablecoin Market Supply</h3>
                        <div className="space-y-3 sm:space-y-4">
                            {stablecoins.map((stablecoin) => {
                                const supplyInBillions = stablecoin.total_supply / 1000000000;
                                const totalSupply = stablecoins.reduce((acc, curr) =>
                                    acc + (curr.total_supply / 1000000000), 0
                                );

                                return (
                                    <div key={stablecoin.id} className="flex items-center gap-3 p-2 sm:p-3 bg-white/5 rounded-lg">
                                        <img src={stablecoin.image} alt={stablecoin.name} className="w-6 h-6 sm:w-8 sm:h-8" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">{stablecoin.name}</span>
                                                <span className="text-xs sm:text-sm">${supplyInBillions.toFixed(1)}B</span>
                                            </div>
                                            <div className="h-1 sm:h-1.5 bg-white/10 rounded-full mt-1 sm:mt-2 overflow-hidden">
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

                {/* Top Protocols - Responsive table */}
                <div className="bg-white/5 rounded-xl p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Top Protocols</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-full">
                            <thead className="hidden sm:table-header-group">
                                <tr className="text-left text-white/60">
                                    <th className="pb-4 font-medium">Protocol</th>
                                    <th className="pb-4 font-medium">Category</th>
                                    <th className="pb-4 font-medium text-right">TVL</th>
                                    <th className="pb-4 font-medium text-right">24h Change</th>
                                    <th className="pb-4 font-medium text-right">7d Change</th>
                                    <th className="pb-4 font-medium text-right hidden md:table-cell">Daily Users</th>
                                    <th className="pb-4 font-medium text-right hidden md:table-cell">Weekly Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {/* Mobile cards / Desktop rows */}
                                {topProtocols.map((protocol) => (
                                    <React.Fragment key={protocol.name}>
                                        {/* Mobile card view */}
                                        <tr className="block sm:hidden hover:bg-white/5 rounded-lg mb-3">
                                            <td className="block p-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={protocol.logo}
                                                            alt={protocol.name}
                                                            className="w-6 h-6"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = 'https://placeholder.com/assets/images/placeholder.png';
                                                            }}
                                                        />
                                                        <span className="font-medium">{protocol.name}</span>
                                                    </div>
                                                    <span className="px-2 py-1 rounded-full text-xs bg-white/10">
                                                        {protocol.category}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                                                    <div>
                                                        <div className="text-white/60">TVL</div>
                                                        <div className="font-medium">{formatLargeNumber(protocol.tvl)}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-white/60">24h</div>
                                                        <div className={`${protocol.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                            {protocol.change24h >= 0 ? '+' : ''}{protocol.change24h.toFixed(2)}%
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-white/60">7d</div>
                                                        <div className={`${protocol.change7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                            {protocol.change7d >= 0 ? '+' : ''}{protocol.change7d.toFixed(2)}%
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Desktop table row */}
                                        <tr className="hidden sm:table-row hover:bg-white/5">
                                            <td className="py-4 pl-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={protocol.logo}
                                                        alt={protocol.name}
                                                        className="w-8 h-8"
                                                        onError={(e) => {
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
                                            <td className="py-4 text-right hidden md:table-cell">
                                                {typeof protocol.dailyUsers === 'number'
                                                    ? protocol.dailyUsers.toLocaleString()
                                                    : '-'}
                                            </td>
                                            <td className="py-4 text-right hidden md:table-cell">
                                                {typeof protocol.weeklyRevenue === 'number'
                                                    ? `$${(protocol.weeklyRevenue / 1000).toFixed(1)}K`
                                                    : '-'}
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Significant Transactions - Responsive */}
                <div className="bg-white/5 rounded-xl p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-6">
                        <h3 className="text-base sm:text-lg font-medium">Significant Transactions</h3>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-white/60">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>Auto-updates every minute</span>
                            </div>
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className={`p-1 sm:p-2 rounded-lg hover:bg-white/10 transition-colors ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${refreshing ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                        {loading ? (
                            <div className="flex justify-center items-center py-8">
                                <RefreshCw className="animate-spin w-6 h-6 text-blue-400" />
                            </div>
                        ) : (
                            getTransactions().map((tx) => (
                                <div key={tx.hash} className="p-3 sm:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                    {/* Desktop version */}
                                    <div className="hidden sm:flex sm:items-center sm:justify-between mb-3">
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
                                            <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400">
                                                COMPLETED
                                            </span>
                                        </div>
                                    </div>

                                    {/* Mobile version */}
                                    <div className="flex flex-col sm:hidden gap-2 mb-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTransactionTypeColor(tx.type)}`}>
                                                    {tx.type.toUpperCase()}
                                                </span>
                                                <span className="text-xs text-white/60">{tx.timestamp}</span>
                                            </div>
                                            <span className={`text-xs ${getImpactColor(tx.impact)}`}>
                                                {tx.impact.toUpperCase()} IMPACT
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <img src={tx.networkLogo} alt={tx.network} className="w-4 h-4" />
                                                <span className="text-xs text-white/60">{tx.network}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <img src={tx.tokenLogo} alt={tx.token} className="w-4 h-4" />
                                                <span className="text-xs font-medium">
                                                    ${(tx.amount / 1000000).toFixed(1)}M {tx.token}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                                        <div className="flex items-center gap-1">
                                            {getAddressTypeIcon(tx.fromType)}
                                            <span className="text-white/60 text-xs sm:text-sm overflow-hidden overflow-ellipsis">{tx.from}</span>
                                        </div>
                                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-white/40 flex-shrink-0" />
                                        <div className="flex items-center gap-1">
                                            {getAddressTypeIcon(tx.toType)}
                                            <span className="text-white/60 text-xs sm:text-sm overflow-hidden overflow-ellipsis">{tx.to}</span>
                                        </div>
                                        <a
                                            href={tx.network === 'Ethereum'
                                                ? `https://etherscan.io/tx/${tx.hash}`
                                                : `https://www.blockchain.com/explorer/transactions/btc/${tx.hash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-auto p-1 hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-white/40" />
                                        </a>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeFiMarketDashboard;