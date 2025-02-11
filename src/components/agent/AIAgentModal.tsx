import { useContext, useEffect, useRef, useState } from 'react';
import { Web3AuthContext } from '../../providers/Web3AuthContext.tsx';

import {
  Bot,
  Maximize2,
  Mic,
  Minimize2,
  Send,
  Trash2,
  X
} from 'lucide-react';
import { VoiceModal } from '../VoiceModal.tsx';
import { Message } from '../../types/index.ts';
import { PriceChart } from '../PriceChart.tsx';
import { TrendingCoins } from '../TrendingCoins.tsx';
import { NewsWidget } from '../widgets/NewsWidget.tsx';
import { YieldProcess } from '../YieldProcess.tsx';
import { SwapProcess } from '../SwapProcess.tsx';
import { BridgeProcess } from '../BridgeProcess.tsx';
import { PortfolioProcess } from '../PortfolioProcess.tsx';
import { SendProcess } from '../SendProcess.tsx';
import { StakeProcess } from '../StakeProcess.tsx';
import { ProjectAnalysisProcess } from '../ProjectAnalysisProcess.tsx';
import { generateResponse } from '../../lib/openai.ts';
import { WalletPanel } from './WalletPanel.tsx';
import { InitializeCommands } from './InitializeCommands.tsx';

