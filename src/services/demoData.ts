/**
 * Development demo data only — do not use with real client records.
 *
 * All names, emails, phone numbers, addresses, account details, birth locations,
 * and meeting links in this file are strictly fictional placeholders for prototype evaluation.
 * No real personally identifiable data or payment information is stored here.
 */

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
  PartnerPayout,
  AdminBulletin,
  ROLE_PERMISSION_DEFAULTS
} from '../types/practice';

// Fictional Prototype Practice Settings
export const DEMO_SETTINGS: WebsiteSettings = {
  brandName: '[Business Name]',
  tagline: 'Medical Astrology and Cartomancy for reflective spiritual insight.',
  requiredDisclaimer:
    'Services are offered for spiritual and educational purposes only. They are not medical advice, diagnosis, treatment, or a substitute for care from a qualified healthcare professional.',
  contactEmail: 'demo@example.com',
  contactPhone: '+1 (555) 010-0000',
  officeLocation: 'Prototype Studio, Suite 100, Example City',
  aboutStory:
    'Founded as a contemplative junction where classical sidereal astronomy meets symbolic cartomancy. We approach personal inquiry through a reflective lens, translating celestial archetypes into grounded somatic self-understanding.',
  aboutPhilosophy:
    'We honor the ancient tradition of Iatromathematics (the symbolic study of planetary signatures in relation to temperamental vitality) as a non-diagnostic, contemplative art. We strictly differentiate between spiritual counsel and clinical healthcare.',
  aboutApproach:
    'Each consultation examines your Natal Chart via sidereal planetary calculations, transits, and targeted tarot spreads. We never predict illness, recommend pharmaceuticals or herbs, or contradict licensed medical providers.',
  privacyPolicyText:
    'Prototype notice: Demo data is stored in memory for the active browser session. Do not enter real personal, medical, or financial information.',
  termsText:
    'By booking a consultation in this prototype, you acknowledge that all observations are symbolic, reflective, and educational in nature. Sessions are not a substitute for clinical psychological or physical healthcare.',
  consentPolicyText:
    'Informed consent is mandatory prior to any birth chart calculation. Clients retain the unencumbered right to inspect their records or withdraw consent at any time.'
};

