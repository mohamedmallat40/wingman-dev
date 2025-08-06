import { type AxiosRequestConfig } from 'axios';

import { API_ROUTES } from '@/lib/api-routes';
import wingManApi from '@/lib/axios';

export const getMyDocuments = async (config?: AxiosRequestConfig) => {
  return wingManApi.get(API_ROUTES.documents.personal, config);
};
