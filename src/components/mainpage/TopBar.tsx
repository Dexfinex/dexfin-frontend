import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  IconButton,
  Text,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
  useColorModeValue,
  Switch,
} from '@chakra-ui/react';
import {
  Menu as MenuIcon,
  Search,
  Bell,
  Wallet,
  User,
  TrendingUp,
  ArrowLeftRight,
  Settings,
  Star,
  ShoppingCart,
  Coins,
  BarChart2,
  Bot,
  MessageCircle,
  Gamepad2,
  Sun,
  Moon,
} from 'lucide-react';

import Logo from './Logo';
import SettingsModal from './SettingsModal';
import TradeModal from './TradeModal';
import SwapModal from './SwapModal';
import StakingModal from './StakingModal';
import GameModal from './GameModal';
import ChatModal from './ChatModal';
import LendBorrowModal from './LendBorrowModal';
import MarketDataModal from './MarketDataModal';
import AskDexfinModal from './AskDexfinModal';
import NotificationsModal from './NotificationsModal';
import WalletModal from './WalletModal';
import TokenCartModal from './TokenCartModal';

interface TopBarProps {
  onLogoClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onLogoClick }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTradeOpen, setIsTradeOpen] = useState(false);
  const [isSwapOpen, setIsSwapOpen] = useState(false);
  const [isStakingOpen, setIsStakingOpen] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLendBorrowOpen, setIsLendBorrowOpen] = useState(false);
  const [isMarketDataOpen, setIsMarketDataOpen] = useState(false);
  const [isAskDexfinOpen, setIsAskDexfinOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isTokenCartOpen, setIsTokenCartOpen] = useState(false);

  useEffect(() => {
    const appContainer = document.querySelector('.app-container');
    if (appContainer) {
      appContainer.setAttribute('data-theme', colorMode);
    }
  }, [colorMode]);

  const bg = useColorModeValue('rgba(255, 255, 255, 0.85)', 'rgba(0, 0, 0, 0.75)');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const menuBg = useColorModeValue('white', 'rgba(0, 0, 0, 0.95)');
  const menuHoverBg = useColorModeValue('gray.100', 'whiteAlpha.200');
  const iconColor = useColorModeValue('gray.800', 'white');

  const menuItems = [
    { id: 'swap', label: 'Swap', icon: ArrowLeftRight, onClick: () => setIsSwapOpen(true) },
    { id: 'trade', label: 'Trade', icon: TrendingUp, onClick: () => setIsTradeOpen(true) },
    { id: 'tokencart', label: 'Token Cart', icon: ShoppingCart, onClick: () => setIsTokenCartOpen(true) },
    { id: 'lendBorrow', label: 'Lend & Borrow', icon: Coins, onClick: () => setIsLendBorrowOpen(true) },
    { id: 'marketData', label: 'Market Data', icon: BarChart2, onClick: () => setIsMarketDataOpen(true) },
    { id: 'askDexfin', label: 'Ask Dexfin', icon: Bot, onClick: () => setIsAskDexfinOpen(true) },
    { id: 'chat', label: 'Chat', icon: MessageCircle, onClick: () => setIsChatOpen(true) },
    { id: 'games', label: 'Games', icon: Gamepad2, onClick: () => setIsGameOpen(true) },
  ];

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      h="48px"
      bg={bg}
      backdropFilter="blur(10px)"
      borderBottom="1px solid"
      borderColor={borderColor}
      zIndex={1000}
      transition="all 0.3s ease"
    >
      <Flex justify="space-between" align="center" h="full" px={4}>
        <HStack spacing={4}>
          <Logo onClick={onLogoClick} />
          
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<MenuIcon size={18} />}
              variant="ghost"
              size="sm"
              color={iconColor}
              _hover={{ bg: menuHoverBg }}
            />
            <MenuList bg={menuBg} borderColor={borderColor}>
              {menuItems.map((item) => (
                <MenuItem
                  key={item.id}
                  onClick={item.onClick}
                  bg="transparent"
                  _hover={{ bg: menuHoverBg }}
                  color={iconColor}
                >
                  <HStack>
                    <item.icon size={16} />
                    <Text>{item.label}</Text>
                  </HStack>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </HStack>

        <HStack spacing={4}>
          <IconButton
            aria-label="Search"
            icon={<Search size={18} />}
            variant="ghost"
            size="sm"
            color={iconColor}
            _hover={{ bg: menuHoverBg }}
          />
          <IconButton
            aria-label="Notifications"
            icon={<Bell size={18} />}
            variant="ghost"
            size="sm"
            onClick={() => setIsNotificationsOpen(true)}
            color={iconColor}
            _hover={{ bg: menuHoverBg }}
          />
          <IconButton
            aria-label="Wallet"
            icon={<Wallet size={18} />}
            variant="ghost"
            size="sm"
            onClick={() => setIsWalletOpen(true)}
            color={iconColor}
            _hover={{ bg: menuHoverBg }}
          />

          {/* Theme Toggle */}
          <Switch
            size="sm"
            isChecked={colorMode === 'light'}
            onChange={toggleColorMode}
            colorScheme="blue"
          />

          <Menu>
            <MenuButton
              as={IconButton}
              icon={<User size={18} />}
              variant="ghost"
              size="sm"
              color={iconColor}
              _hover={{ bg: menuHoverBg }}
            />
            <MenuList bg={menuBg} borderColor={borderColor}>
              <MenuItem
                onClick={() => setIsSettingsOpen(true)}
                bg="transparent"
                _hover={{ bg: menuHoverBg }}
                color={iconColor}
              >
                <HStack spacing={3}>
                  <Settings size={16} />
                  <Text>Settings</Text>
                </HStack>
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {/* Modals */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <TradeModal isOpen={isTradeOpen} onClose={() => setIsTradeOpen(false)} />
      <SwapModal isOpen={isSwapOpen} onClose={() => setIsSwapOpen(false)} />
      <StakingModal isOpen={isStakingOpen} onClose={() => setIsStakingOpen(false)} />
      <GameModal isOpen={isGameOpen} onClose={() => setIsGameOpen(false)} />
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <LendBorrowModal isOpen={isLendBorrowOpen} onClose={() => setIsLendBorrowOpen(false)} />
      <MarketDataModal isOpen={isMarketDataOpen} onClose={() => setIsMarketDataOpen(false)} />
      <AskDexfinModal isOpen={isAskDexfinOpen} onClose={() => setIsAskDexfinOpen(false)} />
      <NotificationsModal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
      <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />
      <TokenCartModal isOpen={isTokenCartOpen} onClose={() => setIsTokenCartOpen(false)} />
    </Box>
  );
};

export default TopBar;