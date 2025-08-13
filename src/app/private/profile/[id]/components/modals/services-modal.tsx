import React, { useEffect, useState } from 'react';

import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  Textarea
} from '@heroui/react';
import { Icon } from '@iconify/react';

import wingManApi from '@/lib/axios';

export interface IService {
  id?: string;
  name: string;
  description: string;
  price: number;
  type: 'HOURLY_BASED' | 'DAILY_BASED' | 'PROJECT_BASED';
  createdAt?: string;
  skills: string[];
}

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: IService | null;
  onSuccess: () => void;
  addToast: (message: string, type: 'success' | 'error') => void;
}

const SERVICE_TYPES = [
  { key: 'HOURLY_BASED', label: 'Hourly Rate' },
  { key: 'DAILY_BASED', label: 'Daily Rate' },
  { key: 'PROJECT_BASED', label: 'Fixed Project Price' }
];

const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  service = null,
  onSuccess,
  addToast
}) => {
  const [formData, setFormData] = useState<IService>({
    name: '',
    description: '',
    price: 0,
    type: 'HOURLY_BASED',
    skills: []
  });
  const [skillInput, setSkillInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = Boolean(service?.id);

  // Update form data when service changes
  useEffect(() => {
    if (service && isOpen) {
      setFormData({
        name: service.name || '',
        description: service.description || '',
        price: service.price || 0,
        type: service.type || 'HOURLY_BASED',
        skills: service.skills || []
      });
    } else if (isOpen) {
      // Reset form for new service
      setFormData({
        name: '',
        description: '',
        price: 0,
        type: 'HOURLY_BASED',
        skills: []
      });
    }
    setSkillInput('');
  }, [service, isOpen]);

  const handleInputChange = (field: keyof IService, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = () => {
    const skill = skillInput.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove)
    }));
  };

  const handleSkillKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      addToast('Please enter a service name', 'error');
      return false;
    }

    if (!formData.description.trim()) {
      addToast('Please enter a service description', 'error');
      return false;
    }

    if (formData.price <= 0) {
      addToast('Please enter a valid price', 'error');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const serviceData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        type: formData.type,
        skills: formData.skills
      };

      if (isEditing && service?.id) {
        await wingManApi.patch(`/services/${service.id}`, serviceData);
        addToast('Service updated successfully', 'success');
      } else {
        await wingManApi.post('/services', serviceData);
        addToast('Service added successfully', 'success');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving service:', error);

      let errorMessage = `Failed to ${isEditing ? 'update' : 'add'} service`;

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid data provided. Please check your input.';
      } else if (error.response?.status === 401) {
        errorMessage = 'You are not authorized to perform this action.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      addToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      type: 'HOURLY_BASED',
      skills: []
    });
    setSkillInput('');
    onClose();
  };

  const getPriceLabel = () => {
    switch (formData.type) {
      case 'HOURLY_BASED':
        return 'Hourly Rate ($)';
      case 'DAILY_BASED':
        return 'Daily Rate ($)';
      case 'PROJECT_BASED':
        return 'Project Price ($)';
      default:
        return 'Price ($)';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size='3xl'
      scrollBehavior='inside'
      isDismissable={!isLoading}
      hideCloseButton={isLoading}
    >
      <ModalContent>
        <ModalHeader className='flex items-center gap-3'>
          <div className='bg-success/20 rounded-xl p-2'>
            <Icon icon='solar:bag-smile-linear' className='text-success h-5 w-5' />
          </div>
          <div>
            <h2 className='text-xl font-semibold'>
              {isEditing ? 'Edit Service' : 'Add New Service'}
            </h2>
            <p className='text-foreground-500 text-sm'>
              {isEditing ? 'Update service details' : 'Create a new service offering'}
            </p>
          </div>
        </ModalHeader>

        <ModalBody className='gap-4'>
          <Input
            label='Service Name'
            placeholder='e.g., Website Development'
            value={formData.name}
            onValueChange={(value) => handleInputChange('name', value)}
            isRequired
            variant='bordered'
            disabled={isLoading}
          />

          <Textarea
            label='Service Description'
            placeholder='Describe what this service includes, deliverables, timeline, etc...'
            value={formData.description}
            onValueChange={(value) => handleInputChange('description', value)}
            isRequired
            minRows={4}
            variant='bordered'
            disabled={isLoading}
          />

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Select
              label='Service Type'
              placeholder='Select pricing type'
              selectedKeys={[formData.type]}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string;
                handleInputChange('type', selectedKey);
              }}
              isRequired
              variant='bordered'
              disabled={isLoading}
            >
              {SERVICE_TYPES.map((type) => (
                <SelectItem key={type.key} value={type.key}>
                  {type.label}
                </SelectItem>
              ))}
            </Select>

            <Input
              label={getPriceLabel()}
              type='number'
              min='0'
              step='0.01'
              value={formData.price.toString()}
              onValueChange={(value) => handleInputChange('price', parseFloat(value) || 0)}
              isRequired
              variant='bordered'
              disabled={isLoading}
              startContent={
                <div className='pointer-events-none flex items-center'>
                  <span className='text-default-400 text-small'>$</span>
                </div>
              }
            />
          </div>

          <div className='space-y-3'>
            <label className='text-foreground-700 text-sm font-medium'>Skills Required</label>

            <div className='flex gap-2'>
              <Input
                placeholder='Add a skill...'
                value={skillInput}
                onValueChange={setSkillInput}
                onKeyPress={handleSkillKeyPress}
                variant='bordered'
                disabled={isLoading}
              />
              <Button
                color='primary'
                variant='flat'
                onPress={handleAddSkill}
                disabled={isLoading || !skillInput.trim()}
                isIconOnly
              >
                <Icon icon='solar:add-circle-linear' className='h-4 w-4' />
              </Button>
            </div>

            {formData.skills.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {formData.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    color='primary'
                    variant='flat'
                    onClose={() => handleRemoveSkill(skill)}
                    className='cursor-default'
                  >
                    {skill}
                  </Chip>
                ))}
              </div>
            )}
          </div>
        </ModalBody>

        <ModalFooter className='gap-3'>
          <Button variant='light' onPress={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            color='primary'
            onPress={handleSave}
            disabled={isLoading}
            startContent={
              isLoading ? (
                <Spinner size='sm' color='white' />
              ) : (
                <Icon icon='solar:check-linear' className='h-4 w-4' />
              )
            }
          >
            {isLoading ? 'Saving...' : isEditing ? 'Update Service' : 'Add Service'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ServiceModal;
