import type { SnapWyrConfig, LogEntry } from '@snapwyr/core';
import {
  snapwyr as coreEmitter,
  getByteSize,
  formatBytes,
  redactSensitiveData,
} from '@snapwyr/core';

export interface LogParams {
  id: string;
  method: string;
  status: number;
  duration: number;
  url: string;
  startTime: number;
  config: SnapWyrConfig;
  requestBody?: string;
  responseBody?: string;
  error?: string;
}

export function logRequest(params: LogParams): void {
  const { id, method, status, duration, url, startTime, config, error } =
    params;
  let { requestBody, responseBody } = params;

  if (config.silent) return;

  const showTimestamp = config.showTimestamp !== false;
  const format = config.format || 'pretty';
  const slowThreshold = config.slowThreshold ?? 1000;
  const isSlow = duration >= slowThreshold;

  const requestSize = requestBody ? getByteSize(requestBody) : 0;
  const responseSize = responseBody ? getByteSize(responseBody) : 0;
  const totalSize = requestSize + responseSize;

  if (config.redact && config.redact.length > 0) {
    if (requestBody)
      requestBody = redactSensitiveData(requestBody, config.redact);
    if (responseBody)
      responseBody = redactSensitiveData(responseBody, config.redact);
  }

  const logEntry: LogEntry = {
    id,
    timestamp: new Date(startTime).toISOString(),
    method: method.toUpperCase(),
    url,
    status,
    duration,
    slow: isSlow,
  };

  if (config.prefix) logEntry.prefix = config.prefix;
  if (error) logEntry.error = error;
  if (requestBody) logEntry.requestBody = requestBody;
  if (responseBody) logEntry.responseBody = responseBody;
  if (config.sizeTracking) {
    logEntry.requestSize = requestSize;
    logEntry.responseSize = responseSize;
    logEntry.totalSize = totalSize;
  }

  try {
    coreEmitter.emit('request', {
      id,
      method: method.toUpperCase(),
      url,
      status,
      duration,
      timestamp: startTime,
      requestBody,
      responseBody,
      error,
      requestSize: config.sizeTracking ? requestSize : undefined,
      responseSize: config.sizeTracking ? responseSize : undefined,
      direction: 'incoming',
    });
  } catch {}

  if (config.transport) {
    config.transport(logEntry);
  }

  if (format === 'json') {
    console.log(JSON.stringify(logEntry));
    return;
  }

  const useEmoji = config.emoji === true;
  let statusEmoji = '';
  if (useEmoji) {
    if (error || status >= 500) statusEmoji = '✗ ';
    else if (status >= 400) statusEmoji = '⚠ ';
    else if (status >= 300) statusEmoji = '↪ ';
    else statusEmoji = '✓ ';
  }

  const statusColor =
    status >= 500
      ? '\x1b[31m'
      : status >= 400
        ? '\x1b[33m'
        : status >= 300
          ? '\x1b[36m'
          : '\x1b[32m';
  const durationColor = isSlow
    ? '\x1b[31m'
    : duration < 100
      ? '\x1b[32m'
      : '\x1b[33m';
  const methodColors: Record<string, string> = {
    GET: '\x1b[34m',
    POST: '\x1b[32m',
    PUT: '\x1b[33m',
    PATCH: '\x1b[35m',
    DELETE: '\x1b[31m',
  };
  const methodColor = methodColors[method] || '';
  const reset = '\x1b[0m';
  const dim = '\x1b[2m';
  const bold = '\x1b[1m';
  const timestamp = showTimestamp
    ? new Date(startTime).toISOString().slice(11, 23) + ' '
    : '';
  const slowIndicator = isSlow ? ` ${bold}[SLOW]${reset}` : '';
  const requestIdDisplay = config.requestId ? `${dim}[${id}]${reset} ` : '';
  const sizeDisplay = config.sizeTracking
    ? `${dim}${formatBytes(totalSize)}${reset} `
    : '';

  const parts = [
    config.prefix ? `${dim}${config.prefix} ${reset}` : '',
    requestIdDisplay,
    `${dim}${timestamp}${reset}`,
    `${methodColor}${method.padEnd(6)}${reset}`,
    `${statusColor}${statusEmoji}${status}${reset}`,
    `${durationColor}${duration}ms${reset}${slowIndicator}`,
    sizeDisplay,
    `${dim}${url}${reset}`,
  ].filter(Boolean);

  if (error) parts.push(`\n  ${dim}Error: ${error}${reset}`);
  if (requestBody) parts.push(`\n  ${dim}Request: ${requestBody}${reset}`);
  if (responseBody) parts.push(`\n  ${dim}Response: ${responseBody}${reset}`);

  console.log(parts.join(' '));
}
