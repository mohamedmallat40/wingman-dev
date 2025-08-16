'use client';

import React from 'react';

import { Button, Tab, Tabs, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface DocumentTabsProperties {
  activeTab: string;
  onTabChange: (tab: string) => void;
  documentsCount?: number;
  isLoading?: boolean;
  onToggleFilters?: () => void;
  showFilters?: boolean;
  viewMode?: 'list' | 'grid';
  onViewModeChange?: (mode: 'list' | 'grid') => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSearch?: (query: string) => void;
}

const DocumentTabs: React.FC<DocumentTabsProperties> = ({
  activeTab,
  onTabChange,
  documentsCount = 0,
  isLoading = false,
  onToggleFilters,
  showFilters = false,
  viewMode = 'list',
  onViewModeChange,
  searchQuery,
  onSearchChange,
  onSearch
}) => {
  const t = useTranslations();

  // Tab configuration with translations
  const tabConfig = {
    'all-documents': {
      label: t('documents.tabs.allDocuments'),
      description: t('documents.tabs.descriptions.allDocuments'),
      icon: 'solar:document-text-linear',
      mobileIcon: 'solar:document-text-linear'
    },
    'shared-with-me': {
      label: t('documents.tabs.sharedWithMe'),
      description: t('documents.tabs.descriptions.sharedWithMe'),
      icon: 'solar:share-linear',
      mobileIcon: 'solar:share-linear'
    }
  };

  return (
    <div className='relative w-full overflow-hidden'>
      {/* Desktop Tabs */}
      <div className='hidden sm:block'>
        <div className='flex items-center gap-0'>
          <div className='relative flex h-[80px] flex-1 items-center px-2 py-2'>
            <div className='flex w-full items-center justify-between px-2'>
              <div className='flex-1'>
                <Tabs
                  selectedKey={activeTab}
                  onSelectionChange={(key) => {
                    onTabChange(key as string);
                  }}
                  variant='underlined'
                  color='primary'
                  size='lg'
                  classNames={{
                    tabList:
                      'gap-6 w-full relative rounded-none p-0 border-b border-divider dark:border-default-700',
                    cursor: 'w-full bg-primary-500',
                    tab: 'max-w-fit px-0 h-12',
                    tabContent:
                      'group-data-[selected=true]:text-primary-500 dark:group-data-[selected=true]:text-primary-400'
                  }}
                >
                  {Object.entries(tabConfig).map(([key, config]) => {
                    const isActive = activeTab === key;

                    return (
                      <Tab
                        key={key}
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
                                <span className='text-default-500 dark:text-default-400 text-xs'>
                                  {config.description}
                                </span>
                                {isActive && !isLoading && (
                                  <span className='bg-default-100 dark:bg-default-800 text-default-700 dark:text-default-300 rounded-full px-2 py-0.5 text-xs font-medium'>
                                    {documentsCount}
                                  </span>
                                )}
                                {isLoading && (
                                  <div className='bg-default-200 dark:bg-default-700 h-4 w-8 animate-pulse rounded' />
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
            </div>
          </div>

          {/* Action Buttons - Always visible on the right */}
          <div className='flex h-[80px] items-center gap-3 pr-2'>
            {/* Filter Button */}
            <Tooltip content={t('documents.filters.toggle')} placement='bottom' delay={500}>
              <Button
                variant='solid'
                size='md'
                color='primary'
                onPress={onToggleFilters}
                className='hover:shadow-medium'
                startContent={<Icon icon='solar:filter-linear' className='h-4 w-4' />}
                as={motion.button}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('documents.filters.button')}
                {showFilters && (
                  <div className='relative inline-flex shrink-0'>
                    <span className='text-primary dark:bg-content1 dark:text-primary border-primary absolute top-[5%] right-[5%] z-10 box-border flex h-3 min-h-3 w-3 min-w-3 origin-center translate-x-1/2 -translate-y-1/2 scale-100 flex-wrap place-content-center items-center rounded-full border-2 bg-white px-1 whitespace-nowrap subpixel-antialiased opacity-100 !duration-300 select-none'></span>
                  </div>
                )}
              </Button>
            </Tooltip>

            {/* View Toggle Buttons */}
            <div className='border-default-200 dark:border-default-700 bg-content1 dark:bg-content2 flex items-center gap-1 rounded-lg border p-1 shadow-sm'>
              <Tooltip content={t('documents.views.list')} placement='bottom'>
                <Button
                  isIconOnly
                  size='sm'
                  variant={viewMode === 'list' ? 'solid' : 'ghost'}
                  color={viewMode === 'list' ? 'primary' : 'default'}
                  onPress={() => onViewModeChange?.('list')}
                  className={`h-8 w-8 transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'text-white shadow-md'
                      : 'hover:bg-default-100 dark:hover:bg-default-800 text-default-600 dark:text-default-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Icon icon='solar:list-bold' className='h-4 w-4' />
                </Button>
              </Tooltip>
              <Tooltip content={t('documents.views.grid')} placement='bottom'>
                <Button
                  isIconOnly
                  size='sm'
                  variant={viewMode === 'grid' ? 'solid' : 'ghost'}
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                  onPress={() => onViewModeChange?.('grid')}
                  className={`h-8 w-8 transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'text-white shadow-md'
                      : 'hover:bg-default-100 dark:hover:bg-default-800 text-default-600 dark:text-default-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Icon icon='solar:widget-4-bold' className='h-4 w-4' />
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Segmented Control */}
      <div className='block sm:hidden'>
        <div className='space-y-3'>
          {/* Mobile Action Bar */}
          <div className='bg-background/80 border-divider/50 dark:border-default-700/50 shadow-small rounded-2xl border p-3 backdrop-blur-md'>
            <div className='flex items-center justify-between'>
              {/* Mobile Filter Button */}
              <Button
                variant='solid'
                size='md'
                color='primary'
                onPress={onToggleFilters}
                className='hover:shadow-medium'
                startContent={<Icon icon='solar:filter-linear' className='h-4 w-4' />}
              >
                {t('documents.filters.button')}
                {showFilters && (
                  <div className='relative inline-flex shrink-0'>
                    <span className='text-primary dark:bg-content1 dark:text-primary border-primary absolute top-[5%] right-[5%] z-10 box-border flex h-3 min-h-3 w-3 min-w-3 origin-center translate-x-1/2 -translate-y-1/2 scale-100 flex-wrap place-content-center items-center rounded-full border-2 bg-white px-1 whitespace-nowrap subpixel-antialiased opacity-100 !duration-300 select-none'></span>
                  </div>
                )}
              </Button>

              {/* Mobile View Toggle */}
              <div className='border-default-200 dark:border-default-700 bg-content1 dark:bg-content2 flex items-center gap-1 rounded-lg border p-1 shadow-sm'>
                <Button
                  isIconOnly
                  size='sm'
                  variant={viewMode === 'list' ? 'solid' : 'ghost'}
                  color={viewMode === 'list' ? 'primary' : 'default'}
                  onPress={() => onViewModeChange?.('list')}
                  className={`h-8 w-8 transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'text-white shadow-md'
                      : 'hover:bg-default-100 dark:hover:bg-default-800 text-default-600 dark:text-default-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Icon icon='solar:list-bold' className='h-4 w-4' />
                </Button>
                <Button
                  isIconOnly
                  size='sm'
                  variant={viewMode === 'grid' ? 'solid' : 'ghost'}
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                  onPress={() => onViewModeChange?.('grid')}
                  className={`h-8 w-8 transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'text-white shadow-md'
                      : 'hover:bg-default-100 dark:hover:bg-default-800 text-default-600 dark:text-default-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Icon icon='solar:widget-4-bold' className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Tabs */}
          <div className='bg-default-100 dark:bg-default-800 flex rounded-xl p-1'>
            {Object.entries(tabConfig).map(([key, config]) => {
              const isActive = activeTab === key;

              return (
                <motion.button
                  key={key}
                  onClick={() => {
                    onTabChange(key);
                  }}
                  className={`relative flex flex-1 flex-col items-center gap-1 rounded-lg px-3 py-3 transition-all duration-200 ${
                    isActive
                      ? 'bg-background dark:bg-content1 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-default-600 dark:text-default-400 hover:text-default-900 dark:hover:text-default-100'
                  } `}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon icon={config.mobileIcon} className='h-5 w-5' />
                  <div className='flex flex-col items-center'>
                    <span className='text-xs font-medium'>{config.label}</span>
                    {isActive && !isLoading && (
                      <span className='text-default-500 dark:text-default-400 mt-0.5 text-xs'>
                        {documentsCount}
                      </span>
                    )}
                    {isLoading && (
                      <div className='bg-default-200 dark:bg-default-700 mt-0.5 h-2 w-6 animate-pulse rounded' />
                    )}
                  </div>

                  {isActive && (
                    <motion.div
                      layoutId='activeDocumentTab'
                      className='bg-primary-50 dark:bg-primary-900/20 absolute inset-0 -z-10 rounded-lg'
                      initial={false}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentTabs;
