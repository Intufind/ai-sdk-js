import type { StreamChunk } from '../types/chat';

export async function* parseSSEStream(
  response: Response,
  signal?: AbortSignal,
): AsyncGenerator<StreamChunk, void, unknown> {
  if (!response.body) {
    throw new Error('Response body is null — streaming is not supported in this environment');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      if (signal?.aborted) {
        break;
      }

      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        try {
          yield JSON.parse(trimmed) as StreamChunk;
        } catch {
          // Skip malformed lines
        }
      }
    }

    if (buffer.trim()) {
      try {
        yield JSON.parse(buffer.trim()) as StreamChunk;
      } catch {
        // Skip malformed trailing content
      }
    }
  } finally {
    reader.releaseLock();
  }
}
