import { useState, useEffect, useCallback, useRef } from 'react';
import type { AppConfig, PasscodeGateStatus, PasscodeSetupResult } from '../types/config';
import { ConfigService } from '../services/configStorage';
import { CONFIG_LIMITS } from '../utils/constants';

// ── Module-level state — mirrors sessionApiKey pattern in useApiKey.ts ─────
// Not React state so it survives re-renders without resetting the counter.
let failedAttempts = 0;
let lockoutUntil: number | null = null;

// ── Types ──────────────────────────────────────────────────────────────────

export interface AppConfigState {
  config: AppConfig;
  isLoading: boolean;
  gateStatus: PasscodeGateStatus;
  lockoutRemainingMs: number;
  error: string | null;
}

export interface AppConfigActions {
  updateConfig: (partial: Partial<AppConfig>) => boolean;
  resetConfig: () => void;
  verifyPasscode: (passcode: string) => Promise<boolean>;
  setupPasscode: (passcode: string) => Promise<PasscodeSetupResult>;
  changePasscode: (
    oldInput: string,
    newPasscode: string,
    useBackup: boolean
  ) => Promise<PasscodeSetupResult | null>;
  clearError: () => void;
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useAppConfig(): AppConfigState & AppConfigActions {
  const [config, setConfig] = useState<AppConfig>(() => ConfigService.defaultConfig());
  const [isLoading, setIsLoading] = useState(false);
  const [gateStatus, setGateStatus] = useState<PasscodeGateStatus>('locked');
  const [lockoutRemainingMs, setLockoutRemainingMs] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Mount: load config and determine gate state ────────────────────────
  useEffect(() => {
    setConfig(ConfigService.loadConfig());

    if (!ConfigService.hasPasscode()) {
      setGateStatus('no-passcode');
      return;
    }

    // Check if we're already in a lockout from a previous render
    if (lockoutUntil !== null && Date.now() < lockoutUntil) {
      setGateStatus('locked-out');
      setLockoutRemainingMs(lockoutUntil - Date.now());
      startCountdown();
    } else {
      setGateStatus('locked');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Cleanup countdown on unmount ──────────────────────────────────────
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // ── Countdown interval ────────────────────────────────────────────────
  const startCountdown = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);

    countdownRef.current = setInterval(() => {
      if (lockoutUntil === null) {
        clearInterval(countdownRef.current!);
        return;
      }
      const remaining = lockoutUntil - Date.now();
      if (remaining <= 0) {
        clearInterval(countdownRef.current!);
        lockoutUntil = null;
        failedAttempts = 0;
        setLockoutRemainingMs(0);
        setGateStatus('locked');
        setError(null);
      } else {
        setLockoutRemainingMs(remaining);
      }
    }, 1000);
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────

  const verifyPasscode = useCallback(async (passcode: string): Promise<boolean> => {
    if (lockoutUntil !== null && Date.now() < lockoutUntil) return false;

    setIsLoading(true);
    setError(null);
    try {
      const ok = await ConfigService.verifyPasscode(passcode);
      if (ok) {
        failedAttempts = 0;
        lockoutUntil = null;
        setGateStatus('unlocked');
        setLockoutRemainingMs(0);
        return true;
      }

      failedAttempts++;
      const remaining = CONFIG_LIMITS.PASSCODE_MAX_ATTEMPTS - failedAttempts;

      if (failedAttempts >= CONFIG_LIMITS.PASSCODE_MAX_ATTEMPTS) {
        lockoutUntil = Date.now() + CONFIG_LIMITS.PASSCODE_LOCKOUT_MS;
        setGateStatus('locked-out');
        setLockoutRemainingMs(CONFIG_LIMITS.PASSCODE_LOCKOUT_MS);
        setError('Too many failed attempts. Please wait 30 seconds.');
        startCountdown();
      } else {
        setError(`Incorrect passcode. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [startCountdown]);

  const setupPasscode = useCallback(async (passcode: string): Promise<PasscodeSetupResult> => {
    setIsLoading(true);
    try {
      const result = await ConfigService.setupPasscode(passcode);
      failedAttempts = 0;
      lockoutUntil = null;
      setGateStatus('unlocked');
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changePasscode = useCallback(async (
    oldInput: string,
    newPasscode: string,
    useBackup: boolean
  ): Promise<PasscodeSetupResult | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await ConfigService.changePasscode(oldInput, newPasscode, useBackup);
      if (!result) {
        setError('Incorrect passcode or backup code.');
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateConfig = useCallback((partial: Partial<AppConfig>): boolean => {
    const ok = ConfigService.saveConfig(partial);
    if (ok) setConfig(ConfigService.loadConfig());
    return ok;
  }, []);

  const resetConfig = useCallback(() => {
    const defaults = ConfigService.resetConfig();
    setConfig(defaults);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
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
    clearError
  };
}
