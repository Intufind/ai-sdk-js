import type { SearchContext } from './common';

export interface ProductDto {
  id: string;
  name: string;
  content?: string;
  excerpt?: string;
  searchableText?: string;
  price?: number | null;
  sale_price?: number | null;
  regular_price?: number | null;
  on_sale?: boolean;
  stock_quantity?: number | null;
  stock_status?: 'instock' | 'outofstock' | 'onbackorder';
  sku?: string;
  weight?: number | null;
  dimensions?: {
    length?: number | null;
    width?: number | null;
    height?: number | null;
  } | null;
  rating?: number;
  review_count?: number;
  categories?: string[];
  tags?: string[];
  brands?: string[];
  image?: string;
  url?: string;
  type?: 'simple' | 'variable' | 'grouped' | 'external';
  status?: string;
  visibility?: string;
  featured?: boolean;
  virtual?: boolean;
  downloadable?: boolean;
  created_at?: string;
  updated_at?: string;
  attributes?: Record<string, string[]> | null;
  metadata?: Record<string, string | number | boolean | string[]>;
  source?: string;
  score?: number;
  matching_chunks?: Array<{ chunk_text: string; order: number }>;
}

export interface ProductSearchRequest {
  text: string;
  filters?: Record<string, unknown>;
  limit?: number;
  searchContext?: SearchContext;
  useAgent?: boolean;
  includeFacets?: boolean;
  facetFields?: string[];
  facetSize?: number;
}

export interface FacetBucket {
  key: string;
  count: number;
}

export interface RangeFacetBucket {
  key: string;
  from?: number;
  to?: number;
  count: number;
}

export type ProductSearchFacets = Record<string, FacetBucket[] | RangeFacetBucket[]>;

export interface ProductSearchResponse {
  results: ProductDto[];
  total: number;
  facets?: ProductSearchFacets;
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
