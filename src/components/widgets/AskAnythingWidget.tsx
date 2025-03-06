import React, {useCallback, useEffect, useState} from 'react';
import {Mic, Send} from 'lucide-react';
import {useStore} from '../../store/useStore';
import {VoiceModal} from '../agent/VoiceModal';

interface VoiceCommand {
  command: string;
  description: string;
}

export const AskAnythingWidget: React.FC = () => {
  const { 
    theme,
    setIsAIAgentOpen,
    setIsSettingsOpen,
    setIsDashboardOpen,
    setIsDefiOpen,
    setIsSwapOpen,
    setIsMarketDataOpen,
    setIsChatOpen,
    setIsCartOpen,
    setIsSocialFeedOpen,
    setIsGamesOpen,
    setMarketDataView,
    setTradeOpen,
    widgetVisibility
  } = useStore();

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);
  const [isManualStop, setIsManualStop] = useState(false);
  const [noSpeechTimeout, setNoSpeechTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const voiceCommands: VoiceCommand[] = [
    { 
      command: "Open Assistant",
      description: ""
    },
    {
      command: "Open Settings",
      description: ""
    },
    {
      command: "Open Swap",
      description: ""
    },
    {
      command: "Open DeFi",
      description: ""
    }
  ];

  const cleanupRecognition = useCallback(() => {
    if (recognitionInstance) {
      try {
        setIsManualStop(true);
        recognitionInstance.abort();
         
      } catch (error) {
        // Ignore errors during cleanup
      }
      setRecognitionInstance(null);
    }
    if (noSpeechTimeout) {
      clearTimeout(noSpeechTimeout);
      setNoSpeechTimeout(null);
    }
  }, [recognitionInstance, noSpeechTimeout]);

  useEffect(() => {
    return () => {
      cleanupRecognition();
    };
  }, [cleanupRecognition]);

  const handleClick = () => {
    if (input.trim()) {
      processCommand(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      processCommand(input);
      setInput('');
    }
  };

  const processCommand = (text: string) => {
    setIsProcessing(true);
    try {
      const commands = text.toLowerCase().split(/\s+(?:and|&)\s+/i);
      
      commands.forEach(async (command) => {
        const normalizedCommand = command.trim();
        
        if (normalizedCommand.includes('open settings')) {
          setIsSettingsOpen(true);
          return;
        }
        
        if (normalizedCommand.includes('change wallpaper to')) {
          // Wallpaper functionality commented out in original code
          return;
        }

        if (normalizedCommand.includes('open dashboard')) {
          setIsDashboardOpen(true);
        } else if (normalizedCommand.includes('open defi')) {
          setIsDefiOpen(true);
        } else if (normalizedCommand.includes('open swap')) {
          setIsSwapOpen(true);
        } else if (normalizedCommand.includes('open market data')) {
          setIsMarketDataOpen(true);
        } else if (normalizedCommand.includes('show trending')) {
          setIsMarketDataOpen(true);
          setMarketDataView('trending');
        } else if (normalizedCommand.includes('open chat')) {
          setIsChatOpen(true);
        } else if (normalizedCommand.includes('open cart')) {
          setIsCartOpen(true);
        } else if (normalizedCommand.includes('open social')) {
          setIsSocialFeedOpen(true);
        } else if (normalizedCommand.includes('open games')) {
          setIsGamesOpen(true);
        } else if (normalizedCommand.includes('open wallet')) {
          // setIsWalletOpen(true); // Commented out in original
        } else if (normalizedCommand.includes('open assistant')) {
          setIsAIAgentOpen(true);
        } else if (normalizedCommand.includes('open trade')) {
          setTradeOpen(true);
        }
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setTranscript('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      setTimeout(() => setTranscript(''), 3000);
      return;
    }

    cleanupRecognition();
    setIsManualStop(false);

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let hasRecognizedSpeech = false;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setRecognitionInstance(recognition);
      hasRecognizedSpeech = false;

      const timeout = setTimeout(() => {
        if (!hasRecognizedSpeech && isListening) {
          setTranscript('No speech detected. Please try again.');
          setTimeout(() => {
            cleanupRecognition();
            setTranscript('');
          }, 2000);
        }
      }, 5000);

      setNoSpeechTimeout(timeout);
    };

    recognition.onresult = (event: any) => {
      hasRecognizedSpeech = true;
      if (noSpeechTimeout) {
        clearTimeout(noSpeechTimeout);
        setNoSpeechTimeout(null);
      }

      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript = transcript;
          setTranscript(finalTranscript.trim());
          processCommand(finalTranscript);
          cleanupRecognition();
        } else {
          interimTranscript += transcript;
          setTranscript(interimTranscript);
        }
      }
    };

    recognition.onerror = (event: any) => {
      if (noSpeechTimeout) {
        clearTimeout(noSpeechTimeout);
        setNoSpeechTimeout(null);
      }

      if (event.error === 'aborted' && isManualStop) {
        event.preventDefault();
        return;
      }

      switch (event.error) {
        case 'no-speech':
          if (!hasRecognizedSpeech) {
            setTranscript('No speech detected. Please try again.');
            setTimeout(() => {
              cleanupRecognition();
              setTranscript('');
            }, 2000);
          }
          break;
        case 'audio-capture':
          setTranscript('Microphone not found. Please check your device settings.');
          setTimeout(() => {
            cleanupRecognition();
            setTranscript('');
          }, 2000);
          break;
        case 'not-allowed':
          setTranscript('Microphone access denied. Please allow microphone access.');
          setTimeout(() => {
            cleanupRecognition();
            setTranscript('');
          }, 2000);
          break;
        default:
          if (!isProcessing && !hasRecognizedSpeech) {
            setTranscript('Something went wrong. Please try again.');
            setTimeout(() => {
              cleanupRecognition();
              setTranscript('');
            }, 2000);
          }
      }
    };

    recognition.onend = () => {
      if (noSpeechTimeout) {
        clearTimeout(noSpeechTimeout);
        setNoSpeechTimeout(null);
      }

      setIsListening(false);
      setRecognitionInstance(null);
      setIsManualStop(false);
      
      if (!isProcessing && !hasRecognizedSpeech) {
        setTimeout(() => setTranscript(''), 2000);
      }
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Speech recognition start error:', error);
      setIsListening(false);
      setTranscript('Failed to start voice recognition. Please try again.');
      setTimeout(() => {
        cleanupRecognition();
        setTranscript('');
      }, 2000);
    }
  }, [isProcessing, cleanupRecognition, isManualStop, noSpeechTimeout, isListening]);

  const stopListening = useCallback(() => {
    cleanupRecognition();
    setIsListening(false);
    setTranscript('');
  }, [cleanupRecognition]);

  // Determine if we're on a small screen (mobile)
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

  // Don't render anything if the widget should be hidden
  if (!widgetVisibility['Ask Anything']) {
    return null;
  }

  return (
    <div className="relative w-full px-4 sm:px-0">
      <VoiceModal 
        isOpen={isListening} 
        transcript={transcript}
        commands={voiceCommands}
      />

      <div className={`glass w-[320px] sm:w-[600px] h-14 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg flex items-center ${isSmallScreen ? 'px-2' : 'px-4'} gap-2 shadow-lg mx-auto`}>
        <input
          type="text"
          placeholder='Type or say: Open Assistant, Open Swap...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`flex-1 bg-transparent outline-none text-ellipsis overflow-hidden ${theme === 'light' ? 'text-gray-900 placeholder:text-gray-500' : 'text-white placeholder:text-white/40'}`}
        />
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button 
            className={`p-1 sm:p-1.5 rounded-md transition-colors ${
              isListening 
                ? 'bg-red-500/50' 
                : theme === 'light'
                  ? 'hover:bg-black/20 text-gray-900'
                  : 'hover:bg-white/10 text-white'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              isListening ? stopListening() : startListening();
            }}
            disabled={isProcessing}
            aria-label={isListening ? "Stop listening" : "Start voice command"}
          >
            <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleClick}
            className={`p-1 sm:p-1.5 rounded-md transition-colors ${
              theme === 'light'
                ? 'hover:bg-black/20 text-gray-900'
                : 'hover:bg-white/10 text-white'
            } ${!input.trim() && 'opacity-50 cursor-not-allowed'}`}
            disabled={!input.trim()}
            aria-label="Send command"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};