'use client';

import type { Topic } from '../../types';

import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

// Simple utility function
const getTopicBackgroundImage = (topicId: string) => {
  return `https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop&crop=center`;
};

type RailCardProps = {
  topic: Topic;
  isSelected: boolean;
  onToggle: (id: string) => void;
  width: number;
  height: number;
  gap: number;
};

export function RailCard({ topic, isSelected, onToggle, width, height, gap }: RailCardProps) {
  return (
    <motion.div
      className='flex-none'
      style={{ width, height, marginRight: gap }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        onClick={() => onToggle(topic.id)}
        className={cn(
          'relative h-full w-full cursor-pointer overflow-hidden rounded-lg border-2 shadow-md transition-all duration-300',
          isSelected
            ? 'border-primary ring-primary/30 scale-105 transform shadow-lg ring-2'
            : 'hover:border-foreground/30 border-transparent hover:shadow-lg'
        )}
      >
        <div
          className='h-full w-full bg-cover bg-center transition-transform duration-300 hover:scale-105'
          style={{ backgroundImage: `url(${getTopicBackgroundImage(topic.id)})` }}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />
        <div className='absolute right-0 bottom-0 left-0 p-3'>
          <h3 className='mb-1 text-sm font-semibold text-white'>{topic.name}</h3>
          {topic.featured && (
            <div className='absolute top-2 right-2'>
              <div className='bg-secondary h-2 w-2 rounded-full shadow-sm ring-1 ring-white/50' />
            </div>
          )}
        </div>
        {isSelected && (
          <div className='bg-primary absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-full shadow-lg ring-2 ring-white'>
            <svg className='h-3 w-3 text-white' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  );
}
