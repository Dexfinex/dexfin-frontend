import React, { useState, useEffect } from 'react';
import {
  Box,
  HStack,
  Text,
  Badge,
  VStack,
  Progress,
  Image,
  SimpleGrid,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Coins, Shield, BarChart2, Target } from 'lucide-react';

const MotionBox = motion(Box);
const MotionBadge = motion(Badge);

const positions = [
  {
    protocol: 'Aave',
    asset: 'ETH',
    amount: '10.5',
    apy: '4.2%',
    icon: 'https://cryptologos.cc/logos/aave-aave-logo.png',
    change: '+0.5%',
    trend: 'up',
    tvl: '$2.5B',
    utilization: 64
  },
  {
    protocol: 'Compound',
    asset: 'USDC',
    amount: '5000',
    apy: '3.8%',
    icon: 'https://cryptologos.cc/logos/compound-comp-logo.png',
    change: '+0.3%',
    trend: 'up',
    tvl: '$1.8B',
    utilization: 72
  },
  {
    protocol: 'Lido',
    asset: 'stETH',
    amount: '5.2',
    apy: '3.9%',
    icon: 'https://cryptologos.cc/logos/lido-dao-ldo-logo.png',
    change: '-0.1%',
    trend: 'down',
    tvl: '$3.2B',
    utilization: 85
  }
];

const LendBorrowPreview = () => {
  const [activePosition, setActivePosition] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [utilization, setUtilization] = useState(positions[0].utilization);
  const [rewards, setRewards] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(158890);

  useEffect(() => {
    // Cycle through positions
    const positionInterval = setInterval(() => {
      setActivePosition((prev) => {
        const next = (prev + 1) % positions.length;
        setUtilization(positions[next].utilization);
        return next;
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 4000);

    // Increment rewards
    const rewardsInterval = setInterval(() => {
      setRewards(prev => {
        const newRewards = prev + 0.001;
        if (newRewards >= 1) {
          setTotalEarnings(prev => prev + 100);
          return 0;
        }
        return newRewards;
      });
    }, 50);

    return () => {
      clearInterval(positionInterval);
      clearInterval(rewardsInterval);
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
            Position Updated
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
              <HStack spacing={4} mb={4}>
                <Image
                  src={positions[activePosition].icon}
                  alt={positions[activePosition].protocol}
                  boxSize="40px"
                  borderRadius="full"
                />
                <VStack align="start" spacing={1} flex={1}>
                  <HStack justify="space-between" w="full">
                    <Text fontWeight="bold">{positions[activePosition].protocol}</Text>
                    <Badge colorScheme="green">{positions[activePosition].apy} APY</Badge>
                  </HStack>
                  <HStack justify="space-between" w="full">
                    <Text color="whiteAlpha.800">
                      {positions[activePosition].amount} {positions[activePosition].asset}
                    </Text>
                    <HStack>
                      <Icon
                        as={positions[activePosition].trend === 'up' ? TrendingUp : TrendingDown}
                        color={positions[activePosition].trend === 'up' ? 'green.400' : 'red.400'}
                      />
                      <Text
                        fontSize="sm"
                        color={positions[activePosition].trend === 'up' ? 'green.400' : 'red.400'}
                      >
                        {positions[activePosition].change}
                      </Text>
                    </HStack>
                  </HStack>
                </VStack>
              </HStack>

              <VStack spacing={3}>
                <HStack justify="space-between" w="full">
                  <Text fontSize="sm" color="whiteAlpha.700">TVL</Text>
                  <Text>{positions[activePosition].tvl}</Text>
                </HStack>
                <Box w="full">
                  <HStack justify="space-between" mb={1}>
                    <Text fontSize="sm" color="whiteAlpha.700">Protocol Utilization</Text>
                    <Text fontSize="sm" color="whiteAlpha.900">{utilization}%</Text>
                  </HStack>
                  <Progress
                    value={utilization}
                    size="sm"
                    colorScheme={utilization > 80 ? "orange" : "blue"}
                    borderRadius="full"
                  />
                </Box>
              </VStack>
            </Box>
          </MotionBox>
        </AnimatePresence>

        {/* Rewards Section */}
        <Box w="full" bg="whiteAlpha.100" p={4} borderRadius="lg">
          <VStack align="stretch" spacing={3}>
            <HStack justify="space-between">
              <HStack>
                <Icon as={Coins} color="green.400" />
                <Text fontSize="sm">Rewards Earned</Text>
              </HStack>
              <MotionBox
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                <Text fontWeight="bold" color="green.400">
                  +{rewards.toFixed(3)} Tokens
                </Text>
              </MotionBox>
            </HStack>
            <Progress
              value={(rewards % 1) * 100}
              size="xs"
              colorScheme="green"
              borderRadius="full"
              isAnimated
            />
          </VStack>
        </Box>

        {/* Stats Grid */}
        <SimpleGrid columns={2} spacing={4} w="full">
          <Box bg="whiteAlpha.100" p={4} borderRadius="lg">
            <VStack align="start" spacing={1}>
              <HStack>
                <Icon as={Shield} color="blue.400" />
                <Text fontSize="sm">Insurance Coverage</Text>
              </HStack>
              <Text fontSize="xl" fontWeight="bold">$2.5M</Text>
              <Text fontSize="xs" color="whiteAlpha.600">Protected Assets</Text>
            </VStack>
          </Box>
          <Box bg="whiteAlpha.100" p={4} borderRadius="lg">
            <VStack align="start" spacing={1}>
              <HStack>
                <Icon as={BarChart2} color="green.400" />
                <Text fontSize="sm">Total Earnings</Text>
              </HStack>
              <Text fontSize="xl" fontWeight="bold">${(totalEarnings / 1000).toFixed(2)}K</Text>
              <Text fontSize="xs" color="whiteAlpha.600">Lifetime Returns</Text>
            </VStack>
          </Box>
        </SimpleGrid>

        {/* Performance Metrics */}
        <Box w="full" bg="whiteAlpha.100" p={4} borderRadius="lg">
          <VStack spacing={3}>
            <HStack justify="space-between" w="full">
              <HStack>
                <Icon as={Target} color="purple.400" />
                <Text fontSize="sm">Performance Score</Text>
              </HStack>
              <Badge colorScheme="purple">98/100</Badge>
            </HStack>
            <Progress
              value={98}
              size="xs"
              colorScheme="purple"
              borderRadius="full"
              isAnimated
            />
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default LendBorrowPreview;