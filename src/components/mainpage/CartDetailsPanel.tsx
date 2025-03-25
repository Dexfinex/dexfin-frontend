import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Image,
  IconButton,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  symbol: string;
  price: string;
  icon: string;
  quantity: number;
}

interface CartDetailsPanelProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  total: number;
}

const CartDetailsPanel = ({ cartItems, onUpdateQuantity, onRemoveItem, onCheckout, total }: CartDetailsPanelProps) => {
  const handleQuantityChange = (id: string, valueAsString: string) => {
    // Allow decimal input while typing
    if (valueAsString === '' || valueAsString === '.') {
      return;
    }

    const valueAsNumber = parseFloat(valueAsString);
    if (!isNaN(valueAsNumber)) {
      // Ensure minimum value is 0.001 and maximum precision is 8 decimal places
      const finalValue = Math.max(0.001, Number(valueAsNumber.toFixed(8)));
      onUpdateQuantity(id, finalValue);
    }
  };

  const calculateItemTotal = (price: string, quantity: number) => {
    const numericPrice = parseFloat(price.replace('$', '').replace(/,/g, ''));
    return numericPrice * quantity;
  };

  const getStepSize = (symbol: string) => {
    // Use smaller step sizes for tokens with very small values
    if (symbol === 'SHIB' || symbol === 'PEPE' || symbol === 'BONK') {
      return 0.000001;
    }
    return 0.001;
  };

  return (
    <Box
      w="400px"
      h="full"
      borderLeft="1px"
      borderColor="whiteAlpha.200"
      bg="rgba(0, 0, 0, 0.3)"
    >
      <VStack h="full" spacing={0}>
        {/* Header */}
        <Box p={4} w="full" borderBottom="1px" borderColor="whiteAlpha.200">
          <Text fontSize="lg" fontWeight="bold">Cart Summary</Text>
        </Box>

        {/* Cart Items */}
        <Box flex={1} w="full" overflowY="auto" p={4}>
          <VStack spacing={4} align="stretch">
            {cartItems.map((item) => {
              const stepSize = getStepSize(item.symbol);
              return (
                <Box
                  key={item.id}
                  bg="whiteAlpha.100"
                  p={4}
                  borderRadius="lg"
                >
                  <HStack spacing={4}>
                    <Image src={item.icon} alt={item.name} boxSize="40px" />
                    <VStack flex={1} align="start" spacing={0}>
                      <Text fontWeight="bold">{item.name}</Text>
                      <Text fontSize="sm" color="whiteAlpha.700">{item.symbol}</Text>
                    </VStack>
                    <VStack align="end" spacing={0}>
                      <Text>{item.price}</Text>
                      <Text fontSize="sm" color="whiteAlpha.700">
                        Total: ${calculateItemTotal(item.price, item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                      </Text>
                    </VStack>
                  </HStack>

                  <HStack mt={4} justify="space-between">
                    <HStack>
                      <IconButton
                        aria-label="Decrease quantity"
                        icon={<Minus size={16} />}
                        size="sm"
                        onClick={() => {
                          const newQuantity = Math.max(0.001, item.quantity - stepSize);
                          onUpdateQuantity(item.id, Number(newQuantity.toFixed(8)));
                        }}
                        isDisabled={item.quantity <= 0.001}
                      />
                      <NumberInput
                        value={item.quantity}
                        onChange={(valueString) => handleQuantityChange(item.id, valueString)}
                        min={0.001}
                        precision={8}
                        step={stepSize}
                        w="120px"
                        size="sm"
                        allowMouseWheel
                        keepWithinRange={false}
                        clampValueOnBlur={true}
                      >
                        <NumberInputField 
                          textAlign="center"
                          inputMode="decimal"
                          pattern="^\d*\.?\d*$"
                        />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <IconButton
                        aria-label="Increase quantity"
                        icon={<Plus size={16} />}
                        size="sm"
                        onClick={() => {
                          const newQuantity = item.quantity + stepSize;
                          onUpdateQuantity(item.id, Number(newQuantity.toFixed(8)));
                        }}
                      />
                    </HStack>
                    <IconButton
                      aria-label="Remove item"
                      icon={<Trash2 size={16} />}
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                      _hover={{ color: 'red.400' }}
                    />
                  </HStack>
                </Box>
              );
            })}
          </VStack>
        </Box>

        {/* Total and Checkout */}
        <Box w="full" p={4} borderTop="1px" borderColor="whiteAlpha.200">
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontSize="lg" fontWeight="medium">Total</Text>
              <Text fontSize="lg" fontWeight="bold">
                ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </HStack>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={onCheckout}
              isDisabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default CartDetailsPanel;