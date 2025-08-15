import type { CreatePostData } from '../services/broadcast.service';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { createPost } from '../services/broadcast.service';

// import { toast } from '@heroui/toast'; // Commented out for now

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const t = useTranslations('broadcasts');

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
