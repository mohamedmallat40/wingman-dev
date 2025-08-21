'use client';

import React, { useEffect, useMemo, useState } from 'react';

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
  SelectItem,
  Tab,
  Tabs
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useUpload } from '@root/modules/documents/hooks/useUpload';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import frLocale from 'i18n-iso-countries/langs/fr.json';
import nlLocale from 'i18n-iso-countries/langs/nl.json';
import { useTranslations } from 'next-intl';

import { getUserInitials } from '@/app/private/talent-pool/utils/talent-utilities';
import wingManApi from '@/lib/axios';
import { getImageUrl } from '@/lib/utils/utilities';

// Register locales
countries.registerLocale(enLocale);
countries.registerLocale(frLocale);
countries.registerLocale(nlLocale);

// Status options
export const statuses = ['OPEN_FOR_PROJECT', 'OPEN_FOR_PART_TIME', 'NOT_AVAILABLE'];

// Work type options
const workTypes = ['REMOTE', 'HYBRID', 'ON_SITE'];

// Working time options
const workingTimes = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE'];

interface UploadResponse {
  filename: string;
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
  statusAviability?: string;
  profileImage?: string;
}

interface AddressData {
  VATNumber?: string;
  companyName?: string;
  street: string;
  houseNumber: string;
  city: string;
  postalCode: string;
  country: string;
  countryCode: string;
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
  const locale = 'en'; // You can get this from your app's locale context

