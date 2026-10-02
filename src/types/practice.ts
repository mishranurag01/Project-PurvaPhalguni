export type UserRole = 'public' | 'client' | 'affiliate' | 'admin';

export type PractitionerRoleTier =
  | 'senior_astrologer'
  | 'associate_astrologer'
  | 'cartomancy_specialist'
  | 'apprentice_fellow';

export interface PractitionerPermissions {
  canAccessJHoraEngine: boolean; // Access to local sidereal chart calculation engine
  canSuggestRemedies: boolean; // Formulate reflective contemplations, gemstone color symbolism & daily pacing
  canDirectMessageClients: boolean; // Asynchronous direct messaging with assigned clients
  canExportClientCharts: boolean; // Export birth data and transit matrices as printable PDF folios
  canPublishToSanctuaryNotes: boolean; // Contribute to the shared knowledge base / research repository
  canViewUnassignedQueue: boolean; // View & claim incoming prospective clients from intake triage
  canModifyConsultationFees: boolean; // Custom session add-ons or client fee concessions
  requireAdminSummaryReview: boolean; // Flag to require Admin sign-off before summary delivery
}

export const ROLE_PERMISSION_DEFAULTS: Record<PractitionerRoleTier, PractitionerPermissions> = {
  senior_astrologer: {
    canAccessJHoraEngine: true,
    canSuggestRemedies: true,
    canDirectMessageClients: true,
    canExportClientCharts: true,
    canPublishToSanctuaryNotes: true,
    canViewUnassignedQueue: true,
    canModifyConsultationFees: true,
    requireAdminSummaryReview: false
  },
  associate_astrologer: {
    canAccessJHoraEngine: true,
    canSuggestRemedies: true,
    canDirectMessageClients: true,
    canExportClientCharts: true,
    canPublishToSanctuaryNotes: true,
    canViewUnassignedQueue: false,
    canModifyConsultationFees: false,
    requireAdminSummaryReview: false
  },
  cartomancy_specialist: {
    canAccessJHoraEngine: false,
    canSuggestRemedies: true,
    canDirectMessageClients: true,
    canExportClientCharts: true,
    canPublishToSanctuaryNotes: true,
    canViewUnassignedQueue: false,
    canModifyConsultationFees: false,
    requireAdminSummaryReview: false
  },
  apprentice_fellow: {
    canAccessJHoraEngine: true,
    canSuggestRemedies: false,
    canDirectMessageClients: true,
    canExportClientCharts: false,
    canPublishToSanctuaryNotes: false,
    canViewUnassignedQueue: false,
    canModifyConsultationFees: false,
    requireAdminSummaryReview: true
  }
};

export const PRACTITIONER_ROLE_LABELS: Record<PractitionerRoleTier, string> = {
  senior_astrologer: 'Senior Medical Astrologer',
  associate_astrologer: 'Associate Astrologer',
  cartomancy_specialist: 'Cartomancy & Archetype Specialist',
  apprentice_fellow: 'Apprentice Fellow'
};

export const PRACTITIONER_ROLE_DESCRIPTIONS: Record<PractitionerRoleTier, string> = {
  senior_astrologer: 'Senior authority over sidereal analysis, constitutional temperaments, and intake queue triage.',
  associate_astrologer: 'Authorized for local Vedic charting, reflective contemplations, and independent consultation delivery.',
  cartomancy_specialist: 'Specializes in archetypal mapping, tarot temperament layouts, and elemental contemplations.',
  apprentice_fellow: 'Supervised residency with pre-delivery admin review on all client reading summaries.'
};

export type PayoutMethod = 'bank_wire' | 'wise' | 'stripe' | 'paypal' | 'crypto' | 'check';

export interface PartnerPayout {
  id: string;
  affiliateId: string;
  affiliateName: string;
  affiliateEmail?: string;
  amount: number;
  currency: string;
  method: PayoutMethod;
  methodDetails: string;
  referenceId: string;
  status: 'completed' | 'processing';
  notes?: string;
  createdAt: string;
  processedBy: string;
}

export type BulletinPriority = 'urgent' | 'protocol' | 'scheduling' | 'payout' | 'general';

export interface AdminBulletin {
  id: string;
  title: string;
  content: string;
  priority: BulletinPriority;
  targetAffiliateId: 'all' | string; // 'all' or specific affiliate id
  authorName: string;
  createdAt: string;
  acknowledgedBy: string[]; // affiliate ids
  actionLink?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  assignedAffiliateId?: string; // For clients
  // Birth details
  birthDate?: string; // YYYY-MM-DD
  birthTime?: string; // HH:mm
  birthCity?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  // Client question/intention
  primaryIntention?: string;
  consentGiven: boolean;
  consentDate?: string;
  consentVersion?: string;
  consentWithdrawn?: boolean;
  // Affiliate specific
  affiliateCode?: string;
  commissionRate?: number; // e.g. 0.20
  payoutSplitPercentage?: number; // e.g. 60
  specialty?: string;
  bio?: string;
  activeStatus?: 'active' | 'pending' | 'suspended' | 'deactivated';
  practitionerRole?: PractitionerRoleTier;
  permissions?: PractitionerPermissions;
  deactivationReason?: string;
  deactivatedAt?: string;
  payoutMethodPreference?: PayoutMethod;
  payoutAccountDetails?: string;
  workCapacity?: string;
  // Authentication & Security (Cryptographically Hashed)
  passwordHash?: string;
  passwordSalt?: string;
  passwordLastChanged?: string;
}

