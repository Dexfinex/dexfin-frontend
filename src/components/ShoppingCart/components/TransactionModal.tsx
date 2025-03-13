import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    Link as ChakraLink,
    Text,
    Box,
    VStack,
    HStack,
    Divider,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
} from '@chakra-ui/react';
import { Check } from 'lucide-react';
import { TransactionModalProps } from '../../../types/cart.type';

export const TransactionModal = ({
    open,
    setOpen,
    transactionHashes,
    chainExplorerUrl,
    tokenDetails,
}: TransactionModalProps) => {
    const totalCost = tokenDetails.reduce((sum, token) => sum + token.costInUSD, 0);

    return (
        <Modal
            isCentered
            motionPreset="slideInBottom"
            closeOnOverlayClick={true}
            isOpen={open}
            onClose={() => setOpen(false)}
        >
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent
                bg="#0e0e0e"
                color="white"
                borderRadius="xl"
                p={0}
            >
                <ModalCloseButton color="white" />

                <ModalBody display="flex" gap="8px" flexDir="column" alignItems="center" marginY="4rem" color="white">
                    <Box className="flex-center mb-4">
                        <Box
                            backgroundColor="#00ffbf1a"
                            color="#0dda75"
                            borderRadius="100%"
                            p="1.5rem"
                            fontSize="2rem"
                        >
                            <Check />
                        </Box>
                    </Box>
                    <Text as="h1" fontSize="xl" fontWeight="600" mb={4}>
                        Transactions Submitted
                    </Text>

                    <VStack spacing={3} width="100%" px={4}>
                        {tokenDetails.map((token, index) => (
                            <HStack key={index} justify="space-between" width="100%">
                                <Text color="gray.300">Amount:</Text>
                                <Text fontWeight="500">
                                    {token.amount} {token.tokenSymbol}
                                </Text>
                            </HStack>
                        ))}
                        <Divider my={2} borderColor="gray.700" />
                        <HStack justify="space-between" width="100%">
                            <Text color="gray.300">Total Cost:</Text>
                            <Text fontWeight="500">
                                ${totalCost.toFixed(2)} USD
                            </Text>
                        </HStack>
                    </VStack>

                    <VStack width="100%" px={4} spacing={4} mt={4}>
                        <Accordion allowMultiple width="100%">
                            {transactionHashes.map((hash, index) => (
                                <AccordionItem
                                    key={hash}
                                    border="1px solid"
                                    borderColor="gray.700"
                                    borderRadius="md"
                                    mb={2}
                                >
                                    <AccordionButton
                                        _hover={{ bg: 'whiteAlpha.50' }}
                                        borderRadius="md"
                                    >
                                        <Box flex="1" textAlign="left">
                                            <Text fontWeight="500">
                                                Transaction #{index + 1}
                                            </Text>
                                        </Box>
                                    </AccordionButton>
                                    <AccordionPanel pb={4}>
                                        <ChakraLink
                                            href={`${chainExplorerUrl}/tx/${hash}`}
                                            isExternal
                                            color="#3b82f6"
                                            _hover={{ color: '#60a5fa' }}
                                            fontSize="sm"
                                            wordBreak="break-all"
                                        >
                                            {hash}
                                        </ChakraLink>
                                    </AccordionPanel>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </VStack>
                </ModalBody>

                <Box p={4}>
                    <ChakraLink
                        onClick={() => setOpen(false)}
                        fontSize="lg"
                        textAlign="center"
                        padding="6px 1rem"
                        borderRadius="0.375rem"
                        bg="#183f6d"
                        display="block"
                        color="white"
                        cursor="pointer"
                        _hover={{
                            textDecoration: 'none',
                            bg: '#224b82'
                        }}
                    >
                        Close
                    </ChakraLink>
                </Box>
            </ModalContent>
        </Modal>
    );
};

