'use client';

import React from 'react';

import { Skeleton } from '@heroui/react';

interface LoadingSkeletonProps {
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 12 }) => (
  <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className='shadow-soft border-default-200 from-background via-background/95 to-background rounded-large h-full w-full space-y-4 border bg-gradient-to-br p-6'
      >
        {/* Header Section */}
        <div className='flex w-full items-start gap-4'>
          <div className='relative'>
            <Skeleton className='h-20 w-20 rounded-full' />
            <div className='absolute -right-1 -bottom-1'>
              <Skeleton className='h-6 w-6 rounded-full' />
            </div>
          </div>
          <div className='flex min-w-0 flex-grow flex-col gap-2'>
            <div className='flex items-start justify-between'>
              <div className='min-w-0 flex-grow space-y-2'>
                <Skeleton className='h-6 w-32 rounded-lg' />
                <Skeleton className='h-4 w-24 rounded-lg' />
              </div>
              <div className='ml-2 flex items-center gap-1'>
                <Skeleton className='h-8 w-8 rounded-lg' />
                <Skeleton className='h-8 w-8 rounded-lg' />
              </div>
            </div>
            <div className='space-y-1'>
              <Skeleton className='h-4 w-28 rounded-lg' />
            </div>
            <div className='mt-2 flex items-center gap-2'>
              <Skeleton className='h-6 w-16 rounded-full' />
              <Skeleton className='h-6 w-20 rounded-full' />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className='bg-background/80 rounded-large border-default-200/50 space-y-2 border p-4 backdrop-blur-sm'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-4 w-4 rounded' />
            <Skeleton className='h-4 w-12 rounded-lg' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-3 w-full rounded-lg' />
            <Skeleton className='h-3 w-4/5 rounded-lg' />
            <Skeleton className='h-3 w-3/4 rounded-lg' />
          </div>
        </div>

        {/* Skills Section */}
        <div className='bg-background/80 rounded-large border-default-200/50 space-y-3 border p-4 backdrop-blur-sm'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-4 w-4 rounded' />
            <Skeleton className='h-4 w-16 rounded-lg' />
          </div>
          <div className='flex flex-wrap gap-2'>
            <Skeleton className='h-6 w-16 rounded-full' />
            <Skeleton className='h-6 w-12 rounded-full' />
            <Skeleton className='h-6 w-20 rounded-full' />
            <Skeleton className='h-6 w-14 rounded-full' />
          </div>
        </div>

        {/* Stats Section */}
        <div className='grid grid-cols-3 gap-3'>
          <div className='bg-background/80 rounded-large border-default-200/50 space-y-2 border p-3 text-center backdrop-blur-sm'>
            <Skeleton className='mx-auto h-8 w-8 rounded-full' />
            <Skeleton className='mx-auto h-3 w-16 rounded-lg' />
            <Skeleton className='mx-auto h-4 w-12 rounded-lg' />
          </div>
          <div className='bg-background/80 rounded-large border-default-200/50 space-y-2 border p-3 text-center backdrop-blur-sm'>
            <Skeleton className='mx-auto h-8 w-8 rounded-full' />
            <Skeleton className='mx-auto h-3 w-8 rounded-lg' />
            <Skeleton className='mx-auto h-4 w-10 rounded-lg' />
          </div>
          <div className='bg-background/80 rounded-large border-default-200/50 space-y-2 border p-3 text-center backdrop-blur-sm'>
            <Skeleton className='mx-auto h-8 w-8 rounded-full' />
            <Skeleton className='mx-auto h-3 w-10 rounded-lg' />
            <Skeleton className='mx-auto h-4 w-14 rounded-lg' />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default LoadingSkeleton;
