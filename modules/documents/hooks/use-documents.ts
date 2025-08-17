import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { type IDocument } from '@/app/private/documents/types';

import {
  deleteDocument,
  getMyDocuments,
  getNetworkUsers,
  shareDocument,
  updateDocument,
  uploadDocument
} from '../services/documents.service';

export const useDocuments = () => {
  return useQuery<{ data: IDocument[] }>({
    queryKey: ['documents'],
    queryFn: getMyDocuments
  });
};

export const useNetworkUsers = (page = 1, limit = 8, enabled = true) => {
  return useQuery({
    queryKey: ['network-users', page, limit],
    queryFn: async () => {
      const users = await getNetworkUsers(page, limit);
      return users.data;
    },
    enabled
  });
};

export const useShareDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      documentId,
      data
    }: {
      documentId: string;
      data: { users: string[]; message?: string; notifyUsers: boolean };
    }) => shareDocument(documentId, data),
    onSuccess: async () => {
      try {
        await queryClient.invalidateQueries({ queryKey: ['documents'] });
      } catch (error) {
        console.error('Failed to invalidate documents query:', error);
      }
    }
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => uploadDocument(formData),
    onSuccess: async () => {
      try {
        await queryClient.invalidateQueries({ queryKey: ['documents'] });
      } catch (error) {
        console.error('Failed to invalidate documents query:', error);
      }
    }
  });
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ documentId, formData }: { documentId: string; formData: FormData }) =>
      updateDocument(documentId, formData),
    onSuccess: async () => {
      try {
        await queryClient.invalidateQueries({ queryKey: ['documents'] });
      } catch (error) {
        console.error('Failed to invalidate documents query:', error);
      }
    }
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId: string) => deleteDocument(documentId),
    onSuccess: async () => {
      try {
        await queryClient.invalidateQueries({ queryKey: ['documents'] });
      } catch (error) {
        console.error('Failed to invalidate documents query:', error);
      }
    }
  });
};
