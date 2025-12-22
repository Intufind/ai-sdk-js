// ==================== Chat Types ====================

export interface ChatRequest {
  message: string;
  threadId: string;
  siteUrl?: string;
  userJwt?: string;
  productFilter?: Record<string, unknown>;
  postFilter?: Record<string, unknown>;
  promptId?: string;
  customInstructions?: string;
  siteDescription?: string;
  liveAgentEnabled?: boolean;
  liveAgentEscalationPrompt?: string;
}

export interface ChatMessage {
  intro?: string | null;
  products?: ProductDto[] | null;
  posts?: PostDto[] | null;
  prompts?: PromptDto[] | null;
  // Order-specific fields (when order service agent responds)
  orders?: Array<{
    id: number;
    status: string;
    total: number;
    currency: string;
    date_created: string;
    customer_id: number;
    billing_email: string;
    billing_name: string;
    item_count: number;
    payment_method: string;
  }> | null;
  order_summary?: string | null;
}

export interface ChatResponse {
  message: ChatMessage;
}

// ==================== Streaming Types ====================

/**
 * Streaming chunk types returned by the chat API
 */
export type StreamChunkType =
  | 'text_delta' // Streaming text content (data is string)
  | 'product' // Product data (data is ProductDto)
  | 'post' // Post data (data is PostDto)
  | 'post_delta' // Streaming post summary update
  | 'prompts' // Suggested prompts (data is PromptDto[])
  | 'handoff_offer' // Live agent handoff offer
  | 'handoff_success' // Connected to live agent
  | 'progress' // Progress indicator
  | 'complete' // Stream finished
  | 'error'; // Error message

/**
 * Base streaming chunk interface
 */
export interface StreamChunk<T = unknown> {
  type: StreamChunkType;
  data: T;
  metadata?: {
    source?: 'ai' | 'human';
    agentName?: string;
    agentAvatar?: string;
    [key: string]: unknown;
  };
}

/**
 * Handoff offer data
 */
export interface HandoffOfferData {
  message: string;
  reason: string;
  agentsAvailable: boolean;
  isExplicitRequest?: boolean;
  estimatedWaitTime?: number;
  businessHours?: string;
  suggestedActions: Array<{
    id: string;
    label: string;
    primary?: boolean;
    type?: 'handoff' | 'ai' | 'contact';
  }>;
}

/**
 * Handoff success data
 */
export interface HandoffSuccessData {
  status: 'success';
  agent: {
    id: string;
    name: string;
    avatar?: string;
  };
  conversationId: string;
}

/**
 * Post delta data (streaming summary update)
 */
export interface PostDeltaData {
  id: string;
  delta: string;
}

/**
 * Error chunk data
 */
export interface ErrorData {
  error: string;
}

// ==================== Streaming Type Guards ====================

/** Check if chunk is streaming text content */
export function isTextDelta(chunk: StreamChunk): chunk is StreamChunk<string> {
  return chunk.type === 'text_delta';
}

/** Check if chunk is a product */
export function isProduct(chunk: StreamChunk): chunk is StreamChunk<ProductDto> {
  return chunk.type === 'product';
}

/** Check if chunk is a post */
export function isPost(chunk: StreamChunk): chunk is StreamChunk<PostDto> {
  return chunk.type === 'post';
}

/** Check if chunk is a post delta (streaming summary update) */
export function isPostDelta(chunk: StreamChunk): chunk is StreamChunk<PostDeltaData> {
  return chunk.type === 'post_delta';
}

/** Check if chunk contains prompts */
export function isPrompts(chunk: StreamChunk): chunk is StreamChunk<PromptDto[]> {
  return chunk.type === 'prompts';
}

/** Check if chunk is a handoff offer */
export function isHandoffOffer(chunk: StreamChunk): chunk is StreamChunk<HandoffOfferData> {
  return chunk.type === 'handoff_offer';
}

/** Check if chunk is a handoff success */
export function isHandoffSuccess(chunk: StreamChunk): chunk is StreamChunk<HandoffSuccessData> {
  return chunk.type === 'handoff_success';
}

/** Check if chunk indicates stream completion */
export function isComplete(chunk: StreamChunk): boolean {
  return chunk.type === 'complete';
}

