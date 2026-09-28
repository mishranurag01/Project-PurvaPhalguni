/**
 * Prototype API Service Layer Index
 *
 * This layer encapsulates all platform data operations behind clean interfaces.
 * Currently backed by in-memory prototype stores; ready to be replaced with
 * real REST/GraphQL/Firebase endpoints in production.
 */

export * from './authService';
export * from './userService';
export * from './clientProfileService';
export * from './assignmentService';
export * from './bookingService';
export * from './paymentService';
export * from './messageService';
export * from './consentService';
export * from './chartService';
export * from './notesService';
export * from './reviewService';
export * from './studyMaterialService';
export * from './researchService';
export * from './auditService';
