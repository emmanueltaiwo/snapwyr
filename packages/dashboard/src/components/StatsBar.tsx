import { Activity, Clock, AlertTriangle, Zap } from 'lucide-react';
import type { DashboardStats } from '../types';

interface StatsBarProps {
  stats: DashboardStats;
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div
      className='shrink-0 border-b px-3 sm:px-6 py-2 sm:py-3'
      style={{
        borderColor: 'var(--color-border)',
        background: 'var(--color-bg-secondary)',
      }}
    >
      <div className='flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-thin'>
        <div className='flex items-center gap-2 sm:gap-4 min-w-max'>
          <StatCard
            icon={Activity}
            label='Total'
            labelFull='Total Requests'
            value={stats.totalRequests.toLocaleString()}
            color='var(--color-info)'
          />
          <StatCard
            icon={Clock}
            label='Avg'
            labelFull='Avg Duration'
            value={`${stats.avgDuration}ms`}
            color='var(--color-success)'
            highlight={stats.avgDuration > 500}
          />
          <StatCard
            icon={AlertTriangle}
            label='Errors'
            labelFull='Error Rate'
            value={`${stats.errorRate}%`}
            color='var(--color-error)'
            highlight={stats.errorRate > 5}
          />
          <StatCard
            icon={Zap}
            label='Req/s'
            labelFull='Requests/sec'
            value={stats.requestsPerSecond.toFixed(1)}
            color='var(--color-warning)'
          />
        </div>

        <div className='flex-1 min-w-[100px]' />

        <div className='flex items-center gap-1.5 sm:gap-2 shrink-0'>
          {Object.entries(stats.statusCounts)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([code, count]) => (
              <StatusBadge key={code} code={code} count={count} />
            ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  labelFull,
  value,
  color,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  labelFull?: string;
  value: string;
  color: string;
  highlight?: boolean;
}) {
  return (
    <div
      className='flex items-center gap-2 sm:gap-3 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-200 shrink-0'
      style={{
        background: 'var(--color-bg-tertiary)',
        border: '1px solid var(--color-border)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--color-bg-elevated)';
        e.currentTarget.style.borderColor = 'var(--color-border-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--color-bg-tertiary)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
      }}
    >
      <div
        className='flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-md shrink-0'
        style={{
          background: `${color}15`,
          color: color,
        }}
      >
        <Icon className='w-3 h-3 sm:w-4 sm:h-4' />
      </div>
      <div className='flex flex-col min-w-0'>
        <span
          className='text-[9px] sm:text-[10px] font-medium uppercase tracking-wider hidden sm:block'
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          {labelFull || label}
        </span>
        <span
          className='text-[9px] sm:text-[10px] font-medium uppercase tracking-wider sm:hidden'
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          {label}
        </span>
        <span
          className='text-xs sm:text-sm font-semibold tabular-nums leading-none mt-0.5'
          style={{
            color: highlight
              ? 'var(--color-error)'
              : 'var(--color-text-primary)',
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

function StatusBadge({ code, count }: { code: string; count: number }) {
  const config: Record<string, { color: string; bg: string; border: string }> =
    {
      '2xx': {
        color: 'var(--color-success)',
        bg: 'var(--color-success-bg)',
        border: 'rgba(16, 185, 129, 0.3)',
      },
      '3xx': {
        color: 'var(--color-info)',
        bg: 'var(--color-info-bg)',
        border: 'rgba(59, 130, 246, 0.3)',
      },
      '4xx': {
        color: 'var(--color-warning)',
        bg: 'var(--color-warning-bg)',
        border: 'rgba(245, 158, 11, 0.3)',
      },
      '5xx': {
        color: 'var(--color-error)',
        bg: 'var(--color-error-bg)',
        border: 'rgba(239, 68, 68, 0.3)',
      },
    };

  const style = config[code] || {
    color: 'var(--color-text-tertiary)',
    bg: 'var(--color-bg-tertiary)',
    border: 'var(--color-border)',
  };

  return (
    <div
      className='flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md border transition-all duration-200 shrink-0'
      style={{
        background: style.bg,
        borderColor: style.border,
        color: style.color,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <span className='text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider'>
        {code}
      </span>
      <span className='text-[10px] sm:text-xs font-bold tabular-nums'>
        {count}
      </span>
    </div>
  );
}
