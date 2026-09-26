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
  PayoutMethod
} from '../types/practice';

const STORAGE_PREFIX = 'medastrology_';

// Initial Website Content
export const INITIAL_SETTINGS: WebsiteSettings = {
  brandName: '[Business Name]',
  tagline: 'Medical Astrology and Cartomancy for reflective spiritual insight.',
  requiredDisclaimer:
    'Services are offered for spiritual and educational purposes only. They are not medical advice, diagnosis, treatment, or a substitute for care from a qualified healthcare professional.',
  contactEmail: 'sanctuary@practice-domain.com',
  contactPhone: '+1 (415) 890-4421',
  officeLocation: 'Pacific Heights Sanctuary, San Francisco, CA & Zurich Enclave',
  aboutStory:
    'Founded as a quiet junction where classical sidereal astronomy meets contemplative cartomancy. We approach personal inquiry through a reflective lens, translating celestial archetypes into grounded somatic self-understanding.',
  aboutPhilosophy:
    'We honor the ancient tradition of Iatromathematics (the symbolic study of planetary signatures in relation to temperamental humors and vitality) as a non-diagnostic, psychological art. We firmly differentiate between spiritual counsel and allopathic clinical medicine.',
  aboutApproach:
    'Each consultation examines your Natal Chart via precision Lahiri sidereal mechanics, planetary transits, and targeted tarot spreads. We never predict terminal illness, recommend pharmaceuticals, or contradict your licensed medical providers.',
  privacyPolicyText:
    'Your birth details, questions, and private consultation summaries are encrypted and protected under strict confidentiality standards. We never monetize or distribute client data.',
  termsText:
    'By booking a consultation, you acknowledge that all observations are symbolic, reflective, and educational in nature. Sessions are not a substitute for clinical psychological or physical healthcare.',
  consentPolicyText:
    'Informed consent is mandatory prior to any birth chart calculation. Clients retain the unencumbered right to inspect their records, withdraw consent, or request complete account deletion at any time.'
};

// Initial Users
export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-admin-1',
    email: 'director@practice.org',
    name: 'Eleanor Vance, M.A.',
    role: 'admin',
    phone: '+1 (415) 555-0199',
    consentGiven: true,
    consentDate: '2026-01-01',
    consentVersion: 'v2.4',
    specialty: 'Lead Medical Astrologer & Clinical Ethicist',
    activeStatus: 'active'
  },
  {
    id: 'user-affiliate-1',
    email: 'dr.croft@practice.org',
    name: 'Dr. Julian Croft',
    role: 'affiliate',
    phone: '+1 (415) 555-0142',
    affiliateCode: 'CROFT20',
    commissionRate: 0.25,
    specialty: 'Sidereal Parashari & 6th/8th Bhava Analysis',
    bio: 'Dual-trained in contemplative hermeneutics and Vedic chronobiology. Focuses on seasonal vitality rhythms and cartomantic spreads.',
    activeStatus: 'active',
    consentGiven: true,
    consentDate: '2026-01-15',
    consentVersion: 'v2.4',
    payoutMethodPreference: 'wise',
    payoutAccountDetails: 'dr.croft@practice.org (Wise Business / Multicurrency)',
    workCapacity: '10 sessions / week'
  },
  {
    id: 'user-affiliate-2',
    email: 'seraphina.lin@practice.org',
    name: 'Seraphina Lin',
    role: 'affiliate',
    phone: '+41 22 555 0188',
    affiliateCode: 'SERAPHINA',
    commissionRate: 0.20,
    specialty: 'Hermetic Cartomancy & Planetary Temperaments',
    bio: 'Specialist in Marseilles archetypes and the elemental balance of earth, fire, air, and water constitutions.',
    activeStatus: 'active',
    consentGiven: true,
    consentDate: '2026-02-01',
    consentVersion: 'v2.4',
    payoutMethodPreference: 'bank_wire',
    payoutAccountDetails: 'UBS Switzerland · IBAN CH93 0024 0240 1234 5678 9 (BIC: UBSWCHZH)',
    workCapacity: '8 sessions / week'
  },
  {
    id: 'user-client-1',
    email: 'elena.vance@studio.org',
    name: 'Elena Vance',
    role: 'client',
    phone: '+1 (415) 778-9011',
    assignedAffiliateId: 'user-affiliate-1',
    birthDate: '1992-08-28',
    birthTime: '06:14',
    birthCity: 'Kyoto, Japan',
    latitude: 35.0116,
    longitude: 135.7681,
    timezone: 'Asia/Tokyo',
    primaryIntention: 'Exploring creative exhaustion patterns and aligning studio work with solar-lunar replenishment cycles.',
    consentGiven: true,
    consentDate: '2026-08-10',
    consentVersion: 'v2.4',
    consentWithdrawn: false
  },
  {
    id: 'user-client-2',
    email: 'marcus.reed@lab.edu',
    name: 'Dr. Marcus Reed',
    role: 'client',
    phone: '+1 (617) 441-2099',
    assignedAffiliateId: 'user-affiliate-1',
    birthDate: '1987-11-14',
    birthTime: '14:42',
    birthCity: 'Cambridge, MA, USA',
    latitude: 42.3736,
    longitude: -71.1097,
    timezone: 'America/New_York',
    primaryIntention: 'Understanding mental hypervigilance under Saturnian transit across natal Mercury.',
    consentGiven: true,
    consentDate: '2026-09-02',
    consentVersion: 'v2.4',
    consentWithdrawn: false
  },
  {
    id: 'user-client-3',
    email: 'ananya.s@arch.co',
    name: 'Ananya Sharma',
    role: 'client',
    phone: '+91 98200 12345',
    assignedAffiliateId: 'user-affiliate-2',
    birthDate: '1995-04-18',
    birthTime: '09:20',
    birthCity: 'Udaipur, India',
    latitude: 24.5854,
    longitude: 73.7125,
    timezone: 'Asia/Kolkata',
    primaryIntention: 'Inquiring into somatic vitality, restorative architecture habits, and cartomancy insights on career pivot.',
    consentGiven: true,
    consentDate: '2026-09-12',
    consentVersion: 'v2.4',
    consentWithdrawn: false
  }
];

