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
  Spinner,
  Textarea
} from '@heroui/react';
import { Icon } from '@iconify/react';

export interface IReview {
  id?: string;
  stars: number;
  testimony: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  name: string;
  email: string;
  companyName: string;
  position: string;
  createdAt?: string;
}

interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimonial?: IReview | null;
  onSuccess: () => void;
  addToast: (message: string, type: 'success' | 'error') => void;
}

const TestimonialModal: React.FC<TestimonialModalProps> = ({
  isOpen,
  onClose,
  testimonial = null,
  onSuccess,
  addToast
}) => {
  const [formData, setFormData] = useState<IReview>({
    stars: 5,
    testimony: '',
    name: '',
    email: '',
    companyName: '',
    position: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = Boolean(testimonial?.id);

  // Update form data when testimonial changes
  useEffect(() => {
    if (testimonial && isOpen) {
      setFormData({
        stars: testimonial.stars || 5,
        testimony: testimonial.testimony || '',
        name: testimonial.name || '',
        email: testimonial.email || '',
        companyName: testimonial.companyName || '',
        position: testimonial.position || ''
      });
    } else if (isOpen) {
      // Reset form for new testimonial
      setFormData({
        stars: 5,
        testimony: '',
        name: '',
        email: '',
        companyName: '',
        position: ''
      });
    }
  }, [testimonial, isOpen]);

  const handleInputChange = (field: keyof IReview, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const requiredFields: (keyof IReview)[] = [
      'name',
      'email',
      'testimony',
      'companyName',
      'position'
    ];

    for (const field of requiredFields) {
      if (!formData[field]?.toString().trim()) {
        const fieldName = field.replace(/([A-Z])/g, ' $1').toLowerCase();
        addToast(`Please enter ${fieldName}`, 'error');
        return false;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      addToast('Please enter a valid email address', 'error');
      return false;
    }

    // Validate star rating
    if (formData.stars < 1 || formData.stars > 5) {
      addToast('Star rating must be between 1 and 5', 'error');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    // Note: Since testimonials are read-only (only DELETE endpoint available),
    // this is likely for display purposes only or handled differently
    addToast('Testimonials are managed through your client feedback system', 'error');
    onClose();
  };

  const handleClose = () => {
    setFormData({
      stars: 5,
      testimony: '',
      name: '',
      email: '',
      companyName: '',
      position: ''
    });
    onClose();
  };

  const renderStarRating = () => {
    return (
      <div className='flex items-center gap-2'>
        <span className='text-foreground-700 text-sm font-medium'>Rating:</span>
        <div className='flex gap-1'>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type='button'
              onClick={() => handleInputChange('stars', star)}
              disabled={isLoading}
              className={`rounded p-1 transition-colors ${
                star <= formData.stars
                  ? 'text-warning hover:text-warning-600'
                  : 'text-default-300 hover:text-default-400'
              }`}
            >
              <Icon
                icon={star <= formData.stars ? 'solar:star-bold' : 'solar:star-linear'}
                className='h-5 w-5'
              />
            </button>
          ))}
        </div>
        <span className='text-foreground-500 text-sm'>
          ({formData.stars} star{formData.stars !== 1 ? 's' : ''})
        </span>
      </div>
    );
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
          <div className='bg-warning/20 rounded-xl p-2'>
            <Icon icon='solar:star-bold' className='text-warning h-5 w-5' />
          </div>
          <div>
            <h2 className='text-xl font-semibold'>View Testimonial</h2>
            <p className='text-foreground-500 text-sm'>Client feedback and testimonial details</p>
          </div>
        </ModalHeader>

        <ModalBody className='gap-4'>
          <div className='bg-warning/5 border-warning/20 rounded-lg border p-4'>
            <div className='mb-2 flex items-center gap-2'>
              <Icon icon='solar:info-circle-linear' className='text-warning h-5 w-5' />
              <span className='text-warning text-sm font-medium'>Read Only</span>
            </div>
            <p className='text-foreground-600 text-sm'>
              Testimonials are provided by clients and cannot be edited directly. You can only
              delete inappropriate testimonials.
            </p>
          </div>

          {renderStarRating()}

          <Textarea
            label='Testimonial'
            value={formData.testimony}
            onValueChange={(value) => handleInputChange('testimony', value)}
            minRows={4}
            variant='bordered'
            disabled={true}
            description='What the client said about working with you'
          />

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Input
              label='Client Name'
              value={formData.name}
              onValueChange={(value) => handleInputChange('name', value)}
              variant='bordered'
              disabled={true}
            />

            <Input
              label='Client Email'
              type='email'
              value={formData.email}
              onValueChange={(value) => handleInputChange('email', value)}
              variant='bordered'
              disabled={true}
            />
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Input
              label='Company'
              value={formData.companyName}
              onValueChange={(value) => handleInputChange('companyName', value)}
              variant='bordered'
              disabled={true}
            />

            <Input
              label='Position'
              value={formData.position}
              onValueChange={(value) => handleInputChange('position', value)}
              variant='bordered'
              disabled={true}
            />
          </div>

          {testimonial?.status && (
            <div className='flex items-center gap-2'>
              <span className='text-foreground-700 text-sm font-medium'>Status:</span>
              <Chip
                color={
                  testimonial.status === 'ACTIVE'
                    ? 'success'
                    : testimonial.status === 'PENDING'
                      ? 'warning'
                      : 'default'
                }
                variant='flat'
                size='sm'
              >
                {testimonial.status}
              </Chip>
            </div>
          )}
        </ModalBody>

        <ModalFooter className='gap-3'>
          <Button variant='light' onPress={handleClose} disabled={isLoading}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TestimonialModal;
