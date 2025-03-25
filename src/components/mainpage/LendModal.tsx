import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Box,
  IconButton,
  Text,
  Flex,
  HStack,
  VStack,
  Input,
  Button,
  Image,
  Progress,
  Divider,
  Badge,
} from '@chakra-ui/react';
import { X, ArrowLeft, Info, Coins } from 'lucide-react';

interface LendModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: {
    name: string;
    symbol: string;
    icon: string;
    walletBalance: string;
    value: string;
    apy: string;
  };
}

const LendModal = ({ isOpen, onClose, asset }: LendModalProps) => {
  const [amount, setAmount] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isLending, setIsLending] = useState(false);

  const handleMaxAmount = () => {
    const available = parseFloat(asset.walletBalance);
    setAmount(available.toString());
  };

  const handleApprove = () => {
    setIsApproving(true);
    // Simulate approval process
    setTimeout(() => {
      setIsApproving(false);
      setIsLending(true);
    }, 2000);
  };

  const handleLend = () => {
    // Handle lending logic
    console.log('Lending:', amount, asset.symbol);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="md"
    >
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent
        bg="rgba(0, 0, 0, 0.95)"
        color="white"
        borderRadius="xl"
        p={4}
        border="1px solid rgba(255, 255, 255, 0.1)"
      >
        <Flex direction="column" gap={4}>
          {/* Header */}
          <Flex justify="space-between" align="center">
            <HStack spacing={2}>
              <IconButton
                aria-label="Back"
                icon={<ArrowLeft size={18} />}
                variant="ghost"
                size="sm"
                onClick={onClose}
              />
              <Text fontSize="lg" fontWeight="bold">Lend {asset.symbol}</Text>
            </HStack>
            <IconButton
              aria-label="Close"
              icon={<X size={18} />}
              variant="ghost"
              size="sm"
              onClick={onClose}
            />
          </Flex>

          {/* Asset Info */}
          <Box bg="whiteAlpha.100" p={4} borderRadius="lg">
            <HStack spacing={4} mb={4}>
              <Image
                src={asset.icon}
                alt={asset.name}
                boxSize="32px"
              />
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold">{asset.name}</Text>
                <Text fontSize="sm" color="whiteAlpha.700">{asset.symbol}</Text>
              </VStack>
            </HStack>

            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" color="whiteAlpha.700">Supply APY</Text>
              <Text color="green.400" fontWeight="bold">{asset.apy}</Text>
            </HStack>

            <HStack justify="space-between">
              <Text fontSize="sm" color="whiteAlpha.700">Wallet Balance</Text>
              <Text>{asset.walletBalance} {asset.symbol}</Text>
            </HStack>
          </Box>

          {/* Amount Input */}
          <Box>
            <Flex justify="space-between" mb={2}>
              <Text fontSize="sm">Amount</Text>
              <Text fontSize="sm" color="whiteAlpha.700">
                Available: {asset.walletBalance} {asset.symbol}
              </Text>
            </Flex>
            <Box position="relative">
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                bg="whiteAlpha.100"
                border="none"
                _focus={{ boxShadow: 'none', bg: 'whiteAlpha.200' }}
                pr="100px"
              />
              <HStack
                position="absolute"
                right="4"
                top="50%"
                transform="translateY(-50%)"
                spacing={2}
              >
                <Button
                  size="xs"
                  onClick={handleMaxAmount}
                  variant="ghost"
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  MAX
                </Button>
                <Text>{asset.symbol}</Text>
              </HStack>
            </Box>
          </Box>

          {/* Supply Info */}
          <Box bg="whiteAlpha.100" p={4} borderRadius="lg">
            <VStack align="stretch" spacing={3}>
              <HStack justify="space-between">
                <Text fontSize="sm" color="whiteAlpha.700">You will receive</Text>
                <Text>{amount || '0.00'} a{asset.symbol}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color="whiteAlpha.700">Exchange rate</Text>
                <Text>1 {asset.symbol} = 1 a{asset.symbol}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color="whiteAlpha.700">Collateral factor</Text>
                <Badge colorScheme="green">80%</Badge>
              </HStack>
            </VStack>
          </Box>

          {/* Risk Warning */}
          <Box bg="yellow.900" p={4} borderRadius="lg" opacity={0.8}>
            <HStack spacing={2} mb={2}>
              <Info size={16} />
              <Text fontWeight="bold">Important Notice</Text>
            </HStack>
            <Text fontSize="sm" color="whiteAlpha.800">
              Lending involves locking up your tokens. Interest rates may vary based on market conditions.
            </Text>
          </Box>

          {/* Action Buttons */}
          <VStack spacing={3}>
            {!isLending ? (
              <Button
                colorScheme="blue"
                size="lg"
                width="full"
                isLoading={isApproving}
                loadingText="Approving..."
                onClick={handleApprove}
                isDisabled={!amount || parseFloat(amount) <= 0}
              >
                Approve {asset.symbol}
              </Button>
            ) : (
              <Button
                colorScheme="green"
                size="lg"
                width="full"
                onClick={handleLend}
              >
                Supply
              </Button>
            )}
          </VStack>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default LendModal;