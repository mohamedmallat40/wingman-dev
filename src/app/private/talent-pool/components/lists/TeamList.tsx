'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Spinner, Tab, Tabs } from '@heroui/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import wingManApi from '@/lib/axios';

import { type Group, type TalentPoolFilters, type TeamResponse } from '../../types';
import { searchUtilities } from '../../utils/search-utilities';
import { TalentGroupCard } from '../cards';
import { TalentEmptyState, TalentErrorState, TalentLoadingSkeleton } from '../states';

interface TeamListProperties {
  filters?: TalentPoolFilters;
  searchQuery?: string;
  onViewTeam?: (teamId: string) => void;
  onJoinTeam?: (teamId: string) => void;
  onCountChange?: (count: number) => void;
}

type TabKey = 'all' | 'public' | 'private' | 'shared';

interface TabConfig {
  key: TabKey;
  labelKey: string;
  endpoint: string;
}

const TAB_CONFIGS: TabConfig[] = [
  { key: 'all', labelKey: 'talentPool.tabs.allGroups', endpoint: '/groups/allgroups' },
  { key: 'public', labelKey: 'talentPool.tabs.publicGroups', endpoint: '/groups/allgroups/public' },
  { key: 'private', labelKey: 'talentPool.tabs.privateGroups', endpoint: '/groups' },
  { key: 'shared', labelKey: 'talentPool.tabs.sharedWithMe', endpoint: '/groups/shared' }
];

