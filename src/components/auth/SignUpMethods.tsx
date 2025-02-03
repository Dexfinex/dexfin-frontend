import {useState} from 'react';

import AuthMethods from './AuthMethods';
import WalletMethods from './WalletMethods';
import WebAuthn from './WebAuthn';
import StytchOTP from './StytchOTP';
import {Text, VStack} from "@chakra-ui/react";
import {AuthAlert} from "../AuthAlert.tsx";

interface SignUpProps {
    handleGoogleLogin: (isSignIn: boolean) => Promise<void>;
    handleDiscordLogin: () => Promise<void>;
    authWithEthWallet: (connector: any) => Promise<void>;
    registerWithWebAuthn: () => Promise<void>;
    authWithWebAuthn: () => Promise<void>;
    authWithStytch: (session_jwt: string, user_id: string, method: string) => Promise<void>;
    goToLogin?: () => void;
    error?: Error;
}

// type AuthView = 'default' | 'email' | 'phone' | 'wallet' | 'webauthn';

export default function SignUpMethods({
                                          handleGoogleLogin,
                                          handleDiscordLogin,
                                          authWithEthWallet,
                                          registerWithWebAuthn,
                                          authWithWebAuthn,
                                          authWithStytch,
                                          error,
                                      }: SignUpProps) {
    const [view, setView] = useState<string>('default');

    return (
        <div className="container">
            <div className="wrapper">
                <AuthAlert error={error}/>
                {view === 'default' && (
                    <>
                        <VStack spacing={6}>
                            <Text fontSize="2xl" fontWeight="bold">Create Account</Text>
                            <Text color="whiteAlpha.800">Choose your preferred method</Text>
                            <AuthMethods
                                handleGoogleLogin={handleGoogleLogin}
                                handleDiscordLogin={handleDiscordLogin}
                                setView={setView}
                                isSignIn={false}
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
                        start={'register'}
                        authWithWebAuthn={authWithWebAuthn}
                        setView={setView}
                        registerWithWebAuthn={registerWithWebAuthn}
                    />
                )}
            </div>
        </div>
    );
}
