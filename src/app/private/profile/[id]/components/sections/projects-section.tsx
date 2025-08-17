import React from 'react';

import { Button, Card, CardBody, CardHeader } from '@heroui/react';
import { Icon } from '@iconify/react';

import { Experience } from '../../types';
import { ActionButtons } from '../ActionButtons';

interface ProjectsSectionProps {
  projects: Experience[];
  isOwnProfile: boolean;
  onAdd: () => void;
  onEdit: (project: Experience) => void;
  onDelete: (project: Experience) => void;
  t: (key: string) => string;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  isOwnProfile,
  onAdd,
  onEdit,
  onDelete,
  t
}) => {
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

  return (
    <Card
      id='projects'
      className='border-default-200/50 hover:border-secondary/20 scroll-mt-24 shadow-sm transition-all duration-300 hover:shadow-md'
    >
      <CardHeader className='pb-4'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='bg-secondary/10 rounded-full p-3'>
              <Icon icon='solar:code-square-linear' className='text-secondary h-5 w-5' />
            </div>
            <div>
              <h2 className='text-foreground text-xl font-semibold'>
                Projects ({projects?.length})
              </h2>
              <p className='text-small text-foreground-500 mt-1'>
                Featured projects and portfolio work
              </p>
            </div>
          </div>

          {isOwnProfile && (
            <ActionButtons showAdd onAdd={onAdd} addTooltip='Add new project' size='md' />
          )}
        </div>
      </CardHeader>
      <CardBody className='px-8 pt-2'>
        {projects.length > 0 ? (
          <div className='space-y-8'>
            {[...projects]
              .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
              .map((project, index) => (
                <div key={project.id || index} className='relative'>
                  {index < projects.length - 1 && (
                    <div className='from-secondary/20 absolute top-14 bottom-0 left-6 w-px bg-gradient-to-b to-transparent' />
                  )}

                  <div className='flex gap-6'>
                    <div className='flex-shrink-0'>
                      <Icon
                        icon='solar:code-square-linear'
                        className='text-secondary mt-2 h-5 w-5'
                      />
                    </div>

                    <div className='flex-1 space-y-4'>
                      <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                        <div className='space-y-2'>
                          <div className='flex items-center gap-2'>
                            <h3 className='text-foreground text-lg font-bold'>
                              {project.position}
                            </h3>
                            {isOwnProfile && (
                              <ActionButtons
                                showEdit
                                showDelete
                                onEdit={() => onEdit(project)}
                                onDelete={() => onDelete(project)}
                                editTooltip={`Edit ${project.position} project`}
                                deleteTooltip={`Delete ${project.position} project`}
                              />
                            )}
                          </div>
                          <div className='space-y-1'>
                            <p className='text-foreground-700 font-medium'>{project.company}</p>
                            <p className='text-foreground-600 text-sm'>{project.position}</p>
                            {project.location && (
                              <p className='text-foreground-500 flex items-center gap-1 text-sm'>
                                <Icon icon='solar:map-point-linear' className='h-3 w-3' />
                                {project.location}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className='text-small text-foreground-500 bg-secondary/10 flex items-center gap-2 rounded-full px-3 py-2'>
                          <Icon icon='solar:calendar-linear' className='h-4 w-4' />
                          <span>
                            {formatDate(project.startDate)} —{' '}
                            {project.endDate ? formatDate(project.endDate) : 'Ongoing'}
                          </span>
                        </div>
                      </div>

                      {project.description && (
                        <p className='text-foreground-600 leading-relaxed'>{project.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className='flex items-center justify-center py-12 text-center'>
            <div>
              <Icon
                icon='solar:code-square-linear'
                className='text-default-300 mx-auto mb-4 h-12 w-12'
              />
              <p className='text-foreground-500 mb-4'>No projects to display</p>
              {isOwnProfile && (
                <Button
                  color='primary'
                  variant='flat'
                  size='sm'
                  startContent={<Icon icon='solar:plus-linear' className='h-4 w-4' />}
                  onPress={onAdd}
                >
                  Add Project
                </Button>
              )}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export { ProjectsSection };
