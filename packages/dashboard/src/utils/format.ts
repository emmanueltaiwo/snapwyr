import type { LogEntry } from '../types';

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(i > 0 ? 1 : 0)} ${sizes[i]}`;
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

export function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function formatFullTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    hour12: false,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function getStatusClass(status: number | undefined): string {
  if (!status) return 'text-gray-500';
  if (status >= 500) return 'status-5xx';
  if (status >= 400) return 'status-4xx';
  if (status >= 300) return 'status-3xx';
  return 'status-2xx';
}

export function getMethodClass(method: string): string {
  return `method-${method.toLowerCase()}`;
}

export function truncateUrl(url: string, maxLength: number = 60): string {
  if (url.length <= maxLength) return url;
  return url.slice(0, maxLength - 3) + '...';
}

export function generateCurl(entry: LogEntry): string {
  const parts = ['curl'];

  if (entry.method.toUpperCase() !== 'GET') {
    parts.push(`-X ${entry.method.toUpperCase()}`);
  }

  if (entry.requestBody && entry.method.toUpperCase() !== 'GET') {
    const escapedBody = entry.requestBody.replace(/'/g, "'\\''");
    parts.push(`-H 'Content-Type: application/json'`);
    parts.push(`-d '${escapedBody}'`);
  }

  parts.push(`'${entry.url}'`);

  return parts.join(' \\\n  ');
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
