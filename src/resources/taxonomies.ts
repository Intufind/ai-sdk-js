import type {
  ApiResponse,
  BulkDeleteResponse,
  BulkUpsertResponse,
  DeleteByQueryResponse,
  DeleteResponse,
  IdsResponse,
  UpsertResponse,
} from '../types/common';
import type { TaxonomyDto } from '../types/taxonomies';
import { Resource } from './base';

export class Taxonomies extends Resource {
  async get(id: string, opts?: { signal?: AbortSignal }): Promise<ApiResponse<TaxonomyDto>> {
    return this.http.get(`/taxonomies/${encodeURIComponent(id)}`, opts);
  }

  async upsert(taxonomy: TaxonomyDto, opts?: { signal?: AbortSignal }): Promise<ApiResponse<UpsertResponse>> {
    return this.http.post('/taxonomies', taxonomy, opts);
  }

  async delete(id: string, opts?: { signal?: AbortSignal }): Promise<ApiResponse<DeleteResponse>> {
    return this.http.del(`/taxonomies/${encodeURIComponent(id)}`, opts);
  }

  async bulkUpsert(taxonomies: TaxonomyDto[], opts?: { signal?: AbortSignal }): Promise<ApiResponse<BulkUpsertResponse>> {
    return this.http.post('/taxonomies/bulk', { entities: taxonomies }, opts);
  }

  async bulkDelete(ids: string[], opts?: { signal?: AbortSignal }): Promise<ApiResponse<BulkDeleteResponse>> {
    return this.http.del('/taxonomies/bulk', { body: { ids }, ...opts });
  }

  async listIds(
    params?: { limit?: number; offset?: number },
    opts?: { signal?: AbortSignal },
  ): Promise<ApiResponse<IdsResponse>> {
    const qs = this.buildQueryString(params ?? {});
    return this.http.get(`/taxonomies/ids${qs}`, opts);
  }

  async deleteByQuery(filters: Array<Record<string, unknown>>, opts?: { signal?: AbortSignal }): Promise<ApiResponse<DeleteByQueryResponse>> {
    return this.http.post('/taxonomies/delete-by-query', { filters }, opts);
  }
}
