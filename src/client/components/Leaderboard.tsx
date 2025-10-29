import { LeaderboardEntry } from '../../shared/types/api';
import { getFactionById } from '../../shared/data/factions';
import { HealthBar } from './HealthBar';
import { SeasonTimer } from './SeasonTimer';

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
  onBack: () => void;
  currentSeason?: any;
  timeUntilSeasonEnd?: number;
}

export const Leaderboard = ({ leaderboard, onBack, currentSeason, timeUntilSeasonEnd = 0 }: LeaderboardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-yellow-600';
      case 2: return 'from-gray-300 to-gray-500';
      case 3: return 'from-orange-400 to-orange-600';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </button>
          
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
            🏆 Faction Leaderboard
          </h1>
          
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        {/* Season Timer */}
        {currentSeason && (
          <div className="mb-8 max-w-md mx-auto">
            <SeasonTimer 
              timeUntilEnd={timeUntilSeasonEnd} 
              seasonName={currentSeason.name} 
            />
          </div>
        )}

        {/* Podium for Top 3 */}
        {leaderboard.length >= 3 && leaderboard[0] && leaderboard[1] && leaderboard[2] && (
          <div className="mb-12">
            <div className="flex items-end justify-center gap-4 mb-8">
              {/* 2nd Place */}
              <div className="text-center">
                <div className="bg-gradient-to-br from-gray-300 to-gray-500 rounded-xl p-6 mb-4 border-4 border-gray-400 transform hover:scale-105 transition-transform">
                  <div className="text-4xl mb-2">{getFactionById(leaderboard[1].factionId)?.emblem}</div>
                  <div className="text-white font-bold text-lg">{leaderboard[1].factionName}</div>
                  <div className="text-gray-200 text-sm">{leaderboard[1].totalXP.toLocaleString()} XP</div>
                  <div className="text-gray-300 text-xs">{leaderboard[1].memberCount} members</div>
                </div>
                <div className="text-6xl">🥈</div>
                <div className="bg-gray-400 h-20 w-full rounded-t-lg"></div>
              </div>

              {/* 1st Place */}
              <div className="text-center">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl p-8 mb-4 border-4 border-yellow-300 transform hover:scale-105 transition-transform shadow-2xl shadow-yellow-400/50">
                  <div className="text-5xl mb-2">{getFactionById(leaderboard[0].factionId)?.emblem}</div>
                  <div className="text-black font-bold text-xl">{leaderboard[0].factionName}</div>
                  <div className="text-black text-sm font-bold">{leaderboard[0].totalXP.toLocaleString()} XP</div>
                  <div className="text-black/80 text-xs">{leaderboard[0].memberCount} members</div>
                </div>
                <div className="text-8xl animate-bounce">🥇</div>
                <div className="bg-yellow-400 h-32 w-full rounded-t-lg"></div>
              </div>

              {/* 3rd Place */}
              <div className="text-center">
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl p-6 mb-4 border-4 border-orange-300 transform hover:scale-105 transition-transform">
                  <div className="text-4xl mb-2">{getFactionById(leaderboard[2].factionId)?.emblem}</div>
                  <div className="text-white font-bold text-lg">{leaderboard[2].factionName}</div>
                  <div className="text-orange-100 text-sm">{leaderboard[2].totalXP.toLocaleString()} XP</div>
                  <div className="text-orange-200 text-xs">{leaderboard[2].memberCount} members</div>
                </div>
                <div className="text-6xl">🥉</div>
                <div className="bg-orange-400 h-16 w-full rounded-t-lg"></div>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
            <h2 className="text-xl font-bold text-white text-center">Complete Rankings</h2>
          </div>
          
          <div className="divide-y divide-white/10">
            {leaderboard.map((entry, index) => {
              const faction = getFactionById(entry.factionId);
              const isTopThree = entry.rank <= 3;
              
              return (
                <div
                  key={entry.factionId}
                  className={`p-4 hover:bg-white/5 transition-colors ${
                    isTopThree ? 'bg-white/10' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {/* Rank and Faction Info */}
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        isTopThree ? `bg-gradient-to-r ${getRankColor(entry.rank)} text-white` : 'bg-gray-600 text-gray-300'
                      }`}>
                        {getRankIcon(entry.rank)}
                      </div>
                      
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2"
                        style={{ 
                          backgroundColor: `${faction?.color}20`,
                          borderColor: faction?.color 
                        }}
                      >
                        {faction?.emblem}
                      </div>
                      
                      <div>
                        <h3 className="text-white font-bold text-lg">{entry.factionName}</h3>
                        <p className="text-gray-400 text-sm">{entry.memberCount} active members</p>
                      </div>
                    </div>

                    {/* XP and Stats */}
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold text-xl">
                        {entry.totalXP.toLocaleString()} XP
                      </div>
                      <div className="text-gray-400 text-sm">
                        {entry.memberCount > 0 ? Math.round(entry.totalXP / entry.memberCount).toLocaleString() : 0} avg per member
                      </div>
                    </div>
                  </div>

                  {/* Health Bar */}
                  <div className="mt-3">
                    <HealthBar
                      current={entry.healthPercentage}
                      max={100}
                      label="Faction Health"
                      color={faction?.color || '#FF4444'}
                      showNumbers={false}
                      animated={true}
                    />
                  </div>

                  {/* XP Progress Bar for Visual Comparison */}
                  <div className="mt-2">
                    <div className="text-xs text-gray-400 mb-1">Season XP Progress</div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r ${getRankColor(entry.rank)}`}
                        style={{ 
                          width: `${leaderboard.length > 0 && leaderboard[0] ? (entry.seasonXP / leaderboard[0].seasonXP) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-white font-bold text-lg">
              {leaderboard.reduce((sum, entry) => sum + entry.totalXP, 0).toLocaleString()}
            </div>
            <div className="text-gray-400 text-sm">Total XP Earned</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
            <div className="text-2xl mb-2">👥</div>
            <div className="text-white font-bold text-lg">
              {leaderboard.reduce((sum, entry) => sum + entry.memberCount, 0)}
            </div>
            <div className="text-gray-400 text-sm">Active Warriors</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
            <div className="text-2xl mb-2">⚔️</div>
            <div className="text-white font-bold text-lg">{leaderboard.length}</div>
            <div className="text-gray-400 text-sm">Competing Factions</div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Leaderboard updates in real-time as warriors complete challenges
          </p>
        </div>
      </div>
    </div>
  );
};
