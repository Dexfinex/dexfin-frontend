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
  Avatar,
  Flex,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon } from 'lucide-react';

const MotionBox = motion(Box);

interface Message {
  id: string;
  sender: string;
  avatar: string;
  content: string;
  timestamp: string;
}

const messages: Message[] = [
  {
    id: '1',
    sender: '0xbeyofcd',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    content: 'Anyone looking at the new DEX launch? 🚀',
    timestamp: '10:00 pm',
  },
  {
    id: '2',
    sender: '0xh88br59k',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    content: 'Yeah, the TVL is growing fast! Already at $2M 📈',
    timestamp: '10:01 pm',
  }
];

const ChatPreview = () => {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Show all messages immediately on first render
    setVisibleMessages(messages);

    // Then start the animation cycle
    const interval = setInterval(() => {
      setVisibleMessages([]);
      // Short delay before starting new cycle
      setTimeout(() => {
        messages.forEach((message, index) => {
          setTimeout(() => {
            setVisibleMessages(prev => [...prev, message]);
          }, index * 800); // Faster message appearance
        });
      }, 300);
    }, 8000); // Longer cycle duration

    return () => clearInterval(interval);
  }, []);

  return (
    <VStack spacing={4} h="full" w="full">
      {/* Chat Messages */}
      <Box
        flex={1}
        w="full"
        bg="whiteAlpha.50"
        borderRadius="lg"
        p={4}
        overflowY="hidden"
        position="relative"
      >
        <AnimatePresence mode="sync">
          {visibleMessages.map((message, index) => (
            <MotionBox
              key={`${message.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              mb={3}
            >
              <HStack align="start" spacing={3}>
                <Avatar src={message.avatar} size="sm" />
                <Box flex={1}>
                  <Flex justify="space-between" align="center" mb={1}>
                    <Text fontSize="sm" color="whiteAlpha.800">{message.sender}</Text>
                    <Text fontSize="xs" color="whiteAlpha.600">{message.timestamp}</Text>
                  </Flex>
                  <Box
                    bg="whiteAlpha.100"
                    p={3}
                    borderRadius="lg"
                    fontSize="sm"
                  >
                    {message.content}
                  </Box>
                </Box>
              </HStack>
            </MotionBox>
          ))}
        </AnimatePresence>
      </Box>

      {/* Input Area */}
      <InputGroup size="lg">
        <Input
          placeholder="Type a message..."
          bg="whiteAlpha.100"
          border="none"
          _focus={{ boxShadow: 'none', bg: 'whiteAlpha.200' }}
          pr="100px"
          readOnly
        />
        <InputRightElement width="100px">
          <HStack spacing={2} pr={2}>
            <IconButton
              aria-label="Add image"
              icon={<ImageIcon size={18} color="white" />}
              variant="ghost"
              size="sm"
              color="white"
              _hover={{ color: "blue.400", bg: 'whiteAlpha.200' }}
            />
            <IconButton
              aria-label="Send message"
              icon={<Send size={18} color="white" />}
              variant="ghost"
              size="sm"
              color="white"
              _hover={{ color: "blue.400", bg: 'whiteAlpha.200' }}
            />
          </HStack>
        </InputRightElement>
      </InputGroup>
    </VStack>
  );
};

export default ChatPreview;