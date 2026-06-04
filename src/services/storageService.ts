import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProgress, TestResult, CategoryStats, AnswerLog, SavedTest } from '../models/Progress';
import type { Category } from '../models/Question';
import { ALL_CATEGORIES } from '../models/Question';

const KEYS = {
  PROGRESS: 'user_progress',
  FLAGGED: 'flagged_questions',
};

const MAX_SAVED_TESTS = 20;

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
    recentResults: [] as TestResult[],
    questionStats: {},
    savedTests: {},
  };
}

export async function loadProgress(): Promise<UserProgress> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.PROGRESS);
    if (!raw) return defaultProgress();
    const saved = JSON.parse(raw);
    return { ...defaultProgress(), ...saved };
  } catch {
    return defaultProgress();
  }
}

export async function saveResult(
  result: TestResult,
  answerLog: AnswerLog[]
): Promise<void> {
  const progress = await loadProgress();
  const now = result.date;

  progress.totalTests += 1;
  if (result.score > progress.bestScore) progress.bestScore = result.score;

  // Update category stats per individual question (fixes Mixed test tracking)
  for (const entry of answerLog) {
    const stats = progress.categoryStats[entry.category];
    stats.attempted += 1;
    if (entry.correct) stats.correct += 1;
    stats.lastAttempted = now;
  }

  // Update per-question stats
  for (const entry of answerLog) {
    const existing = progress.questionStats[entry.questionId] ?? {
      timesAnswered: 0,
      timesCorrect: 0,
      lastAnswered: now,
    };
    progress.questionStats[entry.questionId] = {
      timesAnswered: existing.timesAnswered + 1,
      timesCorrect: existing.timesCorrect + (entry.correct ? 1 : 0),
      lastAnswered: now,
    };
  }

  // Store the full answer log so tests can be reviewed later
  const savedTest: SavedTest = { resultId: result.id, answerLog };
  progress.savedTests[result.id] = savedTest;

  // Keep recentResults and savedTests in sync — drop oldest beyond the limit
  progress.recentResults = [result, ...progress.recentResults].slice(0, MAX_SAVED_TESTS);

  // Prune savedTests to match — remove any ids not in recentResults
  const keepIds = new Set(progress.recentResults.map(r => r.id));
  for (const id of Object.keys(progress.savedTests)) {
    if (!keepIds.has(id)) delete progress.savedTests[id];
  }

  await AsyncStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
}

export async function loadSavedTest(resultId: string): Promise<SavedTest | null> {
  const progress = await loadProgress();
  return progress.savedTests[resultId] ?? null;
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
  await AsyncStorage.removeItem(KEYS.PROGRESS);
  await AsyncStorage.removeItem(KEYS.FLAGGED);
}
