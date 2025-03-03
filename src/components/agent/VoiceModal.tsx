
import React, { useEffect, useState } from 'react';
import { Command, Volume2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface VoiceCommand {
  command: string;
  description?: string;
}

interface VoiceModalProps {
  isOpen: boolean;
  transcript: string;
  commands?: VoiceCommand[];
}

export const VoiceModal: React.FC<VoiceModalProps> = ({ isOpen, transcript, commands = [] }) => {
  const { theme } = useStore();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 600);
    };

    // Initial check
    checkScreenSize();

    // Listen for resize events
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 mb-20 z-50 px-3 sm:px-6">
      <div className={`relative ${theme === 'light'
          ? 'bg-gradient-to-b from-white/60 to-white/80'
          : 'bg-gradient-to-b from-black/60 to-black/80'
        } backdrop-blur-xl border ${theme === 'light' ? 'border-black/10' : 'border-white/10'
        } rounded-2xl p-3 sm:p-6 w-full max-w-[800px] mx-auto shadow-2xl animate-slide-up`}>

        {/* Voice visualization bars - responsive height */}
        <div className="relative mb-3 sm:mb-6">
          <div className="flex items-center justify-center gap-1 h-10 sm:h-16">
            {[...Array(isSmallScreen ? 8 : 16)].map((_, i) => (
              <div
                key={i}
                className="w-1 sm:w-1.5 bg-red-500 rounded-full animate-voice-wave"
                style={{
                  height: '100%',
                  animationDelay: `${i * 0.05}s`,
                  transform: 'scaleY(0.2)',
                  transformOrigin: 'center'
                }}
              />
            ))}
          </div>
        </div>

        <div className="text-center mb-3 sm:mb-6">
          <h3 className={`text-lg sm:text-2xl font-medium mb-2 sm:mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>Listening...</h3>
          {transcript ? (
            <div className={`${theme === 'light' ? 'bg-black/5' : 'bg-white/5'
              } rounded-xl p-3 sm:p-4 backdrop-blur-sm`}>
              <p className={`text-base sm:text-lg font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white/90'
                }`}>{transcript}</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-4">
              <div className={`flex items-center gap-2 justify-center ${theme === 'light' ? 'text-gray-600' : 'text-white/60'
                }`}>
                <Command className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Available commands:</span>
              </div>
              <div className={`grid grid-cols-1 ${isSmallScreen ? '' : 'sm:grid-cols-2'} gap-2 sm:gap-3`}>
                {commands.slice(0, isSmallScreen ? 2 : commands.length).map((command, index) => (
                  <div key={index} className={`${theme === 'light' ? 'bg-black/5' : 'bg-white/5'
                    } rounded-lg p-2 sm:p-3 backdrop-blur-sm`}>
                    <p className={`font-medium text-sm sm:text-base ${theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>"{isSmallScreen && command.command.length > 20
                        ? command.command.substring(0, 20) + '...'
                        : command.command}"</p>
                    {command.description && !isSmallScreen && (
                      <p className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>
                        {command.description}
                      </p>
                    )}
                  </div>
                ))}
                {isSmallScreen && commands.length > 2 && (
                  <div className={`text-center text-xs ${theme === 'light' ? 'text-gray-500' : 'text-white/50'
                    }`}>
                    + {commands.length - 2} more commands
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-2">
          <Volume2 className={`w-3 h-3 sm:w-4 sm:h-4 ${theme === 'light' ? 'text-gray-400' : 'text-white/40'
            }`} />
          <div className="flex items-center gap-1">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`w-0.5 sm:w-1 rounded-full animate-pulse ${theme === 'light' ? 'bg-gray-300' : 'bg-white/20'
                  }`}
                style={{
                  animationDelay: `${i * 100}ms`,
                  height: `${6 + Math.random() * 8}px`
                }}
              />
            ))}
          </div>
        </div>

        {/* Triangle pointer at the bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
          <div className={`border-8 border-transparent ${theme === 'light' ? 'border-t-black/10' : 'border-t-white/10'
            }`} />
        </div>
      </div>
    </div>
  );
};