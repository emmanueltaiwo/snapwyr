import { EventEmitter } from 'events';
import { patchFetch } from './interceptors/fetch.js';
import { patchAxios } from './interceptors/axios.js';

export type RequestDirection = 'incoming' | 'outgoing';

export interface RequestEvent {
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
  direction?: RequestDirection;
}

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

export type TransportFn = (entry: LogEntry) => void;

export interface SnapWyrConfig {
  /** Enable or disable logging (default: true) */
  enabled?: boolean;
  /** Log request and response bodies (default: false) */
  logBody?: boolean;
  /** Maximum size of logged body in characters (default: 1000) */
  bodySizeLimit?: number;
  /** URL patterns to ignore (strings are converted to RegExp) */
  ignorePatterns?: (string | RegExp)[];
  /** Only log specific HTTP methods */
  methods?: string[];
  /** Only log errors (4xx and 5xx responses) */
  errorsOnly?: boolean;
  /** Show timestamp in logs (default: true) */
  showTimestamp?: boolean;
  /** Output format: 'pretty' for colorized console, 'json' for structured JSON (default: 'pretty') */
  format?: 'pretty' | 'json';
  /** Silent mode - completely disables all logging output (useful for tests) */
  silent?: boolean;
  /** Use emojis for status indicators (default: false) */
  emoji?: boolean;
  /** Custom prefix for log messages (e.g., '[API]', '[HTTP]') */
  prefix?: string;
  /** Duration threshold in ms to mark requests as slow (default: 1000) */
  slowThreshold?: number;
  /** Patterns to redact from logged bodies (e.g., ['password', 'token', /credit_?card/i]) */
  redact?: (string | RegExp)[];
  /** Custom transport function for log output (receives structured log entry) */
  transport?: TransportFn;
  /** Include request ID in logs (default: false) */
  requestId?: boolean;
  /** Only log specific status codes (e.g., [200, 201, 404, 500]) */
  statusCodes?: number[];
  /** Track and display request/response body sizes (default: false) */
  sizeTracking?: boolean;
  /** Axios instance to intercept (required for axios logging) */
  axios?: any;
}

export function generateRequestId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(i > 0 ? 1 : 0)} ${sizes[i]}`;
}

export function getByteSize(str: string): number {
  return new TextEncoder().encode(str).length;
}

export function redactSensitiveData(
  data: string,
  patterns: (string | RegExp)[]
): string {
  if (!patterns || patterns.length === 0) {
    return data;
  }

  let result = data;

  try {
    const parsed = JSON.parse(data);
    const redacted = redactObject(parsed, patterns);
    return JSON.stringify(redacted);
  } catch {
    for (const pattern of patterns) {
      const regex =
        typeof pattern === 'string'
          ? new RegExp(`("${pattern}"\\s*:\\s*)"[^"]*"`, 'gi')
          : pattern;
      result = result.replace(
        regex,
        typeof pattern === 'string' ? '$1"[REDACTED]"' : '[REDACTED]'
      );
    }
    return result;
  }
}

function redactObject(obj: unknown, patterns: (string | RegExp)[]): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => redactObject(item, patterns));
  }

  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const shouldRedact = patterns.some((pattern) => {
        if (typeof pattern === 'string') {
          return key.toLowerCase().includes(pattern.toLowerCase());
        }
        return pattern.test(key);
      });

      if (shouldRedact && typeof value === 'string') {
        result[key] = '[REDACTED]';
      } else if (typeof value === 'object') {
        result[key] = redactObject(value, patterns);
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  return obj;
}

export function toCurl(params: {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: string;
}): string {
  const { method, url, headers, body } = params;
  const parts = ['curl'];

  if (method.toUpperCase() !== 'GET') {
    parts.push(`-X ${method.toUpperCase()}`);
  }

  if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      if (key.startsWith(':') || key.toLowerCase() === 'authorization') {
        continue;
      }
      parts.push(`-H '${key}: ${value}'`);
    }
  }

  if (body && method.toUpperCase() !== 'GET') {
    const escapedBody = body.replace(/'/g, "'\\''");
    parts.push(`-d '${escapedBody}'`);
  }

  parts.push(`'${url}'`);

  return parts.join(' \\\n  ');
}

export class SnapWyrEmitter extends EventEmitter {
  private patched = false;
  private config: SnapWyrConfig = {};

  start(config: SnapWyrConfig = {}) {
    if (this.patched) return;
    if (process.env.NODE_ENV === 'production') return;
    if (config.enabled === false) return;

    this.config = { enabled: true, showTimestamp: true, ...config };
    this.patched = true;

    try {
      patchFetch(this);
      patchAxios(this, config.axios);
    } catch (error) {
      console.error('[SnapWyr] Failed to patch HTTP clients:', error);
    }
  }

  stop() {
    this.patched = false;
    this.removeAllListeners();
  }

  shouldLog(event: RequestEvent): boolean {
    if (
      this.config.errorsOnly &&
      !event.error &&
      event.status &&
      event.status < 400
    ) {
      return false;
    }

    if (
      this.config.methods &&
      !this.config.methods.includes(event.method.toUpperCase())
    ) {
      return false;
    }

    if (this.config.ignorePatterns) {
      for (const pattern of this.config.ignorePatterns) {
        const regex =
          typeof pattern === 'string' ? new RegExp(pattern) : pattern;
        if (regex.test(event.url)) {
          return false;
        }
      }
    }

    // Filter by status codes
    if (this.config.statusCodes && this.config.statusCodes.length > 0) {
      if (!event.status || !this.config.statusCodes.includes(event.status)) {
        return false;
      }
    }

    return true;
  }

