'use client';

import React, { useCallback, useMemo, useState } from 'react';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useUpdateDocument, useUploadDocument } from '@root/modules/documents/hooks/use-documents';
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
  const { data: result, isLoading, error, isError } = useDocuments();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState<IDocument | null>(null);
  const [modalMode, setModalMode] = useState<'upload' | 'edit'>('upload');
  const [viewingDocument, setViewingDocument] = useState<IDocument | null>(null);
  const [showViewerDrawer, setShowViewerDrawer] = useState(false);

  // Add these mutations after existing hooks
  const uploadMutation = useUploadDocument();
  const updateMutation = useUpdateDocument();
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

  // Filter documents based on active tab and search query
  const filteredDocuments = useMemo(() => {
    if (!result?.data) return [];

    let documents = result.data;

    // Filter by tab
    if (activeTab === 'shared-with-me') {
      documents = documents.filter((document_) => document_.sharedWith.length > 0);
    }
    // 'all-documents' shows all documents, so no additional filtering needed

    // Apply filters and search using utility function
    return filterDocuments(documents, filters, searchQuery);
  }, [result?.data, activeTab, searchQuery, filters]);

  const handleUploadModalClose = useCallback(() => {
    setShowUploadModal(false);
  }, []);

  const handleUploadDocument = useCallback(() => {
    setModalMode('upload');
    setEditingDocument(null);
    setShowUploadModal(true);
  }, []);

  const handleUpload = useCallback(
    async (data: { name: string; tags: string[]; file: File; type: string; status: string }) => {
      try {
        const formData = new FormData();
        formData.append('image', data.file);
        formData.append('documentName', data.name);
        formData.append('typeId', data.type);
        formData.append('statusId', data.status);

        for (const [index, tagId] of data.tags.entries()) {
          formData.append(`tags`, tagId);
        }

        await uploadMutation.mutateAsync(formData);
        console.log('Document uploaded successfully:', data);
      } catch (error) {
        console.error('Upload failed:', error);
        throw error;
      }
    },
    [uploadMutation]
  );

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

  const handleUpdate = useCallback(
    async (
      documentId: string,
      data: { name: string; tags: string[]; file?: File; type: string; status: string }
    ) => {
      try {
        const formData = new FormData();
        formData.append('documentName', data.name);
        formData.append('typeId', data.type);
        formData.append('statusId', data.status);

        if (data.file) {
          formData.append('image', data.file);
        }

        for (const [index, tagId] of data.tags.entries()) {
          formData.append(`tags`, tagId);
        }

        await updateMutation.mutateAsync({ documentId, formData });
        console.log('Document updated successfully:', data);
      } catch (error) {
        console.error('Update failed:', error);
        throw error;
      }
    },
    [updateMutation]
  );

  const handleRefresh = useCallback(() => {
    // In a real app, this would refetch the data
    globalThis.location.reload();
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
        : () => {
            console.log(`${item.label} clicked`);
          }
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
              onPress={() => {
                action.onClick?.();
              }}
              className='font-medium transition-all duration-200 hover:shadow-md'
            >
              {action.label}
            </Button>
          ))}
        </div>
      }
    >
      <div className='mx-auto w-full space-y-8 px-2 py-6 sm:px-4 md:px-6 xl:w-[70%] xl:px-0'>
        <div className='space-y-6'>
          {/* Enhanced Tabs Navigation with Integrated Search */}
          <DocumentTabs
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab as DocumentType);
            }}
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
        onUpload={handleUpload}
        onUpdate={handleUpdate}
        document={editingDocument}
        mode={modalMode}
      />
    </DashboardLayout>
  );
}
