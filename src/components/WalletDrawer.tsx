import React, { useContext, useState, useEffect } from "react";
import { Web3AuthContext } from "../providers/Web3AuthContext";
import { motion } from "framer-motion";
import { useStore } from "../store/useStore";
import { TokenChainIcon } from "./swap/components/TokenIcon";
import { Wallet, XCircle, TrendingUp, Send, ArrowDown, CreditCard } from "lucide-react";
import { mockDeFiPositions, formatUsdValue, } from '../lib/wallet';
import { shrinkAddress, formatNumberByFrac, getTimeAgo, formatHealthFactor } from "../utils/common.util";
import { useWalletBalance } from "../hooks/useBalance";
import useTokenBalanceStore, { TokenBalance } from "../store/useTokenBalanceStore";
import { SendDrawer } from "./wallet/SendDrawer";
import { BuyDrawer } from "./wallet/BuyDrawer";
import { ReceiveDrawer } from "./wallet/ReceiveDrawer";
import useActivitiesStore from "../store/useActivitiesStore.ts";
import { Skeleton } from '@chakra-ui/react';
import { mapChainName2ExplorerUrl } from "../config/networks";
import { useActivities } from "../hooks/useActivities.ts";
import useDefiStore from "../store/useDefiStore";
import { PositionList } from "./wallet/PositionList.tsx";
import Accounts from "./wallet/Accounts.tsx";
import AssetInfo from "./wallet/AssetInfo.tsx";

interface WalletDrawerProps {
    isOpen: boolean,
    setIsOpen: (open: boolean) => void
}

export type PageType = 'main' | 'asset' | 'send' | 'receive'



export const WalletDrawer: React.FC<WalletDrawerProps> = ({ isOpen, setIsOpen }) => {
    const { theme } = useStore();

    const { protocol, netAPY, healthFactor, } = useDefiStore();
    const total_usd_value = protocol.reduce((sum, p) => sum + Number(p.total_usd_value) || 0, 0);
    const total_unclaimed_usd_value = protocol.reduce((sum, p) => sum + Number(p.total_unclaimed_usd_value) || 0, 0);
    const isHealthy = formatHealthFactor(healthFactor) === "∞";

    const { address, logout, solanaWalletInfo } = useContext(Web3AuthContext);
    const [selectedBalanceIndex, setSelectedBalanceIndex] = useState(0);
    const [selectedTab, setSelectedTab] = useState<'tokens' | 'activity' | 'defi'>('tokens');
    const [page, setPage] = useState<PageType>('main');
    const { isLoading: isLoadingBalance } = useWalletBalance();
    const { totalUsdValue, tokenBalances } = useTokenBalanceStore();
    const { } = useActivities({ evmAddress: address, solanaAddress: solanaWalletInfo?.publicKey || "" })
    const { activities } = useActivitiesStore();
    // const [showSendDrawer, setShowSendDrawer] = useState(false);
    // const [showReceiveDrawer, setShowReceiveDrawer] = useState(false);
    const [showBuyDrawer, setShowBuyDrawer] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<TokenBalance | null>(null);
    const [drawerWidth, setDrawerWidth] = useState("400px");

    // useEvmWalletTransfer();
    // const { transfers } = useTokenTransferStore();


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
        <div className="space-y-6 mt-4 sm:mt-5 mx-4 flex-1 overflow-y-auto ai-chat-scrollbar sm:max-h-[calc(100vh-350px)] max-h-[calc(100vh-290px)]">
            {/* DeFi Overview */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs sm:text-sm text-white/60">Total Value Locked</div>
                    <div className="text-xl sm:text-2xl font-bold mt-1">
                        {`$${formatNumberByFrac(total_usd_value)}`}
                    </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs sm:text-sm text-white/60">Net APY</div>
                    <div className="text-xl sm:text-2xl font-bold mt-1">
                        {`${formatNumberByFrac(netAPY)}%`}
                    </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs sm:text-sm text-white/60">Total Rewards</div>
                    <div className="text-xl sm:text-2xl font-bold mt-1">
                        {`$ ${total_unclaimed_usd_value}`}
                    </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs sm:text-sm text-white/60">Health Status</div>
                    <div className={`text-xl sm:text-2xl font-bold mt-1 ${isHealthy ? "text-green-400" : "text-red-400"}`}>
                        {isHealthy ? "Healthy" : "Risk"}
                    </div>
                </div>
            </div>

            {/* DeFi Positions */}
            <div className="space-y-3">
                <PositionList isLoading={isLoadingBalance} />
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