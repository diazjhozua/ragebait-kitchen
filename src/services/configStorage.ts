import { z } from 'zod';
import type { AppConfig, ConfigProtection, PasscodeSetupResult } from '../types/config';
import { STORAGE_KEYS, CONFIG_DEFAULTS, CONFIG_LIMITS } from '../utils/constants';

// ── Zod schemas ────────────────────────────────────────────────────────────

const appConfigSchema = z.object({
  model: z.string().min(1),
  temperature: z.number().min(0).max(2),
  maxTokens: z.number().int().min(100).max(2000),
  topP: z.number().min(0).max(1).optional(),
  customInstruction: z.string().max(500).optional(),
  lastUpdated: z.string().datetime(),
  version: z.number().int().positive()
});

const configProtectionSchema = z.object({
  salt: z.string().regex(/^[0-9a-f]+$/),
  hash: z.string().regex(/^[0-9a-f]+$/),
  backupCodeHash: z.string().regex(/^[0-9a-f]+$/)
});

// ── ConfigService ──────────────────────────────────────────────────────────

export class ConfigService {

  // ── Config CRUD ───────────────────────────────────────────────────────────

  static loadConfig(): AppConfig {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!raw) return ConfigService.defaultConfig();

      const parsed = JSON.parse(raw);
      const result = appConfigSchema.safeParse(parsed);

      if (!result.success) {
        console.warn('[ConfigService] Stored config invalid, using defaults:', result.error.issues);
        return ConfigService.defaultConfig();
      }

      // Forward migration: if schema version is old, migrate and re-save
      if (result.data.version < CONFIG_LIMITS.SCHEMA_VERSION) {
        const migrated = { ...result.data, version: CONFIG_LIMITS.SCHEMA_VERSION };
        ConfigService.saveConfig(migrated);
        return migrated;
      }

      return result.data;
    } catch {
      return ConfigService.defaultConfig();
    }
  }

  static saveConfig(partial: Partial<AppConfig>): boolean {
    try {
      const current = ConfigService.loadConfig();
      const merged: AppConfig = {
        ...current,
        ...partial,
        lastUpdated: new Date().toISOString(),
        version: CONFIG_LIMITS.SCHEMA_VERSION
      };

      const result = appConfigSchema.safeParse(merged);
      if (!result.success) {
        console.warn('[ConfigService] Config validation failed:', result.error.issues);
        return false;
      }

      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(result.data));
      return true;
    } catch {
      return false;
    }
  }

  static resetConfig(): AppConfig {
    const defaults = ConfigService.defaultConfig();
    ConfigService.saveConfig(defaults);
    return defaults;
  }

  static defaultConfig(): AppConfig {
    return {
      model: CONFIG_DEFAULTS.MODEL,
      temperature: CONFIG_DEFAULTS.TEMPERATURE,
      maxTokens: CONFIG_DEFAULTS.MAX_TOKENS,
      topP: CONFIG_DEFAULTS.TOP_P,
      customInstruction: CONFIG_DEFAULTS.CUSTOM_INSTRUCTION,
      lastUpdated: new Date().toISOString(),
      version: CONFIG_LIMITS.SCHEMA_VERSION
    };
  }

  // ── Passcode ──────────────────────────────────────────────────────────────

  static hasPasscode(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.PASSCODE);
  }

  static async setupPasscode(passcode: string): Promise<PasscodeSetupResult> {
    const salt = ConfigService.generateHexSalt(16);
    const backupCode = ConfigService.generateBackupCode();

    const hash = await ConfigService.hashValue(salt, passcode);
    const backupCodeHash = await ConfigService.hashValue(salt, backupCode);

    const protection: ConfigProtection = { salt, hash, backupCodeHash };
    localStorage.setItem(STORAGE_KEYS.PASSCODE, JSON.stringify(protection));

    return { backupCode };
  }

  static async verifyPasscode(passcode: string): Promise<boolean> {
    const protection = ConfigService.loadProtection();
    if (!protection) return true; // no passcode set — allow through

    const computed = await ConfigService.hashValue(protection.salt, passcode);
    return computed === protection.hash;
  }

  static async verifyBackupCode(code: string): Promise<boolean> {
    const protection = ConfigService.loadProtection();
    if (!protection) return false;

    // Strip any display hyphen and uppercase
    const normalized = code.replace(/-/g, '').toUpperCase();
    const computed = await ConfigService.hashValue(protection.salt, normalized);
    return computed === protection.backupCodeHash;
  }

  /**
   * Changes the passcode. Verifies the old input (either the current passcode
   * or the backup code depending on useBackup). Returns a new PasscodeSetupResult
   * with a freshly generated backup code, or null if verification fails.
   */
  static async changePasscode(
    oldInput: string,
    newPasscode: string,
    useBackup: boolean
  ): Promise<PasscodeSetupResult | null> {
    const verified = useBackup
      ? await ConfigService.verifyBackupCode(oldInput)
      : await ConfigService.verifyPasscode(oldInput);

    if (!verified) return null;

    return ConfigService.setupPasscode(newPasscode);
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private static loadProtection(): ConfigProtection | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PASSCODE);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      const result = configProtectionSchema.safeParse(parsed);
      return result.success ? result.data : null;
    } catch {
      return null;
    }
  }

  private static async hashValue(salt: string, value: string): Promise<string> {
    const encoded = new TextEncoder().encode(salt + value);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private static generateHexSalt(byteCount: number): string {
    const bytes = new Uint8Array(byteCount);
    crypto.getRandomValues(bytes);
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private static generateBackupCode(): string {
    const bytes = new Uint8Array(CONFIG_LIMITS.BACKUP_CODE_LENGTH);
    crypto.getRandomValues(bytes);
    // Convert each byte to an alphanumeric character (A-Z, 0-9)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from(bytes)
      .map(b => chars[b % chars.length])
      .join('')
      .slice(0, CONFIG_LIMITS.BACKUP_CODE_LENGTH);
  }
}
