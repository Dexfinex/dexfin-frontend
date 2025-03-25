import React from 'react';
import { Box, Text, HStack, Image, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const blockchains = [
  {
    name: 'Bitcoin',
    logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'
  },
  {
    name: 'Ethereum',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  },
  {
    name: 'Solana',
    logo: 'https://cryptologos.cc/logos/solana-sol-logo.png'
  },
  {
    name: 'Avalanche',
    logo: 'https://cryptologos.cc/logos/avalanche-avax-logo.png'
  },
  {
    name: 'Polygon',
    logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png'
  },
  {
    name: 'BNB Chain',
    logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
  },
  {
    name: 'Arbitrum',
    logo: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png'
  },
  {
    name: 'Base',
    logo: 'https://basescan.org/assets/base/images/svg/logos/chain-light.svg?v=24.11.1.0'
  },
  {
    name: 'Optimism',
    logo: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.svg?v=035'
  },
  {
    name: 'Fantom',
    logo: 'https://cryptologos.cc/logos/fantom-ftm-logo.png'
  },
  {
    name: 'Cosmos',
    logo: 'https://cryptologos.cc/logos/cosmos-atom-logo.png'
  },
  {
    name: 'Polkadot',
    logo: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png'
  },
  {
    name: 'Cardano',
    logo: 'https://cryptologos.cc/logos/cardano-ada-logo.png'
  },
  {
    name: 'Near',
    logo: 'https://cryptologos.cc/logos/near-protocol-near-logo.png'
  },
  {
    name: 'Tron',
    logo: 'https://cryptologos.cc/logos/tron-trx-logo.png'
  }
];

const protocols = [
  {
    name: 'Uniswap',
    logo: 'https://cryptologos.cc/logos/uniswap-uni-logo.png'
  },
  {
    name: 'Aave',
    logo: 'https://cryptologos.cc/logos/aave-aave-logo.png'
  },
  {
    name: 'Curve',
    logo: 'https://cryptologos.cc/logos/curve-dao-token-crv-logo.png'
  },
  {
    name: 'Compound',
    logo: 'https://cryptologos.cc/logos/compound-comp-logo.png'
  },
  {
    name: 'Balancer',
    logo: 'https://cryptologos.cc/logos/balancer-bal-logo.png'
  },
  {
    name: 'SushiSwap',
    logo: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png'
  },
  {
    name: 'PancakeSwap',
    logo: 'https://cryptologos.cc/logos/pancakeswap-cake-logo.png'
  },
  {
    name: 'Maker',
    logo: 'https://cryptologos.cc/logos/maker-mkr-logo.png'
  },
  {
    name: 'Chainlink',
    logo: 'https://cryptologos.cc/logos/chainlink-link-logo.png'
  },
  {
    name: 'Synthetix',
    logo: 'https://cryptologos.cc/logos/synthetix-network-token-snx-logo.png'
  },
  {
    name: 'yearn.finance',
    logo: 'https://cryptologos.cc/logos/yearn-finance-yfi-logo.png'
  },
  {
    name: '1inch',
    logo: 'https://cryptologos.cc/logos/1inch-1inch-logo.png'
  },
  {
    name: 'dYdX',
    logo: 'https://cryptologos.cc/logos/dydx-dydx-logo.png'
  },
  {
    name: 'Lido',
    logo: 'https://cryptologos.cc/logos/lido-dao-ldo-logo.png'
  }
];

const IntegrationsSection = () => {
  return (
    <Box 
      py={20} 
      bg="rgba(0, 12, 24, 0.95)" 
      position="relative" 
      overflow="hidden"
      backdropFilter="blur(10px)"
    >
      <VStack spacing={6} textAlign="center" mb={12}>
        <Text color="white" fontWeight="medium">
          With support for the most popular & newest DeFi protocols
        </Text>
        <Text fontSize={{ base: '3xl', md: '5xl' }} fontWeight="bold" maxW="4xl" color="white">
          Hundreds of supported protocols & blockchains
        </Text>
      </VStack>

      {/* Blockchains Row */}
      <Box mb={12} position="relative" overflow="hidden">
        <Text fontSize="xl" fontWeight="bold" mb={6} textAlign="center" color="white">
          Supported Blockchains
        </Text>
        <MotionBox
          display="flex"
          gap={8}
          animate={{ x: [0, -2880] }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
          whiteSpace="nowrap"
        >
          {[...blockchains, ...blockchains].map((blockchain, index) => (
            <Box
              key={`${blockchain.name}-${index}`}
              bg="rgba(0, 0, 0, 0.4)"
              borderRadius="2xl"
              px={8}
              py={4}
              minW="200px"
              backdropFilter="blur(10px)"
              border="1px solid rgba(255, 255, 255, 0.1)"
              _hover={{
                bg: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-2px)',
                transition: 'all 0.2s'
              }}
            >
              <HStack spacing={3}>
                <Image
                  src={blockchain.logo}
                  alt={blockchain.name}
                  boxSize="32px"
                  objectFit="contain"
                />
                <Text color="white" fontWeight="medium">{blockchain.name}</Text>
              </HStack>
            </Box>
          ))}
        </MotionBox>
      </Box>

      {/* Protocols Row */}
      <Box position="relative" overflow="hidden">
        <Text fontSize="xl" fontWeight="bold" mb={6} textAlign="center" color="white">
          Integrated Protocols
        </Text>
        <MotionBox
          display="flex"
          gap={8}
          animate={{ x: [-2880, 0] }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
          whiteSpace="nowrap"
        >
          {[...protocols, ...protocols].map((protocol, index) => (
            <Box
              key={`${protocol.name}-${index}`}
              bg="rgba(0, 0, 0, 0.4)"
              borderRadius="2xl"
              px={8}
              py={4}
              minW="200px"
              backdropFilter="blur(10px)"
              border="1px solid rgba(255, 255, 255, 0.1)"
              _hover={{
                bg: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-2px)',
                transition: 'all 0.2s'
              }}
            >
              <HStack spacing={3}>
                <Image
                  src={protocol.logo}
                  alt={protocol.name}
                  boxSize="32px"
                  objectFit="contain"
                />
                <Text color="white" fontWeight="medium">{protocol.name}</Text>
              </HStack>
            </Box>
          ))}
        </MotionBox>
      </Box>

      {/* Gradient Overlays */}
      <Box
        position="absolute"
        top={0}
        left={0}
        bottom={0}
        w="200px"
        bgGradient="linear(to-r, rgba(0,12,24,0.95), transparent)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        top={0}
        right={0}
        bottom={0}
        w="200px"
        bgGradient="linear(to-l, rgba(0,12,24,0.95), transparent)"
        pointerEvents="none"
      />
    </Box>
  );
};

export default IntegrationsSection;