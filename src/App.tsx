import { useContext, useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { useStore } from "./store/useStore";
import AIAgentModal from "./components/agent/AIAgentModal.tsx";
import SwapModal from "./components/swap/SwapModal";
import { DeFiModal } from "./components/DeFiModal";
import { DashboardModal } from "./components/DashboardModal";
import { MarketDataModal } from "./components/MarketDataModal";
import { ChatModal } from "./components/ChatModal";
import CartModal from "./components/ShoppingCart/CartModal.tsx";
import { SocialFeedModal } from "./components/SocialFeedModal";
import { GamesModal } from "./components/GamesModal";
import { RewardsModal } from "./components/RewardsModal";
// import SignUpModal from "./components/SignupModal.tsx";
// import SignInModal from "./components/SignInModal.tsx";
import { AUTH_METHOD_TYPE } from "@lit-protocol/constants";
import { Web3AuthContext } from "./providers/Web3AuthContext.tsx";
import {
  LOCAL_STORAGE_AUTH_REDIRECT_TYPE,
  LOCAL_STORAGE_PUSH_KEY,
} from "./constants";
import { TradingViewModal } from "./components/TradingViewModal.tsx";
import { initStream } from "./utils/chat.util.ts";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import UsernameModal from "./components/UsernameModal.tsx";
import WalletDrawer from "./components/WalletDrawer.tsx";
import LandingPage from "./components/mainpage/LandingPage.tsx";
import Privacy from "./components/Privacy.tsx";
import Terms from "./components/Terms.tsx";
import AppPage from "./AppPage";
import GlobalLoading from "./components/GlobalLoading.tsx";
import { initializeGA, trackPageView, trackModalInteraction } from "./services/analytics";

// Simple auth persistence key
const AUTH_TOKEN_KEY = "auth_token";

export default function App() {
  const { theme } = useStore();
  const [isSignupTriggered, setIsSignupTriggered] = useState(false);
  const [isStylesApplied, setIsStylesApplied] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    isAIAgentOpen,
    setIsAIAgentOpen,
    isSwapOpen,
    setIsSwapOpen,
    isDefiOpen,
    setIsDefiOpen,
    isDashboardOpen,
    setIsDashboardOpen,
    isMarketDataOpen,
    setIsMarketDataOpen,
    isChatOpen,
    setIsChatOpen,
    isCartOpen,
    setIsCartOpen,
    isSocialFeedOpen,
    setIsSocialFeedOpen,
    isGamesOpen,
    setIsGamesOpen,
    isSignupModalOpen,
    setIsSignupModalOpen,
    isSigninModalOpen,
    setIsSigninModalOpen,
    isTradeOpen,
    setTradeOpen,
    chatUser,
    setChatUser,
    isRewardsOpen,
    setIsRewardsOpen,
    isUsernameModalOpen,
    widgetCommand,
    isWalletDrawerOpen,
    setIsWalletDrawerOpen,
  } = useStore();

  const {
    authMethod,
    initializeErrors,
    address,
    isConnected,
    authLoading,
    authError,
    accountsLoading,
    accountsError,
    sessionLoading,
    sessionError,
    isPreparingAccounts,
  } = useContext(Web3AuthContext);

  // Initialize Google Analytics
  useEffect(() => {
    initializeGA();
  }, []);

  // Track page views
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  // Custom hook to track modal state changes
  const useTrackModalState = (isOpen: boolean, modalName: string) => {
    useEffect(() => {
      if (isOpen) {
        trackModalInteraction(modalName, 'open');
      }
    }, [isOpen]);
  };

  // Track all modals
  useTrackModalState(isAIAgentOpen, 'AIAgent');
  useTrackModalState(isSwapOpen, 'Swap');
  useTrackModalState(isDefiOpen, 'DeFi');
  useTrackModalState(isDashboardOpen, 'Dashboard');
  useTrackModalState(isMarketDataOpen, 'MarketData');
  useTrackModalState(isChatOpen, 'Chat');
  useTrackModalState(isCartOpen, 'Cart');
  useTrackModalState(isSocialFeedOpen, 'SocialFeed');
  useTrackModalState(isGamesOpen, 'Games');
  useTrackModalState(isRewardsOpen, 'Rewards');
  useTrackModalState(isSignupModalOpen, 'Signup');
  useTrackModalState(isSigninModalOpen, 'Signin');
  useTrackModalState(isTradeOpen, 'Trade');
  useTrackModalState(isUsernameModalOpen, 'Username');
  useTrackModalState(isWalletDrawerOpen, 'WalletDrawer');

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);

    if (!isStylesApplied) {
      const style = document.createElement("style");
      style.innerHTML = `
                html, body {
                    overflow-x: hidden;
                    scroll-behavior: smooth;
                }
                body {
                    position: relative;
                    width: 100%;
                }
                #sections-container > div {
                    min-height: 300px;
                    position: relative;
                    width: 100%;
                }
            `;
      document.head.appendChild(style);
      setIsStylesApplied(true);
    }
  }, [theme, isStylesApplied]);

  useEffect(() => {
    if (location.pathname === "/") {
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (
      authMethod?.authMethodType === AUTH_METHOD_TYPE.GoogleJwt ||
      authMethod?.authMethodType === AUTH_METHOD_TYPE.Discord ||
      authMethod?.authMethodType === AUTH_METHOD_TYPE.AppleJwt
    ) {
      const redirectType = localStorage.getItem(
        LOCAL_STORAGE_AUTH_REDIRECT_TYPE
      );
      if (redirectType === "sign-up") {
        setIsSignupModalOpen(false);
        setIsSigninModalOpen(false);
      } else {
        setIsSigninModalOpen(false);
      }
    }
  }, [authMethod, setIsSigninModalOpen, setIsSignupModalOpen]);

  useEffect(() => {
    if (isConnected) {
      setIsSigninModalOpen(false);
      setIsSignupModalOpen(false);

      if (!chatUser) {
        unlockProfile();
      }

      if (location.pathname === "/") {
        navigate("/app");
      }
    }
  }, [
    isConnected,
    navigate,
    setIsSigninModalOpen,
    setIsSignupModalOpen,
    chatUser,
    location.pathname,
  ]);

  const unlockProfile = async () => {
    const chatKey = localStorage.getItem(LOCAL_STORAGE_PUSH_KEY);

    if (chatKey) {
      try {
        const key = JSON.parse(chatKey);

        if (address === key.account) {
          console.log("Auto initializing push user");
          const pushUser = await PushAPI.initialize({
            decryptedPGPPrivateKey: key.decryptedPgpPrivateKey,
            env: CONSTANTS.ENV.PROD,
            account: key.account,
          });

          setChatUser(pushUser);
          initStream(pushUser);
        }
      } catch (error) {
        console.error("Error initializing chat profile:", error);
      }
    }
  };

  useEffect(() => {
    if (isSignupTriggered) {
      initializeErrors();
      setIsSignupModalOpen(true);
      setIsSignupTriggered(false);
    }
  }, [authMethod, initializeErrors, isSignupTriggered, setIsSignupModalOpen]);

  const isAuthenticated = () => {
    return isConnected || localStorage.getItem(AUTH_TOKEN_KEY) === "true";
  };

  const isLoading =
    authLoading || accountsLoading || sessionLoading || isPreparingAccounts;
  const loadingMessage = authLoading
    ? "Authenticating your credentials..."
    : accountsLoading
    ? "Looking up your accounts..."
    : sessionLoading
    ? "Securing your session..."
    : isPreparingAccounts
    ? "Preparing your account..."
    : "";

  const loadingError = authError || accountsError || sessionError;

  // Custom wrappers for setting modal states with analytics tracking
  const closeAIAgentModal = () => {
    trackModalInteraction('AIAgent', 'close');
    setIsAIAgentOpen(false);
  };

  const closeSwapModal = () => {
    trackModalInteraction('Swap', 'close');
    setIsSwapOpen(false);
  };

  const closeDefiModal = () => {
    trackModalInteraction('DeFi', 'close');
    setIsDefiOpen(false);
  };

  const closeDashboardModal = () => {
    trackModalInteraction('Dashboard', 'close');
    setIsDashboardOpen(false);
  };

  const closeMarketDataModal = () => {
    trackModalInteraction('MarketData', 'close');
    setIsMarketDataOpen(false);
  };

  const closeChatModal = () => {
    trackModalInteraction('Chat', 'close');
    setIsChatOpen(false);
  };

  const closeCartModal = () => {
    trackModalInteraction('Cart', 'close');
    setIsCartOpen(false);
  };

  const closeSocialFeedModal = () => {
    trackModalInteraction('SocialFeed', 'close');
    setIsSocialFeedOpen(false);
  };

  const closeGamesModal = () => {
    trackModalInteraction('Games', 'close');
    setIsGamesOpen(false);
  };

  const closeRewardsModal = () => {
    trackModalInteraction('Rewards', 'close');
    setIsRewardsOpen(false);
  };

  const closeTradeModal = () => {
    trackModalInteraction('Trade', 'close');
    setTradeOpen(false);
  };

  const closeWalletDrawer = () => {
    trackModalInteraction('WalletDrawer', 'close');
    setIsWalletDrawerOpen(false);
  };

  return (
    <Box className="min-h-screen flex flex-col">
      {/* Global loading overlay */}
      <GlobalLoading
        isOpen={isLoading}
        message={loadingMessage}
        error={loadingError}
      />

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated() ? <Navigate to="/app" replace /> : <LandingPage />
          }
        />
        <Route
          path="/app"
          element={
            isAuthenticated() ? <AppPage /> : <Navigate to="/" replace />
          }
        />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Modals - these are conditionally rendered based on their open state */}
      {/* {isSignupModalOpen && (
        <SignUpModal
          isOpen={true}
          onClose={() => {
            trackModalInteraction('Signup', 'close');
            setIsSignupModalOpen(false);
          }}
        />
      )}

      {isSigninModalOpen && (
        <SignInModal
          isOpen={true}
          onClose={() => {
            trackModalInteraction('Signin', 'close');
            setIsSigninModalOpen(false);
          }}
          goToSignUp={() => {
            trackModalInteraction('Signin', 'close');
            setIsSigninModalOpen(false);
            setIsSignupTriggered(true);
          }}
        />
      )} */}

      <AIAgentModal
        isOpen={isAIAgentOpen}
        widgetCommand={widgetCommand}
        onClose={closeAIAgentModal}
      />

      <SwapModal isOpen={isSwapOpen} onClose={closeSwapModal} />

      <DeFiModal isOpen={isDefiOpen} onClose={closeDefiModal} />

      <DashboardModal
        isOpen={isDashboardOpen}
        onClose={closeDashboardModal}
      />

      <MarketDataModal
        isOpen={isMarketDataOpen}
        onClose={closeMarketDataModal}
      />

      <ChatModal isOpen={isChatOpen} onClose={closeChatModal} />

      <CartModal isOpen={isCartOpen} onClose={closeCartModal} />

      <SocialFeedModal
        isOpen={isSocialFeedOpen}
        onClose={closeSocialFeedModal}
      />

      <GamesModal isOpen={isGamesOpen} onClose={closeGamesModal} />

      <RewardsModal
        isOpen={isRewardsOpen}
        onClose={closeRewardsModal}
      />

      {isTradeOpen && (
        <TradingViewModal
          isOpen={isTradeOpen}
          onClose={closeTradeModal}
        />
      )}

      {isUsernameModalOpen && (
        <UsernameModal
          isOpen={true}
          onClose={() => {
            trackModalInteraction('Username', 'close');
            useStore.getState().setIsUsernameModalOpen(false);
          }}
        />
      )}

      <WalletDrawer
        isOpen={isWalletDrawerOpen}
        onClose={closeWalletDrawer}
      />
    </Box>
  );
}