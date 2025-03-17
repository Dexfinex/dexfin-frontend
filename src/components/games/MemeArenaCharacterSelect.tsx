import React, { useState, useEffect } from 'react';
import { characters } from '../../data/memeArenaCharacters';
import { Character } from '../../types/memeArena.type';

interface CharacterSelectProps {
  onSelect: (character: Character) => void;
  tournamentMode?: boolean;
  onToggleMode?: () => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({ onSelect }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="mb-4 text-xl sm:text-3xl font-bold text-center">Choose Your Meme Champion</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {characters.map(character => (
          <div
            key={character.id}
            className="bg-white/5 rounded-xl p-4 pb-5 hover:bg-white/10 transition-all hover:scale-[1.02] overflow-hidden flex flex-col"
          >
            <div className="flex flex-col items-center mb-3">
              <img
                src={character.image}
                alt={character.name}
                className="w-14 h-14 sm:w-16 sm:h-16 mb-2 rounded-full"
              />
              <h3 className="mb-1 text-base sm:text-lg font-bold">{character.name}</h3>
              <p className="mb-2 text-xs sm:text-sm text-center text-white/60 line-clamp-2">{character.description}</p>
            </div>

            <div className="space-y-1.5 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-white/60">Attack</span>
                <div className="flex items-center gap-1">
                  <span className={`px-1.5 sm:px-2 py-0.5 rounded text-xs ${
                    character.stats.attack >= 8 ? 'bg-red-500/20 text-red-400' :
                    character.stats.attack >= 6 ? 'bg-orange-500/20 text-orange-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {character.stats.attack}/10
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-white/60">Defense</span>
                <div className="flex items-center gap-1">
                  <span className={`px-1.5 sm:px-2 py-0.5 rounded text-xs ${
                    character.stats.defense >= 8 ? 'bg-blue-500/20 text-blue-400' :
                    character.stats.defense >= 6 ? 'bg-cyan-500/20 text-cyan-400' :
                    'bg-sky-500/20 text-sky-400'
                  }`}>
                    {character.stats.defense}/10
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-white/60">Speed</span>
                <div className="flex items-center gap-1">
                  <span className={`px-1.5 sm:px-2 py-0.5 rounded text-xs ${
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
              className="w-full py-2 text-xs sm:text-sm font-medium transition-colors bg-blue-500 rounded-lg hover:bg-blue-600 mt-auto"
            >
              Select {character.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};