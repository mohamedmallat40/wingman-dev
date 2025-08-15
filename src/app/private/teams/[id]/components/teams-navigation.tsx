import React from 'react';

import { Tab, Tabs } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

import { type Group, type TeamDetailsTab } from '../types';
import { TAB_CONFIG, TAB_ORDER } from './constants';

interface TeamDetailsTabsProperties {
  activeTab: TeamDetailsTab;
  onTabChange: (tab: TeamDetailsTab) => void;
  team: Group;
}

export const TeamDetailsTabs: React.FC<TeamDetailsTabsProperties> = ({
  activeTab,
  onTabChange,
  team
}) => {
  const getTabCount = (tabKey: TeamDetailsTab): number => {
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (tabKey) {
      case 'members': {
        return team.members;
      }
      /* case 'tools':
        return team.tools.length;
      case 'projects':
        return 0; */ // Will be implemented with actual projects data
      default: {
        return 0;
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.1 }}
      className='rounded-2xl border border-gray-200/80 bg-white/70 shadow-lg backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-500/10'
    >
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => {
          onTabChange(key as TeamDetailsTab);
        }}
        variant='underlined'
        classNames={{
          tabList: 'gap-6 w-full relative rounded-none p-6 border-divider',
          cursor: 'w-full bg-primary',
          tab: 'max-w-fit px-0 h-12',
          tabContent: 'group-data-[selected=true]:text-primary'
        }}
      >
        {TAB_ORDER.map((tabKey) => {
          const config = TAB_CONFIG[tabKey];
          const count = getTabCount(tabKey);

          return (
            <Tab
              key={tabKey}
              title={
                <div className='flex items-center space-x-2'>
                  <Icon icon={config.icon} className='h-5 w-5' />
                  <span className='font-medium'>{config.label}</span>
                  {count > 0 && (
                    <span className='ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600'>
                      {count}
                    </span>
                  )}
                </div>
              }
            />
          );
        })}
      </Tabs>
    </motion.div>
  );
};
