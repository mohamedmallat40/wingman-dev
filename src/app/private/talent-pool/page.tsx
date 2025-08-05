'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { Button, Card, CardBody, Input } from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';

import AssistantSidebar from '@/components/assistant/assistant-sidebar';
import DashboardLayout from '@/components/layouts/dashboard-layout';

import AgencyList from './components/AgencyList';
import FreelancerList from './components/FreelancerList';
import HeroTabs from './components/HeroTabs';
import TeamList from './components/TeamList';
import { type TalentPoolFilters, type TalentType } from './types';

const TalentPoolPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TalentType>('freelancers');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<TalentPoolFilters>({});
  const [showSuccessManager, setShowSuccessManager] = useState(false);

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

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilters((prev) => ({
      ...prev,
      search: undefined
    }));
  };

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

  // Handle escape key to close Success Manager
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showSuccessManager) {
        setShowSuccessManager(false);
      }
    };

    if (showSuccessManager) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showSuccessManager]);

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
      key: 'success-manager',
      label: 'Success Manager',
      icon: 'solar:chat-round-linear',
      color: 'secondary' as const,
      variant: 'flat' as const,
      priority: 'secondary' as const,
      tooltip: 'Open Success Manager',
      onClick: () => setShowSuccessManager(true)
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
        {/* Search Section */}
        <Card>
          <CardBody className='p-6'>
            <div className='flex flex-col gap-4 sm:flex-row'>
              <div className='flex-1'>
                <Input
                  placeholder='Search by name, skills, or location...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  startContent={
                    <Icon icon='solar:magnifer-linear' className='text-default-400 h-5 w-5' />
                  }
                  endContent={
                    searchQuery && (
                      <Button
                        isIconOnly
                        size='sm'
                        variant='light'
                        onPress={handleClearSearch}
                        className='h-6 w-6 min-w-6'
                      >
                        <Icon icon='solar:close-circle-linear' className='h-4 w-4' />
                      </Button>
                    )
                  }
                  size='lg'
                  className='w-full'
                />
              </div>
              <Button
                color='primary'
                size='lg'
                startContent={<Icon icon='solar:magnifer-linear' className='h-5 w-5' />}
                onPress={handleSearch}
                className='sm:min-w-32'
              >
                Search
              </Button>
            </div>
          </CardBody>
        </Card>

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

      {/* Success Manager Overlay */}
      <AnimatePresence>
        {showSuccessManager && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='bg-background/80 fixed inset-0 z-40 backdrop-blur-sm'
              onClick={() => setShowSuccessManager(false)}
            />

            {/* Success Manager Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{
                type: 'spring',
                damping: 30,
                stiffness: 300,
                opacity: { duration: 0.2 }
              }}
              className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8'
            >
              {/* Enhanced Container - Fixed Height */}
              <div className='bg-background border-default-200 relative flex h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl border shadow-2xl'>
                {/* Close Button */}
                <Button
                  isIconOnly
                  variant='light'
                  size='sm'
                  className='bg-background/80 hover:bg-default-100 border-default-200 absolute top-4 right-4 z-50 border backdrop-blur-sm'
                  onPress={() => setShowSuccessManager(false)}
                >
                  <Icon icon='solar:close-linear' className='h-5 w-5' />
                </Button>

                {/* Main Content Area - Fixed Height */}
                <div className='flex h-full flex-1'>
                  {/* Left Side - Welcome/Info Panel */}
                  <div className='from-primary-50 via-secondary-50 to-primary-100 relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br p-8 lg:flex lg:w-2/5'>
                    {/* Background Pattern */}
                    <div className='absolute inset-0 opacity-10'>
                      <div className='bg-primary absolute top-0 right-0 h-32 w-32 rounded-full blur-3xl filter'></div>
                      <div className='bg-secondary absolute bottom-1/3 left-0 h-24 w-24 rounded-full blur-2xl filter'></div>
                    </div>

                    <div className='relative z-10'>
                      <div className='mb-8'>
                        <div className='bg-primary/20 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl'>
                          <Icon icon='solar:chat-round-bold' className='text-primary h-8 w-8' />
                        </div>
                        <h2 className='text-foreground mb-4 text-3xl font-bold'>Success Manager</h2>
                        <p className='text-foreground-600 text-lg leading-relaxed'>
                          Uw persoonlijke assistent voor het vinden van talent, projectbeheer en
                          ondersteuning.
                        </p>
                      </div>

                      <div className='space-y-4'>
                        <div className='flex items-center gap-3'>
                          <div className='bg-success/20 flex h-10 w-10 items-center justify-center rounded-full'>
                            <Icon
                              icon='solar:users-group-rounded-linear'
                              className='text-success h-5 w-5'
                            />
                          </div>
                          <div>
                            <p className='text-foreground font-semibold'>Talent Discovery</p>
                            <p className='text-foreground-500 text-sm'>
                              Find the perfect developers
                            </p>
                          </div>
                        </div>

                        <div className='flex items-center gap-3'>
                          <div className='bg-warning/20 flex h-10 w-10 items-center justify-center rounded-full'>
                            <Icon
                              icon='solar:chart-square-linear'
                              className='text-warning h-5 w-5'
                            />
                          </div>
                          <div>
                            <p className='text-foreground font-semibold'>Project Updates</p>
                            <p className='text-foreground-500 text-sm'>
                              Real-time progress tracking
                            </p>
                          </div>
                        </div>

                        <div className='flex items-center gap-3'>
                          <div className='bg-secondary/20 flex h-10 w-10 items-center justify-center rounded-full'>
                            <Icon icon='solar:calendar-linear' className='text-secondary h-5 w-5' />
                          </div>
                          <div>
                            <p className='text-foreground font-semibold'>Schedule Meetings</p>
                            <p className='text-foreground-500 text-sm'>Coordinate with your team</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='relative z-10'>
                      <div className='bg-background/80 border-default-200 rounded-xl border p-4 backdrop-blur-sm'>
                        <div className='flex items-center gap-3'>
                          <div className='bg-success h-3 w-3 animate-pulse rounded-full'></div>
                          <span className='text-foreground text-sm font-medium'>
                            Online & Ready to Help
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Chat Interface - Fixed Height */}
                  <div className='bg-background flex h-full min-h-0 flex-1 flex-col lg:w-3/5'>
                    {/* Chat Header */}
                    <div className='border-default-200 flex-shrink-0 border-b p-4 lg:hidden'>
                      <div className='flex items-center gap-3'>
                        <div className='bg-primary/20 flex h-12 w-12 items-center justify-center rounded-xl'>
                          <Icon icon='solar:chat-round-bold' className='text-primary h-6 w-6' />
                        </div>
                        <div>
                          <h3 className='text-foreground text-lg font-bold'>Success Manager</h3>
                          <p className='text-foreground-500 text-sm'>Online & Ready to Help</p>
                        </div>
                      </div>
                    </div>

                    {/* Chat Content - Scrollable */}
                    <div className='min-h-0 flex-1 overflow-hidden'>
                      <AssistantSidebar
                        className='h-full'
                        isCollapsed={false}
                        onToggleCollapse={() => setShowSuccessManager(false)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default TalentPoolPage;
