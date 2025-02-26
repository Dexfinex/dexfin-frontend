import { useContext, useEffect, useRef, useState } from 'react';
import { Web3AuthContext } from '../../providers/Web3AuthContext.tsx';
import { coingeckoService } from '../../services/coingecko.service';
import { cryptoNewsService } from '../../services/cryptonews.service.ts';
import { brianService } from '../../services/brian.service';
import { convertBrianKnowledgeToPlainText, parseChainedCommands } from '../../utils/agent.tsx';
import {
  Mic,
  Send,
  Trash2,
} from 'lucide-react';
import { VoiceModal } from './VoiceModal.tsx';
import { Message } from '../../types/index.ts';
import { TrendingCoins } from './components/Analysis/TrendingCoins.tsx';
import { TopCoins } from './components/Analysis/TopCoins.tsx'
import { NewsWidget } from '../widgets/NewsWidget.tsx';
import { YieldProcess } from '../YieldProcess.tsx';
import { SwapProcess } from './components/SwapProcess.tsx';
import { BridgeProcess } from './components/BridgeProcess.tsx';
import { PortfolioProcess } from '../PortfolioProcess.tsx';
import { SendProcess } from './components/SendProcess.tsx';
import { StakeProcess } from '../StakeProcess.tsx';
import { ProjectAnalysisProcess } from '../ProjectAnalysisProcess.tsx';
import { WalletPanel } from './WalletPanel.tsx';
import { InitializeCommands } from './InitializeCommands.tsx';
import { TopBar } from './TopBar.tsx';
import { TokenType, Step, Protocol } from '../../types/brian.type.ts';
import useTokenBalanceStore from '../../store/useTokenBalanceStore.ts';
import { convertCryptoAmount } from '../../utils/agent.tsx';
import { DepositProcess } from './components/DepositProcess.tsx';
import { WithdrawProcess } from './components/WithdrawProcess.tsx';
import { BorrowProcess } from './components/BorrowProcess.tsx';
import { RepayProcess } from './components/RepayProcess.tsx';
import { ENSRegisterProcess } from './components/ENSRegisterProcess.tsx';
import { ENSRenewProcess } from './components/ENSRenewProcess.tsx';
import { openaiService } from '../../services/openai.services.ts';
import { PriceCard } from './components/Analysis/PriceCard.tsx';
import { TechnicalAnalysis } from './components/Analysis/TechnicalAnalysis.tsx';

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
  const [isWalletPanelOpen, setIsWalletPanelOpen] = useState(true);
  const [showDepositProcess, setShowDepositProcess] = useState(false);
  const [showWithdrawProcess, setShowWithdrawProcess] = useState(false);
  const [showBorrowProcess, setShowBorrowProcess] = useState(false);
  const [showRepayProcess, setShowRepayProcess] = useState(false);
  const [showENSRegisterProcess, setShowENSRegisterProcess] = useState(false);
  const [showENSRenewProcess, setShowENSRenewProcess] = useState(false);
  const { address, chainId, switchChain } = useContext(Web3AuthContext);
  const { tokenBalances } = useTokenBalanceStore();

  const [fromToken, setFromToken] = useState<TokenType>();
  const [protocol, setProtocol] = useState<Protocol>();
  const [toToken, setToToken] = useState<TokenType>();
  const [fromAmount, setFromAmount] = useState('0');
  const [toAmount, setToAmount] = useState('0');
  const [receiver, setReceiver] = useState('');
  const [ensName, setEnsName] = useState('');
  const [solver, setSolver] = useState('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [description, setDescription] = useState('');

  // Reset all process states
  const resetProcessStates = () => {
    setShowYieldProcess(false);
    setShowSwapProcess(false);
    setShowBridgeProcess(false);
    setShowPortfolioProcess(false);
    setShowSendProcess(false);
    setShowStakeProcess(false);
    setShowProjectAnalysis(false);
    setShowDepositProcess(false);
    setShowWithdrawProcess(false);
    setShowBorrowProcess(false);
    setShowRepayProcess(false);
    setShowENSRegisterProcess(false);
    setShowENSRenewProcess(false);
  };

  const processCommandCase = async (command: string, address: string, chainId: number | undefined) => {

    const fallbackResponse = await findFallbackResponse(command);
    if (fallbackResponse) {
      return fallbackResponse;
    }

    const lowerCommand = command.toLowerCase().trim();

    if (lowerCommand.includes('latest news') || lowerCommand.includes('show me the news')) {
      const news = await cryptoNewsService.getLatestNews();
      return {
        text: "Here are the latest crypto news updates:",
        news
      };
    }

    if (lowerCommand.includes('trending tokens')) {
      const trendingCoins = await coingeckoService.getTrendingCoins();
      return {
        text: "Here are the currently trending tokens:",
        trending: trendingCoins
      };
    }

    if (lowerCommand.includes('bitcoin price')) {
      const bitcoinData = await coingeckoService.getCoinPrice('bitcoin');
      if (bitcoinData) {
        return {
          text: `The current Bitcoin price is $${bitcoinData.price.toLocaleString()} (${bitcoinData.priceChange24h.toFixed(2)}% 24h change)`,
          data: bitcoinData
        };
      }
    }

    // If no direct match, use OpenAI with fallback
    try {
      if (address) {
        const brianTransactionData = await brianService.getBrianTransactionData(command, address, chainId);
        return {
          text: brianTransactionData.message,
          brianData: brianTransactionData.data,
          type: brianTransactionData.type
        }
      } else {
        const brianKnowledgeData = await brianService.getBrianKnowledgeData(command);
        return {
          text: convertBrianKnowledgeToPlainText(brianKnowledgeData.message),
          type: "knowledge",
        }
      }
    } catch (e) {
      const error = e as {
        error?: { type?: string; code?: string };
        message?: string
      };
      // Return a helpful response based on the error type
      if (error.error?.type === 'insufficient_quota' || error.error?.code === 'insufficient_quota') {
        return {
          text: "I'm currently experiencing high demand. In the meantime, I can help you with:\n\n" +
            "• Checking cryptocurrency prices\n" +
            "• Viewing trending tokens\n" +
            "• Getting the latest news\n" +
            "• Basic market analysis\n\n" +
            "What would you like to know?"
        };
      }

      if (error.message?.includes('timeout')) {
        return {
          text: "I'm taking longer than usual to respond. Would you like to:\n\n" +
            "• Check current prices\n" +
            "• View market trends\n" +
            "• See latest news\n\n" +
            "Just let me know what interests you!"
        };
      }
      return {
        text: "I'm having some trouble processing complex queries right now. I can still help you with basic market information, prices, and news. What would you like to know?"
      };
    }
  };

  async function generateResponse(userMessage: string, address: string, chainId: number | undefined) {
    try {
      // Parse chained commands
      const commands = parseChainedCommands(userMessage);
      // If there are multiple commands, process them sequentially
      if (commands.length > 1) {
        const results = [];
        for (const command of commands) {
          try {
            const result = await processCommandCase(command, address, chainId);
            results.push(result);
          } catch (error) {
            console.error(`Error processing command "${command}":`, error);
            results.push({
              text: `Failed to process command: ${command}`
            });
          }
        }
        // Combine results
        return {
          text: results.map(r => r.text).join('\n'),
          data: results.find(r => r.data)?.data,
          trending: results.find(r => r.trending)?.trending,
          news: results.find(r => r.news)?.news,
          command: results.find(r => r.command)?.command,
          wallpaper: results.find(r => r.wallpaper)?.wallpaper
        };
      }
      // Single command processing
      return await processCommandCase(userMessage, address, chainId);
    } catch (error) {
      console.error('Error generating response:', error);

      // Try fallback response one last time
      const fallbackResponse = await findFallbackResponse(userMessage);
      if (fallbackResponse) {
        return fallbackResponse;
      }
      // Final fallback message
      return {
        text: "I'm having trouble connecting to my language processing service right now, but I can still help you with basic tasks like checking prices, showing trending tokens, or getting the latest news. What would you like to know?"
      };
    }
  }

  const fallbackResponses: Record<string, {
    text: string;
    action?: (param?: string) => Promise<any>;
  }> = {
    'trending tokens': {
      text: 'Here are the currently trending tokens:',
      action: async () => {
        const data = await coingeckoService.getTrendingCoins();
        return {
          text: 'Here are the currently trending tokens:',
          trending: data
        };
      }
    },

  };

  const findFallbackResponse = async (message: string) => {
    const normalizedMessage = message.toLowerCase();
    const data = await openaiService.getOpenAIAnalyticsData(normalizedMessage);
    if (data && data.response) {
      if (data.response.priceData) {
        const { priceData } = data.response;
        return {
          text: `The current ${data.response.name} price is $${priceData.price.toLocaleString()} (${priceData.change24h.toFixed(2)}% 24h change)\n`,
          priceData: {
            price: priceData.price,
            priceChange24h: priceData.change24h,
            marketCap: priceData.marketCap,
            volume24h: priceData.volume24h,
            chartData: data.response.history,
            name: data.response.name,
            symbol: data.response.symbol,
            logoURI: data.response.logo.thumb,
            analysis: data.response.response,
          }
        };
      }
    } else if (data && data.news_items) {
      return {
        text: 'Here are the latest crypto news updates',
        news: data.news_items,
      };
    } else if (data && data.trending_coins) {
      return {
        text: 'Here are the currently trending tokens:',
        trending: data.trending_coins
      };
    } else if (data && data.losers) {
      return {
        text: 'Here are the top losers',
        losers: data.losers.map((item: any) => ({
          id: item.id,
          name: item.name,
          symbol: item.symbol,
          thumb: item.image,
          marketCapRank: item.market_cap_rank,
          priceUsd: item.current_price,
          usd24hChange: item.price_change_24h,
          usd24hVol: item.volume_24h,
          analysis: item.analysis,
        }))
      }
    } else if (data && data.gainers) {
      return {
        text: 'Here are the top gainers',
        gainers: data.gainers.map((item: any) => ({
          id: item.id,
          name: item.name,
          symbol: item.symbol,
          thumb: item.image,
          marketCapRank: item.market_cap_rank,
          priceUsd: item.current_price,
          usd24hChange: item.price_change_24h,
          usd24hVol: item.volume_24h,
          analysis: item.analysis,
        }))
      }
    } else if (data && data.moving_averages) {
      return {
        text: 'Here is the analysis for the current market:',
        technicalAnalysis: data,
      }
    }

    for (const [key, response] of Object.entries(fallbackResponses)) {
      if (normalizedMessage.includes(key)) {
        if (response.action) {
          try {
            return await response.action();
          } catch (error) {
            console.error(`Error executing fallback action for ${key}:`, error);
            return { text: response.text };
          }
        }
        return { text: response.text };
      }
    }
    return null;
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

        response = await generateResponse(normalizedCommand, address, chainId);
        if (response.type == "action" && response.brianData.type == "write") {
          if (response.brianData.action == 'transfer') {
            const data = response.brianData.data;
            resetProcessStates();
            await switchChain(data.fromToken.chainId);

            const amount = convertCryptoAmount(data.fromAmount, data.fromToken.decimals);
            let token = tokenBalances.find(balance => balance.address.toLowerCase() === data.fromToken.address.toLowerCase());
            if (data.fromToken.symbol.toLowerCase() == 'eth') token = tokenBalances.find(balance => balance.symbol.toLowerCase() === data.fromToken.symbol.toLowerCase());
            if (token && token.balance > amount) {
              setFromToken(data.fromToken);
              setToToken(data.toToken);
              setFromAmount(data.fromAmount);
              setReceiver(data.receiver);
              setSteps(data.steps);
              setShowSendProcess(true);
            }
            else {
              response = { text: response.text, insufficient: 'Insufficient balance to perform the transaction.' };
            }
          } else if (response.brianData.action == 'swap') {
            const data = response.brianData.data;
            resetProcessStates();
            await switchChain(data.fromToken.chainId);
            const amount = convertCryptoAmount(data.fromAmount, data.fromToken.decimals);
            let token = tokenBalances.find(balance => balance.address.toLowerCase() === data.fromToken.address.toLowerCase());
            if (data.fromToken.symbol.toLowerCase() == 'eth') token = tokenBalances.find(balance => balance.symbol.toLowerCase() === data.fromToken.symbol.toLowerCase());

            if (token && token.balance > amount) {
              setFromToken(data.fromToken);
              setProtocol(data.protocol);
              setToToken(data.toToken);
              setFromAmount(data.fromAmount);
              setReceiver(data.receiver);
              setSteps(data.steps);
              setShowSwapProcess(true);
            }
            else {
              response = { text: response.text, insufficient: 'Insufficient balance to perform the transaction.' };
            }
          } else if (response.brianData.action == 'bridge') {
            const data = response.brianData.data;
            resetProcessStates();
            await switchChain(data.fromToken.chainId);
            const amount = convertCryptoAmount(data.fromAmount, data.fromToken.decimals);
            let token = tokenBalances.find(balance => balance.address.toLowerCase() === data.fromToken.address.toLowerCase());
            if (data.fromToken.symbol.toLowerCase() == 'eth') token = tokenBalances.find(balance => balance.symbol.toLowerCase() === data.fromToken.symbol.toLowerCase());

            if (token && token.balance > amount) {
              setFromToken(data.fromToken);
              setProtocol(data.protocol);
              setToToken(data.toToken);
              setFromAmount(data.fromAmount);
              setReceiver(data.receiver);
              setSteps(data.steps);
              setShowBridgeProcess(true);
              setSolver(response.brianData.solver);
            }
            else {
              response = { text: response.text, insufficient: 'Insufficient balance to perform the transaction.' };
            }
          } else if (response.brianData.action == 'deposit') {
            const data = response.brianData.data;
            resetProcessStates();
            await switchChain(data.fromToken.chainId);
            const amount = convertCryptoAmount(data.fromAmount, data.fromToken.decimals);
            let token = tokenBalances.find(balance => balance.address.toLowerCase() === data.fromToken.address.toLowerCase());
            if (data.fromToken.symbol.toLowerCase() == 'eth') token = tokenBalances.find(balance => balance.symbol.toLowerCase() === data.fromToken.symbol.toLowerCase());

            if (token && token.balance > amount) {
              setFromToken(data.fromToken);
              setProtocol(data.protocol);
              setToToken(data.toToken);
              setFromAmount(data.fromAmount);
              setReceiver(data.receiver);
              setSteps(data.steps);
              setShowDepositProcess(true);
            }
            else {
              response = { text: response.text, insufficient: 'Insufficient balance to perform the transaction.' };
            }
          } else if (response.brianData.action == 'withdraw') {
            const data = response.brianData.data;
            resetProcessStates();
            await switchChain(data.fromToken.chainId);

            setFromToken(data.fromToken);
            setProtocol(data.protocol);
            setToToken(data.toToken);
            setFromAmount(data.fromAmount);
            setReceiver(data.receiver);
            setSteps(data.steps);
            setShowWithdrawProcess(true);
          } else if (response.brianData.action == 'AAVE Borrow') {
            const data = response.brianData.data;
            resetProcessStates();
            await switchChain(data.fromToken.chainId);

            setFromToken(data.fromToken);
            setProtocol(data.protocol);
            setToToken(data.toToken);
            setFromAmount(data.fromAmount);
            setToAmount(data.toAmount);

            setReceiver(data.receiver);
            setSteps(data.steps);
            setShowBorrowProcess(true);
          } else if (response.brianData.action == 'AAVE Repay') {
            const data = response.brianData.data;
            resetProcessStates();
            await switchChain(data.fromToken.chainId);

            setFromToken(data.fromToken);
            setProtocol(data.protocol);
            setToToken(data.toToken);
            setFromAmount(data.fromAmount);
            setToAmount(data.toAmount);
            setReceiver(data.receiver);
            setSteps(data.steps);
            setShowRepayProcess(true);
          } else if (response.brianData.action == 'ENS Registration') {

            const data = response.brianData.data;
            resetProcessStates();
            await switchChain(data.fromToken.chainId);
            setFromToken(data.fromToken);
            setDescription(data.description);
            setSteps(data.steps);
            setEnsName(response.brianData.extractedParams.address);
            setShowENSRegisterProcess(true);
          } else if (response.brianData.action == 'ENS Renewal') {
            const data = response.brianData.data;
            resetProcessStates();
            await switchChain(data.fromToken.chainId);

            setFromToken(data.fromToken);
            setDescription(data.description);
            setSteps(data.steps);
            setEnsName(response.brianData.extractedParams.address);
            setShowENSRenewProcess(true);
          }
        } else if (response.type == "action" && response.brianData.type == 'knowledge') {
          response = { text: convertBrianKnowledgeToPlainText(response.brianData.answer).replace(/brian/gi, "Dexfin") };
        } else if (response.type == "action" && response.brianData.action == 'Onramp') {
          response = { text: response.text, link: response.brianData.data.value }
        } else if (response.type == "knowledge") {
          response = { text: response.text.replace(/brian/gi, "Dexfin") };
        }

        if (response) {
          setMessages(prev => [...prev, {
            role: 'user',
            content: command
          }, {
            role: 'assistant',
            content: response.text,
            tip: response.insufficient,
            link: response.link,
            priceData: response.priceData,
            technicalAnalysis: response.technicalAnalysis,
            trending: response.trending,
            losers: response.losers,
            gainers: response.gainers,
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
          content: "I'm not sure how to help with that. Try asking about prices, trending tokens, latest news, or use commands like 'stake ETH', 'send 100 USDC to vitalik', or 'analyze project'."
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
        ) : showSwapProcess && fromToken && toToken ? (
          <SwapProcess steps={steps} receiver={receiver} fromAmount={fromAmount} toToken={toToken} fromToken={fromToken} protocol={protocol}
            onClose={() => {
              setShowSwapProcess(false);
              setMessages([]);
            }} />
        ) : showBridgeProcess && fromToken && toToken ? (
          <BridgeProcess steps={steps} receiver={receiver} fromAmount={fromAmount} toToken={toToken} fromToken={fromToken} protocol={protocol} solver={solver}
            onClose={() => {
              setShowBridgeProcess(false);
              setMessages([]);
            }} />
        ) : showPortfolioProcess ? (
          <PortfolioProcess onClose={() => {
            setShowPortfolioProcess(false);
            setMessages([]);
          }} />
        ) : showSendProcess && fromToken && toToken ? (
          <SendProcess steps={steps} receiver={receiver} fromAmount={fromAmount} toToken={toToken} fromToken={fromToken}
            onClose={() => {
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
            projectName={''}
          />
        ) : showDepositProcess && fromToken && toToken ? (
          <DepositProcess steps={steps} receiver={receiver} fromAmount={fromAmount} toToken={toToken} fromToken={fromToken} protocol={protocol}
            onClose={() => {
              setShowDepositProcess(false);
              setMessages([]);
            }} />
        ) : showWithdrawProcess && fromToken && toToken ? (
          <WithdrawProcess steps={steps} receiver={receiver} fromAmount={fromAmount} toToken={toToken} fromToken={fromToken} protocol={protocol}
            onClose={() => {
              setShowWithdrawProcess(false);
              setMessages([]);
            }} />
        ) : showBorrowProcess && fromToken && toToken ? (
          <BorrowProcess steps={steps} receiver={receiver} toAmount={toAmount} fromAmount={fromAmount} toToken={toToken} fromToken={fromToken} protocol={protocol}
            onClose={() => {
              setShowBorrowProcess(false);
              setMessages([]);
            }} />
        ) : showRepayProcess && fromToken && toToken ? (
          <RepayProcess steps={steps} receiver={receiver} toAmount={toAmount} fromAmount={fromAmount} toToken={toToken} fromToken={fromToken} protocol={protocol}
            onClose={() => {
              setShowRepayProcess(false);
              setMessages([]);
            }} />
        ) : showENSRegisterProcess && fromToken ? (
          <ENSRegisterProcess description={description} steps={steps} ensName={ensName} fromToken={fromToken} onClose={() => {
            setShowENSRegisterProcess(false);
            setMessages([]);
          }} />
        ) : showENSRenewProcess && fromToken ? (
          <ENSRenewProcess description={description} steps={steps} ensName={ensName} fromToken={fromToken} onClose={() => {
            setShowENSRenewProcess(false);
            setMessages([]);
          }} />
        ) : (
          <div className="flex flex-col h-full">
            {/* Header */}
            <TopBar processCommand={processCommand} address={address} chainId={chainId} isFullscreen={isFullscreen} setIsFullscreen={setIsFullscreen} onClose={onClose} setInput={setInput} />
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
                              : 'glass border border-white/10'
                              }`}
                          >
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            <p className="text-red-500 text-sm whitespace-pre-wrap">{message.tip}</p>
                            {message.link && (
                              <a href={message.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 float-right">
                                Open link
                              </a>
                            )}
                            {message.priceData && (
                              <div className="mt-4 w-full">
                                <PriceCard data={message.priceData} isLoading={false}></PriceCard>
                              </div>
                            )}
                            {message.technicalAnalysis && (
                              <div className="mt-4 w-full">
                                <TechnicalAnalysis isWalletPanelOpen={isWalletPanelOpen} isLoading={false} data={message.technicalAnalysis}></TechnicalAnalysis>
                              </div>
                            )}
                            {message.trending && <TrendingCoins coins={message.trending} />}
                            {message.losers && <TopCoins type="loser" coins={message.losers} />}
                            {message.gainers && <TopCoins type="gainer" coins={message.gainers} />}
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
          { command: "Stake 1 ETH on Lido", description: "Earn staking rewards" },
          { command: "Deposit 1 USDC on Aave", description: "Earn lending interest" },
          { command: "Withdraw 2 USDC on Aave", description: "Remove Deposited tokens" },
          { command: "Swap 1 USDC for ETH", description: "Execute token swap" }
        ]}
      />
    </div>
  );
}
