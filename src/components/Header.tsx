import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowDown, ArrowUp, Bell, Maximize2, Minimize2, Moon, Sun, Wallet} from 'lucide-react';
import {SettingsModal} from './SettingsModal';
import {StarMenu} from './StarMenu';
import {MainMenu} from './MainMenu';
import {AccountMenu} from './AccountMenu';
import {TopbarStarredItems} from './TopbarStarredItems';
import {NotificationPanel} from './NotificationPanel';
import {useStore} from '../store/useStore';
import {Web3AuthContext} from "../providers/Web3AuthContext";
import {useWebSocket} from '../providers/WebSocketProvider';
import {useBreakpointValue, useToast} from '@chakra-ui/react';

// Auth token key - must match the one in App.js
const AUTH_TOKEN_KEY = "auth_token";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected } = useContext(Web3AuthContext);
  const isSettingsOpen = useStore((state) => state.isSettingsOpen);
  const setIsSettingsOpen = useStore((state) => state.setIsSettingsOpen);
  const isTopbarVisible = useStore((state) => state.isTopbarVisible);
  const isTopbarBottom = useStore((state) => state.isTopbarBottom);
  const toggleTopbarVisibility = useStore((state) => state.toggleTopbarVisibility);
  const toggleTopbarPosition = useStore((state) => state.toggleTopbarPosition);
  const loadStarredItems = useStore((state) => state.loadStarredItems);
  const { theme, toggleTheme, setIsWalletDrawerOpen } = useStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false })
  const toast = useToast();

  const { unreadCount } = useWebSocket();

  const handleSignOut = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    navigate("/");
  };

  // Load starred items from localStorage when the component mounts
  useEffect(() => {
    if (isConnected) {
      loadStarredItems();
    }
  }, [isConnected, loadStarredItems]);


  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile, isMobileMenuOpen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleWalletDrawer = () => {
    if (isConnected) {
      setIsWalletDrawerOpen(true);
    } else {
      toast({
        status: 'info',
        description: `Please sign in to access your wallet.`,
        duration: 3500
      });
    }
  };

  const renderToggleButton = () => (
    <button
      onClick={toggleTopbarVisibility}
      className={`fixed ${isTopbarBottom ? 'bottom-0' : 'top-0'} left-1/2 -translate-x-1/2 p-1 z-40
        bg-black/40 backdrop-blur-xl border border-white/10 
        ${isTopbarBottom ? 'rounded-t-lg' : 'rounded-b-lg'}
        transition-all hover:bg-black/60 
        ${isTopbarVisible ? '' : `${isTopbarBottom ? '-translate-y-1' : 'translate-y-1'}`}`}
    >
      {isTopbarVisible ? (
        isTopbarBottom ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />
      ) : (
        isTopbarBottom ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
      )}
    </button>
  );

  return (
    <>
      <header
        className={`fixed ${isTopbarBottom ? 'bottom-0' : 'top-0'} left-0 right-0 h-12 glass z-40 
          transition-all duration-300 
          ${isTopbarVisible ? '' : isTopbarBottom ? 'translate-y-full' : '-translate-y-full'}`}
      >
        <div className="h-full flex items-center justify-between px-2">
          {/* Left section */}
          <div className="flex items-center gap-1 sm:gap-3">
            <MainMenu />

            {!isMobile && (
              <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block" />
            )}

            <div className="h-6 w-auto relative">
              <img
                src="https://i.imgur.com/PMmM0EA.png"
                alt="Logo"
                className="h-full w-auto object-contain"
              />
            </div>
          </div>

          {
            !isMobile && <TopbarStarredItems />
          }

          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
            {!isMobile && <StarMenu />}

            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full text-xs flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
              {isNotificationsOpen && (
                <NotificationPanel
                  isOpen={isNotificationsOpen}
                  onClose={() => setIsNotificationsOpen(false)}
                />
              )}
            </div>

            <button
              onClick={toggleWalletDrawer}
              className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Wallet"
            >
              <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {(!isMobile || window.innerWidth > 380) && (
              <button
                onClick={toggleFullscreen}
                className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </button>
            )}

            {(!isMobile || window.innerWidth > 420) && (
              <button
                onClick={toggleTopbarPosition}
                className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Toggle topbar position"
              >
                {isTopbarBottom ? (
                  <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>

            <AccountMenu onSignOut={handleSignOut} />
          </div>
        </div>
      </header>

      {renderToggleButton()}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};