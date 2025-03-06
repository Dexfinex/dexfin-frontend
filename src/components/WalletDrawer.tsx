import React, { useContext, useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Web3AuthContext } from "../providers/Web3AuthContext";
import { motion, time } from "framer-motion";
import { useStore } from "../store/useStore";
import { TokenChainIcon } from "./swap/components/TokenIcon";
import { CheckCircle, Copy, Wallet, XCircle, TrendingUp, Send, ArrowDown, CreditCard, ArrowLeft, ExternalLink, Clock } from "lucide-react";
import { mockDeFiPositions, mockDeFiStats, formatUsdValue, formatApy, getHealthFactorColor, } from '../lib/wallet';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { shrinkAddress, formatNumberByFrac, formatNumber, getHourAndMinute, getMonthDayHour, getMonthDayYear, getTimeAgo } from "../utils/common.util";
import { useWalletBalance } from "../hooks/useBalance";
import useTokenBalanceStore, { TokenBalance } from "../store/useTokenBalanceStore";
import { SendDrawer } from "./wallet/SendDrawer";
import { BuyDrawer } from "./wallet/BuyDrawer";
import { ReceiveDrawer } from "./wallet/ReceiveDrawer";
import useTokenTransferStore from '../store/useTokenTransferStore.ts';
import { useEvmWalletTransfer } from "../hooks/useTransfer";
import { dexfinv3Service } from "../services/dexfin.service.ts";
import { Skeleton, Popover, PopoverTrigger, PopoverContent, theme } from '@chakra-ui/react';
import { coingeckoService } from "../services/coingecko.service";
import { birdeyeService } from "../services/birdeye.service";
import { TransactionType } from "../types/wallet";
import { mapChainName2ExplorerUrl } from "../config/networks";
import { WalletActivityType } from "../types/dexfinv3.type.ts";

interface WalletDrawerProps {
    isOpen: boolean,
    setIsOpen: (open: boolean) => void
}

export type PageType = 'main' | 'asset' | 'send' | 'receive'

interface AssetInfoProps {
    tokenBalance: TokenBalance;
    setTokenBalance: (token: TokenBalance | null) => void;
    setPage: (type: PageType) => void;
}

type ChartPriceType = {
    time: string,
    price: number
}

type ChartTimeType = "1D" | "1W" | "1M" | "3M"

type TimeRangeType = {
    mseconds: number,
    interval: string,
    solInterval: string
}

const customMapTimeRange: Record<string, TimeRangeType> = {
    "1D": { mseconds: 86400, solInterval: "15m", interval: "1H" },
    "1W": { mseconds: 604800, solInterval: "1H", interval: "1D" },
    "1M": { mseconds: 2592000, solInterval: "4H", interval: "1W" },
    "3M": { mseconds: 7776000, solInterval: "1D", interval: "1Y" },
};

const CustomTooltip: React.FC<{ active?: boolean; payload?: any[]; }> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return <div className="text-green-500 text-sm font-bold flex flex-col items-center">
            <span>{payload[0]?.payload.time}</span>
            <span>${payload[0].value}</span>
        </div>
    }
    return null;
}

const ShowMoreLess: React.FC<{ text: string, maxLength: number }> = ({ text, maxLength = 100 }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { theme } = useStore();

    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
        <div className={`${theme === "dark" ? "text-white/70" : "text-black/70"}`}>
            <p className="text-sm sm:text-md">
                {isExpanded ? text : text.slice(0, maxLength) + (text.length > maxLength ? "..." : "")}
            </p>
            {text.length > maxLength && (
                <button
                    onClick={toggleExpand}
                    className="text-blue-500 hover:text-blue-600 mt-1 text-sm sm:text-md"
                >
                    {isExpanded ? "Show Less" : "Show More"}
                </button>
            )}
        </div>
    );
}

