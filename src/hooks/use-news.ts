/**
 * Custom hooks for news data fetching
 */

import { useQuery } from '@tanstack/react-query';
import { getTrendingNews } from '@/lib/api';

// Query keys for cache management
export const newsQueryKeys = {
  all: ['news'] as const,
  trending: ['news', 'trending'] as const,
};

/**
 * Hook for fetching trending news
 * 
 * @param options.pollInterval - Optional polling interval for auto-refresh
 * @param options.enabled - Whether to enable the query
 */
export function useTrendingNews(options?: { 
  pollInterval?: number;
  enabled?: boolean;
}) {
  const { pollInterval, enabled = true } = options || {};
  
  return useQuery({
    queryKey: newsQueryKeys.trending,
    queryFn: getTrendingNews,
    enabled,
    refetchInterval: pollInterval,
    staleTime: 60000, // Consider news fresh for 1 minute
    retry: 2,
  });
}
