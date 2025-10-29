import { useState, useEffect } from 'react';

interface ComboChallengeProps {
  onScore: (score: number) => void;
  gameState: string;
}

const ANIME_COMBO_SEQUENCES = {
  easy: [
    { name: 'Kamehameha Wave', sequence: ['KA', 'ME', 'HA', 'ME', 'HA'], power: '🔥', color: '#FF6B35' },
    { name: 'Rasengan', sequence: ['RA', 'SEN', 'GAN'], power: '🌀', color: '#00A8CC' },
    { name: 'Chidori', sequence: ['CHI', 'DO', 'RI'], power: '⚡', color: '#FFD700' },
  ],
  medium: [
    { name: 'Spirit Gun', sequence: ['SPIRIT', 'GUN', 'FIRE'], power: '💥', color: '#8B5CF6' },
    { name: 'Getsuga Tensho', sequence: ['GET', 'SU', 'GA', 'TEN', 'SHO'], power: '🗡️', color: '#06FFA5' },
    { name: 'Fire Dragon Roar', sequence: ['FIRE', 'DRAGON', 'ROAR'], power: '🐉', color: '#F7931E' },
  ],
  hard: [
    { name: 'Domain Expansion', sequence: ['DO', 'MAIN', 'EX', 'PAN', 'SION', 'UN', 'LI', 'MIT', 'ED'], power: '🌌', color: '#7209B7' },
    { name: 'Ultra Instinct', sequence: ['UL', 'TRA', 'IN', 'STINCT', 'KA', 'ME', 'HA', 'ME', 'HA'], power: '✨', color: '#C0C0C0' },
    { name: 'Bankai Release', sequence: ['BAN', 'KAI', 'SEN', 'BON', 'ZA', 'KU', 'RA'], power: '⚔️', color: '#FF1493' },
  ],
};

