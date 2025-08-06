'use client';

import React, { useState } from 'react';

import {
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Slider,
  Tooltip
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { type TalentPoolFilters, type TalentType } from '../types';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: TalentPoolFilters;
  onFiltersChange: (filters: TalentPoolFilters) => void;
  activeTab: TalentType;
  onSearch: () => void;
  showFiltersPanel?: boolean;
  children?: React.ReactNode;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  activeTab,
  onSearch,
  showFiltersPanel = false,
  children
}) => {
  const t = useTranslations();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(true);

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const handleClearSearch = () => {
    onSearchChange('');
    onFiltersChange({ ...filters, search: undefined });
  };

  const handleClearAllFilters = () => {
    onSearchChange('');
    onFiltersChange({});
    setShowAdvancedFilters(false);
  };

  const handleSkillChange = (skills: string[]) => {
    onFiltersChange({ ...filters, skills });
  };

  const handleRegionChange = (region: string) => {
    onFiltersChange({ ...filters, region: region || undefined });
  };

  const handleAvailabilityChange = (availability: string) => {
    onFiltersChange({ ...filters, availability: availability || undefined });
  };

  const handleRateRangeChange = (range: number[]) => {
    onFiltersChange({ 
      ...filters, 
      minRate: range[0], 
      maxRate: range[1] 
    });
  };

  const removeFilter = (filterKey: keyof TalentPoolFilters) => {
    const newFilters = { ...filters };
    delete newFilters[filterKey];
    onFiltersChange(newFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(key => {
      const value = filters[key as keyof TalentPoolFilters];
      return value !== undefined && value !== null && 
             (Array.isArray(value) ? value.length > 0 : true);
    }).length;
  };

  const regions = [
    { key: 'BE', label: 'Belgium 🇧🇪' },
    { key: 'NL', label: 'Netherlands 🇳🇱' },
    { key: 'FR', label: 'France 🇫🇷' },
    { key: 'DE', label: 'Germany 🇩🇪' },
    { key: 'UK', label: 'United Kingdom 🇬🇧' }
  ];

  const availabilityOptions = [
    { key: 'OPEN_FOR_PROJECT', label: t('talentPool.availability.availableForProjects') },
    { key: 'OPEN_FOR_PART_TIME', label: t('talentPool.availability.partTimeAvailable') },
    { key: 'BUSY', label: t('talentPool.availability.busy') }
  ];

  const quickFilters = [
    {
      key: 'available',
      label: t('talentPool.availability.available'),
      icon: 'solar:check-circle-linear',
      isActive: filters.availability === 'OPEN_FOR_PROJECT',
      onClick: () => handleAvailabilityChange(
        filters.availability === 'OPEN_FOR_PROJECT' ? '' : 'OPEN_FOR_PROJECT'
      )
    },
    {
      key: 'remote',
      label: t('talentPool.workType.remote'),
      icon: 'solar:home-wifi-linear',  
      isActive: filters.workType === 'REMOTE',
      onClick: () => onFiltersChange({ 
        ...filters, 
        workType: filters.workType === 'REMOTE' ? undefined : 'REMOTE' 
      })
    },
    {
      key: 'high-rated',
      label: 'Top Rated',
      icon: 'solar:star-linear',
      isActive: filters.minRating === 4.5,
      onClick: () => onFiltersChange({ 
        ...filters, 
        minRating: filters.minRating === 4.5 ? undefined : 4.5 
      })
    }
  ];

  return (
    <div className="space-y-6">
      {/* Active Filters - Always visible when filters exist */}
      <AnimatePresence>
        {Object.keys(filters).length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap items-center gap-2 p-4 bg-default-50/50 rounded-lg border border-default-200/50"
          >
            <span className="text-small text-default-600 font-medium">Active:</span>
            
            {filters.search && (
              <Chip
                size="sm"
                variant="flat"
                color="primary"
                onClose={() => removeFilter('search')}
                startContent={<Icon icon="solar:magnifer-linear" className="h-3 w-3" />}
              >
                "{filters.search}"
              </Chip>
            )}

            {filters.region && (
              <Chip
                size="sm"
                variant="flat"
                color="secondary"
                onClose={() => removeFilter('region')}
                startContent={<Icon icon="solar:map-point-linear" className="h-3 w-3" />}
              >
                {regions.find(r => r.key === filters.region)?.label || filters.region}
              </Chip>
            )}

            {filters.availability && (
              <Chip
                size="sm"
                variant="flat"
                color="success"
                onClose={() => removeFilter('availability')}
                startContent={<Icon icon="solar:check-circle-linear" className="h-3 w-3" />}
              >
                {availabilityOptions.find(a => a.key === filters.availability)?.label}
              </Chip>
            )}

            {filters.skills && filters.skills.length > 0 && (
              <Chip
                size="sm"
                variant="flat"
                color="warning"
                onClose={() => removeFilter('skills')}
                startContent={<Icon icon="solar:verified-check-linear" className="h-3 w-3" />}
              >
                {filters.skills.length} skills
              </Chip>
            )}

            {(filters.minRate || filters.maxRate) && (
              <Chip
                size="sm"
                variant="flat"
                color="danger"
                onClose={() => {
                  removeFilter('minRate');
                  removeFilter('maxRate');
                }}
                startContent={<Icon icon="solar:dollar-minimalistic-linear" className="h-3 w-3" />}
              >
                €{filters.minRate || 0} - €{filters.maxRate || 1000}
              </Chip>
            )}

            {(filters.workType || filters.minRating || filters.experienceLevel) && (
              <Chip
                size="sm"
                variant="flat"
                color="primary"
                onClose={() => {
                  removeFilter('workType');
                  removeFilter('minRating');
                  removeFilter('experienceLevel');
                }}
                startContent={<Icon icon="solar:settings-linear" className="h-3 w-3" />}
              >
                Other filters
              </Chip>
            )}

            <Button
              size="sm"
              variant="light"
              color="danger"
              startContent={<Icon icon="solar:trash-bin-minimalistic-linear" className="h-3 w-3" />}
              onClick={handleClearAllFilters}
              className="ml-2"
            >
              Clear All
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Controls Panel - Only show when panel is open */}
      <AnimatePresence>
        {showFiltersPanel && (
          <motion.div 
            layoutId="filter-panel"
            className="space-y-6 overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ 
              duration: 0.35,
              ease: [0.25, 0.46, 0.45, 0.94],
              opacity: { duration: 0.2 }
            }}
          >
          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {quickFilters.map((filter) => (
              <Tooltip key={filter.key} content={filter.label} placement="bottom">
                <Button
                  variant={filter.isActive ? "solid" : "bordered"}
                  color={filter.isActive ? "primary" : "default"}
                  size="sm"
                  startContent={<Icon icon={filter.icon} className="h-4 w-4" />}
                  onClick={filter.onClick}
                  className="transition-colors duration-150"
                >
                  <span className="hidden sm:inline">{filter.label}</span>
                </Button>
              </Tooltip>
            ))}
          </div>

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="border-divider/50 bg-background/95 relative rounded-lg border backdrop-blur-xl"
              >
                {/* Background gradient */}
                <div className="from-primary/5 to-secondary/5 absolute inset-0 rounded-lg bg-gradient-to-r via-transparent opacity-60" />
                
                <div className="relative p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 ring-primary/20 flex h-10 w-10 items-center justify-center rounded-xl ring-1">
                        <Icon icon="solar:filter-linear" className="text-primary h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-foreground text-lg font-semibold">Advanced Filters</h3>
                        <p className="text-default-600 text-sm">Refine your search criteria</p>
                      </div>
                    </div>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onClick={() => setShowAdvancedFilters(false)}
                      className="transition-all duration-200 hover:bg-default-100"
                    >
                      <Icon icon="solar:close-linear" className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Filter Grid */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
                    {/* Region Filter */}
                    <div className="space-y-3">
                      <label className="text-foreground flex items-center gap-2 text-sm font-medium">
                        <Icon icon="solar:map-point-linear" className="h-4 w-4 text-primary" />
                        Location
                      </label>
                      <Select
                        placeholder="Select region"
                        selectedKeys={filters.region ? [filters.region] : []}
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0] as string;
                          handleRegionChange(selectedKey);
                        }}
                        size="sm"
                        variant="bordered"
                      >
                        {regions.map((region) => (
                          <SelectItem key={region.key}>
                            {region.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>

                    {/* Availability Filter */}
                    <div className="space-y-3">
                      <label className="text-foreground flex items-center gap-2 text-sm font-medium">
                        <Icon icon="solar:check-circle-linear" className="h-4 w-4 text-primary" />
                        Availability
                      </label>
                      <Select
                        placeholder="Select availability"
                        selectedKeys={filters.availability ? [filters.availability] : []}
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0] as string;
                          handleAvailabilityChange(selectedKey);
                        }}
                        size="sm"
                        variant="bordered"
                      >
                        {availabilityOptions.map((option) => (
                          <SelectItem key={option.key}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>

                    {/* Rate Range Filter */}
                    <div className="space-y-3">
                      <label className="text-foreground flex items-center gap-2 text-sm font-medium">
                        <Icon icon="solar:dollar-minimalistic-linear" className="h-4 w-4 text-primary" />
                        Rate Range (€/day)
                      </label>
                      <div className="px-3 py-2">
                        <Slider
                          step={50}
                          minValue={0}
                          maxValue={1000}
                          value={[filters.minRate || 0, filters.maxRate || 1000]}
                          onChange={(value) => handleRateRangeChange(value as number[])}
                          className="max-w-md"
                          color="primary"
                          size="sm"
                          formatOptions={{
                            style: "currency",
                            currency: "EUR",
                            minimumFractionDigits: 0
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Experience Level for Freelancers */}
                  {activeTab === 'freelancers' && (
                    <div className="space-y-3 mb-6">
                      <label className="text-foreground flex items-center gap-2 text-sm font-medium">
                        <Icon icon="solar:medal-ribbons-star-linear" className="h-4 w-4 text-primary" />
                        Experience Level
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['Junior', 'Mid-level', 'Senior', 'Lead'].map((level) => (
                          <Chip
                            key={level}
                            variant={filters.experienceLevel === level ? "solid" : "bordered"}
                            color={filters.experienceLevel === level ? "primary" : "default"}
                            className="cursor-pointer transition-colors duration-150"
                            onClick={() => onFiltersChange({
                              ...filters,
                              experienceLevel: filters.experienceLevel === level ? undefined : level
                            })}
                          >
                            {level}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-divider/50">
                    <Button
                      variant="light"
                      color="danger"
                      startContent={<Icon icon="solar:refresh-linear" className="h-4 w-4" />}
                      onClick={handleClearAllFilters}
                      className="transition-colors duration-150"
                    >
                      Reset All
                    </Button>
                    
                    <div className="flex gap-3">
                      <Button
                        variant="bordered"
                        onClick={() => setShowAdvancedFilters(false)}
                        className="transition-all duration-200"
                      >
                        Cancel
                      </Button>
                      <Button
                        color="primary"
                        startContent={<Icon icon="solar:magnifer-linear" className="h-4 w-4" />}
                        onClick={() => {
                          onSearch();
                          setShowAdvancedFilters(false);
                        }}
                        className="transition-all duration-200 hover:shadow-md"
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content that should follow the filter animation */}
      {children && (
        <motion.div
          animate={{ y: 0 }}
          transition={{ 
            duration: 0.35,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

export default SearchAndFilters;