import type {
  EducationFormData,
  ExperienceFormData,
  GeneralInfoFormData,
  LanguagesFormData,
  ProjectsFormData,
  ServicesFormData
} from '@root/modules/settings/schema/settings.schema';

import { type AxiosRequestConfig } from 'axios';

import { API_ROUTES } from '@/lib/api-routes';
import wingManApi from '@/lib/axios';

// General Info
export const updateGeneralInfo = async (data: GeneralInfoFormData, config?: AxiosRequestConfig) => {
  return wingManApi.patch(API_ROUTES.profile.me, data, config);
};

// Languages
export const updateLanguages = async (data: LanguagesFormData, config?: AxiosRequestConfig) => {
  return wingManApi.patch(API_ROUTES.profile.languages, data, config);
};

// Experience
export const updateExperience = async (data: ExperienceFormData, config?: AxiosRequestConfig) => {
  return wingManApi.patch(API_ROUTES.profile.experience, data, config);
};

// Projects
export const updateProjects = async (data: ProjectsFormData, config?: AxiosRequestConfig) => {
  return wingManApi.patch(API_ROUTES.profile.experience, data, config);
};

// Education
export const addEducation = async (data: EducationFormData, config?: AxiosRequestConfig) => {
  return wingManApi.post(API_ROUTES.profile.education, data, config);
};

export const deleteEducation = async (id: string, config?: AxiosRequestConfig) => {
  return wingManApi.delete(`${API_ROUTES.profile.education}/${id}`, config);
};

// Services
export const updateServices = async (data: ServicesFormData, config?: AxiosRequestConfig) => {
  return wingManApi.patch(API_ROUTES.profile.services, data, config);
};
