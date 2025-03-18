import React, {useState} from 'react';
import {Action, BattleLog, Character, GameState} from '../../types/memeArena.type';
import {CharacterSelect} from './MemeArenaCharacterSelect';
import BattleArena from './MemeArenaBattle';
import {characters, tournamentOpponents} from "../../constants/game.constants.ts";

interface MemeArenaProps {
  gameType?: string;
}

export const MemeArena: React.FC<MemeArenaProps> = () => {
  const [state, setState] = useState<GameState>({
    screen: 'character-select',
    playerCharacter: null,
    aiCharacter: null,
    playerHP: 100,
    playerMP: 100,
    aiHP: 100,
    aiMP: 100,
    turn: 'player',
    battleLogs: [],
    tokens: 0,
    isGameOver: false,
    combo: 0,
    lastAction: null,
    criticalHit: false,
    playerStatusEffects: [],
    aiStatusEffects: [],
    battleStats: {
      totalDamageDealt: 0,
      criticalHits: 0,
      maxCombo: 0,
      specialsUsed: 0,
      perfectBlocks: 0,
      statusEffectsApplied: 0
    },
    tournamentMode: false,
    tournamentRound: 0,
    tournamentWins: 0
  });

  const selectCharacter = (character: Character) => {
    // Randomly select AI character (different from player's choice)
    const availableOpponents = state.tournamentMode 
      ? [tournamentOpponents[state.tournamentRound]]
      : characters.filter(c => c.id !== character.id);
    
    const aiCharacter = availableOpponents[Math.floor(Math.random() * availableOpponents.length)];

    setState(prev => ({
      ...prev,
      screen: 'battle',
      playerCharacter: character,
      aiCharacter,
      battleLogs: [
        { type: 'BATTLE_START', text: `Battle starts between ${character.name} and ${aiCharacter.name}!` }
      ]
    }));
  };

  const calculateDamage = (
    attacker: Character,
    defender: Character,
    attackType: 'quick' | 'heavy' | 'special',
    state: GameState,
    isDefending: boolean = false
  ) => {
    const baseDamage = {
      quick: 10,
      heavy: 20,
      special: attacker.specialAbility.damage
    }[attackType];

    // Apply status effects to stats
    const attackerBuffs = state.playerStatusEffects.filter(e => e.type.includes('BUFF'));
    const defenderBuffs = state.aiStatusEffects.filter(e => e.type.includes('BUFF'));

    let attackMultiplier = attacker.stats.attack / 10;
    let defenseMultiplier = defender.stats.defense / 10;
    let speedBonus = attacker.stats.speed / 20;

    // Apply buffs
    attackerBuffs.forEach(buff => {
      if (buff.type === 'BUFF_ATTACK') attackMultiplier *= buff.value;
      if (buff.type === 'BUFF_SPEED') speedBonus *= buff.value;
    });

    defenderBuffs.forEach(buff => {
      if (buff.type === 'BUFF_DEFENSE') defenseMultiplier *= buff.value;
    });

    // Combo system
    const comboMultiplier = state.combo > 0 ? 1 + (state.combo * 0.1) : 1;

    // Critical hit system (base 10% + speed bonus)
    const criticalChance = 0.1 + (attacker.stats.speed / 100) + (speedBonus / 2);
    const isCritical = Math.random() < criticalChance;
    const criticalMultiplier = isCritical ? 1.5 : 1;

    // Perfect block reduces damage by 75% and has a chance to counter
    const blockMultiplier = isDefending ? 0.25 : 1;
    const isPerfectBlock = isDefending && Math.random() < defender.stats.speed / 100;

    // Random factor for variety (0.9 to 1.1)
    const randomFactor = 0.9 + Math.random() * 0.2;

    const finalDamage = Math.round(
      baseDamage * 
      attackMultiplier * 
      (1 - defenseMultiplier * 0.5) * 
      (1 + speedBonus) * 
      randomFactor * 
      comboMultiplier *
      criticalMultiplier *
      blockMultiplier
    );

    return { 
      damage: finalDamage, 
      isCritical, 
      isPerfectBlock,
      comboMultiplier
    };
  };

  const applyStatusEffects = () => {
    setState(prev => {
      const newState = { ...prev };
      const logs: BattleLog[] = [];

      // Process player status effects
      newState.playerStatusEffects = prev.playerStatusEffects.map(effect => {
        if (effect.type === 'BURN' || effect.type === 'POISON') {
          newState.playerHP = Math.max(0, prev.playerHP - effect.value);
          logs.push({
            type: 'STATUS_EFFECT',
            text: `${prev.playerCharacter?.name} takes ${effect.value} damage from ${effect.name}!`
          });
        }
        return { ...effect, duration: effect.duration - 1 };
      }).filter(effect => effect.duration > 0);

      // Process AI status effects
      newState.aiStatusEffects = prev.aiStatusEffects.map(effect => {
        if (effect.type === 'BURN' || effect.type === 'POISON') {
          newState.aiHP = Math.max(0, prev.aiHP - effect.value);
          logs.push({
            type: 'STATUS_EFFECT',
            text: `${prev.aiCharacter?.name} takes ${effect.value} damage from ${effect.name}!`
          });
        }
        return { ...effect, duration: effect.duration - 1 };
      }).filter(effect => effect.duration > 0);

      // Check for game over from status effects
      if (newState.playerHP <= 0 || newState.aiHP <= 0) {
        newState.isGameOver = true;
      }

      return {
        ...newState,
        battleLogs: [...prev.battleLogs, ...logs]
      };
    });
  };

  const handleAction = (action: Action) => {
    if (state.isGameOver || !state.playerCharacter || !state.aiCharacter) return;

    const newState = { ...state };
    let damage = 0;
    let isCritical = false;
    let comboMultiplier = 1;

    // Player's turn
    if (state.turn === 'player') {
      if (state.lastAction === action.type) {
        newState.combo = Math.min(state.combo + 1, 5);
      } else {
        newState.combo = 0;
      }
      newState.lastAction = action.type;

      switch (action.type) {
        case 'QUICK_ATTACK': {
          const result = calculateDamage(state.playerCharacter, state.aiCharacter, 'quick', newState);
          damage = result.damage;
          isCritical = result.isCritical;
          comboMultiplier = result.comboMultiplier;
          newState.aiHP = Math.max(0, state.aiHP - damage);
          
          // Update battle stats
          newState.battleStats.totalDamageDealt += damage;
          if (isCritical) newState.battleStats.criticalHits++;
          newState.battleStats.maxCombo = Math.max(newState.battleStats.maxCombo, newState.combo);

          newState.battleLogs = [
            ...state.battleLogs,
            { 
              type: 'PLAYER_ATTACK', 
              text: `${state.playerCharacter.name} used Quick Attack and dealt ${damage} damage!`
            }
          ];

          if (isCritical) {
            newState.battleLogs.push({
              type: 'CRITICAL',
              text: 'CRITICAL HIT!',
              highlight: true
            });
          }

          if (newState.combo > 0) {
            newState.battleLogs.push({
              type: 'COMBO',
              text: `${newState.combo}x COMBO! (${Math.round(comboMultiplier * 100)}% damage)`,
              highlight: true
            });
          }
          break;
        }

        case 'HEAVY_ATTACK': {
          const result = calculateDamage(state.playerCharacter, state.aiCharacter, 'heavy', newState);
          damage = result.damage;
          isCritical = result.isCritical;
          comboMultiplier = result.comboMultiplier;
          newState.aiHP = Math.max(0, state.aiHP - damage);
          
          // Update battle stats
          newState.battleStats.totalDamageDealt += damage;
          if (isCritical) newState.battleStats.criticalHits++;
          newState.battleStats.maxCombo = Math.max(newState.battleStats.maxCombo, newState.combo);

          newState.battleLogs = [
            ...state.battleLogs,
            { 
              type: 'PLAYER_ATTACK', 
              text: `${state.playerCharacter.name} used Heavy Attack and dealt ${damage} damage!`
            }
          ];

          if (isCritical) {
            newState.battleLogs.push({
              type: 'CRITICAL',
              text: 'CRITICAL HIT!',
              highlight: true
            });
          }

          if (newState.combo > 0) {
            newState.battleLogs.push({
              type: 'COMBO',
              text: `${newState.combo}x COMBO! (${Math.round(comboMultiplier * 100)}% damage)`,
              highlight: true
            });
          }
          break;
        }

        case 'SPECIAL_ATTACK': {
          if (state.playerMP >= 40) {
            const result = calculateDamage(state.playerCharacter, state.aiCharacter, 'special', newState);
            damage = result.damage;
            isCritical = result.isCritical;
            comboMultiplier = result.comboMultiplier;
            newState.aiHP = Math.max(0, state.aiHP - damage);
            newState.playerMP -= state.playerCharacter.specialAbility.mpCost;
            
            // Update battle stats
            newState.battleStats.totalDamageDealt += damage;
            if (isCritical) newState.battleStats.criticalHits++;
            newState.battleStats.maxCombo = Math.max(newState.battleStats.maxCombo, newState.combo);
            newState.battleStats.specialsUsed++;

            newState.battleLogs = [
              ...state.battleLogs,
              { 
                type: 'SPECIAL_ABILITY', 
                text: `${state.playerCharacter.name} used ${state.playerCharacter.specialAbility.name} and dealt ${damage} damage!`,
                highlight: true
              }
            ];

            if (isCritical) {
              newState.battleLogs.push({
                type: 'CRITICAL',
                text: 'CRITICAL HIT!',
                highlight: true
              });
            }

            // Apply status effect if available
            if (state.playerCharacter.specialAbility.statusEffect) {
              newState.aiStatusEffects.push({
                ...state.playerCharacter.specialAbility.statusEffect
              });
              newState.battleStats.statusEffectsApplied++;
              newState.battleLogs.push({
                type: 'STATUS_EFFECT',
                text: `${state.aiCharacter.name} is affected by ${state.playerCharacter.specialAbility.statusEffect.name}!`,
                highlight: true
              });
            }
          }
          break;
        }

        case 'DEFEND':
          newState.playerMP = Math.min(100, state.playerMP + 20);
          newState.battleLogs = [
            ...state.battleLogs,
            { 
              type: 'PLAYER_DEFEND', 
              text: `${state.playerCharacter.name} took a defensive stance and recovered 20 MP!` 
            }
          ];
          break;
      }

      // Check if AI is defeated
      if (newState.aiHP <= 0) {
        const baseReward = 100;
        const comboBonus = newState.battleStats.maxCombo * 20;
        const criticalBonus = newState.battleStats.criticalHits * 15;
        const perfectBonus = newState.battleStats.perfectBlocks * 10;
        const finalReward = baseReward + comboBonus + criticalBonus + perfectBonus;
        
        newState.isGameOver = true;
        newState.tokens += finalReward;

        // Tournament mode progression
        if (state.tournamentMode) {
          if (state.tournamentRound < tournamentOpponents.length - 1) {
            newState.tournamentRound++;
            newState.tournamentWins++;
            newState.battleLogs = [
              ...newState.battleLogs,
              { 
                type: 'GAME_OVER', 
                text: `${state.playerCharacter.name} wins Round ${state.tournamentRound}! Prepare for the next opponent!`,
                highlight: true
              }
            ];
          } else {
            newState.battleLogs = [
              ...newState.battleLogs,
              { 
                type: 'GAME_OVER', 
                text: `Tournament Champion! You've earned ${finalReward} tokens!`,
                highlight: true
              }
            ];
          }
        } else {
          newState.battleLogs = [
            ...newState.battleLogs,
            { 
              type: 'GAME_OVER', 
              text: `${state.playerCharacter.name} wins! You earned ${finalReward} tokens!`,
              highlight: true
            }
          ];
        }
      } else {
        newState.turn = 'ai';
        // Apply status effects before AI turn
        setState(newState);
        // Important: Use setTimeout to let React re-render first
        setTimeout(() => applyStatusEffects(), 200);
        // Schedule AI turn
        setTimeout(() => handleAITurn(), 1500);
        return; // Return early to avoid the setState at the end
      }
    }

    setState(newState);
  };

  const handleAITurn = () => {
    if (!state.playerCharacter || !state.aiCharacter) return;

    const newState = { ...state };
    const actions: Action['type'][] = ['QUICK_ATTACK', 'HEAVY_ATTACK'];
    
    // Check if AI can use special ability
    if (state.aiMP >= state.aiCharacter.specialAbility.mpCost) {
      actions.push('SPECIAL_ATTACK');
    }

    // Consider defending if low on health or MP
    if (state.aiHP < 40 || state.aiMP < 30) {
      actions.push('DEFEND', 'DEFEND'); // Add twice to increase probability
    }

    // AI strategy based on character and status
    if (state.aiCharacter.stats.attack > 7) {
      // Aggressive characters prefer attacks
      actions.push('QUICK_ATTACK', 'HEAVY_ATTACK');
    } else if (state.aiCharacter.stats.defense > 7) {
      // Defensive characters prefer defending
      actions.push('DEFEND', 'DEFEND');
    }

    // Check if stunned
    const isStunned = state.aiStatusEffects.some(effect => effect.type === 'STUN');
    if (isStunned) {
      newState.battleLogs = [
        ...state.battleLogs,
        { 
          type: 'STATUS_EFFECT', 
          text: `${state.aiCharacter.name} is stunned and skips their turn!`,
          highlight: true
        }
      ];
      newState.turn = 'player';
      setState(newState);
      return;
    }

    const action = actions[Math.floor(Math.random() * actions.length)];
    let damage = 0;
    let isCritical = false;
    switch (action) {
      case 'QUICK_ATTACK': {
        const result = calculateDamage(state.aiCharacter, state.playerCharacter, 'quick', newState);
        damage = result.damage;
        isCritical = result.isCritical;
        newState.playerHP = Math.max(0, state.playerHP - damage);
        newState.battleLogs = [
          ...state.battleLogs,
          { 
            type: 'AI_ATTACK', 
            text: `${state.aiCharacter.name} used Quick Attack and dealt ${damage} damage!`
          }
        ];
        if (isCritical) {
          newState.battleLogs.push({
            type: 'CRITICAL',
            text: 'CRITICAL HIT!',
            highlight: true
          });
        }
        break;
      }

      case 'HEAVY_ATTACK': {
        const result = calculateDamage(state.aiCharacter, state.playerCharacter, 'heavy', newState);
        damage = result.damage;
        isCritical = result.isCritical;
        newState.playerHP = Math.max(0, state.playerHP - damage);
        newState.battleLogs = [
          ...state.battleLogs,
          { 
            type: 'AI_ATTACK', 
            text: `${state.aiCharacter.name} used Heavy Attack and dealt ${damage} damage!`
          }
        ];
        if (isCritical) {
          newState.battleLogs.push({
            type: 'CRITICAL',
            text: 'CRITICAL HIT!',
            highlight: true
          });
        }
        break;
      }

      case 'SPECIAL_ATTACK': {
        const result = calculateDamage(state.aiCharacter, state.playerCharacter, 'special', newState);
        damage = result.damage;
        isCritical = result.isCritical;
        newState.playerHP = Math.max(0, state.playerHP - damage);
        newState.aiMP -= state.aiCharacter.specialAbility.mpCost;
        newState.battleLogs = [
          ...state.battleLogs,
          { 
            type: 'SPECIAL_ABILITY', 
            text: `${state.aiCharacter.name} used ${state.aiCharacter.specialAbility.name} and dealt ${damage} damage!`,
            highlight: true
          }
        ];
        if (isCritical) {
          newState.battleLogs.push({
            type: 'CRITICAL',
            text: 'CRITICAL HIT!',
            highlight: true
          });
        }

        // Apply status effect if available
        if (state.aiCharacter.specialAbility.statusEffect) {
          newState.playerStatusEffects.push({
            ...state.aiCharacter.specialAbility.statusEffect
          });
          newState.battleLogs.push({
            type: 'STATUS_EFFECT',
            text: `${state.playerCharacter.name} is affected by ${state.aiCharacter.specialAbility.statusEffect.name}!`,
            highlight: true
          });
        }
        break;
      }

      case 'DEFEND':
        newState.aiMP = Math.min(100, state.aiMP + 20);
        newState.battleLogs = [
          ...state.battleLogs,
          { 
            type: 'AI_DEFEND', 
            text: `${state.aiCharacter.name} took a defensive stance and recovered 20 MP!` 
          }
        ];
        break;
    }

    // Check if player is defeated
    if (newState.playerHP <= 0) {
      newState.isGameOver = true;
      newState.battleLogs = [
        ...newState.battleLogs,
        { 
          type: 'GAME_OVER', 
          text: `${state.aiCharacter.name} wins! Better luck next time!` 
        }
      ];
    }

    newState.turn = 'player';
    // Set state first before applying status effects
    setState(newState);
    // Important: Use setTimeout to let React re-render first
    setTimeout(() => applyStatusEffects(), 200);
  };

  const startNewGame = (tournamentMode: boolean = false) => {
    setState({
      screen: 'character-select',
      playerCharacter: null,
      aiCharacter: null,
      playerHP: 100,
      playerMP: 100,
      aiHP: 100,
      aiMP: 100,
      turn: 'player',
      battleLogs: [],
      tokens: state.tokens,
      isGameOver: false,
      combo: 0,
      lastAction: null,
      criticalHit: false,
      playerStatusEffects: [],
      aiStatusEffects: [],
      battleStats: {
        totalDamageDealt: 0,
        criticalHits: 0,
        maxCombo: 0,
        specialsUsed: 0,
        perfectBlocks: 0,
        statusEffectsApplied: 0
      },
      tournamentMode,
      tournamentRound: 0,
      tournamentWins: 0
    });
  };

  return (
    <div className="h-full">
      <div className="h-full p-4 sm:p-6">
        {state.screen === 'character-select' ? (
          <CharacterSelect 
            onSelect={selectCharacter}
            tournamentMode={state.tournamentMode}
            onToggleMode={() => startNewGame(!state.tournamentMode)}
          />
        ) : (
          <BattleArena
            state={state}
            onAction={handleAction}
            onNewGame={() => startNewGame(state.tournamentMode)}
          />
        )}
      </div>
    </div>
  );
};