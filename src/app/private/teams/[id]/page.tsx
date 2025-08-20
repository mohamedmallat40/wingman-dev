'use client';

import React, { useCallback, useState } from 'react';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { getMyProfile } from '@root/modules/profile/services/profile.service';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';

import DashboardLayout from '@/components/layouts/dashboard-layout';

import { DeleteConfirmationModal } from '../../broadcasts/components';
import ConfirmDeleteModal from '../../components/confirm-delete';
import { BREADCRUMB_CONFIG } from './components/constants';
import { EditTeamModal } from './components/modals/edit-team-modal';
//import { TeamDetailsHeader } from './components/header';
//import { TeamDetailsTabs } from './components/navigation';
import { TeamMembersTab } from './components/tabs/members';
import { TeamOverviewTab } from './components/tabs/overview';
import { TeamProjectsTab } from './components/tabs/projects-tab';
import { TeamToolsTab } from './components/tabs/tools-tab';
//import { TeamDetailsHeader } from './components/teams-header';
import { TeamDetailsTabs } from './components/teams-navigation';
import { useTeamDetails } from './hooks/useTeamsDetails';
import { teamService } from './services/teams.services';
// Import constants
// Import hooks
import { type TeamDetailsTab as TabType } from './types';
import { set } from 'zod';

