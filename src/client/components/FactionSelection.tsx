import { useState } from 'react';
import { Faction } from '../../shared/types/api';
import { getRivalFactionId, getFactionPower, FACTION_RIVALRIES } from '../../shared/data/factions';

interface FactionSelectionProps {
  factions: Faction[];
  onJoinFaction: (factionId: string) => Promise<{ success: boolean; message?: string } | void>;
  loading: boolean;
}

export const FactionSelection = ({ factions, onJoinFaction, loading }: FactionSelectionProps) => {
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleJoinFaction = async () => {
    if (selectedFaction) {
      const result = await onJoinFaction(selectedFaction);
      if (result && !result.success) {
        setErrorMessage(result.message || 'Failed to join faction');
        setTimeout(() => setErrorMessage(null), 5000); // Clear after 5 seconds
      }
    }
  };

  const selectedFactionData = selectedFaction ? factions.find(f => f.id === selectedFaction) : null;
  const rivalFactionId = selectedFaction ? getRivalFactionId(selectedFaction) : null;
  const factionPower = selectedFaction ? getFactionPower(selectedFaction) : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-7xl mx-auto w-full">
        {/* Epic Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-6xl font-bold bg-gradient-to-r from-red-500 via-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4 animate-pulse">
            ⚔️ CHOOSE YOUR DESTINY ⚔️
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Join one of the legendary anime factions! Each has unique powers, eternal rivals, and epic battles awaiting!
          </p>
          <div className="mt-4 text-yellow-400 font-bold text-lg animate-pulse">
            💥 SWORD & SUPERPOWER SHOWDOWN 💥
          </div>
        </div>

        {/* Rivalry-Based Faction Grid */}
        <div className="space-y-8 mb-8">
          {FACTION_RIVALRIES.map((rivalry, index) => (
            <div key={index} className="bg-black/30 rounded-2xl p-6 border border-white/20">
              {/* Rivalry Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-red-400 mb-2">
                  ⚔️ ETERNAL RIVALRY #{index + 1} ⚔️
                </h3>
                <div className="flex items-center justify-center gap-4">
                  <span className="text-blue-400 font-bold">HEROES</span>
                  <span className="text-3xl text-yellow-400 animate-pulse">VS</span>
                  <span className="text-red-400 font-bold">VILLAINS</span>
                </div>
              </div>

              {/* Faction Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                {/* Hero Faction */}
                <div
                  onClick={() => setSelectedFaction(rivalry.heroes.id)}
                  className={`relative cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                    selectedFaction === rivalry.heroes.id
                      ? 'ring-4 ring-blue-400 scale-105 shadow-2xl shadow-blue-400/50'
                      : 'hover:ring-2 hover:ring-blue-400/50'
                  }`}
                >
                  <div
                    className="bg-gradient-to-br p-6 rounded-xl border-2 backdrop-blur-sm h-full relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${rivalry.heroes.color}40, ${rivalry.heroes.color}20)`,
                      borderColor: selectedFaction === rivalry.heroes.id ? '#60A5FA' : rivalry.heroes.color + '60',
                    }}
                  >
                    {/* Hero Badge */}
                    <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      HERO
                    </div>

                    {/* Power Aura Effect */}
                    <div 
                      className="absolute inset-0 opacity-20 animate-pulse"
                      style={{
                        background: `radial-gradient(circle at center, ${rivalry.heroes.color}60, transparent 70%)`
                      }}
                    ></div>

                    {/* Faction Content */}
                    <div className="text-center mb-4 relative z-10 pt-6">
                      <div className="text-6xl mb-3 animate-bounce">{rivalry.heroes.emblem}</div>
                      <h4 className="text-xl font-bold text-white mb-2">{rivalry.heroes.name}</h4>
                      <div className="text-sm text-blue-300 font-semibold mb-3">
                        {getFactionPower(rivalry.heroes.id)}
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 text-center leading-relaxed relative z-10">
                      {rivalry.heroes.description}
                    </p>

                    {/* Stats */}
                    <div className="flex justify-between text-xs text-gray-400 border-t border-white/20 pt-3 relative z-10">
                      <div className="text-center">
                        <div className="font-bold text-white">{rivalry.heroes.totalXP.toLocaleString()}</div>
                        <div>Battle XP</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-white">{rivalry.heroes.memberCount}</div>
                        <div>Warriors</div>
                      </div>
                    </div>

                    {/* Selection indicator */}
                    {selectedFaction === rivalry.heroes.id && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg animate-pulse shadow-lg">
                        ⚔️
                      </div>
                    )}
                  </div>
                </div>

                {/* VS Divider */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 hidden md:block">
                  <div className="bg-gradient-to-r from-red-600 via-yellow-400 to-red-600 rounded-full w-16 h-16 flex items-center justify-center border-4 border-white shadow-2xl animate-pulse">
                    <span className="text-white font-bold text-xl">VS</span>
                  </div>
                </div>

                {/* Villain Faction */}
                <div
                  onClick={() => setSelectedFaction(rivalry.villains.id)}
                  className={`relative cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                    selectedFaction === rivalry.villains.id
                      ? 'ring-4 ring-red-400 scale-105 shadow-2xl shadow-red-400/50'
                      : 'hover:ring-2 hover:ring-red-400/50'
                  }`}
                >
                  <div
                    className="bg-gradient-to-br p-6 rounded-xl border-2 backdrop-blur-sm h-full relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${rivalry.villains.color}40, ${rivalry.villains.color}20)`,
                      borderColor: selectedFaction === rivalry.villains.id ? '#F87171' : rivalry.villains.color + '60',
                    }}
                  >
                    {/* Villain Badge */}
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      VILLAIN
                    </div>

                    {/* Power Aura Effect */}
                    <div 
                      className="absolute inset-0 opacity-20 animate-pulse"
                      style={{
                        background: `radial-gradient(circle at center, ${rivalry.villains.color}60, transparent 70%)`
                      }}
                    ></div>

                    {/* Faction Content */}
                    <div className="text-center mb-4 relative z-10 pt-6">
                      <div className="text-6xl mb-3 animate-bounce">{rivalry.villains.emblem}</div>
                      <h4 className="text-xl font-bold text-white mb-2">{rivalry.villains.name}</h4>
                      <div className="text-sm text-red-300 font-semibold mb-3">
                        {getFactionPower(rivalry.villains.id)}
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 text-center leading-relaxed relative z-10">
                      {rivalry.villains.description}
                    </p>

                    {/* Stats */}
                    <div className="flex justify-between text-xs text-gray-400 border-t border-white/20 pt-3 relative z-10">
                      <div className="text-center">
                        <div className="font-bold text-white">{rivalry.villains.totalXP.toLocaleString()}</div>
                        <div>Battle XP</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-white">{rivalry.villains.memberCount}</div>
                        <div>Warriors</div>
                      </div>
                    </div>

                    {/* Selection indicator */}
                    {selectedFaction === rivalry.villains.id && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-red-400 to-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg animate-pulse shadow-lg">
                        ⚔️
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 max-w-2xl mx-auto">
            <div className="bg-red-500/90 text-white px-6 py-4 rounded-xl border-2 border-red-400 text-center animate-pulse">
              <div className="text-lg font-bold mb-2">⚠️ Faction Change Blocked</div>
              <div className="text-sm">{errorMessage}</div>
            </div>
          </div>
        )}

        {/* Selected Faction Details */}
        {selectedFactionData && (
          <div className="mb-8 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-xl p-6 border-2 border-yellow-400/50 max-w-4xl mx-auto">
            <div className="text-center mb-4">
              <h4 className="text-2xl font-bold text-yellow-400 mb-2">
                {selectedFactionData.emblem} {selectedFactionData.name} {selectedFactionData.emblem}
              </h4>
              <p className="text-lg text-white font-semibold">{factionPower}</p>
            </div>
            
            {rivalFactionId && (
              <div className="text-center mb-4">
                <p className="text-red-400 font-bold text-lg">
                  ⚔️ ETERNAL RIVAL: {rivalFactionId.replace('_', ' ').toUpperCase()} ⚔️
                </p>
                <p className="text-gray-300 text-sm">
                  Face your destined enemies in epic showdowns!
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-red-500/20 rounded-lg p-4 border border-red-500/30">
                <div className="text-3xl mb-2">⚔️</div>
                <div className="text-red-400 font-bold">Sword Mastery</div>
                <div className="text-sm text-gray-300">Dominate blade duels</div>
              </div>
              <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
                <div className="text-3xl mb-2">💥</div>
                <div className="text-blue-400 font-bold">Power Combos</div>
                <div className="text-sm text-gray-300">Unleash devastating attacks</div>
              </div>
              <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-500/30">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-purple-400 font-bold">Faction Glory</div>
                <div className="text-sm text-gray-300">Climb the leaderboards</div>
              </div>
            </div>
          </div>
        )}

        {/* Epic Join Button */}
        <div className="text-center">
          <button
            onClick={handleJoinFaction}
            disabled={!selectedFaction || loading}
            className={`relative px-12 py-6 rounded-full font-bold text-xl md:text-2xl transition-all duration-300 border-4 ${
              selectedFaction && !loading
                ? 'bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 text-white shadow-2xl hover:scale-110 hover:shadow-red-500/50 active:scale-95 border-yellow-400/50'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed border-gray-500'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                Joining the Battle...
              </span>
            ) : selectedFaction ? (
              <span className="flex items-center gap-3">
                ⚔️ JOIN THE BATTLE ⚔️
              </span>
            ) : (
              'Choose Your Faction First'
            )}
            
            {/* Button glow effect */}
            {selectedFaction && !loading && (
              <div className="absolute -inset-2 bg-gradient-to-r from-red-500 via-yellow-400 to-orange-500 rounded-full opacity-30 blur-lg animate-pulse"></div>
            )}
          </button>
        </div>

        {/* Battle Preview */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-4">
            Once you join, you'll face legendary challenges and epic rival battles!
          </p>
          <div className="flex justify-center gap-6 text-2xl">
            <span className="animate-pulse">⚔️</span>
            <span className="animate-bounce">💥</span>
            <span className="animate-pulse">🔥</span>
            <span className="animate-bounce">⚡</span>
            <span className="animate-pulse">🌟</span>
          </div>
        </div>
      </div>
    </div>
  );
};
