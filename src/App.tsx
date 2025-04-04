// src/App.tsx
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
import { AUTH_METHOD_TYPE } from "@lit-protocol/constants";
import { Web3AuthContext } from "./providers/Web3AuthContext.tsx";
import {
  LOCAL_STORAGE_AUTH_REDIRECT_TYPE,
  LOCAL_STORAGE_PUSH_KEY,
} from "./constants";
import { TradingViewModal } from "./components/TradingViewModal.tsx";
import { initStream } from "./utils/chat.util.ts";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import WalletDrawer from "./components/WalletDrawer.tsx";
import LandingPage from "./components/mainpage/LandingPage.tsx";
import Privacy from "./components/Privacy.tsx";
import Terms from "./components/Terms.tsx";
import AppPage from "./AppPage";
import GlobalLoading from "./components/GlobalLoading.tsx";
import TrackingScripts from "./components/TrackingScripts";
import { trackPageView, trackModalInteraction } from "./services/analytics";
import { trackMouseflowPageView, addMouseflowTag } from "./services/mouseflow";
import ReferralHandler from "./components/ReferralHandler.tsx";
import TwoFactorAuthPage from "./components/TwoFactorAuthPage";
import { useUserData } from "./providers/UserProvider.tsx";

export default function App() {
  const { theme } = useStore();
  const [isSignupTriggered, setIsSignupTriggered] = useState(false);
  const [isStylesApplied, setIsStylesApplied] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useUserData();
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
    setIsSignupModalOpen,
    isSignupModalOpen,
    setIsSigninModalOpen,
    isSigninModalOpen,
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
    requires2FA,
    sessionLoading,
    sessionError,
    isPreparingAccounts,
  } = useContext(Web3AuthContext);

  useEffect(() => {
    trackPageView(location.pathname);

    trackMouseflowPageView(location.pathname);

    addMouseflowTag(`page_${location.pathname.replace(/\//g, "_") || "home"}`);
  }, [location.pathname]);

  const useTrackModalState = (isOpen: boolean, modalName: string) => {
    useEffect(() => {
      if (isOpen) {
        trackModalInteraction(modalName, "open");

        addMouseflowTag(`modal_open_${modalName}`);
      }
    }, [isOpen]);
  };

  useTrackModalState(isAIAgentOpen, "AIAgent");
  useTrackModalState(isSwapOpen, "Swap");
  useTrackModalState(isDefiOpen, "DeFi");
  useTrackModalState(isDashboardOpen, "Dashboard");
  useTrackModalState(isMarketDataOpen, "MarketData");
  useTrackModalState(isChatOpen, "Chat");
  useTrackModalState(isCartOpen, "Cart");
  useTrackModalState(isSocialFeedOpen, "SocialFeed");
  useTrackModalState(isGamesOpen, "Games");
  useTrackModalState(isRewardsOpen, "Rewards");
  useTrackModalState(isSignupModalOpen, "Signup");
  useTrackModalState(isSigninModalOpen, "Signin");
  useTrackModalState(isTradeOpen, "Trade");
  useTrackModalState(isUsernameModalOpen, "Username");
  useTrackModalState(isWalletDrawerOpen, "WalletDrawer");

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
        addMouseflowTag(`auth_signup_${authMethod.authMethodType}`);
      } else {
        setIsSigninModalOpen(false);
        addMouseflowTag(`auth_signin_${authMethod.authMethodType}`);
      }
    }
  }, [authMethod, setIsSigninModalOpen, setIsSignupModalOpen]);

  useEffect(() => {
    if (isConnected) {
      if (requires2FA) {
        if (location.pathname !== "/verify-2fa") {
          navigate("/verify-2fa");
        }
      } else if (userData?.accessToken) {
        setIsSigninModalOpen(false);
        setIsSignupModalOpen(false);

        if (!chatUser) {
          unlockProfile();
        }

        if (location.pathname === "/" || location.pathname === "/verify-2fa") {
          navigate("/app");
        }

        addMouseflowTag("user_connected");
      }
    }
  }, [
    isConnected,
    requires2FA,
    userData,
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

          addMouseflowTag("chat_user_initialized");
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

  useEffect(() => {
    if (authMethod && requires2FA) {
      if (location.pathname !== "/verify-2fa") {
        navigate("/verify-2fa");
      }
    }
  }, [authMethod, requires2FA, navigate, location.pathname]);

  const isAuthenticated = () => {
    return isConnected && !requires2FA && userData?.accessToken;
  };

  const isInTwoFactorAuthStage = () => {
    return isConnected && requires2FA;
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

  const closeAIAgentModal = () => {
    trackModalInteraction("AIAgent", "close");
    addMouseflowTag("modal_close_AIAgent");
    setIsAIAgentOpen(false);
  };

  const closeSwapModal = () => {
    trackModalInteraction("Swap", "close");
    addMouseflowTag("modal_close_Swap");
    setIsSwapOpen(false);
  };

  const closeDefiModal = () => {
    trackModalInteraction("DeFi", "close");
    addMouseflowTag("modal_close_DeFi");
    setIsDefiOpen(false);
  };

  const closeDashboardModal = () => {
    trackModalInteraction("Dashboard", "close");
    addMouseflowTag("modal_close_Dashboard");
    setIsDashboardOpen(false);
  };

  const closeMarketDataModal = () => {
    trackModalInteraction("MarketData", "close");
    addMouseflowTag("modal_close_MarketData");
    setIsMarketDataOpen(false);
  };

  const closeChatModal = () => {
    trackModalInteraction("Chat", "close");
    addMouseflowTag("modal_close_Chat");
    setIsChatOpen(false);
  };

  const closeCartModal = () => {
    trackModalInteraction("Cart", "close");
    addMouseflowTag("modal_close_Cart");
    setIsCartOpen(false);
  };

  const closeSocialFeedModal = () => {
    trackModalInteraction("SocialFeed", "close");
    addMouseflowTag("modal_close_SocialFeed");
    setIsSocialFeedOpen(false);
  };

  const closeGamesModal = () => {
    trackModalInteraction("Games", "close");
    addMouseflowTag("modal_close_Games");
    setIsGamesOpen(false);
  };

  const closeRewardsModal = () => {
    trackModalInteraction("Rewards", "close");
    addMouseflowTag("modal_close_Rewards");
    setIsRewardsOpen(false);
  };

  const closeTradeModal = () => {
    trackModalInteraction("Trade", "close");
    addMouseflowTag("modal_close_Trade");
    setTradeOpen(false);
  };

  const closeWalletDrawer = () => {
    trackModalInteraction("WalletDrawer", "close");
    addMouseflowTag("modal_close_WalletDrawer");
    setIsWalletDrawerOpen(false);
  };

  return (
    <Box className="min-h-screen flex flex-col">
      <TrackingScripts />
      <ReferralHandler />
      <GlobalLoading
        isOpen={isLoading}
        message={loadingMessage}
        error={loadingError}
      />

      <Routes>
        <Route path="/ref/:referralCode/*" element={<ReferralHandler />} />
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate to="/app" replace />
            ) : isInTwoFactorAuthStage() ? (
              <Navigate to="/verify-2fa" replace />
            ) : (
              <LandingPage />
            )
          }
        />
        <Route
          path="/app"
          element={
            isAuthenticated() ? (
              <AppPage />
            ) : isInTwoFactorAuthStage() ? (
              <Navigate to="/verify-2fa" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/verify-2fa"
          element={
            isInTwoFactorAuthStage() ? (
              <TwoFactorAuthPage />
            ) : isAuthenticated() ? (
              <Navigate to="/app" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <AIAgentModal
        isOpen={isAIAgentOpen}
        widgetCommand={widgetCommand}
        onClose={closeAIAgentModal}
      />

      <SwapModal isOpen={isSwapOpen} onClose={closeSwapModal} />

      <DeFiModal isOpen={isDefiOpen} onClose={closeDefiModal} />

      <DashboardModal isOpen={isDashboardOpen} onClose={closeDashboardModal} />

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

      <RewardsModal isOpen={isRewardsOpen} onClose={closeRewardsModal} />

      {isTradeOpen && (
        <TradingViewModal isOpen={isTradeOpen} onClose={closeTradeModal} />
      )}

      <WalletDrawer isOpen={isWalletDrawerOpen} onClose={closeWalletDrawer} />
    </Box>
  );
}
