import React, { useState, useEffect } from "react";
import { User, Check, X, AlertCircle, Loader2 } from "lucide-react";
import { authService } from "../services/auth.service";
import { useUserData } from "../providers/UserProvider";

export const UsernameSettings: React.FC = () => {
  const { userData } = useUserData();
  const [username, setUsername] = useState("");
  const [savedUsername, setSavedUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [hasUsername, setHasUsername] = useState<boolean | null>(null);
  
  useEffect(() => {
    if (userData?.accessToken) {
      checkUsernameStatus();
    }
  }, [userData?.accessToken]);
  
  useEffect(() => {
    if (username && username !== savedUsername) {
      const timer = setTimeout(() => {
        validateUsername();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [username, savedUsername]);

  const checkUsernameStatus = async () => {
    try {
      setIsChecking(true);
      const response = await authService.getUserName();
      
      if (response === false) {
        setHasUsername(false);
        setIsEditing(true);
      } 
      else if (response && typeof response === 'object' && response.hasUsername === true) {
        setHasUsername(true);
        if (response.username) {
          setUsername(response.username);
          setSavedUsername(response.username);
        }
      } 
      else {
        setHasUsername(false);
        setIsEditing(true);
      }
    } catch (err: any) {
      console.error("Error checking username status:", err);
      setError("Failed to load username information");
    } finally {
      setIsChecking(false);
    }
  };

  const validateUsername = async () => {
    if (!username || username.length < 3) {
      setIsAvailable(null);
      return;
    }

    try {
      setIsChecking(true);
      setError(null);

      const response = await authService.checkUsername(username);
      setIsAvailable(response.available);

      if (!response.available) {
        setError("This username is already taken");
      }
    } catch (err: any) {
      setError(err.message);
      setIsAvailable(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSave = async () => {
    if (
      !username ||
      isChecking ||
      (username !== savedUsername && !isAvailable)
    ) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.registerUsername(username);

      if (response) {
        setSavedUsername(username);
        setHasUsername(true);
        setIsEditing(false);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setUsername(savedUsername);
    setIsEditing(false);
    setError(null);
    setIsAvailable(null);
  };
  
  if (isChecking && hasUsername === null) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-1">Username</h3>
          <p className="text-sm text-white/60">
            Set your username for the platform
          </p>
        </div>
        
        <div className="bg-white/5 rounded-xl p-6 flex flex-col items-center justify-center h-64">
          <Loader2 className="w-10 h-10 animate-spin text-blue-400 mb-4" />
          <p className="text-white/60">Loading username information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-1">Username</h3>
        <p className="text-sm text-white/60">
          {savedUsername 
            ? "Your unique identifier on the platform" 
            : "Set your username for the platform"}
        </p>
      </div>

      <div className="bg-white/5 rounded-xl p-6">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-white/80 mb-2"
              >
                Username
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                  @
                </span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    const value = e.target.value.toLowerCase();
                    if (/^[a-z0-9_]*$/.test(value)) {
                      setUsername(value);
                      setError(null);
                      setIsAvailable(null);
                    }
                  }}
                  placeholder="username"
                  className={`w-full bg-white/5 border pl-8 ${
                    error
                      ? "border-red-500"
                      : isAvailable === true
                      ? "border-green-500 ring-2 ring-green-500/20"
                      : "border-white/10"
                  } rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                  disabled={isLoading}
                />

                {username && username !== savedUsername && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isChecking ? (
                      <Loader2 className="w-5 h-5 text-white/40 animate-spin" />
                    ) : isAvailable ? (
                      <div className="flex items-center gap-1.5 text-green-500">
                        <Check className="w-5 h-5" />
                        <span className="text-xs">Available!</span>
                      </div>
                    ) : error ? (
                      <div className="flex items-center gap-1.5 text-red-400">
                        <X className="w-5 h-5" />
                        <span className="text-xs">Taken</span>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {error ? (
                <div className="flex items-center gap-1 mt-2 text-sm text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              ) : (
                <div className="text-xs text-white/60 mt-2 space-y-1">
                  <p>• Username must be at least 3 characters</p>
                  <p>• Can contain letters, numbers, and underscores</p>
                  <p>• Choose wisely - this is how others will identify you</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
              <button
                onClick={handleSave}
                disabled={
                  isLoading ||
                  isChecking ||
                  !username ||
                  username.length < 3 ||
                  (username !== savedUsername && !isAvailable)
                }
                className={`px-4 py-3 rounded-lg ${
                  isLoading ||
                  isChecking ||
                  !username ||
                  username.length < 3 ||
                  (username !== savedUsername && !isAvailable)
                    ? "bg-white/10 cursor-not-allowed text-white/40"
                    : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white transition-colors"
                } flex-1 flex items-center justify-center`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </div>
                ) : (
                  "Set Username"
                )}
              </button>

              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors sm:flex-initial"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-500/20">
                <User className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <div className="flex items-center">
                  <span className="text-white/40 mr-1">@</span>
                  <h4 className="font-medium">
                    {savedUsername || "No username set"}
                  </h4>
                </div>
                <p className="text-sm text-white/60">
                  {savedUsername 
                    ? "Your personal identifier for the platform" 
                    : "Set a username to fully activate your account"}
                </p>
              </div>
            </div>

            {!savedUsername && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                Set Username
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};