// Initial Services
export const INITIAL_SERVICES: ServicePlan[] = [
  {
    id: 'service-ma',
    code: 'M+A',
    name: 'M + A: Medical Astrology Reading',
    shortDesc: 'Precision examination of your Natal Lagna, constitutional temperaments (humors), 6th/8th Bhava indicators, and planetary vitality cycles.',
    fullDesc:
      'An in-depth astrological consultation focusing on constitutional predispositions, energy reserves, and planetary chronobiology. We analyze your sidereal natal chart, current Vimshottari dasha, and transits to clarify periods of natural vitality versus necessary rest.',
    duration: '60 min',
    durationMinutes: 60,
    price: 260,
    currency: 'USD',
    includes: [
      'Comprehensive Sidereal Natal Chart (Lahiri)',
      '6th & 8th Bhava Vitality & Resilience Analysis',
      'Vimshottari Dasha Chronobiology Review',
      'Personalized Astrological Rest & Recovery Timetable',
      'Encrypted Audio Recording & Private Dossier Archive'
    ],
    preparationInstructions:
      'Please verify your birth certificate for exact minute of birth. Have 1-2 reflective intentions prepared regarding your energy rhythms. Note: Do not bring medical lab results; this is a reflective spiritual session.',
    isActive: true,
    isPopular: false
  },
  {
    id: 'service-mc',
    code: 'M+C',
    name: 'M + C: Medical Cartomancy Reading',
    shortDesc: 'Contemplative card-reading focused on the somatic-emotional landscape, psycho-spiritual blocks, and restorative inner archetypes.',
    fullDesc:
      'Utilizing classical Marseilles and symbolic cartomancy decks, this reading maps internal tension, emotional weight, and intuitive subconscious patterns affecting your overall sense of equilibrium and daily flow.',
    duration: '45 min',
    durationMinutes: 45,
    price: 210,
    currency: 'USD',
    includes: [
      'Four-Body Elemental Spread (Physical, Emotional, Mental, Spiritual)',
      'Identification of Subconscious Stressors',
      'Archetypal Medicine Cards & Contemplative Homework',
      'Private High-Res Spread Photography',
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
    shortDesc: 'Our flagship integrated synthesis combining full sidereal medical astrology with deep archetypal cartomancy spreads.',
    fullDesc:
      'Our most comprehensive and sought-after offering. The session begins with full astrological chronobiology—charting planetary humors, dasha periods, and transits—and culminates in a tailored cartomantic spread that grounds the celestial insights into actionable daily rituals.',
    duration: '90 min',
    durationMinutes: 90,
    price: 380,
    currency: 'USD',
    includes: [
      '90-Minute Joint Synthesis Consultation',
      'Full Sidereal Natal Kundali + Transits + Dashas',
      'Constitutional Humor & Elemental Balance Breakdown',
      'Live Cartomancy Spread for Immediate Grounding',
      'Written Practitioner Reading Summary Document',
      '30-Day Reflective Check-In via Encrypted Portal'
    ],
    preparationInstructions:
      'Verify birth coordinates and time. Dedicate 15 minutes before and after the call for quiet reflection. Review and sign the digital consent agreement.',
    isActive: true,
    isPopular: true
  }
];

// Initial Bookings
export const INITIAL_BOOKINGS: BookingSession[] = [
  {
    id: 'book-101',
    clientId: 'user-client-1',
    clientName: 'Elena Vance',
    clientEmail: 'elena.vance@studio.org',
    affiliateId: 'user-affiliate-1',
    affiliateName: 'Dr. Julian Croft',
    serviceId: 'service-mac',
    serviceCode: 'M+A+C',
    serviceName: 'M + A + C: Complete Insight Reading',
    date: '2026-10-04',
    timeSlot: '14:00 GMT',
    status: 'confirmed',
    paymentStatus: 'paid',
    amount: 380,
    clientIntention: 'Navigating nervous exhaustion from creative studio deliverables; aligning quarterly workload with Venusian restoration.',
    birthDetailsSnapshot: {
      date: '1992-08-28',
      time: '06:14',
      city: 'Kyoto, Japan',
      latitude: 35.0116,
      longitude: 135.7681
    },
    consentSnapshot: {
      agreedAt: '2026-08-10T14:32:00Z',
      version: 'v2.4',
      disclaimerAcknowledged: true
    },
    meetingUrl: 'https://sanctuary.practice.org/room/room-elena-vance-101',
    hasSummaryShared: true,
    createdAt: '2026-08-10T14:35:00Z'
  },
  {
    id: 'book-102',
    clientId: 'user-client-2',
    clientName: 'Dr. Marcus Reed',
    clientEmail: 'marcus.reed@lab.edu',
    affiliateId: 'user-affiliate-1',
    affiliateName: 'Dr. Julian Croft',
    serviceId: 'service-ma',
    serviceCode: 'M+A',
    serviceName: 'M + A: Medical Astrology Reading',
    date: '2026-10-12',
    timeSlot: '16:30 GMT',
    status: 'confirmed',
    paymentStatus: 'paid',
    amount: 260,
    clientIntention: 'Examining Saturn transit across 6th house Aries and constitutional nervous system pacing.',
    birthDetailsSnapshot: {
      date: '1987-11-14',
      time: '14:42',
      city: 'Cambridge, MA, USA',
      latitude: 42.3736,
      longitude: -71.1097
    },
    consentSnapshot: {
      agreedAt: '2026-09-02T10:15:00Z',
      version: 'v2.4',
      disclaimerAcknowledged: true
    },
    meetingUrl: 'https://sanctuary.practice.org/room/room-marcus-reed-102',
    hasSummaryShared: false,
    createdAt: '2026-09-02T10:20:00Z'
  },
  {
    id: 'book-103',
    clientId: 'user-client-3',
    clientName: 'Ananya Sharma',
    clientEmail: 'ananya.s@arch.co',
    affiliateId: 'user-affiliate-2',
    affiliateName: 'Seraphina Lin',
    serviceId: 'service-mc',
    serviceCode: 'M+C',
    serviceName: 'M + C: Medical Cartomancy Reading',
    date: '2026-09-20',
    timeSlot: '11:00 GMT',
    status: 'completed',
    paymentStatus: 'paid',
    amount: 210,
    clientIntention: 'Exploring somatic grounding and creative rejuvenation before launching sustainable design foundation.',
    birthDetailsSnapshot: {
      date: '1995-04-18',
      time: '09:20',
      city: 'Udaipur, India',
      latitude: 24.5854,
      longitude: 73.7125
    },
    consentSnapshot: {
      agreedAt: '2026-09-12T09:00:00Z',
      version: 'v2.4',
      disclaimerAcknowledged: true
    },
    meetingUrl: 'https://sanctuary.practice.org/room/room-ananya-103',
    hasSummaryShared: true,
    createdAt: '2026-09-12T09:05:00Z'
  }
];

// Initial Reading Summaries (Client-facing if shared)
export const INITIAL_SUMMARIES: ReadingSummary[] = [
  {
    id: 'sum-101',
    bookingId: 'book-101',
    clientId: 'user-client-1',
    authorId: 'user-affiliate-1',
    authorName: 'Dr. Julian Croft',
    createdAt: '2026-08-11T16:00:00Z',
    updatedAt: '2026-08-12T11:20:00Z',
    title: 'Constitutional Vitality & Creative Replenishment Folio',
    coreAstrologicalFocus:
      'Leo Lagna with Moon in Purva Phalguni. The constitutional humor is Bilious-Airy (Pitta-Vata). The current Venus Mahadasha highlights relational harmony and somatic hospitality, but demands shielding against over-commitment during Mercury sub-periods.',
    cartomancySpreads:
      'Spread: The Four Pillars of Restoration.\n• Card I (Somatic Root): The Empress (Receptivity over exertion)\n• Card II (Mental Atmosphere): Two of Swords (Resolving boundary conflicts)\n• Card III (Spiritual Alignment): The Star (Renewed faith in organic timing)',
    reflectiveInsights:
      'Notice how your creative endurance peaks during midday sunlight, followed by a necessary dip in late afternoon. Honor this rhythm without self-judgment. Establish quiet evening unwinding free of screens.',
    suggestedContemplations: [
      'Practice 20 minutes of silent walking in nature following client presentations.',
      'Sip warm infusion of chamomile, fennel, and licorice during high-intensity planning weeks.',
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
    authorName: 'Seraphina Lin',
    createdAt: '2026-09-20T12:30:00Z',
    updatedAt: '2026-09-20T14:00:00Z',
    title: 'Elemental Balance & Cartomantic Synthesis',
    coreAstrologicalFocus:
      'Taurus Lagna with exalted Venus in Pisces. A highly artistic, tactile constitution requiring grounded earth elements to counterbalance deep empathetic sensitivity.',
    cartomancySpreads:
      'Spread: The Hearth of Wellbeing.\n• Somatic: Ace of Pentacles (Deep physical grounding in home space)\n• Friction: Eight of Wands (Rushing design deadlines creates somatic fatigue)\n• Resolution: Temperance (Pacing creative output with rhythmic recovery)',
    reflectiveInsights:
      'Your physical equilibrium is directly tied to the sensory harmony of your workspace. Declutter and integrate organic materials to support mental stillness.',
    suggestedContemplations: [
      'Dedicate Sunday mornings to complete silence and spatial organization.',
      'Notice when mental impatience creates tension in the shoulders.'
    ],
    isSharedWithClient: true,
    sharedAt: '2026-09-20T14:10:00Z'
  }
];

// Initial Practitioner Private Notes (Affiliate/Admin only, NEVER shown to client)
export const INITIAL_NOTES: PractitionerNote[] = [
  {
    id: 'note-1',
    clientId: 'user-client-1',
    authorId: 'user-affiliate-1',
    createdAt: '2026-08-11T15:30:00Z',
    updatedAt: '2026-08-11T15:30:00Z',
    category: 'Constitutional Tendencies',
    text: 'Client displays classical high-achiever Pitta aggravation masking underlying Vata depletion. Reminded client strictly that our sessions are reflective and not medical advice; recommended continuing collaboration with her licensed sleep therapist.',
    isPrivate: true
  },
  {
    id: 'note-2',
    clientId: 'user-client-2',
    authorId: 'user-affiliate-1',
    createdAt: '2026-09-03T11:00:00Z',
    updatedAt: '2026-09-03T11:00:00Z',
    category: 'Dasha Dynamics',
    text: 'Upcoming Saturn dasha transition may bring introspection around career sustainability. Focus consultation on cognitive pacing and work-rest boundaries.',
    isPrivate: true
  }
];

// Initial Messages
export const INITIAL_MESSAGES: DirectMessage[] = [
  {
    id: 'msg-1',
    senderId: 'user-client-1',
    senderName: 'Elena Vance',
    senderRole: 'client',
    recipientId: 'user-affiliate-1',
    recipientName: 'Dr. Julian Croft',
    text: 'Hello Dr. Croft, I have reviewed the reading summary and the suggested contemplations on boundary pacing. It resonates deeply with my current studio schedule.',
    timestamp: '2026-09-24T10:15:00Z',
    isRead: true
  },
  {
    id: 'msg-2',
    senderId: 'user-affiliate-1',
    senderName: 'Dr. Julian Croft',
    senderRole: 'affiliate',
    recipientId: 'user-client-1',
    recipientName: 'Elena Vance',
    text: 'Wonderful, Elena. Remember to let those insights settle organically over the next fortnight as the Moon reaches waxing gibbous. Take gentle care.',
    timestamp: '2026-09-24T11:02:00Z',
    isRead: true
  }
];

// Initial Reviews (Strictly non-medical)
export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    clientName: 'Aria Montcalm',
    rating: 5,
    serviceUsed: 'M + A + C: Complete Insight Reading',
    date: 'August 2026',
    quote:
      'An extraordinarily dignified and intellectually profound consultation. The analysis of my astrological constitution helped me understand my natural energy rhythms and design a sustainable work schedule without guilt.',
    isApproved: true,
    order: 1,
    hasMedicalClaims: false
  },
  {
    id: 'rev-2',
    clientName: 'Julian H., Architect',
    rating: 5,
    serviceUsed: 'M + A: Medical Astrology Reading',
    date: 'July 2026',
    quote:
      'What impressed me most was the strict ethical boundary: zero superstition, zero pseudo-medical claims. Just clear, luminous symbolic insight that gave me peace during a major vocational pivot.',
    isApproved: true,
    order: 2,
    hasMedicalClaims: false
  },
  {
    id: 'rev-3',
    clientName: 'Dr. Soraya Mir',
    rating: 5,
    serviceUsed: 'M + C: Medical Cartomancy Reading',
    date: 'September 2026',
    quote:
      'The cartomancy spread acted like a mirror for subconscious stress I hadn’t articulated to myself. It provided deep psychological clarity and calm.',
    isApproved: true,
    order: 3,
    hasMedicalClaims: false
  },
  {
    id: 'rev-4',
    clientName: 'Anonymous Reviewer',
    rating: 4,
    serviceUsed: 'M + A: Medical Astrology Reading',
    date: 'September 2026',
    quote:
      'The practitioner cured my chronic back pain with their herbal recommendation.',
    isApproved: false,
    order: 4,
    hasMedicalClaims: true // Flagged by auto-filter for medical claim
  }
];

