import express from 'express';
import { 
  InitResponse, 
  JoinFactionResponse, 
  GetChallengesResponse, 
  SubmitChallengeResponse,
  GetLeaderboardResponse,
  Player,
  Faction,
  ChallengeResult,
  LeaderboardEntry
} from '../shared/types/api';
import { redis, reddit, createServer, context, getServerPort } from '@devvit/web/server';
import { createPost } from './core/post';
import { FACTIONS, getFactionById } from '../shared/data/factions';
import { CHALLENGES, getChallengeById } from '../shared/data/challenges';
import { getRandomQuestions } from '../shared/data/triviaQuestions';

// Old generateLeaderboard function removed - using the new one with health bars at the end of file

// Helper function to calculate level from XP
function calculateLevel(xp: number): number {
  return Math.floor(xp / 1000) + 1;
}

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

const router = express.Router();

router.get<{ postId: string }, InitResponse | { status: string; message: string }>(
  '/api/init',
  async (_req, res): Promise<void> => {
    const { postId } = context;

    if (!postId) {
      console.error('API Init Error: postId not found in devvit context');
      res.status(400).json({
        status: 'error',
        message: 'postId is required but missing from context',
      });
      return;
    }

    try {
      const username = await reddit.getCurrentUsername();
      const userId = username ?? 'anonymous';

      // Get player data
      const playerData = await redis.get(`player:${userId}`);
      let player: Player | null = null;
      
      if (playerData) {
        player = JSON.parse(playerData);
        // Update last active
        if (player) {
          player.lastActive = Date.now();
          await redis.set(`player:${userId}`, JSON.stringify(player));
        }
      }

      // Get faction data with current XP and member counts
      const factions: Faction[] = [];
      for (const faction of FACTIONS) {
        const totalXP = await redis.get(`faction:${faction.id}:xp`) || '0';
        const memberCount = await redis.get(`faction:${faction.id}:members`) || '0';
        console.log(`[INIT] Loading faction ${faction.id} - XP: ${totalXP}, Members: ${memberCount}`);
        factions.push({
          ...faction,
          totalXP: parseInt(totalXP),
          memberCount: parseInt(memberCount),
        });
      }

      // Get leaderboard
      const leaderboard = await generateLeaderboard(factions);

      res.json({
        type: 'init',
        postId: postId,
        player,
        factions,
        leaderboard,
        username: userId,
        currentSeason: getCurrentSeason(),
        timeUntilSeasonEnd: getTimeUntilSeasonEnd(),
      });
    } catch (error) {
      console.error(`API Init Error for post ${postId}:`, error);
      let errorMessage = 'Unknown error during initialization';
      if (error instanceof Error) {
        errorMessage = `Initialization failed: ${error.message}`;
      }
      res.status(400).json({ status: 'error', message: errorMessage });
    }
  }
);

router.post<{}, JoinFactionResponse | { status: string; message: string }, { factionId: string }>(
  '/api/join-faction',
  async (req, res): Promise<void> => {
    try {
      const { factionId } = req.body;
      const username = await reddit.getCurrentUsername();
      const userId = username ?? 'anonymous';

      const faction = getFactionById(factionId);
      if (!faction) {
        res.status(400).json({ status: 'error', message: 'Invalid faction ID' });
        return;
      }

      // Check if player already exists and has a faction
      const existingPlayerData = await redis.get(`player:${userId}`);
      let player: Player;

      if (existingPlayerData) {
        player = JSON.parse(existingPlayerData);
        
        // If player already has a faction, check if season allows changes
        if (player.factionId) {
          const timeUntilSeasonEnd = getTimeUntilSeasonEnd();
          const canChangeFaction = timeUntilSeasonEnd <= 24 * 60 * 60 * 1000; // 24 hours
          
          if (!canChangeFaction) {
            const hoursLeft = Math.floor(timeUntilSeasonEnd / (1000 * 60 * 60));
            res.status(400).json({
              status: 'error',
              message: `🔒 You're already in a faction! Faction changes are locked during the season. You can change factions in ${hoursLeft} hours when the season ends.`,
            });
            return;
          }
          
          // Remove from old faction (season end allows this)
          await redis.incrBy(`faction:${player.factionId}:members`, -1);
          console.log(`🔄 Removed player from faction ${player.factionId} (season ending)`);
        }
      } else {
        // Create new player (first time joining)
        player = {
          userId,
          username: userId,
          factionId: null,
          personalXP: 0,
          level: 1,
          joinedAt: Date.now(),
          lastActive: Date.now(),
        };
      }

      // Update player faction
      player.factionId = factionId;
      player.lastActive = Date.now();
      if (!existingPlayerData) {
        player.joinedAt = Date.now(); // Set join time for new players
      }

      // Save player data
      await redis.set(`player:${userId}`, JSON.stringify(player));

      // Update faction member count
      await redis.incrBy(`faction:${factionId}:members`, 1);
      console.log(`✅ Player ${userId} joined faction ${factionId}`);

      // Get updated faction data
      const totalXP = await redis.get(`faction:${factionId}:xp`) || '0';
      const memberCount = await redis.get(`faction:${factionId}:members`) || '0';
      console.log(`Faction ${factionId} - XP: ${totalXP}, Members: ${memberCount}`);
      const updatedFaction: Faction = {
        ...faction,
        totalXP: parseInt(totalXP),
        memberCount: parseInt(memberCount),
      };

      res.json({
        type: 'join_faction',
        success: true,
        player,
        faction: updatedFaction,
      });
    } catch (error) {
      console.error('Join faction error:', error);
      res.status(500).json({ status: 'error', message: 'Failed to join faction' });
    }
  }
);

