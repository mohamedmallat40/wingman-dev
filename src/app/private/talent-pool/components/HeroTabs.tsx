'use client';

import React, { useState } from 'react';

import { Button, Input, Tab, Tabs, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { type TalentType } from '../types';

interface HeroTabsProps {
  activeTab: TalentType;
  onTabChange: (tab: TalentType) => void;
  counts?: {
    freelancers: number;
    agencies: number;
    teams: number;
  };
  isLoading?: boolean;
  onCreateTeam?: () => void;
  // Search props
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSearch?: () => void;
  // Filter props
  showFilters?: boolean;
  onToggleFilters?: () => void;
  filtersCount?: number;
}

const tabConfig = {
  freelancers: {
    label: 'Freelancers',
    icon: 'solar:user-linear',
    mobileIcon: 'solar:user-linear',
    description: 'Individual professionals'
  },
  agencies: {
    label: 'Agencies',
    icon: 'solar:buildings-linear',
    mobileIcon: 'solar:buildings-linear',
    description: 'Professional agencies'
  },
  teams: {
    label: 'Teams',
    icon: 'solar:users-group-rounded-linear',
    mobileIcon: 'solar:users-group-rounded-linear',
    description: 'Collaborative groups'
  }
} as const;

const HeroTabs: React.FC<HeroTabsProps> = ({
  activeTab,
  onTabChange,
  counts,
  isLoading = false,
  onCreateTeam,
  searchQuery = '',
  onSearchChange,
  onSearch,
  showFilters = false,
  onToggleFilters,
  filtersCount = 0
}) => {
  const t = useTranslations();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch?.();
      setIsSearchExpanded(false); // Close after search
    }
    if (e.key === 'Escape') {
      setIsSearchExpanded(false);
    }
  };

  // Global ESC key listener
  React.useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchExpanded) {
        setIsSearchExpanded(false);
      }
    };

    if (isSearchExpanded) {
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [isSearchExpanded]);

  const handleSearchToggle = () => {
    const newState = !isSearchExpanded;
    setIsSearchExpanded(newState);
    
    if (newState) {
      // Focus the input when expanding - wait for animation
      setTimeout(() => {
        const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 400); // Match animation duration
    }
  };

  const handleSearchClose = () => {
    setIsSearchExpanded(false);
    onSearchChange?.('');
  };

  return (
    <div className='relative w-full overflow-hidden'>
      {/* Desktop Tabs */}
      <div className='hidden sm:block'>
        <div className='flex items-center gap-0'>
          <div className='relative h-[80px] px-2 py-2 flex-1 flex items-center'>
            {/* Content Container */}
            <AnimatePresence mode="wait">
            {!isSearchExpanded && (
              <motion.div
                key="tabs"
                initial={{ opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ 
                  opacity: 0,
                  x: -50,
                  transition: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }
                }}
                className='flex items-center justify-between px-2 w-full'
              >
                <div className='flex-1'>
                  <Tabs
                    selectedKey={activeTab}
                    onSelectionChange={(key) => onTabChange(key as TalentType)}
                    variant='underlined'
                    color='primary'
                    size='lg'
                    classNames={{
                      tabList: 'gap-6 w-full relative rounded-none p-0 border-b border-divider',
                      cursor: 'w-full bg-primary-500',
                      tab: 'max-w-fit px-0 h-12',
                      tabContent: 'group-data-[selected=true]:text-primary-500'
                    }}
                  >
                    {Object.entries(tabConfig).map(([key, config]) => {
                      const tabKey = key as TalentType;
                      const count = counts?.[tabKey];

                      return (
                        <Tab
                          key={tabKey}
                          title={
                            <motion.div
                              className='flex items-center gap-3'
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Icon icon={config.icon} className='h-5 w-5' />
                              <div className='flex flex-col items-start'>
                                <span className='font-medium'>{config.label}</span>
                                <div className='flex items-center gap-2'>
                                  <span className='text-default-500 text-xs'>{config.description}</span>
                                  {count !== undefined && !isLoading && (
                                    <span className='bg-default-100 text-default-700 rounded-full px-2 py-0.5 text-xs font-medium'>
                                      {count}
                                    </span>
                                  )}
                                  {isLoading && (
                                    <div className='bg-default-200 h-4 w-8 animate-pulse rounded' />
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          }
                        />
                      );
                    })}
                  </Tabs>
                </div>

                {/* Right Side Actions */}
                <div className='ml-2 flex items-center gap-0'>
                  {/* Search Icon Button */}
                  <Tooltip content='Open search' placement='bottom'>
                    <Button
                      isIconOnly
                      variant='light'
                      size='lg'
                      onPress={handleSearchToggle}
                      className='hover:bg-primary/10 hover:shadow-medium transition-all duration-200'
                      as={motion.button}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Icon icon='solar:magnifer-linear' className='h-5 w-5 text-primary' />
                    </Button>
                  </Tooltip>

                </div>
              </motion.div>
            )}

            {isSearchExpanded && (
              <motion.div
                key="search"
                initial={{ 
                  opacity: 0,
                  x: 100
                }}
                animate={{ 
                  opacity: 1,
                  x: 0,
                  transition: { 
                    duration: 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }
                }}
                exit={{ 
                  opacity: 0,
                  x: 100,
                  transition: { 
                    duration: 0.2,
                    ease: [0.4, 0.0, 0.2, 1]
                  }
                }}
                className='w-full flex items-center justify-between px-2'
              >
                {/* Expanded Search Input */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  className='flex-1 px-2'
                >
                  <Input
                    data-search-input
                    placeholder={t('talentPool.search.placeholder')}
                    value={searchQuery}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    autoFocus={false}
                    startContent={
                      <motion.div
                        animate={{ 
                          scale: [1, 1.05, 1],
                        }}
                        transition={{ 
                          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                      >
                        <Icon icon="solar:magnifer-linear" className="text-primary h-5 w-5" />
                      </motion.div>
                    }
                    endContent={
                      searchQuery && (
                        <Button
                          isIconOnly
                          size='sm'
                          variant='light'
                          onPress={() => onSearchChange?.('')}
                          className='h-6 w-6 min-w-6 transition-all hover:scale-110'
                        >
                          <Icon icon='solar:close-circle-linear' className='h-4 w-4' />
                        </Button>
                      )
                    }
                    size='lg'
                    variant='bordered'
                    className='w-full'
                    classNames={{
                      input: 'text-base',
                      inputWrapper: 'border-primary/20 hover:border-primary/40 focus-within:border-primary bg-background/80 backdrop-blur-sm shadow-medium'
                    }}
                  />
                </motion.div>

                {/* Inline Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: 0.15 }}
                  className='ml-6 flex items-center gap-3 p-2'
                >

                  {/* Execute Search Button */}
                  <Tooltip content='Search now (Enter)' placement='bottom'>
                    <Button
                      isIconOnly
                      color='primary'
                      variant='solid'
                      size='lg'
                      onPress={() => {
                        onSearch?.();
                        setIsSearchExpanded(false);
                      }}
                      className='font-medium transition-all hover:shadow-medium'
                      as={motion.button}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon icon='solar:magnifer-linear' className='h-5 w-5' />
                    </Button>
                  </Tooltip>

                  {/* Clear Close Button */}
                  <Tooltip 
                    content={
                      <div className="text-center">
                        <div>Close search</div>
                        <div className="text-tiny opacity-70">ESC</div>
                      </div>
                    } 
                    placement='bottom'
                  >
                    <Button
                      isIconOnly
                      color='danger'
                      variant='bordered'
                      size='lg'
                      onPress={handleSearchClose}
                      className='bg-danger/5 border-danger/30 hover:bg-danger/15 hover:border-danger/60 hover:shadow-medium transition-all duration-200'
                      as={motion.button}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon icon='solar:close-circle-bold' className='h-5 w-5 text-danger' />
                    </Button>
                  </Tooltip>

                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>

          {/* Filter Button - Always visible on the right */}
          <div className='flex items-center h-[80px] pr-2'>
            <Tooltip content='Toggle filters' placement='bottom'>
              <Button
                isIconOnly
                variant='light'
                size='lg'
                onPress={onToggleFilters}
                className={`transition-all duration-200 ${
                  showFilters 
                    ? 'bg-primary/20 text-primary hover:bg-primary/30' 
                    : 'hover:bg-primary/10 text-primary/70 hover:text-primary'
                }`}
                as={motion.button}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className='relative'>
                  <Icon icon='solar:filter-linear' className='h-5 w-5' />
                  {filtersCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className='absolute -top-1 -right-1 bg-danger text-white rounded-full h-4 w-4 flex items-center justify-center text-xs font-bold'
                    >
                      {filtersCount}
                    </motion.div>
                  )}
                </div>
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Mobile Segmented Control */}
      <div className='block sm:hidden'>
        <div className='space-y-3'>
          {/* Mobile Search Bar */}
          <div className='bg-background/80 border-divider/50 backdrop-blur-md rounded-2xl border p-3 shadow-small'>
            <Input
              placeholder={t('talentPool.search.placeholder')}
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              startContent={
                <Icon icon="solar:magnifer-linear" className="text-primary h-4 w-4" />
              }
              endContent={
                searchQuery && (
                  <Button
                    isIconOnly
                    size='sm'
                    variant='light'
                    onPress={() => onSearchChange?.('')}
                    className='h-6 w-6 min-w-6'
                  >
                    <Icon icon='solar:close-circle-linear' className='h-4 w-4' />
                  </Button>
                )
              }
              size='md'
              variant='flat'
              classNames={{
                inputWrapper: 'bg-background/60'
              }}
            />
            {searchQuery && (
              <div className='mt-2 flex justify-end'>
                <Button
                  color='primary'
                  size='sm'
                  startContent={<Icon icon='solar:magnifer-linear' className='h-4 w-4' />}
                  onPress={onSearch}
                  className='font-medium'
                >
                  Search
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Tabs */}
          <div className='bg-default-100 flex rounded-xl p-1'>
            {Object.entries(tabConfig).map(([key, config]) => {
              const tabKey = key as TalentType;
              const isActive = activeTab === tabKey;
              const count = counts?.[tabKey];

              return (
                <motion.button
                  key={tabKey}
                  onClick={() => onTabChange(tabKey)}
                  className={`relative flex flex-1 flex-col items-center gap-1 rounded-lg px-3 py-3 transition-all duration-200 ${
                    isActive
                      ? 'bg-background text-primary-600 shadow-sm'
                      : 'text-default-600 hover:text-default-900'
                  } `}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon icon={config.mobileIcon} className='h-5 w-5' />
                  <div className='flex flex-col items-center'>
                    <span className='text-xs font-medium'>{config.label}</span>
                    {count !== undefined && !isLoading && (
                      <span className='text-default-500 mt-0.5 text-xs'>{count}</span>
                    )}
                    {isLoading && (
                      <div className='bg-default-200 mt-0.5 h-2 w-6 animate-pulse rounded' />
                    )}
                  </div>

                  {isActive && (
                    <motion.div
                      layoutId='activeTab'
                      className='bg-primary-50 absolute inset-0 -z-10 rounded-lg'
                      initial={false}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Mobile Create Team Button */}
          {activeTab === 'teams' && onCreateTeam && (
            <div className='w-full'>
              <Button
                color='primary'
                variant='flat'
                size='md'
                fullWidth
                startContent={<Icon icon='solar:user-plus-linear' className='h-4 w-4' />}
                onClick={onCreateTeam}
                className='font-medium'
              >
                Create Team
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroTabs;
