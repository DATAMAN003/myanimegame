import { useState, useEffect } from 'react';
import { 
  Player, 
  Faction, 
  Challenge, 
  LeaderboardEntry,
  InitResponse,
  JoinFactionResponse,
  GetChallengesResponse,
  SubmitChallengeResponse,
  GetLeaderboardResponse
} from '../../shared/types/api';

interface GameState {
  initialized: boolean;
  player: Player | null;
  factions: Faction[];
  challenges: Challenge[];
  leaderboard: LeaderboardEntry[];
  username: string;
  currentSeason: any;
  timeUntilSeasonEnd: number;
}

export const useAnimeGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    initialized: false,
    player: null,
    factions: [],
    challenges: [],
    leaderboard: [],
    username: '',
    currentSeason: null,
    timeUntilSeasonEnd: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = async () => {
    try {
      setLoading(true);
      
      // Initialize game data
      const initResponse = await fetch('/api/init');
      const initData: InitResponse = await initResponse.json();
      
      // Get challenges
      const challengesResponse = await fetch('/api/challenges');
      const challengesData: GetChallengesResponse = await challengesResponse.json();

      setGameState({
        initialized: true,
        player: initData.player,
        factions: initData.factions,
        challenges: challengesData.challenges,
        leaderboard: initData.leaderboard,
        username: initData.username,
        currentSeason: initData.currentSeason,
        timeUntilSeasonEnd: initData.timeUntilSeasonEnd,
      });
    } catch (error) {
      console.error('Failed to initialize game:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinFaction = async (factionId: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/join-faction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ factionId }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setGameState(prev => ({
          ...prev,
          player: data.player,
          factions: prev.factions.map(f => 
            f.id === factionId ? data.faction : f
          ),
        }));
        
        // Refresh leaderboard after joining faction
        await refreshLeaderboard();
        return { success: true };
      } else {
        // Handle faction join error (season locked, etc.)
        console.error('Faction join failed:', data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Failed to join faction:', error);
      return { success: false, message: 'Failed to join faction' };
    } finally {
      setLoading(false);
    }
  };

  const submitChallenge = async (challengeId: string, score: number, timeTaken: number) => {
    try {
      setLoading(true);
      const response = await fetch('/api/submit-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, score, timeTaken }),
      });
      
      const data: SubmitChallengeResponse = await response.json();
      
      // Update player with new XP and level
      setGameState(prev => ({
        ...prev,
        player: prev.player ? {
          ...prev.player,
          personalXP: data.newXP,
          level: data.newLevel,
        } : null,
      }));

      // Refresh leaderboard after challenge completion
      await refreshLeaderboard();
      
      return data;
    } catch (error) {
      console.error('Failed to submit challenge:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const refreshLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      const data: GetLeaderboardResponse = await response.json();
      
      console.log('🏆 Leaderboard data received:', data.leaderboard);
      
      setGameState(prev => ({
        ...prev,
        leaderboard: data.leaderboard,
        currentSeason: data.currentSeason,
        timeUntilSeasonEnd: data.timeUntilSeasonEnd,
      }));
    } catch (error) {
      console.error('Failed to refresh leaderboard:', error);
    }
  };

  const resetGame = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reset-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        // Reinitialize the game after reset
        await initializeGame();
      }
    } catch (error) {
      console.error('Failed to reset game:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPlayer = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reset-player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Reinitialize the game after player reset
        await initializeGame();
        return { success: true, message: data.message };
      } else {
        // Season locked - show error message
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Failed to reset player:', error);
      return { success: false, message: 'Failed to reset player data' };
    } finally {
      setLoading(false);
    }
  };

  return {
    gameState,
    loading,
    joinFaction,
    submitChallenge,
    refreshLeaderboard,
    resetGame,
    resetPlayer,
  };
};
