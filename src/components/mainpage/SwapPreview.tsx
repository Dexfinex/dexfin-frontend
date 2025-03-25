import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  Image,
  Badge,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Zap } from 'lucide-react';

const MotionBox = motion(Box);
const MotionBadge = motion(Badge);

const tokens = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    chain: 'Ethereum'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    chain: 'Ethereum'
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    icon: 'https://cryptologos.cc/logos/solana-sol-logo.png',
    chain: 'Solana'
  },
  {
    symbol: 'PEPE',
    name: 'Pepe',
    icon: 'https://cryptologos.cc/logos/pepe-pepe-logo.png',
    chain: 'Ethereum'
  },
  {
    symbol: 'MATIC',
    name: 'Polygon',
    icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
    chain: 'Polygon'
  }
];

const SwapPreview = () => {
  const [token1Index, setToken1Index] = useState(0);
  const [token2Index, setToken2Index] = useState(1);
  const [amount1, setAmount1] = useState('1.0');
  const [amount2, setAmount2] = useState('1,850.45');
  const [showSuccess, setShowSuccess] = useState(false);
  const [swapType, setSwapType] = useState<'standard' | 'cross-chain' | 'memecoin'>('standard');

  useEffect(() => {
    // Cycle through different swap scenarios
    const interval = setInterval(() => {
      // Ensure we don't select the same token for both sides
      let newToken1Index = (token1Index + 1) % tokens.length;
      let newToken2Index = (token2Index + 2) % tokens.length;
      
      // If they end up being the same, adjust token2
      if (newToken1Index === newToken2Index) {
        newToken2Index = (newToken2Index + 1) % tokens.length;
      }
      
      setToken1Index(newToken1Index);
      setToken2Index(newToken2Index);
      
      // Update swap type based on tokens
      const newToken1 = tokens[newToken1Index];
      const newToken2 = tokens[newToken2Index];
      
      if (newToken1.chain !== newToken2.chain) {
        setSwapType('cross-chain');
      } else if (
        (newToken1.symbol === 'PEPE' || newToken2.symbol === 'PEPE')
      ) {
        setSwapType('memecoin');
      } else {
        setSwapType('standard');
      }

      // Show success badge
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      // Update amounts with some randomness and appropriate decimals
      let baseAmount: number;
      if (newToken1.symbol === 'ETH') {
        baseAmount = 1 + Math.random() * 0.5;
        setAmount1(baseAmount.toFixed(3));
        setAmount2((baseAmount * 1850.45).toFixed(2));
      } else if (newToken1.symbol === 'PEPE') {
        baseAmount = 1000000 + Math.random() * 500000;
        setAmount1(baseAmount.toFixed(0));
        setAmount2((baseAmount * 0.000001).toFixed(2));
      } else {
        baseAmount = 100 + Math.random() * 50;
        setAmount1(baseAmount.toFixed(2));
        setAmount2((baseAmount * 1.5).toFixed(2));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [token1Index, token2Index]);

  return (
    <Box position="relative" h="full" w="full">
      <AnimatePresence>
        {showSuccess && (
          <MotionBadge
            position="absolute"
            top={4}
            right={4}
            colorScheme={swapType === 'cross-chain' ? "purple" : swapType === 'memecoin' ? "orange" : "green"}
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
              <Zap size={14} />
              <Text>
                {swapType === 'cross-chain' ? 'Cross-Chain Swap' : 
                 swapType === 'memecoin' ? 'Memecoin Swap' : 
                 'Instant Swap'}
              </Text>
            </HStack>
          </MotionBadge>
        )}
      </AnimatePresence>

      <VStack 
        spacing={4} 
        h="full" 
        w="full" 
        bg="whiteAlpha.50" 
        borderRadius="lg"
        p={4}
      >
        {/* First Token Input */}
        <Box w="full">
          <Text mb={2} fontSize="sm" color="whiteAlpha.700">You Pay</Text>
          <InputGroup size="lg">
            <Input
              value={amount1}
              readOnly
              bg="whiteAlpha.100"
              border="none"
              _focus={{ boxShadow: 'none', bg: 'whiteAlpha.200' }}
              pr="100px"
            />
            <InputRightElement width="100px">
              <HStack spacing={2} pr={4}>
                <Image
                  src={tokens[token1Index].icon}
                  alt={tokens[token1Index].symbol}
                  boxSize="20px"
                />
                <Text>{tokens[token1Index].symbol}</Text>
              </HStack>
            </InputRightElement>
          </InputGroup>
        </Box>

        {/* Arrow Icon */}
        <Box>
          <MotionBox
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Box
              bg="whiteAlpha.200"
              p={2}
              borderRadius="full"
            >
              <ArrowDown size={20} />
            </Box>
          </MotionBox>
        </Box>

        {/* Second Token Input */}
        <Box w="full">
          <Text mb={2} fontSize="sm" color="whiteAlpha.700">You Receive</Text>
          <InputGroup size="lg">
            <Input
              value={amount2}
              readOnly
              bg="whiteAlpha.100"
              border="none"
              _focus={{ boxShadow: 'none', bg: 'whiteAlpha.200' }}
              pr="100px"
            />
            <InputRightElement width="100px">
              <HStack spacing={2} pr={4}>
                <Image
                  src={tokens[token2Index].icon}
                  alt={tokens[token2Index].symbol}
                  boxSize="20px"
                />
                <Text>{tokens[token2Index].symbol}</Text>
              </HStack>
            </InputRightElement>
          </InputGroup>
        </Box>

        {/* Chain Indicator */}
        {swapType === 'cross-chain' && (
          <Badge colorScheme="purple">
            {tokens[token1Index].chain} → {tokens[token2Index].chain}
          </Badge>
        )}
      </VStack>
    </Box>
  );
};

export default SwapPreview;