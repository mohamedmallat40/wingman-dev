import type {
  EducationFormData,
  GeneralInfoFormData,
  LanguagesFormData,
  ProjectsFormData,
  ServicesFormData,
  SkillsFormData
} from '@root/modules/settings/schema/settings.schema';

import { addToast } from '@heroui/react';
import { useMutation } from '@tanstack/react-query';

import {
  deleteEducationMutationOptions,
  educationMutationOptions,
  experienceMutationOptions,
  generalInfoMutationOptions,
  languagesMutationOptions,
  servicesMutationOptions,
  skillsMutationOptions
} from './settings.server';

// Helper function to invalidate related queries and show success toast
const handleSuccess = (message: string) => {
  addToast({
    title: 'Success',
    description: message,
    color: 'success',
    timeout: 3000
  });
};
const handleError = (error: any, defaultMessage: string) => {
  const errorMessage = error?.response?.data?.message || defaultMessage;
  addToast({
    title: 'Error',
    description: `Successfully logged in with ${errorMessage}!`,
    color: 'danger',
    timeout: 3000
  });
  console.error(error);
};
const useSettings = (userId?: string) => {

  // Helper function to show error toast

  // General Info Mutation
  const updateGeneralInfoMutation = useMutation({
    ...generalInfoMutationOptions,
    onSuccess: () => {
      handleSuccess('Profile updated successfully!');
    },
    onError: (error) => {
      handleError(error, 'Failed to update profile information');
    }
  });

  // Skills Mutation
  const updateSkillsMutation = useMutation({
    ...skillsMutationOptions,
    onSuccess: () => {
      handleSuccess('Skills updated successfully!');
    },
    onError: (error) => {
      handleError(error, 'Failed to update skills');
    }
  });

  // Languages Mutation
  const updateLanguagesMutation = useMutation({
    ...languagesMutationOptions,
    onSuccess: () => {
      handleSuccess('Languages updated successfully!');
    },
    onError: (error) => {
      handleError(error, 'Failed to update languages');
    }
  });

  // Experience Mutation
  const updateExperienceMutation = useMutation({
    ...experienceMutationOptions,
    onSuccess: () => {
      handleSuccess('Experience updated successfully!');
    },
    onError: (error) => {
      handleError(error, 'Failed to update experience');
    }
  });

  // Projects Mutation
  const updateProjectsMutation = useMutation({
    ...experienceMutationOptions,
    onSuccess: () => {
      handleSuccess('Projects updated successfully!');
    },
    onError: (error) => {
      handleError(error, 'Failed to update projects');
    }
  });

  // create education mutation
  const createEducationMutation = useMutation({
    ...educationMutationOptions,
    onSuccess: () => {
      handleSuccess('Education created successfully!');
    },
    onError: (error) => {
      handleError(error, 'Failed to create education');
    }
  });

  // Delete education mutation
  const deleteEducationMutation = useMutation({
    ...deleteEducationMutationOptions,
    onSuccess: () => {
      handleSuccess('Education deleted successfully!');
    },
    onError: (error) => {
      handleError(error, 'Failed to delete education');
    }
  });

  const deleteEducation = (id: string) => {
    deleteEducationMutation.mutate(id);
  };

  // Services Mutation
  const updateServicesMutation = useMutation({
    ...servicesMutationOptions,
    onSuccess: () => {
      handleSuccess('Services updated successfully!');
    },
    onError: (error) => {
      handleError(error, 'Failed to update services');
    }
  });

  // Wrapper functions for easier usage
  const updateGeneralInfo = (data: GeneralInfoFormData) => {
    updateGeneralInfoMutation.mutate(data);
  };

  const updateSkills = (data: SkillsFormData) => {
    updateSkillsMutation.mutate(data);
  };

  const updateLanguages = (data: LanguagesFormData) => {
    updateLanguagesMutation.mutate(data);
  };

  const updateExperience = (data: ProjectsFormData) => {
    updateExperienceMutation.mutate(data);
  };

  const updateProjects = (data: ProjectsFormData) => {
    updateProjectsMutation.mutate(data);
  };

  const createEducation = (data: EducationFormData) => {
    createEducationMutation.mutate(data);
  };

  const updateServices = (data: ServicesFormData) => {
    updateServicesMutation.mutate(data);
  };

  return {
    // Update functions
    updateGeneralInfo,
    updateSkills,
    updateLanguages,
    updateExperience,
    updateProjects,
    createEducation,
    deleteEducation,
    updateServices,

    // Loading states
    isUpdatingGeneralInfo: updateGeneralInfoMutation.isPending,
    isUpdatingSkills: updateSkillsMutation.isPending,
    isUpdatingLanguages: updateLanguagesMutation.isPending,
    isUpdatingExperience: updateExperienceMutation.isPending,
    isUpdatingProjects: updateProjectsMutation.isPending,
    isUpdatingEducation: createEducationMutation.isPending,
    isUpdatingServices: updateServicesMutation.isPending,
    isDeletingEducation: deleteEducationMutation.isPending,
    // Error states
    generalInfoError: updateGeneralInfoMutation.error,
    skillsError: updateSkillsMutation.error,
    languagesError: updateLanguagesMutation.error,
    experienceError: updateExperienceMutation.error,
    projectsError: updateProjectsMutation.error,
    educationError: createEducationMutation.error,
    servicesError: updateServicesMutation.error,

    // Reset functions
    resetGeneralInfo: updateGeneralInfoMutation.reset,
    resetSkills: updateSkillsMutation.reset,
    resetLanguages: updateLanguagesMutation.reset,
    resetExperience: updateExperienceMutation.reset,
    resetProjects: updateProjectsMutation.reset,
    resetEducation: createEducationMutation.reset,
    resetServices: updateServicesMutation.reset
  };
};

export default useSettings;
