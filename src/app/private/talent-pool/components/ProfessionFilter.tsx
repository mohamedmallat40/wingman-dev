'use client';

import React from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

interface ProfessionFilterProps {
  selectedProfession: 'FULL_TIME_FREELANCER' | 'PART_TIME_FREELANCER' | 'CONTRACTOR' | 'STUDENT' | null;
  onSelectionChange: (profession: 'FULL_TIME_FREELANCER' | 'PART_TIME_FREELANCER' | 'CONTRACTOR' | 'STUDENT' | null) => void;
  className?: string;
}

export default function ProfessionFilter({
  selectedProfession,
  onSelectionChange,
  className = '',
}: ProfessionFilterProps) {

  const professions = [
    {
      key: 'FULL_TIME_FREELANCER' as const,
      label: 'Freelancer',
      icon: 'solar:user-linear'
    },
    {
      key: 'PART_TIME_FREELANCER' as const,
      label: 'Interim',
      icon: 'solar:calendar-linear'
    },
    {
      key: 'CONTRACTOR' as const,
      label: 'Consultant',
      icon: 'solar:case-linear'
    },
    {
      key: 'STUDENT' as const,
      label: 'Student entrepreneur',
      icon: 'solar:book-linear'
    }
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Icon icon="solar:case-minimalistic-linear" className="w-4 h-4 text-default-700" />
        <span className="text-small font-medium text-default-700">Profession Type</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {professions.map((profession) => (
          <Button
            key={profession.key}
            variant={selectedProfession === profession.key ? "solid" : "bordered"}
            color={selectedProfession === profession.key ? "primary" : "default"}
            size="sm"
            startContent={<Icon icon={profession.icon} className="w-4 h-4" />}
            onPress={() => onSelectionChange(selectedProfession === profession.key ? null : profession.key)}
            className="justify-start"
          >
            {profession.label}
          </Button>
        ))}
      </div>
    </div>
  );
}