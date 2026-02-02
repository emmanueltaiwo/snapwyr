# Snapwyr

Zero-config HTTP request logger for Node.js with a real-time web dashboard.

## What It Does

Snapwyr logs HTTP requests in your Node.js application:

- **Incoming requests** - Requests hitting your server (via middleware)
- **Outgoing requests** - HTTP calls your app makes (fetch, axios)

All requests appear in your console and optionally in a real-time web dashboard.

## Installation

```bash
npm install snapwyr
```

## Quick Start

### 1. Add Middleware (Incoming Requests)

```javascript
import express from 'express';
import { snapwyr } from 'snapwyr/express';

const app = express();
app.use(snapwyr());
```

### 2. Log Outgoing Requests

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

### 3. Open the Dashboard

```javascript
import { serve } from 'snapwyr/dashboard';

serve(3333); // Open http://localhost:3333
```

## Console Output

```
GET    200  45ms   /api/users
POST   201  123ms  /api/users
GET    404  12ms   /api/unknown
```

## Dashboard

The dashboard provides a real-time web UI showing all requests:

- Live WebSocket updates
- Filter by method, status, direction (incoming/outgoing)
- Search requests
- View request/response bodies
- Copy as cURL
- Error and slow request highlighting

```javascript
import { snapwyr } from 'snapwyr/express';
import { serve } from 'snapwyr/dashboard';

app.use(snapwyr({ logBody: true }));
serve(3333);
```

## Framework Support

| Framework | Import            | Usage                       |
| --------- | ----------------- | --------------------------- |
| Express   | `snapwyr/express` | `app.use(snapwyr())`        |
| Fastify   | `snapwyr/fastify` | `fastify.register(snapwyr)` |
| Koa       | `snapwyr/koa`     | `app.use(snapwyr())`        |
| Hono      | `snapwyr/hono`    | `app.use('*', snapwyr())`   |
| NestJS    | `snapwyr/nestjs`  | `SnapwyrInterceptor()`      |
| Next.js   | `snapwyr/nextjs`  | `snapwyr()`                 |

## Configuration

```typescript
import axios from 'axios';

// For middleware (incoming requests)
snapwyr({
  logBody: true, // Log request/response bodies
  bodySizeLimit: 10000, // Max body size in bytes
  format: 'pretty', // 'pretty' or 'json'
  emoji: false, // Add emoji indicators
  silent: false, // Disable console output
  prefix: '[API]', // Prefix for log lines
  slowThreshold: 1000, // Mark requests slower than this (ms)
  errorsOnly: false, // Only log 4xx/5xx responses
  methods: ['GET', 'POST'], // Only log these methods
  ignorePatterns: ['/health'], // URLs to ignore
  redact: ['password', /token/i], // Redact sensitive fields
  requestId: true, // Generate request IDs
  sizeTracking: true, // Track request/response sizes
  statusCodes: [200, 201], // Only log these status codes
  transport: (entry) => {}, // Custom log handler
});

// For outgoing requests (logRequests)
logRequests({
  axios: axios, // Required to log axios requests
  logBody: true,
  format: 'pretty',
  // ... other options
});
```

## Features

- **Zero-config** - Works out of the box
- **Real-time dashboard** - Web UI with live updates
- **Multiple frameworks** - Express, Fastify, Koa, Hono, NestJS, Next.js
- **Sensitive data redaction** - Hide passwords, tokens, etc.
- **Request IDs** - Track requests across logs
- **Size tracking** - See request/response sizes
- **cURL export** - Copy requests as cURL commands
- **Direction indicator** - Distinguish incoming vs outgoing requests
- **Production safe** - Automatically disabled when `NODE_ENV=production`

## Project Structure

This monorepo contains:

- `packages/sdk` - Main package published as `snapwyr`
- `packages/core` - Core interception logic (`@snapwyr/core`)
- `packages/dashboard` - Real-time web dashboard (`@snapwyr/dashboard`)

## Development

```bash
npm install
npm run build
```

## Requirements

- Node.js >= 18

## License

AGPL-3.0

## Author

[emmanueltaiwo](https://github.com/emmanueltaiwo)
