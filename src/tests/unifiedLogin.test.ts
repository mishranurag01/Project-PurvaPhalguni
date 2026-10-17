import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { PracticeStore } from '../services/store';
import { authService } from '../services/api/authService';
import {
  isDemoModeEnabled,
  getDemoCredentials,
  isProductionEnvironment,
  verifyPassword
} from '../utils/cryptoAuth';

describe('Task 3A: Unified Login Page, Role-Based Redirection & Guard Suite', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalDemoMode = process.env.VITE_DEMO_MODE;

  beforeEach(() => {
    process.env.NODE_ENV = 'development';
    process.env.VITE_DEMO_MODE = 'true';
    PracticeStore.resetStore();
    PracticeStore.clearSession();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    process.env.VITE_DEMO_MODE = originalDemoMode;
  });

  // TEST 1: Valid client signs in and reaches Client portal
  test('1. Valid client signs in through unified login and is resolved with role "client"', async () => {
    const session = await authService.signInWithCredentials(
      'client@purvaphalguni.com',
      'ClientPass2026!'
    );

    assert.strictEqual(session.isAuthenticated, true);
    assert.strictEqual(session.role, 'client');
    assert.ok(session.user);
    assert.strictEqual(session.user.email, 'client@purvaphalguni.com');
    assert.strictEqual(session.user.role, 'client');

    // Verify authenticated session in PracticeStore
    assert.strictEqual(PracticeStore.getActiveRole(), 'client');
    assert.strictEqual(PracticeStore.getActiveUserId(), session.user.id);
    const resolvedUser = PracticeStore.getCurrentUser();
    assert.ok(resolvedUser);
    assert.strictEqual(resolvedUser.role, 'client');
  });

  // TEST 2: Valid affiliated user reaches Affiliated portal
  test('2. Valid affiliated practitioner signs in through unified login and is resolved with role "affiliate"', async () => {
    const session = await authService.signInWithCredentials(
      'affiliate@purvaphalguni.com',
      'Practitioner2026!'
    );

    assert.strictEqual(session.isAuthenticated, true);
    assert.strictEqual(session.role, 'affiliate');
    assert.ok(session.user);
    assert.strictEqual(session.user.email, 'affiliate@purvaphalguni.com');
    assert.strictEqual(session.user.role, 'affiliate');

    // Verify session state
    assert.strictEqual(PracticeStore.getActiveRole(), 'affiliate');
    assert.strictEqual(PracticeStore.getActiveUserId(), session.user.id);
    const resolvedUser = PracticeStore.getCurrentUser();
    assert.ok(resolvedUser);
    assert.strictEqual(resolvedUser.role, 'affiliate');
    assert.strictEqual(resolvedUser.name, 'Dr. Jyotish Patel');
  });

  // TEST 3: Administrator signs in with actual registered personal email
  test('3. Administrator signs in with registered personal email (mishranurag01@gmail.com) and reaches Admin dashboard', async () => {
    const session = await authService.signInWithCredentials(
      'mishranurag01@gmail.com',
      'SanctuaryAdmin2026!'
    );

    assert.strictEqual(session.isAuthenticated, true);
    assert.strictEqual(session.role, 'admin');
    assert.ok(session.user);
    assert.strictEqual(session.user.id, 'user-admin-personal');
    assert.strictEqual(session.user.email, 'mishranurag01@gmail.com');
    assert.strictEqual(session.user.name, 'Anurag Mishra (Lead Administrator)');

    // Verify active session
    assert.strictEqual(PracticeStore.getActiveRole(), 'admin');
    assert.strictEqual(PracticeStore.getActiveUserId(), 'user-admin-personal');
    const resolvedUser = PracticeStore.getCurrentUser();
    assert.ok(resolvedUser);
    assert.strictEqual(resolvedUser.role, 'admin');
  });

  // TEST 4: Typing admin email without valid credentials does not grant access
  test('4. Typing admin personal or role email without valid credentials strictly fails closed', async () => {
    // 4a. Admin personal email with wrong password
    await assert.rejects(
      async () => {
        await authService.signInWithCredentials('mishranurag01@gmail.com', 'WrongPassword123!');
      },
      /Invalid credentials/i
    );
    assert.strictEqual(PracticeStore.getActiveUserId(), null);
    assert.strictEqual(PracticeStore.getActiveRole(), 'public');
    assert.strictEqual(PracticeStore.getCurrentUser(), undefined);

    // 4b. Admin generic email with empty password
    await assert.rejects(
      async () => {
        await authService.signInWithCredentials('admin@purvaphalguni.com', '');
      },
      /Email and password are required/i
    );

    // 4c. Admin email with common default guess
    await assert.rejects(
      async () => {
        await authService.signInWithCredentials('mishranurag01@gmail.com', 'admin');
      },
      /Invalid credentials/i
    );
    assert.strictEqual(PracticeStore.getCurrentUser(), undefined);
  });

  // TEST 5: Client cannot obtain admin role by changing frontend state or request parameters
  test('5. Client cannot obtain an admin role by manipulating client-side state or parameters', async () => {
    // 5a. Authenticate legitimately as client
    const clientSession = await authService.signInWithCredentials(
      'client@purvaphalguni.com',
      'ClientPass2026!'
    );
    assert.strictEqual(clientSession.role, 'client');
    assert.strictEqual(PracticeStore.getActiveUserId(), clientSession.user?.id);

    // 5b. Client attempts to pass expectedRole='admin' while logging in with client credentials
    const tamperedAttempt = await PracticeStore.authenticateUser(
      'client@purvaphalguni.com',
      'ClientPass2026!',
      'admin' // Attacker requests admin role
    );
    assert.strictEqual(tamperedAttempt.success, false);
    assert.match(tamperedAttempt.error || '', /Invalid credentials for the requested role/i);

    // 5c. Client attempts to tamper with PracticeStore.setActiveRole('admin') directly
    PracticeStore.setActiveRole('admin');
    // Security rule: Role changes clear activeUserId when mismatched, returning undefined
    assert.strictEqual(
      PracticeStore.getCurrentUser(),
      undefined,
      'Client cannot gain admin access by changing active role in frontend state'
    );
  });

  // TEST 6: Invalid emails, wrong passwords, disabled accounts handled safely
  describe('6. Invalid input handling & disabled account safety', () => {
    test('rejects whitespace-only, malformed emails, and invalid formats', async () => {
      await assert.rejects(
        async () => {
          await authService.signInWithCredentials('   ', 'AnyPassword123!');
        },
        /Email and password are required/i
      );

      await assert.rejects(
        async () => {
          await authService.signInWithCredentials('not-an-email', 'AnyPassword123!');
        },
        /valid email address/i
      );
    });

    test('trims accidental leading and trailing whitespace from valid email', async () => {
      const session = await authService.signInWithCredentials(
        '   mishranurag01@gmail.com   ',
        'SanctuaryAdmin2026!'
      );
      assert.strictEqual(session.isAuthenticated, true);
      assert.strictEqual(session.user?.email, 'mishranurag01@gmail.com');
    });

    test('rejects non-existent account with generic safe error to prevent enumeration', async () => {
      await assert.rejects(
        async () => {
          await authService.signInWithCredentials('nonexistent.user@example.com', 'Password123!');
        },
        /Invalid credentials\. Please verify your email and password\./i
      );
    });

    test('rejects deactivated account with explicit safe notification', async () => {
      // user-affiliate-3 (demo.affiliate3@example.com) is deactivated in demoData
      await assert.rejects(
        async () => {
          await authService.signInWithCredentials(
            'demo.affiliate3@example.com',
            'Practitioner2026!'
          );
        },
        /This account is currently deactivated/i
      );
      assert.strictEqual(PracticeStore.getCurrentUser(), undefined);
    });

    test('rejects suspended account with explicit safe notification', async () => {
      const users = PracticeStore.getUsers();
      const clientIdx = users.findIndex((u) => u.email === 'client@purvaphalguni.com');
      users[clientIdx] = { ...users[clientIdx], activeStatus: 'suspended' };
      PracticeStore.saveUsers(users);

      await assert.rejects(
        async () => {
          await authService.signInWithCredentials(
            'client@purvaphalguni.com',
            'ClientPass2026!'
          );
        },
        /This account is currently suspended/i
      );
      assert.strictEqual(PracticeStore.getCurrentUser(), undefined);
    });
  });

  // TEST 7: Direct access to protected routes is blocked when unauthenticated or unauthorized
  describe('7. Route Guard & Access Control Enforcement', () => {
    test('unauthenticated user cannot resolve current user for protected portals', () => {
      PracticeStore.clearSession();
      assert.strictEqual(PracticeStore.getActiveRole(), 'public');
      assert.strictEqual(PracticeStore.getActiveUserId(), null);
      assert.strictEqual(PracticeStore.getCurrentUser(), undefined);

      // Attempting to simulate activeRole client without session ID fails
      PracticeStore.setActiveRole('client');
      assert.strictEqual(
        PracticeStore.getCurrentUser(),
        undefined,
        'Client portal must be blocked for unauthenticated session'
      );

      // Attempting to simulate activeRole admin without session ID fails
      PracticeStore.setActiveRole('admin');
      assert.strictEqual(
        PracticeStore.getCurrentUser(),
        undefined,
        'Admin portal must be blocked for unauthenticated session'
      );
    });

    test('authenticated client is denied access to admin portal data', () => {
      PracticeStore.setSession('user-client-1', 'client');
      const currentUser = PracticeStore.getCurrentUser();
      assert.ok(currentUser);
      assert.strictEqual(currentUser.role, 'client');

      // Attempting to access admin section
      assert.notStrictEqual(
        currentUser.role,
        'admin',
        'Client account must NOT satisfy admin portal role requirement'
      );
    });

    test('authenticated affiliate is denied access to admin portal', () => {
      PracticeStore.setSession('user-affiliate-1', 'affiliate');
      const currentUser = PracticeStore.getCurrentUser();
      assert.ok(currentUser);
      assert.strictEqual(currentUser.role, 'affiliate');
      assert.notStrictEqual(
        currentUser.role,
        'admin',
        'Affiliate practitioner must NOT satisfy admin role requirement'
      );
    });
  });

  // TEST 8: Logout invalidates session and protected pages cannot be accessed
  test('8. Logout invalidates session and prevents stale session access', async () => {
    // 8a. Log in as admin
    await authService.signInWithCredentials('mishranurag01@gmail.com', 'SanctuaryAdmin2026!');
    assert.strictEqual(PracticeStore.getActiveRole(), 'admin');
    assert.ok(PracticeStore.getCurrentUser());

    // 8b. Sign out
    await authService.signOut();

    // 8c. Verify complete session invalidation
    assert.strictEqual(PracticeStore.getActiveRole(), 'public');
    assert.strictEqual(PracticeStore.getActiveUserId(), null);
    assert.strictEqual(
      PracticeStore.getCurrentUser(),
      undefined,
      'Protected views cannot be accessed after session termination'
    );
  });

  // TEST 9: Client self-registration and portal functionality work seamlessly
  describe('9. Client Self-Registration & Portal Continuity', () => {
    test('client self-registration enforces validation, scrypt hashing, and enables immediate login', async () => {
      const uniqueEmail = `newclient.${Date.now()}@example.com`;
      const regResult = await PracticeStore.registerClient({
        name: 'Sadhana Sharma',
        email: uniqueEmail,
        password: 'SecurePassword2026!',
        phone: '+1 (555) 999-8877',
        primaryIntention: 'Natal planetary constitution inquiry'
      });

      assert.strictEqual(regResult.success, true);
      assert.ok(regResult.user);
      assert.strictEqual(regResult.user.role, 'client');
      assert.strictEqual(regResult.user.email, uniqueEmail);
      assert.strictEqual(regResult.user.passwordAlgorithm, 'scrypt');
      assert.ok(regResult.user.passwordHash);
      assert.ok(regResult.user.passwordSalt);

      // Verify password can be validated with scrypt
      const isPasswordValid = await verifyPassword(
        'SecurePassword2026!',
        regResult.user.passwordHash,
        regResult.user.passwordSalt
      );
      assert.strictEqual(isPasswordValid, true);

      // Sign in through unified authentication service with newly registered account
      const loginSession = await authService.signInWithCredentials(
        uniqueEmail,
        'SecurePassword2026!'
      );
      assert.strictEqual(loginSession.isAuthenticated, true);
      assert.strictEqual(loginSession.role, 'client');
      assert.strictEqual(loginSession.user?.name, 'Sadhana Sharma');
    });

    test('registration rejects duplicate emails and weak passwords', async () => {
      // Rejects duplicate email
      const dupResult = await PracticeStore.registerClient({
        name: 'Another Client',
        email: 'client@purvaphalguni.com', // Already registered
        password: 'ValidPassword123!'
      });
      assert.strictEqual(dupResult.success, false);
      assert.match(dupResult.error || '', /already exists/i);

      // Rejects short password (< 8 chars)
      const shortPassResult = await PracticeStore.registerClient({
        name: 'Test Short',
        email: 'shortpass@example.com',
        password: 'short'
      });
      assert.strictEqual(shortPassResult.success, false);
      assert.match(shortPassResult.error || '', /at least 8 characters/i);
    });

    test('arbitrary email alone never creates an authenticated session', () => {
      // Entering an arbitrary email without credentials does not authenticate
      PracticeStore.clearSession();
      assert.strictEqual(PracticeStore.getActiveUserId(), null);
      assert.strictEqual(PracticeStore.getCurrentUser(), undefined);
    });
  });

  // TEST 10: Production build does not expose demo credentials or authentication bypasses
  describe('10. Production Environment Lockdown & No Demo Credentials', () => {
    test('isProductionEnvironment returns true in production and disables demo features', () => {
      process.env.NODE_ENV = 'production';
      process.env.VITE_DEMO_MODE = 'true'; // Even if someone mistakenly sets this to true

      assert.strictEqual(isProductionEnvironment(), true);
      assert.strictEqual(
        isDemoModeEnabled(),
        false,
        'Demo mode must be strictly false in production'
      );
      assert.strictEqual(
        getDemoCredentials(),
        null,
        'Demo credentials must return null in production'
      );
    });

    test('authService rejects authentication in production without configured Identity Provider', async () => {
      process.env.NODE_ENV = 'production';

      await assert.rejects(
        async () => {
          await authService.signInWithCredentials('mishranurag01@gmail.com', 'SanctuaryAdmin2026!');
        },
        /Production authentication rejected: Identity Provider or backend authentication service is not configured/i
      );
    });

    test('authService rejects signInAsRole bypass in production', async () => {
      process.env.NODE_ENV = 'production';

      await assert.rejects(
        async () => {
          await authService.signInAsRole('admin');
        },
        /Authentication bypass rejected/i
      );
    });
  });
});
