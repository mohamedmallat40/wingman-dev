'use client';

import React, { useState } from 'react';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Chip,
  Divider,
  DatePicker,
  Checkbox,
  CheckboxGroup
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

import { type BroadcastPost } from '../../types';
import { useBroadcastStore, useActiveFiltersCount } from '../../store/useBroadcastStore';
import { useTopics } from '../../hooks';

interface BroadcastFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const BroadcastFilters: React.FC<BroadcastFiltersProps> = ({
  isOpen,
  onClose,
  className = ''
}) => {
  const t = useTranslations('broadcasts');
  const {
    filters,
    setCategory,
    setTopic,
    setSortBy,
    setSearchQuery,
    setDateRange,
    setPostTypes,
    clearFilters
  } = useBroadcastStore();
  
  const { data: topics } = useTopics();
  const activeFiltersCount = useActiveFiltersCount();
  
  const [localSearchQuery, setLocalSearchQuery] = useState(filters.searchQuery);

  const categories = [
    'Technology',
    'Design',
    'Business',
    'Marketing',
    'Development',
    'AI & ML',
    'Startup',
    'Career',
    'Remote Work',
    'Productivity'
  ];

  const sortOptions = [
    { key: 'newest', label: 'Newest First', icon: 'solar:sort-horizontal-linear' },
    { key: 'trending', label: 'Trending', icon: 'solar:fire-linear' },
    { key: 'popular', label: 'Most Popular', icon: 'solar:heart-linear' }
  ];

  const postTypes: { key: BroadcastPost['type']; label: string; icon: string }[] = [
    { key: 'article', label: 'Articles', icon: 'solar:document-text-linear' },
    { key: 'video', label: 'Videos', icon: 'solar:videocamera-linear' },
    { key: 'image', label: 'Images', icon: 'solar:camera-linear' },
    { key: 'poll', label: 'Polls', icon: 'solar:chart-2-linear' },
    { key: 'quote', label: 'Quotes', icon: 'solar:quote-up-linear' },
    { key: 'link', label: 'Links', icon: 'solar:link-linear' }
  ];

  const handleSearchSubmit = () => {
    setSearchQuery(localSearchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleClearFilters = () => {
    clearFilters();
    setLocalSearchQuery('');
  };

  if (!isOpen) return null;

  return (
    <Card className={`w-80 ${className}`}>
      <CardHeader className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Icon icon='solar:filter-linear' className='h-5 w-5' />
          <h3 className='text-lg font-semibold'>Filters</h3>
          {activeFiltersCount > 0 && (
            <Chip size='sm' color='primary' variant='flat'>
              {activeFiltersCount}
            </Chip>
          )}
        </div>
        <Button
          isIconOnly
          variant='light'
          size='sm'
          onPress={onClose}
        >
          <Icon icon='solar:close-linear' className='h-4 w-4' />
        </Button>
      </CardHeader>

      <CardBody className='space-y-6'>
        {/* Search */}
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Search</label>
          <div className='flex gap-2'>
            <Input
              placeholder='Search posts...'
              value={localSearchQuery}
              onValueChange={setLocalSearchQuery}
              onKeyDown={handleKeyPress}
              startContent={<Icon icon='solar:magnifer-linear' className='h-4 w-4' />}
            />
            <Button
              color='primary'
              variant='flat'
              onPress={handleSearchSubmit}
              isIconOnly
            >
              <Icon icon='solar:arrow-right-linear' className='h-4 w-4' />
            </Button>
          </div>
        </div>

        <Divider />

        {/* Sort By */}
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Sort By</label>
          <Select
            selectedKeys={[filters.sortBy]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as typeof filters.sortBy;
              setSortBy(selected);
            }}
            placeholder='Select sort order'
          >
            {sortOptions.map((option) => (
              <SelectItem
                key={option.key}
                startContent={<Icon icon={option.icon} className='h-4 w-4' />}
              >
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        <Divider />

        {/* Post Types */}
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Post Types</label>
          <CheckboxGroup
            value={filters.postTypes}
            onValueChange={(types) => setPostTypes(types as BroadcastPost['type'][])}
            orientation='vertical'
            classNames={{
              wrapper: 'gap-2'
            }}
          >
            {postTypes.map((type) => (
              <Checkbox key={type.key} value={type.key}>
                <div className='flex items-center gap-2'>
                  <Icon icon={type.icon} className='h-4 w-4' />
                  <span className='text-sm'>{type.label}</span>
                </div>
              </Checkbox>
            ))}
          </CheckboxGroup>
        </div>

        <Divider />

        {/* Category */}
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Category</label>
          <Select
            selectedKeys={filters.category ? [filters.category] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              setCategory(selected || null);
            }}
            placeholder='Select category'
          >
            {categories.map((category) => (
              <SelectItem key={category}>
                {category}
              </SelectItem>
            ))}
          </Select>
        </div>

        <Divider />

        {/* Topic */}
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Topic</label>
          <Select
            selectedKeys={filters.topicId ? [filters.topicId] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              setTopic(selected || null);
            }}
            placeholder='Select topic'
            isLoading={!topics || (!Array.isArray(topics) && !topics?.data)}
          >
            {((Array.isArray(topics) ? topics : topics?.data)?.map((topic: any) => (
              <SelectItem
                key={topic.id}
                startContent={<Icon icon={topic.icon} className='h-4 w-4' />}
              >
                {topic.title || topic.name}
              </SelectItem>
            )) || [])}
          </Select>
        </div>

        <Divider />

        {/* Date Range */}
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Date Range</label>
          <div className='grid grid-cols-2 gap-2'>
            <DatePicker
              label='From'
              value={filters.dateRange?.from}
              onChange={(date) => 
                setDateRange({
                  from: date,
                  to: filters.dateRange?.to || null
                })
              }
            />
            <DatePicker
              label='To'
              value={filters.dateRange?.to}
              onChange={(date) => 
                setDateRange({
                  from: filters.dateRange?.from || null,
                  to: date
                })
              }
            />
          </div>
        </div>

        <Divider />

        {/* Actions */}
        <div className='flex gap-2'>
          <Button
            variant='flat'
            color='danger'
            onPress={handleClearFilters}
            isDisabled={activeFiltersCount === 0}
            fullWidth
          >
            Clear All
          </Button>
          <Button
            color='primary'
            onPress={onClose}
            fullWidth
          >
            Apply
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default BroadcastFilters;