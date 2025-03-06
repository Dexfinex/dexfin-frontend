import React, { useState, useEffect, useContext, useRef } from 'react';
import { Timer, Trophy, RotateCcw, Gamepad2 } from 'lucide-react';
import { useBreakpointValue } from '@chakra-ui/react';
import { Web3AuthContext } from '../../providers/Web3AuthContext.tsx';
import { GameSession } from '../GamesModal';
import { GameService } from '../../services/game.services.ts';

interface CryptoPexesoProps {
  gameType?: string;
}

interface Card {
  id: number;
  token: string;
  symbol: string;
  logo: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const tokens = [
  { token: 'Bitcoin', symbol: 'BTC', logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
  { token: 'Ethereum', symbol: 'ETH', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { token: 'Solana', symbol: 'SOL', logo: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
  { token: 'Cardano', symbol: 'ADA', logo: 'https://cryptologos.cc/logos/cardano-ada-logo.png' },
  { token: 'Polkadot', symbol: 'DOT', logo: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png' },
  { token: 'Chainlink', symbol: 'LINK', logo: 'https://cryptologos.cc/logos/chainlink-link-logo.png' }
];

const createBoard = (): Card[] => {
  const pairs = [...tokens, ...tokens].map((token, index) => ({
    id: index,
    token: token.token,
    symbol: token.symbol,
    logo: token.logo,
    isFlipped: false,
    isMatched: false
  }));
  return shuffleArray(pairs);
};

const shuffleArray = <T extends unknown>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const CryptoPexeso: React.FC<CryptoPexesoProps> = ({ gameType = 'PEXESO' }) => {
  const [cards, setCards] = useState<Card[]>(createBoard());
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [bestMoves, setBestMoves] = useState<number | null>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const isMobile = useBreakpointValue({base: true, md: false});
  
  const { userData } = useContext(Web3AuthContext);
  const gameSessionSaved = useRef(false);
  const [gameData, setGameData] = useState<any[]>([]);
  const [gameId, setGameId] = useState<string>("");


  useEffect(() => {
    const loadGameData = async () => {
      if (userData && userData.accessToken) {
        try {
          const data = await GameService.fetchUserGameId(userData.accessToken);
          
          if (Array.isArray(data)) {
            setGameData(data);
            
            const game = data.find(g => g.type === gameType);
            if (game) {
              setGameId(game.id);
            } else {
              console.warn(`No game found with type ${gameType}`);
            }
          }
        } catch (error) {
          console.error("Error loading game data:", error);
        }
      }
    };
    
    loadGameData();
  }, [userData, gameType]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0 && !isGameOver) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, timeLeft, isGameOver]);

  useEffect(() => {
    if (matches === tokens.length) {
      setIsGameOver(true);
      if (bestTime === null || timeLeft > bestTime) {
        setBestTime(timeLeft);
      }
      if (bestMoves === null || moves < bestMoves) {
        setBestMoves(moves);
      }
    }
  }, [matches, timeLeft, moves, bestTime, bestMoves]);

  useEffect(() => {
    if (!isGameOver) {
      gameSessionSaved.current = false;
    }
  }, [isGameOver]);

  useEffect(() => {
    if (isGameOver && !gameSessionSaved.current && 
        userData && userData.accessToken && gameId) {
      
      const isVictory = matches === tokens.length;
      const accuracy = timeLeft > 0 ? (matches / tokens.length) * 100 : 0;
      
      const baseReward = isVictory ? 100 : 0;
      const timeBonus = isVictory ? timeLeft * 2 : 0; 
      const streakBonus = bestStreak * 5; 
      const totalReward = baseReward + timeBonus + streakBonus;
      
      const gameSession: GameSession = {
        gameId: gameId,
        tokensEarned: totalReward,
        score: matches,
        accuracy: accuracy,
        streak: bestStreak,
        winStatus: isVictory,
      };
      
      saveGameSession(gameSession);
      gameSessionSaved.current = true;
    }
  }, [isGameOver, matches, timeLeft, bestStreak, userData, gameId]);

  const saveGameSession = async (gameSession: GameSession) => {
    try {
      if (gameSession && userData && userData.accessToken) {
        const response = await GameService.gameHistory(userData.accessToken, gameSession);
        console.log(response);
      }
    } catch (error) {
      console.error('Error saving game session:', error);
    }
  };

  const handleCardClick = (index: number) => {
    if (!gameStarted) {
      setGameStarted(true);
    }

    if (
      isGameOver ||
      flippedIndexes.length === 2 ||
      flippedIndexes.includes(index) ||
      cards[index].isMatched
    ) {
      return;
    }

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    if (flippedIndexes.length === 0) {
      setFlippedIndexes([index]);
    } else {
      setFlippedIndexes([flippedIndexes[0], index]);
      setMoves(prev => prev + 1);

      const firstCard = cards[flippedIndexes[0]];
      const secondCard = cards[index];

      if (firstCard.token === secondCard.token) {
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[flippedIndexes[0]].isMatched = true;
          matchedCards[index].isMatched = true;
          setCards(matchedCards);
          setFlippedIndexes([]);
          setMatches(prev => prev + 1);
          setCurrentStreak(prev => {
            const newStreak = prev + 1;
            setBestStreak(current => Math.max(current, newStreak));
            return newStreak;
          });
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[flippedIndexes[0]].isFlipped = false;
          resetCards[index].isFlipped = false;
          setCards(resetCards);
          setFlippedIndexes([]);
          setCurrentStreak(0);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setCards(createBoard());
    setFlippedIndexes([]);
    setMoves(0);
    setMatches(0);
    setTimeLeft(60);
    setIsGameOver(false);
    setGameStarted(false);
    setCurrentStreak(0);
    gameSessionSaved.current = false;
  };

  const renderCard = (card: Card, index: number) => (
    <button
      key={card.id}
      onClick={() => handleCardClick(index)}
      className={`aspect-square rounded-xl transition-all duration-500 transform ${
        card.isFlipped || card.isMatched
          ? 'rotate-y-180'
          : 'bg-gradient-to-br from-teal-500/20 to-emerald-500/20 hover:from-teal-500/30 hover:to-emerald-500/30 hover:scale-105'
      }`}
      disabled={isGameOver}
    >
      <div className={`w-full h-full rounded-xl transition-all duration-500 ${
        card.isFlipped || card.isMatched ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      }`}>
        <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-xl border border-white/10 backdrop-blur-sm">
          <div className="relative w-8 h-8 mb-1 md:w-12 md:h-12 md:mb-2">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-full blur-xl" />
            <img
              src={card.logo}
              alt={card.token}
              className="relative w-full h-full object-contain"
            />
          </div>
          <div className="text-xs md:text-sm font-medium bg-gradient-to-br from-teal-400 to-emerald-400 bg-clip-text text-transparent">
            {card.token}
          </div>
          <div className="text-xs text-white/60">{card.symbol}</div>
        </div>
      </div>
    </button>
  );

  const renderGameOver = () => {
    const isVictory = matches === tokens.length;
    const accuracy = timeLeft > 0 ? (matches / tokens.length) * 100 : 0;
    const baseReward = isVictory ? 100 : 0;
    const timeBonus = isVictory ? timeLeft * 2 : 0;
    const streakBonus = bestStreak * 5;
    const totalReward = baseReward + timeBonus + streakBonus;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative glass border border-white/10 rounded-xl p-4 md:p-8 w-full max-w-xs md:max-w-md lg:max-w-lg text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20 flex items-center justify-center mb-4 md:mb-6">
            <Trophy className="w-8 h-8 md:w-10 md:h-10 text-emerald-400" />
          </div>
          
          <h2 className="text-xl md:text-2xl font-bold mb-2">
            {isVictory ? 'Congratulations!' : 'Time\'s Up!'}
          </h2>
          
          <p className="text-white/60 mb-4 md:mb-6 text-sm md:text-base">
            {isVictory
              ? 'You matched all pairs!'
              : `You matched ${matches} out of ${tokens.length} pairs`}
          </p>

          <div className="grid grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-8">
            <div className="p-2 md:p-4 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-lg backdrop-blur-sm border border-white/10">
              <div className="text-xl md:text-2xl font-bold">{moves}</div>
              <div className="text-xs md:text-sm text-white/60">Moves</div>
            </div>
            <div className="p-2 md:p-4 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-lg backdrop-blur-sm border border-white/10">
              <div className="text-xl md:text-2xl font-bold">{60 - timeLeft}s</div>
              <div className="text-xs md:text-sm text-white/60">Time</div>
            </div>
          </div>

          {isVictory && (
            <div className="mb-4 md:mb-8 p-3 md:p-4 border border-white/10 rounded-lg bg-gradient-to-br from-teal-500/10 to-emerald-500/10">
              <h3 className="text-base md:text-lg font-medium mb-2 md:mb-4">Rewards</h3>
              <div className="space-y-1 md:space-y-1.5 text-xs md:text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Base Reward:</span>
                  <span>{baseReward} tokens</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Time Bonus:</span>
                  <span className="text-teal-400">+{timeBonus} tokens</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Streak Bonus:</span>
                  <span className="text-emerald-400">+{streakBonus} tokens</span>
                </div>
                <div className="h-px my-1 md:my-2 bg-white/10" />
                <div className="flex justify-between font-medium">
                  <span>Total Reward:</span>
                  <span>{totalReward} tokens</span>
                </div>
              </div>
            </div>
          )}

          {(bestTime !== null || bestMoves !== null || bestStreak > 0) && (
            <div className="mb-4 md:mb-8">
              <h3 className="text-base md:text-lg font-medium mb-2 md:mb-4">Best Scores</h3>
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                {bestTime !== null && (
                  <div className="p-2 md:p-3 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-lg backdrop-blur-sm border border-white/10">
                    <div className="text-lg md:text-xl font-bold text-emerald-400">{bestTime}s</div>
                    <div className="text-xs md:text-sm text-white/60">Best Time</div>
                  </div>
                )}
                {bestMoves !== null && (
                  <div className="p-2 md:p-3 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-lg backdrop-blur-sm border border-white/10">
                    <div className="text-lg md:text-xl font-bold text-emerald-400">{bestMoves}</div>
                    <div className="text-xs md:text-sm text-white/60">Best Moves</div>
                  </div>
                )}
                {bestStreak > 0 && (
                  <div className="p-2 md:p-3 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-lg backdrop-blur-sm border border-white/10">
                    <div className="text-lg md:text-xl font-bold text-emerald-400">{bestStreak}x</div>
                    <div className="text-xs md:text-sm text-white/60">Best Streak</div>
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            onClick={resetGame}
            className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 rounded-lg transition-colors font-medium text-sm md:text-base"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Game Header */}
      <div className={`flex items-center ${isMobile ? 'justify-between mb-4' : 'justify-between mb-8'} px-2 md:px-6 pt-2 md:pt-6`}>
        <div className={`flex items-center ${isMobile ? 'gap-2 md:gap-4' : 'gap-4 md:gap-8'}`}>
          <div className="flex items-center gap-1 md:gap-2">
            <Timer className="w-4 h-4 md:w-5 md:h-5 text-teal-400" />
            <span className={`${isMobile ? 'text-lg' : 'text-xl md:text-2xl'} font-bold`}>{timeLeft}s</span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <Trophy className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
            <span className={`${isMobile ? 'text-lg' : 'text-xl md:text-2xl'} font-bold`}>{matches}</span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <Gamepad2 className="w-4 h-4 md:w-5 md:h-5 text-teal-400" />
            <span className={`${isMobile ? 'text-lg' : 'text-xl md:text-2xl'} font-bold`}>{moves}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentStreak > 0 && (
            <div className="px-2 py-0.5 md:px-3 md:py-1 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-full">
              <span className={`${isMobile ? 'text-sm' : 'text-base md:text-lg'} font-bold text-emerald-400`}>{currentStreak}x</span>
            </div>
          )}
          <button
            onClick={resetGame}
            className="p-1 md:p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      <div className="flex-grow px-2 md:px-6 pb-2 md:pb-6 flex items-center justify-center">
        <div className="grid grid-cols-4 gap-2 md:gap-4 w-full max-w-2xl mx-auto">
          {cards.map((card, index) => renderCard(card, index))}
        </div>
      </div>

      {isGameOver && renderGameOver()}
    </div>
  );
};