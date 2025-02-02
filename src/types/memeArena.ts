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
  combo: number; // Track combo hits
  lastAction: string | null; // Track last action for combo system
  criticalHit: boolean; // Track critical hits
}

export interface Action {
  type: 'QUICK_ATTACK' | 'HEAVY_ATTACK' | 'SPECIAL_ATTACK' | 'DEFEND';
}

export interface BattleLog {
  type: 'BATTLE_START' | 'PLAYER_ATTACK' | 'AI_ATTACK' | 'PLAYER_DEFEND' | 'AI_DEFEND' | 'GAME_OVER' | 'ERROR';
  text: string;
}