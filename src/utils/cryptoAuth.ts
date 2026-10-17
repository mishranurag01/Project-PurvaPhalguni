/**
 * Cryptographic Authentication & Password Management
 *
 * Implements:
 * 1. Secure memory-hard scrypt key derivation (RFC 7914, OWASP standard parameters).
 * 2. Constant-time digest comparison to prevent timing attacks.
 * 3. Fail-closed error handling: zero weak fallbacks, throws when crypto APIs are unavailable.
 * 4. Transparent, safe password migration pipeline from prototype single-round SHA-256 to scrypt.
 * 5. Production demo lock: strict isolation preventing demo bypasses or demo credentials in production.
 *
 * Requirements:
 * - Plaintext passwords are never persisted or exposed.
 * - Production password hashes are never bundled for client-side verification in production builds.
 */

import * as scryptJs from 'scrypt-js';

// CJS / ESM Interop for scrypt function
const scrypt = (scryptJs as any).scrypt || (scryptJs as any).default?.scrypt;

// OWASP Recommended scrypt parameters for password storage:
// N = 16384 (CPU/memory cost factor, 2^14), r = 8 (block size), p = 1 (parallelization)
// Output key length: 32 bytes (256 bits)
export const SCRYPT_CONFIG = {
  cost: 16384,
  blockSize: 8,
  parallelization: 1,
  keyLength: 32,
  saltLength: 16 // bytes
} as const;

export interface PasswordHashResult {
  hash: string;
  salt: string;
  algorithm: 'scrypt';
}

export interface MigrationResult {
  isValid: boolean;
  requiresMigration: boolean;
  migratedHash?: string;
  migratedSalt?: string;
  migratedAlgorithm?: 'scrypt';
  error?: string;
}

// Convert byte array to lower-case hexadecimal string
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Convert hexadecimal string to Uint8Array
export function hexToBytes(hex: string): Uint8Array {
  if (!hex || hex.length % 2 !== 0) {
    throw new Error('Invalid hexadecimal string format.');
  }
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    const val = parseInt(hex.substring(i, i + 2), 16);
    if (Number.isNaN(val)) {
      throw new Error('Hexadecimal string contains invalid characters.');
    }
    bytes[i / 2] = val;
  }
  return bytes;
}

// Constant-time string and buffer comparison to prevent timing side-channel attacks
export function timingSafeEqual(
  a: string | Uint8Array,
  b: string | Uint8Array
): boolean {
  if (typeof a === 'string' && typeof b === 'string') {
    if (a.length !== b.length) {
      return false;
    }
    let mismatch = 0;
    for (let i = 0; i < a.length; i++) {
      mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return mismatch === 0;
  }

  const bufA = a instanceof Uint8Array ? a : new TextEncoder().encode(String(a));
  const bufB = b instanceof Uint8Array ? b : new TextEncoder().encode(String(b));

  if (bufA.length !== bufB.length) {
    return false;
  }

  let mismatch = 0;
  for (let i = 0; i < bufA.length; i++) {
    mismatch |= bufA[i] ^ bufB[i];
  }
  return mismatch === 0;
}

/**
 * Access the cryptographic services provider.
 * Fails closed if standard cryptographic random generation is unavailable.
 */
export function getCryptoProvider(): Crypto {
  const c =
    (typeof globalThis !== 'undefined' && globalThis.crypto) ||
    (typeof window !== 'undefined' ? window.crypto : undefined);

  if (!c || typeof c.getRandomValues !== 'function') {
    throw new Error('Cryptographic services are unavailable in this environment.');
  }
  return c as Crypto;
}

/**
 * Generate a cryptographically secure random salt.
 * Fails closed if cryptographic RNG is unavailable — never falls back to Math.random().
 */
export function generateSalt(byteLength: number = SCRYPT_CONFIG.saltLength): string {
  if (byteLength < 16) {
    throw new Error('Salt length must be at least 16 bytes for cryptographic security.');
  }
  const cryptoObj = getCryptoProvider();
  const saltBytes = new Uint8Array(byteLength);
  cryptoObj.getRandomValues(saltBytes);
  return bytesToHex(saltBytes);
}

/**
 * Hash a password using scrypt (RFC 7914) with OWASP-recommended parameters.
 * Plaintext passwords are never stored or logged.
 */
export async function hashPassword(
  password: string,
  existingSalt?: string
): Promise<PasswordHashResult> {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string.');
  }

  const salt = existingSalt || generateSalt();
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);
  const saltBytes = encoder.encode(salt);

  const derivedKey = await scrypt(
    passwordBytes,
    saltBytes,
    SCRYPT_CONFIG.cost,
    SCRYPT_CONFIG.blockSize,
    SCRYPT_CONFIG.parallelization,
    SCRYPT_CONFIG.keyLength
  );

  const derivedHex = bytesToHex(derivedKey);
  const formattedHash = `scrypt$N=${SCRYPT_CONFIG.cost},r=${SCRYPT_CONFIG.blockSize},p=${SCRYPT_CONFIG.parallelization}$${salt}$${derivedHex}`;

  return {
    hash: formattedHash,
    salt,
    algorithm: 'scrypt'
  };
}

