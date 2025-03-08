import React from 'react';
import * as Icons from 'lucide-react';
import { useStore } from '../store/useStore';

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

  // Filter out social and rewards items, even if they're starred
  const starredItems = menuItems.filter((item) =>
    item.isStarred &&
    item.id !== 'social' &&
    item.id !== 'rewards'
  );

  const handleItemClick = (itemId: string) => {
    console.log(itemId)
    if (itemId === 'ai') {
      setIsAIAgentOpen(true);
    } else if (itemId === 'swap') {
      setIsSwapOpen(true);
    } else if (itemId === 'defi') {
      setIsDefiOpen(true);
    } else if (itemId === 'dashboard') {
      setIsDashboardOpen(true);
    } else if (itemId === 'market-data') {
      setIsMarketDataOpen(true);
    } else if (itemId === 'chat') {
      setIsChatOpen(true);
    } else if (itemId === 'cart') {
      setIsCartOpen(true);
    } else if (itemId === 'games') {
      setIsGamesOpen(true);
    }
    else if (itemId === 'trade') {
      setTradeOpen(true);
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