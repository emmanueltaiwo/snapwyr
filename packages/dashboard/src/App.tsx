import { useState } from 'react';
import { Filter } from 'lucide-react';
import { useWebSocket } from './hooks/useWebSocket';
import { useFilters } from './hooks/useFilters';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { RequestList } from './components/RequestList';
import { RequestDetail } from './components/RequestDetail';
import { FilterPanel } from './components/FilterPanel';
import { EmptyState } from './components/EmptyState';
import type { LogEntry } from './types';

export default function App() {
  const { requests, stats, connected, clearRequests } = useWebSocket();
  const {
    filters,
    filteredRequests,
    hasActiveFilters,
    updateFilter,
    resetFilters,
    toggleMethod,
    toggleStatusCode,
    toggleDirection,
  } = useFilters(requests);

  const [selectedRequest, setSelectedRequest] = useState<LogEntry | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  return (
    <div
      className='h-screen flex flex-col overflow-hidden'
      style={{ background: 'var(--color-bg)' }}
    >
      <Header
        connected={connected}
        search={filters.search}
        onSearchChange={(value) => updateFilter('search', value)}
        onClear={clearRequests}
        requestCount={requests.length}
      />

      <StatsBar stats={stats} />

      {/* Filter toggle bar */}
      <div
        className='shrink-0 border-b px-3 sm:px-6 py-1.5 sm:py-2 flex items-center gap-2'
        style={{
          borderColor: 'var(--color-border)',
          background: 'var(--color-bg-secondary)',
        }}
      >
        <button
          onClick={() => setShowFilters(!showFilters)}
          className='flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all duration-200 uppercase tracking-wider'
          style={{
            background: showFilters
              ? 'var(--color-bg-tertiary)'
              : 'transparent',
            border: '1px solid var(--color-border)',
            color: hasActiveFilters
              ? 'var(--color-text-primary)'
              : 'var(--color-text-tertiary)',
          }}
          onMouseEnter={(e) => {
            if (!showFilters) {
              e.currentTarget.style.background = 'var(--color-bg-tertiary)';
            }
          }}
          onMouseLeave={(e) => {
            if (!showFilters) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          <Filter className='w-3 h-3 sm:w-3.5 sm:h-3.5' />
          <span className='hidden xs:inline'>Filters</span>
          <span className='xs:hidden'>Filter</span>
          {hasActiveFilters && (
            <span
              className='w-1.5 h-1.5 rounded-full'
              style={{ background: 'var(--color-info)' }}
            />
          )}
        </button>
      </div>

      {showFilters && (
        <FilterPanel
          filters={filters}
          stats={stats}
          onToggleMethod={toggleMethod}
          onToggleStatusCode={toggleStatusCode}
          onToggleDirection={toggleDirection}
          onUpdateFilter={updateFilter}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      )}

      <div className='flex-1 flex flex-col md:flex-row overflow-hidden'>
        <div
          className={`flex-1 overflow-hidden transition-all duration-300 ${
            selectedRequest ? 'hidden md:block md:w-1/2 lg:w-2/5' : ''
          }`}
        >
          {filteredRequests.length === 0 ? (
            <EmptyState
              hasRequests={requests.length > 0}
              hasFilters={hasActiveFilters}
              onResetFilters={resetFilters}
            />
          ) : (
            <RequestList
              requests={filteredRequests}
              selectedId={selectedRequest?.id}
              onSelect={setSelectedRequest}
            />
          )}
        </div>

        {selectedRequest && (
          <div
            className='w-full md:w-1/2 lg:w-3/5 overflow-hidden flex flex-col'
            style={{ borderLeft: '1px solid var(--color-border)' }}
          >
            <RequestDetail
              request={selectedRequest}
              onClose={() => setSelectedRequest(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
