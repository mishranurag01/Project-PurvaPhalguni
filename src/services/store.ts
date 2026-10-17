import {
  UserProfile,
  ServicePlan,
  BookingSession,
  ReadingSummary,
  PractitionerNote,
  DirectMessage,
  ReviewItem,
  KnowledgeNote,
  KnowledgeDocument,
  ResearchParticipant,
  ResearchStudy,
  AuditLogEntry,
  WebsiteSettings,
  UserRole,
  PartnerPayout,
  AdminBulletin,
  PractitionerRoleTier,
  PractitionerPermissions,
  ROLE_PERMISSION_DEFAULTS
} from '../types/practice';

import {
  DEMO_SETTINGS,
  DEMO_USERS,
  DEMO_SERVICES,
  DEMO_BOOKINGS,
  DEMO_SUMMARIES,
  DEMO_NOTES,
  DEMO_MESSAGES,
  DEMO_REVIEWS,
  DEMO_KNOWLEDGE_NOTES,
  DEMO_DOCUMENTS,
  DEMO_RESEARCH_STUDY,
  DEMO_RESEARCH_PARTICIPANTS,
  DEMO_AUDIT_LOGS,
  DEMO_BULLETINS,
  DEMO_PAYOUTS
} from './demoData';
import {
  hashPassword,
  verifyPassword,
  verifyAndMigratePassword,
  DEFAULT_CREDENTIALS,
  isDemoModeEnabled,
  isProductionEnvironment
} from '../utils/cryptoAuth';

// Re-export aliases for backwards compatibility
export const INITIAL_SETTINGS = DEMO_SETTINGS;
export const INITIAL_USERS = DEMO_USERS;
export const INITIAL_SERVICES = DEMO_SERVICES;
export const INITIAL_BOOKINGS = DEMO_BOOKINGS;
export const INITIAL_SUMMARIES = DEMO_SUMMARIES;
export const INITIAL_NOTES = DEMO_NOTES;
export const INITIAL_MESSAGES = DEMO_MESSAGES;
export const INITIAL_REVIEWS = DEMO_REVIEWS;
export const INITIAL_KNOWLEDGE_NOTES = DEMO_KNOWLEDGE_NOTES;
export const INITIAL_DOCUMENTS = DEMO_DOCUMENTS;
export const INITIAL_RESEARCH_STUDY = DEMO_RESEARCH_STUDY;
export const INITIAL_RESEARCH_PARTICIPANTS = DEMO_RESEARCH_PARTICIPANTS;
export const INITIAL_AUDIT_LOGS = DEMO_AUDIT_LOGS;
export const INITIAL_BULLETINS = DEMO_BULLETINS;
export const INITIAL_PAYOUTS = DEMO_PAYOUTS;

export type StoreEventType =
  | 'SERVICES_UPDATED'
  | 'SETTINGS_UPDATED'
  | 'USERS_UPDATED'
  | 'BOOKINGS_UPDATED'
  | 'SUMMARIES_UPDATED'
  | 'MESSAGES_UPDATED'
  | 'BULLETINS_UPDATED'
  | 'PAYOUTS_UPDATED'
  | 'AFFILIATE_STATUS_CHANGED'
  | 'AFFILIATE_PERMISSIONS_UPDATED'
  | 'SESSION_UPDATED'
  | 'STORE_RESET'
  | '*';

export interface StoreSyncEvent<T = any> {
  type: StoreEventType | string;
  payload?: T;
  timestamp: number;
}

export type StoreEventListener<T = any> = (event: StoreSyncEvent<T>) => void;

/**
 * State Store Helper (Prototype Mode)
 *
 * IMPORTANT PRIVACY ARCHITECTURE:
 * To protect client privacy during prototype evaluation, NO birth details,
 * private notes, messages, consent records, or client profiles are persisted
 * to browser localStorage.
 *
 * All state is held in temporary in-memory session structures that reset on refresh.
 */
export class PracticeStore {
  // Temporary in-memory dictionary
  private static memoryStore: Record<string, any> = {};

  static resetStore(): void {
    this.memoryStore = {};
    this.notifySync('STORE_RESET', {});
  }

  private static load<T>(key: string, defaultVal: T): T {
    if (this.memoryStore[key] === undefined) {
      // Clone default value to prevent direct mutation of static demo datasets
      this.memoryStore[key] = JSON.parse(JSON.stringify(defaultVal));
    }
    return this.memoryStore[key];
  }

  private static save<T>(key: string, val: T): void {
    this.memoryStore[key] = val;
  }

