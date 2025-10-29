import { useState, useEffect } from 'react';
import { SplashImage } from './SplashImage';

interface SplashScreenProps {
  onStartGame: () => void;
  onResetGame?: () => void;
  onResetPlayer?: () => Promise<{ success: boolean; message: string } | void>;
}

export const SplashScreen = ({ onStartGame, onResetGame, onResetPlayer }: SplashScreenProps) => {
  const [animate, setAnimate] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleResetPlayer = async () => {
    if (onResetPlayer) {
      const result = await onResetPlayer();
      if (result && !result.success) {
        setResetMessage(result.message);
        setTimeout(() => setResetMessage(null), 5000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative overflow-hidden">
      {/* Epic Anime Battle Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
      ></div>

      {/* Main content */}
      <div className={`text-center z-10 transition-all duration-1000 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Epic Title with Battle Theme */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-red-500/20 to-blue-500/20 blur-3xl animate-pulse"></div>
          
          <h1 className="relative text-4xl md:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-orange-600 bg-clip-text text-transparent mb-2 animate-pulse drop-shadow-2xl">
            ⚔️ ANIME ⚔️
          </h1>
          <h2 className="relative text-3xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2 animate-pulse">
            FACTION
          </h2>
          <h3 className="relative text-2xl md:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-red-500 via-yellow-400 to-cyan-400 bg-clip-text text-transparent">
            💥 BLITZ 💥
          </h3>
          
          <p className="relative text-lg md:text-xl lg:text-2xl text-yellow-300 mt-4 font-bold animate-pulse">
            SWORD & SUPERPOWER SHOWDOWN
          </p>
        </div>

        {/* Epic Battle Image */}
        <div className="mb-8 max-w-4xl mx-auto">
          <SplashImage className="h-64 md:h-80 lg:h-96" />
        </div>

        {/* Epic Description */}
        <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto px-4 leading-relaxed">
          Choose your side in the ultimate anime battle! Master sword techniques, unleash devastating combos, 
          and prove your otaku knowledge in lightning-fast duels!
        </p>

        {/* Battle Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-6 border-2 border-red-500/30 hover:border-red-400 transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-3">⚔️</div>
            <h4 className="font-bold text-red-400 mb-2 text-lg">Sword Duels</h4>
            <p className="text-sm text-gray-300">Lightning-fast blade clashes and epic sword techniques!</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-6 border-2 border-blue-500/30 hover:border-blue-400 transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-3">💥</div>
            <h4 className="font-bold text-blue-400 mb-2 text-lg">Superpower Combos</h4>
            <p className="text-sm text-gray-300">Channel Ki, chakra, and magical powers in perfect sequences!</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-6 border-2 border-purple-500/30 hover:border-purple-400 transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-3">🧠</div>
            <h4 className="font-bold text-purple-400 mb-2 text-lg">Knowledge Battles</h4>
            <p className="text-sm text-gray-300">Test your anime mastery in intense trivia showdowns!</p>
          </div>
        </div>

        {/* Epic Battle Button */}
        <div className="flex flex-col gap-4 items-center">
          <button
            onClick={onStartGame}
            className="group relative px-12 py-6 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 rounded-full font-bold text-xl md:text-3xl text-white shadow-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-red-500/50 active:scale-95 border-4 border-yellow-400/50"
          >
            <span className="relative z-10 flex items-center gap-3">
              ⚔️ CHOOSE YOUR SIDE ⚔️
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-red-500 via-yellow-400 to-orange-500 rounded-full opacity-30 blur-lg group-hover:opacity-60 transition-opacity duration-300"></div>
          </button>

          {/* Reset Buttons for Testing */}
          <div className="flex flex-col gap-3 items-center">
            {resetMessage && (
              <div className="bg-red-500/90 text-white px-6 py-3 rounded-lg border-2 border-red-400 max-w-md text-center animate-pulse">
                ⚠️ {resetMessage}
              </div>
            )}
            
            <div className="flex gap-3">
              {onResetPlayer && (
                <button
                  onClick={handleResetPlayer}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full font-bold text-sm text-white hover:scale-105 transition-transform border-2 border-blue-500"
                >
                  🔄 Choose New Faction
                </button>
              )}
              {onResetGame && (
                <button
                  onClick={onResetGame}
                  className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full font-bold text-sm text-white hover:scale-105 transition-transform border-2 border-gray-500"
                >
                  🔄 Reset All Data
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Faction Rivalry Preview */}
        <div className="mt-12 max-w-6xl mx-auto px-4">
          <h4 className="text-xl font-bold text-yellow-400 mb-6">⚡ LEGENDARY RIVALRIES ⚡</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="flex items-center gap-2 bg-orange-600/20 px-3 py-2 rounded-full border border-orange-500/40 hover:border-orange-400 transition-colors">
              <span className="text-lg">🏴‍☠️</span>
              <span className="text-xs font-medium">Straw Hats</span>
            </div>
            <div className="flex items-center gap-2 bg-orange-700/20 px-3 py-2 rounded-full border border-orange-600/40 hover:border-orange-500 transition-colors">
              <span className="text-lg">🍃</span>
              <span className="text-xs font-medium">Konoha</span>
            </div>
            <div className="flex items-center gap-2 bg-green-700/20 px-3 py-2 rounded-full border border-green-600/40 hover:border-green-500 transition-colors">
              <span className="text-lg">🗡️</span>
              <span className="text-xs font-medium">Survey Corps</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-800/20 px-3 py-2 rounded-full border border-blue-600/40 hover:border-blue-500 transition-colors">
              <span className="text-lg">⚔️</span>
              <span className="text-xs font-medium">Soul Reapers</span>
            </div>
            <div className="flex items-center gap-2 bg-red-800/20 px-3 py-2 rounded-full border border-red-600/40 hover:border-red-500 transition-colors">
              <span className="text-lg">🌸</span>
              <span className="text-xs font-medium">Demon Slayers</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-400 mt-4">
            And 5 more legendary factions await! Each with their eternal rivals and unique powers!
          </p>
        </div>
      </div>
    </div>
  );
};
