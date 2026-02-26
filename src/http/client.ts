import type { ApiResponse, ClientOptions } from '../types/common';
import {
  AuthenticationError,
  IntufindError,
  NetworkError,
  NotFoundError,
  RateLimitError,
  TrialExpiredError,
  ValidationError,
} from './errors';

const DEFAULT_API_ENDPOINT = 'https://api.intufind.com';
const DEFAULT_STREAMING_ENDPOINT = 'https://streaming.intufind.com';
const DEFAULT_TIMEOUT = 30_000;
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1_000;

interface InternalRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeout?: number;
}

export class HttpClient {
  readonly apiEndpoint: string;
  readonly streamingEndpoint: string;
  /** Snapshot of the options used to create this client, useful for deriving new instances. */
  readonly opts: Readonly<ClientOptions>;

  private readonly apiKey: string;
  private readonly workspaceId?: string;
  private readonly timeout: number;
  private readonly maxRetries: number;
  private readonly retryDelay: number;
  private readonly debug: boolean;
  private readonly customHeaders: Record<string, string>;

  constructor(options: ClientOptions) {
    if (!options.apiKey) {
      throw new Error('apiKey is required');
    }

    this.apiKey = options.apiKey;
    this.apiEndpoint = (options.apiEndpoint || DEFAULT_API_ENDPOINT).replace(/\/$/, '');
    this.streamingEndpoint = (options.streamingEndpoint || DEFAULT_STREAMING_ENDPOINT).replace(/\/$/, '');
    this.workspaceId = options.workspaceId;
    this.timeout = options.timeout ?? DEFAULT_TIMEOUT;
    this.maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
    this.retryDelay = options.retryDelay ?? DEFAULT_RETRY_DELAY;
    this.debug = options.debug ?? false;
    this.customHeaders = options.headers ?? {};

    this.opts = Object.freeze({ ...options });
  }

  private buildHeaders(extra?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
      ...this.customHeaders,
      ...extra,
    };

    if (this.workspaceId) {
      headers['X-Workspace-ID'] = this.workspaceId;
    }

    return headers;
  }

  private throwApiError(status: number, body: unknown, requestId?: string): never {
    const data = body as Record<string, unknown>;

    // The API returns errors as { error: { message, code } } — extract from the nested object
    const errorObj = typeof data.error === 'object' && data.error !== null
      ? (data.error as Record<string, unknown>)
      : undefined;

    const message = errorObj?.message as string
      ?? (typeof data.error === 'string' ? data.error : undefined)
      ?? data.message as string
      ?? 'Unknown error';

    const code = (errorObj?.code ?? data.code) as string | undefined;
    const details = errorObj?.details ?? data.details;
    const opts = { code, details, requestId };

    switch (status) {
      case 400:
        throw new ValidationError(message, opts);
      case 401:
        throw new AuthenticationError(message, opts);
      case 402:
        throw new TrialExpiredError(message, {
          ...opts,
          trialEndedAt: data.trial_ended_at as string | undefined,
          upgradeUrl: data.upgrade_url as string | undefined,
        });
      case 404:
        throw new NotFoundError(message, opts);
      case 429:
        throw new RateLimitError(message, opts);
      default:
        throw new IntufindError(message, status, opts);
    }
  }

  private isRetryable(error: unknown): boolean {
    if (
      error instanceof AuthenticationError ||
      error instanceof ValidationError ||
      error instanceof NotFoundError ||
      error instanceof TrialExpiredError
    ) {
      return false;
    }
    if (error instanceof IntufindError && error.status >= 400 && error.status < 500) {
      return false;
    }
    return true;
  }

  private log(...args: unknown[]): void {
    if (this.debug) {
      console.log('[Intufind SDK]', ...args);
    }
  }

  async request<T>(path: string, options: InternalRequestOptions): Promise<ApiResponse<T>> {
    const { method, body, headers: extraHeaders, signal: externalSignal, timeout: requestTimeout } = options;
    const url = `${this.apiEndpoint}${path}`;
    const headers = this.buildHeaders(extraHeaders);
    const effectiveTimeout = requestTimeout ?? this.timeout;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        this.log(`${method} ${url}`, attempt > 0 ? `(retry ${attempt})` : '');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), effectiveTimeout);

        if (externalSignal) {
          externalSignal.addEventListener('abort', () => controller.abort(), { once: true });
        }

        const response = await fetch(url, {
          method,
          headers,
          body: body !== undefined ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const requestId = response.headers.get('x-request-id') ?? undefined;
        const text = await response.text();
        let parsed: unknown;

        try {
          parsed = text ? JSON.parse(text) : {};
        } catch {
          parsed = { message: text };
        }

        this.log(`Response ${response.status}`, parsed);

        if (!response.ok) {
          this.throwApiError(response.status, parsed, requestId);
        }

        const envelope = parsed as { data?: T; tierLimits?: unknown; usage?: unknown };
        return {
          data: envelope.data as T,
          tierLimits: envelope.tierLimits,
          usage: envelope.usage,
        } as ApiResponse<T>;
      } catch (error) {
        lastError = error as Error;

        if (!this.isRetryable(error) || attempt === this.maxRetries) {
          throw error;
        }

        const delay = this.retryDelay * 2 ** attempt;
        this.log(`Retrying in ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }

    throw lastError ?? new NetworkError('Request failed after all retry attempts');
  }

  async get<T>(path: string, opts?: { signal?: AbortSignal; headers?: Record<string, string> }): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: 'GET', ...opts });
  }

  async post<T>(path: string, body?: unknown, opts?: { signal?: AbortSignal; headers?: Record<string, string> }): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: 'POST', body, ...opts });
  }

  async put<T>(path: string, body?: unknown, opts?: { signal?: AbortSignal; headers?: Record<string, string> }): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: 'PUT', body, ...opts });
  }

  async patch<T>(path: string, body?: unknown, opts?: { signal?: AbortSignal; headers?: Record<string, string> }): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: 'PATCH', body, ...opts });
  }

  async del<T>(path: string, opts?: { body?: unknown; signal?: AbortSignal; headers?: Record<string, string> }): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: 'DELETE', ...opts });
  }

  async streamRequest(path: string, body: unknown, signal?: AbortSignal): Promise<Response> {
    const url = `${this.streamingEndpoint}${path}`;
    const headers = this.buildHeaders();

    this.log(`STREAM POST ${url}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    if (signal) {
      signal.addEventListener('abort', () => controller.abort(), { once: true });
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const requestId = response.headers.get('x-request-id') ?? undefined;
      const text = await response.text();
      let parsed: unknown;
      try {
        parsed = text ? JSON.parse(text) : {};
      } catch {
        parsed = { message: text };
      }
      this.throwApiError(response.status, parsed, requestId);
    }

    return response;
  }

  withWorkspaceId(workspaceId: string): HttpClient {
    return new HttpClient({
      apiKey: this.apiKey,
      apiEndpoint: this.apiEndpoint,
      streamingEndpoint: this.streamingEndpoint,
      workspaceId,
      timeout: this.timeout,
      maxRetries: this.maxRetries,
      retryDelay: this.retryDelay,
      debug: this.debug,
      headers: this.customHeaders,
    });
  }
}
