import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import {
  generateSalt,
  hashPassword,
  verifyPassword,
  verifyLegacyPassword,
  verifyAndMigratePassword,
  computeLegacySha256,
  isDemoModeEnabled,
  getDemoCredentials,
  timingSafeEqual,
  SCRYPT_CONFIG
} from '../utils/cryptoAuth';
import { PracticeStore } from '../services/store';
import { authService } from '../services/api/authService';
import { UserProfile } from '../types/practice';

describe('Security & Authentication Suite', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalDemoMode = process.env.VITE_DEMO_MODE;

  beforeEach(() => {
    process.env.NODE_ENV = 'development';
    process.env.VITE_DEMO_MODE = 'true';
    PracticeStore.resetStore();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    process.env.VITE_DEMO_MODE = originalDemoMode;
  });

  describe('1. Cryptographic scrypt (RFC 7914) Hashing & Verification', () => {
    test('generateSalt returns 16-byte (32 hex character) cryptographic salt', () => {
      const salt1 = generateSalt();
      const salt2 = generateSalt();

      assert.strictEqual(typeof salt1, 'string');
      assert.strictEqual(salt1.length, 32);
      assert.match(salt1, /^[0-9a-f]{32}$/i);
      assert.notStrictEqual(salt1, salt2, 'Salts must be cryptographically unique');
    });

    test('hashPassword produces standard formatted scrypt hash with configured OWASP parameters', async () => {
      const { hash, salt, algorithm } = await hashPassword('SecretTestPassword123!');
      assert.strictEqual(algorithm, 'scrypt');
      assert.strictEqual(salt.length, 32);
      assert.ok(hash.startsWith(`scrypt$N=${SCRYPT_CONFIG.cost},r=${SCRYPT_CONFIG.blockSize},p=${SCRYPT_CONFIG.parallelization}$`));
      
      const parts = hash.split('$');
      const derivedHex = parts[parts.length - 1];
      assert.strictEqual(derivedHex.length, 64, 'Derived key must be 32 bytes (64 hex characters)');
    });

    test('hashPassword produces deterministic output for identical password and salt', async () => {
      const salt = 'a1b2c3d4e5f60718293a4b5c6d7e8f90';
      const res1 = await hashPassword('DeterministicPass123!', salt);
      const res2 = await hashPassword('DeterministicPass123!', salt);

      assert.strictEqual(res1.hash, res2.hash);
      assert.strictEqual(res1.salt, res2.salt);
    });

    test('hashPassword throws when given empty or non-string input (fails closed)', async () => {
      await assert.rejects(async () => {
        await hashPassword('');
      }, /Password must be a non-empty string/);

      await assert.rejects(async () => {
        // @ts-expect-error Testing invalid runtime input
        await hashPassword(null);
      }, /Password must be a non-empty string/);
    });

    test('verifyPassword validates authentic password and rejects incorrect password (fails closed)', async () => {
      const password = 'SanctuarySecure2026!';
      const { hash, salt } = await hashPassword(password);

      const isValid = await verifyPassword(password, hash, salt);
      assert.strictEqual(isValid, true, 'Valid password must verify successfully');

      const isInvalid = await verifyPassword('WrongPassword2026!', hash, salt);
      assert.strictEqual(isInvalid, false, 'Invalid password must fail closed');
    });

    test('verifyPassword fails closed on empty, null, or tampered inputs', async () => {
      const { hash, salt } = await hashPassword('ValidPass2026!');

      assert.strictEqual(await verifyPassword('', hash, salt), false);
      // @ts-expect-error Testing invalid runtime input
      assert.strictEqual(await verifyPassword(null, hash, salt), false);
      assert.strictEqual(await verifyPassword('ValidPass2026!', '', salt), false);
      assert.strictEqual(await verifyPassword('ValidPass2026!', hash, ''), false);

      // Tampered hash derived key fails closed
      const tamperedHash = hash.replace(/[0-9a-f]$/, (c) => (c === '0' ? '1' : '0'));
      assert.strictEqual(await verifyPassword('ValidPass2026!', tamperedHash, salt), false);
    });

    test('timingSafeEqual detects equality and mismatch in constant time', () => {
      assert.strictEqual(timingSafeEqual('abcdef123456', 'abcdef123456'), true);
      assert.strictEqual(timingSafeEqual('abcdef123456', 'abcdef123457'), false);
      assert.strictEqual(timingSafeEqual('short', 'longerstring'), false);
    });
  });

  describe('2. Prototype Account Password Migration Strategy (Legacy SHA-256 to scrypt)', () => {
    test('legacy account rejects incorrect password and does NOT trigger migration', async () => {
      const legacySalt = 'legacy_salt_test_1234567890abcdef';
      const legacyPassword = 'LegacyPassword2025!';
      const legacyHash = await computeLegacySha256(legacyPassword, legacySalt);

      const legacyAccount: Partial<UserProfile> = {
        id: 'legacy-user-1',
        email: 'legacy@example.com',
        passwordSalt: legacySalt,
        passwordHash: legacyHash,
        passwordAlgorithm: 'legacy_sha256'
      };

      const result = await verifyAndMigratePassword('WrongPassword!', legacyAccount);
      assert.strictEqual(result.isValid, false, 'Wrong password must fail closed');
      assert.strictEqual(result.requiresMigration, false, 'Failed authentication must NOT trigger migration');
      assert.strictEqual(result.migratedHash, undefined);
    });

    test('legacy account authenticating with valid password triggers transparent scrypt migration', async () => {
      const legacySalt = 'legacy_salt_migrate_1234567890';
      const password = 'UpgradeMySecurity2026!';
      const legacyHash = await computeLegacySha256(password, legacySalt);

      const legacyAccount: Partial<UserProfile> = {
        id: 'legacy-user-2',
        email: 'upgrade@example.com',
        passwordSalt: legacySalt,
        passwordHash: legacyHash,
        passwordAlgorithm: 'legacy_sha256'
      };

      const result = await verifyAndMigratePassword(password, legacyAccount);
      assert.strictEqual(result.isValid, true, 'Valid credential must authenticate');
      assert.strictEqual(result.requiresMigration, true, 'Must flag account for migration to scrypt');
      assert.strictEqual(result.migratedAlgorithm, 'scrypt');
      assert.ok(result.migratedHash?.startsWith('scrypt$'), 'Migrated hash must use scrypt format');
      assert.ok(result.migratedSalt && result.migratedSalt !== legacySalt, 'Migrated account must receive fresh cryptographic salt');

      // Verify that the newly migrated scrypt hash can be verified with scrypt
      const verifiedWithScrypt = await verifyPassword(password, result.migratedHash!, result.migratedSalt!);
      assert.strictEqual(verifiedWithScrypt, true, 'Migrated scrypt hash must verify successfully');

      // Verify migrated account fails closed with wrong password under scrypt
      const wrongWithScrypt = await verifyPassword('BadPassword!', result.migratedHash!, result.migratedSalt!);
      assert.strictEqual(wrongWithScrypt, false, 'Migrated scrypt hash must reject incorrect password');
    });

    test('PracticeStore automatically updates legacy user to scrypt upon first successful login', async () => {
      const users = PracticeStore.getUsers();
      const legacySalt = 'salt_legacy_store_test_99999999';
      const legacyPass = 'LegacyAdminPass2025!';
      const legacyHash = await computeLegacySha256(legacyPass, legacySalt);

      const legacyUser: UserProfile = {
        id: 'legacy-practitioner',
        email: 'legacy.patel@purvaphalguni.com',
        name: 'Legacy Practitioner',
        role: 'affiliate',
        activeStatus: 'active',
        consentGiven: true,
        passwordSalt: legacySalt,
        passwordHash: legacyHash,
        passwordAlgorithm: 'legacy_sha256'
      };

      PracticeStore.saveUsers([...users, legacyUser]);

      // Login with legacy account using correct password
      const authRes = await PracticeStore.authenticateUser(
        'legacy.patel@purvaphalguni.com',
        legacyPass,
        'affiliate'
      );

      assert.strictEqual(authRes.success, true);
      assert.ok(authRes.user);

      // Verify that the store has now persisted the migrated scrypt credentials
      const updatedUser = PracticeStore.getUsers().find((u) => u.id === 'legacy-practitioner')!;
      assert.strictEqual(updatedUser.passwordAlgorithm, 'scrypt', 'Account must be migrated to scrypt');
      assert.ok(updatedUser.passwordHash?.startsWith('scrypt$'), 'Stored hash must be scrypt');
      assert.notStrictEqual(updatedUser.passwordSalt, legacySalt, 'Salt must be upgraded to fresh salt');
      assert.ok(updatedUser.migratedAt, 'migratedAt timestamp must be recorded');

      // Subsequent login now verifies directly using scrypt
      const subsequentLogin = await PracticeStore.authenticateUser(
        'legacy.patel@purvaphalguni.com',
        legacyPass,
        'affiliate'
      );
      assert.strictEqual(subsequentLogin.success, true, 'Subsequent login with scrypt must succeed');

      // Subsequent login with wrong password fails closed
      const subsequentWrong = await PracticeStore.authenticateUser(
        'legacy.patel@purvaphalguni.com',
        'WrongPasswordAfterMigration',
        'affiliate'
      );
      assert.strictEqual(subsequentWrong.success, false);
    });
  });

  describe('3. Unavailable Authentication Services & Fail-Closed Behavior', () => {
    test('generateSalt throws if cryptographic random values generator is unavailable', () => {
      const originalCrypto = globalThis.crypto;
      try {
        // @ts-expect-error Mocking unavailable crypto for failure test
        delete globalThis.crypto;
        assert.throws(() => {
          generateSalt();
        }, /Cryptographic services are unavailable/i);
      } finally {
        globalThis.crypto = originalCrypto;
      }
    });

    test('authService rejects authentication in production when Identity Provider is not configured', async () => {
      process.env.NODE_ENV = 'production';
      process.env.VITE_DEMO_MODE = 'false';

      await assert.rejects(
        async () => {
          await authService.signInWithCredentials(
            'admin@purvaphalguni.com',
            'SanctuaryAdmin2026!',
            'admin'
          );
        },
        /Production authentication rejected.*Identity Provider/i,
        'Must reject production authentication and document required IdP integration'
      );
    });

    test('PracticeStore.authenticateUser fails closed in production without simulating success', async () => {
      process.env.NODE_ENV = 'production';
      process.env.VITE_DEMO_MODE = 'false';

      const res = await PracticeStore.authenticateUser(
        'admin@purvaphalguni.com',
        'SanctuaryAdmin2026!',
        'admin'
      );

      assert.strictEqual(res.success, false, 'Must fail closed in production');
      assert.strictEqual(res.user, undefined);
      assert.match(
        res.error || '',
        /Production authentication service is not configured/i,
        'Error must explicitly document required backend / identity provider integration'
      );
    });
  });

  describe('4. Production Demo Restrictions & Accidental Enablement Safeguards', () => {
    test('isDemoModeEnabled strictly returns false in production environment even if VITE_DEMO_MODE=true', () => {
      process.env.NODE_ENV = 'production';
      process.env.VITE_DEMO_MODE = 'true';

      assert.strictEqual(
        isDemoModeEnabled(),
        false,
        'Demo mode MUST NOT be permitted in production under any circumstance'
      );
    });

    test('isDemoModeEnabled returns false when VITE_DEMO_MODE is not explicitly true', () => {
      process.env.NODE_ENV = 'development';
      process.env.VITE_DEMO_MODE = 'false';
      assert.strictEqual(isDemoModeEnabled(), false);

      delete process.env.VITE_DEMO_MODE;
      assert.strictEqual(isDemoModeEnabled(), false);
    });

    test('isDemoModeEnabled returns true only in non-production when VITE_DEMO_MODE=true', () => {
      process.env.NODE_ENV = 'development';
      process.env.VITE_DEMO_MODE = 'true';
      assert.strictEqual(isDemoModeEnabled(), true);
    });

    test('getDemoCredentials returns null when demo mode is not enabled or in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.VITE_DEMO_MODE = 'true';
      assert.strictEqual(getDemoCredentials(), null);

      process.env.NODE_ENV = 'development';
      process.env.VITE_DEMO_MODE = 'false';
      assert.strictEqual(getDemoCredentials(), null);
    });
  });

  describe('5. Credential Verification & Store Protections in PracticeStore', () => {
    test('authenticates valid scrypt credentials successfully', async () => {
      const res = await PracticeStore.authenticateUser(
        'admin@purvaphalguni.com',
        'SanctuaryAdmin2026!',
        'admin'
      );

      assert.strictEqual(res.success, true);
      assert.ok(res.user);
      assert.strictEqual(res.user.role, 'admin');
      assert.strictEqual(res.user.email, 'admin@purvaphalguni.com');
    });

    test('fails closed when password is incorrect', async () => {
      const res = await PracticeStore.authenticateUser(
        'admin@purvaphalguni.com',
        'IncorrectPassword123!',
        'admin'
      );

      assert.strictEqual(res.success, false);
      assert.strictEqual(res.user, undefined);
      assert.match(res.error || '', /Invalid credentials/i);
    });

    test('rejects insecure fallback passwords ("admin", "admin123", "password")', async () => {
      const insecureAttempts = ['admin', 'admin123', 'password', 'sanctuaryadmin'];

      for (const pwd of insecureAttempts) {
        const res = await PracticeStore.authenticateUser('admin@purvaphalguni.com', pwd, 'admin');
        assert.strictEqual(
          res.success,
          false,
          `Insecure fallback password "${pwd}" MUST be rejected`
        );
      }
    });

    test('fails closed when user account does not exist', async () => {
      const res = await PracticeStore.authenticateUser(
        'nonexistent.user@example.com',
        'SomePassword2026!'
      );

      assert.strictEqual(res.success, false);
      assert.strictEqual(res.user, undefined);
      assert.match(res.error || '', /Invalid credentials/i);
    });

    test('does NOT treat selecting a role as proof of identity (bypass attempt rejected)', async () => {
      const res = await PracticeStore.authenticateUser(
        'attacker@evil.com',
        'AnyPassword!',
        'admin'
      );

      assert.strictEqual(res.success, false);
      assert.strictEqual(res.user, undefined);
    });

    test('fails closed when role does not match expected role', async () => {
      const res = await PracticeStore.authenticateUser(
        'client@purvaphalguni.com',
        'ClientPass2026!',
        'admin'
      );

      assert.strictEqual(res.success, false);
      assert.match(res.error || '', /Invalid credentials for the requested role/i);
    });

    test('fails closed for deactivated or suspended accounts', async () => {
      const res = await PracticeStore.authenticateUser(
        'demo.affiliate3@example.com',
        'Practitioner2026!',
        'affiliate'
      );

      assert.strictEqual(res.success, false);
      assert.match(res.error || '', /deactivated/i);
    });

    test('fails closed on empty credentials', async () => {
      const res1 = await PracticeStore.authenticateUser('', 'SanctuaryAdmin2026!');
      assert.strictEqual(res1.success, false);

      const res2 = await PracticeStore.authenticateUser('admin@purvaphalguni.com', '');
      assert.strictEqual(res2.success, false);
    });

    test('verifyUserPassword fails closed on wrong password and invalid user', async () => {
      const adminUser = PracticeStore.getUsers().find((u) => u.role === 'admin')!;

      const validCheck = await PracticeStore.verifyUserPassword(
        adminUser.id,
        'SanctuaryAdmin2026!'
      );
      assert.strictEqual(validCheck, true);

      const invalidCheck = await PracticeStore.verifyUserPassword(
        adminUser.id,
        'WrongPassword'
      );
      assert.strictEqual(invalidCheck, false);

      const fallbackCheck = await PracticeStore.verifyUserPassword(adminUser.id, 'admin');
      assert.strictEqual(fallbackCheck, false);

      const nonExistent = await PracticeStore.verifyUserPassword('nonexistent-id', 'Pass');
      assert.strictEqual(nonExistent, false);
    });
  });

  describe('6. authService Production Restrictions & Role Bypasses', () => {
    test('signInAsRole throws and fails closed when in production', async () => {
      process.env.NODE_ENV = 'production';
      process.env.VITE_DEMO_MODE = 'true';

      await assert.rejects(
        async () => {
          await authService.signInAsRole('admin');
        },
        /Authentication bypass rejected/i,
        'Direct role sign-in without credentials must be blocked in production'
      );
    });

    test('signInWithCredentials verifies credentials properly in dev demo mode', async () => {
      process.env.NODE_ENV = 'development';
      process.env.VITE_DEMO_MODE = 'true';

      const session = await authService.signInWithCredentials(
        'admin@purvaphalguni.com',
        'SanctuaryAdmin2026!',
        'admin'
      );

      assert.strictEqual(session.isAuthenticated, true);
      assert.strictEqual(session.role, 'admin');
      assert.strictEqual(session.user?.email, 'admin@purvaphalguni.com');
    });

    test('signInWithCredentials fails closed on invalid credentials', async () => {
      process.env.NODE_ENV = 'development';
      process.env.VITE_DEMO_MODE = 'true';

      await assert.rejects(async () => {
        await authService.signInWithCredentials(
          'admin@purvaphalguni.com',
          'WrongPassword123!',
          'admin'
        );
      }, /Invalid credentials/i);
    });

    test('signOut resets active role to public and clears user ID', async () => {
      PracticeStore.setSession('user-admin-demo', 'admin');
      assert.strictEqual(PracticeStore.getActiveRole(), 'admin');
      assert.strictEqual(PracticeStore.getActiveUserId(), 'user-admin-demo');
      assert.ok(PracticeStore.getCurrentUser());

      await authService.signOut();
      assert.strictEqual(PracticeStore.getActiveRole(), 'public');
      assert.strictEqual(PracticeStore.getActiveUserId(), null);
      assert.strictEqual(PracticeStore.getCurrentUser(), undefined);
    });
  });

  describe('7. User Identity Resolution & Session Integrity (Task 3)', () => {
    test('multiple clients with same role remain distinct and isolated', () => {
      // 1. Authenticate as Elena Rostova (user-client-1)
      PracticeStore.setSession('user-client-1', 'client');
      const client1 = PracticeStore.getCurrentUser();
      assert.ok(client1);
      assert.strictEqual(client1.id, 'user-client-1');
      assert.strictEqual(client1.name, 'Elena Rostova');
      assert.strictEqual(client1.email, 'client@purvaphalguni.com');

      // 2. Authenticate as Demo Client 2 (user-client-2)
      PracticeStore.setSession('user-client-2', 'client');
      const client2 = PracticeStore.getCurrentUser();
      assert.ok(client2);
      assert.strictEqual(client2.id, 'user-client-2');
      assert.strictEqual(client2.name, 'Demo Client 2');
      assert.strictEqual(client2.email, 'demo.client2@example.com');

      // 3. Confirm client 1 and client 2 are distinct and did not overwrite each other
      assert.notStrictEqual(client1.id, client2.id);
      assert.notStrictEqual(client1.name, client2.name);
    });

    test('multiple practitioners with same role remain distinct and isolated', () => {
      // 1. Authenticate as Dr. Jyotish Patel (user-affiliate-1)
      PracticeStore.setSession('user-affiliate-1', 'affiliate');
      const practitioner1 = PracticeStore.getCurrentUser();
      assert.ok(practitioner1);
      assert.strictEqual(practitioner1.id, 'user-affiliate-1');
      assert.strictEqual(practitioner1.name, 'Dr. Jyotish Patel');

      // 2. Authenticate as Demo Affiliate 2 (user-affiliate-2)
      PracticeStore.setSession('user-affiliate-2', 'affiliate');
      const practitioner2 = PracticeStore.getCurrentUser();
      assert.ok(practitioner2);
      assert.strictEqual(practitioner2.id, 'user-affiliate-2');
      assert.strictEqual(practitioner2.name, 'Demo Affiliate 2');

      // 3. Ensure practitioner 2 does not receive practitioner 1's profile
      assert.notStrictEqual(practitioner1.id, practitioner2.id);
      assert.notStrictEqual(practitioner1.name, practitioner2.name);
    });

    test('missing user ID in session fails closed and never silently selects another user', () => {
      // Set an invalid/non-existent user ID
      PracticeStore.setActiveUserId('user-ghost-404-nonexistent');
      PracticeStore.setActiveRole('client');

      // Must NOT fallback to users[0], users[3], or the first client
      const resolvedUser = PracticeStore.getCurrentUser();
      assert.strictEqual(
        resolvedUser,
        undefined,
        'Missing user ID must resolve to undefined, never silently fallback to another user'
      );
    });

    test('inconsistent session (role mismatch) fails closed without cross-role exposure', () => {
      // Set active user as an admin, but set active role as 'client'
      PracticeStore.setActiveUserId('user-admin-demo');
      PracticeStore.setActiveRole('client');

      // Must NOT return user-admin-demo as a client, nor fallback to another client
      const resolvedUser = PracticeStore.getCurrentUser();
      assert.strictEqual(
        resolvedUser,
        undefined,
        'Role mismatch between session and user profile must fail closed'
      );
    });

    test('role changes must not establish authentication', () => {
      // Ensure starting from clean unauthenticated state
      PracticeStore.clearSession();
      assert.strictEqual(PracticeStore.getActiveUserId(), null);
      assert.strictEqual(PracticeStore.getActiveRole(), 'public');
      assert.strictEqual(PracticeStore.getCurrentUser(), undefined);

      // Switching role to 'admin' (e.g. navigation or preview)
      PracticeStore.setActiveRole('admin');
      assert.strictEqual(PracticeStore.getActiveRole(), 'admin');
      assert.strictEqual(
        PracticeStore.getActiveUserId(),
        null,
        'Changing role must NOT assign an admin user ID'
      );
      assert.strictEqual(
        PracticeStore.getCurrentUser(),
        undefined,
        'Changing role must NOT authenticate the user'
      );

      // Authenticate as a client
      PracticeStore.setSession('user-client-1', 'client');
      assert.strictEqual(PracticeStore.getActiveUserId(), 'user-client-1');
      assert.ok(PracticeStore.getCurrentUser());

      // Attempt to change role to 'admin' while logged in as client
      PracticeStore.setActiveRole('admin');
      assert.strictEqual(
        PracticeStore.getActiveUserId(),
        null,
        'Switching role to a different role must clear active user ID to prevent privilege escalation'
      );
      assert.strictEqual(
        PracticeStore.getCurrentUser(),
        undefined,
        'Client cannot become authenticated as admin merely via role switch'
      );
    });

    test('account status checks enforce restriction on deactivated and suspended users', () => {
      // user-affiliate-3 is deactivated in demo data
      assert.throws(() => {
        PracticeStore.setSession('user-affiliate-3', 'affiliate');
      }, /deactivated/i);

      // If activeUserId were somehow set to a deactivated user
      PracticeStore.setActiveUserId('user-affiliate-3');
      PracticeStore.setActiveRole('affiliate');
      assert.strictEqual(
        PracticeStore.getCurrentUser(),
        undefined,
        'Deactivated account must fail closed and never resolve as active user'
      );

      // Temporarily mark client as suspended
      const users = PracticeStore.getUsers();
      const clientIdx = users.findIndex((u) => u.id === 'user-client-1');
      users[clientIdx] = { ...users[clientIdx], activeStatus: 'suspended' };
      PracticeStore.saveUsers(users);

      PracticeStore.setActiveUserId('user-client-1');
      PracticeStore.setActiveRole('client');
      assert.strictEqual(
        PracticeStore.getCurrentUser(),
        undefined,
        'Suspended account must fail closed'
      );
    });

    test('clearSession completely clears active user and resets role to public', () => {
      PracticeStore.setSession('user-admin-demo', 'admin');
      assert.ok(PracticeStore.getCurrentUser());

      PracticeStore.clearSession();
      assert.strictEqual(PracticeStore.getActiveUserId(), null);
      assert.strictEqual(PracticeStore.getActiveRole(), 'public');
      assert.strictEqual(PracticeStore.getCurrentUser(), undefined);
    });
  });
});
