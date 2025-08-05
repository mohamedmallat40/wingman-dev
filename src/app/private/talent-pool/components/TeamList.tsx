'use client';

import React, { useEffect, useState, useCallback } from 'react';

import { Button, Skeleton, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';

import wingManApi from '@/lib/axios';

import { type Group, type TeamResponse, type TalentPoolFilters } from '../types';
import GroupCard from './GroupCard';

interface TeamListProps {
  filters?: TalentPoolFilters;
  onViewTeam?: (teamId: string) => void;
  onJoinTeam?: (teamId: string) => void;
  onCountChange?: (count: number) => void;
}

const LoadingSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 12 }).map((_, index) => (
      <div key={index} className="space-y-3">
        <Skeleton className="w-full h-96 rounded-lg" />
      </div>
    ))}
  </div>
);

const EmptyState: React.FC<{ onReset: () => void }> = ({ onReset }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-16"
  >
    <div className="mb-6">
      <Icon 
        icon="solar:users-group-rounded-linear" 
        className="h-24 w-24 text-default-300 mx-auto mb-4" 
      />
      <h3 className="text-xl font-semibold text-default-700 mb-2">
        No teams found
      </h3>
      <p className="text-default-500 max-w-md mx-auto">
        We couldn't find any teams matching your criteria. Try adjusting your filters or search query.
      </p>
    </div>
    <Button
      color="primary"
      variant="flat"
      startContent={<Icon icon="solar:refresh-linear" className="h-4 w-4" />}
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
    className="text-center py-16"
  >
    <div className="mb-6">
      <Icon 
        icon="solar:danger-circle-linear" 
        className="h-24 w-24 text-danger-300 mx-auto mb-4" 
      />
      <h3 className="text-xl font-semibold text-default-700 mb-2">
        Something went wrong
      </h3>
      <p className="text-default-500 max-w-md mx-auto">
        We couldn't load the teams. Please try again.
      </p>
    </div>
    <Button
      color="danger"
      variant="flat"
      startContent={<Icon icon="solar:refresh-linear" className="h-4 w-4" />}
      onPress={onRetry}
    >
      Try Again
    </Button>
  </motion.div>
);

const TeamList: React.FC<TeamListProps> = ({
  filters,
  onViewTeam,
  onJoinTeam,
  onCountChange
}) => {
  const [teams, setTeams] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

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
        setTeams(prev => [...prev, ...data.items]);
      } else {
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
        console.log('Team sentinel intersecting:', entry.isIntersecting, 'hasNextPage:', hasNextPage, 'isLoadingMore:', isLoadingMore);
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
    <div className="space-y-6">

      {/* Teams Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`teams-${currentPage}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {teams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
            >
              <GroupCard
                group={team}
                onViewTeam={handleViewTeam}
                onJoinTeam={handleJoinTeam}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Infinite Scroll Sentinel */}
      {hasNextPage && (
        <div id="team-sentinel" className="h-20 flex items-center justify-center mt-8">
          {isLoadingMore ? (
            <div className="flex items-center gap-2 text-foreground-500">
              <Spinner size="sm" color="primary" />
              <span className="text-small">Loading more teams...</span>
            </div>
          ) : (
            <div className="text-center text-foreground-400">
              <span className="text-small">Scroll to load more...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamList;