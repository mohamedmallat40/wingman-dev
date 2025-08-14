import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

// import { toast } from '@heroui/toast'; // Commented out for now

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
      // Success handled by UI components
    },
    onError: (error: any) => {
      // Error handled by UI components
    }
  });
};
