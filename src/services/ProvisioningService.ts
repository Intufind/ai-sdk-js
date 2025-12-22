import type { ApiResponse } from '../types';
import { BaseService } from './BaseService';

/**
 * Supported provider types
 */
export const ProviderType = {
  EDD: 'edd',
  MANUAL: 'manual',
  SHOPIFY: 'shopify',
} as const;

export type ProviderType = (typeof ProviderType)[keyof typeof ProviderType];

/**
 * Result from a provisioning activation
 */
export interface ProvisionResult {
  success: boolean;
  message: string;
  apiKey?: string;
  apiKeyId?: string;
  publishableKey?: string;
  publishableKeyId?: string;
  tenantId?: string;
  siteId?: string;
  tier?: string;
  isNew?: boolean;
}

/**
 * Result from deactivation
 */
export interface DeactivateResult {
  success: boolean;
  message?: string;
}

/**
 * Options for manual provisioning
 */
export interface ManualProvisionOptions {
  tenantId?: string;
  tier?: string;
  label?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Options for deactivation
 */
export interface DeactivateOptions {
  licenseKey?: string;
  siteUrl?: string;
  purgeData?: boolean;
}

/**
 * API Key type
 */
export type ApiKeyType = 'secret' | 'publishable';

/**
 * API Key metadata
 */
export interface ApiKeyInfo {
  id: string;
  label: string;
  prefix: string;
  keyType: ApiKeyType;
  siteId?: string;
  scopes?: string[];
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
  revokedAt?: string;
}

/**
 * Result from creating a new API key
 */
export interface CreateKeyResult {
  key: string; // Full key - only returned once
  id: string;
  label: string;
  prefix: string;
  createdAt: string;
  expiresAt?: string;
}

/**
 * Options for generating an API key
 */
export interface GenerateKeyOptions {
  label: string;
  scopes?: string[];
  expiresAt?: string;
  environment?: 'live' | 'test';
}

/**
 * Provisioning service for tenant activation via multiple providers
 *
 * Supported providers:
 * - EDD (Easy Digital Downloads): License key based activation
 * - Manual: Admin-provisioned tenants (requires admin API key)
 * - Shopify: App installation based (typically handled by webhooks)
 *
 * @example
 * ```typescript
 * // EDD activation
 * const result = await client.provisioning().activateEdd('license-key-123');
 * console.log(result.apiKey); // Store this for future API calls
 *
 * // Manual provisioning (requires admin API key)
 * const adminClient = new IntufindClient({ apiKey: adminApiKey, ... });
 * const result = await adminClient.provisioning().activateManual({
 *   tier: 'professional',
 *   label: 'Customer ABC',
 * });
 *
 * // Deactivation
 * await client.provisioning().deactivateEdd('license-key-123', true);
 * ```
 */
export class ProvisioningService extends BaseService {
  /**
   * Activate via EDD license key
   *
   * This method calls the EDD provisioning endpoint which:
   * 1. Validates the license key with EDD
   * 2. Creates or retrieves an existing tenant
   * 3. Generates and returns an API key
   *
   * IMPORTANT: Store the returned API key and use it for all subsequent
   * API calls. The license key is NOT valid for API authentication.
   *
   * @param licenseKey - EDD license key to activate
   * @param siteUrl - Optional site URL for the activation
   * @returns Provisioning result with API key
   */
  async activateEdd(licenseKey: string, siteUrl?: string): Promise<ProvisionResult> {
    if (!licenseKey) {
      throw new Error('License key is required');
    }

    const response = await this.http.post<ProvisionResult>('/provision/edd', {
      license_key: licenseKey,
      site_url: siteUrl,
    });

    return this.normalizeProvisionResponse(response.data);
  }

  /**
   * Activate via manual provisioning (admin-created tenant)
   *
   * This method requires an admin API key in the configuration.
   * It creates a new tenant with the specified configuration.
   *
   * @param options - Tenant configuration options
   * @returns Provisioning result with API key
   */
  async activateManual(options: ManualProvisionOptions = {}): Promise<ProvisionResult> {
    const response = await this.http.post<ProvisionResult>('/provision/manual', options);
    return this.normalizeProvisionResponse(response.data);
  }

