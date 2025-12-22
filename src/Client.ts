import { type ConfigOptions, Configuration } from './config/Configuration';
import { HttpClient } from './http/HttpClient';
import { ChatService } from './services/ChatService';
import { ConfigService } from './services/ConfigService';
import { PostService } from './services/PostService';
import { ProductService } from './services/ProductService';
import { PromptService } from './services/PromptService';
import { ProvisioningService } from './services/ProvisioningService';
import { TenantService } from './services/TenantService';
import { ThreadService } from './services/ThreadService';
import { WebhookService } from './services/WebhookService';

export class IntufindClient {
  private configuration: Configuration;
  private httpClient: HttpClient;
  private _chatService?: ChatService;
  private _configService?: ConfigService;
  private _productService?: ProductService;
  private _postService?: PostService;
  private _promptService?: PromptService;
  private _provisioningService?: ProvisioningService;
  private _webhookService?: WebhookService;
  private _tenantService?: TenantService;
  private _threadService?: ThreadService;

  constructor(options: ConfigOptions | Configuration) {
    this.configuration = options instanceof Configuration ? options : new Configuration(options);
    this.httpClient = new HttpClient(this.configuration);
  }

  chat(): ChatService {
    if (!this._chatService) {
      this._chatService = new ChatService(this.httpClient);
    }
    return this._chatService;
  }

  config(): ConfigService {
    if (!this._configService) {
      this._configService = new ConfigService(this.httpClient);
    }
    return this._configService;
  }

  products(): ProductService {
    if (!this._productService) {
      this._productService = new ProductService(this.httpClient);
    }
    return this._productService;
  }

  posts(): PostService {
    if (!this._postService) {
      this._postService = new PostService(this.httpClient);
    }
    return this._postService;
  }

  prompts(): PromptService {
    if (!this._promptService) {
      this._promptService = new PromptService(this.httpClient);
    }
    return this._promptService;
  }

  provisioning(): ProvisioningService {
    if (!this._provisioningService) {
      this._provisioningService = new ProvisioningService(this.httpClient);
    }
    return this._provisioningService;
  }

  webhooks(): WebhookService {
    if (!this._webhookService) {
      this._webhookService = new WebhookService(this.httpClient);
    }
    return this._webhookService;
  }

  tenant(): TenantService {
    if (!this._tenantService) {
      this._tenantService = new TenantService(this.httpClient);
    }
    return this._tenantService;
  }

  threads(): ThreadService {
    if (!this._threadService) {
      this._threadService = new ThreadService(this.httpClient);
    }
    return this._threadService;
  }

  getConfig(): Configuration {
    return this.configuration;
  }

  withSiteUrl(siteUrl: string): IntufindClient {
    return new IntufindClient(this.configuration.withSiteUrl(siteUrl));
  }

  withApiKey(apiKey: string): IntufindClient {
    return new IntufindClient(this.configuration.withApiKey(apiKey));
  }

  withDebug(debug = true): IntufindClient {
    return new IntufindClient(this.configuration.withDebug(debug));
  }

  getVersionInfo(): {
    sdk_version: string;
    api_endpoint: string;
    streaming_endpoint: string;
    debug_mode: boolean;
  } {
    return {
      sdk_version: '1.0.0',
      api_endpoint: this.configuration.apiEndpoint,
      streaming_endpoint: this.configuration.streamingEndpoint,
      debug_mode: this.configuration.debug,
    };
  }
}
