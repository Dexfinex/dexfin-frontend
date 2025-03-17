export interface Character {
  id: string;
  name: string;
  description: string;
  image: string;
  stats: {
    attack: number;
    defense: number;
    speed: number;
  };
  specialAbility: {
    name: string;
    description: string;
    damage: number;
    mpCost: number;
    statusEffect?: StatusEffect;
  };
}

export interface GameState {
  screen: 'character-select' | 'battle';
  playerCharacter: Character | null;
  aiCharacter: Character | null;
  playerHP: number;
  playerMP: number;
  aiHP: number;
  aiMP: number;
  turn: 'player' | 'ai';
  battleLogs: BattleLog[];
  tokens: number;
  isGameOver: boolean;
  combo: number;
  lastAction: string | null;
  criticalHit: boolean;
  playerStatusEffects: StatusEffect[];
  aiStatusEffects: StatusEffect[];
  battleStats: BattleStats;
  tournamentMode: boolean;
  tournamentRound: number;
  tournamentWins: number;
}

export interface Action {
  type: 'QUICK_ATTACK' | 'HEAVY_ATTACK' | 'SPECIAL_ATTACK' | 'DEFEND';
}

export interface BattleLog {
  type: 'BATTLE_START' | 'PLAYER_ATTACK' | 'AI_ATTACK' | 'PLAYER_DEFEND' | 'AI_DEFEND' | 'GAME_OVER' | 'ERROR' | 'SPECIAL_ABILITY' | 'STATUS_EFFECT' | 'COMBO' | 'CRITICAL';
  text: string;
  highlight?: boolean;
}

export interface StatusEffect {
  type: 'BURN' | 'STUN' | 'POISON' | 'BUFF_ATTACK' | 'BUFF_DEFENSE' | 'BUFF_SPEED';
  duration: number;
  value: number;
  name: string;
  description: string;
}

export interface BattleStats {
  totalDamageDealt: number;
  criticalHits: number;
  maxCombo: number;
  specialsUsed: number;
  perfectBlocks: number;
  statusEffectsApplied: number;
}