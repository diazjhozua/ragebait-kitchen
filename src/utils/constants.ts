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

// Hell's Kitchen themed rage score levels
export const RAGE_SCORE_LEVELS = [
  { min: 90, max: 100, label: 'HELL\'S KITCHEN DISASTER', color: 'bg-hell-900 text-white hell-glow', emoji: '💀', intensity: 'APOCALYPTIC' },
  { min: 80, max: 89, label: 'GORDON\'S NIGHTMARE', color: 'bg-hell-800 text-white flame-glow', emoji: '🔥', intensity: 'INFERNAL' },
  { min: 70, max: 79, label: 'BLOODY CATASTROPHE', color: 'bg-hell-700 text-white', emoji: '😡', intensity: 'BLAZING' },
  { min: 60, max: 69, label: 'KITCHEN CHAOS', color: 'bg-hell-600 text-white', emoji: '😤', intensity: 'HEATED' },
  { min: 50, max: 59, label: 'CULINARY CRISIS', color: 'bg-flame-600 text-white', emoji: '😮‍💨', intensity: 'WARM' },
  { min: 40, max: 49, label: 'NEEDS CHEF TRAINING', color: 'bg-flame-500 text-white', emoji: '🤔', intensity: 'WARM' },
  { min: 30, max: 39, label: 'AMATEUR HOUR', color: 'bg-yellow-500 text-black', emoji: '😐', intensity: 'COOL' },
  { min: 20, max: 29, label: 'PASSABLE EFFORT', color: 'bg-yellow-400 text-black', emoji: '🙂', intensity: 'COOL' },
  { min: 10, max: 19, label: 'KITCHEN APPROVED', color: 'bg-green-400 text-black', emoji: '👍', intensity: 'COOL' },
  { min: 0, max: 9, label: 'MICHELIN WORTHY', color: 'bg-green-600 text-white', emoji: '✨', intensity: 'COOL' }
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
  OPENAI_MODEL: 'gpt-4o'
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
    '🔥 Gordon is firing up the kitchen...',
    '👨‍🍳 Chef Ramsay is reviewing your disaster...',
    '😤 Preparing the Hell\'s Kitchen judgment...',
    '💀 Analyzing your culinary catastrophe...',
    '🎯 Gordon is getting FURIOUS...',
    '⚡ Calculating rage levels...',
    '🔥 The heat is rising in the kitchen...',
    '💣 Gordon\'s anger is building...'
  ],
  EMPTY_STATES: {
    NO_LEADERBOARD: '🍽️ No disasters recorded yet. Submit your recipe to face Gordon\'s wrath!',
    NO_RESULTS: '🔍 No culinary catastrophes found.',
    NO_API_KEY: '🔑 Enter your OpenAI API key to enter Hell\'s Kitchen.'
  },
  HELL_KITCHEN_PHRASES: [
    'Welcome to Hell\'s Kitchen!',
    'The heat is ON!',
    'Gordon is watching...',
    'Competition is FIERCE!',
    'Show us your WORST!',
    'Time to face the FIRE!'
  ]
} as const;

// Hell's Kitchen theme configuration
export const HELL_KITCHEN_CONFIG = {
  COLORS: {
    PRIMARY: '#dc2626',    // Hell red
    BLACK: '#111111',      // Kitchen black
    STEEL: '#6b7280',      // Steel gray
    FLAME: '#f97316',      // Flame orange
    SMOKE: '#4b5563'       // Smoke gray
  },
  ANIMATIONS: {
    FLAME_DURATION: '2s',
    STEEL_GLEAM_DURATION: '3s',
    HELL_PULSE_DURATION: '2s',
    SMOKE_DURATION: '4s'
  },
  INTENSITY_LEVELS: [
    { min: 90, intensity: 'APOCALYPTIC', color: 'hell-900', effect: 'hell-glow' },
    { min: 80, intensity: 'INFERNAL', color: 'hell-800', effect: 'flame-glow' },
    { min: 70, intensity: 'BLAZING', color: 'hell-700', effect: 'hell-pulse' },
    { min: 60, intensity: 'HEATED', color: 'flame-600', effect: 'flame-flicker' },
    { min: 40, intensity: 'WARM', color: 'flame-500', effect: 'subtle-glow' },
    { min: 0, intensity: 'COOL', color: 'kitchen-500', effect: 'none' }
  ]
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