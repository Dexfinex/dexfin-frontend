import React from 'react';
import { Box, Container, Text, VStack } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionText = motion(Text);

const propositions = [
  { text: "No gas.", color: "blue.400" },
  { text: "No wallets.", color: "purple.400" },
  { text: "No bridging.", color: "green.400" },
  { text: "No seed phrases.", color: "yellow.400" },
  { text: "100% onchain.", color: "cyan.400" },
];

const ValuePropositionSection = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % propositions.length);
    }, 1500); // Faster transition between highlights

    return () => clearInterval(interval);
  }, []);

  return (
    <Box 
      py={32} 
      position="relative" 
      bg="rgba(0, 12, 24, 0.95)"
      overflow="hidden"
      backdropFilter="blur(10px)"
    >
      {/* Animated Background Gradient */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient={`radial-gradient(circle at 50% 50%, ${propositions[activeIndex].color}20, transparent 70%)`}
        transition="all 0.5s ease"
      />

      <Container maxW="container.xl" position="relative">
        <VStack 
          spacing={6}
          align="center"
          justify="center"
          minH="200px"
          position="relative"
        >
          {propositions.map((prop, index) => (
            <MotionText
              key={index}
              initial={{ opacity: 0.5 }}
              animate={{ 
                opacity: activeIndex === index ? 1 : 0.5,
                scale: activeIndex === index ? 1.1 : 1,
                x: activeIndex === index ? 20 : 0,
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut"
              }}
              fontSize={{ base: "3xl", md: "5xl" }}
              fontWeight="bold"
              textAlign="center"
              color="white"
              _hover={{
                opacity: 0.8,
                transform: "scale(1.05)",
              }}
              style={{ 
                transformOrigin: "left center",
              }}
            >
              {prop.text}
            </MotionText>
          ))}

          {/* Decorative Elements */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            width="100%"
            height="100%"
            borderRadius="full"
            border="2px solid"
            borderColor="whiteAlpha.100"
            opacity={0.1}
            as={motion.div}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            width="120%"
            height="120%"
            borderRadius="full"
            border="1px solid"
            borderColor="whiteAlpha.100"
            opacity={0.05}
            as={motion.div}
            animate={{
              rotate: [360, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </VStack>
      </Container>
    </Box>
  );
};

export default ValuePropositionSection;