interface AIAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIAgentModal({ isOpen, onClose }: AIAgentModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showYieldProcess, setShowYieldProcess] = useState(false);
  const [showSwapProcess, setShowSwapProcess] = useState(false);
  const [showBridgeProcess, setShowBridgeProcess] = useState(false);
  const [showPortfolioProcess, setShowPortfolioProcess] = useState(false);
  const [showSendProcess, setShowSendProcess] = useState(false);
  const [showStakeProcess, setShowStakeProcess] = useState(false);
  const [showProjectAnalysis, setShowProjectAnalysis] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [isWalletPanelOpen, setIsWalletPanelOpen] = useState(true);
  const { address, chainId } = useContext(Web3AuthContext);

  // Reset all process states
  const resetProcessStates = () => {
    setShowYieldProcess(false);
    setShowSwapProcess(false);
    setShowBridgeProcess(false);
    setShowPortfolioProcess(false);
    setShowSendProcess(false);
    setShowStakeProcess(false);
    setShowProjectAnalysis(false);
  };

  const processCommand = async (text: string, address: string, chainId: number | undefined) => {

    try {

      setIsProcessing(true);
      const normalizedText = text.toLowerCase().trim();
      let response: any = null;

      // Process chained commands
      const commands = normalizedText.split(/\s+(?:and|&)\s+/i);

      for (const command of commands) {
        const normalizedCommand = command.trim();

        // Send USDC command
        if (normalizedCommand.match(/send\s+(\d+)\s+usdc\s+to\s+vitalik/i)) {
          resetProcessStates();
          setShowSendProcess(true);
          response = { text: 'Opening send interface to transfer USDC to vitalik.eth...' };
        }
        // Project evaluation command
        else if (normalizedCommand.match(/(?:analyze|evaluate)\s+project\s+([^\s]+)/i)) {
          const projectNameMatch = normalizedCommand.match(/project\s+([^\s]+)/i);
          if (projectNameMatch) {
            resetProcessStates();
            setProjectName(projectNameMatch[1]);
            setShowProjectAnalysis(true);
            response = { text: `Analyzing project ${projectNameMatch[1]}...` };
          }
        }
        // Find yield command
        else if (normalizedCommand.includes('find best yield') || normalizedCommand.includes('best yield')) {
          resetProcessStates();
          setShowYieldProcess(true);
          response = { text: 'Opening yield finder...' };
        }
        // Swap command
        else if (normalizedCommand.includes('swap') || normalizedCommand.includes('exchange')) {
          resetProcessStates();
          setShowSwapProcess(true);
          response = { text: 'Opening swap interface...' };
        }
        // Bridge command
        else if (normalizedCommand.includes('bridge')) {
          resetProcessStates();
          setShowBridgeProcess(true);
          response = { text: 'Opening bridge interface...' };
        }
        // Portfolio command
        else if (normalizedCommand.includes('portfolio') || normalizedCommand.includes('build portfolio')) {
          resetProcessStates();
          setShowPortfolioProcess(true);
          response = { text: 'Opening portfolio builder...' };
        }
        // Stake command
        else if (normalizedCommand.includes('stake')) {
          resetProcessStates();
          setShowStakeProcess(true);
          response = { text: 'Opening staking interface...' };
        }
        // Use OpenAI for other commands
        else {
          response = await generateResponse(command, address, chainId);
        }
        response = await generateResponse(command, address, chainId);
        // Add response to messages if we got one
        if (response) {
          setMessages(prev => [...prev, {
            role: 'user',
            content: command
          }, {
            role: 'assistant',
            content: response.text,
            data: response.data,
            trending: response.trending,
            news: response.news
          }]);
        }
      }

      // If no commands matched
      if (!response) {
        setMessages(prev => [...prev, {
          role: 'user',
          content: text
        }, {
          role: 'assistant',
          content: "I'm not sure how to help with that. Try asking about prices, trending tokens, latest news, or use commands like 'stake ETH', 'send 100 USDC to vitalik', or 'analyze project wayfinder'."
        }]);
      }
    } catch (error) {
      console.error('Error processing command:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.'
      }]);
    } finally {
      setIsProcessing(false);
      setTranscript('');
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setTranscript('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      setTimeout(() => setTranscript(''), 3000);
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript = transcript;
          setTranscript(finalTranscript.trim());
          processCommand(finalTranscript, address, chainId);
          stopListening();
        } else {
          interimTranscript += transcript;
          setTranscript(interimTranscript);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setTranscript('');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Speech recognition start error:', error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    setTranscript('');
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetProcessStates();
    }
  }, [isOpen]);

  const chatContainerRef = useRef<any>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  const clearMessages = () => {
    setMessages([]);
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative glass border border-white/10 shadow-lg transition-all duration-300 ease-in-out ${isFullscreen
          ? 'w-full h-full rounded-none'
          : 'w-[90%] h-[90%] rounded-xl'
          }`}
      >
        {showYieldProcess ? (
          <YieldProcess onClose={() => {
            setShowYieldProcess(false);
            setMessages([]);
          }} />
        ) : showSwapProcess ? (
          <SwapProcess onClose={() => {
            setShowSwapProcess(false);
            setMessages([]);
          }} />
        ) : showBridgeProcess ? (
          <BridgeProcess onClose={() => {
            setShowBridgeProcess(false);
            setMessages([]);
          }} />
        ) : showPortfolioProcess ? (
          <PortfolioProcess onClose={() => {
            setShowPortfolioProcess(false);
            setMessages([]);
          }} />
        ) : showSendProcess ? (
          <SendProcess onClose={() => {
            setShowSendProcess(false);
            setMessages([]);
          }} />
        ) : showStakeProcess ? (
          <StakeProcess onClose={() => {
            setShowStakeProcess(false);
            setMessages([]);
          }} />
        ) : showProjectAnalysis ? (
          <ProjectAnalysisProcess
            onClose={() => {
              setShowProjectAnalysis(false);
              setMessages([]);
            }}
            projectName={projectName}
          />
        ) : (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Bot className="w-5 h-5" />
                <h2 className="text-xl font-semibold">AI Agent</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex h-full overflow-auto">
              {/* Main Content */}
              <div className="flex-1 flex flex-col relative overflow-auto">
                {/* Messages Area */}
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto ai-chat-scrollbar">
                  <div className="p-6 space-y-6">
                    {messages.length === 0 ? (
                      <InitializeCommands processCommand={processCommand} address={address} chainId={chainId} setInput={setInput} />
                    ) : (
                      messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                        >
                          <div
                            className={`max-w-[90%] p-4 rounded-xl ${message.role === 'user'
                              ? 'bg-blue-500/20 ml-auto'
                              : 'bg-white/10'
                              }`}
                          >
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            {message.data && (
                              <div className="w-[800px] mt-4">
                                <PriceChart data={message.data} />
                              </div>
                            )}
                            {message.trending && <TrendingCoins coins={message.trending} />}
                            {message.news && <NewsWidget />}
                          </div>
                        </div>
                      ))
                    )}
                    {isProcessing && (
                      <div className="flex justify-start">
                        <div className="bg-white/10 p-3 rounded-lg flex gap-2">
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder='Try "What is the Bitcoin price?"'
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-white/20"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (input.trim()) {
                              processCommand(input, address, chainId);
                              setInput('');
                            }
                          }
                        }}
                      />
                      {messages.length > 0 && (
                        <button
                          onClick={clearMessages}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-lg transition-colors text-red-400 hover:text-red-300"
                          title="Clear conversation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <button
                      className={`p-2 rounded-lg transition-colors ${isListening ? 'bg-red-500/50' : 'hover:bg-white/10'
                        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                        isListening ? stopListening() : startListening();
                      }}
                      disabled={isProcessing}
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        if (input.trim() && !isProcessing) {
                          processCommand(input, address, chainId);
                          setInput('');
                        }
                      }}
                      disabled={isProcessing || !input.trim()}
                      className={`p-2 rounded-lg transition-colors ${input.trim() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-white/10 cursor-not-allowed'
                        }`}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Wallet Panel */}
              {<WalletPanel isWalletPanelOpen={isWalletPanelOpen} setIsWalletPanelOpen={setIsWalletPanelOpen} />}
            </div>
          </div>
        )}
      </div>

      <VoiceModal
        isOpen={isListening}
        transcript={transcript}
        commands={[
          { command: "What is the Bitcoin price?", description: "Get real-time BTC price" },
          { command: "Show me trending tokens", description: "View trending cryptocurrencies" },
          { command: "Show me the latest news", description: "Get latest crypto news" },
          { command: "Evaluate project wayfinder", description: "Analyze project potential" }
        ]}
      />
    </div>
  );
}
