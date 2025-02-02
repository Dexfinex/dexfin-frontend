import React, { useState } from 'react';
import { Trophy, Swords, Brain, Coins, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const GameStats: React.FC = () => {
  const [claimingTokens, setClaimingTokens] = useState(false);
  const { gameStats } = useStore();
  const canClaim = gameStats.totalTokens >= 5000;

  const handleClaimTokens = () => {
    if (!canClaim) return;
    
    setClaimingTokens(true);
    // Simulate token claiming process
    setTimeout(() => {
      // Here you would handle the actual token claiming logic
      setClaimingTokens(false);
    }, 2000);
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* Total Tokens */}
      <div className="bg-white/5 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Total Tokens</h3>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-3xl font-bold">{gameStats.totalTokens}</span>
            </div>
          </div>
          <button
            onClick={handleClaimTokens}
            disabled={!canClaim || claimingTokens}
            className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
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
          <p className="text-sm text-white/60 mt-4">
            Earn {5000 - gameStats.totalTokens} more tokens to claim rewards
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Trivia Stats */}
        <div className="bg-white/5 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Crypto Trivia</h3>
              <p className="text-white/60">Knowledge Challenge</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/60">Games Played</span>
              <span className="font-medium">{gameStats.triviaStats.gamesPlayed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Tokens Earned</span>
              <span className="font-medium">{gameStats.triviaStats.tokensEarned}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">High Score</span>
              <span className="font-medium">{gameStats.triviaStats.highScore}/10</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Accuracy</span>
              <span className="font-medium">{gameStats.triviaStats.accuracy}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Best Streak</span>
              <span className="font-medium">{gameStats.triviaStats.bestStreak}</span>
            </div>
          </div>
        </div>

        {/* Arena Stats */}
        <div className="bg-white/5 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Swords className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Meme Arena</h3>
              <p className="text-white/60">Battle Stats</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/60">Battles Played</span>
              <span className="font-medium">{gameStats.arenaStats.battlesPlayed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Tokens Earned</span>
              <span className="font-medium">{gameStats.arenaStats.tokensEarned}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Wins</span>
              <span className="font-medium">{gameStats.arenaStats.wins}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Win Rate</span>
              <span className="font-medium">{gameStats.arenaStats.winRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Best Streak</span>
              <span className="font-medium">{gameStats.arenaStats.bestStreak}</span>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="col-span-2 bg-white/5 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Achievements</h3>
              <p className="text-white/60">Your Gaming Milestones</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="font-medium">Trivia Master</div>
                  <div className="text-sm text-white/60">Score 10/10 in Trivia</div>
                </div>
              </div>
              <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${(gameStats.triviaStats.highScore / 10) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <Swords className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="font-medium">Arena Champion</div>
                  <div className="text-sm text-white/60">Win 10 battles</div>
                </div>
              </div>
              <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all"
                  style={{ width: `${(gameStats.arenaStats.wins / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};