const TeamList: React.FC<TeamListProperties> = ({
  filters,
  onViewTeam,
  searchQuery,
  onJoinTeam,
  onCountChange
}) => {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [teams, setTeams] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [previousCount, setPreviousCount] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const itemsPerPage = 12; // 3x4 grid layout for better visual impact

  const getCurrentEndpoint = useCallback(() => {
    const config = TAB_CONFIGS.find((tab) => tab.key === activeTab);
    return config?.endpoint ?? '/groups/allgroups';
  }, [activeTab]);

  const isPaginationEnabled = useMemo(() => {
    return activeTab === 'all' || activeTab === 'public';
  }, [activeTab]);

  const fetchTeams = async (page = 1, append = false) => {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setTeams([]);
        setCurrentPage(1);
        setHasNextPage(isPaginationEnabled);
      }
      setError(null);

      const parameters: Record<string, string> = {};

      // Only add pagination params for "All Groups" tab
      if (isPaginationEnabled) {
        parameters.limit = itemsPerPage.toString();
        parameters.page = page.toString();
      }

      const endpoint = getCurrentEndpoint();
      const response = await wingManApi.get(endpoint, { params: parameters });
      const data = response.data as TeamResponse;

      if (append && isPaginationEnabled) {
        setPreviousCount(teams.length);
        setTeams((previous) => [...previous, ...data.items]);
        setIsInitialLoad(false);
      } else {
        setPreviousCount(0);
        setTeams(data.items ?? data);
        //onCountChange?.(data.meta?.totalItems ?? 0);
      }

      setTotalItems(data.meta?.totalItems ?? 0);
      setCurrentPage(data.meta?.currentPage ?? 1);

      // Only enable pagination for "All Groups" tab
      if (isPaginationEnabled) {
        setHasNextPage(data.meta?.currentPage < data.meta?.totalPages);
      } else {
        setHasNextPage(false);
      }
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : 'Failed to fetch teams');
    } finally {
      if (!append) {
        setIsLoading(false);
      }
      setIsLoadingMore(false);
    }
  };

  // Fetch data on mount, when filters change, or when active tab changes
  useEffect(() => {
    setCurrentPage(1);
    setHasNextPage(isPaginationEnabled);
    setPreviousCount(0);
    setIsInitialLoad(true);
    fetchTeams(1);
  }, [filters, activeTab, isPaginationEnabled]);

  // Infinite scroll implementation - only for "All Groups" tab
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasNextPage && isPaginationEnabled) {
      const nextPage = currentPage + 1;
      fetchTeams(nextPage, true);
    }
  }, [currentPage, hasNextPage, isLoadingMore, isPaginationEnabled]);

  // Intersection Observer for infinite scroll - only for "All Groups" tab
  useEffect(() => {
    if (!isPaginationEnabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting && hasNextPage && !isLoadingMore && !isLoading) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    const sentinel = document.querySelector('#team-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [loadMore, hasNextPage, isLoadingMore, isLoading, isPaginationEnabled]);

  const searchFilteredTeams = useMemo(() => {
    return searchUtilities.searchTeams(teams, searchQuery ?? '') as Group[];
  }, [teams, searchQuery]);

  const filteredTeams = useMemo(() => {
    const result = searchFilteredTeams;

    return result;
  }, [searchFilteredTeams]);

  const handleTabChange = (key: string | number) => {
    setActiveTab(key as TabKey);
  };

  const handleRetry = async () => {
    await fetchTeams(1);
  };

  const handleResetFilters = async () => {
    // This would typically be handled by parent component
    await fetchTeams(1);
  };

  const handleViewTeam = (teamId: string) => {
    onViewTeam?.(teamId);
  };

  const handleJoinTeam = async (teamId: string) => {
    try {
      onJoinTeam?.(teamId);

      // You could update local state here if needed
      // For example, increment member count or show joined state
    } catch {
      // Handle join error silently
    }
  };

  if (error) {
    return (
      <div className='space-y-6'>
        {/* Tabs */}
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={handleTabChange}
          variant='underlined'
          classNames={{
            tabList: 'gap-6 w-full relative rounded-none p-0 border-b border-divider',
            cursor: 'w-full bg-primary',
            tab: 'max-w-fit px-0 h-12',
            tabContent: 'group-data-[selected=true]:text-primary'
          }}
        >
          {TAB_CONFIGS.map((tab) => (
            <Tab key={tab.key} title={t(tab.labelKey)} />
          ))}
        </Tabs>

        <TalentErrorState
          titleKey='talentPool.errorStates.teams.title'
          descriptionKey='talentPool.errorStates.teams.description'
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Tabs */}
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={handleTabChange}
        variant='underlined'
        classNames={{
          tabList: 'gap-6 w-full relative rounded-none p-0 border-b border-divider',
          cursor: 'w-full bg-primary',
          tab: 'max-w-fit px-0 h-12',
          tabContent: 'group-data-[selected=true]:text-primary'
        }}
      >
        {TAB_CONFIGS.map((tab) => (
          <Tab key={tab.key} title={t(tab.labelKey)} />
        ))}
      </Tabs>

      {/* Content */}
      {isLoading ? (
        <TalentLoadingSkeleton />
      ) : filteredTeams?.length === 0 ? (
        <TalentEmptyState
          icon='solar:users-group-rounded-linear'
          titleKey='talentPool.emptyStates.teams.title'
          descriptionKey='talentPool.emptyStates.teams.description'
          onReset={handleResetFilters}
        />
      ) : (
        <>
          {/* Teams Grid */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {filteredTeams?.map((team, index) => (
              <motion.div
                key={`team-${team.id}-${index}`}
                initial={isInitialLoad || index >= previousCount ? { opacity: 0, y: 10 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.2,
                  delay: isInitialLoad
                    ? index * 0.02
                    : index >= previousCount
                      ? (index - previousCount) * 0.02
                      : 0
                }}
              >
                <TalentGroupCard
                  group={team}
                  onViewTeam={handleViewTeam}
                  onJoinTeam={handleJoinTeam}
                  activeTab={activeTab}
                />
              </motion.div>
            ))}
          </div>

          {/* Infinite Scroll Sentinel - only for "All Groups" tab */}
          {hasNextPage && isPaginationEnabled && (
            <div id='team-sentinel' className='mt-8 flex h-20 items-center justify-center'>
              {isLoadingMore ? (
                <div className='text-foreground-500 flex items-center gap-2'>
                  <Spinner size='sm' color='primary' />
                  <span className='text-small'>{t('talentPool.loading.more.teams')}</span>
                </div>
              ) : (
                <div className='text-foreground-400 text-center'>
                  <span className='text-small'>{t('talentPool.loading.scrollToLoad')}</span>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TeamList;
