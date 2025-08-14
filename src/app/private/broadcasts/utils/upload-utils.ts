import { API_ROUTES } from '@/lib/api-routes';
import wingManApi from '@/lib/axios';

export interface SingleUploadResult {
  $metadata: {
    httpStatusCode: number;
    attempts: number;
    totalRetryDelay: number;
  };
  ETag: string;
  fileName: string;
  id: string; // This will be added by our client code
}

export interface UploadProgress {
  file: File;
  progress: number;
  uploaded: boolean;
  url?: string;
  error?: string;
  id: string;
}

/**
 * Upload files one by one to POST /upload/public with multipart form data
 * Key: 'file' as requested
 */
export const uploadFilesSequentially = async (
  files: File[],
  onProgress?: (fileId: string, progress: number) => void,
  onComplete?: (fileId: string, result: SingleUploadResult) => void,
  onError?: (fileId: string, error: string) => void
): Promise<SingleUploadResult[]> => {
  const results: SingleUploadResult[] = [];

  for (const file of files) {
    const fileId = `${Date.now()}-${Math.random()}`;

    try {
      // Create FormData with 'file' key as specified
      const formData = new FormData();
      formData.append('file', file);

      // Upload to public endpoint
      const response = await wingManApi.post(API_ROUTES.upload.public, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(fileId, progress);
          }
        }
      });

      const result: SingleUploadResult = {
        ...response.data,
        id: fileId
      };

      results.push(result);

      if (onComplete) {
        onComplete(fileId, result);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Upload failed';

      if (onError) {
        onError(fileId, errorMessage);
      }

      throw new Error(`Failed to upload ${file.name}: ${errorMessage}`);
    }
  }

  return results;
};

/**
 * Upload a single file to POST /upload/public
 */
export const uploadSingleFile = async (file: File): Promise<SingleUploadResult> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await wingManApi.post(API_ROUTES.upload.public, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return {
    ...response.data,
    id: `${Date.now()}-${Math.random()}`
  };
};

/**
 * Validate file before upload
 */
export const validateFile = (
  file: File,
  type?: 'image' | 'video'
): { isValid: boolean; error?: string } => {
  // File size validation
  const maxSize = type === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024; // 100MB for video, 10MB for image
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File ${file.name} is too large. Maximum size is ${type === 'video' ? '100MB' : '10MB'}`
    };
  }

  // File type validation
  if (type) {
    const validTypes =
      type === 'video'
        ? ['video/mp4', 'video/webm', 'video/mov', 'video/avi', 'video/quicktime']
        : ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (!validTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `Invalid file type for ${file.name}. Please select a valid ${type} file.`
      };
    }
  }

  return { isValid: true };
};
