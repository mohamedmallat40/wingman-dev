'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { Button, Skeleton, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

import wingManApi from '@/lib/axios';

import { type TalentPoolFilters, type User, type UserResponse } from '../types';
import TalentCard from './TalentCard';

interface AgencyListProps {
  filters?: TalentPoolFilters;
  onViewProfile?: (userId: string) => void;
  onConnect?: (userId: string) => void;
  onCountChange?: (count: number) => void;
}

const LoadingSkeleton: React.FC = () => (
  <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
    {Array.from({ length: 12 }).map((_, index) => (
      <div
        key={index}
        className='shadow-soft border-default-200 from-background via-background/95 to-background rounded-large h-full w-full space-y-4 border bg-gradient-to-br p-6'
      >
        {/* Header Section */}
        <div className='flex w-full items-start gap-4'>
          <div className='relative'>
            <Skeleton className='h-20 w-20 rounded-full' />
            <div className='absolute -right-1 -bottom-1'>
              <Skeleton className='h-6 w-6 rounded-full' />
            </div>
          </div>
          <div className='flex min-w-0 flex-grow flex-col gap-2'>
            <div className='flex items-start justify-between'>
              <div className='min-w-0 flex-grow space-y-2'>
                <Skeleton className='h-6 w-32 rounded-lg' />
                <Skeleton className='h-4 w-24 rounded-lg' />
              </div>
              <div className='ml-2 flex items-center gap-1'>
                <Skeleton className='h-8 w-8 rounded-lg' />
                <Skeleton className='h-8 w-8 rounded-lg' />
              </div>
            </div>
            <div className='space-y-1'>
              <Skeleton className='h-4 w-28 rounded-lg' />
            </div>
            <div className='mt-2 flex items-center gap-2'>
              <Skeleton className='h-6 w-16 rounded-full' />
              <Skeleton className='h-6 w-20 rounded-full' />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className='bg-background/80 rounded-large border-default-200/50 space-y-2 border p-4 backdrop-blur-sm'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-4 w-4 rounded' />
            <Skeleton className='h-4 w-12 rounded-lg' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-3 w-full rounded-lg' />
            <Skeleton className='h-3 w-4/5 rounded-lg' />
            <Skeleton className='h-3 w-3/4 rounded-lg' />
          </div>
        </div>

        {/* Skills Section */}
        <div className='bg-background/80 rounded-large border-default-200/50 space-y-3 border p-4 backdrop-blur-sm'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-4 w-4 rounded' />
            <Skeleton className='h-4 w-16 rounded-lg' />
          </div>
          <div className='flex flex-wrap gap-2'>
            <Skeleton className='h-6 w-16 rounded-full' />
            <Skeleton className='h-6 w-12 rounded-full' />
            <Skeleton className='h-6 w-20 rounded-full' />
            <Skeleton className='h-6 w-14 rounded-full' />
          </div>
        </div>

        {/* Stats Section */}
        <div className='grid grid-cols-3 gap-3'>
          <div className='bg-background/80 rounded-large border-default-200/50 space-y-2 border p-3 text-center backdrop-blur-sm'>
            <Skeleton className='mx-auto h-8 w-8 rounded-full' />
            <Skeleton className='mx-auto h-3 w-16 rounded-lg' />
            <Skeleton className='mx-auto h-4 w-12 rounded-lg' />
          </div>
          <div className='bg-background/80 rounded-large border-default-200/50 space-y-2 border p-3 text-center backdrop-blur-sm'>
            <Skeleton className='mx-auto h-8 w-8 rounded-full' />
            <Skeleton className='mx-auto h-3 w-8 rounded-lg' />
            <Skeleton className='mx-auto h-4 w-10 rounded-lg' />
          </div>
          <div className='bg-background/80 rounded-large border-default-200/50 space-y-2 border p-3 text-center backdrop-blur-sm'>
            <Skeleton className='mx-auto h-8 w-8 rounded-full' />
            <Skeleton className='mx-auto h-3 w-10 rounded-lg' />
            <Skeleton className='mx-auto h-4 w-14 rounded-lg' />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const EmptyState: React.FC<{ onReset: () => void }> = ({ onReset }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className='py-16 text-center'
  >
    <div className='mb-6'>
      <Icon icon='solar:buildings-linear' className='text-default-300 mx-auto mb-4 h-24 w-24' />
      <h3 className='text-default-700 mb-2 text-xl font-semibold'>No agencies found</h3>
      <p className='text-default-500 mx-auto max-w-md'>
        We couldn't find any agencies matching your criteria. Try adjusting your filters or search
        query.
      </p>
    </div>
    <Button
      color='primary'
      variant='flat'
      startContent={<Icon icon='solar:refresh-linear' className='h-4 w-4' />}
      onPress={onReset}
    >
      Reset Filters
    </Button>
  </motion.div>
);

const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className='py-16 text-center'
  >
    <div className='mb-6'>
      <Icon icon='solar:danger-circle-linear' className='text-danger-300 mx-auto mb-4 h-24 w-24' />
      <h3 className='text-default-700 mb-2 text-xl font-semibold'>Something went wrong</h3>
      <p className='text-default-500 mx-auto max-w-md'>
        We couldn't load the agencies. Please try again.
      </p>
    </div>
    <Button
      color='danger'
      variant='flat'
      startContent={<Icon icon='solar:refresh-linear' className='h-4 w-4' />}
      onPress={onRetry}
    >
      Try Again
    </Button>
  </motion.div>
);

const AgencyList: React.FC<AgencyListProps> = ({
  filters,
  onViewProfile,
  onConnect,
  onCountChange
}) => {
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
      if (filters?.region) {
        params.region = filters.region;
      }
      if (filters?.skills?.length) {
        params.skills = filters.skills.join(',');
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
      console.error('Error fetching agencies:', err);
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
        console.log(
          'Agency sentinel intersecting:',
          entry.isIntersecting,
          'hasNextPage:',
          hasNextPage,
          'isLoadingMore:',
          isLoadingMore
        );
        if (entry.isIntersecting && hasNextPage && !isLoadingMore && !isLoading) {
          console.log('Loading more agencies...');
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
    console.log('View agency profile:', userId);
    onViewProfile?.(userId);
  };

  const handleConnect = async (userId: string) => {
    try {
      // Simulate API call
      console.log('Connecting to agency:', userId);
      onConnect?.(userId);

      // Update local state to reflect connection
      setAgencies((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, isConnected: true } : user))
      );
    } catch (err) {
      console.error('Error connecting to agency:', err);
    }
  };

  if (error) {
    return <ErrorState onRetry={handleRetry} />;
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (agencies.length === 0) {
    return <EmptyState onReset={handleResetFilters} />;
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
              delay: isInitialLoad ? index * 0.02 : (index >= previousCount ? (index - previousCount) * 0.02 : 0) 
            }}
          >
            <TalentCard
              user={agency}
              onViewProfile={handleViewProfile}
              onConnect={handleConnect}
            />
          </motion.div>
        ))}
      </div>

      {/* Infinite Scroll Sentinel */}
      {hasNextPage && (
        <div id='agency-sentinel' className='mt-8 flex h-20 items-center justify-center'>
          {isLoadingMore ? (
            <div className='text-foreground-500 flex items-center gap-2'>
              <Spinner size='sm' color='primary' />
              <span className='text-small'>Loading more agencies...</span>
            </div>
          ) : (
            <div className='text-foreground-400 text-center'>
              <span className='text-small'>Scroll to load more...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgencyList;
