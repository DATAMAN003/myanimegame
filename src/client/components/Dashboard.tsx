import { Player, Challenge, LeaderboardEntry } from '../../shared/types/api';
import { getFactionById } from '../../shared/data/factions';
import { HealthBar } from './HealthBar';
import { SeasonTimer } from './SeasonTimer';

interface DashboardProps {
  player: Player;
  challenges: Challenge[];
  leaderboard: LeaderboardEntry[];
  onChallengeSelect: (challenge: Challenge) => void;
  onShowLeaderboard: () => void;
  currentSeason?: any;
  timeUntilSeasonEnd?: number;
}

export const Dashboard = ({ 
  player, 
  challenges, 
  leaderboard, 
  onChallengeSelect, 
  onShowLeaderboard,
  currentSeason,
  timeUntilSeasonEnd = 0
}: DashboardProps) => {
  const playerFaction = getFactionById(player.factionId!);
  const playerFactionRank = leaderboard.find(entry => entry.factionId === player.factionId)?.rank || 0;
  const playerFactionHealth = leaderboard.find(entry => entry.factionId === player.factionId)?.healthPercentage || 100;

  const challengesByType = {
    reflex: challenges.filter(c => c.type === 'reflex'),
    combo: challenges.filter(c => c.type === 'combo'),
    trivia: challenges.filter(c => c.type === 'trivia'),
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 border-green-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'hard': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
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
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Season Timer */}
        {currentSeason && (
          <div className="mb-6 max-w-md mx-auto">
            <SeasonTimer 
              timeUntilEnd={timeUntilSeasonEnd} 
              seasonName={currentSeason.name} 
            />
            
            {/* Faction Change Notice */}
            {timeUntilSeasonEnd > 24 * 60 * 60 * 1000 && (
              <div className="mt-4 bg-blue-500/20 border border-blue-400/50 rounded-lg p-3 text-center">
                <div className="text-blue-300 text-sm">
                  🔒 Faction changes locked during season
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  You can change factions in the last 24 hours of the season
                </div>
              </div>
            )}
            
            {timeUntilSeasonEnd <= 24 * 60 * 60 * 1000 && (
              <div className="mt-4 bg-green-500/20 border border-green-400/50 rounded-lg p-3 text-center animate-pulse">
                <div className="text-green-300 text-sm">
                  🔓 Faction changes now available!
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Season ending soon - you can now choose a new faction
                </div>
              </div>
            )}
          </div>
        )}

        {/* Header with Player Info */}
        <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-xl p-6 mb-6 border-2 border-yellow-400/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Player Info */}
            <div className="flex items-center gap-4">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl border-4 animate-power-aura"
                style={{ 
                  backgroundColor: `${playerFaction?.color}30`,
                  borderColor: playerFaction?.color 
                }}
              >
                {playerFaction?.emblem}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">{player.username}</h2>
                <p className="text-gray-300 text-lg">
                  {playerFaction?.name} • Level {player.level}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-yellow-400 font-bold text-lg">{player.personalXP.toLocaleString()} XP</span>
                  <span className="text-gray-400">Faction Rank #{playerFactionRank}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4">
              <button
                onClick={onShowLeaderboard}
                className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-lg font-bold text-white hover:scale-105 transition-transform border-2 border-purple-400/50"
              >
                🏆 Leaderboard
              </button>
            </div>
          </div>

          {/* Player XP Progress Bar */}
          <div className="mt-6">
            <HealthBar
              current={player.personalXP % 1000}
              max={1000}
              label={`Level ${player.level} Progress`}
              color="#FFD700"
              showNumbers={true}
              animated={true}
            />
          </div>

          {/* Faction Health */}
          <div className="mt-4">
            <HealthBar
              current={playerFactionHealth}
              max={100}
              label={`${playerFaction?.name} Faction Health`}
              color={playerFaction?.color || '#FF4444'}
              showNumbers={false}
              animated={true}
            />
          </div>
        </div>

        {/* Top 3 Factions Preview */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">🏆 Top Factions This Season</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leaderboard.slice(0, 3).map((entry, index) => {
              const faction = getFactionById(entry.factionId);
              const isPlayerFaction = entry.factionId === player.factionId;
              return (
                <div 
                  key={entry.factionId}
                  className={`p-6 rounded-xl border-2 relative overflow-hidden ${
                    isPlayerFaction 
                      ? 'border-yellow-400 bg-yellow-400/20 animate-power-aura' 
                      : 'border-white/20 bg-white/5'
                  }`}
                >
                  {/* Rank Badge */}
                  <div className="absolute top-2 right-2">
                    <div className="text-3xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl mb-3">{faction?.emblem}</div>
                    <div className="font-bold text-white text-lg mb-2">{entry.factionName}</div>
                    <div className="text-yellow-400 font-bold mb-2">{entry.seasonXP.toLocaleString()} XP</div>
                    <div className="text-sm text-gray-300 mb-3">{entry.memberCount} warriors</div>
                    
                    {/* Mini Health Bar */}
                    <HealthBar
                      current={entry.healthPercentage}
                      max={100}
                      color={faction?.color || '#FF4444'}
                      showNumbers={false}
                      animated={false}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Challenge Categories */}
        <div className="space-y-6">
          {Object.entries(challengesByType).map(([type, typeChallenges]) => (
            <div key={type} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">{getChallengeTypeIcon(type)}</span>
                {type.charAt(0).toUpperCase() + type.slice(1)} Challenges
                <span className="text-sm text-gray-400 ml-auto">
                  {type === 'reflex' ? 'Sword Duels & Energy Bursts' : 
                   type === 'combo' ? 'Superpower Combinations' : 
                   'Anime Knowledge Battles'}
                </span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {typeChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    onClick={() => onChallengeSelect(challenge)}
                    className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6 border border-white/20 cursor-pointer hover:bg-white/20 hover:scale-105 transition-all duration-300 hover:border-white/40 relative overflow-hidden"
                  >
                    {/* Challenge Type Badge */}
                    <div className="absolute top-2 right-2 text-2xl">
                      {getChallengeTypeIcon(challenge.type)}
                    </div>

                    <div className="mb-4">
                      <h4 className="font-bold text-white text-xl mb-2">{challenge.title}</h4>
                      <span className={`text-xs px-3 py-1 rounded-full border font-bold ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                      {challenge.description}
                    </p>
                    
                    <div className="flex justify-between items-center text-sm text-gray-400 border-t border-white/20 pt-3">
                      <span>⏱️ {challenge.timeLimit / 1000}s</span>
                      <span>🎯 {challenge.maxScore} pts</span>
                      <span className="text-yellow-400 font-bold">+{challenge.xpReward} XP</span>
                    </div>

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
