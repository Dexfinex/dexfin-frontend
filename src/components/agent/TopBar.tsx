import {
  Bot,
  Maximize2,
  Minimize2,
  X,
  ChevronDown,
  LineChart,
  IconComponent
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

} from '@chakra-ui/react';

interface TopBarProps {
  processCommand: (command: string, address: string, chainId: number | undefined) => void;
  address: string;
  chainId: number | undefined;
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
  onClose: () => void;
}

export function TopBar({ processCommand, address, chainId, isFullscreen, setIsFullscreen, onClose }: TopBarProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/10">
      <div className="flex items-center gap-3">
        <Bot className="w-5 h-5" />
        <h2 className="text-xl font-semibold">AI Agent</h2>
      </div>
      <HStack spacing={6}>
        <Menu>
          <MenuButton
            as={Button}
            variant="ghost"
            rightIcon={<ChevronDown size={16} />}
            leftIcon={<LineChart size={16} />}
            fontWeight="normal"

          >
            Market Analysis
          </MenuButton>
          <MenuList
            bgColor={'blackAlpha.50'}
            borderColor="whiteAlpha.100"
            backdropFilter="blur(12px)"
            boxShadow="0 4px 12px rgba(0, 0, 0, 0.5)"
          >
            <MenuItem
              bgColor={'blackAlpha.50'}
              _hover={{ bg: 'whiteAlpha.100' }}
              onClick={() => { processCommand('What is the Bitcoin price?', address, chainId) }}
            >
              <Box>
                <Text>What is the BTC price?</Text>
                <Text fontSize="xs" color="gray.500">Get current Bitcoin price</Text>
              </Box>
            </MenuItem>

            <MenuItem
              bgColor={'blackAlpha.50'}
              _hover={{ bg: 'whiteAlpha.100' }}
              onClick={() => { processCommand('Show trending tokens', address, chainId) }}

            >
              <Box>
                <Text>Show trending tokens</Text>
                <Text fontSize="xs" color="gray.500">View most trending tokens</Text>
              </Box>
            </MenuItem>

          </MenuList>
        </Menu>

        <Menu>
          <MenuButton
            as={Button}
            variant="ghost"
            rightIcon={<ChevronDown size={16} />}
            leftIcon={<LineChart size={16} />}
            fontWeight="normal"

          >
            Trading
          </MenuButton>
          <MenuList
            bgColor={'blackAlpha.50'}
            borderColor="whiteAlpha.100"
            backdropFilter="blur(12px)"
            boxShadow="0 4px 12px rgba(0, 0, 0, 0.5)"
          >
            <MenuItem
              bgColor={'blackAlpha.50'}
              _hover={{ bg: 'whiteAlpha.100' }}
              onClick={() => { processCommand('Swap 1 ETH to USDC', address, chainId) }}
            >
              <Box>
                <Text>Swap 1 ETH to USDC</Text>
                <Text fontSize="xs" color="gray.500">Execute token swap</Text>
              </Box>
            </MenuItem>

            <MenuItem
              bgColor={'blackAlpha.50'}
              _hover={{ bg: 'whiteAlpha.100' }}
              onClick={() => { processCommand('Buy 0.1 BTC', address, chainId) }}

            >
              <Box>
                <Text>Buy 0.1 BTC</Text>
                <Text fontSize="xs" color="gray.500">Purchase Bitcoin</Text>
              </Box>
            </MenuItem>

          </MenuList>
        </Menu>

      </HStack>
      <div className="flex items-center gap-2">
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
    </div>
  )

}