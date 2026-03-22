import { useState, useEffect, useCallback } from 'react';
import { validateWithSchema, apiKeySchema, customEndpointSchema } from '../utils/validation';

const API_KEY_STORAGE_KEY = 'ragebait-openai-key';
const API_ENDPOINT_STORAGE_KEY = 'ragebait-openai-endpoint';

export interface ApiConfig {
  apiKey: string | null;
  customEndpoint: string | null;
  isValid: boolean;
  error: string | null;
  storageType: 'persistent' | 'session' | 'none';
}

export interface ApiKeyActions {
  setApiKey: (key: string, storageType?: 'persistent' | 'session') => boolean;
  setCustomEndpoint: (endpoint: string, storageType?: 'persistent' | 'session') => boolean;
  clearApiKey: () => void;
  clearCustomEndpoint: () => void;
  clearAll: () => void;
  validateCurrentKey: () => boolean;
  resetError: () => void;
}

// In-memory storage for session-only data
let sessionApiKey: string | null = null;
let sessionCustomEndpoint: string | null = null;

export function useApiKey(): ApiConfig & ApiKeyActions {
  const [state, setState] = useState<ApiConfig>({
    apiKey: null,
    customEndpoint: null,
    isValid: false,
    error: null,
    storageType: 'none'
  });

  // Load API configuration on mount
  useEffect(() => {
    loadApiConfig();
  }, []);

  const loadApiConfig = useCallback(() => {
    let apiKey: string | null = null;
    let customEndpoint: string | null = null;
    let storageType: ApiConfig['storageType'] = 'none';

    // Check session storage first (highest priority)
    if (sessionApiKey) {
      apiKey = sessionApiKey;
      customEndpoint = sessionCustomEndpoint;
      storageType = 'session';
    } else {
      // Check localStorage
      try {
        const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
        const storedEndpoint = localStorage.getItem(API_ENDPOINT_STORAGE_KEY);
        if (storedKey) {
          apiKey = storedKey;
          customEndpoint = storedEndpoint;
          storageType = 'persistent';
        }
      } catch (error) {
        console.warn('Failed to load API configuration from localStorage:', error);
      }
    }

    // Validate configuration
    let isValid = false;
    let error: string | null = null;

    if (apiKey) {
      const keyValidation = validateWithSchema(apiKeySchema, apiKey, 'API key');
      if (!keyValidation.success) {
        error = keyValidation.error;
      } else {
        isValid = true;

        // Validate custom endpoint if provided
        if (customEndpoint) {
          const endpointValidation = validateWithSchema(customEndpointSchema, customEndpoint, 'custom endpoint');
          if (!endpointValidation.success) {
            error = endpointValidation.error;
            isValid = false;
          }
        }
      }
    }

    setState({
      apiKey,
      customEndpoint,
      isValid,
      error,
      storageType
    });
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

    // Also validate existing custom endpoint if present
    let endpointError: string | null = null;
    if (state.customEndpoint) {
      const endpointValidation = validateWithSchema(customEndpointSchema, state.customEndpoint, 'custom endpoint');
      if (!endpointValidation.success) {
        endpointError = endpointValidation.error;
      }
    }

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

      setState(prev => ({
        ...prev,
        apiKey: cleanKey,
        isValid: !endpointError,
        error: endpointError,
        storageType
      }));

      return !endpointError;
    } catch (error) {
      console.error('Failed to save API key:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to save API key. Your browser may have storage restrictions.'
      }));
      return false;
    }
  }, [state.customEndpoint]);

  const setCustomEndpoint = useCallback((endpoint: string, storageType: 'persistent' | 'session' = 'persistent'): boolean => {
    const trimmedEndpoint = endpoint.trim();

    // Empty string means clear the endpoint
    if (!trimmedEndpoint) {
      return clearCustomEndpoint();
    }

    const validation = validateWithSchema(customEndpointSchema, trimmedEndpoint, 'custom endpoint');

    if (!validation.success) {
      setState(prev => ({
        ...prev,
        customEndpoint: trimmedEndpoint,
        isValid: false,
        error: validation.error
      }));
      return false;
    }

    const cleanEndpoint = validation.data;

    try {
      if (storageType === 'persistent') {
        localStorage.setItem(API_ENDPOINT_STORAGE_KEY, cleanEndpoint);
        sessionCustomEndpoint = null;
      } else {
        sessionCustomEndpoint = cleanEndpoint;
        localStorage.removeItem(API_ENDPOINT_STORAGE_KEY);
      }

      // Re-validate the entire config
      const hasValidKey = state.apiKey && validateWithSchema(apiKeySchema, state.apiKey).success;

      setState(prev => ({
        ...prev,
        customEndpoint: cleanEndpoint,
        isValid: !!hasValidKey,
        error: hasValidKey ? null : 'API key is required',
        storageType
      }));

      return !!hasValidKey;
    } catch (error) {
      console.error('Failed to save custom endpoint:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to save custom endpoint. Your browser may have storage restrictions.'
      }));
      return false;
    }
  }, [state.apiKey]);

  const clearCustomEndpoint = useCallback(() => {
    try {
      localStorage.removeItem(API_ENDPOINT_STORAGE_KEY);
      sessionCustomEndpoint = null;

      setState(prev => ({
        ...prev,
        customEndpoint: null,
        // Keep the same validity if we still have a valid API key
        error: prev.apiKey && validateWithSchema(apiKeySchema, prev.apiKey).success ? null : prev.error
      }));

      return true;
    } catch (error) {
      console.error('Failed to clear custom endpoint:', error);
      return false;
    }
  }, []);

  const clearApiKey = useCallback(() => {
    try {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
      sessionApiKey = null;

      setState(prev => ({
        ...prev,
        apiKey: null,
        isValid: false,
        error: null,
        storageType: 'none'
      }));
    } catch (error) {
      console.error('Failed to clear API key:', error);
    }
  }, []);

  const clearAll = useCallback(() => {
    try {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
      localStorage.removeItem(API_ENDPOINT_STORAGE_KEY);
      sessionApiKey = null;
      sessionCustomEndpoint = null;

      setState({
        apiKey: null,
        customEndpoint: null,
        isValid: false,
        error: null,
        storageType: 'none'
      });
    } catch (error) {
      console.error('Failed to clear API configuration:', error);
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

    const keyValidation = validateWithSchema(apiKeySchema, state.apiKey, 'API key');

    let isValid = keyValidation.success;
    let error = keyValidation.success ? null : keyValidation.error;

    // Also validate custom endpoint if present
    if (keyValidation.success && state.customEndpoint) {
      const endpointValidation = validateWithSchema(customEndpointSchema, state.customEndpoint, 'custom endpoint');
      if (!endpointValidation.success) {
        isValid = false;
        error = endpointValidation.error;
      }
    }

    setState(prev => ({
      ...prev,
      isValid,
      error
    }));

    return isValid;
  }, [state.apiKey, state.customEndpoint]);

  const resetError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  return {
    ...state,
    setApiKey,
    setCustomEndpoint,
    clearApiKey,
    clearCustomEndpoint,
    clearAll,
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

// Utility function to get the current API configuration (for API calls)
export function useApiConfig(): { apiKey: string | null; customEndpoint: string | null } {
  const { apiKey, customEndpoint, isValid } = useApiKey();
  return {
    apiKey: isValid ? apiKey : null,
    customEndpoint: isValid ? customEndpoint : null
  };
}