// Fictional Prototype Users
export const DEMO_USERS: UserProfile[] = [
  {
    id: 'user-admin-demo',
    email: 'admin.demo@example.com',
    name: 'Demo Admin',
    role: 'admin',
    phone: '+1 (555) 010-0001',
    consentGiven: true,
    consentDate: '2026-01-01',
    consentVersion: 'v2.4',
    specialty: 'Astrology Director & Practice Coordinator',
    activeStatus: 'active'
  },
  {
    id: 'user-affiliate-1',
    email: 'demo.affiliate1@example.com',
    name: 'Demo Affiliate 1',
    role: 'affiliate',
    phone: '+1 (555) 010-0002',
    affiliateCode: 'DEMO20',
    commissionRate: 0.25,
    specialty: 'Sidereal Jyotish & Vitality Chronobiology',
    bio: 'Fictional practitioner profile focused on seasonal vitality rhythms and reflective cartomantic spreads.',
    activeStatus: 'active',
    practitionerRole: 'senior_astrologer',
    permissions: { ...ROLE_PERMISSION_DEFAULTS.senior_astrologer },
    consentGiven: true,
    consentDate: '2026-01-15',
    consentVersion: 'v2.4',
    payoutMethodPreference: 'wise',
    payoutAccountDetails: 'Demo Payout Account 1 (Fictional — Not Connected)',
    workCapacity: '10 sessions / week'
  },
  {
    id: 'user-affiliate-2',
    email: 'demo.affiliate2@example.com',
    name: 'Demo Affiliate 2',
    role: 'affiliate',
    phone: '+1 (555) 010-0003',
    affiliateCode: 'DEMO25',
    commissionRate: 0.20,
    specialty: 'Archetypal Cartomancy & Temperaments',
    bio: 'Fictional practitioner profile specializing in contemplative archetypes and elemental temperaments.',
    activeStatus: 'active',
    practitionerRole: 'cartomancy_specialist',
    permissions: { ...ROLE_PERMISSION_DEFAULTS.cartomancy_specialist },
    consentGiven: true,
    consentDate: '2026-02-01',
    consentVersion: 'v2.4',
    payoutMethodPreference: 'bank_wire',
    payoutAccountDetails: 'Demo Payout Account 2 (Fictional — Not Connected)',
    workCapacity: '8 sessions / week'
  },
  {
    id: 'user-affiliate-3',
    email: 'demo.affiliate3@example.com',
    name: 'Demo Affiliate 3',
    role: 'affiliate',
    phone: '+1 (555) 010-0004',
    affiliateCode: 'DEMO15',
    commissionRate: 0.15,
    specialty: 'Vedic Chronobiology Research',
    bio: 'Fictional fellow profile studying planetary transit archetypes on somatic pacing.',
    activeStatus: 'deactivated',
    practitionerRole: 'apprentice_fellow',
    permissions: { ...ROLE_PERMISSION_DEFAULTS.apprentice_fellow },
    deactivationReason: 'Sabbatical: Academic Research Leave',
    deactivatedAt: '2026-08-10T14:30:00Z',
    consentGiven: true,
    consentDate: '2026-03-01',
    consentVersion: 'v2.4',
    payoutMethodPreference: 'stripe',
    payoutAccountDetails: 'Demo Payout Account 3 (Fictional — Not Connected)',
    workCapacity: '4 sessions / week'
  },
  {
    id: 'user-client-1',
    email: 'demo.client1@example.com',
    name: 'Demo Client 1',
    role: 'client',
    phone: '+1 (555) 010-0011',
    assignedAffiliateId: 'user-affiliate-1',
    birthDate: '2000-01-01',
    birthTime: '12:00',
    birthCity: 'Example City',
    latitude: 37.7749,
    longitude: -122.4194,
    timezone: 'UTC',
    primaryIntention: 'Exploring creative rhythm patterns and aligning work schedules with solar-lunar cycles.',
    consentGiven: true,
    consentDate: '2026-08-10',
    consentVersion: 'v2.4',
    consentWithdrawn: false
  },
  {
    id: 'user-client-2',
    email: 'demo.client2@example.com',
    name: 'Demo Client 2',
    role: 'client',
    phone: '+1 (555) 010-0012',
    assignedAffiliateId: 'user-affiliate-1',
    birthDate: '1995-05-15',
    birthTime: '08:30',
    birthCity: 'Example City',
    latitude: 40.7128,
    longitude: -74.006,
    timezone: 'UTC',
    primaryIntention: 'Reflecting on mental pacing under planetary transits.',
    consentGiven: true,
    consentDate: '2026-09-02',
    consentVersion: 'v2.4',
    consentWithdrawn: false
  },
  {
    id: 'user-client-3',
    email: 'demo.client3@example.com',
    name: 'Demo Client 3',
    role: 'client',
    phone: '+1 (555) 010-0013',
    assignedAffiliateId: 'user-affiliate-2',
    birthDate: '1990-10-20',
    birthTime: '16:45',
    birthCity: 'Example City',
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: 'UTC',
    primaryIntention: 'Inquiring into somatic vitality, restorative habits, and cartomancy insights on vocational pacing.',
    consentGiven: true,
    consentDate: '2026-09-12',
    consentVersion: 'v2.4',
    consentWithdrawn: false
  }
];

