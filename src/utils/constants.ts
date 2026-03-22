import type { JudgeStyle } from '../types/game';

// Judge style options for the UI
export const JUDGE_STYLES: Array<{
  value: JudgeStyle;
  label: string;
  description: string;
}> = [
  {
    value: 'classic-rage',
    label: 'Classic Rage',
    description: 'Traditional Gordon Ramsay fury - explosive anger and dramatic reactions'
  },
  {
    value: 'dry-sarcasm',
    label: 'Dry Sarcasm',
    description: 'Cutting wit and sophisticated insults instead of screaming'
  },
  {
    value: 'disappointed',
    label: 'Disappointed',
    description: 'Deeply disappointed rather than angry - gentle but firm corrections'
  },
  {
    value: 'constructive',
    label: 'Constructive',
    description: 'Teaching mode - harsh but educational feedback'
  }
];

// Rage score thresholds and labels
export const RAGE_SCORE_LEVELS = [
  { min: 90, max: 100, label: 'ABSOLUTE DISASTER', color: 'bg-red-900 text-white', emoji: '💀' },
  { min: 80, max: 89, label: 'KITCHEN NIGHTMARE', color: 'bg-red-800 text-white', emoji: '🔥' },
  { min: 70, max: 79, label: 'BLOODY AWFUL', color: 'bg-red-700 text-white', emoji: '😡' },
  { min: 60, max: 69, label: 'TERRIBLE', color: 'bg-red-600 text-white', emoji: '😤' },
  { min: 50, max: 59, label: 'POOR', color: 'bg-orange-600 text-white', emoji: '😮‍💨' },
  { min: 40, max: 49, label: 'NEEDS WORK', color: 'bg-orange-500 text-white', emoji: '🤔' },
  { min: 30, max: 39, label: 'MEDIOCRE', color: 'bg-yellow-500 text-black', emoji: '😐' },
  { min: 20, max: 29, label: 'NOT BAD', color: 'bg-yellow-400 text-black', emoji: '🙂' },
  { min: 10, max: 19, label: 'DECENT', color: 'bg-green-400 text-black', emoji: '👍' },
  { min: 0, max: 9, label: 'ACTUALLY GOOD', color: 'bg-green-600 text-white', emoji: '✨' }
];

// Storage keys
export const STORAGE_KEYS = {
  API_KEY: 'ragebait-openai-key',
  LEADERBOARD: 'ragebait-leaderboard',
  PLAYER_NAME: 'ragebait-player-name',
  SETTINGS: 'ragebait-settings'
} as const;

// Validation limits
export const LIMITS = {
  RECIPE_TITLE_MAX: 100,
  RECIPE_CONTENT_MAX: 5000,
  RECIPE_CONTENT_MIN: 5,
  PLAYER_NAME_MAX: 50,
  PLAYER_NAME_MIN: 1,
  LEADERBOARD_PAGE_SIZE: 10,
  MAX_TAGS: 10,
  MAX_REASONS: 15,
  REACTION_MAX: 2000,
  REACTION_MIN: 10
} as const;

// API configuration
export const API_CONFIG = {
  MAX_RETRIES: 2,
  RETRY_DELAY: 1000,
  REQUEST_TIMEOUT: 30000,
  OPENAI_MODEL: 'gpt-4'
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NO_API_KEY: 'Please enter your OpenAI API key to judge recipes',
  INVALID_API_KEY: 'Invalid OpenAI API key format',
  RECIPE_TOO_SHORT: `Recipe must be at least ${LIMITS.RECIPE_CONTENT_MIN} characters`,
  RECIPE_TOO_LONG: `Recipe must be less than ${LIMITS.RECIPE_CONTENT_MAX} characters`,
  PLAYER_NAME_REQUIRED: 'Player name is required',
  PLAYER_NAME_TOO_LONG: `Player name must be less than ${LIMITS.PLAYER_NAME_MAX} characters`,
  NETWORK_ERROR: 'Network error - please check your connection',
  RATE_LIMIT: 'Too many requests - please wait a moment',
  VALIDATION_ERROR: 'Invalid response from AI judge',
  UNKNOWN_ERROR: 'An unexpected error occurred'
} as const;

// UI constants
export const UI_CONFIG = {
  LOADING_MESSAGES: [
    'Gordon is reading your recipe...',
    'Preparing the judgment...',
    'Analyzing your cooking disaster...',
    'Gordon is getting angrier...',
    'Calculating rage levels...'
  ],
  EMPTY_STATES: {
    NO_LEADERBOARD: 'No entries yet. Submit a recipe to get started!',
    NO_RESULTS: 'No results found.',
    NO_API_KEY: 'Enter your OpenAI API key to start judging recipes.'
  }
} as const;

// Helper function to get rage score level
export function getRageScoreLevel(score: number) {
  return RAGE_SCORE_LEVELS.find(level => score >= level.min && score <= level.max)
    || RAGE_SCORE_LEVELS[RAGE_SCORE_LEVELS.length - 1]; // fallback to lowest level
}

// Helper function to get random loading message
export function getRandomLoadingMessage(): string {
  return UI_CONFIG.LOADING_MESSAGES[
    Math.floor(Math.random() * UI_CONFIG.LOADING_MESSAGES.length)
  ];
}