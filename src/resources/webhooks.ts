import type { ApiResponse, DeleteResponse, PaginatedResponse } from '../types/common';
import type {
  CreateWebhookRequest,
  UpdateWebhookRequest,
  WebhookDto,
  WebhookListRequest,
  WebhookTestResponse,
} from '../types/webhooks';
import { Resource } from './base';

export class Webhooks extends Resource {
  async create(webhook: CreateWebhookRequest, opts?: { signal?: AbortSignal }): Promise<ApiResponse<{ id: string; message: string }>> {
    return this.http.post('/webhooks', webhook, opts);
  }

  async list(params?: WebhookListRequest, opts?: { signal?: AbortSignal }): Promise<ApiResponse<PaginatedResponse<WebhookDto>>> {
    const qs = this.buildQueryString(params ?? {});
    return this.http.get(`/webhooks${qs}`, opts);
  }

  async get(id: string, opts?: { signal?: AbortSignal }): Promise<ApiResponse<WebhookDto>> {
    return this.http.get(`/webhooks/${encodeURIComponent(id)}`, opts);
  }

  async update(id: string, webhook: UpdateWebhookRequest, opts?: { signal?: AbortSignal }): Promise<ApiResponse<WebhookDto>> {
    return this.http.put(`/webhooks/${encodeURIComponent(id)}`, webhook, opts);
  }

  async delete(id: string, opts?: { signal?: AbortSignal }): Promise<ApiResponse<DeleteResponse>> {
    return this.http.del(`/webhooks/${encodeURIComponent(id)}`, opts);
  }

  async test(id: string, payload?: Record<string, unknown>, opts?: { signal?: AbortSignal }): Promise<ApiResponse<WebhookTestResponse>> {
    return this.http.post(`/webhooks/${encodeURIComponent(id)}/test`, payload ?? {}, opts);
  }

  async stats(id: string, opts?: { signal?: AbortSignal }): Promise<ApiResponse<Record<string, unknown>>> {
    return this.http.get(`/webhooks/${encodeURIComponent(id)}/stats`, opts);
  }

  async events(opts?: { signal?: AbortSignal }): Promise<ApiResponse<string[]>> {
    return this.http.get('/webhooks/events', opts);
  }
}