const TeamDetailsPage: React.FC = () => {
  // ============================================================================
  // STATE AND HOOKS
  // ============================================================================

  const parameters = useParams();
  const router = useRouter();
  const teamId = parameters.id as string;

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teamTodelete, setTeamTodelete] = useState<{
    isOpen: boolean;
    name: string;
  } | null>(null);

  // Custom hook to fetch team data
  const { team, loading, error, refetch } = useTeamDetails(teamId);

  const { data: currentUser } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => await getMyProfile()
  });

  console.log('currentUser', currentUser);
  const isOwner = team?.owner.id === currentUser?.data?.id;
  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleEditTeam = useCallback(() => {
    setIsEditModalOpen(true);
  }, []);

  const handleJoinTeam = useCallback(() => {
    // In real app: call join team API
    console.log('Join team:', teamId);
  }, [teamId]);

  const handleConnectToOwner = useCallback(() => {
    if (team?.owner) {
      // In real app: call connect API
      console.log('Connect to owner:', team.owner.id);
    }
  }, [team?.owner]);

  const handleViewMemberProfile = useCallback(
    (memberId: string) => {
      router.push(`/private/profile/${memberId}`);
    },
    [router]
  );

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  // ============================================================================
  // RENDER METHODS
  // ============================================================================

  const renderTabContent = () => {
    if (!team) return null;

    const commonProperties = {
      team,
      onViewProfile: handleViewMemberProfile,
      onRefetch: refetch,
      isOwner: isOwner
    };

    switch (activeTab) {
      case 'overview': {
        return <TeamOverviewTab {...commonProperties} />;
      }
      case 'members': {
        return <TeamMembersTab {...commonProperties} />;
      }
      case 'tools': {
        return <TeamToolsTab {...commonProperties} />;
      }
      case 'projects': {
        return <TeamProjectsTab {...commonProperties} />;
      }
      default: {
        return null;
      }
    }
  };

  const getBreadcrumbs = () => [
    BREADCRUMB_CONFIG.HOME,
    BREADCRUMB_CONFIG.TALENT_POOL,
    BREADCRUMB_CONFIG.TEAMS,
    {
      label: team?.groupName ?? 'Team Details',
      icon: 'solar:users-group-rounded-linear'
    }
  ];
  const handleDeleteConfirm = useCallback(async () => {
    try {
      await teamService.deleteTeam(teamId);
      router.push('/private/talent-pool');
    } catch (error) {
      console.error('Error deleting team:', error);
      // Handle error (show toast notification, etc.)
    }
  }, [teamId, router]);

  const handleDeleteTeam = useCallback(() => {
    setTeamTodelete({ isOpen: true, name: team?.groupName ?? '' });
  }, [team]);

  const getHeaderActions = () => {
    if (!team) return null;

    // Check if current user is the team owner (you'll need to implement getCurrentUser)

    if (isOwner) {
      return (
        <div className='flex items-center gap-2'>
          <Button
            color='primary'
            variant='flat'
            size='sm'
            startContent={<Icon icon='solar:pen-linear' className='h-4 w-4' />}
            onPress={handleEditTeam}
            className='transition-all duration-200 hover:shadow-md'
          >
            Edit Team
          </Button>
          <Button
            color='danger'
            variant='flat'
            size='sm'
            startContent={<Icon icon='solar:trash-bin-minimalistic-linear' className='h-4 w-4' />}
            onPress={handleDeleteTeam}
            className='transition-all duration-200 hover:shadow-md'
          >
            Delete Team
          </Button>
        </div>
      );
    }

    return (
      <div className='flex items-center gap-2'>
        {/* 
        <Button
          color='secondary'
          variant='flat'
          size='sm'
          startContent={<Icon icon='solar:user-plus-linear' className='h-4 w-4' />}
          onPress={handleConnectToOwner}
          className='transition-all duration-200 hover:shadow-md'
        >
          Connect
        </Button>
        <Button
          color='primary'
          variant='flat'
          size='sm'
          startContent={<Icon icon='solar:users-group-two-rounded-linear' className='h-4 w-4' />}
          onPress={handleJoinTeam}
          className='transition-all duration-200 hover:shadow-md'
        >
          Join Team
        </Button> */}
      </div>
    );
  };

  // ============================================================================
  // LOADING AND ERROR STATES
  // ============================================================================

  if (loading) {
    return (
      <DashboardLayout
        pageTitle='Loading...'
        pageDescription='Loading team details'
        pageIcon='solar:users-group-rounded-linear'
        breadcrumbs={getBreadcrumbs()}
      >
        <div className='flex min-h-96 items-center justify-center'>
          <div className='flex items-center space-x-2'>
            <Icon icon='solar:loading-linear' className='h-6 w-6 animate-spin' />
            <span>Loading team details...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !team) {
    return (
      <DashboardLayout
        pageTitle='Team Not Found'
        pageDescription='The requested team could not be found'
        pageIcon='solar:users-group-rounded-linear'
        breadcrumbs={getBreadcrumbs()}
      >
        <div className='flex min-h-96 flex-col items-center justify-center space-y-4'>
          <Icon icon='solar:close-circle-linear' className='text-danger h-16 w-16' />
          <h2 className='text-xl font-semibold'>Team Not Found</h2>
          <p className='max-w-md text-center text-gray-600'>
            {"The team you're looking for doesn't exist or you don't have permission to view it."}
          </p>
          <Button
            color='primary'
            variant='flat'
            startContent={<Icon icon='solar:arrow-left-linear' className='h-4 w-4' />}
            onPress={handleBack}
          >
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <DashboardLayout
      pageTitle={team.groupName}
      pageDescription={`Team details for ${team.groupName}`}
      pageIcon='solar:users-group-rounded-linear'
      breadcrumbs={getBreadcrumbs()}
      headerActions={getHeaderActions()}
    >
      <div className='mx-auto w-full space-y-8 px-4 py-6 sm:px-6 lg:px-8 xl:max-w-[85%] 2xl:max-w-[75%]'>
        {/* Team Header */}
        {/* <TeamDetailsHeader
          team={team}
          onBack={handleBack}
          onEdit={handleEditTeam}
          onJoin={handleJoinTeam}
          onConnectToOwner={handleConnectToOwner}
        /> */}

        {/* Tabs Navigation */}
        <TeamDetailsTabs activeTab={activeTab} onTabChange={handleTabChange} team={team} />

        {/* Tab Content */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Edit Team Modal - Will be implemented later */}
      <EditTeamModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
        }}
        team={team}
        onSave={refetch}
      />

      <ConfirmDeleteModal
        isOpen={teamTodelete?.isOpen ?? false}
        onOpenChange={(open) => {
          if (!open) setTeamTodelete({ id: null, isOPen: false });
        }}
        onConfirm={handleDeleteConfirm}
        title='Delete Note'
        message='Are you sure you want to delete this note? This action cannot be undone.'
        itemName='Note'
      />
    </DashboardLayout>
  );
};

export default TeamDetailsPage;
