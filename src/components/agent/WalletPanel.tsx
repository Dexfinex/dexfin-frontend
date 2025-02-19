import { useState, useEffect, useContext } from 'react';
import { useMediaQuery, Skeleton, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure } from '@chakra-ui/react';

import {
  ChevronLeft,
  ChevronRight,
  Landmark,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { WalletTab } from '../../types/agent.type.ts';
import { mockDeFiPositions, formatUsdValue } from '../../lib/wallet.ts';
import useTokenBalanceStore from '../../store/useTokenBalanceStore.ts';
import { useEvmWalletBalance } from '../../hooks/useBalance.tsx';
import { TokenChainIcon } from './../swap/components/TokenIcon.tsx';
import { Web3AuthContext } from "../../providers/Web3AuthContext.tsx";
import { formatNumberByFrac } from '../../utils/common.util.ts';

interface WalletPanelProps {
  isWalletPanelOpen: boolean;
  setIsWalletPanelOpen: (value: boolean) => void;
}

export function WalletPanel({ isWalletPanelOpen, setIsWalletPanelOpen }: WalletPanelProps) {
  const { isLoading: isLoadingBalance } = useEvmWalletBalance();
  const { totalUsdValue, tokenBalances } = useTokenBalanceStore();
  const [activeWalletTab, setActiveWalletTab] = useState<WalletTab>('assets');
  const [isLargerThan962] = useMediaQuery('(min-width: 962px)');
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Filter positions correctly
  const defiPositions = mockDeFiPositions.filter(p => p.type === 'LENDING');
  const { chainId } = useContext(Web3AuthContext);
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
        <div className={`right-0 top-[73px] bottom-[89px] border-l border-white/10 transition-all duration-300 ${isWalletPanelOpen ? 'w-80' : 'w-0'
          } overflow-hidden`}>
          <div className="h-full  w-80 flex flex-col glass">
            {/* Total Balance */}
            <div className="p-4 border-b border-white/10">
              <div className="text-sm text-white/60">Total Balance</div>
              <div className="text-2xl font-bold mt-1">
                {isLoadingBalance ? <Skeleton startColor="#444" endColor="#1d2837" w={'5rem'} h={'2rem'}></Skeleton> : formatUsdValue(totalUsdValue)}
              </div>

              <div className="flex items-center gap-1 mt-1 text-green-400 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+1.57% TODAY</span>
              </div>
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
              <div className="p-4 space-y-2">
                {activeWalletTab === 'assets' ? (
                  // Assets Tab
                  <div className="space-y-2">
                    {
                      isLoadingBalance ?
                        <Skeleton startColor="#444" endColor="#1d2837" w={'100%'} h={'4rem'}></Skeleton>
                        : tokenBalances.map((position) => (
                          <button
                            key={position.chain + position.symbol}
                            className="flex w-full items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
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
                        <img src={position.protocolLogo} alt={position.protocol} className="w-6 h-6" />
                        <div>
                          <div className="font-medium text-sm">{position.protocol}</div>
                          <div className="text-xs text-white/60">
                            {position.amount.toLocaleString()} {position.token.symbol}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">${position.value.toLocaleString()}</div>
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
                        {isLoadingBalance ? <Skeleton startColor="#444" endColor="#1d2837" w={'5rem'} h={'2rem'}></Skeleton> : formatUsdValue(totalUsdValue)}
                      </div>

                      <div className="flex items-center gap-1 mt-1 text-green-400 text-sm">
                        <TrendingUp className="w-4 h-4" />
                        <span>+1.57% TODAY</span>
                      </div>
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
                      <div className="p-4 space-y-2">
                        {activeWalletTab === 'assets' ? (
                          // Assets Tab
                          <div className="space-y-2">
                            {
                              isLoadingBalance ?
                                <Skeleton startColor="#444" endColor="#1d2837" w={'100%'} h={'4rem'}></Skeleton>
                                : tokenBalances.map((position) => (
                                  <button
                                    key={position.chain + position.symbol}
                                    className="flex w-full items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
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
                                <img src={position.protocolLogo} alt={position.protocol} className="w-6 h-6" />
                                <div>
                                  <div className="font-medium text-sm">{position.protocol}</div>
                                  <div className="text-xs text-white/60">
                                    {position.amount.toLocaleString()} {position.token.symbol}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm">${position.value.toLocaleString()}</div>
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