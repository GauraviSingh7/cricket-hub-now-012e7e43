/**
 * STRYKER API Service Layer
 * 
 * Centralized API utility for all backend communication.
 * All endpoints use environment variable for base URL.
 * 
 * Backend Contract (FastAPI):
 * - GET /matches/live          → Match[]
 * - GET /matches/upcoming      → Match[]
 * - GET /matches/{match_id}    → Match
 * - GET /matches/{match_id}/commentary → CommentaryBall[]
 * - GET /matches/{match_id}/scorecard  → FullScorecard
 * - GET /news/trending         → NewsItem[]
 * - POST /waitlist/email       → { success: boolean, message: string }
 */

import type { 
  Match, 
  NewsItem, 
  CommentaryBall, 
  FullScorecard 
} from './types';

// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * API Response wrapper for consistent error handling
 */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

/**
 * API Error class for structured error handling
 */
export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Generic fetch wrapper with error handling
 * Handles network errors, HTTP errors, and JSON parsing
 */
async function fetchApi<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    // Handle HTTP errors
    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new ApiError(
        errorBody || `HTTP Error: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    // Handle empty responses
    const text = await response.text();
    if (!text) {
      return null as T;
    }

    return JSON.parse(text) as T;
  } catch (error) {
    // Re-throw ApiError as-is
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError('Network error: Unable to connect to server', 0);
    }
    
    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      throw new ApiError('Invalid response from server', 500);
    }
    
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      500
    );
  }
}

// ============================================
// MATCH ENDPOINTS
// ============================================

/**
 * Fetch all live matches
 * Backend polling should be handled by the consuming component/hook
 */
export async function getLiveMatches(): Promise<Match[]> {
  return fetchApi<Match[]>('/matches/live');
}

/**
 * Fetch all upcoming matches
 */
export async function getUpcomingMatches(): Promise<Match[]> {
  return fetchApi<Match[]>('/matches/upcoming');
}

/**
 * Fetch a specific match by ID
 * Returns undefined if match not found (404)
 */
export async function getMatchById(matchId: string): Promise<Match | undefined> {
  try {
    return await fetchApi<Match>(`/matches/${matchId}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return undefined;
    }
    throw error;
  }
}

/**
 * Fetch ball-by-ball commentary for a match
 */
export async function getMatchCommentary(matchId: string): Promise<CommentaryBall[]> {
  return fetchApi<CommentaryBall[]>(`/matches/${matchId}/commentary`);
}

/**
 * Fetch full scorecard for a match
 * May return null if scorecard not available yet
 */
export async function getMatchScorecard(matchId: string): Promise<FullScorecard | null> {
  try {
    return await fetchApi<FullScorecard>(`/matches/${matchId}/scorecard`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

// ============================================
// NEWS ENDPOINTS
// ============================================

/**
 * Fetch trending news articles
 */
export async function getTrendingNews(): Promise<NewsItem[]> {
  return fetchApi<NewsItem[]>('/news/trending');
}

// ============================================
// WAITLIST ENDPOINTS
// ============================================

export interface WaitlistResponse {
  success: boolean;
  message: string;
}

/**
 * Submit email to waitlist
 */
export async function submitWaitlistEmail(email: string): Promise<WaitlistResponse> {
  return fetchApi<WaitlistResponse>('/waitlist/email', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if the API is reachable
 * Useful for health checks and connection status
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    await fetch(`${API_BASE_URL}/health`, { method: 'HEAD' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the configured API base URL (for debugging)
 */
export function getApiBaseUrl(): string {
  return API_BASE_URL;
}
