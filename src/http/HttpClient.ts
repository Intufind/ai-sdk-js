import fetch from 'cross-fetch';
import type { Configuration } from '../config/Configuration';
import {
  AuthenticationError,
  IntufindError,
  NetworkError,
  NotFoundError,
  RateLimitError,
  ValidationError,
} from '../errors';
import type { ApiResponse } from '../types';

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
  retryAttempts?: number;
}

export class HttpClient {
  constructor(private config: Configuration) {}

  private getDefaultHeaders(): Record<string, string> {
    const authToken = this.config.getAuthToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
      ...this.config.customHeaders,
    };

    if (this.config.siteUrl) {
      headers['X-Site-URL'] = this.config.siteUrl;
    }

    return headers;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private handleError(statusCode: number, body: unknown): never {
    const errorData = body as { error?: string; message?: string; details?: unknown };
    const message = errorData.error || errorData.message || 'Unknown error occurred';

    switch (statusCode) {
      case 400:
        throw new ValidationError(message, errorData.details);
      case 401:
        throw new AuthenticationError(message, errorData.details);
      case 404:
        throw new NotFoundError(message, errorData.details);
      case 429:
        throw new RateLimitError(message, errorData.details);
      case 503:
        throw new NetworkError(message, errorData.details);
      default:
        throw new IntufindError(message, statusCode, errorData.details);
    }
  }

  async request<T = unknown>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      body,
      headers: customHeaders = {},
      timeout = this.config.timeout,
      retryAttempts = this.config.retryAttempts,
    } = options;

    const url = `${this.config.apiEndpoint}${path}`;
    const headers = { ...this.getDefaultHeaders(), ...customHeaders };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retryAttempts; attempt++) {
      try {
        if (this.config.debug) {
          console.log(`[Intufind SDK] ${method} ${url}`, { attempt: attempt + 1, body });
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const responseText = await response.text();
        let responseData: unknown;

        try {
          responseData = responseText ? JSON.parse(responseText) : {};
        } catch {
          responseData = { message: responseText };
        }

        if (this.config.debug) {
          console.log(`[Intufind SDK] Response ${response.status}:`, responseData);
        }

        if (!response.ok) {
          this.handleError(response.status, responseData);
        }

        // Extract data from the API response envelope
        // API returns: { data: T, tierLimits?, usage? } on success
        // SDK throws on errors, so if we get here it's a success
        const envelope = responseData as {
          data?: T;
          tierLimits?: unknown;
          usage?: unknown;
        };

        return {
          data: envelope.data as T,
          tierLimits: envelope.tierLimits,
          usage: envelope.usage,
        } as ApiResponse<T>;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors
        if (
          error instanceof AuthenticationError ||
          error instanceof ValidationError ||
          error instanceof NotFoundError
        ) {
          throw error;
        }

        if (attempt === retryAttempts) {
          break;
        }

        // Exponential backoff
        const delay = this.config.retryDelay * 2 ** attempt;
        if (this.config.debug) {
          console.log(`[Intufind SDK] Retry attempt ${attempt + 1} after ${delay}ms`);
        }
        await this.sleep(delay);
      }
    }

    if (lastError) {
      throw lastError;
    }

    throw new NetworkError('Request failed after all retry attempts');
  }

  async get<T = unknown>(path: string, options: Omit<RequestOptions, 'method'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  async post<T = unknown>(
    path: string,
    body?: unknown,
    options: Omit<RequestOptions, 'method' | 'body'> = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: 'POST', body });
  }

  async put<T = unknown>(
    path: string,
    body?: unknown,
    options: Omit<RequestOptions, 'method' | 'body'> = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: 'PUT', body });
  }

  async delete<T = unknown>(path: string, options: Omit<RequestOptions, 'method'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }

  async streamRequest(path: string, body: unknown): Promise<Response> {
    const url = `${this.config.streamingEndpoint}${path}`;
    const headers = this.getDefaultHeaders();

    if (this.config.debug) {
      console.log(`[Intufind SDK] STREAM POST ${url}`, { body });
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const responseText = await response.text();
      let responseData: unknown;

      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch {
        responseData = { message: responseText };
      }

      this.handleError(response.status, responseData);
    }

    return response;
  }
}
