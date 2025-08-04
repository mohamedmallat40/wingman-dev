'use client';

import React from 'react';

import { Button, Select, SelectItem } from '@heroui/react';
import { Icon } from '@iconify/react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots.filter((page, index, array) => array.indexOf(page) === index);
  };

  if (totalPages <= 1) return null;

  return (
    <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
      {/* Items per page selector */}
      <div className='flex items-center gap-2 text-sm'>
        <span className='text-default-600'>Show</span>
        <Select
          selectedKeys={[itemsPerPage.toString()]}
          onSelectionChange={(keys) => {
            const value = Number([...keys][0]);
            onItemsPerPageChange(value);
          }}
          className='w-20'
          size='sm'
          variant='bordered'
        >
          <SelectItem key='6'>6</SelectItem>
          <SelectItem key='12'>12</SelectItem>
          <SelectItem key='24'>24</SelectItem>
          <SelectItem key='48'>48</SelectItem>
        </Select>
        <span className='text-default-600'>per page</span>
      </div>

      {/* Page info */}
      <div className='text-default-600 text-sm'>
        Showing <span className='text-foreground font-semibold'>{startItem}</span> to{' '}
        <span className='text-foreground font-semibold'>{endItem}</span> of{' '}
        <span className='text-foreground font-semibold'>{totalItems}</span> results
      </div>

      {/* Pagination controls */}
      <div className='flex items-center gap-1'>
        {/* Previous button */}
        <Button
          isIconOnly
          variant='light'
          size='sm'
          isDisabled={currentPage === 1}
          onPress={() => onPageChange(currentPage - 1)}
          className='text-default-500 hover:text-foreground'
        >
          <Icon icon='lucide:chevron-left' />
        </Button>

        {/* Page numbers */}
        <div className='flex items-center gap-1'>
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className='text-default-400 px-2 py-1'>...</span>
              ) : (
                <Button
                  size='sm'
                  variant={currentPage === page ? 'solid' : 'light'}
                  color={currentPage === page ? 'primary' : 'default'}
                  onPress={() => onPageChange(page as number)}
                  className={`h-8 min-w-8 ${
                    currentPage === page
                      ? 'text-primary-foreground'
                      : 'text-default-600 hover:text-foreground'
                  }`}
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next button */}
        <Button
          isIconOnly
          variant='light'
          size='sm'
          isDisabled={currentPage === totalPages}
          onPress={() => onPageChange(currentPage + 1)}
          className='text-default-500 hover:text-foreground'
        >
          <Icon icon='lucide:chevron-right' />
        </Button>
      </div>
    </div>
  );
};
