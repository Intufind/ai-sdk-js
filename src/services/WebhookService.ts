import type {
  ApiResponse,
  CreateWebhookRequest,
  DeleteResponse,
  UpdateWebhookRequest,
  WebhookDto,
  WebhookListRequest,
  WebhookListResponse,
  WebhookTestResponse,
} from '../types';
import { BaseService } from './BaseService';

export class WebhookService extends BaseService {
  async create(webhook: CreateWebhookRequest): Promise<ApiResponse<{ id: string; message: string }>> {
    return this.http.post('/webhooks', webhook);
  }

  async list(request?: WebhookListRequest): Promise<ApiResponse<WebhookListResponse>> {
    const queryParams = new URLSearchParams();
    if (request?.page) queryParams.append('page', request.page.toString());
    if (request?.limit) queryParams.append('limit', request.limit.toString());
    if (request?.status) queryParams.append('status', request.status);
    if (request?.events) queryParams.append('events', request.events.join(','));
    if (request?.created_by) queryParams.append('created_by', request.created_by);
    if (request?.name_contains) queryParams.append('name_contains', request.name_contains);
    if (request?.url_contains) queryParams.append('url_contains', request.url_contains);
    if (request?.created_after) queryParams.append('created_after', request.created_after);
    if (request?.created_before) queryParams.append('created_before', request.created_before);
    if (request?.sort_by) queryParams.append('sort_by', request.sort_by);
    if (request?.sort_order) queryParams.append('sort_order', request.sort_order);

    const query = queryParams.toString();
    return this.http.get(`/webhooks${query ? `?${query}` : ''}`);
  }

  async getById(id: string): Promise<ApiResponse<WebhookDto>> {
    return this.http.get(`/webhooks/${encodeURIComponent(id)}`);
  }

  async get(id: string): Promise<ApiResponse<WebhookDto>> {
    return this.getById(id);
  }

  async update(id: string, webhook: UpdateWebhookRequest): Promise<ApiResponse<WebhookDto>> {
    return this.http.put(`/webhooks/${encodeURIComponent(id)}`, webhook);
  }

  async delete(id: string): Promise<ApiResponse<DeleteResponse>> {
    return this.http.delete(`/webhooks/${encodeURIComponent(id)}`);
  }

  async test(id: string, payload?: Record<string, unknown>): Promise<ApiResponse<WebhookTestResponse>> {
    return this.http.post(`/webhooks/${encodeURIComponent(id)}/test`, payload || {});
  }

  async getStats(id: string): Promise<ApiResponse<Record<string, unknown>>> {
    return this.http.get(`/webhooks/${encodeURIComponent(id)}/stats`);
  }

  async getAvailableEvents(): Promise<ApiResponse<string[]>> {
    return this.http.get('/webhooks/events');
  }
}