// Fictional Prototype Services
export const DEMO_SERVICES: ServicePlan[] = [
  {
    id: 'service-ma',
    code: 'M+A',
    name: 'M + A: Medical Astrology Reading',
    shortDesc: 'Reflective examination of your Natal Lagna, constitutional archetypes, and planetary vitality cycles.',
    fullDesc:
      'An in-depth astrological consultation focusing on constitutional predispositions, energy reserves, and planetary chronobiology. We analyze your sidereal natal chart, current dasha cycles, and transits to clarify periods of natural vitality versus necessary rest.',
    duration: '60 min',
    durationMinutes: 60,
    price: 260,
    currency: 'USD',
    includes: [
      'Comprehensive Sidereal Natal Chart (Lahiri Math)',
      'Reflective Vitality & Resilience Overview',
      'Vimshottari Dasha Chronobiology Review',
      'Personalized Astrological Rest & Recovery Guide',
      'Session Notes & Shared Reading Folio'
    ],
    preparationInstructions:
      'Please verify your birth record for exact minute of birth. Have 1-2 reflective intentions prepared. Note: Do not bring medical lab results; this is a reflective spiritual session.',
    isActive: true,
    isPopular: false
  },
  {
    id: 'service-mc',
    code: 'M+C',
    name: 'M + C: Medical Cartomancy Reading',
    shortDesc: 'Contemplative card-reading focused on somatic-emotional pacing, psycho-spiritual reflections, and restorative inner archetypes.',
    fullDesc:
      'Utilizing symbolic cartomancy decks, this reading reflects internal tension, emotional weight, and intuitive patterns affecting your sense of daily equilibrium.',
    duration: '45 min',
    durationMinutes: 45,
    price: 210,
    currency: 'USD',
    includes: [
      'Four-Body Elemental Spread (Physical, Emotional, Mental, Spiritual)',
      'Exploration of Subconscious Stressors',
      'Archetypal Reflection Prompts & Contemplations',
      'High-Resolution Spread Photography',
      'Follow-Up Reflection Prompt'
    ],
    preparationInstructions:
      'Find a quiet, uninterrupted space with a glass of water. Formulate an open-ended question about your present vitality or life transitions.',
    isActive: true,
    isPopular: false
  },
  {
    id: 'service-mac',
    code: 'M+A+C',
    name: 'M + A + C: Complete Insight Reading',
    shortDesc: 'Comprehensive synthesis combining sidereal medical astrology with archetypal cartomancy spreads.',
    fullDesc:
      'Our most comprehensive offering. The session begins with astrological chronobiology—charting planetary temperaments, dasha periods, and transits—and concludes with a tailored cartomantic spread that grounds celestial insights into daily reflective rhythms.',
    duration: '90 min',
    durationMinutes: 90,
    price: 380,
    currency: 'USD',
    includes: [
      '90-Minute Joint Synthesis Consultation',
      'Full Sidereal Natal Kundali + Transits + Dashas',
      'Constitutional Temperament & Elemental Breakdown',
      'Live Cartomancy Spread for Immediate Grounding',
      'Written Practitioner Reading Summary Document',
      '30-Day Reflective Check-In via Client Portal'
    ],
    preparationInstructions:
      'Verify birth coordinates and time. Dedicate 15 minutes before and after the call for quiet reflection. Review and sign the digital consent agreement.',
    isActive: true,
    isPopular: true
  }
];

