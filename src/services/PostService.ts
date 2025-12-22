import type {
  ApiResponse,
  BulkDeleteResponse,
  BulkUpsertResponse,
  DeleteByQueryResponse,
  DeleteResponse,
  PostDto,
  PostSearchRequest,
  PostSearchResponse,
  UpsertResponse,
} from '../types';
import { BaseService } from './BaseService';

export class PostService extends BaseService {
  async upsert(post: PostDto): Promise<ApiResponse<UpsertResponse>> {
    return this.http.post('/post', post);
  }

  async bulkUpsert(posts: PostDto[]): Promise<ApiResponse<BulkUpsertResponse>> {
    return this.http.post('/post/bulk', { entities: posts });
  }

  async getById(id: string): Promise<ApiResponse<PostDto>> {
    return this.http.get(`/post/${encodeURIComponent(id)}`);
  }

  async delete(id: string): Promise<ApiResponse<DeleteResponse>> {
    return this.http.delete(`/post/${encodeURIComponent(id)}`);
  }

  async bulkDelete(ids: string[]): Promise<ApiResponse<BulkDeleteResponse>> {
    return this.http.delete('/post/bulk', { body: { ids } });
  }

  async search(request: PostSearchRequest): Promise<ApiResponse<PostSearchResponse>> {
    return this.http.post('/post/search', request);
  }

  async getIds(params?: {
    limit?: number;
    offset?: number;
    categories?: string;
    tags?: string;
    post_type?: string;
    status?: string;
  }): Promise<ApiResponse<{ ids: string[]; total_count: number; has_more: boolean; returned_count: number }>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.categories) queryParams.append('categories', params.categories);
    if (params?.tags) queryParams.append('tags', params.tags);
    if (params?.post_type) queryParams.append('post_type', params.post_type);
    if (params?.status) queryParams.append('status', params.status);

    const query = queryParams.toString();
    return this.http.get(`/post/ids${query ? `?${query}` : ''}`);
  }

  async deleteByQuery(filters: Array<Record<string, unknown>>): Promise<ApiResponse<DeleteByQueryResponse>> {
    return this.http.post('/post/delete-by-query', { filters });
  }
}
