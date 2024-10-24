import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChallengeWithProgress } from '../types';
import { fetchChallenges } from '../services/api';

const STORAGE_KEY = 'fortnite-quest-progress';

export const useChallenges = () => {
  const [challenges, setChallenges] = useState<ChallengeWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const loadSavedProgress = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }, []);

  const saveProgress = useCallback((progress: Record<string, { completed: boolean; completedAt?: string }>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  }, []);

  const loadChallenges = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchChallenges();
      const savedProgress = loadSavedProgress();
      
      const challengesWithProgress = data.map(challenge => ({
        ...challenge,
        completed: savedProgress[challenge.id]?.completed || false,
        completedAt: savedProgress[challenge.id]?.completedAt
      }));
      
      setChallenges(challengesWithProgress);
    } catch (err: any) {
      setError(err.message);
      if (retryCount < 3) {
        setTimeout(() => setRetryCount(prev => prev + 1), Math.pow(2, retryCount) * 1000);
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount, loadSavedProgress]);

  const toggleChallengeCompletion = useCallback((challengeId: string) => {
    setChallenges(prev => {
      const updated = prev.map(challenge => 
        challenge.id === challengeId
          ? {
              ...challenge,
              completed: !challenge.completed,
              completedAt: !challenge.completed ? new Date().toISOString() : undefined
            }
          : challenge
      );

      const progress = updated.reduce((acc, challenge) => {
        if (challenge.completed) {
          acc[challenge.id] = {
            completed: challenge.completed,
            completedAt: challenge.completedAt
          };
        }
        return acc;
      }, {} as Record<string, { completed: boolean; completedAt?: string }>);

      saveProgress(progress);
      return updated;
    });
  }, [saveProgress]);

  const filteredChallenges = useMemo(() => {
    if (!searchTerm) return challenges;
    const searchLower = searchTerm.toLowerCase();
    return challenges.filter(challenge => 
      challenge.name.toLowerCase().includes(searchLower) ||
      challenge.description.toLowerCase().includes(searchLower) ||
      challenge.questType.toLowerCase().includes(searchLower)
    );
  }, [challenges, searchTerm]);

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  const handleRetry = useCallback(() => {
    setRetryCount(0);
    loadChallenges();
  }, [loadChallenges]);

  return {
    challenges,
    loading,
    error,
    handleRetry,
    toggleChallengeCompletion,
    searchTerm,
    setSearchTerm,
    filteredChallenges
  };
};