// Fictional Prototype Bookings
export const DEMO_BOOKINGS: BookingSession[] = [
  {
    id: 'book-101',
    clientId: 'user-client-1',
    clientName: 'Demo Client 1',
    clientEmail: 'demo.client1@example.com',
    affiliateId: 'user-affiliate-1',
    affiliateName: 'Demo Affiliate 1',
    serviceId: 'service-mac',
    serviceCode: 'M+A+C',
    serviceName: 'M + A + C: Complete Insight Reading',
    date: '2026-10-04',
    timeSlot: '14:00 GMT',
    status: 'confirmed',
    paymentStatus: 'paid',
    amount: 380,
    clientIntention: 'Exploring creative rhythm patterns and aligning workload with restorative cycles.',
    birthDetailsSnapshot: {
      date: '2000-01-01',
      time: '12:00',
      city: 'Example City',
      latitude: 37.7749,
      longitude: -122.4194
    },
    consentSnapshot: {
      agreedAt: '2026-08-10T14:32:00Z',
      version: 'v2.4',
      disclaimerAcknowledged: true
    },
    meetingUrl: 'https://example.com/demo-sanctuary-room-101',
    hasSummaryShared: true,
    createdAt: '2026-08-10T14:35:00Z'
  },
  {
    id: 'book-102',
    clientId: 'user-client-2',
    clientName: 'Demo Client 2',
    clientEmail: 'demo.client2@example.com',
    affiliateId: 'user-affiliate-1',
    affiliateName: 'Demo Affiliate 1',
    serviceId: 'service-ma',
    serviceCode: 'M+A',
    serviceName: 'M + A: Medical Astrology Reading',
    date: '2026-10-12',
    timeSlot: '16:30 GMT',
    status: 'confirmed',
    paymentStatus: 'paid',
    amount: 260,
    clientIntention: 'Reflecting on mental pacing under planetary transits.',
    birthDetailsSnapshot: {
      date: '1995-05-15',
      time: '08:30',
      city: 'Example City',
      latitude: 40.7128,
      longitude: -74.006
    },
    consentSnapshot: {
      agreedAt: '2026-09-02T10:15:00Z',
      version: 'v2.4',
      disclaimerAcknowledged: true
    },
    meetingUrl: 'https://example.com/demo-sanctuary-room-102',
    hasSummaryShared: false,
    createdAt: '2026-09-02T10:20:00Z'
  },
  {
    id: 'book-103',
    clientId: 'user-client-3',
    clientName: 'Demo Client 3',
    clientEmail: 'demo.client3@example.com',
    affiliateId: 'user-affiliate-2',
    affiliateName: 'Demo Affiliate 2',
    serviceId: 'service-mc',
    serviceCode: 'M+C',
    serviceName: 'M + C: Medical Cartomancy Reading',
    date: '2026-09-20',
    timeSlot: '11:00 GMT',
    status: 'completed',
    paymentStatus: 'paid',
    amount: 210,
    clientIntention: 'Inquiring into somatic vitality and restorative habits.',
    birthDetailsSnapshot: {
      date: '1990-10-20',
      time: '16:45',
      city: 'Example City',
      latitude: 51.5074,
      longitude: -0.1278
    },
    consentSnapshot: {
      agreedAt: '2026-09-12T09:00:00Z',
      version: 'v2.4',
      disclaimerAcknowledged: true
    },
    meetingUrl: 'https://example.com/demo-sanctuary-room-103',
    hasSummaryShared: true,
    createdAt: '2026-09-12T09:05:00Z'
  }
];

// Fictional Prototype Reading Summaries
export const DEMO_SUMMARIES: ReadingSummary[] = [
  {
    id: 'sum-101',
    bookingId: 'book-101',
    clientId: 'user-client-1',
    authorId: 'user-affiliate-1',
    authorName: 'Demo Affiliate 1',
    createdAt: '2026-08-11T16:00:00Z',
    updatedAt: '2026-08-12T11:20:00Z',
    title: 'Constitutional Vitality & Creative Replenishment Folio',
    coreAstrologicalFocus:
      'Sidereal chart reflects a fiery-airy constitutional archetype. Periods of high output benefit from structured rest intervals during planetary transits.',
    cartomancySpreads:
      'Spread: The Four Pillars of Restoration.\n• Card I (Somatic Root): The Empress (Receptivity over exertion)\n• Card II (Mental Atmosphere): Two of Swords (Resolving boundary conflicts)\n• Card III (Spiritual Alignment): The Star (Renewed trust in organic timing)',
    reflectiveInsights:
      'Notice when mental impatience creates tension in daily tasks. Establish quiet evening unwinding periods free of digital screens.',
    suggestedContemplations: [
      'Practice 20 minutes of silent walking in nature following presentations.',
      'Enjoy mindful tea rituals during high-intensity planning weeks.',
      'Affirmation: "My vitality is sustained through deliberate pause, not relentless forward momentum."'
    ],
    isSharedWithClient: true,
    sharedAt: '2026-08-12T11:30:00Z'
  },
  {
    id: 'sum-103',
    bookingId: 'book-103',
    clientId: 'user-client-3',
    authorId: 'user-affiliate-2',
    authorName: 'Demo Affiliate 2',
    createdAt: '2026-09-20T12:30:00Z',
    updatedAt: '2026-09-20T14:00:00Z',
    title: 'Elemental Balance & Cartomantic Synthesis',
    coreAstrologicalFocus:
      'A grounded constitutional archetype requiring earth elements to counterbalance deep empathetic sensitivity.',
    cartomancySpreads:
      'Spread: The Hearth of Wellbeing.\n• Somatic: Ace of Pentacles (Physical grounding in home environment)\n• Friction: Eight of Wands (Rushing deadlines creates fatigue)\n• Resolution: Temperance (Pacing output with rhythmic recovery)',
    reflectiveInsights:
      'Your physical equilibrium is directly tied to the sensory harmony of your workspace. Declutter and integrate organic materials to support mental stillness.',
    suggestedContemplations: [
      'Dedicate weekend mornings to quiet contemplation and spatial organization.',
      'Notice when mental impatience creates physical tension.'
    ],
    isSharedWithClient: true,
    sharedAt: '2026-09-20T14:10:00Z'
  }
];

