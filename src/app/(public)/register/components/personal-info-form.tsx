'use client';

import { Input } from '@heroui/react';
import { Icon } from '@iconify/react';

interface PersonalInfoFormProperties {
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
}

export default function PersonalInfoForm({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange
}: Readonly<PersonalInfoFormProperties>) {
  return (
    <div className='space-y-4'>
      <div>
        <h2 className='mb-1 text-lg font-semibold text-gray-900 dark:text-white'>
          Personal Information
        </h2>
        <p className='text-sm text-gray-600 dark:text-gray-400'>Tell us about yourself</p>
      </div>

      <div className='flex gap-4 space-y-2'>
        <Input
          type='text'
          label='First Name'
          placeholder='Enter your first name'
          value={firstName}
          onChange={(event: { target: { value: string } }) => {
            onFirstNameChange(event.target.value);
          }}
          startContent={<Icon icon='solar:user-outline' className='text-default-400' width={18} />}
          size='sm'
          isRequired
        />

        <Input
          type='text'
          label='Last Name'
          placeholder='Enter your last name'
          value={lastName}
          onChange={(event: { target: { value: string } }) => {
            onLastNameChange(event.target.value);
          }}
          startContent={<Icon icon='solar:user-outline' className='text-default-400' width={18} />}
          size='sm'
          isRequired
        />
      </div>
    </div>
  );
}
