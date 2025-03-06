import React, { useState, useContext, useEffect } from 'react';
import { Web3AuthContext } from '../providers/Web3AuthContext';
import { X } from 'lucide-react';
import { authService } from "../services/auth.service";
import { useUserData } from '../providers/UserProvider';

interface UsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UsernameModal: React.FC<UsernameModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { userData } = useUserData();

  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Username cannot be empty');
      return;
    }
    
    try {

      setIsSubmitting(true);
      setError(null);

      if (userData?.accessToken) {
        const response =  await authService.registerUsername(username);
        console.log(response);
      }
      
      onClose();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`Failed to register username: ${errorMessage}`);
      console.error('Error registering username:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass border border-white/10 rounded-xl p-6 w-[500px]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Register Username</h3>
          <button
            onClick={onClose}
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
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full px-4 py-2 border rounded-lg outline-none bg-white/5 border-white/10 focus:border-white/20"
              autoFocus
              required
            />
          </div>
          
          {error && (
            <p className="text-red-500">{error}</p>
          )}
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
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