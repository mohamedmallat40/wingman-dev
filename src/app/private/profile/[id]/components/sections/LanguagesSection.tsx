'use client';

import React from 'react';

import { Button, Card, CardBody, CardHeader, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

import { type Language } from '../../types';
import { ActionButtons } from '../ActionButtons';

interface LanguagesSectionProps {
  languages: Language[];
  isOwnProfile: boolean;
  onAdd: () => void;
  onEdit: (language: Language) => void;
  onDelete: (language: Language) => void;
}

export const LanguagesSection: React.FC<LanguagesSectionProps> = ({
  languages,
  isOwnProfile,
  onAdd,
  onEdit,
  onDelete
}) => {
  const t = useTranslations();

  const getLevelColor = (level: string) => {
    const colors = {
      NATIVE: 'success',
      FLUENT: 'success',
      PROFESSIONAL: 'primary',
      CONVERSATIONAL: 'secondary',
      INTERMEDIATE: 'warning',
      BEGINNER: 'default',
      ELEMENTARY: 'default'
    };
    return colors[level as keyof typeof colors] || 'default';
  };

  const getLevelLabel = (level: string) => {
    const labels = {
      NATIVE: 'Native',
      FLUENT: 'Fluent',
      PROFESSIONAL: 'Professional',
      CONVERSATIONAL: 'Conversational',
      INTERMEDIATE: 'Intermediate',
      BEGINNER: 'Beginner',
      ELEMENTARY: 'Elementary'
    };
    return labels[level as keyof typeof labels] || 'Beginner';
  };

  const getCountryFlag = (lang: Language) => {
    const flagCode = lang.countryFlag || (lang.code ? lang.code.toLowerCase() : 'un');
    return `https://flagcdn.com/w20/${flagCode}.png`;
  };

  return (
    <Card className='border-default-200/50 hover:border-warning/20 scroll-mt-24 shadow-sm transition-all duration-300 hover:shadow-md'>
      <CardHeader className='pb-4'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='bg-warning/10 hover:bg-warning/15 rounded-full p-3 transition-colors duration-200'>
              <Icon icon='solar:translation-outline' className='text-warning h-5 w-5' />
            </div>
            <div>
              <h3 className='text-foreground text-lg font-semibold'>
                Languages ({languages.length})
              </h3>
              <p className='text-small text-foreground-500 mt-1'>Communicate across cultures</p>
            </div>
          </div>

          {isOwnProfile && (
            <ActionButtons showAdd onAdd={onAdd} addTooltip='Add new language' size='md' />
          )}
        </div>
      </CardHeader>

      <CardBody className='pt-0'>
        {languages.length > 0 ? (
          <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
            {languages.map((lang, index) => (
              <Card
                key={lang.id || index}
                className='border-default-200/50 from-background to-default-50/30 hover:border-warning/30 group border bg-gradient-to-br transition-all duration-300 hover:shadow-md'
              >
                <CardBody className='p-3'>
                  <div className='space-y-2'>
                    {/* Header with flag and name */}
                    <div className='flex items-center justify-between'>
                      <div className='flex min-w-0 flex-1 items-center gap-2'>
                        <div className='relative flex-shrink-0'>
                          <div className='border-default-200 bg-default-100 h-5 w-7 overflow-hidden rounded border shadow-sm'>
                            <img
                              src={getCountryFlag(lang)}
                              alt={`${lang.name || lang.key} flag`}
                              className='h-full w-full object-cover'
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<div class="w-full h-full bg-default-200 flex items-center justify-center text-xs font-bold text-default-600">${(lang.code || lang.key).substring(0, 2).toUpperCase()}</div>`;
                                }
                              }}
                            />
                          </div>
                          {lang.isNative && (
                            <div className='bg-success border-background absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full border' />
                          )}
                        </div>

                        <div className='min-w-0 flex-1'>
                          <h4 className='text-foreground truncate text-sm font-semibold'>
                            {lang.name || lang.key}
                          </h4>
                        </div>
                      </div>

                      {isOwnProfile && (
                        <div className='flex-shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
                          <ActionButtons
                            showEdit
                            showDelete
                            onEdit={() => onEdit(lang)}
                            onDelete={() => onDelete(lang)}
                            editTooltip={`Edit ${lang.name || lang.key}`}
                            deleteTooltip={`Delete ${lang.name || lang.key}`}
                            size='sm'
                          />
                        </div>
                      )}
                    </div>

                    {/* Level badge */}
                    <div className='flex justify-center'>
                      <Chip
                        size='sm'
                        color={getLevelColor(lang.level) as any}
                        variant='flat'
                        className='text-xs font-medium'
                      >
                        {getLevelLabel(lang.level)}
                      </Chip>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-8 text-center'>
            <div className='bg-warning/10 mb-3 flex h-12 w-12 items-center justify-center rounded-full'>
              <Icon icon='solar:translation-outline' className='text-warning/60 h-6 w-6' />
            </div>
            <p className='text-default-500 mb-3 text-sm'>No languages added yet</p>
            {isOwnProfile && (
              <Button
                size='sm'
                variant='flat'
                color='warning'
                onPress={onAdd}
                startContent={<Icon icon='solar:add-circle-outline' className='h-4 w-4' />}
              >
                <span className='hidden sm:inline'>Add Your First Language</span>
                <span className='sm:hidden'>Add Language</span>
              </Button>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
};
