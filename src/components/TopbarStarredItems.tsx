import React, { useContext } from 'react';
import * as Icons from 'lucide-react';
import { useStore } from '../store/useStore';
import { Web3AuthContext } from '../providers/Web3AuthContext';

export const TopbarStarredItems: React.FC = () => {
  const {
    menuItems,
    setIsAIAgentOpen,
    setIsSwapOpen,
    setIsDefiOpen,
    setIsDashboardOpen,
    setIsMarketDataOpen,
    setIsChatOpen,
    setIsCartOpen,
    setIsSocialFeedOpen,
    setIsGamesOpen,
    setTradeOpen,
    setIsRewardsOpen
  } = useStore();

  const { isConnected } = useContext(Web3AuthContext);

  // If user is not connected, don't show any starred items
  if (!isConnected) return null;

  // Filter out social and rewards items, even if they're starred
  const starredItems = menuItems.filter((item) =>
    item.isStarred &&
    item.id !== 'social' &&
    item.id !== 'rewards'
  );

  const handleItemClick = (itemId: string) => {
    switch (itemId) {
      case 'ai':
        setIsAIAgentOpen(true);
        break;
      case 'swap':
        setIsSwapOpen(true);
        break;
      case 'defi':
        setIsDefiOpen(true);
        break;
      case 'dashboard':
        setIsDashboardOpen(true);
        break;
      case 'market-data':
        setIsMarketDataOpen(true);
        break;
      case 'chat':
        setIsChatOpen(true);
        break;
      case 'cart':
        setIsCartOpen(true);
        break;
      case 'games':
        setIsGamesOpen(true);
        break;
      case 'trade':
        setTradeOpen(true);
        break;
    }
  };

  if (starredItems.length === 0) return null;

  return (
    <div className="flex-1 flex items-center justify-center gap-2">
      {starredItems.map((item) => {
        const IconComponent = Icons[item.icon as keyof typeof Icons];
        return (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-lg transition-colors text-sm"
          >
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/*@ts-expect-error*/}
            <IconComponent className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};