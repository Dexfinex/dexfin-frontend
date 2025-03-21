import React, { useState, useContext, useEffect } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { Widget } from './Widget';
import { ResizableWidget } from './ResizableWidget';
import { AskAnythingWidget } from './widgets/AskAnythingWidget';
import { useStore } from '../store/useStore';

import { Web3AuthContext } from '../providers/Web3AuthContext';
import * as Icons from 'lucide-react';

export const Workspace: React.FC = () => {
  const { widgets, updateWidget, widgetVisibility, isTopbarVisible, isTopbarBottom,
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
    setIsRewardsOpen, } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isConnected, login } = useContext(Web3AuthContext);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
            login();
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


  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const widget = widgets.find(w => w.id === active.id);

    if (widget) {
      updateWidget(widget.id, {
        position: {
          x: widget.position.x + delta.x,
          y: widget.position.y + delta.y,
        },
      });
    }
  };

  // Filter widgets based on visibility settings
  const visibleWidgets = widgets.filter(widget => widgetVisibility[widget.type]);

  return (
    <div className={`fixed inset-0 ${isTopbarVisible ? (isTopbarBottom ? 'pb-12' : 'pt-12') : ''} transition-all duration-300`}>
      <div className="relative w-full h-full p-6">
        {isMobile ? (
          // Mobile Grid Layout
          <div className="p-4">
            <div className="grid grid-cols-3 gap-3">
              {menuItems.map((item) => {
                const IconComponent = Icons[item.icon as keyof typeof Icons];
                return (
                  <button
                    key={item.id}
                    className="flex flex-col glass items-center text-center p-2 rounded-lg hover:bg-white/10 transition-colors"
                    onClick={() => handleMenuItemClick(item.id)}
                  >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mb-1">
                      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                      {/* @ts-expect-error */}
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="text-xs mt-1">{item.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <AskAnythingWidget />
            </div>
          </div>
        ) : (
          <DndContext onDragEnd={handleDragEnd}>
            {visibleWidgets.map((widget) => (
              <ResizableWidget
                key={widget.id}
                id={widget.id}
                type={widget.type}
                position={widget.position}
                size={widget.size}
              />
            ))}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <AskAnythingWidget />
            </div>
          </DndContext>
        )}

      </div>
    </div>
  );
};