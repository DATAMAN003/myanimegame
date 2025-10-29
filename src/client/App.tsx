import { useState, useEffect } from 'react';
import { useAnimeGame } from './hooks/useAnimeGame';
import { SplashScreen } from './components/SplashScreen';
import { FactionSelection } from './components/FactionSelection';
import { Dashboard as GameDashboard } from './components/Dashboard';
import { ChallengeScreen } from './components/ChallengeScreen';
import { Leaderboard } from './components/Leaderboard';
import { Challenge } from '../shared/types/api';

type GameScreen = 'splash' | 'faction-select' | 'dashboard' | 'challenge' | 'leaderboard';

export const App = () => {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('splash');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const { gameState, loading, joinFaction, submitChallenge, refreshLeaderboard, resetGame, resetPlayer } = useAnimeGame();

  useEffect(() => {
    if (gameState.player?.factionId) {
      setCurrentScreen('dashboard');
    } else if (gameState.initialized && !gameState.player) {
      setCurrentScreen('faction-select');
    }
  }, [gameState.player, gameState.initialized]);

  const handleStartGame = () => {
    if (gameState.player?.factionId) {
      setCurrentScreen('dashboard');
    } else {
      setCurrentScreen('faction-select');
    }
  };

  const handleFactionJoin = async (factionId: string) => {
    const result = await joinFaction(factionId);
    if (result && result.success) {
      setCurrentScreen('dashboard');
    }
    return result;
  };

  const handleChallengeSelect = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setCurrentScreen('challenge');
  };

  const handleChallengeComplete = async (score: number, timeTaken: number) => {
    if (selectedChallenge) {
      await submitChallenge(selectedChallenge.id, score, timeTaken);
      setSelectedChallenge(null);
      setCurrentScreen('dashboard');
    }
  };

  const handleBackToDashboard = () => {
    setSelectedChallenge(null);
    setCurrentScreen('dashboard');
  };

  const handleShowLeaderboard = () => {
    refreshLeaderboard();
    setCurrentScreen('leaderboard');
  };

  if (loading && !gameState.initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white text-xl animate-pulse">Loading Anime Faction Blitz...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white overflow-hidden relative">
      {/* Epic Anime Battle Background for entire app - Based on your amazing image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: `linear-gradient(rgba(16, 16, 32, 0.85), rgba(8, 8, 24, 0.9)), url('data:image/svg+xml;base64,${btoa('<svg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="appBg" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="#1a1a2e"/><stop offset="50%" stop-color="#16213e"/><stop offset="100%" stop-color="#0f3460"/></radialGradient></defs><rect width="1200" height="800" fill="url(#appBg)"/><g opacity="0.1"><circle cx="200" cy="400" r="60" fill="#FF6B35"/><circle cx="1000" cy="400" r="60" fill="#8B0000"/><circle cx="300" cy="200" r="40" fill="#FFD700"/><circle cx="900" cy="600" r="40" fill="#4B0082"/></g><circle cx="600" cy="400" r="100" fill="#FFFFFF" opacity="0.05"><animate attributeName="r" values="80;120;80" dur="4s" repeatCount="indefinite"/></circle></svg>')}`
        }}
      ></div>
      {currentScreen === 'splash' && (
        <SplashScreen 
          onStartGame={handleStartGame} 
          onResetGame={resetGame}
          onResetPlayer={resetPlayer}
        />
      )}
      
      {currentScreen === 'faction-select' && (
        <FactionSelection 
          factions={gameState.factions}
          onJoinFaction={handleFactionJoin}
          loading={loading}
        />
      )}
      
      {currentScreen === 'dashboard' && gameState.player && (
        <GameDashboard
          player={gameState.player}
          challenges={gameState.challenges}
          leaderboard={gameState.leaderboard}
          onChallengeSelect={handleChallengeSelect}
          onShowLeaderboard={handleShowLeaderboard}
          currentSeason={gameState.currentSeason}
          timeUntilSeasonEnd={gameState.timeUntilSeasonEnd}
        />
      )}
      
      {currentScreen === 'challenge' && selectedChallenge && (
        <ChallengeScreen
          challenge={selectedChallenge}
          onComplete={handleChallengeComplete}
          onBack={handleBackToDashboard}
        />
      )}
      
      {currentScreen === 'leaderboard' && (
        <Leaderboard
          leaderboard={gameState.leaderboard}
          onBack={handleBackToDashboard}
          currentSeason={gameState.currentSeason}
          timeUntilSeasonEnd={gameState.timeUntilSeasonEnd}
        />
      )}
    </div>
  );
};