// Initial Knowledge Centre Notes
export const INITIAL_KNOWLEDGE_NOTES: KnowledgeNote[] = [
  {
    id: 'kn-1',
    title: 'The Doctrine of Four Humors in Parashari Jyotish',
    category: 'Medical Astrology Principles',
    tags: ['Humors', 'Pitta', 'Vata', 'Kapha', 'Doshic Balance'],
    excerpt: 'Correlating Ayurvedic Tridoshas with Sidereal planetary rulers and zodiacal elements.',
    content:
      'In classical Iatromathematics, Sun and Mars are naturally Pitta (fiery/choleric); Moon and Venus are Kapha (watery/phlegmatic); Saturn is Vata (dry/airy/melancholic); Mercury is Tridoshic and mirrors its associations; Jupiter is balanced Kapha-Pitta. The practitioner assesses constitutional balance by examining the Lagna lord, 6th lord, and luminaries without making clinical diagnoses.',
    author: 'Eleanor Vance, M.A.',
    updatedAt: '2026-08-15',
    accessLevel: 'affiliate_accessible'
  },
  {
    id: 'kn-2',
    title: 'Cartomancy Spread Protocol: The Four Bodies of Vitality',
    category: 'Reading Templates',
    tags: ['Tarot Protocol', 'Marseilles', 'Somatic Spread'],
    excerpt: 'Step-by-step practitioner template for laying out the Four Elements during an M+C session.',
    content:
      '1. Card 1 (Earth / Somatic Ground): Inquires into physical grounding and nourishment.\n2. Card 2 (Water / Emotional Tide): Inquires into relational holding and processing.\n3. Card 3 (Air / Mental Clarity): Inquires into cognitive pacing and digital strain.\n4. Card 4 (Fire / Creative Spark): Inquires into motivation and purposeful agency.',
    author: 'Seraphina Lin',
    updatedAt: '2026-09-01',
    accessLevel: 'affiliate_accessible'
  },
  {
    id: 'kn-3',
    title: 'Ethical Non-Diagnostic Boundaries & Legal Compliance Protocol',
    category: 'Ethical Guidelines',
    tags: ['Ethics', 'Compliance', 'Non-Medical Policy', 'Disclaimers'],
    excerpt: 'Mandatory standard operating procedure for all affiliated practitioners.',
    content:
      'Practitioners MUST explicitly restate the non-medical disclaimer at the beginning of each session. Under no circumstances may a practitioner recommend stopping prescribed medication, suggest dietary remedies for disease cure, or interpret chart positions as somatic illness predictions. Violations lead to immediate affiliate deactivation.',
    author: 'Eleanor Vance, M.A.',
    updatedAt: '2026-07-20',
    accessLevel: 'affiliate_accessible'
  }
];

