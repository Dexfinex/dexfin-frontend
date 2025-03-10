import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Skeleton, } from '@chakra-ui/react';
import { LineChart, Line, Tooltip, ResponsiveContainer } from "recharts";

import CustomTooltip from "../wallet/CustomTooltip.tsx";
import { TokenBalance } from "../../store/useTokenBalanceStore";
import { useStore } from "../../store/useStore";

import { coingeckoService } from "../../services/coingecko.service";
import { formatNumberByFrac, formatNumber, getHourAndMinute, getMonthDayHour, getMonthDayYear } from "../../utils/common.util";
import { birdeyeService } from "../../services/birdeye.service";
import { formatUsdValue, } from '../../lib/wallet';
import ShowMoreLess from "../wallet/ShowMoreLess.tsx";


export type PageType = 'main' | 'asset' | 'send' | 'receive'

interface AssetInfoProps {
    tokenBalance: TokenBalance;
    setTokenBalance: (token: TokenBalance | null) => void;
    setPage: (type: PageType) => void;
}

type ChartTimeType = "1D" | "1W" | "1M" | "3M";

type ChartPriceType = {
    time: string,
    price: number
}

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


const AssetInfo: React.FC<AssetInfoProps> = ({ tokenBalance, setTokenBalance, setPage }) => {
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

export default AssetInfo;