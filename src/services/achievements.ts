import type { Achievement, AchievementNotification, PlayerGamification, XPCalculationContext } from '../types/gamification';
import type { JudgeResponse, Recipe, JudgeStyle } from '../types/game';
import type { LeaderboardEntry } from '../types/leaderboard';

// Hell's Kitchen Achievement Definitions
export const ACHIEVEMENTS: Achievement[] = [
  // Scoring Achievements
  {
    id: 'hell_survivor',
    name: 'Hell\'s Kitchen Survivor',
    description: 'Score your first 90+ rage score',
    icon: '💀',
    category: 'scoring',
    criteria: { type: 'score_threshold', value: 90 },
    reward: { xp: 100, description: 'Survived Gordon\'s worst fury' },
    rarity: 'rare'
  },
  {
    id: 'gordon_nightmare',
    name: 'Gordon\'s Nightmare',
    description: 'Achieve a perfect 100 rage score',
    icon: '🔥',
    category: 'scoring',
    criteria: { type: 'score_threshold', value: 100 },
    reward: { xp: 200, title: 'Nightmare Chef', description: 'The stuff of Gordon\'s nightmares' },
    rarity: 'legendary'
  },
  {
    id: 'consistent_disaster',
    name: 'Consistent Disaster',
    description: 'Score 80+ on 5 consecutive recipes',
    icon: '⚡',
    category: 'scoring',
    criteria: { type: 'consecutive', value: 80, count: 5 },
    reward: { xp: 150, description: 'Reliably terrible cooking' },
    rarity: 'epic'
  },
  {
    id: 'redemption_arc',
    name: 'Redemption Arc',
    description: 'Score under 20 after getting 90+',
    icon: '✨',
    category: 'scoring',
    criteria: { type: 'custom', customCheck: 'redemption_check' },
    reward: { xp: 120, description: 'From disaster to decent' },
    rarity: 'epic'
  },

  // Cooking Method Achievements
  {
    id: 'microwave_master',
    name: 'Microwave Master',
    description: 'Submit 10 recipes mentioning microwave',
    icon: '📱',
    category: 'cooking',
    criteria: { type: 'custom', customCheck: 'microwave_count', count: 10 },
    reward: { xp: 80, ingredient: 'cursed_microwave', description: 'Master of the forbidden cooking method' },
    rarity: 'rare'
  },
  {
    id: 'burnt_specialist',
    name: 'Burnt Offering Specialist',
    description: 'Get "burnt" tag 5 times',
    icon: '🔥',
    category: 'cooking',
    criteria: { type: 'tags_match', tags: ['burnt', 'burned', 'charred'], count: 5 },
    reward: { xp: 60, ingredient: 'charcoal_seasoning', description: 'Everything you touch turns to ash' },
    rarity: 'common'
  },
  {
    id: 'salt_overdose',
    name: 'Salt Overdose Champion',
    description: 'Get "too salty" or similar tag 3 times',
    icon: '🧂',
    category: 'cooking',
    criteria: { type: 'tags_match', tags: ['salty', 'salt', 'oversalted'], count: 3 },
    reward: { xp: 50, ingredient: 'himalayan_salt_mountain', description: 'When in doubt, add more salt' },
    rarity: 'common'
  },
  {
    id: 'raw_enthusiast',
    name: 'Raw Food Enthusiast',
    description: 'Submit raw or undercooked recipes 7 times',
    icon: '🥩',
    category: 'cooking',
    criteria: { type: 'tags_match', tags: ['raw', 'undercooked', 'uncooked'], count: 7 },
    reward: { xp: 70, ingredient: 'salmonella_starter', description: 'Cooking is optional' },
    rarity: 'rare'
  },

  // Creativity Achievements
  {
    id: 'fusion_disaster',
    name: 'Fusion Disaster',
    description: 'Create unholy fusion combinations',
    icon: '🌍',
    category: 'creativity',
    criteria: { type: 'custom', customCheck: 'fusion_combo' },
    reward: { xp: 90, description: 'Mixed cuisines in the worst way' },
    rarity: 'epic'
  },
  {
    id: 'ingredient_anarchist',
    name: 'Ingredient Anarchist',
    description: 'Use 20+ ingredients in one recipe',
    icon: '🥄',
    category: 'creativity',
    criteria: { type: 'custom', customCheck: 'ingredient_count', value: 20 },
    reward: { xp: 100, ingredient: 'chaos_spice_rack', description: 'More is definitely more' },
    rarity: 'epic'
  },
  {
    id: 'sweet_disaster',
    name: 'Sweet & Savory Disaster',
    description: 'Mix dessert ingredients with main course',
    icon: '🍰',
    category: 'creativity',
    criteria: { type: 'custom', customCheck: 'sweet_savory_combo' },
    reward: { xp: 75, ingredient: 'confused_sugar', description: 'Sugar belongs everywhere, right?' },
    rarity: 'rare'
  },

  // Frequency Achievements
  {
    id: 'frequent_offender',
    name: 'Frequent Offender',
    description: 'Submit 25 recipes total',
    icon: '📊',
    category: 'frequency',
    criteria: { type: 'submission_count', value: 25 },
    reward: { xp: 150, title: 'Kitchen Regular', description: 'You just keep coming back' },
    rarity: 'epic'
  },
  {
    id: 'daily_disaster',
    name: 'Daily Disaster',
    description: 'Submit recipes on 7 different days',
    icon: '📅',
    category: 'frequency',
    criteria: { type: 'custom', customCheck: 'daily_streak', value: 7 },
    reward: { xp: 120, description: 'Consistency in chaos' },
    rarity: 'rare'
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Submit 3 recipes in under 10 minutes',
    icon: '⚡',
    category: 'frequency',
    criteria: { type: 'custom', customCheck: 'speed_submissions' },
    reward: { xp: 80, description: 'Fast and furious cooking disasters' },
    rarity: 'rare'
  },

  // Special Achievements
  {
    id: 'similarity_repeat',
    name: 'Copy Cat Chef',
    description: 'Get similarity penalty 3 times',
    icon: '👥',
    category: 'special',
    criteria: { type: 'similarity_penalty', count: 3 },
    reward: { xp: 40, description: 'Originality is overrated' },
    rarity: 'common'
  },
  {
    id: 'judge_style_master',
    name: 'Judge Style Master',
    description: 'Try all 4 judge styles',
    icon: '🎭',
    category: 'special',
    criteria: { type: 'custom', customCheck: 'all_judge_styles' },
    reward: { xp: 100, description: 'Experienced all forms of criticism' },
    rarity: 'rare'
  },
  {
    id: 'first_victim',
    name: 'First Victim',
    description: 'Submit your very first recipe',
    icon: '🎯',
    category: 'special',
    criteria: { type: 'submission_count', value: 1 },
    reward: { xp: 50, description: 'Welcome to Hell\'s Kitchen!' },
    rarity: 'common'
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Write recipes with 500+ characters',
    icon: '📝',
    category: 'creativity',
    criteria: { type: 'custom', customCheck: 'detailed_recipe', value: 500 },
    reward: { xp: 60, description: 'Attention to disastrous detail' },
    rarity: 'common'
  },
  {
    id: 'minimalist_chef',
    name: 'Minimalist Chef',
    description: 'Submit 5 recipes under 50 characters',
    icon: '✂️',
    category: 'creativity',
    criteria: { type: 'custom', customCheck: 'short_recipes', count: 5 },
    reward: { xp: 70, description: 'Less is... still terrible' },
    rarity: 'rare'
  },

  // Secret Achievements
  {
    id: 'gordon_speechless',
    name: 'Gordon Speechless',
    description: 'Create something so bad Gordon has no words',
    icon: '🤐',
    category: 'special',
    criteria: { type: 'custom', customCheck: 'speechless_gordon' },
    reward: { xp: 300, title: 'The Unspeakable', description: 'Even Gordon was left speechless' },
    rarity: 'legendary',
    isSecret: true
  },
  {
    id: 'kitchen_arsonist',
    name: 'Kitchen Arsonist',
    description: 'Get fire-related tags 10 times',
    icon: '🔥',
    category: 'cooking',
    criteria: { type: 'tags_match', tags: ['fire', 'flame', 'burning', 'smoke'], count: 10 },
    reward: { xp: 200, ingredient: 'eternal_flame', description: 'You bring the heat... too much heat' },
    rarity: 'legendary',
    isSecret: true
  }
];

