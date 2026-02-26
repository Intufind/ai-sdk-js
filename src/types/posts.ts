import type { SearchContext } from './common';

export interface Post {
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  searchableText?: string;
  post_type?: string;
  url?: string;
  status?: 'publish' | 'draft' | 'private' | 'pending';
  author_id?: string;
  author_name?: string;
  word_count?: number;
  reading_time?: number;
  categories?: string[];
  tags?: string[];
  meta_title?: string;
  meta_description?: string;
  featured_image?: string;
  created_at?: string;
  updated_at?: string;
  published_at?: string | null;
  attributes?: Record<string, unknown> | null;
  metadata?: Record<string, string | number | boolean | string[]>;
  source?: string;
  score?: number;
  matching_chunks?: Array<{ chunk_text: string; order: number }>;
}

export interface PostSearchRequest {
  text: string;
  filters?: Record<string, unknown>;
  limit?: number;
  searchContext?: SearchContext;
  useAgent?: boolean;
}

export interface PostSearchResponse {
  results: Post[];
  total: number;
  query: {
    text: string;
    filters?: Record<string, unknown>;
    limit?: number;
  };
  classification?: {
    complexity: 'simple' | 'complex';
    score: number;
    reasons: string[];
  };
  enhanced?: boolean;
  original_text?: string;
  agent_used?: boolean;
  fallback_used?: boolean;
  usage_multiplier?: number;
}
