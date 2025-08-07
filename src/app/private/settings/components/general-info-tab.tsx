import { useMemo } from 'react';

import type {
  AddressFormData,
  GeneralInfoFormData,
  LanguagesFormData,
  SkillsFormData
} from '@root/modules/settings/schema/settings.schema';

import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
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
import { type ILanguage, type IUserProfile } from '@root/modules/profile/types';
import useSettings from '@root/modules/settings/hooks/use-settings';
import {
  addressSchema,
  generalInfoSchema,
  languagesSchema,
  skillsSchema
} from '@root/modules/settings/schema/settings.schema';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import frLocale from 'i18n-iso-countries/langs/fr.json';
import nlLocale from 'i18n-iso-countries/langs/nl.json';
import ISO6391 from 'iso-639-1';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useFieldArray, useForm } from 'react-hook-form';
import { getBaseUrl } from '@/lib/utils/utilities';

// Register locales
countries.registerLocale(enLocale);
countries.registerLocale(frLocale);
countries.registerLocale(nlLocale);

interface GeneralInfoTabProperties {
  user: IUserProfile;
  languages: ILanguage[];
}

const levelOptions = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'PROFESSIONAL', label: 'Professional' },
  { value: 'NATIVE', label: 'Native' }
];

export default function GeneralInfoTab({ user, languages }: Readonly<GeneralInfoTabProperties>) {
  const locale = useLocale();
  const t = useTranslations();

  const {
    updateGeneralInfo,
    createLanguage,
    deleteLanguage,
    isUpdatingGeneralInfo,
    isCreatingLanguage,
    isDeletingLanguage,
    updateAddress,
    isAddressUpdating,
    useAllSkills
  } = useSettings(user.id);

  const generalForm = useForm<GeneralInfoFormData>({
    resolver: zodResolver(generalInfoSchema.partial()),
    defaultValues: {
      ...user,
      address:
        user.address.length > 0
          ? user.address[0]
          : {
              street: '',
              houseNumber: '',
              city: '',
              country: '',
              postalCode: '',
              countryCode: '',
              VATNumber: '',
              companyName: '',
              type: undefined
            }
    }
  });

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address:
        user.address.length > 0
          ? user.address[0]
          : {
              street: '',
              houseNumber: '',
              city: '',
              country: '',
              postalCode: '',
              countryCode: '',
              VATNumber: '',
              companyName: '',
              type: undefined
            }
    }
  });

  const skillsForm = useForm<SkillsFormData>({
    resolver: zodResolver(skillsSchema),
    defaultValues: { skills: user.skills }
  });

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill
  } = useFieldArray({
    control: skillsForm.control,
    name: 'skills'
  });
  const languagesForm = useForm<LanguagesFormData>({
    resolver: zodResolver(languagesSchema),
    defaultValues: {
      languages: languages
    }
  });

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage
  } = useFieldArray({
    control: languagesForm.control,
    name: 'languages'
  });

  const watchedGeneralValues = generalForm.watch();
  const watchedSkillsValues = skillsForm.watch();
  const watchedAddressValues = addressForm.watch();

  // Get country list
  const countryList = useMemo(() => {
    const countryObject = countries.getNames(locale);
    return Object.entries(countryObject)
      .map(([code, name]) => ({
        code,
        name
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [locale]);

  // Check if general info form has changes (excluding address)
  const hasGeneralInfoChanges = useMemo(() => {
    if (!user) return false;

    const currentValues = watchedGeneralValues;

    return (
      currentValues.firstName !== user.firstName ||
      currentValues.lastName !== user.lastName ||
      currentValues.profileImage !== user.profileImage ||
      currentValues.aboutMe !== user.aboutMe ||
      currentValues.experienceYears !== user.experienceYears ||
      currentValues.hourlyRate !== user.hourlyRate ||
      currentValues.dailyRate !== user.dailyRate ||
      currentValues.paymentType !== user.paymentType ||
      currentValues.phoneNumber !== user.phoneNumber ||
      currentValues.linkedinProfile !== user.linkedinProfile ||
      currentValues.profileWebsite !== user.profileWebsite
    );
  }, [watchedGeneralValues, user]);

  // Check if address form has changes
  const hasAddressChanges = useMemo(() => {
    if (!user) return false;

    const currentValues = watchedAddressValues;
    const userAddress = user.address && user.address.length > 0 ? user.address[0] : {};

    return (
      currentValues.address?.street !== (userAddress.street || '') ||
      currentValues.address?.houseNumber !== (userAddress.houseNumber || '') ||
      currentValues.address?.city !== (userAddress.city || '') ||
      currentValues.address?.country !== (userAddress.country || '') ||
      currentValues.address?.postalCode !== (userAddress.postalCode || '') ||
      currentValues.address?.countryCode !== (userAddress.countryCode || '') ||
      currentValues.address?.VATNumber !== (userAddress.VATNumber || '') ||
      currentValues.address?.companyName !== (userAddress.companyName || '')
    );
  }, [watchedAddressValues, user]);

  const hasSkillsChanges = useMemo(() => {
    if (!user.skills || !watchedSkillsValues.skills) return false;

    const currentSkills = watchedSkillsValues.skills;
    const originalSkills = user.skills;

    // Check if there are any new skills (temp_ IDs or skills that weren't in original)
    const hasNewSkills = currentSkills.some(
      (skill) =>
        !skill.id ||
        skill.id.startsWith('temp_') ||
        !originalSkills.find((original) => original.id === skill.id)
    );

    // Check if any original skills were removed
    const hasRemovedSkills = originalSkills.some(
      (original) => !currentSkills.find((current) => current.id === original.id)
    );

    // Check if there are valid new skills (not empty)
    const hasValidNewSkills = currentSkills.some(
      (skill) => (!skill.id || skill.id.startsWith('temp_')) && skill.key && skill.key.trim() !== ''
    );

    return hasNewSkills || hasRemovedSkills || hasValidNewSkills;
  }, [watchedSkillsValues.skills, user.skills]);

  const hasLanguagesChanges = useMemo(() => {
    if (!languages || !languagesForm.watch('languages')) return false;

    const currentLanguages = languagesForm.watch('languages');
    const originalLanguages = languages;

    // Check if there are any new languages (temp_ IDs or languages that weren't in original)
    const hasNewLanguages = currentLanguages.some(
      (lang) =>
        !lang.id ||
        lang.id.startsWith('temp_') ||
        !originalLanguages.find((original) => original.id === lang.id)
    );

    // Check if any original languages were removed
    const hasRemovedLanguages = originalLanguages.some(
      (original) => !currentLanguages.find((current) => current.id === original.id)
    );

    // Check if there are valid new languages (not empty)
    const hasValidNewLanguages = currentLanguages.some(
      (lang) =>
        (!lang.id || lang.id.startsWith('temp_')) &&
        lang.key &&
        lang.key.trim() !== '' &&
        lang.level
    );

    return hasNewLanguages || hasRemovedLanguages || hasValidNewLanguages;
  }, [languagesForm.watch('languages'), languages]);

  // Helper function to get only changed fields
  const getChangedGeneralInfoFields = (data: GeneralInfoFormData) => {
    const changes: Partial<GeneralInfoFormData> = {};

    if (data.firstName !== user.firstName) changes.firstName = data.firstName;
    if (data.lastName !== user.lastName) changes.lastName = data.lastName;
    if (data.profileImage !== user.profileImage) changes.profileImage = data.profileImage;
    if (data.aboutMe !== user.aboutMe) changes.aboutMe = data.aboutMe;
    if (data.experienceYears !== user.experienceYears)
      changes.experienceYears = data.experienceYears;
    if (data.paymentType !== user.paymentType) changes.paymentType = data.paymentType;
    if (data.phoneNumber !== user.phoneNumber) changes.phoneNumber = data.phoneNumber;
    if (data.linkedinProfile !== user.linkedinProfile)
      changes.linkedinProfile = data.linkedinProfile;
    if (data.profileWebsite !== user.profileWebsite) changes.profileWebsite = data.profileWebsite;

    // Handle rate fields based on payment type
    if (data.paymentType === 'HOURLY_BASED') {
      if (data.hourlyRate !== user.hourlyRate) {
        changes.hourlyRate = data.hourlyRate;
      }
      // Always set dailyRate to 0 when switching to hourly
      if (user.dailyRate && user.dailyRate > 0) {
        changes.dailyRate = 5;
      }
    }
    if (data.paymentType === 'DAILY_BASED') {
      if (data.dailyRate !== user.dailyRate) {
        changes.dailyRate = data.dailyRate;
      }
      if (user.hourlyRate && user.hourlyRate > 0) {
        changes.hourlyRate = 5;
      }
    }

    return changes;
  };

  const onSubmitGeneral = async (data: GeneralInfoFormData) => {
    const changedFields = getChangedGeneralInfoFields(data);
    if (Object.keys(changedFields).length > 0) {
      updateGeneralInfo(changedFields);
    }
  };

  // Get current payment type to show appropriate rate field
  const currentPaymentType = generalForm.watch('paymentType');

  const onSubmitAddress = async () => {
    const addressData = addressForm.getValues('address');
    if (addressData) {
      // Set type as 'billing' when saving address
      const addressWithType = { ...addressData, type: 'billing' as const };
      updateAddress(addressWithType);
    }
  };

  const onSubmitSkills = async (data: SkillsFormData) => {
    // Combine existing skills (that weren't removed) with new skills
    const existingSkills = data.skills
      .filter((skill) => skill.id && !skill.id.startsWith('temp_') && skill.key.trim() !== '')
      .map((skill) => skill.id);

    const newSkills = data.skills
      .filter((skill) => (!skill.id || skill.id.startsWith('temp_')) && skill.key.trim() !== '')
      .map((skill) => skill.id);

    const allSkillIds = [...existingSkills, ...newSkills].filter(Boolean);

    updateGeneralInfo({ skills: allSkillIds });
  };

  const handleRemoveSkill = async (skillIndex: number) => {
    const currentSkills = skillsForm.getValues('skills');
    const skillToRemove = currentSkills[skillIndex];

    // Remove from form array
    removeSkill(skillIndex);

    // If it's an existing skill (has a real ID), update the backend immediately
    if (skillToRemove?.id && !skillToRemove.id.startsWith('temp_')) {
      const remainingSkills = currentSkills
        .filter((_, index) => index !== skillIndex)
        .filter((skill) => skill.key.trim() !== '')
        .map((skill) => skill.id)
        .filter(Boolean);

      updateGeneralInfo({ skills: remainingSkills });
    }
  };

  const getLanguageCode = (name: string): string => {
    const code = ISO6391.getCode(name);
    return code || name; // fallback to name if not found
  };

  const onSubmitLanguages = async (data: LanguagesFormData) => {
    // Send only new languages to be created
    const newLanguages = data.languages
      .filter((lang) => (!lang.id || lang.id.startsWith('temp_')) && lang.key.trim() !== '')
      .map((lang) => ({
        key: getLanguageCode(lang.key).toUpperCase(),
        level: lang.level
      }));

    if (newLanguages.length > 0) {
      try {
        // Create each new language individually
        for (const newLanguage of newLanguages) {
          await createLanguage(newLanguage);
        }

        languagesForm.reset({ languages: data.languages });
      } catch (error) {
        console.error('Error creating languages:', error);
        // Handle error appropriately
      }
    }
  };

  const handleDeleteLanguage = (languageId: string, fieldIndex: number) => {
    const languageData = languagesForm.getValues(`languages.${fieldIndex}`);
    const actualLanguageId = languageData.id;

    if (actualLanguageId && !actualLanguageId.startsWith('temp_')) {
      deleteLanguage(actualLanguageId);
    }
    removeLanguage(fieldIndex);
  };

  const onError = (errors: unknown) => {
    console.log('=== FORM VALIDATION ERRORS ===');
    console.log('Form errors:', errors);
  };

  return (
    <div className='space-y-8'>
      {/* General Information */}
      <Card className='w-full bg-transparent'>
        <CardHeader>
          <h3 className='text-xl font-semibold'>Personal Information</h3>
        </CardHeader>
        <CardBody>
          <form onSubmit={generalForm.handleSubmit(onSubmitGeneral, onError)} className='space-y-6'>
            <div className='flex items-center gap-6'>
              <Avatar
                src={`${getBaseUrl()}/upload/${generalForm.watch('profileImage')}`}
                className='h-24 w-24'
              />
              <div className='flex-1'>
                <Input
                  {...generalForm.register('profileImage')}
                  label='Avatar URL'
                  placeholder='https://example.com/profileImage.jpg'
                  errorMessage={generalForm.formState.errors.profileImage?.message}
                  isInvalid={!!generalForm.formState.errors.profileImage}
                />
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <Input
                {...generalForm.register('firstName')}
                label='First Name'
                placeholder='Enter your first name'
                errorMessage={generalForm.formState.errors.firstName?.message}
                isInvalid={!!generalForm.formState.errors.firstName}
              />
              <Input
                {...generalForm.register('lastName')}
                label='Last Name'
                placeholder='Enter your last name'
                errorMessage={generalForm.formState.errors.lastName?.message}
                isInvalid={!!generalForm.formState.errors.lastName}
              />
            </div>

            <Textarea
              {...generalForm.register('aboutMe')}
              label='About Me'
              placeholder='Tell us about yourself...'
              minRows={4}
              errorMessage={generalForm.formState.errors.aboutMe?.message}
              isInvalid={!!generalForm.formState.errors.aboutMe}
            />

            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <Input
                {...generalForm.register('experienceYears', { valueAsNumber: true })}
                type='number'
                label='Years of Experience'
                placeholder='5'
                errorMessage={generalForm.formState.errors.experienceYears?.message}
                isInvalid={!!generalForm.formState.errors.experienceYears}
              />

              <Select
                {...generalForm.register('paymentType')}
                label='Payment Type'
                placeholder='Select payment type'
                selectedKeys={[generalForm.watch('paymentType')]}
                onSelectionChange={(keys) => {
                  const value = [...keys][0] as string;
                  generalForm.setValue(
                    'paymentType',
                    value as 'DAILY_BASED' | 'HOURLY_BASED' | 'PROJECT'
                  );

                  // Reset the opposite rate field to 0
                  if (value === 'DAILY_BASED') {
                    generalForm.setValue('hourlyRate', 0);
                  } else if (value === 'HOURLY_BASED') {
                    generalForm.setValue('dailyRate', 0);
                  }
                }}
              >
                <SelectItem key='HOURLY_BASED'>Hourly</SelectItem>
                <SelectItem key='DAILY_BASED'>Daily</SelectItem>
                <SelectItem key='PROJECT'>Project</SelectItem>
              </Select>

              {/* Dynamic Rate Field based on Payment Type */}
              {currentPaymentType === 'HOURLY_BASED' && (
                <Input
                  {...generalForm.register('hourlyRate', { valueAsNumber: true })}
                  type='number'
                  label='Hourly Rate ($)'
                  placeholder='85'
                  errorMessage={generalForm.formState.errors.hourlyRate?.message}
                  isInvalid={!!generalForm.formState.errors.hourlyRate}
                />
              )}

              {currentPaymentType === 'DAILY_BASED' && (
                <Input
                  {...generalForm.register('dailyRate', { valueAsNumber: true })}
                  type='number'
                  label='Daily Rate ($)'
                  placeholder='680'
                  errorMessage={generalForm.formState.errors.dailyRate?.message}
                  isInvalid={!!generalForm.formState.errors.dailyRate}
                />
              )}
            </div>

            {/* Contact Information */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <Input
                {...generalForm.register('phoneNumber')}
                label='Phone Number'
                placeholder='+1 (555) 123-4567'
                errorMessage={generalForm.formState.errors.phoneNumber?.message}
                isInvalid={!!generalForm.formState.errors.phoneNumber}
              />
              <Input
                {...generalForm.register('linkedinProfile')}
                label='LinkedIn Profile'
                placeholder='https://linkedin.com/in/yourprofile'
                errorMessage={generalForm.formState.errors.linkedinProfile?.message}
                isInvalid={!!generalForm.formState.errors.linkedinProfile}
              />
            </div>

            <Input
              {...generalForm.register('profileWebsite')}
              label='Personal Website'
              placeholder='https://yourwebsite.com'
              errorMessage={generalForm.formState.errors.profileWebsite?.message}
              isInvalid={!!generalForm.formState.errors.profileWebsite}
            />

            <Button
              type='submit'
              color='primary'
              isLoading={isUpdatingGeneralInfo}
              isDisabled={!hasGeneralInfoChanges || isUpdatingGeneralInfo}
              startContent={<Save size={18} />}
            >
              Save Personal Information
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* Address Information */}
      <Card className='w-full bg-transparent'>
        <CardHeader>
          <h3 className='text-xl font-semibold'>Address Information</h3>
        </CardHeader>
        <CardBody>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmitAddress();
            }}
            className='space-y-6'
          >
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <Input
                {...addressForm.register('address.VATNumber')}
                label='VAT Number'
                placeholder='Enter VAT number (e.g., FR12345678901)'
                errorMessage={addressForm.formState.errors.address?.VATNumber?.message}
                isInvalid={!!addressForm.formState.errors.address?.VATNumber}
              />
              <Input
                {...addressForm.register('address.companyName')}
                label='Company Name'
                placeholder='Enter company name (optional)'
                errorMessage={addressForm.formState.errors.address?.companyName?.message}
                isInvalid={!!addressForm.formState.errors.address?.companyName}
              />
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <Input
                {...addressForm.register('address.street')}
                label='Street'
                placeholder='Enter street name'
                errorMessage={addressForm.formState.errors.address?.street?.message}
                isInvalid={!!addressForm.formState.errors.address?.street}
              />
              <Input
                {...addressForm.register('address.houseNumber')}
                label='House Number'
                placeholder='123'
                errorMessage={addressForm.formState.errors.address?.houseNumber?.message}
                isInvalid={!!addressForm.formState.errors.address?.houseNumber}
              />
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              <Input
                {...addressForm.register('address.city')}
                label='City'
                placeholder='Enter city name'
                errorMessage={addressForm.formState.errors.address?.city?.message}
                isInvalid={!!addressForm.formState.errors.address?.city}
              />
              <Input
                {...addressForm.register('address.postalCode')}
                label='Postal Code'
                placeholder='12345'
                errorMessage={addressForm.formState.errors.address?.postalCode?.message}
                isInvalid={!!addressForm.formState.errors.address?.postalCode}
              />
              <Input
                {...addressForm.register('address.countryCode')}
                label='Country Code'
                placeholder='US'
                errorMessage={addressForm.formState.errors.address?.countryCode?.message}
                isInvalid={!!addressForm.formState.errors.address?.countryCode}
              />
            </div>

            <Select
              label='Country'
              placeholder='Select country'
              selectedKeys={
                addressForm.watch('address.country') ? [addressForm.watch('address.country')] : []
              }
              onSelectionChange={(keys) => {
                const selectedCountry = [...keys][0] as string;
                if (selectedCountry) {
                  const countryCode = countryList.find((c) => c.name === selectedCountry)?.code;
                  addressForm.setValue('address.country', selectedCountry);
                  if (countryCode) {
                    addressForm.setValue('address.countryCode', countryCode);
                  }
                }
              }}
              errorMessage={addressForm.formState.errors.address?.country?.message}
              isInvalid={!!addressForm.formState.errors.address?.country}
            >
              {countryList.map((country) => (
                <SelectItem key={country.name} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </Select>

            <Button
              type='submit'
              color='primary'
              isLoading={isAddressUpdating}
              isDisabled={!hasAddressChanges || isAddressUpdating}
              startContent={<Save size={18} />}
            >
              Save Address Information
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <h3 className='text-xl font-semibold'>Skills</h3>
        </CardHeader>
        <CardBody>
          <form onSubmit={skillsForm.handleSubmit(onSubmitSkills)} className='space-y-4'>
            <div className='space-y-3'>
              {skillFields.map((field, index) => {
                const skillData = skillsForm.watch(`skills.${index}`);
                const isNewSkill =
                  !skillData?.id || skillData.id === '' || skillData.id.startsWith('temp_');

                return (
                  <div key={field.id} className='flex gap-2'>
                    {isNewSkill ? (
                      // Editable autocomplete for new skills
                      <Autocomplete
                        label='Select Skill'
                        placeholder='Choose a skill...'
                        className='flex-1'
                        isLoading={useAllSkills.isLoading}
                        selectedKey={skillsForm.watch(`skills.${index}.id`)}
                        onSelectionChange={(key) => {
                          if (key) {
                            const selectedSkill = useAllSkills.data?.data.find(
                              (skill) => skill.id === key
                            );
                            if (selectedSkill) {
                              skillsForm.setValue(`skills.${index}.id`, selectedSkill.id);
                              skillsForm.setValue(`skills.${index}.key`, selectedSkill.key);
                            }
                          }
                        }}
                      >
                        {useAllSkills.data?.data.map((skillOption) => (
                          <AutocompleteItem key={skillOption.id}>
                            {skillOption.key}
                          </AutocompleteItem>
                        ))}
                      </Autocomplete>
                    ) : (
                      // Read-only input for existing skills
                      <Input
                        value={skillData?.key || ''}
                        label='Skill'
                        className='flex-1'
                        isDisabled
                        variant='flat'
                      />
                    )}
                    <Button
                      isIconOnly
                      color='danger'
                      variant='light'
                      onPress={() => handleRemoveSkill(index)}
                      title={isNewSkill ? 'Remove skill' : 'Delete existing skill'}
                    >
                      <Trash2 size={18} />
                    </Button>
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
                  appendSkill({ id: `temp_${Date.now()}`, key: '' });
                }}
              >
                Add Skill
              </Button>
              <Button
                type='submit'
                color='primary'
                isLoading={isUpdatingGeneralInfo}
                isDisabled={!hasSkillsChanges || isUpdatingGeneralInfo}
                startContent={<Save size={18} />}
              >
                Save Skills
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Languages */}
      <Card>
        <CardHeader>
          <h3 className='text-xl font-semibold'>Languages</h3>
        </CardHeader>
        <CardBody>
          <form
            onSubmit={languagesForm.handleSubmit(onSubmitLanguages, onError)}
            className='space-y-6'
          >
            <div className='space-y-4'>
              {languageFields.map((field, index) => {
                const languageData = languagesForm.watch(`languages.${index}`);
                const isNewLanguage =
                  !languageData?.id ||
                  languageData.id === '' ||
                  languageData.id.startsWith('temp_');

                return (
                  <div
                    key={field.id}
                    className='space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700'
                  >
                    <div className='flex items-center justify-between'>
                      <h4 className='font-medium'>Language {index + 1}</h4>
                      <div className='flex gap-2'>
                        <Button
                          isIconOnly
                          color='danger'
                          variant='light'
                          size='sm'
                          isLoading={isDeletingLanguage}
                          onPress={() => {
                            handleDeleteLanguage(field.id, index);
                          }}
                          title={isNewLanguage ? 'Remove language' : 'Delete existing language'}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>

                    <div className='flex gap-2'>
                      <Select
                        placeholder='Select language'
                        aria-label='selected language'
                        selectedKeys={languageData?.key ? [languageData.key] : []}
                        onSelectionChange={(keys) => {
                          const value = [...keys][0] as string;
                          languagesForm.setValue(`languages.${index}.key`, value);
                        }}
                        className='flex-1'
                        isDisabled={!isNewLanguage}
                        variant={isNewLanguage ? 'flat' : 'flat'}
                      >
                        {ISO6391.getAllNames().map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </Select>
                      <Select
                        placeholder='Select level'
                        selectedKeys={languageData?.level ? [languageData.level] : []}
                        aria-label='language level'
                        onSelectionChange={(keys) => {
                          const value = [...keys][0] as string;
                          languagesForm.setValue(
                            `languages.${index}.level`,
                            value as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'NATIVE'
                          );
                        }}
                        className='flex-1'
                        isDisabled={!isNewLanguage}
                        variant={isNewLanguage ? 'flat' : 'flat'}
                      >
                        {levelOptions.map(({ value, label }) => (
                          <SelectItem key={value}>{label}</SelectItem>
                        ))}
                      </Select>
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
                  appendLanguage({
                    id: `temp_${Date.now()}`,
                    key: '',
                    level: 'BEGINNER'
                  });
                }}
              >
                Add Language
              </Button>
              <Button
                type='submit'
                color='primary'
                isLoading={isCreatingLanguage}
                isDisabled={!hasLanguagesChanges || isCreatingLanguage}
                startContent={<Save size={18} />}
              >
                Save Languages
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
