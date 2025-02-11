import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Landmark,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { WalletTab } from '../../types/agent.type.ts';
import { mockDeFiPositions } from '../../lib/wallet.ts';

interface WalletPanelProps {
  isWalletPanelOpen: boolean;
  setIsWalletPanelOpen: (value: boolean) => void;
}


export function WalletPanel({ isWalletPanelOpen, setIsWalletPanelOpen }: WalletPanelProps) {

  const [activeWalletTab, setActiveWalletTab] = useState<WalletTab>('assets');
  // Filter positions correctly
  const assetPositions = mockDeFiPositions.filter(p => !p.type || p.type === 'STAKING');
  const defiPositions = mockDeFiPositions.filter(p => p.type === 'LENDING');

  return (
    <div className={`right-0 top-[73px] bottom-[89px] border-l border-white/10 transition-all duration-300 ${isWalletPanelOpen ? 'w-80' : 'w-0'
      } overflow-hidden`}>
      <div className="h-full w-80 flex flex-col glass">
        {/* Total Balance */}
        <div className="p-4 border-b border-white/10">
          <div className="text-sm text-white/60">Total Balance</div>
          <div className="text-2xl font-bold mt-1">$15,650.32</div>
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
              assetPositions.map((position) => (
                <div
                  key={position.id}
                  className="flex items-center justify-between p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <img src={position.token.logo} alt={position.token.symbol} className="w-6 h-6" />
                    <div>
                      <div className="font-medium text-sm">{position.token.symbol}</div>
                      <div className="text-xs text-white/60">
                        {position.amount.toLocaleString()} {position.token.symbol}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">${position.value.toLocaleString()}</div>
                    {position.type === 'STAKING' && (
                      <div className="text-xs text-green-400">
                        {position.apy}% APY
                      </div>
                    )}
                  </div>
                </div>
              ))
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
  );
};