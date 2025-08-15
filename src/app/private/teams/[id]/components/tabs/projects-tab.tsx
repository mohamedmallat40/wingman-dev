import React from 'react';

import { Avatar, AvatarGroup, Button, Card, CardBody, Chip, Progress } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

import { PROJECT_PRIORITY_CONFIG, PROJECT_STATUS_CONFIG, STAGGER_CONTAINER_VARIANTS, STAGGER_ITEM_VARIANTS } from '../constants';
import { getBaseUrl } from '@/lib/utils/utilities';

//import { ProjectPriority, ProjectStatus } from '../../types';
/* import {
  PROJECT_PRIORITY_CONFIG,
  PROJECT_STATUS_CONFIG,
  STAGGER_CONTAINER_VARIANTS,
  STAGGER_ITEM_VARIANTS
} from '../constants'; */

interface TeamProjectsTabProperties {
  team: any;
  isOwner: boolean;
  onRefetch: () => void;
}

const mockProjects: any[] = [
  {
    id: 'proj-1',
    name: 'E-Commerce Platform Redesign',
    description:
      'Complete redesign of the e-commerce platform with modern UI/UX and improved performance.',
    status: PROJECT_STATUS_CONFIG.IN_PROGRESS,
    startDate: '2024-01-15',
    endDate: '2024-03-30',
    teamId: 'team-1',
    createdBy: 'owner-1',
    assignedMembers: ['owner-1', 'user-2', 'user-3'],
    tags: ['Frontend', 'UI/UX', 'React'],
    priority: PROJECT_PRIORITY_CONFIG.HIGH,
    progress: 65
  },
  {
    id: 'proj-2',
    name: 'Mobile App Development',
    description: 'Native mobile application for iOS and Android platforms.',
    status: PROJECT_STATUS_CONFIG.PLANNING,
    startDate: '2024-02-01',
    endDate: '2024-05-15',
    teamId: 'team-1',
    createdBy: 'owner-1',
    assignedMembers: ['owner-1', 'user-4', 'user-5'],
    tags: ['Mobile', 'React Native', 'API'],
    priority: PROJECT_PRIORITY_CONFIG.MEDIUM,
    progress: 15
  },
  {
    id: 'proj-3',
    name: 'API Integration & Documentation',
    description:
      'Integration of third-party APIs and comprehensive documentation for the development team.',
    status: PROJECT_STATUS_CONFIG.COMPLETED,
    startDate: '2023-12-01',
    endDate: '2024-01-10',
    teamId: 'team-1',
    createdBy: 'owner-1',
    assignedMembers: ['owner-1', 'user-3'],
    tags: ['Backend', 'API', 'Documentation'],
    priority: PROJECT_PRIORITY_CONFIG.LOW,
    progress: 100
  }
];

