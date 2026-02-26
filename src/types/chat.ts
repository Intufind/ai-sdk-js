import type { PostDto } from './posts';
import type { ProductDto } from './products';
import type { PromptDto } from './prompts';

export interface ChatRequest {
  message: string;
  threadId: string;
  workspaceId?: string;
  userJwt?: string;
  productFilter?: Record<string, unknown>;
  postFilter?: Record<string, unknown>;
  promptId?: string;
  offerResponse?: OfferResponse;
  visitorId?: string;
  stream?: boolean;
}

export interface OfferResponse {
  domain: string;
  actionId: string;
  formData?: Record<string, string>;
}

export interface ChatMessage {
  intro?: string | null;
  products?: ProductDto[] | null;
  posts?: PostDto[] | null;
  prompts?: PromptDto[] | null;
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

export type StreamChunkType =
  | 'text_delta'
  | 'product'
  | 'post'
  | 'post_delta'
  | 'prompts'
  | 'progress'
  | 'error'
  | 'analytics'
  | 'usage'
  | 'metadata'
  | 'complete'
  | 'bubble_termination'
  | 'orchestration_interrupted'
  | 'domain_offer'
  | 'domain_offer_success';

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

// ==================== Domain Offer Types ====================

export type ActionVariant = 'primary' | 'secondary' | 'danger';

export interface OfferedAction {
  id: string;
  label: string;
  variant?: ActionVariant;
}

export type OfferUIComponent = 'action_group' | 'form';

export interface ActionGroupUI {
  component: 'action_group';
  layout?: 'horizontal' | 'vertical';
  actions: OfferedAction[];
}

export type FormFieldType = 'text' | 'email' | 'tel' | 'textarea' | 'select';

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
}

export interface FormUI {
  component: 'form';
  title?: string;
  fields: FormField[];
  submitAction: OfferedAction;
  cancelAction?: OfferedAction;
}

export type OfferUI = ActionGroupUI | FormUI;

export interface DomainOfferData {
  domain: string;
  message: string;
  ui: OfferUI;
  context?: Record<string, unknown>;
}

export interface DomainOfferSuccessData {
  domain: string;
  status: 'success' | 'error';
  agent?: {
    id: string;
    name: string;
    avatar?: string;
  };
  conversationId?: string;
}

export interface PostDeltaData {
  id: string;
  delta: string;
}

export interface ErrorData {
  error: string;
}

// ==================== Type Guards ====================

export function isTextDelta(chunk: StreamChunk): chunk is StreamChunk<string> {
  return chunk.type === 'text_delta';
}

export function isProduct(chunk: StreamChunk): chunk is StreamChunk<ProductDto> {
  return chunk.type === 'product';
}

export function isPost(chunk: StreamChunk): chunk is StreamChunk<PostDto> {
  return chunk.type === 'post';
}

export function isPostDelta(chunk: StreamChunk): chunk is StreamChunk<PostDeltaData> {
  return chunk.type === 'post_delta';
}

export function isPrompts(chunk: StreamChunk): chunk is StreamChunk<PromptDto[]> {
  return chunk.type === 'prompts';
}

export function isDomainOffer(chunk: StreamChunk): chunk is StreamChunk<DomainOfferData> {
  return chunk.type === 'domain_offer';
}

export function isDomainOfferSuccess(chunk: StreamChunk): chunk is StreamChunk<DomainOfferSuccessData> {
  return chunk.type === 'domain_offer_success';
}

export function isComplete(chunk: StreamChunk): boolean {
  return chunk.type === 'complete';
}

export function isError(chunk: StreamChunk): chunk is StreamChunk<ErrorData> {
  return chunk.type === 'error';
}
