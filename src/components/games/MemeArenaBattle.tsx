import React, { useEffect, useState, useContext, useRef } from 'react';
import { Swords, Shield, Zap, X, Info, Star, Flame, Droplet, Wind } from 'lucide-react';
import { GameState, Action, StatusEffect } from '../../types/memeArena';
import { MemeArenaTutorial } from './MemeArenaTutorial';
import { Web3AuthContext } from '../../providers/Web3AuthContext.tsx';
import { GameSession } from '../GamesModal';
import {saveGameHistory, fetchGameId} from "./api/useGame-api.ts"


interface BattleArenaProps {
  state: GameState;
  onAction: (action: Action) => void;
  onNewGame: () => void;
  gameType?: string;
}

const BattleArena: React.FC<BattleArenaProps> = ({
  state,
  onAction,
  onNewGame,
  gameType = 'ARENA'
}) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const { userData } = useContext(Web3AuthContext);
  const gameSessionSaved = useRef(false);
  const [gameData, setGameData] = useState<any[]>([]);
  const [gameId, setGameId] = useState<string>("");

  // Auto-scroll battle logs
  useEffect(() => {
    const element = document.getElementById('battle-logs');
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [state.battleLogs]);

  useEffect(() => {
    if (!state.isGameOver) {
      gameSessionSaved.current = false;
    }
  }, [state.isGameOver]);
  useEffect(() => {
    const loadGameData = async () => {
      if (userData && userData.accessToken) {
        try {
          const data = await fetchGameId(userData.accessToken);
          
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

  // Save game session when game is over
  useEffect(() => {
    if (state.isGameOver && !gameSessionSaved.current && 
        userData&&gameId) {
      
      const isVictory = state.aiHP <= 0;
      const baseReward = 100;
      const comboBonus = state.battleStats.maxCombo * 20;
      const criticalBonus = state.battleStats.criticalHits * 15;
      const perfectBonus = state.battleStats.perfectBlocks * 10;
      const totalReward = baseReward + comboBonus + criticalBonus + perfectBonus;
      
      const gameSession: GameSession = {
        gameId: gameId,
        tokensEarned: isVictory ? totalReward : 0,
        score: state.battleStats.totalDamageDealt,
        accuracy: 0, 
        streak: state.battleStats.maxCombo,
        winStatus: isVictory,
      };
      
      saveGameSession(gameSession);
      gameSessionSaved.current = true;
    }
  }, [state.isGameOver, state.aiHP, userData, gameId, state.battleStats]);

  const saveGameSession = async (gameSession: GameSession) => {

    try{
      if(gameSession && userData &&userData.accessToken){
        const response = await saveGameHistory(userData.accessToken, gameSession);
        console.log("Game session save response",response)
      }
    } catch (error) {
      console.error('Error saving game session:', error);
    }
  };

  const {
    playerCharacter,
    aiCharacter,
    playerHP,
    playerMP,
    aiHP,
    aiMP,
    turn,
    battleLogs = [],
    tokens = 0,
    isGameOver = false,
    combo = 0,
    playerStatusEffects = [],
    aiStatusEffects = [],
    battleStats = {
      totalDamageDealt: 0,
      criticalHits: 0,
      maxCombo: 0,
      specialsUsed: 0,
      perfectBlocks: 0,
      statusEffectsApplied: 0
    }
  } = state;

  // Early return if characters aren't loaded
  if (!playerCharacter || !aiCharacter) {
    return null;
  }

  const renderStatusEffects = (effects: StatusEffect[]) => (
    <div className="flex -space-x-2">
      {effects.map((effect, index) => (
        <div
          key={index}
          className={`w-6 h-6 rounded-full flex items-center justify-center relative ${
            effect.type.includes('BUFF') ? 'bg-blue-500/20' :
            effect.type === 'BURN' ? 'bg-red-500/20' :
            effect.type === 'POISON' ? 'bg-green-500/20' :
            'bg-yellow-500/20'
          }`}
          title={`${effect.name} (${effect.duration} turns)\n${effect.description}`}
        >
          {effect.type === 'BURN' && <Flame className="w-3 h-3 text-red-400" />}
          {effect.type === 'POISON' && <Droplet className="w-3 h-3 text-green-400" />}
          {effect.type === 'STUN' && <Star className="w-3 h-3 text-yellow-400" />}
          {effect.type.includes('BUFF') && <Wind className="w-3 h-3 text-blue-400" />}
          <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-black/60 flex items-center justify-center text-[8px] font-bold">
            {effect.duration}
          </div>
        </div>
      ))}
    </div>
  );

  const renderHealthBar = (current: number, max: number, color: string) => (
    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-300`}
        style={{ width: `${(current / max) * 100}%` }}
      />
    </div>
  );

  const renderManaBar = (current: number, max: number) => (
    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full transition-all duration-300 bg-blue-500"
        style={{ width: `${(current / max) * 100}%` }}
      />
    </div>
  );

  // Game Over Popup
  const renderGameOverPopup = () => {
    const isVictory = aiHP <= 0;
    const color = isVictory ? 'bg-green-500' : 'bg-red-500';
    const baseReward = 100;
    const comboBonus = battleStats.maxCombo * 20;
    const criticalBonus = battleStats.criticalHits * 15;
    const perfectBonus = battleStats.perfectBlocks * 10;
    const totalReward = baseReward + comboBonus + criticalBonus + perfectBonus;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative glass border border-white/10 rounded-xl p-6 w-full max-w-md mx-4 text-center">
          <div className={`w-16 h-16 mx-auto rounded-full ${color}/20 flex items-center justify-center mb-4`}>
            <div className={`text-3xl ${color}`}>
              {isVictory ? '🏆' : '💀'}
            </div>
          </div>
          <h2 className="mb-4 text-xl font-bold">
            {isVictory ? 'Victory!' : 'Defeat!'}
          </h2>

          {isVictory && (
            <div className="mb-6 space-y-3 text-left">
              <div className="p-3 rounded-lg bg-white/5">
                <h3 className="mb-2 text-sm font-medium">Battle Statistics</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-white/60">Total Damage:</span>
                    <span className="float-right">{battleStats.totalDamageDealt}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Critical Hits:</span>
                    <span className="float-right text-yellow-400">{battleStats.criticalHits}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Max Combo:</span>
                    <span className="float-right text-blue-400">{battleStats.maxCombo}x</span>
                  </div>
                  <div>
                    <span className="text-white/60">Perfect Blocks:</span>
                    <span className="float-right text-green-400">{battleStats.perfectBlocks}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/5">
                <h3 className="mb-2 text-sm font-medium">Rewards</h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/60">Base Reward:</span>
                    <span>{baseReward} tokens</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Combo Bonus:</span>
                    <span className="text-blue-400">+{comboBonus} tokens</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Critical Bonus:</span>
                    <span className="text-yellow-400">+{criticalBonus} tokens</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Perfect Block Bonus:</span>
                    <span className="text-green-400">+{perfectBonus} tokens</span>
                  </div>
                  <div className="h-px my-2 bg-white/10" />
                  <div className="flex justify-between font-medium">
                    <span>Total Reward:</span>
                    <span>{totalReward} tokens</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={onNewGame}
            className="px-4 py-2 text-sm font-medium transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            {isVictory ? 'Next Battle' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header with controls - Improved positioning and spacing */}
      <div className="flex items-center justify-end mb-4 px-2 py-2 bg-black/20 rounded-lg">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTutorial(true)}
            className="p-2 transition-colors rounded-full bg-gray-800/50 hover:bg-gray-700/70"
            title="How to Play"
          >
            <Info className="w-4 h-4" />
          </button>
          <button
            onClick={onNewGame}
            className="p-2 transition-colors rounded-full bg-gray-800/50 hover:bg-gray-700/70"
            title="Exit Battle"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tutorial Modal */}
      <MemeArenaTutorial 
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
      />

      {/* Battle Arena */}
      <div className="flex-1 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* Player Character */}
          <div className="text-center">
            <div className="relative mb-3">
              <img
                src={playerCharacter.image}
                alt={playerCharacter.name}
                className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full ${
                  turn === 'player' ? 'ring-2 ring-blue-500 animate-pulse' : ''
                }`}
              />
              {playerStatusEffects.length > 0 && (
                <div className="absolute -translate-x-1/2 -bottom-2 left-1/2">
                  {renderStatusEffects(playerStatusEffects)}
                </div>
              )}
            </div>
            <h3 className="mb-2 text-lg font-bold">{playerCharacter.name}</h3>
            <div className="space-y-1.5">
              <div>
                <div className="flex justify-between mb-1 text-xs">
                  <span>HP</span>
                  <span>{playerHP}/100</span>
                </div>
                {renderHealthBar(playerHP, 100, 'bg-green-500')}
              </div>
              <div>
                <div className="flex justify-between mb-1 text-xs">
                  <span>MP</span>
                  <span>{playerMP}/100</span>
                </div>
                {renderManaBar(playerMP, 100)}
              </div>
            </div>
          </div>

          {/* AI Character */}
          <div className="text-center">
            <div className="relative mb-3">
              <img
                src={aiCharacter.image}
                alt={aiCharacter.name}
                className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full ${
                  turn === 'ai' ? 'ring-2 ring-red-500 animate-pulse' : ''
                }`}
              />
              {aiStatusEffects.length > 0 && (
                <div className="absolute -translate-x-1/2 -bottom-2 left-1/2">
                  {renderStatusEffects(aiStatusEffects)}
                </div>
              )}
            </div>
            <h3 className="mb-2 text-lg font-bold">{aiCharacter.name}</h3>
            <div className="space-y-1.5">
              <div>
                <div className="flex justify-between mb-1 text-xs">
                  <span>HP</span>
                  <span>{aiHP}/100</span>
                </div>
                {renderHealthBar(aiHP, 100, 'bg-red-500')}
              </div>
              <div>
                <div className="flex justify-between mb-1 text-xs">
                  <span>MP</span>
                  <span>{aiMP}/100</span>
                </div>
                {renderManaBar(aiMP, 100)}
              </div>
            </div>
          </div>
        </div>

        {/* Turn Indicator */}
        <div className="flex justify-center mb-4">
          <div className={`px-4 py-1.5 rounded-full text-sm font-medium ${
            turn === 'player' ? 'bg-blue-500' : 'bg-red-500'
          }`}>
            {turn === 'player' ? 'Your Turn' : 'Opponent\'s Turn'}
          </div>
        </div>

        {/* Battle Stats */}
        <div className="flex justify-center gap-4 mb-4 text-xs">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
            <span>Combo: {combo}x</span>
          </div>
          <div className="flex items-center gap-1">
            <Swords className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
            <span>Damage: {battleStats.totalDamageDealt}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
            <span>Crits: {battleStats.criticalHits}</span>
          </div>
        </div>

        {/* Battle Log */}
        <div 
          id="battle-logs"
          className="h-20 sm:h-24 p-3 mb-4 overflow-y-auto text-xs rounded-lg bg-black/30"
        >
          {battleLogs.map((log, index) => (
            <div
              key={index}
              className={`mb-1 ${
                log.type === 'PLAYER_ATTACK' ? 'text-blue-400' :
                log.type === 'AI_ATTACK' ? 'text-red-400' :
                log.type === 'SPECIAL_ABILITY' ? 'text-purple-400' :
                log.type === 'CRITICAL' ? 'text-yellow-400' :
                log.type === 'COMBO' ? 'text-orange-400' :
                log.type === 'STATUS_EFFECT' ? 'text-green-400' :
                log.type === 'GAME_OVER' ? 'text-yellow-400' :
                'text-white/60'
              } ${log.highlight ? 'font-bold' : ''}`}
            >
              {log.text}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons - Improved for mobile */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="space-y-2 sm:space-y-3">
          <button
            onClick={() => onAction({ type: 'QUICK_ATTACK' })}
            disabled={turn !== 'player'}
            className="flex items-center justify-center w-full gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Swords className="w-3 h-3 sm:w-4 sm:h-4" />
            Quick Attack
          </button>
          <button
            onClick={() => onAction({ type: 'HEAVY_ATTACK' })}
            disabled={turn !== 'player'}
            className="flex items-center justify-center w-full gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors bg-purple-500 rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Swords className="w-3 h-3 sm:w-4 sm:h-4" />
            Heavy Attack
          </button>
        </div>
        <div className="space-y-2 sm:space-y-3">
          <button
            onClick={() => onAction({ type: 'SPECIAL_ATTACK' })}
            disabled={turn !== 'player' || playerMP < 40}
            className="relative flex items-center justify-center w-full gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors bg-yellow-500 rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Special</span>
            <span className="text-xs">(40)</span>
            
            {playerCharacter.specialAbility && (
              <div className="absolute z-10 invisible w-40 sm:w-48 p-2 mb-2 text-left -translate-x-1/2 rounded-lg bottom-full left-1/2 bg-black/90 group-hover:visible">
                <div className="mb-1 text-xs font-medium">{playerCharacter.specialAbility.name}</div>
                <div className="text-[10px] text-white/80">{playerCharacter.specialAbility.description}</div>
                {playerCharacter.specialAbility.statusEffect && (
                  <div className="text-[10px] text-white/80 mt-1">
                    Applies {playerCharacter.specialAbility.statusEffect.name}
                  </div>
                )}
              </div>
            )}
          </button>
          <button
            onClick={() => onAction({ type: 'DEFEND' })}
            disabled={turn !== 'player'}
            className="flex items-center justify-center w-full gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
            Defend
          </button>
        </div>
      </div>

      {/* Token Counter */}
      <div className="mt-3 text-xs text-center text-white/70">
        Tokens: {tokens}
      </div>

      {/* Game Over Popup */}
      {isGameOver && renderGameOverPopup()}
    </div>
  );
};

export default BattleArena;