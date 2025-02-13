import React from 'react';
import { characters } from '../../data/memeArenaCharacters';
import { Character } from '../../types/memeArena';

interface CharacterSelectProps {
  onSelect: (character: Character) => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-6 text-3xl font-bold">Choose Your Meme Champion</h2>
      
      <div className="grid max-w-2xl grid-cols-2 gap-4">
        {characters.map(character => (
          <div
            key={character.id}
            className="bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-all hover:scale-[1.02]"
          >
            <div className="flex flex-col items-center mb-3">
              <img
                src={character.image}
                alt={character.name}
                className="w-16 h-16 mb-2 rounded-full"
              />
              <h3 className="mb-1 text-lg font-bold">{character.name}</h3>
              <p className="mb-2 text-sm text-center text-white/60">{character.description}</p>
            </div>

            <div className="space-y-1.5 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Attack</span>
                <div className="flex items-center gap-1">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    character.stats.attack >= 8 ? 'bg-red-500/20 text-red-400' :
                    character.stats.attack >= 6 ? 'bg-orange-500/20 text-orange-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {character.stats.attack}/10
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Defense</span>
                <div className="flex items-center gap-1">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    character.stats.defense >= 8 ? 'bg-blue-500/20 text-blue-400' :
                    character.stats.defense >= 6 ? 'bg-cyan-500/20 text-cyan-400' :
                    'bg-sky-500/20 text-sky-400'
                  }`}>
                    {character.stats.defense}/10
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Speed</span>
                <div className="flex items-center gap-1">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    character.stats.speed >= 8 ? 'bg-green-500/20 text-green-400' :
                    character.stats.speed >= 6 ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-teal-500/20 text-teal-400'
                  }`}>
                    {character.stats.speed}/10
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelect(character)}
              className="w-full py-2 text-sm font-medium transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Select {character.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};