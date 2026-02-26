import type { ApiResponse } from '../types/common';
import type { RecommendationRequest, RecommendationResponse } from '../types/recommendations';
import { Resource } from './base';

export class Recommendations extends Resource {
  async get(request: RecommendationRequest, opts?: { signal?: AbortSignal }): Promise<ApiResponse<RecommendationResponse>> {
    return this.http.post('/recommendations/products', request, opts);
  }
}
