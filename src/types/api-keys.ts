export interface ApiKeyDto {
  id: string;
  name?: string;
  prefix: string;
  type: 'secret' | 'publishable';
  scopes?: string[];
  created_at: string;
  expires_at?: string;
  last_used_at?: string;
  revoked?: boolean;
}

export interface CreateApiKeyRequest {
  label: string;
  keyType?: 'secret' | 'publishable';
  scopes?: string[];
  expiresAt?: string;
  environment?: 'live' | 'test';
}

export interface CreateApiKeyResponse {
  id: string;
  key: string;
  prefix: string;
  type: 'secret' | 'publishable';
  message: string;
}

export interface RotateApiKeyResponse {
  id: string;
  key: string;
  prefix: string;
  message: string;
}
