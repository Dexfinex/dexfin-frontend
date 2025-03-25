import React, { useState } from 'react';
import {
  Box,
  Container,
  Text,
  Button,
  VStack,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';
import { ArrowRight, Zap } from 'lucide-react';
import Header from './Header';
import LogoCloud from './LogoCloud';
import OnboardingSection from './OnboardingSection';
import FeaturesSection from './FeaturesSection';
import ValuePropositionSection from './ValuePropositionSection';
import IntegrationsSection from './IntegrationsSection';
import FAQSection from './FAQSection';
import CTASection from './CTASection';
import Footer from './Footer';
import axios from "axios";

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const LandingPage: React.FC<{}> = () => {
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
    <Box bg="black" color="white" minH="100vh" position="relative">
      {/* Base Background - Hero Section */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="linear(to-br, blue.900, cyan.900)"
        opacity={0.95}
        zIndex={0}
      />
      
      {/* Content Layer */}
      <Box position="relative" zIndex={2}>
        {/* Header */}
        <Header />
        
        {/* Hero Section */}
        <Box minH="100vh" position="relative" overflow="hidden">
          {/* Logo Cloud Background */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            zIndex={1}
          >
            <LogoCloud />
            
            {/* Gradient Overlay */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bgGradient="linear(to-b, rgba(0,0,0,0), rgba(0,0,0,0.5))"
              pointerEvents="none"
            />
          </Box>

          {/* Hero Content */}
          <Container maxW="container.xl" position="relative" zIndex={2} h="100vh" display="flex" alignItems="center">
            <VStack spacing={8} align="center" textAlign="center" w="full">
              <Text 
                fontSize={{ base: '4xl', md: '6xl' }} 
                fontWeight="bold" 
                lineHeight="shorter"
                color="white"
                textShadow="0 0 20px rgba(0,0,0,0.5)"
              >
                Your Portal to DeFi
              </Text>

              <Text 
                fontSize={{ base: 'lg', md: 'xl' }} 
                color="whiteAlpha.900" 
                maxW="2xl"
                textShadow="0 2px 4px rgba(0,0,0,0.3)"
              >
                Experience the next generation of onchain finance with our all-in-one platform
              </Text>

              <Box 
                as="form" 
                onSubmit={handleSubmit}
                w="full" 
                maxW="xl"
                bg="rgba(0, 0, 0, 0.3)"
                borderRadius="2xl"
                p={8}
                border="1px solid"
                borderColor="whiteAlpha.200"
                backdropFilter="blur(10px)"
                boxShadow="0 8px 32px rgba(0,0,0,0.2)"
              >
                <VStack spacing={6}>
                  <InputGroup size="lg">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      bg="whiteAlpha.200"
                      border="none"
                      _focus={{
                        boxShadow: 'none',
                        bg: 'whiteAlpha.300',
                      }}
                      _placeholder={{
                        color: 'whiteAlpha.600',
                      }}
                      _invalid={{
                        borderColor: 'red.500',
                        boxShadow: '0 0 0 1px red.500',
                      }}
                    />
                    <InputRightElement width="auto" pr={2}>
                      <Button
                        colorScheme="blue"
                        size="sm"
                        type="submit"
                        isLoading={isSubmitting}
                        rightIcon={<ArrowRight size={16} />}
                      >
                        Join Waitlist
                      </Button>
                    </InputRightElement>
                  </InputGroup>

                  <HStack spacing={4} color="whiteAlpha.800">
                    <HStack>
                      <Zap size={16} />
                      <Text>Early access benefits</Text>
                    </HStack>
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </Container>
        </Box>

        {/* Other Sections - Darker Background */}
        <Box 
          position="relative" 
          zIndex={3}
          bgGradient="linear(to-b, rgba(0, 24, 48, 0.98), rgba(0, 12, 24, 0.98))"
        >
          <OnboardingSection />
          <FeaturesSection />
          <ValuePropositionSection />
          <IntegrationsSection />
          <FAQSection />
          <CTASection />
          <Footer />
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;