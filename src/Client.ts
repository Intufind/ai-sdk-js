import { HttpClient } from './http/client';
import type { ClientOptions } from './types/common';
import { Analytics } from './resources/analytics';
import { ApiKeys } from './resources/api-keys';
import { Chat } from './resources/chat';
import { Feedback } from './resources/feedback';
import { Posts } from './resources/posts';
import { Products } from './resources/products';
import { Prompts } from './resources/prompts';
import { Recommendations } from './resources/recommendations';
import { Taxonomies } from './resources/taxonomies';
import { Threads } from './resources/threads';
import { Webhooks } from './resources/webhooks';

export class Intufind {
  private readonly http: HttpClient;

  readonly analytics: Analytics;
  readonly apiKeys: ApiKeys;
  readonly chat: Chat;
  readonly feedback: Feedback;
  readonly posts: Posts;
  readonly products: Products;
  readonly prompts: Prompts;
  readonly recommendations: Recommendations;
  readonly taxonomies: Taxonomies;
  readonly threads: Threads;
  readonly webhooks: Webhooks;

  constructor(options: ClientOptions) {
    this.http = new HttpClient(options);

    this.analytics = new Analytics(this.http);
    this.apiKeys = new ApiKeys(this.http);
    this.chat = new Chat(this.http);
    this.feedback = new Feedback(this.http);
    this.posts = new Posts(this.http);
    this.products = new Products(this.http);
    this.prompts = new Prompts(this.http);
    this.recommendations = new Recommendations(this.http);
    this.taxonomies = new Taxonomies(this.http);
    this.threads = new Threads(this.http);
    this.webhooks = new Webhooks(this.http);
  }

  /**
   * Return a new client scoped to a specific workspace.
   * The original client is not modified.
   */
  withWorkspaceId(workspaceId: string): Intufind {
    return new Intufind({ ...this.http.opts, workspaceId });
  }
}
