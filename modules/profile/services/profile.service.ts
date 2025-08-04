import { type AxiosRequestConfig } from 'axios';

import { API_ROUTES } from '@/lib/api-routes';
import wingManApi from '@/lib/axios';

export const getMyProfile = async (config?: AxiosRequestConfig) => {
  return wingManApi.get(API_ROUTES.profile.me, config);
};

export const getUserExperience = async (userId: string, config?: AxiosRequestConfig) => {
  return wingManApi.get(`${API_ROUTES.profile.experience}${userId}`, config);
};

export const getUserEducation = async (userId: string, config?: AxiosRequestConfig) => {
  return wingManApi.get(`${API_ROUTES.profile.educationByUser}${userId}`, config);
};

export const getUserService = async (userId: string, config?: AxiosRequestConfig) => {
  return wingManApi.get(`${API_ROUTES.profile.services}${userId}`, config);
};

export const getUserLanguages = async (userId: string, config?: AxiosRequestConfig) => {
  return wingManApi.get(`${API_ROUTES.profile.languages}${userId}`, config);
};

export const getUserReviews = async (userId: string, config?: AxiosRequestConfig) => {
  return wingManApi.get(`${API_ROUTES.profile.reviews}${userId}/active`, config);
};
