import type { ApiResponse, ThreadMessagesResponse, ThreadSearchRequest, ThreadSearchResponse } from '../types';
import { BaseService } from './BaseService';

export class ThreadService extends BaseService {
  async search(request: ThreadSearchRequest): Promise<ApiResponse<ThreadSearchResponse>> {
    return this.http.post('/threads/search', request);
  }

  async getMessages(threadId: string): Promise<ApiResponse<ThreadMessagesResponse>> {
    return this.http.get(`/threads/${encodeURIComponent(threadId)}/messages`);
  }

  async endHandoff(threadId: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return this.http.post(`/threads/${encodeURIComponent(threadId)}/handoff/end`, {});
  }

  async export(threadId: string, format: 'json' | 'csv' | 'txt' = 'json'): Promise<ApiResponse<{ content: string }>> {
    return this.http.post(`/threads/${encodeURIComponent(threadId)}/export`, { format });
  }
}
