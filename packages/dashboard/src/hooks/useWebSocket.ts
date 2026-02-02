import { useState, useEffect, useCallback, useRef } from 'react';
import type { LogEntry, WebSocketMessage, DashboardStats } from '../types';

interface UseWebSocketReturn {
  requests: LogEntry[];
  stats: DashboardStats;
  connected: boolean;
  clearRequests: () => void;
}

const MAX_REQUESTS = 1000;

function calculateStats(requests: LogEntry[]): DashboardStats {
  if (requests.length === 0) {
    return {
      totalRequests: 0,
      avgDuration: 0,
      errorRate: 0,
      requestsPerSecond: 0,
      statusCounts: {},
      methodCounts: {},
      directionCounts: {},
    };
  }

  const totalDuration = requests.reduce((sum, r) => sum + r.duration, 0);
  const errors = requests.filter(
    (r) => r.error || (r.status && r.status >= 400)
  ).length;

  const statusCounts: Record<string, number> = {};
  const methodCounts: Record<string, number> = {};
  const directionCounts: Record<string, number> = {};

  for (const req of requests) {
    const statusGroup = req.status
      ? `${Math.floor(req.status / 100)}xx`
      : 'error';
    statusCounts[statusGroup] = (statusCounts[statusGroup] || 0) + 1;
    methodCounts[req.method] = (methodCounts[req.method] || 0) + 1;
    if (req.direction) {
      directionCounts[req.direction] =
        (directionCounts[req.direction] || 0) + 1;
    }
  }

  const now = Date.now();
  const recentRequests = requests.filter((r) => {
    const reqTime = new Date(r.timestamp).getTime();
    return now - reqTime < 60000;
  });

  return {
    totalRequests: requests.length,
    avgDuration: Math.round(totalDuration / requests.length),
    errorRate: Math.round((errors / requests.length) * 100),
    requestsPerSecond: Math.round((recentRequests.length / 60) * 10) / 10,
    statusCounts,
    methodCounts,
    directionCounts,
  };
}

export function useWebSocket(): UseWebSocketReturn {
  const [requests, setRequests] = useState<LogEntry[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number>();

  const connect = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        console.log('[Snapwyr] Dashboard connected');
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);

          switch (message.type) {
            case 'init':
              if (message.requests) {
                setRequests(message.requests.slice(0, MAX_REQUESTS));
              }
              break;
            case 'request':
              if (message.data) {
                setRequests((prev) =>
                  [message.data!, ...prev].slice(0, MAX_REQUESTS)
                );
              }
              break;
            case 'clear':
              setRequests([]);
              break;
          }
        } catch (e) {
          console.error('[Snapwyr] Failed to parse message:', e);
        }
      };

      ws.onclose = () => {
        setConnected(false);
        console.log('[Snapwyr] Dashboard disconnected, reconnecting...');
        reconnectTimeoutRef.current = window.setTimeout(connect, 2000);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch (e) {
      console.error('[Snapwyr] WebSocket connection failed:', e);
      reconnectTimeoutRef.current = window.setTimeout(connect, 2000);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const clearRequests = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'clear' }));
    }
    setRequests([]);
  }, []);

  return {
    requests,
    stats: calculateStats(requests),
    connected,
    clearRequests,
  };
}
