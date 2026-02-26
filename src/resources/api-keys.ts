import type { ApiResponse } from '../types/common';
import type {
  ApiKey,
  CreateApiKeyRequest,
  CreateApiKeyResponse,
  RotateApiKeyResponse,
} from '../types/api-keys';
import { Resource } from './base';

export class ApiKeys extends Resource {
  async list(opts?: { signal?: AbortSignal }): Promise<ApiResponse<ApiKey[]>> {
    return this.http.get('/provision/keys', opts);
  }

  async create(request?: CreateApiKeyRequest, opts?: { signal?: AbortSignal }): Promise<ApiResponse<CreateApiKeyResponse>> {
    return this.http.post('/provision/keys', request ?? {}, opts);
  }

  async revoke(id: string, opts?: { signal?: AbortSignal }): Promise<ApiResponse<{ message: string }>> {
    return this.http.post(`/provision/keys/${encodeURIComponent(id)}/revoke`, undefined, opts);
  }

  async rotate(id: string, opts?: { signal?: AbortSignal }): Promise<ApiResponse<RotateApiKeyResponse>> {
    return this.http.post(`/provision/keys/${encodeURIComponent(id)}/rotate`, undefined, opts);
  }
}
