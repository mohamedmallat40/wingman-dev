'use client';

import { useState } from 'react';

import type { IExperience } from '@root/modules/profile/types';
import type { ProjectsExpFormData } from '@root/modules/settings/schema/settings.schema';

import { Button, Card, CardBody, CardHeader, Input, Textarea } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { type IUserProfile } from '@root/modules/profile/types';
import useSettings from '@root/modules/settings/hooks/use-settings';
import { projectsExpSchema } from '@root/modules/settings/schema/settings.schema';
import { Edit, Plus, Save, Trash2, X } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';

interface ExperienceTabProperties {
  user: IUserProfile;
  experiences: IExperience[];
}

export default function ExperienceTab({ user, experiences }: Readonly<ExperienceTabProperties>) {
  const [isLoading, setIsLoading] = useState(false);
  const [updatingExperienceId, setUpdatingExperienceId] = useState<string | null>(null);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [originalExperienceData, setOriginalExperienceData] = useState<any>(null);
  const {
    createExperience,
    updateExperience,
    deleteExperience,
    isDeletingExperience,
    isUpdatingExperience
  } = useSettings();

  const form = useForm<ProjectsExpFormData>({
    resolver: zodResolver(projectsExpSchema),
    defaultValues: {
      items: experiences
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items'
  });

  const hasUnsavedNewExperiences = () => {
    const formData = form.watch(); // Use watch to react to form changes
    const newExperiences = formData.items.filter((item) => item.id?.startsWith('temp_')) || [];

    if (newExperiences.length === 0) return false;

    return newExperiences.every(
      (exp) =>
        exp.company.trim() &&
        exp.position?.trim() &&
        exp.startDate.trim() &&
        exp.endDate?.trim() &&
        exp.description.trim()
    );
  };

  const isFormValidForNewExperiences = () => {
    const formData = form.watch(); // Use watch to react to form changes
    const newExperiences = formData.items?.filter((item) => item.id?.startsWith('temp_')) || [];

    if (newExperiences.length === 0) return false;

    return newExperiences.every(
      (exp) =>
        exp.company.trim() &&
        exp.position?.trim() &&
        exp.startDate.trim() &&
        exp.endDate?.trim() &&
        exp.description.trim()
    );
  };

  const hasExperienceChanged = (fieldIndex: number) => {
    if (!originalExperienceData) return false;
    const currentData = form.watch(`items.${fieldIndex}`);

    if (!originalExperienceData) return false;
    console.log('currentData', currentData);
    console.log('originalExperienceData', originalExperienceData);
    return (
      currentData.company !== originalExperienceData?.company ||
      currentData.position !== originalExperienceData.position ||
      currentData.startDate !== originalExperienceData.startDate ||
      currentData.endDate !== originalExperienceData.endDate ||
      currentData.description !== originalExperienceData.description
    );
  };

  const getChangedFields = (fieldIndex: number) => {
    if (!originalExperienceData) return {};
    const currentData = form.watch(`items.${fieldIndex}`);
    const changes: any = { id: currentData.id };

    if (currentData.company !== originalExperienceData.company) {
      changes.company = currentData.company;
    }
    if (currentData.position !== originalExperienceData.position) {
      changes.position = currentData.position;
    }
    if (currentData.startDate !== originalExperienceData.startDate) {
      changes.startDate = currentData.startDate;
    }
    if (currentData.endDate !== originalExperienceData.endDate) {
      changes.endDate = currentData.endDate;
    }
    if (currentData.description !== originalExperienceData.description) {
      changes.description = currentData.description;
    }

    return changes;
  };

  const getExperienceId = (fieldIndex: number) => {
    return form.getValues(`items.${fieldIndex}.id`);
  };

  const isFieldEditable = (fieldIndex: number) => {
    const experienceId = getExperienceId(fieldIndex);
    return experienceId?.startsWith('temp_') || editingExperienceId === experienceId;
  };

  const handleEditExperience = (fieldIndex: number) => {
    const experienceData = form.getValues(`items.${fieldIndex}`);
    setEditingExperienceId(experienceData.id || '');
    setOriginalExperienceData(structuredClone(experienceData));
  };

  const handleCancelEdit = () => {
    if (originalExperienceData && editingExperienceId) {
      const fieldIndex = fields.findIndex((f, index) => {
        const expId = getExperienceId(index);
        return expId === editingExperienceId;
      });
      if (fieldIndex !== -1) {
        form.setValue(`items.${fieldIndex}`, originalExperienceData);
      }
    }
    setEditingExperienceId(null);
    setOriginalExperienceData(null);
  };

  const handleDeleteExperience = (fieldIndex: number) => {
    const experienceData = form.getValues(`items.${fieldIndex}`);
    const actualId = experienceData.id;

    try {
      if (actualId && !actualId.startsWith('temp_')) {
        deleteExperience(actualId);
      }
      remove(fieldIndex);
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };

  const handleUpdateSingleExperience = async (fieldIndex: number) => {
    const experienceId = getExperienceId(fieldIndex);

    const changedFields = getChangedFields(fieldIndex);

    if (Object.keys(changedFields).length <= 1) {
      // Only has ID
      console.log('No changes to save');
      return;
    }

    setUpdatingExperienceId(experienceId ?? '');
    try {
      console.log('changedFields', changedFields);
      await updateExperience(changedFields);
      setEditingExperienceId(null);
      setOriginalExperienceData(null);
    } catch (error) {
      console.error('Error updating experience:', error);
    } finally {
      setUpdatingExperienceId(null);
    }
  };

  const onSubmit = async (data: ProjectsExpFormData) => {
    setIsLoading(true);
    try {
      const newExperiences = data.items.filter((item) => item.id?.startsWith('temp_'));

      // Handle new experiences creation
      for (const newExperience of newExperiences) {
        const { id, title, link, owner, videoUrl, category, image, ...experienceData } =
          newExperience;
        createExperience(experienceData);
      }
    } catch (error) {
      console.error('Error updating experience:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addNewExperience = () => {
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

  // Determine if save button should be shown and enabled
  const shouldShowSaveButton = hasUnsavedNewExperiences();
  const isSaveButtonEnabled = shouldShowSaveButton && isFormValidForNewExperiences();

  return (
    <Card>
      <CardHeader>
        <h3 className='text-xl font-semibold'>Experience</h3>
      </CardHeader>
      <CardBody>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            {fields.map((field, index) => {
              const experienceId = getExperienceId(index);
              const isEditable = isFieldEditable(index);

              return (
                <div
                  key={field.id}
                  className='space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700'
                >
                  <div className='flex items-center justify-between'>
                    <h4 className='font-medium'>Experience {index + 1}</h4>
                    <div className='flex gap-2'>
                      {!experienceId?.startsWith('temp_') && (
                        <>
                          {editingExperienceId === experienceId ? (
                            // Show save and cancel buttons when editing
                            <>
                              {hasExperienceChanged(index) && (
                                <Button
                                  isIconOnly
                                  color='default'
                                  variant='light'
                                  size='sm'
                                  isLoading={updatingExperienceId === experienceId}
                                  onPress={() => handleUpdateSingleExperience(index)}
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
                            // Show edit button when not editing
                            <Button
                              isIconOnly
                              color='primary'
                              variant='light'
                              size='sm'
                              onPress={() => {
                                handleEditExperience(index);
                              }}
                              title='Edit this experience'
                            >
                              <Edit size={16} />
                            </Button>
                          )}
                        </>
                      )}
                      {/* Show delete button only when not editing or for new experiences */}
                      {(experienceId?.startsWith('temp_') ||
                        editingExperienceId !== experienceId) && (
                        <Button
                          isIconOnly
                          color='danger'
                          variant='light'
                          size='sm'
                          isLoading={isDeletingExperience}
                          onPress={() => {
                            handleDeleteExperience(index);
                          }}
                          title='Delete this experience permanently'
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <Input
                      {...form.register(`items.${index}.company`)}
                      label='Company *'
                      placeholder='Google Inc.'
                      errorMessage={form.formState.errors.items?.[index]?.company?.message}
                      isInvalid={!!form.formState.errors.items?.[index]?.company}
                      isDisabled={!isEditable}
                    />
                    <Input
                      {...form.register(`items.${index}.position`)}
                      label='Position *'
                      placeholder='Senior Software Engineer'
                      errorMessage={form.formState.errors.items?.[index]?.position?.message}
                      isInvalid={!!form.formState.errors.items?.[index]?.position}
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
                      label='End Date *'
                      errorMessage={form.formState.errors.items?.[index]?.endDate?.message}
                      isInvalid={!!form.formState.errors.items?.[index]?.endDate}
                      isDisabled={!isEditable}
                    />
                  </div>

                  <Textarea
                    {...form.register(`items.${index}.description`)}
                    label='Description *'
                    placeholder='Describe your responsibilities, achievements, and technologies used...'
                    minRows={3}
                    errorMessage={form.formState.errors.items?.[index]?.description?.message}
                    isInvalid={!!form.formState.errors.items?.[index]?.description}
                    isDisabled={!isEditable}
                  />

                  {/* Remove the save updates button section since it's now in the header */}
                </div>
              );
            })}
          </div>

          <div className='flex gap-2'>
            <Button
              color='secondary'
              variant='flat'
              startContent={<Plus size={18} />}
              onPress={addNewExperience}
            >
              Add Experience
            </Button>
            {/* Only show save button when there are unsaved new experiences */}
            {shouldShowSaveButton && (
              <Button
                type='submit'
                color='primary'
                isLoading={isLoading || isUpdatingExperience}
                isDisabled={!isSaveButtonEnabled}
                startContent={<Save size={18} />}
              >
                Save Experience
              </Button>
            )}
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
