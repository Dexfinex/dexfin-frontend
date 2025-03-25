import { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useStore } from "./store/useStore";
import { Header } from "./components/Header";
import { Workspace } from "./components/Workspace";
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
import SignupModal from "./components/SignupModal.tsx";
import SigninModal from "./components/SigninModal.tsx";
import { AuthMethodType } from "@lit-protocol/constants";
import { Web3AuthContext } from "./providers/Web3AuthContext.tsx";
import {
  LOCAL_STORAGE_AUTH_REDIRECT_TYPE,
  LOCAL_STORAGE_PUSH_KEY,
} from "./constants";
import { TradingViewModal } from "./components/TradingViewModal.tsx";
import { initStream } from "./utils/chat.util.ts";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import WalletDrawer from "./components/WalletDrawer.tsx";
import ReferralHandler from "./components/ReferralHandler.tsx";
import LandingPage from "./components/mainpage/LandingPage.tsx";
import Privacy from "./components/Privacy.tsx";
import Terms from "./components/Terms.tsx";

const MainApp: React.FC = () => {
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
    widgetCommand,
    isWalletDrawerOpen,
    setIsWalletDrawerOpen,
  } = useStore();

  const { authMethod, initializeErrors, address, isConnected } =
    useContext(Web3AuthContext);

  const [isSignupTriggered, setIsSignupTriggered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isConnected) {
      navigate("/", { replace: true });
    }
  }, [isConnected, navigate]);

  useEffect(() => {
    if (
      authMethod?.authMethodType === AuthMethodType.GoogleJwt ||
      authMethod?.authMethodType === AuthMethodType.AppleJwt
    ) {
      // get whether this is from signin or sign-up
      const redirectType = localStorage.getItem(
        LOCAL_STORAGE_AUTH_REDIRECT_TYPE
      );
      if (redirectType === "sign-up") setIsSignupModalOpen(true);
      else setIsSigninModalOpen(true);
    }
  }, [authMethod, setIsSigninModalOpen, setIsSignupModalOpen]);

  useEffect(() => {
    if (isConnected) {
      setIsSigninModalOpen(false);
      setIsSignupModalOpen(false);

      if (!chatUser) {
        unlockProfile();
      }
    }
  }, [isConnected, setIsSigninModalOpen, setIsSignupModalOpen, chatUser]);

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

  // Handle signup trigger
  useEffect(() => {
    if (isSignupTriggered) {
      initializeErrors();
      setIsSignupModalOpen(true);
      setIsSignupTriggered(false);
    }
  }, [authMethod, initializeErrors, isSignupTriggered, setIsSignupModalOpen]);

  return (
    <div className="min-h-screen flex flex-col">
      <ReferralHandler />
      <Header />
      <Workspace />

      {isSignupModalOpen && (
        <SignupModal
          isOpen={true}
          onClose={() => setIsSignupModalOpen(false)}
        />
      )}
      {isSigninModalOpen && (
        <SigninModal
          isOpen={true}
          onClose={() => setIsSigninModalOpen(false)}
          goToSignUp={() => {
            setIsSigninModalOpen(false);
            setIsSignupTriggered(true);
          }}
        />
      )}

      <AIAgentModal
        isOpen={isAIAgentOpen}
        widgetCommand={widgetCommand}
        onClose={() => setIsAIAgentOpen(false)}
      />
      <SwapModal isOpen={isSwapOpen} onClose={() => setIsSwapOpen(false)} />
      <DeFiModal isOpen={isDefiOpen} onClose={() => setIsDefiOpen(false)} />
      <DashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
      />
      <MarketDataModal
        isOpen={isMarketDataOpen}
        onClose={() => setIsMarketDataOpen(false)}
      />
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <SocialFeedModal
        isOpen={isSocialFeedOpen}
        onClose={() => setIsSocialFeedOpen(false)}
      />
      <GamesModal isOpen={isGamesOpen} onClose={() => setIsGamesOpen(false)} />
      <RewardsModal
        isOpen={isRewardsOpen}
        onClose={() => setIsRewardsOpen(false)}
      />
      {isTradeOpen && (
        <TradingViewModal
          isOpen={isTradeOpen}
          onClose={() => setTradeOpen(false)}
        />
      )}
      <WalletDrawer
        isOpen={isWalletDrawerOpen}
        onClose={() => setIsWalletDrawerOpen(false)}
      />
    </div>
  );
};

const LandingWithRedirect: React.FC = () => {
  const { isConnected, isLoadingStoredWallet } = useContext(Web3AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected) {
      navigate("/app", { replace: true });
    }
    window.scrollTo(0, 0);
  }, [isConnected, navigate]);

  if (isLoadingStoredWallet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <LandingPage
    />
  );
};

const AppWrapper = () => {
  const { theme } = useStore();
  const [isStylesApplied, setIsStylesApplied] = useState(false);

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
    
    window.scrollTo(0, 0);
  }, [theme, isStylesApplied]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingWithRedirect />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/app" element={<MainApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default function App() {
  return <AppWrapper />;
}