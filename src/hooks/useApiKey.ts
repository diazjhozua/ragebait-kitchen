import { useState, useEffect, useCallback } from 'react';
import { validateWithSchema, apiKeySchema } from '../utils/validation';

const API_KEY_STORAGE_KEY = 'ragebait-openai-key';

export interface ApiKeyState {
  apiKey: string | null;
  isValid: boolean;
  error: string | null;
  storageType: 'persistent' | 'session' | 'none';
}

export interface ApiKeyActions {
  setApiKey: (key: string, storageType?: 'persistent' | 'session') => boolean;
  clearApiKey: () => void;
  validateCurrentKey: () => boolean;
  resetError: () => void;
}

let sessionApiKey: string | null = null; // In-memory storage for session-only keys

export function useApiKey(): ApiKeyState & ApiKeyActions {
  const [state, setState] = useState<ApiKeyState>({
    apiKey: null,
    isValid: false,
    error: null,
    storageType: 'none'
  });

  // Load API key on mount
  useEffect(() => {
    loadApiKey();
  }, []);

  const loadApiKey = useCallback(() => {
    let apiKey: string | null = null;
    let storageType: ApiKeyState['storageType'] = 'none';

    // Check session storage first (highest priority)
    if (sessionApiKey) {
      apiKey = sessionApiKey;
      storageType = 'session';
    } else {
      // Check localStorage
      try {
        const stored = localStorage.getItem(API_KEY_STORAGE_KEY);
        if (stored) {
          apiKey = stored;
          storageType = 'persistent';
        }
      } catch (error) {
        console.warn('Failed to load API key from localStorage:', error);
      }
    }

    if (apiKey) {
      const validation = validateWithSchema(apiKeySchema, apiKey, 'API key');
      setState({
        apiKey,
        isValid: validation.success,
        error: validation.success ? null : validation.error,
        storageType
      });
    } else {
      setState({
        apiKey: null,
        isValid: false,
        error: null,
        storageType: 'none'
      });
    }
  }, []);

  const setApiKey = useCallback((key: string, storageType: 'persistent' | 'session' = 'persistent'): boolean => {
    const validation = validateWithSchema(apiKeySchema, key.trim(), 'API key');

    if (!validation.success) {
      setState(prev => ({
        ...prev,
        apiKey: key.trim(),
        isValid: false,
        error: validation.error,
        storageType: 'none'
      }));
      return false;
    }

    const cleanKey = validation.data;

    try {
      if (storageType === 'persistent') {
        // Save to localStorage and clear session storage
        localStorage.setItem(API_KEY_STORAGE_KEY, cleanKey);
        sessionApiKey = null;
      } else {
        // Save to session storage and clear localStorage
        sessionApiKey = cleanKey;
        localStorage.removeItem(API_KEY_STORAGE_KEY);
      }

      setState({
        apiKey: cleanKey,
        isValid: true,
        error: null,
        storageType
      });

      return true;
    } catch (error) {
      console.error('Failed to save API key:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to save API key. Your browser may have storage restrictions.'
      }));
      return false;
    }
  }, []);

  const clearApiKey = useCallback(() => {
    try {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
      sessionApiKey = null;

      setState({
        apiKey: null,
        isValid: false,
        error: null,
        storageType: 'none'
      });
    } catch (error) {
      console.error('Failed to clear API key:', error);
    }
  }, []);

  const validateCurrentKey = useCallback((): boolean => {
    if (!state.apiKey) {
      setState(prev => ({
        ...prev,
        error: 'No API key provided'
      }));
      return false;
    }

    const validation = validateWithSchema(apiKeySchema, state.apiKey, 'API key');

    setState(prev => ({
      ...prev,
      isValid: validation.success,
      error: validation.success ? null : validation.error
    }));

    return validation.success;
  }, [state.apiKey]);

  const resetError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  return {
    ...state,
    setApiKey,
    clearApiKey,
    validateCurrentKey,
    resetError
  };
}

// Utility function for components that just need to check if we have a valid key
export function useHasValidApiKey(): boolean {
  const { isValid } = useApiKey();
  return isValid;
}

// Utility function to get the current API key value (for API calls)
export function useApiKeyValue(): string | null {
  const { apiKey, isValid } = useApiKey();
  return isValid ? apiKey : null;
}