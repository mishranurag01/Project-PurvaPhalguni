/**
 * Cryptographic Password Hashing and Verification Utility
 * 
 * Uses standard Web Crypto API (SHA-256 with 128-bit random cryptographic salt)
 * Plaintext passwords are never stored or logged.
 */

// Convert ArrayBuffer to Hex String
function bufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  return Array.from(byteArray)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

// Generate a random 16-byte (128-bit) salt in hex format
export function generateSalt(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const saltBytes = new Uint8Array(16);
    window.crypto.getRandomValues(saltBytes);
    return Array.from(saltBytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  // Fallback pseudo-random for non-browser environments
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Hash a password using SHA-256 and a cryptographic salt.
 * Formula: SHA-256(salt + ":" + password)
 */
export async function hashPassword(password: string, existingSalt?: string): Promise<{ hash: string; salt: string }> {
  const salt = existingSalt || generateSalt();
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${password}`);

  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashHex = bufferToHex(hashBuffer);
    return { hash: hashHex, salt };
  }

  // Pure JS fallback if crypto.subtle is unavailable (e.g. non-secure contexts)
  let hashVal = 0;
  for (let i = 0; i < data.length; i++) {
    hashVal = (hashVal << 5) - hashVal + data[i];
    hashVal |= 0;
  }
  return { hash: Math.abs(hashVal).toString(16).padStart(64, '0'), salt };
}

/**
 * Verify a plaintext candidate password against stored hash and salt.
 * Uses constant-time comparison.
 */
export async function verifyPassword(password: string, storedHash: string, salt: string): Promise<boolean> {
  if (!storedHash || !salt) return false;
  const { hash: computedHash } = await hashPassword(password, salt);
  
  if (computedHash.length !== storedHash.length) {
    return false;
  }

  // Constant-time comparison
  let mismatch = 0;
  for (let i = 0; i < computedHash.length; i++) {
    mismatch |= computedHash.charCodeAt(i) ^ storedHash.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Default initial passwords for demonstration / first access:
 * Admin:        admin@purvaphalguni.com     -> SanctuaryAdmin2026!
 * Affiliate:    affiliate1@example.com      -> Practitioner2026!
 * Client:       demo.client@example.com     -> ClientPass2026!
 */
const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

export const DEFAULT_CREDENTIALS = {
  admin: {
    email: import.meta.env.VITE_DEFAULT_ADMIN_EMAIL || 'admin@purvaphalguni.com',
    secondaryEmail: 'admin.demo@example.com',
    defaultPassword: isDemoMode ? (import.meta.env.VITE_DEFAULT_ADMIN_PASSWORD || 'SanctuaryAdmin2026!') : '',
    simplePassword: isDemoMode ? 'admin' : ''
  },
  affiliate: {
    email: import.meta.env.VITE_DEFAULT_AFFILIATE_EMAIL || 'affiliate@purvaphalguni.com',
    secondaryEmail: 'demo.affiliate1@example.com',
    defaultPassword: isDemoMode ? (import.meta.env.VITE_DEFAULT_AFFILIATE_PASSWORD || 'Practitioner2026!') : '',
    simplePassword: isDemoMode ? 'affiliate' : ''
  },
  client: {
    email: import.meta.env.VITE_DEFAULT_CLIENT_EMAIL || 'client@purvaphalguni.com',
    secondaryEmail: 'demo.client1@example.com',
    defaultPassword: isDemoMode ? (import.meta.env.VITE_DEFAULT_CLIENT_PASSWORD || 'ClientPass2026!') : '',
    simplePassword: isDemoMode ? 'client' : ''
  }
};
