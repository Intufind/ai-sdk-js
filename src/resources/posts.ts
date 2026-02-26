import type {
  ApiResponse,
  BulkDeleteResponse,
  BulkUpsertResponse,
  DeleteByQueryResponse,
  DeleteResponse,
  IdsResponse,
  UpsertResponse,
} from '../types/common';
import type { Post, PostSearchRequest, PostSearchResponse } from '../types/posts';
import { Resource } from './base';

export class Posts extends Resource {
  async search(request: PostSearchRequest, opts?: { signal?: AbortSignal }): Promise<ApiResponse<PostSearchResponse>> {
    return this.http.post('/posts/search', request, opts);
  }

  async get(id: string, opts?: { signal?: AbortSignal }): Promise<ApiResponse<Post>> {
    return this.http.get(`/posts/${encodeURIComponent(id)}`, opts);
  }

  async upsert(post: Post, opts?: { signal?: AbortSignal }): Promise<ApiResponse<UpsertResponse>> {
    return this.http.post('/posts', post, opts);
  }

  async delete(id: string, opts?: { signal?: AbortSignal }): Promise<ApiResponse<DeleteResponse>> {
    return this.http.del(`/posts/${encodeURIComponent(id)}`, opts);
  }

  async bulkUpsert(posts: Post[], opts?: { signal?: AbortSignal }): Promise<ApiResponse<BulkUpsertResponse>> {
    return this.http.post('/posts/bulk', { entities: posts }, opts);
  }

  async bulkDelete(ids: string[], opts?: { signal?: AbortSignal }): Promise<ApiResponse<BulkDeleteResponse>> {
    return this.http.del('/posts/bulk', { body: { ids }, ...opts });
  }

  async listIds(
    params?: { limit?: number; offset?: number; categories?: string; tags?: string; status?: string },
    opts?: { signal?: AbortSignal },
  ): Promise<ApiResponse<IdsResponse>> {
    const qs = this.buildQueryString(params ?? {});
    return this.http.get(`/posts/ids${qs}`, opts);
  }

  async deleteByQuery(filters: Array<Record<string, unknown>>, opts?: { signal?: AbortSignal }): Promise<ApiResponse<DeleteByQueryResponse>> {
    return this.http.post('/posts/delete-by-query', { filters }, opts);
  }
}
