export interface AppConfig {
  model: string;
  temperature: number;        // 0–2
  maxTokens: number;          // 100–2000
  topP?: number;              // 0–1, omitted when not set
  customInstruction?: string;
  lastUpdated: string;        // ISO timestamp
  version: number;
}

export interface ConfigProtection {
  salt: string;           // hex string, 16 random bytes
  hash: string;           // hex SHA-256(salt + passcode)
  backupCodeHash: string; // hex SHA-256(salt + backupCode)
}

export interface PasscodeSetupResult {
  backupCode: string; // 8-char alphanumeric — shown once, never stored as plaintext
}

export type PasscodeGateStatus =
  | 'no-passcode'  // first visit — go straight to setup
  | 'locked'       // passcode set, awaiting verification
  | 'unlocked'     // verified or setup just completed
  | 'locked-out';  // 5 failed attempts, cooling down
