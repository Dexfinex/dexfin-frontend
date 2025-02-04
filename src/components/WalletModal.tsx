import React, { useState, useContext } from 'react';
import { X, Maximize2, Minimize2, ArrowDown, CreditCard, Send, Wallet, TrendingUp, LayoutGrid, History, Landmark, ExternalLink, Clock } from 'lucide-react';
import { SendDrawer } from './wallet/SendDrawer';
import { ReceiveDrawer } from './wallet/ReceiveDrawer';
import { BuyDrawer } from './wallet/BuyDrawer';
import { mockTransactions, mockDeFiPositions, mockDeFiStats, formatTransactionAmount, formatUsdValue, formatApy, getHealthFactorColor, getTransactionStatusColor } from '../lib/wallet';
import { TransactionType } from '../types/wallet';
import { Web3AuthContext } from "../providers/Web3AuthContext.tsx";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'assets' | 'activity' | 'defi'>('assets');
  const [showSendDrawer, setShowSendDrawer] = useState(false);
  const [showReceiveDrawer, setShowReceiveDrawer] = useState(false);
  const [showBuyDrawer, setShowBuyDrawer] = useState(false);

  const { address } = useContext(Web3AuthContext);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderAssets = () => (
    <div className="space-y-4">
      {/* Total Balance */}
      <div className="bg-white/5 rounded-xl p-4">
        <div className="text-sm text-white/60">Total Balance</div>
        <div className="text-3xl font-bold mt-1">{formatUsdValue(mockDeFiStats.netWorth)}</div>
        <div className="flex items-center gap-1 mt-1 text-green-400">
          <TrendingUp className="w-4 h-4" />
          <span>+1.57% TODAY</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setShowSendDrawer(true)}
          className="flex items-center justify-center gap-2 p-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors"
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
          onClick={() => setShowBuyDrawer(true)}
          className="flex items-center justify-center gap-2 p-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors"
        >
          <CreditCard className="w-5 h-5" />
          <span>Buy</span>
        </button>
      </div>

      {/* Assets List */}
      <div className="space-y-2">
        {mockDeFiPositions.map((position) => (
          <div
            key={position.id}
            className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <img src={position.token.logo} alt={position.token.symbol} className="w-8 h-8" />
              <div>
                <div className="font-medium">{position.token.symbol}</div>
                <div className="text-sm text-white/60">
                  {formatTransactionAmount(position.amount, position.token.symbol)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div>{formatUsdValue(position.value)}</div>
              <div className="text-sm text-green-400">
                {formatApy(position.apy)} APY
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-3">
      {mockTransactions.map((tx) => (
        <div
          key={tx.id}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tx.type === TransactionType.RECEIVE ? 'bg-green-500/20 text-green-400' :
                  tx.type === TransactionType.SEND ? 'bg-red-500/20 text-red-400' :
                    'bg-blue-500/20 text-blue-400'
                }`}>
                {tx.type}
              </span>
              <span className="text-sm text-white/60">
                {tx.timestamp.toLocaleString()}
              </span>
            </div>
            <a
              href={`https://etherscan.io/tx/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:bg-white/10 rounded-md transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-white/40" />
            </a>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {tx.type === TransactionType.SWAP ? (
                <div className="flex items-center gap-1">
                  <img src={tx.fromToken?.logo} alt={tx.fromToken?.symbol} className="w-6 h-6" />
                  <ArrowDown className="w-4 h-4 text-white/40 rotate-[-90deg]" />
                  <img src={tx.toToken?.logo} alt={tx.toToken?.symbol} className="w-6 h-6" />
                </div>
              ) : (
                <img src={tx.token?.logo} alt={tx.token?.symbol} className="w-6 h-6" />
              )}
              <div>
                {tx.type === TransactionType.SWAP ? (
                  <div className="text-sm">
                    {formatTransactionAmount(tx.fromAmount || 0, tx.fromToken?.symbol || '')} →{' '}
                    {formatTransactionAmount(Math.abs(tx.toAmount || 0), tx.toToken?.symbol || '')}
                  </div>
                ) : (
                  <div className="text-sm">
                    {formatTransactionAmount(tx.amount, tx.token?.symbol || '')}
                  </div>
                )}
                {tx.value && (
                  <div className="text-sm text-white/60">
                    {formatUsdValue(tx.value)}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className={getTransactionStatusColor(tx.status)}>
                {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
              </div>
              <div className="text-sm text-white/60">
                Fee: {formatUsdValue(tx.fee)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDeFi = () => (
    <div className="space-y-6">
      {/* DeFi Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/5 rounded-xl p-4">
          <div className="text-sm text-white/60">Total Value Locked</div>
          <div className="text-2xl font-bold mt-1">
            {formatUsdValue(mockDeFiStats.totalValueLocked)}
          </div>
          <div className="text-sm text-white/60 mt-1">
            {mockDeFiStats.distribution.lending}% Lending
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <div className="text-sm text-white/60">Daily Yield</div>
          <div className="text-2xl font-bold mt-1">
            {formatUsdValue(mockDeFiStats.dailyYield)}
          </div>
          <div className="text-sm text-green-400 mt-1">
            {formatApy(mockDeFiStats.averageApy)} APY
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <div className="text-sm text-white/60">Risk Level</div>
          <div className="text-2xl font-bold mt-1">
            {mockDeFiStats.riskLevel}
          </div>
          <div className="text-sm text-white/60 mt-1">
            {mockDeFiStats.distribution.borrowing}% Borrowed
          </div>
        </div>
      </div>

      {/* DeFi Positions */}
      <div className="space-y-3">
        {mockDeFiPositions.map((position) => (
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
                  <div className="font-medium">{position.protocol}</div>
                  <div className="text-sm text-white/60">{position.type}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-medium">
                  {formatUsdValue(position.value)}
                </div>
                <div className="text-sm text-green-400">
                  {formatApy(position.apy)} APY
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-white/60">Amount:</span>{' '}
                {formatTransactionAmount(position.amount, position.token.symbol)}
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
  );

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div
          className={`relative glass border border-white/10 shadow-lg transition-all duration-300 ease-in-out ${isFullscreen
              ? 'w-full h-full rounded-none'
              : 'w-[90%] h-[90%] rounded-xl'
            }`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Wallet</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleFullscreen}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 overflow-y-auto ai-chat-scrollbar">
              {selectedTab === 'assets' && renderAssets()}
              {selectedTab === 'activity' && renderActivity()}
              {selectedTab === 'defi' && renderDeFi()}
            </div>

            {/* Bottom Tab Bar */}
            <div className="flex items-center justify-around p-2 border-t border-white/10">
              <button
                onClick={() => setSelectedTab('assets')}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${selectedTab === 'assets' ? 'text-blue-400' : 'text-white/60 hover:text-white/80'
                  }`}
              >
                <LayoutGrid className="w-5 h-5" />
                <span className="text-xs">Assets</span>
              </button>
              <button
                onClick={() => setSelectedTab('activity')}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${selectedTab === 'activity' ? 'text-blue-400' : 'text-white/60 hover:text-white/80'
                  }`}
              >
                <History className="w-5 h-5" />
                <span className="text-xs">Activity</span>
              </button>
              <button
                onClick={() => setSelectedTab('defi')}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${selectedTab === 'defi' ? 'text-blue-400' : 'text-white/60 hover:text-white/80'
                  }`}
              >
                <Landmark className="w-5 h-5" />
                <span className="text-xs">DeFi</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Drawers */}
      <SendDrawer
        isOpen={showSendDrawer}
        onClose={() => setShowSendDrawer(false)}
        assets={mockDeFiPositions.map(p => ({
          id: p.id,
          name: p.token.symbol,
          address: p.address,
          symbol: p.token.symbol,
          amount: p.amount,
          logo: p.token.logo
        }))}
      />

      <ReceiveDrawer
        isOpen={showReceiveDrawer}
        onClose={() => setShowReceiveDrawer(false)}
        assets={mockDeFiPositions.map(p => ({
          id: p.id,
          name: p.token.symbol,
          symbol: p.token.symbol,
          logo: p.token.logo
        }))}
        walletAddress={address}
      />

      <BuyDrawer
        isOpen={showBuyDrawer}
        onClose={() => setShowBuyDrawer(false)}
        assets={mockDeFiPositions.map(p => ({
          id: p.id,
          name: p.token.symbol,
          symbol: p.token.symbol,
          logo: p.token.logo
        }))}
      />
    </>
  );
};