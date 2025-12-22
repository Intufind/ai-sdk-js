import type {
  ApiResponse,
  LiveAgentCredentialsRequest,
  TenantMcpConfig,
  TenantStatusResponse,
  UsageSummaryResponse,
} from '../types';
import { BaseService } from './BaseService';

export class TenantService extends BaseService {
  // ========================================
  // STATUS & USAGE
  // ========================================

  /**
   * Get tenant status including subscription validation
   * Lightweight call - use for checking if subscription is valid
   */
  async getStatus(): Promise<ApiResponse<TenantStatusResponse>> {
    return this.http.post('/tenant/status', {});
  }

  /**
   * Get comprehensive usage summary with document counts and tier limits
   * Heavier call - use for dashboard/usage displays
   */
  async getUsage(): Promise<ApiResponse<UsageSummaryResponse>> {
    return this.http.get('/tenant/usage');
  }

  /**
   * Check if subscription is valid
   */
  async isSubscriptionValid(): Promise<boolean> {
    const response = await this.getStatus();
    return response.data.subscription.valid;
  }

  /**
   * Get current tier
   */
  async getTier(): Promise<string> {
    const response = await this.getStatus();
    return response.data.subscription.tier;
  }

  /**
   * Get indexed document counts
   */
  async getIndexedStats(): Promise<{
    products: number;
    posts: number;
    users: number;
    taxonomies: number;
    posts_by_type?: Record<string, number>;
  }> {
    const response = await this.getUsage();
    const indexes = response.data.indexes;

    return {
      products: indexes.products?.count || 0,
      posts: indexes.posts?.count || 0,
      users: indexes.users?.count || 0,
      taxonomies: indexes.taxonomies?.count || 0,
      posts_by_type: indexes.posts?.by_type || {},
    };
  }

  /**
   * Get usage data with features and limits
   */
  async getUsageData(): Promise<UsageSummaryResponse> {
    const response = await this.getUsage();
    return response.data;
  }

  /**
   * Get status for a specific feature
   */
  async getFeatureStatus(featureType: string): Promise<{
    available: boolean;
    used: number;
    limit: number;
    remaining: number;
    percentage: number;
  }> {
    const usage = await this.getUsageData();
    const feature = usage.features.find((f) => f.type === featureType);

    if (!feature) {
      throw new Error(`Feature '${featureType}' not found`);
    }

    return {
      available: feature.usage.available,
      used: feature.usage.current,
      limit: feature.usage.limit,
      remaining: Math.max(0, feature.usage.limit - feature.usage.current),
      percentage: feature.usage.percentage,
    };
  }

  // ========================================
  // MCP CONFIGURATION
  // ========================================

  /**
   * Get MCP (Model Context Protocol) configuration for this tenant
   */
  async getMcpConfig(): Promise<ApiResponse<{ mcp: TenantMcpConfig; configured: boolean }>> {
    return this.http.get('/tenant/mcp');
  }

  /**
   * Store/update MCP configuration
   * @param config MCP server URIs for e-commerce operations
   */
  async storeMcpConfig(config: TenantMcpConfig): Promise<ApiResponse<{ message: string; mcp: TenantMcpConfig }>> {
    return this.http.put('/tenant/mcp', config);
  }

  /**
   * Delete MCP configuration
   */
  async deleteMcpConfig(): Promise<ApiResponse<{ message: string }>> {
    return this.http.delete('/tenant/mcp');
  }

  /**
   * Check if MCP is configured for this tenant
   */
  async isMcpConfigured(): Promise<boolean> {
    const response = await this.getMcpConfig();
    return response.data.configured;
  }

  // ========================================
  // LIVE AGENT CREDENTIALS
  // ========================================

  async storeLiveAgentCredentials(
    credentials: LiveAgentCredentialsRequest,
  ): Promise<ApiResponse<{ stored: boolean; provider: string }>> {
    return this.http.post('/tenant/live-agent/credentials', credentials);
  }

  async deleteLiveAgentCredentials(provider: string): Promise<ApiResponse<{ deleted: boolean }>> {
    return this.http.delete(`/tenant/live-agent/credentials?provider=${provider}`);
  }

  async checkLiveAgentCredentialsStatus(provider: string): Promise<
    ApiResponse<{
      configured: boolean;
      provider: string;
      configurationType?: string;
      details?: Record<string, unknown>;
    }>
  > {
    return this.http.get(`/tenant/live-agent/credentials/status?provider=${provider}`);
  }
}
