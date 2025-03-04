import React, { useContext, useState, useEffect } from "react";
import { Web3AuthContext } from "../providers/Web3AuthContext";
import { motion } from "framer-motion";
import { useStore } from "../store/useStore";
import { TokenChainIcon } from "./swap/components/TokenIcon";
import { CheckCircle, Copy, Wallet, XCircle, TrendingUp, Send, ArrowDown, CreditCard, ArrowLeft } from "lucide-react";
import { mockDeFiPositions, mockDeFiStats, formatUsdValue, formatApy, getHealthFactorColor, } from '../lib/wallet';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { shrinkAddress, formatNumberByFrac, formatNumber } from "../utils/common.util";
import { useWalletBalance } from "../hooks/useBalance";
import useTokenBalanceStore, { TokenBalance } from "../store/useTokenBalanceStore";
import { SendDrawer } from "./wallet/SendDrawer";
import { BuyDrawer } from "./wallet/BuyDrawer";
import { ReceiveDrawer } from "./wallet/ReceiveDrawer";
import { Skeleton, Popover, PopoverTrigger, PopoverContent } from '@chakra-ui/react';
import { coingeckoService } from "../services/coingecko.service";

interface WalletDrawerProps {
    isOpen: boolean,
    setIsOpen: (open: boolean) => void
}

interface AssetInfoProps {
    tokenBalance: TokenBalance;
    setTokenBalance: (token: TokenBalance | null) => void;
}

// Mock price data (replace with API data)
const mockData = {
    "1D": [
        { time: "00:00", price: 120 },
        { time: "06:00", price: 125 },
        { time: "12:00", price: 123 },
        { time: "18:00", price: 130 },
        { time: "23:59", price: 128 }
    ],
    "1W": [
        { time: "Mon", price: 110 },
        { time: "Tue", price: 115 },
        { time: "Wed", price: 112 },
        { time: "Thu", price: 118 },
        { time: "Fri", price: 125 },
        { time: "Sat", price: 122 },
        { time: "Sun", price: 130 }
    ],
    "1M": [
        { time: "Week 1", price: 105 },
        { time: "Week 2", price: 110 },
        { time: "Week 3", price: 120 },
        { time: "Week 4", price: 125 }
    ],
    "1Y": [
        { time: "Jan", price: 90 },
        { time: "Apr", price: 110 },
        { time: "Jul", price: 140 },
        { time: "Oct", price: 130 },
        { time: "Dec", price: 150 }
    ],
    "ALL": [
        { time: "2019", price: 30 },
        { time: "2020", price: 50 },
        { time: "2021", price: 100 },
        { time: "2022", price: 130 },
        { time: "2023", price: 150 }
    ]
};

const CustomTooltip: React.FC<{ active?: boolean; payload?: { value: number }[]; }> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return <span className="text-green-500 text-sm font-bold">{payload[0].value}</span>
    }
    return null;
}

