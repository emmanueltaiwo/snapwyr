import type { SnapWyrConfig, LogEntry } from '@snapwyr/core';
import { generateRequestId } from '@snapwyr/core';
import { logRequest } from './utils.js';

interface KoaRequest {
  method: string;
  url: string;
  body?: unknown;
}
interface KoaContext {
  method: string;
  url: string;
  status: number;
  request: KoaRequest;
  body?: unknown;
  set: (field: string, val: string) => void;
}
type KoaNext = () => Promise<void>;
type KoaMiddleware = (ctx: KoaContext, next: KoaNext) => Promise<void>;

export function snapwyr(config: SnapWyrConfig = {}): KoaMiddleware {
  return async function (ctx, next) {
    if (config.enabled === false) {
      await next();
      return;
    }

    const id = generateRequestId();
    const startTime = Date.now();

    if (config.requestId)
      try {
        ctx.set('X-Request-ID', id);
      } catch {}

    await next();

    const duration = Date.now() - startTime;
    const status = ctx.status || 200;

    if (
      config.statusCodes &&
      config.statusCodes.length > 0 &&
      !config.statusCodes.includes(status)
    )
      return;

    let requestBody: string | undefined, responseBody: string | undefined;
    if (config.logBody) {
      try {
        if (ctx.request.body) {
          requestBody =
            typeof ctx.request.body === 'string'
              ? ctx.request.body
              : JSON.stringify(ctx.request.body);
          if (config.bodySizeLimit)
            requestBody = requestBody.slice(0, config.bodySizeLimit);
        }
        if (ctx.body) {
          responseBody =
            typeof ctx.body === 'string' ? ctx.body : JSON.stringify(ctx.body);
          if (config.bodySizeLimit)
            responseBody = responseBody.slice(0, config.bodySizeLimit);
        }
      } catch {}
    }

    logRequest({
      id,
      method: ctx.method,
      status,
      duration,
      url: ctx.url,
      startTime,
      config,
      requestBody: config.logBody ? requestBody : undefined,
      responseBody: config.logBody ? responseBody : undefined,
    });
  };
}

export type { SnapWyrConfig, LogEntry };
