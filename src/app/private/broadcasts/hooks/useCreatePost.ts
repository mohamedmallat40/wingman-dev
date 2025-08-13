import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
// import { toast } from '@heroui/toast'; // Commented out for now

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
      console.log('Success:', t('success.published'));
      
      console.log('Post created successfully:', data);
    },
    onError: (error: any) => {
      console.error('Failed to create post:', error);
      
      // Show error message
      console.error('Error:', t('errors.publishFailed'));
    }
  });
};
