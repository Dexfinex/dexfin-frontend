import React, { useState, useEffect } from 'react';
import {
  Box,
  HStack,
  Text,
  Badge,
  VStack,
  Icon,
  SimpleGrid,
  Image,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Star, ArrowRight, ExternalLink } from 'lucide-react';

const MotionBox = motion(Box);
const MotionBadge = motion(Badge);

const tokens = [
  {
    id: 'pepe',
    name: 'Pepe',
    symbol: 'PEPE',
    price: '$0.0000073',
    change: '+152.4%',
    volume: '$89.2M',
    trend: 'up',
    icon: 'https://cryptologos.cc/logos/pepe-pepe-logo.png'
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    price: '$2030.67',
    change: '+3.8%',
    volume: '$1.5B',
    trend: 'up',
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  },
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    price: '$132.66',
    change: '-2.1%',
    volume: '$800M',
    trend: 'down',
    icon: 'https://cryptologos.cc/logos/solana-sol-logo.png'
  }
];

const news = [
  {
    id: 1,
    title: 'Bitcoin Surpasses $109, 000 in Historic Rally',
    source: 'CryptoNews',
    time: '2m ago',
    impact: 'high'
  },
  {
    id: 2,
    title: 'New DeFi Protocol Launches with $100M TVL',
    source: 'DeFi Daily',
    time: '5m ago',
    impact: 'medium'
  },
  {
    id: 3,
    title: 'Major Bank Announces Crypto Integration',
    source: 'Finance Weekly',
    time: '10m ago',
    impact: 'high'
  }
];

const MarketDataPreview = () => {
  const [activeNewsIndex, setActiveNewsIndex] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const [trendingTokens, setTrendingTokens] = useState(tokens);

  useEffect(() => {
    // Cycle through news
    const newsInterval = setInterval(() => {
      setActiveNewsIndex((prev) => (prev + 1) % news.length);
      setShowBadge(true);
      setTimeout(() => setShowBadge(false), 2000);
    }, 4000);

    // Update token prices with very small changes
    const priceInterval = setInterval(() => {
      setTrendingTokens(prev => prev.map(token => {
        // Get current price as a number
        const currentPrice = parseFloat(token.price.replace('$', ''));
        
        // Calculate a very small random change
        // For PEPE (very small value), use extremely small changes
        let priceChange;
        let newPrice;
        
        if (token.symbol === 'PEPE') {
          // For PEPE, create extremely tiny fluctuations
          priceChange = (Math.random() - 0.5) * 0.0000001;
          newPrice = Math.max(0.0000001, currentPrice + priceChange);
          
          // Format with appropriate precision for very small numbers
          return {
            ...token,
            price: `$${newPrice.toFixed(10)}`,
            // Only update the percentage change occasionally to make it less dramatic
            change: Math.random() > 0.8 
              ? `${token.trend === 'up' ? '+' : '-'}${(Math.random() * 0.5).toFixed(2)}%` 
              : token.change,
          };
        } else {
          // For other tokens (ETH, SOL), use very small fluctuations
          priceChange = (Math.random() - 0.5) * 0.02; // Tiny fluctuation of ±$0.01
          newPrice = Math.max(0.01, currentPrice + priceChange);
          
          return {
            ...token,
            price: `$${newPrice.toFixed(2)}`,
            // Only update the percentage change occasionally
            change: Math.random() > 0.8 
              ? `${token.trend === 'up' ? '+' : '-'}${(Math.random() * 0.05).toFixed(2)}%` 
              : token.change,
          };
        }
      }));
    }, 2000);

    return () => {
      clearInterval(newsInterval);
      clearInterval(priceInterval);
    };
  }, []);

  return (
    <Box position="relative" h="full" w="full">
      <AnimatePresence>
        {showBadge && (
          <MotionBadge
            position="absolute"
            top={4}
            right={4}
            colorScheme="blue"
            fontSize="sm"
            px={3}
            py={1}
            zIndex={2}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            Breaking News
          </MotionBadge>
        )}
      </AnimatePresence>

      <VStack 
        spacing={6} 
        h="full" 
        w="full" 
        bg="whiteAlpha.50" 
        borderRadius="lg"
        p={6}
      >
        {/* Market News */}
        <Box w="full">
          <Text fontSize="sm" color="whiteAlpha.700" mb={3}>Latest News</Text>
          <AnimatePresence mode="wait">
            <MotionBox
              key={activeNewsIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                bg="whiteAlpha.100"
                p={4}
                borderRadius="lg"
                border="1px solid"
                borderColor="whiteAlpha.200"
              >
                <HStack justify="space-between" mb={2}>
                  <Badge
                    colorScheme={
                      news[activeNewsIndex].impact === 'high' ? 'red' :
                      news[activeNewsIndex].impact === 'medium' ? 'yellow' :
                      'green'
                    }
                  >
                    {news[activeNewsIndex].impact.toUpperCase()}
                  </Badge>
                  <HStack spacing={2} color="whiteAlpha.600">
                    <Text fontSize="sm">{news[activeNewsIndex].source}</Text>
                    <Text fontSize="sm">•</Text>
                    <Text fontSize="sm">{news[activeNewsIndex].time}</Text>
                  </HStack>
                </HStack>
                <Text fontWeight="medium">{news[activeNewsIndex].title}</Text>
              </Box>
            </MotionBox>
          </AnimatePresence>
        </Box>

        {/* Trending Tokens */}
        <Box w="full">
          <Text fontSize="sm" color="whiteAlpha.700" mb={3}>Trending</Text>
          <SimpleGrid columns={1} spacing={3}>
            {trendingTokens.map((token) => (
              <MotionBox
                key={token.id}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Box
                  bg="whiteAlpha.100"
                  p={3}
                  borderRadius="lg"
                  cursor="pointer"
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  <HStack justify="space-between">
                    <HStack>
                      <Image
                        src={token.icon}
                        alt={token.name}
                        boxSize="24px"
                        borderRadius="full"
                      />
                      <Icon
                        as={token.trend === 'up' ? TrendingUp : TrendingDown}
                        color={token.trend === 'up' ? 'green.400' : 'red.400'}
                      />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="medium">{token.name}</Text>
                        <Text fontSize="sm" color="whiteAlpha.700">{token.symbol}</Text>
                      </VStack>
                    </HStack>
                    <VStack align="end" spacing={0}>
                      <Text>{token.price}</Text>
                      <Text
                        fontSize="sm"
                        color={token.change.startsWith('+') ? 'green.400' : 'red.400'}
                      >
                        {token.change}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Box>

        {/* View More Link */}
        <HStack
          spacing={2}
          color="blue.400"
          cursor="pointer"
          _hover={{ color: 'blue.300' }}
          transition="color 0.2s"
        >
          <Text fontSize="sm">View Market Data</Text>
          <ExternalLink size={14} />
        </HStack>
      </VStack>
    </Box>
  );
};

export default MarketDataPreview;