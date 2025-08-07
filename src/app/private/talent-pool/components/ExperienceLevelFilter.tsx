'use client';

import React from 'react';
import { Chip, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';

interface ExperienceLevelFilterProps {
  selectedLevels: string[];
  onSelectionChange: (levels: string[]) => void;
  className?: string;
}

export default function ExperienceLevelFilter({
  selectedLevels,
  onSelectionChange,
  className = '',
}: ExperienceLevelFilterProps) {

  const experienceLevels = [
    {
      key: '0-2',
      label: 'Junior',
      description: '0-2 years of experience',
      icon: 'solar:user-linear',
      color: 'success' as const
    },
    {
      key: '2-5',
      label: 'Mid-Level',
      description: '2-5 years of experience',
      icon: 'solar:user-check-linear',
      color: 'primary' as const
    },
    {
      key: '5-10',
      label: 'Senior',
      description: '5-10 years of experience',
      icon: 'solar:user-star-linear',
      color: 'secondary' as const
    },
    {
      key: '10+',
      label: 'Lead',
      description: '10+ years of experience',
      icon: 'solar:crown-linear',
      color: 'warning' as const
    }
  ];

  const handleLevelToggle = (levelKey: string) => {
    const isSelected = selectedLevels.includes(levelKey);
    
    if (isSelected) {
      // Remove from selection
      onSelectionChange(selectedLevels.filter(level => level !== levelKey));
    } else {
      // Add to selection
      onSelectionChange([...selectedLevels, levelKey]);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Icon icon="solar:medal-ribbons-star-linear" className="w-4 h-4 text-default-700" />
        <span className="text-small font-medium text-default-700">Experience Level</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {experienceLevels.map((level) => {
          const isSelected = selectedLevels.includes(level.key);
          
          return (
            <Tooltip 
              key={level.key} 
              content={level.description} 
              placement="top"
              delay={300}
            >
              <Chip
                variant={isSelected ? "solid" : "bordered"}
                color={isSelected ? level.color : "default"}
                startContent={<Icon icon={level.icon} className="w-3.5 h-3.5" />}
                className="cursor-pointer transition-all duration-200 hover:scale-105"
                onClick={() => handleLevelToggle(level.key)}
                size="sm"
              >
                {level.label}
              </Chip>
            </Tooltip>
          );
        })}
      </div>

      {selectedLevels.length > 0 && (
        <div className="text-tiny text-default-500">
          {selectedLevels.length} level{selectedLevels.length === 1 ? '' : 's'} selected
        </div>
      )}
    </div>
  );
}