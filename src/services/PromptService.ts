import type {
  ApiResponse,
  BulkUpsertResponse,
  DeleteResponse,
  PromptDto,
  PromptListRequest,
  PromptListResponse,
  PromptSearchRequest,
  UpsertResponse,
} from '../types';
import { BaseService } from './BaseService';

export class PromptService extends BaseService {
  async upsert(prompt: PromptDto): Promise<ApiResponse<UpsertResponse>> {
    return this.http.post('/prompt', prompt);
  }

  async getById(id: string): Promise<ApiResponse<PromptDto>> {
    return this.http.get(`/prompt/${encodeURIComponent(id)}`);
  }

  async get(id: string): Promise<ApiResponse<PromptDto>> {
    return this.getById(id);
  }

  async delete(id: string): Promise<ApiResponse<DeleteResponse>> {
    return this.http.delete(`/prompt/${encodeURIComponent(id)}`);
  }

  async list(requestOrPage?: PromptListRequest | number, limit?: number): Promise<ApiResponse<PromptListResponse>> {
    let request: PromptListRequest = {};

    if (typeof requestOrPage === 'number') {
      request = { page: requestOrPage, limit: limit || 20 };
    } else if (requestOrPage) {
      request = requestOrPage;
    }

    const queryParams = new URLSearchParams();
    if (request.page) queryParams.append('page', request.page.toString());
    if (request.limit) queryParams.append('limit', request.limit.toString());

    if (request.filters) {
      for (const [key, value] of Object.entries(request.filters)) {
        const paramKey = key.startsWith('metadata.') ? key : `metadata.${key}`;
        const paramValue = typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value);
        queryParams.append(paramKey, paramValue);
      }
    }

    const query = queryParams.toString();
    return this.http.get(`/prompt${query ? `?${query}` : ''}`);
  }

  async search(
    requestOrQuery: PromptSearchRequest | string,
    filters?: Record<string, unknown>,
    limit?: number,
  ): Promise<ApiResponse<{ results: PromptDto[]; total: number }>> {
    let request: PromptSearchRequest;

    if (typeof requestOrQuery === 'string') {
      request = { text: requestOrQuery, filters: filters || {}, limit: limit || 20 };
    } else {
      request = requestOrQuery;
    }

    return this.http.post('/prompt/search', request);
  }

  async getInitialPrompts(limit = 10): Promise<ApiResponse<PromptListResponse>> {
    const queryParams = new URLSearchParams({
      'metadata.initial': 'true',
      limit: limit.toString(),
    });
    return this.http.get(`/prompt?${queryParams.toString()}`);
  }

  async bulkUpsert(prompts: PromptDto[]): Promise<ApiResponse<BulkUpsertResponse>> {
    return this.http.post('/prompt/bulk', { entities: prompts });
  }
}
