import { Search, Zap, Code2, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  hasRequests: boolean;
  hasFilters: boolean;
  onResetFilters: () => void;
}

export function EmptyState({
  hasRequests,
  hasFilters,
  onResetFilters,
}: EmptyStateProps) {
  if (hasFilters && hasRequests) {
    return (
      <div className='h-full flex flex-col items-center justify-center p-4 sm:p-8'>
        <div className='text-center max-w-md w-full'>
          <div
            className='flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mx-auto mb-4 sm:mb-6'
            style={{
              background:
                'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
            }}
          >
            <Search
              className='w-8 h-8 sm:w-10 sm:h-10'
              style={{ color: '#a78bfa' }}
            />
          </div>
          <h3
            className='text-base sm:text-lg font-semibold mb-2'
            style={{ color: 'var(--color-text-primary)' }}
          >
            No matching requests
          </h3>
          <p
            className='text-xs sm:text-sm mb-4 sm:mb-6 px-2'
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            Try adjusting your filters to see more results
          </p>
          <button
            onClick={onResetFilters}
            className='px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200'
            style={{
              background: 'var(--color-bg-tertiary)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-bg-elevated)';
              e.currentTarget.style.borderColor = 'var(--color-border-hover)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-bg-tertiary)';
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Clear All Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='h-full flex flex-col items-center justify-center p-4 sm:p-8'>
      <div className='text-center max-w-lg w-full'>
        <div
          className='flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 rounded-2xl mx-auto mb-6 sm:mb-8 relative'
          style={{
            background:
              'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
          }}
        >
          <Zap
            className='w-8 h-8 sm:w-12 sm:h-12'
            style={{ color: '#a78bfa' }}
          />
          <div
            className='absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full animate-pulse'
            style={{
              background: 'var(--color-success)',
              boxShadow: '0 0 12px var(--color-success)',
            }}
          />
        </div>
        <h3
          className='text-lg sm:text-xl font-semibold mb-2 sm:mb-3'
          style={{ color: 'var(--color-text-primary)' }}
        >
          Waiting for requests
        </h3>
        <p
          className='text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed px-2'
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          Make HTTP requests in your app and they will appear here in real-time.
          <br className='hidden sm:block' />
          <span className='sm:hidden'> </span>
          Get started by integrating Snapwyr into your application.
        </p>

        <div
          className='text-left p-3 sm:p-5 rounded-xl border mx-2 sm:mx-0'
          style={{
            background: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className='flex items-center gap-2 mb-2 sm:mb-3'>
            <Code2
              className='w-3.5 h-3.5 sm:w-4 sm:h-4'
              style={{ color: 'var(--color-text-tertiary)' }}
            />
            <span
              className='text-[10px] sm:text-xs font-semibold uppercase tracking-wider'
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              Quick Start
            </span>
          </div>
          <pre
            className='text-[10px] sm:text-xs overflow-x-auto'
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-text-secondary)',
              lineHeight: '1.8',
            }}
          >
            {`import { snapwyr } from 'snapwyr/express';
import { serve } from 'snapwyr/dashboard';

app.use(snapwyr({ logBody: true }));
serve(3333);`}
          </pre>
        </div>

        <div className='mt-6 sm:mt-8 flex items-center justify-center gap-4 sm:gap-6 flex-wrap'>
          <div className='flex items-center gap-1.5 sm:gap-2'>
            <div
              className='w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse'
              style={{ background: 'var(--color-success)' }}
            />
            <span
              className='text-[10px] sm:text-xs'
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              Real-time monitoring
            </span>
          </div>
          <div className='flex items-center gap-1.5 sm:gap-2'>
            <Sparkles
              className='w-2.5 h-2.5 sm:w-3 sm:h-3'
              style={{ color: 'var(--color-info)' }}
            />
            <span
              className='text-[10px] sm:text-xs'
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              Live updates
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
