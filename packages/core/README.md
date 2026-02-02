# @snapwyr/core

Internal package containing the core HTTP interception and event system for Snapwyr.

## Overview

This is an internal package used by the `snapwyr` SDK. You should not install this package directly. Use `snapwyr` instead.

## What It Does

- Patches `globalThis.fetch` to intercept outgoing requests (automatic)
- Patches `axios` when axios instance is provided in config
- Emits request events with method, URL, status, duration, and bodies
- Provides a global event emitter for cross-package communication

## Architecture

```
@snapwyr/core
├── SnapWyrEmitter (global singleton)
│   ├── start() - Patch HTTP clients
│   ├── stop() - Restore original clients
│   ├── on('request', handler) - Listen for events
│   └── emitRequest(event) - Emit request events
├── Interceptors
│   ├── fetch.ts - Patches global fetch
│   └── axios.ts - Patches axios
└── Utilities
    ├── redactSensitiveData()
    ├── generateRequestId()
    ├── formatBytes()
    └── toCurl()
```

## Exports

### `snapwyr`

The global event emitter singleton.

```typescript
import { snapwyr } from '@snapwyr/core';

// Log fetch requests (automatic)
snapwyr.start({ logBody: true });

// To log axios requests, pass your axios instance
import axios from 'axios';
snapwyr.start({
  axios: axios, // Required for axios interception
  logBody: true,
});

snapwyr.on('request', (event) => {
  console.log(event.method, event.url, event.status);
});
```

### Types

```typescript
interface RequestEvent {
  id: string;
  method: string;
  url: string;
  status?: number;
  duration: number;
  timestamp: number;
  requestBody?: string;
  responseBody?: string;
  error?: string;
  headers?: Record<string, string>;
  requestSize?: number;
  responseSize?: number;
  direction?: 'incoming' | 'outgoing';
}

interface SnapWyrConfig {
  enabled?: boolean;
  logBody?: boolean;
  bodySizeLimit?: number;
  format?: 'pretty' | 'json';
  emoji?: boolean;
  silent?: boolean;
  prefix?: string;
  showTimestamp?: boolean;
  slowThreshold?: number;
  errorsOnly?: boolean;
  methods?: string[];
  statusCodes?: number[];
  ignorePatterns?: (string | RegExp)[];
  redact?: (string | RegExp)[];
  requestId?: boolean;
  sizeTracking?: boolean;
  transport?: (entry: LogEntry) => void;
  axios?: any; // Axios instance to intercept (required for axios logging)
}
```

## Installation

This package is installed automatically as a dependency of `snapwyr`. You typically don't need to install it directly.

```bash
npm install @snapwyr/core
```

## License

AGPL-3.0