export const INITIAL_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'doc-1',
    name: 'Practitioner_Ethics_and_Scope_of_Practice_Manual.pdf',
    category: 'Regulatory & Ethics',
    format: 'Protocol',
    size: '1.2 MB',
    uploadedAt: '2026-08-01',
    accessLevel: 'affiliate_accessible',
    description: 'Mandatory guidelines for maintaining professional boundaries and client informed consent.'
  },
  {
    id: 'doc-2',
    name: 'JHora_Sidereal_Calculations_Reference_Sheet.pdf',
    category: 'Astrology Reference',
    format: 'Guide',
    size: '850 KB',
    uploadedAt: '2026-08-10',
    accessLevel: 'affiliate_accessible',
    description: 'Complete breakdown of Parashari sidereal Lahiri math, planetary aspects, and dasha timing.'
  },
  {
    id: 'doc-3',
    name: 'Client_Reading_Summary_Standard_Template.docx',
    category: 'Reading Templates',
    format: 'Template',
    size: '340 KB',
    uploadedAt: '2026-09-05',
    accessLevel: 'affiliate_accessible',
    description: 'Professional layout for generating client-facing summaries with reflective homework.'
  }
];

// Initial Research Workspace Data
export const INITIAL_RESEARCH_STUDY: ResearchStudy = {
  id: 'study-vitality-2026',
  protocolNumber: 'IRB-ASTRO-2026-04B',
  title: 'Correlations Between Saturnian Transits (6th/8th Bhava) and Subjective Burnout Recovery Times',
  hypothesis:
    'Subjects undergoing major Saturn-Ketu or Saturn-Rahu transit aspects to natal Moon who engage in structured weekly restorative pacing report a 30% greater subjective vitality recovery score over 90 days.',
  leadResearcher: 'Eleanor Vance, M.A. (Director)',
  status: 'Active',
  limitations: [
    'Observational exploratory study; not a controlled medical trial.',
    'Subjective wellbeing self-reports are subject to recall bias.',
    'Astrological variables are correlated, not established as causative biological mechanisms.'
  ],
  variableCount: 14,
  sampleSize: 42
};

