import { useState, useEffect, useCallback } from 'react';

interface ReflexChallengeProps {
  onScore: (score: number) => void;
  gameState: string;
}

interface Target {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  createdAt: number;
}

export const ReflexChallenge = ({ onScore, gameState }: ReflexChallengeProps) => {
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15000); // 15 seconds
  const [nextTargetId, setNextTargetId] = useState(1);

  const colors = ['#FF6B35', '#F7931E', '#FFD23F', '#06FFA5', '#118AB2', '#8B5CF6'];

  const createTarget = useCallback(() => {
    if (gameState !== 'playing') return;

    const containerWidth = Math.max(window.innerWidth - 200, 300);
    const containerHeight = Math.max(window.innerHeight - 300, 200);
    const size = Math.random() * 30 + 40; // 40-70px

    const newTarget: Target = {
      id: nextTargetId,
      x: Math.random() * (containerWidth - size),
      y: Math.random() * (containerHeight - size),
      size,
      color: colors[Math.floor(Math.random() * colors.length)],
      createdAt: Date.now(),
    };

    setTargets(prev => [...prev, newTarget]);
    setNextTargetId(prev => prev + 1);

    // Remove target after 2 seconds if not clicked
    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== newTarget.id));
    }, 2000);
  }, [gameState, nextTargetId]);

  const hitTarget = useCallback((targetId: number) => {
    setTargets(prev => prev.filter(t => t.id !== targetId));
    const newScore = score + 10;
    setScore(newScore);
    
    // Immediately update parent with new score
    // Don't wait for game end to report score
  }, [score]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 100) {
          onScore(score); // Report final score
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [gameState, onScore, score]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const targetInterval = setInterval(() => {
      createTarget();
    }, 800); // Create target every 800ms

    return () => clearInterval(targetInterval);
  }, [createTarget, gameState]);

  // Initial target
  useEffect(() => {
    if (gameState === 'playing') {
      createTarget();
    }
  }, [gameState]);

  return (
    <div className="relative w-full h-[70vh] bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl border-2 border-white/20 overflow-hidden">
      {/* HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="bg-black/70 px-4 py-2 rounded-lg border border-yellow-400/50">
          <span className="text-yellow-400 font-bold text-xl">⚔️ Score: {score}</span>
        </div>
        <div className="bg-black/70 px-4 py-2 rounded-lg border border-red-400/50">
          <span className="text-red-400 font-bold text-xl">
            ⏱️ {Math.ceil(timeLeft / 1000)}s
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-center z-10">
        <p className="text-white/90 text-lg bg-black/70 px-6 py-3 rounded-lg border border-white/30">
          ⚔️ Strike the glowing energy orbs! Each hit = +10 points! ⚔️
        </p>
      </div>

      {/* Targets */}
      {targets.map((target) => (
        <div
          key={target.id}
          onClick={() => hitTarget(target.id)}
          className="absolute cursor-pointer transform transition-all duration-200 hover:scale-110 animate-pulse"
          style={{
            left: target.x,
            top: target.y + 100, // Offset for HUD
            width: target.size,
            height: target.size,
            backgroundColor: target.color,
            borderRadius: '50%',
            boxShadow: `0 0 30px ${target.color}, 0 0 60px ${target.color}50`,
            border: '4px solid white',
            animation: 'energyBurst 2s ease-in-out infinite',
          }}
        >
          <div className="w-full h-full rounded-full bg-white/40 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
          </div>
        </div>
      ))}

      {/* Combo Effects */}
      {score > 0 && score % 50 === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div className="text-6xl font-bold text-yellow-400 animate-bounce">
            🔥 COMBO! 🔥
          </div>
        </div>
      )}

      {/* Game Over State */}
      {gameState === 'completed' && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-30">
          <div className="text-center">
            <h3 className="text-5xl font-bold text-white mb-4">⚔️ BATTLE COMPLETE! ⚔️</h3>
            <p className="text-3xl text-yellow-400 mb-2">Final Score: {score}</p>
            <p className="text-xl text-gray-300">
              Targets Hit: {score / 10} | Accuracy: {targets.length === 0 ? '100%' : `${Math.round((score / 10) / (score / 10 + targets.length) * 100)}%`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
