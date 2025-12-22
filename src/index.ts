/**
 * Intufind AI SDK
 * Official JavaScript/Node.js SDK for Intufind AI Cloud Services
 */

// Main client
import { IntufindClient as Client } from './Client';

export { IntufindClient } from './Client';
export type { ConfigOptions } from './config/Configuration';
// Configuration
export { Configuration } from './config/Configuration';

// Errors
export {
  AuthenticationError,
  IntufindError,
  NetworkError,
  NotFoundError,
  RateLimitError,
  ValidationError,
} from './errors';
export type { RequestOptions } from './http/HttpClient';
// HTTP client (for advanced usage)
export { HttpClient } from './http/HttpClient';
// Services (exported for advanced usage)
export { BaseService } from './services/BaseService';
export { ChatService } from './services/ChatService';
export { ConfigService } from './services/ConfigService';
export { PostService } from './services/PostService';
export { ProductService } from './services/ProductService';
export { PromptService } from './services/PromptService';
export {
  type ApiKeyInfo,
  type ApiKeyType,
  type CreateKeyResult,
  type DeactivateOptions,
  type DeactivateResult,
  type GenerateKeyOptions,
  type ManualProvisionOptions,
  ProviderType,
  ProvisioningService,
  type ProvisionResult,
} from './services/ProvisioningService';
export { TenantService } from './services/TenantService';
export { ThreadService } from './services/ThreadService';
export { WebhookService } from './services/WebhookService';
// Types (re-export all types)
export type * from './types';

// Streaming type guards
export {
  isComplete,
  isError,
  isHandoffOffer,
  isHandoffSuccess,
  isPost,
  isPostDelta,
  isProduct,
  isPrompts,
  isTextDelta,
} from './types';

// Default export
export default Client;
