export type RequestDirection = 'incoming' | 'outgoing';

export interface LogEntry {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  status: number | undefined;
  duration: number;
  slow: boolean;
  error?: string;
  requestBody?: string;
  responseBody?: string;
  prefix?: string;
  requestSize?: number;
  responseSize?: number;
  totalSize?: number;
  direction?: RequestDirection;
}

export interface WebSocketMessage {
  type: 'init' | 'request' | 'clear' | 'stats';
  data?: LogEntry;
  requests?: LogEntry[];
  stats?: DashboardStats;
}

export interface DashboardStats {
  totalRequests: number;
  avgDuration: number;
  errorRate: number;
  requestsPerSecond: number;
  statusCounts: Record<string, number>;
  methodCounts: Record<string, number>;
  directionCounts: Record<string, number>;
}

export interface FilterState {
  search: string;
  methods: string[];
  statusCodes: string[];
  directions: RequestDirection[];
  minDuration: number | null;
  maxDuration: number | null;
  showErrors: boolean;
  showSlow: boolean;
}
