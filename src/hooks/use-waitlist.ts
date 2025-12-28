/**
 * Custom hook for waitlist email submission
 */

import { useMutation } from '@tanstack/react-query';
import { submitWaitlistEmail, type WaitlistResponse, ApiError } from '@/lib/api';

interface UseWaitlistOptions {
  onSuccess?: (data: WaitlistResponse) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for submitting email to waitlist
 * Handles loading state, success, and error states
 */
export function useWaitlist(options?: UseWaitlistOptions) {
  const { onSuccess, onError } = options || {};
  
  return useMutation({
    mutationFn: submitWaitlistEmail,
    onSuccess,
    onError: (error) => {
      // Log error for debugging
      console.error('Waitlist submission failed:', error);
      
      // Call custom error handler if provided
      if (onError) {
        onError(error instanceof Error ? error : new Error('Unknown error'));
      }
    },
  });
}
