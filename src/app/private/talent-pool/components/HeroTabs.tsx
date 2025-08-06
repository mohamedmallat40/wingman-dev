'use client';

import React from 'react';

import { Button, Tab, Tabs, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

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
  onCreateTeam
}) => {
  return (
    <div className='w-full'>
      {/* Desktop Tabs */}
      <div className='hidden sm:block'>
        <div className='flex items-center justify-between'>
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

          {/* Create Team Button - Only show when teams tab is active */}
          {activeTab === 'teams' && onCreateTeam && (
            <div className='ml-6'>
              <Tooltip content='Create new team' placement='bottom'>
                <Button
                  color='primary'
                  variant='flat'
                  size='md'
                  startContent={<Icon icon='solar:user-plus-linear' className='h-4 w-4' />}
                  onClick={onCreateTeam}
                  className='font-medium transition-transform hover:scale-105'
                >
                  Create Team
                </Button>
              </Tooltip>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Segmented Control */}
      <div className='block sm:hidden'>
        <div className='space-y-3'>
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
