import type { PlayerLevel, PlayerGamification } from '../types/gamification';
import type { JudgeResponse, Recipe, JudgeStyle } from '../types/game';

// Hell's Kitchen Player Level System
export const PLAYER_LEVELS: PlayerLevel[] = [
  {
    level: 0,
    title: 'Kitchen Disaster',
    icon: '💥',
    requiredXP: 0,
    description: 'You\'ve entered Hell\'s Kitchen. Gordon is already disappointed.',
    backgroundColor: 'bg-kitchen-800',
    textColor: 'text-kitchen-300'
  },
  {
    level: 1,
    title: 'Prep Cook Failure',
    icon: '🔪',
    requiredXP: 100,
    description: 'You can barely hold a knife without injuring yourself.',
    unlocks: ['Basic kitchen tools', 'Achievement tracking'],
    backgroundColor: 'bg-kitchen-700',
    textColor: 'text-kitchen-200'
  },
  {
    level: 2,
    title: 'Line Cook Trainee',
    icon: '👨‍🍳',
    requiredXP: 300,
    description: 'You\'re learning, but Gordon still shouts at you daily.',
    unlocks: ['Recipe complexity bonus', 'Ingredient collection'],
    backgroundColor: 'bg-flame-900',
    textColor: 'text-flame-100'
  },
  {
    level: 3,
    title: 'Junior Chef',
    icon: '🍳',
    requiredXP: 600,
    description: 'You can cook without burning the kitchen down... usually.',
    unlocks: ['Advanced achievements', 'Style mastery tracking'],
    backgroundColor: 'bg-flame-800',
    textColor: 'text-flame-100'
  },
  {
    level: 4,
    title: 'Line Cook',
    icon: '⚡',
    requiredXP: 1000,
    description: 'You\'ve survived the pressure. Gordon only yells occasionally.',
    unlocks: ['XP multipliers', 'Rare ingredient access'],
    backgroundColor: 'bg-flame-700',
    textColor: 'text-white'
  },
  {
    level: 5,
    title: 'Senior Chef',
    icon: '🎯',
    requiredXP: 1500,
    description: 'You\'re becoming competent. That\'s... concerning.',
    unlocks: ['Epic achievements', 'Leadership bonuses'],
    backgroundColor: 'bg-hell-800',
    textColor: 'text-white'
  },
  {
    level: 6,
    title: 'Sous Chef',
    icon: '🏆',
    requiredXP: 2200,
    description: 'Gordon trusts you with the kitchen. Don\'t mess it up.',
    unlocks: ['Legendary ingredient access', 'Master achievements'],
    backgroundColor: 'bg-hell-700',
    textColor: 'text-white'
  },
  {
    level: 7,
    title: 'Head Chef',
    icon: '👑',
    requiredXP: 3000,
    description: 'You run a kitchen now. Try not to traumatize the staff.',
    unlocks: ['Secret achievements', 'Ultimate challenges'],
    backgroundColor: 'bg-hell-600',
    textColor: 'text-white'
  },
  {
    level: 8,
    title: 'Executive Chef',
    icon: '🌟',
    requiredXP: 4000,
    description: 'Multiple kitchens bow to your terrible expertise.',
    unlocks: ['Mastery bonuses', 'Exclusive content'],
    backgroundColor: 'bg-hell-600 hell-glow',
    textColor: 'text-white'
  },
  {
    level: 9,
    title: 'Culinary Nightmare',
    icon: '💀',
    requiredXP: 5500,
    description: 'You\'ve achieved legendary terrible status. Gordon is proud... and horrified.',
    unlocks: ['Maximum XP bonuses', 'All achievements available'],
    backgroundColor: 'bg-gradient-to-r from-hell-600 to-kitchen-950',
    textColor: 'text-white'
  },
  {
    level: 10,
    title: 'Hell\'s Kitchen Master',
    icon: '🔥',
    requiredXP: 7500,
    description: 'You are the embodiment of culinary chaos. Even Gordon fears you.',
    unlocks: ['Master status', 'Infinite ingredient access', 'Legend status'],
    backgroundColor: 'bg-gradient-to-r from-hell-600 via-flame-600 to-hell-600 hell-glow',
    textColor: 'text-white'
  }
];

