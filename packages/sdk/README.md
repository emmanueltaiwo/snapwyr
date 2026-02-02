# snapwyr

Zero-config HTTP request logger for Node.js with a real-time web dashboard.

## Installation

```bash
npm install snapwyr
```

## Quick Start

### Log Incoming Requests (Middleware)

```javascript
import express from 'express';
import { snapwyr } from 'snapwyr/express';

const app = express();
app.use(snapwyr());

app.get('/api/users', (req, res) => res.json([]));
app.listen(3000);
```

### Log Outgoing Requests

```javascript
import { logRequests } from 'snapwyr';

// Log fetch requests (automatic)
logRequests();
await fetch('https://api.example.com/users');

// To log axios requests, pass your axios instance
import axios from 'axios';
logRequests({ axios: axios });
await axios.get('https://api.example.com/users');
```

### Open the Dashboard

```javascript
import { serve } from 'snapwyr/dashboard';

serve(3333); // http://localhost:3333
```

## Console Output

```
12:34:56.789 GET    200  45ms   /api/users
12:34:57.123 POST   201  89ms   /api/users
12:34:58.456 GET    404  12ms   /api/unknown
```

## Framework Middleware

### Express

```javascript
import express from 'express';
import { snapwyr } from 'snapwyr/express';

const app = express();
app.use(snapwyr({ logBody: true }));
```

### Fastify

```javascript
import Fastify from 'fastify';
import { snapwyr } from 'snapwyr/fastify';

const fastify = Fastify();
fastify.register(snapwyr, { logBody: true });
```

### Koa

```javascript
import Koa from 'koa';
import { snapwyr } from 'snapwyr/koa';

const app = new Koa();
app.use(snapwyr({ logBody: true }));
```

### Hono

```javascript
import { Hono } from 'hono';
import { snapwyr } from 'snapwyr/hono';

const app = new Hono();
app.use('*', snapwyr({ logBody: true }));
```

### NestJS

```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SnapwyrInterceptor } from 'snapwyr/nestjs';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useValue: SnapwyrInterceptor({ logBody: true }),
    },
  ],
})
export class AppModule {}
```

### Next.js

Create `proxy.ts` in your project root:

```typescript
import { snapwyr } from 'snapwyr/nextjs';

export const proxy = snapwyr({ logBody: true });

export const config = {
  matcher: '/api/:path*',
};
```

## Dashboard

The dashboard provides a real-time web UI for viewing requests.

```javascript
import express from 'express';
import { snapwyr } from 'snapwyr/express';
import { logRequests } from 'snapwyr';
import { serve } from 'snapwyr/dashboard';

const app = express();

// Log incoming requests
app.use(snapwyr({ logBody: true }));

// Log outgoing requests
logRequests({ logBody: true });

// Start dashboard
serve(3333);

app.listen(3000);
```

Features:

- Live WebSocket updates
- Filter by method, status code, direction
- Search by URL or body content
- View request/response bodies
- Copy as cURL command
- Direction indicator (incoming vs outgoing)

## Configuration

```typescript
interface SnapWyrConfig {
  // Output
  format?: 'pretty' | 'json'; // Log format (default: 'pretty')
  emoji?: boolean; // Show emoji indicators
  silent?: boolean; // Disable console output
  prefix?: string; // Prefix for log lines
  showTimestamp?: boolean; // Show timestamps (default: true)

  // Body logging
  logBody?: boolean; // Log request/response bodies
  bodySizeLimit?: number; // Max body size in bytes (default: 10KB)

  // Filtering
  errorsOnly?: boolean; // Only log 4xx/5xx responses
  methods?: string[]; // Only log these HTTP methods
  statusCodes?: number[]; // Only log these status codes
  ignorePatterns?: (string | RegExp)[]; // URLs to ignore

  // Features
  slowThreshold?: number; // Mark slow requests (ms, default: 1000)
  requestId?: boolean; // Generate X-Request-ID headers
  sizeTracking?: boolean; // Track request/response sizes
  redact?: (string | RegExp)[]; // Patterns to redact from bodies

  // HTTP Clients
  axios?: any; // Axios instance to intercept (required for axios logging)

  // Advanced
  transport?: (entry: LogEntry) => void; // Custom log handler
  enabled?: boolean; // Enable/disable logging
}
```

