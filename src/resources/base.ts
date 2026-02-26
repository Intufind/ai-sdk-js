import type { HttpClient } from '../http/client';

export abstract class Resource {
  constructor(protected readonly http: HttpClient) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected buildQueryString(params: Record<string, any>): string {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        qs.append(key, value.join(','));
      } else {
        qs.append(key, String(value));
      }
    }
    const str = qs.toString();
    return str ? `?${str}` : '';
  }
}