router.get<{}, GetChallengesResponse | { status: string; message: string }>(
  '/api/challenges',
  async (_req, res): Promise<void> => {
    try {
      res.json({
        type: 'get_challenges',
        challenges: CHALLENGES,
      });
    } catch (error) {
      console.error('Get challenges error:', error);
      res.status(500).json({ status: 'error', message: 'Failed to get challenges' });
    }
  }
);

router.post<{}, SubmitChallengeResponse | { status: string; message: string }, { challengeId: string; score: number; timeTaken: number }>(
  '/api/submit-challenge',
  async (req, res): Promise<void> => {
    try {
      const { challengeId, score, timeTaken } = req.body;
      const username = await reddit.getCurrentUsername();
      const userId = username ?? 'anonymous';

      const challenge = getChallengeById(challengeId);
      if (!challenge) {
        res.status(400).json({ status: 'error', message: 'Invalid challenge ID' });
        return;
      }

      // Get player data
      const playerData = await redis.get(`player:${userId}`);
      if (!playerData) {
        res.status(400).json({ status: 'error', message: 'Player not found' });
        return;
      }

      const player: Player = JSON.parse(playerData);
      if (!player.factionId) {
        res.status(400).json({ status: 'error', message: 'Player must join a faction first' });
        return;
      }

      // Calculate XP based on performance
      const performanceRatio = Math.min(score / challenge.maxScore, 1);
      const timeBonus = Math.max(0, (challenge.timeLimit - timeTaken) / challenge.timeLimit * 0.2);
      const xpEarned = Math.floor(challenge.xpReward * (performanceRatio + timeBonus));
      
      console.log(`Challenge completed - Score: ${score}, XP Earned: ${xpEarned}`);

      // Update player XP and level
      player.personalXP += xpEarned;
      const newLevel = Math.floor(player.personalXP / 1000) + 1;
      player.level = newLevel;
      player.lastActive = Date.now();

      // Save updated player data
      await redis.set(`player:${userId}`, JSON.stringify(player));

      // Update faction XP
      await redis.incrBy(`faction:${player.factionId}:xp`, xpEarned);

      // Create challenge result
      const result: ChallengeResult = {
        challengeId,
        userId,
        score,
        timeTaken,
        xpEarned,
        completedAt: Date.now(),
      };

      // Save challenge result for history
      await redis.set(`result:${userId}:${challengeId}:${Date.now()}`, JSON.stringify(result));

      res.json({
        type: 'submit_challenge',
        result,
        newXP: player.personalXP,
        newLevel: player.level,
        factionXPGained: xpEarned,
      });
    } catch (error) {
      console.error('Submit challenge error:', error);
      res.status(500).json({ status: 'error', message: 'Failed to submit challenge' });
    }
  }
);

router.get<{}, GetLeaderboardResponse | { status: string; message: string }>(
  '/api/leaderboard',
  async (_req, res): Promise<void> => {
    try {
      // Get faction data with current XP and member counts
      const factions: Faction[] = [];
      for (const faction of FACTIONS) {
        const totalXP = await redis.get(`faction:${faction.id}:xp`) || '0';
        const memberCount = await redis.get(`faction:${faction.id}:members`) || '0';
        console.log(`[LEADERBOARD] Faction ${faction.id} - XP: ${totalXP}, Members: ${memberCount}`);
        factions.push({
          ...faction,
          totalXP: parseInt(totalXP),
          memberCount: parseInt(memberCount),
        });
      }

      const leaderboard = await generateLeaderboard(factions);

      res.json({
        type: 'get_leaderboard',
        leaderboard,
        lastUpdated: Date.now(),
        currentSeason: getCurrentSeason(),
        timeUntilSeasonEnd: getTimeUntilSeasonEnd(),
      });
    } catch (error) {
      console.error('Get leaderboard error:', error);
      res.status(500).json({ status: 'error', message: 'Failed to get leaderboard' });
    }
  }
);

