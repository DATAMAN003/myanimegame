import { Challenge } from '../types/api';

export const CHALLENGES: Challenge[] = [
  // Sword Duel Challenges (Reflex-based)
  {
    id: 'sword_duel_easy',
    type: 'reflex',
    difficulty: 'easy',
    title: 'Blade Clash',
    description: 'Strike the glowing sword targets! Channel your inner swordsman!',
    maxScore: 100,
    timeLimit: 12000, // 12 seconds
    xpReward: 75,
  },
  {
    id: 'sword_duel_medium',
    type: 'reflex',
    difficulty: 'medium',
    title: 'Steel Storm',
    description: 'Parry and counter-attack! Multiple blade strikes incoming!',
    maxScore: 200,
    timeLimit: 18000, // 18 seconds
    xpReward: 150,
  },
  {
    id: 'sword_duel_hard',
    type: 'reflex',
    difficulty: 'hard',
    title: 'Legendary Duel',
    description: 'Face the ultimate swordmaster! Lightning-fast blade work required!',
    maxScore: 300,
    timeLimit: 25000, // 25 seconds
    xpReward: 300,
  },

  // Superpower Combo Challenges
  {
    id: 'power_combo_easy',
    type: 'combo',
    difficulty: 'easy',
    title: 'Basic Jutsu',
    description: 'Master the hand signs: Tiger → Snake → Dragon',
    maxScore: 100,
    timeLimit: 15000,
    xpReward: 80,
  },
  {
    id: 'power_combo_medium',
    type: 'combo',
    difficulty: 'medium',
    title: 'Kamehameha Wave',
    description: 'Channel your Ki! Execute the perfect energy blast sequence!',
    maxScore: 200,
    timeLimit: 20000,
    xpReward: 160,
  },
  {
    id: 'power_combo_hard',
    type: 'combo',
    difficulty: 'hard',
    title: 'Domain Expansion',
    description: 'Ultimate technique! Master the most complex power sequence!',
    maxScore: 300,
    timeLimit: 30000,
    xpReward: 320,
  },

  // Energy Burst Challenges (Reflex)
  {
    id: 'energy_burst_easy',
    type: 'reflex',
    difficulty: 'easy',
    title: 'Spirit Bomb',
    description: 'Gather energy orbs before they fade! Feel the power!',
    maxScore: 120,
    timeLimit: 10000,
    xpReward: 60,
  },
  {
    id: 'energy_burst_medium',
    type: 'reflex',
    difficulty: 'medium',
    title: 'Rasengan Rush',
    description: 'Multiple energy spheres! Hit them all with perfect timing!',
    maxScore: 240,
    timeLimit: 15000,
    xpReward: 120,
  },
  {
    id: 'energy_burst_hard',
    type: 'reflex',
    difficulty: 'hard',
    title: 'Final Flash',
    description: 'Overwhelming energy barrage! Only the strongest survive!',
    maxScore: 360,
    timeLimit: 20000,
    xpReward: 240,
  },

  // Anime Knowledge Battles (Trivia)
  {
    id: 'knowledge_battle_easy',
    type: 'trivia',
    difficulty: 'easy',
    title: 'Rookie Test',
    description: 'Prove your anime basics! Every fan should know these!',
    maxScore: 100,
    timeLimit: 30000,
    xpReward: 50,
  },
  {
    id: 'knowledge_battle_medium',
    type: 'trivia',
    difficulty: 'medium',
    title: 'Chunin Exam',
    description: 'Advanced anime knowledge required! Are you worthy?',
    maxScore: 200,
    timeLimit: 45000,
    xpReward: 100,
  },
  {
    id: 'knowledge_battle_hard',
    type: 'trivia',
    difficulty: 'hard',
    title: 'Otaku Legend',
    description: 'Only true anime masters can conquer this ultimate test!',
    maxScore: 300,
    timeLimit: 60000,
    xpReward: 200,
  },

  // Special Faction Challenges
  {
    id: 'faction_rivalry_easy',
    type: 'combo',
    difficulty: 'easy',
    title: 'Rival Clash',
    description: 'Face your faction\'s eternal rival! Show your power!',
    maxScore: 150,
    timeLimit: 18000,
    xpReward: 100,
  },
  {
    id: 'faction_rivalry_medium',
    type: 'reflex',
    difficulty: 'medium',
    title: 'Epic Showdown',
    description: 'The ultimate rivalry battle! Honor your faction!',
    maxScore: 250,
    timeLimit: 22000,
    xpReward: 180,
  },
  {
    id: 'faction_rivalry_hard',
    type: 'combo',
    difficulty: 'hard',
    title: 'Legendary War',
    description: 'The final battle between eternal rivals! Everything is at stake!',
    maxScore: 400,
    timeLimit: 35000,
    xpReward: 350,
  },
];

export const getChallengesByType = (type: Challenge['type']): Challenge[] => {
  return CHALLENGES.filter(challenge => challenge.type === type);
};

export const getChallengesByDifficulty = (difficulty: Challenge['difficulty']): Challenge[] => {
  return CHALLENGES.filter(challenge => challenge.difficulty === difficulty);
};

export const getChallengeById = (id: string): Challenge | undefined => {
  return CHALLENGES.find(challenge => challenge.id === id);
};

export const getFactionChallenges = (): Challenge[] => {
  return CHALLENGES.filter(challenge => challenge.id.includes('faction_rivalry'));
};
