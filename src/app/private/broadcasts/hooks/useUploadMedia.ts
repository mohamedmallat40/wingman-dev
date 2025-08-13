import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState, useCallback } from 'react';

import wingManApi from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';

export interface UploadProgress {
  file: File;
  progress: number;
  uploaded: boolean;
  url?: string;
  error?: string;
  id: string;
}

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  type: string;
  id: string;
}

export interface UploadError {
  message: string;
  code?: string;
  file?: File;
}

export const useUploadMedia = () => {
  const t = useTranslations('broadcasts.validation');
  const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgress>>({});

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData): Promise<UploadResponse> => {
      const file = formData.get('file') as File;
      const type = formData.get('type') as string;
      
      if (!file) {
        throw new Error('No file provided');
      }

      // Validate file size
      const maxSize = type === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024; // 100MB for video, 10MB for image
      if (file.size > maxSize) {
        throw new Error(t('fileTooLarge', { 
          filename: file.name, 
          maxSize: type === 'video' ? '100MB' : '10MB' 
        }));
      }

      // Validate file type
      const validTypes = type === 'video' 
        ? ['video/mp4', 'video/webm', 'video/mov', 'video/avi', 'video/quicktime']
        : ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      
      if (!validTypes.includes(file.type)) {
        throw new Error(t('invalidFileType', { filename: file.name, type }));
      }

      const fileId = `${Date.now()}-${Math.random()}`;
      
      // Initialize progress tracking
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: {
          file,
          progress: 0,
          uploaded: false,
          id: fileId
        }
      }));

      try {
        const response = await wingManApi.post(API_ROUTES.upload.single, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(prev => ({
                ...prev,
                [fileId]: {
                  ...prev[fileId],
                  progress
                }
              }));
            }
          }
        });

        // Mark as uploaded
        setUploadProgress(prev => ({
          ...prev,
          [fileId]: {
            ...prev[fileId],
            progress: 100,
            uploaded: true,
            url: response.data.url
          }
        }));

        return {
          ...response.data,
          id: fileId
        };
      } catch (error: any) {
        // Mark as error
        setUploadProgress(prev => ({
          ...prev,
          [fileId]: {
            ...prev[fileId],
            error: error.message || 'Upload failed'
          }
        }));
        
        throw error;
      }
    },
    onError: (error: any) => {
      console.error('Upload error:', error);
    }
  });

  const uploadMultipleFiles = useCallback(async (files: File[], type: 'image' | 'video') => {
    const maxFiles = type === 'image' ? 10 : 1; // Max 10 images or 1 video
    
    if (files.length > maxFiles) {
      throw new Error(t('maxFilesExceeded', { maxFiles }));
    }

    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      return uploadMutation.mutateAsync(formData);
    });

    try {
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      throw new Error(t('uploadFailed', { type }));
    }
  }, [uploadMutation, t]);

  const clearProgress = useCallback((fileId?: string) => {
    if (fileId) {
      setUploadProgress(prev => {
        const { [fileId]: removed, ...rest } = prev;
        return rest;
      });
    } else {
      setUploadProgress({});
    }
  }, []);

  const resetUpload = useCallback(() => {
    setUploadProgress({});
    uploadMutation.reset();
  }, [uploadMutation]);

  return {
    uploadSingle: uploadMutation.mutateAsync,
    uploadMultiple: uploadMultipleFiles,
    uploadProgress,
    clearProgress,
    resetUpload,
    isUploading: uploadMutation.isPending,
    uploadError: uploadMutation.error,
    isSuccess: uploadMutation.isSuccess,
    isError: uploadMutation.isError
  };
};