router.get<{}, { questions: any[] } | { status: string; message: string }, {}, { difficulty?: string; count?: string }>(
  '/api/trivia-questions',
  async (req, res): Promise<void> => {
    try {
      const difficulty = (req.query.difficulty as 'easy' | 'medium' | 'hard') || 'easy';
      const count = parseInt(req.query.count as string) || 3;

      const questions = getRandomQuestions(difficulty, count);
      
      res.json({
        questions: questions.map(q => ({
          id: q.id,
          question: q.question,
          options: q.options,
          category: q.category,
          correctAnswer: q.correctAnswer, // Include correct answer for client validation
        })),
      });
    } catch (error) {
      console.error('Get trivia questions error:', error);
      res.status(500).json({ status: 'error', message: 'Failed to get trivia questions' });
    }
  }
);

// Reset endpoint for testing
router.post('/api/reset-game', async (_req, res): Promise<void> => {
  try {
    // Clear all Redis data
    const keys = await redis.hKeys('*');
    if (keys.length > 0) {
      for (const key of keys) {
        await redis.del(key);
      }
    }
    console.log('🔄 Game data reset - all Redis keys cleared');
    
    res.json({
      status: 'success',
      message: 'Game data reset successfully',
    });
  } catch (error) {
    console.error('Reset game error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to reset game data' });
  }
});

// Reset player only (keep faction data) - only allowed at season end
router.post('/api/reset-player', async (_req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    const userId = username ?? 'anonymous';
    
    // Check if season is ending soon (within 24 hours)
    const timeUntilSeasonEnd = getTimeUntilSeasonEnd();
    const canChangeFaction = timeUntilSeasonEnd <= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    if (!canChangeFaction) {
      const hoursLeft = Math.floor(timeUntilSeasonEnd / (1000 * 60 * 60));
      res.status(400).json({
        status: 'error',
        message: `Faction changes are locked during the season! You can change factions in ${hoursLeft} hours when the season ends.`,
      });
      return;
    }
    
    // Get current player data to remove from faction
    const playerData = await redis.get(`player:${userId}`);
    if (playerData) {
      const player = JSON.parse(playerData);
      if (player.factionId) {
        // Remove from current faction
        await redis.incrBy(`faction:${player.factionId}:members`, -1);
        console.log(`🔄 Removed player from faction ${player.factionId} (season ending)`);
      }
    }
    
    // Clear player data
    await redis.del(`player:${userId}`);
    console.log(`🔄 Player ${userId} data reset for new season`);
    
    res.json({
      status: 'success',
      message: 'Player data reset successfully - choose your new faction!',
    });
  } catch (error) {
    console.error('Reset player error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to reset player data' });
  }
});

router.post('/internal/on-app-install', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      status: 'success',
      message: `Post created in subreddit ${context.subredditName} with id ${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

router.post('/internal/menu/post-create', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

// Use router middleware
app.use(router);

// Get port from environment variable with fallback
const port = getServerPort();

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(port);
// Season management
function getCurrentSeason() {
  const now = Date.now();
  const seasonStart = new Date();
  seasonStart.setDate(seasonStart.getDate() - (seasonStart.getDay() || 7)); // Start of current week
  seasonStart.setHours(0, 0, 0, 0);
  
  const seasonEnd = new Date(seasonStart);
  seasonEnd.setDate(seasonEnd.getDate() + 7); // End of current week
  
  return {
    id: `season_${seasonStart.getTime()}`,
    name: `Battle Season ${Math.floor(seasonStart.getTime() / (7 * 24 * 60 * 60 * 1000)) % 52 + 1}`,
    startDate: seasonStart.getTime(),
    endDate: seasonEnd.getTime(),
    isActive: now >= seasonStart.getTime() && now < seasonEnd.getTime(),
  };
}

function getTimeUntilSeasonEnd(): number {
  const season = getCurrentSeason();
  return Math.max(0, season.endDate - Date.now());
}

// Helper function to generate leaderboard with health bars
async function generateLeaderboard(factions: Faction[]): Promise<LeaderboardEntry[]> {
  const maxXP = Math.max(...factions.map(f => f.totalXP), 1);
  console.log(`[LEADERBOARD] Generating leaderboard with ${factions.length} factions, maxXP: ${maxXP}`);
  
  const leaderboard: LeaderboardEntry[] = factions
    .map(faction => {
      // Calculate health percentage based on recent activity and XP
      const healthPercentage = Math.min(100, (faction.totalXP / maxXP) * 100 + 
        (faction.memberCount > 0 ? 20 : 0)); // Bonus for having active members
      
      const entry = {
        factionId: faction.id,
        factionName: faction.name,
        totalXP: faction.totalXP,
        memberCount: faction.memberCount,
        rank: 0,
        seasonXP: faction.totalXP, // For now, same as total XP
        healthPercentage: Math.max(10, healthPercentage), // Minimum 10% health
      };
      
      console.log(`[LEADERBOARD] Entry for ${faction.name}: XP=${entry.totalXP}, Members=${entry.memberCount}, Health=${entry.healthPercentage}%`);
      return entry;
    })
    .sort((a, b) => b.totalXP - a.totalXP)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

  return leaderboard;
}
