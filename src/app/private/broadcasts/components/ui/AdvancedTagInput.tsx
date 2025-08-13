'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

import {
  Input,
  Button,
  Chip,
  Card,
  CardBody,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

interface TagSuggestion {
  id: string;
  name: string;
  count?: number;
  category?: string;
  trending?: boolean;
}

interface AdvancedTagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
  placeholder?: string;
  label?: string;
  description?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  suggestions?: TagSuggestion[];
  onSearchSuggestions?: (query: string) => Promise<TagSuggestion[]>;
  allowCustomTags?: boolean;
  showPopularTags?: boolean;
  className?: string;
}

const popularTags: TagSuggestion[] = [
  { id: '1', name: 'javascript', count: 1245, trending: true },
  { id: '2', name: 'react', count: 987, trending: true },
  { id: '3', name: 'nextjs', count: 654, trending: false },
  { id: '4', name: 'typescript', count: 543, trending: true },
  { id: '5', name: 'css', count: 432, trending: false },
  { id: '6', name: 'design', count: 321, trending: false },
  { id: '7', name: 'ui-ux', count: 298, trending: false },
  { id: '8', name: 'frontend', count: 276, trending: false },
  { id: '9', name: 'backend', count: 234, trending: false },
  { id: '10', name: 'fullstack', count: 198, trending: false }
];

const categoryTags: Record<string, TagSuggestion[]> = {
  development: [
    { id: 'dev1', name: 'javascript', category: 'development' },
    { id: 'dev2', name: 'python', category: 'development' },
    { id: 'dev3', name: 'react', category: 'development' },
    { id: 'dev4', name: 'vue', category: 'development' },
    { id: 'dev5', name: 'angular', category: 'development' }
  ],
  design: [
    { id: 'des1', name: 'ui-design', category: 'design' },
    { id: 'des2', name: 'ux-design', category: 'design' },
    { id: 'des3', name: 'figma', category: 'design' },
    { id: 'des4', name: 'adobe', category: 'design' },
    { id: 'des5', name: 'branding', category: 'design' }
  ],
  business: [
    { id: 'bus1', name: 'startup', category: 'business' },
    { id: 'bus2', name: 'entrepreneurship', category: 'business' },
    { id: 'bus3', name: 'marketing', category: 'business' },
    { id: 'bus4', name: 'sales', category: 'business' },
    { id: 'bus5', name: 'strategy', category: 'business' }
  ]
};

