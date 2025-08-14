'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { Spinner } from '@heroui/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import wingManApi from '@/lib/axios';

import { getCountryNameFromCode } from '../../data/countries';
import { type Group, type TalentPoolFilters, type TeamResponse } from '../../types';
import { TalentGroupCard } from '../cards';
import { TalentEmptyState, TalentErrorState, TalentLoadingSkeleton } from '../states';

interface TeamListProps {
  filters?: TalentPoolFilters;
  onViewTeam?: (teamId: string) => void;
  onJoinTeam?: (teamId: string) => void;
  onCountChange?: (count: number) => void;
}

const TeamList: React.FC<TeamListProps> = ({ filters, onViewTeam, onJoinTeam, onCountChange }) => {
  const t = useTranslations();
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

  const fetchTeams = async (page: number = 1, append: boolean = false) => {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setTeams([]);
        setCurrentPage(1);
        setHasNextPage(true);
      }
      setError(null);

      const params: Record<string, string> = {
        limit: itemsPerPage.toString(),
        page: page.toString()
      };

      // Add filters to params
      if (filters?.search) {
        params.search = filters.search;
      }
      if (filters?.name) {
        params.name = filters.name;
      }
      if (filters?.region) {
        params.region = filters.region;
      }
      if (filters?.skills?.length) {
        params.skills = filters.skills.join(',');
      }
      if (filters?.statusAviability) {
        params.statusAviability = filters.statusAviability;
      }
      if (filters?.profession) {
        params.profession = filters.profession;
      }
      if (filters?.experienceLevel?.length) {
        params.experienceLevel = filters.experienceLevel.join(',');
      }
      if (filters?.country?.length) {
        // Convert country codes to lowercase names and add as separate parameters
        filters.country.forEach((countryCode, index) => {
          const countryName = getCountryNameFromCode(countryCode);
          if (index === 0) {
            params.country = countryName;
          } else {
            params[`country${index + 1}`] = countryName;
          }
        });
      }
      if (filters?.workType) {
        params.workType = filters.workType;
      }
      if (filters?.minRate) {
        params.minRate = filters.minRate.toString();
      }
      if (filters?.maxRate) {
        params.maxRate = filters.maxRate.toString();
      }
      if (filters?.minRating) {
        params.minRating = filters.minRating.toString();
      }

      const response = await wingManApi.get('/groups/allgroups', { params });
      const data = response.data as TeamResponse;

      if (append) {
        setPreviousCount(teams.length);
        setTeams((prev) => [...prev, ...data.items]);
        setIsInitialLoad(false);
      } else {
        setPreviousCount(0);
        setTeams(data.items);
        // Only notify parent of count change on initial load
        onCountChange?.(data.meta.totalItems);
      }

      setTotalItems(data.meta.totalItems);
      setCurrentPage(data.meta.currentPage);
      setHasNextPage(data.meta.currentPage < data.meta.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch teams');
    } finally {
      if (!append) {
        setIsLoading(false);
      }
      setIsLoadingMore(false);
    }
  };

  // Fetch data on mount and when filters change
  useEffect(() => {
    setCurrentPage(1);
    setHasNextPage(true);
    setPreviousCount(0);
    setIsInitialLoad(true);
    fetchTeams(1);
  }, [filters]);

  // Infinite scroll implementation
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasNextPage) {
      const nextPage = currentPage + 1;
      fetchTeams(nextPage, true);
    }
  }, [currentPage, hasNextPage, isLoadingMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
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

    const sentinel = document.getElementById('team-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [loadMore, hasNextPage, isLoadingMore, isLoading]);

  const handleRetry = () => {
    fetchTeams(1);
  };

  const handleResetFilters = () => {
    // This would typically be handled by parent component
    fetchTeams(1);
  };

  const handleViewTeam = (teamId: string) => {
    onViewTeam?.(teamId);
  };

  const handleJoinTeam = async (teamId: string) => {
    try {
      onJoinTeam?.(teamId);

      // You could update local state here if needed
      // For example, increment member count or show joined state
    } catch (err) {
      // Handle join error silently
    }
  };

  if (error) {
    return (
      <TalentErrorState
        titleKey='talentPool.errorStates.teams.title'
        descriptionKey='talentPool.errorStates.teams.description'
        onRetry={handleRetry}
      />
    );
  }

  if (isLoading) {
    return <TalentLoadingSkeleton />;
  }

  if (teams.length === 0) {
    return (
      <TalentEmptyState
        icon='solar:users-group-rounded-linear'
        titleKey='talentPool.emptyStates.teams.title'
        descriptionKey='talentPool.emptyStates.teams.description'
        onReset={handleResetFilters}
      />
    );
  }

  return (
    <div className='space-y-6'>
      {/* Teams Grid */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {teams.map((team, index) => (
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
            <TalentGroupCard group={team} onViewTeam={handleViewTeam} onJoinTeam={handleJoinTeam} />
          </motion.div>
        ))}
      </div>

      {/* Infinite Scroll Sentinel */}
      {hasNextPage && (
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
    </div>
  );
};

export default TeamList;
