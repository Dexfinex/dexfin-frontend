import React from 'react';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import LogoCloud from './LogoCloud';

const MotionBox = motion(Box);

const UniverseBackground = () => {
  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      overflow="hidden"
      zIndex={0}
    >
      {/* Base gradient background */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="linear(to-br, blue.600, blue.800)"
        opacity={0.95}
      />

      {/* Logo Cloud */}
      <LogoCloud />

      {/* Animated gradient overlay */}
      <MotionBox
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        background="radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.3) 100%)"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      {/* Additional atmosphere effects */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="radial(circle at 50% 0%, rgba(66, 153, 225, 0.3), transparent 70%)"
      />

      {/* Light rays effect */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        width="200%"
        height="200%"
        background="conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(255,255,255,0.05) 60deg, transparent 120deg)"
        animation="rotate 60s linear infinite"
        style={{
          '@keyframes rotate': {
            '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
            '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
          }
        }}
      />
    </Box>
  );
};

export default UniverseBackground;