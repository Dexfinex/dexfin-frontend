import React, { useContext, useState, useEffect } from "react";
import { Web3AuthContext } from "../providers/Web3AuthContext";
import { motion } from "framer-motion";
import { useStore } from "../store/useStore";
import { TokenChainIcon } from "./swap/components/TokenIcon";
import { CheckCircle, Copy, Wallet, XCircle, TrendingUp, Send, ArrowDown, CreditCard, ArrowLeft } from "lucide-react";
import { mockDeFiPositions, mockDeFiStats, formatUsdValue, formatApy, getHealthFactorColor, } from '../lib/wallet';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { shrinkAddress, formatNumberByFrac } from "../utils/common.util";
import { useWalletBalance } from "../hooks/useBalance";
import useTokenBalanceStore, { TokenBalance } from "../store/useTokenBalanceStore";
import { SendDrawer } from "./wallet/SendDrawer";
import { BuyDrawer } from "./wallet/BuyDrawer";
import { ReceiveDrawer } from "./wallet/ReceiveDrawer";
import { Skeleton, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, Button } from '@chakra-ui/react';

interface WalletDrawerProps {
    isOpen: boolean,
    setIsOpen: (open: boolean) => void
}

interface AssetInfoProps {
    tokenBalance: TokenBalance;
    setTokenBalance: (token: TokenBalance | null) => void;
}

const aboutText = "The text surrounded by the component will be truncated. Anything surrounded by the component could be evaluated as text. The component react-show-more-text/ShowMoreText is fork of react-show-more/ShowMore, applied improvements, added onClick event, works with React 16.x.x, React 18.x.x, Next.Js 13.3.x and upper."

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
                <button className="flex items-center text-white/70 hover:text-white/90 gap-1">
                    <span>Account</span>
                    <Copy className="w-3 h-3" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="!w-[236px] !border-1 !border-transparent !bg-black !p-2">
                <button className="flex items-center justify-between p-1 hover:text-white/70" onClick={handleEvmCopy}>
                    <span className="flex items-center gap-1">
                        <img src="https://cdn.moralis.io/eth/0x.png" className="w-4 h-4" />
                        <span>Ethereum</span>
                    </span>
                    {evmCopied ? <CheckCircle className="w-3 h-3 text-green-500" /> : <span>{shrinkAddress(evmAddress)}</span>}
                </button>
                <button className="flex items-center justify-between p-1 hover:text-white/70" onClick={handleSolCopy}>
                    <span className="flex items-center gap-1">
                        <img src="https://assets.coingecko.com/coins/images/4128/small/solana.png" className="w-4 h-4" />
                        <span>Solana</span>
                    </span>
                    {solCopied ? <CheckCircle className="w-3 h-3 text-green-500" /> : <span>{shrinkAddress(solAddress)}</span>}
                </button>
            </PopoverContent>
        </Popover>
    )
}

