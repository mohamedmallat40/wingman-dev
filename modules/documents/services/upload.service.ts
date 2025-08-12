import { type AxiosRequestConfig } from 'axios';

import { API_ROUTES } from '@/lib/api-routes';
import wingManApi from '@/lib/axios';

export interface UploadResponse {
  filename: string;
  originalname: string;
  buffer: string;
}

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  return await wingManApi.post<UploadResponse>(API_ROUTES.upload.single, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
