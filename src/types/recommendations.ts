import type { ProductDto } from './products';

export interface RecommendationRequest {
  productId: string;
  basketAffinity?: Array<{ productId: string; frequency: number }>;
  complimentaryProducts?: string[];
  userId?: string;
  weights?: {
    similarProducts?: number;
    basketAffinity?: number;
    memoryBased?: number;
  };
  maxRecommendations?: number;
  excludeProductIds?: string[];
  productFilter?: Record<string, unknown>;
}

export interface RecommendationResponse {
  recommendations: ProductDto[];
  usedStrategies: string[];
  fallbackApplied: boolean;
  weights: Record<string, number>;
  totalCandidates: number;
}
