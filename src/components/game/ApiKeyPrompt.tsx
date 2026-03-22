import { useState } from 'react';
import { useApiKey } from '../../hooks/useApiKey';
import Button from '../common/Button';

interface ApiKeyPromptProps {
  onKeySet?: () => void;
  className?: string;
}

export default function ApiKeyPrompt({ onKeySet, className = '' }: ApiKeyPromptProps) {
  const {
    apiKey,
    customEndpoint,
    isValid,
    error,
    storageType,
    setApiKey,
    setCustomEndpoint,
    clearAll,
    resetError
  } = useApiKey();

  const [inputValue, setInputValue] = useState(apiKey || '');
  const [endpointValue, setEndpointValue] = useState(customEndpoint || '');
  const [selectedStorageType, setSelectedStorageType] = useState<'persistent' | 'session'>('persistent');
  const [showKey, setShowKey] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(!!customEndpoint);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetError();

    // Set API key first
    const keySuccess = setApiKey(inputValue, selectedStorageType);

    // Set custom endpoint if provided
    let endpointSuccess = true;
    if (endpointValue.trim()) {
      endpointSuccess = setCustomEndpoint(endpointValue, selectedStorageType);
    } else {
      // Clear endpoint if empty
      setCustomEndpoint('');
    }

    if (keySuccess && endpointSuccess) {
      onKeySet?.();
    }
  };

  const handleClear = () => {
    clearAll();
    setInputValue('');
    setEndpointValue('');
    setShowAdvanced(false);
    resetError();
  };

  if (isValid && apiKey) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                API Configuration Set ({storageType === 'persistent' ? 'Persistent' : 'Session Only'})
              </p>
              {customEndpoint && (
                <p className="text-xs text-green-700 mt-1">
                  <strong>Custom Endpoint:</strong> {customEndpoint}
                </p>
              )}
              {showKey && (
                <p className="text-xs text-green-700 font-mono break-all mt-1">
                  <strong>API Key:</strong> {apiKey}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowKey(!showKey)}
              className="text-green-600 hover:text-green-700 text-sm underline"
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
            >
              Change Key
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-6 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-lg font-medium text-yellow-800">
            🔑 API Configuration Required
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              This game uses your own OpenAI API key to power the AI judge. Your key stays local in your browser
              and is only used to communicate with your chosen API endpoint (OpenAI by default, or custom endpoints like Azure OpenAI, local models, etc.).
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-yellow-800">
                  OpenAI API Key
                </label>
                <input
                  id="apiKey"
                  type="password"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="sk-..."
                  className="mt-1 block w-full border-yellow-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                />
                {error && (
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
              </div>

              {/* Advanced options toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center text-sm font-medium text-yellow-700 hover:text-yellow-800 transition-colors"
                >
                  <svg className={`w-4 h-4 mr-2 transform transition-transform ${showAdvanced ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Advanced Options
                </button>
              </div>

              {/* Custom endpoint field */}
              {showAdvanced && (
                <div className="bg-yellow-100 rounded-lg p-4 border border-yellow-300">
                  <div>
                    <label htmlFor="customEndpoint" className="block text-sm font-medium text-yellow-800 mb-2">
                      Custom API Endpoint (Optional)
                    </label>
                    <input
                      id="customEndpoint"
                      type="url"
                      value={endpointValue}
                      onChange={(e) => setEndpointValue(e.target.value)}
                      placeholder="https://api.openai.com"
                      className="block w-full border-yellow-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    />
                    <div className="mt-2 text-xs text-yellow-700">
                      <p className="mb-1"><strong>Use this for:</strong></p>
                      <ul className="list-disc list-inside space-y-0.5 ml-2">
                        <li>Azure OpenAI Service</li>
                        <li>Local LLM servers (Ollama, etc.)</li>
                        <li>OpenAI-compatible APIs</li>
                        <li>Custom proxy endpoints</li>
                      </ul>
                      <p className="mt-2 text-xs">
                        Leave empty to use the default OpenAI API. Must be HTTPS or localhost.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-yellow-800">
                  Storage Option
                </label>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="storage"
                      value="persistent"
                      checked={selectedStorageType === 'persistent'}
                      onChange={(e) => setSelectedStorageType(e.target.value as 'persistent')}
                      className="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-yellow-300"
                    />
                    <span className="ml-3 text-sm text-yellow-700">
                      <strong>Remember my key</strong> - Save in browser storage (convenient but less secure)
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="storage"
                      value="session"
                      checked={selectedStorageType === 'session'}
                      onChange={(e) => setSelectedStorageType(e.target.value as 'session')}
                      className="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-yellow-300"
                    />
                    <span className="ml-3 text-sm text-yellow-700">
                      <strong>Session only</strong> - Forget key when I close this tab (more secure)
                    </span>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                fullWidth
                disabled={!inputValue.trim()}
              >
                {showAdvanced && endpointValue.trim() ? 'Set API Configuration' : 'Set API Key'}
              </Button>
            </div>
          </form>

          <div className="mt-4 p-3 bg-yellow-100 rounded-md">
            <h4 className="text-sm font-medium text-yellow-800">Security Notes:</h4>
            <ul className="mt-1 text-xs text-yellow-700 space-y-1">
              <li>• Your API key never leaves your browser except to call OpenAI directly</li>
              <li>• We never log, store, or transmit your key to any server</li>
              <li>• Browser storage can be vulnerable to XSS attacks</li>
              <li>• Consider using "session only" mode for better security</li>
            </ul>
          </div>

          <div className="mt-3">
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-yellow-600 hover:text-yellow-500 underline"
            >
              Get your OpenAI API key here →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}