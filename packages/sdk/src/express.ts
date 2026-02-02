import type { SnapWyrConfig, LogEntry } from '@snapwyr/core';
import { generateRequestId } from '@snapwyr/core';
import { logRequest } from './utils.js';

interface ExpressRequest {
  method: string;
  url: string;
  originalUrl?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
}

interface ExpressResponse {
  statusCode: number;
  send: (body?: unknown) => ExpressResponse;
  setHeader: (name: string, value: string) => void;
}

type ExpressNextFunction = (err?: unknown) => void;

/**
 * @example
 * ```ts
 * app.use(snapwyr());
 * app.use(snapwyr({ format: 'json', emoji: true }));
 * ```
 */
export function snapwyr(config: SnapWyrConfig = {}) {
  const enabled = config.enabled !== false;

  return (
    req: ExpressRequest,
    res: ExpressResponse,
    next: ExpressNextFunction
  ) => {
    if (!enabled) {
      next();
      return;
    }

    const requestId = generateRequestId();
    const startTime = Date.now();
    const method = req.method;
    const url = req.originalUrl || req.url;

    if (config.requestId) {
      try {
        res.setHeader('X-Request-ID', requestId);
      } catch {}
    }

    let logged = false;
    const originalSend = res.send;

    res.send = function (this: ExpressResponse, body?: unknown) {
      if (!logged) {
        logged = true;

        const duration = Date.now() - startTime;
        const status = res.statusCode;

        if (config.statusCodes && config.statusCodes.length > 0) {
          if (!config.statusCodes.includes(status)) {
            return originalSend.call(this, body);
          }
        }

        let requestBody: string | undefined;
        let responseBody: string | undefined;

        if (config.logBody) {
          try {
            if (req.body) {
              requestBody =
                typeof req.body === 'string'
                  ? req.body
                  : JSON.stringify(req.body);
              if (config.bodySizeLimit && requestBody) {
                requestBody = requestBody.slice(0, config.bodySizeLimit);
              }
            }
            if (body) {
              responseBody =
                typeof body === 'string' ? body : JSON.stringify(body);
              if (config.bodySizeLimit && responseBody) {
                responseBody = responseBody.slice(0, config.bodySizeLimit);
              }
            }
          } catch {}
        }

        logRequest({
          id: requestId,
          method,
          status,
          duration,
          url,
          startTime,
          config,
          requestBody: config.logBody ? requestBody : undefined,
          responseBody: config.logBody ? responseBody : undefined,
        });
      }

      return originalSend.call(this, body);
    };

    next();
  };
}

export type { SnapWyrConfig, LogEntry };