  // Country list using i18n-iso-countries
  const countryList = useMemo(() => {
    const countryObject = countries.getNames(locale);
    return Object.entries(countryObject)
      .map(([code, name]) => ({
        code,
        name
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [locale]);

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
    statusAviability: user.statusAviability ?? 'OPEN_FOR_PROJECT'
  });

  // Address form state
  const [addressData, setAddressData] = useState<AddressData>({
    VATNumber: '',
    companyName: '',
    street: '',
    houseNumber: '',
    city: '',
    postalCode: '',
    country: '',
    countryCode: ''
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
  const [isAddressUpdating, setIsAddressUpdating] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState('personal');

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
        statusAviability: user.statusAviability || 'OPEN_FOR_PROJECT'
      });
      setCurrentProfileImage(user.profileImage || null);
      setSelectedFile(null);
      setImagePreview(null);
      setActiveTab('personal');

      // Fetch and populate address data
      fetchAddressData();
    }
  }, [isOpen, user]);

  // Fetch address data from API
  const fetchAddressData = async () => {
    setIsLoadingAddresses(true);
    try {
      const response = await wingManApi.get('/address');
      const addresses = response.data;

      // Find the last BILLING address
      const billingAddresses = addresses.filter((addr: any) => addr.type === 'BILLING');
      const lastBillingAddress = billingAddresses[billingAddresses.length - 1];

      if (lastBillingAddress) {
        setAddressData({
          VATNumber: lastBillingAddress.VATNumber || '',
          companyName: lastBillingAddress.companyName || '',
          street: lastBillingAddress.street || '',
          houseNumber: lastBillingAddress.houseNumber || '',
          city: lastBillingAddress.city || '',
          postalCode: lastBillingAddress.postalCode || '',
          country: lastBillingAddress.country || '',
          countryCode: lastBillingAddress.countryCode || ''
        });
      } else {
        // Reset to empty if no billing address found
        setAddressData({
          VATNumber: '',
          companyName: '',
          street: '',
          houseNumber: '',
          city: '',
          postalCode: '',
          country: '',
          countryCode: ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      // Reset to empty on error
      setAddressData({
        VATNumber: '',
        companyName: '',
        street: '',
        houseNumber: '',
        city: '',
        postalCode: '',
        country: '',
        countryCode: ''
      });
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  // Handle form field changes
  const handleInputChange = (field: string, value: string | number) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value
    }));
  };

  // Handle address field changes
  const handleAddressChange = (field: keyof AddressData, value: string) => {
    setAddressData((previous) => ({
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

  // Check if address has required fields filled
  const hasRequiredAddressFields = () => {
    return (
      addressData.street &&
      addressData.houseNumber &&
      addressData.city &&
      addressData.postalCode &&
      addressData.country &&
      addressData.countryCode
    );
  };

  // Handle address submission
  const handleAddressSubmit = async () => {
    if (!hasRequiredAddressFields()) {
      return;
    }

    setIsAddressUpdating(true);

    try {
      const addressPayload = {
        ...addressData,
        type: 'BILLING' // Always set type to BILLING
      };

      await wingManApi.post('/address', addressPayload);

      // Show success message or handle success
      console.log('Address saved successfully');
    } catch (error) {
      console.error('Failed to save address:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsAddressUpdating(false);
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
          const uploadResponse = await upload.uploadFileSingle(selectedFile);
          profileImageFilename = uploadResponse.fileName;
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
      if (formData.statusAviability !== user.statusAviability)
        updateData.statusAviability = formData.statusAviability;
      if (profileImageFilename !== user.profileImage)
        updateData.profileImage = profileImageFilename || '';

      // Only make API call if there are changes
      if (Object.keys(updateData).length > 0) {
        await wingManApi.patch('/users/me', updateData);
      }

      // Save address if it has required fields
      if (hasRequiredAddressFields()) {
        await handleAddressSubmit();
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
      size='3xl'
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
                <span>Edit Profile Information</span>
              </div>
            </ModalHeader>

            <ModalBody>
              <Tabs
                aria-label='Profile sections'
                selectedKey={activeTab}
                onSelectionChange={(key) => setActiveTab(key as string)}
                variant='underlined'
                classNames={{
                  tabList: 'gap-6 w-full relative rounded-none p-0 border-b border-divider',
                  cursor: 'w-full bg-primary',
                  tab: 'max-w-fit px-0 h-12',
                  tabContent: 'group-data-[selected=true]:text-primary'
                }}
              >
                <Tab
                  key='personal'
                  title={
                    <div className='flex items-center space-x-2'>
                      <Icon icon='solar:user-linear' className='h-4 w-4' />
                      <span>Personal Info</span>
                    </div>
                  }
                >
                  <div className='mt-4 space-y-6'>
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
                            ) : currentProfileImage ? (
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
                            )}
                          </div>

                          <div className='flex flex-col gap-2'>
                            <div className='flex gap-2'>
                              <Button
                                variant='flat'
                                color='primary'
                                size='sm'
                                startContent={
                                  <Icon icon='solar:upload-linear' className='h-4 w-4' />
                                }
                                onPress={() =>
                                  (
                                    document.querySelector(
                                      '#profile-image-input'
                                    ) as HTMLInputElement
                                  )?.click()
                                }
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
                          <Icon
                            icon='solar:home-wifi-linear'
                            className='text-default-400 h-4 w-4'
                          />
                        }
                        variant='bordered'
                      >
                        {workTypes.map((type) => (
                          <SelectItem key={type}>{getWorkTypeLabel(type)}</SelectItem>
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
                          <Icon
                            icon='solar:clock-circle-linear'
                            className='text-default-400 h-4 w-4'
                          />
                        }
                        variant='bordered'
                      >
                        {workingTimes.map((time) => (
                          <SelectItem key={time}>{getWorkingTimeLabel(time)}</SelectItem>
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
                          <Icon
                            icon='solar:buildings-2-linear'
                            className='text-default-400 h-4 w-4'
                          />
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
                          <Icon
                            icon='solar:map-point-linear'
                            className='text-default-400 h-4 w-4'
                          />
                        }
                        variant='bordered'
                      />
                    </div>

                    {/* Availability Status */}
                    <Select
                      label='Availability Status'
                      placeholder='Select your availability'
                      selectedKeys={[formData.statusAviability]}
                      onSelectionChange={(keys) => {
                        const value = [...keys][0] as string;
                        handleInputChange('statusAviability', value);
                      }}
                      startContent={
                        <Icon
                          icon='solar:check-circle-linear'
                          className='text-default-400 h-4 w-4'
                        />
                      }
                      variant='bordered'
                      isRequired
                    >
                      {statuses.map((status) => (
                        <SelectItem key={status}>{getStatusLabel(status)}</SelectItem>
                      ))}
                    </Select>
                  </div>
                </Tab>

                <Tab
                  key='address'
                  title={
                    <div className='flex items-center space-x-2'>
                      <Icon icon='solar:home-linear' className='h-4 w-4' />
                      <span>Billing Address</span>
                    </div>
                  }
                >
                  <Card className='mt-4 w-full bg-transparent'>
                    <CardBody className='p-0'>
                      {isLoadingAddresses ? (
                        <div className='flex items-center justify-center py-8'>
                          <div className='flex items-center gap-2'>
                            <Icon
                              icon='solar:refresh-linear'
                              className='text-primary h-5 w-5 animate-spin'
                            />
                            <span className='text-default-500'>Loading address information...</span>
                          </div>
                        </div>
                      ) : (
                        <div className='space-y-6'>
                          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            <Input
                              label='VAT Number'
                              placeholder='Enter VAT number (e.g., FR12345678901)'
                              value={addressData.VATNumber}
                              onValueChange={(value) => handleAddressChange('VATNumber', value)}
                              variant='bordered'
                              startContent={
                                <Icon
                                  icon='solar:document-text-linear'
                                  className='text-default-400 h-4 w-4'
                                />
                              }
                            />
                            <Input
                              label='Company Name'
                              placeholder='Enter company name (optional)'
                              value={addressData.companyName}
                              onValueChange={(value) => handleAddressChange('companyName', value)}
                              variant='bordered'
                              startContent={
                                <Icon
                                  icon='solar:buildings-linear'
                                  className='text-default-400 h-4 w-4'
                                />
                              }
                            />
                          </div>

                          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            <Input
                              label='Street'
                              placeholder='Enter street name'
                              value={addressData.street}
                              onValueChange={(value) => handleAddressChange('street', value)}
                              variant='bordered'
                              isRequired
                              startContent={
                                <Icon
                                  icon='solar:map-point-linear'
                                  className='text-default-400 h-4 w-4'
                                />
                              }
                            />
                            <Input
                              label='House Number'
                              placeholder='123'
                              value={addressData.houseNumber}
                              onValueChange={(value) => handleAddressChange('houseNumber', value)}
                              variant='bordered'
                              isRequired
                              startContent={
                                <Icon
                                  icon='solar:home-2-linear'
                                  className='text-default-400 h-4 w-4'
                                />
                              }
                            />
                          </div>

                          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                            <Input
                              label='City'
                              placeholder='Enter city name'
                              value={addressData.city}
                              onValueChange={(value) => handleAddressChange('city', value)}
                              variant='bordered'
                              isRequired
                              startContent={
                                <Icon
                                  icon='solar:buildings-2-linear'
                                  className='text-default-400 h-4 w-4'
                                />
                              }
                            />
                            <Input
                              label='Postal Code'
                              placeholder='12345'
                              value={addressData.postalCode}
                              onValueChange={(value) => handleAddressChange('postalCode', value)}
                              variant='bordered'
                              isRequired
                              startContent={
                                <Icon
                                  icon='solar:letter-linear'
                                  className='text-default-400 h-4 w-4'
                                />
                              }
                            />
                            <Input
                              label='Country Code'
                              placeholder='US'
                              value={addressData.countryCode}
                              onValueChange={(value) => handleAddressChange('countryCode', value)}
                              variant='bordered'
                              isRequired
                              startContent={
                                <Icon
                                  icon='solar:global-linear'
                                  className='text-default-400 h-4 w-4'
                                />
                              }
                            />
                          </div>

                          <Select
                            label='Country'
                            placeholder='Select country'
                            selectedKeys={addressData.country ? [addressData.country] : []}
                            onSelectionChange={(keys) => {
                              const selectedCountry = [...keys][0] as string;
                              if (selectedCountry) {
                                const countryCode = countryList.find(
                                  (c) => c.name === selectedCountry
                                )?.code;
                                handleAddressChange('country', selectedCountry);
                                if (countryCode) {
                                  handleAddressChange('countryCode', countryCode);
                                }
                              }
                            }}
                            variant='bordered'
                            isRequired
                            startContent={
                              <Icon icon='solar:flag-linear' className='text-default-400 h-4 w-4' />
                            }
                          >
                            {countryList.map((country) => (
                              <SelectItem key={country.name}>{country.name}</SelectItem>
                            ))}
                          </Select>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </Tab>
              </Tabs>
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
