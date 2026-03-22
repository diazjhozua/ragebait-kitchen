import { useState, useEffect, useCallback } from 'react';
import type { LeaderboardEntry } from '../types/leaderboard';
import type { JudgeResponse, Recipe, JudgeStyle } from '../types/game';
import { StorageService } from '../services/storage';
import { LIMITS } from '../utils/constants';

export interface LeaderboardState {
  entries: LeaderboardEntry[];
  totalEntries: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  isLoading: boolean;
  error: string | null;
  stats: {
    totalEntries: number;
    averageRageScore: number;
    highestRageScore: number;
    lowestRageScore: number;
    mostCommonTags: Array<{ tag: string; count: number }>;
  };
}

export interface LeaderboardActions {
  addEntry: (recipe: Recipe, response: JudgeResponse, playerName: string, judgeStyle: JudgeStyle) => Promise<boolean>;
  removeEntry: (id: string) => Promise<boolean>;
  clearLeaderboard: () => Promise<boolean>;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setSorting: (sortBy: 'rage_score' | 'date', sortOrder?: 'asc' | 'desc') => void;
  refresh: () => void;
  exportData: () => string;
}

export interface LeaderboardOptions {
  pageSize?: number;
  autoRefresh?: boolean;
  sortBy?: 'rage_score' | 'date';
  sortOrder?: 'asc' | 'desc';
}

export function useLeaderboard(options: LeaderboardOptions = {}): LeaderboardState & LeaderboardActions {
  const {
    pageSize = LIMITS.LEADERBOARD_PAGE_SIZE,
    autoRefresh = false,
    sortBy: initialSortBy = 'rage_score',
    sortOrder: initialSortOrder = 'desc'
  } = options;

  const [state, setState] = useState<LeaderboardState>({
    entries: [],
    totalEntries: 0,
    totalPages: 0,
    currentPage: 0,
    hasNextPage: false,
    hasPrevPage: false,
    isLoading: true,
    error: null,
    stats: {
      totalEntries: 0,
      averageRageScore: 0,
      highestRageScore: 0,
      lowestRageScore: 0,
      mostCommonTags: []
    }
  });

  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);

  // Load leaderboard data
  const loadData = useCallback(async (page: number = state.currentPage) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const pageData = StorageService.getLeaderboardPage(page, pageSize, sortBy, sortOrder);
      const stats = StorageService.getLeaderboardStats();

      setState(prev => ({
        ...prev,
        entries: pageData.entries,
        totalEntries: pageData.totalEntries,
        totalPages: pageData.totalPages,
        currentPage: pageData.currentPage,
        hasNextPage: pageData.hasNextPage,
        hasPrevPage: pageData.hasPrevPage,
        stats,
        isLoading: false,
        error: null
      }));
    } catch (error) {
      console.error('Failed to load leaderboard data:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load leaderboard data'
      }));
    }
  }, [pageSize, sortBy, sortOrder, state.currentPage]);

  // Initial load and refresh on sorting changes
  useEffect(() => {
    loadData(0); // Reset to first page when sorting changes
  }, [sortBy, sortOrder]);

  // Auto-refresh if enabled
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, loadData]);

  // Add entry
  const addEntry = useCallback(async (
    recipe: Recipe,
    response: JudgeResponse,
    playerName: string,
    judgeStyle: JudgeStyle
  ): Promise<boolean> => {
    try {
      const entry = StorageService.addLeaderboardEntry(recipe, response, playerName, judgeStyle);
      if (entry) {
        // Refresh data to show the new entry
        await loadData(0); // Go to first page to see the new entry
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to add leaderboard entry:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to save entry to leaderboard'
      }));
      return false;
    }
  }, [loadData]);

  // Remove entry
  const removeEntry = useCallback(async (id: string): Promise<boolean> => {
    try {
      const success = StorageService.removeLeaderboardEntry(id);
      if (success) {
        // Refresh current page
        await loadData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to remove leaderboard entry:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to remove entry from leaderboard'
      }));
      return false;
    }
  }, [loadData]);

  // Clear leaderboard
  const clearLeaderboard = useCallback(async (): Promise<boolean> => {
    try {
      const success = StorageService.clearLeaderboard();
      if (success) {
        await loadData(0);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to clear leaderboard:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to clear leaderboard'
      }));
      return false;
    }
  }, [loadData]);

  // Navigation
  const goToPage = useCallback((page: number) => {
    if (page >= 0 && page < state.totalPages) {
      loadData(page);
    }
  }, [state.totalPages, loadData]);

  const nextPage = useCallback(() => {
    if (state.hasNextPage) {
      loadData(state.currentPage + 1);
    }
  }, [state.hasNextPage, state.currentPage, loadData]);

  const prevPage = useCallback(() => {
    if (state.hasPrevPage) {
      loadData(state.currentPage - 1);
    }
  }, [state.hasPrevPage, state.currentPage, loadData]);

  // Sorting
  const setSorting = useCallback((newSortBy: 'rage_score' | 'date', newSortOrder: 'asc' | 'desc' = 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  }, []);

  // Refresh
  const refresh = useCallback(() => {
    loadData();
  }, [loadData]);

  // Export
  const exportData = useCallback((): string => {
    return StorageService.exportLeaderboard();
  }, []);

  return {
    ...state,
    addEntry,
    removeEntry,
    clearLeaderboard,
    goToPage,
    nextPage,
    prevPage,
    setSorting,
    refresh,
    exportData
  };
}

// Simplified hook for just checking if leaderboard has entries
export function useHasLeaderboardEntries(): boolean {
  const [hasEntries, setHasEntries] = useState(false);

  useEffect(() => {
    try {
      const entries = StorageService.getLeaderboardEntries();
      setHasEntries(entries.length > 0);
    } catch {
      setHasEntries(false);
    }
  }, []);

  return hasEntries;
}

// Hook for just getting leaderboard stats
export function useLeaderboardStats() {
  const [stats, setStats] = useState(StorageService.getLeaderboardStats());

  const refreshStats = useCallback(() => {
    setStats(StorageService.getLeaderboardStats());
  }, []);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  return { stats, refreshStats };
}