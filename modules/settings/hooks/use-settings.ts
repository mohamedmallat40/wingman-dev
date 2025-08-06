import type {
  EducationFormData,
  GeneralInfoFormData,
  LanguagesFormData,
  ProjectsExpFormData,
  serviceItemFormData,
  ServicesFormData,
  SkillsFormData
} from '@root/modules/settings/schema/settings.schema';

import { addToast } from '@heroui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createExperienceMutationOptions,
  createLanguageMutationOptions,
  createProjectMutationOptions,
  createServiceMutationOptions,
  deleteEducationMutationOptions,
  deleteExperienceMutationOptions,
  deleteLanguageMutationOptions,
  deleteProjectMutationOptions,
  deleteServiceMutationOptions,
  educationMutationOptions,
  experienceMutationOptions,
  generalInfoMutationOptions,
  languagesMutationOptions,
  projectsMutationOptions,
  servicesMutationOptions,
  skillsMutationOptions,
  skillsOptions,
  updateEducationMutationOptions
} from './settings.server';

const handleSuccess = (message: string) => {
  addToast({
    title: 'Success',
    description: message,
    color: 'success',
    timeout: 3000
  });
};

const handleError = (error: any, defaultMessage: string) => {
  const errorMessage = error?.response?.data?.message ?? defaultMessage;
  addToast({
    title: 'Error',
    description: errorMessage,
    color: 'danger',
    timeout: 3000
  });
  console.error(error);
};