// Fictional Prototype Notes
export const DEMO_NOTES: PractitionerNote[] = [
  {
    id: 'note-1',
    clientId: 'user-client-1',
    authorId: 'user-affiliate-1',
    createdAt: '2026-08-11T15:30:00Z',
    updatedAt: '2026-08-11T15:30:00Z',
    category: 'Constitutional Tendencies',
    text: 'Client displays high-achiever burnout risk. Reminded client strictly that our sessions are reflective and not medical advice; recommended continuing collaboration with licensed healthcare providers.',
    isPrivate: true
  },
  {
    id: 'note-2',
    clientId: 'user-client-2',
    authorId: 'user-affiliate-1',
    createdAt: '2026-09-03T11:00:00Z',
    updatedAt: '2026-09-03T11:00:00Z',
    category: 'Dasha Dynamics',
    text: 'Upcoming dasha transition brings introspection around vocational sustainability. Focus consultation on cognitive pacing and work-rest boundaries.',
    isPrivate: true
  }
];

// Fictional Prototype Messages
export const DEMO_MESSAGES: DirectMessage[] = [
  {
    id: 'msg-1',
    senderId: 'user-client-1',
    senderName: 'Demo Client 1',
    senderRole: 'client',
    recipientId: 'user-affiliate-1',
    recipientName: 'Demo Affiliate 1',
    text: 'Hello, I have reviewed the reading summary and the suggested contemplations on boundary pacing. It resonates deeply with my current schedule.',
    timestamp: '2026-09-24T10:15:00Z',
    isRead: true
  },
  {
    id: 'msg-2',
    senderId: 'user-affiliate-1',
    senderName: 'Demo Affiliate 1',
    senderRole: 'affiliate',
    recipientId: 'user-client-1',
    recipientName: 'Demo Client 1',
    text: 'Wonderful. Remember to let those insights settle organically over the next fortnight. Take gentle care.',
    timestamp: '2026-09-24T11:02:00Z',
    isRead: true
  }
];

// Fictional Prototype Reviews (Non-medical)
export const DEMO_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    clientName: 'Demo Reviewer A',
    rating: 5,
    serviceUsed: 'M + A + C: Complete Insight Reading',
    date: 'August 2026',
    quote:
      'A dignified and thoughtful consultation. The analysis of my astrological constitution helped me understand my natural energy rhythms and design a sustainable work schedule.',
    isApproved: true,
    order: 1,
    hasMedicalClaims: false
  },
  {
    id: 'rev-2',
    clientName: 'Demo Reviewer B',
    rating: 5,
    serviceUsed: 'M + A: Medical Astrology Reading',
    date: 'July 2026',
    quote:
      'Clear, luminous symbolic insight that gave me peace during a major vocational pivot. Strict ethical boundaries with no false promises.',
    isApproved: true,
    order: 2,
    hasMedicalClaims: false
  },
  {
    id: 'rev-3',
    clientName: 'Demo Reviewer C',
    rating: 5,
    serviceUsed: 'M + C: Medical Cartomancy Reading',
    date: 'September 2026',
    quote:
      'The cartomancy spread acted like a mirror for subconscious stress I had not articulated to myself. It provided deep clarity and calm.',
    isApproved: true,
    order: 3,
    hasMedicalClaims: false
  },
  {
    id: 'rev-4',
    clientName: 'Fictional Disapproved Sample',
    rating: 3,
    serviceUsed: 'M + A: Medical Astrology Reading',
    date: 'September 2026',
    quote:
      'The reader claimed to diagnose physical ailments and prescribed medicinal herbs.',
    isApproved: false,
    order: 4,
    hasMedicalClaims: true // Flagged by auto-filter for medical claim
  }
];

