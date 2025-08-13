import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from '@heroui/toast';

import { saveDraft } from '../services/broadcast.service';

interface DraftData {
  id?: string;
  title?: string;
  content?: string;
  type?: string;
  category?: string;
  tags?: string[];
  timestamp?: string;
  [key: string]: any;
}

export const useSaveDraft = () => {
  const t = useTranslations('broadcasts');

  return useMutation({
    mutationFn: (draftData: DraftData) => saveDraft(draftData),
    onSuccess: (data) => {
      // Show success message
      if (typeof toast !== 'undefined') {
        toast.success(t('success.draftSaved'));
      }
      
      console.log('Draft saved successfully:', data);
    },
    onError: (error: any) => {
      console.error('Failed to save draft:', error);
      
      // Show error message
      if (typeof toast !== 'undefined') {
        toast.error(t('errors.draftSaveFailed'));
      }
    }
  });
};
