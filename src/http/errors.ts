export class IntufindError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly details?: unknown;
  public readonly requestId?: string;

  constructor(
    message: string,
    status = 500,
    options?: { code?: string; details?: unknown; requestId?: string },
  ) {
    super(message);
    this.name = 'IntufindError';
    this.status = status;
    this.code = options?.code;
    this.details = options?.details;
    this.requestId = options?.requestId;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class AuthenticationError extends IntufindError {
  constructor(message = 'Authentication failed', options?: { code?: string; details?: unknown; requestId?: string }) {
    super(message, 401, options);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends IntufindError {
  constructor(message = 'Validation failed', options?: { code?: string; details?: unknown; requestId?: string }) {
    super(message, 400, options);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends IntufindError {
  constructor(message = 'Rate limit exceeded', options?: { code?: string; details?: unknown; requestId?: string }) {
    super(message, 429, options);
    this.name = 'RateLimitError';
  }
}

export class TrialExpiredError extends IntufindError {
  public readonly trialEndedAt?: string;
  public readonly upgradeUrl?: string;

  constructor(
    message = 'Your free trial has ended',
    options?: {
      code?: string;
      details?: unknown;
      requestId?: string;
      trialEndedAt?: string;
      upgradeUrl?: string;
    },
  ) {
    super(message, 402, options);
    this.name = 'TrialExpiredError';
    this.trialEndedAt = options?.trialEndedAt;
    this.upgradeUrl = options?.upgradeUrl;
  }
}

export class NotFoundError extends IntufindError {
  constructor(message = 'Resource not found', options?: { code?: string; details?: unknown; requestId?: string }) {
    super(message, 404, options);
    this.name = 'NotFoundError';
  }
}

export class NetworkError extends IntufindError {
  constructor(message = 'Network error', options?: { code?: string; details?: unknown; requestId?: string }) {
    super(message, 0, options);
    this.name = 'NetworkError';
  }
}
