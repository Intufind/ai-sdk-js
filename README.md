# Intufind AI JavaScript SDK

Official JavaScript/TypeScript SDK for [Intufind](https://intufind.com) AI Cloud Services — AI-powered semantic search, chat, and recommendations for e-commerce.

[![npm version](https://img.shields.io/npm/v/@intufind/ai-sdk)](https://www.npmjs.com/package/@intufind/ai-sdk)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)

## Installation

```bash
npm install @intufind/ai-sdk
# or
yarn add @intufind/ai-sdk
# or
pnpm add @intufind/ai-sdk
```

## Quick Start

```typescript
import { IntufindClient } from '@intufind/ai-sdk';

const client = new IntufindClient({
  apiKey: 'your-api-key',
  siteUrl: 'https://your-site.com',
});

// Search products semantically
const results = await client.products().search({
  text: 'wireless noise cancelling headphones',
  limit: 10,
});

for (const product of results.results) {
  console.log(`${product.name} - $${product.price}`);
}
```

## Features

- **Semantic Search** — AI-powered product and content search
- **AI Chat** — Conversational shopping assistant with streaming support
- **Recommendations** — Trending, similar, and personalized product suggestions
- **Content Indexing** — Index products, posts, and custom content
- **Webhooks** — Real-time event notifications
- **Full TypeScript Support** — Complete type definitions included

## Configuration

```typescript
import { IntufindClient, Configuration } from '@intufind/ai-sdk';

const client = new IntufindClient({
  apiKey: 'your-api-key',
  siteUrl: 'https://your-site.com',
  apiEndpoint: 'https://api.intufind.com',      // Optional: custom endpoint
  streamingEndpoint: 'https://stream.intufind.com', // Optional: for chat streaming
  timeout: 30000, // Request timeout in ms
  debug: false,   // Enable debug logging
});

// Or use the Configuration class for more control
const config = new Configuration({
  apiKey: 'your-api-key',
  siteUrl: 'https://your-site.com',
});

const client = new IntufindClient(config);
```

## Usage Examples

### Products

```typescript
// Index a product
await client.products().upsert({
  id: 'sku-123',
  name: 'Wireless Headphones',
  content: 'Premium wireless headphones with active noise cancellation...',
  price: 299.99,
  categories: ['electronics', 'audio'],
  attributes: {
    color: ['Black', 'Silver'],
    brand: ['AudioPro'],
  },
});

// Search products
const results = await client.products().search({
  text: 'comfortable headphones for working from home',
  limit: 10,
  filters: {
    categories: ['electronics'],
  },
});

// Delete a product
await client.products().delete('sku-123');
```

### Posts / Content

```typescript
// Index a blog post
await client.posts().upsert({
  id: 'post-456',
  title: 'Best Headphones for Remote Work',
  content: 'Finding the perfect headphones for your home office...',
  status: 'publish',
  categories: ['guides', 'audio'],
});

// Search posts
const results = await client.posts().search({
  text: 'headphone buying guide',
  limit: 5,
});
```

### AI Chat

```typescript
// Send a chat message
const response = await client.chat().send({
  message: 'I need headphones for working from home, budget around $200',
  threadId: 'user-session-123',
});

console.log(response.intro);

for (const product of response.products) {
  console.log(`- ${product.name}: $${product.price}`);
}

// Streaming chat (for real-time responses)
const stream = await client.chat().stream({
  message: 'Tell me more about the first option',
  threadId: 'user-session-123',
});

for await (const chunk of stream) {
  if (isTextDelta(chunk)) {
    process.stdout.write(chunk.delta);
  } else if (isProduct(chunk)) {
    console.log('\nProduct:', chunk.product.name);
  }
}
```

### Webhooks

```typescript
// Register a webhook
await client.webhooks().create({
  url: 'https://yoursite.com/webhook',
  events: ['product.indexed', 'chat.completed'],
});

// List webhooks
const webhooks = await client.webhooks().list();

// Test a webhook
const result = await client.webhooks().test('webhook-id');
```

## Error Handling

```typescript
import {
  IntufindError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  NotFoundError,
} from '@intufind/ai-sdk';

try {
  const results = await client.products().search({ text: 'headphones' });
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Invalid API key
    console.error('Auth failed:', error.message);
  } else if (error instanceof RateLimitError) {
    // Too many requests
    console.error('Rate limited. Retry after:', error.retryAfter);
  } else if (error instanceof ValidationError) {
    // Invalid request parameters
    console.error('Validation error:', error.message);
  } else if (error instanceof NotFoundError) {
    // Resource not found
    console.error('Not found:', error.message);
  } else if (error instanceof IntufindError) {
    // General API error
    console.error('API error:', error.message);
  }
}
```

## Available Services

| Service | Access | Description |
|---------|--------|-------------|
| Products | `client.products()` | Product indexing and search |
| Posts | `client.posts()` | Content/blog post management |
| Chat | `client.chat()` | AI conversational interface |
| Prompts | `client.prompts()` | Custom AI prompt templates |
| Threads | `client.threads()` | Chat thread management |
| Webhooks | `client.webhooks()` | Webhook management |
| Tenant | `client.tenant()` | Account and subscription info |
| Provisioning | `client.provisioning()` | License activation |
| Config | `client.config()` | Widget/theme configuration |

## Immutable Configuration

The client supports immutable configuration updates:

```typescript
// Create a new client with updated settings
const debugClient = client.withDebug(true);
const otherSite = client.withSiteUrl('https://other-site.com');
const otherKey = client.withApiKey('different-api-key');
```

## Requirements

- Node.js 18.0.0 or later
- Modern browsers with `fetch` support

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Run tests
npm test

# Type check
npm run type-check

# Lint
npm run lint
```

## Support

- **Documentation**: [docs.intufind.com](https://docs.intufind.com)
- **Email**: support@intufind.com
- **Issues**: [GitHub Issues](https://github.com/intufind/ai-sdk-js/issues)

## License

MIT License — see [LICENSE](LICENSE) for details.

