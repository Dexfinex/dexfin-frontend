import React from 'react';
import {
  VStack,
  Box,
  HStack,
  Text,
  Button,
  Input,
  Image,
  Badge,
  Progress,
} from '@chakra-ui/react';
import { ArrowDown, ChevronDown } from 'lucide-react';

interface SwapTabProps {
  fromToken: any;
  toToken: any;
  fromAmount: string;
  onFromAmountChange: (value: string) => void;
  onSelectToken: (field: 'from' | 'to') => void;
  bestRoute?: any;
  fees?: any;
  onSwap: () => void;
}

const SwapTab: React.FC<SwapTabProps> = ({
  fromToken,
  toToken,
  fromAmount,
  onFromAmountChange,
  onSelectToken,
  bestRoute,
  onSwap
}) => {
  return (
    <VStack spacing={4}>
      {/* From Token */}
      <Box w="full" bg="whiteAlpha.50" p={4} borderRadius="xl">
        <Text mb={2} color="whiteAlpha.600">You sell</Text>
        <HStack spacing={4}>
          <Button
            variant="ghost"
            bg="whiteAlpha.100"
            _hover={{ bg: 'whiteAlpha.200' }}
            onClick={() => onSelectToken('from')}
            h="48px"
            color="white"
            minW="120px"
          >
            <HStack>
              <Image src={fromToken.icon} alt={fromToken.symbol} boxSize="24px" />
              <Text>{fromToken.symbol}</Text>
              <ChevronDown size={16} />
            </HStack>
          </Button>
          <Input
            value={fromAmount}
            onChange={(e) => onFromAmountChange(e.target.value)}
            placeholder="0.0"
            bg="transparent"
            border="none"
            fontSize="xl"
            _focus={{ boxShadow: 'none' }}
          />
        </HStack>
      </Box>

      {/* Arrow */}
      <Box p={2}>
        <ArrowDown size={20} />
      </Box>

      {/* To Token */}
      <Box w="full" bg="whiteAlpha.50" p={4} borderRadius="xl">
        <Text mb={2} color="whiteAlpha.600">You buy</Text>
        <HStack spacing={4}>
          <Button
            variant="ghost"
            bg="whiteAlpha.100"
            _hover={{ bg: 'whiteAlpha.200' }}
            onClick={() => onSelectToken('to')}
            h="48px"
            color="white"
            minW="120px"
          >
            {toToken.symbol ? (
              <HStack>
                <Image src={toToken.icon} alt={toToken.symbol} boxSize="24px" />
                <Text>{toToken.symbol}</Text>
                <ChevronDown size={16} />
              </HStack>
            ) : (
              <Text>Select Token</Text>
            )}
          </Button>
          <Input
            value={bestRoute?.toAmount || ''}
            placeholder="0.0"
            bg="transparent"
            border="none"
            fontSize="xl"
            _focus={{ boxShadow: 'none' }}
            readOnly
          />
        </HStack>
      </Box>

      {/* Swap Details */}
      {bestRoute && (
        <Box w="full" bg="whiteAlpha.50" p={4} borderRadius="xl">
          <VStack align="stretch" spacing={3}>
            <HStack justify="space-between">
              <Text color="whiteAlpha.600">Rate</Text>
              <Text>1 {fromToken.symbol} = {bestRoute.rate} {toToken.symbol}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text color="whiteAlpha.600">Price Impact</Text>
              <Badge colorScheme="green">{bestRoute.priceImpact}</Badge>
            </HStack>
            <Progress
              value={parseFloat(bestRoute.priceImpact)}
              size="xs"
              colorScheme="blue"
              borderRadius="full"
            />
          </VStack>
        </Box>
      )}

      {/* Swap Button */}
      <Button
        colorScheme="blue"
        size="lg"
        width="full"
        onClick={onSwap}
        isDisabled={!fromToken.symbol || !toToken.symbol || !fromAmount}
      >
        Swap Now
      </Button>
    </VStack>
  );
};

export default SwapTab;