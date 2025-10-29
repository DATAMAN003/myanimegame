interface HealthBarProps {
  current: number;
  max: number;
  color: string;
  label?: string;
  showNumbers?: boolean;
  animated?: boolean;
}

export const HealthBar = ({ 
  current, 
  max, 
  color = '#FF4444', 
  label, 
  showNumbers = true,
  animated = true 
}: HealthBarProps) => {
  const percentage = Math.min((current / max) * 100, 100);
  
  const getHealthColor = (percent: number) => {
    if (percent > 70) return '#22C55E'; // Green
    if (percent > 40) return '#EAB308'; // Yellow
    if (percent > 20) return '#F97316'; // Orange
    return '#EF4444'; // Red
  };

  const healthColor = color === '#FF4444' ? getHealthColor(percentage) : color;

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-white">{label}</span>
          {showNumbers && (
            <span className="text-xs text-gray-400">
              {current.toLocaleString()} / {max.toLocaleString()}
            </span>
          )}
        </div>
      )}
      
      <div className="relative w-full h-4 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
        {/* Background glow */}
        <div 
          className="absolute inset-0 opacity-20 animate-pulse"
          style={{ backgroundColor: healthColor }}
        ></div>
        
        {/* Health bar fill */}
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ 
            width: `${percentage}%`,
            backgroundColor: healthColor,
            boxShadow: `0 0 10px ${healthColor}50`
          }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          
          {/* Animated energy flow */}
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          )}
        </div>
        
        {/* Percentage text overlay */}
        {showNumbers && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white drop-shadow-lg">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
      
      {/* Critical health warning */}
      {percentage < 20 && (
        <div className="text-xs text-red-400 mt-1 animate-pulse font-bold">
          ⚠️ CRITICAL CONDITION!
        </div>
      )}
    </div>
  );
};
