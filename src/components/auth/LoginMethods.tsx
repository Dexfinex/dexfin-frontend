import {useState} from 'react';
import AuthMethods from './AuthMethods';
import WalletMethods from './WalletMethods';
import WebAuthn from './WebAuthn';
import StytchOTP from './StytchOTP';
import {Text, VStack} from "@chakra-ui/react";
import {AuthAlert} from "../AuthAlert.tsx";

interface LoginProps {
    handleGoogleLogin: (isSignIn: boolean) => Promise<void>;
    handleDiscordLogin: () => Promise<void>;
    authWithEthWallet: (connector: any) => Promise<void>;
    authWithWebAuthn: () => Promise<void>;
    authWithStytch: (session_jwt: string, user_id: string, method: string) => Promise<void>;
    error?: Error;
}

// type AuthView = 'default' | 'email' | 'phone' | 'wallet' | 'webauthn';

export default function LoginMethods({
                                         handleGoogleLogin,
                                         handleDiscordLogin,
                                         authWithEthWallet,
                                         authWithWebAuthn,
                                         authWithStytch,
                                         error,
                                     }: LoginProps) {
    const [view, setView] = useState<string>('default');

    return (
        <div className="container">
            <div className="wrapper">
                <AuthAlert error={error}/>
                {view === 'default' && (
                    <>
                        <VStack spacing={3}>
                            <Text fontSize="2xl" fontWeight="bold">Welcome back</Text>
                            <Text color="whiteAlpha.800">
                                Sign in to continue to Dexfin
                            </Text>
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