// Achievement Detection Service
export class AchievementService {
  private static playerStats: Map<string, any> = new Map();

  /**
   * Check for new achievements after a recipe submission
   */
  static async checkAchievements(
    recipe: Recipe,
    response: JudgeResponse,
    playerName: string,
    judgeStyle: JudgeStyle,
    playerGamification: PlayerGamification,
    leaderboardEntries: LeaderboardEntry[]
  ): Promise<Achievement[]> {
    const newAchievements: Achievement[] = [];
    const context = this.buildContext(recipe, response, judgeStyle, playerGamification, leaderboardEntries);

    for (const achievement of ACHIEVEMENTS) {
      // Skip if already unlocked
      if (playerGamification.unlockedAchievements.includes(achievement.id)) {
        continue;
      }

      if (this.evaluateAchievement(achievement, context, playerGamification, leaderboardEntries)) {
        newAchievements.push(achievement);
      }
    }

    return newAchievements;
  }

  /**
   * Evaluate if an achievement should be unlocked
   */
  private static evaluateAchievement(
    achievement: Achievement,
    context: XPCalculationContext,
    playerGamification: PlayerGamification,
    leaderboardEntries: LeaderboardEntry[]
  ): boolean {
    const { criteria } = achievement;

    switch (criteria.type) {
      case 'score_threshold':
        return context.rageScore >= (criteria.value || 0);

      case 'score_range':
        return context.rageScore >= (criteria.min || 0) &&
               context.rageScore <= (criteria.max || 100);

      case 'submission_count':
        return playerGamification.statistics.totalRecipes + 1 >= (criteria.value || 0);

      case 'consecutive':
        return this.checkConsecutiveScore(criteria.value || 0, criteria.count || 1, leaderboardEntries);

      case 'tags_match':
        return this.checkTagsMatch(criteria.tags || [], context.tags, criteria.count || 1, leaderboardEntries);

      case 'similarity_penalty':
        return this.checkSimilarityPenalties(criteria.count || 1, leaderboardEntries);

      case 'custom':
        return this.evaluateCustomCriteria(criteria.customCheck || '', context, playerGamification, leaderboardEntries);

      default:
        return false;
    }
  }