export const INITIAL_RESEARCH_PARTICIPANTS: ResearchParticipant[] = [
  {
    id: 'rp-1',
    deidentifiedId: 'SUBJ-8841',
    intakeDate: '2026-07-14',
    consentActive: true,
    primaryAstrologicalSignatures: ['Saturn transiting 6th house Aries', 'Moon in Leo (Purva Phalguni)', 'Venus-Mercury Dasha'],
    verifiedOutcomeCategory: 'Reported 45% reduction in subjective fatigue and stabilized sleep onset.',
    outcomeDate: '2026-08-18',
    outcomeSource: 'Standardized Wellbeing Scale',
    researchNotes: 'Subject completed 4-week restorative walking protocol. Correlated with transit passing exact natal degree.',
    associatedHypothesisId: 'study-vitality-2026',
    withdrawn: false
  },
  {
    id: 'rp-2',
    deidentifiedId: 'SUBJ-8842',
    intakeDate: '2026-08-01',
    consentActive: true,
    primaryAstrologicalSignatures: ['Jupiter transiting 1st house Taurus', 'Moon in Pisces (Revati)', 'Rahu Mahadasha'],
    verifiedOutcomeCategory: 'Enhanced creative flow and resolution of creative block.',
    outcomeDate: '2026-09-05',
    outcomeSource: 'Reflective Journal Submission',
    researchNotes: 'Subject utilized weekly cartomantic contemplation spread. High adherence.',
    associatedHypothesisId: 'study-vitality-2026',
    withdrawn: false
  },
  {
    id: 'rp-3',
    deidentifiedId: 'SUBJ-8843',
    intakeDate: '2026-08-20',
    consentActive: true,
    primaryAstrologicalSignatures: ['Mars retrograde in 8th house Gemini', 'Sun in Virgo (Hasta)', 'Saturn Antardasha'],
    verifiedOutcomeCategory: 'Gradual normalization of evening cortisol surge through breathwork.',
    outcomeDate: '2026-09-22',
    outcomeSource: 'Self-Report Followup Survey (30 Days)',
    researchNotes: 'Subject adhered to screen curfew during Mars station phase.',
    associatedHypothesisId: 'study-vitality-2026',
    withdrawn: false
  }
];

