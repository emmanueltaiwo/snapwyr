import type { SnapWyrConfig, LogEntry } from '@snapwyr/core';
import { generateRequestId } from '@snapwyr/core';
import { logRequest } from './utils.js';

const requestTimingMap = new WeakMap<
  object,
  { id: string; startTime: number }
>();

/**
 * @example
 * ```ts
 * await fastify.register(snapwyr, { logBody: true });
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function snapwyrPlugin(fastify: any, config: SnapWyrConfig, done: () => void) {
  if (config.enabled === false) {
    done();
    return;
  }

  fastify.addHook(
    'onRequest',
    (request: any, reply: any, hookDone: () => void) => {
      const id = generateRequestId();
      requestTimingMap.set(request, { id, startTime: Date.now() });

      if (config.requestId) {
        try {
          reply.header('X-Request-ID', id);
        } catch {}
      }
      hookDone();
    }
  );

  fastify.addHook(
    'onResponse',
    (request: any, reply: any, hookDone: () => void) => {
      const timing = requestTimingMap.get(request) || {
        id: generateRequestId(),
        startTime: Date.now(),
      };
      const duration = Date.now() - timing.startTime;
      const status = reply.statusCode;

      requestTimingMap.delete(request);

      if (
        config.statusCodes &&
        config.statusCodes.length > 0 &&
        !config.statusCodes.includes(status)
      ) {
        hookDone();
        return;
      }

      if (config.errorsOnly && status < 400) {
        hookDone();
        return;
      }

      let requestBody: string | undefined;
      if (config.logBody && request.body) {
        try {
          const body =
            typeof request.body === 'string'
              ? request.body
              : JSON.stringify(request.body);
          requestBody = config.bodySizeLimit
            ? body.slice(0, config.bodySizeLimit)
            : body;
        } catch {}
      }

      logRequest({
        id: timing.id,
        method: request.method,
        status,
        duration,
        url: request.url,
        startTime: timing.startTime,
        config,
        requestBody: config.logBody ? requestBody : undefined,
      });

      hookDone();
    }
  );

  done();
}

Object.defineProperty(snapwyrPlugin, Symbol.for('skip-override'), {
  value: true,
  writable: false,
});

export const snapwyr = snapwyrPlugin;

export type { SnapWyrConfig, LogEntry };
