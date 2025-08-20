'use client';

import React from 'react';

import { Card, CardBody, CardHeader, Skeleton } from '@heroui/react';

interface BroadcastFeedSkeletonProps {
  count?: number;
  className?: string;
}

const BroadcastFeedSkeleton: React.FC<BroadcastFeedSkeletonProps> = ({
  count = 3,
  className = ''
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Skeleton */}
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <Skeleton className='h-8 w-48 rounded-lg' />
          <Skeleton className='h-4 w-32 rounded-lg' />
        </div>
        <Skeleton className='h-8 w-24 rounded-full' />
      </div>

      {/* Post Skeletons */}
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className='border-default-200/50 bg-content1/80 backdrop-blur-xl rounded-[20px] shadow-[0px_8px_30px_rgba(0,0,0,0.08)]'>
          <CardHeader className='pb-3'>
            <div className='flex w-full items-start gap-3'>
              {/* Avatar */}
              <Skeleton className='h-12 w-12 rounded-full' />

              {/* Author Info */}
              <div className='min-w-0 flex-1 space-y-2'>
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-4 w-24 rounded' />
                  <Skeleton className='h-4 w-16 rounded' />
                  <Skeleton className='h-4 w-12 rounded' />
                </div>
                <div className='flex gap-2'>
                  <Skeleton className='h-6 w-16 rounded-full' />
                  <Skeleton className='h-6 w-20 rounded-full' />
                </div>
              </div>

              {/* Action Button */}
              <Skeleton className='h-8 w-8 rounded-full' />
            </div>
          </CardHeader>

          <CardBody className='space-y-4 pt-0'>
            {/* Title */}
            <Skeleton className='h-6 w-3/4 rounded' />

            {/* Content */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-full rounded' />
              <Skeleton className='h-4 w-full rounded' />
              <Skeleton className='h-4 w-2/3 rounded' />
            </div>

            {/* Media */}
            {index % 2 === 0 && <Skeleton className='h-48 w-full rounded-lg' />}

            {/* Tags */}
            <div className='flex gap-2'>
              <Skeleton className='h-6 w-16 rounded-full' />
              <Skeleton className='h-6 w-20 rounded-full' />
              <Skeleton className='h-6 w-12 rounded-full' />
            </div>

            {/* Actions */}
            <div className='flex items-center justify-between pt-2'>
              <div className='flex gap-2'>
                <Skeleton className='h-8 w-16 rounded-full' />
                <Skeleton className='h-8 w-16 rounded-full' />
                <Skeleton className='h-8 w-16 rounded-full' />
              </div>
              <div className='flex gap-4'>
                <Skeleton className='h-4 w-12 rounded' />
                <Skeleton className='h-4 w-16 rounded' />
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default BroadcastFeedSkeleton;
