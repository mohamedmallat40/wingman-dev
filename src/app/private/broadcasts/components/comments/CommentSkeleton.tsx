'use client';

import React from 'react';

import { Card, CardBody, Skeleton } from '@heroui/react';

export const CommentSkeleton: React.FC<{ className?: string }> = ({ 
  className = '' 
}) => {
  return (
    <Card className={`border-default-200/50 ${className}`}>
      <CardBody className="p-4">
        {/* Header skeleton */}
        <div className="flex items-start gap-3">
          <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="w-24 h-4 rounded" />
              <Skeleton className="w-16 h-3 rounded" />
            </div>
          </div>
          <Skeleton className="w-6 h-6 rounded" />
        </div>

        {/* Content skeleton */}
        <div className="mt-3 space-y-2">
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-3/4 h-4 rounded" />
          <Skeleton className="w-1/2 h-4 rounded" />
        </div>

        {/* Actions skeleton */}
        <div className="mt-4 flex items-center gap-2">
          <Skeleton className="w-12 h-6 rounded" />
          <Skeleton className="w-12 h-6 rounded" />
          <Skeleton className="w-8 h-6 rounded" />
          <Skeleton className="w-8 h-6 rounded" />
        </div>
      </CardBody>
    </Card>
  );
};