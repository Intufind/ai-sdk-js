import type { ApiResponse, ChatRequest, ChatResponse, StreamChunk } from '../types';
import { BaseService } from './BaseService';

export class ChatService extends BaseService {
  async send(request: ChatRequest): Promise<ApiResponse<ChatResponse>> {
    return this.http.post('/chat', request);
  }

  async sendStreaming(request: ChatRequest): Promise<Response> {
    return this.http.streamRequest('/', request);
  }

  /**
   * Send a streaming message with a callback for each chunk
   * This is a convenience method that handles the streaming iteration
   */
  async sendStreamingWithCallback(
    request: ChatRequest,
    onChunk: (chunk: StreamChunk) => void,
  ): Promise<void> {
    const response = await this.sendStreaming(request);
    for await (const chunk of this.streamingIterator(response)) {
      onChunk(chunk as StreamChunk);
    }
  }

  /**
   * Iterate over streaming response chunks with proper typing
   */
  async *streamingIterator(response: Response): AsyncGenerator<StreamChunk, void, unknown> {
    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine) {
            try {
              yield JSON.parse(trimmedLine) as StreamChunk;
            } catch {
              console.error('Failed to parse streaming line:', trimmedLine);
            }
          }
        }
      }

      if (buffer.trim()) {
        try {
          yield JSON.parse(buffer.trim()) as StreamChunk;
        } catch {
          console.error('Failed to parse final buffer:', buffer);
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
