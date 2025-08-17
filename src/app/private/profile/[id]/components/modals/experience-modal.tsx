import React, { useEffect, useState } from 'react';

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea
} from '@heroui/react';
import { Icon } from '@iconify/react';

import wingManApi from '@/lib/axios';

interface Experience {
  id?: string;
  company?: string;
  position?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

interface ExperienceFormData {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience?: Experience | null;
  onSuccess: () => void;
  addToast: (message: string, type: 'success' | 'error') => void;
}

const ExperienceModal: React.FC<ExperienceModalProps> = ({
  isOpen,
  onClose,
  experience,
  onSuccess,
  addToast
}) => {
  const [formData, setFormData] = useState<ExperienceFormData>({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Experience>>({});

  const isEditing = Boolean(experience?.id && !experience.id.startsWith('temp_'));

  useEffect(() => {
    if (experience) {
      setFormData({
        id: experience.id,
        company: experience.company || '',
        position: experience.position || '',
        startDate: (experience.startDate && experience.startDate.split('T')[0]) || '',
        endDate: (experience.endDate && experience.endDate.split('T')[0]) || '',
        description: experience.description || ''
      });
    } else {
      setFormData({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: ''
      });
    }
    setErrors({});
  }, [experience, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Experience> = {};

    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
    }
    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }
    if (!formData.startDate.trim()) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate.trim()) {
      newErrors.endDate = 'End date is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    // Validate date order
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (startDate >= endDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof Experience, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (isEditing) {
        // Update existing experience
        const changedFields: Partial<Experience> = { id: formData.id };

        // Only include changed fields
        if (formData.company !== experience?.company) changedFields.company = formData.company;
        if (formData.position !== experience?.position) changedFields.position = formData.position;
        if (formData.startDate !== experience?.startDate?.split('T')[0])
          changedFields.startDate = formData.startDate;
        if (formData.endDate !== experience?.endDate?.split('T')[0])
          changedFields.endDate = formData.endDate;
        if (formData.description !== experience?.description)
          changedFields.description = formData.description;

        // Only make API call if there are actual changes
        if (Object.keys(changedFields).length > 1) {
          await wingManApi.patch(`/experience/${formData.id}`, changedFields);
          addToast('Experience updated successfully', 'success');
        }
      } else {
        // Create new experience
        const { id, ...experienceData } = formData;
        await wingManApi.post('/experience', experienceData);
        addToast('Experience added successfully', 'success');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving experience:', error);

      let errorMessage = isEditing ? 'Failed to update experience' : 'Failed to add experience';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = 'Experience record not found.';
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
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size='2xl'
      scrollBehavior='inside'
      isDismissable={!isLoading}
      closeButton={!isLoading}
    >
      <ModalContent>
        <ModalHeader className='flex items-center gap-3'>
          <div className='bg-primary/20 rounded-xl p-2'>
            <Icon icon='solar:case-linear' className='text-primary h-5 w-5' />
          </div>
          <div>
            <h2 className='text-xl font-semibold'>
              {isEditing ? 'Edit Experience' : 'Add Experience'}
            </h2>
            <p className='text-foreground-500 text-sm'>
              {isEditing ? 'Update this work experience' : 'Add a new work experience'}
            </p>
          </div>
        </ModalHeader>

        <ModalBody>
          <div className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <Input
                label='Company *'
                placeholder='Google Inc.'
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                errorMessage={errors.company}
                isInvalid={!!errors.company}
                isDisabled={isLoading}
              />
              <Input
                label='Position *'
                placeholder='Senior Software Engineer'
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                errorMessage={errors.position}
                isInvalid={!!errors.position}
                isDisabled={isLoading}
              />
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <Input
                type='date'
                label='Start Date *'
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                errorMessage={errors.startDate}
                isInvalid={!!errors.startDate}
                isDisabled={isLoading}
              />
              <Input
                type='date'
                label='End Date *'
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                errorMessage={errors.endDate}
                isInvalid={!!errors.endDate}
                isDisabled={isLoading}
              />
            </div>

            <Textarea
              label='Description *'
              placeholder='Describe your responsibilities, achievements, and technologies used...'
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              errorMessage={errors.description}
              isInvalid={!!errors.description}
              minRows={3}
              isDisabled={isLoading}
            />
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant='light' onPress={handleClose} isDisabled={isLoading}>
            Cancel
          </Button>
          <Button
            color='primary'
            onPress={handleSubmit}
            isLoading={isLoading}
            startContent={
              !isLoading ? <Icon icon='solar:check-linear' className='h-4 w-4' /> : undefined
            }
          >
            {isEditing ? 'Update Experience' : 'Add Experience'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ExperienceModal;
