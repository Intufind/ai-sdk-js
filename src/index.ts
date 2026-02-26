// Client
export { Intufind } from './client';

// Resource classes (for advanced usage / type narrowing)
export { Analytics } from './resources/analytics';
export { ApiKeys } from './resources/api-keys';
export { Chat } from './resources/chat';
export { Feedback } from './resources/feedback';
export { Posts } from './resources/posts';
export { Products } from './resources/products';
export { Prompts } from './resources/prompts';
export { Recommendations } from './resources/recommendations';
export { Taxonomies } from './resources/taxonomies';
export { Threads } from './resources/threads';
export { Webhooks } from './resources/webhooks';

// Errors
export {
  IntufindError,
  AuthenticationError,
  ValidationError,
  RateLimitError,
  TrialExpiredError,
  NotFoundError,
  NetworkError,
} from './http/errors';

// Streaming utilities
export { parseSSEStream } from './http/streaming';

// Type guards
export {
  isTextDelta,
  isProduct,
  isPost,
  isPostDelta,
  isPrompts,
  isDomainOffer,
  isDomainOfferSuccess,
  isComplete,
  isError,
} from './types/chat';

// All types
export type {
  // Common
  ClientOptions,
  ApiResponse,
  TierLimits,
  UsageInfo,
  RequestOptions,
  UpsertResponse,
  DeleteResponse,
  BulkUpsertResponse,
  BulkDeleteResponse,
  DeleteByQueryResponse,
  IdsResponse,
  PaginatedResponse,
  SearchContext,

  // Products
  Product,
  ProductSearchRequest,
  ProductSearchResponse,
  ProductSearchFacets,
  FacetBucket,
  RangeFacetBucket,

  // Posts
  Post,
  PostSearchRequest,
  PostSearchResponse,

  // Chat
  ChatRequest,
  ChatResponse,
  ChatMessage,
  OfferResponse,
  StreamChunkType,
  StreamChunk,
  ActionVariant,
  OfferedAction,
  OfferUIComponent,
  ActionGroupUI,
  FormFieldType,
  FormField,
  FormUI,
  OfferUI,
  DomainOfferData,
  DomainOfferSuccessData,
  PostDeltaData,
  ErrorData,

  // Prompts
  Prompt,
  PromptSearchRequest,
  PromptListRequest,

  // Taxonomies
  Taxonomy,

  // Recommendations
  RecommendationRequest,
  RecommendationResponse,

  // Webhooks
  Webhook,
  CreateWebhookRequest,
  UpdateWebhookRequest,
  WebhookListRequest,
  WebhookTestResponse,

  // Threads
  ThreadSearchRequest,
  ThreadSearchResponse,
  ThreadSummary,
  ThreadMessage,
  ThreadMessagesResponse,

  // Feedback
  FeedbackSubmitRequest,
  FeedbackEntry,
  FeedbackSearchRequest,
  FeedbackSearchResponse,
  FeedbackAnalyticsResponse,

  // Analytics
  SearchAnalyticsQuery,
  SearchAnalyticsResponse,
  ChatAnalyticsQuery,
  ChatAnalyticsResponse,
  FeedbackAnalyticsQuery,

  // API Keys
  ApiKey,
  CreateApiKeyRequest,
  CreateApiKeyResponse,
  RotateApiKeyResponse,
} from './types';

// Utility
export { workspaceIdFromUrl } from './util';
