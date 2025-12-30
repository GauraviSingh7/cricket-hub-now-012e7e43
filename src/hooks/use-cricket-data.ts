// Custom hooks for data fetching - wires API layer to React Query

import { useQuery } from '@tanstack/react-query';
import { fetchSchedules, fetchMatches, fetchLiveMatch } from '@/lib/api';
import { adaptScheduleToMatch, adaptMatchItemToMatch, enhanceMatchWithLiveData } from '@/lib/api/adapters';
import { fetchMockNews, fetchMockDiscussions, fetchMockCommentary, fetchMockScorecard, mockMatchesFallback } from '@/lib/mock-data';
import type { Match } from '@/lib/types';

// Fetch all matches (from /matches endpoint, fallback to schedules or mock)
export function useMatches(options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: ['matches'],
    queryFn: async (): Promise<Match[]> => {
      try {
        const response = await fetchMatches();
        return response.matches.map(adaptMatchItemToMatch);
      } catch {
        // Fallback to schedules endpoint
        try {
          const scheduleResponse = await fetchSchedules();
          return scheduleResponse.schedules.map(adaptScheduleToMatch);
        } catch {
          // Final fallback to mock data
          return mockMatchesFallback as Match[];
        }
      }
    },
    refetchInterval: options?.refetchInterval,
  });
}

// Fetch schedules
export function useSchedules() {
  return useQuery({
    queryKey: ['schedules'],
    queryFn: async (): Promise<Match[]> => {
      try {
        const response = await fetchSchedules();
        return response.schedules.map(adaptScheduleToMatch);
      } catch {
        return mockMatchesFallback as Match[];
      }
    },
  });
}

// Fetch single match with live data
export function useMatch(matchId: string | undefined, options?: { refetchInterval?: number }) {
  const { data: matches } = useMatches();
  
  return useQuery({
    queryKey: ['match', matchId],
    queryFn: async (): Promise<Match | undefined> => {
      if (!matchId) return undefined;
      
      // Find base match from matches list
      const baseMatch = matches?.find(m => m.id === matchId);
      if (!baseMatch) {
        return mockMatchesFallback.find(m => m.id === matchId) as Match | undefined;
      }

      // Try to get live data
      try {
        const liveData = await fetchLiveMatch(matchId);
        return enhanceMatchWithLiveData(baseMatch, liveData);
      } catch {
        return baseMatch;
      }
    },
    enabled: !!matchId,
    refetchInterval: options?.refetchInterval,
  });
}

// Fetch live match score (for polling)
export function useLiveMatch(matchId: string | undefined) {
  return useQuery({
    queryKey: ['liveMatch', matchId],
    queryFn: () => fetchLiveMatch(matchId!),
    enabled: !!matchId,
    refetchInterval: 10000, // Poll every 10 seconds
  });
}

// Mocked hooks for Phase-1
export function useNews() {
  return useQuery({
    queryKey: ['news'],
    queryFn: fetchMockNews,
  });
}

export function useDiscussions(matchId?: string) {
  return useQuery({
    queryKey: ['discussions', matchId],
    queryFn: () => fetchMockDiscussions(matchId),
  });
}

export function useCommentary(matchId: string | undefined) {
  return useQuery({
    queryKey: ['commentary', matchId],
    queryFn: () => fetchMockCommentary(matchId!),
    enabled: !!matchId,
  });
}

export function useScorecard(matchId: string | undefined) {
  return useQuery({
    queryKey: ['scorecard', matchId],
    queryFn: () => fetchMockScorecard(matchId!),
    enabled: !!matchId,
  });
}