// Initial Security Audit Logs
export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-26T10:14:22Z',
    actorId: 'user-admin-1',
    actorName: 'Eleanor Vance',
    actorRole: 'admin',
    action: 'LOGIN',
    details: 'Successful 2FA authentication to Admin Portal from trusted IP.',
    ipAddress: '198.51.100.4',
    isSensitive: false
  },
  {
    id: 'log-2',
    timestamp: '2026-09-26T10:30:15Z',
    actorId: 'user-affiliate-1',
    actorName: 'Dr. Julian Croft',
    actorRole: 'affiliate',
    action: 'VIEW_CLIENT_PROFILE',
    details: 'Viewed authorized birth details for assigned client Elena Vance (user-client-1).',
    ipAddress: '198.51.100.18',
    isSensitive: true
  },
  {
    id: 'log-3',
    timestamp: '2026-09-26T10:45:00Z',
    actorId: 'user-affiliate-1',
    actorName: 'Dr. Julian Croft',
    actorRole: 'affiliate',
    action: 'GENERATE_JHORA_CHART',
    details: 'Generated Sidereal Lahiri Kundali for Elena Vance via JHora backend service.',
    ipAddress: '198.51.100.18',
    isSensitive: true
  },
  {
    id: 'log-4',
    timestamp: '2026-09-26T11:05:40Z',
    actorId: 'user-admin-1',
    actorName: 'Eleanor Vance',
    actorRole: 'admin',
    action: 'REVIEW_APPROVED',
    details: 'Approved client review from Julian H. after verifying no medical claims.',
    ipAddress: '198.51.100.4',
    isSensitive: false
  }
];

// Initial Practice Bulletins (Admin Broadcasts to Practitioners)
export const INITIAL_BULLETINS: AdminBulletin[] = [
  {
    id: 'bulletin-1',
    title: 'Mandatory Non-Medical Disclaimer & 6th/8th Bhava Ethical Protocol',
    content:
      'All affiliated practitioners are reminded that planetary signatures (especially 6th/8th house indicators and Mars/Saturn transits) must be articulated exclusively through the lens of vitality rhythms, constitutional temperament, and spiritual reflection. Never discuss medical diagnoses, prescriptions, or clinical prognoses.',
    priority: 'urgent',
    targetAffiliateId: 'all',
    authorName: 'Eleanor Vance, M.A. (Director)',
    createdAt: '2026-09-24T09:30:00Z',
    acknowledgedBy: ['user-affiliate-1']
  },
  {
    id: 'bulletin-2',
    title: 'Autumn Consultation Schedule & Room Link Upgrades',
    content:
      'Private sanctuary consultation rooms have been migrated to encrypted end-to-end WebRTC channels. Please ensure client audio links are shared 15 minutes before scheduled appointments.',
    priority: 'scheduling',
    targetAffiliateId: 'all',
    authorName: 'Eleanor Vance, M.A. (Director)',
    createdAt: '2026-09-22T14:15:00Z',
    acknowledgedBy: ['user-affiliate-1', 'user-affiliate-2']
  },
  {
    id: 'bulletin-3',
    title: 'Cycle 18 Honoraria Disbursed via Bank Wire & Wise',
    content:
      'Bi-monthly partner disbursements for completed consultations have been settled. Review the Payout Ledger in your Affiliate Desk for reference IDs and fee statements.',
    priority: 'payout',
    targetAffiliateId: 'all',
    authorName: 'Eleanor Vance, M.A. (Director)',
    createdAt: '2026-09-18T16:00:00Z',
    acknowledgedBy: ['user-affiliate-1', 'user-affiliate-2']
  }
];

