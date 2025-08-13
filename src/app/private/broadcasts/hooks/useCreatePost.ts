import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from '@heroui/toast';

import { createPost, type CreatePostData } from '../services/broadcast.service';

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const t = useTranslations('broadcasts');

  return useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      // Invalidate and refetch broadcast feed
      queryClient.invalidateQueries({ queryKey: ['broadcasts'] });
      
      // Show success message
      if (typeof toast !== 'undefined') {
        toast.success(t('success.published'));
      }
      
      console.log('Post created successfully:', data);
    },
    onError: (error: any) => {
      console.error('Failed to create post:', error);
      
      // Show error message
      if (typeof toast !== 'undefined') {
        toast.error(t('errors.publishFailed'));
      }
    }
  });
};
