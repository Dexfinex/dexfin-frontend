import { create } from 'zustand';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  isStarred: boolean;
}

interface WidgetPosition {
  x: number;
  y: number;
}

interface WidgetSize {
  width: number;
  height: number;
}

interface Widget {
  id: string;
  type: string;
  position: WidgetPosition;
  size: WidgetSize;
}

export interface Wallpaper {
  id: string;
  name: string;
  type: 'CITY' | 'NATURE' | 'ABSTRACT';
  thumbnail: string;
  url: string;
}

const wallpapersList: Wallpaper[] = [
  {
    id: 'city-1',
    name: 'Night City',
    type: 'CITY',
    thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&q=80',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80'
  },
  {
    id: 'city-2',
    name: 'Downtown',
    type: 'CITY',
    thumbnail: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80',
    url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80'
  },
  {
    id: 'nature-1',
    name: 'Mountains',
    type: 'NATURE',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80'
  },
  {
    id: 'nature-2',
    name: 'Forest',
    type: 'NATURE',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80'
  },
  {
    id: 'abstract-1',
    name: 'Waves',
    type: 'ABSTRACT',
    thumbnail: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&q=80',
    url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80'
  },
  {
    id: 'abstract-2',
    name: 'Gradient',
    type: 'ABSTRACT',
    thumbnail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80'
  }
];

interface RewardsState {
  currentTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  xp: number;
  xpToNextLevel: number;
  weeklyXP: number[];
  badges: {
    id: string;
    name: string;
    description: string;
    image: string;
    earnedDate?: string;
    isFlashBadge?: boolean;
  }[];
  activeChallenges: {
    id: string;
    title: string;
    description: string;
    xpReward: number;
    progress: number;
    total: number;
    endsIn: string;
  }[];
  perks: {
    id: string;
    name: string;
    description: string;
    tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
    isActive: boolean;
  }[];
}

interface StoreState {
  // Menu Items
  menuItems: MenuItem[];
  toggleStarMenuItem: (id: string) => void;

