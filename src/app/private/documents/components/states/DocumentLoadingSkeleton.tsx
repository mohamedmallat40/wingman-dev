import React from 'react';

import type { ViewMode } from '../../types';

import { Card, CardBody, Skeleton } from '@heroui/react';
import { motion } from 'framer-motion';

interface DocumentLoadingSkeletonProps {
  viewMode?: ViewMode;
}

const DocumentLoadingSkeleton: React.FC<DocumentLoadingSkeletonProps> = ({ viewMode = 'list' }) => {
  // Return a single skeleton that matches DocumentCard structure
  // The grid layout is handled by DocumentListContainer
  return (
    <div className='p-3'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className='w-full'
      >
        <Card className='group border-default-200 dark:border-default-700 bg-content1 hover:border-primary/30 dark:hover:border-primary/50 overflow-visible transition-all duration-300 hover:shadow-xl'>
          <CardBody className='relative p-4 sm:p-5 md:p-6'>
            {/* Header Section - Icon + Title + Actions */}
            <div className='mb-4 flex items-start gap-3 sm:gap-4'>
              {/* Document Icon */}
              <div className='mt-1 flex-shrink-0'>
                <div className='ring-default-200 dark:ring-default-700 relative rounded-xl p-3 shadow-sm ring-1'>
                  <Skeleton className='rounded-lg'>
                    <div className='bg-default-200 h-8 w-8'></div>
                  </Skeleton>
                </div>
              </div>

              {/* Title Section */}
              <div className='min-w-0 flex-1 pr-2 sm:pr-3'>
                <div className='mb-2 flex items-start gap-2'>
                  <div className='min-w-0 flex-1 space-y-2'>
                    <Skeleton className='rounded-lg'>
                      <div className='bg-default-200 h-5 w-3/4'></div>
                    </Skeleton>
                    {(viewMode === 'grid' || viewMode === 'card') && (
                      <Skeleton className='rounded-lg'>
                        <div className='bg-default-200 h-4 w-1/2'></div>
                      </Skeleton>
                    )}
                  </div>

                  {/* Shared Users Badge */}
                  <div className='relative flex-shrink-0'>
                    <Skeleton className='rounded-full'>
                      <div
                        className={`${viewMode === 'grid' || viewMode === 'card' ? 'h-7 w-7' : 'h-6 w-6'} bg-default-200`}
                      ></div>
                    </Skeleton>
                  </div>
                </div>

                {/* Date and Type - Right under filename */}
                <div
                  className={`flex flex-wrap items-center gap-2 text-sm ${viewMode === 'list' ? 'mb-3' : ''}`}
                >
                  <Skeleton className='rounded-lg'>
                    <div className='bg-default-200 h-3 w-16'></div>
                  </Skeleton>
                  <div className='bg-default-300 h-1 w-1 rounded-full' />
                  <Skeleton className='rounded-lg'>
                    <div className='bg-default-200 h-3 w-12'></div>
                  </Skeleton>
                </div>

                {/* Metadata for list view (inline) */}
                {viewMode === 'list' && (
                  <div className='flex flex-wrap items-center gap-4'>
                    <div className='flex items-center gap-1'>
                      <span className='text-default-500 text-xs'>Tags:</span>
                      <Skeleton className='rounded-full'>
                        <div className='bg-default-200 h-4 w-12'></div>
                      </Skeleton>
                    </div>
                    <div className='flex items-center gap-1'>
                      <span className='text-default-500 text-xs'>Status:</span>
                      <Skeleton className='rounded-full'>
                        <div className='bg-default-200 h-4 w-16'></div>
                      </Skeleton>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className='flex flex-shrink-0 items-start gap-1.5 sm:gap-2'>
                <Skeleton className='rounded-lg'>
                  <div className='bg-default-200 h-8 w-8'></div>
                </Skeleton>
                <Skeleton className='rounded-lg'>
                  <div className='bg-default-200 h-8 w-8'></div>
                </Skeleton>
              </div>
            </div>

            {/* Metadata Section - Full Width (only for grid and card view) */}
            {(viewMode === 'grid' || viewMode === 'card') && (
              <div className='w-full space-y-3'>
                {/* Tags Section - Full Width */}
                <div className='w-full'>
                  <div className='mb-2 flex items-start gap-2'>
                    <span className='text-default-500 mt-1 flex-shrink-0 text-xs font-medium'>
                      Tags:
                    </span>
                    <div className='min-w-0 flex-1'>
                      <div className='flex flex-wrap gap-1'>
                        <Skeleton className='rounded-full'>
                          <div className='bg-default-200 h-5 w-12'></div>
                        </Skeleton>
                        <Skeleton className='rounded-full'>
                          <div className='bg-default-200 h-5 w-16'></div>
                        </Skeleton>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Section - Full Width */}
                <div className='w-full'>
                  <div className='flex items-center gap-2'>
                    <span className='text-default-500 flex-shrink-0 text-xs font-medium'>
                      Status:
                    </span>
                    <Skeleton className='rounded-full'>
                      <div className='bg-default-200 h-5 w-20'></div>
                    </Skeleton>
                  </div>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default DocumentLoadingSkeleton;