const ShowMoreLess: React.FC<{ text: string, maxLength: number }> = ({ text, maxLength = 100 }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
        <div className="text-white/70">
            <p>
                {isExpanded ? text : text.slice(0, maxLength) + (text.length > maxLength ? "..." : "")}
            </p>
            {text.length > maxLength && (
                <button
                    onClick={toggleExpand}
                    className="text-blue-500 hover:text-blue-600 mt-1"
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
                <div className="flex items-center text-white/90 hover:text-white/70 gap-1">
                    <span>Account</span>
                    <Copy className="w-3 h-3" />
                </div>
            </PopoverTrigger>
            <PopoverContent className="!w-[236px] !border-1 !border-transparent !bg-black !p-2">
                <div className="flex items-center justify-between p-1 text-white/90 hover:text-white/70" onClick={handleEvmCopy}>
                    <span className="flex items-center gap-1">
                        <img src="https://cdn.moralis.io/eth/0x.png" className="w-4 h-4" />
                        <span>Ethereum</span>
                    </span>
                    {evmCopied ? <CheckCircle className="w-3 h-3 text-green-500" /> : <span>{shrinkAddress(evmAddress)}</span>}
                </div>
                <div className="flex items-center justify-between p-1 text-white/90 hover:text-white/70" onClick={handleSolCopy}>
                    <span className="flex items-center gap-1">
                        <img src="https://assets.coingecko.com/coins/images/4128/small/solana.png" className="w-4 h-4" />
                        <span>Solana</span>
                    </span>
                    {solCopied ? <CheckCircle className="w-3 h-3 text-green-500" /> : <span>{shrinkAddress(solAddress)}</span>}
                </div>
            </PopoverContent>
        </Popover>
    )
}

export const AssetInfo: React.FC<AssetInfoProps> = ({ tokenBalance, setTokenBalance }) => {
    const [selectedRange, setSelectedRange] = useState<keyof typeof mockData>("1D");
    const [chartData, setChartData] = useState(mockData[selectedRange]);
    const [info, setInfo] = useState<any>(null);

    useEffect(() => {
        setChartData(mockData[selectedRange]); // Replace this with an API call if needed
    }, [selectedRange]);

    useEffect(() => {
        if (tokenBalance.tokenId) {
            getTokenInfo(tokenBalance)
        }
    }, [tokenBalance])

    const getTokenInfo = async (token: TokenBalance) => {
        const info = await coingeckoService.getInfo(token.tokenId)
        console.log('info = ', info)
        setInfo(info)
    }

    const handleBack = () => {
        setTokenBalance(null)
    }

    const renderSocialBtns = (links: any) => {
        let discordUrl = ""

        if (links.chat_url.length > 0) {
            discordUrl = links.chat_url.find((url: string) => url.includes("discord"))
        }

        return <div className="flex gap-2">
            {links.homepage[0] && <a
                className="text-white/90 bg-white/20 text-xs sm:text-sm rounded-2xl hover:bg-white/10 px-3 py-1"
                target="_blank"
                href={links.homepage[0]}
            >
                Websites
            </a>}

            {links.twitter_screen_name && <a
                className="text-white/90 bg-white/20 text-xs sm:text-sm rounded-2xl hover:bg-white/10 px-3 py-1"
                target="_blank"
                href={`https://x.com/${links.twitter_screen_name}`}
            >
                X
            </a>}

            {links.telegram_channel_identifier && <a
                className="text-white/90 bg-white/20 text-xs sm:text-sm rounded-2xl hover:bg-white/10 px-3 py-1"
                target="_blank"
                href={`https://t.me/${links.telegram_channel_identifier}`}
            >
                Telegram
            </a>}


            {discordUrl && <a
                className="text-white/90 bg-white/20 text-xs sm:text-sm rounded-2xl hover:bg-white/10 px-3 py-1"
                target="_blank"
                href={discordUrl}
            >
                Discord
            </a>}
        </div>
    }

    return (
        <div className="mt-4">
            <button className="rounded-full text-white/70 hover:bg-white/10 p-2" onClick={handleBack}>
                <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="overflow-y-auto ai-chat-scrollbar max-h-[calc(100vh-140px)]">
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

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e" }} />
                    </LineChart>
                </ResponsiveContainer>

                {/* Buttons for time range selection */}
                <div className="flex justify-evenly space-x-1 sm:space-x-2 mb-4">
                    {["1D", "1W", "1M", "1Y", "ALL"].map((range) => (
                        <button
                            key={range}
                            onClick={() => setSelectedRange(range as keyof typeof mockData)}
                            className={`text-white/90 bg-white/20 w-14 sm:w-16 py-1 rounded-md hover:bg-white/10 text-xs sm:text-sm ${selectedRange === range ? 'bg-white/30' : ''}`}
                        >
                            {range}
                        </button>
                    ))}
                </div>

                <div className="mt-4">
                    <p className="text-white/70 font-bold text-sm sm:text-base">Your Balance</p>
                    <div className="mt-1 px-2 py-3 bg-white/5 rounded-xl flex gap-2">
                        <div className="flex items-center">
                            <img src={tokenBalance.logo} className="w-8 sm:w-10 h-8 sm:h-10 rounded-full" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between text-sm sm:text-base">
                                <span>{tokenBalance.symbol}</span>
                                <span>{formatUsdValue(tokenBalance.usdPrice)}</span>
                            </div>
                            <div className="flex justify-between text-white/70 text-sm">
                                <span>{formatNumberByFrac(tokenBalance.balance)} {tokenBalance.symbol}</span>
                                <span>{formatUsdValue(tokenBalance.usdValue)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <p className="text-white/70 font-bold">About</p>
                    {
                        info?.description?.en ?
                            <ShowMoreLess text={info.description.en} maxLength={150} /> :
                            <Skeleton className="w-full h-24" />
                    }

                </div>

                <div className="mt-4">
                    <p className="text-white/70 font-bold text-sm sm:text-base">About</p>
                    {
                        info?.links ? renderSocialBtns(info?.links) : <Skeleton className="w-full h-24" />
                    }
                </div>

                <div className="mt-4">
                    <p className="text-white/70 font-bold text-sm sm:text-base">Info</p>
                    <div className="bg-white/5 rounded-xl text-xs sm:text-sm">
                        <div className="flex justify-between py-2 px-3 border-b border-black/50">
                            <span className="text-white/70">Symbol</span>
                            <span>{tokenBalance.symbol}</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 border-b border-black/50">
                            <span className="text-white/70">Network</span>
                            <span>Network</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 border-b border-black/50">
                            <span className="text-white/70">Market Cap</span>
                            {
                                info?.market_data?.market_cap?.usd ?
                                    <span className="">${formatNumber(info?.market_data?.market_cap?.usd)}</span> :
                                    <Skeleton className="w-16 h-6" />
                            }
                        </div>
                        <div className="flex justify-between py-2 px-3 border-b border-black/50">
                            <span className="text-white/70">Total Supply</span>
                            {
                                info?.market_data?.total_supply ?
                                    <span className="">${formatNumber(info?.market_data?.total_supply)}</span> :
                                    <Skeleton className="w-16 h-6" />
                            }
                        </div>
                        <div className="flex justify-between py-2 px-3 border-b border-black/50">
                            <span className="text-white/70">Circulating Supply</span>
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
    const { isLoading: isLoadingBalance } = useWalletBalance();
    const { totalUsdValue, tokenBalances } = useTokenBalanceStore();
    const [showSendDrawer, setShowSendDrawer] = useState(false);
    const [showReceiveDrawer, setShowReceiveDrawer] = useState(false);
    const [showBuyDrawer, setShowBuyDrawer] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<TokenBalance | null>(null);
    const [drawerWidth, setDrawerWidth] = useState("400px");

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
        // if (Number(chainId) !== Number(token.chain)) {
        //     await switchChain(Number(token.chain));
        // }
        // setSelectedBalanceIndex(index);
        // setShowSendDrawer(true);
        console.log('token = ', token)
        setSelectedAsset(token)
    }

    return (
        <>
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: isOpen ? 0 : "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`fixed right-0 top-0 h-full shadow-xl z-50 flex flex-col p-3 sm:p-5 rounded-l-2xl
                        border-l border-white py-6 sm:py-8 ${theme === "dark" ? "glass bg-dark" : "glass bg-light"}`}
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
                <div className="flex items-center justify-between">
                    <div className="flex items-end gap-2 sm:gap-3">
                        <Wallet className="text-blue-500 w-5 h-5 sm:w-6 sm:h-6" />
                        <Accounts evmAddress={address} solAddress={solanaWalletInfo?.publicKey || ""} />
                    </div>

                    <button className={`p-1.5 sm:p-2 flex items-center gap-1 text-xs sm:text-sm rounded-xl hover:bg-white/10 ${theme === "dark" ? "text-white/70" : "text-black/70"}`} onClick={handleDisconnect}>
                        <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Disconnect
                    </button>
                </div>

                {
                    selectedAsset ?
                        <AssetInfo
                            tokenBalance={selectedAsset}
                            setTokenBalance={setSelectedAsset}
                        />
                        :
                        <>
                            {/* Total Balance */}
                            <div className="bg-white/10 rounded-xl p-3 sm:p-4 mt-4 sm:mt-5">
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
                            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-5">
                                <button
                                    disabled={tokenBalances.length === 0}
                                    onClick={() => setShowSendDrawer(true)}
                                    className={`flex items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors ${tokenBalances.length === 0 ? "opacity-[0.6] disabled:pointer-events-none disabled:cursor-default" : ""}`}
                                >
                                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="text-xs sm:text-sm">Send</span>
                                </button>
                                <button
                                    onClick={() => setShowReceiveDrawer(true)}
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

                            {/* Assets List */}
                            <div className="space-y-2 mt-4 sm:mt-5 overflow-y-auto ai-chat-scrollbar max-h-[calc(100vh-230px)]">
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
                                                        <div className="font-medium">{token.symbol}</div>
                                                        <div className="text-sm text-white/60">
                                                            {`${formatNumberByFrac(token.balance)} ${token.symbol}`}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span>{formatUsdValue(token.usdValue)}</span>
                                                    {/* <div className="text-sm text-green-400">
                                                    {formatApy(0)} APY
                                                    </div> */}
                                                </div>
                                            </button>
                                        ))
                                }
                            </div>
                        </>
                }
            </motion.div>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawers */}
            <SendDrawer
                isOpen={showSendDrawer}
                selectedAssetIndex={selectedBalanceIndex}
                onClose={() => setShowSendDrawer(false)}
                assets={tokenBalances.map(p => ({
                    name: p.name,
                    address: p.address,
                    symbol: p.symbol,
                    amount: Number(p.balance),
                    logo: p.logo,
                    chain: p.chain,
                }))}
            />

            <ReceiveDrawer
                isOpen={showReceiveDrawer}
                onClose={() => setShowReceiveDrawer(false)}
                assets={tokenBalances.map(p => ({
                    name: p.name,
                    symbol: p.symbol,
                    logo: p.logo,
                    chain: p.chain,
                }))}
            />

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
};

export default WalletDrawer;