const Accounts: React.FC<{ evmAddress: string, solAddress: string }> = ({ evmAddress, solAddress }) => {
    const [evmCopied, setEvmCopied] = useState(false);
    const [solCopied, setSolCopied] = useState(false);
    const { theme } = useStore();

    const handleEvmCopy = () => {
        navigator.clipboard.writeText(evmAddress);
        setEvmCopied(true);
        setTimeout(() => setEvmCopied(false), 1000);
    }

    const handleSolCopy = () => {
        navigator.clipboard.writeText(solAddress);
        setSolCopied(true);
        setTimeout(() => setSolCopied(false), 1000);
    }

    return (
        <Popover>
            <PopoverTrigger>
                <div className="flex items-center text-white/90 hover:text-white/70 gap-1 cursor-pointer">
                    <span>Account</span>
                    <Copy className="w-3 h-3" />
                </div>
            </PopoverTrigger>
            <PopoverContent className={`!w-[236px] !border-1 !border-transparent ${theme === "dark" ? "!bg-black" : "!bg-white"} !p-2`}>
                <div className="flex items-center justify-between p-1 text-white/90 hover:text-white/70 cursor-pointer" onClick={handleEvmCopy}>
                    <span className="flex items-center gap-1">
                        <img src="https://cdn.moralis.io/eth/0x.png" className="w-4 h-4 mr-1" />
                        <span>Ethereum</span>
                    </span>
                    {evmCopied ? <CheckCircle className="w-3 h-3 text-green-500" /> : <span>{shrinkAddress(evmAddress)}</span>}
                </div>
                {solAddress && <div className="flex items-center justify-between p-1 text-white/90 hover:text-white/70 cursor-pointer" onClick={handleSolCopy}>
                    <span className="flex items-center gap-1">
                        <img src="https://assets.coingecko.com/coins/images/4128/small/solana.png" className="w-4 h-4 mr-1" />
                        <span>Solana</span>
                    </span>
                    {solCopied ? <CheckCircle className="w-3 h-3 text-green-500" /> : <span>{shrinkAddress(solAddress)}</span>}
                </div>}
            </PopoverContent>
        </Popover>
    )
}

