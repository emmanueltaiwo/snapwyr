import { createServer, IncomingMessage, ServerResponse } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { DASHBOARD_HTML } from './html.js';

export type RequestDirection = 'incoming' | 'outgoing';

export interface LogEntry {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  status: number | undefined;
  duration: number;
  slow: boolean;
  error?: string;
  requestBody?: string;
  responseBody?: string;
  prefix?: string;
  requestSize?: number;
  responseSize?: number;
  totalSize?: number;
  direction?: RequestDirection;
}

/** Dashboard server configuration */
export interface DashboardConfig {
  /** Port to run the dashboard server on (default: 3333) */
  port?: number;
  /** Maximum number of requests to keep in memory (default: 1000) */
  maxRequests?: number;
  /** Hostname to bind to (default: 'localhost') */
  host?: string;
  /** Whether to open the browser automatically (default: false) */
  open?: boolean;
}

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

class RingBuffer<T> {
  private buffer: T[] = [];
  private capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  push(item: T): void {
    if (this.buffer.length >= this.capacity) {
      this.buffer.shift();
    }
    this.buffer.push(item);
  }

  toArray(): T[] {
    return [...this.buffer];
  }

  clear(): void {
    this.buffer = [];
  }

  get length(): number {
    return this.buffer.length;
  }
}

let dashboardServer: ReturnType<typeof createServer> | null = null;
let wsServer: WebSocketServer | null = null;
let requestStore: RingBuffer<LogEntry> | null = null;
const clients = new Set<WebSocket>();

/**
 * Start the Snapwyr dashboard server
 *
 * @example
 * ```ts
 * import { logRequests } from 'snapwyr';
 * import { serve } from 'snapwyr/dashboard';
 *
 * logRequests({ logBody: true });
 * serve({ port: 3333 });
 * ```
 */
export function serve(config: DashboardConfig | number = {}): void {
  // Allow passing just the port number
  const options: DashboardConfig =
    typeof config === 'number' ? { port: config } : config;

  const port = options.port ?? 3333;
  const host = options.host ?? 'localhost';
  const maxRequests = options.maxRequests ?? 1000;

  if (dashboardServer) {
    console.warn('[Snapwyr Dashboard] Server is already running');
    return;
  }

  requestStore = new RingBuffer<LogEntry>(maxRequests);

  dashboardServer = createServer(handleRequest);

  wsServer = new WebSocketServer({ server: dashboardServer });

  wsServer.on('connection', (ws: WebSocket) => {
    clients.add(ws);

    // Send current request history
    ws.send(
      JSON.stringify({
        type: 'init',
        requests: requestStore?.toArray() ?? [],
      })
    );

    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.type === 'clear') {
          requestStore?.clear();
          broadcast({ type: 'clear' });
        }
      } catch {}
    });

    ws.on('close', () => {
      clients.delete(ws);
    });
  });

  dashboardServer.listen(port, host, () => {
    const url = `http://${host}:${port}`;

    const orange = '\x1b[38;5;208m';
    const cyan = '\x1b[36m';
    const bold = '\x1b[1m';
    const dim = '\x1b[2m';
    const reset = '\x1b[0m';

    console.log(`
${orange}╭────────────────────────────────────────────╮${reset}
${orange}│${reset}  🔥 ${bold}Snapwyr Dashboard${reset}
${orange}│${reset}
${orange}│${reset}  ${dim}Status:${reset}   ${cyan}Running${reset}
${orange}│${reset}  ${dim}Local:${reset}    ${cyan}${url}${reset}
${orange}│${reset}
${orange}╰────────────────────────────────────────────╯${reset}
  `);

    if (options.open) openBrowser(url);
  });

  // Connect to snapwyr events
  connectToSnapwyr();
}

/**
 * Stop the dashboard server
 */
