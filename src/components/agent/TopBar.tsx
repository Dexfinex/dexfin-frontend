import { useState } from 'react';
import {
  Bot,
  Maximize2,
  Minimize2,
  X,
  ChevronDown,
  LineChart,
  Globe,
  ArrowLeftRight,
  Menu as LucideMenu,
} from 'lucide-react';

import {
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Box,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/react';



interface TopBarProps {
  processCommand: (command: string, address: string, chainId: number | undefined) => void;
  address: string;
  chainId: number | undefined;
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
  onClose: () => void;
  setInput: (value: string) => void;
}

export function TopBar({ isFullscreen, setIsFullscreen, onClose, setInput }: TopBarProps) {
  const { isOpen, onOpen, onClose: onDrawerClose } = useDisclosure();

  const [showStakingActions, setShowStakingActions] = useState(false);
  const [showYieldActions, setShowYieldActions] = useState(false);

  return (
    <div className="flex items-center justify-between p-4 border-b border-white/10">
      <div className="flex items-center gap-3">
        <Bot className="w-5 h-5" />
        <h2 className="text-xl font-semibold">AI Agent</h2>
      </div>
      <HStack spacing={6} display={{ base: 'none', lg: 'flex' }}>
        <Menu>
          <MenuButton
            as={Button}
            variant="ghost"
            color="glass"
            _hover={{ bg: 'whiteAlpha.100' }}
            _active={{ bg: 'whiteAlpha.100' }}
            rightIcon={<ChevronDown size={16} />}
            leftIcon={<LineChart size={16} />}
            fontWeight="normal"
          >
            Market Analysis
          </MenuButton>
          <MenuList
            className='glass'
            backdropFilter="blur(12px)"
            boxShadow="0 4px 12px rgba(0, 0, 0, 0.5)"
          >
            <MenuItem
              bgColor={'blackAlpha.50'}
              _hover={{ bg: 'whiteAlpha.100' }}
              onClick={() => { setInput('What is the Bitcoin price?') }}
            >
              <Box>
                <Text>What is the BTC price?</Text>
                <Text fontSize="xs" color="gray.500">Get current Bitcoin price</Text>
              </Box>
            </MenuItem>

            <MenuItem
              bgColor={'blackAlpha.50'}
              _hover={{ bg: 'whiteAlpha.100' }}
              onClick={() => { setInput('Market News') }}
            >
              <Box>
                <Text>Market News</Text>
                <Text fontSize="xs" color="gray.500">Latest news with sentiment</Text>
              </Box>
            </MenuItem>


            <MenuItem
              bgColor={'blackAlpha.50'}
              _hover={{ bg: 'whiteAlpha.100' }}
              onClick={() => { setInput('ETH Technical Analysis') }}
            >
              <Box>
                <Text>ETH Technical Analysis</Text>
                <Text fontSize="xs" color="gray.500">Get detailed ETH analysis</Text>
              </Box>
            </MenuItem>

            <MenuItem
              bgColor={'blackAlpha.50'}
              _hover={{ bg: 'whiteAlpha.100' }}
              onClick={() => { setInput('Analyze ETH market sentiment') }}
            >
              <Box>
                <Text>Analyze ETH market sentiment</Text>
                <Text fontSize="xs" color="gray.500">Get sentiment analysis for ETH</Text>
              </Box>
            </MenuItem>

            <MenuItem
              bgColor={'blackAlpha.50'}
              _hover={{ bg: 'whiteAlpha.100' }}
              onClick={() => { setInput('Show trending coins') }}
            >
              <Box>
                <Text>Show trending coins</Text>
                <Text fontSize="xs" color="gray.500">View most trending coins</Text>
              </Box>
            </MenuItem>
            <MenuItem
              bgColor={'blackAlpha.50'}
              _hover={{ bg: 'whiteAlpha.100' }}
              onClick={() => { setInput('Show top losers') }}
            >
              <Box>
                <Text>Show top losers</Text>
                <Text fontSize="xs" color="gray.500">View worst performing tokens</Text>
              </Box>
            </MenuItem>
            <MenuItem
              bgColor={'blackAlpha.50'}
              _hover={{ bg: 'whiteAlpha.100' }}
              onClick={() => { setInput('Show top gainers') }}
            >
              <Box>
                <Text>Show top gainers</Text>
                <Text fontSize="xs" color="gray.500">View best performing tokens</Text>
              </Box>
            </MenuItem>
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton
            color="glass"
            _hover={{ bg: 'whiteAlpha.100' }}
            _active={{ bg: 'whiteAlpha.100' }}
            as={Button}
            variant="ghost"
            rightIcon={<ChevronDown size={16} />}
            leftIcon={<ArrowLeftRight size={16} />}
            fontWeight="normal"
          >
            Trading
          </MenuButton>
          <MenuList
            className="glass"
            backdropFilter="blur(12px)"
            boxShadow="0 4px 12px rgba(0, 0, 0, 0.5)"
          >

            <MenuItem
              bgColor={'blackAlpha.50'}
              _hover={{ bg: 'whiteAlpha.100' }}
              onClick={() => { setInput('Swap 1 ETH to USDC') }}
            >
              <Box>
                <Text>Swap 1 ETH to USDC</Text>
                <Text fontSize="xs" color="gray.500">Execute token swap</Text>
              </Box>
            </MenuItem>
            <MenuItem
              bgColor={'blackAlpha.50'}
              _hover={{ bg: 'whiteAlpha.100' }}
              onClick={() => { setInput('Bridge 1 USDC from base to ethereum') }}
            >
              <Box>
                <Text>Bridge 1 USDC from base to ethereum</Text>
                <Text fontSize="xs" color="gray.500">Execute token bridge</Text>
              </Box>
            </MenuItem>
            <MenuItem
              bgColor={'blackAlpha.50'}
              _hover={{ bg: 'whiteAlpha.100' }}
              onClick={() => { setInput('Transfer 10 usdc to dexfin.eth') }}
            >
              <Box>
                <Text>Transfer 10 usdc to dexfin.eth</Text>
                <Text fontSize="xs" color="gray.500">Execute token transfer</Text>
              </Box>
            </MenuItem>
            <MenuItem
              bgColor={'blackAlpha.50'}
              _hover={{ bg: 'whiteAlpha.100' }}
              onClick={() => { setInput('Buy 100$ of BTC') }}
            >
              <Box>
                <Text>Buy 100$ of BTC</Text>
                <Text fontSize="xs" color="gray.500">Purchase Bitcoin</Text>
              </Box>
            </MenuItem>
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton
            color="glass"
            _hover={{ bg: 'whiteAlpha.100' }}
            _active={{ bg: 'whiteAlpha.100' }}
            as={Button}
            variant="ghost"
            rightIcon={<ChevronDown size={16} />}
            leftIcon={<Bot size={16} />}
            fontWeight="normal"
          >
            DeFi
          </MenuButton>
          <MenuList
            className="glass"
            backdropFilter="blur(12px)"
            boxShadow="0 4px 12px rgba(0, 0, 0, 0.5)"
          >
            <Box px={4} py={2} role="button" onClick={() => setShowYieldActions(!showYieldActions)} cursor="pointer" _hover={{ bg: "glass.100" }} rounded="md">
              <HStack justify="space-between">
                <Text color="gray.400" fontSize="xs" fontWeight="medium">YIELD ACTIONS</Text>
                <Text color="gray.500" fontSize="xs">{showYieldActions ? 'Show less' : 'Show more'}</Text>
              </HStack>
            </Box>

            {showYieldActions && (
              <>
                <MenuItem
                  rounded="md"
                  px={4}
                  py={2}
                  bgColor={'blackAlpha.50'}
                  _hover={{ bg: 'whiteAlpha.100' }}
                  onClick={() => { setInput('Find Best Yield') }}
                >
                  <Box>
                    <Text >Find Best Yield</Text>
                    <Text fontSize="xs" color="gray.500">Get yield recommendations</Text>
                  </Box>
                </MenuItem>
                <MenuItem
                  rounded="md"
                  px={4}
                  py={2}
                  bgColor={'blackAlpha.50'}
                  _hover={{ bg: 'whiteAlpha.100' }}
                  onClick={() => { setInput('Withdraw 2 USDC on Aave') }}
                >
                  <Box>
                    <Text >Withdraw 2 USDC on Aave</Text>
                    <Text fontSize="xs" color="gray.500">Remove deposited tokens</Text>
                  </Box>
                </MenuItem>
                <MenuItem
                  rounded="md"
                  px={4}
                  py={2}
                  bgColor={'blackAlpha.50'}
                  _hover={{ bg: 'whiteAlpha.100' }}
                  onClick={() => { setInput('Deposit 3 USDC on Aave') }}
                >
                  <Box>
                    <Text >Deposit 3 USDC on Aave</Text>
                    <Text fontSize="xs" color="gray.500">Earn lending interest</Text>
                  </Box>
                </MenuItem>
                <MenuItem
                  rounded="md"
                  px={4}
                  py={2}
                  bgColor={'blackAlpha.50'}
                  _hover={{ bg: 'whiteAlpha.100' }}
                  onClick={() => { setInput('Borrow 3 USDC on Aave') }}
                >
                  <Box>
                    <Text >Borrow 3 USDC on Aave</Text>
                    <Text fontSize="xs" color="gray.500">Take out a loan</Text>
                  </Box>
                </MenuItem>
                <MenuItem
                  rounded="md"
                  px={4}
                  py={2}
                  bgColor={'blackAlpha.50'}
                  _hover={{ bg: 'whiteAlpha.100' }}
                  onClick={() => { setInput('Repay 3 USDC on Aave') }}
                >
                  <Box>
                    <Text >Repay 3 USDC on Aave</Text>
                    <Text fontSize="xs" color="gray.500">Pay back borrowed tokens</Text>
                  </Box>
                </MenuItem>
              </>
            )}
            <Box px={4} py={2} role="button" onClick={() => setShowStakingActions(!showStakingActions)} cursor="pointer" _hover={{ bg: "glass.100" }} rounded="md">
              <HStack justify="space-between">
                <Text color="gray.400" fontSize="xs" fontWeight="medium">STAKING ACTIONS</Text>
                <Text color="gray.500" fontSize="xs">{showStakingActions ? 'Show less' : 'Show more'}</Text>
              </HStack>
            </Box>

            {showStakingActions && (
              <>
                <MenuItem
                  rounded="md"
                  px={4}
                  py={2}
                  bgColor={'blackAlpha.50'}
                  _hover={{ bg: 'whiteAlpha.100' }}
                  onClick={() => { setInput('Stake 0.1 ETH on Lido') }}
                >
                  <Box>
                    <Text >Stake 0.1 ETH on Lido</Text>
                    <Text fontSize="xs" color="gray.500">Earn staking rewards</Text>
                  </Box>
                </MenuItem>
                <MenuItem
                  rounded="md"
                  px={4}
                  py={2}
                  bgColor={'blackAlpha.50'}
                  _hover={{ bg: 'whiteAlpha.100' }}
                  onClick={() => { setInput('Unstake 0.1 ETH from Lido') }}
                >
                  <Box>
                    <Text >Unstake 0.1 ETH from Lido</Text>
                    <Text fontSize="xs" color="gray.500">Withdraw staked tokens</Text>
                  </Box>
                </MenuItem>
                <MenuItem
                  rounded="md"
                  px={4}
                  py={2}
                  bgColor={'blackAlpha.50'}
                  _hover={{ bg: 'whiteAlpha.100' }}
                  onClick={() => { setInput('Stake 0.1 ETH on Rocket Pool') }}
                >
                  <Box>
                    <Text >Stake 0.1 ETH on Rocket Pool</Text>
                    <Text fontSize="xs" color="gray.500">Earn staking rewards</Text>
                  </Box>
                </MenuItem>
                <MenuItem
                  rounded="md"
                  px={4}
                  py={2}
                  bgColor={'blackAlpha.50'}
                  _hover={{ bg: 'whiteAlpha.100' }}
                  onClick={() => { setInput('Unstake 0.1 ETH from Rocket Pool') }}
                >
                  <Box>
                    <Text >Unstake 0.1 ETH from Rocket Pool</Text>
                    <Text fontSize="xs" color="gray.500">Withdraw staked tokens</Text>
                  </Box>
                </MenuItem>
              </>
            )}
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton
            color="glass"
            _hover={{ bg: 'whiteAlpha.100' }}
            _active={{ bg: 'whiteAlpha.100' }}
            as={Button}
            variant="ghost"
            rightIcon={<ChevronDown size={16} />}
            leftIcon={<Globe size={16} />}
            fontWeight="normal"
          >
            ENS
          </MenuButton>
          <MenuList
            className="glass"
            backdropFilter="blur(12px)"
            boxShadow="0 4px 12px rgba(0, 0, 0, 0.5)"
          >
            <MenuItem
              bgColor={'blackAlpha.50'}
              _hover={{ bg: 'whiteAlpha.100' }}
              onClick={() => { setInput('Register dexfin.eth') }}
            >
              <Box>
                <Text>Register dexfin.eth</Text>
                <Text fontSize="xs" color="gray.500">Register Name</Text>
              </Box>
            </MenuItem>

            <MenuItem
              bgColor={'blackAlpha.50'}
              _hover={{ bg: 'whiteAlpha.100' }}
              onClick={() => { setInput('Renew dexfin.eth for 1 month') }}
            >
              <Box>
                <Text>Renew dexfin.eth for 1 month</Text>
                <Text fontSize="xs" color="gray.500">Renew ENS domains</Text>
              </Box>
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
      <div className="flex items-center gap-2">

        <button
          onClick={onOpen}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
        >
          <LucideMenu className="w-4 h-4" />
        </button>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
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

      <Drawer isOpen={isOpen} placement="top" onClose={onDrawerClose} size="xs">
        <DrawerOverlay>
          <DrawerContent className="glass">
            <DrawerCloseButton />
            <DrawerHeader>Commands</DrawerHeader>
            <DrawerBody>
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  color="glass"
                  _hover={{ bg: 'whiteAlpha.100' }}
                  _active={{ bg: 'whiteAlpha.100' }}
                  rightIcon={<ChevronDown size={16} />}
                  leftIcon={<LineChart size={16} />}
                  fontWeight="normal"
                >
                  Market Analysis
                </MenuButton>
                <MenuList
                  className='glass'
                  backdropFilter="blur(12px)"
                  boxShadow="0 4px 12px rgba(0, 0, 0, 0.5)"
                >
                  <MenuItem
                    bgColor={'blackAlpha.50'}
                    _hover={{ bg: 'whiteAlpha.100' }}
                    onClick={() => { setInput('What is the Bitcoin price?'); onDrawerClose(); }}
                  >
                    <Box>
                      <Text>What is the BTC price?</Text>
                      <Text fontSize="xs" color="gray.500">Get current Bitcoin price</Text>
                    </Box>
                  </MenuItem>

                  <MenuItem
                    bgColor={'blackAlpha.50'}
                    _hover={{ bg: 'whiteAlpha.100' }}
                    onClick={() => { setInput('Market News'); onDrawerClose(); }}
                  >
                    <Box>
                      <Text>Market News</Text>
                      <Text fontSize="xs" color="gray.500">Latest news with sentiment</Text>
                    </Box>
                  </MenuItem>
                  <MenuItem
                    bgColor={'blackAlpha.50'}
                    _hover={{ bg: 'whiteAlpha.100' }}
                    onClick={() => { setInput('ETH Technical Analysis'); onDrawerClose(); }}
                  >
                    <Box>
                      <Text>ETH Technical Analysis</Text>
                      <Text fontSize="xs" color="gray.500">Get detailed ETH analysis</Text>
                    </Box>
                  </MenuItem>
                  <MenuItem
                    bgColor={'blackAlpha.50'}
                    _hover={{ bg: 'whiteAlpha.100' }}
                    onClick={() => { setInput('Analyze ETH market sentiment'); onDrawerClose(); }}
                  >
                    <Box>
                      <Text>Analyze ETH market sentiment</Text>
                      <Text fontSize="xs" color="gray.500">Get sentiment analysis for ETH</Text>
                    </Box>
                  </MenuItem>
                  <MenuItem
                    bgColor={'blackAlpha.50'}
                    _hover={{ bg: 'whiteAlpha.100' }}
                    onClick={() => { setInput('Show trending coins'); onDrawerClose(); }}
                  >
                    <Box>
                      <Text>Show trending coins</Text>
                      <Text fontSize="xs" color="gray.500">View most trending coins</Text>
                    </Box>
                  </MenuItem>
                  <MenuItem
                    bgColor={'blackAlpha.50'}
                    _hover={{ bg: 'whiteAlpha.100' }}
                    onClick={() => { setInput('Show top losers'); onDrawerClose(); }}
                  >
                    <Box>
                      <Text>Show top losers</Text>
                      <Text fontSize="xs" color="gray.500">View worst performing tokens</Text>
                    </Box>
                  </MenuItem>
                  <MenuItem
                    bgColor={'blackAlpha.50'}
                    _hover={{ bg: 'whiteAlpha.100' }}
                    onClick={() => { setInput('Show top gainers'); onDrawerClose(); }}
                  >
                    <Box>
                      <Text>Show top gainers</Text>
                      <Text fontSize="xs" color="gray.500">View best performing tokens</Text>
                    </Box>
                  </MenuItem>
                </MenuList>
              </Menu>

              <Menu>
                <MenuButton
                  color="glass"
                  _hover={{ bg: 'whiteAlpha.100' }}
                  _active={{ bg: 'whiteAlpha.100' }}
                  as={Button}
                  variant="ghost"
                  rightIcon={<ChevronDown size={16} />}
                  leftIcon={<ArrowLeftRight size={16} />}
                  fontWeight="normal"
                >
                  Trading
                </MenuButton>
                <MenuList
                  className="glass"
                  backdropFilter="blur(12px)"
                  boxShadow="0 4px 12px rgba(0, 0, 0, 0.5)"
                >

                  <MenuItem
                    bgColor={'blackAlpha.50'}
                    _hover={{ bg: 'whiteAlpha.100' }}
                    onClick={() => { setInput('Swap 1 ETH to USDC'); onDrawerClose(); }}
                  >
                    <Box>
                      <Text>Swap 1 ETH to USDC</Text>
                      <Text fontSize="xs" color="gray.500">Execute token swap</Text>
                    </Box>
                  </MenuItem>
                  <MenuItem
                    bgColor={'blackAlpha.50'}
                    _hover={{ bg: 'whiteAlpha.100' }}
                    onClick={() => { setInput('Bridge 1 USDC from base to ethereum'); onDrawerClose(); }}
                  >
                    <Box>
                      <Text>Bridge 1 USDC from base to ethereum</Text>
                      <Text fontSize="xs" color="gray.500">Execute token bridge</Text>
                    </Box>
                  </MenuItem>
                  <MenuItem
                    bgColor={'blackAlpha.50'}
                    _hover={{ bg: 'whiteAlpha.100' }}
                    onClick={() => { setInput('Transfer 10 usdc to dexfin.eth'); onDrawerClose(); }}
                  >
                    <Box>
                      <Text>Transfer 10 usdc to dexfin.eth</Text>
                      <Text fontSize="xs" color="gray.500">Execute token transfer</Text>
                    </Box>
                  </MenuItem>
                  <MenuItem
                    bgColor={'blackAlpha.50'}
                    _hover={{ bg: 'whiteAlpha.100' }}
                    onClick={() => { setInput('Buy 100$ of BTC'); onDrawerClose(); }}
                  >
                    <Box>
                      <Text>Buy 100$ of BTC</Text>
                      <Text fontSize="xs" color="gray.500">Purchase Bitcoin</Text>
                    </Box>
                  </MenuItem>
                </MenuList>
              </Menu>

              <Menu>
                <MenuButton
                  color="glass"
                  _hover={{ bg: 'whiteAlpha.100' }}
                  _active={{ bg: 'whiteAlpha.100' }}
                  as={Button}
                  variant="ghost"
                  rightIcon={<ChevronDown size={16} />}
                  leftIcon={<Bot size={16} />}
                  fontWeight="normal"
                >
                  DeFi
                </MenuButton>
                <MenuList
                  className="glass"
                  backdropFilter="blur(12px)"
                  boxShadow="0 4px 12px rgba(0, 0, 0, 0.5)"
                >
                  <Box px={4} py={2} role="button" onClick={() => setShowYieldActions(!showYieldActions)} cursor="pointer" _hover={{ bg: "glass.100" }} rounded="md">
                    <HStack justify="space-between">
                      <Text color="gray.400" fontSize="xs" fontWeight="medium">YIELD ACTIONS</Text>
                      <Text color="gray.500" fontSize="xs">{showYieldActions ? 'Show less' : 'Show more'}</Text>
                    </HStack>
                  </Box>

                  {showYieldActions && (
                    <>
                      <MenuItem
                        rounded="md"
                        px={4}
                        py={2}
                        bgColor={'blackAlpha.50'}
                        _hover={{ bg: 'whiteAlpha.100' }}
                        onClick={() => { setInput('Find Best Yield'); onDrawerClose(); }}
                      >
                        <Box>
                          <Text >Find Best Yield</Text>
                          <Text fontSize="xs" color="gray.500">Get yield recommendations</Text>
                        </Box>
                      </MenuItem>
                      <MenuItem
                        rounded="md"
                        px={4}
                        py={2}
                        bgColor={'blackAlpha.50'}
                        _hover={{ bg: 'whiteAlpha.100' }}
                        onClick={() => { setInput('Withdraw 2 USDC on Aave'); onDrawerClose(); }}
                      >
                        <Box>
                          <Text >Withdraw 2 USDC on Aave</Text>
                          <Text fontSize="xs" color="gray.500">Remove deposited tokens</Text>
                        </Box>
                      </MenuItem>
                      <MenuItem
                        rounded="md"
                        px={4}
                        py={2}
                        bgColor={'blackAlpha.50'}
                        _hover={{ bg: 'whiteAlpha.100' }}
                        onClick={() => { setInput('Deposit 3 USDC on Aave'); onDrawerClose(); }}
                      >
                        <Box>
                          <Text >Deposit 3 USDC on Aave</Text>
                          <Text fontSize="xs" color="gray.500">Earn lending interest</Text>
                        </Box>
                      </MenuItem>
                      <MenuItem
                        rounded="md"
                        px={4}
                        py={2}
                        bgColor={'blackAlpha.50'}
                        _hover={{ bg: 'whiteAlpha.100' }}
                        onClick={() => { setInput('Borrow 3 USDC on Aave'); onDrawerClose(); }}
                      >
                        <Box>
                          <Text >Borrow 3 USDC on Aave</Text>
                          <Text fontSize="xs" color="gray.500">Take out a loan</Text>
                        </Box>
                      </MenuItem>
                      <MenuItem
                        rounded="md"
                        px={4}
                        py={2}
                        bgColor={'blackAlpha.50'}
                        _hover={{ bg: 'whiteAlpha.100' }}
                        onClick={() => { setInput('Repay 3 USDC on Aave'); onDrawerClose(); }}
                      >
                        <Box>
                          <Text >Repay 3 USDC on Aave</Text>
                          <Text fontSize="xs" color="gray.500">Pay back borrowed tokens</Text>
                        </Box>
                      </MenuItem>
                    </>
                  )}
                  <Box px={4} py={2} role="button" onClick={() => setShowStakingActions(!showStakingActions)} cursor="pointer" _hover={{ bg: "glass.100" }} rounded="md">
                    <HStack justify="space-between">
                      <Text color="gray.400" fontSize="xs" fontWeight="medium">STAKING ACTIONS</Text>
                      <Text color="gray.500" fontSize="xs">{showStakingActions ? 'Show less' : 'Show more'}</Text>
                    </HStack>
                  </Box>

                  {showStakingActions && (
                    <>
                      <MenuItem
                        rounded="md"
                        px={4}
                        py={2}
                        bgColor={'blackAlpha.50'}
                        _hover={{ bg: 'whiteAlpha.100' }}
                        onClick={() => { setInput('Stake 0.1 ETH on Lido'); onDrawerClose(); }}
                      >
                        <Box>
                          <Text >Stake 0.1 ETH on Lido</Text>
                          <Text fontSize="xs" color="gray.500">Earn staking rewards</Text>
                        </Box>
                      </MenuItem>
                      <MenuItem
                        rounded="md"
                        px={4}
                        py={2}
                        bgColor={'blackAlpha.50'}
                        _hover={{ bg: 'whiteAlpha.100' }}
                        onClick={() => { setInput('Unstake 0.1 ETH from Lido'); onDrawerClose(); }}
                      >
                        <Box>
                          <Text >Unstake 0.1 ETH from Lido</Text>
                          <Text fontSize="xs" color="gray.500">Withdraw staked tokens</Text>
                        </Box>
                      </MenuItem>
                      <MenuItem
                        rounded="md"
                        px={4}
                        py={2}
                        bgColor={'blackAlpha.50'}
                        _hover={{ bg: 'whiteAlpha.100' }}
                        onClick={() => { setInput('Stake 0.1 ETH on Rocket Pool'); onDrawerClose(); }}
                      >
                        <Box>
                          <Text >Stake 0.1 ETH on Rocket Pool</Text>
                          <Text fontSize="xs" color="gray.500">Earn staking rewards</Text>
                        </Box>
                      </MenuItem>
                      <MenuItem
                        rounded="md"
                        px={4}
                        py={2}
                        bgColor={'blackAlpha.50'}
                        _hover={{ bg: 'whiteAlpha.100' }}
                        onClick={() => { setInput('Unstake 0.1 ETH from Rocket Pool'); onDrawerClose(); }}
                      >
                        <Box>
                          <Text >Unstake 0.1 ETH from Rocket Pool</Text>
                          <Text fontSize="xs" color="gray.500">Withdraw staked tokens</Text>
                        </Box>
                      </MenuItem>
                    </>
                  )}
                </MenuList>
              </Menu>
              <Menu>
                <MenuButton
                  color="glass"
                  _hover={{ bg: 'whiteAlpha.100' }}
                  _active={{ bg: 'whiteAlpha.100' }}
                  as={Button}
                  variant="ghost"
                  rightIcon={<ChevronDown size={16} />}
                  leftIcon={<Globe size={16} />}
                  fontWeight="normal"
                >
                  ENS
                </MenuButton>
                <MenuList
                  className="glass"
                  backdropFilter="blur(12px)"
                  boxShadow="0 4px 12px rgba(0, 0, 0, 0.5)"
                >
                  <MenuItem
                    bgColor={'blackAlpha.50'}
                    _hover={{ bg: 'whiteAlpha.100' }}
                    onClick={() => { setInput('Register dexfin.eth'); onDrawerClose(); }}
                  >
                    <Box>
                      <Text>Register dexfin.eth</Text>
                      <Text fontSize="xs" color="gray.500">Register Name</Text>
                    </Box>
                  </MenuItem>

                  <MenuItem
                    bgColor={'blackAlpha.50'}
                    _hover={{ bg: 'whiteAlpha.100' }}
                    onClick={() => { setInput('Renew dexfin.eth for 1 month'); onDrawerClose(); }}
                  >
                    <Box>
                      <Text>Renew dexfin.eth for 1 month</Text>
                      <Text fontSize="xs" color="gray.500">Renew ENS domains</Text>
                    </Box>
                  </MenuItem>
                </MenuList>
              </Menu>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </div>
  );
}