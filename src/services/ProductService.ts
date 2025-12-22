import type {
  ApiResponse,
  BulkDeleteResponse,
  BulkUpsertResponse,
  DeleteByQueryResponse,
  DeleteResponse,
  ProductDto,
  ProductSearchRequest,
  ProductSearchResponse,
  UpsertResponse,
} from '../types';
import { BaseService } from './BaseService';

export class ProductService extends BaseService {
  async upsert(product: ProductDto): Promise<ApiResponse<UpsertResponse>> {
    return this.http.post('/product', product);
  }

  async bulkUpsert(products: ProductDto[]): Promise<ApiResponse<BulkUpsertResponse>> {
    return this.http.post('/product/bulk', { entities: products });
  }

  async getById(id: string): Promise<ApiResponse<ProductDto>> {
    return this.http.get(`/product/${encodeURIComponent(id)}`);
  }

  async delete(id: string): Promise<ApiResponse<DeleteResponse>> {
    return this.http.delete(`/product/${encodeURIComponent(id)}`);
  }

  async bulkDelete(ids: string[]): Promise<ApiResponse<BulkDeleteResponse>> {
    return this.http.delete('/product/bulk', { body: { ids } });
  }

  async search(request: ProductSearchRequest): Promise<ApiResponse<ProductSearchResponse>> {
    return this.http.post('/product/search', request);
  }

  /**
   * Search products with faceted aggregations for building filter UI.
   * Returns search results plus facet counts for dynamic filter generation.
   *
   * @param request Search parameters
   * @param facetFields Fields to facet on (default: categories, brands, stock_status, price_ranges)
   * @param facetSize Max buckets per facet (default: 20)
   * @returns Search results with facets property populated
   */
  async searchWithFacets(
    request: Omit<ProductSearchRequest, 'includeFacets'>,
    facetFields?: string[],
    facetSize?: number,
  ): Promise<ApiResponse<ProductSearchResponse>> {
    return this.http.post('/product/search', {
      ...request,
      includeFacets: true,
      facetFields,
      facetSize,
    });
  }

  async getIds(params?: {
    limit?: number;
    offset?: number;
    categories?: string;
    tags?: string;
    status?: string;
  }): Promise<ApiResponse<{ ids: string[]; total_count: number; has_more: boolean; returned_count: number }>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.categories) queryParams.append('categories', params.categories);
    if (params?.tags) queryParams.append('tags', params.tags);
    if (params?.status) queryParams.append('status', params.status);

    const query = queryParams.toString();
    return this.http.get(`/product/ids${query ? `?${query}` : ''}`);
  }

  async deleteByQuery(filters: Array<Record<string, unknown>>): Promise<ApiResponse<DeleteByQueryResponse>> {
    return this.http.post('/product/delete-by-query', { filters });
  }
}
