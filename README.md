# @intufind/ai-sdk

Official JavaScript/TypeScript SDK for [Intufind AI](https://intufind.com) — semantic search, AI chat, recommendations, and knowledge base management.

## Installation

```bash
npm install @intufind/ai-sdk
```

Requires **Node.js >= 18** (uses native `fetch`). Works in modern browsers with no polyfills.

## Quick Start

```typescript
import { Intufind } from '@intufind/ai-sdk';

const client = new Intufind({ apiKey: 'if_sk_...' });

// Search products
const { data } = await client.products.search({ text: 'blue running shoes', limit: 10 });
console.log(data.results);

// AI chat with streaming
for await (const chunk of client.chat.stream({ message: 'Hi!', threadId: 'thread-1' })) {
  if (chunk.type === 'text_delta') process.stdout.write(chunk.data);
}
```

## Configuration

```typescript
const client = new Intufind({
  apiKey: 'if_sk_...',            // Required — secret or publishable key
  workspaceId: 'mystore-com',    // Scope to a workspace
  apiEndpoint: 'https://...',    // Custom API endpoint (default: https://api.intufind.com)
  streamingEndpoint: 'https://...',
  timeout: 30000,                // Request timeout in ms (default: 30s)
  maxRetries: 3,                 // Retry count for transient errors (default: 3)
  debug: false,                  // Log requests/responses
});
```

### Workspace Scoping

```typescript
const scoped = client.withWorkspaceId('mystore-com');
await scoped.products.search({ text: 'shoes' });
```

### Workspace ID from URL

```typescript
import { workspaceIdFromUrl } from '@intufind/ai-sdk';

workspaceIdFromUrl('https://mystore.com');       // 'mystore-com'
workspaceIdFromUrl('my-store.myshopify.com');     // 'my-store-myshopify-com'
```

## API Key Types

| Key Type | Prefix | Use |
|----------|--------|-----|
| **Secret** | `if_sk_` | Server-side only. Full access to all resources. |
| **Publishable** | `if_pk_` | Safe for client-side. Read-only: search, chat, recommendations, feedback submit, prompts. |

## Resources

### Products

```typescript
// Search
const results = await client.products.search({ text: 'blue shoes', limit: 10 });

// Search with facets for building filter UI
const faceted = await client.products.searchWithFacets(
  { text: 'shoes' },
  ['categories', 'brands', 'price_ranges'],
);
console.log(faceted.data.facets);

// CRUD (secret key)
await client.products.upsert({ id: '1', name: 'Running Shoe', price: 99.99 });
await client.products.get('1');
await client.products.delete('1');

// Bulk operations (secret key)
await client.products.bulkUpsert([{ id: '1', name: 'A' }, { id: '2', name: 'B' }]);
await client.products.bulkDelete(['1', '2']);

// List IDs / delete by query (secret key)
await client.products.listIds({ limit: 100 });
await client.products.deleteByQuery([{ field: 'categories', value: 'clearance' }]);
```

### Posts

Same interface as Products — `search`, `get`, `upsert`, `delete`, `bulkUpsert`, `bulkDelete`, `listIds`, `deleteByQuery`.

```typescript
await client.posts.search({ text: 'return policy' });
await client.posts.upsert({ id: 'p1', title: 'Return Policy', content: '...' });
```

### Taxonomies

Same interface as Products (except no search).

```typescript
await client.taxonomies.upsert({ id: 't1', name: 'Color', slug: 'color', taxonomyName: 'category' });
await client.taxonomies.get('t1');
await client.taxonomies.bulkUpsert([{ id: 't1', name: 'Color', slug: 'color', taxonomyName: 'tag' }]);
await client.taxonomies.listIds();
```

### Chat

```typescript
// Non-streaming
const response = await client.chat.send({
  message: 'What shoes do you recommend?',
  threadId: 'thread-1',
});
console.log(response.data.message.intro);

// Streaming
for await (const chunk of client.chat.stream({
  message: 'Tell me about your return policy',
  threadId: 'thread-1',
})) {
  switch (chunk.type) {
    case 'text_delta':
      process.stdout.write(chunk.data);
      break;
    case 'product':
      console.log('Product:', chunk.data);
      break;
    case 'domain_offer':
      console.log('Offer:', chunk.data);
      break;
    case 'complete':
      console.log('\nDone');
      break;
  }
}
```

#### Type Guards

```typescript
import { isTextDelta, isProduct, isPost, isDomainOffer, isComplete } from '@intufind/ai-sdk';

for await (const chunk of client.chat.stream({ message: '...', threadId: '...' })) {
  if (isTextDelta(chunk)) console.log(chunk.data);       // string
  if (isProduct(chunk))   console.log(chunk.data.name);   // Product
  if (isPost(chunk))      console.log(chunk.data.title);  // Post
}
```

#### Cancellation

```typescript
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000);

for await (const chunk of client.chat.stream(
  { message: '...', threadId: '...' },
  { signal: controller.signal },
)) {
  // ...
}
```

### Prompts

```typescript
// List prompts (publishable key safe)
const prompts = await client.prompts.list({ limit: 20 });

// Get by ID
const prompt = await client.prompts.get('prompt-1');

// Create / update (secret key)
await client.prompts.upsert({
  prompt: 'What size shoe do you wear?',
  title: 'Shoe size',
  categories: ['shoes'],
});

// Delete (secret key)
await client.prompts.delete('prompt-1');
```

### Recommendations

```typescript
const recs = await client.recommendations.get({
  productId: 'prod-1',
  maxRecommendations: 5,
});
console.log(recs.data.recommendations);
```

### Webhooks (secret key)

```typescript
// Create
await client.webhooks.create({
  name: 'Inventory sync',
  url: 'https://example.com/webhook',
  events: ['product.upsert', 'product.delete'],
});

// List, get, update, delete
const hooks = await client.webhooks.list({ status: 'active' });
await client.webhooks.update('webhook-1', { status: 'inactive' });
await client.webhooks.delete('webhook-1');

// Test delivery
const result = await client.webhooks.test('webhook-1');
console.log(result.data.success);

// Available events
const events = await client.webhooks.events();
```

### Threads (secret key)

```typescript
const threads = await client.threads.search({
  filters: { has_handoff: true },
  sort_by: 'created_at',
  sort_order: 'desc',
});

const messages = await client.threads.getMessages('thread-1');
await client.threads.export('thread-1');
await client.threads.endHandoff('thread-1');
await client.threads.delete('thread-1');
```

### Feedback

```typescript
// Submit (publishable key safe)
await client.feedback.submit({
  threadId: 'thread-1',
  rating: 'positive',
  comment: 'Very helpful!',
});

// Admin operations (secret key)
const results = await client.feedback.search({ filters: { rating: 'negative' } });
const analytics = await client.feedback.analytics();
const threadFeedback = await client.feedback.forThread('thread-1');
await client.feedback.delete('feedback-1');
```

### Analytics (secret key)

```typescript
const searchStats = await client.analytics.search({ days: 30, topN: 10 });
const chatStats = await client.analytics.chat({ days: 7 });
const feedbackStats = await client.analytics.feedback({ dateFrom: '2026-01-01', dateTo: '2026-02-26' });
```

### API Keys (secret key)

```typescript
const keys = await client.apiKeys.list();
const newKey = await client.apiKeys.create({ label: 'Production', keyType: 'secret' });
console.log(newKey.data.key); // Only shown once

await client.apiKeys.revoke('key-1');
const rotated = await client.apiKeys.rotate('key-1');
```

## Error Handling

All API errors throw typed exceptions:

```typescript
import {
  IntufindError,
  AuthenticationError,
  ValidationError,
  RateLimitError,
  TrialExpiredError,
  NotFoundError,
} from '@intufind/ai-sdk';

try {
  await client.products.get('nonexistent');
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log(error.message);    // "Resource not found"
    console.log(error.status);     // 404
    console.log(error.requestId);  // For debugging with support
  }

  if (error instanceof RateLimitError) {
    // Back off and retry
  }

  if (error instanceof TrialExpiredError) {
    console.log(error.upgradeUrl);
  }
}
```

Transient errors (5xx, network) are automatically retried with exponential backoff. Client errors (400, 401, 404) are not retried.

## TypeScript

All request/response types are exported:

```typescript
import type {
  Product,
  ProductSearchRequest,
  ProductSearchResponse,
  ChatRequest,
  StreamChunk,
  Webhook,
} from '@intufind/ai-sdk';
```

## License

MIT
