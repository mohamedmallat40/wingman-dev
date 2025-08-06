'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';

import DashboardLayout from '@/components/layouts/dashboard-layout';

import AgencyList from './components/AgencyList';
import FreelancerList from './components/FreelancerList';
import HeroTabs from './components/HeroTabs';
import SearchAndFilters from './components/SearchAndFilters';
import TeamList from './components/TeamList';
import { type TalentPoolFilters, type TalentType } from './types';

const TalentPoolPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TalentType>('freelancers');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<TalentPoolFilters>({});

  // Dynamic counts from API
  const [tabCounts, setTabCounts] = useState({
    freelancers: 0,
    agencies: 0,
    teams: 0
  });

  const handleTabChange = useCallback((tab: TalentType) => {
    setActiveTab(tab);
  }, []);

  const handleSearch = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      search: searchQuery.trim() || undefined
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

  const actionItems = [
    {
      key: 'saved',
      label: 'Saved',
      icon: 'solar:bookmark-linear',
      color: 'default' as const,
      variant: 'flat' as const,
      priority: 'secondary' as const,
      tooltip: 'View saved profiles',
      onClick: () => console.log('View saved profiles')
    },
    {
      key: 'invite',
      label: 'Invite',
      icon: 'solar:user-plus-linear',
      color: 'primary' as const,
      variant: 'solid' as const,
      priority: 'primary' as const,
      tooltip: 'Invite new talent',
      onClick: () => console.log('Invite talent')
    }
  ];

  return (
    <DashboardLayout
      pageTitle='Talent Pool'
      pageDescription='Discover and connect with top professionals and teams'
      pageIcon='solar:users-group-rounded-linear'
      breadcrumbs={[
        { label: 'Home', href: '/private/dashboard', icon: 'solar:home-linear' },
        { label: 'Talent Pool' }
      ]}
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
        {/* Search and Filters Section */}
        <SearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          activeTab={activeTab}
          onSearch={handleSearch}
        />

        {/* Tabs Navigation */}
        <div className='space-y-6'>
          <HeroTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            counts={tabCounts}
            onCreateTeam={handleCreateTeam}
          />

          {/* Tab Content */}
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
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TalentPoolPage;
