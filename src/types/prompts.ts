export interface PromptDto {
  id?: string;
  prompt: string;
  title?: string;
  description?: string;
  canned_response?: string;
  response_format?: 'markdown' | 'text' | 'html';
  override_mode?: 'override' | 'fallback';
  post_ids?: string[];
  product_ids?: string[];
  follow_up_ids?: string[];
  tags?: string[];
  categories?: string[];
  status?: string;
  priority?: number;
  icon?: string;
  created_at?: string;
  updated_at?: string;
  active_from?: string;
  active_to?: string;
  metadata?: Record<string, unknown>;
}

export interface PromptSearchRequest {
  text: string;
  filters?: Record<string, unknown>;
  limit?: number;
}

export interface PromptListRequest {
  page?: number;
  limit?: number;
  filters?: Record<string, unknown>;
}