export class ProgressionService {
  /**
   * Calculate XP gained from a recipe submission
   */
  static calculateXP(
    recipe: Recipe,
    response: JudgeResponse,
    judgeStyle: JudgeStyle,
    playerLevel: number,
    isNewAchievement: boolean = false
  ): number {
    let baseXP = 10; // Base XP for any submission

    // Score-based XP (higher rage scores = more XP because they're funnier)
    const scoreMultiplier = Math.floor(response.rage_score / 10) + 1;
    baseXP += scoreMultiplier * 5;

    // Recipe complexity bonus
    const recipeLength = recipe.content.length;
    if (recipeLength > 500) {
      baseXP += 15; // Detailed disaster recipe
    } else if (recipeLength > 200) {
      baseXP += 10; // Medium effort
    } else if (recipeLength > 100) {
      baseXP += 5; // Basic effort
    }

    // Title bonus
    if (recipe.title && recipe.title.trim().length > 0) {
      baseXP += 5;
    }

    // Judge style variety bonus
    const styleBonuses = {
      'classic-rage': 1.0,
      'dry-sarcasm': 1.1,
      'disappointed': 1.2,
      'constructive': 1.3
    };
    baseXP = Math.floor(baseXP * (styleBonuses[judgeStyle] || 1.0));

    // Level-based bonus (higher level players get slightly more XP)
    const levelBonus = Math.floor(playerLevel * 0.1);
    baseXP += levelBonus;

    // Achievement bonus
    if (isNewAchievement) {
      baseXP = Math.floor(baseXP * 1.5);
    }

    // Similarity penalty (if applicable)
    if (response.similarity && response.similarity.penalty > 0) {
      const penaltyMultiplier = Math.max(0.5, 1 - (response.similarity.penalty / 100));
      baseXP = Math.floor(baseXP * penaltyMultiplier);
    }

    return Math.max(5, baseXP); // Minimum 5 XP
  }

  /**
   * Get player level from total XP
   */
  static getLevelFromXP(totalXP: number): PlayerLevel {
    for (let i = PLAYER_LEVELS.length - 1; i >= 0; i--) {
      if (totalXP >= PLAYER_LEVELS[i].requiredXP) {
        return PLAYER_LEVELS[i];
      }
    }
    return PLAYER_LEVELS[0];
  }

  /**
   * Get next level information
   */
  static getNextLevel(currentLevel: number): PlayerLevel | null {
    const nextLevelIndex = currentLevel + 1;
    if (nextLevelIndex < PLAYER_LEVELS.length) {
      return PLAYER_LEVELS[nextLevelIndex];
    }
    return null; // Max level reached
  }

  /**
   * Calculate XP needed for next level
   */
  static getXPToNextLevel(currentXP: number): number {
    const currentLevel = this.getLevelFromXP(currentXP);
    const nextLevel = this.getNextLevel(currentLevel.level);

    if (!nextLevel) {
      return 0; // Max level reached
    }

    return nextLevel.requiredXP - currentXP;
  }

  /**
   * Calculate progress percentage to next level
   */
  static getLevelProgress(currentXP: number): number {
    const currentLevel = this.getLevelFromXP(currentXP);
    const nextLevel = this.getNextLevel(currentLevel.level);

    if (!nextLevel) {
      return 100; // Max level reached
    }

    const currentLevelXP = currentLevel.requiredXP;
    const nextLevelXP = nextLevel.requiredXP;
    const progressXP = currentXP - currentLevelXP;
    const neededXP = nextLevelXP - currentLevelXP;

    return Math.floor((progressXP / neededXP) * 100);
  }

