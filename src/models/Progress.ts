import type { Category } from './Question';

export type TestResult = {
  id: string;
  date: string;
  score: number;
  total: number;
  passed: boolean;
  category: Category | 'Mixed';
  durationSeconds: number;
};

export type CategoryStats = {
  category: Category;
  attempted: number;
  correct: number;
  lastAttempted: string | null;
};

export type QuestionRecord = {
  timesAnswered: number;
  timesCorrect: number;
  lastAnswered: string;
};

export type AnswerLog = {
  questionId: string;
  category: Category;
  correct: boolean;
  // The option ID the user actually selected (after runtime shuffle)
  selectedOptionId: string;
};

// Full saved test — one per completed quiz, keyed by TestResult.id
export type SavedTest = {
  resultId: string;
  answerLog: AnswerLog[];
};

export type UserProgress = {
  totalTests: number;
  bestScore: number;
  categoryStats: Record<Category, CategoryStats>;
  recentResults: TestResult[];
  questionStats: Record<string, QuestionRecord>;
  // Parallel to recentResults — stores the full answer log for each
  savedTests: Record<string, SavedTest>;
};