const AdvancedTagInput: React.FC<AdvancedTagInputProps> = ({
  tags,
  onTagsChange,
  maxTags = 10,
  placeholder = 'Add tags...',
  label = 'Tags',
  description,
  isInvalid = false,
  errorMessage,
  suggestions,
  onSearchSuggestions,
  allowCustomTags = true,
  showPopularTags = true,
  className = ''
}) => {
  const t = useTranslations('broadcasts.create.fields.tags');
  const tValidation = useTranslations('broadcasts.validation');
  
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState<TagSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Search for tag suggestions
  const searchTags = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      if (onSearchSuggestions) {
        const results = await onSearchSuggestions(query);
        setSearchResults(results);
      } else {
        // Default local search
        const filteredPopular = popularTags.filter(tag =>
          tag.name.toLowerCase().includes(query.toLowerCase()) &&
          !tags.includes(tag.name)
        );
        setSearchResults(filteredPopular);
      }
    } catch (error) {
      console.error('Failed to search tags:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [onSearchSuggestions, tags]);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchTags(inputValue);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [inputValue, searchTags]);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    setShowSuggestions(value.length > 0);
  }, []);

  const addTag = useCallback((tagName: string) => {
    const trimmedTag = tagName.trim().toLowerCase();
    
    if (!trimmedTag) return;
    
    if (tags.includes(trimmedTag)) {
      // Show error or toast
      return;
    }
    
    if (tags.length >= maxTags) {
      // Show error or toast
      return;
    }

    onTagsChange([...tags, trimmedTag]);
    setInputValue('');
    setShowSuggestions(false);
    setSearchResults([]);
  }, [tags, onTagsChange, maxTags]);

  const removeTag = useCallback((tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  }, [tags, onTagsChange]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && allowCustomTags) {
        addTag(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  }, [inputValue, tags, addTag, removeTag, allowCustomTags]);

  const getCategoryTags = useCallback((category: string) => {
    if (category === 'all') {
      return popularTags.filter(tag => !tags.includes(tag.name));
    }
    return categoryTags[category]?.filter(tag => !tags.includes(tag.name)) || [];
  }, [tags]);

  const getTagsByCategory = useCallback(() => {
    const categories = ['all', 'development', 'design', 'business'];
    return categories.map(category => ({
      name: category,
      tags: getCategoryTags(category).slice(0, 5)
    }));
  }, [getCategoryTags]);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Tag Input */}
      <div className="relative">
        <Input
          ref={inputRef}
          label={label}
          placeholder={placeholder}
          value={inputValue}
          onValueChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={() => setShowSuggestions(inputValue.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          startContent={<Icon icon="solar:hashtag-linear" className="h-4 w-4" />}
          endContent={
            <div className="flex items-center gap-2">
              {isSearching && (
                <Icon icon="solar:refresh-linear" className="h-4 w-4 animate-spin" />
              )}
              <Button
                size="sm"
                color="primary"
                variant="flat"
                onPress={() => addTag(inputValue)}
                isDisabled={!inputValue.trim() || tags.length >= maxTags || !allowCustomTags}
              >
                {t('add')}
              </Button>
            </div>
          }
          description={description || t('description', { count: tags.length })}
          isInvalid={isInvalid}
          errorMessage={errorMessage}
        />

        {/* Search Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && (searchResults.length > 0 || inputValue.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 z-50 mt-1"
            >
              <Card>
                <CardBody className="p-2 max-h-60 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <div className="space-y-1">
                      {searchResults.map((suggestion) => (
                        <div
                          key={suggestion.id}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-default-100 cursor-pointer"
                          onClick={() => addTag(suggestion.name)}
                        >
                          <div className="flex items-center gap-2">
                            <Icon icon="solar:hashtag-linear" className="h-3 w-3 text-foreground-500" />
                            <span className="text-sm">{suggestion.name}</span>
                            {suggestion.trending && (
                              <Badge color="danger" size="sm">
                                Trending
                              </Badge>
                            )}
                          </div>
                          {suggestion.count && (
                            <span className="text-xs text-foreground-500">
                              {suggestion.count} posts
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : inputValue.length > 0 && allowCustomTags ? (
                    <div
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-default-100 cursor-pointer"
                      onClick={() => addTag(inputValue)}
                    >
                      <Icon icon="solar:add-circle-linear" className="h-4 w-4 text-primary" />
                      <span className="text-sm">Create "{inputValue}"</span>
                    </div>
                  ) : (
                    <div className="p-2 text-center text-foreground-500 text-sm">
                      No suggestions found
                    </div>
                  )}
                </CardBody>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Current Tags Display */}
      <AnimatePresence>
        {tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">{t('currentTags')}</h4>
              <span className="text-xs text-foreground-500">
                {tags.length}/{maxTags}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Chip
                    onClose={() => removeTag(tag)}
                    variant="flat"
                    color="primary"
                    startContent={<Icon icon="solar:hashtag-linear" className="h-3 w-3" />}
                  >
                    {tag}
                  </Chip>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popular Tags Suggestions */}
      {showPopularTags && tags.length < maxTags && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">{t('popularTags')}</h4>
            
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered" size="sm" className="capitalize">
                  {selectedCategory}
                  <Icon icon="solar:alt-arrow-down-linear" className="h-3 w-3 ml-1" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                selectedKeys={[selectedCategory]}
                selectionMode="single"
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setSelectedCategory(selected);
                }}
              >
                <DropdownItem key="all">All</DropdownItem>
                <DropdownItem key="development">Development</DropdownItem>
                <DropdownItem key="design">Design</DropdownItem>
                <DropdownItem key="business">Business</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {getCategoryTags(selectedCategory).slice(0, 10).map((tag) => (
              <Chip
                key={tag.id}
                variant="bordered"
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => addTag(tag.name)}
                startContent={<Icon icon="solar:hashtag-linear" className="h-3 w-3" />}
                endContent={
                  tag.trending ? (
                    <Icon icon="solar:fire-linear" className="h-3 w-3 text-danger" />
                  ) : undefined
                }
              >
                {tag.name}
                {tag.count && (
                  <span className="ml-1 text-xs opacity-60">
                    {tag.count}
                  </span>
                )}
              </Chip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedTagInput;