const useSettings = (userId?: string) => {
  const queryClient = useQueryClient();
  // General Info Mutations
  const updateGeneralInfoMutation = useMutation({
    ...generalInfoMutationOptions,
    onSuccess: () => {
      handleSuccess('Profile updated successfully!');
    },
    onError: (error) => {
      handleError(error, 'Failed to update profile information');
    }
  });

  const updateSkillsMutation = useMutation({
    ...skillsMutationOptions,
    onSuccess: () => {
      handleSuccess('Skills updated successfully!');
    },
    onError: (error) => {
      handleError(error, 'Failed to update skills');
    }
  });

  // Language Mutations
  const createLanguageMutation = useMutation({
    ...createLanguageMutationOptions,
    onSuccess: () => {
      handleSuccess('Language created successfully!');
    },
    onError: (error) => {
      handleError(error, 'Failed to create language');
    }
  });

  const updateLanguagesMutation = useMutation({
    ...languagesMutationOptions,
    onSuccess: () => {
      handleSuccess('Languages updated successfully!');
    },
    onError: (error) => {
      handleError(error, 'Failed to update languages');
    }
  });

  const deleteLanguageMutation = useMutation({
    ...deleteLanguageMutationOptions,
    onSuccess: () => {
      handleSuccess('Language deleted successfully!');
    },
    onError: (error) => {
      handleError(error, 'Failed to delete language');
    }
  });

  const createExperienceMutation = useMutation({
    ...createExperienceMutationOptions,
    onSuccess: async (data) => {
      console.log(data);
      handleSuccess('Experience created successfully!');
      await queryClient.invalidateQueries({
        queryKey: ['experiences', userId]
      });
    },
    onError: (error) => {
      handleError(error, 'Failed to create experience');
    }
  });

  const updateExperienceMutation = useMutation({
    ...experienceMutationOptions,
    onSuccess: async () => {
      handleSuccess('Experience updated successfully!');
      await queryClient.invalidateQueries({
        queryKey: ['experiences', userId]
      });
    },
    onError: (error) => {
      handleError(error, 'Failed to update experience');
    }
  });

  const deleteExperienceMutation = useMutation({
    ...deleteExperienceMutationOptions,
    onSuccess: async () => {
      handleSuccess('Experience deleted successfully!');
      await queryClient.invalidateQueries({
        queryKey: ['experiences', userId]
      });
    },
    onError: (error) => {
      handleError(error, 'Failed to delete experience');
    }
  });

  // Project Mutations
  const createProjectMutation = useMutation({
    ...createProjectMutationOptions,
    onSuccess: async () => {
      handleSuccess('Project created successfully!');
      await queryClient.invalidateQueries({
        queryKey: ['experiences', userId]
      });
    },
    onError: (error) => {
      handleError(error, 'Failed to create project');
    }
  });

  const updateProjectsMutation = useMutation({
    ...projectsMutationOptions,
    onSuccess: async () => {
      handleSuccess('Projects updated successfully!');
      await queryClient.invalidateQueries({
        queryKey: ['experiences', userId]
      });
    },
    onError: (error) => {
      handleError(error, 'Failed to update projects');
    }
  });

  const deleteProjectMutation = useMutation({
    ...deleteProjectMutationOptions,
    onSuccess: async () => {
      handleSuccess('Project deleted successfully!');
      await queryClient.invalidateQueries({
        queryKey: ['experiences', userId]
      });
    },
    onError: (error) => {
      handleError(error, 'Failed to delete project');
    }
  });

  // Education Mutations
  const createEducationMutation = useMutation({
    ...educationMutationOptions,
    onSuccess: async () => {
      console.log('success');
      handleSuccess('Education created successfully!');
      await queryClient.invalidateQueries({
        queryKey: ['educations', userId]
      });
    },
    onError: (error) => {
      handleError(error, 'Failed to create education');
    }
  });

  const updateEducationMutation = useMutation({
    ...updateEducationMutationOptions,
    onSuccess: async () => {
      console.log('success');
      handleSuccess('Education updated successfully!');
      await queryClient.invalidateQueries({
        queryKey: ['educations', userId]
      });
    },
    onError: (error) => {
      handleError(error, 'Failed to updated education');
    }
  });

  const deleteEducationMutation = useMutation({
    ...deleteEducationMutationOptions,
    onSuccess: async () => {
      console.log('success');
      handleSuccess('Education deleted successfully!');
      await queryClient.invalidateQueries({
        queryKey: ['educations', userId]
      });
    },
    onError: (error) => {
      handleError(error, 'Failed to delete education');
    }
  });

  // Service Mutations
  const createServiceMutation = useMutation({
    ...createServiceMutationOptions,
    onSuccess: async () => {
      console.log('success');
      handleSuccess('Service created successfully!');
      await queryClient.invalidateQueries({
        queryKey: ['services', userId]
      });
    },
    onError: (error) => {
      console.log('error');
      handleError(error, 'Failed to create service');
    }
  });

  const updateServicesMutation = useMutation({
    ...servicesMutationOptions,
    onSuccess: () => {
      handleSuccess('Services updated successfully!');
    },
    onError: (error) => {
      handleError(error, 'Failed to update services');
    }
  });

  const deleteServiceMutation = useMutation({
    ...deleteServiceMutationOptions,
    onSuccess: () => {
      handleSuccess('Service deleted successfully!');
    },
    onError: (error) => {
      handleError(error, 'Failed to delete service');
    }
  });

  // Wrapper functions
  const updateGeneralInfo = (data: GeneralInfoFormData) => {
    updateGeneralInfoMutation.mutate(data);
  };
  const updateSkills = (data: SkillsFormData) => {
    updateSkillsMutation.mutate(data);
  };

  const createLanguage = (data: LanguagesFormData) => {
    createLanguageMutation.mutate(data);
  };
  const updateLanguages = (data: LanguagesFormData) => {
    updateLanguagesMutation.mutate(data);
  };
  const deleteLanguage = (id: string) => {
    deleteLanguageMutation.mutate(id);
  };

  const createExperience = (data: ProjectsExpFormData) => {
    createExperienceMutation.mutate(data);
  };
  const updateExperience = (data: ProjectsExpFormData) => {
    updateExperienceMutation.mutate(data);
  };
  const deleteExperience = (id: string) => {
    deleteExperienceMutation.mutate(id);
  };

  const createProject = (data: ProjectsExpFormData) => {
    createProjectMutation.mutate(data);
  };
  const updateProjects = (data: ProjectsExpFormData) => {
    updateProjectsMutation.mutate(data);
  };
  const deleteProject = (id: string) => {
    deleteProjectMutation.mutate(id);
  };

  const createEducation = (data: EducationFormData) => {
    createEducationMutation.mutate(data);
  };

  const updateEducation = (data: EducationFormData) => {
    updateEducationMutation.mutate(data);
  };
  const deleteEducation = (id: string) => {
    deleteEducationMutation.mutate(id);
  };

  const createService = (data: serviceItemFormData) => {
    console.log(data);
    createServiceMutation.mutate(data);
  };
  const updateServices = (data: ServicesFormData) => {
    updateServicesMutation.mutate(data);
  };
  const deleteService = (id: string) => {
    deleteServiceMutation.mutate(id);
  };
  const useAllSkills = useQuery({
    ...skillsOptions()
  });

  return {
    // Create functions
    createLanguage,
    createExperience,
    createProject,
    createEducation,
    updateEducation,
    createService,
    useAllSkills,

    // Update functions
    updateGeneralInfo,
    updateSkills,
    updateLanguages,
    updateExperience,
    updateProjects,
    updateServices,

    // Delete functions
    deleteLanguage,
    deleteExperience,
    deleteProject,
    deleteEducation,
    deleteService,

    // Loading states
    isCreatingLanguage: createLanguageMutation.isPending,
    isUpdatingLanguages: updateLanguagesMutation.isPending,
    isDeletingLanguage: deleteLanguageMutation.isPending,

    isCreatingExperience: createExperienceMutation.isPending,
    isUpdatingExperience: updateExperienceMutation.isPending,
    isDeletingExperience: deleteExperienceMutation.isPending,

    isCreatingProject: createProjectMutation.isPending,
    isUpdatingProjects: updateProjectsMutation.isPending,
    isDeletingProject: deleteProjectMutation.isPending,

    isUpdatingEducation: createEducationMutation.isPending,
    isDeletingEducation: deleteEducationMutation.isPending,

    isCreatingService: createServiceMutation.isPending,
    isUpdatingServices: updateServicesMutation.isPending,
    isDeletingService: deleteServiceMutation.isPending,

    isUpdatingGeneralInfo: updateGeneralInfoMutation.isPending,
    isUpdatingSkills: updateSkillsMutation.isPending
  };
};

export default useSettings;
