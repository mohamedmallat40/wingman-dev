'use client';

import React, { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import { type Experience } from '../../types';
import { cn } from '../../utils/profile-styles';
import { ExperienceCard } from '../cards/ExperienceCard';
import { ExperienceForm } from '../forms/ExperienceForm';

interface ExperienceSectionProps {
  experiences: Experience[];
  isOwnProfile: boolean;
  onAdd: (experience: Omit<Experience, 'id'>) => Promise<void>;
  onUpdate: (id: string, experience: Partial<Experience>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences,
  isOwnProfile,
  onAdd,
  onUpdate,
  onDelete,
  isLoading = false
}) => {
  const t = useTranslations();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const sortedExperiences = experiences.sort((a, b) => {
    // Current positions first
    if (!a.endDate && b.endDate) return -1;
    if (a.endDate && !b.endDate) return 1;
    
    // Then by start date (most recent first)
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  const handleAdd = async (data: Omit<Experience, 'id'>) => {
    await onAdd(data);
    setIsAdding(false);
  };

  const handleUpdate = async (id: string, data: Partial<Experience>) => {
    await onUpdate(id, data);
    setEditingId(null);
  };

  const isEmpty = experiences.length === 0;

  return (
    <Card className={cn(
      'transition-all duration-200',
      isLoading && 'animate-pulse'
    )}>
      <CardHeader className='pb-3'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
              <Icon icon='solar:case-minimalistic-linear' className='h-5 w-5 text-primary' />
            </div>
            <div>
              <h3 className='text-lg font-semibold text-foreground'>
                {t('profileLocales.sections.experience.title')}
              </h3>
              <p className='text-sm text-default-500'>
                {t('profileLocales.sections.experience.description')}
              </p>
            </div>
          </div>
          
          {isOwnProfile && !isAdding && (
            <Button
              isIconOnly
              size='sm'
              variant='light'
              color='success'
              onPress={() => setIsAdding(true)}
            >
              <Icon icon='solar:add-circle-linear' className='h-4 w-4' />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardBody className='pt-0'>
        <div className='space-y-4'>
          {isAdding && (
            <ExperienceForm
              onSave={handleAdd}
              onCancel={() => setIsAdding(false)}
            />
          )}

          {isEmpty && !isAdding ? (
            <div className='flex flex-col items-center justify-center py-8 text-center'>
              <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
                <Icon icon='solar:case-minimalistic-linear' className='h-8 w-8 text-primary/60' />
              </div>
              <p className='text-sm text-default-500 mb-2'>
                {t('profileLocales.sections.experience.empty')}
              </p>
              {isOwnProfile && (
                <Button
                  size='sm'
                  variant='flat'
                  color='primary'
                  onPress={() => setIsAdding(true)}
                  startContent={<Icon icon='solar:add-circle-linear' className='h-4 w-4' />}
                >
                  {t('profileLocales.sections.experience.addPrompt')}
                </Button>
              )}
            </div>
          ) : (
            <div className='space-y-3'>
              {sortedExperiences.map((experience, index) => (
                <div key={experience.id} className='relative'>
                  {editingId === experience.id ? (
                    <ExperienceForm
                      experience={experience}
                      onSave={(data) => handleUpdate(experience.id, data)}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <ExperienceCard
                      experience={experience}
                      isOwnProfile={isOwnProfile}
                      onEdit={() => setEditingId(experience.id)}
                      onDelete={() => onDelete(experience.id)}
                      showTimeline={index < sortedExperiences.length - 1}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};