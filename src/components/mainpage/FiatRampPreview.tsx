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
import { CreditCard, ArrowRight, CheckCircle2, DollarSign, Bitcoin } from 'lucide-react';

const MotionBox = motion(Box);
const MotionBadge = motion(Badge);

interface Transaction {
  amount: string;
  crypto: string;
  cryptoAmount: string;
  icon: string;
  status: 'pending' | 'completed';
}

const transactions: Transaction[] = [
  {
    amount: '$500',
    crypto: 'BTC',
    cryptoAmount: '0.0185',
    icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    status: 'completed'
  },
  {
    amount: '$1000',
    crypto: 'ETH',
    cryptoAmount: '0.4123',
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    status: 'completed'
  },
  {
    amount: '$250',
    crypto: 'SOL',
    cryptoAmount: '2.5',
    icon: 'https://cryptologos.cc/logos/solana-sol-logo.png',
    status: 'completed'
  }
];

const FiatRampPreview = () => {
  const [activeTransaction, setActiveTransaction] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'card' | 'processing' | 'complete'>('card');

  useEffect(() => {
    // Cycle through transactions with stages
    const interval = setInterval(() => {
      setStage('card');
      setProgress(0);
      
      setTimeout(() => {
        setStage('processing');
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              return 100;
            }
            return prev + 2;
          });
        }, 50);

        setTimeout(() => {
          setStage('complete');
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            setActiveTransaction((prev) => (prev + 1) % transactions.length);
          }, 1500);
        }, 3000);
      }, 2000);
    }, 8000);

    return () => clearInterval(interval);
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
        justify="center"
      >
        <AnimatePresence mode="wait">
          {stage === 'card' && (
            <MotionBox
              key="card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <VStack spacing={4} align="center">
                <Box
                  w="280px"
                  h="160px"
                  bg="linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)"
                  borderRadius="xl"
                  p={4}
                  position="relative"
                  overflow="hidden"
                >
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bgGradient="linear(to-r, rgba(255,255,255,0.1), rgba(255,255,255,0.05))"
                    transform="skewY(-10deg)"
                  />
                  <VStack align="start" h="full" justify="space-between">
                    <Icon as={CreditCard} boxSize={8} color="whiteAlpha.900" />
                    <Text fontSize="lg" letterSpacing={4} color="whiteAlpha.900">
                      •••• •••• •••• 4242
                    </Text>
                  </VStack>
                </Box>
                <HStack>
                  <Text fontSize="2xl" fontWeight="bold">{transactions[activeTransaction].amount}</Text>
                  <Icon as={ArrowRight} />
                  <Image
                    src={transactions[activeTransaction].icon}
                    alt={transactions[activeTransaction].crypto}
                    boxSize="24px"
                  />
                  <Text fontSize="2xl" fontWeight="bold">
                    {transactions[activeTransaction].cryptoAmount} {transactions[activeTransaction].crypto}
                  </Text>
                </HStack>
              </VStack>
            </MotionBox>
          )}

          {stage === 'processing' && (
            <MotionBox
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              textAlign="center"
            >
              <VStack spacing={6}>
                <Box
                  w="80px"
                  h="80px"
                  borderRadius="full"
                  border="3px solid"
                  borderColor="blue.500"
                  borderTopColor="transparent"
                  animation="spin 1s linear infinite"
                  mb={4}
                />
                <Text fontSize="lg">Processing Payment</Text>
                <Box w="full" maxW="300px">
                  <Progress
                    value={progress}
                    size="sm"
                    colorScheme="blue"
                    borderRadius="full"
                    hasStripe
                    isAnimated
                  />
                </Box>
              </VStack>
            </MotionBox>
          )}

          {stage === 'complete' && (
            <MotionBox
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              textAlign="center"
            >
              <VStack spacing={4}>
                <Icon as={CheckCircle2} boxSize={16} color="green.400" />
                <Text fontSize="xl" fontWeight="bold">Purchase Complete!</Text>
                <HStack spacing={4}>
                  <Badge colorScheme="green">
                    <HStack spacing={1}>
                      <Icon as={DollarSign} boxSize={3} />
                      <Text>{transactions[activeTransaction].amount}</Text>
                    </HStack>
                  </Badge>
                  <Icon as={ArrowRight} boxSize={4} />
                  <Badge colorScheme="orange">
                    <HStack spacing={1}>
                      <Icon as={Bitcoin} boxSize={3} />
                      <Text>
                        {transactions[activeTransaction].cryptoAmount} {transactions[activeTransaction].crypto}
                      </Text>
                    </HStack>
                  </Badge>
                </HStack>
              </VStack>
            </MotionBox>
          )}
        </AnimatePresence>

        {/* Recent Transactions */}
        <Box
          position="absolute"
          bottom={6}
          left={6}
          right={6}
          bg="whiteAlpha.100"
          borderRadius="lg"
          p={4}
        >
          <Text fontSize="sm" color="whiteAlpha.700" mb={3}>Recent Transactions</Text>
          <VStack spacing={3} align="stretch">
            {transactions.slice(0, 2).map((tx, index) => (
              <HStack key={index} justify="space-between">
                <HStack spacing={3}>
                  <Image src={tx.icon} alt={tx.crypto} boxSize="20px" />
                  <Text fontSize="sm">
                    {tx.cryptoAmount} {tx.crypto}
                  </Text>
                </HStack>
                <Badge colorScheme="green" variant="subtle">
                  {tx.amount}
                </Badge>
              </HStack>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default FiatRampPreview;