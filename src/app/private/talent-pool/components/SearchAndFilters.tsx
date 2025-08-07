'use client';

import React, { useState } from 'react';

import {
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Tooltip
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { type TalentPoolFilters, type TalentType } from '../types';
import CountryFilter from './CountryFilter';
import AvailabilityFilter from './AvailabilityFilter';
import ExperienceLevelFilter from './ExperienceLevelFilter';
import ProfessionFilter from './ProfessionFilter';
import { countries } from '../data/countries';

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
      // Update the name filter with the current search query
      onFiltersChange({ ...filters, name: searchQuery || undefined });
      onSearch();
    }
  };

  const handleClearSearch = () => {
    onSearchChange('');
    onFiltersChange({ ...filters, search: undefined, name: undefined });
  };

  const handleClearAllFilters = () => {
    onSearchChange('');
    onFiltersChange({});
    setShowAdvancedFilters(false);
  };

  const handleSkillChange = (skills: string[]) => {
    onFiltersChange({ ...filters, skills });
  };


  const handleAvailabilityChange = (availability: 'OPEN_FOR_PROJECT' | 'OPEN_FOR_PART_TIME' | null) => {
    onFiltersChange({ ...filters, availability: availability || undefined });
  };


  const handleCountriesChange = (selectedCountries: string[]) => {
    onFiltersChange({ 
      ...filters, 
      country: selectedCountries.length > 0 ? selectedCountries : undefined 
    });
  };

  const handleExperienceLevelChange = (experienceLevels: string[]) => {
    onFiltersChange({ 
      ...filters, 
      experienceLevel: experienceLevels.length > 0 ? experienceLevels : undefined 
    });
  };

  const handleProfessionChange = (profession: 'FULL_TIME_FREELANCER' | 'PART_TIME_FREELANCER' | 'CONTRACTOR' | 'STUDENT' | null) => {
    onFiltersChange({ 
      ...filters, 
      profession: profession || undefined 
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




  return (
    <div className="space-y-6">
      {/* Active Filters - Only visible when there are active filters */}
      <AnimatePresence>
        {getActiveFiltersCount() > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap items-center gap-2 p-4 bg-default-50/50 rounded-lg border border-default-200/50"
          >
            <span className="text-small text-default-600 font-medium">Active:</span>
            
            {(filters.search || filters.name) && (
              <Chip
                size="sm"
                variant="flat"
                color="primary"
                onClose={() => {
                  removeFilter('search');
                  removeFilter('name');
                }}
                startContent={<Icon icon="solar:magnifer-linear" className="h-3 w-3" />}
              >
                "{filters.search || filters.name}"
              </Chip>
            )}


            {filters.availability && (
              <Chip
                size="sm"
                variant="flat"
                color={filters.availability === 'OPEN_FOR_PROJECT' ? 'success' : 'warning'}
                onClose={() => removeFilter('availability')}
                startContent={
                  <Icon 
                    icon={filters.availability === 'OPEN_FOR_PROJECT' ? 'solar:briefcase-bold' : 'solar:clock-circle-bold'} 
                    className="h-3 w-3" 
                  />
                }
              >
                {filters.availability === 'OPEN_FOR_PROJECT' ? 'Full-Time' : 'Part-Time'}
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


            {filters.country && filters.country.length > 0 && (
              <>
                {filters.country.slice(0, 3).map((countryCode) => {
                  const country = countries.find(c => c.code === countryCode);
                  return (
                    <Chip
                      key={countryCode}
                      size="sm"
                      variant="flat"
                      color="secondary"
                      onClose={() => {
                        const newCountries = filters.country?.filter(c => c !== countryCode) || [];
                        onFiltersChange({ ...filters, country: newCountries.length > 0 ? newCountries : undefined });
                      }}
                      startContent={
                        <img 
                          src={`https://flagcdn.com/16x12/${countryCode.toLowerCase()}.png`}
                          alt={`${country?.name} flag`}
                          className="h-3 w-4 rounded-sm"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      }
                    >
                      {country?.name || countryCode}
                    </Chip>
                  );
                })}
                {filters.country.length > 3 && (
                  <Chip
                    size="sm"
                    variant="flat"
                    color="secondary"
                    onClose={() => removeFilter('country')}
                    startContent={<Icon icon="solar:global-linear" className="h-3 w-3" />}
                  >
                    +{filters.country.length - 3} more
                  </Chip>
                )}
              </>
            )}

            {filters.profession && (
              <Chip
                size="sm"
                variant="flat"
                color="warning"
                onClose={() => removeFilter('profession')}
                startContent={<Icon icon="solar:case-minimalistic-linear" className="h-3 w-3" />}
              >
                {filters.profession === 'FULL_TIME_FREELANCER' ? 'Freelancer' : 
                 filters.profession === 'PART_TIME_FREELANCER' ? 'Interim' :
                 filters.profession === 'CONTRACTOR' ? 'Consultant' : 'Student entrepreneur'}
              </Chip>
            )}

            {filters.experienceLevel && filters.experienceLevel.length > 0 && (
              <Chip
                size="sm"
                variant="flat"
                color="secondary"
                onClose={() => removeFilter('experienceLevel')}
                startContent={<Icon icon="solar:medal-ribbons-star-linear" className="h-3 w-3" />}
              >
                {filters.experienceLevel.length} experience level{filters.experienceLevel.length === 1 ? '' : 's'}
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
                  <div className="space-y-6 mb-6">
                    {/* Top Row - Country and Profession */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {/* Country Filter */}
                      <div className="space-y-3">
                        <CountryFilter
                          selectedCountries={filters.country || []}
                          onSelectionChange={handleCountriesChange}
                          className="w-full"
                        />
                      </div>

                      {/* Profession Filter */}
                      <div className="space-y-3">
                        <ProfessionFilter
                          selectedProfession={filters.profession || null}
                          onSelectionChange={handleProfessionChange}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Bottom Row - Availability and Experience Level */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {/* Availability Filter */}
                      <div className="space-y-3">
                        <AvailabilityFilter
                          selectedAvailability={filters.availability as 'OPEN_FOR_PROJECT' | 'OPEN_FOR_PART_TIME' | null}
                          onSelectionChange={handleAvailabilityChange}
                          className="w-full"
                        />
                      </div>

                      {/* Experience Level Filter */}
                      <div className="space-y-3">
                        <ExperienceLevelFilter
                          selectedLevels={filters.experienceLevel || []}
                          onSelectionChange={handleExperienceLevelChange}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>


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
                          // Update the name filter with the current search query
                          onFiltersChange({ ...filters, name: searchQuery || undefined });
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