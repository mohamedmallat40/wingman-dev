'use client';

import { useState } from 'react';

import type { IExperience } from '@root/modules/profile/types.ts';
import type { ProjectsExpFormData } from '@root/modules/settings/schema/settings.schema';

import { Button, Card, CardBody, CardHeader, Input, Textarea } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { type IUserProfile } from '@root/modules/profile/types';
import useSettings from '@root/modules/settings/hooks/use-settings';
import { projectsExpSchema } from '@root/modules/settings/schema/settings.schema';
import { Edit, Plus, Save, Trash2, X } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';

interface ProjectsTabProperties {
  user: IUserProfile;
  projects: IExperience[];
}

export default function ProjectsTab({ user, projects }: Readonly<ProjectsTabProperties>) {
  const [isLoading, setIsLoading] = useState(false);
  const [updatingProjectId, setUpdatingProjectId] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [originalProjectData, setOriginalProjectData] = useState<any>(null);
  const {
    createProject,
    updateExperience,
    deleteProject,
    isDeletingProject,
    isUpdatingExperience
  } = useSettings();

  const form = useForm<ProjectsExpFormData>({
    resolver: zodResolver(projectsExpSchema),
    defaultValues: {
      items: projects
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items'
  });

  // Check if there are unsaved new projects
  const hasUnsavedNewProjects = () => {
    const formData = form.watch();
    const newProjects = formData.items.filter((item) => item.id?.startsWith('temp_'));

    if (newProjects.length === 0) return false;

    return newProjects.every(
      (project) =>
        project.title?.trim() &&
        project.company.trim() &&
        project.startDate.trim() &&
        project.description.trim()
    );
  };

  // Check if form is valid for new projects
  const isFormValidForNewProjects = () => {
    const formData = form.watch();
    const newProjects = formData.items?.filter((item) => item.id?.startsWith('temp_'));

    if (newProjects.length === 0) return false;

    return newProjects.every(
      (project) =>
        project.title?.trim() &&
        project.company.trim() &&
        project.startDate.trim() &&
        project.description.trim()
    );
  };

  // Check if project has been modified
  const hasProjectChanged = (fieldIndex: number) => {
    if (!originalProjectData) return false;
    const currentData = form.watch(`items.${fieldIndex}`);

    if (!originalProjectData) return false;

    return (
      currentData.title !== originalProjectData?.title ||
      currentData.company !== originalProjectData?.company ||
      currentData.startDate !== originalProjectData.startDate ||
      currentData.endDate !== originalProjectData.endDate ||
      currentData.description !== originalProjectData.description ||
      currentData.link !== originalProjectData.link ||
      currentData.videoUrl !== originalProjectData.videoUrl ||
      currentData.image !== originalProjectData.image
    );
  };

  // Get only the changed fields for update
  const getChangedFields = (fieldIndex: number) => {
    if (!originalProjectData) return {};
    const currentData = form.watch(`items.${fieldIndex}`);
    const changes: any = { id: currentData.id };

    if (currentData.title !== originalProjectData.title) {
      changes.title = currentData.title;
    }
    if (currentData.company !== originalProjectData.company) {
      changes.company = currentData.company;
    }
    if (currentData.startDate !== originalProjectData.startDate) {
      changes.startDate = currentData.startDate;
    }
    if (currentData.endDate !== originalProjectData.endDate) {
      changes.endDate = currentData.endDate;
    }
    if (currentData.description !== originalProjectData.description) {
      changes.description = currentData.description;
    }
    if (currentData.link !== originalProjectData.link) {
      changes.link = currentData.link;
    }
    if (currentData.videoUrl !== originalProjectData.videoUrl) {
      changes.videoUrl = currentData.videoUrl;
    }
    if (currentData.image !== originalProjectData.image) {
      changes.image = currentData.image;
    }

    return changes;
  };

  const getProjectId = (fieldIndex: number) => {
    return form.getValues(`items.${fieldIndex}.id`);
  };

  const isFieldEditable = (fieldIndex: number) => {
    const projectId = getProjectId(fieldIndex);
    return projectId?.startsWith('temp_') || editingProjectId === projectId;
  };

  const handleEditProject = (fieldIndex: number) => {
    const projectData = form.getValues(`items.${fieldIndex}`);
    setEditingProjectId(projectData.id || '');
    setOriginalProjectData(structuredClone(projectData));
  };

  const handleCancelEdit = () => {
    if (originalProjectData && editingProjectId) {
      const fieldIndex = fields.findIndex((f, index) => {
        const projId = getProjectId(index);
        return projId === editingProjectId;
      });
      if (fieldIndex !== -1) {
        form.setValue(`items.${fieldIndex}`, originalProjectData);
      }
    }
    setEditingProjectId(null);
    setOriginalProjectData(null);
  };

  const handleDeleteProject = (fieldIndex: number) => {
    const projectData = form.getValues(`items.${fieldIndex}`);
    const actualId = projectData.id;

    try {
      if (actualId && !actualId.startsWith('temp_')) {
        deleteProject(actualId);
      }
      remove(fieldIndex);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleUpdateSingleProject = async (fieldIndex: number) => {
    const projectId = getProjectId(fieldIndex);
    const changedFields = getChangedFields(fieldIndex);

    if (Object.keys(changedFields).length <= 1) {
      return;
    }

    setUpdatingProjectId(projectId ?? '');
    try {
      await updateExperience(changedFields);
      setEditingProjectId(null);
      setOriginalProjectData(null);
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setUpdatingProjectId(null);
    }
  };

  const onSubmit = async (data: ProjectsExpFormData) => {
    setIsLoading(true);
    try {
      const newProjects = data.items.filter((item) => item.id?.startsWith('temp_'));

      for (const newProject of newProjects) {
        const { id, ...projectData } = newProject;
        createProject(projectData);
      }
    } catch (error) {
      console.error('Error updating projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addNewProject = () => {
    append({
      id: `temp_${Date.now()}`,
      company: '',
      description: '',
      startDate: '',
      endDate: '',
      position: '',
      owner: '',
      title: '',
      link: '',
      image: '',
      screenShots: [],
      videoUrl: '',
      category: ''
    });
  };

  const onError = (errors: unknown) => {
    console.error('Form errors:', errors);
  };

  const shouldShowSaveButton = hasUnsavedNewProjects();
  const isSaveButtonEnabled = shouldShowSaveButton && isFormValidForNewProjects();

  return (
    <Card>
      <CardHeader>
        <h3 className='text-xl font-semibold'>Projects</h3>
      </CardHeader>
      <CardBody>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className='space-y-6'>
          <div className='space-y-4'>
            {fields.map((field, index) => {
              const projectId = getProjectId(index);
              const isEditable = isFieldEditable(index);

              return (
                <div
                  key={field.id}
                  className='space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700'
                >
                  <div className='flex items-center justify-between'>
                    <h4 className='font-medium'>Project {index + 1}</h4>
                    <div className='flex gap-2'>
                      {projectId && !projectId.startsWith('temp_') && (
                        <>
                          {editingProjectId === projectId ? (
                            <>
                              {hasProjectChanged(index) && (
                                <Button
                                  isIconOnly
                                  color='success'
                                  variant='light'
                                  size='sm'
                                  isLoading={updatingProjectId === projectId}
                                  onPress={() => handleUpdateSingleProject(index)}
                                  title='Save changes'
                                >
                                  <Save size={16} />
                                </Button>
                              )}
                              <Button
                                isIconOnly
                                color='default'
                                variant='light'
                                size='sm'
                                onPress={handleCancelEdit}
                                title='Cancel editing'
                              >
                                <X size={16} />
                              </Button>
                            </>
                          ) : (
                            <Button
                              isIconOnly
                              color='primary'
                              variant='light'
                              size='sm'
                              onPress={() => {
                                handleEditProject(index);
                              }}
                              title='Edit this project'
                            >
                              <Edit size={16} />
                            </Button>
                          )}
                        </>
                      )}
                      <Button
                        isIconOnly
                        color='danger'
                        variant='light'
                        size='sm'
                        isLoading={isDeletingProject}
                        onPress={() => {
                          handleDeleteProject(index);
                        }}
                        title='Delete this project permanently'
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <Input
                      {...form.register(`items.${index}.title`)}
                      label='Project Title *'
                      placeholder='E-commerce Platform'
                      errorMessage={form.formState.errors.items?.[index]?.title?.message}
                      isInvalid={!!form.formState.errors.items?.[index]?.title}
                      isDisabled={!isEditable}
                    />
                    <Input
                      {...form.register(`items.${index}.company`)}
                      label='Client/Company *'
                      placeholder='ABC Corporation'
                      errorMessage={form.formState.errors.items?.[index]?.company?.message}
                      isInvalid={!!form.formState.errors.items?.[index]?.company}
                      isDisabled={!isEditable}
                    />
                  </div>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <Input
                      {...form.register(`items.${index}.startDate`)}
                      type='date'
                      label='Start Date *'
                      errorMessage={form.formState.errors.items?.[index]?.startDate?.message}
                      isInvalid={!!form.formState.errors.items?.[index]?.startDate}
                      isDisabled={!isEditable}
                    />
                    <Input
                      {...form.register(`items.${index}.endDate`)}
                      type='date'
                      label='End Date (Optional)'
                      placeholder='Leave empty if ongoing'
                      isDisabled={!isEditable}
                    />
                  </div>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <Input
                      {...form.register(`items.${index}.link`)}
                      type='url'
                      label='Project Link'
                      placeholder='https://project-demo.com'
                      isDisabled={!isEditable}
                    />
                    <Input
                      {...form.register(`items.${index}.videoUrl`)}
                      type='url'
                      label='Video Demo URL'
                      placeholder='https://youtube.com/watch?v=...'
                      isDisabled={!isEditable}
                    />
                  </div>

                  <Input
                    {...form.register(`items.${index}.image`)}
                    type='text'
                    label='Project Image'
                    placeholder='https://example.com/project-image.jpg'
                    isDisabled={!isEditable}
                  />

                  <Textarea
                    {...form.register(`items.${index}.description`)}
                    label='Project Description *'
                    placeholder='Describe the project scope, technologies used, challenges faced, and your contributions...'
                    minRows={3}
                    errorMessage={form.formState.errors.items?.[index]?.description?.message}
                    isInvalid={!!form.formState.errors.items?.[index]?.description}
                    isDisabled={!isEditable}
                  />
                </div>
              );
            })}
          </div>

          <div className='flex gap-2'>
            <Button
              color='secondary'
              variant='flat'
              startContent={<Plus size={18} />}
              onPress={addNewProject}
            >
              Add Project
            </Button>
            {shouldShowSaveButton && (
              <Button
                type='submit'
                color='primary'
                isLoading={isLoading || isUpdatingExperience}
                isDisabled={!isSaveButtonEnabled}
                startContent={<Save size={18} />}
              >
                Save Projects
              </Button>
            )}
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
