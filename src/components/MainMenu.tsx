import React, { useState, useContext } from 'react';
import * as Icons from 'lucide-react';
import { useStore } from '../store/useStore';
import { Web3AuthContext } from '../providers/Web3AuthContext';

export const MainMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    menuItems,
    toggleStarMenuItem,
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
    setIsRewardsOpen,
    isTopbarBottom
  } = useStore();

  const { isConnected, login } = useContext(Web3AuthContext);

  const handleMenuItemClick = (itemId: string) => {
    // Close menu first
    setIsOpen(false);

    // Use setTimeout to ensure menu is closed before opening modal
    setTimeout(() => {
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
          if (isConnected) {
            setIsChatOpen(true);
          } else {
            login()
          }
          break;
        case 'cart':
          setIsCartOpen(true);
          break;
        case 'social':
          setIsSocialFeedOpen(true);
          break;
        case 'games':
          setIsGamesOpen(true);
          break;
        case 'trade':
          setTradeOpen(true);
          break;
        case 'rewards':
          setIsRewardsOpen(true);
          break;
      }
    }, 0);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
      >
        <Icons.AlignLeft className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute ${isTopbarBottom ? 'bottom-full mb-2' : 'top-full mt-2'} left-0 w-64 rounded-xl glass border border-white/10 shadow-lg z-50`}>
            <div className="py-2">
              {menuItems.map((item) => {
                const IconComponent = Icons[item.icon as keyof typeof Icons];
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-colors group cursor-pointer"
                    onClick={() => handleMenuItemClick(item.id)}
                  >
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/* @ts-expect-error */}
                    <IconComponent className="w-4 h-4" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStarMenuItem(item.id);
                      }}
                      className="p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <Icons.Star
                        className={`w-3.5 h-3.5 transition-colors ${item.isStarred
                          ? 'text-yellow-400'
                          : 'text-white/40  group-hover:opacity-100'
                          }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};