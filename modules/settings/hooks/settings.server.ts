import type {
  EducationFormData,
  ExperienceFormData,
  GeneralInfoFormData,
  LanguagesFormData,
  ProjectsFormData,
  ServicesFormData,
  SkillsFormData
} from '@root/modules/settings/schema/settings.schema';

import {
  addEducation,
  deleteEducation,
  updateExperience,
  updateGeneralInfo,
  updateLanguages,
  updateProjects,
  updateServices
} from '../services/settings.services';

// Mutation options for each settings section
export const generalInfoMutationOptions = {
  mutationKey: ['settings', 'general-info'],
  mutationFn: (data: GeneralInfoFormData) => updateGeneralInfo(data)
};

export const skillsMutationOptions = {
  mutationKey: ['settings', 'skills'],
  mutationFn: (data: SkillsFormData) => updateSkills(data)
};

export const languagesMutationOptions = {
  mutationKey: ['settings', 'languages'],
  mutationFn: (data: LanguagesFormData) => updateLanguages(data)
};

export const experienceMutationOptions = {
  mutationKey: ['settings', 'experience'],
  mutationFn: (data: ExperienceFormData) => updateExperience(data)
};

export const projectsMutationOptions = {
  mutationKey: ['settings', 'projects'],
  mutationFn: (data: ProjectsFormData) => updateProjects(data)
};

export const educationMutationOptions = {
  mutationKey: ['settings', 'education'],
  mutationFn: (data: EducationFormData) => addEducation(data)
};

export const deleteEducationMutationOptions = {
  mutationKey: ['settings', 'education'],
  mutationFn: (id: string) => deleteEducation(id)
};

export const servicesMutationOptions = {
  mutationKey: ['settings', 'services'],
  mutationFn: (data: ServicesFormData) => updateServices(data)
};
