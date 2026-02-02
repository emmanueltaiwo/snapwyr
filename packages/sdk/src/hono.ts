import type { SnapWyrConfig, LogEntry } from '@snapwyr/core';
import { generateRequestId } from '@snapwyr/core';
import { logRequest } from './utils.js';

interface HonoContext {
  req: {
    method: string;
    path: string;
    query: (key?: string) => string | Record<string, string> | undefined;
    raw: Request;
  };
  res: Response | undefined;
  header: (name: string, value: string) => void;
}
type HonoNext = () => Promise<void>;
type HonoMiddleware = (
  c: HonoContext,
  next: HonoNext
) => Promise<Response | void>;

export function snapwyr(config: SnapWyrConfig = {}): HonoMiddleware {
  return async function (c, next) {
    if (config.enabled === false) {
      await next();
      return;
    }

    const id = generateRequestId();
    const startTime = Date.now();
    const method = c.req.method;
    const queryObj = c.req.query();
    const queryString =
      typeof queryObj === 'object' && queryObj
        ? new URLSearchParams(queryObj as Record<string, string>).toString()
        : '';
    const url = c.req.path + (queryString ? '?' + queryString : '');

    if (config.requestId)
      try {
        c.header('X-Request-ID', id);
      } catch {}

    let requestBody: string | undefined;
    if (config.logBody) {
      try {
        const body = await c.req.raw
          .clone()
          .text()
          .catch(() => null);
        if (body) requestBody = body.slice(0, config.bodySizeLimit || 500);
      } catch {}
    }

    await next();

    const duration = Date.now() - startTime;
    const status = c.res?.status ?? 200;

    if (
      config.statusCodes &&
      config.statusCodes.length > 0 &&
      !config.statusCodes.includes(status)
    )
      return;

    let responseBody: string | undefined;
    if (config.logBody && c.res) {
      try {
        const resBody = await c.res
          .clone()
          .text()
          .catch(() => null);
        if (resBody)
          responseBody = resBody.slice(0, config.bodySizeLimit || 500);
      } catch {}
    }

    logRequest({
      id,
      method,
      status,
      duration,
      url,
      startTime,
      config,
      requestBody: config.logBody ? requestBody : undefined,
      responseBody: config.logBody ? responseBody : undefined,
    });
  };
}

export type { SnapWyrConfig, LogEntry };
