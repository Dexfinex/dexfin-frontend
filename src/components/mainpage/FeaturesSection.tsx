import React from 'react';
import {
  Box,
  Container,
  Text,
  SimpleGrid,
  HStack,
  Icon,
  VStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  ArrowLeftRight,
  ShoppingCart,
  TrendingUp,
  Coins,
  Shield,
  CreditCard,
  MessageCircle,
  Bot,
  BarChart2,
  Wallet,
  Layout,
  Gamepad2,
} from 'lucide-react';
import SwapPreview from './SwapPreview';
import TokenCartPreview from './TokenCartPreview';
import LendBorrowPreview from './LendBorrowPreview';
import StakingPreview from './StakingPreview';
import BuyCryptoPreview from './BuyCryptoPreview';
import ChatPreview from './ChatPreview';
import AIChatPreview from './AIChatPreview';
import MarketDataPreview from './MarketDataPreview';
import WalletPreview from './WalletPreview';
import CustomizationPreview from './CustomizationPreview';
import PlayEarnPreview from './PlayEarnPreview';

const MotionBox = motion(Box);

const FeaturesSection = () => {
  return (
    <Box
      py={20}
      position="relative"
      overflow="hidden"
      bg="rgba(0, 12, 24, 0.98)"
      backdropFilter="blur(10px)"
    >
      <Container maxW="container.xl">
        <VStack spacing={12}>
          {/* Header */}
          <Box
            bg="rgba(0, 0, 0, 0.4)"
            p={6}
            borderRadius="xl"
            textAlign="center"
            backdropFilter="blur(10px)"
            border="1px solid rgba(255, 255, 255, 0.1)"
            w="full"
            mb={8}
          >
            <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="bold" mb={3} color="white">
              Multi-chain DeFi in One Platform
            </Text>
            <Text fontSize={{ base: 'md', md: 'lg' }} color="whiteAlpha.800">
              Everything you need in one streamlined, secure, and unified interface.
            </Text>
          </Box>

          {/* First Row - 3x1 Grid */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
            {/* Instant Swaps */}
            <MotionBox whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Box
                bg="rgba(0, 0, 0, 0.4)"
                p={6}
                borderRadius="xl"
                h="full"
                border="1px solid rgba(255, 255, 255, 0.1)"
                position="relative"
                overflow="hidden"
                backdropFilter="blur(10px)"
              >
                <VStack spacing={4} h="full">
                  <HStack spacing={3} w="full">
                    <Box p={2} borderRadius="lg" bg="rgba(72, 187, 120, 0.2)">
                      <Icon as={ArrowLeftRight} color="#48BB78" boxSize={6} />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="lg" fontWeight="bold" color="white">Fast Swaps</Text>
                      <Text fontSize="sm" color="whiteAlpha.800">Swap any token to any token</Text>
                    </VStack>
                  </HStack>
                  <Box flex={1} w="full">
                    <SwapPreview />
                  </Box>
                </VStack>
              </Box>
            </MotionBox>

            {/* Token Cart */}
            <MotionBox whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Box
                bg="rgba(0, 0, 0, 0.4)"
                p={6}
                borderRadius="xl"
                h="full"
                border="1px solid rgba(255, 255, 255, 0.1)"
                position="relative"
                overflow="hidden"
                backdropFilter="blur(10px)"
              >
                <VStack spacing={4} h="full">
                  <HStack spacing={3} w="full">
                    <Box p={2} borderRadius="lg" bg="rgba(246, 173, 85, 0.2)">
                      <Icon as={ShoppingCart} color="#F6AD55" boxSize={6} />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="lg" fontWeight="bold" color="white">Token Cart</Text>
                      <Text fontSize="sm" color="whiteAlpha.800">Buy multiple tokens at once</Text>
                    </VStack>
                  </HStack>
                  <Box flex={1} w="full">
                    <TokenCartPreview />
                  </Box>
                </VStack>
              </Box>
            </MotionBox>

            {/* Buy Crypto */}
            <MotionBox whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Box
                bg="rgba(0, 0, 0, 0.4)"
                p={6}
                borderRadius="xl"
                h="full"
                border="1px solid rgba(255, 255, 255, 0.1)"
                position="relative"
                overflow="hidden"
                backdropFilter="blur(10px)"
              >
                <VStack spacing={4} h="full">
                  <HStack spacing={3} w="full">
                    <Box p={2} borderRadius="lg" bg="rgba(237, 100, 166, 0.2)">
                      <Icon as={CreditCard} color="#ED64A6" boxSize={6} />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="lg" fontWeight="bold" color="white">Buy Crypto</Text>
                      <Text fontSize="sm" color="whiteAlpha.800">Purchase with card</Text>
                    </VStack>
                  </HStack>
                  <Box flex={1} w="full">
                    <BuyCryptoPreview />
                  </Box>
                </VStack>
              </Box>
            </MotionBox>
          </SimpleGrid>

          {/* AI Assistant (Full Width) */}
          <MotionBox whileHover={{ y: -5 }} transition={{ duration: 0.2 }} w="full">
            <Box
              bg="rgba(0, 0, 0, 0.4)"
              p={6}
              borderRadius="xl"
              border="1px solid rgba(255, 255, 255, 0.1)"
              position="relative"
              overflow="hidden"
              backdropFilter="blur(10px)"
              h="500px"
            >
              <VStack spacing={4} h="full">
                <HStack spacing={3} w="full">
                  <Box p={2} borderRadius="lg" bg="rgba(79, 209, 197, 0.2)">
                    <Icon as={Bot} color="#4FD1C5" boxSize={6} />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="lg" fontWeight="bold" color="white">AI Assistant</Text>
                    <Text fontSize="sm" color="whiteAlpha.800">Smart insights and text/voice DeFi operations</Text>
                  </VStack>
                </HStack>
                <Box flex={1} w="full">
                  <AIChatPreview />
                </Box>
              </VStack>
            </Box>
          </MotionBox>

          {/* Advanced Trading (Full Width) */}
          {/* <MotionBox whileHover={{ y: -5 }} transition={{ duration: 0.2 }} w="full">
            <Box
              bg="rgba(0, 0, 0, 0.4)"
              p={6}
              borderRadius="xl"
              border="1px solid rgba(255, 255, 255, 0.1)"
              position="relative"
              overflow="hidden"
              backdropFilter="blur(10px)"
              h="400px"
            >
              <VStack spacing={4} h="full">
                <HStack spacing={3} w="full">
                  <Box p={2} borderRadius="lg" bg="rgba(66, 153, 225, 0.2)">
                    <Icon as={TrendingUp} color="#4299E1" boxSize={6} />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="lg" fontWeight="bold" color="white">Advanced Trading</Text>
                    <Text fontSize="sm" color="whiteAlpha.800">Professional trading interface</Text>
                  </VStack>
                </HStack>
                <Box flex={1} w="full">
                  <TradingChartPreview />
                </Box>
              </VStack>
            </Box>
          </MotionBox> */}

          {/* Second Row - 3x1 Grid */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
            {/* Yield Farming */}
            <MotionBox whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Box
                bg="rgba(0, 0, 0, 0.4)"
                p={6}
                borderRadius="xl"
                h="full"
                border="1px solid rgba(255, 255, 255, 0.1)"
                position="relative"
                overflow="hidden"
                backdropFilter="blur(10px)"
              >
                <VStack spacing={4} h="full">
                  <HStack spacing={3} w="full">
                    <Box p={2} borderRadius="lg" bg="rgba(159, 122, 234, 0.2)">
                      <Icon as={Coins} color="#9F7AEA" boxSize={6} />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="lg" fontWeight="bold" color="white">Yield Farming</Text>
                      <Text fontSize="sm" color="whiteAlpha.800">Maximize your returns</Text>
                    </VStack>
                  </HStack>
                  <Box flex={1} w="full">
                    <LendBorrowPreview />
                  </Box>
                </VStack>
              </Box>
            </MotionBox>

            {/* Secure Staking */}
            <MotionBox whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Box
                bg="rgba(0, 0, 0, 0.4)"
                p={6}
                borderRadius="xl"
                h="full"
                border="1px solid rgba(255, 255, 255, 0.1)"
                position="relative"
                overflow="hidden"
                backdropFilter="blur(10px)"
              >
                <VStack spacing={4} h="full">
                  <HStack spacing={3} w="full">
                    <Box p={2} borderRadius="lg" bg="rgba(72, 187, 120, 0.2)">
                      <Icon as={Shield} color="#48BB78" boxSize={6} />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="lg" fontWeight="bold" color="white">Secure Staking</Text>
                      <Text fontSize="sm" color="whiteAlpha.800">Earn passive income</Text>
                    </VStack>
                  </HStack>
                  <Box flex={1} w="full">
                    <StakingPreview />
                  </Box>
                </VStack>
              </Box>
            </MotionBox>

            {/* Market Data */}
            <MotionBox whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Box
                bg="rgba(0, 0, 0, 0.4)"
                p={6}
                borderRadius="xl"
                h="full"
                border="1px solid rgba(255, 255, 255, 0.1)"
                position="relative"
                overflow="hidden"
                backdropFilter="blur(10px)"
              >
                <VStack spacing={4} h="full">
                  <HStack spacing={3} w="full">
                    <Box p={2} borderRadius="lg" bg="rgba(66, 153, 225, 0.2)">
                      <Icon as={BarChart2} color="#4299E1" boxSize={6} />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="lg" fontWeight="bold" color="white">Market Data</Text>
                      <Text fontSize="sm" color="whiteAlpha.800">Real-time analytics</Text>
                    </VStack>
                  </HStack>
                  <Box flex={1} w="full">
                    <MarketDataPreview />
                  </Box>
                </VStack>
              </Box>
            </MotionBox>
          </SimpleGrid>


          {/* Community Chat (Full Width) */}
          <MotionBox whileHover={{ y: -5 }} transition={{ duration: 0.2 }} w="full">
            <Box
              bg="rgba(0, 0, 0, 0.4)"
              p={6}
              borderRadius="xl"
              border="1px solid rgba(255, 255, 255, 0.1)"
              position="relative"
              overflow="hidden"
              backdropFilter="blur(10px)"
              h="450px"
            >
              <VStack spacing={4} h="full">
                <HStack spacing={3} w="full">
                  <Box p={2} borderRadius="lg" bg="rgba(237, 100, 166, 0.2)">
                    <Icon as={MessageCircle} color="#ED64A6" boxSize={6} />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="lg" fontWeight="bold" color="white">Community Chat</Text>
                    <Text fontSize="sm" color="whiteAlpha.800">Connect with traders</Text>
                  </VStack>
                </HStack>
                <Box flex={1} w="full">
                  <ChatPreview />
                </Box>
              </VStack>
            </Box>
          </MotionBox>
          {/* Third Row - 3x1 Grid */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">

            {/* Secure Wallet */}
            <MotionBox whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Box
                bg="rgba(0, 0, 0, 0.4)"
                p={6}
                borderRadius="xl"
                h="full"
                border="1px solid rgba(255, 255, 255, 0.1)"
                position="relative"
                overflow="hidden"
                backdropFilter="blur(10px)"
              >
                <VStack spacing={4} h="full">
                  <HStack spacing={3} w="full">
                    <Box p={2} borderRadius="lg" bg="rgba(72, 187, 120, 0.2)">
                      <Icon as={Wallet} color="#48BB78" boxSize={6} />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="lg" fontWeight="bold" color="white">Secure Wallet</Text>
                      <Text fontSize="sm" color="whiteAlpha.800">Your secure onchain account</Text>
                    </VStack>
                  </HStack>
                  <Box flex={1} w="full">
                    <WalletPreview />
                  </Box>
                </VStack>
              </Box>
            </MotionBox>

            {/* Customization */}
            <MotionBox whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Box
                bg="rgba(0, 0, 0, 0.4)"
                p={6}
                borderRadius="xl"
                h="full"
                border="1px solid rgba(255, 255, 255, 0.1)"
                position="relative"
                overflow="hidden"
                backdropFilter="blur(10px)"
              >
                <VStack spacing={4} h="full">
                  <HStack spacing={3} w="full">
                    <Box p={2} borderRadius="lg" bg="rgba(159, 122, 234, 0.2)">
                      <Icon as={Layout} color="#9F7AEA" boxSize={6} />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="lg" fontWeight="bold" color="white">Customization</Text>
                      <Text fontSize="sm" color="whiteAlpha.800">Personalize your workspace</Text>
                    </VStack>
                  </HStack>
                  <Box flex={1} w="full">
                    <CustomizationPreview />
                  </Box>
                </VStack>
              </Box>
            </MotionBox>

            {/* Play & Earn */}
            <MotionBox whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Box
                bg="rgba(0, 0, 0, 0.4)"
                p={6}
                borderRadius="xl"
                h="full"
                border="1px solid rgba(255, 255, 255, 0.1)"
                position="relative"
                overflow="hidden"
                backdropFilter="blur(10px)"
              >
                <VStack spacing={4} h="full">
                  <HStack spacing={3} w="full">
                    <Box p={2} borderRadius="lg" bg="rgba(246, 173, 85, 0.2)">
                      <Icon as={Gamepad2} color="#F6AD55" boxSize={6} />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="lg" fontWeight="bold" color="white">Play & Earn</Text>
                      <Text fontSize="sm" color="whiteAlpha.800">Earn while you play</Text>
                    </VStack>
                  </HStack>
                  <Box flex={1} w="full">
                    <PlayEarnPreview />
                  </Box>
                </VStack>
              </Box>
            </MotionBox>
          </SimpleGrid>


        </VStack>
      </Container>
    </Box>
  );
};

export default FeaturesSection;