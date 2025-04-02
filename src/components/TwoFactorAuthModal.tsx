import React, { useState, useContext, useRef } from "react";
import { X, ShieldCheck, Loader2 } from "lucide-react";
import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { Web3AuthContext } from "../providers/Web3AuthContext";
import { AuthAlert } from "./AuthAlert";

interface TwoFactorAuthInputProps {
  isDisabled: boolean;
  onComplete: (code: string) => void;
}

const TwoFactorAuthInput = ({
  onComplete,
  isDisabled,
}: TwoFactorAuthInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [code, setCode] = useState<string[]>(new Array(6).fill(""));

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Allow only numbers
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all fields are filled, trigger onComplete
    if (newCode.join("").length === 6) {
      onComplete(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedText)) {
      const newCode = pastedText.split("");
      setCode(newCode);
      onComplete(newCode.join(""));

      // Focus last input field
      inputRefs.current[5]?.focus();
    }
  };

  return (
    <div
      className="flex gap-2 items-center justify-center"
      onPaste={handlePaste}
    >
      {code.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          value={digit}
          maxLength={1}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-12 h-12 border border-gray-300 rounded-lg text-center text-xl focus:ring focus:ring-blue-500 outline-none bg-white/10"
          autoComplete="off"
          disabled={isDisabled}
        />
      ))}

      {isDisabled && (
        <Loader2 className="w-4 h-4 animate-spin text-blue-400 ml-2" />
      )}
    </div>
  );
};

interface TwoFactorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TwoFactorAuthModal: React.FC<TwoFactorAuthModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { complete2FAAuthentication, cancel2FAAuthentication } =
    useContext(Web3AuthContext);

  const handleVerify = async (code: string) => {
    setVerifying(true);
    setError(null);

    try {
      const success = await complete2FAAuthentication(code);

      if (success) {
        onClose();
      } else {
        setError(new Error("Invalid authentication code. Please try again."));
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setVerifying(false);
    }
  };

  const handleCancel = () => {
    cancel2FAAuthentication();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
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
          onClick={handleCancel}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center space-y-6 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-blue-400" />
          </div>

          <div className="text-center">
            <h2 className="text-xl font-medium mb-2">
              Two-Factor Authentication
            </h2>
            <p className="text-white/60 mb-6">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>

          <TwoFactorAuthInput
            onComplete={handleVerify}
            isDisabled={verifying}
          />

          {error && (
            <div className="mt-4 w-full">
              <AuthAlert error={error} />
            </div>
          )}

          <div className="mt-4">
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              disabled={verifying}
            >
              Cancel
            </button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default TwoFactorAuthModal;
