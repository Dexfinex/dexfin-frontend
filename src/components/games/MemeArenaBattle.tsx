import React from 'react';
import {Info, Shield, Swords, Zap} from 'lucide-react';
import {Action, GameState} from '../../types/memeArena';

interface BattleArenaProps {
  state: GameState;
  onAction: (action: Action) => void;
  onNewGame: () => void;
}

export const BattleArena: React.FC<BattleArenaProps> = ({
  state,
  onAction,
  onNewGame
}) => {
  const renderHealthBar = (current: number, max: number, color: string) => (
    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-300`}
        style={{ width: `${(current / max) * 100}%` }}
      />
    </div>
  );

  const renderManaBar = (current: number, max: number) => (
    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-500 transition-all duration-300"
        style={{ width: `${(current / max) * 100}%` }}
      />
    </div>
  );

  // Game Over Popup
  const renderGameOverPopup = () => {
    const isVictory = state.aiHP <= 0;
    const color = isVictory ? 'bg-green-500' : 'bg-red-500';
    const message = isVictory 
      ? `Victory! You earned ${state.tokens} tokens!`
      : 'Defeat! Better luck next time!';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative glass border border-white/10 rounded-xl p-8 w-[400px] text-center">
          <div className={`w-20 h-20 mx-auto rounded-full ${color}/20 flex items-center justify-center mb-4`}>
            <div className={`text-4xl ${color}`}>
              {isVictory ? '🏆' : '💀'}
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {isVictory ? 'Victory!' : 'Defeat!'}
          </h2>
          <p className="text-white/60 mb-6">{message}</p>
          <button
            onClick={onNewGame}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors font-medium"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  };

  // HP/MP Info Tooltip
  const renderStatsInfo = () => (
    <div className="absolute top-4 right-4 group">
      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
        <Info className="w-4 h-4" />
      </button>
      <div className="absolute right-0 mt-2 w-64 p-4 glass border border-white/10 rounded-lg invisible group-hover:visible">
        <h4 className="font-medium mb-2">Battle Stats</h4>
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="font-medium">HP (Health Points)</span>
            </div>
            <p className="text-sm text-white/60">Your character's life force. Reaches 0 and you lose!</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="font-medium">MP (Mana Points)</span>
            </div>
            <p className="text-sm text-white/60">Magic energy for special attacks. Recovers when defending.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Battle Arena */}
      <div className="flex-1 mb-6">
        <div className="grid grid-cols-2 gap-12 mb-8">
          {/* Player Character */}
          <div className="text-center">
            <div className="relative mb-4">
              <img
                src={state.playerCharacter?.image}
                alt={state.playerCharacter?.name}
                className="w-32 h-32 mx-auto rounded-full"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-500 text-sm font-medium">
                Lv. 1
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">{state.playerCharacter?.name}</h3>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>HP</span>
                  <span>{state.playerHP}/100</span>
                </div>
                {renderHealthBar(state.playerHP, 100, 'bg-green-500')}
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>MP</span>
                  <span>{state.playerMP}/100</span>
                </div>
                {renderManaBar(state.playerMP, 100)}
              </div>
            </div>
          </div>

          {/* AI Character */}
          <div className="text-center">
            <div className="relative mb-4">
              <img
                src={state.aiCharacter?.image}
                alt={state.aiCharacter?.name}
                className="w-32 h-32 mx-auto rounded-full"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-red-500 text-sm font-medium">
                Lv. 1
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">{state.aiCharacter?.name}</h3>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>HP</span>
                  <span>{state.aiHP}/100</span>
                </div>
                {renderHealthBar(state.aiHP, 100, 'bg-red-500')}
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>MP</span>
                  <span>{state.aiMP}/100</span>
                </div>
                {renderManaBar(state.aiMP, 100)}
              </div>
            </div>
          </div>
        </div>

        {/* Turn Indicator */}
        <div className="flex justify-center mb-8">
          <div className={`px-6 py-2 rounded-full text-lg font-medium ${
            state.turn === 'player' ? 'bg-blue-500' : 'bg-red-500'
          }`}>
            {state.turn === 'player' ? 'Your Turn' : 'Opponent\'s Turn'}
          </div>
        </div>

        {/* Battle Log */}
        <div className="bg-white/5 rounded-xl p-4 h-32 overflow-y-auto mb-6">
          {state.battleLogs.map((log, index) => (
            <div
              key={index}
              className={`mb-1 ${
                log.type === 'PLAYER_ATTACK' ? 'text-blue-400' :
                log.type === 'AI_ATTACK' ? 'text-red-400' :
                log.type === 'GAME_OVER' ? 'text-yellow-400' :
                'text-white/60'
              }`}
            >
              {log.text}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <button
            onClick={() => onAction({ type: 'QUICK_ATTACK' })}
            disabled={state.turn !== 'player'}
            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Swords className="w-5 h-5" />
            Quick Attack
          </button>
          <button
            onClick={() => onAction({ type: 'HEAVY_ATTACK' })}
            disabled={state.turn !== 'player'}
            className="w-full py-3 px-4 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Swords className="w-5 h-5" />
            Heavy Attack
          </button>
        </div>
        <div className="space-y-4">
          <button
            onClick={() => onAction({ type: 'SPECIAL_ATTACK' })}
            disabled={state.turn !== 'player' || state.playerMP < 40}
            className="w-full py-3 px-4 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            Special Attack (40 MP)
          </button>
          <button
            onClick={() => onAction({ type: 'DEFEND' })}
            disabled={state.turn !== 'player'}
            className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 disabled:opacity-50 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Shield className="w-5 h-5" />
            Defend
          </button>
        </div>
      </div>

      {/* Token Counter */}
      <div className="mt-4 text-center text-white/60">
        Tokens: {state.tokens}
      </div>

      {/* Stats Info */}
      {renderStatsInfo()}

      {/* Game Over Popup */}
      {state.isGameOver && renderGameOverPopup()}
    </div>
  );
};