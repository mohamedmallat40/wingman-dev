'use client';

import React from 'react';

import type { IDocument, ViewMode } from '../../types';

import { AnimatePresence, motion } from 'framer-motion';

import { DocumentCard } from '../cards';
import { DocumentEmptyState, DocumentLoadingSkeleton } from '../states';

interface DocumentListContainerProps {
  documents: IDocument[];
  viewMode: ViewMode;
  isLoading?: boolean;
  error?: string | null;
  onUpload?: () => void;
  onRefresh?: () => void;
  handleOnEdit?: (document: IDocument) => void;
  handleOnView?: (document: IDocument) => void;
}

const DocumentListContainer: React.FC<DocumentListContainerProps> = ({
  documents,
  viewMode,
  isLoading = false,
  error = null,
  onUpload,
  onRefresh,
  handleOnEdit,
  handleOnView
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div
        className={
          viewMode === 'grid' ? 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3' : 'space-y-2'
        }
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <DocumentLoadingSkeleton key={index} viewMode={viewMode} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='flex min-h-[400px] items-center justify-center'
      >
        <div className='text-center'>
          <div className='bg-danger-50 dark:bg-danger-900/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
            <svg
              className='text-danger h-8 w-8'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <h3 className='text-foreground mb-2 text-lg font-semibold'>Something went wrong</h3>
          <p className='text-default-600 mb-4 text-sm'>{error}</p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className='bg-primary hover:bg-primary/90 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white'
            >
              Try again
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  // Empty state
  if (documents.length === 0) {
    return <DocumentEmptyState onUpload={onUpload} />;
  }

  // Document list
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={
        viewMode === 'grid' ? 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3' : 'space-y-2'
      }
    >
      <AnimatePresence>
        {documents.map((document, index) => (
          <motion.div
            key={document.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05 // Stagger animation
            }}
          >
            <DocumentCard document={document} viewMode={viewMode} onEdit={handleOnEdit} onView={handleOnView} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default DocumentListContainer;
