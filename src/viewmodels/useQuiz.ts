import { useState, useCallback, useRef, useEffect } from 'react';
import type { Question, Category } from '../models/Question';
import type { TestResult } from '../models/Progress';
import { getQuestions, getTimeLimitSeconds } from '../services/questionService';
import { saveResult, loadFlaggedIds, toggleFlagged } from '../services/storageService';

export type AnswerState = 'unanswered' | 'correct' | 'incorrect';

export type QuizConfig = {
  category: Category | 'Mixed';
  questionCount: number;
  flaggedOnly?: boolean;
};

export type QuizViewModel = {
  questions: Question[];
  currentIndex: number;
  selectedAnswer: string | null;
  answerState: AnswerState;
  flaggedIds: Set<string>;
  score: number;
  remainingSeconds: number;
  totalSeconds: number;
  isComplete: boolean;
  timedOut: boolean;
  result: TestResult | null;
  currentQuestion: Question | null;
  progress: number;
  selectAnswer: (optionId: string) => void;
  nextQuestion: () => void;
  toggleFlag: (id: string) => Promise<void>;
  restart: () => void;
};

export function useQuiz(config: QuizConfig): QuizViewModel {
  const totalSeconds = getTimeLimitSeconds(config.questionCount);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [isComplete, setIsComplete] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scoreRef = useRef(0);
  const currentIndexRef = useRef(0);
  const questionsRef = useRef<Question[]>([]);

  const finishQuiz = useCallback(async (
    finalScore: number,
    total: number,
    durationSeconds: number,
    didTimeOut: boolean
  ) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const passed = finalScore / total >= 0.86;

    const testResult: TestResult = {
      id: `${Date.now()}`,
      date: new Date().toISOString(),
      score: finalScore,
      total,
      passed,
      category: config.category,
      durationSeconds,
    };

    await saveResult(testResult);
    setResult(testResult);
    setTimedOut(didTimeOut);
    setIsComplete(true);
  }, [config.category]);

  const initialise = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);

    const flagged = await loadFlaggedIds();
    setFlaggedIds(flagged);

    const qs = getQuestions(config.category, config.questionCount, config.flaggedOnly ? flagged : undefined);
    questionsRef.current = qs;
    scoreRef.current = 0;
    currentIndexRef.current = 0;

    setQuestions(qs);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswerState('unanswered');
    setScore(0);
    setRemainingSeconds(totalSeconds);
    setIsComplete(false);
    setTimedOut(false);
    setResult(null);
  }, [config.category, config.questionCount, config.flaggedOnly, totalSeconds]);

  useEffect(() => {
    initialise();
  }, [initialise]);

  // Countdown timer
  useEffect(() => {
    if (isComplete || questions.length === 0) return;

    timerRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          // Time's up — finish with current score
          const elapsed = totalSeconds;
          finishQuiz(scoreRef.current, questionsRef.current.length, elapsed, true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isComplete, questions.length, totalSeconds, finishQuiz]);

  const selectAnswer = useCallback((optionId: string) => {
    if (answerState !== 'unanswered') return;
    const q = questions[currentIndex];
    if (!q) return;

    setSelectedAnswer(optionId);
    const correct = optionId === q.correct_answer;
    setAnswerState(correct ? 'correct' : 'incorrect');
    if (correct) {
      scoreRef.current += 1;
      setScore(s => s + 1);
    }
  }, [answerState, questions, currentIndex]);

  const nextQuestion = useCallback(async () => {
    const nextIdx = currentIndex + 1;
    currentIndexRef.current = nextIdx;

    if (nextIdx >= questions.length) {
      const elapsed = totalSeconds - remainingSeconds;
      await finishQuiz(scoreRef.current, questions.length, elapsed, false);
    } else {
      setCurrentIndex(nextIdx);
      setSelectedAnswer(null);
      setAnswerState('unanswered');
    }
  }, [currentIndex, questions.length, totalSeconds, remainingSeconds, finishQuiz]);

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
    remainingSeconds,
    totalSeconds,
    isComplete,
    timedOut,
    result,
    currentQuestion: questions[currentIndex] ?? null,
    progress: questions.length > 0 ? (currentIndex + 1) / questions.length : 0,
    selectAnswer,
    nextQuestion,
    toggleFlag,
    restart,
  };
}
