export type UserRole = 'public' | 'client' | 'affiliate' | 'admin';

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
  specialty?: string;
  bio?: string;
  activeStatus?: 'active' | 'pending' | 'suspended';
  payoutMethodPreference?: PayoutMethod;
  payoutAccountDetails?: string;
  workCapacity?: string;
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
    | 'REVIEW_APPROVED'
    | 'AFFILIATE_ADDED'
    | 'AFFILIATE_REMOVED'
    | 'AFFILIATE_STATUS_CHANGED'
    | 'PAYOUT_DISBURSED'
    | 'BULLETIN_PUBLISHED';
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
