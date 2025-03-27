import { useState } from 'react';
import AuthMethods from './AuthMethods';
import WalletMethods from './WalletMethods';
import WebAuthn from './WebAuthn';
import StytchOTP from './StytchOTP';
import { Text, VStack, Box, Flex, Icon } from "@chakra-ui/react";
import { AuthAlert } from "../AuthAlert.tsx";
import { Gift } from 'lucide-react';

interface LoginProps {
    handleGoogleLogin: (isSignIn: boolean) => Promise<void>;
    handleDiscordLogin: (isSignIn: boolean) => Promise<void>;
    authWithEthWallet: (connector: any) => Promise<void>;
    authWithWebAuthn: () => Promise<void>;
    authWithStytch: (session_jwt: string, user_id: string, method: string) => Promise<void>;
    error?: Error;
    hasReferral?: boolean;
}

export default function LoginMethods({
    handleGoogleLogin,
    handleDiscordLogin,
    authWithEthWallet,
    authWithWebAuthn,
    authWithStytch,
    error,
    hasReferral = false,
}: LoginProps) {
    const [view, setView] = useState<string>('default');

    return (
        <div className="container">
            <div className="wrapper">
                <AuthAlert error={error} />
                {view === 'default' && (
                    <>
                        <VStack spacing={3}>
                            <Text fontSize="2xl" fontWeight="bold">Welcome back</Text>
                            <Text color="whiteAlpha.800">
                                Sign in to continue to Dexfin
                            </Text>
                            
                            {hasReferral && (
                                <Box 
                                  bg="#1b3258"
                                  color="white"
                                  p={4}
                                  borderRadius="md"
                                  w="100%"
                                  mb={2}
                                  border="1px solid #2e4b7c"
                                  boxShadow="0 2px 10px rgba(0, 0, 0, 0.3)"
                                >
                                  <Flex align="center" gap={3} mb={2}>
                                    <Box 
                                      bg="#2d4e8a" 
                                      p={2} 
                                      borderRadius="full"
                                      display="flex"
                                      alignItems="center"
                                      justifyContent="center"
                                    >
                                      <Icon as={Gift} color="#8ab4fe" boxSize={5} />
                                    </Box>
                                    <Text fontWeight="bold" color="#8ab4fe" fontSize="md">
                                      You've been invited!
                                    </Text>
                                  </Flex>
                                  <Text fontSize="sm" color="whiteAlpha.900" mt={2}>
                                    Sign in to claim your referral bonus.
                                  </Text>
                                </Box>
                            )}
                            
                            <AuthMethods
                                handleGoogleLogin={handleGoogleLogin}
                                handleDiscordLogin={handleDiscordLogin}
                                setView={setView}
                                isSignIn={true}
                            />
                        </VStack>
                    </>
                )}
                {view === 'email' && (
                    <StytchOTP
                        method={'email'}
                        authWithStytch={authWithStytch}
                        setView={setView}
                    />
                )}
                {view === 'phone' && (
                    <StytchOTP
                        method={'phone'}
                        authWithStytch={authWithStytch}
                        setView={setView}
                    />
                )}
                {view === 'wallet' && (
                    <WalletMethods
                        authWithEthWallet={authWithEthWallet}
                        setView={setView}
                    />
                )}
                {view === 'webauthn' && (
                    <WebAuthn
                        start={'authenticate'}
                        authWithWebAuthn={authWithWebAuthn}
                        setView={setView}
                    />
                )}
            </div>
        </div>
    );
}