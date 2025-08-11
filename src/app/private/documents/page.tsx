'use client';

import React, { useCallback, useMemo, useState } from 'react';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import DashboardLayout from '@/components/layouts/dashboard-layout';

import {
  DocumentFiltersPanel,
  DocumentListContainer,
  DocumentTabs,
  DocumentUploadModal
} from './components';
import {
  ACTION_ITEMS,
  BREADCRUMB_CONFIG,
  TAB_BREADCRUMB_ICONS,
  TAB_BREADCRUMB_LABELS
} from './constants';
import { useDocumentFilters, useDocuments, useDocumentState } from './hooks';
import { type DocumentType } from './types';
import { filterDocuments, getActiveFiltersCount } from './utils';

export default function DocumentsPage() {
  const t = useTranslations('documents');
  const { data: result, isLoading, error, isError } = useDocuments();
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Enhanced state management using custom hooks
  const documentState = useDocumentState();
  const {
    activeTab,
    searchQuery,
    filters,
    showFilters,
    viewMode,
    setActiveTab,
    setSearchQuery,
    setFilters,
    toggleFilters,
    setViewMode,
    handleSearch
  } = documentState;

  // Get filter information for performance
  const activeFiltersCount = useMemo(() => getActiveFiltersCount(filters), [filters]);

  // Filter documents based on active tab and search query
  const filteredDocuments = useMemo(() => {
    if (!result?.data) return [];

    let documents = result.data;

    // Filter by tab
    if (activeTab === 'shared-with-me') {
      documents = documents.filter((doc) => doc.sharedWith.length > 0);
    }
    // 'all-documents' shows all documents, so no additional filtering needed

    // Apply filters and search using utility function
    return filterDocuments(documents, filters, searchQuery);
  }, [result?.data, activeTab, searchQuery, filters]);

  // Event handlers following talent pool pattern
  const handleUploadDocument = useCallback(() => {
    setShowUploadModal(true);
  }, []);

  const handleUploadModalClose = useCallback(() => {
    setShowUploadModal(false);
  }, []);

  const handleUpload = useCallback(
    async (data: { name: string; tags: string[]; file: File; type: string; status: string }) => {
      try {
        console.log('Uploading document:', data);
        // Here you would integrate with your actual upload API
        // await uploadDocument(data);

        // For now, just log the data
        alert(`Document "${data.name}" uploaded successfully with tags: ${data.tags.join(', ')}`);
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Upload failed. Please try again.');
      }
    },
    []
  );

  const handleRefresh = useCallback(() => {
    // In a real app, this would refetch the data
    window.location.reload();
  }, []);

  // Breadcrumbs configuration
  const getBreadcrumbs = () => {
    const baseBreadcrumbs = [BREADCRUMB_CONFIG.HOME, BREADCRUMB_CONFIG.DOCUMENTS];

    return [
      ...baseBreadcrumbs,
      {
        label: TAB_BREADCRUMB_LABELS[activeTab],
        icon: TAB_BREADCRUMB_ICONS[activeTab]
      }
    ];
  };

  // Action items with handlers
  const actionItems = ACTION_ITEMS.map((item) => ({
    ...item,
    onClick:
      item.key === 'upload'
        ? handleUploadDocument
        : () => console.log(`${item.label} clicked`)
  }));

  return (
    <DashboardLayout
      pageTitle={t('title')}
      pageDescription={t('description')}
      pageIcon='solar:document-text-linear'
      breadcrumbs={getBreadcrumbs()}
      headerActions={
        <div className='flex items-center gap-2'>
          {actionItems.map((action) => (
            <Button
              key={action.key}
              color={action.color}
              variant={action.variant}
              size='sm'
              startContent={
                action.icon ? <Icon icon={action.icon} className='h-4 w-4' /> : undefined
              }
              onPress={() => action.onClick?.()}
              className='font-medium transition-all duration-200 hover:shadow-md'
            >
              {action.label}
            </Button>
          ))}
        </div>
      }
    >
      <div className='mx-auto w-full px-2 sm:px-4 md:px-6 xl:w-[70%] xl:px-0 space-y-8 py-6'>
        <div className='space-y-6'>
          {/* Enhanced Tabs Navigation with Integrated Search */}
          <DocumentTabs
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab as DocumentType)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearch={handleSearch}
            documentsCount={filteredDocuments.length}
            onToggleFilters={toggleFilters}
            showFilters={showFilters}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Enhanced Filters Panel with Document Content */}
          <DocumentFiltersPanel
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filters}
            onFiltersChange={setFilters}
            activeTab={activeTab}
            onSearch={handleSearch}
            showFiltersPanel={showFilters}
            onToggleFiltersPanel={toggleFilters}
          >
            {/* Document List Container */}
            <AnimatePresence mode='wait'>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DocumentListContainer
                  documents={filteredDocuments}
                  viewMode={viewMode}
                  isLoading={isLoading}
                  error={isError ? error?.message || 'An error occurred' : null}
                  onUpload={handleUploadDocument}
                  onRefresh={handleRefresh}
                />
              </motion.div>
            </AnimatePresence>
          </DocumentFiltersPanel>
        </div>
      </div>

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={showUploadModal}
        onClose={handleUploadModalClose}
        onUpload={handleUpload}
      />
    </DashboardLayout>
  );
}
