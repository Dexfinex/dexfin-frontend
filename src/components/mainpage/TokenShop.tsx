import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Box,
  Text,
  SimpleGrid,
  Button,
  VStack,
  HStack,
  Badge,
  Image,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { 
  ShoppingBag, 
  Sparkles, 
  Gift, 
  Zap,
  Crown,
  Gem,
  Clock,
  Star,
} from 'lucide-react';

interface TokenShopProps {
  isOpen: boolean;
  onClose: () => void;
  currentTokens: number;
}

const boostPacks = [
  {
    id: 'boost-1',
    name: 'Daily Boost',
    description: 'Double your daily scratch cards for 24 hours',
    price: 100,
    icon: Clock,
    color: '#48BB78'
  },
  {
    id: 'boost-2',
    name: 'Lucky Charm',
    description: 'Increase rare card chances by 50% for 1 hour',
    price: 200,
    icon: Star,
    color: '#9F7AEA'
  },
  {
    id: 'boost-3',
    name: 'VIP Status',
    description: 'Unlock exclusive rewards and bonuses for 7 days',
    price: 500,
    icon: Crown,
    color: '#F6E05E'
  }
];

const specialPacks = [
  {
    id: 'pack-1',
    name: 'Starter Pack',
    description: '10 scratch cards + 1 guaranteed rare',
    price: 300,
    icon: Gift,
    color: '#4299E1'
  },
  {
    id: 'pack-2',
    name: 'Premium Pack',
    description: '25 scratch cards + 1 guaranteed epic',
    price: 600,
    icon: Sparkles,
    color: '#9F7AEA'
  },
  {
    id: 'pack-3',
    name: 'Legendary Pack',
    description: '50 scratch cards + 1 guaranteed legendary',
    price: 1000,
    icon: Gem,
    color: '#F6AD55'
  }
];

const TokenShop = ({ isOpen, onClose, currentTokens }: TokenShopProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent
        bg="rgba(0, 0, 0, 0.95)"
        color="white"
        borderRadius="xl"
        p={6}
      >
        <VStack spacing={8}>
          <HStack justify="space-between" w="full">
            <Text fontSize="3xl" fontWeight="bold">Token Shop</Text>
            <HStack>
              <ShoppingBag size={24} />
              <Text fontSize="xl">{currentTokens} Tokens</Text>
            </HStack>
          </HStack>

          <Tabs variant="soft-rounded" colorScheme="blue" w="full">
            <TabList>
              <Tab>Boosts</Tab>
              <Tab>Special Packs</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <SimpleGrid columns={3} spacing={6}>
                  {boostPacks.map((pack) => (
                    <Box
                      key={pack.id}
                      bg="whiteAlpha.100"
                      p={6}
                      borderRadius="xl"
                      border="1px solid"
                      borderColor="whiteAlpha.200"
                      position="relative"
                      overflow="hidden"
                    >
                      <VStack spacing={4} align="stretch">
                        <HStack>
                          <Box
                            p={2}
                            borderRadius="lg"
                            bg={`${pack.color}20`}
                          >
                            <pack.icon size={24} color={pack.color} />
                          </Box>
                          <Text fontSize="xl" fontWeight="bold">{pack.name}</Text>
                        </HStack>

                        <Text color="whiteAlpha.800">{pack.description}</Text>

                        <HStack justify="space-between">
                          <Badge colorScheme="purple">{pack.price} Tokens</Badge>
                          <Button
                            size="sm"
                            colorScheme="blue"
                            isDisabled={currentTokens < pack.price}
                          >
                            Purchase
                          </Button>
                        </HStack>
                      </VStack>
                    </Box>
                  ))}
                </SimpleGrid>
              </TabPanel>

              <TabPanel>
                <SimpleGrid columns={3} spacing={6}>
                  {specialPacks.map((pack) => (
                    <Box
                      key={pack.id}
                      bg="whiteAlpha.100"
                      p={6}
                      borderRadius="xl"
                      border="1px solid"
                      borderColor="whiteAlpha.200"
                      position="relative"
                      overflow="hidden"
                    >
                      <VStack spacing={4} align="stretch">
                        <HStack>
                          <Box
                            p={2}
                            borderRadius="lg"
                            bg={`${pack.color}20`}
                          >
                            <pack.icon size={24} color={pack.color} />
                          </Box>
                          <Text fontSize="xl" fontWeight="bold">{pack.name}</Text>
                        </HStack>

                        <Text color="whiteAlpha.800">{pack.description}</Text>

                        <HStack justify="space-between">
                          <Badge colorScheme="purple">{pack.price} Tokens</Badge>
                          <Button
                            size="sm"
                            colorScheme="blue"
                            isDisabled={currentTokens < pack.price}
                          >
                            Purchase
                          </Button>
                        </HStack>
                      </VStack>
                    </Box>
                  ))}
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </ModalContent>
    </Modal>
  );
};

export default TokenShop;