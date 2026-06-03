import { useState, useEffect, useCallback } from 'react';
import type { UserProgress } from '../models/Progress';
import { loadProgress, clearProgress } from '../services/storageService';

export type ProgressViewModel = {
  progress: UserProgress | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
  reset: () => Promise<void>;
};

export function useProgress(): ProgressViewModel {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const data = await loadProgress();
    setProgress(data);
    setIsLoading(false);
  }, []);

  const reset = useCallback(async () => {
    await clearProgress();
    await refresh();
  }, [refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { progress, isLoading, refresh, reset };
}
