import { useQuery } from '@tanstack/react-query';

import { getPostById } from '../services/broadcast.service';

/**
 * Hook for fetching a single broadcast post by ID
 */
export const usePostById = (postId: string) => {
  return useQuery({
    queryKey: ['broadcasts', 'post', postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId, // Only run query if postId exists
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: false,
    retry: 1
  });
};