import React, { useState, useContext, useEffect } from 'react';
import {
  X, Maximize2, Minimize2, Brain, Trophy, Gift,
  Swords, Target, Star, BarChart2, Users, Award,
  Gamepad2, Clock, Coins, ArrowLeft, Lock, BarChart, Search,
  Grid
} from 'lucide-react';
import { CryptoTrivia } from './games/CryptoTrivia';
import { MemeArena } from './games/MemeArena';
import { CryptoPexeso } from './games/CryptoPexeso';
import CryptoWordHunt from './games/CryptoWordHunt';
import { GameStats } from './games/GameStats';
import { useStore } from '../store/useStore';
import { Web3AuthContext } from '../providers/Web3AuthContext';
import { GameService } from "../services/game.services"
interface GamesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Game {
  type: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  component?: React.ComponentType<{ gameType?: string }>;
  comingSoon?: boolean;
  createdAt?: string;
}
interface MemeArenaProps {
  gameType?: string;
}

interface CryptoPexesoProps {
  gameType?: string;
}
interface CryptoWordHuntProps {
  gameType?: string;
}
// Mapping for game icons based on type
const gameIconMap: Record<string, React.ReactNode> = {
  'TRIVIA': <Brain className="w-6 h-6" />,
  'ARENA': <Swords className="w-6 h-6" />,
  'PEXESO': <Grid className="w-6 h-6" />,
  'WORDHUNT': <Search className="w-6 h-6" />,
  'SIMULATOR': <BarChart2 className="w-6 h-6" />,
  'PREDICTION': <Target className="w-6 h-6" />,
  'TOURNAMENT': <Trophy className="w-6 h-6" />
};


const gameComponentMap: Record<string, React.ComponentType<{ gameType?: string }>> = {
  'TRIVIA': CryptoTrivia,
  'ARENA': MemeArena,
  'PEXESO': CryptoPexeso,
  'WORDHUNT': CryptoWordHunt
};

export interface GameSession {
  id?: string;
  userName?: string;
  gameId: string;
  tokensEarned: number;
  score: number;
  accuracy?: number;
  winStatus?: boolean;
  streak: number;
  words?:number;
  perfectStatus?:boolean;

}

export const GamesModal: React.FC<GamesModalProps> = ({ isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gamesLoading, setGamesLoading] = useState(true);

  const { gameStats, setAllGameStats } = useStore();
  const { userData } = useContext(Web3AuthContext);
  const [games, setGames] = useState<Game[]>([]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const loadGamesAndTokens = async () => {
      if (!isOpen) {
        return;
      }

      setIsLoading(true);
      setGamesLoading(true);

      try {
          const gameData= await GameService.fetchAllGame();

          if (Array.isArray(gameData)) {
            const transformedGames = gameData.map((dbGame: any) => {
              const hasComponent = ['TRIVIA', 'ARENA', 'WORDHUNT', 'PEXESO'].includes(dbGame.type);

              return {
                type: dbGame.type.toLowerCase(),
                name: dbGame.name,
                description: dbGame.description,
                icon: gameIconMap[dbGame.type] || <Gamepad2 className="w-6 h-6" />,
                component: hasComponent ? gameComponentMap[dbGame.type] : undefined,
                comingSoon: !hasComponent,
                createdAt: dbGame.createdAt
              };
            });

            setGames(transformedGames);
          }
          console.log(userData);

          if (userData&&userData.accessToken) {
          const totalTokens = await GameService.fetchTotalUserTokens(userData.accessToken);
          let tokenValue = 0;
          if (totalTokens !== null && typeof totalTokens === 'object' && 'totalTokens' in totalTokens) {

            tokenValue = totalTokens.totalTokens;
          } else if (typeof totalTokens === 'number') {
            tokenValue = totalTokens;
          }
          console.log("Final token value to set:", tokenValue);
          setAllGameStats(tokenValue);
        }
          else {
          setAllGameStats(0);
        }
      } catch (error) {
        console.error('Error loading games and tokens:', error);
        setAllGameStats(0);
      } finally {
        setIsLoading(false);
        setGamesLoading(false);
      }
    };

    loadGamesAndTokens();
  }, [isOpen, setAllGameStats,userData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative glass border border-white/10 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${isFullscreen
            ? 'w-full h-full rounded-none'
            : 'w-[90%] h-[90%] rounded-xl'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/10">
          <div className="flex items-center gap-2 sm:gap-4">
            {activeGame && (
              <button
                onClick={() => {
                  setActiveGame(null);
                  setShowStats(false);
                }}
                className="p-1.5 sm:p-2 transition-colors rounded-lg hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="text-lg sm:text-xl font-semibold">Games</h2>
            <button
              onClick={() => {
                setShowStats(!showStats);
                setActiveGame(null);
              }}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm sm:text-base ml-1 sm:ml-2"
            >
              <BarChart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Statistics</span>
              <div className="flex items-center gap-1 ml-1 sm:ml-2 text-xs sm:text-sm text-yellow-400">
                <Coins className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                {isLoading ? (
                  <span className="w-6 h-3 bg-gray-600/50 animate-pulse rounded"></span>
                ) : (
                  <span>
                    {typeof gameStats.totalTokens === 'number'
                      ? gameStats.totalTokens
                      : typeof gameStats.totalTokens === 'object' && gameStats.totalTokens && 'totalTokens' in gameStats.totalTokens
                        ? gameStats.totalTokens
                        : 0}
                  </span>
                )}
              </div>
            </button>
          </div>

          <div className="flex items-center">
            <button
              onClick={toggleFullscreen}
              className="p-1.5 sm:p-2 transition-colors rounded-lg hover:bg-white/10"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 transition-colors rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-85px)] sm:h-[calc(100%-73px)] overflow-auto">
          {showStats ? (
            <GameStats />
          ) : activeGame?.component ? (
            <activeGame.component gameType={activeGame.type.toUpperCase()} />
          ) : (
            <div className="p-3 sm:p-6">
              {gamesLoading ? (
                // Loading state for games
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                  {[1, 2, 3, 4, 5, 6].map((placeholder) => (
                    <div
                      key={placeholder}
                      className="flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl bg-white/5 animate-pulse"
                    >
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-blue-500/20"></div>
                      <div className="w-full">
                        <div className="h-5 bg-white/10 rounded w-1/2 mx-auto"></div>
                        <div className="mt-2 h-3 bg-white/10 rounded w-3/4 mx-auto"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Loaded games
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                  {games.length > 0 ? (
                    games.map((game) => (
                      <button
                        key={game.type}
                        onClick={() => !game.comingSoon && setActiveGame(game)}
                        disabled={game.comingSoon}
                        className={`flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl transition-all ${game.comingSoon
                            ? 'bg-white/5 cursor-not-allowed'
                            : 'bg-white/5 hover:bg-white/10 hover:scale-[1.02]'
                          }`}
                      >
                        <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 text-blue-500 rounded-xl sm:rounded-2xl bg-blue-500/20">
                          {game.icon}
                        </div>
                        <div className="text-center w-full">
                          <div className="flex items-center justify-center gap-1 sm:gap-2">
                            <h3 className="text-base sm:text-lg font-medium">{game.name}</h3>
                            {game.comingSoon && (
                              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/40" />
                            )}
                          </div>
                          <p className="mt-1 text-xs sm:text-sm text-white/60 line-clamp-2">{game.description}</p>
                          {game.comingSoon && (
                            <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 mt-2 text-xs font-medium rounded-full bg-white/10">
                              Coming Soon
                            </span>
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-10">
                      <p className="text-lg text-white/60">No games available. Please try again later.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};