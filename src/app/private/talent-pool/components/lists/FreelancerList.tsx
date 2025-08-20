'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Skeleton, Spinner } from '@heroui/react';
import { motion } from 'framer-motion';
import { getName } from 'i18n-iso-countries';
import { useLocale, useTranslations } from 'next-intl';

import wingManApi from '@/lib/axios';

import { type TalentPoolFilters, type User, type UserResponse } from '../../types';
import { searchUtilities } from '../../utils/search-utilities';
import { TalentCard } from '../cards';
import { TalentGroupModal, TalentNoteModal, TalentTagsModal } from '../modals';
import { TalentEmptyState, TalentErrorState, TalentLoadingSkeleton } from '../states';

interface FreelancerListProperties {
  filters?: TalentPoolFilters;
  searchQuery?: string;
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

const FreelancerList: React.FC<FreelancerListProperties> = ({
  filters,
  searchQuery,
  onViewProfile,
  onConnect,
  onCountChange
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const [freelancers, setFreelancers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [previousCount, setPreviousCount] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Modal states
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [tagsModalOpen, setTagsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const itemsPerPage = 12; // 3x4 grid layout for enhanced cards

  const fetchFreelancers = async (page = 1, append = false) => {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setFreelancers([]);
        setCurrentPage(1);
        setHasNextPage(true);
      }
      setError(null);

      const parameters = new URLSearchParams();
      parameters.append('categories', 'All');
      parameters.append('kind', 'FREELANCER');
      parameters.append('page', page.toString());
      parameters.append('limit', itemsPerPage.toString());

      // Add filters to params
      if (filters?.search) {
        parameters.append('search', filters.search);
      }
      if (filters?.name) {
        parameters.append('name', filters.name);
      }
      if (filters?.skills?.length) {
        for (const skill of filters.skills) {
          parameters.append('skills', skill);
        }
      }
      if (filters?.statusAviability) {
        parameters.append('statusAviability', filters.statusAviability);
      }
      if (filters?.profession) {
        parameters.append('profession', filters.profession);
      }
      if (filters?.experienceLevel?.length) {
        for (const level of filters.experienceLevel) {
          parameters.append('experienceLevel', level);
        }
      }
      if (filters?.country?.length) {
        for (const country of filters.country) {
          const countryName = getName(country, locale);
          if (countryName) {
            parameters.append('country', countryName);
          }
        }
      }
      if (filters?.workType) {
        parameters.append('workType', filters.workType);
      }
      if (filters?.minRate) {
        parameters.append('minRate', filters.minRate.toString());
      }
      if (filters?.maxRate) {
        parameters.append('maxRate', filters.maxRate.toString());
      }
      if (filters?.minRating) {
        parameters.append('minRating', filters.minRating.toString());
      }

      const response = await wingManApi.get('/network/all-users', { params: parameters });
      const data = response.data as UserResponse;

      if (append) {
        setPreviousCount(freelancers.length);
        setFreelancers((previous) => [...previous, ...data.items]);
        setIsInitialLoad(false);
      } else {
        setPreviousCount(0);
        setFreelancers(data.items);
        // Only notify parent of count change on initial load
        onCountChange?.(data.meta.totalItems);
      }

      setTotalItems(data.meta.totalItems);
      setCurrentPage(data.meta.currentPage);
      setHasNextPage(data.meta.currentPage < data.meta.totalPages);
    } catch (error_) {
      console.error('Error fetching freelancers:', error_);
      setError(error_ instanceof Error ? error_.message : 'Failed to fetch freelancers');
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
    fetchFreelancers(1);
  }, [filters]);

  // Infinite scroll implementation
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasNextPage) {
      const nextPage = currentPage + 1;
      fetchFreelancers(nextPage, true);
    }
  }, [currentPage, hasNextPage, isLoadingMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting && hasNextPage && !isLoadingMore && !isLoading) {
          console.log('Loading more freelancers...');
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    const sentinel = document.querySelector('#freelancer-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [loadMore, hasNextPage, isLoadingMore, isLoading]);

  const searchFilteredFreelancers = useMemo(() => {
    return searchUtilities.searchFreelancers(freelancers, searchQuery || '') as User[];
  }, [freelancers, searchQuery]);

  const filteredFreelancers = useMemo(() => {
    const result = searchFilteredFreelancers;
    return result;
  }, [searchFilteredFreelancers]);

  const handleRetry = () => {
    fetchFreelancers(1);
  };

  const handleResetFilters = () => {
    // This would typically be handled by parent component
    fetchFreelancers(1);
  };

  const handleViewProfile = (userId: string) => {
    console.log('View profile:', userId);
    onViewProfile?.(userId);
  };

  const handleConnect = async (userId: string) => {
    try {
      // Simulate API call
      console.log('Connecting to user:', userId);
      onConnect?.(userId);

      // Update local state to reflect connection
      setFreelancers((previous) =>
        previous.map((user) => (user.id === userId ? { ...user, isConnected: true } : user))
      );
    } catch (error_) {
      console.error('Error connecting to user:', error_);
    }
  };

  const handleAddNote = (userId: string) => {
    const user = freelancers.find((f) => f.id === userId);
    if (user) {
      setSelectedUser(user);
      setNoteModalOpen(true);
    }
  };

  const handleAddToGroup = (userId: string) => {
    const user = freelancers.find((f) => f.id === userId);
    if (user) {
      setSelectedUser(user);
      setGroupModalOpen(true);
    }
  };

  const handleAssignTags = (userId: string) => {
    const user = freelancers.find((f) => f.id === userId);
    if (user) {
      setSelectedUser(user);
      setTagsModalOpen(true);
    }
  };

  const handleSaveNote = async (userId: string, note: string) => {
    try {
      console.log('Saving note for user:', userId, 'Note:', note);
      // Here you would make the API call to save the note
      // await saveUserNote(userId, note);
    } catch (error) {
      console.error('Error saving note:', error);
      throw error;
    }
  };

  const handleAddToGroups = async (userId: string, groupIds: string[]) => {
    try {
      console.log('Adding user to groups:', userId, 'Groups:', groupIds);
      // Here you would make the API call to add user to groups
      // await addUserToGroups(userId, groupIds);
    } catch (error) {
      console.error('Error adding to groups:', error);
      throw error;
    }
  };

  const handleAssignUserTags = async (userId: string, tagIds: string[]) => {
    try {
      console.log('Assigning tags to user:', userId, 'Tags:', tagIds);
      // Here you would make the API call to assign tags
      // await assignUserTags(userId, tagIds);
    } catch (error) {
      console.error('Error assigning tags:', error);
      throw error;
    }
  };

  if (error) {
    return (
      <TalentErrorState
        titleKey='talentPool.errorStates.freelancers.title'
        descriptionKey='talentPool.errorStates.freelancers.description'
        onRetry={handleRetry}
      />
    );
  }

  if (isLoading) {
    return <TalentLoadingSkeleton />;
  }

  if (filteredFreelancers.length === 0) {
    return (
      <TalentEmptyState
        icon='solar:user-search-linear'
        titleKey='talentPool.emptyStates.freelancers.title'
        descriptionKey='talentPool.emptyStates.freelancers.description'
        onReset={handleResetFilters}
      />
    );
  }

  return (
    <div className='space-y-6'>
      {/* Freelancers Grid */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {filteredFreelancers.map((freelancer, index) => (
          <motion.div
            key={`freelancer-${freelancer.id}-${index}`}
            initial={isInitialLoad || index >= previousCount ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.2,
              delay: isInitialLoad
                ? index * 0.02
                : (index >= previousCount
                  ? (index - previousCount) * 0.02
                  : 0)
            }}
          >
            <TalentCard
              user={freelancer}
              onViewProfile={handleViewProfile}
              onConnect={handleConnect}
              onAddNote={handleAddNote}
              onAddToGroup={handleAddToGroup}
              onAssignTags={handleAssignTags}
            />
          </motion.div>
        ))}
      </div>

      {/* Infinite Scroll Sentinel */}
      {hasNextPage && (
        <div id='freelancer-sentinel' className='mt-8 flex h-20 items-center justify-center'>
          {isLoadingMore ? (
            <div className='text-foreground-500 flex items-center gap-2'>
              <Spinner size='sm' color='primary' />
              <span className='text-small'>
                {t('talentPool.loadingStates.loadingMoreFreelancers')}
              </span>
            </div>
          ) : (
            <div className='text-foreground-400 text-center'>
              <span className='text-small'>{t('talentPool.loadingStates.scrollToLoadMore')}</span>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <TalentNoteModal
        isOpen={noteModalOpen}
        onClose={() => {
          setNoteModalOpen(false);
        }}
        user={selectedUser}
        onSaveNote={handleSaveNote}
      />

      <TalentGroupModal
        isOpen={groupModalOpen}
        onClose={() => {
          setGroupModalOpen(false);
        }}
        user={selectedUser}
        onAddToGroups={handleAddToGroups}
      />

      <TalentTagsModal
        isOpen={tagsModalOpen}
        onClose={() => {
          setTagsModalOpen(false);
        }}
        user={selectedUser}
        onAssignTags={handleAssignUserTags}
      />
    </div>
  );
};

export default FreelancerList;
