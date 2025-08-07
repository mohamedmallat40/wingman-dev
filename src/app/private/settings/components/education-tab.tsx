import { useState } from 'react';

import type { IEducation } from '@root/modules/profile/types';
import type { EducationFormData } from '@root/modules/settings/schema/settings.schema';

import { Button, Card, CardBody, CardHeader, Input, Textarea } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { type IUserProfile } from '@root/modules/profile/types';
import useSettings from '@root/modules/settings/hooks/use-settings';
import { educationSchema } from '@root/modules/settings/schema/settings.schema';
import { Edit, Plus, Save, Trash2, X } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';

interface EducationTabProperties {
  user: IUserProfile;
  educations: IEducation[];
}

export default function EducationTab({ user, educations }: Readonly<EducationTabProperties>) {
  const [isLoading, setIsLoading] = useState(false);
  const [updatingEducationId, setUpdatingEducationId] = useState<string | null>(null);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
  const [originalEducationData, setOriginalEducationData] = useState<any>(null);
  const {
    createEducation,
    updateEducation,
    deleteEducation,
    isDeletingEducation,
    isUpdatingEducation
  } = useSettings();

  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      education: educations
    }
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation
  } = useFieldArray({
    control: form.control,
    name: 'education'
  });

  // Check if there are unsaved new educations
  const hasUnsavedNewEducations = () => {
    const formData = form.watch();
    const newEducations = formData.education.filter((item) => item.id?.startsWith('temp_')) || [];

    if (newEducations.length === 0) return false;

    return newEducations.every(
      (edu) =>
        edu.degree?.trim() &&
        edu.university?.trim() &&
        edu.startDate?.trim() &&
        edu.endDate?.trim() &&
        edu.description?.trim()
    );
  };

  // Check if form is valid for new educations
  const isFormValidForNewEducations = () => {
    const formData = form.watch();
    const newEducations = formData.education?.filter((item: { id: string; }) => item.id?.startsWith('temp_'));

    if (newEducations.length === 0) return false;

    return newEducations.every(
      (edu) =>
        edu.degree?.trim() &&
        edu.university?.trim() &&
        edu.startDate?.trim() &&
        edu.endDate?.trim() &&
        edu.description?.trim()
    );
  };

  // Check if education has been modified
  const hasEducationChanged = (fieldIndex: number) => {
    if (!originalEducationData) return false;
    const currentData = form.watch(`education.${fieldIndex}`);

    if (!currentData || !originalEducationData) return false;

    return (
      currentData.degree !== originalEducationData.degree ||
      currentData.university !== originalEducationData.university ||
      currentData.startDate !== originalEducationData.startDate ||
      currentData.endDate !== originalEducationData.endDate ||
      currentData.description !== originalEducationData.description
    );
  };

  // Get only the changed fields for update
  const getChangedFields = (fieldIndex: number) => {
    if (!originalEducationData) return {};
    const currentData = form.watch(`education.${fieldIndex}`);
    const changes: any = { id: currentData.id };

    if (currentData.degree !== originalEducationData.degree) {
      changes.degree = currentData.degree;
    }
    if (currentData.university !== originalEducationData.university) {
      changes.university = currentData.university;
    }
    if (currentData.startDate !== originalEducationData.startDate) {
      changes.startDate = currentData.startDate;
    }
    if (currentData.endDate !== originalEducationData.endDate) {
      changes.endDate = currentData.endDate;
    }
    if (currentData.description !== originalEducationData.description) {
      changes.description = currentData.description;
    }

    return changes;
  };

  // Get the actual education ID from form data
  const getEducationId = (fieldIndex: number) => {
    return form.getValues(`education.${fieldIndex}.id`);
  };

  // Check if field should be editable
  const isFieldEditable = (fieldIndex: number) => {
    const educationId = getEducationId(fieldIndex);
    // New educations (temp_ IDs) are always editable
    // Existing educations are editable only when in edit mode
    return educationId?.startsWith('temp_') || editingEducationId === educationId;
  };

  const handleEditEducation = (fieldIndex: number) => {
    const educationData = form.getValues(`education.${fieldIndex}`);
    setEditingEducationId(educationData.id || '');
    // Create a deep copy to avoid reference issues
    setOriginalEducationData(JSON.parse(JSON.stringify(educationData)));
  };

  const handleCancelEdit = () => {
    if (originalEducationData && editingEducationId) {
      // Reset form to original data
      const fieldIndex = educationFields.findIndex((f, index) => {
        const eduId = getEducationId(index);
        return eduId === editingEducationId;
      });
      if (fieldIndex !== -1) {
        form.setValue(`education.${fieldIndex}`, originalEducationData);
      }
    }
    setEditingEducationId(null);
    setOriginalEducationData(null);
  };

  const handleDeleteEducation = (fieldIndex: number) => {
    const educationData = form.getValues(`education.${fieldIndex}`);
    const actualId = educationData.id;

    try {
      if (actualId && !actualId.startsWith('temp_')) {
        // If it's an existing education (has a real ID), delete from server
        deleteEducation(actualId);
      }
      removeEducation(fieldIndex);
    } catch (error) {
      console.error('Error deleting education:', error);
    }
  };

  const handleUpdateSingleEducation = async (fieldIndex: number) => {
    const educationId = getEducationId(fieldIndex);

    // Get only the changed fields
    const changedFields = getChangedFields(fieldIndex);

    // Check if there are actually changes to save
    if (Object.keys(changedFields).length <= 1) {
      return;
    }

    setUpdatingEducationId(educationId ?? '');
    try {
      await updateEducation(changedFields);
      // Exit edit mode after successful update
      setEditingEducationId(null);
      setOriginalEducationData(null);
    } catch (error) {
      console.error('Error updating education:', error);
    } finally {
      setUpdatingEducationId(null);
    }
  };

  const onSubmit = (data: EducationFormData) => {
    setIsLoading(true);
    try {
      const newEducations = data.education.filter((edu) => edu.id?.startsWith('temp_'));

      for (const newEducation of newEducations) {
        const { id, ...educationData } = newEducation;
        createEducation(educationData);
      }
    } catch (error) {
      console.error('Error updating education:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine if save button should be shown and enabled
  const shouldShowSaveButton = hasUnsavedNewEducations();
  const isSaveButtonEnabled = shouldShowSaveButton && isFormValidForNewEducations();

  return (
    <Card>
      <CardHeader>
        <h3 className='text-xl font-semibold'>Education</h3>
      </CardHeader>
      <CardBody>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            {educationFields.map((field, index) => {
              const educationId = getEducationId(index);
              const isEditable = isFieldEditable(index);

              return (
                <div
                  key={field.id}
                  className='space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700'
                >
                  <div className='flex items-center justify-between'>
                    <h4 className='font-medium'>Education {index + 1}</h4>
                    <div className='flex gap-2'>
                      {educationId && !educationId.startsWith('temp_') && (
                        <>
                          {editingEducationId === educationId ? (
                            // Show save and cancel buttons when editing
                            <>
                              {hasEducationChanged(index) && (
                                <Button
                                  isIconOnly
                                  color='success'
                                  variant='light'
                                  size='sm'
                                  isLoading={updatingEducationId === educationId}
                                  onPress={() => handleUpdateSingleEducation(index)}
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
                                handleEditEducation(index);
                              }}
                              title='Edit this education'
                            >
                              <Edit size={16} />
                            </Button>
                          )}
                        </>
                      )}
                      {/* Show delete button only when not editing or for new educations */}
                      {(educationId?.startsWith('temp_') || editingEducationId !== educationId) && (
                        <Button
                          isIconOnly
                          color='danger'
                          variant='light'
                          size='sm'
                          isLoading={isDeletingEducation}
                          onPress={() => {
                            handleDeleteEducation(index);
                          }}
                          title='Delete this education permanently'
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <Input
                      {...form.register(`education.${index}.degree`)}
                      label='Degree'
                      placeholder='Bachelor of Computer Science'
                      errorMessage={form.formState.errors.education?.[index]?.degree?.message}
                      isInvalid={!!form.formState.errors.education?.[index]?.degree}
                      isDisabled={!isEditable}
                      isRequired
                    />
                    <Input
                      {...form.register(`education.${index}.university`)}
                      label='University'
                      placeholder='Stanford University'
                      errorMessage={form.formState.errors.education?.[index]?.university?.message}
                      isInvalid={!!form.formState.errors.education?.[index]?.university}
                      isDisabled={!isEditable}
                      isRequired
                    />
                  </div>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <Input
                      {...form.register(`education.${index}.startDate`)}
                      type='date'
                      label='Start Date'
                      errorMessage={form.formState.errors.education?.[index]?.startDate?.message}
                      isInvalid={!!form.formState.errors.education?.[index]?.startDate}
                      isDisabled={!isEditable}
                      isRequired
                    />
                    <Input
                      {...form.register(`education.${index}.endDate`)}
                      type='date'
                      label='End Date'
                      errorMessage={form.formState.errors.education?.[index]?.endDate?.message}
                      isInvalid={!!form.formState.errors.education?.[index]?.endDate}
                      isDisabled={!isEditable}
                      isRequired
                    />
                  </div>

                  <Textarea
                    {...form.register(`education.${index}.description`)}
                    label='Description'
                    placeholder='Describe your studies, specializations, achievements...'
                    minRows={3}
                    errorMessage={form.formState.errors.education?.[index]?.description?.message}
                    isInvalid={!!form.formState.errors.education?.[index]?.description}
                    isDisabled={!isEditable}
                    isRequired
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
              onPress={() => {
                appendEducation({
                  id: `temp_${Date.now()}`,
                  degree: '',
                  university: '',
                  startDate: '',
                  endDate: '',
                  description: ''
                });
              }}
            >
              Add Education
            </Button>
            {/* Only show save button when there are unsaved new educations */}
            {shouldShowSaveButton && (
              <Button
                type='submit'
                color='primary'
                isLoading={isLoading || isUpdatingEducation}
                isDisabled={!isSaveButtonEnabled}
                startContent={<Save size={18} />}
              >
                Save Education
              </Button>
            )}
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
