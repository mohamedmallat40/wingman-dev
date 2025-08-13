'use client';

import React from 'react';
import { Button, Card, CardBody, CardHeader, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import { ActionButtons } from '../ActionButtons';
import { type Education } from '../../types';

interface EducationSectionProps {
  education: Education[];
  isOwnProfile: boolean;
  onAdd: () => void;
  onEdit: (education: Education) => void;
  onDelete: (education: Education) => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  education,
  isOwnProfile,
  onAdd,
  onEdit,
  onDelete
}) => {
  const t = useTranslations();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short'
      });
    } catch {
      return dateString;
    }
  };

  const sortedEducation = [...education].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <Card className='border-default-200/50 hover:border-secondary/20 transition-all duration-300'>
      <CardHeader className='pb-4'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 transition-colors duration-200'>
              <Icon icon='solar:graduation-minimalistic-linear' className='h-5 w-5 text-secondary' />
            </div>
            <div>
              <h3 className='text-lg font-semibold text-foreground'>
                Education ({education.length})
              </h3>
              <p className='text-sm text-default-500'>
                Academic background and qualifications
              </p>
            </div>
          </div>

          {isOwnProfile && (
            <ActionButtons
              showAdd
              onAdd={onAdd}
              addTooltip="Add education"
              size="md"
            />
          )}
        </div>
      </CardHeader>

      <CardBody className='pt-0'>
        {education.length > 0 ? (
          <div className='space-y-4'>
            {sortedEducation.map((edu, index) => (
              <div key={edu.id || index} className='group'>
                <div className='flex gap-4'>
                  {/* Timeline */}
                  <div className='flex flex-col items-center'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-secondary/30 bg-background'>
                      <Icon icon='solar:book-minimalistic-linear' className='h-4 w-4 text-secondary' />
                    </div>
                    {index < sortedEducation.length - 1 && (
                      <div className='mt-2 h-16 w-px bg-default-200' />
                    )}
                  </div>

                  {/* Content */}
                  <div className='min-w-0 flex-1 pb-6'>
                    <div className='flex items-start justify-between gap-3'>
                      <div className='min-w-0 flex-1'>
                        <div className='flex items-center gap-2 mb-1'>
                          <h4 className='font-semibold text-foreground'>
                            {edu.degree}
                          </h4>
                          {edu.grade && (
                            <Chip 
                              size='sm' 
                              variant='flat' 
                              color='secondary'
                              className='text-xs'
                            >
                              {edu.grade}
                            </Chip>
                          )}
                        </div>
                        
                        <p className='text-secondary font-medium mb-1'>
                          {edu.university}
                        </p>
                        
                        {edu.field && (
                          <p className='text-sm text-default-600 mb-2'>
                            {edu.field}
                          </p>
                        )}

                        <div className='flex items-center gap-1 text-xs text-default-500 mb-2'>
                          <Icon icon='solar:calendar-linear' className='h-3 w-3' />
                          <span>
                            {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                          </span>
                        </div>

                        {edu.description && (
                          <p className='text-sm text-default-600 leading-relaxed'>
                            {edu.description}
                          </p>
                        )}
                      </div>

                      {isOwnProfile && (
                        <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                          <ActionButtons
                            showEdit
                            showDelete
                            onEdit={() => onEdit(edu)}
                            onDelete={() => onDelete(edu)}
                            editTooltip={`Edit ${edu.degree}`}
                            deleteTooltip={`Delete ${edu.degree}`}
                            size="sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10'>
              <Icon icon='solar:graduation-minimalistic-linear' className='h-8 w-8 text-secondary/60' />
            </div>
            <p className='text-sm text-default-500 mb-4'>
              No education added yet
            </p>
            {isOwnProfile && (
              <Button
                size='sm'
                variant='flat'
                color='secondary'
                onPress={onAdd}
                startContent={<Icon icon='solar:add-circle-linear' className='h-4 w-4' />}
              >
                <span className='hidden sm:inline'>Add Education</span>
                <span className='sm:hidden'>Add</span>
              </Button>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
};
