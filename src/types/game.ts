export type Difficulty = 'easy' | 'medium' | 'hard';
export type Topic = 'javascript' | 'react' | 'nodejs';

export interface Question {
  id: string;
  topic: Topic;
  difficulty: Difficulty;
  title: string;
  codeSnippet?: string;
  codeLanguage?: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  bugType: string;
}

export type GameScreenType = 'home' | 'game' | 'results' | 'how-to-play' | 'explorer' | 'kotlin-code';

export interface GameSession {
  difficulty: Difficulty | 'all';
  topic: Topic | 'all';
  questions: Question[];
  currentIndex: number;
  score: number;
  streak: number;
  bestStreakInSession: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeRemaining: number;
  totalTimeTaken: number;
  isAnswered: boolean;
  selectedAnswerIndex: number | null;
  history: {
    questionId: string;
    selectedOption: number;
    correctOption: number;
    isCorrect: boolean;
    timeTaken: number;
    pointsEarned: number;
  }[];
}

export interface PlayerStats {
  highScore: number;
  totalGamesPlayed: number;
  totalQuestionsAnswered: number;
  totalCorrect: number;
  overallBestStreak: number;
  totalBugsSquashed: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  unlockedLevels: string[];
}
