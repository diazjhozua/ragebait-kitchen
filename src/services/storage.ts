import { v4 as uuidv4 } from 'uuid';
import type { LeaderboardEntry } from '../types/leaderboard';
import type { JudgeResponse, Recipe, JudgeStyle } from '../types/game';
import { validateWithSchema, leaderboardEntrySchema } from '../utils/validation';
import { STORAGE_KEYS, LIMITS } from '../utils/constants';

export class StorageService {
  private static readonly CURRENT_VERSION = 1;

  // Get all leaderboard entries with validation
  static getLeaderboardEntries(): LeaderboardEntry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
      if (!stored) {
        return [];
      }

      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        console.warn('Invalid leaderboard data format, resetting...');
        this.clearLeaderboard();
        return [];
      }

      // Validate and filter entries
      const validEntries: LeaderboardEntry[] = [];
      let hasInvalidEntries = false;

      for (const entry of parsed) {
        const validation = validateWithSchema(leaderboardEntrySchema, entry, 'leaderboard entry');
        if (validation.success) {
          validEntries.push(validation.data);
        } else {
          console.warn('Invalid leaderboard entry removed:', validation.error);
          hasInvalidEntries = true;
        }
      }

      // If we found invalid entries, save the cleaned list
      if (hasInvalidEntries) {
        this.saveLeaderboardEntries(validEntries);
      }

      return validEntries;

    } catch (error) {
      console.error('Failed to load leaderboard entries:', error);
      this.clearLeaderboard();
      return [];
    }
  }

  // Save leaderboard entries
  static saveLeaderboardEntries(entries: LeaderboardEntry[]): boolean {
    try {
      const serialized = JSON.stringify(entries);
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, serialized);
      return true;
    } catch (error) {
      console.error('Failed to save leaderboard entries:', error);

      // Check if it's a quota exceeded error
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        // Try to free up space by removing oldest entries
        if (entries.length > 10) {
          const trimmedEntries = entries.slice(0, 10);
          try {
            localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(trimmedEntries));
            console.info('Trimmed leaderboard to free up storage space');
            return true;
          } catch {
            // Still failing, clear everything
            this.clearLeaderboard();
          }
        }
      }
      return false;
    }
  }

  // Add a new leaderboard entry
  static addLeaderboardEntry(
    recipe: Recipe,
    response: JudgeResponse,
    playerName: string,
    judgeStyle: JudgeStyle
  ): LeaderboardEntry | null {
    const entry: LeaderboardEntry = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      playerName: playerName.trim(),
      recipeTitle: recipe.title?.trim(),
      recipeContent: recipe.content.trim(),
      rage_score: response.rage_score,
      tags: response.tags,
      reaction: response.reaction,
      judgeStyle
    };

    // Validate the entry before saving
    const validation = validateWithSchema(leaderboardEntrySchema, entry, 'new leaderboard entry');
    if (!validation.success) {
      console.error('Invalid leaderboard entry:', validation.error);
      return null;
    }

    const entries = this.getLeaderboardEntries();
    entries.unshift(validation.data); // Add to beginning

    // Keep only reasonable number of entries to avoid storage issues
    const trimmedEntries = entries.slice(0, 1000);

    if (this.saveLeaderboardEntries(trimmedEntries)) {
      return validation.data;
    }

    return null;
  }

  // Get paginated and sorted entries
  static getLeaderboardPage(
    page: number = 0,
    pageSize: number = LIMITS.LEADERBOARD_PAGE_SIZE,
    sortBy: 'rage_score' | 'date' = 'rage_score',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): {
    entries: LeaderboardEntry[];
    totalEntries: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } {
    const allEntries = this.getLeaderboardEntries();

    // Sort entries
    const sortedEntries = [...allEntries].sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'rage_score') {
        comparison = a.rage_score - b.rage_score;
      } else { // date
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Calculate pagination
    const totalEntries = sortedEntries.length;
    const totalPages = Math.ceil(totalEntries / pageSize);
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    const entries = sortedEntries.slice(startIndex, endIndex);

    return {
      entries,
      totalEntries,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages - 1,
      hasPrevPage: page > 0
    };
  }

  // Remove a specific entry
  static removeLeaderboardEntry(id: string): boolean {
    const entries = this.getLeaderboardEntries();
    const filteredEntries = entries.filter(entry => entry.id !== id);

    if (filteredEntries.length === entries.length) {
      return false; // Entry not found
    }

    return this.saveLeaderboardEntries(filteredEntries);
  }

  // Clear all leaderboard entries
  static clearLeaderboard(): boolean {
    try {
      localStorage.removeItem(STORAGE_KEYS.LEADERBOARD);
      return true;
    } catch (error) {
      console.error('Failed to clear leaderboard:', error);
      return false;
    }
  }

  // Get leaderboard statistics
  static getLeaderboardStats(): {
    totalEntries: number;
    averageRageScore: number;
    highestRageScore: number;
    lowestRageScore: number;
    mostCommonTags: Array<{ tag: string; count: number }>;
  } {
    const entries = this.getLeaderboardEntries();

    if (entries.length === 0) {
      return {
        totalEntries: 0,
        averageRageScore: 0,
        highestRageScore: 0,
        lowestRageScore: 0,
        mostCommonTags: []
      };
    }

    // Calculate rage score stats
    const rageScores = entries.map(e => e.rage_score);
    const totalEntries = entries.length;
    const averageRageScore = Math.round(rageScores.reduce((sum, score) => sum + score, 0) / totalEntries);
    const highestRageScore = Math.max(...rageScores);
    const lowestRageScore = Math.min(...rageScores);

    // Calculate most common tags
    const tagCounts = new Map<string, number>();
    entries.forEach(entry => {
      entry.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    const mostCommonTags = Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalEntries,
      averageRageScore,
      highestRageScore,
      lowestRageScore,
      mostCommonTags
    };
  }

  // Export leaderboard data as JSON
  static exportLeaderboard(): string {
    const entries = this.getLeaderboardEntries();
    const stats = this.getLeaderboardStats();

    return JSON.stringify({
      version: this.CURRENT_VERSION,
      exportedAt: new Date().toISOString(),
      stats,
      entries
    }, null, 2);
  }

  // Get storage usage info
  static getStorageInfo(): {
    used: number;
    available: number;
    percentage: number;
  } {
    try {
      const entries = this.getLeaderboardEntries();
      const serialized = JSON.stringify(entries);
      const used = new Blob([serialized]).size;

      // Estimate available space (most browsers allow 5-10MB per origin)
      const estimated = 5 * 1024 * 1024; // 5MB estimate
      const percentage = (used / estimated) * 100;

      return {
        used,
        available: estimated - used,
        percentage: Math.min(percentage, 100)
      };
    } catch {
      return {
        used: 0,
        available: 0,
        percentage: 0
      };
    }
  }
}