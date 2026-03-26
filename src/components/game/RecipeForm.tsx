import { useState, useEffect, useRef } from 'react';
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

  // Keep a ref to the latest onJudgeComplete so the notify effect never
  // re-fires simply because the parent re-rendered and produced a new
  // function reference (which would call handleJudgeComplete multiple times).
  const onJudgeCompleteRef = useRef(onJudgeComplete);
  useEffect(() => {
    onJudgeCompleteRef.current = onJudgeComplete;
  });

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

  // Notify parent when judgment is complete.
  // onJudgeComplete is intentionally excluded from deps — we read it via ref
  // so this effect only fires when the response data itself changes, not
  // every time the parent re-renders and passes a new function reference.
  useEffect(() => {
    if (response && submittedRecipe && submittedPlayerName) {
      onJudgeCompleteRef.current?.(response, submittedRecipe, submittedPlayerName, submittedJudgeStyle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, submittedRecipe, submittedPlayerName, submittedJudgeStyle]);

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
      <div className={`hell-kitchen-bg border-2 border-hell-600 rounded-lg shadow-xl p-6 hell-glow ${className}`}>
        <LoadingSpinner
          size="lg"
          showRandomMessages={true}
          className="py-12"
        />
      </div>
    );
  }

  return (
    <div className={`hell-kitchen-bg border-2 border-hell-600 rounded-lg shadow-xl hell-glow ${className}`}>
      <div className="px-6 py-4 border-b border-flame-600 bg-gradient-to-r from-hell-800 to-hell-700">
        <div className="flex items-center space-x-3">
          <div className="text-3xl animate-flame-flicker">🔥</div>
          <div>
            <h2 className="text-2xl font-bold text-hell-100 font-chef">Submit Your Recipe</h2>
            <p className="text-flame-300 mt-1 font-semibold">
              Dare to submit your culinary creation for Gordon's judgment...
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Player Name */}
        <div>
          <label htmlFor="playerName" className="block text-sm font-bold text-hell-300 mb-2 flex items-center space-x-2">
            <span>👨‍🍳</span>
            <span>Chef Name</span>
          </label>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your chef name"
            className={`w-full px-4 py-3 bg-kitchen-800 border-2 rounded-lg shadow-lg text-hell-100 placeholder-steel-400
              focus:ring-2 focus:ring-hell-500 focus:border-hell-500 transition-all duration-200 font-semibold
              ${errors.playerName ? 'border-hell-500 ring-2 ring-hell-400' : 'border-steel-600 hover:border-flame-500'}`}
            maxLength={LIMITS.PLAYER_NAME_MAX}
          />
          {errors.playerName && (
            <p className="mt-2 text-sm text-hell-400 flex items-center space-x-1">
              <span>⚠️</span>
              <span>{errors.playerName}</span>
            </p>
          )}
        </div>

        {/* Judge Style */}
        <div>
          <label htmlFor="judgeStyle" className="block text-sm font-bold text-hell-300 mb-2 flex items-center space-x-2">
            <span>⚔️</span>
            <span>Gordon's Mood</span>
          </label>
          <select
            id="judgeStyle"
            value={judgeStyle}
            onChange={(e) => setJudgeStyle(e.target.value as JudgeStyle)}
            className="w-full px-4 py-3 bg-kitchen-800 border-2 border-steel-600 rounded-lg shadow-lg text-hell-100 font-semibold
              focus:ring-2 focus:ring-hell-500 focus:border-hell-500 hover:border-flame-500 transition-all duration-200"
          >
            {JUDGE_STYLES.map((style) => (
              <option key={style.value} value={style.value} className="bg-kitchen-800 text-hell-100">
                {style.label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm text-flame-400 italic">
            {JUDGE_STYLES.find(s => s.value === judgeStyle)?.description}
          </p>
        </div>

        {/* Recipe Title Toggle */}
        <div className="flex items-center space-x-3 bg-kitchen-700 p-3 rounded-lg border border-steel-600">
          <input
            id="useTitle"
            type="checkbox"
            checked={useTitle}
            onChange={(e) => setUseTitle(e.target.checked)}
            className="h-5 w-5 text-hell-600 focus:ring-hell-500 border-steel-400 rounded bg-kitchen-800"
          />
          <label htmlFor="useTitle" className="text-sm font-bold text-hell-300 flex items-center space-x-2">
            <span>📝</span>
            <span>Add recipe title (optional but impressive!)</span>
          </label>
        </div>

        {/* Recipe Title */}
        {useTitle && (
          <div className="animate-slide-in-down">
            <label htmlFor="recipeTitle" className="block text-sm font-bold text-hell-300 mb-2 flex items-center space-x-2">
              <span>🎯</span>
              <span>Recipe Title</span>
            </label>
            <input
              id="recipeTitle"
              type="text"
              value={recipeTitle}
              onChange={(e) => setRecipeTitle(e.target.value)}
              placeholder="My Culinary Masterpiece"
              className={`w-full px-4 py-3 bg-kitchen-800 border-2 rounded-lg shadow-lg text-hell-100 placeholder-steel-400
                focus:ring-2 focus:ring-hell-500 focus:border-hell-500 transition-all duration-200 font-semibold
                ${errors.recipeTitle ? 'border-hell-500 ring-2 ring-hell-400' : 'border-steel-600 hover:border-flame-500'}`}
              maxLength={LIMITS.RECIPE_TITLE_MAX}
            />
            <div className="mt-2 flex justify-between">
              {errors.recipeTitle ? (
                <p className="text-sm text-hell-400 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.recipeTitle}</span>
                </p>
              ) : (
                <div />
              )}
              <p className="text-xs text-steel-400">
                {recipeTitle.length}/{LIMITS.RECIPE_TITLE_MAX}
              </p>
            </div>
          </div>
        )}

        {/* Recipe Content */}
        <div>
          <label htmlFor="recipeContent" className="block text-sm font-bold text-hell-300 mb-2 flex items-center space-x-2">
            <span>📖</span>
            <span>Recipe Instructions</span>
          </label>
          <textarea
            id="recipeContent"
            value={recipeContent}
            onChange={(e) => setRecipeContent(e.target.value)}
            placeholder="Describe your culinary disaster in vivid detail... What ingredients did you abuse? How did you prepare this monstrosity? The more outrageous, the better Gordon's reaction!"
            rows={8}
            className={`w-full px-4 py-3 bg-kitchen-800 border-2 rounded-lg shadow-lg text-hell-100 placeholder-steel-400 resize-none
              focus:ring-2 focus:ring-hell-500 focus:border-hell-500 transition-all duration-200 font-medium
              ${errors.recipeContent ? 'border-hell-500 ring-2 ring-hell-400' : 'border-steel-600 hover:border-flame-500'}`}
            maxLength={LIMITS.RECIPE_CONTENT_MAX}
          />
          <div className="mt-2 flex justify-between">
            {errors.recipeContent ? (
              <p className="text-sm text-hell-400 flex items-center space-x-1">
                <span>⚠️</span>
                <span>{errors.recipeContent}</span>
              </p>
            ) : (
              <p className="text-sm text-flame-400 font-semibold">
                💀 The more chaotic and detailed, the better Gordon's fury!
              </p>
            )}
            <p className="text-xs text-steel-400">
              {recipeContent.length}/{LIMITS.RECIPE_CONTENT_MAX}
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-gradient-to-r from-hell-900 to-hell-800 border-2 border-hell-600 rounded-lg p-4 hell-glow">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 text-2xl animate-bounce">
                💥
              </div>
              <div>
                <p className="text-sm font-bold text-hell-200">Kitchen Disaster Alert!</p>
                <p className="text-sm text-hell-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-flame-600">
          <Button
            type="submit"
            disabled={!hasValidApiKey || isLoading}
            variant="hell"
            withFlame={true}
            className="flex-1 text-lg font-bold"
          >
            🔥 FACE GORDON'S WRATH 🔥
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
            disabled={isLoading}
            className="sm:w-auto"
          >
            🗑️ Clear Kitchen
          </Button>
        </div>
      </form>
    </div>
  );
}