  // Getters & Setters
  static getSettings(): WebsiteSettings {
    const s = this.load('settings', DEMO_SETTINGS);
    if (!s.brandName || s.brandName !== 'PURVAPHALGUNI') {
      s.brandName = 'PURVAPHALGUNI';
    }
    if (!s.tagline || s.tagline.includes('insight.')) {
      s.tagline = 'Medical Astrology & Cartomancy';
    }
    return s;
  }

  static saveSettings(settings: WebsiteSettings): void {
    this.save('settings', settings);
    this.logAction(
      'user-admin-demo',
      'Demo Admin',
      'admin',
      'SETTINGS_CHANGED',
      'Updated website content, disclaimer, or brand name (session in-memory).'
    );
    this.notifySync('SETTINGS_UPDATED', settings);
  }

  static getUsers(): UserProfile[] {
    return this.load('users', DEMO_USERS);
  }

  static saveUsers(users: UserProfile[]): void {
    this.save('users', users);
    this.notifySync('USERS_UPDATED', users);
  }

  /**
   * Cryptographic Authentication with scrypt (RFC 7914) & Transparent Migration.
   * Fails closed on missing/invalid credentials, suspended accounts, or cryptographic failure.
   * In production builds, returns explicit error if backend IdP is not configured.
   * Transparently migrates valid legacy prototype hashes to scrypt.
   */
  static async authenticateUser(
    email: string,
    passwordCandidate: string,
    expectedRole?: UserRole
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanPassword = (passwordCandidate || '').trim();

    if (!cleanEmail || !cleanPassword) {
      return { success: false, error: 'Email and password are required.' };
    }

    // Production fail-closed restriction:
    // In production, do not simulate successful authentication or evaluate against client bundle.
    if (isProductionEnvironment()) {
      return {
        success: false,
        error:
          'Production authentication service is not configured. Production deployment requires integration with a trusted identity provider (such as Firebase Authentication or OpenID Connect / OAuth) or a secure backend authentication endpoint. Simulating client-side authentication is prohibited.'
      };
    }

    const users = this.getUsers();

    // 1. Find user by exact email
    let user = users.find((u) => u.email.toLowerCase().trim() === cleanEmail);

    // 2. Demo shortcut matching: strictly restricted to demo/dev configuration
    if (!user && isDemoModeEnabled()) {
      if (cleanEmail === 'admin') {
        user = users.find((u) => u.role === 'admin');
      } else if (cleanEmail === 'affiliate') {
        user = users.find((u) => u.role === 'affiliate' && u.activeStatus !== 'deactivated');
      } else if (cleanEmail === 'client') {
        user = users.find((u) => u.role === 'client');
      }
    }

    if (!user) {
      return { success: false, error: 'Invalid credentials. Please verify your email and password.' };
    }

    if (expectedRole && user.role !== expectedRole) {
      return {
        success: false,
        error: 'Invalid credentials for the requested role.'
      };
    }

    if (user.activeStatus === 'deactivated' || user.activeStatus === 'suspended') {
      return {
        success: false,
        error: `This account is currently ${user.activeStatus}. Please contact the practice director or administration.`
      };
    }

    // 3. Cryptographic password verification with transparent scrypt migration
    if (user.passwordHash && user.passwordSalt) {
      try {
        const migrationResult = await verifyAndMigratePassword(cleanPassword, user);
        if (migrationResult.isValid) {
          // If the account was verified with legacy hash, persist the upgraded scrypt credentials
          if (migrationResult.requiresMigration && migrationResult.migratedHash && migrationResult.migratedSalt) {
            const userIdx = users.findIndex((u) => u.id === user!.id);
            if (userIdx !== -1) {
              users[userIdx] = {
                ...users[userIdx],
                passwordHash: migrationResult.migratedHash,
                passwordSalt: migrationResult.migratedSalt,
                passwordAlgorithm: 'scrypt',
                migratedAt: new Date().toISOString()
              };
              this.saveUsers(users);
              user = users[userIdx];
              this.logAction(
                user.id,
                user.name,
                user.role,
                'AUTH_MIGRATED',
                'Account password hash transparently upgraded to secure memory-hard scrypt (RFC 7914).'
              );
            }
          }
          return { success: true, user };
        }
      } catch {
        return { success: false, error: 'Cryptographic authentication error occurred.' };
      }
    }

    // Fail closed: Accounts without valid password hash cannot authenticate.
    // Insecure fallback passwords are never accepted.
    return {
      success: false,
      error: 'Invalid credentials. Please verify your email and password.'
    };
  }

  /**
   * Update User Password with fresh cryptographic salt and scrypt hash
   */
  static async updateUserPassword(userId: string, newPasswordPlain: string): Promise<boolean> {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) return false;

