'use-client'
import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig
} from 'axios';

import { addToast } from '@heroui/toast';
import axios from 'axios';
import { ERRORS as en } from 'messages/en.json';
import { ERRORS as fr } from 'messages/fr.json';
import { ERRORS as nl } from 'messages/nl.json';

import { env } from '@/env';
import { getUserLocale } from '@/i18n/locale';

// ===== TYPES =====
type SupportedLocale = 'en' | 'fr' | 'nl';
type ErrorMessages = Record<string, string>;
type ApiErrorResponse = {
  status?: string | number;
  message?: string;
  code?: string;
  details?: Record<string, unknown>;
  statusCode?: number;
};

// ===== CONSTANTS =====
const LOCALIZED_ERRORS: Record<SupportedLocale, ErrorMessages> = {
  en,
  fr,
  nl
};

const DEFAULT_CONFIG: CreateAxiosDefaults = {
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// ===== UTILITIES =====
const translateError = (key: string, locale: SupportedLocale): string => {
  return LOCALIZED_ERRORS[locale][key] ?? key;
};

const getStoredToken = (): string | null => {
  //   if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

const extractErrorData = (error: AxiosError): ApiErrorResponse => {

  const data = error.response?.data as ApiErrorResponse | undefined; 
  if(data?.statusCode === 403) {
    window.location.href = '/';
    localStorage.removeItem('token');
    return { status: 'Unauthorized', message: 'Please log in again.' };
  }
  return {
    status: data?.status ?? data?.statusCode ?? 'Error',
    message: data?.message ?? 'unknown_error',
    code: data?.code,
    details: data?.details
  };
};

const showErrorToast = async (errorData: ApiErrorResponse): Promise<void> => {
  const locale ="en"

  addToast({
    title: errorData.status,
    description: translateError(errorData.message ?? '', locale),
    color: 'danger'
  });
};

// ===== REQUEST INTERCEPTOR =====
const attachAuthToken = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = getStoredToken();

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
};

// ===== RESPONSE INTERCEPTOR =====
const handleSuccessResponse = (response: AxiosResponse): AxiosResponse => response;

const handleErrorResponse = async (error: AxiosError): Promise<never> => {
  if(typeof window !== 'undefined'){

  const errorData = extractErrorData(error);
  await showErrorToast(errorData);
  }
  throw error;
};

// ===== API INSTANCE =====
const createWingManApi = (): AxiosInstance => {
  const instance = axios.create(DEFAULT_CONFIG);

  // Request interceptor
  if(typeof window !== 'undefined'){
  instance.interceptors.request.use(attachAuthToken, () =>
    Promise.reject(new Error('Request error'))
  );
}

  // Response interceptor
  instance.interceptors.response.use(handleSuccessResponse, handleErrorResponse);

  return instance;
};

// ===== EXPORTS =====
export const wingManApi = createWingManApi();
export default wingManApi;

// Type exports for consumers
export type { ApiErrorResponse, SupportedLocale };
