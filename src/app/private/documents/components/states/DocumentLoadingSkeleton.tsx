import React from 'react';

import { Card, CardBody, Skeleton } from '@heroui/react';
import { motion } from 'framer-motion';
import type { ViewMode } from '../../types';

interface DocumentLoadingSkeletonProps {
  viewMode?: ViewMode;
}

const DocumentLoadingSkeleton: React.FC<DocumentLoadingSkeletonProps> = ({
  viewMode = 'list'
}) => {
  // Return a single skeleton that matches DocumentCard structure
  // The grid layout is handled by DocumentListContainer
  return (
    <div className="p-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        <Card className="group border-default-200 dark:border-default-700 bg-content1 hover:border-primary/30 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-xl overflow-visible">
          <CardBody className="p-4 sm:p-5 md:p-6 relative">
            {/* Header Section - Icon + Title + Actions */}
            <div className="flex items-start gap-3 sm:gap-4 mb-4">
              {/* Document Icon */}
              <div className="flex-shrink-0 mt-1">
                <div className="relative rounded-xl p-3 shadow-sm ring-1 ring-default-200 dark:ring-default-700">
                  <Skeleton className="rounded-lg">
                    <div className="h-8 w-8 bg-default-200"></div>
                  </Skeleton>
                </div>
              </div>

              {/* Title Section */}
              <div className="flex-1 min-w-0 pr-2 sm:pr-3">
                <div className="flex items-start gap-2 mb-2">
                  <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton className="rounded-lg">
                      <div className="h-5 w-3/4 bg-default-200"></div>
                    </Skeleton>
                    {(viewMode === 'grid' || viewMode === 'card') && (
                      <Skeleton className="rounded-lg">
                        <div className="h-4 w-1/2 bg-default-200"></div>
                      </Skeleton>
                    )}
                  </div>
                  
                  {/* Shared Users Badge */}
                  <div className="relative flex-shrink-0">
                    <Skeleton className="rounded-full">
                      <div className={`${(viewMode === 'grid' || viewMode === 'card') ? 'h-7 w-7' : 'h-6 w-6'} bg-default-200`}></div>
                    </Skeleton>
                  </div>
                </div>

                {/* Date and Type - Right under filename */}
                <div className={`flex items-center gap-2 text-sm flex-wrap ${viewMode === 'list' ? 'mb-3' : ''}`}>
                  <Skeleton className="rounded-lg">
                    <div className="h-3 w-16 bg-default-200"></div>
                  </Skeleton>
                  <div className="h-1 w-1 bg-default-300 rounded-full" />
                  <Skeleton className="rounded-lg">
                    <div className="h-3 w-12 bg-default-200"></div>
                  </Skeleton>
                </div>

                {/* Metadata for list view (inline) */}
                {viewMode === 'list' && (
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1">
                      <span className="text-default-500 text-xs">Tags:</span>
                      <Skeleton className="rounded-full">
                        <div className="h-4 w-12 bg-default-200"></div>
                      </Skeleton>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-default-500 text-xs">Status:</span>
                      <Skeleton className="rounded-full">
                        <div className="h-4 w-16 bg-default-200"></div>
                      </Skeleton>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-start gap-1.5 sm:gap-2 flex-shrink-0">
                <Skeleton className="rounded-lg">
                  <div className="h-8 w-8 bg-default-200"></div>
                </Skeleton>
                <Skeleton className="rounded-lg">
                  <div className="h-8 w-8 bg-default-200"></div>
                </Skeleton>
              </div>
            </div>

            {/* Metadata Section - Full Width (only for grid and card view) */}
            {(viewMode === 'grid' || viewMode === 'card') && (
              <div className="w-full space-y-3">
                {/* Tags Section - Full Width */}
                <div className="w-full">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-default-500 text-xs font-medium flex-shrink-0 mt-1">Tags:</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-1">
                        <Skeleton className="rounded-full">
                          <div className="h-5 w-12 bg-default-200"></div>
                        </Skeleton>
                        <Skeleton className="rounded-full">
                          <div className="h-5 w-16 bg-default-200"></div>
                        </Skeleton>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Section - Full Width */}
                <div className="w-full">
                  <div className="flex items-center gap-2">
                    <span className="text-default-500 text-xs font-medium flex-shrink-0">Status:</span>
                    <Skeleton className="rounded-full">
                      <div className="h-5 w-20 bg-default-200"></div>
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
