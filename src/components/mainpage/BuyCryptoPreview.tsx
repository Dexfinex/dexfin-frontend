import React, { useState, useEffect } from 'react';
import {
  Box,
  HStack,
  Text,
  Badge,
  VStack,
  Progress,
  Image,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';

const MotionBox = motion(Box);
const MotionBadge = motion(Badge);

const cryptoOptions = [
  {
    name: 'Ethereum',
    symbol: 'ETH',
    price: '$3,250.34',
    amount: '1.5',
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  },
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    price: '$67,245.80',
    amount: '0.5',
    icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'
  },
  {
    name: 'Solana',
    symbol: 'SOL',
    price: '$98.45',
    amount: '25',
    icon: 'https://cryptologos.cc/logos/solana-sol-logo.png'
  }
];

const BuyCryptoPreview = () => {
  const [activeCrypto, setActiveCrypto] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Cycle through crypto options
    const cryptoInterval = setInterval(() => {
      setActiveCrypto((prev) => (prev + 1) % cryptoOptions.length);
      setProgress(0);
      setShowSuccess(false);
    }, 5000);

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setShowSuccess(true);
          return 0;
        }
        return prev + 2;
      });
    }, 50);

    return () => {
      clearInterval(cryptoInterval);
      clearInterval(progressInterval);
    };
  }, []);

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
            Purchase Complete
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
        {/* Purchase Card */}
        <AnimatePresence mode="wait">
          <MotionBox
            key={activeCrypto}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            w="full"
          >
            <Box
              bg="whiteAlpha.100"
              p={4}
              borderRadius="lg"
              border="1px solid"
              borderColor="whiteAlpha.200"
            >
              <HStack spacing={4}>
                <Image
                  src={cryptoOptions[activeCrypto].icon}
                  alt={cryptoOptions[activeCrypto].name}
                  boxSize="40px"
                  borderRadius="full"
                />
                <VStack align="start" spacing={1} flex={1}>
                  <HStack justify="space-between" w="full">
                    <Text fontWeight="bold">{cryptoOptions[activeCrypto].name}</Text>
                    <Badge colorScheme="green">Buy</Badge>
                  </HStack>
                  <Text color="whiteAlpha.800">
                    {cryptoOptions[activeCrypto].amount} {cryptoOptions[activeCrypto].symbol}
                  </Text>
                </VStack>
              </HStack>

              {/* Purchase Progress */}
              <Box mt={4}>
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="sm" color="whiteAlpha.700">Processing Payment</Text>
                  <Text fontSize="sm" color="whiteAlpha.900">{progress}%</Text>
                </HStack>
                <Progress
                  value={progress}
                  size="sm"
                  colorScheme="blue"
                  borderRadius="full"
                  isAnimated
                />
              </Box>
            </Box>
          </MotionBox>
        </AnimatePresence>

        {/* Payment Method */}
        <Box
          w="full"
          bg="whiteAlpha.100"
          p={4}
          borderRadius="lg"
          border="1px solid"
          borderColor="whiteAlpha.200"
          position="relative"
        >
          <HStack justify="space-between">
            <HStack>
              <CreditCard size={20} />
              <Text>•••• •••• •••• 4242</Text>
            </HStack>
            <ArrowRight size={16} />
          </HStack>

          {/* Success Animation */}
          <AnimatePresence>
            {showSuccess && (
              <MotionBox
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                position="absolute"
                top="50%"
                left="50%"
                style={{ transform: 'translate(-50%, -50%)' }}
                mt={6}
              >
                <Box
                  bg="green.500"
                  p={4}
                  borderRadius="full"
                  color="white"
                >
                  <CheckCircle2 size={32} />
                </Box>
              </MotionBox>
            )}
          </AnimatePresence>
        </Box>

        {/* Spacer for checkmark animation */}
        <Box h="60px" />
      </VStack>
    </Box>
  );
};

export default BuyCryptoPreview;