/**
 * Helper to compute legacy prototype single-round SHA-256 for migration validation.
 * Formula: SHA-256(salt + ":" + password)
 */
export async function computeLegacySha256(password: string, salt: string): Promise<string> {
  const cryptoObj = getCryptoProvider();
  if (!cryptoObj.subtle || typeof cryptoObj.subtle.digest !== 'function') {
    throw new Error('Cryptographic SHA-256 digest is unavailable.');
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${password}`);
  const hashBuffer = await cryptoObj.subtle.digest('SHA-256', data);
  return bytesToHex(new Uint8Array(hashBuffer));
}

/**
 * Verify a candidate password against an scrypt hash using constant-time comparison.
 * Fails closed on any invalid or missing arguments.
 */
export async function verifyPassword(
  passwordCandidate: string,
  storedHash: string,
  salt: string
): Promise<boolean> {
  if (!passwordCandidate || !storedHash || !salt) {
    return false;
  }
  if (
    typeof passwordCandidate !== 'string' ||
    typeof storedHash !== 'string' ||
    typeof salt !== 'string'
  ) {
    return false;
  }

  try {
    let targetDerivedHex: string;
    let cost: number = SCRYPT_CONFIG.cost;
    let blockSize: number = SCRYPT_CONFIG.blockSize;
    let parallelization: number = SCRYPT_CONFIG.parallelization;

    // Parse formatted hash if present: scrypt$N=...,r=...,p=...$salt$derivedHex
    if (storedHash.startsWith('scrypt$')) {
      const parts = storedHash.split('$');
      if (parts.length >= 5) {
        // parts[0] is 'scrypt', parts[1] is params, parts[2] is salt, parts[3] is derivedHex
        const paramStr = parts[1];
        const nMatch = paramStr.match(/N=(\d+)/);
        const rMatch = paramStr.match(/r=(\d+)/);
        const pMatch = paramStr.match(/p=(\d+)/);
        if (nMatch) cost = parseInt(nMatch[1], 10);
        if (rMatch) blockSize = parseInt(rMatch[1], 10);
        if (pMatch) parallelization = parseInt(pMatch[1], 10);
        targetDerivedHex = parts[parts.length - 1];
      } else {
        targetDerivedHex = parts[parts.length - 1];
      }
    } else {
      targetDerivedHex = storedHash;
    }

    const encoder = new TextEncoder();
    const candidateBytes = encoder.encode(passwordCandidate);
    const saltBytes = encoder.encode(salt);

    const derivedKey = await scrypt(
      candidateBytes,
      saltBytes,
      cost,
      blockSize,
      parallelization,
      SCRYPT_CONFIG.keyLength
    );

    const candidateDerivedHex = bytesToHex(derivedKey);

    return timingSafeEqual(candidateDerivedHex, targetDerivedHex);
  } catch {
    // Fail closed on any cryptographic or runtime error
    return false;
  }
}

/**
 * Verify a candidate password against a legacy prototype SHA-256 record.
 */
export async function verifyLegacyPassword(
  passwordCandidate: string,
  storedHash: string,
  salt: string
): Promise<boolean> {
  if (!passwordCandidate || !storedHash || !salt) {
    return false;
  }

  try {
    const computed = await computeLegacySha256(passwordCandidate, salt);
    let target = storedHash;
    if (target.startsWith('sha256$')) {
      const parts = target.split('$');
      target = parts[parts.length - 1];
    }
    return timingSafeEqual(computed, target);
  } catch {
    return false;
  }
}

/**
 * Safe password verification and migration pipeline.
 *
 * Strategy:
 * 1. If user account is already using 'scrypt':
 *    Verifies using scrypt. Returns { isValid, requiresMigration: false }.
 * 2. If user account has a legacy prototype SHA-256 hash:
 *    - Verifies candidate password against legacy SHA-256.
 *    - If incorrect: fails closed immediately ({ isValid: false, requiresMigration: false }).
 *    - If correct: user has proven ownership! Automatically upgrades to scrypt:
 *      Generates fresh cryptographic salt, computes modern scrypt hash,
 *      and returns { isValid: true, requiresMigration: true, migratedHash, migratedSalt, migratedAlgorithm: 'scrypt' }.
 *      The calling store then persists the upgraded scrypt credentials.
 * 3. Fails closed on any corrupt or unknown format.
 */
export async function verifyAndMigratePassword(
  passwordCandidate: string,
  account: {
    passwordHash?: string;
    passwordSalt?: string;
    passwordAlgorithm?: 'scrypt' | 'legacy_sha256';
  }
): Promise<MigrationResult> {
  const { passwordHash, passwordSalt, passwordAlgorithm } = account;

  if (!passwordHash || !passwordSalt || !passwordCandidate) {
    return { isValid: false, requiresMigration: false };
  }

  const isScrypt =
    passwordAlgorithm === 'scrypt' ||
    passwordHash.startsWith('scrypt$') ||
    (!passwordAlgorithm && passwordHash.length === 64 && !passwordHash.startsWith('sha256$'));

  // 1. Direct scrypt verification
  if (passwordAlgorithm === 'scrypt' || passwordHash.startsWith('scrypt$')) {
    const isValid = await verifyPassword(passwordCandidate, passwordHash, passwordSalt);
    return {
      isValid,
      requiresMigration: false
    };
  }

  // 2. Legacy prototype migration check
  const isLegacy =
    passwordAlgorithm === 'legacy_sha256' ||
    passwordHash.startsWith('sha256$') ||
    (!passwordAlgorithm && !passwordHash.startsWith('scrypt$'));

  if (isLegacy) {
    const isLegacyValid = await verifyLegacyPassword(passwordCandidate, passwordHash, passwordSalt);

    if (!isLegacyValid) {
      // Failed closed — wrong password does NOT trigger migration
      return {
        isValid: false,
        requiresMigration: false
      };
    }

    // Correct password: possess authentic credentials! Migrate to scrypt now.
    const newSalt = generateSalt();
    const { hash: newScryptHash } = await hashPassword(passwordCandidate, newSalt);

    return {
      isValid: true,
      requiresMigration: true,
      migratedHash: newScryptHash,
      migratedSalt: newSalt,
      migratedAlgorithm: 'scrypt'
    };
  }

  return { isValid: false, requiresMigration: false };
}

/**
 * Detects whether the current execution context is a production build.
 */
export function isProductionEnvironment(): boolean {
  if (typeof import.meta !== 'undefined' && Boolean(import.meta.env?.PROD)) {
    return true;
  }
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production') {
    return true;
  }
  return false;
}

/**
 * Evaluates whether demo authentication features are permitted.
 * Strictly forbidden in production builds regardless of configuration flags.
 */
export function isDemoModeEnabled(): boolean {
  if (isProductionEnvironment()) {
    return false;
  }

  const demoFlag =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEMO_MODE) ||
    (typeof process !== 'undefined' && process.env?.VITE_DEMO_MODE);

  return demoFlag === 'true' || demoFlag === true;
}

/**
 * Fictional demo credentials for local development evaluation only.
 * Returns null if demo mode is disabled or running in production.
 */
export const getDemoCredentials = () => {
  if (!isDemoModeEnabled()) {
    return null;
  }

  return {
    admin: {
      email:
        (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEFAULT_ADMIN_EMAIL) ||
        'admin@purvaphalguni.com',
      password:
        (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEFAULT_ADMIN_PASSWORD) ||
        'SanctuaryAdmin2026!'
    },
    affiliate: {
      email:
        (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEFAULT_AFFILIATE_EMAIL) ||
        'affiliate@purvaphalguni.com',
      password:
        (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEFAULT_AFFILIATE_PASSWORD) ||
        'Practitioner2026!'
    },
    client: {
      email:
        (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEFAULT_CLIENT_EMAIL) ||
        'client@purvaphalguni.com',
      password:
        (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEFAULT_CLIENT_PASSWORD) ||
        'ClientPass2026!'
    }
  };
};

/**
 * Default public contact / account email addresses for standard practice roles.
 * No passwords or password hashes are exported here to prevent credential exposure.
 */
export const DEFAULT_CREDENTIALS = {
  admin: {
    email: 'admin@purvaphalguni.com'
  },
  affiliate: {
    email: 'affiliate@purvaphalguni.com'
  },
  client: {
    email: 'client@purvaphalguni.com'
  }
};