  /**
   * Check consecutive score achievements
   */
  private static checkConsecutiveScore(minScore: number, count: number, entries: LeaderboardEntry[]): boolean {
    const recentEntries = entries.slice(0, count - 1); // -1 because current submission not in entries yet
    return recentEntries.length >= count - 1 && recentEntries.every(entry => entry.rage_score >= minScore);
  }

  /**
   * Check tag-based achievements
   */
  private static checkTagsMatch(targetTags: string[], currentTags: string[], requiredCount: number, entries: LeaderboardEntry[]): boolean {
    let matchCount = 0;

    // Check current tags
    for (const tag of currentTags) {
      if (targetTags.some(targetTag => tag.toLowerCase().includes(targetTag.toLowerCase()))) {
        matchCount++;
        break; // Only count once per submission
      }
    }

    // Check previous entries
    for (const entry of entries) {
      for (const tag of entry.tags) {
        if (targetTags.some(targetTag => tag.toLowerCase().includes(targetTag.toLowerCase()))) {
          matchCount++;
          break; // Only count once per submission
        }
      }
    }

    return matchCount >= requiredCount;
  }

  /**
   * Check similarity penalty achievements
   */
  private static checkSimilarityPenalties(requiredCount: number, entries: LeaderboardEntry[]): boolean {
    // This would need to be tracked separately as similarity info isn't stored in leaderboard entries
    // For now, return false - would need to enhance storage to track similarity penalties
    return false;
  }

