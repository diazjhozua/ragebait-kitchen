import { useState, useCallback } from 'react';
import type { JudgeResponse, Recipe, JudgeStyle, ApiError } from '../types/game';
import { getOpenAIService } from '../services/openai';
import { useApiConfig } from './useApiKey';
import { FALLBACK_RESPONSES } from '../utils/prompts';

export interface JudgeState {
  isLoading: boolean;
  response: JudgeResponse | null;
  error: string | null;
  lastRequest: {
    recipe: Recipe;
    playerName: string;
    judgeStyle: JudgeStyle;
  } | null;
}

export interface JudgeActions {
  judgeRecipe: (
    recipe: Recipe,
    playerName: string,
    judgeStyle: JudgeStyle
  ) => Promise<JudgeResponse | null>;
  retry: () => Promise<JudgeResponse | null>;
  reset: () => void;
}

export function useOpenAI(): JudgeState & JudgeActions {
  const [state, setState] = useState<JudgeState>({
    isLoading: false,
    response: null,
    error: null,
    lastRequest: null
  });

  const { apiKey, customEndpoint } = useApiConfig();

  const judgeRecipe = useCallback(async (
    recipe: Recipe,
    playerName: string,
    judgeStyle: JudgeStyle
  ): Promise<JudgeResponse | null> => {
    // Validate API key
    if (!apiKey) {
      const error = 'No valid API key provided. Please enter your OpenAI API key.';
      setState(prev => ({
        ...prev,
        error,
        response: null,
        lastRequest: { recipe, playerName, judgeStyle }
      }));
      return null;
    }

    // Set loading state
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      response: null,
      lastRequest: { recipe, playerName, judgeStyle }
    }));

    try {
      const openAIService = getOpenAIService(apiKey, customEndpoint);

      const response = await openAIService.judgeRecipe({
        recipe,
        playerName,
        judgeStyle,
        apiKey
      });

      setState(prev => ({
        ...prev,
        isLoading: false,
        response,
        error: null
      }));

      return response;

    } catch (error) {
      console.error('Failed to judge recipe:', error);

      let fallbackResponse: JudgeResponse;
      let errorMessage: string;

      if (isApiError(error)) {
        errorMessage = error.message;

        // Provide appropriate fallback based on error type
        switch (error.type) {
          case 'invalid-key':
            fallbackResponse = FALLBACK_RESPONSES.invalidKey;
            break;
          case 'network':
          case 'rate-limit':
            fallbackResponse = FALLBACK_RESPONSES.networkError;
            break;
          default:
            fallbackResponse = FALLBACK_RESPONSES.validationFailure;
        }
      } else {
        errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        fallbackResponse = FALLBACK_RESPONSES.validationFailure;
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        response: fallbackResponse // Provide fallback for user experience
      }));

      return fallbackResponse;
    }
  }, [apiKey]);

  const retry = useCallback(async (): Promise<JudgeResponse | null> => {
    if (!state.lastRequest) {
      setState(prev => ({
        ...prev,
        error: 'No previous request to retry'
      }));
      return null;
    }

    const { recipe, playerName, judgeStyle } = state.lastRequest;
    return judgeRecipe(recipe, playerName, judgeStyle);
  }, [state.lastRequest, judgeRecipe]);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      response: null,
      error: null,
      lastRequest: null
    });
  }, []);

  return {
    ...state,
    judgeRecipe,
    retry,
    reset
  };
}

// Type guard to check if an error is an ApiError
function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'type' in error &&
    'retryable' in error
  );
}

// Hook variant that auto-retries on retryable errors
export function useOpenAIWithAutoRetry(): JudgeState & JudgeActions {
  const baseHook = useOpenAI();

  const judgeRecipeWithAutoRetry = useCallback(async (
    recipe: Recipe,
    playerName: string,
    judgeStyle: JudgeStyle
  ): Promise<JudgeResponse | null> => {
    const result = await baseHook.judgeRecipe(recipe, playerName, judgeStyle);

    // If there was an error and we have a fallback response, that's acceptable
    // The service already handles retries internally
    return result;
  }, [baseHook]);

  return {
    ...baseHook,
    judgeRecipe: judgeRecipeWithAutoRetry
  };
}