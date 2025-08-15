'use client';

import React from 'react';

import { Chip, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

interface ExperienceLevelFilterProperties {
  selectedLevels: string[];
  onSelectionChange: (levels: string[]) => void;
  className?: string;
}

export default function ExperienceLevelFilter({
  selectedLevels,
  onSelectionChange,
  className = ''
}: ExperienceLevelFilterProperties) {
  const t = useTranslations();

  const experienceLevels = [
    {
      key: '0-2',
      label: t('talentPool.experience.junior'),
      description: t('talentPool.experience.descriptions.junior'),
      icon: 'solar:user-linear',
      color: 'success' as const
    },
    {
      key: '2-5',
      label: t('talentPool.experience.midLevel'),
      description: t('talentPool.experience.descriptions.midLevel'),
      icon: 'solar:user-check-linear',
      color: 'primary' as const
    },
    {
      key: '5-10',
      label: t('talentPool.experience.senior'),
      description: t('talentPool.experience.descriptions.senior'),
      icon: 'solar:user-star-linear',
      color: 'secondary' as const
    },
    {
      key: '10+',
      label: t('talentPool.experience.lead'),
      description: t('talentPool.experience.descriptions.lead'),
      icon: 'solar:crown-linear',
      color: 'warning' as const
    }
  ];

  const handleLevelToggle = (levelKey: string) => {
    const isSelected = selectedLevels.includes(levelKey);

    if (isSelected) {
      // Remove from selection
      onSelectionChange(selectedLevels.filter((level) => level !== levelKey));
    } else {
      // Add to selection
      onSelectionChange([...selectedLevels, levelKey]);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className='flex flex-wrap gap-2'>
        {experienceLevels.map((level) => {
          const isSelected = selectedLevels.includes(level.key);

          return (
            <Tooltip key={level.key} content={level.description} placement='top' delay={300}>
              <Chip
                variant={isSelected ? 'solid' : 'bordered'}
                color={isSelected ? level.color : 'default'}
                startContent={<Icon icon={level.icon} className='h-3.5 w-3.5' />}
                className='cursor-pointer transition-all duration-200 hover:scale-105'
                onClick={() => {
                  handleLevelToggle(level.key);
                }}
                size='sm'
              >
                {level.label}
              </Chip>
            </Tooltip>
          );
        })}
      </div>

      {selectedLevels.length > 0 && (
        <div className='text-tiny text-default-500'>
          {t('talentPool.experience.selected', { count: selectedLevels.length })}
        </div>
      )}
    </div>
  );
}
