import {useState} from 'react';
import {Button, Text, VStack} from "@chakra-ui/react";
import Loading from "./Loading";
import {AuthAlert} from "../AuthAlert.tsx";

// import { registerWebAuthn } from '../../utils/lit';

type WebAuthnStep = 'register' | 'authenticate';

interface WebAuthnProps {
  start: WebAuthnStep;
  authWithWebAuthn: () => Promise<void>;
  setView: React.Dispatch<React.SetStateAction<string>>;
  registerWithWebAuthn?: () => Promise<void>;
}

export default function WebAuthn({
  start,
  authWithWebAuthn,
  setView,
  registerWithWebAuthn,
}: WebAuthnProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const [step, setStep] = useState<WebAuthnStep>(start);

  async function handleRegister() {
    setError(undefined);
    setLoading(true);
    try {
      if (registerWithWebAuthn)
        await registerWithWebAuthn();
      setStep('authenticate');
    } catch (err) {
      console.error(err);
      setError(err as Error);
    }
    setLoading(false);
  }

  if (loading) {
    return (
        <Loading copy={'Follow the prompts to continue...'} error={error} />
/*
      <>
        {error && (
          <div className="alert alert--error">
            <p>{error.message}</p>
          </div>
        )}
        <div className="loader-container">
          <div className="loader"></div>
          <p>Follow the prompts to continue...</p>
        </div>
      </>
*/
    );
  }

  return (
    <>
      <AuthAlert error={error}/>
      {step === 'register' && (
        <>
          <VStack spacing={6}>
            <Text fontSize="2xl" fontWeight="bold">Register with a passkey</Text>
            <Text color="whiteAlpha.800">Passkeys enable simple and secure passwordless authentication.</Text>
            <VStack spacing={4} w="full">
              <Button
                  colorScheme="blue"
                  w="full"
                  disabled={loading}
                  isLoading={loading}
                  onClick={handleRegister}
              >
                Create a credential
              </Button>

              <Button
                  w="full"
                  onClick={() => setView('default')}
                  variant="outline"
                  color="white"
                  borderColor="whiteAlpha.200"
                  _hover={{bg: 'whiteAlpha.100'}}
              >
                Back
              </Button>

            </VStack>
          </VStack>
        </>
      )}
      {step === 'authenticate' && (
        <>
          <VStack spacing={3}>
            <Text fontSize="2xl" fontWeight="bold" textAlign={'left'} w="full">Authenticate with your passkey</Text>
            <Text color="whiteAlpha.800">
              Sign in using your passkey.
            </Text>
            <VStack spacing={4} w="full">
              <Button
                  colorScheme="blue"
                  w="full"
                  onClick={authWithWebAuthn}
                  disabled={loading}
              >
                Sign in with passkey
              </Button>

              <Button
                  onClick={() => setView('default')}
                  variant="outline"
                  w="full"
                  color="white"
                  borderColor="whiteAlpha.200"
                  _hover={{bg: 'whiteAlpha.100'}}
              >
                Back
              </Button>

            </VStack>
          </VStack>
        </>
      )}
    </>
  );
}
