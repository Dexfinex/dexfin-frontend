import React, { useState, useEffect } from 'react';
import { X, Trophy, Timer, ArrowLeft, Brain, Check, X as XIcon, Heart, Zap, Shield, Clock } from 'lucide-react';

interface GameState {
  screen: 'menu' | 'difficulty' | 'game' | 'results';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  currentQuestion: number;
  score: number;
  timeLeft: number;
  answers: boolean[];
  highScore: number;
  bestStreak: number;
  totalTokens: number;
  selectedAnswer: number | null;
  showFeedback: boolean;
  lives: number;
  powerups: {
    fiftyFifty: boolean;
    timeFreeze: boolean;
    doublePoints: boolean;
  };
  streak: number;
  multiplier: number;
}

interface Question {
  question: string;
  answers: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Basics' | 'Technical' | 'DeFi' | 'NFTs' | 'History';
}

const QUESTION_BANK: Question[] = [
  {
    question: "What is Bitcoin's maximum supply?",
    answers: ["21 Million", "18 Million", "100 Million", "Unlimited"],
    correctAnswer: 0,
    explanation: "Bitcoin has a fixed maximum supply of 21 million coins, which helps maintain its scarcity and value proposition as a deflationary asset.",
    difficulty: 'Easy',
    category: 'Basics'
  },
  {
    question: "What consensus mechanism does Ethereum 2.0 use?",
    answers: ["Proof of Work", "Proof of Stake", "Proof of Authority", "Proof of History"],
    correctAnswer: 1,
    explanation: "Ethereum 2.0 transitioned to Proof of Stake to improve scalability, energy efficiency, and reduce environmental impact.",
    difficulty: 'Medium',
    category: 'Technical'
  },
  {
    question: "What is a smart contract?",
    answers: [
      "A legal document",
      "Self-executing code on blockchain",
      "A trading agreement",
      "A wallet type"
    ],
    correctAnswer: 1,
    explanation: "Smart contracts are self-executing contracts with the terms directly written into code, enabling trustless and automated transactions.",
    difficulty: 'Easy',
    category: 'Basics'
  },
  {
    question: "What is DeFi?",
    answers: [
      "Decentralized Finance",
      "Digital Finance",
      "Direct Finance",
      "Distributed Finance"
    ],
    correctAnswer: 0,
    explanation: "DeFi refers to financial services built on blockchain technology that operate without traditional intermediaries like banks.",
    difficulty: 'Easy',
    category: 'DeFi'
  },
  {
    question: "What is a blockchain fork?",
    answers: [
      "A cryptocurrency split",
      "A mining tool",
      "A wallet backup",
      "A trading strategy"
    ],
    correctAnswer: 0,
    explanation: "A fork occurs when a blockchain diverges into two paths, creating two separate versions. This can be either soft (backward-compatible) or hard (incompatible).",
    difficulty: 'Medium',
    category: 'Technical'
  },
  {
    question: "What is a private key used for?",
    answers: [
      "Website login",
      "Mining cryptocurrency",
      "Accessing your wallet",
      "Creating tokens"
    ],
    correctAnswer: 2,
    explanation: "Private keys are cryptographic keys that give you control over your cryptocurrency wallet and allow you to sign transactions.",
    difficulty: 'Easy',
    category: 'Basics'
  },
  {
    question: "What is a DEX?",
    answers: [
      "Digital Exchange",
      "Decentralized Exchange",
      "Direct Exchange",
      "Distributed Exchange"
    ],
    correctAnswer: 1,
    explanation: "A DEX is a decentralized exchange that operates using smart contracts, allowing direct peer-to-peer trading without intermediaries.",
    difficulty: 'Easy',
    category: 'DeFi'
  },
  {
    question: "What is 'gas' in Ethereum?",
    answers: [
      "Network fuel",
      "A token type",
      "Mining reward",
      "Exchange fee"
    ],
    correctAnswer: 0,
    explanation: "Gas is the fee required to perform transactions on the Ethereum network, measured in units of computation called 'gas units'.",
    difficulty: 'Medium',
    category: 'Technical'
  },
  {
    question: "What is a Layer 2 solution?",
    answers: [
      "A new blockchain",
      "A scaling solution",
      "A wallet type",
      "A mining protocol"
    ],
    correctAnswer: 1,
    explanation: "Layer 2 solutions are built on top of existing blockchains to improve scalability by processing transactions off the main chain.",
    difficulty: 'Hard',
    category: 'Technical'
  },
  {
    question: "What is staking?",
    answers: [
      "Trading strategy",
      "Mining method",
      "Holding tokens to validate",
      "Token burning"
    ],
    correctAnswer: 2,
    explanation: "Staking involves locking up tokens to participate in network validation and earn rewards in Proof of Stake systems.",
    difficulty: 'Medium',
    category: 'DeFi'
  },
  {
    question: "What is an NFT?",
    answers: [
      "Non-Fungible Token",
      "New Financial Tool",
      "Network File Transfer",
      "Node Function Type"
    ],
    correctAnswer: 0,
    explanation: "NFTs are unique digital assets that represent ownership of specific items or content on the blockchain.",
    difficulty: 'Easy',
    category: 'NFTs'
  },
  {
    question: "What was the first NFT collection on Ethereum?",
    answers: [
      "CryptoPunks",
      "Bored Apes",
      "CryptoKitties",
      "Meebits"
    ],
    correctAnswer: 0,
    explanation: "CryptoPunks, launched in 2017, was the first NFT collection on Ethereum and inspired the ERC-721 standard.",
    difficulty: 'Hard',
    category: 'History'
  },
  {
    question: "What is a liquidity pool?",
    answers: [
      "A cryptocurrency savings account",
      "A pair of tokens for trading",
      "A mining pool",
      "A type of wallet"
    ],
    correctAnswer: 1,
    explanation: "A liquidity pool is a pair of tokens locked in a smart contract to enable decentralized trading on DEXes.",
    difficulty: 'Medium',
    category: 'DeFi'
  },
  {
    question: "What is a flash loan?",
    answers: [
      "A quick personal loan",
      "An uncollateralized DeFi loan",
      "A high-interest loan",
      "A long-term crypto loan"
    ],
    correctAnswer: 1,
    explanation: "Flash loans are uncollateralized loans in DeFi that must be borrowed and repaid within the same transaction block.",
    difficulty: 'Hard',
    category: 'DeFi'
  },
  {
    question: "What is the ERC-20 standard?",
    answers: [
      "A token standard",
      "A blockchain protocol",
      "A wallet format",
      "A mining algorithm"
    ],
    correctAnswer: 0,
    explanation: "ERC-20 is a technical standard for fungible tokens on the Ethereum blockchain, defining a common set of rules for tokens to follow.",
    difficulty: 'Medium',
    category: 'Technical'
  }
];

