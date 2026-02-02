import { SnapWyrEmitter, RequestEvent } from '../index.js';

// Optimized ID generation using counter + random for better performance
let requestCounter = 0;
function generateRequestId(): string {
  return `${Date.now()}-${++requestCounter}-${Math.random().toString(36).slice(2, 9)}`;
}

function serializeBody(body: any): string | undefined {
  if (body == null) return undefined;

  try {
    if (typeof body === 'string') {
      // Only parse if it looks like JSON to avoid unnecessary parsing
      const trimmed = body.trim();
      if (
        (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
        (trimmed.startsWith('[') && trimmed.endsWith(']'))
      ) {
        try {
          const parsed = JSON.parse(body);
          return JSON.stringify(parsed, null, 2);
        } catch {
          return body;
        }
      }
      return body;
    }
    return JSON.stringify(body, null, 2);
  } catch {
    return '[unable to serialize]';
  }
}

export function patchFetch(emitter: SnapWyrEmitter): void {
  if (typeof globalThis.fetch === 'undefined') return;

  const originalFetch = globalThis.fetch;
  const config = emitter.getConfig();
  const logBody = config.logBody === true;

  globalThis.fetch = async function (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    const startTime = Date.now();
    const id = generateRequestId();

    // Optimize URL extraction
    let url: string;
    if (typeof input === 'string') {
      url = input;
    } else if (input instanceof URL) {
      url = input.href;
    } else {
      url = input.url;
    }

    const method = (init?.method || 'GET').toUpperCase();

    // Only serialize request body if logging is enabled
    const requestBody =
      logBody && init?.body ? serializeBody(init.body) : undefined;

    try {
      const response = await originalFetch(input, init);
      const duration = Date.now() - startTime;

      // Only read response body if logging is enabled - CRITICAL optimization
      let responseBody: string | undefined;
      if (logBody) {
        try {
          const clonedResponse = response.clone();
          const text = await clonedResponse.text();
          // Only parse if it looks like JSON
          const trimmed = text.trim();
          if (
            (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
            (trimmed.startsWith('[') && trimmed.endsWith(']'))
          ) {
            try {
              const parsed = JSON.parse(text);
              responseBody = JSON.stringify(parsed, null, 2);
            } catch {
              responseBody = text;
            }
          } else {
            responseBody = text;
          }
        } catch {
          responseBody = '[unable to read]';
        }
      }

      const event: RequestEvent = {
        id,
        method,
        url,
        status: response.status,
        duration,
        timestamp: startTime,
        requestBody,
        responseBody,
        direction: 'outgoing',
      };

      emitter.emitRequest(event);

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      const event: RequestEvent = {
        id,
        method,
        url,
        duration,
        timestamp: startTime,
        requestBody,
        error: errorMessage,
        direction: 'outgoing',
      };

      emitter.emitRequest(event);
      throw error;
    }
  };
}
