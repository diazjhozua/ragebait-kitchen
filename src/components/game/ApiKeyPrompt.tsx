import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApiKey } from '../../hooks/useApiKey';

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
    const keySuccess = setApiKey(inputValue, selectedStorageType);
    let endpointSuccess = true;
    if (endpointValue.trim()) {
      endpointSuccess = setCustomEndpoint(endpointValue, selectedStorageType);
    } else {
      setCustomEndpoint('');
    }
    if (keySuccess && endpointSuccess) onKeySet?.();
  };

  const handleClear = () => {
    clearAll();
    setInputValue('');
    setEndpointValue('');
    setShowAdvanced(false);
    resetError();
  };

  // ── API key is already set ──────────────────────────────────────────────────
  if (isValid && apiKey) {
    return (
      <div
        className={`rounded-lg px-4 py-3 flex items-center justify-between gap-4 ${className}`}
        style={{
          background: 'linear-gradient(135deg, rgba(6,78,59,0.3) 0%, rgba(4,47,46,0.4) 100%)',
          border: '1px solid rgba(52,211,153,0.25)',
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span style={{ filter: 'drop-shadow(0 0 6px rgba(52,211,153,0.7))' }}>🔑</span>
          <div className="min-w-0">
            <p className="text-sm font-bold" style={{ color: 'rgba(110,231,183,0.9)' }}>
              API Key Active
              <span
                className="ml-2 text-xs font-medium px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(52,211,153,0.15)', color: 'rgba(110,231,183,0.7)', border: '1px solid rgba(52,211,153,0.2)' }}
              >
                {storageType === 'persistent' ? '💾 Saved' : '🔒 Session'}
              </span>
            </p>
            {customEndpoint && (
              <p className="text-xs truncate mt-0.5" style={{ color: 'rgba(110,231,183,0.5)' }}>
                {customEndpoint}
              </p>
            )}
            {showKey && (
              <p className="text-xs font-mono mt-0.5 truncate" style={{ color: 'rgba(110,231,183,0.6)' }}>
                {apiKey}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/settings"
            title="AI Settings"
            className="text-xs font-bold uppercase tracking-wider transition-colors"
            style={{ color: 'rgba(52,211,153,0.5)' }}
          >
            ⚙
          </Link>
          <button
            onClick={() => setShowKey(!showKey)}
            className="text-xs font-bold uppercase tracking-wider transition-colors"
            style={{ color: 'rgba(52,211,153,0.6)' }}
          >
            {showKey ? 'Hide' : 'Show'}
          </button>
          <button
            onClick={handleClear}
            className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded transition-all"
            style={{
              background: 'rgba(127,29,29,0.4)',
              color: 'rgba(252,165,165,0.8)',
              border: '1px solid rgba(220,38,38,0.25)',
            }}
          >
            Change
          </button>
        </div>
      </div>
    );
  }

  // ── API key prompt ──────────────────────────────────────────────────────────
  return (
    <div
      className={`rounded-xl overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(180deg, rgba(17,5,5,0.95) 0%, rgba(10,0,0,0.98) 100%)',
        border: '1px solid rgba(220,38,38,0.3)',
        boxShadow: '0 0 40px rgba(220,38,38,0.08) inset, 0 8px 32px rgba(0,0,0,0.6)',
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4"
        style={{
          background: 'linear-gradient(135deg, rgba(127,29,29,0.35) 0%, rgba(17,5,5,0) 100%)',
          borderBottom: '1px solid rgba(220,38,38,0.2)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl" style={{ filter: 'drop-shadow(0 0 8px rgba(249,115,22,0.8))' }}>🔑</span>
          <div>
            <h3 className="font-black uppercase tracking-wide text-white" style={{ fontSize: '15px', letterSpacing: '0.08em' }}>
              API Configuration Required
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(156,163,175,0.65)' }}>
              Your key stays local — never sent to our servers
            </p>
          </div>
        </div>
      </div>

      {/* Form body */}
      <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">

        {/* API Key input */}
        <div>
          <label
            htmlFor="apiKey"
            className="block text-xs font-black uppercase tracking-widest mb-1.5"
            style={{ color: 'rgba(249,115,22,0.8)' }}
          >
            OpenAI API Key
          </label>
          <div className="relative">
            <input
              id="apiKey"
              type={showKey ? 'text' : 'password'}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="sk-..."
              className="w-full rounded-lg px-3 py-2.5 pr-16 text-sm font-mono text-white placeholder-kitchen-500 outline-none transition-all"
              style={{
                background: 'rgba(17,24,39,0.8)',
                border: error ? '1px solid rgba(239,68,68,0.6)' : '1px solid rgba(75,85,99,0.5)',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)',
              }}
              onFocus={e => (e.currentTarget.style.border = '1px solid rgba(220,38,38,0.5)')}
              onBlur={e => (e.currentTarget.style.border = error ? '1px solid rgba(239,68,68,0.6)' : '1px solid rgba(75,85,99,0.5)')}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-wider transition-colors"
              style={{ color: 'rgba(107,114,128,0.7)' }}
            >
              {showKey ? '🙈 Hide' : '👁 Show'}
            </button>
          </div>
          {error && (
            <p className="mt-1 text-xs font-semibold" style={{ color: '#f87171' }}>⚠ {error}</p>
          )}
        </div>

        {/* Advanced toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-colors"
          style={{ color: showAdvanced ? 'rgba(249,115,22,0.8)' : 'rgba(107,114,128,0.6)' }}
        >
          <span
            className="inline-block transition-transform duration-200"
            style={{ transform: showAdvanced ? 'rotate(90deg)' : 'rotate(0deg)' }}
          >
            ▶
          </span>
          ⚙ Advanced Options
        </button>

        {/* Custom endpoint */}
        {showAdvanced && (
          <div
            className="rounded-lg px-4 py-3 space-y-2"
            style={{ background: 'rgba(17,24,39,0.6)', border: '1px solid rgba(75,85,99,0.4)' }}
          >
            <label
              htmlFor="customEndpoint"
              className="block text-xs font-black uppercase tracking-widest"
              style={{ color: 'rgba(156,163,175,0.7)' }}
            >
              Custom API Endpoint <span style={{ color: 'rgba(107,114,128,0.5)', fontWeight: 400, textTransform: 'none', letterSpacing: 'normal' }}>(optional)</span>
            </label>
            <input
              id="customEndpoint"
              type="url"
              value={endpointValue}
              onChange={e => setEndpointValue(e.target.value)}
              placeholder="https://api.openai.com"
              className="w-full rounded-lg px-3 py-2 text-sm font-mono text-white placeholder-kitchen-500 outline-none transition-all"
              style={{
                background: 'rgba(10,0,0,0.5)',
                border: '1px solid rgba(75,85,99,0.4)',
              }}
              onFocus={e => (e.currentTarget.style.border = '1px solid rgba(107,114,128,0.6)')}
              onBlur={e => (e.currentTarget.style.border = '1px solid rgba(75,85,99,0.4)')}
            />
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(107,114,128,0.6)' }}>
              For Azure OpenAI, Ollama, or any OpenAI-compatible API. Leave empty for default OpenAI.
            </p>
          </div>
        )}

        {/* Storage option — card toggle */}
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'rgba(156,163,175,0.6)' }}>
            Storage
          </p>
          <div className="grid grid-cols-2 gap-2">
            {([
              { value: 'persistent', icon: '💾', label: 'Remember', sub: 'Saved in browser' },
              { value: 'session',    icon: '🔒', label: 'Session Only', sub: 'Cleared on close' },
            ] as const).map(opt => {
              const active = selectedStorageType === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedStorageType(opt.value)}
                  className="text-left px-3 py-2.5 rounded-lg transition-all duration-150"
                  style={{
                    background: active ? 'rgba(127,29,29,0.45)' : 'rgba(17,24,39,0.5)',
                    border: active ? '1px solid rgba(220,38,38,0.45)' : '1px solid rgba(75,85,99,0.35)',
                    boxShadow: active ? '0 0 12px rgba(220,38,38,0.1) inset' : 'none',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{opt.icon}</span>
                    <div>
                      <div
                        className="text-xs font-black"
                        style={{ color: active ? '#fff' : 'rgba(156,163,175,0.8)' }}
                      >
                        {opt.label}
                      </div>
                      <div className="text-[10px]" style={{ color: 'rgba(107,114,128,0.6)' }}>
                        {opt.sub}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="w-full py-3 rounded-lg font-black uppercase tracking-widest text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: inputValue.trim()
              ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
              : 'rgba(55,65,81,0.5)',
            color: '#fff',
            letterSpacing: '0.18em',
            boxShadow: inputValue.trim() ? '0 0 20px rgba(220,38,38,0.35)' : 'none',
          }}
        >
          🔥 {showAdvanced && endpointValue.trim() ? 'Enter the Kitchen' : 'Enter the Kitchen'}
        </button>
      </form>

      {/* Footer: security + link */}
      <div
        className="px-5 py-3"
        style={{ borderTop: '1px solid rgba(55,65,81,0.4)', background: 'rgba(0,0,0,0.2)' }}
      >
        <div className="flex items-start gap-2 mb-2">
          <span className="text-xs mt-0.5">🛡️</span>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(107,114,128,0.7)' }}>
            Key never leaves your browser except to call OpenAI directly. We never log or transmit it.
          </p>
        </div>
        <a
          href="https://platform.openai.com/api-keys"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold transition-colors"
          style={{ color: 'rgba(249,115,22,0.7)' }}
        >
          Get your OpenAI API key →
        </a>
      </div>
    </div>
  );
}
