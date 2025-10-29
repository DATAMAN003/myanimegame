import { useState, useEffect } from 'react';

interface SeasonTimerProps {
  timeUntilEnd: number;
  seasonName: string;
}

export const SeasonTimer = ({ timeUntilEnd, seasonName }: SeasonTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(timeUntilEnd);

  useEffect(() => {
    setTimeLeft(timeUntilEnd);
  }, [timeUntilEnd]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else {
      return `${minutes}m ${seconds}s`;
    }
  };

  const getUrgencyColor = () => {
    const hoursLeft = timeLeft / (1000 * 60 * 60);
    if (hoursLeft < 1) return 'text-red-400 animate-pulse';
    if (hoursLeft < 24) return 'text-orange-400';
    return 'text-yellow-400';
  };

  return (
    <div className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
      <div className="text-center">
        <div className="text-sm text-purple-300 mb-1">⏰ CURRENT SEASON</div>
        <div className="text-lg font-bold text-white mb-2">{seasonName}</div>
        
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-sm text-gray-300">Season ends in:</span>
          <span className={`font-bold text-lg ${getUrgencyColor()}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
        
        {/* Progress bar showing season progress */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
            style={{ 
              width: `${Math.max(10, (timeLeft / (7 * 24 * 60 * 60 * 1000)) * 100)}%` 
            }}
          ></div>
        </div>
        
        <div className="text-xs text-gray-400">
          {timeLeft < 24 * 60 * 60 * 1000 ? (
            <span className="text-red-400 animate-pulse">⚠️ Season ending soon!</span>
          ) : (
            'Weekly rankings reset when season ends'
          )}
        </div>
      </div>
    </div>
  );
};
