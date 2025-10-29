export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  // Easy Questions
  {
    id: 'easy_1',
    question: 'What is the name of the main character in Naruto?',
    options: ['Sasuke Uchiha', 'Naruto Uzumaki', 'Sakura Haruno', 'Kakashi Hatake'],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'Naruto',
  },
  {
    id: 'easy_2',
    question: 'Which anime features a boy who can stretch his body like rubber?',
    options: ['Dragon Ball', 'One Piece', 'Bleach', 'Attack on Titan'],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'One Piece',
  },
  {
    id: 'easy_3',
    question: 'What is the name of the Death Note owner in Death Note?',
    options: ['L', 'Near', 'Light Yagami', 'Mello'],
    correctAnswer: 2,
    difficulty: 'easy',
    category: 'Death Note',
  },

  // Medium Questions
  {
    id: 'medium_1',
    question: 'What is the name of Edward Elric\'s brother in Fullmetal Alchemist?',
    options: ['Roy Mustang', 'Alphonse Elric', 'Winry Rockbell', 'Maes Hughes'],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'Fullmetal Alchemist',
  },
  {
    id: 'medium_2',
    question: 'Which Titan power does Eren Yeager possess in Attack on Titan?',
    options: ['Colossal Titan', 'Armored Titan', 'Attack Titan', 'Beast Titan'],
    correctAnswer: 2,
    difficulty: 'medium',
    category: 'Attack on Titan',
  },
  {
    id: 'medium_3',
    question: 'What is the name of Tanjiro\'s breathing technique in Demon Slayer?',
    options: ['Water Breathing', 'Sun Breathing', 'Thunder Breathing', 'Stone Breathing'],
    correctAnswer: 0,
    difficulty: 'medium',
    category: 'Demon Slayer',
  },

  // Hard Questions
  {
    id: 'hard_1',
    question: 'What is the real name of the character known as "L" in Death Note?',
    options: ['Lawliet', 'L Lawliet', 'Ryuzaki', 'Hideki Ryuga'],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Death Note',
  },
  {
    id: 'hard_2',
    question: 'Which studio animated the original Neon Genesis Evangelion series?',
    options: ['Studio Ghibli', 'Madhouse', 'Gainax', 'Toei Animation'],
    correctAnswer: 2,
    difficulty: 'hard',
    category: 'Evangelion',
  },
  {
    id: 'hard_3',
    question: 'What is the name of the technique Goku learns from King Kai?',
    options: ['Kamehameha', 'Spirit Bomb', 'Instant Transmission', 'Kaio-ken'],
    correctAnswer: 3,
    difficulty: 'hard',
    category: 'Dragon Ball',
  },
];

export const getQuestionsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): TriviaQuestion[] => {
  return TRIVIA_QUESTIONS.filter(q => q.difficulty === difficulty);
};

export const getRandomQuestions = (difficulty: 'easy' | 'medium' | 'hard', count: number): TriviaQuestion[] => {
  const questions = getQuestionsByDifficulty(difficulty);
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
