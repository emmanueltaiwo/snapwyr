import { EventEmitter } from 'events';

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
  enabled?: boolean;
  logBody?: boolean;
  bodySizeLimit?: number;
  ignorePatterns?: (string | RegExp)[];
  methods?: string[];
  errorsOnly?: boolean;
  showTimestamp?: boolean;
  format?: 'pretty' | 'json';
  silent?: boolean;
  emoji?: boolean;
  prefix?: string;
  slowThreshold?: number;
  redact?: (string | RegExp)[];
  transport?: TransportFn;
  requestId?: boolean;
  statusCodes?: number[];
  sizeTracking?: boolean;
}

export function generateRequestId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * SnapWyr Event Emitter - core class for event handling
 */
export class SnapWyrEmitter extends EventEmitter {
  private config: SnapWyrConfig = {};

  configure(config: SnapWyrConfig): void {
    this.config = { ...this.config, ...config };
  }

  emitRequest(event: RequestEvent): void {
    this.emit('request', event);
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
