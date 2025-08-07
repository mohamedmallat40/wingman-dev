'use client';

import React, { useCallback, useEffect, useState, useMemo } from 'react';

import { Button, Chip, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
// Toast notifications - implement with your preferred toast library

import DashboardLayout from '@/components/layouts/dashboard-layout';

import AgencyList from './components/AgencyList';
import FreelancerList from './components/FreelancerList';
import HeroTabs from './components/HeroTabs';
import SearchAndFilters from './components/SearchAndFilters';
import TeamList from './components/TeamList';
import { type TalentPoolFilters, type TalentType } from './types';
// import { useURLState, generateFilterDescription, validateURLComplexity } from './utils/url-state-manager';

const TalentPoolPage: React.FC = () => {
  // ============================================================================
  // SIMPLIFIED STATE MANAGEMENT (URL features temporarily disabled)
  // ============================================================================
  
  const [activeTab, setActiveTab] = useState<TalentType>('freelancers');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<TalentPoolFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  // Dynamic counts from API
  const [tabCounts, setTabCounts] = useState({
    freelancers: 0,
    agencies: 0,
    teams: 0
  });

  // ============================================================================
  // STANDARD EVENT HANDLERS
  // ============================================================================

  const handleTabChange = useCallback((tab: TalentType) => {
    setActiveTab(tab);
  }, []);

  const handleSearch = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      search: searchQuery.trim() || undefined,
      name: searchQuery.trim() || undefined
    }));
  }, [searchQuery]);

  const handleFiltersChange = useCallback((newFilters: TalentPoolFilters) => {
    setFilters(newFilters);
  }, []);

  const handleViewProfile = (userId: string) => {
    console.log('Navigate to profile:', userId);
    // In real app: router.push(`/profile/${userId}`);
  };

  const handleConnect = (userId: string) => {
    console.log('Connect with user:', userId);
    // In real app: call connection API
  };

  const handleViewTeam = (teamId: string) => {
    console.log('Navigate to team:', teamId);
    // In real app: router.push(`/team/${teamId}`);
  };

  const handleJoinTeam = (teamId: string) => {
    console.log('Join team:', teamId);
    // In real app: call join team API
  };

  const handleCreateTeam = () => {
    console.log('Create new team');
    // In real app: open create team modal or navigate to create team page
  };

  const handleFreelancerCountChange = useCallback((count: number) => {
    setTabCounts((prev) => ({ ...prev, freelancers: count }));
  }, []);

  const handleAgencyCountChange = useCallback((count: number) => {
    setTabCounts((prev) => ({ ...prev, agencies: count }));
  }, []);

  const handleTeamCountChange = useCallback((count: number) => {
    setTabCounts((prev) => ({ ...prev, teams: count }));
  }, []);

  const handleToggleFilters = useCallback(() => {
    setShowFilters(!showFilters);
  }, [showFilters]);

  const getActiveFiltersCount = useCallback(() => {
    return Object.keys(filters).filter(key => {
      const value = filters[key as keyof TalentPoolFilters];
      return value !== undefined && value !== null && 
             (Array.isArray(value) ? value.length > 0 : true);
    }).length;
  }, [filters]);


  const renderActiveTabContent = () => {
    const commonProps = {
      filters,
      onViewProfile: handleViewProfile,
      onConnect: handleConnect
    };

    switch (activeTab) {
      case 'freelancers':
        return <FreelancerList {...commonProps} onCountChange={handleFreelancerCountChange} />;
      case 'agencies':
        return <AgencyList {...commonProps} onCountChange={handleAgencyCountChange} />;
      case 'teams':
        return (
          <TeamList
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
    const baseBreadcrumbs = [
      { label: 'Home', href: '/private/dashboard', icon: 'solar:home-linear' },
      { label: 'Talent Pool', href: '/private/talent-pool', icon: 'solar:users-group-rounded-linear' }
    ];
    
    const tabLabels = {
      freelancers: 'Freelancers',
      agencies: 'Agencies', 
      teams: 'Teams'
    };
    
    const tabIcons = {
      freelancers: 'solar:user-linear',
      agencies: 'solar:buildings-linear',
      teams: 'solar:users-group-rounded-linear'
    };
    
    return [
      ...baseBreadcrumbs,
      { 
        label: tabLabels[activeTab], 
        icon: tabIcons[activeTab]
      }
    ];
  };

  // Simplified action items
  const actionItems = [
    {
      key: 'invite',
      label: 'Invite',
      icon: 'solar:user-plus-linear',
      color: 'primary' as const,
      variant: 'solid' as const,
      priority: 'primary' as const,
      tooltip: 'Invite new talent',
      onClick: () => console.log('Invite talent')
    },
    {
      key: 'create-team',
      label: 'Create Team',
      icon: 'solar:users-group-rounded-linear',
      color: 'secondary' as const,
      variant: 'flat' as const,
      priority: 'secondary' as const,
      tooltip: 'Create new team',
      onClick: handleCreateTeam
    }
  ];

  return (
    <DashboardLayout
      pageTitle='Talent Pool'
      pageDescription='Discover and connect with top professionals and teams'
      pageIcon='solar:users-group-rounded-linear'
      breadcrumbs={getBreadcrumbs()}
      headerActions={
        <div className='flex items-center gap-2'>
          {actionItems.map((action) => (
            <Button
              key={action.key}
              color={action.color}
              variant={action.variant}
              size='sm'
              startContent={
                action.icon ? <Icon icon={action.icon} className='h-4 w-4' /> : undefined
              }
              onClick={() => action.onClick?.()}
              className='transition-all duration-200 hover:shadow-md'
            >
              {action.label}
            </Button>
          ))}
        </div>
      }
    >
      <div className='mx-auto w-[70%] space-y-8 py-6'>
        {/* Enhanced Tabs Navigation with Integrated Search */}
        <div className='space-y-6'>
          <HeroTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            counts={tabCounts}
            onCreateTeam={handleCreateTeam}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearch={handleSearch}
            showFilters={showFilters}
            onToggleFilters={handleToggleFilters}
            filtersCount={getActiveFiltersCount()}
          />

          {/* Search and Filters - Active filters always visible, controls only show when panel is open */}
          <SearchAndFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            activeTab={activeTab}
            onSearch={handleSearch}
            showFiltersPanel={showFilters}
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
          </SearchAndFilters>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TalentPoolPage;