  emitRequest(event: RequestEvent) {
    if (!this.shouldLog(event)) return;
    if (this.config.enabled === false) return;
    this.emit('request', event);
    this.logToConsole(event);
  }

  private logToConsole(event: RequestEvent): void {
    if (this.config.silent) {
      return;
    }

    const prefix = this.config.prefix ? `${this.config.prefix} ` : '';
    const slowThreshold = this.config.slowThreshold ?? 1000;
    const isSlow = event.duration >= slowThreshold;

    let requestBody = event.requestBody;
    let responseBody = event.responseBody;

    if (this.config.redact && this.config.redact.length > 0) {
      if (requestBody) {
        requestBody = redactSensitiveData(requestBody, this.config.redact);
      }
      if (responseBody) {
        responseBody = redactSensitiveData(responseBody, this.config.redact);
      }
    }

    const requestSize =
      event.requestSize ??
      (event.requestBody ? getByteSize(event.requestBody) : 0);
    const responseSize =
      event.responseSize ??
      (event.responseBody ? getByteSize(event.responseBody) : 0);
    const totalSize = requestSize + responseSize;

    const logEntry: LogEntry = {
      id: event.id,
      timestamp: new Date(event.timestamp).toISOString(),
      method: event.method.toUpperCase(),
      url: event.url,
      status: event.status,
      duration: event.duration,
      slow: isSlow,
    };

    if (this.config.prefix) {
      logEntry.prefix = this.config.prefix;
    }
    if (event.error) {
      logEntry.error = event.error;
    }
    if (this.config.logBody && requestBody) {
      logEntry.requestBody = requestBody;
    }
    if (this.config.logBody && responseBody) {
      logEntry.responseBody = responseBody;
    }
    if (this.config.sizeTracking) {
      logEntry.requestSize = requestSize;
      logEntry.responseSize = responseSize;
      logEntry.totalSize = totalSize;
    }

    if (this.config.transport) {
      this.config.transport(logEntry);
    }

    if (this.config.format === 'json') {
      console.log(JSON.stringify(logEntry));
      return;
    }

    const timestamp =
      this.config.showTimestamp !== false
        ? new Date(event.timestamp).toISOString().slice(11, 23) + ' '
        : '';
    const method = event.method.toUpperCase().padEnd(6);
    const status = event.status ? event.status.toString() : 'ERROR';
    const duration = `${event.duration}ms`;
    const url = event.url;

    const useEmoji = this.config.emoji === true;
    let statusEmoji = '';
    if (useEmoji) {
      if (event.error || (event.status && event.status >= 500)) {
        statusEmoji = '✗ ';
      } else if (event.status && event.status >= 400) {
        statusEmoji = '⚠ ';
      } else if (event.status && event.status >= 300) {
        statusEmoji = '↪ ';
      } else {
        statusEmoji = '✓ ';
      }
    }

    let statusColor = '';
    let durationColor = '';

    if (event.error || (event.status && event.status >= 500)) {
      statusColor = '\x1b[31m';
    } else if (event.status && event.status >= 400) {
      statusColor = '\x1b[33m';
    } else if (event.status && event.status >= 300) {
      statusColor = '\x1b[36m';
    } else if (event.status) {
      statusColor = '\x1b[32m';
    }

    // Duration color based on slow threshold
    if (isSlow) {
      durationColor = '\x1b[31m';
    } else if (event.duration < 100) {
      durationColor = '\x1b[32m';
    } else if (event.duration < slowThreshold / 2) {
      durationColor = '\x1b[33m';
    } else {
      durationColor = '\x1b[33m';
    }

    const methodColors: Record<string, string> = {
      GET: '\x1b[34m',
      POST: '\x1b[32m',
      PUT: '\x1b[33m',
      PATCH: '\x1b[35m',
      DELETE: '\x1b[31m',
    };
    const methodColor = methodColors[event.method.toUpperCase()] || '';

    const reset = '\x1b[0m';
    const dim = '\x1b[2m';
    const bold = '\x1b[1m';

    const slowIndicator = isSlow ? ` ${bold}[SLOW]${reset}` : '';
    const requestIdDisplay = this.config.requestId
      ? `${dim}[${event.id}]${reset} `
      : '';
    const sizeDisplay = this.config.sizeTracking
      ? `${dim}${formatBytes(totalSize)}${reset} `
      : '';

    const parts = [
      prefix ? `${dim}${prefix}${reset}` : '',
      requestIdDisplay,
      `${dim}${timestamp}${reset}`,
      `${methodColor}${method}${reset}`,
      `${statusColor}${statusEmoji}${status}${reset}`,
      `${durationColor}${duration}${reset}${slowIndicator}`,
      sizeDisplay,
      `${dim}${url}${reset}`,
    ].filter(Boolean);

    if (event.error) {
      parts.push(`\n  ${dim}Error: ${event.error}${reset}`);
    }

    if (this.config.logBody && requestBody) {
      const body =
        requestBody.length > 200
          ? requestBody.slice(0, 200) + '...'
          : requestBody;
      parts.push(`\n  ${dim}Request: ${body}${reset}`);
    }

    if (this.config.logBody && responseBody) {
      const body =
        responseBody.length > 200
          ? responseBody.slice(0, 200) + '...'
          : responseBody;
      parts.push(`\n  ${dim}Response: ${body}${reset}`);
    }

    console.log(parts.join(' '));
  }

  getConfig(): SnapWyrConfig {
    return this.config;
  }
}

const GLOBAL_KEY = Symbol.for('snapwyr.emitter');
const globalObj = globalThis as unknown as Record<symbol, SnapWyrEmitter>;

if (!globalObj[GLOBAL_KEY]) {
  globalObj[GLOBAL_KEY] = new SnapWyrEmitter();
}

export const snapwyr = globalObj[GLOBAL_KEY];