  /**
   * Update player gamification data after submission
   */
  static updatePlayerGamification(
    playerGamification: PlayerGamification,
    _recipe: Recipe,
    response: JudgeResponse,
    judgeStyle: JudgeStyle,
    xpGained: number
  ): {
    updatedPlayer: PlayerGamification;
    levelUp: boolean;
    oldLevel: number;
    newLevel: number;
  } {
    const oldLevel = playerGamification.level;
    const newTotalXP = playerGamification.totalXP + xpGained;
    const newLevelData = this.getLevelFromXP(newTotalXP);

    // Update statistics
    const stats = playerGamification.statistics;
    const newTotalRecipes = stats.totalRecipes + 1;
    const newAverageScore = Math.floor(
      ((stats.averageScore * stats.totalRecipes) + response.rage_score) / newTotalRecipes
    );

    // Update score range statistics
    const scoreRanges = { ...stats.scoresPerRange };
    if (response.rage_score >= 90) scoreRanges.range90_100++;
    else if (response.rage_score >= 80) scoreRanges.range80_89++;
    else if (response.rage_score >= 70) scoreRanges.range70_79++;
    else if (response.rage_score >= 60) scoreRanges.range60_69++;
    else if (response.rage_score >= 50) scoreRanges.range50_59++;
    else if (response.rage_score >= 40) scoreRanges.range40_49++;
    else if (response.rage_score >= 30) scoreRanges.range30_39++;
    else if (response.rage_score >= 20) scoreRanges.range20_29++;
    else if (response.rage_score >= 10) scoreRanges.range10_19++;
    else scoreRanges.range0_9++;

    // Update most common tags
    const updatedTags = [...stats.mostCommonTags];
    response.tags.forEach(tag => {
      if (!updatedTags.includes(tag) && updatedTags.length < 10) {
        updatedTags.push(tag);
      }
    });

    const updatedPlayer: PlayerGamification = {
      ...playerGamification,
      level: newLevelData.level,
      xp: newTotalXP - newLevelData.requiredXP,
      totalXP: newTotalXP,
      title: newLevelData.title,
      lastUpdated: new Date().toISOString(),
      statistics: {
        ...stats,
        totalRecipes: newTotalRecipes,
        averageScore: newAverageScore,
        highestScore: Math.max(stats.highestScore, response.rage_score),
        lowestScore: Math.min(stats.lowestScore || 100, response.rage_score),
        totalXPEarned: stats.totalXPEarned + xpGained,
        scoresPerRange: scoreRanges,
        mostCommonTags: updatedTags,
        favoriteJudgeStyle: judgeStyle // Could be calculated based on most used
      }
    };

    return {
      updatedPlayer,
      levelUp: newLevelData.level > oldLevel,
      oldLevel,
      newLevel: newLevelData.level
    };
  }

  /**
   * Get level display information
   */
  static getLevelDisplayInfo(level: number): {
    current: PlayerLevel;
    next: PlayerLevel | null;
    isMaxLevel: boolean;
  } {
    const current = PLAYER_LEVELS[level] || PLAYER_LEVELS[0];
    const next = this.getNextLevel(level);
    const isMaxLevel = next === null;

    return { current, next, isMaxLevel };
  }

  /**
   * Initialize new player gamification data
   */
  static initializePlayer(_playerName: string): PlayerGamification {
    return {
      level: 0,
      xp: 0,
      totalXP: 0,
      title: PLAYER_LEVELS[0].title,
      unlockedAchievements: [],
      unlockedIngredients: [],
      statistics: {
        totalRecipes: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 100,
        totalXPEarned: 0,
        achievementsUnlocked: 0,
        ingredientsCollected: 0,
        consecutiveSubmissions: 0,
        maxConsecutive: 0,
        mostCommonTags: [],
        scoresPerRange: {
          range90_100: 0,
          range80_89: 0,
          range70_79: 0,
          range60_69: 0,
          range50_59: 0,
          range40_49: 0,
          range30_39: 0,
          range20_29: 0,
          range10_19: 0,
          range0_9: 0
        }
      },
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
  }
}