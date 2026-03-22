import { z } from 'zod';

// Zod schema for validating OpenAI judge responses
export const judgeResponseSchema = z.object({
  rage_score: z.number()
    .min(0, 'Rage score must be at least 0')
    .max(100, 'Rage score must be at most 100')
    .int('Rage score must be an integer'),
  tags: z.array(z.string().min(1, 'Tags cannot be empty'))
    .min(1, 'At least one tag is required')
    .max(10, 'Too many tags'),
  reasons: z.array(z.string().min(1, 'Reasons cannot be empty'))
    .min(1, 'At least one reason is required')
    .max(15, 'Too many reasons'),
  reaction: z.string()
    .min(10, 'Reaction must be at least 10 characters')
    .max(2000, 'Reaction is too long'),
  similarity: z.object({
    maxSimilarity: z.number().min(0).max(1),
    originalScore: z.number().min(0).max(100),
    penalty: z.number().min(0),
    penaltyType: z.enum(['none', 'minor', 'moderate', 'severe']),
    message: z.string(),
    mostSimilarRecipe: z.object({
      title: z.string().optional(),
      content: z.string()
    }).optional()
  }).optional()
});

// Zod schema for validating leaderboard entries
export const leaderboardEntrySchema = z.object({
  id: z.string().uuid('Invalid UUID format'),
  createdAt: z.string().datetime('Invalid datetime format'),
  playerName: z.string()
    .min(1, 'Player name is required')
    .max(50, 'Player name too long'),
  recipeTitle: z.string().max(100, 'Recipe title too long').optional(),
  recipeContent: z.string()
    .min(1, 'Recipe content is required')
    .max(5000, 'Recipe content too long'),
  rage_score: z.number().min(0).max(100).int(),
  tags: z.array(z.string()).min(1),
  reaction: z.string().min(1),
  judgeStyle: z.string().min(1),
});

// Zod schema for validating recipe input
export const recipeSchema = z.object({
  title: z.string()
    .max(100, 'Recipe title too long')
    .optional(),
  content: z.string()
    .min(5, 'Recipe must be at least 5 characters')
    .max(5000, 'Recipe is too long'),
});

// Zod schema for validating API key format (flexible for different providers)
export const apiKeySchema = z.string()
  .min(1, 'API key is required')
  .refine((key) => {
    // OpenAI format
    if (key.startsWith('sk-')) return /^sk-[a-zA-Z0-9]{20,}$/.test(key);
    // Azure OpenAI format
    if (/^[a-f0-9]{32}$/.test(key)) return true;
    // Generic API key (allow other formats)
    if (key.length >= 8) return true;
    return false;
  }, 'Invalid API key format');

// Zod schema for validating custom API endpoint
export const customEndpointSchema = z.string()
  .url('Must be a valid URL')
  .refine((url) => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'https:' || parsedUrl.hostname === 'localhost' || parsedUrl.hostname === '127.0.0.1';
    } catch {
      return false;
    }
  }, 'Must use HTTPS or be a localhost URL')
  .optional();

// Zod schema for validating player name
export const playerNameSchema = z.string()
  .min(1, 'Player name is required')
  .max(50, 'Player name too long')
  .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Player name contains invalid characters');

// Type exports
export type ValidatedJudgeResponse = z.infer<typeof judgeResponseSchema>;
export type ValidatedLeaderboardEntry = z.infer<typeof leaderboardEntrySchema>;
export type ValidatedRecipe = z.infer<typeof recipeSchema>;
export type ValidatedApiKey = z.infer<typeof apiKeySchema>;
export type ValidatedCustomEndpoint = z.infer<typeof customEndpointSchema>;
export type ValidatedPlayerName = z.infer<typeof playerNameSchema>;

// Helper function to safely validate with error handling
export function validateWithSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context: string = 'data'
): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map(e => `${e.path.join('.')}: ${e.message}`)
        .join(', ');
      return {
        success: false,
        error: `Invalid ${context}: ${errorMessage}`
      };
    }
    return {
      success: false,
      error: `Validation failed for ${context}: ${String(error)}`
    };
  }
}