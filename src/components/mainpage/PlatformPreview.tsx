import React, { useState, useEffect } from 'react';
import { Box, HStack, VStack, Text, Badge, SimpleGrid } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight, Wallet, Bot, Shield } from 'lucide-react';

const MotionBox = motion(Box);

const features = [
  {
    title: "Cross-Chain Swaps",
    description: "Seamlessly swap assets across multiple blockchains",
    icon: ArrowLeftRight,
    color: "#48BB78",
    preview: (
      <Box h="100px" bg="whiteAlpha.100" borderRadius="lg" p={4}>
        <HStack justify="space-between" mb={4}>
          <Text>ETH → SOL</Text>
          <Badge colorScheme="green">Best Rate</Badge>
        </HStack>
        <Box h="2px" bg="whiteAlpha.200" mb={4} />
        <Text fontSize="sm" color="whiteAlpha.600">Estimated Time: 2-3 min</Text>
      </Box>
    )
  },
  {
    title: "Smart Wallet",
    description: "Secure MPC wallet with social recovery",
    icon: Wallet,
    color: "#4299E1",
    preview: (
      <Box h="100px" bg="whiteAlpha.100" borderRadius="lg" p={4}>
        <VStack spacing={2} align="start">
          <Text>Balance: 1.5 ETH</Text>
          <Text fontSize="sm" color="whiteAlpha.600">$3,250.45</Text>
          <Badge colorScheme="blue" mt={2}>Protected by MPC</Badge>
        </VStack>
      </Box>
    )
  },
  {
    title: "AI Assistant",
    description: "Voice and text commands for DeFi operations",
    icon: Bot,
    color: "#9F7AEA",
    preview: (
      <Box h="100px" bg="whiteAlpha.100" borderRadius="lg" p={4}>
        <Text mb={4}>"Swap 1 ETH to USDC"</Text>
        <Badge colorScheme="purple">Processing request...</Badge>
      </Box>
    )
  },
  {
    title: "Secure Infrastructure",
    description: "Bank-grade security with MPC+TSS",
    icon: Shield,
    color: "#F6AD55",
    preview: (
      <Box h="100px" bg="whiteAlpha.100" borderRadius="lg" p={4}>
        <VStack spacing={2}>
          <Text>Security Status</Text>
          <Badge colorScheme="green">Protected</Badge>
          <Text fontSize="sm" color="whiteAlpha.600">Multi-Party Computation</Text>
        </VStack>
      </Box>
    )
  }
];

const PlatformPreview = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
        {features.map((feature, index) => (
          <MotionBox
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: index === activeFeature ? 1 : 0.5,
              y: 0,
              scale: index === activeFeature ? 1.05 : 1
            }}
            transition={{ duration: 0.5 }}
          >
            <Box
              bg="rgba(0, 0, 0, 0.3)"
              p={6}
              borderRadius="xl"
              border="1px solid"
              borderColor="whiteAlpha.200"
              backdropFilter="blur(10px)"
              h="full"
            >
              <VStack spacing={4} align="start">
                <HStack>
                  <Box
                    p={2}
                    borderRadius="lg"
                    bg={`${feature.color}20`}
                  >
                    <feature.icon size={24} color={feature.color} />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="lg" fontWeight="bold">{feature.title}</Text>
                    <Text fontSize="sm" color="whiteAlpha.700">{feature.description}</Text>
                  </VStack>
                </HStack>

                <AnimatePresence mode="wait">
                  <MotionBox
                    key={index === activeFeature ? 'active' : 'inactive'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    w="full"
                  >
                    {feature.preview}
                  </MotionBox>
                </AnimatePresence>
              </VStack>
            </Box>
          </MotionBox>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default PlatformPreview;