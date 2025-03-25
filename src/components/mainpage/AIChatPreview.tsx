import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Badge,
  Flex,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Sparkles, TrendingUp, Coins, Shield } from 'lucide-react';

const MotionBox = motion(Box);
const MotionBadge = motion(Badge);

const conversations = [
  {
    id: 'swap',
    messages: [
      { type: 'user', text: 'Swap ETH to USDC for the best rate' },
      { type: 'assistant', text: 'I can help you swap ETH to USDC. The current best rate is 1 ETH = 3,150.45 USDC. Would you like to proceed?' }
    ]
  },
  {
    id: 'memecoin',
    messages: [
      { type: 'user', text: 'What\'s the latest trending memecoin?' },
      { type: 'assistant', text: 'Based on market data, $PEPE is trending with a 150% increase in 24h. Remember that memecoins are highly volatile!' }
    ]
  },
  {
    id: 'lending',
    messages: [
      { type: 'user', text: 'I want to lend USDC and earn yield' },
      { type: 'assistant', text: 'Great choice! Current USDC lending APY on Aave is 4.2%. With your balance of 5,000 USDC, you could earn about 210 USDC annually. Would you like to proceed?' }
    ]
  },
  {
    id: 'staking',
    messages: [
      { type: 'user', text: 'How can I stake ETH?' },
      { type: 'assistant', text: 'You can stake ETH through Lido for a current APR of 3.8%. This is liquid staking, meaning you\'ll receive stETH that you can use in DeFi while earning staking rewards. Would you like to stake your ETH?' }
    ]
  }
];

const getBadgeConfig = (conversationId: string) => {
  switch (conversationId) {
    case 'swap':
      return { color: "blue", icon: Sparkles, text: "Smart Swap" };
    case 'memecoin':
      return { color: "yellow", icon: TrendingUp, text: "Market Analysis" };
    case 'lending':
      return { color: "green", icon: Coins, text: "Lending Opportunity" };
    case 'staking':
      return { color: "purple", icon: Shield, text: "Staking Protocol" };
    default:
      return { color: "blue", icon: Sparkles, text: "AI Assistant" };
  }
};

const AIChatPreview = () => {
  const [activeConversation, setActiveConversation] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    // Cycle through conversations
    const interval = setInterval(() => {
      setMessageIndex(0);
      setActiveConversation((prev) => (prev + 1) % conversations.length);
      setShowBadge(true);
      setTimeout(() => setShowBadge(false), 2000);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (messageIndex < conversations[activeConversation].messages.length - 1) {
      const timer = setTimeout(() => {
        setMessageIndex(prev => prev + 1);
      }, 800);
      return () => clearInterval(timer);
    }
  }, [messageIndex, activeConversation]);

  const currentBadgeConfig = getBadgeConfig(conversations[activeConversation].id);

  return (
    <Box position="relative" h="full" w="full">
      <AnimatePresence>
        {showBadge && (
          <MotionBadge
            position="absolute"
            top={4}
            right={4}
            colorScheme={currentBadgeConfig.color}
            fontSize="sm"
            px={3}
            py={1}
            zIndex={2}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <HStack spacing={1}>
              <currentBadgeConfig.icon size={14} />
              <Text>{currentBadgeConfig.text}</Text>
            </HStack>
          </MotionBadge>
        )}
      </AnimatePresence>

      <Flex direction="column" h="full">
        {/* Chat Messages */}
        <Box
          flex={1}
          w="full"
          bg="whiteAlpha.50"
          borderRadius="lg"
          p={4}
          overflowY="hidden"
          position="relative"
          mb={4}
          minH="300px"
          maxH="400px"
        >
          <AnimatePresence mode="wait">
            <MotionBox
              key={`conversation-${activeConversation}-${messageIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <VStack align="stretch" spacing={3}>
                {conversations[activeConversation].messages.slice(0, messageIndex + 1).map((message, index) => (
                  <Box
                    key={index}
                    alignSelf={message.type === 'user' ? 'flex-end' : 'flex-start'}
                    maxW="80%"
                  >
                    <Box
                      bg={message.type === 'user' ? 'blue.500' : 'whiteAlpha.200'}
                      p={3}
                      borderRadius="lg"
                    >
                      <Text fontSize="sm">{message.text}</Text>
                    </Box>
                  </Box>
                ))}
              </VStack>
            </MotionBox>
          </AnimatePresence>

          {messageIndex < conversations[activeConversation].messages.length - 1 && (
            <Box
              position="absolute"
              bottom={3}
              left={2}
            >
              <Text fontSize="sm" color="whiteAlpha.600">Dexfin is typing...</Text>
            </Box>
          )}
        </Box>

        {/* Input Area */}
        <InputGroup size="lg">
          <Input
            placeholder="Ask anything..."
            bg="whiteAlpha.100"
            border="none"
            _focus={{ boxShadow: 'none', bg: 'whiteAlpha.200' }}
            pr="100px"
            h="48px"
            fontSize="sm"
            readOnly
          />
          <InputRightElement width="100px" h="48px">
            <HStack spacing={2} pr={2}>
              <IconButton
                aria-label="Voice input"
                icon={<Mic size={18} />}
                variant="ghost"
                size="sm"
                color={isRecording ? "red.400" : "white"}
                onClick={() => setIsRecording(!isRecording)}
                _hover={{ color: "red.400" }}
              />
              <IconButton
                aria-label="Send message"
                icon={<Send size={18} />}
                variant="ghost"
                size="sm"
                _hover={{ color: "blue.400" }}
              />
            </HStack>
          </InputRightElement>
        </InputGroup>
      </Flex>
    </Box>
  );
};

export default AIChatPreview;