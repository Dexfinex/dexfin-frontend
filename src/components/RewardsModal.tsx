import React, { useState } from 'react';
import {
  Trophy, X, Maximize2, Minimize2, Star, Clock,
  Award, Target, Gift, ChevronRight, TrendingUp,
  Lock, CheckCircle2, Info
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Line } from 'react-chartjs-2';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RewardsModal: React.FC<RewardsModalProps> = ({ isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'progress' | 'badges' | 'challenges' | 'perks'>('status');
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  const { rewards } = useStore();

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze': return 'text-amber-700';
      case 'Silver': return 'text-gray-400';
      case 'Gold': return 'text-yellow-400';
      case 'Platinum': return 'text-blue-400';
      case 'Diamond': return 'text-purple-400';
      default: return 'text-white';
    }
  };

  const weeklyXPChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'XP Earned',
        data: rewards.weeklyXP,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)'
        }
      }
    }
  };

  const renderStatus = () => (
    <div className="space-y-6">
      {/* Current Tier */}
      <div className="bg-white/5 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-700 to-amber-500 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{rewards.currentTier} Tier</h3>
              <p className="text-white/60">Level {Math.floor(rewards.xp / 10000)}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-medium">{rewards.xp.toLocaleString()} XP</div>
            <div className="text-sm text-white/60">
              {rewards.xpToNextLevel.toLocaleString()} XP to next level
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Progress to Next Level</span>
            <span>{Math.round((rewards.xp % 10000) / 100)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${(rewards.xp % 10000) / 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Active Perks */}
      <div className="bg-white/5 rounded-xl p-6">
        <h3 className="text-lg font-medium mb-4">Active Perks</h3>
        <div className="space-y-3">
          {rewards.perks.filter(perk => perk.isActive).map(perk => (
            <div key={perk.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Gift className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="font-medium">{perk.name}</div>
                <div className="text-sm text-white/60">{perk.description}</div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-400 ml-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Next XP Update */}
      <div className="bg-white/5 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-5 h-5 text-white/60" />
          <h3 className="text-lg font-medium">Next XP Update</h3>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-2xl font-bold">19</div>
              <div className="text-sm text-white/60">Hours</div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-2xl font-bold">45</div>
              <div className="text-sm text-white/60">Minutes</div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-2xl font-bold">30</div>
              <div className="text-sm text-white/60">Seconds</div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-2xl font-bold">+150</div>
              <div className="text-sm text-white/60">XP</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-6">
      {/* Weekly XP Chart */}
      <div className="bg-white/5 rounded-xl p-6">
        <h3 className="text-lg font-medium mb-4">Weekly XP Progress</h3>
        <div className="h-[300px]">
          <Line data={weeklyXPChartData} options={chartOptions} />
        </div>
      </div>

      {/* Tier Progress */}
      <div className="bg-white/5 rounded-xl p-6">
        <h3 className="text-lg font-medium mb-4">Tier Progress</h3>
        <div className="space-y-4">
          {['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'].map((tier, index) => {
            const isCurrentTier = tier === rewards.currentTier;
            const isPastTier = index < ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'].indexOf(rewards.currentTier);

            return (
              <div key={tier} className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isCurrentTier ? 'bg-blue-500' :
                    isPastTier ? 'bg-green-500/20' : 'bg-white/10'
                  }`}>
                  <Trophy className={`w-6 h-6 ${isCurrentTier ? 'text-white' :
                      isPastTier ? 'text-green-400' : 'text-white/40'
                    }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${getTierColor(tier)}`}>{tier}</span>
                    {isCurrentTier && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${isPastTier ? 'bg-green-500' :
                            isCurrentTier ? 'bg-blue-500' : 'bg-white/20'
                          }`}
                        style={{
                          width: isPastTier ? '100%' :
                            isCurrentTier ? `${(rewards.xp % 10000) / 100}%` : '0%'
                        }}
                      />
                    </div>
                    <span className="text-sm text-white/60">
                      {isPastTier ? '10,000' :
                        isCurrentTier ? `${rewards.xp % 10000}/10,000` : '0/10,000'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderBadges = () => (
    <div className="space-y-6">
      {selectedBadge ? (
        <div className="bg-white/5 rounded-xl p-6">
          <button
            onClick={() => setSelectedBadge(null)}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-6"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>Back to Badges</span>
          </button>

          {(() => {
            const badge = rewards.badges.find(b => b.id === selectedBadge);
            if (!badge) return null;

            return (
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 relative">
                  {badge.isFlashBadge && (
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-xl" />
                  )}
                  <img
                    src={badge.image}
                    alt={badge.name}
                    className="w-full h-full relative"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2">{badge.name}</h3>
                <p className="text-white/60 mb-6">{badge.description}</p>
                {badge.earnedDate ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Earned on {badge.earnedDate}</span>
                  </div>
                ) : badge.isFlashBadge ? (
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/20 text-yellow-400">
                      <Clock className="w-4 h-4" />
                      <span>Limited Time Badge</span>
                    </div>
                    <div className="flex items-center gap-4 justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold">21</div>
                        <div className="text-sm text-white/60">Hours</div>
                      </div>
                      <div className="text-2xl">:</div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">45</div>
                        <div className="text-sm text-white/60">Minutes</div>
                      </div>
                      <div className="text-2xl">:</div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">30</div>
                        <div className="text-sm text-white/60">Seconds</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/60">
                    <Lock className="w-4 h-4" />
                    <span>Not Yet Earned</span>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      ) : (
        <>
          {/* Flash Badges */}
          <div className="bg-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Flash Badges</h3>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-white/60" />
                <span className="text-white/60">Limited time only!</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {rewards.badges.filter(badge => badge.isFlashBadge).map(badge => (
                <button
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge.id)}
                  className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-center group relative"
                >
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-xl blur-lg" />
                  <div className="relative">
                    <img
                      src={badge.image}
                      alt={badge.name}
                      className="w-16 h-16 mx-auto mb-2"
                    />
                    <div className="font-medium mb-1">{badge.name}</div>
                    <div className="text-sm text-white/60 truncate">
                      {badge.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* All Badges */}
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-lg font-medium mb-4">All Badges</h3>
            <div className="grid grid-cols-4 gap-4">
              {rewards.badges.filter(badge => !badge.isFlashBadge).map(badge => (
                <button
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge.id)}
                  className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-center group"
                >
                  <img
                    src={badge.image}
                    alt={badge.name}
                    className={`w-16 h-16 mx-auto mb-2 ${!badge.earnedDate && 'opacity-50 grayscale'}`}
                  />
                  <div className="font-medium mb-1">{badge.name}</div>
                  <div className="text-sm text-white/60 truncate">
                    {badge.description}
                  </div>
                  {badge.earnedDate ? (
                    <div className="mt-2 text-xs text-green-400">
                      Earned {badge.earnedDate}
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-white/40">
                      Not earned yet
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderChallenges = () => (
    <div className="space-y-6">
      {rewards.activeChallenges.map(challenge => (
        <div key={challenge.id} className="bg-white/5 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium">{challenge.title}</h3>
                <p className="text-sm text-white/60">{challenge.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-blue-400">+{challenge.xpReward} XP</div>
              <div className="text-sm text-white/60">
                Ends in {challenge.endsIn}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Progress</span>
              <span>{challenge.progress}/{challenge.total}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPerks = () => (
    <div className="space-y-6">
      {['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'].map((tier) => {
        const tierPerks = rewards.perks.filter(perk => perk.tier === tier);
        const isCurrent = rewards.currentTier === tier;
        const isUnlocked = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'].indexOf(rewards.currentTier) >=
          ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'].indexOf(tier);

        return (
          <div key={tier} className="bg-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Trophy className={`w-5 h-5 ${getTierColor(tier)}`} />
                <h3 className="font-medium">{tier} Tier</h3>
                {isCurrent && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs">
                    Current
                  </span>
                )}
              </div>
              {!isUnlocked && (
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Lock className="w-4 h-4" />
                  <span>Locked</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {tierPerks.map(perk => (
                <div
                  key={perk.id}
                  className={`flex items-center gap-3 p-3 rounded-lg ${isUnlocked ? 'bg-white/10' : 'bg-white/5'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isUnlocked ? 'bg-blue-500/20' : 'bg-white/10'
                    }`}>
                    <Gift className={`w-5 h-5 ${isUnlocked ? 'text-blue-400' : 'text-white/40'
                      }`} />
                  </div>
                  <div>
                    <div className={`font-medium ${!isUnlocked && 'text-white/40'}`}>
                      {perk.name}
                    </div>
                    <div className={`text-sm ${isUnlocked ? 'text-white/60' : 'text-white/40'
                      }`}>
                      {perk.description}
                    </div>
                  </div>
                  {perk.isActive && (
                    <CheckCircle2 className="w-5 h-5 text-green-400 ml-auto" />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

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
        {/* Glass Effect Overlay - Coming Soon Message */}
        <div className='absolute top-0 right-0 bottom-0 left-0 inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-10 rounded-xl'>
          <button className="py-1.5 px-3 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg font-medium text-sm">
            Coming Soon
          </button>
          {/* Close button - positioned absolutely in the top-right corner for better visibility */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-white/20 rounded-lg transition-colors z-20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Rewards</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFullscreen}
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

          {/* Navigation */}
          <div className="flex items-center gap-2 p-4 border-b border-white/10">
            <button
              onClick={() => setActiveTab('status')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'status' ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
            >
              <Star className="w-4 h-4" />
              <span>Status</span>
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'progress' ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Progress</span>
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'badges' ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
            >
              <Award className="w-4 h-4" />
              <span>Badges</span>
            </button>
            <button
              onClick={() => setActiveTab('challenges')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'challenges' ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
            >
              <Target className="w-4 h-4" />
              <span>Challenges</span>
            </button>
            <button
              onClick={() => setActiveTab('perks')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'perks' ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
            >
              <Gift className="w-4 h-4" />
              <span>Perks</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'status' && renderStatus()}
            {activeTab === 'progress' && renderProgress()}
            {activeTab === 'badges' && renderBadges()}
            {activeTab === 'challenges' && renderChallenges()}
            {activeTab === 'perks' && renderPerks()}
          </div>
        </div>
      </div>
    </div>
  );
};