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
  return await wingManApi.post<UploadResponse>(API_ROUTES.upload.single, formData, {
    // Use private endpoint for documents
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
export const uploadPublic = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return wingManApi.post<UploadResponse>(API_ROUTES.upload.public, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

/**
 * Delete uploaded file from private storage
 * This is useful for cleanup when documents are deleted
 */
export const deleteUploadedFile = async (fileName: string) => {
  return await wingManApi.delete(`${API_ROUTES.upload.private}/${fileName}`);
};

/**
 * Fetch private document file with authentication
 * Returns blob URL for secure document preview
 */
export const fetchPrivateDocument = async (fileName: string): Promise<string> => {
  try {
    const response = await wingManApi.get(`${API_ROUTES.upload.private}/${fileName}`, {
      responseType: 'blob', // Important: get the file as blob
      headers: {
        'Accept': 'image/*,application/pdf,*/*'
      }
    });
    
    // Always use our own MIME type detection to ensure proper viewing behavior
    const contentType = getMimeTypeFromFileName(fileName);
    
    // Create blob with explicit MIME type for inline viewing
    const blob = new Blob([response.data], { type: contentType });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Failed to fetch private document:', fileName, error);
    throw error;
  }
};

/**
 * Get MIME type from file extension
 */
const getMimeTypeFromFileName = (fileName: string): string => {
  const extension = fileName.toLowerCase().split('.').pop();
  
  switch (extension) {
    case 'pdf':
      return 'application/pdf';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'bmp':
      return 'image/bmp';
    case 'svg':
      return 'image/svg+xml';
    case 'doc':
      return 'application/msword';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'xls':
      return 'application/vnd.ms-excel';
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'ppt':
      return 'application/vnd.ms-powerpoint';
    case 'pptx':
      return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    case 'txt':
      return 'text/plain';
    default:
      return 'application/octet-stream';
  }
};
