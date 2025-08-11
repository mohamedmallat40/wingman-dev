'use client';

import React, { useCallback, useState } from 'react';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import DashboardLayout from '@/components/layouts/dashboard-layout';

import { TalentFiltersPanel } from './components/filters';
import {
  AgencyListContainer,
  FreelancerListContainer,
  TeamListContainer
} from './components/lists';
import { InviteTalentModal } from './components/modals';
import { TalentPoolTabs } from './components/navigation';
// Import constants
import {
  ACTION_ITEMS,
  BREADCRUMB_CONFIG,
  TAB_BREADCRUMB_ICONS,
  TAB_BREADCRUMB_LABELS
} from './constants';
import { useFilterMemoization } from './hooks/useFilterMemoization';
// Import custom hooks
import { useTalentPoolState } from './hooks/useTalentPoolState';
import { type TalentType } from './types';

const TalentPoolPage: React.FC = () => {
  // ============================================================================
  // SIMPLIFIED STATE MANAGEMENT USING CUSTOM HOOKS
  // ============================================================================

  const router = useRouter();
  const talentPoolState = useTalentPoolState();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const {
    activeTab,
    searchQuery,
    filters,
    showFilters,
    tabCounts,
    setActiveTab,
    setSearchQuery,
    handleSearch,
    setFilters,
    toggleFilters,
    updateTabCount
  } = talentPoolState;

  // Get memoized filter information for performance
  const { activeFiltersCount } = useFilterMemoization(filters);

  // ============================================================================
  // EVENT HANDLERS (Simplified with better naming)
  // ============================================================================

  const handleViewProfile = useCallback(
    (userId: string) => {
      router.push(`/private/profile/${userId}`);
    },
    [router]
  );

  const handleConnect = useCallback((userId: string) => {
    console.log('Connect with user:', userId);
    // In real app: call connection API
  }, []);

  const handleViewTeam = useCallback((teamId: string) => {
    console.log('Navigate to team:', teamId);
    // In real app: router.push(`/team/${teamId}`);
  }, []);

  const handleJoinTeam = useCallback((teamId: string) => {
    console.log('Join team:', teamId);
    // In real app: call join team API
  }, []);

  const handleCreateTeam = useCallback(() => {
    console.log('Create new team');
    // In real app: open create team modal or navigate to create team page
  }, []);

  const handleInviteUser = useCallback(() => {
    setIsInviteModalOpen(true);
  }, []);

  const handleInviteModalClose = useCallback(() => {
    setIsInviteModalOpen(false);
  }, []);

  const handleInviteSubmit = useCallback(
    async (data: {
      firstName: string;
      lastName: string;
      email: string;
      personalMessage?: string;
    }) => {
      const { inviteUserToPlatform } = await import(
        '@root/modules/invitations/services/invitations.service'
      );

      try {
        const result = await inviteUserToPlatform(data);
        console.log('Invitation sent successfully:', result);
      } catch (error) {
        console.error('Failed to send invitation:', error);
        throw error; // Re-throw to let the modal handle the error display
      }
    },
    []
  );

  // Tab count handlers using the updateTabCount action
  const handleFreelancerCountChange = useCallback(
    (count: number) => {
      updateTabCount('freelancers', count);
    },
    [updateTabCount]
  );

  const handleAgencyCountChange = useCallback(
    (count: number) => {
      updateTabCount('agencies', count);
    },
    [updateTabCount]
  );

  const handleTeamCountChange = useCallback(
    (count: number) => {
      updateTabCount('teams', count);
    },
    [updateTabCount]
  );

  const renderActiveTabContent = () => {
    const commonProps = {
      filters,
      onViewProfile: handleViewProfile,
      onConnect: handleConnect
    };

    switch (activeTab) {
      case 'freelancers':
        return (
          <FreelancerListContainer {...commonProps} onCountChange={handleFreelancerCountChange} />
        );
      case 'agencies':
        return <AgencyListContainer {...commonProps} onCountChange={handleAgencyCountChange} />;
      case 'teams':
        return (
          <TeamListContainer
            filters={filters}
            onViewTeam={handleViewTeam}
            onJoinTeam={handleJoinTeam}
            onCountChange={handleTeamCountChange}
          />
        );
      default:
        return null;
    }
  };

  const getBreadcrumbs = () => {
    const baseBreadcrumbs = [BREADCRUMB_CONFIG.HOME, BREADCRUMB_CONFIG.TALENT_POOL];

    return [
      ...baseBreadcrumbs,
      {
        label: TAB_BREADCRUMB_LABELS[activeTab],
        icon: TAB_BREADCRUMB_ICONS[activeTab]
      }
    ];
  };

  // Action items with handlers
  const actionItems = ACTION_ITEMS.map((item) => ({
    ...item,
    onClick:
      item.key === 'create-team'
        ? handleCreateTeam
        : item.key === 'invite'
          ? handleInviteUser
          : () => console.log(`${item.label} clicked`)
  }));

  return (
    <DashboardLayout
      pageTitle='Talent Pool'
      pageDescription='Discover and connect with top professionals and teams'
      pageIcon='solar:users-group-rounded-linear'
      contentPadding="md"
      maxWidth="default"
      breadcrumbs={getBreadcrumbs()}
      headerActions={
        <div className='flex items-center gap-3'>
          {actionItems.map((action) => (
            <Button
              key={action.key}
              color={action.color}
              variant={action.variant}
              size='md'
              startContent={
                action.icon ? <Icon icon={action.icon} className='h-4 w-4' /> : undefined
              }
              onPress={() => action.onClick?.()}
              className='transition-all duration-200 hover:shadow-lg shadow-md'
            >
              {action.label}
            </Button>
          ))}
        </div>
      }
    >
      <div className='component-spacing-large'>
        {/* Enhanced Tabs Navigation with Integrated Search */}
        <div className='space-y-6'>
          <TalentPoolTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={tabCounts}
            onCreateTeam={handleCreateTeam}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearch={handleSearch}
            showFilters={showFilters}
            onToggleFilters={toggleFilters}
            filtersCount={activeFiltersCount}
          />

          {/* Search and Filters - Active filters always visible, controls only show when panel is open */}
          <TalentFiltersPanel
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filters}
            onFiltersChange={setFilters}
            activeTab={activeTab}
            onSearch={handleSearch}
            showFiltersPanel={showFilters}
            onToggleFiltersPanel={toggleFilters}
          >
            {/* Tab Content - Cards as children to follow filter animations */}
            <AnimatePresence mode='wait'>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderActiveTabContent()}
              </motion.div>
            </AnimatePresence>
          </TalentFiltersPanel>
        </div>
      </div>

      {/* Invite User Modal */}
      <InviteTalentModal
        isOpen={isInviteModalOpen}
        onClose={handleInviteModalClose}
        onInvite={handleInviteSubmit}
      />
    </DashboardLayout>
  );
};

export default TalentPoolPage;