  // Modal States
  isSignupModalOpen: boolean;
  setIsSignupModalOpen: (isOpen: boolean) => void;
  isSigninModalOpen: boolean;
  setIsSigninModalOpen: (isOpen: boolean) => void;
  isAIAgentOpen: boolean;
  setIsAIAgentOpen: (isOpen: boolean) => void;
  isSwapOpen: boolean;
  setIsSwapOpen: (isOpen: boolean) => void;
  isDefiOpen: boolean;
  setIsDefiOpen: (isOpen: boolean) => void;
  isDashboardOpen: boolean;
  setIsDashboardOpen: (isOpen: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;
  isMarketDataOpen: boolean;
  setIsMarketDataOpen: (isOpen: boolean) => void;
  isChatOpen: boolean;
  setIsChatOpen: (isOpen: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  isSocialFeedOpen: boolean;
  setIsSocialFeedOpen: (isOpen: boolean) => void;
  isGamesOpen: boolean;
  setIsGamesOpen: (isOpen: boolean) => void;
  istrade: boolean;
  setTradeOpen: (isOpen: boolean) => void;

  // Market Data View
  marketDataView: 'overview' | 'market-cap' | 'trending' | 'dex' | 'defi' | 'news' | 'alerts' | 'technical' | 'calendar' | 'feed';
  setMarketDataView: (view: 'overview' | 'market-cap' | 'trending' | 'dex' | 'defi' | 'news' | 'alerts' | 'technical' | 'calendar' | 'feed') => void;

  // Widgets
  widgets: Widget[];
  updateWidget: (id: string, updates: Partial<Widget>) => void;
  widgetVisibility: Record<string, boolean>;
  toggleWidgetVisibility: (type: string) => void;
  resetWidgetVisibility: () => void;

  // Cart
  cartItems: any[];
  addToCart: (item: any) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  // Game Stats
  gameStats: {
    triviaStats: {
      gamesPlayed: number;
      tokensEarned: number;
      highScore: number;
      accuracy: number;
      bestStreak: number;
    };
    arenaStats: {
      battlesPlayed: number;
      tokensEarned: number;
      wins: number;
      winRate: number;
      bestStreak: number;
    };
    totalTokens: number;
  };
  updateGameStats: (stats: Partial<StoreState['gameStats']>) => void;

  // Appearance
  currentWallpaper: Wallpaper;
  setWallpaper: (wallpaper: Wallpaper) => void;

  // Topbar control
  isTopbarVisible: boolean;
  isTopbarBottom: boolean;
  toggleTopbarVisibility: () => void;
  toggleTopbarPosition: () => void;

  // Rewards
  rewards: RewardsState;
  addXP: (amount: number) => void;
  completeBadge: (badgeId: string) => void;
  updateChallengeProgress: (challengeId: string, progress: number) => void;

  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Chat
  chatUser: any;
  setChatUser: (user: any) => void;
}

const useStore = create<StoreState>((set) => ({
  // Menu Items
  menuItems: [
    { id: 'ai', label: 'AI Agent', icon: 'Bot', isStarred: false },
    { id: 'swap', label: 'Swap', icon: 'ArrowLeftRight', isStarred: false },
    { id: 'defi', label: 'DeFi', icon: 'Wallet', isStarred: false },
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', isStarred: false },
    { id: 'market-data', label: 'Market Data', icon: 'LineChart', isStarred: false },
    { id: 'trade', label: 'Trade', icon: 'LineChart', isStarred: false },
    { id: 'chat', label: 'Chat', icon: 'MessageSquare', isStarred: false },
    { id: 'cart', label: 'Cart', icon: 'ShoppingCart', isStarred: false },
    { id: 'social', label: 'Social Feed', icon: 'Users', isStarred: false },
    { id: 'games', label: 'Games', icon: 'Gamepad2', isStarred: false },
    { id: 'rewards', label: 'Rewards', icon: 'Trophy', isStarred: false },
  ],
  toggleStarMenuItem: (id) => set((state) => ({
    menuItems: state.menuItems.map((item) =>
      item.id === id ? { ...item, isStarred: !item.isStarred } : item
    ),
  })),

  // Modal States
  isSignupModalOpen: false,
  setIsSignupModalOpen: (isOpen) => set({ isSignupModalOpen: isOpen }),
  isSigninModalOpen: false,
  setIsSigninModalOpen: (isOpen) => set({ isSigninModalOpen: isOpen }),
  isAIAgentOpen: false,
  setIsAIAgentOpen: (isOpen) => set({ isAIAgentOpen: isOpen }),
  isSwapOpen: false,
  setIsSwapOpen: (isOpen) => set({ isSwapOpen: isOpen }),
  isDefiOpen: false,
  setIsDefiOpen: (isOpen) => set({ isDefiOpen: isOpen }),
  isDashboardOpen: false,
  setIsDashboardOpen: (isOpen) => set({ isDashboardOpen: isOpen }),
  isSettingsOpen: false,
  setIsSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),
  isMarketDataOpen: false,
  setIsMarketDataOpen: (isOpen) => set({ isMarketDataOpen: isOpen }),
  isChatOpen: false,
  setIsChatOpen: (isOpen) => set({ isChatOpen: isOpen }),
  isCartOpen: false,
  setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  isSocialFeedOpen: false,
  setIsSocialFeedOpen: (isOpen) => set({ isSocialFeedOpen: isOpen }),
  isGamesOpen: false,
  setIsGamesOpen: (isOpen) => set({ isGamesOpen: isOpen }),
  istrade: false,
  setTradeOpen: (isOpen) => set({ istrade: isOpen }),

  // Market Data View
  marketDataView: 'overview',
  setMarketDataView: (view) => set({ marketDataView: view }),

  // Widgets
  widgets: [
    {
      id: 'portfolio',
      type: 'Portfolio Overview',
      position: { x: 20, y: 20 },
      size: { width: 360, height: 540 }
    },
    {
      id: 'market-news',
      type: 'Market News',
      position: { x: 400, y: 20 },
      size: { width: 360, height: 360 }
    },
    {
      id: 'market-pulse',
      type: 'Market Pulse',
      position: { x: 20, y: 580 },
      size: { width: 360, height: 486 }
    },
    {
      id: 'fear-greed',
      type: 'Fear & Greed Index',
      position: { x: 400, y: 400 },
      size: { width: 360, height: 270 }
    },
    {
      id: 'quick-swap',
      type: 'Quick Swap',
      position: { x: 780, y: 20 },
      size: { width: 324, height: 315 }
    },
    {
      id: 'price-converter',
      type: 'Price Converter',
      position: { x: 780, y: 355 },
      size: { width: 324, height: 360 }
    },
    {
      id: 'trending',
      type: 'Trending',
      position: { x: 1124, y: 20 },
      size: { width: 360, height: 315 }
    },
    {
      id: 'twitter',
      type: 'Twitter Feed',
      position: { x: 1124, y: 355 },
      size: { width: 360, height: 540 }
    },
    {
      id: 'direct-messages',
      type: 'Direct Messages',
      position: { x: 780, y: 735 },
      size: { width: 324, height: 360 }
    }
  ],
  updateWidget: (id, updates) => set((state) => ({
    widgets: state.widgets.map((widget) =>
      widget.id === id ? { ...widget, ...updates } : widget
    ),
  })),
  widgetVisibility: {
    'Portfolio Overview': true,
    'Market News': true,
    'Market Pulse': true,
    'Fear & Greed Index': true,
    'Quick Swap': true,
    'Price Converter': true,
    'Trending': true,
    'Ask Anything': true,
    'Twitter Feed': true,
    'Direct Messages': true
  },
  toggleWidgetVisibility: (type) => set((state) => ({
    widgetVisibility: {
      ...state.widgetVisibility,
      [type]: !state.widgetVisibility[type]
    }
  })),
  resetWidgetVisibility: () => set((state) => ({
    widgetVisibility: Object.keys(state.widgetVisibility).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {})
  })),

  // Cart
  cartItems: [],
  addToCart: (item) => set((state) => {
    const existingItem = state.cartItems.find(i => i.id === item.id);
    if (existingItem) {
      return {
        cartItems: state.cartItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      };
    }
    return {
      cartItems: [...state.cartItems, { ...item, quantity: 1 }]
    };
  }),
  removeFromCart: (id) => set((state) => ({
    cartItems: state.cartItems.filter(item => item.id !== id)
  })),
  updateQuantity: (id, quantity) => set((state) => ({
    cartItems: state.cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
    )
  })),
  clearCart: () => set({ cartItems: [] }),

  // Game Stats
  gameStats: {
    triviaStats: {
      gamesPlayed: 15,
      tokensEarned: 1850,
      highScore: 9,
      accuracy: 78,
      bestStreak: 5
    },
    arenaStats: {
      battlesPlayed: 12,
      tokensEarned: 1400,
      wins: 8,
      winRate: 66.7,
      bestStreak: 3
    },
    totalTokens: 3250
  },
  updateGameStats: (stats) => set((state) => ({
    gameStats: {
      ...state.gameStats,
      ...stats
    }
  })),

  // Appearance
  currentWallpaper: wallpapersList[0],
  setWallpaper: (wallpaper) => set({ currentWallpaper: wallpaper }),

  // Topbar control
  isTopbarVisible: true,
  isTopbarBottom: false,
  toggleTopbarVisibility: () => set(state => ({ isTopbarVisible: !state.isTopbarVisible })),
  toggleTopbarPosition: () => set(state => ({ isTopbarBottom: !state.isTopbarBottom })),

  // Rewards
  rewards: {
    currentTier: 'Bronze',
    xp: 15000,
    xpToNextLevel: 10000,
    weeklyXP: [1200, 800, 1500, 950, 1100, 750, 1400],
    badges: [
      {
        id: 'first-trade',
        name: 'First Trade',
        description: 'Complete your first trade',
        image: 'https://api.dicebear.com/7.x/shapes/svg?seed=trade',
        earnedDate: '2024-03-15'
      },
      {
        id: 'early-bird',
        name: 'Early Bird',
        description: 'Join during beta phase',
        image: 'https://api.dicebear.com/7.x/shapes/svg?seed=bird',
        earnedDate: '2024-03-10'
      },
      {
        id: 'social-butterfly',
        name: 'Social Butterfly',
        description: 'Connect with 10 traders',
        image: 'https://api.dicebear.com/7.x/shapes/svg?seed=social',
        earnedDate: '2024-03-18'
      },
      {
        id: 'diamond-hands',
        name: 'Diamond Hands',
        description: 'Hold assets for 30 days',
        image: 'https://api.dicebear.com/7.x/shapes/svg?seed=diamond'
      },
      {
        id: 'flash-multiply',
        name: 'Multiply It',
        description: 'Play Multiplier game',
        image: 'https://api.dicebear.com/7.x/shapes/svg?seed=multiply',
        isFlashBadge: true
      }
    ],
    activeChallenges: [
      {
        id: 'weekly-trades',
        title: 'Trading Master',
        description: 'Complete 10 trades this week',
        xpReward: 500,
        progress: 7,
        total: 10,
        endsIn: '2d 12h'
      },
      {
        id: 'social-engagement',
        title: 'Community Leader',
        description: 'Engage with 5 community posts',
        xpReward: 300,
        progress: 3,
        total: 5,
        endsIn: '3d 8h'
      },
      {
        id: 'defi-explorer',
        title: 'DeFi Explorer',
        description: 'Try 3 different DeFi protocols',
        xpReward: 800,
        progress: 1,
        total: 3,
        endsIn: '5d'
      }
    ],
    perks: [
      {
        id: 'reduced-fees',
        name: 'Reduced Trading Fees',
        description: '25% off trading fees',
        tier: 'Bronze',
        isActive: true
      },
      {
        id: 'premium-charts',
        name: 'Premium Charts',
        description: 'Access to advanced charting',
        tier: 'Silver',
        isActive: false
      },
      {
        id: 'priority-support',
        name: 'Priority Support',
        description: '24/7 priority customer support',
        tier: 'Gold',
        isActive: false
      },
      {
        id: 'exclusive-events',
        name: 'Exclusive Events',
        description: 'Access to exclusive events',
        tier: 'Platinum',
        isActive: false
      },
      {
        id: 'custom-badge',
        name: 'Custom Badge',
        description: 'Create your own badge',
        tier: 'Diamond',
        isActive: false
      }
    ]
  },

  addXP: (amount) => set((state) => ({
    rewards: {
      ...state.rewards,
      xp: state.rewards.xp + amount,
      weeklyXP: [
        ...state.rewards.weeklyXP.slice(1),
        state.rewards.weeklyXP[state.rewards.weeklyXP.length - 1] + amount
      ]
    }
  })),

  completeBadge: (badgeId) => set((state) => ({
    rewards: {
      ...state.rewards,
      badges: state.rewards.badges.map(badge =>
        badge.id === badgeId
          ? { ...badge, earnedDate: new Date().toISOString().split('T')[0] }
          : badge
      )
    }
  })),

  updateChallengeProgress: (challengeId, progress) => set((state) => ({
    rewards: {
      ...state.rewards,
      activeChallenges: state.rewards.activeChallenges.map(challenge =>
        challenge.id === challengeId
          ? { ...challenge, progress: Math.min(progress, challenge.total) }
          : challenge
      )
    }
  })),

  // Theme
  theme: 'dark',
  toggleTheme: () => set(state => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

  chatUser: "",
  setChatUser: (user) => set({chatUser: user})
}));

export { useStore };
export const wallpapers = wallpapersList;