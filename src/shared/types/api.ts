// Anime Faction Blitz API Types

export type Faction = {
  id: string;
  name: string;
  description: string;
  color: string;
  emblem: string;
  totalXP: number;
  memberCount: number;
};

export type Player = {
  userId: string;
  username: string;
  factionId: string | null;
  personalXP: number;
  level: number;
  joinedAt: number;
  lastActive: number;
};

export type Challenge = {
  id: string;
  type: 'reflex' | 'combo' | 'trivia';
  difficulty: 'easy' | 'medium' | 'hard';
  title: string;
  description: string;
  maxScore: number;
  timeLimit: number;
  xpReward: number;
};

export type ChallengeResult = {
  challengeId: string;
  userId: string;
  score: number;
  timeTaken: number;
  xpEarned: number;
  completedAt: number;
};

export type LeaderboardEntry = {
  factionId: string;
  factionName: string;
  totalXP: number;
  memberCount: number;
  rank: number;
  seasonXP: number;
  healthPercentage: number;
};

export type Season = {
  id: string;
  name: string;
  startDate: number;
  endDate: number;
  isActive: boolean;
};

// API Response Types
export type InitResponse = {
  type: 'init';
  postId: string;
  player: Player | null;
  factions: Faction[];
  leaderboard: LeaderboardEntry[];
  username: string;
  currentSeason: Season;
  timeUntilSeasonEnd: number;
};

export type JoinFactionResponse = {
  type: 'join_faction';
  success: boolean;
  player: Player;
  faction: Faction;
};

export type GetChallengesResponse = {
  type: 'get_challenges';
  challenges: Challenge[];
};

export type SubmitChallengeResponse = {
  type: 'submit_challenge';
  result: ChallengeResult;
  newXP: number;
  newLevel: number;
  factionXPGained: number;
};

export type GetLeaderboardResponse = {
  type: 'get_leaderboard';
  leaderboard: LeaderboardEntry[];
  lastUpdated: number;
  currentSeason: Season;
  timeUntilSeasonEnd: number;
};
