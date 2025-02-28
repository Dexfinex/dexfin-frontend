import { useContext, useState } from "react";
import { Web3AuthContext } from "../providers/Web3AuthContext";
import { motion } from "framer-motion";
import { useStore } from "../store/useStore";
import { TokenChainIcon } from "./swap/components/TokenIcon";
import { CheckCircle, Copy, Wallet, XCircle, TrendingUp, Send, ArrowDown, CreditCard, } from "lucide-react";
import { mockDeFiPositions, mockDeFiStats, formatUsdValue, formatApy, getHealthFactorColor, } from '../lib/wallet';
import { shrinkAddress, formatNumberByFrac } from "../utils/common.util";
import { useWalletBalance } from "../hooks/useBalance";
import useTokenBalanceStore from "../store/useTokenBalanceStore";
import { SendDrawer } from "./wallet/SendDrawer";
import { BuyDrawer } from "./wallet/BuyDrawer";
import { ReceiveDrawer } from "./wallet/ReceiveDrawer";
import { Skeleton } from '@chakra-ui/react';

interface WalletDrawerProps {
    isOpen: boolean,
    setIsOpen: (open: boolean) => void
}

export const WalletDrawer: React.FC<WalletDrawerProps> = ({ isOpen, setIsOpen }) => {
    const { theme } = useStore();
    const { address, chainId, switchChain, logout } = useContext(Web3AuthContext);
    const [copied, setCopied] = useState(false);
    const [selectedBalanceIndex, setSelectedBalanceIndex] = useState(0);
    const { isLoading: isLoadingBalance } = useWalletBalance();
    const { totalUsdValue, tokenBalances } = useTokenBalanceStore();
    const [showSendDrawer, setShowSendDrawer] = useState(false);
    const [showReceiveDrawer, setShowReceiveDrawer] = useState(false);
    const [showBuyDrawer, setShowBuyDrawer] = useState(false);

    const sortedMockDeFiPositions = mockDeFiPositions.sort((a, b) => a.value >= b.value ? -1 : 1)

    const handleCopy = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    }

    const handleDisconnect = () => {
        logout()
        setIsOpen(false)
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

                {/* Main */}
                <div className="flex items-center justify-between">
                    <button className="flex items-end gap-3">
                        <Wallet className="text-blue-500 w-6 h-6" />
                        <div className="flex items-center gap-1 cursor-pointer text-white/90 hover:!text-white/70" onClick={handleCopy}>
                            <span className="">{shrinkAddress(address)}</span>
                            {
                                !copied ? <Copy className="w-3 h-3" /> : <CheckCircle className="w-3 h-3 text-green-700" />
                            }
                        </div>
                    </button>

                    <button className={`p-2 flex items-center gap-1 text-sm rounded-xl hover:bg-white/10 ${theme === "dark" ? "text-white/70" : "text-black/70"}`} onClick={handleDisconnect}>
                        <XCircle className="w-4 h-4" /> Disconnect
                    </button>
                </div>

                {/* Total Balance */}
                <div className="bg-white/5 rounded-xl p-4 mt-5">
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
                                    onClick={async () => {
                                        if (Number(chainId) !== Number(position.chain)) {
                                            await switchChain(Number(position.chain));
                                        }
                                        setSelectedBalanceIndex(index);
                                        setShowSendDrawer(true);
                                    }}
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
