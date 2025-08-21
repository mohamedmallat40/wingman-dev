'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

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
import { DocumentViewerDrawer } from './components/DocumentViewerDrawer';
import {
  ACTION_ITEMS,
  BREADCRUMB_CONFIG,
  TAB_BREADCRUMB_ICONS,
  TAB_BREADCRUMB_LABELS
} from './constants';
import { useDocuments, useDocumentState } from './hooks';
import { type DocumentType, type IDocument } from './types';
import { filterDocuments } from './utils';

export default function DocumentsPage() {
  const t = useTranslations('documents');
  const { data: result, isLoading, error, isError, refetch } = useDocuments();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState<IDocument | null>(null);
  const [modalMode, setModalMode] = useState<'upload' | 'edit'>('upload');
  const [viewingDocument, setViewingDocument] = useState<IDocument | null>(null);
  const [showViewerDrawer, setShowViewerDrawer] = useState(false);

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

  // Handle search input changes with debouncing
  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
    },
    [setSearchQuery]
  );

  // Filter documents based on active tab and search query
  const filteredDocuments = useMemo(() => {
    if (!result?.data) return [];

    let documents = result.data;

    // Filter by tab first
    if (activeTab === 'shared-with-me') {
      documents = documents.filter(
        (document_) => document_.sharedWith && document_.sharedWith.length > 0
      );
    }
    // 'all-documents' shows all documents, so no additional filtering needed

    // Apply filters and search using utility function
    const filtered = filterDocuments(documents, filters, searchQuery);

    return filtered;
  }, [result?.data, activeTab, searchQuery, filters]);

  const handleUploadModalClose = useCallback(
    (shouldRefresh = false) => {
      setShowUploadModal(false);
      setEditingDocument(null);
      if (shouldRefresh) {
        refetch();
      }
    },
    [refetch]
  );

  const handleUploadDocument = useCallback(() => {
    setModalMode('upload');
    setEditingDocument(null);
    setShowUploadModal(true);
  }, []);

  const handleEditDocument = useCallback((document: IDocument) => {
    setModalMode('edit');
    setEditingDocument(document);
    setShowUploadModal(true);
  }, []);

  const handleViewDocument = useCallback((document: IDocument) => {
    setViewingDocument(document);
    setShowViewerDrawer(true);
  }, []);

  const handleCloseViewer = useCallback(() => {
    setShowViewerDrawer(false);
    setViewingDocument(null);
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Clear search and filters when tab changes
  useEffect(() => {
    setSearchQuery('');
    setFilters({});
  }, [activeTab, setSearchQuery, setFilters]);

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
  const actionItems = useMemo(
    () =>
      ACTION_ITEMS.map((item) => ({
        ...item,
        onPress: item.key === 'upload' ? handleUploadDocument : undefined
      })),
    [handleUploadDocument]
  );

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
              onPress={action.onPress}
              className='font-medium transition-all duration-200 hover:shadow-md'
            >
              <span className='hidden sm:inline'>{action.label}</span>
            </Button>
          ))}
        </div>
      }
    >
      <div className='mx-auto w-full space-y-8 px-4 py-6 sm:px-6 lg:px-8 xl:max-w-[85%] 2xl:max-w-[75%]'>
        <div className='space-y-6'>
          {/* Enhanced Tabs Navigation with Integrated Search */}
          <DocumentTabs
            activeTab={activeTab}
            onTabChange={(tab: any) => {
              setActiveTab(tab as DocumentType);
            }}
            documentsCount={filteredDocuments.length}
            onToggleFilters={toggleFilters}
            showFilters={showFilters}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Enhanced Filters Panel with Document Content */}
          <DocumentFiltersPanel
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            filters={filters}
            onFiltersChange={setFilters}
            activeTab={activeTab}
            onSearch={handleSearch}
            showFiltersPanel={showFilters}
            onToggleFiltersPanel={toggleFilters}
            documents={result?.data || []}
          >
            {/* Document List Container */}
            <AnimatePresence mode='wait'>
              <motion.div
                key={`${activeTab}-${searchQuery}-${JSON.stringify(filters)}`}
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
                  handleOnEdit={handleEditDocument}
                  handleOnView={handleViewDocument}
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
        document={editingDocument}
        mode={modalMode}
      />

      {/* Document Viewer Drawer */}
      <DocumentViewerDrawer
        isOpen={showViewerDrawer}
        onClose={handleCloseViewer}
        document={viewingDocument}
        onEdit={handleEditDocument}
      />
    </DashboardLayout>
  );
}
