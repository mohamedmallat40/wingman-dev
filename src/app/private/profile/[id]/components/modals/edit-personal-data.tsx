'use client';

import React, { useEffect, useState } from 'react';

import {
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useUpload } from '@root/modules/documents/hooks/useUpload';
import { useTranslations } from 'next-intl';

import { getUserInitials } from '@/app/private/talent-pool/utils/talent-utils';
import wingManApi from '@/lib/axios';
import { getImageUrl } from '@/lib/utils/utilities';

// Status options
export const statuses = ['OPEN_FOR_PROJECT', 'OPEN_FOR_PART_TIME', 'NOT_AVAILABLE'];

// Work type options
const workTypes = ['REMOTE', 'HYBRID', 'ON_SITE'];

// Working time options
const workingTimes = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE'];

interface UploadResponse {
  filename: string;
  url: string;
}

interface ProfileUser {
  id: string;
  firstName: string;
  lastName: string;
  profession?: string;
  workType?: string;
  workingTime?: string;
  experienceYears?: number;
  city?: string;
  region?: string;
  statusAvailability?: string;
  profileImage?: string;
}

interface EditPersonalDataModalProperties {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: ProfileUser;
  onSuccess: () => void;
}

const EditPersonalDataModal: React.FC<EditPersonalDataModalProperties> = ({
  isOpen,
  onOpenChange,
  user,
  onSuccess
}) => {
  const t = useTranslations();
  const upload = useUpload();

  // Form state
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    profession: user.profession ?? '',
    workType: user.workType ?? '',
    workingTime: user.workingTime ?? '',
    experienceYears: user.experienceYears ?? 0,
    city: user.city ?? '',
    region: user.region ?? '',
    statusAvailability: user.statusAvailability ?? 'OPEN_FOR_PROJECT'
  });

  // Image state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentProfileImage, setCurrentProfileImage] = useState<string | null>(
    user.profileImage ?? null
  );

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Reset form when modal opens/closes or user changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        profession: user.profession || '',
        workType: user.workType || '',
        workingTime: user.workingTime || '',
        experienceYears: user.experienceYears || 0,
        city: user.city || '',
        region: user.region || '',
        statusAvailability: user.statusAvailability || 'OPEN_FOR_PROJECT'
      });
      setCurrentProfileImage(user.profileImage || null);
      setSelectedFile(null);
      setImagePreview(null);
    }
  }, [isOpen, user]);

  // Handle form field changes
  const handleInputChange = (field: string, value: string | number) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value
    }));
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.addEventListener('load', (e) => {
        setImagePreview(e.target?.result as string);
      });
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'OPEN_FOR_PROJECT': {
        return 'Open for Projects';
      }
      case 'OPEN_FOR_PART_TIME': {
        return 'Open for Part-time';
      }
      case 'NOT_AVAILABLE': {
        return 'Not Available';
      }
      default: {
        return status;
      }
    }
  };

  // Get work type label
  const getWorkTypeLabel = (type: string) => {
    switch (type) {
      case 'REMOTE': {
        return 'Remote';
      }
      case 'HYBRID': {
        return 'Hybrid';
      }
      case 'ON_SITE': {
        return 'On-site';
      }
      default: {
        return type;
      }
    }
  };

  // Get working time label
  const getWorkingTimeLabel = (time: string) => {
    switch (time) {
      case 'FULL_TIME': {
        return 'Full-time';
      }
      case 'PART_TIME': {
        return 'Part-time';
      }
      case 'CONTRACT': {
        return 'Contract';
      }
      case 'FREELANCE': {
        return 'Freelance';
      }
      default: {
        return time;
      }
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      let profileImageFilename = currentProfileImage;

      // Upload new image if selected
      if (selectedFile) {
        setIsUploadingImage(true);
        try {
          const uploadResponse = (await upload.uploadeFileSingle(selectedFile)) as UploadResponse;
          profileImageFilename = uploadResponse.filename;
        } catch (error) {
          console.error('Image upload failed:', error);
          // Continue with form submission even if image upload fails
        }
        setIsUploadingImage(false);
      }

      // Prepare update data - only include changed fields
      const updateData: Partial<ProfileUser & { profileImage: string }> = {};

      if (formData.firstName !== user.firstName) updateData.firstName = formData.firstName;
      if (formData.lastName !== user.lastName) updateData.lastName = formData.lastName;
      if (formData.profession !== user.profession) updateData.profession = formData.profession;
      if (formData.workType !== user.workType) updateData.workType = formData.workType;
      if (formData.workingTime !== user.workingTime) updateData.workingTime = formData.workingTime;
      if (formData.experienceYears !== user.experienceYears)
        updateData.experienceYears = formData.experienceYears;
      if (formData.city !== user.city) updateData.city = formData.city;
      if (formData.region !== user.region) updateData.region = formData.region;
      if (formData.statusAvailability !== user.statusAvailability)
        updateData.statusAvailability = formData.statusAvailability;
      if (profileImageFilename !== user.profileImage)
        updateData.profileImage = profileImageFilename || '';

      // Only make API call if there are changes
      if (Object.keys(updateData).length > 0) {
        await wingManApi.patch('/users/me', updateData);
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
      setIsUploadingImage(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size='2xl'
      scrollBehavior='inside'
      classNames={{
        backdrop: 'bg-background/80 backdrop-blur-sm',
        base: 'border-default-200 bg-background',
        header: 'border-b border-default-200',
        body: 'py-6',
        footer: 'border-t border-default-200'
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              <div className='flex items-center gap-2'>
                <Icon icon='solar:user-edit-linear' className='text-primary h-5 w-5' />
                <span>Edit Personal Information</span>
              </div>
            </ModalHeader>

            <ModalBody>
              <div className='space-y-6'>
                {/* Profile Image Section */}
                <Card className='border-default-200'>
                  <CardBody className='p-4'>
                    <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold'>
                      <Icon icon='solar:camera-linear' className='h-4 w-4' />
                      Profile Picture
                    </h3>

                    <div className='flex items-center gap-4'>
                      {/* Current/Preview Image */}
                      <div className='relative'>
                        {imagePreview ? (
                          <div className='ring-primary/20 h-24 w-24 overflow-hidden rounded-xl bg-gradient-to-br shadow-lg ring-2'>
                            <img
                              src={imagePreview}
                              alt='Preview'
                              className='h-full w-full object-cover'
                            />
                          </div>
                        ) : (currentProfileImage ? (
                          <div className='ring-primary/20 h-24 w-24 overflow-hidden rounded-xl bg-gradient-to-br shadow-lg ring-2'>
                            <img
                              src={getImageUrl(currentProfileImage)}
                              alt='Current profile'
                              className='h-full w-full object-cover'
                            />
                          </div>
                        ) : (
                          <div className='ring-primary/20 from-primary-200 to-secondary-200 text-primary-800 flex h-24 w-24 items-center justify-center rounded-xl bg-gradient-to-br text-2xl font-bold shadow-lg ring-2'>
                            {getUserInitials(formData.firstName, formData.lastName)}
                          </div>
                        ))}
                      </div>

                      <div className='flex flex-col gap-2'>
                        <div className='flex gap-2'>
                          <Button
                            variant='flat'
                            color='primary'
                            size='sm'
                            startContent={<Icon icon='solar:upload-linear' className='h-4 w-4' />}
                            onPress={() => document.querySelector('#profile-image-input')?.click()}
                            isLoading={isUploadingImage}
                          >
                            Upload New
                          </Button>
                        </div>

                        <p className='text-default-500 text-xs'>
                          Recommended: Square image, at least 200x200px
                        </p>
                      </div>
                    </div>

                    <input
                      id='profile-image-input'
                      type='file'
                      accept='image/*'
                      onChange={handleFileSelect}
                      className='hidden'
                    />
                  </CardBody>
                </Card>

                {/* Personal Information */}
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <Input
                    label='First Name'
                    placeholder='Enter your first name'
                    value={formData.firstName}
                    onValueChange={(value) => {
                      handleInputChange('firstName', value);
                    }}
                    startContent={
                      <Icon icon='solar:user-linear' className='text-default-400 h-4 w-4' />
                    }
                    variant='bordered'
                    isRequired
                  />

                  <Input
                    label='Last Name'
                    placeholder='Enter your last name'
                    value={formData.lastName}
                    onValueChange={(value) => {
                      handleInputChange('lastName', value);
                    }}
                    startContent={
                      <Icon icon='solar:user-linear' className='text-default-400 h-4 w-4' />
                    }
                    variant='bordered'
                    isRequired
                  />
                </div>

                <Input
                  label='Profession'
                  placeholder='Enter your profession'
                  value={formData.profession}
                  onValueChange={(value) => {
                    handleInputChange('profession', value);
                  }}
                  startContent={
                    <Icon icon='solar:briefcase-linear' className='text-default-400 h-4 w-4' />
                  }
                  variant='bordered'
                />

                {/* Work Information */}
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <Select
                    label='Work Type'
                    placeholder='Select work type'
                    selectedKeys={formData.workType ? [formData.workType] : []}
                    onSelectionChange={(keys) => {
                      const value = [...keys][0] as string;
                      handleInputChange('workType', value);
                    }}
                    startContent={
                      <Icon icon='solar:home-wifi-linear' className='text-default-400 h-4 w-4' />
                    }
                    variant='bordered'
                  >
                    {workTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {getWorkTypeLabel(type)}
                      </SelectItem>
                    ))}
                  </Select>

                  <Select
                    label='Working Time'
                    placeholder='Select working time'
                    selectedKeys={formData.workingTime ? [formData.workingTime] : []}
                    onSelectionChange={(keys) => {
                      const value = [...keys][0] as string;
                      handleInputChange('workingTime', value);
                    }}
                    startContent={
                      <Icon icon='solar:clock-circle-linear' className='text-default-400 h-4 w-4' />
                    }
                    variant='bordered'
                  >
                    {workingTimes.map((time) => (
                      <SelectItem key={time} value={time}>
                        {getWorkingTimeLabel(time)}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <Input
                  label='Years of Experience'
                  placeholder='Enter years of experience'
                  type='number'
                  value={formData.experienceYears.toString()}
                  onValueChange={(value) => {
                    handleInputChange('experienceYears', Number.parseInt(value) || 0);
                  }}
                  startContent={
                    <Icon icon='solar:medal-star-linear' className='text-default-400 h-4 w-4' />
                  }
                  variant='bordered'
                  min='0'
                  max='50'
                />

                {/* Location Information */}
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <Input
                    label='City'
                    placeholder='Enter your city'
                    value={formData.city}
                    onValueChange={(value) => {
                      handleInputChange('city', value);
                    }}
                    startContent={
                      <Icon icon='solar:buildings-2-linear' className='text-default-400 h-4 w-4' />
                    }
                    variant='bordered'
                  />

                  <Input
                    label='Region/Country'
                    placeholder='Enter your region or country'
                    value={formData.region}
                    onValueChange={(value) => {
                      handleInputChange('region', value);
                    }}
                    startContent={
                      <Icon icon='solar:map-point-linear' className='text-default-400 h-4 w-4' />
                    }
                    variant='bordered'
                  />
                </div>

                {/* Availability Status */}
                <Select
                  label='Availability Status'
                  placeholder='Select your availability'
                  selectedKeys={[formData.statusAvailability]}
                  onSelectionChange={(keys) => {
                    const value = [...keys][0] as string;
                    handleInputChange('statusAvailability', value);
                  }}
                  startContent={
                    <Icon icon='solar:check-circle-linear' className='text-default-400 h-4 w-4' />
                  }
                  variant='bordered'
                  isRequired
                >
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {getStatusLabel(status)}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button variant='light' onPress={onClose} isDisabled={isLoading}>
                Cancel
              </Button>
              <Button
                color='primary'
                onPress={handleSubmit}
                isLoading={isLoading}
                startContent={
                  isLoading ? null : <Icon icon='solar:check-linear' className='h-4 w-4' />
                }
              >
                {isLoading ? 'Saving Changes...' : 'Save Changes'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditPersonalDataModal;