export const ComboChallenge = ({ onScore, gameState }: ComboChallengeProps) => {
  const [currentCombo, setCurrentCombo] = useState(ANIME_COMBO_SEQUENCES.easy[0]);
  const [playerInput, setPlayerInput] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25000); // 25 seconds
  const [showSequence, setShowSequence] = useState(true);
  const [comboIndex, setComboIndex] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [feedback, setFeedback] = useState<'perfect' | 'good' | 'wrong' | null>(null);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [perfectStreak, setPerfectStreak] = useState(0);
  const [powerCharge, setPowerCharge] = useState(0);

  const availableInputs = ['KA', 'ME', 'HA', 'RA', 'SEN', 'GAN', 'CHI', 'DO', 'RI', 'SPIRIT', 'GUN', 'FIRE', 'GET', 'SU', 'GA', 'TEN', 'SHO', 'DRAGON', 'ROAR', 'MAIN', 'EX', 'PAN', 'SION', 'UN', 'LI', 'MIT', 'ED', 'UL', 'TRA', 'IN', 'STINCT', 'BAN', 'KAI', 'BON', 'ZA', 'KU'];

  useEffect(() => {
    if (gameState === 'playing') {
      // Show sequence for 4 seconds, then hide
      const timer = setTimeout(() => {
        setShowSequence(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [gameState, currentCombo]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 100) {
          onScore(score);
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [gameState, onScore, score]);

  const getNextCombo = () => {
    const sequences = ANIME_COMBO_SEQUENCES[difficulty];
    const nextIndex = (comboIndex + 1) % sequences.length;
    
    // Increase difficulty after completing all combos in current level
    if (nextIndex === 0) {
      if (difficulty === 'easy') {
        setDifficulty('medium');
        return ANIME_COMBO_SEQUENCES.medium[0];
      } else if (difficulty === 'medium') {
        setDifficulty('hard');
        return ANIME_COMBO_SEQUENCES.hard[0];
      }
    }
    
    return sequences[nextIndex];
  };

  const handleInputPress = (input: string) => {
    if (gameState !== 'playing' || showSequence) return;

    const newInput = [...playerInput, input];
    setPlayerInput(newInput);

    // Check if input matches sequence so far
    const isCorrectSoFar = newInput.every((inp, index) => inp === currentCombo.sequence[index]);

    if (!isCorrectSoFar) {
      // Wrong input - reset combo and lose multiplier
      setFeedback('wrong');
      setPlayerInput([]);
      setComboMultiplier(1);
      setPerfectStreak(0);
      setPowerCharge(Math.max(0, powerCharge - 20));
      setTimeout(() => setFeedback(null), 800);
      return;
    }

    // Check if sequence is complete
    if (newInput.length === currentCombo.sequence.length) {
      // Perfect combo completed!
      const basePoints = currentCombo.sequence.length * 20;
      const difficultyBonus = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2;
      const streakBonus = perfectStreak * 0.1 + 1;
      const totalPoints = Math.floor(basePoints * difficultyBonus * comboMultiplier * streakBonus);
      
      setScore(prev => prev + totalPoints);
      setFeedback('perfect');
      setPerfectStreak(prev => prev + 1);
      setComboMultiplier(prev => Math.min(prev + 0.5, 5)); // Max 5x multiplier
      setPowerCharge(prev => Math.min(prev + 25, 100));
      
      // Move to next combo
      setTimeout(() => {
        const nextCombo = getNextCombo();
        setCurrentCombo(nextCombo);
        setComboIndex(prev => (prev + 1) % ANIME_COMBO_SEQUENCES[difficulty].length);
        setPlayerInput([]);
        setShowSequence(true);
        setFeedback(null);
        
        // Hide sequence after 3 seconds for subsequent rounds
        setTimeout(() => {
          setShowSequence(false);
        }, 3000);
      }, 1500);
    } else {
      // Correct input so far
      setFeedback('good');
      setTimeout(() => setFeedback(null), 300);
    }
  };

  const getInputButtonStyle = (input: string) => {
    const isInCurrentSequence = currentCombo.sequence.includes(input);
    const isUsed = playerInput.includes(input);
    
    if (isUsed) {
      return 'bg-gradient-to-br from-green-500 to-green-600 text-white border-green-400 scale-95';
    }
    
    if (isInCurrentSequence) {
      return 'bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-blue-400 animate-pulse';
    }
    
    return 'bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-gray-300 border-gray-500';
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return '#22C55E';
      case 'medium': return '#F59E0B';
      case 'hard': return '#EF4444';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Epic HUD */}
      <div className="flex justify-between items-center mb-6 bg-black/70 rounded-xl p-4 border-2 border-yellow-400/50">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-yellow-400 font-bold text-xl">💥 {score}</div>
            <div className="text-xs text-gray-400">SCORE</div>
          </div>
          <div className="text-center">
            <div className="text-purple-400 font-bold text-lg">{comboMultiplier.toFixed(1)}x</div>
            <div className="text-xs text-gray-400">MULTIPLIER</div>
          </div>
          <div className="text-center">
            <div className="text-cyan-400 font-bold text-lg">{perfectStreak}</div>
            <div className="text-xs text-gray-400">STREAK</div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-white font-bold text-xl">{currentCombo.name}</div>
          <div className="text-xs" style={{ color: getDifficultyColor() }}>
            {difficulty.toUpperCase()} TECHNIQUE
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-red-400 font-bold text-xl">
            ⏱️ {Math.ceil(timeLeft / 1000)}s
          </div>
          <div className="text-xs text-gray-400">TIME LEFT</div>
        </div>
      </div>

      {/* Power Charge Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>⚡ POWER CHARGE</span>
          <span>{powerCharge}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4 border-2 border-yellow-400/30">
          <div 
            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
            style={{ width: `${powerCharge}%` }}
          >
            {powerCharge === 100 && (
              <div className="h-full w-full rounded-full bg-white/30 animate-pulse"></div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mb-6">
        <p className="text-white/90 text-lg bg-black/70 px-6 py-3 rounded-lg border border-white/30 inline-block">
          {showSequence ? `💥 Memorize the ${currentCombo.name} technique!` : `💥 Execute the ${currentCombo.name}!`}
        </p>
      </div>

      {/* Technique Display */}
      <div className="bg-gradient-to-br from-black/50 to-gray-900/50 rounded-xl p-8 mb-6 border-2 border-white/20 relative overflow-hidden">
        {/* Power Aura Effect */}
        <div 
          className="absolute inset-0 opacity-20 animate-pulse"
          style={{
            background: `radial-gradient(circle at center, ${currentCombo.color}60, transparent 70%)`
          }}
        ></div>

        <h3 className="text-white font-bold text-2xl mb-4 text-center flex items-center justify-center gap-3">
          <span className="text-4xl">{currentCombo.power}</span>
          {showSequence ? '⚡ TECHNIQUE SEQUENCE:' : '⚡ YOUR EXECUTION:'}
          <span className="text-4xl">{currentCombo.power}</span>
        </h3>
        
        <div className="flex justify-center gap-2 flex-wrap mb-6">
          {(showSequence ? currentCombo.sequence : playerInput).map((item, index) => (
            <div
              key={index}
              className="px-4 py-3 rounded-lg font-bold text-lg border-2 animate-pulse relative overflow-hidden"
              style={{
                backgroundColor: currentCombo.color + '40',
                borderColor: currentCombo.color,
                color: 'white',
                textShadow: `0 0 10px ${currentCombo.color}`,
                boxShadow: `0 0 20px ${currentCombo.color}50`,
              }}
            >
              {item}
              <div 
                className="absolute inset-0 bg-white/20 animate-pulse"
                style={{ animationDelay: `${index * 0.2}s` }}
              ></div>
            </div>
          ))}
          
          {!showSequence && playerInput.length < currentCombo.sequence.length && (
            <div className="px-4 py-3 bg-gray-600 text-gray-400 rounded-lg font-bold text-lg border-2 border-dashed border-gray-400">
              ?
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="text-center text-gray-300 text-sm mb-2">
            Technique Progress: {playerInput.length} / {currentCombo.sequence.length}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="h-3 rounded-full transition-all duration-300"
              style={{ 
                width: `${(playerInput.length / currentCombo.sequence.length) * 100}%`,
                background: `linear-gradient(90deg, ${currentCombo.color}, ${currentCombo.color}80)`
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-w-4xl mx-auto">
        {availableInputs.map((input) => (
          <button
            key={input}
            onClick={() => handleInputPress(input)}
            disabled={showSequence || gameState !== 'playing'}
            className={`px-3 py-2 rounded-lg font-bold text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 border-2 ${getInputButtonStyle(input)} ${
              showSequence || gameState !== 'playing' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            }`}
          >
            {input}
          </button>
        ))}
      </div>

      {/* Epic Feedback Effects */}
      {feedback && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          {feedback === 'perfect' && (
            <div className="text-center animate-bounce">
              <div className="text-8xl font-bold text-yellow-400 mb-4 animate-pulse">
                ✨ PERFECT TECHNIQUE! ✨
              </div>
              <div className="text-4xl text-white">
                {currentCombo.power} {currentCombo.name} {currentCombo.power}
              </div>
              <div className="text-2xl text-cyan-400 mt-2">
                +{Math.floor(currentCombo.sequence.length * 20 * comboMultiplier)} POINTS!
              </div>
            </div>
          )}
          {feedback === 'good' && (
            <div className="text-4xl font-bold text-green-400 animate-pulse">
              ✓ GOOD!
            </div>
          )}
          {feedback === 'wrong' && (
            <div className="text-center animate-bounce">
              <div className="text-6xl font-bold text-red-400 mb-2">
                ✗ TECHNIQUE FAILED!
              </div>
              <div className="text-2xl text-gray-300">
                Combo Reset! Try Again!
              </div>
            </div>
          )}
        </div>
      )}

      {/* Game Over State */}
      {gameState === 'completed' && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-center">
            <h3 className="text-6xl font-bold text-white mb-4">💥 TECHNIQUE MASTERY COMPLETE! 💥</h3>
            <p className="text-3xl text-yellow-400 mb-2">Final Score: {score}</p>
            <p className="text-xl text-gray-300 mb-2">
              Perfect Techniques: {perfectStreak}
            </p>
            <p className="text-xl text-gray-300">
              Max Multiplier: {comboMultiplier.toFixed(1)}x
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
