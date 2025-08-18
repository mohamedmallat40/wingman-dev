'use client';

import React from 'react';

import { Card, CardBody, Skeleton } from '@heroui/react';

export const CommentSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <Card className={`border-default-200/50 ${className}`}>
      <CardBody className='p-4'>
        {/* Header skeleton */}
        <div className='flex items-start gap-3'>
          <Skeleton className='h-8 w-8 flex-shrink-0 rounded-full' />
          <div className='flex-1 space-y-2'>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-4 w-24 rounded' />
              <Skeleton className='h-3 w-16 rounded' />
            </div>
          </div>
          <Skeleton className='h-6 w-6 rounded' />
        </div>

        {/* Content skeleton */}
        <div className='mt-3 space-y-2'>
          <Skeleton className='h-4 w-full rounded' />
          <Skeleton className='h-4 w-3/4 rounded' />
          <Skeleton className='h-4 w-1/2 rounded' />
        </div>

        {/* Actions skeleton */}
        <div className='mt-4 flex items-center gap-2'>
          <Skeleton className='h-6 w-12 rounded' />
          <Skeleton className='h-6 w-12 rounded' />
          <Skeleton className='h-6 w-8 rounded' />
          <Skeleton className='h-6 w-8 rounded' />
        </div>
      </CardBody>
    </Card>
  );
};
