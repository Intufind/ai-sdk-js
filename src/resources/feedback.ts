import type { ApiResponse, DeleteResponse } from '../types/common';
import type {
  FeedbackSubmitRequest,
  FeedbackEntry,
  FeedbackSearchResponse,
  FeedbackAnalyticsResponse,
} from '../types/feedback';
import { Resource } from './base';

export class Feedback extends Resource {
  /** Submit feedback (client-safe with publishable key). */
  async submit(request: FeedbackSubmitRequest, opts?: { signal?: AbortSignal }): Promise<ApiResponse<FeedbackEntry>> {
    return this.http.post('/feedback', request, opts);
  }

  /** Search feedback entries (requires secret key). */
  async search(params?: Record<string, unknown>, opts?: { signal?: AbortSignal }): Promise<ApiResponse<FeedbackSearchResponse>> {
    const qs = this.buildQueryString(params ?? {});
    return this.http.get(`/feedback${qs}`, opts);
  }

  /** Get feedback analytics (requires secret key). */
  async analytics(opts?: { signal?: AbortSignal }): Promise<ApiResponse<FeedbackAnalyticsResponse>> {
    return this.http.get('/feedback/analytics', opts);
  }

  /** Get all feedback for a specific thread (requires secret key). */
  async forThread(threadId: string, opts?: { signal?: AbortSignal }): Promise<ApiResponse<FeedbackEntry[]>> {
    return this.http.get(`/feedback/thread/${encodeURIComponent(threadId)}`, opts);
  }

  /** Delete a feedback entry (requires secret key). */
  async delete(id: string, opts?: { signal?: AbortSignal }): Promise<ApiResponse<DeleteResponse>> {
    return this.http.del(`/feedback/${encodeURIComponent(id)}`, opts);
  }
}
