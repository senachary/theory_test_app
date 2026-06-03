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

export type UserProgress = {
  totalTests: number;
  bestScore: number;
  categoryStats: Record<Category, CategoryStats>;
  recentResults: TestResult[];
};
