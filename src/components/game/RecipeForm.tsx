import { useState, useEffect } from 'react';
import type { Recipe, JudgeStyle, JudgeResponse } from '../../types/game';
import { useApiKey } from '../../hooks/useApiKey';
import { useOpenAI } from '../../hooks/useOpenAI';
import { validateWithSchema, recipeSchema, playerNameSchema } from '../../utils/validation';
import { JUDGE_STYLES, LIMITS } from '../../utils/constants';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

interface RecipeFormProps {
  onJudgeComplete?: (response: JudgeResponse, recipe: Recipe, playerName: string, judgeStyle: JudgeStyle) => void;
  resetKey?: string | number; // When this changes, reset the form
  className?: string;
}

export default function RecipeForm({ onJudgeComplete, resetKey, className = '' }: RecipeFormProps) {
  const { isValid: hasValidApiKey } = useApiKey();
  const { judgeRecipe, isLoading, response, error, reset } = useOpenAI();

  // Form state
  const [playerName, setPlayerName] = useState(() => {
    try {
      return localStorage.getItem('ragebait-player-name') || '';
    } catch {
      return '';
    }
  });
  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeContent, setRecipeContent] = useState('');
  const [judgeStyle, setJudgeStyle] = useState<JudgeStyle>('classic-rage');
  const [useTitle, setUseTitle] = useState(false);

  // Validation state
  const [errors, setErrors] = useState<{
    playerName?: string;
    recipeContent?: string;
    recipeTitle?: string;
  }>({});

  // Track the last submitted data for callbacks
  const [submittedRecipe, setSubmittedRecipe] = useState<Recipe | null>(null);
  const [submittedPlayerName, setSubmittedPlayerName] = useState<string>('');
  const [submittedJudgeStyle, setSubmittedJudgeStyle] = useState<JudgeStyle>('classic-rage');

  // Save player name to localStorage
  useEffect(() => {
    if (playerName.trim()) {
      try {
        localStorage.setItem('ragebait-player-name', playerName.trim());
      } catch {
        // Ignore storage errors
      }
    }
  }, [playerName]);

  // Clear errors when user types
  useEffect(() => {
    if (errors.playerName && playerName.trim()) {
      setErrors(prev => ({ ...prev, playerName: undefined }));
    }
  }, [playerName, errors.playerName]);

  useEffect(() => {
    if (errors.recipeContent && recipeContent.trim()) {
      setErrors(prev => ({ ...prev, recipeContent: undefined }));
    }
  }, [recipeContent, errors.recipeContent]);

  useEffect(() => {
    if (errors.recipeTitle && recipeTitle.trim()) {
      setErrors(prev => ({ ...prev, recipeTitle: undefined }));
    }
  }, [recipeTitle, errors.recipeTitle]);

  // Reset OpenAI hook when resetKey changes
  useEffect(() => {
    if (resetKey !== undefined) {
      reset();
    }
  }, [resetKey, reset]);

  // Notify parent when judgment is complete
  useEffect(() => {
    if (response && onJudgeComplete && submittedRecipe && submittedPlayerName) {
      onJudgeComplete(response, submittedRecipe, submittedPlayerName, submittedJudgeStyle);
    }
  }, [response, onJudgeComplete, submittedRecipe, submittedPlayerName, submittedJudgeStyle]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Validate player name
    const playerNameValidation = validateWithSchema(playerNameSchema, playerName.trim(), 'player name');
    if (!playerNameValidation.success) {
      newErrors.playerName = playerNameValidation.error;
    }

    // Validate recipe content
    const recipeContentValidation = validateWithSchema(recipeSchema, { content: recipeContent.trim() }, 'recipe');
    if (!recipeContentValidation.success) {
      newErrors.recipeContent = recipeContentValidation.error;
    }

    // Validate recipe title if provided
    if (useTitle && recipeTitle.trim()) {
      if (recipeTitle.trim().length > LIMITS.RECIPE_TITLE_MAX) {
        newErrors.recipeTitle = `Recipe title must be less than ${LIMITS.RECIPE_TITLE_MAX} characters`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasValidApiKey) {
      return; // ApiKeyPrompt should be shown instead
    }

    if (!validateForm()) {
      return;
    }

    const recipe: Recipe = {
      content: recipeContent.trim(),
      ...(useTitle && recipeTitle.trim() && { title: recipeTitle.trim() })
    };

    // Store submitted data for callback
    setSubmittedRecipe(recipe);
    setSubmittedPlayerName(playerName.trim());
    setSubmittedJudgeStyle(judgeStyle);

    await judgeRecipe(recipe, playerName.trim(), judgeStyle);
  };

  const handleReset = () => {
    setRecipeTitle('');
    setRecipeContent('');
    setErrors({});
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <LoadingSpinner
          size="lg"
          showRandomMessages={true}
          className="py-12"
        />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Submit Your Recipe</h2>
        <p className="text-gray-600 mt-1">
          Dare to submit your culinary creation for Gordon's judgment...
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Player Name */}
        <div>
          <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-rage-500 focus:border-rage-500 ${
              errors.playerName ? 'border-red-500' : 'border-gray-300'
            }`}
            maxLength={LIMITS.PLAYER_NAME_MAX}
          />
          {errors.playerName && (
            <p className="mt-1 text-sm text-red-600">{errors.playerName}</p>
          )}
        </div>

        {/* Judge Style */}
        <div>
          <label htmlFor="judgeStyle" className="block text-sm font-medium text-gray-700 mb-2">
            Judge Style
          </label>
          <select
            id="judgeStyle"
            value={judgeStyle}
            onChange={(e) => setJudgeStyle(e.target.value as JudgeStyle)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-rage-500 focus:border-rage-500"
          >
            {JUDGE_STYLES.map((style) => (
              <option key={style.value} value={style.value}>
                {style.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-500">
            {JUDGE_STYLES.find(s => s.value === judgeStyle)?.description}
          </p>
        </div>

        {/* Recipe Title Toggle */}
        <div className="flex items-center">
          <input
            id="useTitle"
            type="checkbox"
            checked={useTitle}
            onChange={(e) => setUseTitle(e.target.checked)}
            className="h-4 w-4 text-rage-600 focus:ring-rage-500 border-gray-300 rounded"
          />
          <label htmlFor="useTitle" className="ml-2 text-sm font-medium text-gray-700">
            Add recipe title (optional)
          </label>
        </div>

        {/* Recipe Title */}
        {useTitle && (
          <div>
            <label htmlFor="recipeTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Recipe Title
            </label>
            <input
              id="recipeTitle"
              type="text"
              value={recipeTitle}
              onChange={(e) => setRecipeTitle(e.target.value)}
              placeholder="My Amazing Recipe"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-rage-500 focus:border-rage-500 ${
                errors.recipeTitle ? 'border-red-500' : 'border-gray-300'
              }`}
              maxLength={LIMITS.RECIPE_TITLE_MAX}
            />
            <div className="mt-1 flex justify-between">
              {errors.recipeTitle ? (
                <p className="text-sm text-red-600">{errors.recipeTitle}</p>
              ) : (
                <div />
              )}
              <p className="text-xs text-gray-500">
                {recipeTitle.length}/{LIMITS.RECIPE_TITLE_MAX}
              </p>
            </div>
          </div>
        )}

        {/* Recipe Content */}
        <div>
          <label htmlFor="recipeContent" className="block text-sm font-medium text-gray-700 mb-2">
            Recipe Instructions
          </label>
          <textarea
            id="recipeContent"
            value={recipeContent}
            onChange={(e) => setRecipeContent(e.target.value)}
            placeholder="Describe your recipe in detail. What ingredients did you use? How did you prepare it? The more outrageous, the better the judgment!"
            rows={8}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-rage-500 focus:border-rage-500 resize-none ${
              errors.recipeContent ? 'border-red-500' : 'border-gray-300'
            }`}
            maxLength={LIMITS.RECIPE_CONTENT_MAX}
          />
          <div className="mt-1 flex justify-between">
            {errors.recipeContent ? (
              <p className="text-sm text-red-600">{errors.recipeContent}</p>
            ) : (
              <p className="text-sm text-gray-500">
                Be as detailed and outrageous as possible for the best judgment!
              </p>
            )}
            <p className="text-xs text-gray-500">
              {recipeContent.length}/{LIMITS.RECIPE_CONTENT_MAX}
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <Button
            type="submit"
            disabled={!hasValidApiKey || isLoading}
            className="flex-1"
          >
            🔥 Judge My Recipe
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset Form
          </Button>
        </div>
      </form>
    </div>
  );
}