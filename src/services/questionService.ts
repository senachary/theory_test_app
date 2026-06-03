import questions from '../data/questions';
import type { Question, Category } from '../models/Question';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Shuffle the options for a question and remap correct_answer to the new position.
function randomiseOptions(q: Question): Question {
  const shuffled = shuffle(q.options);
  const labels = ['A', 'B', 'C', 'D'] as const;
  // Find which new index the correct option ended up at
  const correctIndex = shuffled.findIndex(opt => opt.id === q.correct_answer);
  return {
    ...q,
    options: shuffled.map((opt, i) => ({ ...opt, id: labels[i] })),
    correct_answer: labels[correctIndex],
  };
}

export function getQuestions(
  category: Category | 'Mixed',
  count: number,
  flaggedIds?: Set<string>
): Question[] {
  let pool: Question[];

  if (category === 'Mixed') {
    pool = flaggedIds && flaggedIds.size > 0
      ? questions.filter(q => flaggedIds.has(q.id))
      : questions;
  } else {
    pool = questions.filter(q => q.category === category);
  }

  return shuffle(pool)
    .slice(0, Math.min(count, pool.length))
    .map(randomiseOptions);
}

export function getQuestionsByIds(ids: string[]): Question[] {
  const idSet = new Set(ids);
  return questions.filter(q => idSet.has(q.id)).map(randomiseOptions);
}

export function getTotalByCategory(category: Category | 'Mixed'): number {
  if (category === 'Mixed') return questions.length;
  return questions.filter(q => q.category === category).length;
}

export function getAllCategories(): Array<Category | 'Mixed'> {
  return ['Mixed', ...Array.from(new Set(questions.map(q => q.category)))];
}

// DVSA-style time allowances: ~1 minute per question for 10/20, 57 min for 50
export function getTimeLimitSeconds(count: number): number {
  if (count === 10) return 10 * 60;   // 10 min
  if (count === 20) return 20 * 60;   // 20 min
  return 57 * 60;                      // 57 min — official DVSA allowance
}
