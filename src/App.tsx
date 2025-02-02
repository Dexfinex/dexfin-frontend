import {useEffect} from 'react';
import {useStore} from './store/useStore';
import {Header} from './components/Header';
import {Workspace} from './components/Workspace';
import AIAgentModal from './components/AIAgentModal';
import {SwapModal} from './components/SwapModal';
import {DeFiModal} from './components/DeFiModal';
import {DashboardModal} from './components/DashboardModal';
import {MarketDataModal} from './components/MarketDataModal';
import {ChatModal} from './components/ChatModal';
import {CartModal} from './components/CartModal';
import {SocialFeedModal} from './components/SocialFeedModal';
import {GamesModal} from './components/GamesModal';
import {RewardsModal} from './components/RewardsModal';

export default function App() {
    const {theme} = useStore();
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
        menuItems
    } = useStore();

    // Update theme
    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    // Find rewards menu item
    const rewardsMenuItem = menuItems.find(item => item.id === 'rewards');
    const isRewardsOpen = rewardsMenuItem?.isStarred || false;
    const setIsRewardsOpen = (open: boolean) => {
        console.log("open", open)
        if (rewardsMenuItem) {
            useStore.getState().toggleStarMenuItem('rewards');
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header/>
            <Workspace/>

            <AIAgentModal
                isOpen={isAIAgentOpen}
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
                isOpen={isRewardsOpen}
                onClose={() => setIsRewardsOpen(false)}
            />
        </div>
    );
}