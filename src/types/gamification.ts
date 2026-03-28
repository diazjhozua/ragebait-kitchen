// Gamification system types for Hell's Kitchen game

export type AchievementCategory = 'cooking' | 'scoring' | 'creativity' | 'frequency' | 'special';
export type IngredientRarity = 'common' | 'rare' | 'epic' | 'legendary';

// Player progression system
export interface PlayerLevel {
  level: number;
  title: string;
  icon: string;
  requiredXP: number;
  description: string;
  unlocks?: string[];
  backgroundColor: string;
  textColor: string;
}

// Achievement system
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  criteria: AchievementCriteria;
  reward: AchievementReward;
  rarity: IngredientRarity;
  isSecret?: boolean; // Hidden until unlocked
  unlockedAt?: string; // ISO timestamp when unlocked
}

export interface AchievementCriteria {
  type: 'score_threshold' | 'score_range' | 'submission_count' | 'consecutive' | 'tags_match' | 'similarity_penalty' | 'custom';
  value?: number;
  min?: number;
  max?: number;
  tags?: string[];
  count?: number;
  customCheck?: string; // Custom criteria identifier
}

export interface AchievementReward {
  xp: number;
  title?: string;
  ingredient?: string;
  description: string;
}

// Ingredient collection system
export interface Ingredient {
  id: string;
  name: string;
  icon: string;
  rarity: IngredientRarity;
  description: string;
  unlockedBy: string; // achievement ID or score threshold
  category: 'protein' | 'vegetable' | 'spice' | 'sauce' | 'tool' | 'technique';
  unlockedAt?: string; // ISO timestamp when unlocked
}

// Player gamification state
export interface PlayerGamification {
  name: string;
  level: number;
  xp: number;
  totalXP: number;
  title: string;
  unlockedAchievements: string[];
  unlockedIngredients: string[];
  statistics: PlayerStatistics;
  createdAt: string;
  lastUpdated: string;
}

// Per-chef gamification map stored in localStorage
export type ChefGamificationMap = Record<string, PlayerGamification>;

export interface PlayerStatistics {
  totalRecipes: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  totalXPEarned: number;
  achievementsUnlocked: number;
  ingredientsCollected: number;
  consecutiveSubmissions: number;
  maxConsecutive: number;
  favoriteJudgeStyle?: string;
  mostCommonTags: string[];
  scoresPerRange: {
    range90_100: number;
    range80_89: number;
    range70_79: number;
    range60_69: number;
    range50_59: number;
    range40_49: number;
    range30_39: number;
    range20_29: number;
    range10_19: number;
    range0_9: number;
  };
}

// XP calculation context
export interface XPCalculationContext {
  rageScore: number;
  judgeStyle: string;
  recipeLength: number;
  hasTitle: boolean;
  tags: string[];
  similarityPenalty?: number;
  isFirstSubmission: boolean;
  consecutiveDay: number;
}

// Achievement notification
export interface AchievementNotification {
  achievement: Achievement;
  timestamp: string;
  xpGained: number;
  ingredientUnlocked?: Ingredient;
  levelUp?: {
    oldLevel: number;
    newLevel: number;
    newTitle: string;
  };
}

// Gamification events
export type GamificationEvent =
  | { type: 'achievement_unlocked'; achievement: Achievement; timestamp: string }
  | { type: 'level_up'; oldLevel: number; newLevel: number; newTitle: string; timestamp: string }
  | { type: 'ingredient_unlocked'; ingredient: Ingredient; timestamp: string }
  | { type: 'xp_gained'; amount: number; source: string; timestamp: string };

// Storage interfaces
export interface GamificationStorage {
  player: PlayerGamification;
  achievements: Achievement[];
  ingredients: Ingredient[];
  events: GamificationEvent[];
}