import { useState, useCallback, useRef, useEffect } from 'react';
import type { Question, Category } from '../models/Question';
import type { TestResult } from '../models/Progress';
import { getQuestions } from '../services/questionService';
import { saveResult, loadFlaggedIds, toggleFlagged } from '../services/storageService';

export type AnswerState = 'unanswered' | 'correct' | 'incorrect';

export type QuizConfig = {
  category: Category | 'Mixed';
  questionCount: number;
  flaggedOnly?: boolean;
};

export type QuizViewModel = {
  // state
  questions: Question[];
  currentIndex: number;
  selectedAnswer: string | null;
  answerState: AnswerState;
  flaggedIds: Set<string>;
  score: number;
  elapsedSeconds: number;
  isComplete: boolean;
  result: TestResult | null;
  // derived
  currentQuestion: Question | null;
  progress: number;
  // actions
  selectAnswer: (optionId: string) => void;
  nextQuestion: () => void;
  toggleFlag: (id: string) => Promise<void>;
  restart: () => void;
};

export function useQuiz(config: QuizConfig): QuizViewModel {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const startTime = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const initialise = useCallback(async () => {
    const flagged = await loadFlaggedIds();
    setFlaggedIds(flagged);

    const qs = getQuestions(config.category, config.questionCount, config.flaggedOnly ? flagged : undefined);
    setQuestions(qs);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswerState('unanswered');
    setScore(0);
    setElapsedSeconds(0);
    setIsComplete(false);
    setResult(null);

    startTime.current = Date.now();
  }, [config.category, config.questionCount, config.flaggedOnly]);

  useEffect(() => {
    initialise();
  }, [initialise]);

  useEffect(() => {
    if (isComplete) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime.current) / 1000));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isComplete]);

  const selectAnswer = useCallback((optionId: string) => {
    if (answerState !== 'unanswered') return;
    const q = questions[currentIndex];
    if (!q) return;

    setSelectedAnswer(optionId);
    const correct = optionId === q.correct_answer;
    setAnswerState(correct ? 'correct' : 'incorrect');
    if (correct) setScore(s => s + 1);
  }, [answerState, questions, currentIndex]);

  const nextQuestion = useCallback(async () => {
    const nextIdx = currentIndex + 1;
    if (nextIdx >= questions.length) {
      const duration = Math.floor((Date.now() - startTime.current) / 1000);
      const finalScore = score + (answerState === 'correct' ? 0 : 0); // already counted in selectAnswer
      const total = questions.length;

      // DVSA pass mark is 43/50 (86%)
      const passed = score / total >= 0.86;

      const testResult: TestResult = {
        id: `${Date.now()}`,
        date: new Date().toISOString(),
        score,
        total,
        passed,
        category: config.category,
        durationSeconds: duration,
      };

      await saveResult(testResult);
      setResult(testResult);
      setIsComplete(true);
    } else {
      setCurrentIndex(nextIdx);
      setSelectedAnswer(null);
      setAnswerState('unanswered');
    }
  }, [currentIndex, questions.length, score, answerState, config.category]);

  const toggleFlag = useCallback(async (id: string) => {
    const updated = await toggleFlagged(id);
    setFlaggedIds(new Set(updated));
  }, []);

  const restart = useCallback(() => {
    initialise();
  }, [initialise]);

  return {
    questions,
    currentIndex,
    selectedAnswer,
    answerState,
    flaggedIds,
    score,
    elapsedSeconds,
    isComplete,
    result,
    currentQuestion: questions[currentIndex] ?? null,
    progress: questions.length > 0 ? (currentIndex + 1) / questions.length : 0,
    selectAnswer,
    nextQuestion,
    toggleFlag,
    restart,
  };
}
