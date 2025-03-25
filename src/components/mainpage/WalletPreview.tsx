import React, { useState, useEffect } from 'react';
import {
  Box,
  HStack,
  Text,
  Button,
  Icon,
  VStack,
  Progress,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Fingerprint, 
  Lock, 
  Shield, 
  CheckCircle2, 
  Chrome,
  Wallet as WalletIcon,
  Ghost
} from 'lucide-react';

const MotionBox = motion(Box);

const WalletPreview = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeOption, setActiveOption] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Cycle through authentication options
    const interval = setInterval(() => {
      setActiveOption((prev) => {
        if (!prev) return 'fingerprint';
        if (prev === 'fingerprint') return 'google';
        if (prev === 'google') return 'metamask';
        if (prev === 'metamask') return 'phantom';
        return null;
      });
      
      if (!activeOption) {
        setIsScanning(true);
        setTimeout(() => {
          setIsScanning(false);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
        }, 2000);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeOption]);

  return (
    <Box position="relative" h="full" w="full">
      <AnimatePresence>
        {showSuccess && (
          <MotionBox
            position="absolute"
            top={4}
            right={4}
            bg="green.500"
            color="white"
            px={3}
            py={1}
            borderRadius="md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <HStack spacing={1}>
              <CheckCircle2 size={14} />
              <Text>Wallet Created</Text>
            </HStack>
          </MotionBox>
        )}
      </AnimatePresence>

      <VStack 
        spacing={6} 
        h="full" 
        w="full" 
        bg="whiteAlpha.50" 
        borderRadius="lg"
        p={6}
      >
        {/* Security Features */}
        <VStack spacing={4} w="full">
          <HStack spacing={2}>
            <Shield size={16} />
            <Text fontWeight="medium">Security Features</Text>
          </HStack>

          <Box
            bg="whiteAlpha.100"
            p={4}
            borderRadius="lg"
            w="full"
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            <VStack align="start" spacing={3}>
              <HStack>
                <CheckCircle2 size={16} color="green" />
                <Text>2-Factor Authentication</Text>
              </HStack>
              <HStack>
                <CheckCircle2 size={16} color="green" />
                <Text>Biometric Verification</Text>
              </HStack>
              <HStack>
                <CheckCircle2 size={16} color="green" />
                <Text>Hardware Security Keys</Text>
              </HStack>
            </VStack>
          </Box>
        </VStack>

        {/* Authentication Options */}
        <VStack spacing={4} w="full">
          {/* Fingerprint Scanner */}
          <Box position="relative" w="full" h="80px" display="flex" justifyContent="center" alignItems="center">
            <MotionBox
              w="80px"
              h="80px"
              borderRadius="full"
              border="2px solid"
              borderColor={isScanning ? "blue.400" : "whiteAlpha.400"}
              position="relative"
              animate={isScanning ? {
                scale: [1, 1.1, 1],
                borderColor: ["rgba(66, 153, 225, 0.5)", "rgba(66, 153, 225, 1)", "rgba(66, 153, 225, 0.5)"]
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Icon 
                as={Fingerprint} 
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                boxSize={10}
                color={isScanning ? "blue.400" : "whiteAlpha.400"}
              />
            </MotionBox>
          </Box>

          {/* Google Sign-in */}
          <Button
            w="full"
            variant="outline"
            leftIcon={<Chrome size={20} />}
            justifyContent="start"
            bg={activeOption === 'google' ? 'whiteAlpha.200' : 'transparent'}
            _hover={{ bg: 'whiteAlpha.100' }}
            transition="all 0.2s"
            color="white"
          >
            Sign in with Google
          </Button>

          {/* MetaMask */}
          <Button
            w="full"
            variant="outline"
            leftIcon={<WalletIcon size={20} />}
            justifyContent="start"
            bg={activeOption === 'metamask' ? 'whiteAlpha.200' : 'transparent'}
            _hover={{ bg: 'whiteAlpha.100' }}
            transition="all 0.2s"
            color="white"
          >
            Connect MetaMask
          </Button>

          {/* Phantom */}
          <Button
            w="full"
            variant="outline"
            leftIcon={<Ghost size={20} />}
            justifyContent="start"
            bg={activeOption === 'phantom' ? 'whiteAlpha.200' : 'transparent'}
            _hover={{ bg: 'whiteAlpha.100' }}
            transition="all 0.2s"
            color="white"
          >
            Connect Phantom
          </Button>
        </VStack>

        {/* Status */}
        <HStack spacing={2} color="whiteAlpha.600">
          <Lock size={14} />
          <Text fontSize="sm">End-to-end encryption</Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default WalletPreview;