// Fictional Prototype Knowledge Centre Notes
export const DEMO_KNOWLEDGE_NOTES: KnowledgeNote[] = [
  {
    id: 'kn-1',
    title: 'The Doctrine of Temperamental Archetypes in Sidereal Jyotish',
    category: 'Medical Astrology Principles',
    tags: ['Temperaments', 'Pitta', 'Vata', 'Kapha', 'Elemental Balance'],
    excerpt: 'Correlating traditional elemental qualities with sidereal planetary rulers.',
    content:
      'In classical contemplative traditions, planetary rulers correspond symbolically to elemental temperaments: fire, earth, air, and water. The practitioner assesses constitutional balance by examining the Lagna lord, 6th lord, and luminaries without making clinical diagnoses or medical claims.',
    author: 'Demo Admin',
    updatedAt: '2026-08-15',
    accessLevel: 'affiliate_accessible'
  },
  {
    id: 'kn-2',
    title: 'Cartomancy Spread Protocol: The Four Bodies of Vitality',
    category: 'Reading Templates',
    tags: ['Tarot Protocol', 'Archetypes', 'Somatic Spread'],
    excerpt: 'Step-by-step practitioner template for laying out the Four Elements during an M+C session.',
    content:
      '1. Card 1 (Earth / Somatic Ground): Inquires into physical grounding and nourishment habits.\n2. Card 2 (Water / Emotional Tide): Inquires into relational holding and processing.\n3. Card 3 (Air / Mental Clarity): Inquires into cognitive pacing and digital strain.\n4. Card 4 (Fire / Creative Spark): Inquires into motivation and purposeful agency.',
    author: 'Demo Affiliate 2',
    updatedAt: '2026-09-01',
    accessLevel: 'affiliate_accessible'
  },
  {
    id: 'kn-3',
    title: 'Ethical Non-Diagnostic Boundaries & Practice Protocol',
    category: 'Ethical Guidelines',
    tags: ['Ethics', 'Protocol', 'Non-Medical Policy', 'Disclaimers'],
    excerpt: 'Mandatory standard operating procedure for all affiliated practitioners.',
    content:
      'Practitioners MUST explicitly restate the non-medical disclaimer at the beginning of each session. Under no circumstances may a practitioner recommend stopping prescribed medication, suggest herbal remedies for disease, or interpret chart positions as physical illness predictions.',
    author: 'Demo Admin',
    updatedAt: '2026-07-20',
    accessLevel: 'affiliate_accessible'
  }
];

export const DEMO_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'doc-1',
    name: 'Practitioner_Ethics_and_Scope_of_Practice_Manual.pdf',
    category: 'Regulatory & Ethics',
    format: 'Protocol',
    size: '1.2 MB',
    uploadedAt: '2026-08-01',
    accessLevel: 'affiliate_accessible',
    description: 'Guidelines for maintaining professional boundaries and client informed consent.'
  },
  {
    id: 'doc-2',
    name: 'Sidereal_Calculations_Reference_Sheet.pdf',
    category: 'Astrology Reference',
    format: 'Guide',
    size: '850 KB',
    uploadedAt: '2026-08-10',
    accessLevel: 'affiliate_accessible',
    description: 'Summary of Parashari sidereal Lahiri astronomical math, planetary aspects, and dasha timing.'
  },
  {
    id: 'doc-3',
    name: 'Client_Reading_Summary_Standard_Template.docx',
    category: 'Reading Templates',
    format: 'Template',
    size: '340 KB',
    uploadedAt: '2026-09-05',
    accessLevel: 'affiliate_accessible',
    description: 'Standard layout for generating client-facing summaries with reflective contemplations.'
  }
];

