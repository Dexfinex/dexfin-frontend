import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { Trophy, Clock, Star, Zap, ArrowLeft, RefreshCw, CheckCircle2, Coins } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { GameSession } from '../GamesModal';
import { Web3AuthContext } from '../../providers/Web3AuthContext.tsx';
import { GameService } from '../../services/game.services.ts';

interface Difficulty {
  name: string;
  gridSize: number;
  timeLimit: number;
  basePoints: number;
  bonusWords: number;
  bgClass: string;
}

interface CryptoWordHuntProps {
  gameType?: string;
}

interface Word {
  text: string;
  points: number;
  isBonus?: boolean;
  found?: boolean;
  direction?: {
    startRow: number;
    startCol: number;
    dx: number;
    dy: number;
  };
}

interface Cell {
  letter: string;
  isHighlighted: boolean;
  isSelected: boolean;
  isFound: boolean;
}

const difficulties: Difficulty[] = [
  {
    name: 'Easy',
    gridSize: 8,
    timeLimit: 180,
    basePoints: 10,
    bonusWords: 1,
    bgClass: 'from-emerald-600/20 to-emerald-500/20'
  },
  {
    name: 'Medium',
    gridSize: 12,
    timeLimit: 240,
    basePoints: 20,
    bonusWords: 2,
    bgClass: 'from-blue-600/20 to-blue-500/20'
  },
  {
    name: 'Hard',
    gridSize: 15,
    timeLimit: 300,
    basePoints: 30,
    bonusWords: 3,
    bgClass: 'from-purple-600/20 to-purple-500/20'
  }
];

const wordPool = {
  basics: [
    { text: 'WALLET', points: 10 },
    { text: 'TOKEN', points: 10 },
    { text: 'COIN', points: 8 },
    { text: 'CRYPTO', points: 12 },
    { text: 'TRADE', points: 10 }
  ],
  networks: [
    { text: 'ETH', points: 8 },
    { text: 'BTC', points: 8 },
    { text: 'SOL', points: 8 },
    { text: 'MATIC', points: 10 },
    { text: 'AVAX', points: 10 }
  ],
  defi: [
    { text: 'DEFI', points: 10 },
    { text: 'STAKE', points: 12 },
    { text: 'YIELD', points: 12 },
    { text: 'SWAP', points: 10 },
    { text: 'POOL', points: 10 }
  ],
  tech: [
    { text: 'CHAIN', points: 10 },
    { text: 'BLOCK', points: 10 },
    { text: 'HASH', points: 10 },
    { text: 'NODE', points: 10 },
    { text: 'MINE', points: 10 }
  ],
  nft: [
    { text: 'NFT', points: 8 },
    { text: 'MINT', points: 10 },
    { text: 'ART', points: 8 },
    { text: 'RARE', points: 10 },
    { text: 'PFP', points: 12 }
  ],
  trading: [
    { text: 'BULL', points: 10 },
    { text: 'BEAR', points: 10 },
    { text: 'LONG', points: 10 },
    { text: 'SHORT', points: 12 },
    { text: 'BUY', points: 8 }
  ]
};

const getRandomWords = (difficulty: Difficulty): Word[] => {
  const categories = Object.keys(wordPool) as (keyof typeof wordPool)[];
  const words: Word[] = [];

  // Get one word from each category first
  categories.forEach(category => {
    const categoryWords = wordPool[category];
    const randomWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];
    words.push({ ...randomWord, isBonus: false });
  });

  // Shuffle and slice to get the desired number of words
  const baseWordCount = 5;
  const totalWords = baseWordCount + difficulty.bonusWords;

  return words
    .sort(() => Math.random() - 0.5)
    .slice(0, totalWords)
    .map((word, index) => ({
      ...word,
      isBonus: index >= baseWordCount
    }));
};

