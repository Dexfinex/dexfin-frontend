import {useContext, useEffect} from 'react';
import {Modal, ModalContent, ModalOverlay,} from '@chakra-ui/react';
import {registerWebAuthn} from "../utils/lit.ts";
import {AuthMethodType} from "@lit-protocol/constants";
import Loading from "./auth/Loading";
import SignUpMethods from "./auth/SignUpMethods.tsx";
import {Web3AuthContext} from "../providers/Web3AuthContext.tsx";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal = ({ isOpen, onClose }: SignupModalProps) => {

  const {
    authMethod,
    authWithEthWallet,
    authWithWebAuthn,
    authWithStytch,
    authLoading,
    authError,
    setCurrentAccount,
    currentAccount,
    createAccount,
    accountsLoading,
    accountsError,
    initSession,
    sessionSigs,
    sessionLoading,
    sessionError,
    handleGoogleLogin,
    handleDiscordLogin,
    isPreparingAccounts,
  } = useContext(Web3AuthContext);

  useEffect(() => {
    // If user is authenticated, create an account
    // For WebAuthn, the account creation is handled by the registerWithWebAuthn function
    if (authMethod && authMethod.authMethodType !== AuthMethodType.WebAuthn) {
      // router.replace(window.location.pathname, undefined, { shallow: true });
      createAccount(authMethod);
    }
  }, [authMethod, createAccount]);

  useEffect(() => {
    // If user is authenticated and has at least one account, initialize session
    if (authMethod && currentAccount) {
      initSession(authMethod, currentAccount);
    }
  }, [authMethod, currentAccount, initSession]);


  const error = authError || accountsError || sessionError;
  if (error) {
    if (authError) {
      console.error('Auth error:', authError);
    }

    if (accountsError) {
      console.error('Accounts error:', accountsError);
    }

    if (sessionError) {
      console.error('Session error:', sessionError);
    }

    if (isPreparingAccounts) {
      return <Loading copy={'Preparing your account...'} error={error} />;
    }
  }

  async function registerWithWebAuthn() {
    const newPKP = await registerWebAuthn();
    if (newPKP) {
      setCurrentAccount(newPKP);
    }
  }

  const subComponent = () => {
    if (authLoading) {
      return (
          <Loading copy={'Authenticating your credentials...'} error={error} />
      );
    }

    if (accountsLoading) {
      return <Loading copy={'Creating your account...'} error={error} />;
    }

    if (sessionLoading) {
      return <Loading copy={'Securing your session...'} error={error} />;
    }

    if (currentAccount && sessionSigs) {
      return /*(
          <Dashboard currentAccount={currentAccount} sessionSigs={sessionSigs} />
      )*/ <div></div>;
    } else {
      return (
          <SignUpMethods
              handleGoogleLogin={handleGoogleLogin}
              handleDiscordLogin={handleDiscordLogin}
              authWithEthWallet={authWithEthWallet}
              registerWithWebAuthn={registerWithWebAuthn}
              authWithWebAuthn={authWithWebAuthn}
              authWithStytch={authWithStytch}
              // goToLogin={() => router.push('/login')}
              error={error}
          />
      );
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent
        bg="rgba(0, 0, 0, 0.95)"
        color="white"
        borderRadius="xl"
        p={6}
        border="1px solid rgba(255, 255, 255, 0.1)"
      >
        {
          subComponent()
        }
      </ModalContent>
    </Modal>
  );
};

export default SignupModal;