// Fictional Prototype Research Study
export const DEMO_RESEARCH_STUDY: ResearchStudy = {
  id: 'study-vitality-2026',
  protocolNumber: 'DEMO-ASTRO-2026-01',
  title: 'Correlations Between Saturnian Transits (6th/8th Bhava) and Subjective Burnout Recovery Patterns',
  hypothesis:
    'Participants undergoing major transit aspects to natal Moon who engage in structured weekly restorative pacing report improved subjective vitality scores over 90 days.',
  leadResearcher: 'Demo Admin (Director)',
  status: 'Active',
  limitations: [
    'Observational exploratory demonstration study; not a controlled medical trial.',
    'Subjective wellbeing self-reports are subject to recall bias.',
    'Astrological variables are purely symbolic correlations, not established as causative biological mechanisms.'
  ],
  variableCount: 14,
  sampleSize: 42
};

export const DEMO_RESEARCH_PARTICIPANTS: ResearchParticipant[] = [
  {
    id: 'rp-1',
    deidentifiedId: 'SUBJ-DEMO-01',
    intakeDate: '2026-07-14',
    consentActive: true,
    primaryAstrologicalSignatures: ['Saturn transiting 6th house archetype', 'Moon in Fire Sign', 'Venus Dasha Cycle'],
    verifiedOutcomeCategory: 'Reported improvement in subjective fatigue and daily pacing.',
    outcomeDate: '2026-08-18',
    outcomeSource: 'Standardized Wellbeing Questionnaire (Demo)',
    researchNotes: 'Participant completed 4-week restorative walking protocol. Correlated with transit passing natal degree.',
    associatedHypothesisId: 'study-vitality-2026',
    withdrawn: false
  },
  {
    id: 'rp-2',
    deidentifiedId: 'SUBJ-DEMO-02',
    intakeDate: '2026-08-01',
    consentActive: true,
    primaryAstrologicalSignatures: ['Jupiter transiting 1st house archetype', 'Moon in Water Sign', 'Rahu Cycle'],
    verifiedOutcomeCategory: 'Reported enhanced creative flow and resolution of creative block.',
    outcomeDate: '2026-09-05',
    outcomeSource: 'Reflective Journal Entry (Demo)',
    researchNotes: 'Participant utilized weekly cartomantic contemplation spread. High adherence.',
    associatedHypothesisId: 'study-vitality-2026',
    withdrawn: false
  },
  {
    id: 'rp-3',
    deidentifiedId: 'SUBJ-DEMO-03',
    intakeDate: '2026-08-20',
    consentActive: true,
    primaryAstrologicalSignatures: ['Mars retrograde archetype', 'Sun in Earth Sign', 'Saturn Antardasha'],
    verifiedOutcomeCategory: 'Reported gradual normalization of evening stress through breath awareness.',
    outcomeDate: '2026-09-22',
    outcomeSource: 'Self-Report Followup Survey (Demo)',
    researchNotes: 'Participant adhered to screen curfew during station phase.',
    associatedHypothesisId: 'study-vitality-2026',
    withdrawn: false
  }
];

