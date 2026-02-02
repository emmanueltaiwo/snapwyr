import { ArrowDownLeft, ArrowUpRight, X, Filter, Sparkles } from 'lucide-react';
import type { FilterState, DashboardStats, RequestDirection } from '../types';

interface FilterPanelProps {
  filters: FilterState;
  stats: DashboardStats;
  onToggleMethod: (method: string) => void;
  onToggleStatusCode: (code: string) => void;
  onToggleDirection: (direction: RequestDirection) => void;
  onUpdateFilter: <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const STATUS_CODES = ['2xx', '3xx', '4xx', '5xx'];
const DIRECTIONS: {
  id: RequestDirection;
  label: string;
  icon: typeof ArrowDownLeft;
}[] = [
  { id: 'incoming', label: 'Incoming', icon: ArrowDownLeft },
  { id: 'outgoing', label: 'Outgoing', icon: ArrowUpRight },
];

export function FilterPanel({
  filters,
  stats,
  onToggleMethod,
  onToggleStatusCode,
  onToggleDirection,
  onUpdateFilter,
  onReset,
  hasActiveFilters,
}: FilterPanelProps) {
  return (
    <div
      className='shrink-0 border-b px-3 sm:px-6 py-3 sm:py-4'
      style={{
        borderColor: 'var(--color-border)',
        background: 'var(--color-bg-secondary)',
      }}
    >
      <div className='flex flex-col sm:flex-row items-start gap-3 sm:gap-6 overflow-x-auto scrollbar-thin'>
        {/* Direction Filter */}
        <FilterSection title='Direction' icon={ArrowDownLeft}>
          <div className='flex items-center gap-2 flex-wrap'>
            {DIRECTIONS.map(({ id, label, icon: Icon }) => {
              const isActive = filters.directions.includes(id);
              const count = stats.directionCounts[id] || 0;
              return (
                <FilterButton
                  key={id}
                  onClick={() => onToggleDirection(id)}
                  disabled={count === 0}
                  isActive={isActive}
                  count={count}
                  icon={Icon}
                >
                  {label}
                </FilterButton>
              );
            })}
          </div>
        </FilterSection>

        <div
          className='w-full sm:w-px h-px sm:h-12 self-stretch sm:self-auto'
          style={{ background: 'var(--color-border)' }}
        />

        {/* Method Filter */}
        <FilterSection title='Method' icon={Filter}>
          <div className='flex items-center gap-2 flex-wrap'>
            {METHODS.map((method) => {
              const isActive = filters.methods.includes(method);
              const count = stats.methodCounts[method] || 0;
              return (
                <button
                  key={method}
                  onClick={() => onToggleMethod(method)}
                  disabled={count === 0}
                  className={`method-badge transition-all duration-200 ${
                    isActive
                      ? 'ring-2 ring-white/30 scale-105'
                      : count > 0
                        ? 'opacity-60 hover:opacity-100 hover:scale-105'
                        : 'opacity-30 cursor-not-allowed'
                  }`}
                >
                  {method}
                </button>
              );
            })}
          </div>
        </FilterSection>

        <div
          className='w-full sm:w-px h-px sm:h-12 self-stretch sm:self-auto'
          style={{ background: 'var(--color-border)' }}
        />

        {/* Status Filter */}
        <FilterSection title='Status' icon={Sparkles}>
          <div className='flex items-center gap-2 flex-wrap'>
            {STATUS_CODES.map((code) => {
              const isActive = filters.statusCodes.includes(code);
              const count = stats.statusCounts[code] || 0;
              const config: Record<string, { bg: string; color: string }> = {
                '2xx': {
                  bg: 'var(--color-success-bg)',
                  color: 'var(--color-success)',
                },
                '3xx': {
                  bg: 'var(--color-info-bg)',
                  color: 'var(--color-info)',
                },
                '4xx': {
                  bg: 'var(--color-warning-bg)',
                  color: 'var(--color-warning)',
                },
                '5xx': {
                  bg: 'var(--color-error-bg)',
                  color: 'var(--color-error)',
                },
              };
              const style = config[code] || {
                bg: 'var(--color-bg-tertiary)',
                color: 'var(--color-text-secondary)',
              };

              return (
                <button
                  key={code}
                  onClick={() => onToggleStatusCode(code)}
                  disabled={count === 0}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-md border transition-all duration-200 ${
                    isActive
                      ? 'ring-2 ring-white/30 scale-105'
                      : count > 0
                        ? 'opacity-70 hover:opacity-100 hover:scale-105'
                        : 'opacity-30 cursor-not-allowed'
                  }`}
                  style={{
                    background: isActive
                      ? style.bg
                      : 'var(--color-bg-tertiary)',
                    borderColor: isActive
                      ? style.color + '40'
                      : 'var(--color-border)',
                    color: style.color,
                  }}
                >
                  {code}
                  {count > 0 && (
                    <span className='ml-1.5 text-[10px] opacity-75'>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </FilterSection>

        <div
          className='w-full sm:w-px h-px sm:h-12 self-stretch sm:self-auto'
          style={{ background: 'var(--color-border)' }}
        />

        {/* Quick Filters */}
        <div className='flex flex-col gap-2 shrink-0'>
          <span
            className='text-[10px] font-semibold uppercase tracking-wider'
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            Quick
          </span>
          <div className='flex items-center gap-2 flex-wrap'>
            <QuickFilterButton
              onClick={() => onUpdateFilter('showErrors', !filters.showErrors)}
              isActive={filters.showErrors}
              label='Errors'
              color='var(--color-error)'
            />
            <QuickFilterButton
              onClick={() => onUpdateFilter('showSlow', !filters.showSlow)}
              isActive={filters.showSlow}
              label='Slow'
              color='var(--color-warning)'
            />
          </div>
        </div>

        {hasActiveFilters && (
          <>
            <div className='flex-1 hidden sm:block' />
            <button
              onClick={onReset}
              className='flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-md text-[10px] sm:text-xs font-medium transition-all duration-200 shrink-0'
              style={{
                background: 'var(--color-bg-tertiary)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-secondary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-bg-elevated)';
                e.currentTarget.style.borderColor = 'var(--color-border-hover)';
                e.currentTarget.style.color = 'var(--color-text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--color-bg-tertiary)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
            >
              <X className='w-3 h-3' />
              <span className='hidden sm:inline'>Clear All</span>
              <span className='sm:hidden'>Clear</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function FilterSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center gap-1.5'>
        <Icon
          className='w-3 h-3'
          style={{ color: 'var(--color-text-tertiary)' }}
        />
        <span
          className='text-[10px] font-semibold uppercase tracking-wider'
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function FilterButton({
  onClick,
  disabled,
  isActive,
  count,
  icon: Icon,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  isActive: boolean;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-md border transition-all duration-200 ${
        isActive
          ? 'ring-2 ring-white/30 scale-105'
          : count > 0
            ? 'opacity-70 hover:opacity-100 hover:scale-105'
            : 'opacity-30 cursor-not-allowed'
      }`}
      style={{
        background: isActive
          ? 'rgba(139, 92, 246, 0.15)'
          : 'var(--color-bg-tertiary)',
        borderColor: isActive
          ? 'rgba(139, 92, 246, 0.4)'
          : 'var(--color-border)',
        color: isActive ? '#a78bfa' : 'var(--color-text-secondary)',
      }}
    >
      <Icon className='w-2.5 h-2.5 sm:w-3 sm:h-3' />
      {children}
      {count > 0 && (
        <span
          className='ml-0.5 sm:ml-1 text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded'
          style={{
            background: isActive
              ? 'rgba(139, 92, 246, 0.2)'
              : 'var(--color-bg-elevated)',
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function QuickFilterButton({
  onClick,
  isActive,
  label,
  color,
}: {
  onClick: () => void;
  isActive: boolean;
  label: string;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-md border transition-all duration-200 ${
        isActive
          ? 'ring-2 ring-white/30 scale-105'
          : 'opacity-70 hover:opacity-100 hover:scale-105'
      }`}
      style={{
        background: isActive ? `${color}15` : 'var(--color-bg-tertiary)',
        borderColor: isActive ? `${color}40` : 'var(--color-border)',
        color: isActive ? color : 'var(--color-text-secondary)',
      }}
    >
      {label}
    </button>
  );
}
