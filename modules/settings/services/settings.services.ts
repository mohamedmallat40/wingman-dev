import type {
  EducationFormData,
  GeneralInfoFormData,
  LanguagesFormData,
  ProjectsExpFormData,
  serviceItemFormData
} from '@root/modules/settings/schema/settings.schema';

import { type AxiosRequestConfig } from 'axios';

import { API_ROUTES } from '@/lib/api-routes';
import wingManApi from '@/lib/axios';

// General Info
export const updateGeneralInfo = async (data: GeneralInfoFormData, config?: AxiosRequestConfig) => {
  return wingManApi.patch(API_ROUTES.profile.me, data, config);
};

// Languages
export const createLanguage = async (data: LanguagesFormData, config?: AxiosRequestConfig) => {
  return wingManApi.post(API_ROUTES.profile.languages, data, config);
};

export const updateLanguages = async (data: LanguagesFormData, config?: AxiosRequestConfig) => {
  return wingManApi.patch(API_ROUTES.profile.languages, data, config);
};

export const deleteLanguage = async (id: string, config?: AxiosRequestConfig) => {
  return wingManApi.delete(`${API_ROUTES.profile.languages}/${id}`, config);
};

// Experience
export const createExperience = async (data: ProjectsExpFormData, config?: AxiosRequestConfig) => {
  return wingManApi.post(API_ROUTES.profile.experience, data, config);
};

export const updateExperience = async (data: ProjectsExpFormData, config?: AxiosRequestConfig) => {
  return wingManApi.patch(`${API_ROUTES.profile.experience}/${data.id}`, data, config);
};

export const deleteExperience = async (id: string, config?: AxiosRequestConfig) => {
  return wingManApi.delete(`${API_ROUTES.profile.experience}/${id}`, config);
};

// Projects (using same endpoints as experience with different data structure)
export const createProject = async (data: ProjectsExpFormData, config?: AxiosRequestConfig) => {
  return wingManApi.post(API_ROUTES.profile.experience, data, config);
};

export const updateProjects = async (data: ProjectsExpFormData, config?: AxiosRequestConfig) => {
  return wingManApi.patch(API_ROUTES.profile.experience, data, config);
};

export const deleteProject = async (id: string, config?: AxiosRequestConfig) => {
  return wingManApi.delete(`${API_ROUTES.profile.experience}/${id}`, config);
};

// Education
export const addEducation = async (data: EducationFormData, config?: AxiosRequestConfig) => {
  return wingManApi.post(API_ROUTES.profile.education, data, config);
};

export const updateEducation = async (data: EducationFormData, config?: AxiosRequestConfig) => {
  return wingManApi.patch(`${API_ROUTES.profile.education}/${data.id}`, data, config);
};

export const deleteEducation = async (id: string, config?: AxiosRequestConfig) => {
  return wingManApi.delete(`${API_ROUTES.profile.education}/${id}`, config);
};

// Services
export const createService = async (data: serviceItemFormData, config?: AxiosRequestConfig) => {
  return wingManApi.post(API_ROUTES.profile.services, data, config);
};

export const updateServices = async (data: serviceItemFormData, config?: AxiosRequestConfig) => {
  return wingManApi.patch(`${API_ROUTES.profile.services}/${data.id}`, data, config);
};

export const deleteService = async (id: string, config?: AxiosRequestConfig) => {
  return wingManApi.delete(`${API_ROUTES.profile.services}/${id}`, config);
};
export const getAllSkills = (config?: AxiosRequestConfig) => {
  return wingManApi.get(API_ROUTES.profile.skills, config);
};
