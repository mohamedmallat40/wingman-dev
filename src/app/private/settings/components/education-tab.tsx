'use client';

import { useState } from 'react';

import type { EducationFormData } from '@root/modules/settings/schema/settings.schema';

import { Button, Card, CardBody, CardHeader, Input, Textarea } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { type IUserProfile } from '@root/modules/profile/types';
import { educationSchema } from '@root/modules/settings/schema/settings.schema';
import { Plus, Save, X } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';

interface EducationTabProperties {
  user: IUserProfile;
}

export default function EducationTab({ user }: Readonly<EducationTabProperties>) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      education: []
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

  const onSubmit = async (data: EducationFormData) => {
    setIsLoading(true);
    try {
      console.log('Updating education:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
                  <Button
                    isIconOnly
                    color='danger'
                    variant='light'
                    size='sm'
                    onPress={() => {
                      removeEducation(index);
                    }}
                  >
                    <X size={16} />
                  </Button>
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
                  id: Date.now(),
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
