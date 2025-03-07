import React, { useState, useEffect, useContext } from 'react';
import { Trophy, Swords, Brain, Coins, ArrowRight, Search } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useUserData } from '../../providers/UserProvider';

import { GameService } from '../../services/game.services';
export const GameStats: React.FC = () => {
  const [claimingTokens, setClaimingTokens] = useState(false);
  const { gameStats, updateGameStats, setAllGameStats } = useStore();
  const { userData } = useUserData();
  const [isLoading, setIsLoading] = useState(false);
  const canClaim = gameStats.totalTokens >= 5000;

  const handleClaimTokens = () => {
    if (!canClaim) return;
    
    setClaimingTokens(true);
    setTimeout(() => {
      setClaimingTokens(false);
    }, 2000);
  };

  useEffect(() => {
    const loadTokens = async () => {
      setIsLoading(true);
      try {
        if(userData && userData.accessToken){
          const statsData = await GameService.fetchUserStatistics(userData.accessToken);
          if (Array.isArray(statsData)) {
            const triviaGame = statsData.find(game => game.gameType === 'TRIVIA');
            const arenaGame = statsData.find(game => game.gameType === 'ARENA');
            const huntGame = statsData.find(game => game.gameType === 'WORDHUNT');
            
            let totalTokens = 0;
            statsData.forEach(game => {
              if (game && 'tokensEarned' in game && typeof game.tokensEarned === 'number') {
                totalTokens += game.tokensEarned;
              }
            });
            
            
            updateGameStats({
              triviaStats: {
                gamesPlayed: triviaGame?.totalPlayed || 0,
                tokensEarned: triviaGame?.tokensEarned || 0,
                highScore: triviaGame?.highScore || 0,
                accuracy: triviaGame?.accuracy || 0,
                bestStreak: triviaGame?.bestStreak || 0
              },
              arenaStats: {
                battlesPlayed: arenaGame?.totalPlayed || 0,
                tokensEarned: arenaGame?.tokensEarned || 0,
                wins: arenaGame?.wins || 0,
                winRate: arenaGame?.winRate || 0,
                bestStreak: arenaGame?.bestStreak || 0
              },
              huntStats:{
                gamesPlayed: huntGame?.totalPlayed || 0,
                tokensEarned: huntGame?.tokensEarned || 0,
                words: huntGame?.words || 0,
                bestScore: huntGame?.bestScore || 0,
                perfectStatus: huntGame?.perfectStatus || 0
              },
              totalTokens: totalTokens
            });
          } else {
            try {
              const tokens = await GameService.fetchTotalUserTokens(userData.accessToken);
              setAllGameStats(tokens);
            } catch (error) {
              console.error("Error fetching tokens:", error);
              setAllGameStats(0);
            }
          }
        } else {
          setAllGameStats(0);
        }
      } catch (error) {
        console.error('Error loading tokens:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTokens();
  }, [setAllGameStats, userData]);

  return (
    <div className="p-3 sm:p-6 h-full overflow-y-auto">
      {/* Total Tokens */}
      <div className="bg-white/5 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Total Tokens</h3>
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span className="text-2xl sm:text-3xl font-bold">
                {typeof gameStats.totalTokens === 'number'
                  ? gameStats.totalTokens
                  : typeof gameStats.totalTokens === 'object' && gameStats.totalTokens && 'totalTokens' in gameStats.totalTokens
                    ? gameStats.totalTokens
                    : 0}
              </span>
            </div>
          </div>
          <button
            onClick={handleClaimTokens}
            disabled={!canClaim || claimingTokens}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
              canClaim
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-white/10 cursor-not-allowed'
            }`}
          >
            <span>Claim Tokens</span>
            {canClaim && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
        {!canClaim && (
          <p className="text-xs sm:text-sm text-white/60 mt-3 sm:mt-4">
            Earn {5000 - gameStats.totalTokens || 0} more tokens to claim rewards
          </p>
        )}
      </div>

      {/* Game Stats Grid - Changed from 3 columns to 1 on mobile, 3 on larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {/* Trivia Stats */}
        <div className="bg-white/5 rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold">Crypto Trivia</h3>
              <p className="text-xs sm:text-sm text-white/60">Knowledge Challenge</p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-white/60">Games Played</span>
              <span className="font-medium">{gameStats?.triviaStats?.gamesPlayed || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-white/60">Tokens Earned</span>
              <span className="font-medium">{gameStats?.triviaStats?.tokensEarned || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-white/60">High Score</span>
              <span className="font-medium">{gameStats?.triviaStats?.highScore || 0}/10</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-white/60">Accuracy</span>
              <span className="font-medium">{gameStats?.triviaStats?.accuracy || 0}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-white/60">Best Streak</span>
              <span className="font-medium">{gameStats?.triviaStats?.bestStreak || 0}</span>
            </div>
          </div>
        </div>

        {/* Arena Stats */}
        <div className="bg-white/5 rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Swords className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold">Meme Arena</h3>
              <p className="text-xs sm:text-sm text-white/60">Battle Stats</p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-white/60">Battles Played</span>
              <span className="font-medium">{gameStats?.arenaStats?.battlesPlayed || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-white/60">Tokens Earned</span>
              <span className="font-medium">{gameStats?.arenaStats?.tokensEarned || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-white/60">Wins</span>
              <span className="font-medium">{gameStats?.arenaStats?.wins || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-white/60">Win Rate</span>
              <span className="font-medium">{gameStats?.arenaStats?.winRate || 0}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-white/60">Best Streak</span>
              <span className="font-medium">{gameStats?.arenaStats?.bestStreak || 0}</span>
            </div>
          </div>
        </div>

        {/* Word Hunt Stats */}
        <div className="bg-white/5 rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold">Word Hunt</h3>
              <p className="text-xs sm:text-sm text-white/60">Word Search Stats</p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-white/60">Games Played</span>
              <span className="font-medium">{gameStats?.huntStats?.gamesPlayed || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-white/60">Tokens Earned</span>
              <span className="font-medium">{gameStats?.huntStats?.tokensEarned || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-white/60">Words Found</span>
              <span className="font-medium">{gameStats?.huntStats?.words || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-white/60">Best Score</span>
              <span className="font-medium">{gameStats?.huntStats?.bestScore || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-white/60">Perfect Games</span>
              <span className="font-medium">{gameStats?.huntStats?.perfectStatus || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white/5 rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold">Achievements</h3>
            <p className="text-xs sm:text-sm text-white/60">Your Gaming Milestones</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 sm:p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              <div>
                <div className="text-sm sm:text-base font-medium">Trivia Master</div>
                <div className="text-xs sm:text-sm text-white/60">Score 10/10 in Trivia</div>
              </div>
            </div>
            <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${((gameStats?.triviaStats?.highScore || 0) / 10) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3 sm:p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3">
              <Swords className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <div>
                <div className="text-sm sm:text-base font-medium">Arena Champion</div>
                <div className="text-xs sm:text-sm text-white/60">Win 10 battles</div>
              </div>
            </div>
            <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all"
                style={{ width: `${((gameStats?.arenaStats?.wins || 0) / 10) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3 sm:p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              <div>
                <div className="text-sm sm:text-base font-medium">Word Hunter</div>
                <div className="text-xs sm:text-sm text-white/60">Find 100 words</div>
              </div>
            </div>
            <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${((gameStats?.huntStats?.words || 0)/10)*100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};