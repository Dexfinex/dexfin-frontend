import { Box, Text, Alert, AlertIcon, Spinner } from "@chakra-ui/react";

interface LoadingProps {
  copy: string;
  error?: Error;
}

export default function Loading({ copy, error }: LoadingProps) {
  return (
      <Box className="container">
        <Box className="wrapper">
          {error && (
              <Alert status="error">
                <AlertIcon />
                <Text>{error.message}</Text>
              </Alert>
          )}
          <Box className="loader-container" textAlign="center">
            <Spinner size="xl" />
            <Text mt={4}>{copy}</Text>
          </Box>
        </Box>
      </Box>
  );
}