import { Character } from '../types/memeArena.type';

export const characters: Character[] = [
  {
    id: 'doge',
    name: 'DOGE',
    description: 'Much wow, very strength! The original memecoin warrior',
    image: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png',
    stats: {
      attack: 8,
      defense: 7,
      speed: 5
    },
    specialAbility: {
      name: 'Much Wow Blast',
      description: 'Unleashes a powerful blast of pure wow energy',
      damage: 35,
      mpCost: 40,
      statusEffect: {
        type: 'STUN',
        duration: 2,
        value: 1,
        name: 'Stunned',
        description: 'Skip next turn'
      }
    }
  },
  {
    id: 'pepe',
    name: 'PEPE',
    description: 'Rare Pepe magic caster with powerful memes',
    image: 'https://cryptologos.cc/logos/pepe-pepe-logo.png',
    stats: {
      attack: 9,
      defense: 4,
      speed: 7
    },
    specialAbility: {
      name: 'Rare Pepe Magic',
      description: 'Casts a devastating spell using rare Pepe energy',
      damage: 40,
      mpCost: 40,
      statusEffect: {
        type: 'POISON',
        duration: 3,
        value: 5,
        name: 'Toxic Meme',
        description: 'Takes damage over time'
      }
    }
  },
  {
    id: 'shib',
    name: 'SHIB',
    description: 'Swift and stealthy Shiba with critical bonks',
    image: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.png',
    stats: {
      attack: 7,
      defense: 5,
      speed: 9
    },
    specialAbility: {
      name: 'Critical Bonk',
      description: 'A lightning-fast attack with high critical chance',
      damage: 45,
      mpCost: 40,
      statusEffect: {
        type: 'BUFF_SPEED',
        duration: 2,
        value: 1.5,
        name: 'Swift Strike',
        description: 'Increased speed'
      }
    }
  },
  {
    id: 'trump',
    name: 'TRUMP',
    description: 'The Official Trump token with presidential powers',
    image: 'https://assets.coingecko.com/coins/images/53746/standard/trump.png?1737171561',
    stats: {
      attack: 6,
      defense: 9,
      speed: 4
    },
    specialAbility: {
      name: 'Presidential Power',
      description: 'Unleashes executive order energy',
      damage: 50,
      mpCost: 40,
      statusEffect: {
        type: 'BUFF_DEFENSE',
        duration: 3,
        value: 1.5,
        name: 'Executive Shield',
        description: 'Increased defense'
      }
    }
  }
];

// Tournament mode opponents
export const tournamentOpponents: Character[] = [
  {
    id: 'wojak',
    name: 'WOJAK',
    description: 'The eternal crypto trader',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=wojak',
    stats: {
      attack: 6,
      defense: 6,
      speed: 6
    },
    specialAbility: {
      name: 'Panic Sell',
      description: 'Unleashes trading anxiety',
      damage: 30,
      mpCost: 35,
      statusEffect: {
        type: 'BUFF_ATTACK',
        duration: 2,
        value: 1.3,
        name: 'Trading Frenzy',
        description: 'Increased attack'
      }
    }
  },
  {
    id: 'chad',
    name: 'GIGACHAD',
    description: 'The ultimate alpha trader',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=chad',
    stats: {
      attack: 10,
      defense: 8,
      speed: 6
    },
    specialAbility: {
      name: 'Alpha Move',
      description: 'Pure alpha energy attack',
      damage: 55,
      mpCost: 45,
      statusEffect: {
        type: 'BURN',
        duration: 3,
        value: 8,
        name: 'Alpha Burn',
        description: 'Takes burn damage'
      }
    }
  }
];