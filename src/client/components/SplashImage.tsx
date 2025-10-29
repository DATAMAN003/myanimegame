interface SplashImageProps {
  className?: string;
}

export const SplashImage = ({ className = "" }: SplashImageProps) => {
  return (
    <div className={`relative ${className}`}>
      {/* Epic Battle Scene SVG */}
      <svg 
        viewBox="0 0 800 400" 
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Arena */}
        <defs>
          <radialGradient id="arenaGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.3"/>
            <stop offset="50%" stopColor="#FF4500" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#8B0000" stopOpacity="0.1"/>
          </radialGradient>
          
          <linearGradient id="swordGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FFFF" stopOpacity="0.8"/>
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1"/>
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0.8"/>
          </linearGradient>
          
          <filter id="energyGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Arena Background */}
        <rect width="800" height="400" fill="url(#arenaGlow)"/>
        
        {/* Energy Bursts */}
        <circle cx="200" cy="150" r="30" fill="#FFD700" opacity="0.6" filter="url(#energyGlow)">
          <animate attributeName="r" values="20;40;20" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite"/>
        </circle>
        
        <circle cx="600" cy="250" r="25" fill="#FF4500" opacity="0.7" filter="url(#energyGlow)">
          <animate attributeName="r" values="15;35;15" dur="1.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.4;0.9;0.4" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        
        {/* Left Fighter Silhouette (Hero) */}
        <g transform="translate(150, 200)">
          {/* Body */}
          <ellipse cx="0" cy="0" rx="15" ry="40" fill="#FF6B35" opacity="0.8"/>
          {/* Head */}
          <circle cx="0" cy="-50" r="20" fill="#FF6B35" opacity="0.8"/>
          {/* Sword */}
          <rect x="-5" y="-80" width="3" height="60" fill="url(#swordGlow)" filter="url(#energyGlow)">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite"/>
          </rect>
          {/* Energy Aura */}
          <circle cx="0" cy="-20" r="50" fill="#FFD700" opacity="0.2">
            <animate attributeName="r" values="40;60;40" dur="3s" repeatCount="indefinite"/>
          </circle>
        </g>
        
        {/* Right Fighter Silhouette (Villain) */}
        <g transform="translate(650, 200)">
          {/* Body */}
          <ellipse cx="0" cy="0" rx="15" ry="40" fill="#8B0000" opacity="0.8"/>
          {/* Head */}
          <circle cx="0" cy="-50" r="20" fill="#8B0000" opacity="0.8"/>
          {/* Dark Weapon */}
          <rect x="2" y="-75" width="4" height="55" fill="#4B0082" filter="url(#energyGlow)">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="1.2s" repeatCount="indefinite"/>
          </rect>
          {/* Dark Aura */}
          <circle cx="0" cy="-20" r="45" fill="#8B0000" opacity="0.3">
            <animate attributeName="r" values="35;55;35" dur="2.5s" repeatCount="indefinite"/>
          </circle>
        </g>
        
        {/* Clash Effect in Center */}
        <g transform="translate(400, 200)">
          <circle cx="0" cy="0" r="20" fill="#FFFFFF" opacity="0.9" filter="url(#energyGlow)">
            <animate attributeName="r" values="10;30;10" dur="0.8s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.5;1;0.5" dur="0.8s" repeatCount="indefinite"/>
          </circle>
          
          {/* Lightning Bolts */}
          <path d="M-20,-10 L-5,0 L-15,10 L0,0 L-10,15 L5,5 L15,-5 L0,0 L20,-15" 
                stroke="#00FFFF" strokeWidth="2" fill="none" opacity="0.8">
            <animate attributeName="opacity" values="0;1;0" dur="0.3s" repeatCount="indefinite"/>
          </path>
        </g>
        
        {/* Faction Banners */}
        <g transform="translate(100, 50)">
          <rect x="0" y="0" width="80" height="40" fill="#FF6B35" opacity="0.7" rx="5"/>
          <text x="40" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">HEROES</text>
        </g>
        
        <g transform="translate(620, 50)">
          <rect x="0" y="0" width="80" height="40" fill="#8B0000" opacity="0.7" rx="5"/>
          <text x="40" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">VILLAINS</text>
        </g>
        
        {/* Epic Title Backdrop */}
        <g transform="translate(400, 350)">
          <rect x="-150" y="-20" width="300" height="40" fill="rgba(0,0,0,0.7)" rx="20"/>
          <text x="0" y="5" textAnchor="middle" fill="#FFD700" fontSize="18" fontWeight="bold">
            SWORD & SUPERPOWER SHOWDOWN
          </text>
        </g>
      </svg>
    </div>
  );
};
