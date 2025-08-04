import type {
  GeneralInfoFormData,
  LanguagesFormData,
  SkillsFormData
} from '@root/modules/settings/schema/settings.schema';

import {
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
  generalInfoSchema,
  languagesSchema,
  skillsSchema
} from '@root/modules/settings/schema/settings.schema';
import { Plus, Save, X } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';

interface GeneralInfoTabProperties {
  user: IUserProfile;
  languages: ILanguage[];
}

const levelOptions = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
  { value: 'NATIVE', label: 'Native' }
];

export default function GeneralInfoTab({ user, languages }: Readonly<GeneralInfoTabProperties>) {
  const { updateGeneralInfo, updateLanguages, isUpdatingGeneralInfo, isUpdatingLanguages } =
    useSettings(user.id);

  const generalForm = useForm<GeneralInfoFormData>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      ...user
    }
  });

  // Skills Form
  const skillsForm = useForm<SkillsFormData>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: user.skills
    }
  });

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill
  } = useFieldArray({
    control: skillsForm.control,
    name: 'skills'
  });

  // Languages Form
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

  const onSubmitGeneral = async (data: GeneralInfoFormData) => {
    updateGeneralInfo(data);
  };

  const onSubmitSkills = async (data: SkillsFormData) => {
    const requestData = {
      ...user,
      skills: data
    };
    updateGeneralInfo(requestData);
  };

  const onSubmitLanguages = async (data: LanguagesFormData) => {
    updateLanguages(data);
  };

  return (
    <div className='space-y-8'>
      {/* General Information */}
      <Card className='w-full bg-transparent'>
        <CardHeader>
          <h3 className='text-xl font-semibold'>Personal Information</h3>
        </CardHeader>
        <CardBody>
          <form onSubmit={generalForm.handleSubmit(onSubmitGeneral)} className='space-y-6'>
            <div className='flex items-center gap-6'>
              <Avatar src={generalForm.watch('profileImage')} className='h-24 w-24' />
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

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <Input
                {...generalForm.register('address.street')}
                label='Street'
                placeholder='Street name'
                errorMessage={generalForm.formState.errors.address?.street?.message}
                isInvalid={!!generalForm.formState.errors.address?.street}
              />
              <Input
                {...generalForm.register('address.houseNumber')}
                label='House Number'
                placeholder='123'
                errorMessage={generalForm.formState.errors.address?.houseNumber?.message}
                isInvalid={!!generalForm.formState.errors.address?.houseNumber}
              />
              <Input
                {...generalForm.register('address.city')}
                label='City'
                placeholder='City name'
                errorMessage={generalForm.formState.errors.address?.city?.message}
                isInvalid={!!generalForm.formState.errors.address?.city}
              />
              <Input
                {...generalForm.register('address.country')}
                label='Country'
                placeholder='Country name'
                errorMessage={generalForm.formState.errors.address?.country?.message}
                isInvalid={!!generalForm.formState.errors.address?.country}
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
              <Input
                {...generalForm.register('hourlyRate', { valueAsNumber: true })}
                type='number'
                label='Hourly Rate ($)'
                placeholder='85'
                errorMessage={generalForm.formState.errors.hourlyRate?.message}
                isInvalid={!!generalForm.formState.errors.hourlyRate}
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
                }}
              >
                <SelectItem key='HOURLY_BASED'>Hourly</SelectItem>
                <SelectItem key='DAILY_BASED'>Daily</SelectItem>
                <SelectItem key='PROJECT'>Daily</SelectItem>
              </Select>
            </div>

            <Button
              type='submit'
              color='primary'
              isLoading={isUpdatingGeneralInfo}
              startContent={<Save size={18} />}
            >
              Save Personal Information
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
              {skillFields.map((field, index) => (
                <div key={field.id} className='flex gap-2'>
                  <Input
                    {...skillsForm.register(`skills.${index}.key`)}
                    placeholder='Enter skill name'
                    errorMessage={skillsForm.formState.errors.skills?.[index]?.key?.message}
                    isInvalid={!!skillsForm.formState.errors.skills?.[index]?.key}
                    className='flex-1'
                  />
                  <Button
                    isIconOnly
                    color='danger'
                    variant='light'
                    onPress={() => {
                      removeSkill(index);
                    }}
                    isDisabled={skillFields.length === 1}
                  >
                    <X size={18} />
                  </Button>
                </div>
              ))}
            </div>

            <div className='flex gap-2'>
              <Button
                color='secondary'
                variant='flat'
                startContent={<Plus size={18} />}
                onPress={() => {
                  appendSkill({ id: Date.now().toString(), key: '' });
                }}
              >
                Add Skill
              </Button>
              <Button
                type='submit'
                color='primary'
                isLoading={isUpdatingGeneralInfo}
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
          <form onSubmit={languagesForm.handleSubmit(onSubmitLanguages)} className='space-y-4'>
            <div className='space-y-3'>
              {languageFields.map((field, index: number) => (
                <div key={field.id} className='flex gap-2'>
                  <Select
                    {...languagesForm.register(`languages.${index}.key`)}
                    placeholder='Select language'
                    aria-label='selected language'
                    selectedKeys={[languagesForm.watch(`languages.${index}.key`)]}
                    onSelectionChange={(keys) => {
                      const value = [...keys][0] as string;
                      languagesForm.setValue(`languages.${index}.key`, value);
                    }}
                    className='flex-1'
                  >
                    {languages.map((lang) => (
                      <SelectItem key={lang.key}>{lang.key}</SelectItem>
                    ))}
                  </Select>
                  <Select
                    {...languagesForm.register(`languages.${index}.level`)}
                    placeholder='Select level'
                    selectedKeys={[languagesForm.watch(`languages.${index}.level`)]}
                    aria-label='langauge'
                    onSelectionChange={(keys) => {
                      const value = [...keys][0] as string;
                      languagesForm.setValue(
                        `languages.${index}.level`,
                        value as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'NATIVE'
                      );
                    }}
                    className='flex-1'
                  >
                    {levelOptions.map(({ value, label }) => (
                      <SelectItem key={value}>{label}</SelectItem>
                    ))}
                  </Select>
                  <Button
                    isIconOnly
                    color='danger'
                    variant='light'
                    onPress={() => {
                      removeLanguage(index);
                    }}
                    isDisabled={languageFields.length === 1}
                  >
                    <X size={18} />
                  </Button>
                </div>
              ))}
            </div>

            <div className='flex gap-2'>
              <Button
                color='secondary'
                variant='flat'
                startContent={<Plus size={18} />}
                onPress={() => {
                  appendLanguage({ id: Date.now().toString(), key: '', level: 'BEGINNER' });
                }}
              >
                Add Language
              </Button>
              <Button
                type='submit'
                color='primary'
                isLoading={isUpdatingLanguages}
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
