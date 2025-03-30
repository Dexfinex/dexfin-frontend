import React, { useState, useEffect, useRef } from 'react';
import { Spinner } from '@chakra-ui/react';
import {
  LockIcon,
  Loader,
  Copy,
  CheckCircle,
  Trash2Icon
} from 'lucide-react';
import { dexfinv3Service } from '../services/dexfin.service';
import { useUserData } from '../providers/UserProvider';
import { useStore } from '../store/useStore';

interface TwoFactorAuthInputProps {
  isDisabled: boolean;
  onComplete: (code: string) => void;
}

const TwoFactorAuthInput = ({ onComplete, isDisabled }: TwoFactorAuthInputProps) => {
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
    <div className="flex gap-2 items-center justify-center" onPaste={handlePaste}>
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
          autoComplete='off'
          disabled={isDisabled ? true : false}
        />
      ))}

      {isDisabled && <Loader className="w-4 h-4 animate-spin text-blue-400" />}
    </div>
  );
};

export const SecuritySettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [loadingSetup, setLoadingSetup] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [step, setStep] = useState(1);
  const [qrCode, setQrCode] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState(false);
  const [backupCodes, setBackCodes] = useState([]);
  const [isAuthEnabled, setIsAuthEnabled] = useState(false);
  const { userData } = useUserData();
  const { theme } = useStore();

  const handleSetup = async () => {
    setLoadingSetup(true)
    if (showSecret) {
      setShowSecret(false)
    }
    const data = await dexfinv3Service.generate2FA(userData?.accessToken || "")
    setSecretKey(data.secret)
    setQrCode(data.qrCodeUrl)
    setLoadingSetup(false)
    setStep(2)
  }

  const handleCopyKey = () => {
    navigator.clipboard.writeText(secretKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  const handleCopyBackupKey = () => {
    navigator.clipboard.writeText(backupCodes.join(''))
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  const handleKeyVerify = async (code: string) => {
    setConfirming(true)
    const data = await dexfinv3Service.enable2FA(userData?.accessToken || "", code)
    if (data.success) {
      setBackCodes(data.backupCodes)
      setStep(4)
    }
    setConfirming(false)
  }

  const handleRemove = async (code: string) => {
    setConfirming(true)
    const { success } = await dexfinv3Service.remove2FA(userData?.accessToken || "", code)
    if (success) {
      setIsAuthEnabled(false)
      setStep(1)
    }
    setConfirming(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const isEnabled = await dexfinv3Service.get2FAStatus(userData?.accessToken || "")
    setIsAuthEnabled(isEnabled)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {!isAuthEnabled ? <>
        {step === 1 && <>
          <div>
            <h2 className="text-lg font-medium mb-1">Security</h2>
            <p className="text-sm text-white/60">
              Set up multi-factor authentication
            </p>
          </div>
          <div className='flex flex-col items-center justify-center gap-4 h-[420px]'>
            <LockIcon className='w-20 h-20' />
            <p className="text-sm text-white/60">
              Add an additional layer of security to keep your funds safe.
            </p>
            {
              loadingSetup ? <button
                disabled
                className="flex items-center justify-center gap-2 
                       bg-gray-400 text-gray-200 cursor-not-allowed 
                       py-2 px-5 rounded-xl mb-8 opacity-50"
              >
                Set up now <Spinner size="md" className="mr-2" />
              </button>
                :
                <button className='bg-blue-500 py-2 px-5 rounded-xl mb-8 hover:bg-blue-600 transition-colors' onClick={handleSetup}>
                  Set up now
                </button>
            }
          </div>
        </>}

        {
          step === 2 && <>
            <div>
              <h2 className="text-lg font-medium mb-1">Set up authenticator</h2>
              <p className="text-sm text-white/60">
                Scan the QR code or copy and paste the key into your authenticator app.
              </p>
            </div>
            <div className='flex flex-col items-center justify-center gap-4 h-[420px]'>

              <div className="w-60 h-60 bg-white/5 rounded-xl p-4">
                {qrCode && (
                  <img
                    src={qrCode}
                    alt="QRCode"
                    className="w-full h-full"
                  />
                )}
              </div>
              <div className='mb-4'>
                {
                  !showSecret ?
                    <button onClick={() => setShowSecret(true)}>Show secret</button>
                    :
                    <button className='flex items-center justify-center gap-4' onClick={handleCopyKey}>
                      <span>{secretKey}</span>
                      {
                        copied ?
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          :
                          <Copy className='w-5 h-5' />
                      }
                    </button>
                }
              </div>
              <button className='bg-blue-500 w-96 py-2 rounded-xl hover:bg-blue-600 transition-colors' onClick={() => setStep(3)}>
                Continue
              </button>
              <button className='w-96 py-2 rounded-xl hover:bg-white/10 transition-colors' onClick={() => setStep(1)}>
                Cancel
              </button>
            </div>
          </>
        }

        {
          step === 3 && <>
            <div>
              <h2 className="text-lg font-medium mb-1">Enter code</h2>
              <p className="text-sm text-white/60">
                Enter the 6-digit code from your authenticator app.
              </p>
            </div>
            <div className='h-[420px]'>
              {
                confirming ? <>
                  <TwoFactorAuthInput onComplete={(code: string) => handleKeyVerify(code)} isDisabled={true} />
                  <div className='text-center'>
                    <button className='mt-5 bg-white/10 py-2 px-5 rounded-xl' disabled>
                      Cancel
                    </button>
                  </div>
                </> : <>
                  <TwoFactorAuthInput onComplete={(code: string) => handleKeyVerify(code)} isDisabled={false} />
                  <div className='text-center'>
                    <button className='mt-5 bg-white/10 py-2 px-5 rounded-xl hover:bg-white/5' onClick={() => setStep(1)}>
                      Cancel
                    </button>
                  </div>
                </>
              }
            </div>
          </>
        }

        {
          step === 4 && <>
            <div>
              <h2 className="text-lg font-medium mb-1">Backup codes</h2>
              <p className="text-sm text-white/60">
                Store your backup codes safely and securely.
              </p>
            </div>
            <div className='flex flex-col items-center justify-center gap-4 h-[420px]'>

              <div className="bg-white/5 rounded-xl p-4">
                <div className="grid grid-cols-3 gap-6 px-6 py-8">
                  {/* {backupCodes} */}
                  {backupCodes && backupCodes.length > 0 && backupCodes.map(str => <li key={str} className='flex items-center justify-center'>
                    <pre>{str}</pre>
                  </li>)}
                </div>
              </div>

              <div className='mb-4'>
                <button className='flex items-center justify-center gap-3' onClick={handleCopyBackupKey}>
                  Copy
                  {
                    copied ?
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      :
                      <Copy className='w-5 h-5' />
                  }
                </button>
              </div>
              <button className='bg-blue-500 w-96 py-2 rounded-xl hover:bg-blue-600 transition-colors' onClick={() => { setStep(1); setIsAuthEnabled(true); }}>
                I've saved my backup codes
              </button>
            </div>
          </>
        }
      </> : <>
        {
          step === 5 ? <>
            <div>
              <h2 className="text-lg font-medium mb-1">Enter code</h2>
              <p className="text-sm text-white/60">
                Enter the 6-digit code from your authenticator app.
              </p>
            </div>
            <div className='h-[420px]'>
              {
                confirming ? <>
                  <TwoFactorAuthInput onComplete={(code: string) => handleRemove(code)} isDisabled={true} />
                  <div className='text-center'>
                    <button className='mt-5 bg-white/10 py-2 px-5 rounded-xl' disabled>
                      Cancel
                    </button>
                  </div>
                </> : <>
                  <TwoFactorAuthInput onComplete={(code: string) => handleRemove(code)} isDisabled={false} />
                  <div className='text-center'>
                    <button className='mt-5 bg-white/10 py-2 px-5 rounded-xl hover:bg-white/5' onClick={() => setStep(1)}>
                      Cancel
                    </button>
                  </div>
                </>
              }
            </div>
          </> : <>
            <div>
              <h2 className="text-lg font-medium mb-1">Security</h2>
              <p className="text-sm text-white/60">
                Set up multi-factor authentication
              </p>
            </div>

            <div className='h-[420px]'>
              <div className={`flex items-center justify-between border ${theme === 'dark' ? 'border-white/50' : 'border-black/50'}  p-5 rounded-xl`}>
                <div className='flex justify-center items-center gap-2'>
                  <LockIcon className='w-10 h-10' />
                  <div>
                    <div>Authenticator app</div>
                    <div className={`text-sm ${theme === 'dark' ? "text-white/70" : "text-black/70"} `}>Uses a one-time code from your authenticator app</div>
                  </div>
                </div>
                <button onClick={() => setStep(5)}>
                  <Trash2Icon className={`w-5 h-5 ${theme === 'dark' ? 'hover:text-white/70' : 'hover:text-black/70'}`} />
                </button>
              </div>
            </div>
          </>
        }
      </>}
    </div >
  );
};