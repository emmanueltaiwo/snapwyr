import { useState, useMemo, useCallback } from 'react';
import type { LogEntry, FilterState, RequestDirection } from '../types';

const defaultFilters: FilterState = {
  search: '',
  methods: [],
  statusCodes: [],
  directions: [],
  minDuration: null,
  maxDuration: null,
  showErrors: false,
  showSlow: false,
};

export function useFilters(requests: LogEntry[]) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const toggleMethod = useCallback((method: string) => {
    setFilters((prev) => ({
      ...prev,
      methods: prev.methods.includes(method)
        ? prev.methods.filter((m) => m !== method)
        : [...prev.methods, method],
    }));
  }, []);

  const toggleStatusCode = useCallback((code: string) => {
    setFilters((prev) => ({
      ...prev,
      statusCodes: prev.statusCodes.includes(code)
        ? prev.statusCodes.filter((c) => c !== code)
        : [...prev.statusCodes, code],
    }));
  }, []);

  const toggleDirection = useCallback((direction: RequestDirection) => {
    setFilters((prev) => ({
      ...prev,
      directions: prev.directions.includes(direction)
        ? prev.directions.filter((d) => d !== direction)
        : [...prev.directions, direction],
    }));
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesUrl = req.url.toLowerCase().includes(searchLower);
        const matchesBody =
          req.requestBody?.toLowerCase().includes(searchLower) ||
          req.responseBody?.toLowerCase().includes(searchLower);
        if (!matchesUrl && !matchesBody) return false;
      }

      if (filters.methods.length > 0 && !filters.methods.includes(req.method)) {
        return false;
      }

      // Status code filter
      if (filters.statusCodes.length > 0) {
        const statusGroup = req.status
          ? `${Math.floor(req.status / 100)}xx`
          : 'error';
        if (!filters.statusCodes.includes(statusGroup)) return false;
      }

      if (filters.minDuration !== null && req.duration < filters.minDuration) {
        return false;
      }
      if (filters.maxDuration !== null && req.duration > filters.maxDuration) {
        return false;
      }

      if (
        filters.showErrors &&
        !(req.error || (req.status && req.status >= 400))
      ) {
        return false;
      }

      if (filters.showSlow && !req.slow) {
        return false;
      }

      if (filters.directions.length > 0 && req.direction) {
        if (!filters.directions.includes(req.direction)) {
          return false;
        }
      }

      return true;
    });
  }, [requests, filters]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== '' ||
      filters.methods.length > 0 ||
      filters.statusCodes.length > 0 ||
      filters.directions.length > 0 ||
      filters.minDuration !== null ||
      filters.maxDuration !== null ||
      filters.showErrors ||
      filters.showSlow
    );
  }, [filters]);

  return {
    filters,
    filteredRequests,
    hasActiveFilters,
    updateFilter,
    resetFilters,
    toggleMethod,
    toggleStatusCode,
    toggleDirection,
  };
}
