/**
 * Configuration options for the Intufind SDK
 *
 * AUTHENTICATION:
 * - `apiKey`: REQUIRED for all API calls (chat, search, sync, etc.)
 *   This is the cloud authentication credential returned after provisioning.
 */
export interface ConfigOptions {
  apiEndpoint?: string;
  streamingEndpoint?: string;
  /** Cloud API key for authentication */
  apiKey: string;
  siteUrl?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  debug?: boolean;
  customHeaders?: Record<string, string>;
}

export class Configuration {
  public readonly apiEndpoint: string;
  public readonly streamingEndpoint: string;
  /** Cloud API key for authentication */
  public readonly apiKey: string;
  public readonly siteUrl?: string;
  public readonly timeout: number;
  public readonly retryAttempts: number;
  public readonly retryDelay: number;
  public readonly debug: boolean;
  public readonly customHeaders: Record<string, string>;

  constructor(options: ConfigOptions) {
    this.apiEndpoint = options.apiEndpoint || 'https://api.intufind.com';
    this.streamingEndpoint = options.streamingEndpoint || 'https://streaming.intufind.com';
    this.apiKey = options.apiKey;
    this.siteUrl = options.siteUrl;
    this.timeout = options.timeout || 30000;
    this.retryAttempts = options.retryAttempts || 3;
    this.retryDelay = options.retryDelay || 1000;
    this.debug = options.debug || false;
    this.customHeaders = options.customHeaders || {};

    if (!this.apiKey) {
      throw new Error('apiKey is required');
    }
  }

  /**
   * Get the authentication token for API requests.
   */
  getAuthToken(): string {
    return this.apiKey;
  }

  withSiteUrl(siteUrl: string): Configuration {
    return new Configuration({
      apiEndpoint: this.apiEndpoint,
      streamingEndpoint: this.streamingEndpoint,
      apiKey: this.apiKey,
      siteUrl,
      timeout: this.timeout,
      retryAttempts: this.retryAttempts,
      retryDelay: this.retryDelay,
      debug: this.debug,
      customHeaders: this.customHeaders,
    });
  }

  withApiKey(apiKey: string): Configuration {
    return new Configuration({
      apiEndpoint: this.apiEndpoint,
      streamingEndpoint: this.streamingEndpoint,
      apiKey,
      siteUrl: this.siteUrl,
      timeout: this.timeout,
      retryAttempts: this.retryAttempts,
      retryDelay: this.retryDelay,
      debug: this.debug,
      customHeaders: this.customHeaders,
    });
  }

  withDebug(debug = true): Configuration {
    return new Configuration({
      apiEndpoint: this.apiEndpoint,
      streamingEndpoint: this.streamingEndpoint,
      apiKey: this.apiKey,
      siteUrl: this.siteUrl,
      timeout: this.timeout,
      retryAttempts: this.retryAttempts,
      retryDelay: this.retryDelay,
      debug,
      customHeaders: this.customHeaders,
    });
  }
}
