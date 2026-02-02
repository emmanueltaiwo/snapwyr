import { Search, Trash2, Circle } from 'lucide-react';
import logoImage from '../images/logo-full-white.png';

interface HeaderProps {
  connected: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
  requestCount: number;
}

export function Header({
  connected,
  search,
  onSearchChange,
  onClear,
  requestCount,
}: HeaderProps) {
  return (
    <header
      className='shrink-0 border-b glass'
      style={{
        borderColor: 'var(--color-border)',
        background: 'rgba(0, 0, 0, 0.8)',
      }}
    >
      <div className='flex items-center justify-between px-3 sm:px-6 h-14 sm:h-16 gap-2 sm:gap-4'>
        <div className='flex items-center gap-2 sm:gap-6 min-w-0'>
          <div className='flex items-center gap-2 sm:gap-3 min-w-0'>
            <img src={logoImage} alt='Snapwyr' className='h-6 sm:h-8' />
            <div className='hidden sm:flex sm:flex-col min-w-0'>
              <span
                className='text-[10px] mt-0.5 truncate'
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                HTTP Request Logger
              </span>
            </div>
          </div>

          <div
            className='h-6 w-px hidden sm:block'
            style={{ background: 'var(--color-border)' }}
          />

          <div className='flex items-center gap-1.5 sm:gap-2 shrink-0'>
            <div className='relative'>
              <Circle
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 fill-current ${
                  connected ? 'text-emerald-400' : 'text-red-400'
                }`}
              />
              {connected && (
                <Circle className='w-2 h-2 sm:w-2.5 sm:h-2.5 fill-current text-emerald-400 absolute top-0 left-0 animate-pulse opacity-75' />
              )}
            </div>
            <span
              className='text-[10px] sm:text-xs font-medium hidden xs:inline'
              style={{
                color: connected
                  ? 'var(--color-success)'
                  : 'var(--color-error)',
              }}
            >
              {connected ? 'Live' : 'Off'}
            </span>
          </div>
        </div>

        <div className='flex-1 max-w-xl mx-2 sm:mx-8 min-w-0'>
          <div className='relative group'>
            <Search
              className='absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors'
              style={{
                color: search
                  ? 'var(--color-text-secondary)'
                  : 'var(--color-text-tertiary)',
              }}
            />
            <input
              type='text'
              placeholder='Search...'
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className='w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg outline-none transition-all duration-200'
              style={{
                background: 'var(--color-bg-tertiary)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-hover)';
                e.currentTarget.style.background = 'var(--color-bg-elevated)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.background = 'var(--color-bg-tertiary)';
              }}
            />
          </div>
        </div>

        <div className='flex items-center gap-2 sm:gap-4 shrink-0'>
          <div
            className='hidden sm:flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg'
            style={{
              background: 'var(--color-bg-tertiary)',
              border: '1px solid var(--color-border)',
            }}
          >
            <span
              className='text-[10px] sm:text-xs font-medium tabular-nums'
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {requestCount.toLocaleString()}
            </span>
            <span
              className='text-[10px] sm:text-xs hidden md:inline'
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              requests
            </span>
          </div>
          <div
            className='sm:hidden text-[10px] font-medium tabular-nums'
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {requestCount > 999
              ? `${(requestCount / 1000).toFixed(1)}k`
              : requestCount}
          </div>

          <button
            onClick={onClear}
            disabled={requestCount === 0}
            className='p-1.5 sm:p-2 rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed'
            style={{
              color: 'var(--color-text-tertiary)',
              background: 'transparent',
            }}
            onMouseEnter={(e) => {
              if (requestCount > 0) {
                e.currentTarget.style.background = 'var(--color-error-bg)';
                e.currentTarget.style.color = 'var(--color-error)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--color-text-tertiary)';
            }}
            title='Clear all requests'
          >
            <Trash2 className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
          </button>
        </div>
      </div>
    </header>
  );
}