  /**
   * Evaluate custom achievement criteria
   */
  private static evaluateCustomCriteria(
    customCheck: string,
    context: XPCalculationContext,
    playerGamification: PlayerGamification,
    entries: LeaderboardEntry[]
  ): boolean {
    switch (customCheck) {
      case 'microwave_count':
        return this.countKeywordMentions('microwave', entries) >= 10;

      case 'fusion_combo':
        return this.detectFusionCombination(context);

      case 'ingredient_count':
        return this.countIngredients(context) >= (context as any).value || 20;

      case 'sweet_savory_combo':
        return this.detectSweetSavoryCombo(context);

      case 'all_judge_styles':
        return this.checkAllJudgeStyles(entries);

      case 'detailed_recipe':
        return context.recipeLength >= 500;

      case 'short_recipes':
        return this.countShortRecipes(entries) >= 5;

      case 'redemption_check':
        return this.checkRedemptionArc(context.rageScore, entries);

      case 'speechless_gordon':
        return this.checkSpeechlessGordon(context);

      default:
        return false;
    }
  }

  /**
   * Build context for achievement evaluation
   */
  private static buildContext(
    recipe: Recipe,
    response: JudgeResponse,
    judgeStyle: JudgeStyle,
    playerGamification: PlayerGamification,
    entries: LeaderboardEntry[]
  ): XPCalculationContext {
    return {
      rageScore: response.rage_score,
      judgeStyle,
      recipeLength: recipe.content.length,
      hasTitle: !!recipe.title,
      tags: response.tags,
      similarityPenalty: response.similarity?.penalty,
      isFirstSubmission: playerGamification.statistics.totalRecipes === 0,
      consecutiveDay: 1 // Would need date tracking
    };
  }

  // Helper methods for custom criteria
  private static countKeywordMentions(keyword: string, entries: LeaderboardEntry[]): number {
    return entries.filter(entry =>
      entry.recipeContent.toLowerCase().includes(keyword.toLowerCase())
    ).length;
  }

  private static detectFusionCombination(context: XPCalculationContext): boolean {
    const content = (context as any).recipeContent?.toLowerCase() || '';
    const fusionIndicators = ['sushi pizza', 'taco pasta', 'burger curry', 'ramen burrito', 'chinese italian'];
    return fusionIndicators.some(indicator => content.includes(indicator));
  }

  private static countIngredients(context: XPCalculationContext): number {
    const content = (context as any).recipeContent || '';
    // Simple ingredient counting based on common separators
    return content.split(/[,\n-]/).length;
  }

  private static detectSweetSavoryCombo(context: XPCalculationContext): boolean {
    const content = (context as any).recipeContent?.toLowerCase() || '';
    const sweet = ['sugar', 'chocolate', 'candy', 'cake', 'cookie', 'frosting'];
    const savory = ['meat', 'chicken', 'beef', 'bacon', 'cheese', 'garlic'];

    const hasSweet = sweet.some(item => content.includes(item));
    const hasSavory = savory.some(item => content.includes(item));

    return hasSweet && hasSavory;
  }

  private static checkAllJudgeStyles(entries: LeaderboardEntry[]): boolean {
    const usedStyles = new Set(entries.map(entry => entry.judgeStyle));
    return usedStyles.size >= 4; // All 4 judge styles
  }

  private static countShortRecipes(entries: LeaderboardEntry[]): number {
    return entries.filter(entry => entry.recipeContent.length < 50).length;
  }

  private static checkRedemptionArc(currentScore: number, entries: LeaderboardEntry[]): boolean {
    if (currentScore >= 20) return false;
    return entries.some(entry => entry.rage_score >= 90);
  }

  private static checkSpeechlessGordon(context: XPCalculationContext): boolean {
    const reaction = (context as any).reaction?.toLowerCase() || '';
    return reaction.length < 50 && context.rageScore >= 95; // Very short reaction + very high score
  }
}