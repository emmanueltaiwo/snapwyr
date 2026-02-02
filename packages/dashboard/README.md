# @snapwyr/dashboard

Real-time web dashboard for Snapwyr HTTP request logging.

## Overview

This is an internal package that provides a web-based dashboard for viewing HTTP requests logged by Snapwyr. It's automatically included when you use the `snapwyr/dashboard` import.

## Usage

```javascript
import { snapwyr } from 'snapwyr/express';
import { logRequests } from 'snapwyr';
import { serve } from 'snapwyr/dashboard';

const app = express();

// Log incoming requests
app.use(snapwyr({ logBody: true }));

// Log outgoing requests
logRequests({ logBody: true });

// To log axios requests, pass your axios instance
import axios from 'axios';
logRequests({
  axios: axios, // Required for axios interception
  logBody: true,
});

// Start dashboard on port 3333
serve(3333);

app.listen(3000);
```

Then open http://localhost:3333 in your browser.

## Features

- Live WebSocket updates
- Filter by HTTP method (GET, POST, PUT, PATCH, DELETE)
- Filter by status code (2xx, 3xx, 4xx, 5xx)
- Filter by direction (incoming, outgoing)
- Filter errors and slow requests
- Search by URL or body content
- View request/response bodies
- Copy request as cURL command
- Request timing and size information
- Dark theme UI

## API

### `serve(port, options?)`

Start the dashboard server.

```typescript
import { serve } from 'snapwyr/dashboard';

serve(3333);

// With options
serve(3333, {
  host: 'localhost', // Default: 'localhost'
  open: true, // Auto-open browser (default: false)
  maxRequests: 1000, // Max requests to store (default: 1000)
});
```

### `stop()`

Stop the dashboard server.

```typescript
import { stop } from 'snapwyr/dashboard';

stop();
```

### `pushRequest(entry)`

Manually push a request to the dashboard.

```typescript
import { pushRequest } from 'snapwyr/dashboard';

pushRequest({
  id: 'unique-id',
  timestamp: new Date().toISOString(),
  method: 'GET',
  url: '/api/users',
  status: 200,
  duration: 45,
  slow: false,
});
```

## Architecture

The dashboard consists of:

1. **HTTP Server** - Serves the dashboard UI and REST API
2. **WebSocket Server** - Pushes real-time updates to connected clients
3. **React UI** - Single-page application embedded in the server

The UI is built with Vite + React + TypeScript + Tailwind CSS, then bundled into a single HTML file that's embedded in the Node.js server.

## Development

```bash
# Install dependencies
npm install

# Run UI in dev mode
npm run dev

# Build everything
npm run build
```

## Installation

This package is installed automatically as a dependency of `snapwyr`. You typically don't need to install it directly.

```bash
npm install @snapwyr/dashboard
```

## License

AGPL-3.0
