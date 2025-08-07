'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { Spinner } from '@heroui/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import wingManApi from '@/lib/axios';

import { getCountryNameFromCode } from '../data/countries';
import { type TalentPoolFilters, type User, type UserResponse } from '../types';
import EmptyState from './shared/EmptyState';
import ErrorState from './shared/ErrorState';
import LoadingSkeleton from './shared/LoadingSkeleton';
import TalentCard from './TalentCard';

interface AgencyListProps {
  filters?: TalentPoolFilters;
  onViewProfile?: (userId: string) => void;
  onConnect?: (userId: string) => void;
  onCountChange?: (count: number) => void;
}

const AgencyList: React.FC<AgencyListProps> = ({
  filters,
  onViewProfile,
  onConnect,
  onCountChange
}) => {
  const t = useTranslations();
  const [agencies, setAgencies] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [previousCount, setPreviousCount] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const itemsPerPage = 12; // 3x4 grid layout for enhanced cards

  const fetchAgencies = async (page: number = 1, append: boolean = false) => {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setAgencies([]);
        setCurrentPage(1);
        setHasNextPage(true);
      }
      setError(null);

      const params: Record<string, string> = {
        categories: 'All',
        kind: 'AGENCY',
        page: page.toString(),
        limit: itemsPerPage.toString()
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
      if (filters?.availability) {
        params.availability = filters.availability;
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

      const response = await wingManApi.get('/network/all-users', { params });
      const data = response.data as UserResponse;

      if (append) {
        setPreviousCount(agencies.length);
        setAgencies((prev) => [...prev, ...data.items]);
        setIsInitialLoad(false);
      } else {
        setPreviousCount(0);
        setAgencies(data.items);
        // Only notify parent of count change on initial load
        onCountChange?.(data.meta.totalItems);
      }

      setTotalItems(data.meta.totalItems);
      setCurrentPage(data.meta.currentPage);
      setHasNextPage(data.meta.currentPage < data.meta.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch agencies');
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
    fetchAgencies(1);
  }, [filters]);

  // Infinite scroll implementation
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasNextPage) {
      const nextPage = currentPage + 1;
      fetchAgencies(nextPage, true);
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

    const sentinel = document.getElementById('agency-sentinel');
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
    fetchAgencies(1);
  };

  const handleResetFilters = () => {
    // This would typically be handled by parent component
    fetchAgencies(1);
  };

  const handleViewProfile = (userId: string) => {
    onViewProfile?.(userId);
  };

  const handleConnect = async (userId: string) => {
    try {
      onConnect?.(userId);

      // Update local state to reflect connection
      setAgencies((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, isConnected: true } : user))
      );
    } catch (err) {
      // Handle connection error silently
    }
  };

  if (error) {
    return (
      <ErrorState
        titleKey='talentPool.errorStates.agencies.title'
        descriptionKey='talentPool.errorStates.agencies.description'
        onRetry={handleRetry}
      />
    );
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (agencies.length === 0) {
    return (
      <EmptyState
        icon='solar:buildings-linear'
        titleKey='talentPool.emptyStates.agencies.title'
        descriptionKey='talentPool.emptyStates.agencies.description'
        onReset={handleResetFilters}
      />
    );
  }

  return (
    <div className='space-y-6'>
      {/* Agencies Grid */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {agencies.map((agency, index) => (
          <motion.div
            key={agency.id}
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
            <TalentCard user={agency} onViewProfile={handleViewProfile} onConnect={handleConnect} />
          </motion.div>
        ))}
      </div>

      {/* Infinite Scroll Sentinel */}
      {hasNextPage && (
        <div id='agency-sentinel' className='mt-8 flex h-20 items-center justify-center'>
          {isLoadingMore ? (
            <div className='text-foreground-500 flex items-center gap-2'>
              <Spinner size='sm' color='primary' />
              <span className='text-small'>{t('talentPool.loading.more.agencies')}</span>
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

export default AgencyList;
