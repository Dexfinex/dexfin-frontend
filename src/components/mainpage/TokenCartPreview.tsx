import React, { useState, useEffect } from 'react';
import {
  Box,
  HStack,
  Text,
  Badge,
  VStack,
  Image,
  Icon,
  SimpleGrid,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Check, Sparkles } from 'lucide-react';

const MotionBox = motion(Box);
const MotionBadge = motion(Badge);

// Parse token prices to numbers for accurate calculations
const tokens = [
  {
    id: 'pepe',
    name: 'Pepe',
    symbol: 'PEPE',
    price: '$0.0000073',
    priceValue: 0.0000073,
    icon: 'https://cryptologos.cc/logos/pepe-pepe-logo.png'
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    price: '$2030.67',
    priceValue: 2030.67,
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  },
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    price: '$132.47',
    priceValue: 132.47,
    icon: 'https://cryptologos.cc/logos/solana-sol-logo.png'
  }
];

const TokenCartPreview = () => {
  const [cartItems, setCartItems] = useState<Set<string>>(new Set());
  const [activeToken, setActiveToken] = useState(-1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectionPhase, setSelectionPhase] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  // Calculate total value based on selected tokens
  const calculateTotalValue = (selectedItems: Set<string>) => {
    return Array.from(selectedItems).reduce((sum, tokenId) => {
      const token = tokens.find(t => t.id === tokenId);
      return sum + (token ? token.priceValue : 0);
    }, 0);
  };

  useEffect(() => {
    // Define the selection patterns
    const patterns = [
      // Single tokens (0-2)
      new Set([tokens[0].id]),
      new Set([tokens[1].id]),
      new Set([tokens[2].id]),
      // Pairs of tokens (3-5)
      new Set([tokens[0].id, tokens[1].id]),
      new Set([tokens[1].id, tokens[2].id]),
      new Set([tokens[0].id, tokens[2].id]),
      // All tokens (6)
      new Set([tokens[0].id, tokens[1].id, tokens[2].id])
    ];

    // Function to move to the next pattern
    const nextPattern = () => {
      setSelectionPhase(prev => (prev + 1) % patterns.length);
    };

    // Set up interval to change selection pattern
    const interval = setInterval(() => {
      const currentPattern = patterns[selectionPhase];
      
      // Update cart items with current pattern
      setCartItems(currentPattern);
      
      // Calculate and update total value
      setTotalValue(calculateTotalValue(currentPattern));
      
      // Set active token for animation
      if (currentPattern.size === 1) {
        const tokenId = Array.from(currentPattern)[0];
        setActiveToken(tokens.findIndex(t => t.id === tokenId));
      } else {
        setActiveToken(-1); // No single active token when multiple are selected
      }
      
      // Show success notification
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1000);
      
      // Move to next pattern
      nextPattern();
    }, 2000);

    return () => clearInterval(interval);
  }, [selectionPhase]);

  return (
    <Box position="relative" h="full" w="full">
      <AnimatePresence>
        {showSuccess && (
          <MotionBadge
            position="absolute"
            top={4}
            right={4}
            colorScheme="green"
            fontSize="sm"
            px={3}
            py={1}
            zIndex={2}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <HStack spacing={1}>
              <Sparkles size={14} />
              <Text>Updated Cart</Text>
            </HStack>
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
        {/* Cart Summary */}
        <HStack justify="space-between" w="full">
          <HStack spacing={2}>
            <Icon as={ShoppingCart} boxSize={5} />
            <Text fontWeight="bold">Token Cart</Text>
          </HStack>
          <Badge colorScheme="purple">{cartItems.size} items</Badge>
        </HStack>

        {/* Token Grid */}
        <SimpleGrid columns={2} spacing={4} w="full">
          {tokens.map((token, index) => (
            <MotionBox
              key={token.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: cartItems.has(token.id) ? -10 : 0
              }}
              transition={{ duration: 0.3 }}
            >
              <Box
                bg="whiteAlpha.100"
                p={4}
                borderRadius="lg"
                border="1px solid"
                borderColor={cartItems.has(token.id) ? "green.500" : "whiteAlpha.200"}
                position="relative"
                overflow="hidden"
              >
                <HStack justify="space-between">
                  <HStack spacing={3}>
                    <Image
                      src={token.icon}
                      alt={token.name}
                      boxSize="32px"
                      objectFit="contain"
                    />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium">{token.symbol}</Text>
                      <Text fontSize="sm" color="whiteAlpha.700">{token.price}</Text>
                    </VStack>
                  </HStack>
                  <Icon 
                    as={cartItems.has(token.id) ? Check : Plus} 
                    color={cartItems.has(token.id) ? "green.400" : "white"}
                  />
                </HStack>

                {/* Animation Overlay */}
                <AnimatePresence>
                  {index === activeToken && (
                    <MotionBox
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      bg="rgba(72, 187, 120, 0.2)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* Cart Total */}
        <Box
          w="full"
          bg="whiteAlpha.100"
          p={4}
          borderRadius="lg"
          border="1px solid"
          borderColor="whiteAlpha.200"
        >
          <HStack justify="space-between">
            <Text color="whiteAlpha.700">Total Value:</Text>
            <Text fontWeight="bold">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })}
            </Text>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default TokenCartPreview;