import { useContext, useEffect, useRef, useState } from 'react';
import { Web3AuthContext } from '../../providers/Web3AuthContext.tsx';
import { coingeckoService } from '../../services/coingecko.service';
import { isAddress } from "viem";
import { brianService } from '../../services/brian.service';
import useTrendingTokensStore from '../../store/useTrendingTokensStore.ts';
import {
  convertBrianKnowledgeToPlainText,
  convertCryptoAmount,
  getSolAddressFromSNS,
  isValidSolanaAddress,
  parseChainedCommands,
  resolveEnsToAddress,
  symbolToToken
} from '../../utils/agent.util.tsx';
import { Mic, Send, Trash2, } from 'lucide-react';
import { VoiceModal } from './VoiceModal.tsx';
import { Message } from '../../types/index.ts';
import { TrendingCoins } from './components/Analysis/TrendingCoins.tsx';
import { TopCoins } from './components/Analysis/TopCoins.tsx'
import { NewsWidget } from '../widgets/NewsWidget.tsx';
import { YieldProcess } from './components/EVM/YieldProcess.tsx';
import { SwapProcess } from './components/EVM/SwapProcess.tsx';
import { SolSwapProcess } from './components/Solana/SolSwapProcess.tsx';
import { BridgeProcess } from './components/EVM/BridgeProcess.tsx';
import { PortfolioProcess } from '../PortfolioProcess.tsx';
import { SendProcess } from './components/EVM/SendProcess.tsx';
import { EVMSendProcess } from './components/EVM/EVMSendProcess.tsx';
import { EVMSwapProcess } from './components/EVM/EVMSwapProcess.tsx';
import { SolSendProcess } from './components/Solana/SolSendProcess.tsx';
import { StakeProcess } from '../StakeProcess.tsx';
import { ProjectAnalysisProcess } from '../ProjectAnalysisProcess.tsx';
import { WalletPanel } from './WalletPanel.tsx';
import { InitializeCommands } from './InitializeCommands.tsx';
import { TopBar } from './TopBar.tsx';
import { Protocol, Step, TokenType, Yield } from '../../types/brian.type.ts';
import useTokenBalanceStore from '../../store/useTokenBalanceStore.ts';
import { DepositProcess } from './components/EVM/DepositProcess.tsx';
import { WithdrawProcess } from './components/EVM/WithdrawProcess.tsx';
import { BorrowProcess } from './components/EVM/BorrowProcess.tsx';
import { RepayProcess } from './components/EVM/RepayProcess.tsx';
import { ENSRegisterProcess } from './components/EVM/ENSRegisterProcess.tsx';
import { ENSRenewProcess } from './components/EVM/ENSRenewProcess.tsx';
import { openaiService } from '../../services/openai.services.ts';
import { PriceCard } from './components/Analysis/PriceCard.tsx';
import { TechnicalAnalysis } from './components/Analysis/TechnicalAnalysis.tsx';
import { SentimentAnalysis } from './components/Analysis/SentimentAnalysis.tsx';
import { PredictionAnalysis } from './components/Analysis/PredictionAnalysis.tsx';
import { MarketOverview } from './components/Analysis/MarketOverview.tsx';
import { mapChainName2Network, mapPopularTokens } from '../../config/networks.ts';

interface AIAgentModalProps {
  isOpen: boolean;
  widgetCommand: string;
  onClose: () => void;
}

