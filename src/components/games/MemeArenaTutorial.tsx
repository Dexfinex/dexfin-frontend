import React from 'react';
import { X, Swords, Shield, Zap, Heart, Star, Flame, Droplet, Wind } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemeArenaTutorial: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass border border-white/10 rounded-xl p-6 w-[800px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">How to Play Meme Arena</h2>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-8">
          {/* Game Overview */}
          <section>
            <h3 className="mb-3 text-lg font-medium">Game Overview</h3>
            <p className="mb-4 text-white/80">
              Meme Arena is a turn-based battle game where you fight against AI opponents using
              legendary meme characters. Each character has unique stats and special abilities.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/5">
                <h4 className="mb-2 font-medium">Game Modes</h4>
                <ul className="space-y-2 text-sm text-white/60">
                  <li>• Single Battle: Fight one opponent</li>
                  <li>• Tournament Mode: Face increasingly difficult opponents</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <h4 className="mb-2 font-medium">Victory Conditions</h4>
                <ul className="space-y-2 text-sm text-white/60">
                  <li>• Reduce opponent's HP to 0</li>
                  <li>• Earn tokens based on performance</li>
                  <li>• Build combos for bonus rewards</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Character Stats */}
          <section>
            <h3 className="mb-3 text-lg font-medium">Character Stats</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Swords className="w-4 h-4 text-red-400" />
                  <h4 className="font-medium">Attack</h4>
                </div>
                <p className="text-sm text-white/60">
                  Determines base damage output. Higher attack means stronger hits.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <h4 className="font-medium">Defense</h4>
                </div>
                <p className="text-sm text-white/60">
                  Reduces incoming damage. Also affects perfect block chance.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="w-4 h-4 text-green-400" />
                  <h4 className="font-medium">Speed</h4>
                </div>
                <p className="text-sm text-white/60">
                  Affects critical hit chance and combat initiative.
                </p>
              </div>
            </div>
          </section>

          {/* Combat Actions */}
          <section>
            <h3 className="mb-3 text-lg font-medium">Combat Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Swords className="w-4 h-4 text-blue-400" />
                    <h4 className="font-medium">Quick Attack</h4>
                  </div>
                  <p className="text-sm text-white/60">
                    Fast attack with moderate damage. Good for building combos.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Swords className="w-4 h-4 text-purple-400" />
                    <h4 className="font-medium">Heavy Attack</h4>
                  </div>
                  <p className="text-sm text-white/60">
                    Slower but more powerful attack. Higher base damage.
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <h4 className="font-medium">Special Attack</h4>
                  </div>
                  <p className="text-sm text-white/60">
                    Unique character ability that costs MP. Can apply status effects.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <h4 className="font-medium">Defend</h4>
                  </div>
                  <p className="text-sm text-white/60">
                    Reduces incoming damage and recovers MP. Chance for perfect block.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Status Effects */}
          <section>
            <h3 className="mb-3 text-lg font-medium">Status Effects</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-4 h-4 text-red-400" />
                    <h4 className="font-medium">Burn</h4>
                  </div>
                  <p className="text-sm text-white/60">
                    Deals damage over time each turn.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplet className="w-4 h-4 text-green-400" />
                    <h4 className="font-medium">Poison</h4>
                  </div>
                  <p className="text-sm text-white/60">
                    Applies continuous damage each turn.
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <h4 className="font-medium">Stun</h4>
                  </div>
                  <p className="text-sm text-white/60">
                    Target skips their next turn.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Wind className="w-4 h-4 text-blue-400" />
                    <h4 className="font-medium">Buffs</h4>
                  </div>
                  <p className="text-sm text-white/60">
                    Temporary stat boosts to attack, defense, or speed.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Advanced Mechanics */}
          <section>
            <h3 className="mb-3 text-lg font-medium">Advanced Mechanics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/5">
                <h4 className="mb-2 font-medium">Combo System</h4>
                <ul className="space-y-2 text-sm text-white/60">
                  <li>• Chain same attack types for combos</li>
                  <li>• Each combo level increases damage</li>
                  <li>• Max combo of 5x multiplier</li>
                  <li>• Combo breaks on different action</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <h4 className="mb-2 font-medium">Perfect Blocks</h4>
                <ul className="space-y-2 text-sm text-white/60">
                  <li>• Chance based on defense stat</li>
                  <li>• Reduces damage by 75%</li>
                  <li>• Can trigger counter-attack</li>
                  <li>• Earns bonus tokens</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Rewards System */}
          <section>
            <h3 className="mb-3 text-lg font-medium">Rewards System</h3>
            <div className="p-4 rounded-lg bg-white/5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="mb-2 font-medium">Base Rewards</h4>
                  <ul className="space-y-1 text-white/60">
                    <li>• Victory: 100 tokens</li>
                    <li>• Per Combo: +20 tokens</li>
                    <li>• Per Critical: +15 tokens</li>
                    <li>• Perfect Block: +10 tokens</li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 font-medium">Tournament Bonuses</h4>
                  <ul className="space-y-1 text-white/60">
                    <li>• Win Streak Bonus</li>
                    <li>• Champion Title Reward</li>
                    <li>• Perfect Run Bonus</li>
                    <li>• Speed Clear Bonus</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Tips & Strategies */}
          <section>
            <h3 className="mb-3 text-lg font-medium">Tips & Strategies</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/5">
                <h4 className="mb-2 font-medium">Offensive Strategy</h4>
                <ul className="space-y-2 text-sm text-white/60">
                  <li>• Build combos with quick attacks</li>
                  <li>• Save MP for key moments</li>
                  <li>• Time special abilities with buffs</li>
                  <li>• Focus on critical hit chances</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <h4 className="mb-2 font-medium">Defensive Strategy</h4>
                <ul className="space-y-2 text-sm text-white/60">
                  <li>• Defend when low on HP</li>
                  <li>• Watch for enemy patterns</li>
                  <li>• Counter status effects</li>
                  <li>• Manage MP efficiently</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};