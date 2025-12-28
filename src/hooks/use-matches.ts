/**
 * Custom hooks for match data fetching
 * 
 * Features:
 * - Automatic polling for live matches (configurable interval)
 * - Loading, error, and empty state handling
 * - Incremental updates without full re-renders
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getLiveMatches, 
  getUpcomingMatches, 
  getMatchById, 
  getMatchCommentary, 
  getMatchScorecard 
} from '@/lib/api';
import type { Match } from '@/lib/types';

// Query keys for cache management
export const matchQueryKeys = {
  all: ['matches'] as const,
  live: ['matches', 'live'] as const,
  upcoming: ['matches', 'upcoming'] as const,
  detail: (id: string) => ['matches', 'detail', id] as const,
  commentary: (id: string) => ['matches', 'commentary', id] as const,
  scorecard: (id: string) => ['matches', 'scorecard', id] as const,
};

// Default polling intervals
const LIVE_POLL_INTERVAL = 10000; // 10 seconds for live scores
const DETAIL_POLL_INTERVAL = 5000; // 5 seconds for match detail

/**
 * Hook for fetching live matches with automatic polling
 * 
 * @param options.pollInterval - Polling interval in ms (default: 10000)
 * @param options.enabled - Whether to enable the query
 */
export function useLiveMatches(options?: { 
  pollInterval?: number; 
  enabled?: boolean;
}) {
  const { pollInterval = LIVE_POLL_INTERVAL, enabled = true } = options || {};
  
  return useQuery({
    queryKey: matchQueryKeys.live,
    queryFn: getLiveMatches,
    refetchInterval: pollInterval,
    enabled,
    staleTime: 5000, // Consider data fresh for 5 seconds
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
}

/**
 * Hook for fetching upcoming matches
 * No polling since upcoming matches don't change frequently
 */
export function useUpcomingMatches(options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};
  
  return useQuery({
    queryKey: matchQueryKeys.upcoming,
    queryFn: getUpcomingMatches,
    enabled,
    staleTime: 60000, // Consider data fresh for 1 minute
    retry: 2,
  });
}

/**
 * Combined hook for all matches (live + upcoming)
 * Useful for pages that need both lists
 */
export function useAllMatches(options?: { 
  pollLive?: boolean;
  pollInterval?: number;
}) {
  const { pollLive = true, pollInterval = LIVE_POLL_INTERVAL } = options || {};
  
  const liveQuery = useLiveMatches({ pollInterval, enabled: pollLive });
  const upcomingQuery = useUpcomingMatches();
  
  // Combine results
  const allMatches: Match[] = [
    ...(liveQuery.data || []),
    ...(upcomingQuery.data || []),
  ];
  
  // Sort by status priority (LIVE first, then UPCOMING by start time)
  const sortedMatches = allMatches.sort((a, b) => {
    if (a.status === 'LIVE' && b.status !== 'LIVE') return -1;
    if (a.status !== 'LIVE' && b.status === 'LIVE') return 1;
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });
  
  return {
    data: sortedMatches,
    liveMatches: liveQuery.data || [],
    upcomingMatches: upcomingQuery.data || [],
    isLoading: liveQuery.isLoading || upcomingQuery.isLoading,
    error: liveQuery.error || upcomingQuery.error,
    refetch: () => {
      liveQuery.refetch();
      upcomingQuery.refetch();
    },
  };
}

/**
 * Hook for fetching a single match by ID with polling for live matches
 * Automatically adjusts polling based on match status
 */
export function useMatch(matchId: string | undefined, options?: {
  pollInterval?: number;
  enabled?: boolean;
}) {
  const { pollInterval = DETAIL_POLL_INTERVAL, enabled = true } = options || {};
  
  const query = useQuery({
    queryKey: matchQueryKeys.detail(matchId || ''),
    queryFn: () => getMatchById(matchId!),
    enabled: enabled && !!matchId,
    staleTime: 3000,
    retry: 2,
  });
  
  // Dynamic refetch interval based on match status
  const isLive = query.data?.status === 'LIVE';
  
  return useQuery({
    queryKey: matchQueryKeys.detail(matchId || ''),
    queryFn: () => getMatchById(matchId!),
    enabled: enabled && !!matchId,
    refetchInterval: isLive ? pollInterval : false,
    staleTime: 3000,
    retry: 2,
  });
}

/**
 * Hook for fetching match commentary with polling for live matches
 */
export function useMatchCommentary(matchId: string | undefined, options?: {
  pollInterval?: number;
  enabled?: boolean;
  isLive?: boolean;
}) {
  const { pollInterval = DETAIL_POLL_INTERVAL, enabled = true, isLive = false } = options || {};
  
  return useQuery({
    queryKey: matchQueryKeys.commentary(matchId || ''),
    queryFn: () => getMatchCommentary(matchId!),
    enabled: enabled && !!matchId,
    refetchInterval: isLive ? pollInterval : false,
    staleTime: 3000,
    retry: 2,
  });
}

/**
 * Hook for fetching match scorecard
 */
export function useMatchScorecard(matchId: string | undefined, options?: {
  pollInterval?: number;
  enabled?: boolean;
  isLive?: boolean;
}) {
  const { pollInterval = 30000, enabled = true, isLive = false } = options || {};
  
  return useQuery({
    queryKey: matchQueryKeys.scorecard(matchId || ''),
    queryFn: () => getMatchScorecard(matchId!),
    enabled: enabled && !!matchId,
    refetchInterval: isLive ? pollInterval : false,
    staleTime: 10000,
    retry: 2,
  });
}

/**
 * Hook for prefetching match data
 * Useful for preloading data when user hovers over a match card
 */
export function usePrefetchMatch() {
  const queryClient = useQueryClient();
  
  return (matchId: string) => {
    queryClient.prefetchQuery({
      queryKey: matchQueryKeys.detail(matchId),
      queryFn: () => getMatchById(matchId),
      staleTime: 10000,
    });
  };
}
