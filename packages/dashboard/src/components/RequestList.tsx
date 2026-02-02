import { memo } from 'react';
import { ArrowDownLeft, ArrowUpRight, Clock, HardDrive } from 'lucide-react';
import type { LogEntry } from '../types';
import {
  formatTime,
  formatDuration,
  formatBytes,
  getStatusClass,
  truncateUrl,
} from '../utils/format';

interface RequestListProps {
  requests: LogEntry[];
  selectedId?: string;
  onSelect: (request: LogEntry) => void;
}

export function RequestList({
  requests,
  selectedId,
  onSelect,
}: RequestListProps) {
  return (
    <div
      className='h-full overflow-y-auto p-2 sm:p-4'
      style={{ background: 'var(--color-bg)' }}
    >
      <div className='space-y-2'>
        {requests.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            isSelected={request.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

interface RequestCardProps {
  request: LogEntry;
  isSelected: boolean;
  onSelect: (request: LogEntry) => void;
}

const RequestCard = memo(function RequestCard({
  request,
  isSelected,
  onSelect,
}: RequestCardProps) {
  const statusClass = getStatusClass(request.status);
  const durationColor = request.slow
    ? 'var(--color-warning)'
    : request.duration < 100
      ? 'var(--color-success)'
      : 'var(--color-text-secondary)';

  return (
    <div
      onClick={() => onSelect(request)}
      className='cursor-pointer rounded-lg border transition-all duration-200'
      style={{
        borderColor: isSelected ? 'var(--color-info)' : 'var(--color-border)',
        background: isSelected
          ? 'var(--color-bg-elevated)'
          : 'var(--color-bg-secondary)',
        boxShadow: isSelected
          ? '0 0 0 1px var(--color-info), 0 4px 12px rgba(0, 0, 0, 0.3)'
          : 'none',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = 'var(--color-bg-tertiary)';
          e.currentTarget.style.borderColor = 'var(--color-border-hover)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = 'var(--color-bg-secondary)';
          e.currentTarget.style.borderColor = 'var(--color-border)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      <div className='p-3 sm:p-4'>
        <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2 sm:mb-3'>
          <div className='flex items-center gap-2 sm:gap-3 flex-1 min-w-0'>
            {/* Direction Indicator */}
            {request.direction === 'incoming' ? (
              <div
                className='flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-md shrink-0'
                style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                }}
              >
                <ArrowDownLeft
                  className='w-3 h-3 sm:w-3.5 sm:h-3.5'
                  style={{ color: '#60a5fa' }}
                />
              </div>
            ) : request.direction === 'outgoing' ? (
              <div
                className='flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-md shrink-0'
                style={{
                  background: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                }}
              >
                <ArrowUpRight
                  className='w-3 h-3 sm:w-3.5 sm:h-3.5'
                  style={{ color: '#a78bfa' }}
                />
              </div>
            ) : null}

            {/* Method Badge */}
            <span
              className={`method-badge method-${request.method.toLowerCase()} shrink-0`}
            >
              {request.method}
            </span>

            {/* Status */}
            <div
              className={`text-sm sm:text-base font-bold tabular-nums ${statusClass}`}
            >
              {request.status || 'ERR'}
            </div>

            {/* URL */}
            <div className='flex-1 min-w-0 hidden sm:block'>
              <code
                className='text-xs sm:text-sm block truncate'
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-text-primary)',
                }}
                title={request.url}
              >
                {truncateUrl(request.url, 100)}
              </code>
            </div>
          </div>

          {/* Timestamp */}
          <div
            className='text-[10px] sm:text-xs tabular-nums shrink-0 sm:self-start'
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            {formatTime(request.timestamp)}
          </div>
        </div>

        {/* URL on mobile */}
        <div className='sm:hidden mb-2'>
          <code
            className='text-xs block truncate'
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-text-secondary)',
            }}
            title={request.url}
          >
            {truncateUrl(request.url, 60)}
          </code>
        </div>

        {/* Metadata Row */}
        <div className='flex items-center gap-3 sm:gap-4 flex-wrap'>
          <div className='flex items-center gap-1 sm:gap-1.5'>
            <Clock
              className='w-3 h-3 sm:w-3.5 sm:h-3.5'
              style={{ color: durationColor }}
            />
            <span
              className='text-[10px] sm:text-xs font-medium tabular-nums'
              style={{
                fontFamily: 'var(--font-mono)',
                color: durationColor,
              }}
            >
              {formatDuration(request.duration)}
            </span>
          </div>

          {request.totalSize && (
            <div className='flex items-center gap-1 sm:gap-1.5'>
              <HardDrive
                className='w-3 h-3 sm:w-3.5 sm:h-3.5'
                style={{ color: 'var(--color-text-tertiary)' }}
              />
              <span
                className='text-[10px] sm:text-xs tabular-nums'
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-text-tertiary)',
                }}
              >
                {formatBytes(request.totalSize)}
              </span>
            </div>
          )}

          {request.error && (
            <div
              className='flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium'
              style={{
                background: 'var(--color-error-bg)',
                color: 'var(--color-error)',
              }}
            >
              Error
            </div>
          )}

          {request.slow && (
            <div
              className='flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium'
              style={{
                background: 'var(--color-warning-bg)',
                color: 'var(--color-warning)',
              }}
            >
              Slow
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
