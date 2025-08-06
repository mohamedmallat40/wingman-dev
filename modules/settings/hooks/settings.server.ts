import type {
  EducationFormData,
  GeneralInfoFormData,
  LanguagesFormData,
  ProjectsExpFormData,
  serviceItemFormData,
  ServicesFormData,
  SkillsFormData
} from '@root/modules/settings/schema/settings.schema';

import {
  addEducation,
  createExperience,
  createLanguage,
  createProject,
  createService,
  deleteEducation,
  deleteExperience,
  deleteLanguage,
  deleteProject,
  deleteService,
  getAllSkills,
  updateAddress,
  updateEducation,
  updateExperience,
  updateGeneralInfo,
  updateLanguages,
  updateProjects,
  updateServices
} from '../services/settings.services';
import { queryOptions } from '@tanstack/react-query';
import { Skill } from '@root/modules/profile/types';
import { AddressDetails } from '@/lib/types/auth';

// General Info mutations
export const generalInfoMutationOptions = {
  mutationKey: ['settings', 'general-info'],
  mutationFn: (data: GeneralInfoFormData) => updateGeneralInfo(data)
};

export const skillsMutationOptions = {
  mutationKey: ['settings', 'skills'],
  mutationFn: (data: SkillsFormData) => updateGeneralInfo(data)
};

// Language mutations
export const createLanguageMutationOptions = {
  mutationKey: ['settings', 'languages', 'create'],
  mutationFn: (data: LanguagesFormData) => createLanguage(data)
};

export const languagesMutationOptions = {
  mutationKey: ['settings', 'languages'],
  mutationFn: (data: LanguagesFormData) => updateLanguages(data)
};

export const deleteLanguageMutationOptions = {
  mutationKey: ['settings', 'languages', 'delete'],
  mutationFn: (id: string) => deleteLanguage(id)
};

// Experience mutations
export const createExperienceMutationOptions = {
  mutationKey: ['settings', 'experience', 'create'],
  mutationFn: (data: ProjectsExpFormData) => createExperience(data)
};

export const experienceMutationOptions = {
  mutationKey: ['settings', 'experience'],
  mutationFn: (data: ProjectsExpFormData) => updateExperience(data)
};

export const deleteExperienceMutationOptions = {
  mutationKey: ['settings', 'experience', 'delete'],
  mutationFn: (id: string) => deleteExperience(id)
};

// Project mutations
export const createProjectMutationOptions = {
  mutationKey: ['settings', 'projects', 'create'],
  mutationFn: (data: ProjectsExpFormData) => createProject(data)
};

export const projectsMutationOptions = {
  mutationKey: ['settings', 'projects'],
  mutationFn: (data: ProjectsExpFormData) => updateProjects(data)
};

export const deleteProjectMutationOptions = {
  mutationKey: ['settings', 'projects', 'delete'],
  mutationFn: (id: string) => deleteProject(id)
};

// Education mutations
export const educationMutationOptions = {
  mutationKey: ['settings', 'educations'],
  mutationFn: (data: EducationFormData) => addEducation(data)
};
export const updateEducationMutationOptions = {
  mutationKey: ['settings', 'educations'],
  mutationFn: (data: EducationFormData) => updateEducation(data)
};

export const deleteEducationMutationOptions = {
  mutationKey: ['settings', 'education', 'delete'],
  mutationFn: (id: string) => deleteEducation(id)
};

// Service mutations
export const createServiceMutationOptions = {
  mutationKey: ['settings', 'services', 'create'],
  mutationFn: (data: serviceItemFormData) => createService(data)
};

export const servicesMutationOptions = {
  mutationKey: ['settings', 'services'],
  mutationFn: (data: ServicesFormData) => updateServices(data)
};

export const deleteServiceMutationOptions = {
  mutationKey: ['settings', 'services', 'delete'],
  mutationFn: (id: string) => deleteService(id)
};

export const updateAddressMutationOptions = {
  mutationKey: ['settings', 'address'],
  mutationFn: (data: AddressDetails) => updateAddress(data)
};

export const skillsOptions = () => {
  return queryOptions({
    queryKey: ['all-skills'],
    queryFn: async (): Promise<{ data: Skill[] }> => {
      try {
        return await getAllSkills();
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  });
};
