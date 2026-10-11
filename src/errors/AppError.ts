/**
 * Typed Domain Error Classes
 * 
 * Provides structured errors with error codes, HTTP-like status mapping, 
 * and user-safe display messages.
 */

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'fatal';

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly severity: ErrorSeverity;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, any>;

  constructor(
    message: string,
    code = 'INTERNAL_ERROR',
    statusCode = 500,
    severity: ErrorSeverity = 'error',
    isOperational = true,
    details?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.severity = severity;
    this.isOperational = isOperational;
    this.details = details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', 400, 'warning', true, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Invalid credentials or expired session.') {
    super(message, 'AUTHENTICATION_REQUIRED', 401, 'warning', true);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Access denied. You do not possess the required permission tier.') {
    super(message, 'PERMISSION_DENIED', 403, 'error', true);
  }
}

export class NotFoundError extends AppError {
  constructor(entity: string, identifier?: string) {
    const msg = identifier ? `${entity} with identifier "${identifier}" not found.` : `${entity} not found.`;
    super(msg, 'RESOURCE_NOT_FOUND', 404, 'warning', true);
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Unable to establish connection to the observatory server.') {
    super(message, 'NETWORK_UNAVAILABLE', 503, 'error', true);
  }
}
