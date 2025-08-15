'use client';

import React, { useState } from 'react';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Chip,
  DatePicker,
  Divider,
  Input,
  Select,
  SelectItem
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import { parseDate, CalendarDate } from '@internationalized/date';

import { useTopics } from '../../hooks';
import { useActiveFiltersCount, useBroadcastStore } from '../../store/useBroadcastStore';
import { type BroadcastPost } from '../../types';

// Helper functions for date conversion
const dateToCalendarDate = (date: Date | null | undefined): CalendarDate | null => {
  if (!date) return null;
  return parseDate(date.toISOString().split('T')[0]);
};

const calendarDateToDate = (calendarDate: CalendarDate | null): Date | null => {
  if (!calendarDate) return null;
  return new Date(calendarDate.year, calendarDate.month - 1, calendarDate.day);
};

interface BroadcastFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const BroadcastFilters: React.FC<BroadcastFiltersProps> = ({ isOpen, onClose, className = '' }) => {
  const t = useTranslations('broadcasts');
  const {
    filters,
    setCategory,
    setTopic,
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


  // Post types removed as they don't exist in the new API structure

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
          variant='light' 
          size='sm' 
          onPress={onClose}
          startContent={<Icon icon='solar:arrow-left-linear' className='h-4 w-4' />}
          className='text-foreground-600 hover:text-primary'
        >
          Topics
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
            <Button color='primary' variant='flat' onPress={handleSearchSubmit} isIconOnly>
              <Icon icon='solar:arrow-right-linear' className='h-4 w-4' />
            </Button>
          </div>
        </div>


        <Divider />

        {/* Content Types */}
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Content Types</label>
          <CheckboxGroup
            value={[]}
            onValueChange={() => {}}
            orientation='vertical'
            classNames={{
              wrapper: 'gap-2'
            }}
          >
            <Checkbox value='with-media'>
              <div className='flex items-center gap-2'>
                <Icon icon='solar:gallery-linear' className='h-4 w-4' />
                <span className='text-sm'>Posts with Media</span>
              </div>
            </Checkbox>
            <Checkbox value='text-only'>
              <div className='flex items-center gap-2'>
                <Icon icon='solar:document-text-linear' className='h-4 w-4' />
                <span className='text-sm'>Text Only</span>
              </div>
            </Checkbox>
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
              <SelectItem key={category}>{category}</SelectItem>
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
            isLoading={!topics}
          >
            {topics?.map((topic: any) => (
              <SelectItem
                key={topic.id}
                startContent={<Icon icon={topic.icon} className='h-4 w-4' />}
              >
                {topic.title || topic.name}
              </SelectItem>
            )) || []}
          </Select>
        </div>

        <Divider />

        {/* Date Range */}
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Date Range</label>
          <div className='grid grid-cols-2 gap-2'>
            <DatePicker
              label='From'
              value={dateToCalendarDate(filters.dateRange?.from || null)}
              onChange={(date) =>
                setDateRange({
                  from: calendarDateToDate(date),
                  to: filters.dateRange?.to || null
                })
              }
            />
            <DatePicker
              label='To'
              value={dateToCalendarDate(filters.dateRange?.to || null)}
              onChange={(date) =>
                setDateRange({
                  from: filters.dateRange?.from || null,
                  to: calendarDateToDate(date)
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
            startContent={<Icon icon='solar:satellite-linear' className='h-4 w-4' />}
          >
            Back to Topics
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default BroadcastFilters;