const CryptoWordHunt: React.FC<CryptoWordHuntProps> = ({ gameType = 'WORDHUNT' }) => {
  const [gameState, setGameState] = useState<'menu' | 'game'>('menu');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [wordsToFind, setWordsToFind] = useState<Word[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selection, setSelection] = useState<{ row: number; col: number }[]>([]);
  const [showGuide, setShowGuide] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [selectionStart, setSelectionStart] = useState<{ row: number; col: number } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // New state for mobile responsiveness
  const [showWordList, setShowWordList] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { userData } = useContext(Web3AuthContext);

  // Flag to track if game session has been saved
  const gameSessionSaved = useRef(false);

  // State for game data and ID
  const [gameData, setGameData] = useState<any[]>([]);
  const [gameId, setGameId] = useState<string>("");
  const [timeTaken, setTimeTaken] = useState(0);
  // Get game stats and updateGameStats from useStore
  const { gameStats, updateGameStats } = useStore();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const loadGameData = async () => {
      if (userData && userData.accessToken) {
        try {
          const data = await GameService.fetchUserGameId(userData.accessToken);

          if (Array.isArray(data)) {
            setGameData(data);

            // Find the WORDHUNT game type
            const game = data.find(g => g.type === gameType);
            if (game) {
              console.log(`Found game with type ${gameType}:`, game);
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

  useEffect(() => {
    if (gameState === 'menu') {
      gameSessionSaved.current = false;
    }
  }, [gameState]);

  useEffect(() => {
    if (foundWords.length === wordsToFind.length && foundWords.length > 0 && 
        showSuccessModal && !gameSessionSaved.current && 
        userData && userData.accessToken && gameId) {
      
      console.log("Game completed! Saving session...");
      saveGameSession();
    }
  }, [foundWords, wordsToFind, showSuccessModal, userData, gameId, gameStats]);
 
  const saveGameSession = async () => {
    if (!userData || !userData.accessToken || !gameId || gameSessionSaved.current) return;

    gameSessionSaved.current = true;

    const tokensEarned = Math.floor(score * 0.1);
    const perfectStatus = foundWords.length === wordsToFind.length ? 1 : 0;

    const gameSession: GameSession = {
      gameId: gameId,
      tokensEarned: tokensEarned,
      score: score,
      perfectStatus: foundWords.length === wordsToFind.length,
      words: foundWords.length,
      streak: foundWords.length,
    };

    // Save to DB
    try {
      const response = await GameService.gameHistory(userData.accessToken, gameSession);
      console.log(response);

      if (gameStats) {
        updateGameStats({
          huntStats: {
            gamesPlayed: gameStats.huntStats.gamesPlayed + 1,
            tokensEarned: gameStats.huntStats.tokensEarned + tokensEarned,
            words: gameStats.huntStats.words + foundWords.length,
            bestScore: Math.max(gameStats.huntStats.bestScore, score),
            perfectStatus: gameStats.huntStats.perfectStatus + perfectStatus
          },
          totalTokens: gameStats.totalTokens + tokensEarned
        });
      }
    } catch (error) {
      console.error('Error saving game session:', error);
    }
  };

  const generateGrid = (size: number, words: Word[]) => {
    // Initialize empty grid
    const newGrid = Array(size).fill(null).map(() =>
      Array(size).fill(null).map(() => ({
        letter: '',
        isHighlighted: false,
        isSelected: false,
        isFound: false
      }))
    );

    const placedWords: Word[] = [];
    const directions = [
      { dx: 1, dy: 0 },    // horizontal
      { dx: 0, dy: 1 },    // vertical
      { dx: 1, dy: 1 },    // diagonal down
      { dx: -1, dy: 0 },   // horizontal reverse
      { dx: 0, dy: -1 },   // vertical reverse
      { dx: -1, dy: -1 }   // diagonal up reverse
    ];

    // Sort words by length (longest first)
    const sortedWords = [...words].sort((a, b) => b.text.length - a.text.length);

    // Try to place each word
    for (const word of sortedWords) {
      let placed = false;
      let attempts = 0;
      const maxAttempts = 100;

      while (!placed && attempts < maxAttempts) {
        // Pick random direction and starting position
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const startRow = Math.floor(Math.random() * size);
        const startCol = Math.floor(Math.random() * size);

        // Check if word fits in this direction
        const endRow = startRow + (word.text.length - 1) * direction.dy;
        const endCol = startCol + (word.text.length - 1) * direction.dx;

        if (endRow >= 0 && endRow < size && endCol >= 0 && endCol < size) {
          // Check if path is clear
          let canPlace = true;
          const positions = [];

          for (let i = 0; i < word.text.length; i++) {
            const row = startRow + (i * direction.dy);
            const col = startCol + (i * direction.dx);
            const currentLetter = newGrid[row][col].letter;

            if (currentLetter && currentLetter !== word.text[i]) {
              canPlace = false;
              break;
            }
            positions.push({ row, col });
          }

          if (canPlace) {
            // Place the word
            for (let i = 0; i < word.text.length; i++) {
              const row = startRow + (i * direction.dy);
              const col = startCol + (i * direction.dx);
              newGrid[row][col].letter = word.text[i];
            }

            placedWords.push({
              ...word,
              direction: {
                startRow,
                startCol,
                dx: direction.dx,
                dy: direction.dy
              }
            });
            placed = true;
          }
        }
        attempts++;
      }

      if (!placed) {
        console.error(`Failed to place word: ${word.text}`);
      }
    }

    // Fill empty cells with random letters
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (!newGrid[i][j].letter) {
          newGrid[i][j].letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    setWordsToFind(placedWords);
    return newGrid;
  };

  const startGame = (difficulty: Difficulty) => {
    const selectedWords = getRandomWords(difficulty);

    setSelectedDifficulty(difficulty);
    setGrid(generateGrid(difficulty.gridSize, selectedWords));
    setTimeLeft(difficulty.timeLimit);
    setTimeTaken(0);
    setScore(0);
    setWordsToFind(selectedWords);
    setFoundWords([]);
    setGameState('game');
    setShowWordList(false);
  };
  useEffect(() => {
    // Check if game is completed by finding all words
    if (gameState === 'game' && foundWords.length === wordsToFind.length && foundWords.length > 0) {
      // Game is completed - stop the timer and show success
      setShowSuccessModal(true);
      
      // Save game session if it hasn't been saved yet
      if (!gameSessionSaved.current && userData && userData.accessToken && gameId) {
        saveGameSession();
      }
    }
  }, [foundWords, wordsToFind, gameState, userData, gameId]);

useEffect(() => {
  let timer: NodeJS.Timeout;
  
  // Only run the timer if game is active AND not all words have been found
  if (gameState === 'game' && timeLeft > 0 && foundWords.length < wordsToFind.length) {
    timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
      setTimeTaken(prev => prev + 1);
    }, 1000);
  } else if (timeLeft === 0 && gameState === 'game') {
    // Handle game over due to timeout
    if (foundWords.length === wordsToFind.length) {
      setShowSuccessModal(true);
      
      // Save game session if it hasn't been saved yet
      if (!gameSessionSaved.current && userData && userData.accessToken && gameId) {
        saveGameSession();
      }
    }
  }
  
  return () => clearInterval(timer);
}, [timeLeft, gameState, foundWords.length, wordsToFind.length]);

  const handleCellMouseDown = (row: number, col: number) => {
    setIsSelecting(true);
    setSelectionStart({ row, col });
    setSelection([{ row, col }]);
    setGrid(prev => prev.map((r, i) =>
      r.map((cell, j) => ({
        ...cell,
        isSelected: i === row && j === col
      }))
    ));
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (!isSelecting || !selectionStart) return;
  
    // Calculate direction
    const dx = Math.sign(col - selectionStart.col);
    const dy = Math.sign(row - selectionStart.row);
  
    // Allow any of the 8 directions (horizontal, vertical, and diagonal)
    // This check ensures the selection follows a straight line in any of these directions
    if ((dx === 0 && dy === 0) || (Math.abs(dx) > 0 && Math.abs(dy) > 0 && 
        Math.abs(row - selectionStart.row) !== Math.abs(col - selectionStart.col))) {
      // Either same cell (dx=0,dy=0) or not a straight line in diagonal direction
      return;
    }
  
    const newSelection: { row: number; col: number }[] = [];
    let currentRow = selectionStart.row;
    let currentCol = selectionStart.col;
  
    // Build the selection path
    while (true) {
      newSelection.push({ row: currentRow, col: currentCol });
      if (currentRow === row && currentCol === col) break;
      
      // Move in the determined direction
      currentRow += dy;
      currentCol += dx;
    }
  
    const word = newSelection.map(pos => grid[pos.row][pos.col].letter).join('');
    setCurrentWord(word);
  
    const reversedWord = word.split('').reverse().join('');
    const isValidWord = wordsToFind.some(w =>
      !foundWords.includes(w.text) && (w.text === word || w.text === reversedWord)
    );
  
    setGrid(prev => prev.map((r, i) =>
      r.map((cell, j) => ({
        ...cell,
        isSelected: newSelection.some(pos => pos.row === i && pos.col === j),
        isHighlighted: isValidWord && newSelection.some(pos => pos.row === i && pos.col === j)
      }))
    ));
  
    setSelection(newSelection);
  };

  const handleCellMouseUp = () => {
    if (!isSelecting) return;
    setIsSelecting(false);
    setSelectionStart(null);
  
    const selectedWord = selection.map(pos => grid[pos.row][pos.col].letter).join('');
    const reversedWord = selectedWord.split('').reverse().join('');
  
    const foundWord = wordsToFind.find(w =>
      !foundWords.includes(w.text) && (w.text === selectedWord || w.text === reversedWord)
    );
  
    if (foundWord) {
      // Update foundWords - this will trigger the effect that stops the timer
      setFoundWords(prev => [...prev, foundWord.text]);
      setScore(prev => prev + foundWord.points);
  
      setGrid(prev => prev.map((row, i) =>
        row.map((cell, j) => ({
          ...cell,
          isSelected: false,
          isFound: cell.isFound || selection.some(pos => pos.row === i && pos.col === j)
        }))
      ));
    } else {
      setGrid(prev => prev.map(row =>
        row.map(cell => ({
          ...cell,
          isSelected: false,
          isHighlighted: false
        }))
      ));
    }
  
    setSelection([]);
    setCurrentWord('');
  };

  // Fixed touch event handler to avoid preventDefault errors
  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const cellCoords = element?.getAttribute('data-coords');
    if (cellCoords) {
      const [row, col] = cellCoords.split('-').map(Number);
      handleCellMouseEnter(row, col);
    }
  };

  const renderDifficultySelection = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">Crypto Word Hunt</h2>
        <p className="text-white/60 max-w-lg mx-auto text-sm md:text-base">
          Find crypto-related words hidden in the grid. The faster you find them, the more tokens you earn!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty.name}
            onClick={() => startGame(difficulty)}
            className={`relative p-4 md:p-8 rounded-2xl bg-gradient-to-br ${difficulty.bgClass} hover:scale-105 transition-all duration-300 group overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">{difficulty.name}</h3>

            <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-lg bg-white/20 flex items-center justify-center">
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-md bg-white/60" />
                </div>
                <span>{difficulty.gridSize}x{difficulty.gridSize} grid</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-white/60" />
                <span>{Math.floor(difficulty.timeLimit / 60)}:{(difficulty.timeLimit % 60).toString().padStart(2, '0')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 md:w-5 md:h-5 text-white/60" />
                <span>{difficulty.basePoints} base points</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 md:w-5 md:h-5 text-white/60" />
                <span>{difficulty.bonusWords} bonus word{difficulty.bonusWords > 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="absolute top-3 right-3 md:top-4 md:right-4">
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl bg-white/10 flex items-center justify-center">
                {difficulty.name === 'Easy' && <span className="text-xl md:text-2xl">🌱</span>}
                {difficulty.name === 'Medium' && <span className="text-xl md:text-2xl">⚡️</span>}
                {difficulty.name === 'Hard' && <span className="text-xl md:text-2xl">🔥</span>}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white/5 rounded-2xl p-4 md:p-8">
        <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">How to Play</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-start gap-2 md:gap-3">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mt-1">
                <span className="text-lg md:text-xl">1</span>
              </div>
              <div>
                <h4 className="font-medium mb-1">Find Words</h4>
                <p className="text-xs md:text-sm text-white/60">Search for crypto-related words in any direction - horizontal, vertical, or diagonal.</p>
              </div>
            </div>
            <div className="flex items-start gap-2 md:gap-3">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mt-1">
                <span className="text-lg md:text-xl">2</span>
              </div>
              <div>
                <h4 className="font-medium mb-1">Select Letters</h4>
                <p className="text-xs md:text-sm text-white/60">Click and drag to select letters and form words. Words can be forwards or backwards.</p>
              </div>
            </div>
          </div>
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-start gap-2 md:gap-3">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-green-500/20 flex items-center justify-center mt-1">
                <span className="text-lg md:text-xl">3</span>
              </div>
              <div>
                <h4 className="font-medium mb-1">Score Points</h4>
                <p className="text-xs md:text-sm text-white/60">Each word is worth points. Find bonus words for extra points and multipliers!</p>
              </div>
            </div>
            <div className="flex items-start gap-2 md:gap-3">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center mt-1">
                <span className="text-lg md:text-xl">4</span>
              </div>
              <div>
                <h4 className="font-medium mb-1">Beat the Clock</h4>
                <p className="text-xs md:text-sm text-white/60">Find all words before time runs out. The faster you find them, the more tokens you earn.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGame = () => {
    if (!selectedDifficulty) return null;
    const showTimeTaken = foundWords.length === wordsToFind.length && foundWords.length > 0;
    const timeToDisplay = showTimeTaken ? timeTaken : timeLeft;
    const timeLabel = showTimeTaken ? "Time Taken" : "Time Left";

    return (
      <div className="flex flex-col md:flex-row md:gap-8">
        <div className="flex-1">
          {/* Game Header */}
          <div className="grid grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-8">
            <div className="bg-white/5 rounded-xl p-2 md:p-4 flex flex-col items-center">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-400 mb-1 md:mb-2" />
              <div className="text-base md:text-2xl font-bold">{Math.floor(timeToDisplay / 60)}:{(timeToDisplay % 60).toString().padStart(2, '0')}</div>
              <div className="text-xs md:text-sm text-white/60">{timeLabel}</div>
            </div>
            <div className="bg-white/5 rounded-xl p-2 md:p-4 flex flex-col items-center">
              <Trophy className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 mb-1 md:mb-2" />
              <div className="text-base md:text-2xl font-bold">{score}</div>
              <div className="text-xs md:text-sm text-white/60">Score</div>
            </div>
            <div className="bg-white/5 rounded-xl p-2 md:p-4 flex flex-col items-center">
              <Star className="w-4 h-4 md:w-5 md:h-5 text-purple-400 mb-1 md:mb-2" />
              <div className="text-base md:text-2xl font-bold">{foundWords.length}/{wordsToFind.length}</div>
              <div className="text-xs md:text-sm text-white/60">Words Found</div>
            </div>
            
            {isMobile ? (
              <button
                onClick={() => setShowWordList(!showWordList)}
                className="bg-white/5 rounded-xl p-2 md:p-4 flex flex-col items-center hover:bg-white/10 transition-colors"
              >
                <Zap className="w-4 h-4 md:w-5 md:h-5 text-green-400 mb-1 md:mb-2" />
                <div className="text-xs md:text-sm">{showWordList ? "Hide Words" : "Show Words"}</div>
              </button>
            ) : (
              <button
                onClick={() => setShowGuide(!showGuide)}
                className="bg-white/5 rounded-xl p-2 md:p-4 flex flex-col items-center hover:bg-white/10 transition-colors"
              >
                <Zap className="w-4 h-4 md:w-5 md:h-5 text-green-400 mb-1 md:mb-2" />
                <div className="text-xs md:text-sm">Show Guide</div>
              </button>
            )}
          </div>

          {/* Game Grid */}
          {!showWordList && (
            <div
              className="select-none max-w-full md:max-w-[600px] mx-auto"
              onMouseUp={handleCellMouseUp}
              onMouseLeave={handleCellMouseUp}
              onTouchEnd={handleCellMouseUp}
            >
              <div
                className="grid bg-gradient-to-br from-[#1a237e]/80 to-[#283593]/80 backdrop-blur-xl border border-[#3949ab]/30 rounded-2xl overflow-hidden shadow-xl"
                style={{
                  gridTemplateColumns: `repeat(${selectedDifficulty.gridSize}, minmax(0, 1fr))`
                }}
              >
                {grid.map((row, rowIndex) => (
                  row.map((cell, colIndex) => (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                      onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                      onTouchStart={(e) => {
                        if ("ontouchstart" in window) {
                          e.currentTarget.addEventListener('touchmove', (e) => {
                            e.stopPropagation();
                          }, { passive: false });
                        }
                        handleCellMouseDown(rowIndex, colIndex);
                      }}
                      onTouchMove={handleTouchMove}
                      data-coords={`${rowIndex}-${colIndex}`}
                      className={`aspect-square flex items-center justify-center font-bold text-xs md:text-base lg:text-xl transition-all ${
                        cell.isFound
                          ? 'bg-green-500/30 text-white'
                          : cell.isSelected
                            ? cell.isHighlighted
                              ? 'bg-blue-500 text-white scale-110 z-10'
                              : 'bg-white/20 text-white'
                            : 'text-white/90 hover:bg-[#283593]/50'
                      }`}
                      style={{
                        fontSize: isMobile ? `${Math.max(10, Math.min(16, 24 / selectedDifficulty.gridSize))}px` : undefined,
                        borderRight: colIndex < selectedDifficulty.gridSize - 1 ? '1px solid rgba(57, 73, 171, 0.3)' : 'none',
                        borderBottom: rowIndex < selectedDifficulty.gridSize - 1 ? '1px solid rgba(57, 73, 171, 0.3)' : 'none'
                      }}
                    >
                      {cell.letter}
                    </button>
                  ))
                ))}
              </div>
            </div>
          )}

          {/* Mobile Word List (conditionally rendered) */}
          {isMobile && showWordList && (
            <div className="fixed inset-0 z-40 bg-[#1a237e]/95 backdrop-blur-md p-4 overflow-auto">
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-[#1a237e] py-2 z-10">
                <h3 className="text-lg font-bold">Words to Find ({wordsToFind.length})</h3>
                <button
                  onClick={() => setShowWordList(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-20">
                {wordsToFind.map((word) => (
                  <div
                    key={word.text}
                    className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                      foundWords.includes(word.text)
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-white/10 border border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-base">{word.text}</span>
                      {word.isBonus && (
                        <Star className="w-4 h-4 text-yellow-400" />
                      )}
                    </div>
                    <span className="text-base font-bold">{word.points}pts</span>
                  </div>
                ))}
              </div>
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#1a237e] to-transparent pt-8">
                <button 
                  onClick={() => setShowWordList(false)}
                  className="w-full p-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors shadow-lg"
                >
                  Back to Game
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Word List */}
        {!isMobile && (
          <div className="hidden md:block w-80">
            <div className="sticky top-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Words to Find ({wordsToFind.length})</h3>
                <button
                  onClick={() => setGameState('menu')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {wordsToFind.map((word) => (
                  <div
                    key={word.text}
                    className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                      foundWords.includes(word.text)
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{word.text}</span>
                      {word.isBonus && (
                        <Star className="w-4 h-4 text-yellow-400" />
                      )}
                    </div>
                    <span>{word.points}pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {isMobile && !showWordList && (
          <div className="fixed bottom-0 left-0 right-0 bg-[#1a237e]/90 backdrop-blur-md border-t border-[#3949ab]/30 p-2 flex justify-between items-center z-30">
            <button
              onClick={() => setGameState('menu')}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mb-1" />
              <span className="text-xs">Menu</span>
            </button>
            
            <button
              onClick={() => setShowWordList(true)}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-white/10 transition-colors relative"
            >
              <Star className="w-5 h-5 mb-1" />
              <span className="text-xs">Words ({foundWords.length}/{wordsToFind.length})</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            </button>
            
            <div className="flex flex-col items-center p-2">
              <Trophy className="w-5 h-5 text-yellow-400 mb-1" />
              <span className="text-xs">{score} pts</span>
            </div>
            
            <div className="flex flex-col items-center p-2">
              <Clock className="w-5 h-5 text-blue-400 mb-1" />
              <span className="text-xs">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSuccessModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)} />
      <div className="relative bg-[#1a237e]/80 backdrop-blur-xl border border-white/10 rounded-xl p-6 md:p-8 w-full max-w-[400px] text-center">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 md:mb-6">
          <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">Congratulations!</h3>
        <p className="text-white/60 mb-4 md:mb-6 text-sm md:text-base">
          You found all {wordsToFind.length} words!
        </p>
        <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm md:text-base">Final Score</span>
            <span className="text-xl md:text-2xl font-bold">{score}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm md:text-base">Time Remaining</span>
            <span className="text-lg md:text-xl">
            {Math.floor(timeTaken / 60)}:{(timeTaken % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm md:text-base">Tokens Earned</span>
            <div className="flex items-center gap-2 text-yellow-400">
              <Coins className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-lg md:text-xl font-bold">{Math.floor(score * 0.1)}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 md:gap-4">
          <button
            onClick={() => {
              setShowSuccessModal(false);
              setGameState('menu');
            }}
            className="flex-1 px-4 py-2 md:px-6 md:py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-sm md:text-base"
          >
            Menu
          </button>
          <button
            onClick={() => {
              setShowSuccessModal(false);
              if (selectedDifficulty) {
                startGame(selectedDifficulty);
              }
            }}
            className="flex-1 px-4 py-2 md:px-6 md:py-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors text-sm md:text-base"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );

 // Also update the mobile navigation bar to show time taken when complete
{isMobile && !showWordList && (
  <div className="fixed bottom-0 left-0 right-0 bg-[#1a237e]/90 backdrop-blur-md border-t border-[#3949ab]/30 p-2 flex justify-between items-center z-30">
    {/* Other mobile navigation elements */}
    <div className="flex flex-col items-center p-2">
      <Clock className="w-5 h-5 text-blue-400 mb-1" />
      <span className="text-xs">
        {foundWords.length === wordsToFind.length && foundWords.length > 0
          ? `${Math.floor(timeTaken / 60)}:${(timeTaken % 60).toString().padStart(2, '0')}`
          : `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`
        }
      </span>
    </div>
  </div>
)}

  return (
    <div className="p-3 md:p-6 h-full">
      {gameState === 'menu' ? renderDifficultySelection() : renderGame()}
      {showSuccessModal && renderSuccessModal()}
        {isMobile && gameState === 'game' && (
          <button 
            onClick={() => setShowWordList(!showWordList)}
            className="fixed bottom-4 right-4 z-30 w-12 h-12 rounded-full bg-blue-500 shadow-lg flex items-center justify-center"
          >
            {showWordList ? <ArrowLeft className="w-6 h-6" /> : <Star className="w-6 h-6" />}
          </button>
        )}
      </div>
    );
  };


export default CryptoWordHunt;