'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Spinner } from '@heroui/react';
import { motion } from 'framer-motion';
import { getName } from 'i18n-iso-countries';
import { useLocale, useTranslations } from 'next-intl';

import wingManApi from '@/lib/axios';

import { type TalentPoolFilters, type User, type UserResponse } from '../../types';
import { searchUtilities } from '../../utils/search-utilities';
import { TalentCard } from '../cards';
import { TalentGroupModal, TalentNoteModal, TalentTagsModal } from '../modals';
import { TalentEmptyState, TalentErrorState, TalentLoadingSkeleton } from '../states';

interface AgencyListProperties {
  filters?: TalentPoolFilters;
  onViewProfile?: (userId: string) => void;
  onConnect?: (userId: string) => void;
  onCountChange?: (count: number) => void;
  searchQuery?: string;
}

const AgencyList: React.FC<AgencyListProperties> = ({
  filters,
  searchQuery,
  onViewProfile,
  onConnect,
  onCountChange
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const [agencies, setAgencies] = useState<User[]>([]);
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

  const fetchAgencies = async (page = 1, append = false) => {
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

      const parameters = new URLSearchParams();
      parameters.append('categories', 'All');
      parameters.append('kind', 'AGENCY');
      parameters.append('page', page.toString());
      parameters.append('limit', itemsPerPage.toString());

      // Add filters to params
      if (filters?.search) {
        parameters.append('search', filters.search);
      }
      if (filters?.name) {
        parameters.append('name', filters.name);
      }
      if (filters?.region) {
        parameters.append('region', filters.region);
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
          parameters.append('country', countryName);
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
        setPreviousCount(agencies.length);
        setAgencies((previous) => [...previous, ...data.items]);
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
    } catch (error_) {
      console.error('Error fetching agencies:', error_);
      setError(error_ instanceof Error ? error_.message : 'Failed to fetch agencies');
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
          console.log('Loading more agencies...');
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    const sentinel = document.querySelector('#agency-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [loadMore, hasNextPage, isLoadingMore, isLoading]);

    const searchFilteredAgencies = useMemo(() => {
      return searchUtilities.searchAgencies(agencies, searchQuery || '') as User[];
    }, [searchQuery]);

    const filteredAgencies = useMemo(() => {
      const result = searchFilteredAgencies;

      return result;
    }, [searchFilteredAgencies, filters]);

  const handleRetry = () => {
    fetchAgencies(1);
  };

  const handleResetFilters = () => {
    // This would typically be handled by parent component
    fetchAgencies(1);
  };

  const handleViewProfile = (userId: string) => {
    console.log('View profile:', userId);
    onViewProfile?.(userId);
  };

  const handleConnect = async (userId: string) => {
    try {
      console.log('Connecting to agency:', userId);
      onConnect?.(userId);

      // Update local state to reflect connection
      setAgencies((previous) =>
        previous.map((user) => (user.id === userId ? { ...user, isConnected: true } : user))
      );
    } catch (error_) {
      console.error('Error connecting to agency:', error_);
    }
  };

  const handleAddNote = (userId: string) => {
    const user = agencies.find((a) => a.id === userId);
    if (user) {
      setSelectedUser(user);
      setNoteModalOpen(true);
    }
  };

  const handleAddToGroup = (userId: string) => {
    const user = agencies.find((a) => a.id === userId);
    if (user) {
      setSelectedUser(user);
      setGroupModalOpen(true);
    }
  };

  const handleAssignTags = (userId: string) => {
    const user = agencies.find((a) => a.id === userId);
    if (user) {
      setSelectedUser(user);
      setTagsModalOpen(true);
    }
  };

  const handleSaveNote = async (userId: string, note: string) => {
    try {
      console.log('Saving note for agency:', userId, 'Note:', note);
      // Here you would make the API call to save the note
      // await saveUserNote(userId, note);
    } catch (error) {
      console.error('Error saving note:', error);
      throw error;
    }
  };

  const handleAddToGroups = async (userId: string, groupIds: string[]) => {
    try {
      console.log('Adding agency to groups:', userId, 'Groups:', groupIds);
      // Here you would make the API call to add user to groups
      // await addUserToGroups(userId, groupIds);
    } catch (error) {
      console.error('Error adding to groups:', error);
      throw error;
    }
  };

  const handleAssignUserTags = async (userId: string, tagIds: string[]) => {
    try {
      console.log('Assigning tags to agency:', userId, 'Tags:', tagIds);
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
        titleKey='talentPool.errorStates.agencies.title'
        descriptionKey='talentPool.errorStates.agencies.description'
        onRetry={handleRetry}
      />
    );
  }

  if (isLoading) {
    return <TalentLoadingSkeleton />;
  }

  if (filteredAgencies.length === 0) {
    return (
      <TalentEmptyState
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
        {filteredAgencies.map((agency, index) => (
          <motion.div
            key={`agency-${agency.id}-${index}`}
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
            <TalentCard
              user={agency}
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

export default AgencyList;
