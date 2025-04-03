import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  useToast,
  PinInput,
  PinInputField,
  HStack,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { Web3AuthContext } from "../providers/Web3AuthContext";
import { useNavigate } from "react-router-dom";
import { InfoIcon, LockIcon } from "@chakra-ui/icons";

const pulse = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
`;

const TwoFactorAuthPage = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { complete2FAAuthentication, cancel2FAAuthentication, requires2FA } =
    useContext(Web3AuthContext);
  const navigate = useNavigate();
  const toast = useToast();
  const pulseAnimation = `${pulse} 2s infinite`;

  useEffect(() => {
    if (!requires2FA) {
      navigate("/");
    }
  }, [requires2FA, navigate]);

  const handleVerify = async () => {
    if (!verificationCode) {
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await complete2FAAuthentication(verificationCode);
      if (success) {
        setTimeout(() => {
          navigate("/app");
        }, 1000);
      } else {
        toast({
          title: "Verification Failed",
          description: "The code you entered is incorrect. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        setVerificationCode("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during verification. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });

      setVerificationCode("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    cancel2FAAuthentication();
    navigate("/");
  };

  const handleChange = (value: string) => {
    setVerificationCode(value);
  };

  const handleComplete = (value: string) => {
    if (value.length === 6) {
      handleVerify();
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-b, black, #121212)"
      color="white"
    >
      <Flex
        direction="column"
        align="center"
        maxW="500px"
        w="full"
        mx="auto"
        px={4}
      >
        <Box
          p={{ base: 6, md: 10 }}
          w="full"
          borderRadius="2xl"
          bg="rgba(15, 15, 15, 0.95)"
          backdropFilter="blur(10px)"
          border="1px solid rgba(255, 255, 255, 0.1)"
          boxShadow="0 10px 30px -10px rgba(0, 0, 0, 0.5)"
          overflow="hidden"
          position="relative"
        >
          <Box
            position="absolute"
            top="-20px"
            left="-20px"
            w="120px"
            h="120px"
            borderRadius="full"
            bg="blue.500"
            opacity="0.1"
          />
          <Box
            position="absolute"
            bottom="-30px"
            right="-30px"
            w="150px"
            h="150px"
            borderRadius="full"
            bg="purple.500"
            opacity="0.1"
          />

          <VStack spacing={8} align="center" position="relative" zIndex="1">
            <Box
              w={24}
              h={24}
              borderRadius="full"
              bg="rgba(99, 102, 241, 0.2)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              animation={pulseAnimation}
              position="relative"
            >
              <LockIcon color="indigo.300" w={12} h={12} />
              <Box
                position="absolute"
                inset={0}
                borderRadius="full"
                border="2px solid"
                borderColor="indigo.400"
                opacity={0.5}
              />
            </Box>

            <VStack spacing={2}>
              <Heading as="h1" size="xl" textAlign="center" fontWeight="bold">
                Security Verification
              </Heading>

              <Text textAlign="center" color="whiteAlpha.800" fontSize="md">
                Please enter the 6-digit code from your authenticator app
              </Text>
            </VStack>

            <Box w="full" py={2}>
              <HStack spacing={2} justify="center">
                <PinInput
                  value={verificationCode}
                  onChange={handleChange}
                  onComplete={handleComplete}
                  type="number"
                  size="lg"
                  placeholder=""
                  focusBorderColor="blue.400"
                  isDisabled={isSubmitting}
                  autoFocus
                >
                  {[...Array(6)].map((_, i) => (
                    <PinInputField
                      key={i}
                      bg="whiteAlpha.100"
                      borderColor="whiteAlpha.300"
                      color="white"
                      h="60px"
                      fontSize="xl"
                      _hover={{ borderColor: "blue.300" }}
                      _focus={{
                        borderColor: "blue.400",
                        boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)",
                      }}
                    />
                  ))}
                </PinInput>
              </HStack>
            </Box>

            <Flex
              w="full"
              gap={4}
              direction={{ base: "column", sm: "row" }}
              mt={2}
            >
              <Button
                colorScheme="blue"
                size="lg"
                w="full"
                h="56px"
                onClick={handleVerify}
                isLoading={isSubmitting}
                loadingText="Verifying"
                _hover={{ opacity: 0.9, transform: "translateY(-1px)" }}
                _active={{ transform: "translateY(1px)" }}
                transition="all 0.2s"
                fontSize="md"
                fontWeight="semibold"
                isDisabled={verificationCode.length !== 6}
              >
                Verify & Continue
              </Button>

              <Button
                variant="outline"
                size="lg"
                w="full"
                h="56px"
                onClick={handleCancel}
                borderColor="whiteAlpha.300"
                _hover={{ bg: "whiteAlpha.100", borderColor: "whiteAlpha.400" }}
                transition="all 0.2s"
                color={"white"}
                fontSize="md"
              >
                Cancel
              </Button>
            </Flex>

            <Flex
              bg="rgba(59, 130, 246, 0.1)"
              p={4}
              borderRadius="md"
              align="center"
              maxW="460px"
            >
              <InfoIcon color="blue.300" boxSize={5} mr={3} />
              <Text color="whiteAlpha.900" fontSize="sm">
                For security reasons, we require two-factor authentication to
                protect your account. This additional layer of security helps
                prevent unauthorized access.
              </Text>
            </Flex>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default TwoFactorAuthPage;