export interface ServicePlan {
  id: string;
  code: 'M+A' | 'M+C' | 'M+A+C';
  name: string;
  shortDesc: string;
  fullDesc: string;
  duration: string; // e.g. "60 min"
  durationMinutes: number;
  price: number; // e.g. 260
  currency: string;
  includes: string[];
  preparationInstructions: string;
  isActive: boolean;
  isPopular?: boolean;
}

export interface BookingSession {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  affiliateId: string;
  affiliateName: string;
  serviceId: string;
  serviceCode: 'M+A' | 'M+C' | 'M+A+C';
  serviceName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "14:00 GMT"
  status: 'confirmed' | 'rescheduled' | 'completed' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  amount: number;
  clientIntention: string;
  birthDetailsSnapshot: {
    date: string;
    time: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  consentSnapshot: {
    agreedAt: string;
    version: string;
    disclaimerAcknowledged: boolean;
  };
  meetingUrl?: string;
  hasSummaryShared?: boolean;
  createdAt: string;
}

export interface ReadingSummary {
  id: string;
  bookingId: string;
  clientId: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  coreAstrologicalFocus: string;
  cartomancySpreads: string;
  reflectiveInsights: string;
  suggestedContemplations: string[];
  isSharedWithClient: boolean;
  sharedAt?: string;
}

export interface PractitionerNote {
  id: string;
  clientId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  text: string;
  isPrivate: boolean; // Never shared with client
  category: 'General' | 'Constitutional Tendencies' | 'Dasha Dynamics' | 'Cartomancy Reflections';
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string;
  recipientName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface ReviewItem {
  id: string;
  clientName: string;
  rating: number; // 1-5
  serviceUsed: string;
  date: string;
  quote: string;
  isApproved: boolean;
  order: number;
  hasMedicalClaims: boolean; // flagged if violating non-medical policy
}

export interface KnowledgeNote {
  id: string;
  title: string;
  category: 'Medical Astrology Principles' | 'Cartomancy Synergies' | 'Case Studies' | 'Ethical Guidelines' | 'Reading Templates';
  tags: string[];
  excerpt: string;
  content: string;
  author: string;
  updatedAt: string;
  accessLevel: 'admin_only' | 'affiliate_accessible';
}

export interface KnowledgeDocument {
  id: string;
  name: string;
  category: string;
  format: 'PDF' | 'Guide' | 'Template' | 'Protocol';
  size: string;
  uploadedAt: string;
  accessLevel: 'admin_only' | 'affiliate_accessible';
  description: string;
}

export interface ResearchParticipant {
  id: string;
  deidentifiedId: string; // e.g. "SUBJ-8841"
  intakeDate: string;
  consentActive: boolean;
  primaryAstrologicalSignatures: string[]; // e.g. ["Saturn in 6th house", "Mars in Scorpio aspecting Moon"]
  verifiedOutcomeCategory: string; // e.g. "Reported stress resolution and sleep hygiene improvement"
  outcomeDate: string;
  outcomeSource: 'Self-Report Followup Survey (30 Days)' | 'Reflective Journal Submission' | 'Standardized Wellbeing Scale';
  researchNotes: string;
  associatedHypothesisId: string;
  withdrawn: boolean;
}

export interface ResearchStudy {
  id: string;
  protocolNumber: string;
  title: string;
  hypothesis: string;
  leadResearcher: string;
  status: 'Active' | 'Peer Review' | 'Draft';
  limitations: string[];
  variableCount: number;
  sampleSize: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action:
    | 'LOGIN'
    | 'VIEW_CLIENT_PROFILE'
    | 'GENERATE_JHORA_CHART'
    | 'CLIENT_ASSIGNED'
    | 'PRACTITIONER_NOTE_EDIT'
    | 'SUMMARY_SHARED'
    | 'CONSENT_WITHDRAWN'
    | 'DATA_EXPORT'
    | 'SETTINGS_CHANGED'
    | 'SERVICES_CHANGED'
    | 'REVIEW_APPROVED'
    | 'AFFILIATE_ADDED'
    | 'AFFILIATE_REMOVED'
    | 'AFFILIATE_STATUS_CHANGED'
    | 'AFFILIATE_PERMISSIONS_UPDATED'
    | 'AFFILIATE_DEACTIVATED'
    | 'AFFILIATE_REACTIVATED'
    | 'PAYOUT_DISBURSED'
    | 'BULLETIN_PUBLISHED'
    | 'PASSWORD_CHANGED';
  details: string;
  ipAddress: string;
  isSensitive: boolean;
}

export interface WebsiteSettings {
  brandName: string;
  tagline: string;
  requiredDisclaimer: string;
  contactEmail: string;
  contactPhone: string;
  officeLocation: string;
  aboutStory: string;
  aboutPhilosophy: string;
  aboutApproach: string;
  privacyPolicyText: string;
  termsText: string;
  consentPolicyText: string;
}
