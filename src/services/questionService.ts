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

  return shuffle(pool).slice(0, Math.min(count, pool.length));
}

export function getQuestionsByIds(ids: string[]): Question[] {
  const idSet = new Set(ids);
  return questions.filter(q => idSet.has(q.id));
}

export function getTotalByCategory(category: Category | 'Mixed'): number {
  if (category === 'Mixed') return questions.length;
  return questions.filter(q => q.category === category).length;
}

export function getAllCategories(): Array<Category | 'Mixed'> {
  return ['Mixed', ...Array.from(new Set(questions.map(q => q.category)))];
}
