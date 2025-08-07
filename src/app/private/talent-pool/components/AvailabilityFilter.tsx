'use client';

import React from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

interface AvailabilityFilterProps {
  selectedAvailability: 'OPEN_FOR_PROJECT' | 'OPEN_FOR_PART_TIME' | null;
  onSelectionChange: (availability: 'OPEN_FOR_PROJECT' | 'OPEN_FOR_PART_TIME' | null) => void;
  className?: string;
}

export default function AvailabilityFilter({
  selectedAvailability,
  onSelectionChange,
  className = '',
}: AvailabilityFilterProps) {

  const options = [
    {
      key: null,
      label: 'All',
      icon: 'solar:users-group-rounded-outline'
    },
    {
      key: 'OPEN_FOR_PROJECT' as const,
      label: 'Full-Time',
      icon: 'solar:briefcase-outline'
    },
    {
      key: 'OPEN_FOR_PART_TIME' as const,
      label: 'Part-Time',
      icon: 'solar:clock-circle-outline'
    }
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Icon icon="solar:calendar-mark-linear" className="w-4 h-4 text-default-700" />
        <span className="text-small font-medium text-default-700">Availability</span>
      </div>

      <div className="flex gap-2">
        {options.map((option) => (
          <Button
            key={option.key || 'all'}
            variant={selectedAvailability === option.key ? "solid" : "bordered"}
            color={selectedAvailability === option.key ? "primary" : "default"}
            size="sm"
            startContent={<Icon icon={option.icon} className="w-4 h-4" />}
            onPress={() => onSelectionChange(option.key)}
            className="flex-1"
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}