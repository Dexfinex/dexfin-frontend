import React, { useState, useContext, useEffect } from 'react';
import { X } from 'lucide-react';
import { authService } from "../services/auth.service";
import { useUserData } from '../providers/UserProvider';
import { clearReferralCode, getReferralCodeFromStorage } from '../components/ReferralHandler.tsx';

interface UsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UsernameModal: React.FC<UsernameModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAttemptedClose, setHasAttemptedClose] = useState(false);
   
  const { userData } = useUserData();

  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setError(null);
      setHasAttemptedClose(false);
    }
  }, [isOpen]);

  // Username validation - allow A-Z, a-z, 0-9, underscore and hyphen
  const isValidUsername = (value: string): boolean => {
    const usernameRegex = /^[A-Za-z0-9_-]+$/;
    return usernameRegex.test(value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    
    // Clear error message when user starts typing again
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Username cannot be empty');
      return;
    }

    if (!isValidUsername(username)) {
      setError('Username can only contain letters, numbers, underscores and hyphens');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      const referralCode = getReferralCodeFromStorage();
      const referralCodeOrUndefined = referralCode === null ? undefined : referralCode;

      if (userData?.accessToken) {
        try {
          const response = await authService.registerUsername(username, referralCodeOrUndefined);
          if (referralCode) {
            clearReferralCode();
          }
          onClose();
        } catch (err: any) {
          if (err.response?.data?.message === 'Username is already taken' || 
              err.message?.includes('already taken') ||
              err.toString().includes('already taken')) {
            setError('This username is already taken. Please choose a different one.');
          } else {
            throw err;
          }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`Failed to register username: ${errorMessage}`);
      console.error('Error registering username:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCloseAttempt = () => {
    if (username.trim() === '') {
      setHasAttemptedClose(true);
      setError('Please enter a username before closing');
    } else if (error && error.includes('already taken')) {
      // If there's an error about username being taken, don't allow closing
      setHasAttemptedClose(true);
      setError('Please choose a different username before continuing');
    } else {
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Prevent closing modal when clicking overlay if no username */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseAttempt} />
      <div className="relative glass border border-white/10 rounded-xl p-6 w-[500px]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Register Username</h3>
          <button
            onClick={handleCloseAttempt}
            className="p-2 transition-colors rounded-lg hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <p className="mb-4 text-white/60">
          Please create a username for your wallet address
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-white/60">Username</label>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter username"
              className={`w-full px-4 py-2 border rounded-lg outline-none bg-white/5 border-white/10 focus:border-white/20 ${
                hasAttemptedClose && !username.trim() ? 'border-red-500' : ''
              }`}
              autoFocus
              required
            />
            <p className="mt-1 text-xs text-white/60">
              Username can only contain letters (A-Z, a-z), numbers, underscores (_) and hyphens (-)
            </p>
          </div>
          
          {error && (
            <p className="text-red-500">{error}</p>
          )}
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleCloseAttempt}
              className="px-4 py-2 transition-colors rounded-lg hover:bg-white/10"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 transition-colors bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsernameModal;