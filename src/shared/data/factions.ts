import { Faction } from '../types/api';

// Rival faction pairings for VS display
export const FACTION_RIVALRIES = [
  {
    heroes: {
      id: 'straw_hats',
      name: 'Straw Hats',
      description: 'Luffy\'s crew! Freedom, adventure, and rubber powers! Gomu Gomu no...!',
      color: '#FF6B35',
      emblem: '🏴‍☠️',
      totalXP: 0,
      memberCount: 0,
    },
    villains: {
      id: 'blackbeard_pirates',
      name: 'Blackbeard Pirates',
      description: 'Darkness incarnate! Zehahaha! The power of darkness will consume all!',
      color: '#2C1810',
      emblem: '🏴',
      totalXP: 0,
      memberCount: 0,
    }
  },
  {
    heroes: {
      id: 'konoha_shinobi',
      name: 'Konoha Shinobi',
      description: 'Will of Fire burns bright! Protect the village with ninja way!',
      color: '#FF8C00',
      emblem: '🍃',
      totalXP: 0,
      memberCount: 0,
    },
    villains: {
      id: 'akatsuki',
      name: 'Akatsuki',
      description: 'Pain and suffering! Collect the tailed beasts for ultimate power!',
      color: '#8B0000',
      emblem: '☁️',
      totalXP: 0,
      memberCount: 0,
    }
  },
  {
    heroes: {
      id: 'survey_corps',
      name: 'Survey Corps',
      description: 'Humanity\'s strongest! Fight for freedom beyond the walls!',
      color: '#006400',
      emblem: '🗡️',
      totalXP: 0,
      memberCount: 0,
    },
    villains: {
      id: 'titans',
      name: 'Titans',
      description: 'Colossal terror! Devour humanity and destroy everything!',
      color: '#8B4513',
      emblem: '👹',
      totalXP: 0,
      memberCount: 0,
    }
  },
  {
    heroes: {
      id: 'soul_reapers',
      name: 'Soul Reapers',
      description: 'Shinigami power! Protect souls and maintain balance!',
      color: '#000080',
      emblem: '⚔️',
      totalXP: 0,
      memberCount: 0,
    },
    villains: {
      id: 'arrancars',
      name: 'Arrancars',
      description: 'Hollow evolution! Tear apart the soul society with Espada power!',
      color: '#4B0082',
      emblem: '💀',
      totalXP: 0,
      memberCount: 0,
    }
  },
  {
    heroes: {
      id: 'demon_slayers',
      name: 'Demon Slayers',
      description: 'Breathing techniques! Slay demons and protect humanity!',
      color: '#8B0000',
      emblem: '🌸',
      totalXP: 0,
      memberCount: 0,
    },
    villains: {
      id: 'demons',
      name: 'Demons',
      description: 'Blood demon arts! Consume humans and spread eternal darkness!',
      color: '#800080',
      emblem: '👺',
      totalXP: 0,
      memberCount: 0,
    }
  }
];

// Flatten all factions for easy access
export const FACTIONS: Faction[] = FACTION_RIVALRIES.flatMap(rivalry => [rivalry.heroes, rivalry.villains]);

// Rival faction mappings
export const FACTION_RIVALS: Record<string, string> = {};
FACTION_RIVALRIES.forEach(rivalry => {
  FACTION_RIVALS[rivalry.heroes.id] = rivalry.villains.id;
  FACTION_RIVALS[rivalry.villains.id] = rivalry.heroes.id;
});

export const getFactionById = (id: string): Faction | undefined => {
  return FACTIONS.find(faction => faction.id === id);
};

export const getRivalFactionId = (factionId: string): string | undefined => {
  return FACTION_RIVALS[factionId];
};

export const getFactionPower = (factionId: string): string => {
  const powers: Record<string, string> = {
    'straw_hats': 'Gomu Gomu Powers',
    'blackbeard_pirates': 'Darkness Logia',
    'konoha_shinobi': 'Chakra & Jutsu',
    'akatsuki': 'Forbidden Jutsu',
    'survey_corps': 'ODM Gear & Blades',
    'titans': 'Titan Shifting',
    'soul_reapers': 'Zanpakuto Spirit',
    'arrancars': 'Hollow Powers',
    'demon_slayers': 'Breathing Forms',
    'demons': 'Blood Demon Arts',
  };
  return powers[factionId] || 'Unknown Power';
};
