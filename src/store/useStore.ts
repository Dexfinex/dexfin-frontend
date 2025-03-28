import { create } from "zustand";

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
  height: number | string;
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
  type: "CITY" | "NATURE" | "ABSTRACT" | "DROPS";
  thumbnail: string;
  url: string;
}

const wallpapersList: Wallpaper[] = [
  //City
  {
    id: "city-1",
    name: "Night City 1",
    type: "CITY",
    thumbnail:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&q=80",
    url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80",
  },
  {
    id: "city-2",
    name: "Night City 2",
    type: "CITY",
    thumbnail:
      "https://images.unsplash.com/photo-1502754388-a9bce5374fb8?w=400&q=80",
    url: "https://images.unsplash.com/photo-1502754388-a9bce5374fb8?auto=format&fit=crop&q=80",
  },
  {
    id: "city-3",
    name: "Downtown 1",
    type: "CITY",
    thumbnail:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80",
    url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80",
  },
  {
    id: "city-4",
    name: "Downtown 2",
    type: "CITY",
    thumbnail:
      "https://images.unsplash.com/photo-1429667947446-3c93a979b7e0?w=400&q=80",
    url: "https://images.unsplash.com/photo-1429667947446-3c93a979b7e0?auto=format&fit=crop&q=80",
  },
  //Nature
  {
    id: "nature-1",
    name: "Mountains 1",
    type: "NATURE",
    thumbnail:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80",
  },
  {
    id: "nature-2",
    name: "Mountains 2",
    type: "NATURE",
    thumbnail:
      "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=400&q=80",
    url: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?auto=format&fit=crop&q=80",
  },
  {
    id: "nature-3",
    name: "Forest 1",
    type: "NATURE",
    thumbnail:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80",
  },
  {
    id: "nature-4",
    name: "Forest 2",
    type: "NATURE",
    thumbnail:
      "https://images.unsplash.com/photo-1672357867603-f829ed422847?w=400&q=80",
    url: "https://images.unsplash.com/photo-1672357867603-f829ed422847?auto=format&fit=crop&q=80",
  },
  //Abstract
  {
    id: "abstract-1",
    name: "Waves",
    type: "ABSTRACT",
    thumbnail:
      "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&q=80",
    url: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80",
  },
  {
    id: "abstract-2",
    name: "Gradient 1",
    type: "ABSTRACT",
    thumbnail:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
    url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80",
  },
  {
    id: "abstract-3",
    name: "Gradient 2",
    type: "ABSTRACT",
    thumbnail:
      "https://images.unsplash.com/photo-1513715383826-b16aed5d8d54?w=400&q=80",
    url: "https://images.unsplash.com/photo-1513715383826-b16aed5d8d54?auto=format&fit=crop&q=80",
  },
  {
    id: "abstract-4",
    name: "Gradient 3",
    type: "ABSTRACT",
    thumbnail:
      "https://images.unsplash.com/photo-1620121478247-ec786b9be2fa?w=400&q=80",
    url: "https://images.unsplash.com/photo-1620121478247-ec786b9be2fa?auto=format&fit=crop&q=80",
  },
  {
    id: "abstract-5",
    name: "Gradient 4",
    type: "ABSTRACT",
    thumbnail:
      "https://images.unsplash.com/photo-1505778489066-159c5f4a6c0f?w=400&q=80",
    url: "https://images.unsplash.com/photo-1505778489066-159c5f4a6c0f?auto=format&fit=crop&q=80",
  },
  {
    id: "abstract-6",
    name: "Shadow 1",
    type: "ABSTRACT",
    thumbnail:
      "https://images.unsplash.com/photo-1476445704028-a36e0c798192?w=400&q=80",
    url: "https://images.unsplash.com/photo-1476445704028-a36e0c798192?auto=format&fit=crop&q=80",
  },
  {
    id: "abstract-7",
    name: "Shadow 2",
    type: "ABSTRACT",
    thumbnail:
      "https://images.unsplash.com/photo-1643228995868-bf698f67d053?w=400&q=80",
    url: "https://images.unsplash.com/photo-1643228995868-bf698f67d053?auto=format&fit=crop&q=80",
  },
  {
    id: "abstract-8",
    name: "Shadow 1",
    type: "ABSTRACT",
    thumbnail:
      "https://images.unsplash.com/photo-1469719847081-4757697d117a?w=400&q=80",
    url: "https://images.unsplash.com/photo-1469719847081-4757697d117a?auto=format&fit=crop&q=80",
  },

  //Drops
  {
    id: "drops-1",
    name: "Drops1",
    type: "DROPS",
    thumbnail:
      "https://images.unsplash.com/photo-1630387556680-64b279ff42fd?w=400&q=80",
    url: "https://images.unsplash.com/photo-1630387556680-64b279ff42fd?auto=format&fit=crop&q=80",
  },
  {
    id: "drops-2",
    name: "Drops2",
    type: "DROPS",
    thumbnail:
      "https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?w=400&q=80",
    url: "https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?auto=format&fit=crop&q=80",
  },
];

