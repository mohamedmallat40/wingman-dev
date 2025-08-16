'use client';

import React, { useEffect, useState } from 'react';

import { Button, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';

interface LiveActivity {
  id: string;
  type: 'new_post' | 'trending' | 'milestone' | 'live_event';
  message: string;
  count?: number;
  timestamp: string;
  priority: 'low' | 'normal' | 'high';
  category?: string;
  actionable?: boolean;
}

interface LiveActivityBarProps {
  onNotificationClick?: () => void;
  className?: string;
}

// Mock live activities
const MOCK_ACTIVITIES: LiveActivity[] = [
  {
    id: '1',
    type: 'new_post',
    message: '5 new posts in AI Innovation',
    count: 5,
    timestamp: 'just now',
    priority: 'normal',
    category: 'AI Innovation',
    actionable: true
  },
  {
    id: '2',
    type: 'trending',
    message: 'React 19 is trending with 89 new discussions',
    count: 89,
    timestamp: '2 minutes ago',
    priority: 'high',
    actionable: true
  },
  {
    id: '3',
    type: 'milestone',
    message: 'Designer community reached 10K members!',
    timestamp: '5 minutes ago',
    priority: 'normal',
    category: 'Design Trends'
  },
  {
    id: '4',
    type: 'live_event',
    message: 'Live: TypeScript 5.3 Release Discussion',
    timestamp: 'happening now',
    priority: 'high',
    category: 'Developer Life',
    actionable: true
  }
];

export default function LiveActivityBar({
  onNotificationClick,
  className = ''
}: LiveActivityBarProps) {
  const [activities, setActivities] = useState<LiveActivity[]>(MOCK_ACTIVITIES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Auto-rotate through activities
  useEffect(() => {
    if (activities.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [activities.length]);

  // Simulate new activities
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivities = [
        {
          id: Date.now().toString(),
          type: 'new_post' as const,
          message: 'New post: "Advanced TypeScript Patterns"',
          timestamp: 'just now',
          priority: 'normal' as const,
          category: 'Developer Life',
          actionable: true
        },
        {
          id: Date.now().toString(),
          type: 'trending' as const,
          message: 'Design Systems gaining traction',
          count: Math.floor(Math.random() * 50) + 10,
          timestamp: 'just now',
          priority: 'normal' as const,
          actionable: true
        }
      ];

      const randomActivity = newActivities[Math.floor(Math.random() * newActivities.length)];

      setActivities((prev) => [randomActivity, ...prev.slice(0, 4)].filter(Boolean));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const currentActivity = activities[currentIndex];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'new_post':
        return 'solar:document-add-bold';
      case 'trending':
        return 'solar:fire-bold';
      case 'milestone':
        return 'solar:crown-bold';
      case 'live_event':
        return 'solar:record-circle-bold';
      default:
        return 'solar:bell-bold';
    }
  };

  const getActivityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'danger';
      case 'normal':
        return 'primary';
      case 'low':
        return 'default';
      default:
        return 'primary';
    }
  };

  if (!isVisible || !currentActivity) return null;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className={`fixed top-20 left-1/2 z-50 -translate-x-1/2 transform px-4 ${className}`}
    >
      <div className='before:from-primary/20 before:to-secondary/20 relative mx-auto max-w-lg rounded-full border-0 bg-black/20 px-6 py-3 shadow-2xl ring-1 ring-black/20 backdrop-blur-2xl before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-gradient-to-r before:opacity-50 dark:bg-black/10 dark:ring-white/10'>
        <div className='flex items-center gap-4'>
          {/* Live indicator */}
          <div className='flex items-center gap-2'>
            <div className='relative'>
              <div
                className={`h-2 w-2 rounded-full bg-gradient-to-r from-${getActivityColor(currentActivity.priority)} to-${getActivityColor(currentActivity.priority)}/70 animate-pulse shadow-lg shadow-${getActivityColor(currentActivity.priority)}/50`}
              />
              <div
                className={`absolute inset-0 h-2 w-2 rounded-full bg-${getActivityColor(currentActivity.priority)} animate-ping opacity-60`}
              />
              <div
                className={`absolute inset-0 h-3 w-3 rounded-full bg-${getActivityColor(currentActivity.priority)}/20 -translate-x-0.5 -translate-y-0.5 animate-ping opacity-40`}
              />
            </div>
            <span className='text-foreground-800 text-xs font-medium tracking-wide drop-shadow-sm dark:text-white/80'>
              LIVE
            </span>
          </div>

          {/* Activity content */}
          <div className='min-w-0 flex-1'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentActivity.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className='flex items-center gap-3'
              >
                <Icon
                  icon={getActivityIcon(currentActivity.type)}
                  className={`h-4 w-4 text-${getActivityColor(currentActivity.priority)} flex-shrink-0 drop-shadow-sm`}
                />
                <span className='text-foreground-800 truncate text-sm drop-shadow-sm dark:text-white/80'>
                  {currentActivity.message}
                </span>
                {currentActivity.count && (
                  <Chip
                    size='sm'
                    color={getActivityColor(currentActivity.priority)}
                    variant='flat'
                    className='h-5 text-xs'
                  >
                    {currentActivity.count}
                  </Chip>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Minimal controls */}
          <div className='flex items-center gap-2'>
            {/* Activity navigation dots */}
            {activities.length > 1 && (
              <div className='flex items-center gap-1'>
                {activities.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? `bg-${getActivityColor(currentActivity.priority)}`
                        : 'bg-default-300 hover:bg-default-400'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Close button */}
            <Button
              isIconOnly
              size='sm'
              variant='light'
              className='h-6 w-6 opacity-60 transition-opacity hover:opacity-100'
              onPress={() => setIsVisible(false)}
            >
              <Icon icon='solar:close-circle-linear' className='h-3 w-3' />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