export function stop(): void {
  if (wsServer) {
    wsServer.close();
    wsServer = null;
  }
  if (dashboardServer) {
    dashboardServer.close();
    dashboardServer = null;
  }
  clients.clear();
  console.log('[Snapwyr Dashboard] Server stopped');
}

export function pushRequest(entry: LogEntry): void {
  if (!requestStore) return;

  requestStore.push(entry);
  broadcast({ type: 'request', data: entry });
}

function broadcast(message: unknown): void {
  const data = JSON.stringify(message);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}

/**
 * Handle HTTP requests
 */
function handleRequest(req: IncomingMessage, res: ServerResponse): void {
  const url = req.url || '/';

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (url === '/' || url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(DASHBOARD_HTML);
    return;
  }

  if (url === '/api/requests') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(requestStore?.toArray() ?? []));
    return;
  }

  if (url === '/api/clear' && req.method === 'POST') {
    requestStore?.clear();
    broadcast({ type: 'clear' });
    res.writeHead(200);
    res.end(JSON.stringify({ success: true }));
    return;
  }

  if (url === '/api/stats') {
    const requests = requestStore?.toArray() ?? [];
    const stats = calculateStats(requests);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(stats));
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
}

function calculateStats(requests: LogEntry[]) {
  if (requests.length === 0) {
    return {
      totalRequests: 0,
      avgDuration: 0,
      errorRate: 0,
      requestsPerSecond: 0,
    };
  }

  const totalDuration = requests.reduce((sum, r) => sum + r.duration, 0);
  const errors = requests.filter(
    (r) => r.error || (r.status && r.status >= 400)
  ).length;

  return {
    totalRequests: requests.length,
    avgDuration: Math.round(totalDuration / requests.length),
    errorRate: Math.round((errors / requests.length) * 100),
    requestsPerSecond: 0,
  };
}

function connectToSnapwyr(): void {
  try {
    // Dynamic import from edge-safe emitter module (no axios)
    import('@snapwyr/core/emitter')
      .then(({ snapwyr }) => {
        snapwyr.on('request', (event: unknown) => {
          const e = event as Record<string, unknown>;
          const timestamp =
            typeof e.timestamp === 'number'
              ? new Date(e.timestamp).toISOString()
              : typeof e.timestamp === 'string'
                ? e.timestamp
                : new Date().toISOString();

          pushRequest({
            id: String(e.id || generateId()),
            timestamp,
            method: String(e.method || 'GET'),
            url: String(e.url || '/'),
            status: typeof e.status === 'number' ? e.status : undefined,
            duration: typeof e.duration === 'number' ? e.duration : 0,
            slow: Boolean(e.slow),
            error: e.error ? String(e.error) : undefined,
            requestBody: e.requestBody ? String(e.requestBody) : undefined,
            responseBody: e.responseBody ? String(e.responseBody) : undefined,
            prefix: e.prefix ? String(e.prefix) : undefined,
            requestSize:
              typeof e.requestSize === 'number' ? e.requestSize : undefined,
            responseSize:
              typeof e.responseSize === 'number' ? e.responseSize : undefined,
            totalSize:
              typeof e.totalSize === 'number' ? e.totalSize : undefined,
            direction:
              e.direction === 'incoming' || e.direction === 'outgoing'
                ? e.direction
                : undefined,
          });
        });
        console.log('[Snapwyr Dashboard] Connected to core event emitter');
      })
      .catch(() => {
        console.log(
          '[Snapwyr Dashboard] Core not available - use pushRequest() manually'
        );
      });
  } catch {}
}

function openBrowser(url: string): void {
  const { exec } = require('child_process');
  const platform = process.platform;

  let command: string;
  if (platform === 'darwin') {
    command = `open "${url}"`;
  } else if (platform === 'win32') {
    command = `start "${url}"`;
  } else {
    command = `xdg-open "${url}"`;
  }

  exec(command, (err: Error | null) => {
    if (err) {
      console.log(`[Snapwyr Dashboard] Could not open browser: ${err.message}`);
    }
  });
}
