'use client';

import React from 'react';
import { Input, Textarea } from '@heroui/react';
import { Icon } from '@iconify/react';
import { type IUserProfile } from 'modules/profile/types';

interface PersonalInfoFormProps {
  data: Partial<IUserProfile>;
  onChange: (field: string, value: string) => void;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Input
          label="First Name"
          placeholder="Enter your first name"
          variant="bordered"
          value={data.firstName || ''}
          onChange={(e) => onChange('firstName', e.target.value)}
          startContent={<Icon icon="solar:user-outline" className="h-4 w-4 text-default-400" />}
        />
        <Input
          label="Last Name"
          placeholder="Enter your last name"
          variant="bordered"
          value={data.lastName || ''}
          onChange={(e) => onChange('lastName', e.target.value)}
          startContent={<Icon icon="solar:user-outline" className="h-4 w-4 text-default-400" />}
        />
        <Input
          label="Email Address"
          placeholder="Enter your email"
          variant="bordered"
          type="email"
          value={data.email || ''}
          onChange={(e) => onChange('email', e.target.value)}
          startContent={<Icon icon="solar:letter-outline" className="h-4 w-4 text-default-400" />}
        />
        <Input
          label="Phone Number"
          placeholder="Enter your phone number"
          variant="bordered"
          value={data.phoneNumber || ''}
          onChange={(e) => onChange('phoneNumber', e.target.value)}
          startContent={<Icon icon="solar:phone-outline" className="h-4 w-4 text-default-400" />}
        />
        <Input
          label="Location"
          placeholder="City, Country"
          variant="bordered"
          value={data.city || ''}
          onChange={(e) => onChange('city', e.target.value)}
          startContent={<Icon icon="solar:map-point-outline" className="h-4 w-4 text-default-400" />}
        />
        <Input
          label="LinkedIn Profile"
          placeholder="https://linkedin.com/in/username"
          variant="bordered"
          value={data.linkedinProfile || ''}
          onChange={(e) => onChange('linkedinProfile', e.target.value)}
          startContent={<Icon icon="solar:link-outline" className="h-4 w-4 text-default-400" />}
        />
      </div>
      <Input
        label="Portfolio Website"
        placeholder="https://yourportfolio.com"
        variant="bordered"
        value={data.profileWebsite || ''}
        onChange={(e) => onChange('profileWebsite', e.target.value)}
        startContent={<Icon icon="solar:global-outline" className="h-4 w-4 text-default-400" />}
      />
      <Textarea
        label="Professional Summary"
        placeholder="Brief description of your professional background and expertise..."
        variant="bordered"
        value={data.aboutMe || ''}
        onChange={(e) => onChange('aboutMe', e.target.value)}
        minRows={4}
        startContent={<Icon icon="solar:notes-outline" className="h-4 w-4 text-default-400" />}
      />
    </div>
  );
};
