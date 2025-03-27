import React from "react";
import { Box, Spinner, Text, Alert, AlertIcon, AlertDescription } from "@chakra-ui/react";

interface GlobalLoadingProps {
  message: string;
  error?: Error | string | null;
  isOpen: boolean;
}

const GlobalLoading: React.FC<GlobalLoadingProps> = ({ message, error, isOpen }) => {
  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      backgroundColor="rgba(0, 0, 0, 0.85)"
      backdropFilter="blur(8px)"
      zIndex="9999"
    >
      <Box
        bg="rgba(0, 0, 0, 0.8)"
        borderRadius="xl"
        p={8}
        maxW="md"
        width="90%"
        border="1px solid rgba(255, 255, 255, 0.1)"
        boxShadow="0 4px 30px rgba(0, 0, 0, 0.3)"
        textAlign="center"
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.700"
          color="blue.500"
          size="xl"
          mb={4}
        />
        
        <Text color="white" fontSize="xl" fontWeight="bold" mb={2}>
          {message}
        </Text>

        {error && (
          <Alert status="error" variant="solid" borderRadius="md" mt={4}>
            <AlertIcon />
            <AlertDescription>
              {typeof error === 'string' ? error : error.message || 'An error occurred'}
            </AlertDescription>
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default GlobalLoading;