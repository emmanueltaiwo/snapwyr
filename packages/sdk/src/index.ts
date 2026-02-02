import { snapwyr, SnapWyrConfig } from '@snapwyr/core';

/**
 * @example
 * ```ts
 * import { logRequests } from 'snapwyr';
 * logRequests();
 * logRequests({ format: 'json', emoji: true });
 * ```
 */
export function logRequests(config: SnapWyrConfig = {}): void {
  snapwyr.start(config);
}

export function stopLogging(): void {
  snapwyr.stop();
}

/**
 * @example
 * ```ts
 * const curl = toCurl({ method: 'POST', url: '...', headers: {...}, body: '...' });
 * ```
 */
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

export function generateRequestId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export {
  toCurl as toCurlFromCore,
  generateRequestId as generateRequestIdFromCore,
  redactSensitiveData,
  formatBytes,
  getByteSize,
} from '@snapwyr/core';
export type {
  SnapWyrConfig,
  RequestEvent,
  LogEntry,
  TransportFn,
} from '@snapwyr/core';