/** Check if chunk is an error */
export function isError(chunk: StreamChunk): chunk is StreamChunk<ErrorData> {
  return chunk.type === 'error';
}

// ==================== Config Types ====================

export interface ColorSchemeRequest {
  primaryColor: string;
  secondaryColor?: string;
}

export interface LightModeColors {
  primary: string;
  assistantBubbleBg: string;
  headerBackground: string;
  headerTitle: string;
  headerSubtitle: string;
  headerIcon: string;
  accent: string;
  sendButton: string;
  link: string;
  triggerButton: string;
  triggerButtonHover: string;
  triggerButtonBorder: string;
  inputBackground: string;
  inputBorder: string;
  widgetBackground: string;
  cardBackground: string;
  cardBorder: string;
  cardHover: string;
  cardTitle: string;
  cardMeta: string;
  cardDesc: string;
  promptChipBackground: string;
  promptChipText: string;
  promptChipBorder: string;
  promptChipHover: string;
}

export interface DarkModeColors {
  primary: string;
  assistantBubbleBg: string;
  headerBackground: string;
  headerTitle: string;
  headerSubtitle: string;
  headerIcon: string;
  accent: string;
  sendButton: string;
  link: string;
  triggerButton: string;
  triggerButtonHover: string;
  triggerButtonBorder: string;
  inputBackground: string;
  inputBorder: string;
  widgetBackground: string;
  cardBackground: string;
  cardBorder: string;
  cardHover: string;
  cardTitle: string;
  cardMeta: string;
  cardDesc: string;
  promptChipBackground: string;
  promptChipText: string;
  promptChipBorder: string;
  promptChipHover: string;
}

export interface ColorSchemeResponse {
  light: LightModeColors;
  dark: DarkModeColors;
  reasoning: string;
}

// ==================== Tier Types ====================

