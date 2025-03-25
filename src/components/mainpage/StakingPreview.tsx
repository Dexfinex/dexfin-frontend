import React, { useState, useEffect } from 'react';
import {
  Box,
  HStack,
  Text,
  Badge,
  VStack,
  Progress,
  Image,
  Icon,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Coins, ArrowRight, Zap } from 'lucide-react';

const MotionBox = motion(Box);
const MotionBadge = motion(Badge);

interface StakingPosition {
  protocol: string;
  asset: string;
  amount: string;
  apy: string;
  icon: string;
  rewards: number;
}

const positions: StakingPosition[] = [
  {
    protocol: 'Lido',
    asset: 'ETH',
    amount: '32.0',
    apy: '3.8%',
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    rewards: 0.0033
  },
  {
    protocol: 'Marinade',
    asset: 'SOL',
    amount: '1000',
    apy: '5.2%',
    icon: 'https://cryptologos.cc/logos/solana-sol-logo.png',
    rewards: 0.142
  },
  {
    protocol: 'Stader',
    asset: 'MATIC',
    amount: '10000',
    apy: '4.5%',
    icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
    rewards: 12.33
  }
];

const StakingPreview = () => {
  const [activePosition, setActivePosition] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Cycle through positions
    const positionInterval = setInterval(() => {
      setActivePosition((prev) => (prev + 1) % positions.length);
      setProgress(0);
      setShowReward(false);
    }, 5000);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setShowReward(true);
          return 0;
        }
        return prev + 1;
      });
    }, 50);

    return () => {
      clearInterval(positionInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <Box position="relative" h="full" w="full">
      <AnimatePresence>
        {showReward && (
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
            +{positions[activePosition].rewards} {positions[activePosition].asset} Earned
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
        {/* Active Position */}
        <AnimatePresence mode="wait">
          <MotionBox
            key={activePosition}
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
                  src={positions[activePosition].icon}
                  alt={positions[activePosition].asset}
                  boxSize="40px"
                  borderRadius="full"
                />
                <VStack align="start" spacing={1} flex={1}>
                  <HStack justify="space-between" w="full">
                    <Text fontWeight="bold">{positions[activePosition].protocol}</Text>
                    <Badge colorScheme="green">{positions[activePosition].apy} APY</Badge>
                  </HStack>
                  <Text color="whiteAlpha.800">
                    {positions[activePosition].amount} {positions[activePosition].asset}
                  </Text>
                </VStack>
              </HStack>

              <HStack mt={4} spacing={4} color="whiteAlpha.800">
                <Icon as={Shield} />
                <Text>Secured by {positions[activePosition].protocol}</Text>
              </HStack>
            </Box>
          </MotionBox>
        </AnimatePresence>

        {/* Staking Progress */}
        <Box w="full">
          <HStack justify="space-between" mb={2}>
            <Text fontSize="sm" color="whiteAlpha.700">Next Reward</Text>
            <HStack spacing={1}>
              <Icon as={Zap} color="yellow.400" />
              <Text fontSize="sm" color="whiteAlpha.900">
                {positions[activePosition].rewards} {positions[activePosition].asset}
              </Text>
            </HStack>
          </HStack>
          <Progress
            value={progress}
            size="sm"
            colorScheme="blue"
            borderRadius="full"
            isAnimated
            hasStripe
          />
        </Box>

        {/* Reward Flow Animation */}
        <Box position="relative" h="60px" w="full">
          <AnimatePresence>
            {showReward && (
              <>
                <MotionBox
                  position="absolute"
                  left="20%"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon as={Coins} boxSize={6} color="yellow.400" />
                </MotionBox>
                <MotionBox
                  position="absolute"
                  left="50%"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <Icon as={ArrowRight} boxSize={6} color="green.400" />
                </MotionBox>
                <MotionBox
                  position="absolute"
                  right="20%"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <Icon as={Shield} boxSize={6} color="blue.400" />
                </MotionBox>
              </>
            )}
          </AnimatePresence>
        </Box>

        {/* Stats */}
        <SimpleStats />
      </VStack>
    </Box>
  );
};

const SimpleStats = () => {
  const [tvl, setTvl] = useState(2.45);
  const [stakers, setStakers] = useState(156789);

  useEffect(() => {
    const interval = setInterval(() => {
      setTvl(prev => prev + (Math.random() - 0.5) * 0.1);
      setStakers(prev => prev + Math.floor(Math.random() * 10));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <HStack 
      spacing={4} 
      w="full" 
      bg="whiteAlpha.100" 
      p={4} 
      borderRadius="lg"
      justify="space-between"
    >
      <VStack align="start" spacing={0}>
        <Text fontSize="sm" color="whiteAlpha.700">Total Value Locked</Text>
        <Text fontWeight="bold">${tvl.toFixed(2)}B</Text>
      </VStack>
      <VStack align="start" spacing={0}>
        <Text fontSize="sm" color="whiteAlpha.700">Total Stakers</Text>
        <Text fontWeight="bold">{stakers.toLocaleString()}</Text>
      </VStack>
    </HStack>
  );
};

export default StakingPreview;