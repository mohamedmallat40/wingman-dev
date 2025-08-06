import { useQuery } from '@tanstack/react-query';

import { IDocument } from '@/app/private/documents/types';

import { getMyDocuments } from '../services/documents.service';

export const useDocuments = () => {
  return useQuery<{ data: IDocument[] }>({
    queryKey: ['documents'],
    queryFn: getMyDocuments
  });
};
