export interface ClientOptions {
  apiKey: string;
  apiEndpoint?: string;
  streamingEndpoint?: string;
  workspaceId?: string;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
  debug?: boolean;
  headers?: Record<string, string>;
}

export interface ApiResponse<T> {
  data: T;
  tierLimits?: TierLimits;
  usage?: UsageInfo;
}

export interface TierLimits {
  search: {
    enabled: boolean;
    queriesPerMonth: number;
    semantic: { enabled: boolean };
  };
  chat: {
    enabled: boolean;
    messagesPerMonth: number;
  };
  recommendations: {
    enabled: boolean;
    perMonth: number;
  };
  indexing: {
    products: number;
    posts: number;
    prompts?: number;
    users?: number;
    taxonomies?: number;
    webhooks: number;
  };
}

export interface UsageInfo {
  rateLimit?: {
    remaining?: { perMinute: number; perHour: number };
    resetTime?: number;
  };
  quota?: {
    current: number;
    limit: number;
    resetDate?: string;
  };
}

export interface RequestOptions {
  signal?: AbortSignal;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface UpsertResponse {
  id: string;
  message: string;
}

export interface DeleteResponse {
  id: string;
  message: string;
}

export interface BulkUpsertResponse {
  successfulIds: string[];
  failedItems: Array<{ id: string; error: string }>;
  processed: number;
  message?: string;
}

export interface BulkDeleteResponse {
  deletedIds: string[];
  failedItems: Array<{ id: string | number; error: string }>;
  message?: string;
}

export interface DeleteByQueryResponse {
  message: string;
  found_count: number;
  deleted_count: number;
}

export interface IdsResponse {
  ids: string[];
  total_count: number;
  has_more: boolean;
  returned_count: number;
}

export interface PaginatedResponse<T> {
  results: T[];
  total: number;
  page: number;
  limit: number;
}

export type SearchContext = 'widget' | 'native' | 'chat' | 'api' | 'internal' | 'unknown';
