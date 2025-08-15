import type { CreatePostData } from '../services/broadcast.service';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createPost } from '../services/broadcast.service';

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      // Invalidate and refetch broadcast feed
      queryClient.invalidateQueries({ queryKey: ['broadcasts'] });
    },
    onError: (error: any) => {
      // Error handled by UI components
    }
  });
};
