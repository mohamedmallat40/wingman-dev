import { useState } from 'react';

import type { IUserProfile } from '@root/modules/profile/types';
import type { ServicesFormData } from '@root/modules/settings/schema/settings.schema';

import {
  Autocomplete,
  AutocompleteItem,
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
import { type IService } from '@root/modules/profile/types';
import useSettings from '@root/modules/settings/hooks/use-settings';
import { servicesSchema } from '@root/modules/settings/schema/settings.schema';
import { Edit, Plus, Save, Trash2, X } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';

interface ServicesTabProperties {
  user: IUserProfile;
  services: IService[];
}

const serviceTypes = [
  { key: 'HOURLY_BASED', label: 'Hourly Based' },
  { key: 'DAILY_BASED', label: 'Daily Based' },
  { key: 'PROJECT_BASED', label: 'Project Based' }
];

export default function ServicesTab({ user, services }: Readonly<ServicesTabProperties>) {
  const [isLoading, setIsLoading] = useState(false);
  const [updatingServiceId, setUpdatingServiceId] = useState<string | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [originalServiceData, setOriginalServiceData] = useState<any>(null);

  const {
    createService,
    updateService,
    deleteService,
    isCreatingService,
    isDeletingService,
    isUpdatingService,
    useAllSkills
  } = useSettings(user.id);

  const form = useForm<ServicesFormData>({
    resolver: zodResolver(servicesSchema),
    defaultValues: { services: services }
  });

  const {
    fields: serviceFields,
    append: appendService,
    remove: removeService
  } = useFieldArray({
    control: form.control,
    name: 'services'
  });

  // Check if there are unsaved new services
  const hasUnsavedNewServices = () => {
    const formData = form.watch();
    const newServices =
      formData.services.filter((item) => item.id?.startsWith('temp_') || !item.id) || [];

    if (newServices.length === 0) return false;

    return newServices.every(
      (service) =>
        service.name?.trim() &&
        service.description?.trim() &&
        service.price > 0 &&
        service.type &&
        service.skills &&
        service.skills.length > 0
    );
  };

  // Check if form is valid for new services
  const isFormValidForNewServices = () => {
    const formData = form.watch();
    const newServices =
      formData.services?.filter((item) => item.id?.startsWith('temp_') || !item.id) || [];

    if (newServices.length === 0) return false;

    return newServices.every(
      (service) =>
        service.name?.trim() &&
        service.description?.trim() &&
        service.price > 0 &&
        service.type &&
        service.skills &&
        service.skills.length > 0 &&
        service.skills.every((skill) => skill.id)
    );
  };

  // Check if service has been modified
  const hasServiceChanged = (fieldIndex: number) => {
    if (!originalServiceData) return false;
    const currentData = form.watch(`services.${fieldIndex}`);

    if (!currentData || !originalServiceData) return false;

    // Compare basic fields
    const basicFieldsChanged =
      currentData.name !== originalServiceData.name ||
      currentData.description !== originalServiceData.description ||
      currentData.price !== originalServiceData.price ||
      currentData.type !== originalServiceData.type;

    // Compare skills
    const currentSkills = currentData.skills || [];
    const originalSkills = originalServiceData.skills || [];

    const skillsChanged =
      currentSkills.length !== originalSkills.length ||
      currentSkills.some(
        (skill, index) =>
          skill.id !== originalSkills[index]?.id || skill.key !== originalSkills[index]?.key
      );

    return basicFieldsChanged || skillsChanged;
  };

  // Get only the changed fields for update
  const getChangedFields = (fieldIndex: number) => {
    if (!originalServiceData) return {};
    const currentData = form.watch(`services.${fieldIndex}`);
    const changes: any = { id: currentData.id };

    if (currentData.name !== originalServiceData.name) {
      changes.name = currentData.name;
    }
    if (currentData.description !== originalServiceData.description) {
      changes.description = currentData.description;
    }
    if (currentData.price !== originalServiceData.price) {
      changes.price = currentData.price;
    }
    if (currentData.type !== originalServiceData.type) {
      changes.type = currentData.type;
    }

    // Check if skills changed
    const currentSkills = currentData.skills || [];
    const originalSkills = originalServiceData.skills || [];

    const skillsChanged =
      currentSkills.length !== originalSkills.length ||
      currentSkills.some(
        (skill, index) =>
          skill.id !== originalSkills[index]?.id || skill.key !== originalSkills[index]?.key
      );

    if (skillsChanged) {
      changes.skills = currentSkills.map((skill) => skill.id);
    }

    return changes;
  };

  // Get the actual service ID from form data
  const getServiceId = (fieldIndex: number) => {
    return form.getValues(`services.${fieldIndex}.id`);
  };

  // Check if field should be editable
  const isFieldEditable = (fieldIndex: number) => {
    const serviceId = getServiceId(fieldIndex);
    // New services (temp_ IDs or empty IDs) are always editable
    // Existing services are editable only when in edit mode
    return !serviceId || serviceId.startsWith('temp_') || editingServiceId === serviceId;
  };

  const handleEditService = (fieldIndex: number) => {
    const serviceData = form.getValues(`services.${fieldIndex}`);
    setEditingServiceId(serviceData.id || '');
    // Create a deep copy to avoid reference issues
    setOriginalServiceData(JSON.parse(JSON.stringify(serviceData)));
  };

  const handleCancelEdit = () => {
    if (originalServiceData && editingServiceId) {
      // Reset form to original data
      const fieldIndex = serviceFields.findIndex((f, index) => {
        const servId = getServiceId(index);
        return servId === editingServiceId;
      });
      if (fieldIndex !== -1) {
        form.setValue(`services.${fieldIndex}`, originalServiceData);
      }
    }
    setEditingServiceId(null);
    setOriginalServiceData(null);
  };

  const handleUpdateSingleService = async (fieldIndex: number) => {
    const serviceId = getServiceId(fieldIndex);

    // Get only the changed fields
    const changedFields = getChangedFields(fieldIndex);

    // Check if there are actually changes to save
    if (Object.keys(changedFields).length <= 1) {
      // Only has ID
      console.log('No changes to save');
      return;
    }

    setUpdatingServiceId(serviceId ?? '');
    try {
      await updateService(changedFields);
      // Exit edit mode after successful update
      setEditingServiceId(null);
      setOriginalServiceData(null);
    } catch (error) {
      console.error('Error updating service:', error);
    } finally {
      setUpdatingServiceId(null);
    }
  };

  const onSubmit = async (data: ServicesFormData) => {
    setIsLoading(true);
    try {
      const newServices = data.services.filter((item) => !item.id || item.id.startsWith('temp_'));

      // Handle new services creation
      for (const newService of newServices) {
        const { id, ...serviceData } = newService;
        const serviceToCreate = {
          ...serviceData,
          skills: serviceData.skills.map((skill) => skill.id)
        };
        createService(serviceToCreate);
      }
    } catch (error) {
      console.error('Error creating services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteService = (fieldIndex: number) => {
    const serviceData = form.getValues(`services.${fieldIndex}`);
    const actualId = serviceData.id;

    try {
      if (actualId && !actualId.startsWith('temp_')) {
        // If it's an existing service (has a real ID), delete from server
        deleteService(actualId);
      }
      removeService(fieldIndex);
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const addSkillToService = (serviceIndex: number) => {
    const currentSkills = form.getValues(`services.${serviceIndex}.skills`);
    form.setValue(`services.${serviceIndex}.skills`, [...currentSkills, { id: '', key: '' }]);
  };

  const handleSkillSelection = (
    serviceIndex: number,
    skillIndex: number,
    selectedSkillId: string
  ) => {
    const selectedSkill = useAllSkills.data?.data.find((skill) => skill.id === selectedSkillId);
    if (selectedSkill) {
      form.setValue(`services.${serviceIndex}.skills.${skillIndex}.id`, selectedSkill.id);
      form.setValue(`services.${serviceIndex}.skills.${skillIndex}.key`, selectedSkill.key);
    }
  };

  const removeSkillFromService = (serviceIndex: number, skillIndex: number) => {
    const currentSkills = form.getValues(`services.${serviceIndex}.skills`);
    const updatedSkills = currentSkills.filter((_, index) => index !== skillIndex);
    form.setValue(`services.${serviceIndex}.skills`, updatedSkills);
  };

  const onError = (errors: unknown) => {
    console.log('=== FORM VALIDATION ERRORS ===');
    console.log('Form errors:', errors);
  };

  // Determine if save button should be shown and enabled
  const shouldShowSaveButton = hasUnsavedNewServices();
  const isSaveButtonEnabled = shouldShowSaveButton && isFormValidForNewServices();

  return (
    <Card>
      <CardHeader>
        <h3 className='text-xl font-semibold'>Services</h3>
      </CardHeader>
      <CardBody>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className='space-y-6'>
          <div className='space-y-6'>
            {serviceFields.map((field, serviceIndex) => {
              const serviceId = getServiceId(serviceIndex);
              const isEditable = isFieldEditable(serviceIndex);

              return (
                <div
                  key={field.id}
                  className='space-y-4 rounded-lg border border-gray-200 p-6 dark:border-gray-700'
                >
                  <div className='flex items-center justify-between'>
                    <h4 className='text-lg font-medium'>Service {serviceIndex + 1}</h4>
                    <div className='flex gap-2'>
                      {serviceId && !serviceId.startsWith('temp_') && (
                        <>
                          {editingServiceId === serviceId ? (
                            // Show save and cancel buttons when editing
                            <>
                              {hasServiceChanged(serviceIndex) && (
                                <Button
                                  isIconOnly
                                  color='success'
                                  variant='light'
                                  size='sm'
                                  isLoading={updatingServiceId === serviceId}
                                  onPress={() => handleUpdateSingleService(serviceIndex)}
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
                                handleEditService(serviceIndex);
                              }}
                              title='Edit this service'
                            >
                              <Edit size={16} />
                            </Button>
                          )}
                        </>
                      )}
                      {/* Show delete button only when not editing or for new services */}
                      {(!serviceId ||
                        serviceId.startsWith('temp_') ||
                        editingServiceId !== serviceId) && (
                        <Button
                          isIconOnly
                          color='danger'
                          variant='light'
                          size='sm'
                          isLoading={isDeletingService}
                          onPress={() => {
                            handleDeleteService(serviceIndex);
                          }}
                          title='Delete this service permanently'
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <Input
                      {...form.register(`services.${serviceIndex}.name`)}
                      label='Service Name'
                      placeholder='Web Design'
                      errorMessage={form.formState.errors.services?.[serviceIndex]?.name?.message}
                      isInvalid={!!form.formState.errors.services?.[serviceIndex]?.name}
                      isDisabled={!isEditable}
                    />
                    <div className='grid grid-cols-2 gap-2'>
                      <Input
                        {...form.register(`services.${serviceIndex}.price`, {
                          valueAsNumber: true
                        })}
                        type='number'
                        label='Price'
                        placeholder='2500'
                        errorMessage={
                          form.formState.errors.services?.[serviceIndex]?.price?.message
                        }
                        isInvalid={!!form.formState.errors.services?.[serviceIndex]?.price}
                        isDisabled={!isEditable}
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
                        isDisabled={!isEditable}
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
                    isDisabled={!isEditable}
                  />

                  {/* Skills for this service */}
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <h5 className='font-medium'>Skills</h5>
                      {isEditable && (
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
                      )}
                    </div>

                    {form.watch(`services.${serviceIndex}.skills`).map((skill, skillIndex) => (
                      <div key={skillIndex} className='flex gap-2'>
                        <Autocomplete
                          label='Select Skill'
                          placeholder='Choose a skill...'
                          className='flex-1'
                          isLoading={useAllSkills.isLoading}
                          selectedKey={skill.id}
                          onSelectionChange={(key) => {
                            if (key) {
                              handleSkillSelection(serviceIndex, skillIndex, key as string);
                            }
                          }}
                          isDisabled={!isEditable}
                        >
                          {useAllSkills.data?.data.map((skillOption) => (
                            <AutocompleteItem key={skillOption.id}>
                              {skillOption.key}
                            </AutocompleteItem>
                          ))}
                        </Autocomplete>
                        {isEditable && (
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
                        )}
                      </div>
                    ))}
                    {(form.formState.errors.services?.[serviceIndex]?.skills?.root ??
                      form.formState.errors.services?.[serviceIndex]?.skills?.root) && (
                      <div className='mt-1 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-600'>
                        {form.formState.errors.services[serviceIndex].skills.root.message ??
                          'Skills are required'}
                      </div>
                    )}
                  </div>
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
                appendService({
                  id: `temp_${Date.now()}`,
                  name: '',
                  description: '',
                  price: 0,
                  type: 'HOURLY_BASED',
                  skills: [{ id: '', key: '' }]
                });
              }}
            >
              Add Service
            </Button>
            {/* Only show save button when there are unsaved new services */}
            {shouldShowSaveButton && (
              <Button
                type='submit'
                color='primary'
                isLoading={isLoading || isCreatingService}
                isDisabled={!isSaveButtonEnabled}
                startContent={<Save size={18} />}
              >
                Save Services
              </Button>
            )}
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
