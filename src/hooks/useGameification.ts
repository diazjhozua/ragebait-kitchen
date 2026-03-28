import { useState, useEffect, useCallback } from 'react';
import type {
  PlayerGamification,
  ChefGamificationMap,
  AchievementNotification,
  GamificationEvent,
  Ingredient
} from '../types/gamification';
import type { JudgeResponse, Recipe, JudgeStyle } from '../types/game';
import type { LeaderboardEntry } from '../types/leaderboard';

import { AchievementService, ACHIEVEMENTS } from '../services/achievements';
import { ProgressionService, PLAYER_LEVELS } from '../services/progression';
import { STORAGE_KEYS } from '../utils/constants';

const GAMIFICATION_STORAGE_KEY = 'ragebait-gamification';
const GAMIFICATION_EVENTS_KEY = 'ragebait-gamification-events';

// Ingredient definitions
const INGREDIENTS: Ingredient[] = [
  { id: 'cursed_microwave', name: 'Cursed Microwave', icon: '📱', rarity: 'rare', description: 'A microwave that somehow makes everything worse', unlockedBy: 'microwave_master', category: 'tool' },
  { id: 'charcoal_seasoning', name: 'Charcoal Seasoning', icon: '⚫', rarity: 'common', description: 'For when you want that authentic burnt flavor', unlockedBy: 'burnt_specialist', category: 'spice' },
  { id: 'himalayan_salt_mountain', name: 'Himalayan Salt Mountain', icon: '🧂', rarity: 'common', description: 'An entire mountain of salt for your dishes', unlockedBy: 'salt_overdose', category: 'spice' },
  { id: 'salmonella_starter', name: 'Salmonella Starter', icon: '🦠', rarity: 'rare', description: 'Adds that dangerous edge to raw dishes', unlockedBy: 'raw_enthusiast', category: 'protein' },
  { id: 'chaos_spice_rack', name: 'Chaos Spice Rack', icon: '🥄', rarity: 'epic', description: 'Contains every spice imaginable and some that shouldn\'t exist', unlockedBy: 'ingredient_anarchist', category: 'spice' },
  { id: 'confused_sugar', name: 'Confused Sugar', icon: '🍰', rarity: 'rare', description: 'Sugar that doesn\'t know if it\'s sweet or savory', unlockedBy: 'sweet_disaster', category: 'sauce' },
  { id: 'eternal_flame', name: 'Eternal Flame', icon: '🔥', rarity: 'legendary', description: 'A flame that never goes out and burns everything', unlockedBy: 'kitchen_arsonist', category: 'technique' }
];

interface GameificationState {
  player: PlayerGamification | null;
  recentEvents: GamificationEvent[];
  pendingNotifications: AchievementNotification[];
  isLoading: boolean;
  error: string | null;
}

interface GameificationActions {
  initializePlayer: (playerName: string) => void;
  loadChef: (playerName: string) => void;
  processRecipeSubmission: (
    recipe: Recipe,
    response: JudgeResponse,
    playerName: string,
    judgeStyle: JudgeStyle,
    leaderboardEntries: LeaderboardEntry[]
  ) => Promise<AchievementNotification[]>;
  clearNotifications: () => void;
  getPlayerLevel: () => typeof PLAYER_LEVELS[0] | null;
  getUnlockedIngredients: () => Ingredient[];
  getProgress: () => { percentage: number; xpToNext: number; nextLevel: typeof PLAYER_LEVELS[0] | null };
  getAllChefProfiles: () => { name: string; profile: PlayerGamification }[];
  resetPlayerData: () => void;
}

