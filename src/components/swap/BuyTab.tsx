import React from 'react';
import {Box, Button, HStack, Image, Input, Text, VStack,} from '@chakra-ui/react';
import {ChevronDown} from 'lucide-react';

interface BuyTabProps {
  selectedToken: any;
  buyAmount: string;
  onBuyAmountChange: (value: string) => void;
  onSelectToken: () => void;
  onSelectHoldings: () => void;
  cryptoAmount: string;
}

const BuyTab: React.FC<BuyTabProps> = ({
  selectedToken,
  buyAmount,
  onBuyAmountChange,
  onSelectToken,
  onSelectHoldings,
  cryptoAmount,
}) => {
  return (
      <VStack spacing={4}>
        {/* Token Selection */}
        <Box w="full" bg="whiteAlpha.50" p={4} borderRadius="xl">
          <HStack spacing={4} justify="space-between">
            <HStack
                spacing={2}
                bg="whiteAlpha.100"
                p={2}
                px={4}
                borderRadius="lg"
                cursor="pointer"
                onClick={onSelectToken}
            >
              <Image
                  src={selectedToken.icon}
                  alt={selectedToken.symbol}
                  boxSize="24px"
              />
              <Text>{selectedToken.symbol}</Text>
              <ChevronDown size={16}/>
            </HStack>
            <VStack align="end" flex={1}>
              <Text fontSize="sm" color="whiteAlpha.600">Exchange Rate</Text>
              <Text>1 {selectedToken.symbol} ≈ {selectedToken.price}</Text>
            </VStack>
          </HStack>
        </Box>
        {/* Amount Input */}
        <Box w="full" bg="whiteAlpha.50" p={4} borderRadius="xl">
          <Text mb={2} color="whiteAlpha.600">Amount</Text>
          <Input
              value={buyAmount}
              onChange={(e) => onBuyAmountChange(e.target.value)}
              placeholder="Enter USD amount"
              bg="transparent"
              border="none"
              fontSize="xl"
              _focus={{boxShadow: 'none'}}
          />
          <HStack justify="space-between" mt={2}>
            <Text fontSize="sm" color="whiteAlpha.600">
              ≈ {cryptoAmount} {selectedToken.symbol}
            </Text>
            <Text fontSize="sm" color="whiteAlpha.600">
              {buyAmount ? `$${buyAmount} USD` : ''}
            </Text>
          </HStack>
        </Box>

        {/* Pay with Holdings */}
        <Box w="full" bg="whiteAlpha.50" p={4} borderRadius="xl">
          <Text mb={2} color="whiteAlpha.600">Pay with</Text>
          <HStack spacing={4} justify="space-between">
            <HStack spacing={2} bg="whiteAlpha.100" p={2} px={4} borderRadius="lg" cursor="pointer"
                    onClick={onSelectHoldings}>
              <HStack spacing={1}>
                <Image src="https://cryptologos.cc/logos/tether-usdt-logo.png" boxSize="20px"/>
                <Image src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png" boxSize="20px"/>
                <Image src="https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png" boxSize="20px"/>
              </HStack>
              <ChevronDown size={16}/>
            </HStack>
            <Text fontSize="sm" color="whiteAlpha.600">Balance: $5,000.00</Text>
          </HStack>
        </Box>

        {/* Quick Amount Buttons */}
        <HStack spacing={2}>
          {['$10', '$20', '$100', 'Half', 'Max'].map((amount) => (
              <Button
                  key={amount}
                  size="sm"
                  variant="ghost"
                  color="white"
                  _hover={{bg: 'whiteAlpha.200'}}
              >
                {amount}
              </Button>
          ))}
        </HStack>

        {/* Buy Button */}
        <Button
            colorScheme="blue"
            size="lg"
            w="full"
            h="56px"
            fontSize="lg"
            onClick={onSelectHoldings}
        >
          Buy {selectedToken.symbol}
        </Button>
      </VStack>
  );
};

export default BuyTab;