export const AssetInfo: React.FC<AssetInfoProps> = ({ tokenBalance, setTokenBalance, setPage }) => {
    const { theme } = useStore();
    const [selectedRange, setSelectedRange] = useState<ChartTimeType>("1D");
    const [chartData, setChartData] = useState<Array<ChartPriceType> | null>(null);
    const [info, setInfo] = useState<any>(null);

    useEffect(() => {
        getChartData()
    }, [selectedRange]);

    useEffect(() => {
        if (tokenBalance.tokenId) {
            getTokenInfo(tokenBalance)
            getChartData()
        }
    }, [tokenBalance])

    const getTokenInfo = async (token: TokenBalance) => {
        const info = await coingeckoService.getInfo(token.tokenId)
        setInfo(info)
    }

    const formatChartData = (data: any) => {
        return data.map((e: { time: number, close: number }) => {
            let readableTime = ""

            if (selectedRange === "1D") {
                readableTime = getHourAndMinute(e.time * 1000)
            } else if (selectedRange === "1W") {
                readableTime = getMonthDayHour(e.time * 1000)
            } else if (selectedRange === "1M") {
                readableTime = getMonthDayHour(e.time * 1000)
            } else if (selectedRange === "3M") {
                readableTime = getMonthDayYear(e.time * 1000)
            }

            return {
                time: readableTime,
                price: Number(formatNumberByFrac(e.close))
            }
        })
    }

    const getChartData = async () => {
        const currentTime = Math.round(Date.now() / 1000) - 60

        if (tokenBalance.network?.id === "solana") {
            const timeFrom = currentTime - customMapTimeRange[selectedRange].mseconds
            const data = await birdeyeService.getOHLCV(tokenBalance.address, customMapTimeRange[selectedRange].solInterval, timeFrom, currentTime)
            if (data.length > 0) {
                const cData = formatChartData(data)
                setChartData([...cData])
            }
        } else { // will add 0x
            const timeFrom = currentTime - customMapTimeRange[selectedRange].mseconds
            const data = await coingeckoService.getOHLCV(tokenBalance.tokenId, customMapTimeRange[selectedRange].interval, timeFrom, currentTime)
            if (data.length > 0) {
                const cData = formatChartData(data)
                setChartData([...cData])
            }
        }
    }

    const handleBack = () => {
        setTokenBalance(null)
        setPage('main')
    }

    const renderSocialBtns = (links: any) => {
        let discordUrl = ""

        if (links.chat_url.length > 0) {
            discordUrl = links.chat_url.find((url: string) => url.includes("discord"))
        }

        return <div className="flex gap-2">
            {links.homepage[0] && <a
                className={`${theme === "dark" ? "text-white/90 bg-white/20 hover:bg-white/10" : "text-black/90 bg-black/20 hover:bg-black/10"}  text-xs sm:text-sm rounded-2xl px-3 py-1`}
                target="_blank"
                href={links.homepage[0]}
            >
                Websites
            </a>}

            {links.twitter_screen_name && <a
                className={`${theme === "dark" ? "text-white/90 bg-white/20 hover:bg-white/10" : "text-black/90 bg-black/20 hover:bg-black/10"}  text-xs sm:text-sm rounded-2xl px-3 py-1`}
                target="_blank"
                href={`https://x.com/${links.twitter_screen_name}`}
            >
                X
            </a>}

            {links.telegram_channel_identifier && <a
                className={`${theme === "dark" ? "text-white/90 bg-white/20 hover:bg-white/10" : "text-black/90 bg-black/20 hover:bg-black/10"}  text-xs sm:text-sm rounded-2xl px-3 py-1`}
                target="_blank"
                href={`https://t.me/${links.telegram_channel_identifier}`}
            >
                Telegram
            </a>}


            {discordUrl && <a
                className={`${theme === "dark" ? "text-white/90 bg-white/20 hover:bg-white/10" : "text-black/90 bg-black/20 hover:bg-black/10"}  text-xs sm:text-sm rounded-2xl px-3 py-1`}
                target="_blank"
                href={discordUrl}
            >
                Discord
            </a>}
        </div>
    }

    return (
        <div className="mt-4 mx-4">
            <button className={`rounded-full ${theme === "dark" ? "text-white/70 hover:bg-white/10" : "text-black/70 hover:bg-black/10"}  p-2`} onClick={handleBack}>
                <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="overflow-y-auto ai-chat-scrollbar max-h-[calc(100vh-132px)]">
                {
                    info?.name ?
                        <p className="text-center text-xl text-white">{info.name}</p> :
                        <div className="w-full flex justify-center">
                            <Skeleton className="w-24 h-7" />
                        </div>
                }

                {
                    info?.market_data?.current_price?.usd ?
                        <p className="text-center text-2xl text-green-500 font-bold">${info.market_data.current_price.usd}</p> :
                        <div className="w-full flex justify-center">
                            <Skeleton className="w-24 h-7 mt-1" />
                        </div>
                }

                {
                    chartData ?
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={1} dot={false} />
                            </LineChart>
                        </ResponsiveContainer> :
                        <Skeleton className="w-full h-[280px] my-4" />
                }

                {/* Buttons for time range selection */}
                <div className="flex justify-evenly space-x-1 sm:space-x-2 mb-4">
                    {["1D", "1W", "1M", "3M"].map((range: any) => (
                        <button
                            key={range}
                            onClick={() => setSelectedRange(range)}
                            className={`text-white/90 ${theme === "dark" ? "bg-white/20 hover:bg-white/10" : "bg-black/20 hover:bg-black/10"} w-14 sm:w-16 py-1 rounded-md text-xs sm:text-sm 
                                        ${selectedRange === range && theme === "dark" ? 'bg-white/40' : ''} ${selectedRange === range && theme === "light" ? 'bg-black/40' : ''}`}
                        >
                            {range}
                        </button>
                    ))}
                </div>

                <div className="mt-4">
                    <p className={`${theme === "dark" ? "text-white/70" : "text-black/70"} font-bold text-sm sm:text-base`}>Your Balance</p>
                    {
                        info?.market_data?.current_price?.usd ?
                            <div className="mt-1 px-2 py-3 bg-white/5 rounded-xl flex gap-2">
                                <div className="flex items-center">
                                    <img src={tokenBalance.logo} className="w-8 sm:w-10 h-8 sm:h-10 rounded-full" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm sm:text-base">
                                        <span>{tokenBalance.symbol}</span>
                                        <span>${info.market_data.current_price.usd}</span>
                                    </div>
                                    <div className={`flex justify-between ${theme === "dark" ? "text-white/70" : "text-black/70"} text-sm`}>
                                        <span>{formatNumberByFrac(tokenBalance.balance, 5)} {tokenBalance.symbol}</span>
                                        <span>{formatUsdValue(info.market_data.current_price.usd * tokenBalance.balance)}</span>
                                    </div>
                                </div>
                            </div> :
                            <Skeleton className="mt-2 w-full h-14" />
                    }
                </div>

                <div className="mt-4">
                    <p className={`${theme === "dark" ? "text-white/70 font-bold" : "text-black/70 font-bold"}`}>About</p>
                    {
                        info?.description?.en ?
                            <ShowMoreLess text={info.description.en} maxLength={150} /> :
                            <Skeleton className="w-full h-24" />
                    }

                </div>

                <div className="mt-4">
                    <p className={`${theme === "dark" ? "text-white/70 font-bold" : "text-black/70 font-bold"} text-sm sm:text-base`}>About</p>
                    {
                        info?.links ? renderSocialBtns(info?.links) : <Skeleton className="w-full h-24" />
                    }
                </div>

                <div className="mt-4">
                    <p className={`${theme === "dark" ? "text-white/70 font-bold" : "text-black/70 font-bold"} text-sm sm:text-base`}>Info</p>
                    <div className="bg-white/5 rounded-xl text-xs sm:text-sm">
                        <div className="flex justify-between py-2 px-3 border-b border-black/50">
                            <span className={`${theme === "dark" ? "text-white/70" : "text-black/70"}`}>Symbol</span>
                            <span>{tokenBalance.symbol}</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 border-b border-black/50">
                            <span className={`${theme === "dark" ? "text-white/70" : "text-black/70"}`}>Network</span>
                            <span>{tokenBalance.network?.name || ""}</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 border-b border-black/50">
                            <span className={`${theme === "dark" ? "text-white/70" : "text-black/70"}`}>Market Cap</span>
                            {
                                info?.market_data?.market_cap?.usd ?
                                    <span className="">${formatNumber(info?.market_data?.market_cap?.usd)}</span> :
                                    <Skeleton className="w-16 h-6" />
                            }
                        </div>
                        <div className="flex justify-between py-2 px-3 border-b border-black/50">
                            <span className={`${theme === "dark" ? "text-white/70" : "text-black/70"}`}>Total Supply</span>
                            {
                                info?.market_data?.total_supply ?
                                    <span className="">${formatNumber(info?.market_data?.total_supply)}</span> :
                                    <Skeleton className="w-16 h-6" />
                            }
                        </div>
                        <div className="flex justify-between py-2 px-3">
                            <span className={`${theme === "dark" ? "text-white/70" : "text-black/70"}`}>Circulating Supply</span>
                            {
                                info?.market_data?.circulating_supply ?
                                    <span className="">${formatNumber(info?.market_data?.circulating_supply)}</span> :
                                    <Skeleton className="w-16 h-6" />
                            }
                        </div>
                    </div>
                </div>

                {/* <div className="mt-4 mb-4">
                    <p className="text-white/70 font-bold text-sm sm:text-base">24h Performance</p>
                    <div className="bg-white/5 rounded-xl text-xs sm:text-sm">
                        <div className="flex justify-between py-2 px-3 border-b border-black/50">
                            <span className="text-white/70">Volume</span>
                            <span>$962.45M</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 border-b border-black/50">
                            <span className="text-white/70">Trades</span>
                            <span>$962.45M</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 border-b border-black/50">
                            <span className="text-white/70">Traders</span>
                            <span>47772</span>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export const WalletDrawer: React.FC<WalletDrawerProps> = ({ isOpen, setIsOpen }) => {
    const { theme } = useStore();
    const { address, chainId, switchChain, logout, solanaWalletInfo } = useContext(Web3AuthContext);
    const [selectedBalanceIndex, setSelectedBalanceIndex] = useState(0);
    const [selectedTab, setSelectedTab] = useState<'tokens' | 'activity' | 'defi'>('tokens');
    const [page, setPage] = useState<PageType>('main');
    const { isLoading: isLoadingBalance } = useWalletBalance();
    const { totalUsdValue, tokenBalances } = useTokenBalanceStore();
    // const [showSendDrawer, setShowSendDrawer] = useState(false);
    // const [showReceiveDrawer, setShowReceiveDrawer] = useState(false);
    const [showBuyDrawer, setShowBuyDrawer] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<TokenBalance | null>(null);
    const [drawerWidth, setDrawerWidth] = useState("400px");
    const [activities, setActivities] = useState<Array<WalletActivityType>>([]);

    // useEvmWalletTransfer();
    // const { transfers } = useTokenTransferStore();

    const fetchActivities = useCallback(async () => {
        if (!address) {
            return []
        }

        const activities = await dexfinv3Service.getAllActivities(address, solanaWalletInfo?.publicKey || "")
        return activities
    }, [address, solanaWalletInfo])

    const { isLoading, refetch, data } = useQuery<any>(
        {
            queryKey: ['balance', address, solanaWalletInfo],
            queryFn: fetchActivities,
            refetchInterval: 10_000,
        }
    )

    useEffect(() => {
        if (JSON.stringify(activities) != JSON.stringify(data)) {
            console.log('set activities')
            setActivities(data)
        }
    }, [data])

    // Update drawer width based on screen size
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width <= 768) {
                setDrawerWidth(width <= 360 ? "300px" : width <= 480 ? "350px" : "380px");
            } else {
                setDrawerWidth("400px");
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const sortedMockDeFiPositions = mockDeFiPositions.sort((a, b) => a.value >= b.value ? -1 : 1)

    const handleDisconnect = () => {
        logout()
        setIsOpen(false)
    }

    const handleAsset = async (token: TokenBalance) => {
        setSelectedAsset(token)
        setPage('asset')
    }

    const handleSend = () => {
        setPage('send')
    }

    const handleReceive = () => {
        setPage('receive')
    }

    const renderActivity = () => (
        <div className="space-y-3 flex-1 mt-4 sm:mt-5 mx-4 overflow-y-auto ai-chat-scrollbar sm:max-h-[calc(100vh-350px)] max-h-[calc(100vh-290px)]">
            {
                activities.length === 0 && <div className='w-full h-full flex justify-center items-center align-center mt-20'><h2 className='text-white/60 italic'>No activities yet</h2></div>
            }
            {
                activities.length > 0 && activities.map((activity, index) => (
                    <a key={activity.hash + index} className={`p-3 flex items-center justify-between ${theme === "dark" ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/10"} rounded-lg gap-2`}
                        href={`${mapChainName2ExplorerUrl[activity.network.id]}/tx/${activity.hash}`}
                        target="_blank">
                        <div className="flex items-center gap-2">
                            <img src={activity.network.icon} className="w-6 h-6 rounded-full" />
                            <div>
                                <div className={`text-sm ${theme === "dark" ? "text-white/70" : "text-black/70"}`}>{activity.summary}</div>
                                <div className={`text-xs ${theme === "dark" ? "text-white/70" : "text-black/70"}`}>{shrinkAddress(activity.hash)}</div>
                            </div>
                        </div>
                        <span className={`text-sm ${theme === "dark" ? "text-white/70" : "text-black/70"} `}>{getTimeAgo(activity.date)}</span>
                    </a>
                ))
            }
        </div>
    )

    const renderTokens = () => (
        <div className="flex-1 space-y-2 mt-4 sm:mt-5 overflow-y-auto ai-chat-scrollbar sm:max-h-[calc(100vh-350px)] max-h-[calc(100vh-290px)] mx-4">
            {
                isLoadingBalance ?
                    <Skeleton startColor="#444" endColor="#1d2837" w={'100%'} h={'4rem'}></Skeleton>
                    : tokenBalances.map((token, index) => (
                        <button
                            key={token.chain + token.symbol + index}
                            className="flex w-full items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                            onClick={() => handleAsset(token)}
                        >
                            <div className="flex items-center gap-3">
                                <TokenChainIcon src={token.logo} alt={token.name} size={"lg"} chainId={Number(token.chain)} />
                                <div className='flex flex-col justify-start items-start'>
                                    <div className="font-medium text-sm sm:text-md">{token.symbol}</div>
                                    <div className="text-xs sm:text-sm text-white/60">
                                        {`${formatNumberByFrac(token.balance, 5)} ${token.symbol}`}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right text-sm md:text-md">
                                <span>{formatUsdValue(token.usdValue)}</span>
                                {/* <div className="text-sm text-green-400">
                        {formatApy(0)} APY
                        </div> */}
                            </div>
                        </button>
                    ))
            }
        </div>
    )

    const renderDeFi = () => (
        <div className="space-y-6 mt-4 sm:mt-5 mx-4 flex-1">
            {/* DeFi Overview */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs sm:text-sm text-white/60">Total Value Locked</div>
                    <div className="text-xl sm:text-2xl font-bold mt-1">
                        {formatUsdValue(mockDeFiStats.totalValueLocked)}
                    </div>
                    <div className="text-xs sm:text-sm text-white/60 mt-1">
                        {mockDeFiStats.distribution.lending}% Lending
                    </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs sm:text-sm text-white/60">Daily Yield</div>
                    <div className="text-xl sm:text-2xl font-bold mt-1">
                        {formatUsdValue(mockDeFiStats.dailyYield)}
                    </div>
                    <div className="text-xs sm:text-sm text-green-400 mt-1">
                        {formatApy(mockDeFiStats.averageApy)} APY
                    </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs sm:text-sm text-white/60">Risk Level</div>
                    <div className="text-xl sm:text-2xl font-bold mt-1">
                        {mockDeFiStats.riskLevel}
                    </div>
                    <div className="text-xs sm:text-sm text-white/60 mt-1">
                        {mockDeFiStats.distribution.borrowing}% Borrowed
                    </div>
                </div>
            </div>

            {/* DeFi Positions */}
            <div className="space-y-3">
                {sortedMockDeFiPositions.map((position) => (
                    <div
                        key={position.id}
                        className="p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <img
                                    src={position.protocolLogo}
                                    alt={position.protocol}
                                    className="w-8 h-8"
                                />
                                <div>
                                    <div className="text-sm sm:text-md font-medium">{position.protocol}</div>
                                    <div className="text-xs sm:text-sm text-white/60">{position.type}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-md sm:text-lg font-medium">
                                    {formatUsdValue(position.value)}
                                </div>
                                <div className="text-xs sm:text-sm text-green-400">
                                    {formatApy(position.apy)} APY
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs sm:text-sm">
                            <div>
                                <span className="text-white/60">Amount:</span>{' '}
                                {`${formatNumberByFrac(position.amount, 5)} ${position.token.symbol}`}
                            </div>
                            {position.rewards && (
                                <div>
                                    <span className="text-white/60">Rewards:</span>{' '}
                                    {formatUsdValue(position.rewards.value)}
                                </div>
                            )}
                            {position.healthFactor && (
                                <div>
                                    <span className="text-white/60">Health:</span>{' '}
                                    <span className={getHealthFactorColor(position.healthFactor)}>
                                        {position.healthFactor.toFixed(2)}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-1 ml-auto text-white/60">
                                <Clock className="w-4 h-4" />
                                <span>
                                    {Math.floor((Date.now() - position.startDate.getTime()) / (1000 * 60 * 60 * 24))}d
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    return (
        <>
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: isOpen ? 0 : "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`fixed right-0 top-0 h-full shadow-xl z-50 flex flex-col rounded-l-2xl pt-6
                border-l border-white ${theme === "dark" ? "glass bg-dark" : "glass bg-light"}`}
                style={{ width: drawerWidth }}
            >
                {/* Close Button */}
                {isOpen && <div onClick={() => setIsOpen(false)} className="absolute top-0 bottom-0 left-[-40px] w-[40px] pt-4 cursor-pointer flex justify-evenly h-[98%] m-auto rounded-2xl
                        hover:bg-white/10 hover:text-gray-500 hover:h-[94%] transition-all duration-300 ease-in-out">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="13 17 18 12 13 7"></polyline>
                        <polyline points="6 17 11 12 6 7"></polyline>
                    </svg>
                </div>}

                {/* TopBar */}
                <div className="flex items-center justify-between mx-4">
                    <div className="flex items-end gap-2 sm:gap-3">
                        <Wallet className="text-blue-500 w-5 h-5 sm:w-6 sm:h-6" />
                        <Accounts evmAddress={address} solAddress={solanaWalletInfo?.publicKey || ""} />
                    </div>

                    <button className={`p-1.5 sm:p-2 flex items-center gap-1 text-xs sm:text-sm rounded-xl hover:bg-white/10 ${theme === "dark" ? "text-white/70" : "text-black/70"}`} onClick={handleDisconnect}>
                        <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Disconnect
                    </button>
                </div>

                {
                    page === "main" &&
                    <div className="flex-1">
                        {/* Total Balance */}
                        <div className="bg-white/10 rounded-xl p-3 sm:p-4 mt-4 sm:mt-5 mx-4">
                            <div className="text-xs sm:text-sm text-white/60">Total Balance</div>
                            <div className="text-xl sm:text-3xl font-bold mt-1">
                                {
                                    isLoadingBalance ? <Skeleton startColor="#444" endColor="#1d2837" w={'5rem'} h={'2rem'}></Skeleton> : formatUsdValue(totalUsdValue)
                                }
                            </div>
                            {
                                !isLoadingBalance && <div className="flex items-center gap-1 mt-1 text-green-400">
                                    <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    <span className="text-xs sm:text-sm">+1.57% TODAY</span>
                                </div>
                            }
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-5 mx-4">
                            <button
                                disabled={tokenBalances.length === 0}
                                onClick={handleSend}
                                className={`flex items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors ${tokenBalances.length === 0 ? "opacity-[0.6] disabled:pointer-events-none disabled:cursor-default" : ""}`}
                            >
                                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-xs sm:text-sm">Send</span>
                            </button>
                            <button
                                onClick={handleReceive}
                                className="flex items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors"
                            >
                                <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-xs sm:text-sm">Receive</span>
                            </button>
                            <button
                                disabled={true}
                                onClick={() => setShowBuyDrawer(true)}
                                className="flex items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors opacity-[0.7]"
                            >
                                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-xs sm:text-sm">Buy</span>
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center justify-around mt-4 sm:mt-5">
                            <button
                                onClick={() => setSelectedTab('tokens')}
                                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${selectedTab === 'tokens' ? 'text-blue-400' : 'text-white/60 hover:text-white/80'
                                    }`}
                            >
                                <span className="text-xs sm:text-sm">Tokens</span>
                            </button>

                            <button
                                onClick={() => setSelectedTab('defi')}
                                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${selectedTab === 'defi' ? 'text-blue-400' : 'text-white/60 hover:text-white/80'
                                    }`}
                            >
                                <span className="text-xs sm:text-sm">Defi</span>
                            </button>

                            <button
                                onClick={() => setSelectedTab('activity')}
                                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${selectedTab === 'activity' ? 'text-blue-400' : 'text-white/60 hover:text-white/80'
                                    }`}
                            >
                                <span className="text-xs sm:text-sm">Activity</span>
                            </button>
                        </div>

                        {selectedTab === "tokens" && renderTokens()}
                        {selectedTab === "defi" && renderDeFi()}
                        {selectedTab === "activity" && renderActivity()}
                    </div>
                }

                {
                    (page === "asset" && selectedAsset) &&
                    <AssetInfo
                        tokenBalance={selectedAsset}
                        setTokenBalance={setSelectedAsset}
                        setPage={setPage}
                    />
                }

                {
                    (page === "send") &&
                    <SendDrawer
                        // isOpen={showSendDrawer}
                        selectedAssetIndex={selectedBalanceIndex}
                        // onClose={() => setShowSendDrawer(false)}
                        assets={tokenBalances.map(p => ({
                            name: p.name,
                            address: p.address,
                            symbol: p.symbol,
                            amount: Number(p.balance),
                            logo: p.logo,
                            chain: p.chain,
                            decimals: p.decimals,
                            network: p.network?.name || ""
                        }))}
                        setPage={setPage}
                    />
                }

                {
                    (page === "receive") &&
                    <ReceiveDrawer
                        // isOpen={showReceiveDrawer}
                        // onClose={() => setShowReceiveDrawer(false)}
                        assets={tokenBalances.map(p => ({
                            name: p.name,
                            symbol: p.symbol,
                            logo: p.logo,
                            chain: p.chain,
                        }))}
                        setPage={setPage}
                        page={page}
                    />
                }
            </motion.div>

            {/* Backdrop for mobile */}
            {
                isOpen && (
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        onClick={() => setIsOpen(false)}
                    />
                )
            }

            <BuyDrawer
                isOpen={showBuyDrawer}
                onClose={() => setShowBuyDrawer(false)}
                assets={sortedMockDeFiPositions.map(p => ({
                    id: p.id,
                    name: p.token.symbol,
                    symbol: p.token.symbol,
                    logo: p.token.logo
                }))}
            />
        </>
    );
}

export default WalletDrawer;