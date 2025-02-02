import React from 'react';
import {characters} from '../../data/memeArenaCharacters';
import {Character} from '../../types/memeArena';

interface CharacterSelectProps {
  onSelect: (character: Character) => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6">Choose Your Meme Champion</h2>
      
      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        {characters.map(character => (
          <div
            key={character.id}
            className="bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-all hover:scale-[1.02]"
          >
            <div className="flex flex-col items-center mb-3">
              <img
                src={character.image}
                alt={character.name}
                className="w-16 h-16 rounded-full mb-2"
              />
              <h3 className="text-lg font-bold mb-1">{character.name}</h3>
              <p className="text-white/60 text-center text-sm mb-2">{character.description}</p>
            </div>

            <div className="space-y-1.5 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Attack</span>
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
                <span className="text-white/60 text-sm">Defense</span>
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
                <span className="text-white/60 text-sm">Speed</span>
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
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-sm font-medium"
            >
              Select {character.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};