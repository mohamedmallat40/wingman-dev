'use client';

import React, { useState } from 'react';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useDocuments } from '@root/modules/documents/hooks/use-documents';

import DashboardLayout from '@/components/layouts/dashboard-layout';

import DocumentCard, { DocumentCardSkeleton } from './components/document-card';
import DocumentTabs from './components/DocumentTabs';
import DocumentUploadModal from './components/DocumentUploadModal';
import { type DocumentType } from './types';

export default function DocumentsPage() {
  const t = useTranslations('documents');
  const { data: result, isLoading, error, isError } = useDocuments();
  const [selectedTab, setSelectedTab] = useState<DocumentType>('all-documents');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Filter documents based on active tab and search query
  const filteredDocuments = React.useMemo(() => {
    if (!result?.data) return [];

    let documents = result.data;

    // Filter by tab
    if (selectedTab === 'shared-with-me') {
      documents = documents.filter(doc => doc.sharedWith.length > 0);
    }
    // 'all-documents' shows all documents, so no additional filtering needed

    // Filter by search query
    if (searchQuery.trim()) {
      documents = documents.filter(
        (doc) =>
          doc.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.tags.some((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          doc.type.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return documents;
  }, [result?.data, selectedTab, searchQuery]);

  const handleSearch = () => {
    // Trigger search logic if needed
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleUpload = async (data: { name: string; tags: string[]; file: File }) => {
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
  };

  const documentList = () => {
    if (isLoading) {
      return (
        <div className='space-y-2'>
          {Array.from({ length: 5 }).map((_, index) => (
            <DocumentCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (filteredDocuments.length === 0) {
      return (
        <div className='mt-10 flex flex-col items-center text-center'>
          <Icon
            icon='solar:document-text-linear'
            className='text-primary mx-auto mb-4 block h-24 w-24'
          />
          <h2 className='mb-2 text-2xl font-bold'>{t('emptyState.title')}</h2>
          <p className='text-default-600 mb-4'>{t('emptyState.description')}</p>
          <Button 
            color='primary' 
            startContent={<Icon icon='solar:document-add-linear' />}
            onPress={() => setShowUploadModal(true)}
          >
            {t('emptyState.uploadButton')}
          </Button>
        </div>
      );
    }

    return (
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
        {filteredDocuments.map((document) => (
          <DocumentCard key={document.id} document={document} viewMode={viewMode} />
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout
      pageTitle={t('title')}
      pageDescription={t('description')}
      pageIcon='solar:document-text-linear'
      breadcrumbs={[
        { label: 'Home', href: '/private/dashboard', icon: 'solar:home-linear' },
        { label: t('title') }
      ]}
      headerActions={
        <Button
          color='primary'
          startContent={<Icon icon='solar:upload-linear' className='h-4 w-4' />}
          className='font-medium'
          onPress={() => setShowUploadModal(true)}
        >
          {t('upload')}
        </Button>
      }
    >
      <div className='mx-auto w-[70%] space-y-8 py-6'>
        <div className='space-y-6'>
          <DocumentTabs
            activeTab={selectedTab}
            onTabChange={(tab) => setSelectedTab(tab as DocumentType)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearch={handleSearch}
            documentsCount={filteredDocuments.length}
            onToggleFilters={handleToggleFilters}
            showFilters={showFilters}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                layoutId='filter-panel'
                className='space-y-6 overflow-hidden'
                initial={{ opacity: 0, scaleY: 0, transformOrigin: 'top' }}
                animate={{ opacity: 1, scaleY: 1, transformOrigin: 'top' }}
                exit={{ opacity: 0, scaleY: 0, transformOrigin: 'top' }}
                transition={{
                  duration: 0.25,
                  ease: [0.4, 0.0, 0.2, 1],
                  opacity: { duration: 0.15 }
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className='border-divider/50 dark:border-default-700 from-background/95 to-background/90 dark:from-content1/95 dark:to-content1/90 ring-primary/5 dark:ring-primary/10 relative rounded-xl border bg-gradient-to-br shadow-xl ring-1 backdrop-blur-xl'
                >
                  {/* Background gradient */}
                  <div className='from-primary/8 via-secondary/4 to-success/6 absolute inset-0 rounded-xl bg-gradient-to-br opacity-40' />

                  <div className='relative p-6'>
                    {/* Header */}
                    <div className='mb-6 flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <motion.div
                          className='from-primary/15 to-primary/10 ring-primary/30 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm ring-1'
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Icon icon='solar:filter-linear' className='text-primary h-5 w-5' />
                        </motion.div>
                        <div>
                          <h3 className='text-foreground text-lg font-semibold'>
                            {t('filters.title')}
                          </h3>
                          <p className='text-default-600 text-sm'>{t('filters.description')}</p>
                        </div>
                      </div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          isIconOnly
                          size='sm'
                          variant='light'
                          onClick={handleToggleFilters}
                          className='hover:bg-danger/10 hover:text-danger-600 rounded-full transition-all duration-200'
                        >
                          <Icon icon='solar:close-linear' className='h-4 w-4' />
                        </Button>
                      </motion.div>
                    </div>

                    {/* Coming Soon Message */}
                    <div className='flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-default-300 dark:border-default-600 bg-default-50 dark:bg-default-900/20 p-8 text-center'>
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20'
                      >
                        <Icon icon='solar:settings-minimalistic-linear' className='text-primary h-8 w-8' />
                      </motion.div>
                      <h4 className='mb-2 text-lg font-semibold text-foreground'>{t('filters.comingSoon')}</h4>
                      <p className='text-sm text-default-600 max-w-md'>
                        {t('filters.comingSoonDescription')}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className='border-divider/50 dark:border-default-700 flex items-center justify-end border-t pt-4 mt-6'>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant='bordered'
                          onClick={handleToggleFilters}
                          className='hover:bg-default/50 transition-all duration-200 hover:shadow-sm'
                        >
                          {t('filters.close')}
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className='space-y-4'>{documentList()}</div>
        </div>
      </div>

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />
    </DashboardLayout>
  );
}