export interface TierLimits {
  search: {
    enabled: boolean;
    queriesPerMonth: number;
    semantic: {
      enabled: boolean;
    };
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

// ==================== Product Types ====================

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
  score?: number;
  matching_chunks?: Array<{ chunk_text: string; order: number }>;
}

export interface ProductSearchRequest {
  text: string;
  filters?: Record<string, unknown>;
  limit?: number;
  useAgent?: boolean;
  /** Include faceted aggregations in response for filter UI */
  includeFacets?: boolean;
  /**
   * Fields to facet on. Supports:
   * - Standard fields: categories, brands, stock_status, on_sale, featured, type, price_ranges
   * - Custom attributes: attributes.color, attributes.size, etc.
   * - Metadata fields: metadata.retailer_id, etc.
   */
  facetFields?: string[];
  /** Maximum number of buckets per facet (default: 20, max: 100) */
  facetSize?: number;
}

/** A single bucket in a facet aggregation */
export interface FacetBucket {
  key: string;
  count: number;
}

/** A range bucket for numeric facets (e.g., price ranges) */
export interface RangeFacetBucket {
  key: string;
  from?: number;
  to?: number;
  count: number;
}

/** Faceted aggregations map - keys are field names, values are bucket arrays */
export type ProductSearchFacets = Record<string, FacetBucket[] | RangeFacetBucket[]>;

export interface ProductSearchResponse {
  results: ProductDto[];
  total: number;
  /** Faceted aggregations for filter UI. Only present when includeFacets=true */
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

export interface BulkUpsertResponse {
  successful_ids: string[];
  failed_items: Array<{ id: string; error: string }>;
  message?: string;
}

export interface DeleteByQueryResponse {
  message: string;
  found_count: number;
  deleted_count: number;
}

export interface BulkDeleteResponse {
  deleted_ids: string[];
  failed_items: Array<{ id: string | number; error: string }>;
  message?: string;
}

export interface UpsertResponse {
  id: string;
  message: string;
}

export interface DeleteResponse {
  id: string;
  message: string;
}

// ==================== Post Types ====================

export interface PostDto {
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
  score?: number;
  matching_chunks?: Array<{ chunk_text: string; order: number }>;
}

export interface PostSearchRequest {
  text: string;
  filters?: Record<string, unknown>;
  limit?: number;
  useAgent?: boolean;
}

export interface PostSearchResponse {
  results: PostDto[];
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

// ==================== Prompt Types ====================

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

export interface PromptListResponse {
  results: PromptDto[];
  total: number;
  page: number;
  limit: number;
}

// ==================== Webhook Types ====================

export interface WebhookDto {
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

export interface WebhookListResponse {
  results: WebhookDto[];
  total: number;
  page: number;
  limit: number;
}

export interface WebhookTestResponse {
  success: boolean;
  responseCode?: number;
  responseTime?: string;
  responseBody?: string;
  errorMessage?: string;
}

// ==================== Thread Types ====================

export interface ThreadSearchRequest {
  limit?: number;
  offset?: number;
  filters?: {
    user_id?: string;
    status?: string;
    created_after?: string;
    created_before?: string;
    has_handoff?: boolean;
  };
  sort_by?: 'created_at' | 'updated_at' | 'message_count';
  sort_order?: 'asc' | 'desc';
}

export interface ThreadSearchResponse {
  results: Array<{
    id: string;
    user_id?: string;
    message_count: number;
    created_at: string;
    updated_at: string;
    status?: string;
    metadata?: Record<string, unknown>;
  }>;
  total: number;
  limit: number;
  offset: number;
}

export interface ThreadMessagesResponse {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
  }>;
}

// ==================== Tenant Types ====================

/**
 * Tenant status response - subscription validation and tier info
 * Endpoint: POST /tenant/status
 */
export interface TenantStatusResponse {
  status: 'active' | 'inactive' | 'suspended';
  timestamp: string;
  publishableKey: string | null;
  subscription: {
    valid: boolean;
    tier: string;
    expires: string | null;
    limits: TierLimits;
    provider?: string;
    validation?: {
      lastValidatedAt?: string;
      nextValidationAt?: string;
      status?: string;
      revalidated?: boolean;
      message?: string;
      error?: string;
    };
  };
}

/**
 * Usage summary response - usage metrics, document counts, tier limits
 * Endpoint: GET /tenant/usage
 */
export interface UsageSummaryResponse {
  tier: string;
  resetTime: number;
  features: Array<{
    name: string;
    type: string;
    usage: {
      current: number;
      limit: number;
      percentage: number;
      available: boolean;
    };
    requiredTier?: string;
  }>;
  tier_features: Record<string, { available: boolean; reason?: string }>;
  indexes: {
    products: { exists: boolean; count?: number; error?: string };
    posts: { exists: boolean; count?: number; error?: string; by_type?: Record<string, number> };
    users: { exists: boolean; count?: number; error?: string };
    taxonomies: { exists: boolean; count?: number; error?: string };
  };
  data_summary: {
    total_documents: number;
    by_type: {
      products: number;
      posts: number;
      users: number;
      taxonomies: number;
    };
  };
}

export interface LiveAgentCredentialsRequest {
  provider: 'zendesk' | 'intercom' | 'drift' | 'slack';
  apiToken?: string;
  webhookSecret?: string;
  subdomain?: string;
  integrationId?: string;
  botToken?: string;
  channelId?: string;
  signingSecret?: string;
}

// ==================== MCP Configuration ====================

export interface TenantMcpConfig {
  /** URI for order lookup MCP server */
  ordersUri?: string;
  /** URI for inventory MCP server */
  inventoryUri?: string;
  /** URI for shipping MCP server */
  shippingUri?: string;
  /** URI for customer support MCP server */
  supportUri?: string;
  /** URI for account management MCP server */
  accountUri?: string;
  /** URI for analytics MCP server */
  analyticsUri?: string;
}

// ==================== API Response Wrapper ====================
// Note: HTTP status codes indicate success/failure. SDK throws on errors.
// This wrapper provides the data plus optional metadata.

export interface ApiResponse<T = unknown> {
  data: T;
  tierLimits?: TierLimits;
  usage?: {
    rateLimit?: {
      remaining?: {
        perMinute: number;
        perHour: number;
      };
      resetTime?: number;
    };
    quota?: {
      current: number;
      limit: number;
      resetDate?: string;
    };
  };
}

// ==================== Error Types ====================

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  details?: unknown;
}
