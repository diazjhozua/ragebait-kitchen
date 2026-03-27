import { useState } from 'react';
import type { AppConfig } from '../types/config';
import { useAppConfig } from '../hooks/useAppConfig';
import { CONFIG_DEFAULTS, CONFIG_LIMITS } from '../utils/constants';
import Modal from '../components/common/Modal';
import { ConfirmModal } from '../components/common/Modal';

// ── Shared style helpers ───────────────────────────────────────────────────

const cardStyle: React.CSSProperties = {
  background: 'linear-gradient(180deg, rgba(17,5,5,0.95) 0%, rgba(10,0,0,0.98) 100%)',
  border: '1px solid rgba(220,38,38,0.2)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
};

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: '13px',
  letterSpacing: '0.12em',
  fontWeight: 900,
  textTransform: 'uppercase' as const,
  color: '#ffffff',
  textShadow: '0 0 12px rgba(220,38,38,0.5)',
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.2em',
  color: 'rgba(249,115,22,0.85)',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(17,24,39,0.8)',
  border: '1px solid rgba(75,85,99,0.5)',
  borderRadius: '8px',
  padding: '10px 12px',
  color: '#ffffff',
  fontSize: '14px',
  outline: 'none',
};

const hintStyle: React.CSSProperties = {
  fontSize: '11px',
  color: 'rgba(107,114,128,0.7)',
  marginTop: '4px',
};

// ── Passcode gate modal ────────────────────────────────────────────────────

