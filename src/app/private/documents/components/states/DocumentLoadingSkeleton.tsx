import React from 'react';

import { Card, CardBody, Skeleton } from '@heroui/react';
import { motion } from 'framer-motion';

interface DocumentLoadingSkeletonProps {
  count?: number;
  viewMode?: 'list' | 'grid';
  className?: string;
}

const DocumentLoadingSkeleton: React.FC<DocumentLoadingSkeletonProps> = ({
  count = 5,
  viewMode = 'list',
  className = ''
}) => {
  const skeletonItems = Array.from({ length: count });

  if (viewMode === 'grid') {
    return (
      <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
        {skeletonItems.map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Card className='border-default-200 dark:border-default-700 bg-content1 dark:bg-content1'>
              <CardBody className='p-5'>
                <div className='flex flex-col gap-4'>
                  {/* Icon and Title Row */}
                  <div className='flex items-start gap-4'>
                    <Skeleton className='rounded-xl'>
                      <div className='bg-default-200 h-14 w-14'></div>
                    </Skeleton>
                    <div className='flex-1 space-y-2'>
                      <Skeleton className='rounded-lg'>
                        <div className='bg-default-200 h-5 w-3/4'></div>
                      </Skeleton>
                      <Skeleton className='rounded-lg'>
                        <div className='bg-default-200 h-3 w-1/2'></div>
                      </Skeleton>
                    </div>
                  </div>

                  {/* Tags Row */}
                  <div className='flex gap-2'>
                    <Skeleton className='rounded-full'>
                      <div className='bg-default-200 h-6 w-16'></div>
                    </Skeleton>
                    <Skeleton className='rounded-full'>
                      <div className='bg-default-200 h-6 w-12'></div>
                    </Skeleton>
                  </div>

                  {/* Status Row */}
                  <div className='flex items-center justify-between'>
                    <Skeleton className='rounded-full'>
                      <div className='bg-default-200 h-6 w-20'></div>
                    </Skeleton>
                    <div className='flex gap-2'>
                      <Skeleton className='rounded-lg'>
                        <div className='bg-default-200 h-8 w-16'></div>
                      </Skeleton>
                      <Skeleton className='rounded-lg'>
                        <div className='bg-default-200 h-8 w-8'></div>
                      </Skeleton>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {skeletonItems.map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
        >
          <Card className='border-default-200 dark:border-default-700 bg-content1 dark:bg-content1'>
            <CardBody className='p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex flex-1 items-center gap-4'>
                  {/* Document Icon Skeleton */}
                  <Skeleton className='rounded-lg'>
                    <div className='bg-default-200 h-10 w-10'></div>
                  </Skeleton>

                  <div className='min-w-0 flex-1 space-y-2'>
                    {/* Document Title Skeleton */}
                    <Skeleton className='rounded-lg'>
                      <div className='bg-default-200 h-5 w-3/4 rounded-lg'></div>
                    </Skeleton>

                    {/* Metadata Row Skeleton */}
                    <div className='flex flex-wrap items-center gap-4'>
                      {/* Modified Date */}
                      <Skeleton className='rounded-lg'>
                        <div className='bg-default-200 h-3 w-20 rounded-lg'></div>
                      </Skeleton>

                      {/* Document Type */}
                      <Skeleton className='rounded-lg'>
                        <div className='bg-default-200 h-3 w-16 rounded-lg'></div>
                      </Skeleton>

                      {/* Tags Skeleton */}
                      <div className='flex gap-1'>
                        <Skeleton className='rounded-full'>
                          <div className='bg-default-200 h-5 w-12 rounded-full'></div>
                        </Skeleton>
                        <Skeleton className='rounded-full'>
                          <div className='bg-default-200 h-5 w-10 rounded-full'></div>
                        </Skeleton>
                      </div>

                      {/* Status Skeleton */}
                      <Skeleton className='rounded-full'>
                        <div className='bg-default-200 h-5 w-20 rounded-full'></div>
                      </Skeleton>

                      {/* Shared With Skeleton */}
                      <Skeleton className='rounded-lg'>
                        <div className='bg-default-200 h-3 w-16 rounded-lg'></div>
                      </Skeleton>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Skeleton */}
                <div className='flex items-center gap-2'>
                  <Skeleton className='rounded-lg'>
                    <div className='bg-default-200 h-8 w-16 rounded-lg'></div>
                  </Skeleton>
                  <Skeleton className='rounded-lg'>
                    <div className='bg-default-200 h-8 w-8 rounded-lg'></div>
                  </Skeleton>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default DocumentLoadingSkeleton;
