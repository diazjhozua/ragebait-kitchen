import { useState, useEffect, useCallback } from 'react';

export interface UseLocalStorageResult<T> {
  value: T;
  setValue: (newValue: T | ((prev: T) => T)) => void;
  remove: () => void;
  refresh: () => void;
  isLoading: boolean;
  error: string | null;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: {
    serializer?: {
      parse: (value: string) => T;
      stringify: (value: T) => string;
    };
    validator?: (value: unknown) => value is T;
    onError?: (error: Error) => void;
  } = {}
): UseLocalStorageResult<T> {
  const {
    serializer = {
      parse: JSON.parse,
      stringify: JSON.stringify
    },
    validator,
    onError
  } = options;

  const [value, setValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load value from localStorage
  const loadValue = useCallback(() => {
    setIsLoading(true);
    setError(null);

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        setValue(initialValue);
        setIsLoading(false);
        return;
      }

      const parsed = serializer.parse(item);

      // Validate if validator is provided
      if (validator && !validator(parsed)) {
        console.warn(`Invalid data for key "${key}", using initial value`);
        setValue(initialValue);
        localStorage.removeItem(key); // Remove invalid data
        setIsLoading(false);
        return;
      }

      setValue(parsed);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to parse localStorage value');
      console.error(`Error loading localStorage key "${key}":`, error);

      setError(error.message);
      setValue(initialValue);

      // Try to remove corrupted data
      try {
        localStorage.removeItem(key);
      } catch {
        // Ignore errors when trying to clean up
      }

      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [key, initialValue, serializer, validator, onError]);

  // Save value to localStorage
  const updateValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setError(null);

    try {
      const valueToStore = typeof newValue === 'function'
        ? (newValue as (prev: T) => T)(value)
        : newValue;

      localStorage.setItem(key, serializer.stringify(valueToStore));
      setValue(valueToStore);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to save to localStorage');
      console.error(`Error saving localStorage key "${key}":`, error);

      setError(error.message);
      onError?.(error);
    }
  }, [key, value, serializer, onError]);

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    setError(null);

    try {
      localStorage.removeItem(key);
      setValue(initialValue);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to remove from localStorage');
      console.error(`Error removing localStorage key "${key}":`, error);

      setError(error.message);
      onError?.(error);
    }
  }, [key, initialValue, onError]);

  // Refresh value from localStorage
  const refreshValue = useCallback(() => {
    loadValue();
  }, [loadValue]);

  // Load initial value
  useEffect(() => {
    loadValue();
  }, [loadValue]);

  // Listen for changes to localStorage from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.storageArea === localStorage) {
        loadValue();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, loadValue]);

  return {
    value,
    setValue: updateValue,
    remove: removeValue,
    refresh: refreshValue,
    isLoading,
    error
  };
}

// Specialized hook for boolean values
export function useLocalStorageBoolean(
  key: string,
  initialValue: boolean = false
): UseLocalStorageResult<boolean> {
  return useLocalStorage(key, initialValue, {
    validator: (value): value is boolean => typeof value === 'boolean'
  });
}

// Specialized hook for string values
export function useLocalStorageString(
  key: string,
  initialValue: string = ''
): UseLocalStorageResult<string> {
  return useLocalStorage(key, initialValue, {
    validator: (value): value is string => typeof value === 'string'
  });
}

// Specialized hook for number values
export function useLocalStorageNumber(
  key: string,
  initialValue: number = 0
): UseLocalStorageResult<number> {
  return useLocalStorage(key, initialValue, {
    validator: (value): value is number => typeof value === 'number' && !isNaN(value)
  });
}