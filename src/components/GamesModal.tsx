import React, { useState } from 'react';
import { 
  X, Maximize2, Minimize2, Brain, Trophy, Gift, 
  Swords, Target, Star, BarChart2, Users, Award,
  Gamepad2, Clock, Coins, ArrowLeft, Lock, BarChart,
  Grid
} from 'lucide-react';
import { CryptoTrivia } from './games/CryptoTrivia';
import { MemeArena } from './games/MemeArena';
import { CryptoPexeso } from './games/CryptoPexeso';
import { GameStats } from './games/GameStats';
import { useStore } from '../store/useStore';

interface GamesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Game {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  component?: React.FC;
  comingSoon?: boolean;
}

const games: Game[] = [
  {
    id: 'crypto-trivia',
    name: 'Crypto Trivia',
    description: 'Test your crypto knowledge and earn tokens',
    icon: <Brain className="w-6 h-6" />,
    component: CryptoTrivia
  },
  {
    id: 'meme-arena',
    name: 'Meme Arena',
    description: 'Battle with legendary meme characters',
    icon: <Swords className="w-6 h-6" />,
    component: MemeArena
  },
  {
    id: 'crypto-pexeso',
    name: 'Crypto Pexeso',
    description: 'Match crypto pairs in this memory game',
    icon: <Grid className="w-6 h-6" />,
    component: CryptoPexeso
  },
  {
    id: 'trading-simulator',
    name: 'Trading Simulator',
    description: 'Practice trading with virtual assets',
    icon: <BarChart2 className="w-6 h-6" />,
    comingSoon: true
  },
  {
    id: 'prediction-game',
    name: 'Price Prediction',
    description: 'Predict price movements and win rewards',
    icon: <Target className="w-6 h-6" />,
    comingSoon: true
  },
  {
    id: 'tournament',
    name: 'Tournament',
    description: 'Compete in trading competitions',
    icon: <Trophy className="w-6 h-6" />,
    comingSoon: true
  }
];

export const GamesModal: React.FC<GamesModalProps> = ({ isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [showStats, setShowStats] = useState(false);
  const { gameStats } = useStore();

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative glass border border-white/10 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          isFullscreen
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
                <span>{gameStats.totalTokens}</span>
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
            <activeGame.component />
          ) : (
            <div className="p-3 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {games.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => !game.comingSoon && setActiveGame(game)}
                    disabled={game.comingSoon}
                    className={`flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl transition-all ${
                      game.comingSoon
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
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};