function PasscodeGate({
  gateStatus,
  isLoading,
  error,
  lockoutRemainingMs,
  onVerify,
  onSetup,
  clearError,
}: {
  gateStatus: ReturnType<typeof useAppConfig>['gateStatus'];
  isLoading: boolean;
  error: string | null;
  lockoutRemainingMs: number;
  onVerify: (p: string) => Promise<boolean>;
  onSetup: (p: string) => Promise<{ backupCode: string }>;
  clearError: () => void;
}) {
  const [input, setInput] = useState('');
  const [confirmInput, setConfirmInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [useBackup, setUseBackup] = useState(false);
  const [backupCode, setBackupCode] = useState('');       // shown after setup
  const [showBackupCodeScreen, setShowBackupCodeScreen] = useState(false);
  const [formError, setFormError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    clearError();
    const passcode = useBackup ? input.replace(/-/g, '').toUpperCase() : input;
    await onVerify(passcode);
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (input.length < 4) { setFormError('Passcode must be at least 4 characters.'); return; }
    if (input !== confirmInput) { setFormError('Passcodes do not match.'); return; }
    const result = await onSetup(input);
    setBackupCode(result.backupCode);
    setShowBackupCodeScreen(true);
  };

  const formatBackupCode = (code: string) =>
    code.length === 8 ? `${code.slice(0, 4)}-${code.slice(4)}` : code;

  const lockoutSec = Math.ceil(lockoutRemainingMs / 1000);

  return (
    <div style={{ padding: '32px 28px', minWidth: '320px' }}>
      {/* Locked-out state */}
      {gateStatus === 'locked-out' && (
        <div className="text-center">
          <div className="text-5xl mb-4" style={{ filter: 'drop-shadow(0 0 10px rgba(239,68,68,0.7))' }}>🔒</div>
          <h3 className="font-black uppercase mb-2" style={{ ...sectionHeadingStyle, fontSize: '16px' }}>
            Too Many Failed Attempts
          </h3>
          <p style={{ color: 'rgba(156,163,175,0.8)', fontSize: '14px', marginBottom: '16px' }}>
            Please wait before trying again.
          </p>
          <div
            className="font-black text-5xl tabular-nums"
            style={{ color: '#f97316', textShadow: '0 0 20px rgba(249,115,22,0.6)' }}
          >
            {lockoutSec}s
          </div>
        </div>
      )}

      {/* First-time setup — backup code display screen */}
      {gateStatus === 'no-passcode' && showBackupCodeScreen && (
        <div>
          <div className="text-center mb-5">
            <div className="text-4xl mb-3">🛡️</div>
            <h3 className="font-black uppercase mb-1" style={sectionHeadingStyle}>Save Your Backup Code</h3>
            <p style={{ ...hintStyle, fontSize: '12px' }}>
              This code is shown <strong style={{ color: '#f97316' }}>once only</strong>. Use it if you forget your passcode.
            </p>
          </div>

          <div
            className="text-center font-black text-2xl tracking-widest mb-4 rounded-lg py-4 px-6"
            style={{
              background: 'rgba(127,29,29,0.35)',
              border: '1px solid rgba(220,38,38,0.4)',
              color: '#fff',
              letterSpacing: '0.25em',
              fontFamily: 'monospace',
            }}
          >
            {formatBackupCode(backupCode)}
          </div>

          <p style={{ ...hintStyle, textAlign: 'center', marginBottom: '20px' }}>
            Write it down or save it somewhere safe. It cannot be recovered later.
          </p>

          <button
            onClick={() => setShowBackupCodeScreen(false)}
            className="w-full py-3 font-black uppercase rounded-lg transition-all"
            style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              color: '#fff',
              letterSpacing: '0.15em',
              fontSize: '12px',
              boxShadow: '0 0 18px rgba(220,38,38,0.35)',
            }}
          >
            I've Saved It — Enter Settings
          </button>
        </div>
      )}

      {/* First-time setup — create passcode form */}
      {gateStatus === 'no-passcode' && !showBackupCodeScreen && (
        <form onSubmit={handleSetup}>
          <div className="text-center mb-5">
            <div className="text-4xl mb-3">🔑</div>
            <h3 className="font-black uppercase mb-1" style={sectionHeadingStyle}>Set Up Settings Passcode</h3>
            <p style={{ ...hintStyle, fontSize: '12px' }}>
              Protect your AI configuration. You'll need this to edit settings later.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label style={labelStyle}>New Passcode</label>
              <div className="relative mt-1.5">
                <input
                  type={showInput ? 'text' : 'password'}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Enter passcode"
                  autoFocus
                  style={{ ...inputStyle, paddingRight: '64px' }}
                  onFocus={e => (e.currentTarget.style.border = '1px solid rgba(220,38,38,0.5)')}
                  onBlur={e => (e.currentTarget.style.border = '1px solid rgba(75,85,99,0.5)')}
                />
                <button
                  type="button"
                  onClick={() => setShowInput(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold uppercase"
                  style={{ color: 'rgba(107,114,128,0.6)' }}
                >
                  {showInput ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Confirm Passcode</label>
              <input
                type="password"
                value={confirmInput}
                onChange={e => setConfirmInput(e.target.value)}
                placeholder="Repeat passcode"
                className="mt-1.5"
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.border = '1px solid rgba(220,38,38,0.5)')}
                onBlur={e => (e.currentTarget.style.border = '1px solid rgba(75,85,99,0.5)')}
              />
            </div>

            {(formError || error) && (
              <p className="text-sm font-semibold" style={{ color: '#f87171' }}>
                ⚠ {formError || error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-full py-3 font-black uppercase rounded-lg transition-all disabled:opacity-40"
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                color: '#fff',
                letterSpacing: '0.15em',
                fontSize: '12px',
                boxShadow: input.trim() ? '0 0 18px rgba(220,38,38,0.35)' : 'none',
              }}
            >
              {isLoading ? 'Setting up...' : '🔒 Set Passcode'}
            </button>
          </div>
        </form>
      )}

      {/* Verify passcode form */}
      {gateStatus === 'locked' && (
        <form onSubmit={handleVerify}>
          <div className="text-center mb-5">
            <div className="text-4xl mb-3">🔐</div>
            <h3 className="font-black uppercase mb-1" style={sectionHeadingStyle}>Settings Passcode Required</h3>
            <p style={{ ...hintStyle, fontSize: '12px' }}>
              Enter your passcode to access AI configuration.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label style={labelStyle}>{useBackup ? 'Backup Code' : 'Passcode'}</label>
                <button
                  type="button"
                  onClick={() => { setUseBackup(v => !v); setInput(''); clearError(); }}
                  className="text-xs font-bold transition-colors"
                  style={{ color: 'rgba(249,115,22,0.7)' }}
                >
                  {useBackup ? '← Use passcode' : 'Use backup code →'}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showInput ? 'text' : 'password'}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={useBackup ? 'XXXX-XXXX' : 'Enter passcode'}
                  autoFocus
                  style={{ ...inputStyle, paddingRight: '64px' }}
                  onFocus={e => (e.currentTarget.style.border = '1px solid rgba(220,38,38,0.5)')}
                  onBlur={e => (e.currentTarget.style.border = '1px solid rgba(75,85,99,0.5)')}
                />
                <button
                  type="button"
                  onClick={() => setShowInput(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold uppercase"
                  style={{ color: 'rgba(107,114,128,0.6)' }}
                >
                  {showInput ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm font-semibold" style={{ color: '#f87171' }}>⚠ {error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-full py-3 font-black uppercase rounded-lg transition-all disabled:opacity-40"
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                color: '#fff',
                letterSpacing: '0.15em',
                fontSize: '12px',
                boxShadow: input.trim() ? '0 0 18px rgba(220,38,38,0.35)' : 'none',
              }}
            >
              {isLoading ? 'Verifying...' : '🔓 Unlock Settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// ── Slider field component ─────────────────────────────────────────────────

function SliderField({
  label,
  hint,
  value,
  min,
  max,
  step,
  displayValue,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label style={labelStyle}>{label}</label>
        <span
          className="font-black tabular-nums"
          style={{ color: '#f97316', fontSize: '14px', fontFamily: 'monospace' }}
        >
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          accentColor: '#dc2626',
          background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${((value - min) / (max - min)) * 100}%, rgba(75,85,99,0.4) ${((value - min) / (max - min)) * 100}%, rgba(75,85,99,0.4) 100%)`,
        }}
      />
      {hint && <p style={hintStyle}>{hint}</p>}
    </div>
  );
}

// ── SettingsPage ───────────────────────────────────────────────────────────

export default function SettingsPage() {
  const {
    config,
    isLoading,
    gateStatus,
    lockoutRemainingMs,
    error,
    verifyPasscode,
    setupPasscode,
    changePasscode,
    updateConfig,
    resetConfig,
    clearError,
  } = useAppConfig();

  // Draft state — local edits before explicit save
  const [draft, setDraft] = useState<Partial<AppConfig>>({
    model: config.model,
    temperature: config.temperature,
    maxTokens: config.maxTokens,
    topP: config.topP,
    customInstruction: config.customInstruction ?? '',
  });
  const [topPEnabled, setTopPEnabled] = useState(config.topP !== undefined);
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Security section state
  const [securityOpen, setSecurityOpen] = useState(false);
  const [oldPasscode, setOldPasscode] = useState('');
  const [useBackupForChange, setUseBackupForChange] = useState(false);
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmNewPasscode, setConfirmNewPasscode] = useState('');
  const [securityError, setSecurityError] = useState('');
  const [newBackupCode, setNewBackupCode] = useState('');
  const [showNewBackupModal, setShowNewBackupModal] = useState(false);

  // Danger zone
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // ── Sync draft when gate unlocks (config might have been stale) ───────
  const syncDraft = (cfg: AppConfig) => {
    setDraft({
      model: cfg.model,
      temperature: cfg.temperature,
      maxTokens: cfg.maxTokens,
      topP: cfg.topP,
      customInstruction: cfg.customInstruction ?? '',
    });
    setTopPEnabled(cfg.topP !== undefined);
  };

  const handleVerify = async (p: string) => {
    const ok = await verifyPasscode(p);
    if (ok) syncDraft(config);
    return ok;
  };

  const handleSetup = async (p: string) => {
    const result = await setupPasscode(p);
    syncDraft(config);
    return result;
  };

  // ── Save AI settings ──────────────────────────────────────────────────
  const handleSave = () => {
    const toSave: Partial<AppConfig> = {
      ...draft,
      topP: topPEnabled ? draft.topP : undefined,
    };
    const ok = updateConfig(toSave);
    if (ok) {
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 2000);
    }
  };

  // ── Change passcode ───────────────────────────────────────────────────
  const handleChangePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError('');
    if (newPasscode.length < 4) { setSecurityError('New passcode must be at least 4 characters.'); return; }
    if (newPasscode !== confirmNewPasscode) { setSecurityError('New passcodes do not match.'); return; }

    const input = useBackupForChange ? oldPasscode.replace(/-/g, '').toUpperCase() : oldPasscode;
    const result = await changePasscode(input, newPasscode, useBackupForChange);
    if (!result) {
      setSecurityError('Incorrect passcode or backup code. Please try again.');
      return;
    }
    setNewBackupCode(result.backupCode);
    setShowNewBackupModal(true);
    setOldPasscode('');
    setNewPasscode('');
    setConfirmNewPasscode('');
    setSecurityError('');
  };

  // ── Reset to defaults ─────────────────────────────────────────────────
  const handleReset = () => {
    resetConfig();
    const defaults = config; // resetConfig updates the hook state; sync from CONFIG_DEFAULTS directly
    syncDraft({
      ...defaults,
      model: CONFIG_DEFAULTS.MODEL,
      temperature: CONFIG_DEFAULTS.TEMPERATURE,
      maxTokens: CONFIG_DEFAULTS.MAX_TOKENS,
      topP: CONFIG_DEFAULTS.TOP_P,
      customInstruction: CONFIG_DEFAULTS.CUSTOM_INSTRUCTION,
    });
    setShowResetConfirm(false);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const formatBackupCode = (code: string) =>
    code.length === 8 ? `${code.slice(0, 4)}-${code.slice(4)}` : code;

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen">
      {/* Passcode gate modal */}
      <Modal
        isOpen={gateStatus !== 'unlocked'}
        onClose={() => {}}
        closeOnOverlayClick={false}
        closeOnEscape={false}
        showCloseButton={false}
        size="sm"
        contentClassName="rounded-xl overflow-hidden"
      >
        <div style={{ background: 'linear-gradient(180deg, #110505 0%, #0a0000 100%)' }}>
          {/* Top flame accent */}
          <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #dc2626, #f97316, #dc2626, transparent)' }} />
          <PasscodeGate
            gateStatus={gateStatus}
            isLoading={isLoading}
            error={error}
            lockoutRemainingMs={lockoutRemainingMs}
            onVerify={handleVerify}
            onSetup={handleSetup}
            clearError={clearError}
          />
        </div>
      </Modal>

      {/* New backup code modal (after passcode change) */}
      <Modal
        isOpen={showNewBackupModal}
        onClose={() => setShowNewBackupModal(false)}
        showCloseButton={false}
        closeOnOverlayClick={false}
        size="sm"
        contentClassName="rounded-xl overflow-hidden"
      >
        <div style={{ background: 'linear-gradient(180deg, #110505 0%, #0a0000 100%)', padding: '28px 24px' }}>
          <div style={{ height: '2px', marginTop: '-28px', marginLeft: '-24px', marginRight: '-24px', marginBottom: '24px', background: 'linear-gradient(90deg, transparent, #dc2626, #f97316, #dc2626, transparent)' }} />
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">🛡️</div>
            <h3 className="font-black uppercase mb-1" style={sectionHeadingStyle}>New Backup Code</h3>
            <p style={{ ...hintStyle, fontSize: '12px' }}>Your passcode was changed. Save this new backup code — shown once only.</p>
          </div>
          <div
            className="text-center font-black text-2xl tracking-widest mb-4 rounded-lg py-4"
            style={{ background: 'rgba(127,29,29,0.35)', border: '1px solid rgba(220,38,38,0.4)', color: '#fff', fontFamily: 'monospace', letterSpacing: '0.25em' }}
          >
            {formatBackupCode(newBackupCode)}
          </div>
          <button
            onClick={() => setShowNewBackupModal(false)}
            className="w-full py-3 font-black uppercase rounded-lg"
            style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)', color: '#fff', letterSpacing: '0.15em', fontSize: '12px' }}
          >
            I've Saved It
          </button>
        </div>
      </Modal>

      {/* Reset confirm dialog */}
      <ConfirmModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleReset}
        title="Reset AI Settings?"
        message="This will restore model, temperature, max tokens, and custom instruction to their defaults. Your API key and leaderboard are not affected."
        confirmText="Yes, Reset"
        cancelText="Cancel"
        confirmVariant="danger"
      />

      {/* Page content (only rendered when unlocked) */}
      {gateStatus === 'unlocked' && (
        <div className="max-w-2xl mx-auto px-4 py-10">
          {/* Page header */}
          <div className="mb-8">
            <h1
              className="font-chef font-black uppercase text-white mb-1"
              style={{ fontSize: '28px', letterSpacing: '0.1em', textShadow: '0 0 20px rgba(220,38,38,0.7)' }}
            >
              ⚙ AI Settings
            </h1>
            <div style={{ height: '2px', width: '120px', background: 'linear-gradient(90deg, #dc2626, #f97316, transparent)' }} />
            <p style={{ color: 'rgba(156,163,175,0.65)', fontSize: '13px', marginTop: '8px' }}>
              Configure the AI judge. Changes apply on the next recipe submission.
            </p>
          </div>

          <div className="space-y-5">
            {/* ── AI Engine ─────────────────────────────────────────────── */}
            <div className="rounded-xl overflow-hidden" style={cardStyle}>
              <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid rgba(220,38,38,0.15)' }}>
                <h2 style={sectionHeadingStyle}>🤖 AI Engine</h2>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Model */}
                <div>
                  <label style={labelStyle}>Model</label>
                  <input
                    type="text"
                    value={draft.model ?? ''}
                    onChange={e => setDraft(d => ({ ...d, model: e.target.value }))}
                    placeholder="e.g. gpt-4o, gpt-4o-mini"
                    className="mt-1.5"
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.border = '1px solid rgba(220,38,38,0.5)')}
                    onBlur={e => (e.currentTarget.style.border = '1px solid rgba(75,85,99,0.5)')}
                  />
                  <p style={hintStyle}>Default: {CONFIG_DEFAULTS.MODEL}. Works with any OpenAI-compatible model.</p>
                </div>

                {/* Temperature */}
                <SliderField
                  label="Temperature"
                  hint="Lower = more consistent · Higher = more creative and unpredictable"
                  value={draft.temperature ?? CONFIG_DEFAULTS.TEMPERATURE}
                  min={CONFIG_LIMITS.TEMPERATURE_MIN}
                  max={CONFIG_LIMITS.TEMPERATURE_MAX}
                  step={CONFIG_LIMITS.TEMPERATURE_STEP}
                  displayValue={(draft.temperature ?? CONFIG_DEFAULTS.TEMPERATURE).toFixed(1)}
                  onChange={v => setDraft(d => ({ ...d, temperature: v }))}
                />

                {/* Max Tokens */}
                <SliderField
                  label="Max Tokens"
                  hint="Maximum tokens in Gordon's response. Higher = longer rants."
                  value={draft.maxTokens ?? CONFIG_DEFAULTS.MAX_TOKENS}
                  min={CONFIG_LIMITS.MAX_TOKENS_MIN}
                  max={CONFIG_LIMITS.MAX_TOKENS_MAX}
                  step={CONFIG_LIMITS.MAX_TOKENS_STEP}
                  displayValue={String(draft.maxTokens ?? CONFIG_DEFAULTS.MAX_TOKENS)}
                  onChange={v => setDraft(d => ({ ...d, maxTokens: Math.round(v) }))}
                />

                {/* Top-P (optional) */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer" style={{ ...labelStyle, marginBottom: '8px' }}>
                    <input
                      type="checkbox"
                      checked={topPEnabled}
                      onChange={e => {
                        setTopPEnabled(e.target.checked);
                        if (!e.target.checked) setDraft(d => ({ ...d, topP: undefined }));
                        else setDraft(d => ({ ...d, topP: 1 }));
                      }}
                      style={{ accentColor: '#dc2626', width: '14px', height: '14px' }}
                    />
                    Override Top-P
                  </label>
                  {topPEnabled && (
                    <SliderField
                      label=""
                      hint="Controls diversity via nucleus sampling. Lower = more focused."
                      value={draft.topP ?? 1}
                      min={CONFIG_LIMITS.TOP_P_MIN}
                      max={CONFIG_LIMITS.TOP_P_MAX}
                      step={CONFIG_LIMITS.TOP_P_STEP}
                      displayValue={(draft.topP ?? 1).toFixed(2)}
                      onChange={v => setDraft(d => ({ ...d, topP: parseFloat(v.toFixed(2)) }))}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* ── Custom Judge Instruction ───────────────────────────── */}
            <div className="rounded-xl overflow-hidden" style={cardStyle}>
              <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid rgba(220,38,38,0.15)' }}>
                <h2 style={sectionHeadingStyle}>📝 Custom Judge Instruction</h2>
              </div>
              <div style={{ padding: '20px' }}>
                <textarea
                  rows={3}
                  maxLength={CONFIG_LIMITS.CUSTOM_INSTRUCTION_MAX}
                  value={draft.customInstruction ?? ''}
                  onChange={e => setDraft(d => ({ ...d, customInstruction: e.target.value }))}
                  placeholder='e.g. "Always mention the word DONKEY at least once." or "Be 20% more forgiving on desserts."'
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '80px', fontFamily: 'inherit' }}
                  onFocus={e => (e.currentTarget.style.border = '1px solid rgba(220,38,38,0.5)')}
                  onBlur={e => (e.currentTarget.style.border = '1px solid rgba(75,85,99,0.5)')}
                />
                <div className="flex justify-between mt-1.5">
                  <p style={hintStyle}>Appended to the base judge prompt — use for tone tweaks or house rules.</p>
                  <p style={{ ...hintStyle, color: (draft.customInstruction?.length ?? 0) > CONFIG_LIMITS.CUSTOM_INSTRUCTION_MAX * 0.9 ? 'rgba(249,115,22,0.8)' : 'rgba(107,114,128,0.6)' }}>
                    {draft.customInstruction?.length ?? 0} / {CONFIG_LIMITS.CUSTOM_INSTRUCTION_MAX}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Save button ────────────────────────────────────────── */}
            <button
              onClick={handleSave}
              className="w-full py-3 font-black uppercase rounded-lg transition-all"
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                color: '#fff',
                letterSpacing: '0.18em',
                fontSize: '13px',
                boxShadow: '0 0 20px rgba(220,38,38,0.3)',
              }}
            >
              {savedFeedback ? '✓ Saved' : '🔥 Save AI Settings'}
            </button>

            {/* ── Security ──────────────────────────────────────────── */}
            <div className="rounded-xl overflow-hidden" style={cardStyle}>
              <button
                className="w-full text-left"
                style={{ padding: '16px 20px' }}
                onClick={() => setSecurityOpen(v => !v)}
              >
                <div className="flex items-center justify-between">
                  <h2 style={sectionHeadingStyle}>🔒 Security</h2>
                  <span style={{ color: 'rgba(107,114,128,0.6)', fontSize: '12px', transition: 'transform 0.2s', transform: securityOpen ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block' }}>▾</span>
                </div>
              </button>

              {securityOpen && (
                <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(220,38,38,0.15)' }}>
                  <p style={{ ...hintStyle, margin: '16px 0 14px' }}>Change your settings passcode. A new backup code will be generated.</p>
                  <form onSubmit={handleChangePasscode} className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label style={labelStyle}>{useBackupForChange ? 'Current Backup Code' : 'Current Passcode'}</label>
                        <button
                          type="button"
                          onClick={() => { setUseBackupForChange(v => !v); setOldPasscode(''); setSecurityError(''); }}
                          className="text-xs font-bold"
                          style={{ color: 'rgba(249,115,22,0.7)' }}
                        >
                          {useBackupForChange ? '← Use passcode' : 'Use backup code →'}
                        </button>
                      </div>
                      <input
                        type="password"
                        value={oldPasscode}
                        onChange={e => setOldPasscode(e.target.value)}
                        placeholder={useBackupForChange ? 'XXXX-XXXX' : 'Current passcode'}
                        style={inputStyle}
                        onFocus={e => (e.currentTarget.style.border = '1px solid rgba(220,38,38,0.5)')}
                        onBlur={e => (e.currentTarget.style.border = '1px solid rgba(75,85,99,0.5)')}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>New Passcode</label>
                      <input
                        type="password"
                        value={newPasscode}
                        onChange={e => setNewPasscode(e.target.value)}
                        placeholder="New passcode (min 4 chars)"
                        className="mt-1.5"
                        style={inputStyle}
                        onFocus={e => (e.currentTarget.style.border = '1px solid rgba(220,38,38,0.5)')}
                        onBlur={e => (e.currentTarget.style.border = '1px solid rgba(75,85,99,0.5)')}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Confirm New Passcode</label>
                      <input
                        type="password"
                        value={confirmNewPasscode}
                        onChange={e => setConfirmNewPasscode(e.target.value)}
                        placeholder="Repeat new passcode"
                        className="mt-1.5"
                        style={inputStyle}
                        onFocus={e => (e.currentTarget.style.border = '1px solid rgba(220,38,38,0.5)')}
                        onBlur={e => (e.currentTarget.style.border = '1px solid rgba(75,85,99,0.5)')}
                      />
                    </div>
                    {(securityError || error) && (
                      <p style={{ color: '#f87171', fontSize: '13px', fontWeight: 600 }}>
                        ⚠ {securityError || error}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={isLoading || !oldPasscode.trim() || !newPasscode.trim()}
                      className="w-full py-2.5 font-black uppercase rounded-lg transition-all disabled:opacity-40"
                      style={{ background: 'rgba(127,29,29,0.5)', border: '1px solid rgba(220,38,38,0.4)', color: '#fff', letterSpacing: '0.15em', fontSize: '12px' }}
                    >
                      {isLoading ? 'Changing...' : 'Change Passcode'}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* ── Danger Zone ───────────────────────────────────────── */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ ...cardStyle, border: '1px solid rgba(127,29,29,0.5)', background: 'rgba(10,0,0,0.8)' }}
            >
              <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid rgba(127,29,29,0.3)' }}>
                <h2 style={{ ...sectionHeadingStyle, color: 'rgba(239,68,68,0.8)' }}>⚠ Danger Zone</h2>
              </div>
              <div style={{ padding: '16px 20px' }} className="flex items-center justify-between gap-4">
                <div>
                  <p style={{ color: 'rgba(209,213,219,0.75)', fontSize: '13px', fontWeight: 600 }}>Reset to Defaults</p>
                  <p style={hintStyle}>Restore model, temperature, max tokens &amp; custom instruction. API key and leaderboard are unaffected.</p>
                </div>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="shrink-0 px-4 py-2 font-black uppercase rounded-lg transition-all hover:opacity-80"
                  style={{ background: 'rgba(127,29,29,0.5)', border: '1px solid rgba(220,38,38,0.4)', color: '#f87171', fontSize: '11px', letterSpacing: '0.12em' }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
