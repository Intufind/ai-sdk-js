import type { ApiResponse } from '../types/common';
import type {
  SearchAnalyticsQuery,
  SearchAnalyticsResponse,
  ChatAnalyticsQuery,
  ChatAnalyticsResponse,
  FeedbackAnalyticsQuery,
} from '../types/analytics';
import type { FeedbackAnalyticsResponse } from '../types/feedback';
import { Resource } from './base';

export class Analytics extends Resource {
  async search(query?: SearchAnalyticsQuery, opts?: { signal?: AbortSignal }): Promise<ApiResponse<SearchAnalyticsResponse>> {
    const qs = this.buildQueryString(query ?? {});
    return this.http.get(`/analytics/search${qs}`, opts);
  }

  async chat(query?: ChatAnalyticsQuery, opts?: { signal?: AbortSignal }): Promise<ApiResponse<ChatAnalyticsResponse>> {
    const qs = this.buildQueryString(query ?? {});
    return this.http.get(`/analytics/chat${qs}`, opts);
  }

  async feedback(query?: FeedbackAnalyticsQuery, opts?: { signal?: AbortSignal }): Promise<ApiResponse<FeedbackAnalyticsResponse>> {
    const qs = this.buildQueryString(query ?? {});
    return this.http.get(`/analytics/feedback${qs}`, opts);
  }
}
