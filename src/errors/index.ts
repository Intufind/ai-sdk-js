export class IntufindError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.name = 'IntufindError';
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class AuthenticationError extends IntufindError {
  constructor(message = 'Authentication failed', details?: unknown) {
    super(message, 401, details);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends IntufindError {
  constructor(message = 'Validation failed', details?: unknown) {
    super(message, 400, details);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends IntufindError {
  constructor(message = 'Rate limit exceeded', details?: unknown) {
    super(message, 429, details);
    this.name = 'RateLimitError';
  }
}

export class NetworkError extends IntufindError {
  constructor(message = 'Network error', details?: unknown) {
    super(message, 503, details);
    this.name = 'NetworkError';
  }
}

export class NotFoundError extends IntufindError {
  constructor(message = 'Resource not found', details?: unknown) {
    super(message, 404, details);
    this.name = 'NotFoundError';
  }
}