    const { hash, salt } = await hashPassword(newPasswordPlain);
    users[idx] = {
      ...users[idx],
      passwordHash: hash,
      passwordSalt: salt,
      passwordAlgorithm: 'scrypt',
      passwordLastChanged: new Date().toISOString()
    };

    this.saveUsers(users);
    this.logAction(
      userId,
      users[idx].name,
      users[idx].role,
      'PASSWORD_CHANGED',
      `Password updated with scrypt (RFC 7914) memory-hard cryptographic digest.`
    );
    return true;
  }

  /**
   * Secure Client Self-Registration with scrypt (RFC 7914) Password Hashing.
   * Validates email syntax, enforces minimum password strength, and persists credentials.
   */
  static async registerClient(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    birthDate?: string;
    birthTime?: string;
    birthCity?: string;
    primaryIntention?: string;
  }): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    const cleanName = (data.name || '').trim();
    const cleanEmail = (data.email || '').toLowerCase().trim();
    const cleanPassword = (data.password || '').trim();

    if (!cleanName) {
      return { success: false, error: 'Full name is required.' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!cleanPassword || cleanPassword.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    const users = this.getUsers();
    const existing = users.find((u) => u.email.toLowerCase().trim() === cleanEmail);
    if (existing) {
      return { success: false, error: 'An account with this email address already exists. Please sign in.' };
    }

    try {
      const { hash, salt } = await hashPassword(cleanPassword);
      const newClient: UserProfile = {
        id: `user-client-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        role: 'client',
        phone: data.phone?.trim() || '+1 (555) 010-0099',
        birthDate: data.birthDate || '2000-01-01',
        birthTime: data.birthTime || '12:00',
        birthCity: data.birthCity || 'Sanctuary City',
        primaryIntention: data.primaryIntention?.trim() || 'Holistic astrological vitality consultation',
        activeStatus: 'active',
        consentGiven: true,
        consentDate: new Date().toISOString().split('T')[0],
        consentVersion: 'v2.4',
        consentWithdrawn: false,
        passwordHash: hash,
        passwordSalt: salt,
        passwordAlgorithm: 'scrypt',
        passwordLastChanged: new Date().toISOString()
      };

      const updated = [...users, newClient];
      this.saveUsers(updated);
      this.logAction(
        newClient.id,
        newClient.name,
        'client',
        'REGISTER',
        `New client self-registered: ${newClient.email}.`
      );
      this.notifySync('USERS_UPDATED', updated);
      return { success: true, user: newClient };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Could not register client account.' };
    }
  }

  /**
   * Verify an existing password before allowing password change.
   * Fails closed on any error or missing cryptographic hash.
   */
  static async verifyUserPassword(userId: string, candidatePassword: string): Promise<boolean> {
    const user = this.getUsers().find((u) => u.id === userId);
    if (!user) return false;

    const cleanCandidate = (candidatePassword || '').trim();
    if (!cleanCandidate) return false;

    // Check custom password hash with scrypt verification
    if (user.passwordHash && user.passwordSalt) {
      try {
        const res = await verifyAndMigratePassword(cleanCandidate, user);
        return res.isValid;
      } catch {
        return false;
      }
    }

    // Fail closed: Users without password hash cannot authenticate
    return false;
  }

  static getServices(): ServicePlan[] {
    return this.load('services', DEMO_SERVICES);
  }

  static saveServices(services: ServicePlan[]): void {
    this.save('services', services);
    this.logAction(
      'user-admin-demo',
      'Demo Admin',
      'admin',
      'SERVICES_CHANGED',
      `Updated ${services.length} services configuration (pricing/durations).`
    );
    this.notifySync('SERVICES_UPDATED', {
      services,
      updatedAt: new Date().toISOString()
    });
  }

  static updateService(serviceId: string, updates: Partial<ServicePlan>): ServicePlan | null {
    const services = this.getServices();
    const idx = services.findIndex((s) => s.id === serviceId);
    if (idx === -1) return null;

    const existing = services[idx];
    const updated: ServicePlan = {
      ...existing,
      ...updates
    };

    // Keep duration string & durationMinutes synchronized
    if (updates.durationMinutes !== undefined && !updates.duration) {
      updated.duration = `${updates.durationMinutes} min`;
    } else if (updates.duration && updates.durationMinutes === undefined) {
      const parsed = parseInt(updates.duration.replace(/\D/g, ''), 10);
      if (!isNaN(parsed) && parsed > 0) {
        updated.durationMinutes = parsed;
      }
    }

    services[idx] = updated;
    this.save('services', services);

    this.logAction(
      'user-admin-demo',
      'Demo Admin',
      'admin',
      'SERVICES_CHANGED',
      `Updated service "${updated.name}" (${updated.code}): Price $${updated.price}, Duration ${updated.duration}.`
    );

    this.notifySync('SERVICES_UPDATED', {
      services,
      updatedService: updated,
      serviceId,
      updatedAt: new Date().toISOString()
    });

    return updated;
  }

  static getBookings(): BookingSession[] {
    return this.load('bookings', DEMO_BOOKINGS);
  }

  static saveBookings(bookings: BookingSession[]): void {
    this.save('bookings', bookings);
    this.notifySync('BOOKINGS_UPDATED', bookings);
  }

  static getSummaries(): ReadingSummary[] {
    return this.load('summaries', DEMO_SUMMARIES);
  }

  static saveSummaries(summaries: ReadingSummary[]): void {
    this.save('summaries', summaries);
    this.notifySync('SUMMARIES_UPDATED', summaries);
  }

  static getNotes(): PractitionerNote[] {
    return this.load('notes', DEMO_NOTES);
  }

  static saveNotes(notes: PractitionerNote[]): void {
    this.save('notes', notes);
  }

  static getMessages(): DirectMessage[] {
    return this.load('messages', DEMO_MESSAGES);
  }

  static saveMessages(messages: DirectMessage[]): void {
    this.save('messages', messages);
  }

  static getReviews(): ReviewItem[] {
    return this.load('reviews', DEMO_REVIEWS);
  }

  static saveReviews(reviews: ReviewItem[]): void {
    this.save('reviews', reviews);
  }

  static getKnowledgeNotes(): KnowledgeNote[] {
    return this.load('knowledge_notes', DEMO_KNOWLEDGE_NOTES);
  }

  static saveKnowledgeNotes(notes: KnowledgeNote[]): void {
    this.save('knowledge_notes', notes);
  }

  static getDocuments(): KnowledgeDocument[] {
    return this.load('documents', DEMO_DOCUMENTS);
  }

  static saveDocuments(docs: KnowledgeDocument[]): void {
    this.save('documents', docs);
  }

  static getResearchStudy(): ResearchStudy {
    return this.load('research_study', DEMO_RESEARCH_STUDY);
  }

  static getResearchParticipants(): ResearchParticipant[] {
    return this.load('research_participants', DEMO_RESEARCH_PARTICIPANTS);
  }

  static saveResearchParticipants(participants: ResearchParticipant[]): void {
    this.save('research_participants', participants);
  }

  static getAuditLogs(): AuditLogEntry[] {
    return this.load('audit_logs', DEMO_AUDIT_LOGS);
  }

  static logAction(
    actorId: string,
    actorName: string,
    actorRole: UserRole,
    action: AuditLogEntry['action'],
    details: string,
    isSensitive = false
  ): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      actorId,
      actorName,
      actorRole,
      action,
      details,
      ipAddress: '127.0.0.1 (Local Demo)',
      isSensitive
    };
    logs.unshift(newLog);
    this.save('audit_logs', logs.slice(0, 150));
  }

  // Bulletins & Practice Announcements (Live Sync to Practitioners)
  static getBulletins(): AdminBulletin[] {
    return this.load('bulletins', DEMO_BULLETINS);
  }

  static saveBulletins(bulletins: AdminBulletin[]): void {
    this.save('bulletins', bulletins);
    this.notifySync('BULLETINS_UPDATED', bulletins);
  }

  static addBulletin(bulletin: Omit<AdminBulletin, 'id' | 'createdAt' | 'acknowledgedBy'>): AdminBulletin {
    const bulletins = this.getBulletins();
    const newBulletin: AdminBulletin = {
      ...bulletin,
      id: `bulletin-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      acknowledgedBy: []
    };
    const updated = [newBulletin, ...bulletins];
    this.save('bulletins', updated);
    this.logAction(
      'user-admin-demo',
      'Demo Admin',
      'admin',
      'BULLETIN_PUBLISHED',
      `Published broadcast announcement: "${newBulletin.title}"`
    );
    this.notifySync('BULLETIN_ADDED', newBulletin);
    return newBulletin;
  }

  static acknowledgeBulletin(bulletinId: string, affiliateId: string): void {
    const bulletins = this.getBulletins();
    const updated = bulletins.map((b) => {
      if (b.id === bulletinId && !b.acknowledgedBy.includes(affiliateId)) {
        return { ...b, acknowledgedBy: [...b.acknowledgedBy, affiliateId] };
      }
      return b;
    });
    this.save('bulletins', updated);
    this.notifySync('BULLETIN_ACKNOWLEDGED', { bulletinId, affiliateId });
  }

  // Partner Payouts & Honoraria Ledger
  static getPayouts(): PartnerPayout[] {
    return this.load('payouts', DEMO_PAYOUTS);
  }

  static savePayouts(payouts: PartnerPayout[]): void {
    this.save('payouts', payouts);
    this.notifySync('PAYOUTS_UPDATED', payouts);
  }

  static sendPayout(payoutData: Omit<PartnerPayout, 'id' | 'createdAt' | 'status'>): PartnerPayout {
    const payouts = this.getPayouts();
    const newPayout: PartnerPayout = {
      ...payoutData,
      id: `payout-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      status: 'completed'
    };
    const updated = [newPayout, ...payouts];
    this.save('payouts', updated);

    // Automatically post a notification bulletin to the affiliate
    this.addBulletin({
      title: `Honoraria Recorded: $${newPayout.amount.toLocaleString()} USD`,
      content: `Disbursement record of $${newPayout.amount} USD via ${newPayout.method.replace('_', ' ').toUpperCase()} (Ref: ${newPayout.referenceId}) has been logged for ${newPayout.affiliateName}.`,
      priority: 'payout',
      targetAffiliateId: newPayout.affiliateId,
      authorName: 'Demo Admin'
    });

    this.logAction(
      'user-admin-demo',
      'Demo Admin',
      'admin',
      'PAYOUT_DISBURSED',
      `Recorded disbursement of $${newPayout.amount} USD to ${newPayout.affiliateName} (Ref: ${newPayout.referenceId}).`
    );
    this.notifySync('PAYOUT_SENT', newPayout);
    return newPayout;
  }

  // Affiliate Partner Management (Add, Update, Deactivate, Permissions)
  static addAffiliate(
    data: Omit<UserProfile, 'id' | 'role' | 'consentGiven'>
  ): UserProfile {
    const users = this.getUsers();
    const id = `user-affiliate-${Date.now().toString(36)}`;
    const roleTier: PractitionerRoleTier = data.practitionerRole || 'associate_astrologer';
    const permissions: PractitionerPermissions =
      data.permissions || { ...ROLE_PERMISSION_DEFAULTS[roleTier] };

    const newAffiliate: UserProfile = {
      ...data,
      id,
      role: 'affiliate',
      consentGiven: true,
      consentDate: new Date().toISOString().split('T')[0],
      consentVersion: 'v2.4',
      activeStatus: data.activeStatus || 'active',
      practitionerRole: roleTier,
      permissions,
      commissionRate: data.commissionRate ?? 0.25,
      payoutMethodPreference: data.payoutMethodPreference || 'wise',
      payoutAccountDetails: data.payoutAccountDetails || ''
    };

    const updated = [...users, newAffiliate];
    this.saveUsers(updated);

    this.logAction(
      'user-admin-demo',
      'Demo Admin',
      'admin',
      'AFFILIATE_ADDED',
      `Added new practitioner partner: ${newAffiliate.name} (${newAffiliate.specialty}). Role: ${roleTier}.`
    );

    // Sync notification bulletin
    this.addBulletin({
      title: `Welcome New Partner: ${newAffiliate.name}`,
      content: `${newAffiliate.name} has joined the practice cohort specializing in ${newAffiliate.specialty}. Caseload assignments and consultation rooms are now open.`,
      priority: 'general',
      targetAffiliateId: 'all',
      authorName: 'Demo Admin'
    });

    this.notifySync('AFFILIATE_ADDED', newAffiliate);
    return newAffiliate;
  }

  static updateAffiliate(
    affiliateId: string,
    updates: Partial<UserProfile>
  ): UserProfile | null {
    const users = this.getUsers();
    let updatedProfile: UserProfile | null = null;
    const updated = users.map((u) => {
      if (u.id === affiliateId) {
        updatedProfile = { ...u, ...updates };
        return updatedProfile;
      }
      return u;
    });

    if (updatedProfile) {
      this.saveUsers(updated);
      this.logAction(
        'user-admin-demo',
        'Demo Admin',
        'admin',
        'AFFILIATE_STATUS_CHANGED',
        `Updated partner profile for ${(updatedProfile as UserProfile).name} (${affiliateId}).`
      );
      this.notifySync('AFFILIATE_STATUS_CHANGED', updatedProfile);
    }

    return updatedProfile;
  }

  static updateAffiliatePermissions(
    affiliateId: string,
    permissions: PractitionerPermissions,
    newRoleTier?: PractitionerRoleTier
  ): UserProfile | null {
    const users = this.getUsers();
    let updatedProfile: UserProfile | null = null;
    const updated = users.map((u) => {
      if (u.id === affiliateId) {
        updatedProfile = {
          ...u,
          permissions,
          ...(newRoleTier ? { practitionerRole: newRoleTier } : {})
        };
        return updatedProfile;
      }
      return u;
    });

    if (updatedProfile) {
      this.saveUsers(updated);
      this.logAction(
        'user-admin-demo',
        'Demo Admin',
        'admin',
        'AFFILIATE_PERMISSIONS_UPDATED',
        `Updated role permissions for ${(updatedProfile as UserProfile).name}.${newRoleTier ? ` Tier set to ${newRoleTier}.` : ''}`
      );
      this.notifySync('AFFILIATE_PERMISSIONS_UPDATED', updatedProfile);
    }

    return updatedProfile;
  }

  static deactivateAffiliate(
    affiliateId: string,
    reason: string,
    reassignToAffiliateId?: string
  ): { success: boolean; reassignedCount: number } {
    const res = this.removeAffiliate(affiliateId, reassignToAffiliateId);
    if (reason) {
      this.updateAffiliate(affiliateId, {
        deactivationReason: reason,
        activeStatus: 'deactivated',
        deactivatedAt: new Date().toISOString()
      });
    }
    this.logAction(
      'user-admin-demo',
      'Demo Admin',
      'admin',
      'AFFILIATE_DEACTIVATED',
      `Deactivated affiliate ${affiliateId}. Reason: ${reason}`
    );
    this.notifySync('AFFILIATE_STATUS_CHANGED', { affiliateId, status: 'deactivated' });
    return res;
  }

  static reactivateAffiliate(affiliateId: string): UserProfile | null {
    const updated = this.updateAffiliate(affiliateId, {
      activeStatus: 'active',
      deactivationReason: undefined,
      deactivatedAt: undefined
    });
    if (updated) {
      this.logAction(
        'user-admin-demo',
        'Demo Admin',
        'admin',
        'AFFILIATE_REACTIVATED',
        `Reactivated affiliate partner ${updated.name} (${affiliateId}).`
      );
      this.notifySync('AFFILIATE_STATUS_CHANGED', { affiliateId, status: 'active' });
    }
    return updated;
  }

  static removeAffiliate(
    affiliateId: string,
    reassignToAffiliateId?: string
  ): { success: boolean; reassignedCount: number } {
    const users = this.getUsers();
    const bookings = this.getBookings();

    const affiliateToRemove = users.find((u) => u.id === affiliateId);
    if (!affiliateToRemove) {
      return { success: false, reassignedCount: 0 };
    }

    const targetAffiliate = reassignToAffiliateId
      ? users.find((u) => u.id === reassignToAffiliateId && u.role === 'affiliate')
      : null;

    let reassignedCount = 0;
    const updatedUsers = users.map((u) => {
      if (u.role === 'client' && u.assignedAffiliateId === affiliateId) {
        reassignedCount++;
        return {
          ...u,
          assignedAffiliateId: targetAffiliate ? targetAffiliate.id : undefined
        };
      }
      if (u.id === affiliateId) {
        return {
          ...u,
          activeStatus: 'deactivated' as const,
          deactivationReason: 'Administrative removal / Caseload reallocated'
        };
      }
      return u;
    });

    const updatedBookings = bookings.map((b) => {
      if (b.affiliateId === affiliateId && b.status === 'confirmed') {
        if (targetAffiliate) {
          return {
            ...b,
            affiliateId: targetAffiliate.id,
            affiliateName: targetAffiliate.name
          };
        }
      }
      return b;
    });

    this.saveUsers(updatedUsers);
    this.saveBookings(updatedBookings);

    this.logAction(
      'user-admin-demo',
      'Demo Admin',
      'admin',
      'AFFILIATE_REMOVED',
      `Deactivated partner ${affiliateToRemove.name}. ${reassignedCount} clients ${targetAffiliate ? `reassigned to ${targetAffiliate.name}` : 'set to unassigned'}.`
    );

    this.addBulletin({
      title: `Practice Roster Update`,
      content: `${affiliateToRemove.name} has departed from active practice. Active client consultations have been ${targetAffiliate ? `reallocated to ${targetAffiliate.name}` : 'routed to the administrative queue'}.`,
      priority: 'scheduling',
      targetAffiliateId: 'all',
      authorName: 'Demo Admin'
    });

    this.notifySync('AFFILIATE_REMOVED', { affiliateId, reassignToAffiliateId });
    return { success: true, reassignedCount };
  }

  // Workload, Works Pending vs Done Tracker
  static getAffiliateWorkloadSummary() {
    const users = this.getUsers();
    const bookings = this.getBookings();
    const summaries = this.getSummaries();
    const payouts = this.getPayouts();
    const messages = this.getMessages();

    const affiliates = users.filter((u) => u.role === 'affiliate');

    const affiliateMetrics = affiliates.map((aff) => {
      const assignedClients = users.filter(
        (u) => u.role === 'client' && u.assignedAffiliateId === aff.id
      );

      const affBookings = bookings.filter((b) => b.affiliateId === aff.id);
      const pendingSessions = affBookings.filter((b) => b.status === 'confirmed');
      const completedSessions = affBookings.filter((b) => b.status === 'completed');
      const cancelledSessions = affBookings.filter((b) => b.status === 'cancelled');

      // Check summaries delivered vs pending
      const deliveredSummaries = affBookings.filter((b) => b.hasSummaryShared);
      const pendingSummaries = completedSessions.filter((b) => !b.hasSummaryShared);

      // Unread messages from clients
      const unreadMessages = messages.filter(
        (m) => m.recipientId === aff.id && !m.isRead
      );

      // Pending works: sessions to conduct + summaries to deliver + unread client inquiries
      const pendingWorksCount =
        pendingSessions.length + pendingSummaries.length + unreadMessages.length;

      // Completed works: completed sessions + delivered summaries
      const completedWorksCount =
        completedSessions.length + deliveredSummaries.length;

      const totalWorksCount = pendingWorksCount + completedWorksCount;
      const completionRate =
        totalWorksCount > 0
          ? Math.round((completedWorksCount / totalWorksCount) * 100)
          : 100;

      // Financials (demonstration)
      const grossRevenue = completedSessions.reduce((sum, b) => sum + b.amount, 0);
      const rate = aff.commissionRate ?? 0.25;
      const earnedCommission = Math.round(grossRevenue * rate);

      const paidOut = payouts
        .filter((p) => p.affiliateId === aff.id && p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);

      const pendingPayout = Math.max(0, earnedCommission - paidOut);

      return {
        affiliate: aff,
        assignedClientsCount: assignedClients.length,
        assignedClients,
        bookingsCount: affBookings.length,
        pendingSessions,
        completedSessions,
        cancelledSessions,
        pendingSummaries,
        deliveredSummaries,
        unreadMessages,
        pendingWorksCount,
        completedWorksCount,
        totalWorksCount,
        completionRate,
        grossRevenue,
        earnedCommission,
        paidOut,
        pendingPayout
      };
    });

    const totalPendingWorks = affiliateMetrics.reduce(
      (sum, m) => sum + m.pendingWorksCount,
      0
    );
    const totalCompletedWorks = affiliateMetrics.reduce(
      (sum, m) => sum + m.completedWorksCount,
      0
    );
    const totalAllWorks = totalPendingWorks + totalCompletedWorks;
    const globalCompletionRate =
      totalAllWorks > 0
        ? Math.round((totalCompletedWorks / totalAllWorks) * 100)
        : 100;

    const totalPendingPayouts = affiliateMetrics.reduce(
      (sum, m) => sum + m.pendingPayout,
      0
    );
    const totalPaidOut = affiliateMetrics.reduce((sum, m) => sum + m.paidOut, 0);

    return {
      affiliateMetrics,
      totalPendingWorks,
      totalCompletedWorks,
      totalAllWorks,
      globalCompletionRate,
      totalPendingPayouts,
      totalPaidOut
    };
  }

  // In-memory typed listener registry for event-listener pattern
  private static listeners: Map<string, Set<StoreEventListener>> = new Map();

  /**
   * Register an event listener for a specific store event type or '*' for all events.
   * Returns an unregister function.
   */
  static addEventListener<T = any>(
    eventType: StoreEventType | string,
    callback: StoreEventListener<T>
  ): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback as StoreEventListener);

    return () => {
      this.removeEventListener(eventType, callback);
    };
  }

  static removeEventListener<T = any>(
    eventType: StoreEventType | string,
    callback: StoreEventListener<T>
  ): void {
    const set = this.listeners.get(eventType);
    if (set) {
      set.delete(callback as StoreEventListener);
      if (set.size === 0) {
        this.listeners.delete(eventType);
      }
    }
  }

  // Cross-Applet Real-Time Event Sync Dispatcher
  static notifySync<T = any>(type: StoreEventType | string, payload?: T): void {
    const event: StoreSyncEvent<T> = {
      type,
      payload,
      timestamp: Date.now()
    };

    // 1. Invoke specific in-memory listeners
    const specific = this.listeners.get(type);
    if (specific) {
      specific.forEach((fn) => {
        try {
          fn(event);
        } catch (err) {
          console.error(`Store listener error for "${type}":`, err);
        }
      });
    }

    // 2. Invoke wildcard in-memory listeners
    const wildcard = this.listeners.get('*');
    if (wildcard) {
      wildcard.forEach((fn) => {
        try {
          fn(event);
        } catch (err) {
          console.error('Store wildcard listener error:', err);
        }
      });
    }

    // 3. Dispatch DOM CustomEvent for browser-level / iframe sync
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('medastrology_sync', {
          detail: event
        })
      );
    }
  }

  /**
   * Subscribe to store events (default wildcard, or specific eventType).
   * Fully backwards-compatible with existing PracticeStore.subscribe(fn) callers.
   */
  static subscribe<T = any>(
    listener: (event: StoreSyncEvent<T>) => void,
    eventType: StoreEventType | string = '*'
  ): () => void {
    return this.addEventListener<T>(eventType, listener);
  }

  // ============================================================================
  // Authenticated Session & Identity Resolution
  // ============================================================================

  /**
   * Retrieves the current session role. Defaults to 'public'.
   */
  static getActiveRole(): UserRole {
    return this.load('active_role', 'public');
  }

  /**
   * Retrieves the current authenticated user's ID.
   * Returns null if unauthenticated or session is cleared.
   * Never infers or hardcodes a user ID based on role.
   */
  static getActiveUserId(): string | null {
    return this.load<string | null>('active_user_id', null);
  }

  /**
   * Sets the active role.
   * CRITICAL SECURITY PRINCIPLE: Role changes must NOT establish authentication.
   * If a user was previously authenticated, their actual profile role must match the requested role.
   * If there is any mismatch or if no user was authenticated, active_user_id remains/becomes null.
   */
  static setActiveRole(role: UserRole): void {
    this.save('active_role', role);

    if (role === 'public') {
      this.save('active_user_id', null);
    } else {
      const currentUserId = this.getActiveUserId();
      if (currentUserId) {
        const user = this.getUsers().find((u) => u.id === currentUserId);
        if (!user || user.role !== role) {
          // Inconsistent session: do NOT keep user ID when switching to a different role
          this.save('active_user_id', null);
        }
      }
    }

    this.notifySync('SESSION_UPDATED', {
      role,
      userId: this.getActiveUserId(),
      timestamp: Date.now()
    });
  }

  /**
   * Sets the authenticated user ID directly.
   */
  static setActiveUserId(userId: string | null): void {
    this.save('active_user_id', userId);
    this.notifySync('SESSION_UPDATED', {
      role: this.getActiveRole(),
      userId,
      timestamp: Date.now()
    });
  }

  /**
   * Establishes a verified authenticated session for a specific user ID and role.
   * Validates:
   * 1. User existence (missing user rejected).
   * 2. Role consistency (user.role must match role argument).
   * 3. Account status (suspended/deactivated accounts cannot establish active session).
   */
  static setSession(userId: string | null, role: UserRole): void {
    if (userId) {
      const user = this.getUsers().find((u) => u.id === userId);
      if (!user) {
        throw new Error(`Cannot establish session: User ID "${userId}" does not exist.`);
      }
      if (user.role !== role) {
        throw new Error(
          `Cannot establish session: User "${user.name}" has role "${user.role}", which does not match session role "${role}".`
        );
      }
      if (user.activeStatus === 'deactivated' || user.activeStatus === 'suspended') {
        throw new Error(
          `Cannot establish session: User account is ${user.activeStatus}. Access denied.`
        );
      }
    }

    this.save('active_user_id', userId);
    this.save('active_role', role);
    this.notifySync('SESSION_UPDATED', {
      role,
      userId,
      timestamp: Date.now()
    });
  }

  /**
   * Clears the current authenticated session and returns to public role.
   */
  static clearSession(): void {
    this.save('active_user_id', null);
    this.save('active_role', 'public');
    this.notifySync('SESSION_UPDATED', {
      role: 'public',
      userId: null,
      timestamp: Date.now()
    });
  }

  /**
   * Identity-based resolution of the authenticated user.
   * Strict security checks:
   * 1. Role must not be 'public'.
   * 2. active_user_id must be present.
   * 3. User with active_user_id must exist in users list (no fallback!).
   * 4. User's role must match activeRole (no cross-role impersonation).
   * 5. User's account must not be deactivated or suspended.
   */
  static getCurrentUser(): UserProfile | undefined {
    const role = this.getActiveRole();
    if (role === 'public') return undefined;

    const userId = this.getActiveUserId();
    if (!userId) return undefined;

    const user = this.getUsers().find((u) => u.id === userId);
    if (!user) {
      // Missing user: fail closed, NEVER silently fallback to another user
      return undefined;
    }

    // Inconsistent session: user's role does not match active role
    if (user.role !== role) {
      return undefined;
    }

    // Account status check: deactivated or suspended accounts cannot access protected functionality
    if (user.activeStatus === 'deactivated' || user.activeStatus === 'suspended') {
      return undefined;
    }

    return user;
  }
}
