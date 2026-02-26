export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  description?: string;
  secret?: string;
  auth_type?: 'none' | 'bearer' | 'basic' | 'api_key';
  auth_config?: Record<string, unknown>;
  headers?: Record<string, string>;
  timeout_ms?: number;
  retry_policy?: {
    max_attempts: number;
    backoff_type: 'fixed' | 'exponential';
  };
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
  last_delivery_at?: string;
  created_by?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateWebhookRequest {
  name: string;
  url: string;
  events: string[];
  description?: string;
  secret?: string;
  auth_type?: 'none' | 'bearer' | 'basic' | 'api_key';
  auth_config?: Record<string, unknown>;
  headers?: Record<string, string>;
  timeout_ms?: number;
  retry_policy?: {
    max_attempts: number;
    backoff_type: 'fixed' | 'exponential';
  };
  metadata?: Record<string, unknown>;
}

export interface UpdateWebhookRequest {
  name?: string;
  url?: string;
  events?: string[];
  description?: string;
  auth_type?: 'none' | 'bearer' | 'basic' | 'api_key';
  auth_config?: Record<string, unknown>;
  headers?: Record<string, string>;
  timeout_ms?: number;
  retry_policy?: {
    max_attempts: number;
    backoff_type: 'fixed' | 'exponential';
  };
  status?: 'active' | 'inactive' | 'suspended';
  metadata?: Record<string, unknown>;
}

export interface WebhookListRequest {
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive' | 'suspended';
  events?: string[];
  created_by?: string;
  name_contains?: string;
  url_contains?: string;
  created_after?: string;
  created_before?: string;
  sort_by?: 'name' | 'created_at' | 'updated_at' | 'last_delivery_at';
  sort_order?: 'asc' | 'desc';
}

export interface WebhookTestResponse {
  success: boolean;
  responseCode?: number;
  responseTime?: string;
  responseBody?: string;
  errorMessage?: string;
}
