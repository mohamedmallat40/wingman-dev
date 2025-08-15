'use client';

import React from 'react';

import {
  Card,
  CardBody
} from '@heroui/react';

interface TopicsSkeletonProps {
  count?: number;
  className?: string;
}

export const TopicsSkeleton: React.FC<TopicsSkeletonProps> = ({
  count = 6,
  className = ''
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className='border-default-200 animate-pulse'>
          <CardBody className='p-3'>
            <div className='flex items-start gap-3'>
              {/* Icon skeleton */}
              <div className='bg-default-200 h-10 w-10 flex-shrink-0 rounded-lg' />

              <div className='min-w-0 flex-1'>
                {/* Topic name skeleton */}
                <div className='bg-default-200 mb-2 h-4 w-3/4 rounded' />

                {/* Description skeleton */}
                <div className='space-y-1'>
                  <div className='bg-default-200 h-3 w-full rounded' />
                  <div className='bg-default-200 h-3 w-2/3 rounded' />
                </div>

                {/* Stats skeleton */}
                <div className='mt-2 flex items-center gap-4'>
                  <div className='bg-default-200 h-3 w-12 rounded' />
                  <div className='bg-default-200 h-3 w-16 rounded' />
                </div>
              </div>

              {/* Follow button skeleton */}
              <div className='bg-default-200 h-8 w-16 rounded-full' />
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};