// Reads the full map from localStorage, migrating old single-profile format if needed
function readChefMap(): ChefGamificationMap {
  try {
    const stored = localStorage.getItem(GAMIFICATION_STORAGE_KEY);
    if (!stored) return {};

    const parsed = JSON.parse(stored);

    // Detect old format: root object has 'level' key (flat PlayerGamification)
    if (typeof parsed.level === 'number') {
      const chefName = localStorage.getItem(STORAGE_KEYS.PLAYER_NAME) || 'Unknown Chef';
      const migrated: ChefGamificationMap = {
        [chefName]: { ...parsed, name: chefName }
      };
      localStorage.setItem(GAMIFICATION_STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }

    return parsed as ChefGamificationMap;
  } catch {
    return {};
  }
}

function writeChefMap(map: ChefGamificationMap) {
  try {
    localStorage.setItem(GAMIFICATION_STORAGE_KEY, JSON.stringify(map));
  } catch (error) {
    console.error('Failed to save gamification data:', error);
  }
}

export function useGameification(): GameificationState & GameificationActions {
  const [state, setState] = useState<GameificationState>({
    player: null,
    recentEvents: [],
    pendingNotifications: [],
    isLoading: true,
    error: null
  });

  // Load events and attempt to restore the last active chef on mount
  useEffect(() => {
    try {
      const eventsStored = localStorage.getItem(GAMIFICATION_EVENTS_KEY);
      const events: GamificationEvent[] = eventsStored
        ? JSON.parse(eventsStored).slice(-50)
        : [];

      const map = readChefMap();
      const savedName = localStorage.getItem(STORAGE_KEYS.PLAYER_NAME);
      const player = savedName && map[savedName] ? map[savedName] : null;

      setState(prev => ({ ...prev, player, recentEvents: events, isLoading: false }));
    } catch (error) {
      console.error('Failed to load gamification data:', error);
      setState(prev => ({ ...prev, error: 'Failed to load player data', isLoading: false }));
    }
  }, []);

  const saveEvents = useCallback((events: GamificationEvent[]) => {
    try {
      localStorage.setItem(GAMIFICATION_EVENTS_KEY, JSON.stringify(events));
    } catch (error) {
      console.error('Failed to save gamification events:', error);
    }
  }, []);

  const addEvent = useCallback((event: GamificationEvent) => {
    setState(prev => {
      const newEvents = [...prev.recentEvents, event].slice(-50);
      saveEvents(newEvents);
      return { ...prev, recentEvents: newEvents };
    });
  }, [saveEvents]);

  // Saves a single chef's profile into the map without touching other chefs
  const savePlayerData = useCallback((player: PlayerGamification) => {
    const map = readChefMap();
    map[player.name] = player;
    writeChefMap(map);
  }, []);

  // Loads an existing chef profile (or creates a fresh one) and sets it as active
  const loadChef = useCallback((playerName: string) => {
    const map = readChefMap();
    const existing = map[playerName];
    const player = existing ?? ProgressionService.initializePlayer(playerName);

    if (!existing) {
      map[playerName] = player;
      writeChefMap(map);
    }

    setState(prev => ({ ...prev, player }));
  }, []);

  // Creates a brand-new profile for the chef, overwriting any existing one
  const initializePlayer = useCallback((playerName: string) => {
    const player = ProgressionService.initializePlayer(playerName);
    const map = readChefMap();
    map[playerName] = player;
    writeChefMap(map);
    setState(prev => ({ ...prev, player }));

    addEvent({
      type: 'xp_gained',
      amount: 0,
      source: 'Player initialized',
      timestamp: new Date().toISOString()
    });
  }, [addEvent]);

  const processRecipeSubmission = useCallback(async (
    recipe: Recipe,
    response: JudgeResponse,
    playerName: string,
    judgeStyle: JudgeStyle,
    leaderboardEntries: LeaderboardEntry[]
  ): Promise<AchievementNotification[]> => {
    // If active chef differs from the submitting chef, load the right profile first
    const map = readChefMap();
    const activePlayer = map[playerName] ?? ProgressionService.initializePlayer(playerName);

    if (!map[playerName]) {
      map[playerName] = activePlayer;
      writeChefMap(map);
      setState(prev => ({ ...prev, player: activePlayer }));
      return [];
    }

    try {
      const newAchievements = await AchievementService.checkAchievements(
        recipe,
        response,
        playerName,
        judgeStyle,
        activePlayer,
        leaderboardEntries
      );

      const xpGained = ProgressionService.calculateXP(
        recipe,
        response,
        judgeStyle,
        activePlayer.level,
        newAchievements.length > 0
      );

      const progressionResult = ProgressionService.updatePlayerGamification(
        activePlayer,
        recipe,
        response,
        judgeStyle,
        xpGained
      );

      const updatedPlayer: PlayerGamification = {
        ...progressionResult.updatedPlayer,
        name: playerName,
        unlockedAchievements: [
          ...progressionResult.updatedPlayer.unlockedAchievements,
          ...newAchievements.map(a => a.id)
        ],
        statistics: {
          ...progressionResult.updatedPlayer.statistics,
          achievementsUnlocked:
            progressionResult.updatedPlayer.statistics.achievementsUnlocked + newAchievements.length
        }
      };

      // Process ingredient unlocks
      const newIngredients: Ingredient[] = [];
      for (const achievement of newAchievements) {
        if (achievement.reward.ingredient) {
          const ingredient = INGREDIENTS.find(i => i.id === achievement.reward.ingredient);
          if (ingredient && !updatedPlayer.unlockedIngredients.includes(ingredient.id)) {
            newIngredients.push({ ...ingredient, unlockedAt: new Date().toISOString() });
            updatedPlayer.unlockedIngredients.push(ingredient.id);
            updatedPlayer.statistics.ingredientsCollected++;
          }
        }
      }

      savePlayerData(updatedPlayer);
      setState(prev => ({ ...prev, player: updatedPlayer }));

      const notifications: AchievementNotification[] = newAchievements.map(achievement => ({
        achievement,
        timestamp: new Date().toISOString(),
        xpGained: achievement.reward.xp,
        ingredientUnlocked: newIngredients.find(i => i.id === achievement.reward.ingredient),
        levelUp: progressionResult.levelUp ? {
          oldLevel: progressionResult.oldLevel,
          newLevel: progressionResult.newLevel,
          newTitle: PLAYER_LEVELS[progressionResult.newLevel]?.title || ''
        } : undefined
      }));

      addEvent({
        type: 'xp_gained',
        amount: xpGained,
        source: `Recipe submission (${response.rage_score} rage score)`,
        timestamp: new Date().toISOString()
      });

      for (const achievement of newAchievements) {
        addEvent({ type: 'achievement_unlocked', achievement, timestamp: new Date().toISOString() });
      }
      for (const ingredient of newIngredients) {
        addEvent({ type: 'ingredient_unlocked', ingredient, timestamp: new Date().toISOString() });
      }
      if (progressionResult.levelUp) {
        addEvent({
          type: 'level_up',
          oldLevel: progressionResult.oldLevel,
          newLevel: progressionResult.newLevel,
          newTitle: PLAYER_LEVELS[progressionResult.newLevel]?.title || '',
          timestamp: new Date().toISOString()
        });
      }

      setState(prev => ({
        ...prev,
        pendingNotifications: [...prev.pendingNotifications, ...notifications]
      }));

      return notifications;
    } catch (error) {
      console.error('Failed to process recipe submission:', error);
      setState(prev => ({ ...prev, error: 'Failed to process achievements' }));
      return [];
    }
  }, [savePlayerData, addEvent]);

  const clearNotifications = useCallback(() => {
    setState(prev => ({ ...prev, pendingNotifications: [] }));
  }, []);

  const getPlayerLevel = useCallback(() => {
    if (!state.player) return null;
    return PLAYER_LEVELS[state.player.level] || PLAYER_LEVELS[0];
  }, [state.player]);

  const getUnlockedIngredients = useCallback((): Ingredient[] => {
    if (!state.player) return [];
    return INGREDIENTS
      .filter(ingredient => state.player!.unlockedIngredients.includes(ingredient.id))
      .map(ingredient => ({ ...ingredient, unlockedAt: new Date().toISOString() }));
  }, [state.player]);

  const getProgress = useCallback(() => {
    if (!state.player) return { percentage: 0, xpToNext: 0, nextLevel: null };
    return {
      percentage: ProgressionService.getLevelProgress(state.player.totalXP),
      xpToNext: ProgressionService.getXPToNextLevel(state.player.totalXP),
      nextLevel: ProgressionService.getNextLevel(state.player.level)
    };
  }, [state.player]);

  const getAllChefProfiles = useCallback((): { name: string; profile: PlayerGamification }[] => {
    const map = readChefMap();
    return Object.entries(map)
      .map(([name, profile]) => ({ name, profile }))
      .sort((a, b) => b.profile.totalXP - a.profile.totalXP);
  }, []);

  const resetPlayerData = useCallback(() => {
    try {
      localStorage.removeItem(GAMIFICATION_STORAGE_KEY);
      localStorage.removeItem(GAMIFICATION_EVENTS_KEY);
      setState({
        player: null,
        recentEvents: [],
        pendingNotifications: [],
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Failed to reset gamification data:', error);
    }
  }, []);

  return {
    ...state,
    initializePlayer,
    loadChef,
    processRecipeSubmission,
    clearNotifications,
    getPlayerLevel,
    getUnlockedIngredients,
    getProgress,
    getAllChefProfiles,
    resetPlayerData
  };
}

// Utility hook for just checking if gamification is enabled
export function useHasGameificationData(): boolean {
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(GAMIFICATION_STORAGE_KEY);
    setHasData(!!stored);
  }, []);

  return hasData;
}

// Export ingredients for use in components
export { INGREDIENTS, ACHIEVEMENTS, PLAYER_LEVELS };
