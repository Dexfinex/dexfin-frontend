import OpenAI from 'openai';
import { coingeckoService } from '../services/coingecko.service';
import { cryptoNewsService } from "../services/cryptonews.service";
import { brianService } from '../services/brian.services';

import { wallpapers } from '../store/useStore';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Command chaining parser
const parseChainedCommands = (message: string): string[] => {
  // Split on "and" or "&" while preserving quoted strings
  const commands = message.split(/\s+(?:and|&)\s+/i).map(cmd => cmd.trim());
  return commands;
};

// Comprehensive fallback responses for common queries
const fallbackResponses: Record<string, {
  text: string;
  action?: (param?: string) => Promise<any>;
}> = {
  'bitcoin price': {
    text: 'Let me fetch the current Bitcoin price for you.',
    action: async () => {
      const data = await coingeckoService.getCoinPrice('bitcoin');
      return {
        text: `The current Bitcoin price is $${data.price.toLocaleString()} (${data.priceChange24h.toFixed(2)}% 24h change)`,
        data
      };
    }
  },
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
  'latest news': {
    text: 'Here are the latest crypto news updates:',
    action: async () => {
      const news = await cryptoNewsService.getLatestNews();
      return {
        text: 'Here are the latest crypto news updates:',
        news
      };
    }
  },
  // 'stake eth': {
  //   text: 'Opening Lido staking interface...',
  //   action: async () => ({
  //     text: 'Opening Lido staking interface...',
  //     command: 'STAKE_ETH'
  //   })
  // },
  'open settings': {
    text: 'Opening settings...',
    action: async () => ({
      text: 'Opening settings...',
      command: 'OPEN_SETTINGS'
    })
  },
  'change wallpaper': {
    text: 'Changing wallpaper...',
    action: async (wallpaperName?: string) => {
      if (wallpaperName) {
        const wallpaper = wallpapers.find(w =>
          w.name.toLowerCase() === wallpaperName.toLowerCase()
        );
        if (wallpaper) {
          return {
            text: `Changing wallpaper to ${wallpaper.name}...`,
            command: 'CHANGE_WALLPAPER',
            wallpaper
          };
        }
      }
      return {
        text: 'Please specify a wallpaper name (Night City, Downtown, Mountains, Forest, Waves, or Gradient)',
        command: 'CHANGE_WALLPAPER'
      };
    }
  }
};

// Helper to find matching fallback response
const findFallbackResponse = async (message: string) => {
  const normalizedMessage = message.toLowerCase();

  // Special handling for wallpaper changes
  if (normalizedMessage.includes('change wallpaper to')) {
    const wallpaperName = message.split('to').pop()?.trim();
    return await fallbackResponses['change wallpaper'].action?.(wallpaperName);
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


function convertToPlainText(text: string) {
  return text
    .replace(/"\n+/g, '')            // Remove unnecessary quote marks and new lines
    .replace(/###?.*?\n/g, '')       // Remove headings (### Title)
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold (**bold** -> bold)
    .replace(/-\s+/g, '')            // Remove bullet points (- item -> item)
    .replace(/\d+\.\s+/g, '')        // Remove numbered list (1. item -> item)
    .replace(/\n{2,}/g, ' ')         // Replace multiple new lines with space
    .replace(/\n/g, ' ')             // Replace remaining new lines with space
    .trim();                         // Remove leading and trailing spaces
}

// Process a single command
const processCommand = async (command: string, address: string, chainId: number | undefined) => {
  // Try fallback response first
  const fallbackResponse = await findFallbackResponse(command);
  if (fallbackResponse) {
    return fallbackResponse;
  }

  // Direct command handling for common queries
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
        text: brianTransactionData.message
      }
    } else {
      const brianKnowledgeData = await brianService.getBrianKnowledgeData(command);
      return {
        text: convertToPlainText(brianKnowledgeData.message)
      }
    }



    const completion = await Promise.race([
      openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant focused on cryptocurrency and blockchain technology. Keep responses concise and informative."
          },
          {
            role: "user",
            content: command
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('OpenAI API timeout')), 10000)
      )
    ]) as unknown as OpenAI.Chat.Completions.ChatCompletion;

    return {
      text: completion.choices[0].message.content || "I'm sorry, I couldn't process your request."
    };

  } catch (e) {

    const error = e as {
      error?: { type?: string; code?: string };
      message?: string
    };
    // Handle OpenAI API errors gracefully
    console.error('OpenAI API Error:', error);

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

export async function generateResponse(userMessage: string, address: string, chainId: number | undefined) {
  try {
    // Parse chained commands
    console.log(address);
    const commands = parseChainedCommands(userMessage);

    // If there are multiple commands, process them sequentially
    if (commands.length > 1) {
      const results = [];
      for (const command of commands) {
        try {
          const result = await processCommand(command, address, chainId);
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
    return await processCommand(userMessage, address, chainId);
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
