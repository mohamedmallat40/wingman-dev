'use client';

import { useState } from 'react';

import type { ServicesFormData } from '@root/modules/settings/schema/settings.schema';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Textarea
} from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { type IUserProfile } from '@root/modules/profile/types';
import { servicesSchema } from '@root/modules/settings/schema/settings.schema';
import { Plus, Save, X } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';

interface ServicesTabProperties {
  user: IUserProfile;
}

const serviceTypes = [
  { key: 'HOURLY_BASED', label: 'Hourly Based' },
  { key: 'DAILY_BASED', label: 'Daily Based' },
  { key: 'PROJECT_BASED', label: 'Project Based' }
];

const skillTypes = [
  { key: 'NORMAL', label: 'Normal' },
  { key: 'SOFT', label: 'Soft Skill' },
  { key: 'TECHNICAL', label: 'Technical' }
];

export default function ServicesTab({ user }: Readonly<ServicesTabProperties>) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ServicesFormData>({
    resolver: zodResolver(servicesSchema),
    defaultValues: {
      services: []
    }
  });

  const {
    fields: serviceFields,
    append: appendService,
    remove: removeService
  } = useFieldArray({
    control: form.control,
    name: 'services'
  });

  const onSubmit = async (data: ServicesFormData) => {
    setIsLoading(true);
    try {
      console.log('Updating services:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error updating services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addSkillToService = (serviceIndex: number) => {
    const currentSkills = form.getValues(`services.${serviceIndex}.skills`);
    form.setValue(`services.${serviceIndex}.skills`, [
      ...currentSkills,
      { id: crypto.randomUUID(), key: '', type: 'NORMAL' as const }
    ]);
  };

  const removeSkillFromService = (serviceIndex: number, skillIndex: number) => {
    const currentSkills = form.getValues(`services.${serviceIndex}.skills`);
    const updatedSkills = currentSkills.filter((_, index) => index !== skillIndex);
    form.setValue(`services.${serviceIndex}.skills`, updatedSkills);
  };

  return (
    <Card>
      <CardHeader>
        <h3 className='text-xl font-semibold'>Services</h3>
      </CardHeader>
      <CardBody>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-6'>
            {serviceFields.map((field, serviceIndex) => (
              <div
                key={field.id}
                className='space-y-4 rounded-lg border border-gray-200 p-6 dark:border-gray-700'
              >
                <div className='flex items-center justify-between'>
                  <h4 className='text-lg font-medium'>Service {serviceIndex + 1}</h4>
                  <Button
                    isIconOnly
                    color='danger'
                    variant='light'
                    size='sm'
                    onPress={() => {
                      removeService(serviceIndex);
                    }}
                  >
                    <X size={16} />
                  </Button>
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <Input
                    {...form.register(`services.${serviceIndex}.name`)}
                    label='Service Name'
                    placeholder='Web Design'
                    errorMessage={form.formState.errors.services?.[serviceIndex]?.name?.message}
                    isInvalid={!!form.formState.errors.services?.[serviceIndex]?.name}
                  />
                  <div className='grid grid-cols-2 gap-2'>
                    <Input
                      {...form.register(`services.${serviceIndex}.price`, { valueAsNumber: true })}
                      type='number'
                      label='Price'
                      placeholder='2500'
                      errorMessage={form.formState.errors.services?.[serviceIndex]?.price?.message}
                      isInvalid={!!form.formState.errors.services?.[serviceIndex]?.price}
                    />
                    <Select
                      {...form.register(`services.${serviceIndex}.type`)}
                      label='Type'
                      placeholder='Select type'
                      selectedKeys={[form.watch(`services.${serviceIndex}.type`)]}
                      onSelectionChange={(keys) => {
                        const value = [...keys][0] as
                          | 'HOURLY_BASED'
                          | 'DAILY_BASED'
                          | 'PROJECT_BASED';
                        form.setValue(`services.${serviceIndex}.type`, value);
                      }}
                    >
                      {serviceTypes.map((type) => (
                        <SelectItem key={type.key}>{type.label}</SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>

                <Textarea
                  {...form.register(`services.${serviceIndex}.description`)}
                  label='Description'
                  placeholder='Describe your service...'
                  minRows={3}
                  errorMessage={
                    form.formState.errors.services?.[serviceIndex]?.description?.message
                  }
                  isInvalid={!!form.formState.errors.services?.[serviceIndex]?.description}
                />

                {/* Skills for this service */}
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <h5 className='font-medium'>Required Skills</h5>
                    <Button
                      size='sm'
                      color='secondary'
                      variant='flat'
                      startContent={<Plus size={14} />}
                      onPress={() => {
                        addSkillToService(serviceIndex);
                      }}
                    >
                      Add Skill
                    </Button>
                  </div>

                  {form.watch(`services.${serviceIndex}.skills`).map((skill, skillIndex) => (
                    <div key={skillIndex} className='flex gap-2'>
                      <Input
                        {...form.register(`services.${serviceIndex}.skills.${skillIndex}.key`)}
                        placeholder='Skill name'
                        className='flex-1'
                      />
                      <Select
                        {...form.register(`services.${serviceIndex}.skills.${skillIndex}.type`)}
                        placeholder='Type'
                        className='w-40'
                        selectedKeys={[
                          form.watch(`services.${serviceIndex}.skills.${skillIndex}.type`)
                        ]}
                        onSelectionChange={(keys) => {
                          const value = [...keys][0] as 'NORMAL' | 'SOFT' | 'TECHNICAL';
                          form.setValue(
                            `services.${serviceIndex}.skills.${skillIndex}.type`,
                            value
                          );
                        }}
                      >
                        {skillTypes.map((type) => (
                          <SelectItem key={type.key}>{type.label}</SelectItem>
                        ))}
                      </Select>
                      <Button
                        isIconOnly
                        color='danger'
                        variant='light'
                        size='sm'
                        onPress={() => {
                          removeSkillFromService(serviceIndex, skillIndex);
                        }}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className='flex gap-2'>
            <Button
              color='secondary'
              variant='flat'
              startContent={<Plus size={18} />}
              onPress={() => {
                appendService({
                  id: crypto.randomUUID(),
                  name: '',
                  description: '',
                  price: 0,
                  type: 'HOURLY_BASED',
                  skills: [{ id: crypto.randomUUID(), key: '', type: 'NORMAL' }]
                });
              }}
            >
              Add Service
            </Button>
            <Button
              type='submit'
              color='primary'
              isLoading={isLoading}
              startContent={<Save size={18} />}
            >
              Save Services
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