// Initial Partner Payouts Ledger
export const INITIAL_PAYOUTS: PartnerPayout[] = [
  {
    id: 'payout-101',
    affiliateId: 'user-affiliate-1',
    affiliateName: 'Dr. Julian Croft',
    affiliateEmail: 'dr.croft@practice.org',
    amount: 650,
    currency: 'USD',
    method: 'wise',
    methodDetails: 'dr.croft@practice.org (Wise Business Multi-Currency)',
    referenceId: 'WISE-BATCH-2026-9812',
    status: 'completed',
    notes: 'Disbursement for August & September completed M+A+C consultations & chart folios.',
    createdAt: '2026-09-18T16:15:00Z',
    processedBy: 'Eleanor Vance, M.A.'
  },
  {
    id: 'payout-102',
    affiliateId: 'user-affiliate-2',
    affiliateName: 'Seraphina Lin',
    affiliateEmail: 'seraphina.lin@practice.org',
    amount: 420,
    currency: 'USD',
    method: 'bank_wire',
    methodDetails: 'UBS Switzerland · IBAN CH93 0024 0240 1234 5678 9 (BIC: UBSWCHZH)',
    referenceId: 'WIRE-SEPA-887410',
    status: 'completed',
    notes: 'Disbursement for August Cartomancy consultations and archetypal spreads.',
    createdAt: '2026-09-18T16:20:00Z',
    processedBy: 'Eleanor Vance, M.A.'
  }
];