interface RewardsState {
  currentTier: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";
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
    xpAmount: number; // Add this property
    icon: {
      // Add icon property
      icon: string;
      color: string;
    };
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
    tier: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";
    isActive: boolean;
  }[];
  nextXpUpdate: {
    // Add this property
    hours: number;
    minutes: number;
    seconds: number;
    xpAmount: number;
  };
}

interface StoreState {
  // Menu Items
  menuItems: MenuItem[];
  toggleStarMenuItem: (id: string) => void;
  setDefaultStarredItems: () => void;
  saveStarredItems: () => void;
  loadStarredItems: () => void;

  // Modal States
  isSignupModalOpen: boolean;
  setIsSignupModalOpen: (isOpen: boolean) => void;
  isSigninModalOpen: boolean;
  setIsSigninModalOpen: (isOpen: boolean) => void;
  isAIAgentOpen: boolean;
  setIsAIAgentOpen: (isOpen: boolean) => void;
  widgetCommand: string;
  setWidgetCommand: (command: string) => void;
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
  isTradeOpen: boolean;
  setTradeOpen: (isOpen: boolean) => void;
  isRewardsOpen: boolean;
  setIsRewardsOpen: (isOpen: boolean) => void;

  isUsernameModalOpen: boolean;
  setIsUsernameModalOpen: (isOpen: boolean) => void;

  isWalletDrawerOpen: boolean;
  setIsWalletDrawerOpen: (isOpen: boolean) => void;

  username: string;
  setUserName: (username: string) => void;

  // Market Data View
  marketDataView:
  | "overview"
  | "market-cap"
  | "trending"
  | "dex"
  | "defi"
  | "news"
  | "alerts"
  | "technical"
  | "calendar"
  | "feed";
  setMarketDataView: (
    view:
      | "overview"
      | "market-cap"
      | "trending"
      | "dex"
      | "defi"
      | "news"
      | "alerts"
      | "technical"
      | "calendar"
      | "feed"
  ) => void;

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
    huntStats: {
      gamesPlayed: number;
      tokensEarned: number;
      words: number;
      bestScore: number;
      perfectStatus: number;
    };
    totalTokens: number;
  };
  user: {
    id: string;
  } | null;
  updateGameStats: (stats: Partial<StoreState["gameStats"]>) => void;
  setAllGameStats: (tokens: number) => void;

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
  theme: "dark" | "light";
  toggleTheme: () => void;

  // Chat
  chatUser: any;
  setChatUser: (user: any) => void;

  // Chat Message
  receivedMessage: any;
  setReceivedMessage: (message: any) => void;
}

