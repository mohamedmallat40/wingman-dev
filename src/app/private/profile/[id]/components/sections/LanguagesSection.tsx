'use client';

import React, { useState } from 'react';

import { Button, Card, CardBody, CardHeader, Progress } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

import { type Language } from '../../types';
import { cn, LANGUAGE_LEVELS } from '../../utils/profile-styles';

interface LanguagesSectionProps {
  languages: Language[];
  isOwnProfile: boolean;
  onAdd: (language: Omit<Language, 'id'>) => Promise<void>;
  onUpdate: (id: string, language: Partial<Language>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export const LanguagesSection: React.FC<LanguagesSectionProps> = ({
  languages,
  isOwnProfile,
  onAdd,
  onUpdate,
  onDelete,
  isLoading = false
}) => {
  const t = useTranslations();
  const [isAdding, setIsAdding] = useState(false);

  const getProficiencyLevel = (level: string) => {
    const levelKey = level.toUpperCase() as keyof typeof LANGUAGE_LEVELS;
    return LANGUAGE_LEVELS[levelKey] || LANGUAGE_LEVELS.BEGINNER;
  };

  const isEmpty = languages.length === 0;

  return (
    <Card className={cn('transition-all duration-200', isLoading && 'animate-pulse')}>
      <CardHeader className='pb-3'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='bg-warning/10 flex h-10 w-10 items-center justify-center rounded-full'>
              <Icon icon='solar:global-linear' className='text-warning h-5 w-5' />
            </div>
            <div>
              <h3 className='text-foreground text-lg font-semibold'>
                Languages ({languages.length})
              </h3>
              <p className='text-default-500 text-sm'>Languages you speak and proficiency levels</p>
            </div>
          </div>

          {isOwnProfile && (
            <Button
              isIconOnly
              size='sm'
              variant='light'
              color='warning'
              onPress={() => setIsAdding(true)}
            >
              <Icon icon='solar:add-circle-linear' className='h-4 w-4' />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardBody className='pt-0'>
        {isEmpty ? (
          <div className='flex flex-col items-center justify-center py-8 text-center'>
            <div className='bg-warning/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
              <Icon icon='solar:global-linear' className='text-warning/60 h-8 w-8' />
            </div>
            <p className='text-default-500 mb-2 text-sm'>No languages added yet</p>
            {isOwnProfile && (
              <Button
                size='sm'
                variant='flat'
                color='warning'
                onPress={() => setIsAdding(true)}
                startContent={<Icon icon='solar:add-circle-linear' className='h-4 w-4' />}
              >
                Add your first language
              </Button>
            )}
          </div>
        ) : (
          <div className='space-y-4'>
            {languages.map((language) => {
              const proficiency = getProficiencyLevel(language.level);

              return (
                <div key={language.id} className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      {language.countryFlag && (
                        <span className='text-2xl' role='img' aria-label={language.name}>
                          {language.countryFlag}
                        </span>
                      )}
                      <div>
                        <h4 className='text-foreground font-medium'>
                          {language.name}
                          {language.nativeName && language.nativeName !== language.name && (
                            <span className='text-default-500 ml-1 text-sm'>
                              ({language.nativeName})
                            </span>
                          )}
                        </h4>
                        <div className='flex items-center gap-2'>
                          <span
                            className={cn(
                              'rounded-full px-2 py-1 text-sm',
                              `text-${proficiency.color}`
                            )}
                          >
                            {language.level}
                          </span>
                          {language.isNative && (
                            <span className='bg-success/10 text-success rounded-full px-2 py-1 text-xs'>
                              Native
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {isOwnProfile && (
                      <div className='flex gap-1'>
                        <Button
                          isIconOnly
                          size='sm'
                          variant='light'
                          className='text-default-500 hover:text-primary'
                        >
                          <Icon icon='solar:pen-linear' className='h-3 w-3' />
                        </Button>
                        <Button
                          isIconOnly
                          size='sm'
                          variant='light'
                          color='danger'
                          onPress={() => onDelete(language.id)}
                          className='text-default-500 hover:text-danger'
                        >
                          <Icon icon='solar:trash-bin-minimalistic-linear' className='h-3 w-3' />
                        </Button>
                      </div>
                    )}
                  </div>

                  <Progress
                    size='sm'
                    value={proficiency.percentage}
                    color={proficiency.color}
                    className='max-w-md'
                  />

                  {(language.canRead ||
                    language.canWrite ||
                    language.canSpeak ||
                    language.canUnderstand) && (
                    <div className='flex flex-wrap gap-1 text-xs'>
                      {language.canSpeak && (
                        <span className='bg-primary/10 text-primary rounded-full px-2 py-1'>
                          Speaking
                        </span>
                      )}
                      {language.canUnderstand && (
                        <span className='bg-secondary/10 text-secondary rounded-full px-2 py-1'>
                          Listening
                        </span>
                      )}
                      {language.canRead && (
                        <span className='bg-success/10 text-success rounded-full px-2 py-1'>
                          Reading
                        </span>
                      )}
                      {language.canWrite && (
                        <span className='bg-warning/10 text-warning rounded-full px-2 py-1'>
                          Writing
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardBody>
    </Card>
  );
};
