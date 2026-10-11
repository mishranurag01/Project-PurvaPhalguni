import { AppError } from './AppError';

export interface UserFacingError {
  title: string;
  message: string;
  code: string;
  canRetry: boolean;
}

/**
 * Normalizes any caught unknown error into a structured UserFacingError
 */
export function normalizeError(err: unknown): UserFacingError {
  if (err instanceof AppError) {
    return {
      title: formatErrorTitle(err.code),
      message: err.message,
      code: err.code,
      canRetry: err.statusCode !== 401 && err.statusCode !== 403
    };
  }

  if (err instanceof Error) {
    return {
      title: 'Unexpected Application Issue',
      message: err.message || 'An unforeseen issue arose while executing this operation.',
      code: 'UNEXPECTED_ERROR',
      canRetry: true
    };
  }

  return {
    title: 'Unknown Encounter',
    message: 'An unknown system exception occurred. Please try again shortly.',
    code: 'UNKNOWN_ERROR',
    canRetry: true
  };
}

function formatErrorTitle(code: string): string {
  switch (code) {
    case 'VALIDATION_ERROR':
      return 'Verification Notice';
    case 'AUTHENTICATION_REQUIRED':
      return 'Authentication Notice';
    case 'PERMISSION_DENIED':
      return 'Restricted Enclave';
    case 'RESOURCE_NOT_FOUND':
      return 'Folio Missing';
    case 'NETWORK_UNAVAILABLE':
      return 'Connection Interrupted';
    default:
      return 'Notice';
  }
}

/**
 * Safe error logging
 */
export function logError(error: unknown, context?: string): void {
  const norm = normalizeError(error);
  if (import.meta.env.DEV) {
    console.error(`[PURVAPHALGUNI Error: ${context || 'General'}] [${norm.code}]`, error);
  }
}
