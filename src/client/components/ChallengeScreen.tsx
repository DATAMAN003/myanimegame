import { useState, useEffect } from 'react';
import { Challenge } from '../../shared/types/api';
import { ReflexChallenge } from './challenges/ReflexChallenge';
import { ComboChallenge } from './challenges/ComboChallenge';
import { TriviaChallenge } from './challenges/TriviaChallenge';

interface ChallengeScreenProps {
  challenge: Challenge;
  onComplete: (score: number, timeTaken: number) => void;
  onBack: () => void;
}

export const ChallengeScreen = ({ challenge, onComplete, onBack }: ChallengeScreenProps) => {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'completed'>('ready');
  const [countdown, setCountdown] = useState(3);
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    if (gameState === 'ready' && countdown > 0) {
      const timer = setTimeout(() => {
        if (countdown === 1) {
          setGameState('playing');
          setStartTime(Date.now());
        } else {
          setCountdown(countdown - 1);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState, countdown]);

  const handleChallengeComplete = (score: number) => {
    const timeTaken = Date.now() - startTime;
    setGameState('completed');
    
    // Small delay to show completion screen, then call onComplete
    setTimeout(() => {
      onComplete(score, timeTaken);
    }, 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'from-green-500 to-green-600';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'hard': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getChallengeTypeIcon = (type: string) => {
    switch (type) {
      case 'reflex': return '⚔️';
      case 'combo': return '💥';
      case 'trivia': return '🧠';
      default: return '🎮';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/20 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
          >
            ← Back to Dashboard
          </button>
          
          <div className="text-center">
            <div className="flex items-center gap-2 justify-center mb-1">
              <span className="text-3xl">{getChallengeTypeIcon(challenge.type)}</span>
              <h1 className="text-2xl font-bold text-white">{challenge.title}</h1>
            </div>
            <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} text-white`}>
              {challenge.difficulty.toUpperCase()}
            </div>
          </div>

          <div className="text-right text-sm text-gray-300">
            <div>⏱️ {challenge.timeLimit / 1000}s</div>
            <div className="text-yellow-400">+{challenge.xpReward} XP</div>
          </div>
        </div>
      </div>

      {/* Challenge Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        {gameState === 'ready' && (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">{challenge.title}</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {challenge.description}
            </p>
            
            <div className="text-8xl font-bold text-white mb-4 animate-pulse">
              {countdown}
            </div>
            
            <p className="text-gray-400">Get ready for battle...</p>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="w-full max-w-6xl mx-auto">
            {challenge.type === 'reflex' && (
              <ReflexChallenge
                onScore={handleChallengeComplete}
                gameState={gameState}
              />
            )}
            {challenge.type === 'combo' && (
              <ComboChallenge
                onScore={handleChallengeComplete}
                gameState={gameState}
              />
            )}
            {challenge.type === 'trivia' && (
              <TriviaChallenge
                challenge={challenge}
                onScore={handleChallengeComplete}
                gameState={gameState}
              />
            )}
          </div>
        )}

        {gameState === 'completed' && (
          <div className="text-center">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-4xl font-bold text-white mb-4">Challenge Complete!</h2>
            <p className="text-xl text-gray-300 mb-4">
              Calculating your rewards...
            </p>
            <div className="animate-spin w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};