export const TeamProjectsTab: React.FC<TeamProjectsTabProperties> = ({
  team,
  isOwner,
  onRefetch
}) => {
  const handleCreateProject = () => {
    // TODO: Implement create project functionality
    console.log('Create project clicked');
  };

  const handleEditProject = (projectId: string) => {
    // TODO: Implement edit project functionality
    console.log('Edit project:', projectId);
  };

  const handleDeleteProject = (projectId: string) => {
    // TODO: Implement delete project functionality
    console.log('Delete project:', projectId);
  };

  const handleViewProject = (projectId: string) => {
    // TODO: Implement view project functionality
    console.log('View project:', projectId);
  };

  const getStatusConfig = (status: any) => {
    return PROJECT_STATUS_CONFIG[status];
  };

  const getPriorityConfig = (priority: any) => {
    return PROJECT_PRIORITY_CONFIG[priority];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getProjectMembers = (assignedMembers: string[]) => {
    const allMembers = [
      team.owner,
      ...team.connections.map((conn: { target: any }) => conn.target)
    ];
    return assignedMembers
      .map((memberId) => allMembers.find((member) => member.id === memberId))
      .filter(Boolean);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'success';
    if (progress >= 50) return 'primary';
    if (progress >= 25) return 'warning';
    return 'danger';
  };

  if (mockProjects.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='flex flex-col items-center justify-center py-16 text-center'
      >
        <Icon icon='solar:folder-with-files-linear' className='text-default-300 mb-4 h-16 w-16' />
        <h3 className='text-foreground mb-2 text-xl font-semibold'>No Projects Yet</h3>
        <p className='text-default-600 mb-6 max-w-md'>
          {isOwner
            ? 'Create your first project to start collaborating with your team members.'
            : "This team hasn't created any projects yet."}
        </p>
        {isOwner && (
          <Button
            color='primary'
            variant='solid'
            startContent={<Icon icon='solar:add-circle-bold' className='h-4 w-4' />}
            onPress={handleCreateProject}
          >
            Create First Project
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-foreground text-lg font-semibold'>Team Projects</h3>
          <p className='text-default-600 text-sm'>
            {mockProjects.length} {mockProjects.length === 1 ? 'project' : 'projects'} in progress
          </p>
        </div>
        {isOwner && (
          <Button
            color='primary'
            variant='solid'
            size='sm'
            startContent={<Icon icon='solar:add-circle-bold' className='h-4 w-4' />}
            onPress={handleCreateProject}
          >
            New Project
          </Button>
        )}
      </div>

      {/* Projects Grid */}
      <motion.div
        variants={STAGGER_CONTAINER_VARIANTS}
        initial='hidden'
        animate='visible'
        className='grid grid-cols-1 gap-6 lg:grid-cols-2'
      >
        {mockProjects.map((project, index) => {
          const statusConfig = getStatusConfig(project.status);
          const priorityConfig = getPriorityConfig(project.priority);
          const projectMembers = getProjectMembers(project.assignedMembers);

          return (
            <motion.div
              key={project.id}
              variants={STAGGER_ITEM_VARIANTS}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className='h-full transition-all duration-200 hover:shadow-lg'>
                <CardBody className='p-6'>
                  <div className='flex h-full flex-col'>
                    {/* Project Header */}
                    <div className='mb-4 flex items-start justify-between'>
                      <div className='flex-1'>
                        <h4 className='text-foreground mb-2 line-clamp-2 font-semibold'>
                          {project.name}
                        </h4>
                        <div className='mb-3 flex items-center gap-2'>
                          <Chip
                            size='sm'
                            variant='flat'
                            color={statusConfig.color as any}
                            startContent={<Icon icon={statusConfig.icon} className='h-3 w-3' />}
                          >
                            {statusConfig.label}
                          </Chip>
                          <Chip
                            size='sm'
                            variant='flat'
                            color={priorityConfig.color as any}
                            startContent={<Icon icon={priorityConfig.icon} className='h-3 w-3' />}
                          >
                            {priorityConfig.label}
                          </Chip>
                        </div>
                      </div>
                      {isOwner && (
                        <div className='ml-2 flex gap-1'>
                          <Button
                            isIconOnly
                            size='sm'
                            variant='light'
                            color='default'
                            onPress={() => {
                              handleEditProject(project?.id);
                            }}
                          >
                            <Icon icon='solar:pen-linear' className='h-4 w-4' />
                          </Button>
                          <Button
                            isIconOnly
                            size='sm'
                            variant='light'
                            color='danger'
                            onPress={() => {
                              handleDeleteProject(project.id);
                            }}
                          >
                            <Icon icon='solar:trash-bin-minimalistic-linear' className='h-4 w-4' />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Project Description */}
                    <p className='text-default-600 mb-4 line-clamp-3 flex-1 text-sm'>
                      {project.description}
                    </p>

                    {/* Progress */}
                    <div className='mb-4'>
                      <div className='mb-2 flex items-center justify-between'>
                        <span className='text-foreground text-sm font-medium'>Progress</span>
                        <span className='text-default-600 text-sm'>{project.progress}%</span>
                      </div>
                      <Progress
                        value={project.progress}
                        color={getProgressColor(project.progress) as any}
                        size='sm'
                        className='mb-2'
                      />
                    </div>

                    {/* Project Timeline */}
                    <div className='text-default-500 mb-4 flex items-center gap-4 text-xs'>
                      <div className='flex items-center gap-1'>
                        <Icon icon='solar:calendar-linear' className='h-3 w-3' />
                        <span>Start: {formatDate(project.startDate)}</span>
                      </div>
                      {project.endDate && (
                        <div className='flex items-center gap-1'>
                          <Icon icon='solar:calendar-mark-linear' className='h-3 w-3' />
                          <span>End: {formatDate(project.endDate)}</span>
                        </div>
                      )}
                    </div>

                    {/* Project Members and Actions */}
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <AvatarGroup
                          size='sm'
                          max={3}
                          total={projectMembers.length}
                          renderCount={(count) => (
                            <p className='text-default-600 ml-2 text-xs'>+{count} more</p>
                          )}
                        >
                          {projectMembers.slice(0, 3).map((member) => (
                            <Avatar
                              key={member?.id}
                              src={member?.profileImage ? `${getBaseUrl()}/upload/${member?.profileImage}` : undefined}
                              name={`${member?.firstName} ${member?.lastName}`}
                              size='sm'
                            />
                          ))}
                        </AvatarGroup>
                      </div>

                      <Button
                        size='sm'
                        variant='bordered'
                        color='primary'
                        startContent={<Icon icon='solar:eye-bold' className='h-4 w-4' />}
                        onPress={() => {
                          handleViewProject(project.id);
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Projects Summary */}
      <Card className='bg-default-50'>
        <CardBody className='p-4'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
            <div className='text-center'>
              <div className='mb-1 flex items-center justify-center gap-2'>
                <Icon icon='solar:play-circle-bold' className='text-primary h-4 w-4' />
                <span className='text-foreground text-lg font-bold'>
                  {mockProjects.filter((p) => p.status === ProjectStatus.IN_PROGRESS).length}
                </span>
              </div>
              <p className='text-default-600 text-xs'>In Progress</p>
            </div>

            <div className='text-center'>
              <div className='mb-1 flex items-center justify-center gap-2'>
                <Icon icon='solar:check-circle-bold' className='text-success h-4 w-4' />
                <span className='text-foreground text-lg font-bold'>
                  {mockProjects.filter((p) => p.status === ProjectStatus.COMPLETED).length}
                </span>
              </div>
              <p className='text-default-600 text-xs'>Completed</p>
            </div>

            <div className='text-center'>
              <div className='mb-1 flex items-center justify-center gap-2'>
                <Icon icon='solar:clock-circle-bold' className='text-warning h-4 w-4' />
                <span className='text-foreground text-lg font-bold'>
                  {mockProjects.filter((p) => p.status === ProjectStatus.PLANNING).length}
                </span>
              </div>
              <p className='text-default-600 text-xs'>Planning</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
