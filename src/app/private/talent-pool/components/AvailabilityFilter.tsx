'use client';

import React from 'react';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

interface AvailabilityFilterProps {
  selectedAvailability: 'OPEN_FOR_PROJECT' | 'OPEN_FOR_PART_TIME' | null;
  onSelectionChange: (availability: 'OPEN_FOR_PROJECT' | 'OPEN_FOR_PART_TIME' | null) => void;
  className?: string;
}

export default function AvailabilityFilter({
  selectedAvailability,
  onSelectionChange,
  className = ''
}: AvailabilityFilterProps) {
  const t = useTranslations();
  
  const options = [
    {
      key: null,
      label: t('talentPool.availability.all'),
      icon: 'solar:users-group-rounded-outline'
    },
    {
      key: 'OPEN_FOR_PROJECT' as const,
      label: t('talentPool.availability.fullTime'),
      icon: 'solar:briefcase-outline'
    },
    {
      key: 'OPEN_FOR_PART_TIME' as const,
      label: t('talentPool.availability.partTime'),
      icon: 'solar:clock-circle-outline'
    }
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <div className='flex gap-2'>
        {options.map((option) => (
          <Button
            key={option.key || 'all'}
            variant={selectedAvailability === option.key ? 'solid' : 'bordered'}
            color={selectedAvailability === option.key ? 'primary' : 'default'}
            size='sm'
            startContent={<Icon icon={option.icon} className='h-4 w-4' />}
            onPress={() => onSelectionChange(option.key)}
            className='flex-1'
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