// Fictional Prototype Audit Log Entries
export const DEMO_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-26T10:14:22Z',
    actorId: 'user-admin-demo',
    actorName: 'Demo Admin',
    actorRole: 'admin',
    action: 'LOGIN',
    details: 'Demonstration sign-in to Admin Portal (Prototype session).',
    ipAddress: '127.0.0.1 (Local Demo)',
    isSensitive: false
  },
  {
    id: 'log-2',
    timestamp: '2026-09-26T10:30:15Z',
    actorId: 'user-affiliate-1',
    actorName: 'Demo Affiliate 1',
    actorRole: 'affiliate',
    action: 'VIEW_CLIENT_PROFILE',
    details: 'Viewed authorized birth details for assigned client Demo Client 1 (user-client-1).',
    ipAddress: '127.0.0.1 (Local Demo)',
    isSensitive: true
  },
  {
    id: 'log-3',
    timestamp: '2026-09-26T10:45:00Z',
    actorId: 'user-affiliate-1',
    actorName: 'Demo Affiliate 1',
    actorRole: 'affiliate',
    action: 'GENERATE_JHORA_CHART',
    details: 'Calculated local Vedic sidereal chart for Demo Client 1 (Local engine).',
    ipAddress: '127.0.0.1 (Local Demo)',
    isSensitive: true
  },
  {
    id: 'log-4',
    timestamp: '2026-09-26T11:05:40Z',
    actorId: 'user-admin-demo',
    actorName: 'Demo Admin',
    actorRole: 'admin',
    action: 'REVIEW_APPROVED',
    details: 'Approved client review from Demo Reviewer A after verifying no medical claims.',
    ipAddress: '127.0.0.1 (Local Demo)',
    isSensitive: false
  }
];

// Fictional Prototype Bulletins
export const DEMO_BULLETINS: AdminBulletin[] = [
  {
    id: 'bulletin-1',
    title: 'Mandatory Non-Medical Disclaimer & Ethical Boundaries Reminder',
    content:
      'All affiliated practitioners are reminded that planetary signatures must be articulated exclusively through the lens of vitality rhythms, constitutional temperament, and spiritual reflection. Never discuss medical diagnoses or treatments.',
    priority: 'urgent',
    targetAffiliateId: 'all',
    authorName: 'Demo Admin',
    createdAt: '2026-09-24T09:30:00Z',
    acknowledgedBy: ['user-affiliate-1']
  },
  {
    id: 'bulletin-2',
    title: 'Autumn Consultation Schedule & Room Link Notice',
    content:
      'Please ensure consultation room links are shared with clients 15 minutes before scheduled appointments.',
    priority: 'scheduling',
    targetAffiliateId: 'all',
    authorName: 'Demo Admin',
    createdAt: '2026-09-22T14:15:00Z',
    acknowledgedBy: ['user-affiliate-1', 'user-affiliate-2']
  },
  {
    id: 'bulletin-3',
    title: 'Demo Cycle Honoraria Disbursed (Prototype Record)',
    content:
      'Bi-monthly demonstration partner disbursements have been recorded in the Payout Ledger for prototype verification.',
    priority: 'payout',
    targetAffiliateId: 'all',
    authorName: 'Demo Admin',
    createdAt: '2026-09-18T16:00:00Z',
    acknowledgedBy: ['user-affiliate-1', 'user-affiliate-2']
  }
];

// Fictional Prototype Payouts Ledger
export const DEMO_PAYOUTS: PartnerPayout[] = [
  {
    id: 'payout-101',
    affiliateId: 'user-affiliate-1',
    affiliateName: 'Demo Affiliate 1',
    affiliateEmail: 'demo.affiliate1@example.com',
    amount: 650,
    currency: 'USD',
    method: 'wise',
    methodDetails: 'demo.affiliate1@example.com (Fictional Demo Account)',
    referenceId: 'DEMO-BATCH-2026-01',
    status: 'completed',
    notes: 'Prototype disbursement for completed demonstration consultations.',
    createdAt: '2026-09-18T16:15:00Z',
    processedBy: 'Demo Admin'
  },
  {
    id: 'payout-102',
    affiliateId: 'user-affiliate-2',
    affiliateName: 'Demo Affiliate 2',
    affiliateEmail: 'demo.affiliate2@example.com',
    amount: 420,
    currency: 'USD',
    method: 'bank_wire',
    methodDetails: 'Example Bank · Fictional Account (Demo Only)',
    referenceId: 'DEMO-WIRE-2026-02',
    status: 'completed',
    notes: 'Prototype disbursement for Cartomancy demonstration consultations.',
    createdAt: '2026-09-18T16:20:00Z',
    processedBy: 'Demo Admin'
  }
];