export default function AIAgentModal({ isOpen, widgetCommand, onClose }: AIAgentModalProps) {
  const { trendingTokens } = useTrendingTokensStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showYieldProcess, setShowYieldProcess] = useState(false);
  const [showSwapProcess, setShowSwapProcess] = useState(false);
  const [showSolSwapProcess, setShowSolSwapProcess] = useState(false);
  const [showBridgeProcess, setShowBridgeProcess] = useState(false);
  const [showPortfolioProcess, setShowPortfolioProcess] = useState(false);
  const [showSendProcess, setShowSendProcess] = useState(false);
  const [showEVMSendProcess, setShowEVMSendProcess] = useState(false);
  const [showEVMSwapProcess, setShowEVMSwapProcess] = useState(false);
  const [showSolSendProcess, setShowSolSendProcess] = useState(false);
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
  const [yields, setYields] = useState<Yield[]>([]);
  const [description, setDescription] = useState('');

  const resetProcessStates = () => {
    setShowYieldProcess(false);
    setShowSwapProcess(false);
    setShowSolSwapProcess(false);
    setShowBridgeProcess(false);
    setShowPortfolioProcess(false);
    setShowSendProcess(false);
    setShowEVMSendProcess(false);
    setShowEVMSwapProcess(false);
    setShowStakeProcess(false);
    setShowProjectAnalysis(false);
    setShowDepositProcess(false);
    setShowWithdrawProcess(false);
    setShowBorrowProcess(false);
    setShowRepayProcess(false);
    setShowENSRegisterProcess(false);
    setShowENSRenewProcess(false);

    setShowSolSendProcess(false);
  };

  const processCommandCase = async (command: string, address: string, chainId: number | undefined) => {

    const fallbackResponse = await findFallbackResponse(command);
    if (fallbackResponse) {
      return fallbackResponse;
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
    const response = await openaiService.getOpenAIAnalyticsData(normalizedMessage);
    console.log(response);
    if (response && response.type == "price") {

      if (response.data) {
        const { priceData } = response.data;
        return {
          text: `The current ${response.data.name} price is $${priceData.price.toLocaleString()} (${priceData.change24h.toFixed(2)}% 24h change)\n`,
          priceData: {
            price: priceData.price,
            priceChange24h: priceData.change24h,
            marketCap: priceData.marketCap,
            volume24h: priceData.volume24h,
            chartData: response.data.history,
            name: response.data.name,
            symbol: response.data.symbol,
            logoURI: response.data.logo.thumb,
            analysis: response.data.response,
          }
        };
      }
    } else if (response && response.type == "cryptonews") {
      return {
        text: 'Here are the latest crypto news updates',
        news: response.data.news_items,
      };
    } else if (response && response.type == "trending") {
      return {
        text: 'Here are the currently trending tokens:',
        trending: response.data.trending_coins
      };
    } else if (response && response.type == "top_losers") {
      return {
        text: 'Here are the top losers',
        losers: response.data.losers.map((item: any) => ({
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
    } else if (response && response.type == "top_gainers") {
      return {
        text: 'Here are the top gainers',
        gainers: response.data.gainers.map((item: any) => ({
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
    } else if (response && response.type == "technical_analysis") {
      return {
        text: `Here's the ${response.data.coinId} technical analysis:`,
        technicalAnalysis: response.data,
      }
    } else if (response && response.type == "sentiment") {
      const sentimentDate = Object.keys(response.data.socialSentiment)[0];
      const negative_score = response.data.socialSentiment?.[sentimentDate]?.[Object.keys(response.data.socialSentiment[sentimentDate])[0]]?.Negative;
      const positive_score = response.data.socialSentiment?.[sentimentDate]?.[Object.keys(response.data.socialSentiment[sentimentDate])[0]]?.Positive;
      return {
        text: `Here's the ${response.data.priceData.data.name} market sentiment analysis:`,
        sentimentAnalysis: {
          social_sentiment: positive_score * 100 / (negative_score + positive_score),
          trading_sentiment: response.data.tradingSentiment.value,
          technical_sentiment: response.data.technical.rsi,
          current_price: response.data.priceData.data.priceData.price,
          price_change_percentage_24h: response.data.priceData.data.priceData.change24h,
          price_history: response.data.priceData.data.history,
          volume_24h: response.data.priceData.data.priceData.volume24h,
          market_cap: response.data.priceData.data.priceData.marketCap,
          name: response.data.priceData.data.name
        },
      }
    } else if (response && response.predictions) {
      return {
        text: `Here's the ${response.coinId}  price prediction analysis:`,
        predictionAnalysis: response,
      }
    } else if (response && response.fear) {
      return {
        text: `Here's the current market overview:`,
        marketOverview: response,
      }
    } else if (response && response.type == "best_yields") {
      return {
        type: "best_yields",
        yields: response.data,
      }
    }

    const sol_response = await openaiService.getOpenAISolanaData(message);
    console.log(sol_response);
    if (sol_response && sol_response.type == "transfer_sol" && sol_response.args.chainName == "solana") {
      return sol_response;
    } else if (sol_response && sol_response.type == "swap_sol" && sol_response.args.chainName == "solana") {
      return sol_response;
    } else if (sol_response && sol_response.type == "transfer_evm" && sol_response.args.chainName != "solana") {
      return sol_response;
    } else if (sol_response && sol_response.type == "swap_evm" && sol_response.args.chainName != "solana") {
      return sol_response;
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
      const normalizedText = text.trim();
      let response: any = null;

      // Process chained commands
      const commands = normalizedText.split(/\s+(?:and|&)\s+/i);

      for (const command of commands) {
        const normalizedCommand = command.trim();
        setMessages(prev => [...prev, {
          role: 'user',
          content: command
        }]);
        response = await generateResponse(normalizedCommand, address, chainId);
        console.log(response);
        if (response.type == "action" && response.brianData.type == "write") {
          if (response.brianData.action == 'transfer') {
            const data = response.brianData.data;
            resetProcessStates();

            if (chainId != data.fromToken.chainId) {
              await switchChain(data.fromToken.chainId);
            }

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
            if (chainId != data.fromToken.chainId) await switchChain(data.fromToken.chainId);
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
            if (chainId != data.fromToken.chainId) await switchChain(data.fromToken.chainId);
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
            if (chainId != data.fromToken.chainId) await switchChain(data.fromToken.chainId);
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
            if (chainId != data.fromToken.chainId) await switchChain(data.fromToken.chainId);

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
            if (chainId != data.fromToken.chainId) await switchChain(data.fromToken.chainId);

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
            if (chainId != data.fromToken.chainId) await switchChain(data.fromToken.chainId);

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
            if (chainId != data.fromToken.chainId) await switchChain(data.fromToken.chainId);
            setFromToken(data.fromToken);
            setDescription(data.description);
            setSteps(data.steps);
            setEnsName(response.brianData.extractedParams.address);
            setShowENSRegisterProcess(true);
          } else if (response.brianData.action == 'ENS Renewal') {
            const data = response.brianData.data;
            resetProcessStates();
            if (chainId != data.fromToken.chainId) await switchChain(data.fromToken.chainId);

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
        } else if (response.type == "best_yields") {
          await switchChain(1);
          setYields(response.yields);
          setShowYieldProcess(true);
        } else if (response.type == "transfer_sol") {
          const token = tokenBalances.find(item => item.symbol.toLowerCase() === response.args.inputSymbol.toLowerCase() && item.network?.id === "solana");
          if (token && token.balance > response.args.amount) {
            let address = response.args.outputMint;
            const snsToAddress = await getSolAddressFromSNS(address);
            if (snsToAddress) address = snsToAddress;
            if (isValidSolanaAddress(address)) {
              setFromToken({
                symbol: token.symbol,
                name: token.name,
                address: token.address,
                chainId: token.chain,
                decimals: token.decimals,
                logoURI: token.logo,
                priceUSD: token.usdPrice
              });
              setFromAmount(response.args.amount);
              setReceiver(address);
              setShowSolSendProcess(true);
            } else {
              response = { text: 'Missing mandatory parameter(s) in the prompt: address. Please rewrite the entire prompt.' }
            }
          }
          else {
            response = { text: `transfer ${response.args.amount} ${response.args.inputSymbol} to ${response.args.outputMint} on solana`, insufficient: 'Insufficient balance to perform the transaction.' };
          }
        } else if (response.type == "swap_sol") {
          const token = tokenBalances.find(item => item.symbol.toLowerCase() === response.args.inputSymbol.toLowerCase() && item.network?.id === "solana");
          if (token && token.balance > response.args.inAmount) {
            const toToken = symbolToToken(response.args.outputSymbol);
            const fromToken = symbolToToken(response.args.inputSymbol);
            if (toToken && fromToken) {
              setFromToken(fromToken);
              setProtocol({
                key: "",
                logoURI: "",
                name: "Jupiter",
              });
              setToToken(toToken);
              setFromAmount(response.args.inAmount);
              setShowSolSwapProcess(true);
            } else {
              response = { text: 'Missing mandatory parameter(s) in the prompt: address. Please rewrite the entire prompt.' }
            }
          } else {
            response = { text: `swap ${response.args.inAmount} ${response.args.inputSymbol} for ${response.args.outputSymbol} on solana`, insufficient: 'Insufficient balance to perform the transaction.' };
          }
        } else if (response.type == "transfer_evm") {
          resetProcessStates();
          const fromNetwork = mapChainName2Network[response.args.chainName];
          if (chainId != fromNetwork.chainId) {
            await switchChain(fromNetwork.chainId);
          }

          const token = tokenBalances.find(item => item.symbol.toLowerCase() === response.args.inputSymbol.toLowerCase() && item.network?.id === fromNetwork.id);

          let address = response.args.outputMint;
          const ensAddress = await resolveEnsToAddress(address);

          if (ensAddress) address = ensAddress;
          if (token && token.balance > response.args.amount) {
            if (isAddress(address)) {
              setFromToken({
                symbol: token.symbol,
                name: token.name,
                address: token.address,
                chainId: Number(token.chain),
                decimals: token.decimals,
                logoURI: token.logo,
                priceUSD: token.usdPrice
              });
              setFromAmount(response.args.amount);
              setReceiver(address);
              setShowEVMSendProcess(true);
            } else {
              response = { text: 'Missing mandatory parameter(s) in the prompt: address. Please rewrite the entire prompt.' }
            }
          }
          else {
            response = { text: `transfer ${response.args.amount} ${response.args.inputSymbol} to ${response.args.outputMint} on ${fromNetwork.id}`, insufficient: 'Insufficient balance to perform the transaction.' };
          }
        } else if (response.type == "swap_evm") {
          resetProcessStates();

          const fromNetwork = mapChainName2Network[response.args.chainName];

          if (chainId != fromNetwork.chainId) {
            await switchChain(fromNetwork.chainId);
          }

          const token = tokenBalances.find(item => item.symbol.toLowerCase() === response.args.inputSymbol.toLowerCase() && item.network?.id === fromNetwork.id);
          if (token && token.balance > response.args.inAmount) {
            let toToken = null;
            const popularTokens = mapPopularTokens[fromNetwork.chainId];
            const popularToken = popularTokens.find(item => item?.symbol?.toLowerCase() === response.args.outputSymbol.toLowerCase());
            if (popularToken) {
              toToken = {
                symbol: popularToken.symbol || '',
                name: popularToken.name,
                address: popularToken.address,
                chainId: popularToken.chainId,
                decimals: popularToken.decimals,
                logoURI: popularToken.logoURI,
              };
            } else {
              const trendingTokensBase = trendingTokens[fromNetwork.id];
              const tmpToken = trendingTokensBase.find(item => item?.symbol?.toLowerCase() === response.args.outputSymbol.toLowerCase());

              if (tmpToken) {
                toToken = {
                  symbol: tmpToken.symbol || '',
                  name: tmpToken.name,
                  address: tmpToken.address,
                  chainId: tmpToken.chainId,
                  decimals: tmpToken.decimals,
                  logoURI: tmpToken.logoURI,
                };
              }
            }
            if (toToken) {
              setFromToken({
                symbol: token.symbol,
                name: token.name,
                address: token.address,
                chainId: Number(token.chain),
                decimals: token.decimals,
                logoURI: token.logo,
                priceUSD: token.usdPrice
              });
              setProtocol({
                key: "",
                logoURI: "",
                name: "0x",
              });
              setToToken({
                symbol: toToken.symbol,
                name: toToken.name,
                address: toToken.address,
                chainId: Number(toToken.chainId),
                decimals: toToken.decimals,
                logoURI: toToken.logoURI,
                priceUSD: 0,
              });
              setFromAmount(response.args.inAmount);
              setShowEVMSwapProcess(true);
            } else {
              response = { text: 'Missing mandatory parameter(s) in the prompt: address. Please rewrite the entire prompt.' }
            }
          } else {
            response = { text: `swap ${response.args.inAmount} ${response.args.inputSymbol} for ${response.args.outputSymbol} on ${fromNetwork.id}`, insufficient: 'Insufficient balance to perform the transaction.' };
          }
        }

        if (response) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: response.text,
            tip: response.insufficient,
            link: response.link,
            priceData: response.priceData,
            technicalAnalysis: response.technicalAnalysis,
            sentimentAnalysis: response.sentimentAnalysis,
            predictionAnalysis: response.predictionAnalysis,
            marketOverview: response.marketOverview,
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

  useEffect(() => {
    if (widgetCommand) {
      setInput(widgetCommand);
    }
  }, [widgetCommand]);

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
          <YieldProcess yields={yields} onClose={() => {
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
        ) : showSolSendProcess && fromToken ? (
          <SolSendProcess receiver={receiver} fromAmount={fromAmount} fromToken={fromToken}
            onClose={() => {
              setShowSolSendProcess(false);
              setMessages([]);
            }} />
        ) : showSolSwapProcess && fromToken && toToken ? (
          <SolSwapProcess fromAmount={fromAmount} toToken={toToken} fromToken={fromToken} protocol={protocol}
            onClose={() => {
              setShowSolSwapProcess(false);
              setMessages([]);
            }} />
        ) : showEVMSendProcess && fromToken ? (
          <EVMSendProcess receiver={receiver} fromAmount={fromAmount} fromToken={fromToken}
            onClose={() => {
              setShowEVMSendProcess(false);
              setMessages([]);
            }} />
        ) : showEVMSwapProcess && fromToken && toToken ? (
          <EVMSwapProcess fromAmount={fromAmount} toToken={toToken} fromToken={fromToken} protocol={protocol}
            onClose={() => {
              setShowEVMSwapProcess(false);
              setMessages([]);
            }} />
        ) :
          (
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
                              {message.sentimentAnalysis && (
                                <div className="mt-4 w-full">
                                  <SentimentAnalysis isWalletPanelOpen={isWalletPanelOpen} isLoading={false} data={message.sentimentAnalysis}></SentimentAnalysis>
                                </div>
                              )}
                              {message.predictionAnalysis && (
                                <div className="mt-4 w-full">
                                  <PredictionAnalysis isWalletPanelOpen={isWalletPanelOpen} isLoading={false} data={message.predictionAnalysis}></PredictionAnalysis>
                                </div>
                              )}
                              {message.marketOverview && (
                                <div className="mt-4 w-full">
                                  <MarketOverview isWalletPanelOpen={isWalletPanelOpen} isLoading={false} data={message.marketOverview}></MarketOverview>
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
          { command: "Transfer 10 USDC to dexfin.eth", description: "Transfer USDC" },
          { command: "Deposit 1 USDC on Aave", description: "Earn lending interest" },
          { command: "Withdraw 2 USDC on Aave", description: "Remove Deposited tokens" },
          { command: "Swap 1 USDC for ETH", description: "Execute token swap" }
        ]}
      />
    </div>
  );
}