// State Store Helper
export class PracticeStore {
  private static load<T>(key: string, defaultVal: T): T {
    if (typeof window === 'undefined') return defaultVal;
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + key);
      return saved ? JSON.parse(saved) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  private static save<T>(key: string, val: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val));
    } catch {
      // storage quota or private browsing
    }
  }

  // Getters
  static getSettings(): WebsiteSettings {
    return this.load('settings', INITIAL_SETTINGS);
  }

  static saveSettings(settings: WebsiteSettings): void {
    this.save('settings', settings);
    this.logAction('user-admin-1', 'Eleanor Vance', 'admin', 'SETTINGS_CHANGED', 'Updated website content, disclaimer, or brand name.');
  }

  static getUsers(): UserProfile[] {
    return this.load('users', INITIAL_USERS);
  }

  static saveUsers(users: UserProfile[]): void {
    this.save('users', users);
  }

  static getServices(): ServicePlan[] {
    return this.load('services', INITIAL_SERVICES);
  }

  static saveServices(services: ServicePlan[]): void {
    this.save('services', services);
  }

  static getBookings(): BookingSession[] {
    return this.load('bookings', INITIAL_BOOKINGS);
  }

  static saveBookings(bookings: BookingSession[]): void {
    this.save('bookings', bookings);
  }

  static getSummaries(): ReadingSummary[] {
    return this.load('summaries', INITIAL_SUMMARIES);
  }

  static saveSummaries(summaries: ReadingSummary[]): void {
    this.save('summaries', summaries);
  }

  static getNotes(): PractitionerNote[] {
    return this.load('notes', INITIAL_NOTES);
  }

  static saveNotes(notes: PractitionerNote[]): void {
    this.save('notes', notes);
  }

  static getMessages(): DirectMessage[] {
    return this.load('messages', INITIAL_MESSAGES);
  }

  static saveMessages(messages: DirectMessage[]): void {
    this.save('messages', messages);
  }

  static getReviews(): ReviewItem[] {
    return this.load('reviews', INITIAL_REVIEWS);
  }

  static saveReviews(reviews: ReviewItem[]): void {
    this.save('reviews', reviews);
  }

  static getKnowledgeNotes(): KnowledgeNote[] {
    return this.load('knowledge_notes', INITIAL_KNOWLEDGE_NOTES);
  }

  static saveKnowledgeNotes(notes: KnowledgeNote[]): void {
    this.save('knowledge_notes', notes);
  }

  static getDocuments(): KnowledgeDocument[] {
    return this.load('documents', INITIAL_DOCUMENTS);
  }

  static saveDocuments(docs: KnowledgeDocument[]): void {
    this.save('documents', docs);
  }

  static getResearchStudy(): ResearchStudy {
    return this.load('research_study', INITIAL_RESEARCH_STUDY);
  }

  static getResearchParticipants(): ResearchParticipant[] {
    return this.load('research_participants', INITIAL_RESEARCH_PARTICIPANTS);
  }

  static saveResearchParticipants(participants: ResearchParticipant[]): void {
    this.save('research_participants', participants);
  }

  static getAuditLogs(): AuditLogEntry[] {
    return this.load('audit_logs', INITIAL_AUDIT_LOGS);
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
      ipAddress: '198.51.100.12',
      isSensitive
    };
    logs.unshift(newLog);
    this.save('audit_logs', logs.slice(0, 150));
  }

  // Bulletins & Practice Announcements (Live Sync to Practitioners)
  static getBulletins(): AdminBulletin[] {
    return this.load('bulletins', INITIAL_BULLETINS);
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
      'user-admin-1',
      'Eleanor Vance',
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
    return this.load('payouts', INITIAL_PAYOUTS);
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
      title: `Honoraria Disbursed: $${newPayout.amount.toLocaleString()} USD`,
      content: `Disbursement of $${newPayout.amount} USD via ${newPayout.method.replace('_', ' ').toUpperCase()} (Ref: ${newPayout.referenceId}) has been successfully processed for ${newPayout.affiliateName}.`,
      priority: 'payout',
      targetAffiliateId: newPayout.affiliateId,
      authorName: 'Eleanor Vance, M.A. (Director)'
    });

    this.logAction(
      'user-admin-1',
      'Eleanor Vance',
      'admin',
      'PAYOUT_DISBURSED',
      `Sent $${newPayout.amount} USD to ${newPayout.affiliateName} via ${newPayout.method} (Ref: ${newPayout.referenceId}).`
    );
    this.notifySync('PAYOUT_SENT', newPayout);
    return newPayout;
  }

  // Affiliate Partner Management (Add, Update, Remove / Reassign)
  static addAffiliate(
    data: Omit<UserProfile, 'id' | 'role' | 'consentGiven'>
  ): UserProfile {
    const users = this.getUsers();
    const id = `user-affiliate-${Date.now().toString(36)}`;
    const newAffiliate: UserProfile = {
      ...data,
      id,
      role: 'affiliate',
      consentGiven: true,
      consentDate: new Date().toISOString().split('T')[0],
      consentVersion: 'v2.4',
      activeStatus: data.activeStatus || 'active',
      commissionRate: data.commissionRate ?? 0.25,
      payoutMethodPreference: data.payoutMethodPreference || 'wise',
      payoutAccountDetails: data.payoutAccountDetails || ''
    };

    const updated = [...users, newAffiliate];
    this.saveUsers(updated);

    this.logAction(
      'user-admin-1',
      'Eleanor Vance',
      'admin',
      'AFFILIATE_ADDED',
      `Added new practitioner partner: ${newAffiliate.name} (${newAffiliate.specialty}).`
    );

    // Sync notification bulletin
    this.addBulletin({
      title: `Welcome New Partner: ${newAffiliate.name}`,
      content: `${newAffiliate.name} has joined the practice cohort specializing in ${newAffiliate.specialty}. Roster assignments and consultation rooms are now open.`,
      priority: 'general',
      targetAffiliateId: 'all',
      authorName: 'Eleanor Vance, M.A. (Director)'
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
        'user-admin-1',
        'Eleanor Vance',
        'admin',
        'AFFILIATE_STATUS_CHANGED',
        `Updated profile details for partner ${affiliateId}.`
      );
      this.notifySync('AFFILIATE_UPDATED', updatedProfile);
    }
    return updatedProfile;
  }

  static removeAffiliate(
    affiliateId: string,
    reassignToAffiliateId?: string
  ): { success: boolean; reassignedCount: number } {
    const users = this.getUsers();
    const bookings = this.getBookings();
    const affiliateToRemove = users.find((u) => u.id === affiliateId);
    if (!affiliateToRemove) return { success: false, reassignedCount: 0 };

    let reassignedCount = 0;
    const targetAffiliate = users.find((u) => u.id === reassignToAffiliateId);

    // 1. Reassign clients
    const updatedUsers = users
      .map((u) => {
        if (u.role === 'client' && u.assignedAffiliateId === affiliateId) {
          reassignedCount++;
          return {
            ...u,
            assignedAffiliateId: targetAffiliate ? targetAffiliate.id : undefined
          };
        }
        return u;
      })
      .filter((u) => u.id !== affiliateId); // Remove partner from user list

    // 2. Reassign future bookings if needed
    const updatedBookings = bookings.map((b) => {
      if (b.affiliateId === affiliateId) {
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
      'user-admin-1',
      'Eleanor Vance',
      'admin',
      'AFFILIATE_REMOVED',
      `Removed partner ${affiliateToRemove.name}. ${reassignedCount} clients ${targetAffiliate ? `reassigned to ${targetAffiliate.name}` : 'set to unassigned'}.`
    );

    this.addBulletin({
      title: `Practice Roster Update`,
      content: `${affiliateToRemove.name} has departed from active practice. Active client consultations have been ${targetAffiliate ? `reallocated to ${targetAffiliate.name}` : 'routed to the sanctuary executive queue'}.`,
      priority: 'scheduling',
      targetAffiliateId: 'all',
      authorName: 'Eleanor Vance, M.A. (Director)'
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

      // Pending works: sessions to conduct + summaries to draft/share + unread client inquiries
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

      // Financials
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

  // Cross-Applet Real-Time Event Sync Dispatcher
  static notifySync(type: string, payload?: any): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('medastrology_sync', {
          detail: { type, payload, timestamp: Date.now() }
        })
      );
    }
  }

  static subscribe(
    listener: (event: { type: string; payload?: any; timestamp: number }) => void
  ): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      listener(customEvent.detail);
    };
    window.addEventListener('medastrology_sync', handler);
    return () => {
      window.removeEventListener('medastrology_sync', handler);
    };
  }

  // Active Session Role Tracking
  static getActiveRole(): UserRole {
    return this.load('active_role', 'public');
  }

  static setActiveRole(role: UserRole): void {
    this.save('active_role', role);
  }

  static getActiveUserId(): string {
    const role = this.getActiveRole();
    if (role === 'admin') return 'user-admin-1';
    if (role === 'affiliate') return 'user-affiliate-1';
    if (role === 'client') return 'user-client-1';
    return '';
  }
}
