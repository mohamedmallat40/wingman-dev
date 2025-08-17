import type { DocumentUploadResponse } from '../../../src/app/private/documents/types/index';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

import { API_ROUTES } from '../../../src/lib/api-routes';
import wingManApi from '../../../src/lib/axios';

export interface UploadResponse {
  readonly fileName: string;
  readonly originalname: string;
  readonly buffer: string;
}

// Enhanced upload response with proper typing
export interface EnhancedUploadResponse extends DocumentUploadResponse {
  readonly fileMetadata: {
    readonly size: number;
    readonly type: string;
    readonly lastModified: number;
  };
}

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file); // Changed from 'image' to 'file' to match broadcast pattern
  return await wingManApi.post<UploadResponse>(API_ROUTES.upload.public, formData, {
    // Changed to public endpoint
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