## Examples

### Log axios requests

```javascript
import axios from 'axios';
import { logRequests } from 'snapwyr';

// Pass your axios instance to enable axios logging
logRequests({
  axios: axios, // Required for axios interception
  logBody: true,
});

// Custom axios instances also work
const apiClient = axios.create({ baseURL: 'https://api.example.com' });
logRequests({ axios: apiClient });
```

### Log bodies with size limit

```javascript
snapwyr({
  logBody: true,
  bodySizeLimit: 5000, // 5KB max
});
```

### Redact sensitive data

```javascript
snapwyr({
  logBody: true,
  redact: ['password', 'token', 'secret', /api[_-]?key/i],
});
```

Output:

```json
{ "password": "[REDACTED]", "email": "user@example.com" }
```

### Generate request IDs

```javascript
snapwyr({
  requestId: true,
});
```

Adds `X-Request-ID` header to responses and logs:

```
[m2x9k-a3b] GET 200 45ms /api/users
```

### Track request sizes

```javascript
snapwyr({
  sizeTracking: true,
});
```

Output:

```
GET 200 45ms 2.4KB /api/users
```

### Filter by status code

```javascript
snapwyr({
  statusCodes: [500, 502, 503, 504], // Only log server errors
});
```

### JSON output

```javascript
snapwyr({
  format: 'json',
});
```

Output:

```json
{
  "id": "m2x9k",
  "timestamp": "2024-01-15T12:34:56.789Z",
  "method": "GET",
  "url": "/api/users",
  "status": 200,
  "duration": 45
}
```

### Custom transport

```javascript
snapwyr({
  transport: (entry) => {
    // Send to external service
    fetch('https://logs.example.com', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  },
});
```

### Ignore patterns

```javascript
snapwyr({
  ignorePatterns: ['/health', '/metrics', /^\/_next/],
});
```

## API

### `logRequests(config?)`

Start logging outgoing HTTP requests (fetch, axios).

```javascript
import { logRequests } from 'snapwyr';

// Log fetch requests (automatic)
logRequests();

// To log axios requests, pass your axios instance
import axios from 'axios';
logRequests({
  axios: axios, // Required for axios interception
  logBody: true,
});

// Or with a custom axios instance
const apiClient = axios.create({ baseURL: 'https://api.example.com' });
logRequests({
  axios: apiClient, // Required for axios interception
});
```

### `stopLogging()`

Stop logging outgoing requests.

```javascript
import { stopLogging } from 'snapwyr';
stopLogging();
```

### `toCurl(params)`

Generate a cURL command from request data.

```javascript
import { toCurl } from 'snapwyr';

const curl = toCurl({
  method: 'POST',
  url: 'https://api.example.com/users',
  headers: { 'Content-Type': 'application/json' },
  body: '{"name":"John"}',
});
```

### `generateRequestId()`

Generate a unique request ID.

```javascript
import { generateRequestId } from 'snapwyr';
const id = generateRequestId(); // "m2x9k-a3b7c"
```

### `serve(port, options?)`

Start the dashboard server.

```javascript
import { serve } from 'snapwyr/dashboard';
serve(3333, { open: true });
```

### `stop()`

Stop the dashboard server.

```javascript
import { stop } from 'snapwyr/dashboard';
stop();
```

## Production Safety

Snapwyr automatically disables itself when `NODE_ENV=production`:

```javascript
// In production, this does nothing
logRequests();
```

The middleware still works in production but logging is disabled by default. To enable:

```javascript
snapwyr({ enabled: true });
```

## Requirements

- Node.js >= 18

## License

AGPL-3.0
