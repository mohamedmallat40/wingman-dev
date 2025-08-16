'use client';

import React, { useMemo } from 'react';

import type { ReactNode } from 'react';
import type { DocumentFilters, IDocument } from '../../types';

import { Button, Chip, Input, Select, SelectItem } from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface DocumentFiltersPanelProperties {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: DocumentFilters;
  onFiltersChange: (filters: DocumentFilters) => void;
  activeTab: string;
  onSearch: () => void;
  showFiltersPanel: boolean;
  onToggleFiltersPanel: () => void;
  children?: ReactNode;
  documents?: IDocument[];
}

const DocumentFiltersPanel: React.FC<DocumentFiltersPanelProperties> = ({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  onSearch,
  showFiltersPanel,
  onToggleFiltersPanel,
  children,
  documents = []
}) => {
  const t = useTranslations('documents');

  // Extract unique tags from all documents
  const uniqueTags = useMemo(() => {
    const tagsMap = new Map<string, { id: string; name: string }>();

    for (const document_ of documents) {
      if (Array.isArray(document_.tags)) {
        for (const tag of document_.tags) {
          if (tag.id && !tagsMap.has(tag.id)) {
            tagsMap.set(tag.id, { id: tag.id, name: tag.name });
          }
        }
      }
    }

    return [...tagsMap.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [documents]);

  const clearAllFilters = () => {
    onFiltersChange({});
    onSearchChange('');
  };

  const activeFiltersCount =
    Object.values(filters).filter(
      (value) =>
        value !== undefined &&
        value !== null &&
        (Array.isArray(value) ? value.length > 0 : value !== '')
    ).length + (searchQuery ? 1 : 0);

  const removeFilter = (key: keyof DocumentFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  // Remove specific tag from tags filter
  const removeTagFromFilter = (tagIdToRemove: string) => {
    if (filters.tags) {
      const updatedTags = filters.tags.filter(tagId => tagId !== tagIdToRemove);
      onFiltersChange({
        ...filters,
        tags: updatedTags.length > 0 ? updatedTags : undefined
      });
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className='space-y-6'>
      {/* Active Filters Summary */}
      <AnimatePresence>
        {activeFiltersCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.1 }}
            className='border-primary/20 bg-primary-50/50 dark:bg-primary-900/20 rounded-xl border p-4'
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full'>
                  <Icon icon='solar:filter-linear' className='text-primary h-4 w-4' />
                </div>
                <div>
                  <p className='text-foreground text-sm font-medium'>
                    {activeFiltersCount} {activeFiltersCount === 1 ? 'filter' : 'filters'} active
                  </p>
                </div>
              </div>
              <Button
                size='sm'
                variant='ghost'
                color='danger'
                onPress={clearAllFilters}
                startContent={
                  <Icon icon='solar:trash-bin-minimalistic-linear' className='h-4 w-4' />
                }
              >
                Clear all
              </Button>
            </div>

            <div className='mt-3 flex flex-wrap gap-2'>
              {searchQuery && (
                <Chip
                  size='sm'
                  color='warning'
                  variant='flat'
                  onClose={() => {
                    onSearchChange('');
                  }}
                >
                  Search: &quot;{searchQuery}&quot;
                </Chip>
              )}
              {filters.tags && filters.tags.length > 0 && (
                <Chip
                  size='sm'
                  color='primary'
                  variant='flat'
                  onClose={() => {
                    removeFilter('tags');
                  }}
                >
                  Tags:{' '}
                  {filters.tags
                    .map((tagId) => uniqueTags.find((t) => t.id === tagId)?.name)
                    .filter(Boolean)
                    .join(', ')}
                </Chip>
              )}
              {filters.status && (
                <Chip
                  size='sm'
                  color='secondary'
                  variant='flat'
                  onClose={() => {
                    removeFilter('status');
                  }}
                >
                  Status: {filters.status}
                </Chip>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFiltersPanel && (
          <motion.div
            layoutId='filter-panel'
            className='space-y-6 overflow-hidden'
            initial={{ opacity: 0, scaleY: 0, transformOrigin: 'top' }}
            animate={{ opacity: 1, scaleY: 1, transformOrigin: 'top' }}
            exit={{ opacity: 0, scaleY: 0, transformOrigin: 'top' }}
            transition={{
              duration: 0.25,
              ease: [0.4, 0, 0.2, 1],
              opacity: { duration: 0.15 }
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className='border-divider/50 from-background/95 to-background/90 ring-primary/5 dark:border-default-700 dark:from-content1/95 dark:to-content1/90 dark:ring-primary/10 relative rounded-xl border bg-gradient-to-br shadow-xl ring-1 backdrop-blur-xl'
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
                      onPress={onToggleFiltersPanel}
                      className='hover:bg-danger/10 hover:text-danger-600 rounded-full transition-all duration-200'
                    >
                      <Icon icon='solar:close-linear' className='h-4 w-4' />
                    </Button>
                  </motion.div>
                </div>

                {/* Search Bar */}
                <div
                  
                  className='mb-6'
                >
                  <label className='text-foreground mb-2 block text-sm font-medium'>
                    Search Documents
                  </label>
                  <Input
                    placeholder='Search by document name...'
                    startContent={
                      <Icon icon='solar:magnifer-linear' className='text-default-400 h-4 w-4' />
                    }
                    endContent={
                      searchQuery && (
                        <Button
                          isIconOnly
                          size='sm'
                          variant='light'
                          onPress={() => {
                            onSearchChange('');
                          }}
                          className='min-w-unit-6 w-unit-6 h-unit-6'
                        >
                          <Icon icon='solar:close-circle-bold' className='h-4 w-4' />
                        </Button>
                      )
                    }
                    value={searchQuery}
                    onValueChange={onSearchChange}
                    onKeyDown={handleSearchKeyPress}
                    variant='bordered'
                    classNames={{
                      inputWrapper:
                        'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary',
                      input: 'text-foreground'
                    }}
                  />
                </div>

                {/* Tags Filter */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className='space-y-2'
                >
                  <label className='text-foreground text-sm font-medium'>Tags</label>
                  <Select
                    placeholder='Select tags'
                    selectedKeys={filters.tags ? new Set(filters.tags) : new Set()}
                    onSelectionChange={(keys) => {
                      const selectedKeys = Array.from(keys) as string[];
                      onFiltersChange({
                        ...filters,
                        tags: selectedKeys.length > 0 ? selectedKeys : undefined
                      });
                    }}
                    variant='bordered'
                    selectionMode='multiple'
                    classNames={{
                      trigger:
                        'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary',
                      value: 'text-foreground',
                      popoverContent: 'rounded-xl'
                    }}
                    startContent={
                      <Icon icon='solar:tag-linear' className='text-default-400 h-4 w-4' />
                    }
                    renderValue={(items) => {
                      if (items.length === 0) return null;
                      
                      return (
                        <div className='flex flex-wrap gap-1'>
                          {Array.from(items).map((item) => {
                            const tagName = uniqueTags.find(tag => tag.id === item.key)?.name || item.textValue || item.key;
                            return (
                              <Chip 
                                key={item.key} 
                                size='sm' 
                                variant='flat'
                                onClose={() => removeTagFromFilter(item.key as string)}
                              >
                                {tagName}
                              </Chip>
                            );
                          })}
                        </div>
                      );
                    }}
                  >
                    {uniqueTags.map((tag) => (
                      <SelectItem key={tag.id} textValue={tag.name}>
                        {tag.name}
                      </SelectItem>
                    ))}
                  </Select>
                  {uniqueTags.length === 0 && (
                    <p className='text-default-400 text-xs'>No tags available</p>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      {children}
    </div>
  );
};

export default DocumentFiltersPanel;
