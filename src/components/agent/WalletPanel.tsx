import { useState, useEffect } from 'react';
import {
    useMediaQuery,
    Skeleton,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure
} from '@chakra-ui/react';

import {
    ChevronLeft,
    ChevronRight,
    Landmark,
    Wallet,
} from 'lucide-react';
import { WalletTab } from '../../types/agent.type.ts';
import { mockDeFiPositions } from "../../constants/defi.constants.ts";
import { formatUsdValue } from "../../utils/defi.util.ts";
import useTokenBalanceStore from '../../store/useTokenBalanceStore.ts';
import { useWalletBalance } from '../../hooks/useBalance.tsx';
import { TokenChainIcon } from './../swap/components/TokenIcon.tsx';
import { PositionList } from '../wallet/PositionList.tsx';
import PNL from '../common/PNL.tsx';
import PNLPercent from '../common/PNLPercent.tsx';
import { formatNumberByFrac } from '../../utils/common.util.ts';
import useDefiStore from '../../store/useDefiStore.ts';

interface WalletPanelProps {
    isWalletPanelOpen: boolean;
    setIsWalletPanelOpen: (value: boolean) => void;
}

export function WalletPanel({ isWalletPanelOpen, setIsWalletPanelOpen }: WalletPanelProps) {
    const { isLoading: isLoadingBalance } = useWalletBalance();
    const { totalUsdValue, tokenBalances, pnlPercent, pnlUsd } = useTokenBalanceStore();
    const { totalLockedValue } = useDefiStore();
    const [activeWalletTab, setActiveWalletTab] = useState<WalletTab>('assets');
    const [isLargerThan962] = useMediaQuery('(min-width: 962px)');

    // Calculate combined portfolio value
    const totalPortfolioValue = totalUsdValue + totalLockedValue;

    const { isOpen, onOpen, onClose } = useDisclosure();
    // Filter positions correctly
    const defiPositions = mockDeFiPositions.filter(p => p.type === 'LENDING');
    // Handle window resize to hide panel on mobile
    useEffect(() => {
        if (!isLargerThan962) {
            setIsWalletPanelOpen(false);
        } else {
            setIsWalletPanelOpen(true);
        }
    }, [isLargerThan962, setIsWalletPanelOpen]);

    return (
        <>
            {isLargerThan962 ? (
                <div
                    className={`right-0 top-[73px] bottom-[89px] border-l border-white/10 transition-all duration-300 ${isWalletPanelOpen ? 'w-80' : 'w-0'
                        } overflow-hidden`}>
                    <div className="h-full  w-80 flex flex-col glass">
                        {/* Total Balance */}
                        <div className="p-4 border-b border-white/10">
                            <div className="text-sm text-white/60">Total Balance</div>
                            <div className="text-2xl font-bold mt-1">
                                {isLoadingBalance ? <Skeleton startColor="#444" endColor="#1d2837" w={'5rem'}
                                    h={'2rem'}></Skeleton> : formatUsdValue(totalPortfolioValue)}
                            </div>
                            {
                                isLoadingBalance ?
                                    <Skeleton startColor="#444" endColor="#1d2837" w={'10rem'} h={'1rem'}></Skeleton> :
                                    <PNL pnlPercent={pnlPercent} pnlUsd={pnlUsd} label="Today" />
                            }
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex border-b border-white/10">
                            <button
                                onClick={() => setActiveWalletTab('assets')}
                                className={`flex items-center gap-2 flex-1 p-2 text-sm transition-colors ${activeWalletTab === 'assets'
                                    ? 'bg-white/10 font-medium'
                                    : 'hover:bg-white/5'
                                    }`}
                            >
                                <Wallet className="w-4 h-4" />
                                Assets
                            </button>
                            <button
                                onClick={() => setActiveWalletTab('defi')}
                                className={`flex items-center gap-2 flex-1 p-2 text-sm transition-colors ${activeWalletTab === 'defi'
                                    ? 'bg-white/10 font-medium'
                                    : 'hover:bg-white/5'
                                    }`}
                            >
                                <Landmark className="w-4 h-4" />
                                DeFi
                            </button>
                        </div>

                        {/* Assets List */}
                        <div className="flex-1 overflow-y-auto ai-chat-scrollbar">
                            <div className="p-1 space-y-2">
                                {activeWalletTab === 'assets' ? (
                                    // Assets Tab
                                    <div className="space-y-2">
                                        {
                                            isLoadingBalance ?
                                                <Skeleton startColor="#444" endColor="#1d2837" w={'100%'}
                                                    h={'4rem'}></Skeleton>
                                                : tokenBalances.map((position) => (
                                                    <button
                                                        key={position.chain + position.symbol}
                                                        className="flex w-full items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <TokenChainIcon src={position.logo} alt={position.name}
                                                                size={"lg"} chainId={Number(position.chain)} />
                                                            <div className='flex flex-col justify-start items-start'>
                                                                <div className="font-medium">{position.symbol}</div>
                                                                <div className="text-sm text-white/60">
                                                                    {`${formatNumberByFrac(position.balance, 5)} ${position.symbol}`}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span>{formatUsdValue(position.usdValue)}</span>
                                                            <PNLPercent
                                                                pnlPercent={position.usdPrice24hrUsdChange * 100 / position.usdPrice} />
                                                        </div>
                                                    </button>
                                                ))
                                        }
                                    </div>
                                ) : (
                                    // DeFi Tab
                                    <PositionList isLoading={false} />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Toggle Button */}
                    <button
                        onClick={() => setIsWalletPanelOpen(!isWalletPanelOpen)}
                        className={`absolute top-1/2 ${isWalletPanelOpen ? '-left-6' : 'left-0'} p-1 bg-white/10 hover:bg-white/20 rounded-l-lg transition-colors`}
                    >
                        {isWalletPanelOpen ? (
                            <ChevronRight className="w-4 h-4" />
                        ) : (
                            <ChevronLeft className="w-4 h-4" />
                        )}
                    </button>
                </div>
            ) : (
                <>
                    <button
                        onClick={onOpen}
                        className="fixed right-0 p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <Wallet className="w-5 h-5" />
                    </button>
                    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
                        <DrawerOverlay>
                            <DrawerContent className="glass">
                                <DrawerCloseButton />
                                <DrawerHeader>Wallet</DrawerHeader>
                                <DrawerBody>
                                    <div className="h-full flex flex-col">
                                        {/* Total Balance */}
                                        <div className="p-4 border-b border-white/10">
                                            <div className="text-sm text-white/60">Total Balance</div>
                                            <div className="text-2xl font-bold mt-1">
                                                {isLoadingBalance ?
                                                    <Skeleton startColor="#444" endColor="#1d2837" w={'5rem'}
                                                        h={'2rem'}></Skeleton> : formatUsdValue(totalUsdValue)}
                                            </div>

                                            {
                                                isLoadingBalance ?
                                                    <Skeleton startColor="#444" endColor="#1d2837" w={'10rem'}
                                                        h={'1rem'}></Skeleton> :
                                                    <PNL pnlPercent={pnlPercent} pnlUsd={pnlUsd} label="Today" />
                                            }
                                        </div>

                                        {/* Tab Navigation */}
                                        <div className="flex border-b border-white/10">
                                            <button
                                                onClick={() => setActiveWalletTab('assets')}
                                                className={`flex items-center gap-2 flex-1 p-2 text-sm transition-colors ${activeWalletTab === 'assets'
                                                    ? 'bg-white/10 font-medium'
                                                    : 'hover:bg-white/5'
                                                    }`}
                                            >
                                                <Wallet className="w-4 h-4" />
                                                Assets
                                            </button>
                                            <button
                                                onClick={() => setActiveWalletTab('defi')}
                                                className={`flex items-center gap-2 flex-1 p-2 text-sm transition-colors ${activeWalletTab === 'defi'
                                                    ? 'bg-white/10 font-medium'
                                                    : 'hover:bg-white/5'
                                                    }`}
                                            >
                                                <Landmark className="w-4 h-4" />
                                                DeFi
                                            </button>
                                        </div>

                                        {/* Assets List */}
                                        <div className="flex-1 overflow-y-auto ai-chat-scrollbar">
                                            <div className="p-1 space-y-2">
                                                {activeWalletTab === 'assets' ? (
                                                    // Assets Tab
                                                    <div className="space-y-2">
                                                        {
                                                            isLoadingBalance ?
                                                                <Skeleton startColor="#444" endColor="#1d2837"
                                                                    w={'100%'} h={'4rem'}></Skeleton>
                                                                : tokenBalances.map((position) => (
                                                                    <button
                                                                        key={position.chain + position.symbol}
                                                                        className="flex w-full items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            <TokenChainIcon src={position.logo}
                                                                                alt={position.name} size={"lg"}
                                                                                chainId={Number(position.chain)} />
                                                                            <div
                                                                                className='flex flex-col justify-start items-start'>
                                                                                <div
                                                                                    className="font-medium">{position.symbol}</div>
                                                                                <div className="text-sm text-white/60">
                                                                                    {`${formatNumberByFrac(position.balance)} ${position.symbol}`}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <div>{formatUsdValue(position.usdValue)}</div>
                                                                            <PNLPercent
                                                                                pnlPercent={position.usdPrice24hrUsdChange * 100 / position.usdPrice} />
                                                                        </div>
                                                                    </button>
                                                                ))
                                                        }
                                                    </div>
                                                ) : (
                                                    // DeFi Tab
                                                    defiPositions.map((position) => (
                                                        <div
                                                            key={position.id}
                                                            className="flex items-center justify-between p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <img src={position.protocolLogo} alt={position.protocol}
                                                                    className="w-6 h-6" />
                                                                <div>
                                                                    <div
                                                                        className="font-medium text-sm">{position.protocol}</div>
                                                                    <div className="text-xs text-white/60">
                                                                        {position.amount.toLocaleString()} {position.token.symbol}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div
                                                                    className="text-sm">${position.value.toLocaleString()}</div>
                                                                <div className="text-xs text-green-400">
                                                                    {position.apy}% APY
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </DrawerBody>
                            </DrawerContent>
                        </DrawerOverlay>
                    </Drawer>
                </>
            )}
        </>
    );
}