  /**
   * Deactivate the current tenant and clean up cloud resources
   *
   * This method:
   * 1. Authenticates using your API key
   * 2. Marks the subscription as cancelled
   * 3. Optionally purges indexed data
   * 4. For EDD: deactivates the license on the licensing server
   *
   * After deactivation, the API key is no longer valid.
   *
   * @param provider - Provider type (edd, manual, shopify)
   * @param options - Provider-specific options
   * @returns Deactivation result
   */
  async deactivate(
    provider: ProviderType = ProviderType.EDD,
    options: DeactivateOptions = {},
  ): Promise<DeactivateResult> {
    const payload = {
      provider,
      ...options,
    };

    const response = await this.http.post<DeactivateResult>('/deprovision', payload);

    return {
      success: response.data.success ?? true,
      message: response.data.message ?? 'Deactivation successful',
    };
  }

  /**
   * Deactivate EDD license specifically
   *
   * @param licenseKey - License key to deactivate
   * @param purgeData - Whether to delete all indexed data
   * @returns Deactivation result
   */
  async deactivateEdd(licenseKey: string, purgeData = false): Promise<DeactivateResult> {
    return this.deactivate(ProviderType.EDD, {
      licenseKey,
      purgeData,
    });
  }

  /**
   * Get list of supported providers
   */
  getSupportedProviders(): ProviderType[] {
    return [ProviderType.EDD, ProviderType.MANUAL, ProviderType.SHOPIFY];
  }

  // ========================================
  // API KEY MANAGEMENT
  // ========================================

  /**
   * List all API keys for the tenant
   *
   * @returns Array of API key metadata (without the actual key values)
   */
  async listKeys(): Promise<ApiResponse<ApiKeyInfo[]>> {
    return this.http.get<ApiKeyInfo[]>('/keys');
  }

  /**
   * Generate a new API key
   *
   * IMPORTANT: The full key is only returned once. Store it securely.
   *
   * @param options - Key generation options
   * @returns The created key with the full key value
   */
  async generateKey(options: GenerateKeyOptions): Promise<ApiResponse<CreateKeyResult>> {
    return this.http.post<CreateKeyResult>('/keys', {
      label: options.label,
      scopes: options.scopes,
      expires_at: options.expiresAt,
      environment: options.environment || 'live',
    });
  }

  /**
   * Revoke an API key
   *
   * After revocation, the key is no longer valid for API calls.
   *
   * @param keyId - The key ID to revoke
   * @returns Success status
   */
  async revokeKey(keyId: string): Promise<ApiResponse<{ revoked: boolean }>> {
    return this.http.post<{ revoked: boolean }>(`/keys/${keyId}/revoke`, {});
  }

  /**
   * Rotate an API key (revoke old, create new)
   *
   * This atomically revokes the old key and creates a new one.
   * IMPORTANT: The full new key is only returned once. Store it securely.
   *
   * @param keyId - The key ID to rotate
   * @param newLabel - Optional new label for the rotated key
   * @returns The new key with the full key value
   */
  async rotateKey(keyId: string, newLabel?: string): Promise<ApiResponse<CreateKeyResult>> {
    return this.http.post<CreateKeyResult>(`/keys/${keyId}/rotate`, {
      label: newLabel,
    });
  }

  /**
   * Normalize the provisioning response to a consistent format
   */
  private normalizeProvisionResponse(data: ProvisionResult): ProvisionResult {
    return {
      success: true,
      message: 'Provisioning successful',
      apiKey: data.apiKey,
      apiKeyId: data.apiKeyId,
      publishableKey: data.publishableKey,
      publishableKeyId: data.publishableKeyId,
      tenantId: data.tenantId,
      siteId: data.siteId,
      tier: data.tier,
      isNew: data.isNew ?? false,
    };
  }
}
