import type {
  ApiResponse,
  BulkDeleteResponse,
  BulkUpsertResponse,
  DeleteByQueryResponse,
  DeleteResponse,
  IdsResponse,
  UpsertResponse,
} from '../types/common';
import type { ProductDto, ProductSearchRequest, ProductSearchResponse } from '../types/products';
import { Resource } from './base';

export class Products extends Resource {
  async search(request: ProductSearchRequest, opts?: { signal?: AbortSignal }): Promise<ApiResponse<ProductSearchResponse>> {
    return this.http.post('/products/search', request, opts);
  }

  async searchWithFacets(
    request: Omit<ProductSearchRequest, 'includeFacets'>,
    facetFields?: string[],
    facetSize?: number,
    opts?: { signal?: AbortSignal },
  ): Promise<ApiResponse<ProductSearchResponse>> {
    return this.http.post('/products/search', { ...request, includeFacets: true, facetFields, facetSize }, opts);
  }

  async get(id: string, opts?: { signal?: AbortSignal }): Promise<ApiResponse<ProductDto>> {
    return this.http.get(`/products/${encodeURIComponent(id)}`, opts);
  }

  async upsert(product: ProductDto, opts?: { signal?: AbortSignal }): Promise<ApiResponse<UpsertResponse>> {
    return this.http.post('/products', product, opts);
  }

  async delete(id: string, opts?: { signal?: AbortSignal }): Promise<ApiResponse<DeleteResponse>> {
    return this.http.del(`/products/${encodeURIComponent(id)}`, opts);
  }

  async bulkUpsert(products: ProductDto[], opts?: { signal?: AbortSignal }): Promise<ApiResponse<BulkUpsertResponse>> {
    return this.http.post('/products/bulk', { entities: products }, opts);
  }

  async bulkDelete(ids: string[], opts?: { signal?: AbortSignal }): Promise<ApiResponse<BulkDeleteResponse>> {
    return this.http.del('/products/bulk', { body: { ids }, ...opts });
  }

  async listIds(
    params?: { limit?: number; offset?: number; categories?: string; tags?: string; status?: string },
    opts?: { signal?: AbortSignal },
  ): Promise<ApiResponse<IdsResponse>> {
    const qs = this.buildQueryString(params ?? {});
    return this.http.get(`/products/ids${qs}`, opts);
  }

  async deleteByQuery(filters: Array<Record<string, unknown>>, opts?: { signal?: AbortSignal }): Promise<ApiResponse<DeleteByQueryResponse>> {
    return this.http.post('/products/delete-by-query', { filters }, opts);
  }
}
