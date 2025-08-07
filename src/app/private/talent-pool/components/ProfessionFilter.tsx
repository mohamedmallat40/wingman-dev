'use client';

import React from 'react';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

interface ProfessionFilterProps {
  selectedProfession:
    | 'FULL_TIME_FREELANCER'
    | 'PART_TIME_FREELANCER'
    | 'CONTRACTOR'
    | 'STUDENT'
    | null;
  onSelectionChange: (
    profession: 'FULL_TIME_FREELANCER' | 'PART_TIME_FREELANCER' | 'CONTRACTOR' | 'STUDENT' | null
  ) => void;
  className?: string;
}

export default function ProfessionFilter({
  selectedProfession,
  onSelectionChange,
  className = ''
}: ProfessionFilterProps) {
  const t = useTranslations();
  
  const professions = [
    {
      key: 'FULL_TIME_FREELANCER' as const,
      label: t('talentPool.profession.freelancer'),
      icon: 'solar:user-linear'
    },
    {
      key: 'PART_TIME_FREELANCER' as const,
      label: t('talentPool.profession.interim'),
      icon: 'solar:calendar-linear'
    },
    {
      key: 'CONTRACTOR' as const,
      label: t('talentPool.profession.consultant'),
      icon: 'solar:case-linear'
    },
    {
      key: 'STUDENT' as const,
      label: t('talentPool.profession.studentEntrepreneur'),
      icon: 'solar:book-linear'
    }
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <div className='grid grid-cols-2 gap-2'>
        {professions.map((profession) => (
          <Button
            key={profession.key}
            variant={selectedProfession === profession.key ? 'solid' : 'bordered'}
            color={selectedProfession === profession.key ? 'primary' : 'default'}
            size='sm'
            startContent={<Icon icon={profession.icon} className='h-4 w-4' />}
            onPress={() =>
              onSelectionChange(selectedProfession === profession.key ? null : profession.key)
            }
            className='justify-start'
          >
            {profession.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
