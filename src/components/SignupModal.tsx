import React, { useState, useEffect, useContext } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  Crown,
  User,
  Mail,
  AlertCircle,
} from "lucide-react";
import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { AuthAlert } from "./AuthAlert.tsx";
import { AuthMethodType } from "@lit-protocol/constants";
import { registerWebAuthn } from "../utils/lit.util.ts";
import Loading from "./auth/Loading";
import AuthMethods from "./auth/AuthMethods";
import WalletMethods from "./auth/WalletMethods";
import WebAuthn from "./auth/WebAuthn";
import StytchOTP from "./auth/StytchOTP";
import { Web3AuthContext } from "../providers/Web3AuthContext.tsx";
import { authService } from "../services/auth.service.ts";
import { useStore } from "../store/useStore.ts";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "beta-code" | "username" | "signup" | "complete" | "auth-methods";

interface FormData {
  betaCode: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialFormData: FormData = {
  betaCode: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<Step>("beta-code");
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );

  const [authView, setAuthView] = useState<string>("default");

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
    sessionLoading,
    sessionError,
    handleGoogleLogin,
    handleDiscordLogin,
    isPreparingAccounts,
  } = useContext(Web3AuthContext);

  const setUserName = useStore((state) => state.setUserName);
  const [registrationError, setRegistrationError] = useState<string | null>(
    null
  );
  const [registeringUsername, setRegisteringUsername] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep("beta-code");
      setFormData(initialFormData);
      setErrors({});
      setAuthView("default");
      setRegistrationError(null);
      setRegisteringUsername(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (authMethod && authMethod.authMethodType !== AuthMethodType.WebAuthn) {
      createAccount(authMethod);
    }
  }, [authMethod, createAccount]);

  useEffect(() => {
    if (authMethod && currentAccount) {
      initSession(authMethod, currentAccount);
    }
  }, [authMethod, currentAccount, initSession]);

  const validateBetaCode = () => {
    if (!formData.betaCode) {
      setErrors({ betaCode: "Beta code is required" });
      return false;
    }
    if (formData.betaCode.length !== 6) {
      setErrors({ betaCode: "Please enter all 6 digits" });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleNext = async () => {
    let isValid = false;

    switch (currentStep) {
      case "beta-code":
        isValid = validateBetaCode();
        if (isValid) {
          setLoading(true);
          try {
            const response = await authService.checkCode(formData.betaCode);

            if (response.valid) {
              setErrors({});
              setCurrentStep("username");
            } else {
              setErrors({ betaCode: "Invalid invitation code" });
            }
          } catch (error: any) {
            const errorMessage = error.message || "Invalid invitation code";
            setErrors({ betaCode: errorMessage });
          } finally {
            setLoading(false);
          }
        }
        break;

      case "username":
        if (!formData.username) {
          setErrors({ username: "Username is required" });
          return;
        }
        if (formData.username.length < 3) {
          setErrors({ username: "Username must be at least 3 characters" });
          return;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
          setErrors({
            username:
              "Username can only contain letters, numbers, and underscores",
          });
          return;
        }

        setLoading(true);
        try {
          const response = await authService.checkUsername(formData.username);

          if (response.available) {
            setUserName(formData.username);
            setUsernameAvailable(true);
            setErrors({});
            setCurrentStep("auth-methods");
          } else {
            setUsernameAvailable(false);
            setErrors({ username: "This username is already taken" });
          }
        } catch (error: any) {
          const errorMessage =
            error.message || "Error checking username availability";
          setErrors({ username: errorMessage });
        } finally {
          setLoading(false);
        }
        break;

      default:
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case "username":
        setCurrentStep("beta-code");
        break;
      case "auth-methods":
        setCurrentStep("username");
        break;
      default:
        break;
    }
  };

  async function registerWithWebAuthn() {
    const newPKP = await registerWebAuthn();
    if (newPKP) {
      setCurrentAccount(newPKP);
    }
  }

  const error =
    authError ||
    accountsError ||
    sessionError ||
    (registrationError ? new Error(registrationError) : undefined);

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {["beta-code", "username", "auth-methods"].map((step, index) => (
        <React.Fragment key={step}>
          <div
            className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all ${
              currentStep === step
                ? "bg-blue-500 ring-4 ring-blue-500/20"
                : index <
                  ["beta-code", "username", "auth-methods"].indexOf(currentStep)
                ? "bg-green-500"
                : "bg-white/10"
            }`}
          >
            {index <
            ["beta-code", "username", "auth-methods"].indexOf(currentStep) ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <span className="text-white text-xs font-medium">
                {index + 1}
              </span>
            )}
          </div>
          {index < 2 && (
            <div
              className={`w-12 h-0.5 transition-colors ${
                index <
                ["beta-code", "username", "auth-methods"].indexOf(currentStep)
                  ? "bg-green-500"
                  : "bg-white/10"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderBetaCodeStep = () => (
    <>
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mx-auto mb-5">
          <Crown className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold">Exclusive Beta Access</h2>
        <p className="text-white/60 mt-1">
          Enter your invitation code to get started
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-white/80">
              Invitation Code
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              value={formData.betaCode}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                if (value.length <= 6) {
                  setFormData({ ...formData, betaCode: value });
                  setErrors({ ...errors, betaCode: undefined });
                }
              }}
              placeholder="xxx-xxx"
              maxLength={6}
              className={`w-full bg-white/5 border ${
                errors.betaCode ? "border-red-500" : "border-white/10"
              } rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono tracking-wider text-center`}
            />
          </div>

          {errors.betaCode ? (
            <div className="flex items-center justify-center gap-1 mt-2 text-sm text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.betaCode}</span>
            </div>
          ) : (
            <div className="text-xs text-center text-white/40 mt-2">
              Enter the 6-digit code
            </div>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={loading || !formData.betaCode}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all font-medium flex items-center justify-center gap-2 shadow-lg"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span>Verify Code</span>
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </>
  );

  const renderUsernameStep = () => (
    <>
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-purple-500" />
        </div>
        <h2 className="text-2xl font-bold">Choose Your Username</h2>
        <p className="text-white/60 mt-1">
          This will be your unique identifier
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Username
          </label>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
              @
            </span>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => {
                const value = e.target.value.toLowerCase();
                if (/^[a-z0-9_]*$/.test(value)) {
                  setFormData({ ...formData, username: value });

                  setErrors({ ...errors, username: undefined });
                  setUsernameAvailable(null);
                }
              }}
              placeholder="username"
              className={`w-full bg-white/5 border pl-8 ${
                errors.username
                  ? "border-red-500"
                  : usernameAvailable === true
                  ? "border-green-500 ring-2 ring-green-500/20"
                  : "border-white/10"
              } rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
            />

            {usernameAvailable !== null && formData.username && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {loading ? (
                  <Loader2 className="w-5 h-5 text-white/40 animate-spin" />
                ) : usernameAvailable ? (
                  <div className="flex items-center gap-1.5 text-green-500">
                    <Check className="w-5 h-5" />
                    <span className="text-xs">Available!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-red-400">
                    <X className="w-5 h-5" />
                    <span className="text-xs">Taken</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {errors.username ? (
            <div className="flex items-center gap-1 mt-2 text-sm text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.username}</span>
            </div>
          ) : (
            <div className="text-xs text-white/60 mt-2 space-y-1">
              <p>• Username must be at least 3 characters</p>
              <p>• Can contain letters, numbers, and underscores</p>
              <p>• Cannot be changed later, so choose wisely!</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            disabled={
              loading || !formData.username || formData.username.length < 3
            }
            className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all font-medium flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Continue</span>
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );

  // Loading state
  const renderLoading = (message: string) => (
    <Loading copy={message} error={error} />
  );

  // Authentication methods step
  const renderAuthMethodsStep = () => {
    if (authLoading) {
      return renderLoading("Authenticating your credentials...");
    }

    if (accountsLoading) {
      return renderLoading("Creating your account...");
    }

    if (sessionLoading) {
      return renderLoading("Securing your session...");
    }

    if (isPreparingAccounts) {
      return renderLoading("Preparing your account...");
    }

    if (registeringUsername) {
      return renderLoading("Registering your username...");
    }

    return (
      <div className="px-2">
        {authView === "default" && (
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

            <AuthAlert error={error} />

            <AuthMethods
              handleGoogleLogin={handleGoogleLogin}
              handleDiscordLogin={handleDiscordLogin}
              setView={setAuthView}
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

        {authView === "email" && (
          <StytchOTP
            method={"email"}
            authWithStytch={authWithStytch}
            setView={setAuthView}
          />
        )}

        {authView === "phone" && (
          <StytchOTP
            method={"phone"}
            authWithStytch={authWithStytch}
            setView={setAuthView}
          />
        )}

        {authView === "wallet" && (
          <WalletMethods
            authWithEthWallet={authWithEthWallet}
            setView={setAuthView}
          />
        )}

        {authView === "webauthn" && (
          <WebAuthn
            start={"register"}
            authWithWebAuthn={authWithWebAuthn}
            setView={setAuthView}
            registerWithWebAuthn={registerWithWebAuthn}
          />
        )}
      </div>
    );
  };

  // Complete/success step
  const renderCompleteStep = () => (
    <div className="text-center py-8">
      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6 ring-8 ring-green-500/20">
        <Check className="w-10 h-10 text-white" />
      </div>

      <h2 className="text-3xl font-bold mb-2">Welcome to Dexfin!</h2>

      <p className="text-white/60 mb-8 max-w-xs mx-auto">
        Your account has been created successfully with username{" "}
        <span className="font-semibold text-white">@{formData.username}</span>.
        You'll be redirected to the dashboard in a moment.
      </p>

      <div className="relative w-12 h-12 mx-auto">
        <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-blue-500/20"></div>
        </div>
      </div>
    </div>
  );

  // Main render
  return (
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
        {currentStep !== "complete" && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {currentStep !== "complete" && renderStepIndicator()}

        {currentStep === "beta-code" && renderBetaCodeStep()}
        {currentStep === "username" && renderUsernameStep()}
        {currentStep === "auth-methods" && renderAuthMethodsStep()}
        {currentStep === "complete" && renderCompleteStep()}
      </ModalContent>
    </Modal>
  );
};

export default SignupModal;
