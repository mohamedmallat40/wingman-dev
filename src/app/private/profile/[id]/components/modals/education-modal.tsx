import React, { useState, useEffect } from 'react';
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

export interface IEducation {
  id: string;
  university?: string;
  degree?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

interface EducationFormData {
  university: string;
  degree: string;
  description: string;
  startDate: string;
  endDate: string;
}

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  education?: IEducation | null;
  onSuccess: () => void;
  addToast: (message: string, type: 'success' | 'error') => void;
}

const EducationModal: React.FC<EducationModalProps> = ({
  isOpen,
  onClose,
  education,
  onSuccess,
  addToast
}) => {
  const [formData, setFormData] = useState<EducationFormData>({
    university: '',
    degree: '',
    description: '',
    startDate: '',
    endDate: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = Boolean(education);

  useEffect(() => {
    if (education) {
      setFormData({
        university: education.university || '',
        degree: education.degree || '',
        description: education.description || '',
        startDate: (education.startDate && education.startDate.split('T')[0]) || '',
        endDate: (education.endDate && education.endDate.split('T')[0]) || ''
      });
    } else {
      setFormData({
        university: '',
        degree: '',
        description: '',
        startDate: '',
        endDate: ''
      });
    }
    setErrors({});
  }, [education, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.university.trim()) {
      newErrors.university = 'University is required';
    }

    if (!formData.degree.trim()) {
      newErrors.degree = 'Degree is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (formData.endDate && formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (isEditMode && education) {
        // Update existing education
        const updateData: Partial<IEducation> = {};
        
        // Only include changed fields
        if (formData.university !== education.university) {
          updateData.university = formData.university;
        }
        if (formData.degree !== education.degree) {
          updateData.degree = formData.degree;
        }
        if (formData.description !== education.description) {
          updateData.description = formData.description;
        }
        if (formData.startDate !== education.startDate?.split('T')[0]) {
          updateData.startDate = formData.startDate;
        }
        if (formData.endDate !== education.endDate?.split('T')[0]) {
          updateData.endDate = formData.endDate;
        }

        if (Object.keys(updateData).length === 0) {
          addToast('No changes detected', 'error');
          return;
        }

        await wingManApi.patch(`/education/${education.id}`, updateData);
        addToast('Education updated successfully', 'success');
      } else {
        // Create new education
        await wingManApi.post('/education', formData);
        addToast('Education added successfully', 'success');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving education:', error);
      
      let errorMessage = 'Failed to save education';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid data provided. Please check your inputs.';
      } else if (error.response?.status === 401) {
        errorMessage = 'You are not authorized to perform this action.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Education record not found.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      addToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!education || !isEditMode) return;

    setIsLoading(true);
    try {
      await wingManApi.delete(`/education/${education.id}`);
      addToast('Education deleted successfully', 'success');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error deleting education:', error);
      
      let errorMessage = 'Failed to delete education';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = 'Education record not found.';
      } else if (error.response?.status === 401) {
        errorMessage = 'You are not authorized to delete this education.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      addToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='2xl'
      scrollBehavior='inside'
      isDismissable={!isLoading}
      hideCloseButton={isLoading}
    >
      <ModalContent>
        <ModalHeader className='flex items-center gap-3'>
          <div className='bg-secondary/20 rounded-xl p-2'>
            <Icon icon='solar:diploma-linear' className='text-secondary h-5 w-5' />
          </div>
          <div>
            <h2 className='text-xl font-semibold'>
              {isEditMode ? 'Edit Education' : 'Add Education'}
            </h2>
            <p className='text-foreground-500 text-sm'>
              {isEditMode ? 'Update this education entry' : 'Add a new education entry'}
            </p>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <Input
                label='Degree *'
                placeholder='e.g., Bachelor of Science'
                value={formData.degree}
                onChange={(e) => handleInputChange('degree', e.target.value)}
                isInvalid={!!errors.degree}
                errorMessage={errors.degree}
                isDisabled={isLoading}
              />
              <Input
                label='University *'
                placeholder='e.g., University of Technology'
                value={formData.university}
                onChange={(e) => handleInputChange('university', e.target.value)}
                isInvalid={!!errors.university}
                errorMessage={errors.university}
                isDisabled={isLoading}
              />
            </div>
            
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <Input
                label='Start Date *'
                type='date'
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                isInvalid={!!errors.startDate}
                errorMessage={errors.startDate}
                isDisabled={isLoading}
              />
              <Input
                label='End Date'
                type='date'
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                isInvalid={!!errors.endDate}
                errorMessage={errors.endDate}
                isDisabled={isLoading}
                placeholder='Leave empty if currently studying'
              />
            </div>
            
            <Textarea
              label='Description'
              placeholder='Describe your studies, achievements, or relevant coursework...'
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              minRows={3}
              maxRows={5}
              isDisabled={isLoading}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <div className='flex w-full justify-between'>
            <div>
              {isEditMode && (
                <Button
                  color='danger'
                  variant='light'
                  onPress={handleDelete}
                  isLoading={isLoading}
                  startContent={!isLoading ? <Icon icon='solar:trash-bin-minimalistic-linear' className='h-4 w-4' /> : undefined}
                >
                  Delete
                </Button>
              )}
            </div>
            <div className='flex gap-2'>
              <Button
                variant='light'
                onPress={onClose}
                isDisabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                color='primary'
                onPress={handleSubmit}
                isLoading={isLoading}
                startContent={!isLoading ? (
                  <Icon icon={isEditMode ? 'solar:pen-linear' : 'solar:plus-linear'} className='h-4 w-4' />
                ) : undefined}
              >
                {isEditMode ? 'Update' : 'Add'} Education
              </Button>
            </div>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EducationModal;