import React, { useState } from 'react';
import { BarChart2, Bell, Maximize2, MessageSquare, Minimize2, Search, TrendingUp, X } from 'lucide-react';
import { LeaderboardContent } from './social/components/LeaderboardContent';
import { FeedContent } from './social/components/FeedContent';
import { RallyingContent } from './social/components/RallyingContent';
import { ExploreContent } from './social/components/ExploreContent';
import { mockMints, mockRallyingTokens, mockSwaps, mockTraders, mockVirtuals } from './social/data/mockData';
import { useStore } from '../store/useStore';

interface SocialFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SocialFeedModal: React.FC<SocialFeedModalProps> = ({ isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState<'feed' | 'rallying' | 'explore' | 'notifications' | 'leaderboard'>('feed');
  const [selectedActionType, setSelectedActionType] = useState<'all' | 'swaps' | 'mints' | 'virtuals'>('all');
  const [followedTraders, setFollowedTraders] = useState<string[]>([]);
  const setIsSwapOpen = useStore((state) => state.setIsSwapOpen);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleFollow = (traderId: string) => {
    setFollowedTraders(prev =>
      prev.includes(traderId)
        ? prev.filter(id => id !== traderId)
        : [...prev, traderId]
    );
  };

  const handleTokenClick = (trade: any) => {
    if (trade.amount > 0) {
      onClose();
      setTimeout(() => {
        setIsSwapOpen(true);
      }, 100);
    }
  };

  const getFilteredTrades = () => {
    switch (selectedActionType) {
      case 'swaps':
        return mockSwaps;
      case 'mints':
        return mockMints;
      case 'virtuals':
        return mockVirtuals;
      default:
        return [...mockSwaps, ...mockMints, ...mockVirtuals].sort((a, b) => {
          const aTime = a.timestamp.includes('now') ? 0 : parseInt(a.timestamp);
          const bTime = b.timestamp.includes('now') ? 0 : parseInt(b.timestamp);
          return aTime - bTime;
        });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative glass border border-white/10 shadow-lg transition-all duration-300 ease-in-out flex ${isFullscreen
          ? 'w-full h-full rounded-none'
          : 'w-[90%] h-[90%] rounded-xl'
          }`}
      >
        {/* Glass Effect Overlay - Coming Soon Message */}
        <div className='absolute top-0 right-0 bottom-0 left-0 inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-10 rounded-xl'>
          <button className="py-1.5 px-3 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg font-medium text-sm">
            Coming Soon
          </button>
        </div>
        {/* Close button - positioned absolutely in the top-right corner for better visibility */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-white/20 rounded-lg transition-colors z-20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        {/* Left Navigation */}
        <div className="w-64 border-r border-white/10">
          <div className="p-4 space-y-2">
            <button
              onClick={() => setActiveNavItem('feed')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeNavItem === 'feed' ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Feed</span>
            </button>
            <button
              onClick={() => setActiveNavItem('rallying')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeNavItem === 'rallying' ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>Rallying</span>
            </button>
            <button
              onClick={() => setActiveNavItem('explore')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeNavItem === 'explore' ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
            >
              <Search className="w-5 h-5" />
              <span>Explore</span>
            </button>
            <button
              onClick={() => setActiveNavItem('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeNavItem === 'notifications' ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
            >
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </button>
            <button
              onClick={() => setActiveNavItem('leaderboard')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeNavItem === 'leaderboard' ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
            >
              <BarChart2 className="w-5 h-5" />
              <span>Leaderboard</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-xl font-semibold capitalize">{activeNavItem}</h2>
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
          <div className="flex-1 overflow-y-auto ai-chat-scrollbar">
            {activeNavItem === 'feed' && (
              <FeedContent
                selectedActionType={selectedActionType}
                onActionTypeChange={setSelectedActionType}
                trades={getFilteredTrades()}
                onTokenClick={handleTokenClick}
              />
            )}
            {activeNavItem === 'rallying' && (
              <RallyingContent tokens={mockRallyingTokens} />
            )}
            {activeNavItem === 'explore' && (
              <ExploreContent
                traders={mockTraders}
                followedTraders={followedTraders}
                onFollow={handleFollow}
              />
            )}
            {activeNavItem === 'notifications' && (
              <div className="max-w-3xl mx-auto p-4">
                <div className="text-center text-white/60">
                  No new notifications
                </div>
              </div>
            )}
            {activeNavItem === 'leaderboard' && <LeaderboardContent />}
          </div>
        </div>
      </div>
    </div>
  );
};
