import type { ApiResponse, PaginatedResponse, UpsertResponse, DeleteResponse } from '../types/common';
import type { Prompt, PromptSearchRequest, PromptListRequest } from '../types/prompts';
import { Resource } from './base';

export class Prompts extends Resource {
  async list(params?: PromptListRequest, opts?: { signal?: AbortSignal }): Promise<ApiResponse<PaginatedResponse<Prompt>>> {
    const qs = this.buildQueryString(params ?? {});
    return this.http.get(`/prompts${qs}`, opts);
  }

  async get(id: string, opts?: { signal?: AbortSignal }): Promise<ApiResponse<Prompt>> {
    return this.http.get(`/prompts/${encodeURIComponent(id)}`, opts);
  }

  async search(request: PromptSearchRequest, opts?: { signal?: AbortSignal }): Promise<ApiResponse<PaginatedResponse<Prompt>>> {
    return this.http.post('/prompts/search', request, opts);
  }

  async upsert(prompt: Prompt, opts?: { signal?: AbortSignal }): Promise<ApiResponse<UpsertResponse>> {
    return this.http.post('/prompts', prompt, opts);
  }

  async bulkUpsert(prompts: Prompt[], opts?: { signal?: AbortSignal }): Promise<ApiResponse<{ successful_ids: string[]; failed_items: Array<{ id: string; error: string }> }>> {
    return this.http.post('/prompts/bulk', { entities: prompts }, opts);
  }

  async delete(id: string, opts?: { signal?: AbortSignal }): Promise<ApiResponse<DeleteResponse>> {
    return this.http.del(`/prompts/${encodeURIComponent(id)}`, opts);
  }
}