export const AssetInfo: React.FC<AssetInfoProps> = ({ tokenBalance, setTokenBalance }) => {
    const [selectedRange, setSelectedRange] = useState<keyof typeof mockData>("1D");
    const [chartData, setChartData] = useState(mockData[selectedRange]);

    useEffect(() => {
        setChartData(mockData[selectedRange]); // Replace this with an API call if needed
    }, [selectedRange]);

    const handleBack = () => {
        setTokenBalance(null)
    }

    return (
        <div className="mt-4">
            <button className="rounded-full text-white/70 hover:bg-white/10 p-2" onClick={handleBack}>
                <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="overflow-y-auto ai-chat-scrollbar max-h-[calc(100%-300px)]">
                <p className="text-center text-xl text-white">{tokenBalance.symbol}</p>
                <p className="text-center text-2xl text-green-500 font-bold">$2000</p>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e" }} />
                    </LineChart>
                </ResponsiveContainer>

                {/* Buttons for time range selection */}
                <div className="flex justify-evenly space-x-2 mb-4">
                    {["1D", "1W", "1M", "1Y", "ALL"].map((range) => (
                        <button
                            key={range}
                            onClick={() => setSelectedRange(range as keyof typeof mockData)}
                            className="text-white/90 bg-white/20 w-16 rounded-md hover:bg-white/10"
                        >
                            <span className="text-sm">{range}</span>
                        </button>
                    ))}
                </div>

                <div className="mt-4">
                    <p className="text-white/70 font-bold">Your Balance</p>
                    <div className="mt-1 px-2 py-3 bg-white/5 rounded-xl flex gap-2">
                        <div className="flex items-center">
                            <img src={tokenBalance.logo} className="w-10 h-10 rounded-full" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between">
                                <span>{tokenBalance.symbol}</span>
                                <span>{formatUsdValue(tokenBalance.usdPrice)}</span>
                            </div>
                            <div className="flex justify-between text-white/70 text-sm">
                                <span>{tokenBalance.balance} {tokenBalance.symbol}</span>
                                <span>{formatUsdValue(tokenBalance.usdValue)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <p className="text-white/70 font-bold">About</p>
                    <ShowMoreLess text={aboutText} maxLength={100} />
                </div>

                <div className="mt-4">
                    <p className="text-white/70 font-bold">About</p>
                    <div className="flex gap-2">
                        <button
                            className="text-white/90 bg-white/20 text-sm rounded-2xl hover:bg-white/10 px-3 py-1"
                        >
                            Websites
                        </button>
                        <button
                            className="text-white/90 bg-white/20 text-sm rounded-2xl hover:bg-white/10 px-3 py-1"
                        >
                            X
                        </button>
                    </div>
                </div>

                <div className="mt-4">
                    <p className="text-white/70 font-bold">Info</p>
                    <div className="bg-white/5 rounded-xl">
                        <div className="flex justify-between py-2 px-3 border-b border-black/50">
                            <span className="text-white/70">Symbol</span>
                            <span>{tokenBalance.symbol}</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 border-b border-black/50">
                            <span className="text-white/70">Network</span>
                            <span>Ethereum</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 border-b border-black/50">
                            <span className="text-white/70">Market Cap</span>
                            <span>$266.85B</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 border-b border-black/50">
                            <span className="text-white/70">Total Supply</span>
                            <span>120.58M</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 border-b border-black/50">
                            <span className="text-white/70">Circulating Supply</span>
                            <span>120.58M</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 mb-4">
                    <p className="text-white/70 font-bold">24h Performance</p>
                    <div className="bg-white/5 rounded-xl">
                        <div className="flex justify-between py-2 px-3 border-b border-black/50">
                            <span className="text-white/70">Volume</span>
                            <span>$962.45M</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 border-b border-black/50">
                            <span className="text-white/70">Traders</span>
                            <span>47772</span>
                        </div>
                    </div>
                </div>
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
                className={`fixed right-0 top-0 h-full w-[400px] ${theme === "dark" ? "glass bg-dark" : "glass bg-light"} shadow-xl z-50 flex flex-col p-5 rounded-l-2xl
                        border-l border-white py-8`}
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
                    <button className="flex items-end gap-3">
                        <Wallet className="text-blue-500 w-6 h-6" />
                        <Accounts evmAddress={address} solAddress={solanaWalletInfo?.publicKey || ""} />
                    </button>

                    <button className={`p-2 flex items-center gap-1 text-sm rounded-xl hover:bg-white/10 ${theme === "dark" ? "text-white/70" : "text-black/70"}`} onClick={handleDisconnect}>
                        <XCircle className="w-4 h-4" /> Disconnect
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
                            <div className="bg-white/10 rounded-xl p-4 mt-5">
                                <div className="text-sm text-white/60">Total Balance</div>
                                <div className="text-3xl font-bold mt-1">
                                    {
                                        isLoadingBalance ? <Skeleton startColor="#444" endColor="#1d2837" w={'5rem'} h={'2rem'}></Skeleton> : formatUsdValue(totalUsdValue)
                                    }
                                </div>
                                {
                                    !isLoadingBalance && <div className="flex items-center gap-1 mt-1 text-green-400">
                                        <TrendingUp className="w-4 h-4" />
                                        <span>+1.57% TODAY</span>
                                    </div>
                                }
                            </div>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-3 gap-3 mt-5">
                                <button
                                    disabled={tokenBalances.length === 0}
                                    onClick={() => setShowSendDrawer(true)}
                                    className={`flex items-center justify-center gap-2 p-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors ${tokenBalances.length === 0 ? "opacity-[0.6] disabled:pointer-events-none disabled:cursor-default" : ""}`}
                                >
                                    <Send className="w-5 h-5" />
                                    <span>Send</span>
                                </button>
                                <button
                                    onClick={() => setShowReceiveDrawer(true)}
                                    className="flex items-center justify-center gap-2 p-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors"
                                >
                                    <ArrowDown className="w-5 h-5" />
                                    <span>Receive</span>
                                </button>
                                <button
                                    disabled={true}
                                    onClick={() => setShowBuyDrawer(true)}
                                    className="flex items-center justify-center gap-2 p-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors opacity-[0.7]"
                                >
                                    <CreditCard className="w-5 h-5" />
                                    <span>Buy</span>
                                </button>
                            </div>

                            {/* Assets List */}
                            <div className="space-y-2 mt-5 overflow-y-auto ai-chat-scrollbar max-h-[calc(100%-180px)]">
                                {
                                    isLoadingBalance ?
                                        <Skeleton startColor="#444" endColor="#1d2837" w={'100%'} h={'4rem'}></Skeleton>
                                        : tokenBalances.map((position, index) => (
                                            <button
                                                key={position.chain + position.symbol + index}
                                                className="flex w-full items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                                onClick={() => handleAsset(position)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <TokenChainIcon src={position.logo} alt={position.name} size={"lg"} chainId={Number(position.chain)} />
                                                    <div className='flex flex-col justify-start items-start'>
                                                        <div className="font-medium">{position.symbol}</div>
                                                        <div className="text-sm text-white/60">
                                                            {`${formatNumberByFrac(position.balance)} ${position.symbol}`}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div>{formatUsdValue(position.usdValue)}</div>
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
