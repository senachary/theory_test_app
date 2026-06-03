import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProgress, TestResult, CategoryStats } from '../models/Progress';
import type { Category } from '../models/Question';
import { ALL_CATEGORIES } from '../models/Question';

const KEYS = {
  PROGRESS: 'user_progress',
  FLAGGED: 'flagged_questions',
};

function defaultProgress(): UserProgress {
  const categoryStats = Object.fromEntries(
    ALL_CATEGORIES.map((cat): [Category, CategoryStats] => [
      cat,
      { category: cat, attempted: 0, correct: 0, lastAttempted: null },
    ])
  ) as Record<Category, CategoryStats>;

  return {
    totalTests: 0,
    bestScore: 0,
    categoryStats,
    recentResults: [],
  };
}

export async function loadProgress(): Promise<UserProgress> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.PROGRESS);
    if (!raw) return defaultProgress();
    return { ...defaultProgress(), ...JSON.parse(raw) };
  } catch {
    return defaultProgress();
  }
}

export async function saveResult(result: TestResult): Promise<void> {
  const progress = await loadProgress();

  progress.totalTests += 1;
  if (result.score > progress.bestScore) progress.bestScore = result.score;

  if (result.category !== 'Mixed') {
    const stats = progress.categoryStats[result.category];
    stats.attempted += result.total;
    stats.correct += result.score;
    stats.lastAttempted = result.date;
  }

  progress.recentResults = [result, ...progress.recentResults].slice(0, 20);

  await AsyncStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
}

export async function loadFlaggedIds(): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.FLAGGED);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

export async function toggleFlagged(id: string): Promise<Set<string>> {
  const flagged = await loadFlaggedIds();
  if (flagged.has(id)) {
    flagged.delete(id);
  } else {
    flagged.add(id);
  }
  await AsyncStorage.setItem(KEYS.FLAGGED, JSON.stringify([...flagged]));
  return flagged;
}

export async function clearProgress(): Promise<void> {
  await AsyncStorage.multiRemove([KEYS.PROGRESS, KEYS.FLAGGED]);
}
