'use client';

import React from 'react';

import {
  Chip,
  Divider
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface TrendingTopic {
  id: string;
  name: string;
  postCount: number;
  growth: number;
  category: string;
}

interface TrendingTopicsProps {
  topics: TrendingTopic[];
  className?: string;
}

export const TrendingTopics: React.FC<TrendingTopicsProps> = ({
  topics,
  className = ''
}) => {
  const t = useTranslations('broadcasts');

  if (topics.length === 0) return null;

  return (
    <div className={className}>
      <div className='mb-4'>
        <h3 className='text-foreground mb-3 flex items-center gap-2 text-sm font-semibold'>
          <Icon icon='solar:fire-linear' className='text-warning h-4 w-4' />
          {t('sidebar.trending.title')}
        </h3>
        <div className='space-y-2'>
          {topics.slice(0, 3).map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className='bg-warning/5 border-warning/20 hover:bg-warning/10 cursor-pointer rounded-lg border p-3 transition-colors'
            >
              <div className='mb-1 flex items-center justify-between'>
                <span className='text-foreground text-sm font-medium'>{topic.name}</span>
                <Chip size='sm' color='warning' variant='flat' className='text-xs'>
                  +{topic.growth}%
                </Chip>
              </div>
              <div className='text-foreground-500 text-xs'>
                {topic.postCount} posts • {topic.category}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Divider className='mb-4' />
    </div>
  );
};