import { useMutation } from '@tanstack/react-query';

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
