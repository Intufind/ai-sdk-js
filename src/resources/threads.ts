import type { ApiResponse, DeleteResponse } from '../types/common';
import type {
  ThreadSearchRequest,
  ThreadSearchResponse,
  ThreadMessagesResponse,
  ThreadSummary,
} from '../types/threads';
import { Resource } from './base';

export class Threads extends Resource {
  async search(request: ThreadSearchRequest, opts?: { signal?: AbortSignal }): Promise<ApiResponse<ThreadSearchResponse>> {
    return this.http.post('/threads/search', request, opts);
  }

  async get(id: string, opts?: { signal?: AbortSignal }): Promise<ApiResponse<ThreadSummary>> {
    return this.http.get(`/threads/${encodeURIComponent(id)}`, opts);
  }

  async getMessages(id: string, opts?: { signal?: AbortSignal }): Promise<ApiResponse<ThreadMessagesResponse>> {
    return this.http.get(`/threads/${encodeURIComponent(id)}/messages`, opts);
  }

  async delete(id: string, opts?: { signal?: AbortSignal }): Promise<ApiResponse<DeleteResponse>> {
    return this.http.del(`/threads/${encodeURIComponent(id)}`, opts);
  }

  async export(
    params?: { format?: 'json' | 'csv'; dateFrom?: string; dateTo?: string; userId?: string; includeContent?: boolean },
    opts?: { signal?: AbortSignal },
  ): Promise<ApiResponse<Record<string, unknown>>> {
    return this.http.post('/threads/export', params, opts);
  }

  async endHandoff(id: string, opts?: { signal?: AbortSignal }): Promise<ApiResponse<{ message: string }>> {
    return this.http.post(`/threads/${encodeURIComponent(id)}/handoff/end`, undefined, opts);
  }
}
