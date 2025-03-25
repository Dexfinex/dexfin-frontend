import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  useToast,
  Icon,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Rocket, ArrowRight } from 'lucide-react';
import axios from "axios";

const MotionBox = motion(Box);

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const CTASection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    try {
      const response = await axios.post('https://dexfin-email-backend-production.up.railway.app/api/submit-email', { email },{
        headers: {
          'Content-Type': 'application/json',
        },
      });
      toast({
        title: "Success",
        description: response.data.message,
        status: "success",
        duration: 5000,
      });

    } catch(e) {
      // Handle error
      toast({
        title: "Error Occurred",
        description: "Please try again",
        status: "error",
        duration: 5000,
      });
    }

    setEmail('');
    setIsSubmitting(false);
  };

  return (
    <Box 
      py={20} 
      position="relative" 
      overflow="hidden"
      bg="rgba(0, 12, 24, 0.98)"
      backdropFilter="blur(10px)"
    >
      {/* Background Elements */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="linear(to-b, transparent, rgba(0, 0, 0, 0.4))"
        pointerEvents="none"
      />
      
      <MotionBox
        position="absolute"
        top="50%"
        left="0"
        w="300px"
        h="300px"
        bgGradient="radial(circle at center, blue.500 0%, transparent 70%)"
        opacity={0.1}
        filter="blur(60px)"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      <MotionBox
        position="absolute"
        top="50%"
        right="0"
        w="300px"
        h="300px"
        bgGradient="radial(circle at center, blue.500 0%, transparent 70%)"
        opacity={0.1}
        filter="blur(60px)"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.1, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <Container maxW="container.xl" position="relative">
        <VStack spacing={12} align="center">
          {/* Main Content */}
          <VStack spacing={6} textAlign="center" maxW="3xl">
            <HStack spacing={2}>
              <Icon as={Rocket} color="white" boxSize={6} />
              <Text color="white" fontWeight="medium">
                Join the Future of DeFi
              </Text>
            </HStack>
            
            <Text fontSize={{ base: '3xl', md: '5xl' }} fontWeight="bold" lineHeight="shorter" color="white">
              Be Among the First to Experience Dexfin
            </Text>
            
            <Text fontSize={{ base: 'lg', md: 'xl' }} color="whiteAlpha.800">
              Join our waitlist to get early access and exclusive benefits when we launch
            </Text>
          </VStack>

          {/* Signup Form */}
          <Box
            as="form"
            onSubmit={handleSubmit}
            w="full"
            maxW="2xl"
            bg="rgba(0, 0, 0, 0.4)"
            borderRadius="2xl"
            p={8}
            border="1px solid"
            borderColor="whiteAlpha.100"
            backdropFilter="blur(10px)"
          >
            <VStack spacing={6}>
              <HStack w="full" spacing={4}>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="lg"
                  bg="whiteAlpha.100"
                  border="none"
                  _focus={{
                    boxShadow: 'none',
                    bg: 'whiteAlpha.200',
                  }}
                  _placeholder={{
                    color: 'whiteAlpha.500',
                  }}
                  _invalid={{
                    borderColor: 'red.500',
                    boxShadow: '0 0 0 1px red.500',
                  }}
                />
                <Button
                  colorScheme="blue"
                  size="lg"
                  px={8}
                  isLoading={isSubmitting}
                  type="submit"
                  rightIcon={<ArrowRight size={18} />}
                >
                  Join Waitlist
                </Button>
              </HStack>

              <HStack spacing={6} justify="center">
                <Badge colorScheme="green" px={3} py={1}>
                  Early Access
                </Badge>
                <Badge colorScheme="blue" px={3} py={1}>
                  Exclusive Rewards
                </Badge>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default CTASection;