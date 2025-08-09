'use client';

import React, { useState } from 'react';

import { Button, Tab, Tabs, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { type TalentType } from '../../types';

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

  // Tab configuration with translations
  const tabConfig = {
    freelancers: {
      label: t('talentPool.tabs.freelancers'),
      description: t('talentPool.tabs.descriptions.freelancers'),
      icon: 'solar:user-linear',
      mobileIcon: 'solar:user-linear'
    },
    agencies: {
      label: t('talentPool.tabs.agencies'),
      description: t('talentPool.tabs.descriptions.agencies'),
      icon: 'solar:buildings-2-linear',
      mobileIcon: 'solar:buildings-2-linear'
    },
    teams: {
      label: t('talentPool.tabs.teams'),
      description: t('talentPool.tabs.descriptions.teams'),
      icon: 'solar:users-group-rounded-linear',
      mobileIcon: 'solar:users-group-rounded-linear'
    }
  };

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
          <div className='relative flex h-[80px] flex-1 items-center px-2 py-2'>
            {/* Content Container */}
            <AnimatePresence mode='wait'>
              {!isSearchExpanded && (
                <motion.div
                  key='tabs'
                  initial={{ opacity: 1, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{
                    opacity: 0,
                    x: -50,
                    transition: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }
                  }}
                  className='flex w-full items-center justify-between px-2'
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
                                    <span className='text-default-500 text-xs'>
                                      {config.description}
                                    </span>
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
                  <div className='ml-6 flex items-center gap-3'>
                    {/* Search Button */}
                    <Tooltip content='Open advanced search' placement='bottom' delay={500}>
                      <Button
                        variant='bordered'
                        size='md'
                        color='primary'
                        onPress={handleSearchToggle}
                        className='group hover:shadow-medium bg-primary-50 hover:bg-primary-100 border-primary/20'
                        startContent={<Icon icon='solar:magnifer-linear' className='h-4 w-4' />}
                        as={motion.button}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {t('talentPool.search.button')}
                      </Button>
                    </Tooltip>
                  </div>
                </motion.div>
              )}

              {isSearchExpanded && (
                <motion.div
                  key='search'
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
                  className='flex w-full items-center justify-between px-2'
                >
                  {/* Expanded Search Input */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className='flex-1 px-2'
                  >
                    <div
                      className='group relative flex w-full flex-col justify-end data-[has-label=true]:mt-[calc(var(--heroui-font-size-small)_+_12px)] data-[hidden=true]:hidden'
                      data-slot='base'
                      data-filled='true'
                      data-filled-within='true'
                    >
                      <div data-slot='main-wrapper' className='flex h-full flex-col'>
                        <div
                          data-slot='input-wrapper'
                          className='tap-highlight-transparent bg-default-100 data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 rounded-large transition-background group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-background relative inline-flex h-12 min-h-12 w-full flex-row items-center gap-3 px-3 shadow-xs outline-hidden !duration-150 group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-offset-2 motion-reduce:transition-none'
                          style={{ cursor: 'text' }}
                        >
                          <div
                            data-slot='inner-wrapper'
                            className='box-border inline-flex h-full w-full items-center'
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              xmlnsXlink='http://www.w3.org/1999/xlink'
                              aria-hidden='true'
                              role='img'
                              className='iconify iconify--lucide text-default-400'
                              width='1em'
                              height='1em'
                              viewBox='0 0 24 24'
                            >
                              <g
                                fill='none'
                                stroke='currentColor'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                              >
                                <path d='m21 21l-4.34-4.34'></path>
                                <circle cx='11' cy='11' r='8'></circle>
                              </g>
                            </svg>
                            <input
                              data-search-input
                              data-slot='input'
                              data-has-start-content='true'
                              className='placeholder:text-foreground-500 text-medium group-data-[has-value=true]:text-default-foreground w-full bg-transparent bg-clip-text font-normal !outline-hidden file:cursor-pointer file:border-0 file:bg-transparent autofill:bg-transparent focus-visible:outline-hidden data-[has-end-content=true]:pe-1.5 data-[has-start-content=true]:ps-1.5 data-[type=color]:rounded-none'
                              aria-label='Search by name, skills, or expertise...'
                              placeholder='Search by name, skills, or expertise...'
                              tabIndex={0}
                              type='text'
                              value={searchQuery}
                              onChange={(e) => onSearchChange?.(e.target.value)}
                              onKeyPress={handleSearchKeyPress}
                              title=''
                            />
                          </div>
                        </div>
                      </div>
                    </div>
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
                        className='hover:shadow-medium font-medium transition-all'
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
                        <div className='text-center'>
                          <div>Close search</div>
                          <div className='text-tiny opacity-70'>ESC</div>
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
                        <Icon icon='solar:close-circle-bold' className='text-danger h-5 w-5' />
                      </Button>
                    </Tooltip>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filter Button - Always visible on the right */}
          <div className='flex h-[80px] items-center pr-2'>
            <Tooltip content='Toggle advanced filters' placement='bottom' delay={500}>
              <Button
                variant='solid'
                size='md'
                color='primary'
                onPress={() => {
                  console.log('Desktop filter button clicked, current showFilters:', showFilters);
                  onToggleFilters?.();
                }}
                className='hover:shadow-medium'
                startContent={<Icon icon='solar:filter-linear' className='h-4 w-4' />}
                as={motion.button}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('talentPool.filters.button')}
                {filtersCount > 0 && (
                  <div className='relative inline-flex shrink-0'>
                    •
                    <span className='font-regular text-tiny transition-transform-opacity !ease-soft-spring border-background bg-danger text-danger-foreground absolute top-[5%] right-[5%] z-10 box-border flex h-3 min-h-3 w-3 min-w-3 origin-center translate-x-1/2 -translate-y-1/2 scale-100 flex-wrap place-content-center items-center rounded-full border-2 px-1 whitespace-nowrap subpixel-antialiased opacity-100 !duration-300 select-none data-[invisible=true]:scale-0 data-[invisible=true]:opacity-0'></span>
                  </div>
                )}
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Mobile Segmented Control */}
      <div className='block sm:hidden'>
        <div className='space-y-3'>
          {/* Mobile Search Bar */}
          <div className='bg-background/80 border-divider/50 shadow-small rounded-2xl border p-3 backdrop-blur-md'>
            <div className='flex flex-col gap-4 md:flex-row'>
              <div className='flex-1'>
                <div
                  className='group relative flex w-full flex-col justify-end data-[has-label=true]:mt-[calc(var(--heroui-font-size-small)_+_12px)] data-[hidden=true]:hidden'
                  data-slot='base'
                  data-filled='true'
                  data-filled-within='true'
                >
                  <div data-slot='main-wrapper' className='flex h-full flex-col'>
                    <div
                      data-slot='input-wrapper'
                      className='tap-highlight-transparent bg-default-100 data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 rounded-large transition-background group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-background relative inline-flex h-12 min-h-12 w-full flex-row items-center gap-3 px-3 shadow-xs outline-hidden !duration-150 group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-offset-2 motion-reduce:transition-none'
                      style={{ cursor: 'text' }}
                    >
                      <div
                        data-slot='inner-wrapper'
                        className='box-border inline-flex h-full w-full items-center'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          xmlnsXlink='http://www.w3.org/1999/xlink'
                          aria-hidden='true'
                          role='img'
                          className='iconify iconify--lucide text-default-400'
                          width='1em'
                          height='1em'
                          viewBox='0 0 24 24'
                        >
                          <g
                            fill='none'
                            stroke='currentColor'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                          >
                            <path d='m21 21l-4.34-4.34'></path>
                            <circle cx='11' cy='11' r='8'></circle>
                          </g>
                        </svg>
                        <input
                          data-slot='input'
                          data-has-start-content='true'
                          className='placeholder:text-foreground-500 text-medium group-data-[has-value=true]:text-default-foreground w-full bg-transparent bg-clip-text font-normal !outline-hidden file:cursor-pointer file:border-0 file:bg-transparent autofill:bg-transparent focus-visible:outline-hidden data-[has-end-content=true]:pe-1.5 data-[has-start-content=true]:ps-1.5 data-[type=color]:rounded-none'
                          aria-label='Search by name, skills, or expertise...'
                          placeholder='Search by name, skills, or expertise...'
                          tabIndex={0}
                          type='text'
                          value={searchQuery}
                          onChange={(e) => onSearchChange?.(e.target.value)}
                          onKeyPress={handleSearchKeyPress}
                          title=''
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                variant='solid'
                size='md'
                color='primary'
                onPress={() => {
                  console.log('Mobile filter button clicked, current showFilters:', showFilters);
                  onToggleFilters?.();
                }}
                className='hover:shadow-medium'
                startContent={<Icon icon='solar:filter-linear' className='h-4 w-4' />}
              >
                {t('talentPool.filters.button')}
                {filtersCount > 0 && (
                  <div className='relative inline-flex shrink-0'>
                    •
                    <span className='font-regular text-tiny transition-transform-opacity !ease-soft-spring border-background bg-danger text-danger-foreground absolute top-[5%] right-[5%] z-10 box-border flex h-3 min-h-3 w-3 min-w-3 origin-center translate-x-1/2 -translate-y-1/2 scale-100 flex-wrap place-content-center items-center rounded-full border-2 px-1 whitespace-nowrap subpixel-antialiased opacity-100 !duration-300 select-none data-[invisible=true]:scale-0 data-[invisible=true]:opacity-0'></span>
                  </div>
                )}
              </Button>
            </div>
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
                onPress={onCreateTeam}
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
