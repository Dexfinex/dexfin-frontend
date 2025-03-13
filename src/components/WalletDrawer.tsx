import React, { useContext, useState, useEffect } from "react";
import { Wallet, XCircle, TrendingUp, Send, ArrowDown, CreditCard, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

import { useStore } from "../store/useStore";
import { Web3AuthContext } from "../providers/Web3AuthContext";
import { mockDeFiPositions, formatUsdValue, } from '../lib/wallet';
import { useWalletBalance } from "../hooks/useBalance";
import useTokenBalanceStore, { TokenBalance } from "../store/useTokenBalanceStore";
import { SendDrawer } from "./wallet/SendDrawer";
import { BuyDrawer } from "./wallet/BuyDrawer";
import { ReceiveDrawer } from "./wallet/ReceiveDrawer";
import { Skeleton } from '@chakra-ui/react';
import { useActivities } from "../hooks/useActivities.ts";
import Accounts from "./wallet/Accounts.tsx";
import AssetInfo from "./wallet/AssetInfo.tsx";
import RenderActivity from "./wallet/RenderActivity.tsx";
import RenderDefi from "./wallet/RenderDeFi.tsx";
import RenderTokens from "./wallet/RenderTokens.tsx";
import CloseButton from "./wallet/CloseButton.tsx";
import useDefiStore from "../store/useDefiStore.ts";

interface WalletDrawerProps {
    isOpen: boolean,
    setIsOpen: (open: boolean) => void
}

export type PageType = 'main' | 'asset' | 'send' | 'receive'



export const WalletDrawer: React.FC<WalletDrawerProps> = ({ isOpen, setIsOpen }) => {
    const { theme } = useStore();

    const { address, logout, solanaWalletInfo } = useContext(Web3AuthContext);
    useActivities({ evmAddress: address, solanaAddress: solanaWalletInfo?.publicKey || "" })
    const [selectedBalanceIndex, setSelectedBalanceIndex] = useState(0);
    const [selectedTab, setSelectedTab] = useState<'tokens' | 'activity' | 'defi'>('tokens');
    const [page, setPage] = useState<PageType>('main');
    const { isLoading: isLoadingBalance, refetch: refetchWalletBalance } = useWalletBalance();
    const { totalUsdValue, tokenBalances } = useTokenBalanceStore();
    const { totalLockedValue } = useDefiStore();

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
        setSelectedAsset(token)
        setPage('asset')
    }

    const handleSend = () => {
        setPage('send')
    }

    const handleReceive = () => {
        setPage('receive')
    }

    const handleRefetch = async () => {
        await refetchWalletBalance();
    }


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
                {isOpen && <CloseButton setIsOpen={setIsOpen} />}

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
                            <div className="text-xs sm:text-sm text-white/60 flex items-center justify-between">
                                Total Balance
                                <button
                                    onClick={handleRefetch}
                                    disabled={isLoadingBalance}
                                    className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${isLoadingBalance ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    title="Refresh data"
                                >
                                    <RefreshCw className={`w-4 h-4 ${isLoadingBalance ? 'animate-spin' : ''}`} />
                                </button></div>
                            <div className="text-xl sm:text-3xl font-bold mt-1">
                                {
                                    isLoadingBalance ? <Skeleton startColor="#444" endColor="#1d2837" w={'5rem'} h={'2rem'}></Skeleton> : formatUsdValue(totalUsdValue + totalLockedValue)
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

                        {selectedTab === "tokens" && <RenderTokens handleAsset={handleAsset} />}
                        {selectedTab === "defi" && <RenderDefi />}
                        {selectedTab === "activity" && <RenderActivity />}
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