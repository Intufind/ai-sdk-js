import { parseSSEStream } from '../http/streaming';
import type { ApiResponse } from '../types/common';
import type { ChatRequest, ChatResponse, StreamChunk } from '../types/chat';
import { Resource } from './base';

export class Chat extends Resource {
  async send(request: ChatRequest, opts?: { signal?: AbortSignal }): Promise<ApiResponse<ChatResponse>> {
    return this.http.post('/chat', { ...request, stream: false }, opts);
  }

  async *stream(request: ChatRequest, opts?: { signal?: AbortSignal }): AsyncGenerator<StreamChunk, void, unknown> {
    const response = await this.http.streamRequest('/chat', { ...request, stream: true }, opts?.signal);
    yield* parseSSEStream(response, opts?.signal);
  }
}
