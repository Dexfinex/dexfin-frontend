import { useContext, useEffect, useState } from 'react';
import { useStore } from './store/useStore';
import { Header } from './components/Header';
import { Workspace } from './components/Workspace';
import AIAgentModal from './components/agent/AIAgentModal.tsx';
import SwapModal from './components/swap/SwapModal'
import { DeFiModal } from './components/DeFiModal';
import { DashboardModal } from './components/DashboardModal';
import { MarketDataModal } from './components/MarketDataModal';
import { ChatModal } from './components/ChatModal';
import CartModal from './components/ShoppingCart/CartModal.tsx';
import { SocialFeedModal } from './components/SocialFeedModal';
import { GamesModal } from './components/GamesModal';
import { RewardsModal } from './components/RewardsModal';
import SignupModal from "./components/SignupModal.tsx";
import SigninModal from "./components/SigninModal.tsx";
import { AuthMethodType } from "@lit-protocol/constants";
import { Web3AuthContext } from "./providers/Web3AuthContext.tsx";
import { LOCAL_STORAGE_AUTH_REDIRECT_TYPE } from "./constants";
import { TradingViewModal } from './components/TradingViewModal.tsx';
import { initStream, KEY_NAME } from './utils/chatApi.ts';
import { PushAPI, CONSTANTS } from '@pushprotocol/restapi';
import UsernameModal from "./components/UsernameModal.tsx";
import WalletDrawer from './components/WalletDrawer.tsx';

export default function App() {
    const { theme } = useStore();
    const [isSignupTriggered, setIsSignupTriggered] = useState(false);

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
        menuItems,
        chatUser,
        setChatUser,
        isrewardsOpen,
        setIsRewardsOpen,

        isUsernameModalOpen,
        widgetCommand,
        setWidgetCommand,

        isWalletDrawerOpen,
        setIsWalletDrawerOpen
    } = useStore();

    const {
        authMethod,
        initializeErrors,
        address,
        isConnected,
    } = useContext(Web3AuthContext);

    // show modal if redirect from social login
    useEffect(() => {
        if (authMethod?.authMethodType === AuthMethodType.GoogleJwt ||
            authMethod?.authMethodType === AuthMethodType.AppleJwt) {
            // get whether this is from signin or sign-up
            const redirectType = localStorage.getItem(LOCAL_STORAGE_AUTH_REDIRECT_TYPE)
            if (redirectType === 'sign-up')
                setIsSignupModalOpen(true)
            else
                setIsSigninModalOpen(true)
        }
    }, [authMethod, setIsSigninModalOpen, setIsSignupModalOpen])

    useEffect(() => {
        if (isConnected) {
            setIsSigninModalOpen(false)
            setIsSignupModalOpen(false)

            if (!chatUser) {
                // unlock chat profile
                unlockProfile()
            }
        }
    }, [isConnected, setIsSigninModalOpen, setIsSignupModalOpen]);

    const unlockProfile = async () => {
        const chatKey = localStorage.getItem(KEY_NAME)

        if (chatKey) {
            const key: { account: string; decryptedPgpPrivateKey: string } = JSON.parse(chatKey)

            if (address === key.account) {
                console.log('auto initialize push user')
                const pushUser = await PushAPI.initialize({
                    decryptedPGPPrivateKey: key.decryptedPgpPrivateKey,
                    env: CONSTANTS.ENV.PROD,
                    account: key.account,
                })

                setChatUser(pushUser)
                initStream(pushUser)
            }
        }
    }

    // remove authMethod state when need to create new one
    // TODO: why need this?
    /*
        useEffect(() => {
            if (!isSigninModalOpen && authMethod && accounts.length === 0)
                setAuthMethod(undefined)
    
        }, [accounts.length, authMethod, isSigninModalOpen, setAuthMethod])
    */

    useEffect(() => {
        // Check if the previous trigger was set and authMethod has become undefined
        if (isSignupTriggered) {
            initializeErrors()
            setIsSignupModalOpen(true);
            setIsSignupTriggered(false); // Reset the trigger
        }
    }, [authMethod, initializeErrors, isSignupTriggered, setIsSignupModalOpen]);


    // Update theme
    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    // Find rewards menu item
    // const rewardsMenuItem = menuItems.find(item => item.id === 'rewards');
    // const isRewardsOpen = rewardsMenuItem?.isStarred || false;
    // const setIsRewardsOpen = (open: boolean) => {
    //     console.log("open", open)
    //     if (rewardsMenuItem) {
    //         useStore.getState().toggleStarMenuItem('rewards');
    //     }
    // };

    return (
        <div className="min-h-screen flex flex-col">
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
                        setIsSignupTriggered(true); // Set a trigger to wait for authMethod change
                    }}
                />
            )}

            <AIAgentModal
                isOpen={isAIAgentOpen}
                widgetCommand={widgetCommand}
                onClose={() => setIsAIAgentOpen(false)}
            />
            <SwapModal
                isOpen={isSwapOpen}
                onClose={() => setIsSwapOpen(false)}
            />
            <DeFiModal
                isOpen={isDefiOpen}
                onClose={() => setIsDefiOpen(false)}
            />
            <DashboardModal
                isOpen={isDashboardOpen}
                onClose={() => setIsDashboardOpen(false)}
            />
            <MarketDataModal
                isOpen={isMarketDataOpen}
                onClose={() => setIsMarketDataOpen(false)}
            />
            <ChatModal
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
            />
            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />
            <SocialFeedModal
                isOpen={isSocialFeedOpen}
                onClose={() => setIsSocialFeedOpen(false)}
            />
            <GamesModal
                isOpen={isGamesOpen}
                onClose={() => setIsGamesOpen(false)}
            />
            <RewardsModal
                isOpen={isrewardsOpen}
                onClose={() => setIsRewardsOpen(false)}
            />
            {
                isTradeOpen && <TradingViewModal
                    isOpen={isTradeOpen}
                    onClose={() => setTradeOpen(false)}
                />
            }
            <UsernameModal
                isOpen={isUsernameModalOpen}
                onClose={() => useStore.getState().setIsUsernameModalOpen(false)}
            />
            <WalletDrawer
                isOpen={isWalletDrawerOpen}
                onClose={() => setIsWalletDrawerOpen(false)}
            />
        </div>
    );
}