// Update the conditional rendering in SignInModal.tsx
import React, { useContext, useEffect, useState } from "react";
import { ChevronRight, LogIn, X } from "lucide-react";
import { Modal, ModalContent, ModalOverlay, useToast } from "@chakra-ui/react";
import { AuthAlert } from "./AuthAlert.tsx";
import Loading from "./auth/Loading";
import LoginMethods from "./auth/LoginMethods";
import CreateAccount from "./auth/CreateAccount";
import { Web3AuthContext } from "../providers/Web3AuthContext";
import { getReferralCodeFromStorage } from "./ReferralHandler";
import { LOCAL_STORAGE_SIGNUP_FLAG } from "../constants";
import { useNavigate } from "react-router-dom";

interface SigninModalProps {
  isOpen: boolean;
  onClose: () => void;
  goToSignUp: () => void;
}

const SignInModal: React.FC<SigninModalProps> = ({
  isOpen,
  onClose,
  goToSignUp,
}) => {
  const [hasReferral, setHasReferral] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const {
    authMethod,
    authWithEthWallet,
    authWithWebAuthn,
    authWithStytch,
    authLoading,
    authError,
    fetchAccounts,
    currentAccount,
    accounts,
    accountsLoading,
    accountsError,
    initSession,
    sessionLoading,
    sessionError,
    handleGoogleLogin,
    handleDiscordLogin,
    isPreparingAccounts,
    requires2FA,
  } = useContext(Web3AuthContext);

  const error = authError || accountsError || sessionError;

  useEffect(() => {
    // If user is authenticated, fetch accounts
    if (authMethod) {
      fetchAccounts(authMethod);
    }
  }, [authMethod, fetchAccounts]);

  useEffect(() => {
    if (isOpen) {
      localStorage.removeItem(LOCAL_STORAGE_SIGNUP_FLAG);
    }
  }, [isOpen]);

  useEffect(() => {
    // If user is authenticated and has selected an account, initialize session
    if (authMethod && currentAccount) {
      initSession(authMethod, currentAccount);
    }
  }, [authMethod, currentAccount, initSession]);

  useEffect(() => {
    // If 2FA is required, close this modal and redirect to 2FA page
    if (requires2FA) {
      onClose();
      navigate("/verify-2fa");
      toast({
        title: "Two-Factor Authentication Required",
        description: "Please complete the verification process to continue.",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [requires2FA, navigate, onClose, toast]);

  useEffect(() => {
    const referralCode = getReferralCodeFromStorage();
    setHasReferral(!!referralCode);
  }, []);

  const renderContent = () => {
    if (authLoading) {
      return (
        <Loading copy="Authenticating your credentials..." error={error} />
      );
    }

    if (accountsLoading) {
      return <Loading copy="Looking up your accounts..." error={error} />;
    }

    if (sessionLoading) {
      return <Loading copy="Securing your session..." error={error} />;
    }

    if (isPreparingAccounts) {
      return <Loading copy="Preparing your account..." error={error} />;
    }

    // If user is authenticated but has no accounts, prompt to create an account
    if (authMethod && accounts.length === 0) {
      return <CreateAccount signUp={goToSignUp} error={error} />;
    }

    // If user is not authenticated, show login methods
    return (
      <>
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mx-auto">
            <LogIn className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <LoginMethods
          handleGoogleLogin={handleGoogleLogin}
          handleDiscordLogin={handleDiscordLogin}
          authWithEthWallet={authWithEthWallet}
          authWithWebAuthn={authWithWebAuthn}
          authWithStytch={authWithStytch}
          error={error}
          hasReferral={hasReferral}
        />

        <div className="mt-3">
          <AuthAlert error={error} />
        </div>

        <div className="mt-6 text-center">
          <p className="text-white/60 mb-3">Don't have an account yet?</p>
          <button
            onClick={goToSignUp}
            className="py-3 px-6 bg-white/5 hover:bg-white/10 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 mx-auto"
          >
            <span>Create Account</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered={true}
        motionPreset="slideInBottom"
        size="md"
      >
        <ModalOverlay
          backdropFilter="blur(8px)"
          backgroundColor="rgba(0, 0, 0, 0.75)"
        />
        <ModalContent
          bg="rgba(0, 0, 0, 0.95)"
          color="white"
          borderRadius="xl"
          p={6}
          maxW="450px"
          mx={4}
          boxShadow="0 4px 30px rgba(0, 0, 0, 0.3)"
          border="1px solid rgba(255, 255, 255, 0.1)"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {renderContent()}
        </ModalContent>
      </Modal>
    </>
  );
};

export default SignInModal;