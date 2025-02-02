import React, {useState} from 'react';
import {Action, Character, GameState} from '../../types/memeArena';
import {CharacterSelect} from './MemeArenaCharacterSelect';
import {BattleArena} from './MemeArenaBattle';
import {characters} from '../../data/memeArenaCharacters';

export const MemeArena: React.FC = () => {
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
    combo: 0, // Track combo hits
    lastAction: null, // Track last action for combo system
    criticalHit: false // Track critical hits
  });

  const selectCharacter = (character: Character) => {
    // Randomly select AI character (different from player's choice)
    const availableOpponents = characters.filter(c => c.id !== character.id);
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

  const getSpecialAbilityDamage = (character: Character) => {
    switch (character.id) {
      case 'doge':
        return { damage: 35, name: 'Much Wow Blast', mpCost: 40 };
      case 'pepe':
        return { damage: 40, name: 'Rare Pepe Magic', mpCost: 40 };
      case 'shib':
        return { damage: 45, name: 'Critical Bonk', mpCost: 40 };
      case 'trump':
        return { damage: 50, name: 'Presidential Power', mpCost: 40 };
      default:
        return { damage: 30, name: 'Special Attack', mpCost: 40 };
    }
  };

  const calculateDamage = (attacker: Character, defender: Character, attackType: 'quick' | 'heavy' | 'special', state: GameState) => {
    const baseDamage = {
      quick: 10,
      heavy: 20,
      special: getSpecialAbilityDamage(attacker).damage
    }[attackType];

    const attackMultiplier = attacker.stats.attack / 10;
    const defenseMultiplier = defender.stats.defense / 10;
    const speedBonus = attacker.stats.speed / 20; // Speed affects damage
    const randomFactor = 0.8 + Math.random() * 0.4; // Random factor between 0.8 and 1.2

    // Combo system
    const comboMultiplier = state.combo > 0 ? 1 + (state.combo * 0.1) : 1;

    // Critical hit system (10% base chance, increased by speed)
    const criticalChance = 0.1 + (attacker.stats.speed / 100);
    const isCritical = Math.random() < criticalChance;
    const criticalMultiplier = isCritical ? 1.5 : 1;

    const finalDamage = Math.round(
      baseDamage * 
      attackMultiplier * 
      (1 - defenseMultiplier * 0.5) * 
      (1 + speedBonus) * 
      randomFactor * 
      comboMultiplier *
      criticalMultiplier
    );

    return { damage: finalDamage, isCritical };
  };

  const handleAction = (action: Action) => {
    if (state.isGameOver || !state.playerCharacter || !state.aiCharacter) return;

    const newState = { ...state };
    let damage = 0;
    let isCritical = false;

    // Player's turn
    if (state.turn === 'player') {
      // Update combo based on action type
      if (state.lastAction === action.type) {
        newState.combo = Math.min(state.combo + 1, 3); // Max 3 combo
      } else {
        newState.combo = 0;
      }
      newState.lastAction = action.type;

      switch (action.type) {
        case 'QUICK_ATTACK': {
          const result = calculateDamage(state.playerCharacter, state.aiCharacter, 'quick', newState);
          damage = result.damage;
          isCritical = result.isCritical;
          newState.aiHP = Math.max(0, state.aiHP - damage);
          newState.battleLogs = [
            ...state.battleLogs,
            { 
              type: 'PLAYER_ATTACK', 
              text: `${state.playerCharacter.name} used Quick Attack and dealt ${damage} damage!${
                isCritical ? ' CRITICAL HIT!' : ''
              }${newState.combo > 0 ? ` ${newState.combo}x COMBO!` : ''}`
            }
          ];
          break;
        }

        case 'HEAVY_ATTACK': {
          const result = calculateDamage(state.playerCharacter, state.aiCharacter, 'heavy', newState);
          damage = result.damage;
          isCritical = result.isCritical;
          newState.aiHP = Math.max(0, state.aiHP - damage);
          newState.battleLogs = [
            ...state.battleLogs,
            { 
              type: 'PLAYER_ATTACK', 
              text: `${state.playerCharacter.name} used Heavy Attack and dealt ${damage} damage!${
                isCritical ? ' CRITICAL HIT!' : ''
              }${newState.combo > 0 ? ` ${newState.combo}x COMBO!` : ''}`
            }
          ];
          break;
        }

        case 'SPECIAL_ATTACK': {
          if (state.playerMP >= 40) {
            const specialAbility = getSpecialAbilityDamage(state.playerCharacter);
            const result = calculateDamage(state.playerCharacter, state.aiCharacter, 'special', newState);
            damage = result.damage;
            isCritical = result.isCritical;
            newState.aiHP = Math.max(0, state.aiHP - damage);
            newState.playerMP -= specialAbility.mpCost;
            newState.battleLogs = [
              ...state.battleLogs,
              { 
                type: 'PLAYER_ATTACK', 
                text: `${state.playerCharacter.name} used ${specialAbility.name} and dealt ${damage} damage!${
                  isCritical ? ' CRITICAL HIT!' : ''
                }${newState.combo > 0 ? ` ${newState.combo}x COMBO!` : ''}`
              }
            ];
          }
          break;
        }

        case 'DEFEND':
          newState.playerMP = Math.min(100, state.playerMP + 20);
          newState.battleLogs = [
            ...state.battleLogs,
            { type: 'PLAYER_DEFEND', text: `${state.playerCharacter.name} took a defensive stance and recovered 20 MP!` }
          ];
          break;
      }

      // Check if AI is defeated
      if (newState.aiHP <= 0) {
        const baseReward = 100;
        const comboBonus = newState.combo * 20;
        const finalReward = baseReward + comboBonus;
        
        newState.isGameOver = true;
        newState.tokens += finalReward;
        newState.battleLogs = [
          ...newState.battleLogs,
          { 
            type: 'GAME_OVER', 
            text: `${state.playerCharacter.name} wins! You earned ${finalReward} tokens!${
              comboBonus > 0 ? ` (${comboBonus} bonus from ${newState.combo}x combo!)` : ''
            }`
          }
        ];
      } else {
        newState.turn = 'ai';
        // Schedule AI turn
        setTimeout(() => handleAITurn(), 1500);
      }
    }

    setState(newState);
  };

  const handleAITurn = () => {
    if (!state.playerCharacter || !state.aiCharacter) return;

    const newState = { ...state };
    const actions: Action['type'][] = ['QUICK_ATTACK', 'HEAVY_ATTACK'];
    
    if (state.aiMP >= 40) actions.push('SPECIAL_ATTACK');
    if (state.aiHP < 50 || state.aiMP < 30) actions.push('DEFEND');

    // AI strategy based on character
    if (state.aiCharacter.stats.attack > 7) {
      // Aggressive characters prefer attacks
      actions.push('QUICK_ATTACK', 'HEAVY_ATTACK');
    } else if (state.aiCharacter.stats.defense > 7) {
      // Defensive characters prefer defending
      actions.push('DEFEND', 'DEFEND');
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
            text: `${state.aiCharacter.name} used Quick Attack and dealt ${damage} damage!${
              isCritical ? ' CRITICAL HIT!' : ''
            }`
          }
        ];
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
            text: `${state.aiCharacter.name} used Heavy Attack and dealt ${damage} damage!${
              isCritical ? ' CRITICAL HIT!' : ''
            }`
          }
        ];
        break;
      }

      case 'SPECIAL_ATTACK': {
        const specialAbility = getSpecialAbilityDamage(state.aiCharacter);
        const result = calculateDamage(state.aiCharacter, state.playerCharacter, 'special', newState);
        damage = result.damage;
        isCritical = result.isCritical;
        newState.playerHP = Math.max(0, state.playerHP - damage);
        newState.aiMP -= specialAbility.mpCost;
        newState.battleLogs = [
          ...state.battleLogs,
          { 
            type: 'AI_ATTACK', 
            text: `${state.aiCharacter.name} used ${specialAbility.name} and dealt ${damage} damage!${
              isCritical ? ' CRITICAL HIT!' : ''
            }`
          }
        ];
        break;
      }

      case 'DEFEND':
        newState.aiMP = Math.min(100, state.aiMP + 20);
        newState.battleLogs = [
          ...state.battleLogs,
          { type: 'AI_DEFEND', text: `${state.aiCharacter.name} took a defensive stance and recovered 20 MP!` }
        ];
        break;
    }

    // Check if player is defeated
    if (newState.playerHP <= 0) {
      newState.isGameOver = true;
      newState.battleLogs = [
        ...newState.battleLogs,
        { type: 'GAME_OVER', text: `${state.aiCharacter.name} wins! Better luck next time!` }
      ];
    }

    newState.turn = 'player';
    setState(newState);
  };

  const startNewGame = () => {
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
      tokens: state.tokens, // Preserve tokens
      isGameOver: false,
      combo: 0,
      lastAction: null,
      criticalHit: false
    });
  };

  return (
    <div className="h-full">
      <div className="p-6 h-full">
        {state.screen === 'character-select' ? (
          <CharacterSelect onSelect={selectCharacter} />
        ) : (
          <BattleArena
            state={state}
            onAction={handleAction}
            onNewGame={startNewGame}
          />
        )}
      </div>
    </div>
  );
};