'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { Button, Skeleton, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

import wingManApi from '@/lib/axios';

import { type Group, type TalentPoolFilters, type TeamResponse } from '../types';
import GroupCard from './GroupCard';

interface TeamListProps {
  filters?: TalentPoolFilters;
  onViewTeam?: (teamId: string) => void;
  onJoinTeam?: (teamId: string) => void;
  onCountChange?: (count: number) => void;
}

const LoadingSkeleton: React.FC = () => (
  <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
    {Array.from({ length: 12 }).map((_, index) => (
      <div key={index} className='space-y-3'>
        <Skeleton className='h-96 w-full rounded-lg' />
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
      <Icon
        icon='solar:users-group-rounded-linear'
        className='text-default-300 mx-auto mb-4 h-24 w-24'
      />
      <h3 className='text-default-700 mb-2 text-xl font-semibold'>No teams found</h3>
      <p className='text-default-500 mx-auto max-w-md'>
        We couldn't find any teams matching your criteria. Try adjusting your filters or search
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
        We couldn't load the teams. Please try again.
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

const TeamList: React.FC<TeamListProps> = ({ filters, onViewTeam, onJoinTeam, onCountChange }) => {
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
      console.error('Error fetching teams:', err);
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
        console.log(
          'Team sentinel intersecting:',
          entry.isIntersecting,
          'hasNextPage:',
          hasNextPage,
          'isLoadingMore:',
          isLoadingMore
        );
        if (entry.isIntersecting && hasNextPage && !isLoadingMore && !isLoading) {
          console.log('Loading more teams...');
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
    console.log('View team:', teamId);
    onViewTeam?.(teamId);
  };

  const handleJoinTeam = async (teamId: string) => {
    try {
      // Simulate API call
      console.log('Joining team:', teamId);
      onJoinTeam?.(teamId);

      // You could update local state here if needed
      // For example, increment member count or show joined state
    } catch (err) {
      console.error('Error joining team:', err);
    }
  };

  if (error) {
    return <ErrorState onRetry={handleRetry} />;
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (teams.length === 0) {
    return <EmptyState onReset={handleResetFilters} />;
  }

  return (
    <div className='space-y-6'>
      {/* Teams Grid */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {teams.map((team, index) => (
          <motion.div
            key={team.id}
            initial={isInitialLoad || index >= previousCount ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.2, 
              delay: isInitialLoad ? index * 0.02 : (index >= previousCount ? (index - previousCount) * 0.02 : 0) 
            }}
          >
            <GroupCard group={team} onViewTeam={handleViewTeam} onJoinTeam={handleJoinTeam} />
          </motion.div>
        ))}
      </div>

      {/* Infinite Scroll Sentinel */}
      {hasNextPage && (
        <div id='team-sentinel' className='mt-8 flex h-20 items-center justify-center'>
          {isLoadingMore ? (
            <div className='text-foreground-500 flex items-center gap-2'>
              <Spinner size='sm' color='primary' />
              <span className='text-small'>Loading more teams...</span>
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

export default TeamList;
