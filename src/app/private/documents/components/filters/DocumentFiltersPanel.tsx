'use client';

import React from 'react';

import type { ReactNode } from 'react';
import type { DocumentFilters } from '../../types';

import { Button, Chip, Divider, Select, SelectItem } from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { DOCUMENT_STATUSES, DOCUMENT_TYPES } from '../../constants';

interface DocumentFiltersPanelProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: DocumentFilters;
  onFiltersChange: (filters: DocumentFilters) => void;
  activeTab: string;
  onSearch: () => void;
  showFiltersPanel: boolean;
  onToggleFiltersPanel: () => void;
  children?: ReactNode;
}

const DocumentFiltersPanel: React.FC<DocumentFiltersPanelProps> = ({
  searchQuery,
  filters,
  onFiltersChange,
  showFiltersPanel,
  onToggleFiltersPanel,
  children
}) => {
  const t = useTranslations('documents');

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const activeFiltersCount = Object.values(filters).filter(
    (value) =>
      value !== undefined &&
      value !== null &&
      (Array.isArray(value) ? value.length > 0 : value !== '')
  ).length;

  const removeFilter = (key: keyof DocumentFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
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
            transition={{ duration: 0.3 }}
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

            {/* Active Filter Chips */}
            <div className='mt-3 flex flex-wrap gap-2'>
              {filters.type && (
                <Chip size='sm' color='primary' variant='flat' onClose={() => removeFilter('type')}>
                  Type: {filters.type}
                </Chip>
              )}
              {filters.status && (
                <Chip
                  size='sm'
                  color='secondary'
                  variant='flat'
                  onClose={() => removeFilter('status')}
                >
                  Status: {filters.status}
                </Chip>
              )}
              {filters.tags && filters.tags.length > 0 && (
                <Chip size='sm' color='success' variant='flat' onClose={() => removeFilter('tags')}>
                  Tags: {filters.tags.length}
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
              ease: [0.4, 0.0, 0.2, 1],
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

                {/* Filter Controls */}
                <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                  {/* Document Type Filter */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className='space-y-2'
                  >
                    <label className='text-foreground text-sm font-medium'>Document Type</label>
                    <Select
                      placeholder='Select type'
                      selectedKeys={filters.type ? [filters.type] : []}
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0];
                        onFiltersChange({
                          ...filters,
                          type: selectedKey ? (selectedKey as string) : undefined
                        });
                      }}
                      variant='bordered'
                      classNames={{
                        trigger:
                          'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary',
                        value: 'text-foreground',
                        popoverContent: 'rounded-xl'
                      }}
                      startContent={
                        <Icon icon='solar:document-linear' className='text-default-400 h-4 w-4' />
                      }
                    >
                      {DOCUMENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </Select>
                  </motion.div>

                  {/* Document Status Filter */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className='space-y-2'
                  >
                    <label className='text-foreground text-sm font-medium'>Status</label>
                    <Select
                      placeholder='Select status'
                      selectedKeys={filters.status ? [filters.status] : []}
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0];
                        onFiltersChange({
                          ...filters,
                          status: selectedKey ? (selectedKey as string) : undefined
                        });
                      }}
                      variant='bordered'
                      classNames={{
                        trigger:
                          'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary',
                        value: 'text-foreground',
                        popoverContent: 'rounded-xl'
                      }}
                      startContent={
                        <Icon icon='solar:flag-linear' className='text-default-400 h-4 w-4' />
                      }
                    >
                      {DOCUMENT_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </Select>
                  </motion.div>

                  {/* Additional filters can be added here */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className='border-default-300 bg-default-50 dark:border-default-600 dark:bg-default-900/20 flex items-center justify-center rounded-xl border-2 border-dashed p-4'
                  >
                    <div className='text-center'>
                      <Icon
                        icon='solar:add-circle-linear'
                        className='text-default-400 mx-auto mb-2 h-8 w-8'
                      />
                      <p className='text-default-500 text-xs'>More filters coming soon</p>
                    </div>
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <div className='border-divider/50 dark:border-default-700 mt-6 flex items-center justify-between border-t pt-4'>
                  <Button
                    variant='ghost'
                    color='danger'
                    size='sm'
                    onPress={clearAllFilters}
                    startContent={<Icon icon='solar:refresh-linear' className='h-4 w-4' />}
                    isDisabled={activeFiltersCount === 0}
                  >
                    Reset Filters
                  </Button>

                  <div className='flex gap-2'>
                    <Button variant='bordered' size='sm' onPress={onToggleFiltersPanel}>
                      Close
                    </Button>
                    <Button
                      color='primary'
                      size='sm'
                      startContent={<Icon icon='solar:magnifer-linear' className='h-4 w-4' />}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
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