const useStore = create<StoreState>((set, get) => ({
  user: null,
  // Menu Items
  menuItems: [
    { id: "ai", label: "AI Agent", icon: "Bot", isStarred: false },
    { id: "swap", label: "Swap", icon: "ArrowLeftRight", isStarred: false },
    { id: "defi", label: "Earn", icon: "HandCoinsIcon", isStarred: false },
    {
      id: "dashboard",
      label: "Portfolio",
      icon: "LayoutDashboard",
      isStarred: false,
    },
    {
      id: "market-data",
      label: "Market Data",
      icon: "LineChart",
      isStarred: false,
    },
    // { id: 'trade', label: 'Trade', icon: 'LineChart', isStarred: false },
    { id: "chat", label: "Chat", icon: "MessageSquare", isStarred: false },
    { id: "cart", label: "Cart", icon: "ShoppingCart", isStarred: false },
    { id: "social", label: "Social Feed", icon: "Users", isStarred: false },
    { id: "games", label: "Games", icon: "Gamepad2", isStarred: false },
    { id: "rewards", label: "Rewards", icon: "Trophy", isStarred: false },
  ],

  toggleStarMenuItem: (id) =>
    set((state) => {
      const newMenuItems = state.menuItems.map((item) =>
        item.id === id ? { ...item, isStarred: !item.isStarred } : item
      );

      // Save to localStorage after toggling
      localStorage.setItem(
        "starredMenuItems",
        JSON.stringify(
          newMenuItems.filter((item) => item.isStarred).map((item) => item.id)
        )
      );

      return { menuItems: newMenuItems };
    }),

  // Set default starred items when user logs in
  setDefaultStarredItems: () => {
    // First try to load from localStorage
    const savedStarredItems = localStorage.getItem("starredMenuItems");

    if (savedStarredItems) {
      // If we have saved preferences, use those
      const starredIds = JSON.parse(savedStarredItems);

      set((state) => ({
        menuItems: state.menuItems.map((item) => ({
          ...item,
          isStarred: starredIds.includes(item.id),
        })),
      }));
    } else {
      // Otherwise set defaults
      set((state) => ({
        menuItems: state.menuItems.map((item) => ({
          ...item,
          isStarred: [
            "ai",
            "swap",
            "defi",
            "cart",
            "games",
            "dashboard",
            "market-data",
            "chat",
            "rewards",
          ].includes(item.id),
        })),
      }));

      // Save default starred items
      const defaultItems = [
        "ai",
        "swap",
        "defi",
        "cart",
        "games",
        "dashboard",
        "market-data",
        "chat",
        "rewards",
      ];
      localStorage.setItem("starredMenuItems", JSON.stringify(defaultItems));
    }
  },

  // Save starred items to localStorage
  saveStarredItems: () => {
    const { menuItems } = get();
    const starredIds = menuItems
      .filter((item) => item.isStarred)
      .map((item) => item.id);
    localStorage.setItem("starredMenuItems", JSON.stringify(starredIds));
  },

  // Load starred items from localStorage
  loadStarredItems: () => {
    const savedStarredItems = localStorage.getItem("starredMenuItems");
    if (savedStarredItems) {
      const starredIds = JSON.parse(savedStarredItems);

      set((state) => ({
        menuItems: state.menuItems.map((item) => ({
          ...item,
          isStarred: starredIds.includes(item.id),
        })),
      }));
    }
  },

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
  isTradeOpen: false,
  setTradeOpen: (isOpen) => set({ isTradeOpen: isOpen }),
  isUsernameModalOpen: false,
  setIsUsernameModalOpen: (isOpen) => set({ isUsernameModalOpen: isOpen }),
  isRewardsOpen: false,
  setIsRewardsOpen: (isOpen) => set({ isRewardsOpen: isOpen }),
  username: "",
  setUserName: (username: string) => set({ username: username }),
  isWalletDrawerOpen: false,
  setIsWalletDrawerOpen: (isOpen) => set({ isWalletDrawerOpen: isOpen }),

  // Market Data View
  marketDataView: "overview",
  setMarketDataView: (view) => set({ marketDataView: view }),

  widgetCommand: "",
  setWidgetCommand(command) {
    set({ widgetCommand: command });
  },

  // Widgets
  widgets: [
    {
      id: "market-pulse",
      type: "Market Pulse",
      position: { x: 10, y: 20 },
      size: { width: 360, height: 490 },
    },
    {
      id: "fear-greed",
      type: "Fear & Greed Index",
      position: { x: 10, y: 520 },
      size: { width: 360, height: 270 },
    },
    {
      id: "market-news",
      type: "Market News",
      position: { x: 380, y: 20 },
      size: { width: 360, height: 360 },
    },
    {
      id: "twitter",
      type: "Twitter Feed",
      position: { x: 380, y: 390 },
      size: { width: 360, height: 400 },
    },
    {
      id: "direct-messages",
      type: "Direct Messages",
      position: { x: 750, y: 20 },
      size: { width: 360, height: 480 },
    },
    {
      id: "trending",
      type: "Trending",
      position: { x: 750, y: 510 },
      size: { width: 360, height: 300 },
    },
    {
      id: "portfolio",
      type: "Portfolio Overview",
      position: { x: 1120, y: 20 },
      size: { width: 360, height: 500 },
    },
    {
      id: "price-converter",
      type: "Price Converter",
      position: { x: 1120, y: 530 },
      size: { width: 360, height: 280 },
    },
    {
      id: "quick-swap",
      type: "Quick Swap",
      position: { x: 1490, y: 20 },
      size: { width: 400, height: "fit-content" },
    },
  ],
  updateWidget: (id, updates) =>
    set((state) => ({
      widgets: state.widgets.map((widget) =>
        widget.id === id ? { ...widget, ...updates } : widget
      ),
    })),
  widgetVisibility: {
    "Portfolio Overview": true,
    "Market News": true,
    "Market Pulse": true,
    "Fear & Greed Index": true,
    "Quick Swap": true,
    "Price Converter": false,
    Trending: true,
    "Ask Anything": true,
    "Twitter Feed": true,
    "Direct Messages": true,
  },
  toggleWidgetVisibility: (type) =>
    set((state) => ({
      widgetVisibility: {
        ...state.widgetVisibility,
        [type]: !state.widgetVisibility[type],
      },
    })),
  resetWidgetVisibility: () =>
    set((state) => ({
      widgetVisibility: Object.keys(state.widgetVisibility).reduce(
        (acc, key) => ({
          ...acc,
          [key]: true,
        }),
        {}
      ),
    })),

  // Cart
  cartItems: [],
  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cartItems.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          cartItems: state.cartItems.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        cartItems: [...state.cartItems, { ...item, quantity: 1 }],
      };
    }),
  removeFromCart: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
      ),
    })),
  clearCart: () => set({ cartItems: [] }),

  // Game Stats
  gameStats: {
    triviaStats: {
      gamesPlayed: 0,
      tokensEarned: 0,
      highScore: 0,
      accuracy: 0,
      bestStreak: 0,
    },
    arenaStats: {
      battlesPlayed: 0,
      tokensEarned: 0,
      wins: 0,
      winRate: 0,
      bestStreak: 0,
    },
    huntStats: {
      gamesPlayed: 0,
      tokensEarned: 0,
      words: 0,
      bestScore: 0,
      perfectStatus: 0,
    },

    totalTokens: 0,
  },
  updateGameStats: (stats) =>
    set((state) => ({
      gameStats: {
        ...state.gameStats,
        ...stats,
      },
    })),

  setAllGameStats: (data) =>
    set((state) => {
      if (typeof data === "number") {
        return {
          gameStats: {
            ...state.gameStats,
            totalTokens: data,
          },
        };
      }

      return {
        gameStats: {
          ...state.gameStats,
          totalTokens: 0,
        },
      };
    }),

  // Appearance
  currentWallpaper: wallpapersList[0],
  setWallpaper: (wallpaper) => set({ currentWallpaper: wallpaper }),

  // Topbar control
  isTopbarVisible: true,
  isTopbarBottom: false,
  toggleTopbarVisibility: () =>
    set((state) => ({ isTopbarVisible: !state.isTopbarVisible })),
  toggleTopbarPosition: () =>
    set((state) => ({ isTopbarBottom: !state.isTopbarBottom })),

  // Rewards
  rewards: {
    currentTier: "Bronze",
    xp: 0, // Changed from 15000 to 0
    xpToNextLevel: 10000,
    weeklyXP: [0, 0, 0, 0, 0, 0, 0], // Changed from [1200, 800, 1500, 950, 1100, 750, 1400] to all zeros
    badges: [
      {
        id: "first-deposit",
        name: "First Deposit",
        description: "First wallet deposit (min. 50 USDC)",
        image:
          "https://api.dicebear.com/7.x/shapes/svg?seed=deposit&backgroundColor=0891b2",
        icon: {
          icon: "Wallet",
          color: "text-cyan-500",
        },
        xpAmount: 500,
        earnedDate: null, // Changed from '2024-03-15' to null
      },
      {
        id: "first-swap",
        name: "First Swap",
        description: "First token swap (min. 50 USDC)",
        image:
          "https://api.dicebear.com/7.x/shapes/svg?seed=swap&backgroundColor=8b5cf6",
        icon: {
          icon: "ArrowLeftRight",
          color: "text-purple-500",
        },
        xpAmount: 300,
        earnedDate: null, // Changed from '2024-03-16' to null
      },
      {
        id: "daily-login",
        name: "7-Day Streak",
        description: "Log in for 7 consecutive days",
        image:
          "https://api.dicebear.com/7.x/shapes/svg?seed=streak&backgroundColor=059669",
        icon: {
          icon: "Calendar",
          color: "text-emerald-500",
        },
        xpAmount: 1000,
        earnedDate: null, // Changed from '2024-03-18' to null
      },
      {
        id: "first-game",
        name: "Game Master",
        description: "Play your first game",
        image:
          "https://api.dicebear.com/7.x/shapes/svg?seed=game&backgroundColor=db2777",
        icon: {
          icon: "Gamepad2",
          color: "text-pink-500",
        },
        xpAmount: 200,
        earnedDate: null, // Already null
      },
      {
        id: "first-command",
        name: "AI Explorer",
        description: "Use your first DeFi Agent command",
        image:
          "https://api.dicebear.com/7.x/shapes/svg?seed=ai&backgroundColor=6366f1",
        icon: {
          icon: "Bot",
          color: "text-indigo-500",
        },
        xpAmount: 250,
        earnedDate: null, // Already null
      },
      {
        id: "first-alert",
        name: "Alert Pioneer",
        description: "Set up your first market alert",
        image:
          "https://api.dicebear.com/7.x/shapes/svg?seed=alert&backgroundColor=f43f5e",
        icon: {
          icon: "Bell",
          color: "text-rose-500",
        },
        xpAmount: 200,
        earnedDate: null, // Already null
      },
      {
        id: "flash-multiply",
        name: "Trivia Master",
        description: "Play Trivia game",
        image:
          "https://api.dicebear.com/7.x/shapes/svg?seed=multiply&backgroundColor=f59e0b",
        icon: {
          icon: "ArrowLeftRight",
          color: "text-amber-500",
        },
        xpAmount: 150,
        isFlashBadge: true,
      },
    ],
    activeChallenges: [
      // Trading Challenges
      {
        id: "weekly-trades",
        title: "Trading Master",
        description: "Complete 10 trades this week",
        xpReward: 500,
        progress: 0, // Changed from 7 to 0
        total: 10,
        endsIn: "2d 12h",
      },
      {
        id: "trading-volume",
        title: "Volume Champion",
        description: "Reach $10,000 in trading volume",
        xpReward: 750,
        progress: 0, // Changed from 6500 to 0
        total: 10000,
        endsIn: "3d",
      },

      // Game Challenges
      {
        id: "trivia-master",
        title: "Trivia Master",
        description: "Score 8/10 or higher in Crypto Trivia",
        xpReward: 400,
        progress: 0, // Changed from 6 to 0
        total: 8,
        endsIn: "1d 8h",
      },
      {
        id: "arena-warrior",
        title: "Arena Warrior",
        description: "Win 5 battles in Meme Arena",
        xpReward: 600,
        progress: 0, // Changed from 3 to 0
        total: 5,
        endsIn: "2d",
      },

      // AI Agent Challenges
      {
        id: "ai-commands",
        title: "AI Commander",
        description: "Use 5 different AI Agent commands",
        xpReward: 450,
        progress: 0, // Changed from 2 to 0
        total: 5,
        endsIn: "4d",
      },
      {
        id: "voice-master",
        title: "Voice Master",
        description: "Complete 3 voice commands successfully",
        xpReward: 300,
        progress: 0, // Changed from 1 to 0
        total: 3,
        endsIn: "3d",
      },

      // Alert Challenges
      {
        id: "alert-setup",
        title: "Alert Sentinel",
        description: "Set up 3 different types of alerts",
        xpReward: 350,
        progress: 0, // Changed from 1 to 0
        total: 3,
        endsIn: "5d",
      },
      {
        id: "price-alerts",
        title: "Price Guardian",
        description: "Create price alerts for 5 different tokens",
        xpReward: 400,
        progress: 0, // Changed from 2 to 0
        total: 5,
        endsIn: "4d",
      },

      // Social Challenges
      {
        id: "social-engagement",
        title: "Community Leader",
        description: "Engage with 5 community posts",
        xpReward: 300,
        progress: 0, // Changed from 3 to 0
        total: 5,
        endsIn: "3d 8h",
      },
      {
        id: "follow-traders",
        title: "Network Builder",
        description: "Follow 10 top traders",
        xpReward: 250,
        progress: 0, // Changed from 4 to 0
        total: 10,
        endsIn: "2d",
      },

      // DeFi Challenges
      {
        id: "defi-explorer",
        title: "DeFi Explorer",
        description: "Try 3 different DeFi protocols",
        xpReward: 800,
        progress: 0, // Changed from 1 to 0
        total: 3,
        endsIn: "5d",
      },
      {
        id: "yield-seeker",
        title: "Yield Seeker",
        description: "Find and stake in a pool with >5% APY",
        xpReward: 600,
        progress: 0, // Already 0
        total: 1,
        endsIn: "6d",
      },
    ],
    perks: [
      {
        id: "reduced-fees",
        name: "Reduced Trading Fees",
        description: "25% off trading fees",
        tier: "Bronze",
        isActive: true,
      },
      {
        id: "premium-charts",
        name: "Premium Charts",
        description: "Access to advanced charting",
        tier: "Silver",
        isActive: false,
      },
      {
        id: "priority-support",
        name: "Priority Support",
        description: "24/7 priority customer support",
        tier: "Gold",
        isActive: false,
      },
      {
        id: "exclusive-events",
        name: "Exclusive Events",
        description: "Access to exclusive events",
        tier: "Platinum",
        isActive: false,
      },
      {
        id: "custom-badge",
        name: "Custom Badge",
        description: "Create your own badge",
        tier: "Diamond",
        isActive: false,
      },
    ],
    nextXpUpdate: {
      hours: 0,
      minutes: 0,
      seconds: 0,
      xpAmount: 0,
    },
  },

  addXP: (amount) =>
    set((state) => ({
      rewards: {
        ...state.rewards,
        xp: state.rewards.xp + amount,
        weeklyXP: [
          ...state.rewards.weeklyXP.slice(1),
          state.rewards.weeklyXP[state.rewards.weeklyXP.length - 1] + amount,
        ],
      },
    })),

  completeBadge: (badgeId) =>
    set((state) => ({
      rewards: {
        ...state.rewards,
        badges: state.rewards.badges.map((badge) =>
          badge.id === badgeId
            ? { ...badge, earnedDate: new Date().toISOString().split("T")[0] }
            : badge
        ),
      },
    })),

  updateChallengeProgress: (challengeId, progress) =>
    set((state) => ({
      rewards: {
        ...state.rewards,
        activeChallenges: state.rewards.activeChallenges.map((challenge) =>
          challenge.id === challengeId
            ? { ...challenge, progress: Math.min(progress, challenge.total) }
            : challenge
        ),
      },
    })),

  // Theme
  theme: "dark",
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),

  // Chat
  chatUser: "",
  setChatUser: (user) => set({ chatUser: user }),
  receivedMessage: null,
  setReceivedMessage: (message) => set({ receivedMessage: message }),
}));

export { useStore };
export const getStore = useStore.getState;
export const wallpapers = wallpapersList;
