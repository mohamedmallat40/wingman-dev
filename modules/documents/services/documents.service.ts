import { type AxiosRequestConfig } from 'axios';

import { API_ROUTES } from '@/lib/api-routes';
import wingManApi from '@/lib/axios';

export const getMyDocuments = async (config?: AxiosRequestConfig) => {
  return wingManApi.get(API_ROUTES.documents.personal, config);
};

export const shareDocument = async (
  documentId: string,
  data: { users: string[]; message?: string; notifyUsers: boolean },
  config?: AxiosRequestConfig
) => {
  return wingManApi.post(`${API_ROUTES.documents.share}/${documentId}/share`, data, config);
};

export const getNetworkUsers = async (page = 1, limit = 8, config?: AxiosRequestConfig) => {
  return wingManApi.get(API_ROUTES.network.myNetwork, {
    ...config,
    params: {
      kind: 'AGENCY',
      page,
      limit,
      ...config?.params
    }
  });
};

export const uploadDocument = async (formData: FormData, config?: AxiosRequestConfig) => {
  return wingManApi.post('/documents', formData);
};

export const updateDocument = async (
  documentId: string,
  formData: FormData,
  config?: AxiosRequestConfig
) => {
  return wingManApi.patch(`/documents/${documentId}`, formData, {
    ...config
  });
};

export const getDocumentById = async (documentId: string, config?: AxiosRequestConfig) => {
  return wingManApi.get(`${API_ROUTES.documents.personal}/${documentId}`, config);
};

export const deleteDocument = async (documentId: string, config?: AxiosRequestConfig) => {
  return wingManApi.delete(`${API_ROUTES.documents.delete}/${documentId}`, config);
};
