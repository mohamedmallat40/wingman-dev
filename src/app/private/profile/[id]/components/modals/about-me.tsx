import React, { useEffect, useState } from 'react';

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea
} from '@heroui/react';
import { Icon } from '@iconify/react';

import wingManApi from '@/lib/axios';

interface AboutMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAboutMe?: string;
  onSuccess: (updatedAboutMe: string) => void;
  addToast: (message: string, type: 'success' | 'error') => void;
}

const AboutMeModal: React.FC<AboutMeModalProps> = ({
  isOpen,
  onClose,
  currentAboutMe = '',
  onSuccess,
  addToast
}) => {
  const [aboutMe, setAboutMe] = useState(currentAboutMe);
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Update local state when currentAboutMe changes
  useEffect(() => {
    setAboutMe(currentAboutMe);
    setIsDirty(false);
  }, [currentAboutMe, isOpen]);

  const handleAboutMeChange = (value: string) => {
    setAboutMe(value);
    setIsDirty(value !== currentAboutMe);
  };

  const handleSave = async () => {
    if (!isDirty) {
      onClose();
      return;
    }

    setIsLoading(true);

    try {
      const response = await wingManApi.patch('/users/me', {
        aboutMe: aboutMe.trim()
      });

      addToast('About me updated successfully', 'success');
      onSuccess(aboutMe.trim());
      onClose();
    } catch (error: any) {
      console.error('Error updating about me:', error);

      let errorMessage = 'Failed to update about me';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid data provided. Please check your input.';
      } else if (error.response?.status === 401) {
        errorMessage = 'You are not authorized to update this profile.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      addToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isDirty) {
      const confirmClose = window.confirm(
        'You have unsaved changes. Are you sure you want to close without saving?'
      );
      if (!confirmClose) return;
    }

    setAboutMe(currentAboutMe);
    setIsDirty(false);
    onClose();
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
          <div className='bg-primary/20 rounded-xl p-2'>
            <Icon icon='solar:user-speak-linear' className='text-primary h-5 w-5' />
          </div>
          <div>
            <h2 className='text-xl font-semibold'>Edit About Me</h2>
            <p className='text-foreground-500 text-sm'>
              Tell others about yourself, your experience, and what you're passionate about
            </p>
          </div>
        </ModalHeader>

        <ModalBody className='gap-4'>
          <div className='space-y-2'>
            <label className='text-foreground-700 text-sm font-medium'>About Me</label>
            <Textarea
              value={aboutMe}
              onValueChange={handleAboutMeChange}
              placeholder='Tell us about yourself, your experience, skills, and what makes you unique...'
              minRows={6}
              maxRows={12}
              variant='bordered'
              classNames={{
                input: 'text-sm leading-relaxed',
                inputWrapper: 'border-default-200 hover:border-primary focus-within:border-primary'
              }}
              disabled={isLoading}
            />
            <div className='flex items-center justify-between'>
              <p className='text-foreground-400 text-xs'>
                Share your professional background, interests, and what you're looking for
              </p>
              <p className='text-foreground-400 text-xs'>{aboutMe.length} characters</p>
            </div>
          </div>

          {/* Preview Section */}
          {aboutMe.trim() && (
            <div className='space-y-2'>
              <label className='text-foreground-700 text-sm font-medium'>Preview</label>
              <div className='bg-default-50 border-default-200 rounded-lg border p-4'>
                <p className='text-foreground-600 text-sm leading-relaxed whitespace-pre-wrap'>
                  {aboutMe.trim()}
                </p>
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter className='gap-3'>
          <Button variant='light' onPress={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            color='primary'
            onPress={handleSave}
            disabled={isLoading || !isDirty}
            startContent={
              isLoading ? (
                <Spinner size='sm' color='white' />
              ) : isDirty ? (
                <Icon icon='solar:check-linear' className='h-4 w-4' />
              ) : (
                <Icon icon='solar:check-linear' className='h-4 w-4 opacity-50' />
              )
            }
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AboutMeModal;
