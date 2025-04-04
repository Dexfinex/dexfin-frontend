import { useState } from "react";

import AuthMethods from "./AuthMethods";
import WalletMethods from "./WalletMethods";
import WebAuthn from "./WebAuthn";
import StytchOTP from "./StytchOTP";
import { Mail, ChevronLeft, Gift } from "lucide-react";
import { Text, Box, Flex, Icon } from "@chakra-ui/react";
import { AuthAlert } from "../AuthAlert";

interface SignUpProps {
  handleGoogleLogin: (isSignIn: boolean) => Promise<void>;
  handleDiscordLogin: (isSignIn: boolean) => Promise<void>;
  authWithEthWallet: (connector: any) => Promise<void>;
  registerWithWebAuthn: () => Promise<void>;
  authWithWebAuthn: () => Promise<void>;
  handleBack: () => void; // Changed from Promise<void> to void
  authWithStytch: (
    session_jwt: string,
    user_id: string,
    method: string
  ) => Promise<void>;
  goToLogin?: () => void;
  error?: Error;
  hasReferral?: boolean;
}

// type AuthView = 'default' | 'email' | 'phone' | 'wallet' | 'webauthn';

export default function SignUpMethods({
  handleGoogleLogin,
  handleDiscordLogin,
  authWithEthWallet,
  registerWithWebAuthn,
  authWithWebAuthn,
  authWithStytch,
  handleBack,
  error,
  hasReferral = false,
}: SignUpProps) {
  const [view, setView] = useState<string>("default");

  return (
    <div className="container">
      <div className="wrapper">
        {view === "default" && (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-green-900/40 flex items-center justify-center mx-auto mb-5">
                <Mail className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold">Complete Your Profile</h2>
              <p className="text-white/60 mt-1">
                Choose how you want to continue
              </p>
            </div>
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

            <AuthAlert error={error} />

            <AuthMethods
              handleGoogleLogin={handleGoogleLogin}
              handleDiscordLogin={handleDiscordLogin}
              setView={setView}
              isSignIn={false}
            />

            <div className="mt-6">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-white/5 border border-white/10 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
            </div>
          </>
        )}
        {view === "email" && (
          <StytchOTP
            method={"email"}
            authWithStytch={authWithStytch}
            setView={setView}
          />
        )}
        {view === "phone" && (
          <StytchOTP
            method={"phone"}
            authWithStytch={authWithStytch}
            setView={setView}
          />
        )}
        {view === "wallet" && (
          <WalletMethods
            authWithEthWallet={authWithEthWallet}
            setView={setView}
          />
        )}
        {view === "webauthn" && (
          <WebAuthn
            start={"register"}
            authWithWebAuthn={authWithWebAuthn}
            setView={setView}
            registerWithWebAuthn={registerWithWebAuthn}
          />
        )}
      </div>
    </div>
  );
}
