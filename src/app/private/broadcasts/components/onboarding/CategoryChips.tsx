'use client';

import React from 'react';

import { Button } from '@heroui/react';
import { useTranslations } from 'next-intl';

import type { CategoryChipsProps } from '../../types';

export function CategoryChips({ 
  categories, 
  active = 'All', 
  onChange = () => {}, 
  className 
}: CategoryChipsProps) {
  const t = useTranslations('broadcasts.categories');
  
  const getCategoryLabel = (category: string) => {
    const key = category.toLowerCase().replace(/\s+/g, '');
    return t(key, { default: category });
  };

  return (
    <div
      role='navigation'
      aria-label='Filter by category'
      className={`flex items-center gap-2 overflow-x-auto ${className || ''}`}
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitScrollbar: { display: 'none' }
      }}
    >
      {categories.map((category) => {
        const isActive = category === active;
        return (
          <Button
            key={category}
            variant={isActive ? 'solid' : 'bordered'}
            color={isActive ? 'secondary' : 'default'}
            size='sm'
            className='flex-shrink-0 transition-all duration-200'
            onPress={() => onChange(category)}
            aria-pressed={isActive}
            aria-label={`Filter by ${getCategoryLabel(category)}`}
          >
            {getCategoryLabel(category)}
          </Button>
        );
      })}
    </div>
  );
}