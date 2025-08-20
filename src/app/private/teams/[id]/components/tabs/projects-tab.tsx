import React, { useState } from 'react';

import type { Group } from '../../types';

import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardBody,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  useDisclosure
} from '@heroui/react';
import { addToast } from '@heroui/toast';
import { Icon } from '@iconify/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import wingManApi from '@/lib/axios';
import { getBaseUrl } from '@/lib/utils/utilities';

import { Skill } from '../../types';
import {
  PROJECT_PRIORITY_CONFIG,
  PROJECT_STATUS_CONFIG,
  STAGGER_CONTAINER_VARIANTS,
  STAGGER_ITEM_VARIANTS
} from '../constants';
import { ProjectModal } from '../modals/projects-modal';

interface Project {
  id: string;
  title: string;
  summary: string;
  backgroundImage?: string;
  skills: Skill[];
  assignedMembers?: string[];
  progress?: number;
  createdAt: string;
}

interface TeamProjectsTabProperties {
  team: Group;
  isOwner: boolean;
  onRefetch: () => void;
}

// API functions (adjust these according to your API service structure)
const projectsApi = {
  getProjects: async (teamId: string): Promise<Project[]> => {
    const response = await wingManApi.get(`/groups/${teamId}/projects`);
    return response.data;
  },

  createProject: async (
    teamId: string,
    project: Omit<Project, 'id' | 'teamId' | 'createdBy'>
  ): Promise<Project> => {
    const response = await wingManApi.post(`/groups/${teamId}/projects`, project);
    return response.data;
  },

  updateProject: async (
    teamId: string,
    projectId: string,
    project: Partial<Project>
  ): Promise<Project> => {
    const response = await wingManApi.put(`/groups/${teamId}/projects`);
    return response.data;
  },

  deleteProject: async (projectId: string): Promise<any> => {
    const response = await wingManApi.get(`/projects/${projectId}/projects`);
    return response.data;
  }
};
export const TeamProjectsTab: React.FC<TeamProjectsTabProperties> = ({
  team,
  isOwner,
  onRefetch
}) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const queryClient = useQueryClient();
  console.log('team', isOwner);

  // Modal controls
  const {
    isOpen: isProjectModalOpen,
    onOpen: openProjectModal,
    onClose: closeProjectModal
  } = useDisclosure();

  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal
  } = useDisclosure();

  // Fetch projects
  const {
    data: projects = [],
    isLoading: isLoadingProjects,
    error: projectsError
  } = useQuery({
    queryKey: ['projects', team.id],
    queryFn: () => projectsApi.getProjects(team.id),
    enabled: !!team.id
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: (project: Omit<Project, 'id' | 'teamId' | 'createdBy'>) =>
      projectsApi.createProject(team.id, project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', team.id] });
      addToast({
        title: 'Project created successfully!',
        description: 'Your project has been created.',
        color: 'success'
      });
      onRefetch();
    },
    onError: (error: any) => {
      console.error('Create project error:', error);
      addToast.error('Failed to create project. Please try again.');
    }
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: ({ projectId, project }: { projectId: string; project: Partial<Project> }) =>
      projectsApi.updateProject(team.id, projectId, project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', team.id] });
      addToast({
        title: 'Project updated successfully!',
        description: 'Your project has been updated.',
        color: 'success'
      });
      onRefetch();
    },
    onError: (error: any) => {
      console.error('Update project error:', error);
      addToast.error('Failed to update project. Please try again.');
    }
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: (projectId: string) => projectsApi.deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', team.id] });
      addToast({
        title: 'Project deleted successfully!',
        description: 'Your project has been deleted.',
        color: 'success'
      });
      onRefetch();
      closeDeleteModal();
      setProjectToDelete(null);
    },
    onError: (error: any) => {
      console.error('Delete project error:', error);
      addToast.error('Failed to delete project. Please try again.');
    }
  });

  // Handlers
  const handleCreateProject = () => {
    setSelectedProject(null);
    openProjectModal();
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    openProjectModal();
  };

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    openDeleteModal();
  };

  const handleConfirmDelete = async () => {
    if (projectToDelete) {
      deleteProjectMutation.mutate(projectToDelete.id);
    }
  };

  const handleViewProject = (projectId: string) => {
    // TODO: Implement view project functionality
    console.log('View project:', projectId);
    // Navigate to project detail page
  };

  const handleProjectSubmit = async (projectData: any) => {
    try {
      if (selectedProject) {
        // Update existing project
        await updateProjectMutation.mutateAsync({
          projectId: selectedProject.id,
          project: projectData
        });
      } else {
        // Create new project
        await createProjectMutation.mutateAsync(projectData);
      }
    } catch (error) {
      // Error handling is done in the mutation's onError callback
      throw error;
    }
  };

  // Helper functions
  const getStatusConfig = (status: any) => {
    return PROJECT_STATUS_CONFIG[status] || PROJECT_STATUS_CONFIG.PLANNING;
  };

  const getPriorityConfig = (priority: any) => {
    return PROJECT_PRIORITY_CONFIG[priority] || PROJECT_PRIORITY_CONFIG.MEDIUM;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getProjectMembers = (assignedMembers: string[] = []) => {
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

  // Loading state
  if (isLoadingProjects) {
    return (
      <div className='flex items-center justify-center py-16'>
        <div className='flex flex-col items-center gap-4'>
          <div className='border-primary h-8 w-8 animate-spin rounded-full border-b-2'></div>
          <p className='text-default-600'>Loading projects...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (projectsError) {
    return (
      <div className='flex flex-col items-center justify-center py-16 text-center'>
        <Icon icon='solar:danger-circle-linear' className='text-danger mb-4 h-12 w-12' />
        <h3 className='text-foreground mb-2 text-lg font-semibold'>Failed to Load Projects</h3>
        <p className='text-default-600 mb-4'>There was an error loading the team projects.</p>
        <Button
          color='primary'
          variant='bordered'
          onPress={() => queryClient.invalidateQueries({ queryKey: ['projects', team.id] })}
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Empty state
  if (projects.length === 0) {
    return (
      <>
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

        {/* Project Modal */}
        <ProjectModal
          isOpen={isProjectModalOpen}
          onClose={closeProjectModal}
          onSubmit={handleProjectSubmit}
          project={selectedProject}
          teamId={team.id}
          isLoading={createProjectMutation.isPending || updateProjectMutation.isPending}
        />
      </>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-foreground text-lg font-semibold'>Team Projects</h3>
          <p className='text-default-600 text-sm'>
            {projects.length} {projects.length === 1 ? 'project' : 'projects'} total
          </p>
        </div>
        {isOwner && (
          <Button
            color='primary'
            variant='solid'
            size='sm'
            startContent={<Icon icon='solar:add-circle-bold' className='h-4 w-4' />}
            onPress={handleCreateProject}
            isLoading={createProjectMutation.isPending}
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
        className='grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3'
      >
        {projects.map((project, index) => {
          const projectMembers = getProjectMembers(project.assignedMembers);
          const progress = project.progress ?? 0;

          return (
            <motion.div
              key={project.id}
              variants={STAGGER_ITEM_VARIANTS}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className='group border-default-200 hover:border-primary-300 h-full cursor-pointer border-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
                <CardBody className='overflow-hidden p-0'>
                  {/* Background Image or Placeholder */}
                  <div className='from-primary-100 via-secondary-50 to-primary-50 relative h-48 w-full overflow-hidden bg-gradient-to-br'>
                    {project.backgroundImage ? (
                      <img
                        src={`${getBaseUrl()}/upload/${project.backgroundImage}`}
                        alt={project.title}
                        className='h-full w-full object-cover transition-transform duration-300'
                      />
                    ) : (
                      <div className='flex h-full w-full items-center justify-center'>
                        <div className='flex flex-col items-center gap-3'>
                          <div className='bg-primary-200/50 rounded-full p-4'>
                            <Icon
                              icon='solar:folder-favourite-bookmark-outline'
                              className='text-primary-600 h-8 w-8'
                            />
                          </div>
                          <div className='text-center'>
                            <p className='text-primary-700 text-sm font-medium'>Project</p>
                            <p className='text-primary-500 text-xs opacity-75'>No image</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Overlay Actions */}
                    <div className='absolute top-3 right-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
                      <div className='flex gap-1'>
                        {isOwner && (
                          <>
                            <Button
                              isIconOnly
                              size='sm'
                              variant='solid'
                              className='text-default-600 bg-white/90 shadow-lg hover:bg-white'
                              onPress={() => {
                                handleEditProject(project);
                              }}
                              isLoading={updateProjectMutation.isPending}
                            >
                              <Icon icon='solar:pen-linear' className='h-4 w-4' />
                            </Button>
                            <Button
                              isIconOnly
                              size='sm'
                              variant='solid'
                              className='text-danger-600 bg-white/90 shadow-lg hover:bg-white'
                              onPress={() => {
                                handleDeleteProject(project);
                              }}
                            >
                              <Icon
                                icon='solar:trash-bin-minimalistic-linear'
                                className='h-4 w-4'
                              />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className='flex flex-1 flex-col gap-4 p-5'>
                    {/* Title and Date */}
                    <div className='space-y-2'>
                      <div className='flex items-start justify-between gap-2'>
                        <h4 className='text-foreground group-hover:text-primary-600 line-clamp-2 text-lg font-semibold transition-colors'>
                          {project.title}
                        </h4>
                      </div>
                      <div className='text-default-500 flex items-center gap-2 text-xs'>
                        <Icon icon='solar:calendar-linear' className='h-3.5 w-3.5' />
                        <span>Created {formatDate(project.createdAt)}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className='text-default-600 line-clamp-3 flex-1 text-sm'>
                      {project.summary}
                    </p>

                    {/* Skills */}
                    {project.skills.length > 0 && (
                      <div className='space-y-2'>
                        <div className='flex flex-wrap gap-1'>
                          {project.skills.slice(0, 3).map((skill, skillIndex) => (
                            <Chip
                              key={skillIndex}
                              size='sm'
                              variant='flat'
                              color='primary'
                              className='text-xs'
                            >
                              {skill.key}
                            </Chip>
                          ))}
                          {project.skills.length > 3 && (
                            <Chip size='sm' variant='flat' color='default' className='text-xs'>
                              +{project.skills.length - 3} more
                            </Chip>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Progress Bar */}
                    {progress > 0 && (
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                          <p className='text-default-500 text-xs font-medium tracking-wide uppercase'>
                            Progress
                          </p>
                          <span className='text-default-600 text-xs font-medium'>{progress}%</span>
                        </div>
                        <Progress
                          value={progress}
                          color={getProgressColor(progress)}
                          size='sm'
                          className='w-full'
                        />
                      </div>
                    )}

                    {/* Team Members */}
                    {projectMembers.length > 0 && (
                      <div className='space-y-2'>
                        <p className='text-default-500 text-xs font-medium tracking-wide uppercase'>
                          Team Members
                        </p>
                        <div className='flex items-center justify-between'>
                          <AvatarGroup isBordered max={4} size='sm' className='justify-start'>
                            {projectMembers.map((member, memberIndex) => (
                              <Avatar
                                key={memberIndex}
                                src={
                                  member?.profilePicture
                                    ? `${getBaseUrl()}/upload/${member.profilePicture}`
                                    : undefined
                                }
                                name={member?.username || member?.firstName || 'Unknown'}
                                size='sm'
                                className='border-2 border-white'
                              />
                            ))}
                          </AvatarGroup>
                          {projectMembers.length > 4 && (
                            <span className='text-default-500 text-xs'>
                              +{projectMembers.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Project Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={closeProjectModal}
        onSubmit={handleProjectSubmit}
        project={selectedProject}
        teamId={team.id}
        isLoading={createProjectMutation.isPending || updateProjectMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} size='md'>
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>
            <div className='flex items-center gap-2'>
              <Icon icon='solar:danger-circle-linear' className='text-danger h-5 w-5' />
              <span>Delete Project</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className='space-y-3'>
              <p className='text-foreground'>
                Are you sure you want to delete{' '}
                <span className='font-semibold'>"{projectToDelete?.title}"</span>?
              </p>
              <p className='text-default-600 text-sm'>
                This action cannot be undone. All project data, including tasks, files, and
                collaboration history will be permanently deleted.
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant='light'
              onPress={closeDeleteModal}
              isDisabled={deleteProjectMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              color='danger'
              variant='solid'
              onPress={handleConfirmDelete}
              isLoading={deleteProjectMutation.isPending}
              startContent={
                deleteProjectMutation.isPending ? undefined : (
                  <Icon icon='solar:trash-bin-minimalistic-bold' className='h-4 w-4' />
                )
              }
            >
              Delete Project
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
