'use client';

import React from 'react';
import { Button, Card, CardBody, CardHeader, Chip, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import { ActionButtons } from '../ActionButtons';
import { type Language } from '../../types';

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
    <Card className='border-default-200/50 scroll-mt-24 shadow-sm hover:shadow-md transition-all duration-300 hover:border-warning/20'>
      <CardHeader className='pb-4'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='bg-warning/10 rounded-full p-3 hover:bg-warning/15 transition-colors duration-200'>
              <Icon icon='solar:translation-outline' className='text-warning h-5 w-5' />
            </div>
            <div>
              <h3 className='text-foreground text-lg font-semibold'>
                Languages ({languages.length})
              </h3>
              <p className='text-small text-foreground-500 mt-1'>
                Communicate across cultures
              </p>
            </div>
          </div>

          {isOwnProfile && (
            <ActionButtons
              showAdd
              onAdd={onAdd}
              addTooltip="Add new language"
              size="md"
            />
          )}
        </div>
      </CardHeader>

      <CardBody className='pt-0'>
        {languages.length > 0 ? (
          <div className='grid gap-4 sm:grid-cols-2'>
            {languages.map((lang, index) => (
              <Card 
                key={lang.id || index}
                className='border border-default-200/50 bg-gradient-to-br from-background to-default-50/30 hover:shadow-md transition-all duration-300 hover:border-warning/30 group'
              >
                <CardBody className='p-4'>
                  <div className='space-y-3'>
                    {/* Header with flag and name */}
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <div className='relative'>
                          <div className='h-7 w-10 overflow-hidden rounded-md border border-default-200 shadow-sm bg-default-100'>
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
                            <div className='absolute -top-1 -right-1 h-3 w-3 bg-success rounded-full border-2 border-background' />
                          )}
                        </div>
                        
                        <div className='flex-1 min-w-0'>
                          <h4 className='font-semibold text-foreground truncate'>
                            {lang.name || lang.key}
                          </h4>
                          {lang.nativeName && lang.nativeName !== (lang.name || lang.key) && (
                            <p className='text-xs text-default-500 truncate'>{lang.nativeName}</p>
                          )}
                        </div>
                      </div>

                      {isOwnProfile && (
                        <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                          <ActionButtons
                            showEdit
                            showDelete
                            onEdit={() => onEdit(lang)}
                            onDelete={() => onDelete(lang)}
                            editTooltip={`Edit ${lang.name || lang.key}`}
                            deleteTooltip={`Delete ${lang.name || lang.key}`}
                            size="sm"
                          />
                        </div>
                      )}
                    </div>

                    {/* Level badge */}
                    <div className='flex items-center justify-between'>
                      <Chip
                        size='sm'
                        color={getLevelColor(lang.level) as any}
                        variant='flat'
                        className='font-medium'
                      >
                        {getLevelLabel(lang.level)}
                      </Chip>
                      
                      {lang.yearsOfExperience && lang.yearsOfExperience > 0 && (
                        <div className='flex items-center gap-1 text-xs text-default-600'>
                          <Icon icon='solar:calendar-outline' className='h-3 w-3' />
                          <span>{lang.yearsOfExperience}y</span>
                        </div>
                      )}
                    </div>

                    {/* Skills - simplified */}
                    <div className='flex gap-1'>
                      {[
                        { key: 'canSpeak', icon: 'solar:microphone-outline', label: 'S' },
                        { key: 'canUnderstand', icon: 'solar:headphones-outline', label: 'L' },
                        { key: 'canRead', icon: 'solar:book-outline', label: 'R' },
                        { key: 'canWrite', icon: 'solar:pen-outline', label: 'W' }
                      ].map((skill) => (
                        <div
                          key={skill.key}
                          className={`flex items-center justify-center h-6 w-6 rounded-full text-xs transition-colors ${
                            lang[skill.key as keyof Language] 
                              ? 'bg-warning/20 text-warning-700' 
                              : 'bg-default-100 text-default-400'
                          }`}
                          title={skill.label === 'S' ? 'Speaking' : skill.label === 'L' ? 'Listening' : skill.label === 'R' ? 'Reading' : 'Writing'}
                        >
                          <Icon icon={skill.icon} className='h-3 w-3' />
                        </div>
                      ))}
                    </div>

                    {/* Certification - if exists */}
                    {lang.certificationName && (
                      <>
                        <Divider className='my-2' />
                        <div className='flex items-center gap-2 text-xs'>
                          <Icon icon='solar:diploma-outline' className='h-3 w-3 text-success' />
                          <span className='text-success font-medium truncate'>{lang.certificationName}</span>
                          {lang.certificationLevel && (
                            <Chip size='sm' color='success' variant='dot' className='text-tiny'>
                              {lang.certificationLevel}
                            </Chip>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-warning/10'>
              <Icon icon='solar:translation-outline' className='h-8 w-8 text-warning/60' />
            </div>
            <p className='text-sm text-default-500 mb-4'>
              No languages added yet
            </p>
            {isOwnProfile && (
              <Button
                size='sm'
                variant='flat'
                color='warning'
                onPress={onAdd}
                startContent={<Icon icon='solar:add-circle-outline' className='h-4 w-4' />}
              >
                Add Your First Language
              </Button>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
};
