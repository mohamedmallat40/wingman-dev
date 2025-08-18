'use client';

import React, { useState } from 'react';

import { Autocomplete, AutocompleteItem, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';

export interface Tag {
  key: string;
  label: string;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default';
}

export interface TagSelectorProps {
  availableTags: Tag[];
  selectedTags: string[];
  onTagSelect: (tagKey: string) => void;
  onTagRemove: (tagKey: string) => void;
  placeholder?: string;
  className?: string;
  showSelectedTags?: boolean;
  maxSelectedTags?: number;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  availableTags,
  selectedTags,
  onTagSelect,
  onTagRemove,
  placeholder = 'Search and select tags...',
  className = '',
  showSelectedTags = true,
  maxSelectedTags
}) => {
  const [searchValue, setSearchValue] = useState('');

  // Filter available tags based on search and exclude already selected
  const filteredTags = availableTags.filter(
    (tag) =>
      !selectedTags.includes(tag.key) &&
      tag.label.toLowerCase().includes(searchValue.toLowerCase()) &&
      (!maxSelectedTags || selectedTags.length < maxSelectedTags)
  );

  const handleTagSelect = (tagKey: string) => {
    if (
      !selectedTags.includes(tagKey) &&
      (!maxSelectedTags || selectedTags.length < maxSelectedTags)
    ) {
      onTagSelect(tagKey);
      setSearchValue('');
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Selected Tags */}
      {showSelectedTags && (
        <AnimatePresence>
          {selectedTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='mb-3 flex flex-wrap gap-2'
            >
              {selectedTags.map((tagKey) => {
                const tag = availableTags.find((t) => t.key === tagKey);
                if (!tag) return null;

                return (
                  <motion.div
                    key={tagKey}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Chip
                      color={tag.color}
                      variant='flat'
                      onClose={() => onTagRemove(tagKey)}
                      className='transition-transform hover:scale-105'
                    >
                      {tag.label}
                    </Chip>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Tag Search */}
      <Autocomplete
        inputValue={searchValue}
        onInputChange={setSearchValue}
        placeholder={placeholder}
        variant='bordered'
        isDisabled={maxSelectedTags ? selectedTags.length >= maxSelectedTags : false}
        classNames={{
          base: 'w-full border-default-300/60 data-[hover=true]:border-primary/60 data-[hover=true]:bg-primary/5 group-data-[focus=true]:border-primary group-data-[focus=true]:bg-primary/5 group-data-[focus=true]:shadow-lg group-data-[focus=true]:shadow-primary/10 rounded-2xl h-14 bg-default-100/50 dark:bg-default-50/50 backdrop-blur-sm transition-all duration-300',
          listbox: 'max-h-[200px]',
          popoverContent:
            'rounded-2xl shadow-2xl ring-1 ring-white/10 dark:ring-white/5 border border-default-200/50 dark:border-default-700/50 backdrop-blur-xl'
        }}
        startContent={
          <Icon icon='solar:hashtag-linear' className='text-default-400 h-5 w-5 flex-shrink-0' />
        }
        onSelectionChange={(key) => {
          if (key) {
            handleTagSelect(key as string);
          }
        }}
      >
        {filteredTags.map((tag) => (
          <AutocompleteItem
            key={tag.key}
            startContent={
              <div
                className={`h-3 w-3 rounded-full`}
                style={{
                  backgroundColor:
                    tag.color === 'primary'
                      ? '#006FEE'
                      : tag.color === 'secondary'
                        ? '#9353D3'
                        : tag.color === 'success'
                          ? '#17C964'
                          : tag.color === 'warning'
                            ? '#F5A524'
                            : tag.color === 'danger'
                              ? '#F31260'
                              : '#71717A'
                }}
              />
            }
          >
            {tag.label}
          </AutocompleteItem>
        ))}
      </Autocomplete>

      {/* Max tags reached indicator */}
      {maxSelectedTags && selectedTags.length >= maxSelectedTags && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-warning mt-2 flex items-center gap-1 text-xs'
        >
          <Icon icon='solar:info-circle-linear' className='h-3 w-3' />
          Maximum {maxSelectedTags} tags selected
        </motion.p>
      )}
    </div>
  );
};

export default TagSelector;
