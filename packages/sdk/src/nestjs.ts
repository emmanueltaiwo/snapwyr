import type { SnapWyrConfig, LogEntry } from '@snapwyr/core';
import { generateRequestId } from '@snapwyr/core';
import { logRequest } from './utils.js';
import { tap, Observable } from 'rxjs';

interface ExecutionContext {
  switchToHttp(): {
    getRequest<T = unknown>(): T;
    getResponse<T = unknown>(): T;
  };
}

interface CallHandler<T = unknown> {
  handle(): Observable<T>;
}

interface NestInterceptor<T = unknown, R = unknown> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<R>;
}
interface HttpRequest {
  method: string;
  url: string;
  originalUrl?: string;
  body?: unknown;
}

interface HttpResponse {
  statusCode: number;
  setHeader?: (name: string, value: string) => void;
}

export function SnapwyrInterceptor(
  config: SnapWyrConfig = {}
): NestInterceptor {
  return {
    intercept(context, next) {
      if (config.enabled === false) return next.handle();

      const id = generateRequestId();
      const request = context.switchToHttp().getRequest<HttpRequest>();
      const response = context.switchToHttp().getResponse<HttpResponse>();
      const startTime = Date.now();
      const method = request.method;
      const url = request.url || request.originalUrl || '';

      if (config.requestId && response.setHeader)
        try {
          response.setHeader('X-Request-ID', id);
        } catch {}

      return next.handle().pipe(
        tap({
          next: (data: unknown) => {
            const duration = Date.now() - startTime;
            const status = response.statusCode || 200;
            if (
              config.statusCodes &&
              config.statusCodes.length > 0 &&
              !config.statusCodes.includes(status)
            )
              return;

            let requestBody: string | undefined,
              responseBody: string | undefined;
            if (config.logBody) {
              try {
                if (request.body) {
                  requestBody =
                    typeof request.body === 'string'
                      ? request.body
                      : JSON.stringify(request.body);
                  if (config.bodySizeLimit)
                    requestBody = requestBody.slice(0, config.bodySizeLimit);
                }
                if (data) {
                  responseBody =
                    typeof data === 'string' ? data : JSON.stringify(data);
                  if (config.bodySizeLimit)
                    responseBody = responseBody.slice(0, config.bodySizeLimit);
                }
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
          },
          error: (error: unknown) => {
            const duration = Date.now() - startTime;
            const err = error as { status?: number; message?: string };
            const status = err.status || 500;
            if (
              config.statusCodes &&
              config.statusCodes.length > 0 &&
              !config.statusCodes.includes(status)
            )
              return;
            logRequest({
              id,
              method,
              status,
              duration,
              url,
              startTime,
              config,
              error: err.message || String(error),
            });
          },
        })
      );
    },
  };
}

export type { SnapWyrConfig, LogEntry };
