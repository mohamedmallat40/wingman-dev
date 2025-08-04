import { useState } from 'react';

import type { IEducation } from '@root/modules/profile/types';
import type { EducationFormData } from '@root/modules/settings/schema/settings.schema';

import { Button, Card, CardBody, CardHeader, Input, Textarea } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
// Adjust import path
import { type IUserProfile } from '@root/modules/profile/types';
import useSettings from '@root/modules/settings/hooks/use-settings';
import { educationSchema } from '@root/modules/settings/schema/settings.schema';
import { Plus, Save, Trash2, X } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';

interface EducationTabProperties {
  user: IUserProfile;
  educations: IEducation[];
}

export default function EducationTab({ user, educations }: Readonly<EducationTabProperties>) {
  const [isLoading, setIsLoading] = useState(false);
  const { createEducation, deleteEducation, isDeletingEducation } = useSettings();
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

  console.log(educationFields);

  const handleCreateEducation = (data: EducationFormData) => {
    createEducation(data);
  };

  const handleDeleteEducation = (educationId: string, fieldIndex: number) => {
    const educationData = form.getValues(`education.${fieldIndex}`);
    const actualEducationId = educationData.id;
    try {
      // If it's an existing education (has a real ID), delete from server
      if (educationId) {
        deleteEducation(actualEducationId);
      }
      removeEducation(fieldIndex);
    } catch (error) {
      console.error('Error deleting education:', error);
    }
  };

  const onSubmit = async (data: EducationFormData) => {
    setIsLoading(true);
    try {
      handleCreateEducation({ ...data.education[0] });
    } catch (error) {
      console.error('Error updating education:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className='text-xl font-semibold'>Education</h3>
      </CardHeader>
      <CardBody>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            {educationFields.map((field, index) => (
              <div
                key={field.id}
                className='space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700'
              >
                <div className='flex items-center justify-between'>
                  <h4 className='font-medium'>Education {index + 1}</h4>
                  <div className='flex gap-2'>
                    {/* Delete individual education */}
                    {field.id && (
                      <Button
                        isIconOnly
                        color='danger'
                        variant='light'
                        size='sm'
                        isLoading={isDeletingEducation}
                        onPress={() => {
                          handleDeleteEducation(form.getValues(`education.${index}`).id, index);
                        }}
                        title='Delete this education permanently'
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                    {/* Remove from form (without server deletion) */}
                    <Button
                      isIconOnly
                      color='danger'
                      variant='light'
                      size='sm'
                      onPress={() => {
                        handleDeleteEducation(field.id, index);
                      }}
                      title='Remove from form'
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <Input
                    {...form.register(`education.${index}.degree`)}
                    label='Degree'
                    placeholder='Bachelor of Computer Science'
                    errorMessage={form.formState.errors.education?.[index]?.degree?.message}
                    isInvalid={!!form.formState.errors.education?.[index]?.degree}
                  />
                  <Input
                    {...form.register(`education.${index}.university`)}
                    label='University'
                    placeholder='Stanford University'
                    errorMessage={form.formState.errors.education?.[index]?.university?.message}
                    isInvalid={!!form.formState.errors.education?.[index]?.university}
                  />
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <Input
                    {...form.register(`education.${index}.startDate`)}
                    type='date'
                    label='Start Date'
                    errorMessage={form.formState.errors.education?.[index]?.startDate?.message}
                    isInvalid={!!form.formState.errors.education?.[index]?.startDate}
                  />
                  <Input
                    {...form.register(`education.${index}.endDate`)}
                    type='date'
                    label='End Date'
                    errorMessage={form.formState.errors.education?.[index]?.endDate?.message}
                    isInvalid={!!form.formState.errors.education?.[index]?.endDate}
                  />
                </div>

                <Textarea
                  {...form.register(`education.${index}.description`)}
                  label='Description'
                  placeholder='Describe your studies, specializations, achievements...'
                  minRows={3}
                  errorMessage={form.formState.errors.education?.[index]?.description?.message}
                  isInvalid={!!form.formState.errors.education?.[index]?.description}
                />
              </div>
            ))}
          </div>

          <div className='flex gap-2'>
            <Button
              color='secondary'
              variant='flat'
              startContent={<Plus size={18} />}
              onPress={() => {
                appendEducation({
                  id: `temp_${Date.now()}`, // Temporary ID for new entries
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
            <Button
              type='submit'
              color='primary'
              isLoading={isLoading}
              startContent={<Save size={18} />}
            >
              Save Education
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
