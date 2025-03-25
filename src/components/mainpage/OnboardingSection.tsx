import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Mail, Fingerprint, CheckCircle2, Bitcoin, CreditCard, Coins, Shield } from 'lucide-react';

const MotionBox = motion(Box);

const OnboardingSection = () => {
  const [activeBox, setActiveBox] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [completedBoxes, setCompletedBoxes] = useState<number[]>([]);

  useEffect(() => {
    // Handle step transitions
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= 2) {
          // Add current box to completed boxes
          setCompletedBoxes(prev => [...prev, activeBox]);
          
          // Move to next box after a delay
          setTimeout(() => {
            setActiveBox((prevBox) => {
              if (prevBox < 2) {
                setActiveStep(0);
                return prevBox + 1;
              }
              return prevBox;
            });
          }, 300);
          return 2; // Keep showing completion state
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(stepInterval);
  }, [activeBox]);

  const boxVariants = {
    inactive: {
      scale: 0.95,
      opacity: 0.5,
      filter: 'blur(2px)',
    },
    active: {
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
    },
    complete: {
      scale: 0.95,
      opacity: 0.8,
      filter: 'blur(0px)',
    },
  };

  const arrowVariants = {
    hidden: {
      opacity: 0,
      x: -10,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  const getStepContent = (boxIndex: number, stepIndex: number) => {
    const steps = {
      0: [
        { icon: Fingerprint, text: "Use Biometric Authentication" },
        { icon: Mail, text: "Or Connect with Email" },
        { icon: CheckCircle2, text: "Account Created!" },
      ],
      1: [
        { icon: CreditCard, text: "Add Funds with Card" },
        { icon: Bitcoin, text: "Or Deposit Crypto" },
        { icon: CheckCircle2, text: "Account Funded!" },
      ],
      2: [
        { icon: Coins, text: "Swap Tokens" },
        { icon: Shield, text: "Earn Yield" },
        { icon: CheckCircle2, text: "Start Earning!" },
      ],
    };

    const currentStep = steps[boxIndex as keyof typeof steps][stepIndex];
    
    return (
      <MotionBox
        key={`${boxIndex}-${stepIndex}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="full"
      >
        <Icon
          as={currentStep.icon}
          boxSize={12}
          mb={4}
          color={stepIndex === 2 ? "green.400" : "white"}
        />
        <Text textAlign="center" fontSize="lg" color="white">
          {currentStep.text}
        </Text>
      </MotionBox>
    );
  };

  const StepIndicator = ({ isActive, isComplete }: { isActive: boolean; isComplete: boolean }) => (
    <MotionBox
      width="8px"
      height="8px"
      borderRadius="full"
      bg={isComplete ? "green.400" : isActive ? "blue.400" : "whiteAlpha.200"}
      initial={false}
      animate={{
        scale: isActive ? [1, 1.2, 1] : 1,
        opacity: isComplete ? 1 : isActive ? 1 : 0.5,
      }}
      transition={{
        duration: 0.2,
        repeat: isActive ? Infinity : 0,
        repeatType: "reverse",
      }}
    />
  );

  return (
    <Box 
      py={20} 
      position="relative" 
      overflow="hidden"
      bg="rgba(0, 12, 24, 0.95)"
      backdropFilter="blur(10px)"
    >
      <Container maxW="container.xl">
        <VStack spacing={12} align="center" mb={12}>
          <Text fontSize={{ base: '3xl', md: '5xl' }} fontWeight="bold" textAlign="center" color="white">
            Get Started in Minutes
          </Text>
          <Text fontSize={{ base: 'lg', md: 'xl' }} color="whiteAlpha.800" maxW="2xl" textAlign="center">
            Experience the easiest way to enter the world of DeFi
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} position="relative">
          {/* Step Indicators */}
          <Box
            position="absolute"
            top="-40px"
            left="50%"
            transform="translateX(-50%)"
            zIndex={2}
          >
            <HStack spacing={4}>
              {[0, 1, 2].map((index) => (
                <HStack key={index} spacing={2}>
                  <StepIndicator
                    isActive={activeBox === index}
                    isComplete={completedBoxes.includes(index)}
                  />
                  {index < 2 && (
                    <Box
                      w="20px"
                      h="1px"
                      bg="whiteAlpha.200"
                      transform="translateY(1px)"
                    />
                  )}
                </HStack>
              ))}
            </HStack>
          </Box>

          {/* Connecting Arrows */}
          {[0, 1].map((index) => (
            <MotionBox
              key={`arrow-${index}`}
              position="absolute"
              top="50%"
              left={`${33 + (index * 33)}%`}
              transform="translateY(-50%)"
              zIndex={1}
              variants={arrowVariants}
              initial="hidden"
              animate={activeBox === index ? "visible" : "hidden"}
            >
              <Icon 
                as={ArrowRight} 
                boxSize={8} 
                color="blue.400"
                filter="drop-shadow(0 0 8px rgba(66, 153, 225, 0.5))"
              />
            </MotionBox>
          ))}

          {/* Boxes */}
          {[0, 1, 2].map((boxIndex) => (
            <MotionBox
              key={boxIndex}
              variants={boxVariants}
              initial="inactive"
              animate={
                completedBoxes.includes(boxIndex) 
                  ? "complete" 
                  : activeBox === boxIndex 
                    ? "active" 
                    : "inactive"
              }
              transition={{ duration: 0.3 }}
              whileHover={{ scale: activeBox === boxIndex ? 1.02 : 1 }}
            >
              <Box
                bg="rgba(0, 0, 0, 0.3)"
                p={6}
                borderRadius="2xl"
                border="1px solid rgba(255, 255, 255, 0.1)"
                height="full"
                position="relative"
                overflow="hidden"
                backdropFilter="blur(10px)"
                boxShadow={activeBox === boxIndex ? "0 0 30px rgba(66, 153, 225, 0.2)" : "none"}
                transition="all 0.2s ease"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bg: `linear-gradient(45deg, ${
                    boxIndex === 0 ? "rgba(66, 153, 225, 0.1)" :
                    boxIndex === 1 ? "rgba(159, 122, 234, 0.1)" :
                    "rgba(72, 187, 120, 0.1)"
                  }, transparent)`,
                  borderRadius: '2xl',
                  opacity: 0.5,
                }}
              >
                <VStack spacing={4} align="stretch" height="full">
                  <Text fontSize="xl" fontWeight="bold" mb={2} color="white">
                    {boxIndex + 1}. {
                      boxIndex === 0 ? "Create Account" :
                      boxIndex === 1 ? "Add Funds" :
                      "Start Using DeFi"
                    }
                  </Text>
                  
                  <Box flex={1} position="relative" minH="180px">
                    <AnimatePresence mode="wait">
                      {getStepContent(boxIndex, activeStep)}
                    </AnimatePresence>
                  </Box>

                  {completedBoxes.includes(boxIndex) && (
                    <Box
                      position="absolute"
                      top={4}
                      right={4}
                      bg="green.500"
                      borderRadius="full"
                      p={2}
                    >
                      <CheckCircle2 size={20} />
                    </Box>
                  )}
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default OnboardingSection;