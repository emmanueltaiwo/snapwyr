import type { SnapWyrConfig, LogEntry } from '@snapwyr/core';
import { generateRequestId } from '@snapwyr/core';
import { logRequest } from './utils.js';

interface NextRequest {
  method: string;
  url: string;
  nextUrl: { pathname: string; search: string };
  headers: Headers;
  clone(): NextRequest;
  text(): Promise<string>;
}

interface NextResponseInit {
  status?: number;
  headers?: Record<string, string> | [string, string][];
}

declare class NextResponseClass {
  status: number;
  headers: Headers;
  static next(init?: NextResponseInit): NextResponseClass;
}

type ProxyFunction = (
  request: NextRequest
) => NextResponseClass | Promise<NextResponseClass>;

/**
 * @example
 * ```ts
 * export const proxy = snapwyr({ logBody: true });
 * ```
 */
export function snapwyr(config: SnapWyrConfig = {}): ProxyFunction {
  return async function proxy(request) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { NextResponse } = require('next/server') as {
      NextResponse: typeof NextResponseClass;
    };

    if (config.enabled === false) return NextResponse.next();

    const id = generateRequestId();
    const startTime = Date.now();
    const method = request.method;
    const url = request.nextUrl.pathname + request.nextUrl.search;

    // Check ignore patterns
    if (config.ignorePatterns) {
      const shouldIgnore = config.ignorePatterns.some((pattern) => {
        if (typeof pattern === 'string') {
          return url.includes(pattern);
        }
        return pattern.test(url);
      });
      if (shouldIgnore) return NextResponse.next();
    }

    if (config.methods && config.methods.length > 0) {
      if (!config.methods.includes(method.toUpperCase())) {
        return NextResponse.next();
      }
    }

    let requestBody: string | undefined;
    if (config.logBody) {
      try {
        const body = await request
          .clone()
          .text()
          .catch(() => null);
        if (body) requestBody = body.slice(0, config.bodySizeLimit || 500);
      } catch {}
    }

    const response = NextResponse.next();
    if (config.requestId) response.headers.set('X-Request-ID', id);

    const duration = Date.now() - startTime;
    const status = response.status;

    // Check status codes filter
    if (
      config.statusCodes &&
      config.statusCodes.length > 0 &&
      !config.statusCodes.includes(status)
    ) {
      return response;
    }

    if (config.errorsOnly && status < 400) {
      return response;
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
    });

    return response;
  };
}

export type { SnapWyrConfig, LogEntry };