const QUESTIONS_PER_GAME = {
  Easy: 5,
  Medium: 8,
  Hard: 10
} as const;

const difficultySettings = {
  Easy: {
    timeLimit: 60,
    lives: 3,
    multiplier: 1,
    tokenBase: 10
  },
  Medium: {
    timeLimit: 45,
    lives: 2,
    multiplier: 2,
    tokenBase: 20
  },
  Hard: {
    timeLimit: 30,
    lives: 1,
    multiplier: 3,
    tokenBase: 30
  }
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getRandomQuestions(difficulty: 'Easy' | 'Medium' | 'Hard'): Question[] {
  const difficultyQuestions = QUESTION_BANK.filter(q => {
    switch (difficulty) {
      case 'Easy':
        return q.difficulty === 'Easy';
      case 'Medium':
        return q.difficulty === 'Easy' || q.difficulty === 'Medium';
      case 'Hard':
        return true;
    }
  });

  const requiredQuestions = QUESTIONS_PER_GAME[difficulty];
  if (difficultyQuestions.length < requiredQuestions) {
    console.warn(`Not enough questions for ${difficulty} difficulty. Using all available questions.`);
    return shuffleArray(difficultyQuestions);
  }

  if (difficulty === 'Medium' || difficulty === 'Hard') {
    const categories = [...new Set(difficultyQuestions.map(q => q.category))];
    const selectedQuestions: Question[] = [];

    categories.forEach(category => {
      const categoryQuestions = difficultyQuestions.filter(q => q.category === category);
      if (categoryQuestions.length > 0) {
        selectedQuestions.push(shuffleArray(categoryQuestions)[0]);
      }
    });

    const remainingSlots = requiredQuestions - selectedQuestions.length;
    if (remainingSlots > 0) {
      const remainingQuestions = difficultyQuestions.filter(
        q => !selectedQuestions.includes(q)
      );
      selectedQuestions.push(...shuffleArray(remainingQuestions).slice(0, remainingSlots));
    }

    return shuffleArray(selectedQuestions);
  }

  return shuffleArray(difficultyQuestions).slice(0, requiredQuestions);
}

export const CryptoTrivia: React.FC = () => {
  const [state, setState] = useState<GameState>({
    screen: 'menu',
    difficulty: 'Medium',
    currentQuestion: 0,
    score: 0,
    timeLeft: 0,
    answers: [],
    highScore: 0,
    bestStreak: 0,
    totalTokens: 0,
    selectedAnswer: null,
    showFeedback: false,
    lives: 3,
    powerups: {
      fiftyFifty: true,
      timeFreeze: true,
      doublePoints: true
    },
    streak: 0,
    multiplier: 1
  });

  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (state.screen === 'game') {
      const timer = setInterval(() => {
        setState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [state.screen]);

  useEffect(() => {
    if (state.timeLeft === 0 && state.screen === 'game') {
      handleTimeUp();
    }
  }, [state.timeLeft]);

  const startGame = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    const randomizedQuestions = getRandomQuestions(difficulty);
    setGameQuestions(randomizedQuestions);

    setState(prev => ({
      ...prev,
      screen: 'game',
      difficulty,
      currentQuestion: 0,
      score: 0,
      timeLeft: difficultySettings[difficulty].timeLimit,
      answers: [],
      lives: difficultySettings[difficulty].lives,
      powerups: {
        fiftyFifty: true,
        timeFreeze: true,
        doublePoints: true
      },
      streak: 0,
      multiplier: difficultySettings[difficulty].multiplier
    }));
  };

  const handleTimeUp = () => {
    if (state.lives > 1) {
      setState(prev => ({
        ...prev,
        lives: prev.lives - 1,
        timeLeft: difficultySettings[prev.difficulty].timeLimit,
        streak: 0,
        multiplier: difficultySettings[prev.difficulty].multiplier
      }));
    } else {
      endGame();
    }
  };

  const endGame = () => {
    const baseScore = state.answers.filter(a => a).length;
    const difficultyMultiplier = difficultySettings[state.difficulty].multiplier;
    const finalScore = Math.round(baseScore * difficultyMultiplier * state.multiplier);
    
    setState(prev => ({
      ...prev,
      screen: 'results',
      score: finalScore,
      highScore: Math.max(prev.highScore, finalScore),
      totalTokens: prev.totalTokens + (finalScore * difficultySettings[prev.difficulty].tokenBase)
    }));
  };

  const handleAnswer = (answerIndex: number) => {
    if (state.showFeedback) return;

    const isCorrect = answerIndex === gameQuestions[state.currentQuestion].correctAnswer;
    const newAnswers = [...state.answers, isCorrect];
    const newStreak = isCorrect ? state.streak + 1 : 0;
    const newMultiplier = Math.min(3, 1 + Math.floor(newStreak / 3) * 0.5);

    setState(prev => ({
      ...prev,
      selectedAnswer: answerIndex,
      showFeedback: true,
      streak: newStreak,
      multiplier: newMultiplier * difficultySettings[prev.difficulty].multiplier
    }));

    setTimeout(() => {
      if (state.currentQuestion === gameQuestions.length - 1 || (!isCorrect && state.lives === 1)) {
        const baseScore = newAnswers.filter(a => a).length;
        const difficultyMultiplier = difficultySettings[state.difficulty].multiplier;
        const finalScore = Math.round(baseScore * difficultyMultiplier * newMultiplier);
        
        setState(prev => ({
          ...prev,
          answers: newAnswers,
          score: finalScore,
          screen: 'results',
          highScore: Math.max(prev.highScore, finalScore),
          totalTokens: prev.totalTokens + (finalScore * difficultySettings[prev.difficulty].tokenBase)
        }));
      } else if (!isCorrect) {
        setState(prev => ({
          ...prev,
          currentQuestion: prev.currentQuestion + 1,
          answers: newAnswers,
          selectedAnswer: null,
          showFeedback: false,
          lives: prev.lives - 1,
          timeLeft: difficultySettings[prev.difficulty].timeLimit
        }));
      } else {
        setState(prev => ({
          ...prev,
          currentQuestion: prev.currentQuestion + 1,
          answers: newAnswers,
          selectedAnswer: null,
          showFeedback: false,
          timeLeft: difficultySettings[prev.difficulty].timeLimit
        }));
      }
    }, 2000);
  };

  const usePowerup = (type: keyof GameState['powerups']) => {
    if (!state.powerups[type]) return;

    setState(prev => ({
      ...prev,
      powerups: {
        ...prev.powerups,
        [type]: false
      }
    }));

    switch (type) {
      case 'fiftyFifty':
        break;
      case 'timeFreeze':
        setState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft + 15
        }));
        break;
      case 'doublePoints':
        setState(prev => ({
          ...prev,
          multiplier: prev.multiplier * 2
        }));
        break;
    }
  };

  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex items-center justify-center w-24 h-24 mb-8 rounded-full bg-blue-500/20">
        <Brain className="w-12 h-12 text-blue-500" />
      </div>
      
      <h1 className="mb-4 text-4xl font-bold">Crypto Trivia</h1>
      <p className="max-w-md mb-8 text-center text-white/60">
        Test your cryptocurrency knowledge and earn tokens!
      </p>

      <div className="flex flex-col w-64 gap-4">
        <button
          onClick={() => setState(prev => ({ ...prev, screen: 'difficulty' }))}
          className="w-full py-3 font-medium transition-colors bg-blue-500 hover:bg-blue-600 rounded-xl"
        >
          Play Now
        </button>
        
        <div className="text-center">
          <div className="text-sm text-white/60">Your Tokens</div>
          <div className="text-2xl font-bold">{state.totalTokens}</div>
        </div>

        <div className="text-center">
          <div className="text-sm text-white/60">Best Streak</div>
          <div className="text-xl font-bold text-yellow-400">{state.bestStreak} 🔥</div>
        </div>

        <div className="text-sm text-center text-white/60">
          Questions per game:
          <div className="flex justify-between mt-1 text-white/80">
            <span>Easy: {QUESTIONS_PER_GAME.Easy}</span>
            <span>Medium: {QUESTIONS_PER_GAME.Medium}</span>
            <span>Hard: {QUESTIONS_PER_GAME.Hard}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDifficultySelect = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="mb-12 text-3xl font-bold">Select Difficulty</h2>
      
      <div className="grid grid-cols-3 gap-6 mb-12">
        {(['Easy', 'Medium', 'Hard'] as const).map((difficulty) => {
          const settings = difficultySettings[difficulty];
          return (
            <button
              key={difficulty}
              onClick={() => startGame(difficulty)}
              className="w-48 p-6 transition-all bg-white/5 hover:bg-white/10 rounded-xl hover:scale-105"
            >
              <h3 className="mb-2 text-xl font-bold">{difficulty}</h3>
              <div className="space-y-2 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{settings.timeLimit}s per question</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span>{settings.lives} lives</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>{settings.tokenBase} tokens per correct</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>{settings.multiplier}x multiplier</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => setState(prev => ({ ...prev, screen: 'menu' }))}
        className="transition-colors text-white/60 hover:text-white"
      >
        Back to Menu
      </button>
    </div>
  );

  const renderGame = () => {
    const question = gameQuestions[state.currentQuestion];
    const timeLeftPercentage = (state.timeLeft / difficultySettings[state.difficulty].timeLimit) * 100;

    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="fixed flex items-center gap-6 -translate-x-1/2 top-4 left-1/2">
          <div className="flex items-center gap-3">
            <Timer className="w-5 h-5 text-white/60" />
            <div className="w-64 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full transition-all duration-1000 ${
                  timeLeftPercentage > 66 ? 'bg-green-500' :
                  timeLeftPercentage > 33 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${timeLeftPercentage}%` }}
              />
            </div>
            <span className={`text-lg font-medium ${
              timeLeftPercentage > 66 ? 'text-green-400' :
              timeLeftPercentage > 33 ? 'text-yellow-400' :
              'text-red-400'
            }`}>{state.timeLeft}s</span>
          </div>

          <div className="flex items-center gap-2">
            {[...Array(state.lives)].map((_, i) => (
              <Heart key={i} className="w-5 h-5 text-red-400" fill="currentColor" />
            ))}
          </div>

          {state.streak > 0 && (
            <div className="flex items-center gap-2 text-yellow-400">
              <Zap className="w-5 h-5" fill="currentColor" />
              <span className="font-bold">{state.streak}x</span>
            </div>
          )}
        </div>

        <div className="fixed flex items-center gap-2 top-4 right-4">
          <button
            onClick={() => usePowerup('fiftyFifty')}
            disabled={!state.powerups.fiftyFifty}
            className={`p-2 rounded-lg transition-colors ${
              state.powerups.fiftyFifty ? 'bg-blue-500 hover:bg-blue-600' : 'bg-white/10 cursor-not-allowed'
            }`}
            title="50/50: Remove two wrong answers"
          >
            <div className="text-xs font-bold">50:50</div>
          </button>
          <button
            onClick={() => usePowerup('timeFreeze')}
            disabled={!state.powerups.timeFreeze}
            className={`p-2 rounded-lg transition-colors ${
              state.powerups.timeFreeze ? 'bg-blue-500 hover:bg-blue-600' : 'bg-white/10 cursor-not-allowed'
            }`}
            title="Time Freeze: Add 15 seconds"
          >
            <Clock className="w-4 h-4" />
          </button>
          <button
            onClick={() => usePowerup('doublePoints')}
            disabled={!state.powerups.doublePoints}
            className={`p-2 rounded-lg transition-colors ${
              state.powerups.doublePoints ? 'bg-blue-500 hover:bg-blue-600' : 'bg-white/10 cursor-not-allowed'
            }`}
            title="Double Points: 2x multiplier"
          >
            <Zap className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-12">
          <span className="text-white/60">Question</span>
          <span className="font-bold">{state.currentQuestion + 1}</span>
          <span className="text-white/60">of</span>
          <span className="font-bold">{QUESTIONS_PER_GAME[state.difficulty]}</span>
        </div>

        <div className="max-w-2xl mb-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className={`px-2 py-1 rounded-full text-sm ${
              question.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
              question.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {question.difficulty}
            </span>
            <span className="px-2 py-1 text-sm text-blue-400 rounded-full bg-blue-500/20">
              {question.category}
            </span>
          </div>
          <h3 className="mb-2 text-2xl font-bold">{question.question}</h3>
          {state.showFeedback && (
            <p className="p-4 mt-4 rounded-lg text-white/60 bg-white/5">{question.explanation}</p>
          )}
        </div>

        <div className="grid w-full max-w-2xl grid-cols-2 gap-4">
          {question.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={state.showFeedback}
              className={`p-4 rounded-xl transition-all ${
                state.showFeedback
                  ? index === question.correctAnswer
                    ? 'bg-green-500/20 text-green-400'
                    : state.selectedAnswer === index
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-white/5 opacity-50'
                  : 'bg-white/5 hover:bg-white/10 hover:scale-[1.02]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{answer}</span>
                {state.showFeedback && (
                  index === question.correctAnswer ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : state.selectedAnswer === index ? (
                    <XIcon className="w-5 h-5 text-red-400" />
                  ) : null
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const correctAnswers = state.answers.filter(a => a).length;
    const totalQuestions = QUESTIONS_PER_GAME[state.difficulty];
    const percentage = (correctAnswers / totalQuestions) * 100;
    const tokens = Math.round(correctAnswers * difficultySettings[state.difficulty].tokenBase * state.multiplier);
    const newHighScore = Math.max(state.highScore, correctAnswers);
    const isNewHighScore = newHighScore > state.highScore;

    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex items-center justify-center w-24 h-24 mb-8 rounded-full bg-blue-500/20">
          <Trophy className="w-12 h-12 text-blue-500" />
        </div>

        <h2 className="mb-2 text-3xl font-bold">Quiz Complete!</h2>
        <p className="mb-8 text-white/60">Great job! Here's how you did:</p>

        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold">{percentage.toFixed(0)}%</div>
            <div className="text-sm text-white/60">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-yellow-400">
              {tokens}
              {isNewHighScore && <span className="ml-2 text-sm">🏆</span>}
            </div>
            <div className="text-sm text-white/60">Tokens Earned</div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setState(prev => ({ ...prev, screen: 'menu' }))}
            className="px-6 py-3 transition-colors bg-white/10 hover:bg-white/20 rounded-xl"
          >
            Back to Menu
          </button>
          <button
            onClick={() => setState(prev => ({ ...prev, screen: 'difficulty' }))}
            className="px-6 py-3 transition-colors bg-blue-500 hover:bg-blue-600 rounded-xl"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full">
      {state.screen === 'menu' && renderMenu()}
      {state.screen === 'difficulty' && renderDifficultySelect()}
      {state.screen === 'game' && renderGame()}
      {state.screen === 'results' && renderResults()}
    </div>
  );
};