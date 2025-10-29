import { context, reddit } from '@devvit/web/server';

export const createPost = async () => {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  return await reddit.submitCustomPost({
    splash: {
      // Splash Screen Configuration
      appDisplayName: 'Anime Faction Blitz',
      backgroundUri: 'default-splash.png',
      buttonLabel: '🎮 Join the Battle!',
      description: 'Choose your anime faction and compete in lightning-fast challenges! Earn XP, level up, and dominate the leaderboards in this epic anime-themed battle arena.',
      entryUri: 'index.html',
      heading: '⚡ ANIME FACTION BLITZ ⚡',
      appIconUri: 'default-icon.png',
    },
    postData: {
      gameState: 'initial',
      score: 0,
    },
    subredditName: subredditName,
    title: '🎌 Anime Faction Blitz - Choose Your Side and Battle for Glory! 🎌',
  });
};
