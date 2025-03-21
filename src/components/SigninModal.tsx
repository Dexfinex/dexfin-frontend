import {useContext, useEffect, useState} from 'react';
import {Modal, ModalContent, ModalOverlay,} from '@chakra-ui/react';
import Loading from "./auth/Loading";
import LoginMethods from "./auth/LoginMethods";
// import AccountSelection from "./auth/AccountSelection";
import CreateAccount from "./auth/CreateAccount";
import {Web3AuthContext} from "../providers/Web3AuthContext";
import { getReferralCodeFromStorage } from './ReferralHandler';

interface SigninModalProps {
  isOpen: boolean;
  onClose: () => void;
  goToSignUp: () => void;
}

const SigninModal = ({ isOpen, onClose, goToSignUp }: SigninModalProps) => {
  const [hasReferral, setHasReferral] = useState(false);

  const {
    authMethod,
    authWithEthWallet,
    authWithWebAuthn,
    authWithStytch,
    authLoading,
    authError,
    fetchAccounts,
    // setCurrentAccount,
    currentAccount,
    accounts,
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

  const error = authError || accountsError || sessionError;

  useEffect(() => {
    // If user is authenticated, fetch accounts
    if (authMethod) {
      // router.replace(window.location.pathname, undefined, { shallow: true });
      fetchAccounts(authMethod);
    }
  }, [authMethod, fetchAccounts]);

  useEffect(() => {
    // If user is authenticated and has selected an account, initialize session
    if (authMethod && currentAccount) {
      initSession(authMethod, currentAccount);
    }
  }, [authMethod, currentAccount, initSession]);

  useEffect(() => {
    const referralCode = getReferralCodeFromStorage();
    setHasReferral(!!referralCode);
  }, []);

  const subComponent = () => {
    if (authLoading) {
      return (
          <Loading copy={'Authenticating your credentials...'} error={error} />
      );
    }

    if (accountsLoading) {
      return <Loading copy={'Looking up your accounts...'} error={error} />;
    }

    if (sessionLoading) {
      return <Loading copy={'Securing your session...'} error={error} />;
    }

    if (isPreparingAccounts) {
      return <Loading copy={'Preparing your account...'} error={error} />;
    }

    // If user is authenticated and has selected an account, initialize session
    if (currentAccount && sessionSigs) {
/*
      return (
          <Dashboard currentAccount={currentAccount} sessionSigs={sessionSigs} />
      );
*/
    }

    // If user is authenticated and has more than 1 account, show account selection
/*
    if (authMethod && accounts.length > 0) {
      return (
          <AccountSelection
              accounts={accounts}
              setCurrentAccount={setCurrentAccount}
              error={error}
          />
      );
    }
*/

    // If user is authenticated but has no accounts, prompt to create an account
    if (authMethod && accounts.length === 0) {
      return <CreateAccount signUp={goToSignUp} error={error} />;
    }

    // If user is not authenticated, show login methods
    return (
        <LoginMethods
            handleGoogleLogin={handleGoogleLogin}
            handleDiscordLogin={handleDiscordLogin}
            authWithEthWallet={authWithEthWallet}
            authWithWebAuthn={authWithWebAuthn}
            authWithStytch={authWithStytch}
            error={error}
            hasReferral={hasReferral}
        />
    );
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

export default SigninModal;