import React from 'react';
import {
    VStack,
    Box,
    HStack,
    Text,
    Button,
    Input,
    Image,
} from '@chakra-ui/react';
import {ChevronDown} from 'lucide-react';

interface SellTabProps {
    selectedToken: any;
    sellAmount: string;
    onSellAmountChange: (value: string) => void;
    onSelectToken: () => void;
    onSelectPayment: () => void;
}

const SellTab: React.FC<SellTabProps> = ({
                                             selectedToken,
                                             sellAmount,
                                             onSellAmountChange,
                                             onSelectToken,
                                             onSelectPayment,
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
                        <Text fontSize="sm" color="whiteAlpha.600">Available Balance</Text>
                        <Text>1.5 {selectedToken.symbol}</Text>
                    </VStack>
                </HStack>
            </Box>
            {/* Amount Input */}
            <Box w="full" bg="whiteAlpha.50" p={4} borderRadius="xl">
                <Text mb={2} color="whiteAlpha.600">Amount to Sell</Text>
                <Input
                    value={sellAmount}
                    onChange={(e) => onSellAmountChange(e.target.value)}
                    placeholder="0.00"
                    bg="transparent"
                    border="none"
                    fontSize="xl"
                    _focus={{boxShadow: 'none'}}
                />
                <HStack justify="space-between" mt={2}>
                    <Text fontSize="sm" color="whiteAlpha.600">
                        ≈
                        ${(parseFloat(sellAmount || '0') * parseFloat(selectedToken.price.replace('$', ''))).toFixed(2)}
                    </Text>
                </HStack>
            </Box>

            {/* Payment Method */}
            <Box w="full" bg="whiteAlpha.50" p={4} borderRadius="xl">
                <Text mb={2} color="whiteAlpha.600">Receive Payment In</Text>
                <Button
                    w="full"
                    variant="ghost"
                    bg="whiteAlpha.100"
                    _hover={{bg: 'whiteAlpha.200'}}
                    onClick={onSelectPayment}
                    leftIcon={<Image src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png" boxSize="20px"/>}
                    rightIcon={<ChevronDown size={16}/>}
                >
                    USDC
                </Button>
            </Box>

            {/* Sell Button */}
            <Button
                colorScheme="blue"
                size="lg"
                w="full"
                h="56px"
                fontSize="lg"
            >
                Sell {selectedToken.symbol}
            </Button>
        </VStack>
    );
};

export default SellTab;