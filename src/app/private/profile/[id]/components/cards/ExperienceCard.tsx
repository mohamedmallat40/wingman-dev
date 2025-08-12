'use client';

import React from 'react';

import { Button, Card, CardBody, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

import { type Experience } from '../../types';
import { cn } from '../../utils/profile-styles';

interface ExperienceCardProps {
  experience: Experience;
  isOwnProfile: boolean;
  onEdit: () => void;
  onDelete: () => void;
  showTimeline?: boolean;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  isOwnProfile,
  onEdit,
  onDelete,
  showTimeline = false
}) => {
  const t = useTranslations();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateDuration = () => {
    const start = new Date(experience.startDate);
    const end = experience.endDate ? new Date(experience.endDate) : new Date();

    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth() + years * 12;

    if (months < 12) {
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    } else {
      const yearCount = Math.floor(months / 12);
      const remainingMonths = months % 12;
      const yearText = `${yearCount} ${yearCount === 1 ? 'year' : 'years'}`;

      if (remainingMonths === 0) return yearText;
      return `${yearText} ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
    }
  };

  const isCurrentPosition = !experience.endDate;

  return (
    <div className='relative'>
      {/* Timeline indicator */}
      {showTimeline && <div className='bg-divider absolute top-16 left-5 h-8 w-px' />}

      <Card className='hover:shadow-medium transition-all duration-200'>
        <CardBody className='p-4'>
          <div className='flex gap-4'>
            {/* Company icon/initial */}
            <div className='flex-shrink-0'>
              <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'>
                <Icon icon='solar:case-minimalistic-linear' className='text-primary h-5 w-5' />
              </div>
            </div>

            {/* Content */}
            <div className='min-w-0 flex-1'>
              <div className='flex items-start justify-between gap-3'>
                <div className='min-w-0 flex-1'>
                  <div className='mb-1 flex items-center gap-2'>
                    <h4 className='text-foreground truncate font-semibold'>
                      {experience.position}
                    </h4>
                    {isCurrentPosition && (
                      <Chip size='sm' color='success' variant='flat' className='text-xs'>
                        Current
                      </Chip>
                    )}
                  </div>

                  <div className='mb-2 flex flex-col gap-1'>
                    <p className='text-default-700 font-medium'>{experience.company}</p>
                    {experience.location && (
                      <div className='text-default-500 flex items-center gap-1 text-sm'>
                        <Icon icon='solar:map-point-linear' className='h-3 w-3' />
                        {experience.location}
                      </div>
                    )}
                  </div>

                  <div className='text-default-500 mb-3 flex items-center gap-1 text-sm'>
                    <Icon icon='solar:calendar-linear' className='h-3 w-3' />
                    <span>
                      {formatDate(experience.startDate)} -{' '}
                      {isCurrentPosition ? 'Present' : formatDate(experience.endDate!)}
                    </span>
                    <span className='text-xs'>({calculateDuration()})</span>
                  </div>

                  {experience.description && (
                    <p className='text-default-600 mb-3 text-sm leading-relaxed'>
                      {experience.description}
                    </p>
                  )}

                  {experience.skills && experience.skills.length > 0 && (
                    <div className='flex flex-wrap gap-1'>
                      {experience.skills.map((skill, index) => (
                        <Chip
                          key={index}
                          size='sm'
                          variant='flat'
                          color='secondary'
                          className='text-xs'
                        >
                          {skill}
                        </Chip>
                      ))}
                    </div>
                  )}
                </div>

                {isOwnProfile && (
                  <div className='flex gap-1'>
                    <Button
                      isIconOnly
                      size='sm'
                      variant='light'
                      onPress={onEdit}
                      className='text-default-500 hover:text-primary'
                    >
                      <Icon icon='solar:pen-linear' className='h-3 w-3' />
                    </Button>
                    <Button
                      isIconOnly
                      size='sm'
                      variant='light'
                      color='danger'
                      onPress={onDelete}
                      className='text-default-500 hover:text-danger'
                    >
                      <Icon icon='solar:trash-bin-minimalistic-linear' className='h-3 w-3' />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
