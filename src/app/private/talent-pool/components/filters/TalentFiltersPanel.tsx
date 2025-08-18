'use client';

import React, { useEffect, useState } from 'react';

import type { Country } from '../../data/countries';

import { Button, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import frLocale from 'i18n-iso-countries/langs/fr.json';
import nlLocale from 'i18n-iso-countries/langs/nl.json';
import { useLocale, useTranslations } from 'next-intl';

import { type TalentPoolFilters, type TalentType } from '../../types';
import AvailabilityFilter from './AvailabilityFilter';
import CountryFilter from './CountryFilter';
import ExperienceFilter from './ExperienceFilter';
import ProfessionFilter from './ProfessionFilter';

countries.registerLocale(enLocale);
countries.registerLocale(frLocale);
countries.registerLocale(nlLocale);

interface SearchAndFiltersProperties {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: TalentPoolFilters;
  onFiltersChange: (filters: TalentPoolFilters) => void;
  activeTab: TalentType;
  onSearch: () => void;
  showFiltersPanel?: boolean;
  onToggleFiltersPanel?: () => void;
  children?: React.ReactNode;
}

const SearchAndFilters: React.FC<SearchAndFiltersProperties> = ({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  onSearch,
  showFiltersPanel = false,
  onToggleFiltersPanel,
  children
}) => {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'fr' | 'nl';

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(true);

  // Sync showAdvancedFilters with showFiltersPanel
  useEffect(() => {
    if (showFiltersPanel) {
      setShowAdvancedFilters(true);
    }
  }, [showFiltersPanel]);

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
    // Don't close the filter panel when clearing - let the user continue using filters
  };

  const handleSkillChange = (skills: string[]) => {
    onFiltersChange({ ...filters, skills });
  };

  const handleAvailabilityChange = (
    statusAviability: 'OPEN_FOR_PROJECT' | 'OPEN_FOR_PART_TIME' | 'NOT_AVAILABLE' | undefined
  ) => {
    onFiltersChange({ ...filters, statusAviability: statusAviability });
  };

  const handleCountriesChange = (selectedCountries: string[]) => {
    onFiltersChange({
      ...filters,
      country: selectedCountries.length > 0 ? selectedCountries : []
    });
  };

  const handleExperienceLevelChange = (experienceLevels: string[]) => {
    onFiltersChange({
      ...filters,
      experienceLevel: experienceLevels.length > 0 ? experienceLevels : undefined
    });
  };

  const handleProfessionChange = (
    profession: 'FULL_TIME_FREELANCER' | 'PART_TIME_FREELANCER' | 'CONTRACTOR' | 'STUDENT' | null
  ) => {
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
    return Object.keys(filters).filter((key) => {
      const value = filters[key as keyof TalentPoolFilters];
      return (
        value !== undefined && value !== null && (Array.isArray(value) ? value.length > 0 : true)
      );
    }).length;
  };

  const getFallbackCountries = (locale: 'en' | 'fr' | 'nl') => {
    const countries = {
      en: [
        { code: 'US', name: 'United States' },
        { code: 'GB', name: 'United Kingdom' },
        { code: 'CA', name: 'Canada' },
        { code: 'DE', name: 'Germany' },
        { code: 'FR', name: 'France' },
        { code: 'NL', name: 'Netherlands' },
        { code: 'ES', name: 'Spain' },
        { code: 'IT', name: 'Italy' },
        { code: 'AU', name: 'Australia' },
        { code: 'JP', name: 'Japan' }
      ],
      fr: [
        { code: 'US', name: 'États-Unis' },
        { code: 'GB', name: 'Royaume-Uni' },
        { code: 'CA', name: 'Canada' },
        { code: 'DE', name: 'Allemagne' },
        { code: 'FR', name: 'France' },
        { code: 'NL', name: 'Pays-Bas' },
        { code: 'ES', name: 'Espagne' },
        { code: 'IT', name: 'Italie' },
        { code: 'AU', name: 'Australie' },
        { code: 'JP', name: 'Japon' }
      ],
      nl: [
        { code: 'US', name: 'Verenigde Staten' },
        { code: 'GB', name: 'Verenigd Koninkrijk' },
        { code: 'CA', name: 'Canada' },
        { code: 'DE', name: 'Duitsland' },
        { code: 'FR', name: 'Frankrijk' },
        { code: 'NL', name: 'Nederland' },
        { code: 'ES', name: 'Spanje' },
        { code: 'IT', name: 'Italië' },
        { code: 'AU', name: 'Australië' },
        { code: 'JP', name: 'Japan' }
      ]
    };

    return countries[locale].map((country) => ({
      ...country,
      continent: 'Unknown', // Add default continent for fallback countries
      flag: `https://flagcdn.com/w40/${country.code.toLowerCase()}.png`
    }));
  };
  const getCountryList = (locale: 'en' | 'fr' | 'nl') => {
    try {
      const names = countries.getNames(locale, { select: 'official' });

      if (!names || Object.keys(names).length === 0) {
        console.warn('No countries loaded from i18n, using fallback');
        return getFallbackCountries(locale);
      }

      return Object.entries(names)
        .map(([code, name]) => ({
          code,
          name,
          continent: 'Unknown', // Add default continent
          flag: `https://flagcdn.com/w40/${code.toLowerCase()}.png`
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error loading countries:', error);
      return getFallbackCountries(locale);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Active Filters - Only visible when there are active filters */}
      <AnimatePresence>
        {getActiveFiltersCount() > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className='from-default-50/60 to-primary/5 border-default-200/50 flex flex-wrap items-center gap-2 rounded-xl border bg-gradient-to-r p-4 backdrop-blur-sm'
          >
            <span className='text-small text-default-600 font-medium'>
              {t('talentPool.filters.active')}
            </span>

            {(filters.search || filters.name) && (
              <Chip
                size='sm'
                variant='flat'
                color='primary'
                onClose={() => {
                  removeFilter('search');
                  removeFilter('name');
                }}
                startContent={<Icon icon='solar:magnifer-linear' className='h-3 w-3' />}
              >
                &quot;{filters.search ?? filters.name}&quot;
              </Chip>
            )}

            {filters.statusAviability && (
              <Chip
                size='sm'
                variant='flat'
                color={filters.statusAviability === 'OPEN_FOR_PROJECT' ? 'success' : 'warning'}
                onClose={() => {
                  removeFilter('statusAviability');
                }}
                startContent={
                  <Icon
                    icon={
                      filters.statusAviability === 'OPEN_FOR_PROJECT'
                        ? 'solar:briefcase-bold'
                        : 'solar:clock-circle-bold'
                    }
                    className='h-3 w-3'
                  />
                }
              >
                {filters.statusAviability === 'OPEN_FOR_PROJECT' ? 'Full-Time' : 'Part-Time'}
              </Chip>
            )}

            {filters.skills && filters.skills.length > 0 && (
              <Chip
                size='sm'
                variant='flat'
                color='warning'
                onClose={() => {
                  removeFilter('skills');
                }}
                startContent={<Icon icon='solar:verified-check-linear' className='h-3 w-3' />}
              >
                {filters.skills.length} skill{filters.skills.length === 1 ? '' : 's'}
              </Chip>
            )}

            {filters.country && filters.country.length > 0 && (
              <>
                {filters.country.slice(0, 3).map((countryCode: string) => {
                  const countryList = getCountryList(locale);
                  const country = countryList.find((c: Country) => c.code === countryCode);
                  return (
                    <Chip
                      key={countryCode}
                      size='sm'
                      variant='flat'
                      color='secondary'
                      onClose={() => {
                        const newCountries =
                          filters.country?.filter((c: string) => c !== countryCode) || [];
                        onFiltersChange({
                          ...filters,
                          country: newCountries.length > 0 ? newCountries : undefined
                        });
                      }}
                      startContent={
                        <img
                          src={`https://flagcdn.com/16x12/${countryCode.toLowerCase()}.png`}
                          alt={`${country?.name} flag`}
                          className='h-3 w-4 rounded-sm'
                          onError={(event) => {
                            event.currentTarget.style.display = 'none';
                          }}
                        />
                      }
                    >
                      {country?.name}
                    </Chip>
                  );
                })}
                {filters.country.length > 3 && (
                  <Chip
                    size='sm'
                    variant='flat'
                    color='secondary'
                    onClose={() => {
                      removeFilter('country');
                    }}
                    startContent={<Icon icon='solar:global-linear' className='h-3 w-3' />}
                  >
                    +{filters.country.length - 3} more
                  </Chip>
                )}
              </>
            )}

            {filters.profession && (
              <Chip
                size='sm'
                variant='flat'
                color='warning'
                onClose={() => {
                  removeFilter('profession');
                }}
                startContent={<Icon icon='solar:case-minimalistic-linear' className='h-3 w-3' />}
              >
                {filters.profession === 'FULL_TIME_FREELANCER'
                  ? 'Freelancer'
                  : filters.profession === 'PART_TIME_FREELANCER'
                    ? 'Interim'
                    : filters.profession === 'CONTRACTOR'
                      ? 'Contractor'
                      : 'Student entrepreneur'}
              </Chip>
            )}

            {filters.experienceLevel && filters.experienceLevel.length > 0 && (
              <Chip
                size='sm'
                variant='flat'
                color='secondary'
                onClose={() => {
                  removeFilter('experienceLevel');
                }}
                startContent={<Icon icon='solar:medal-ribbons-star-linear' className='h-3 w-3' />}
              >
                {filters.experienceLevel.length} experience level
                {filters.experienceLevel.length === 1 ? '' : 's'}
              </Chip>
            )}

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size='sm'
                variant='light'
                color='danger'
                startContent={
                  <Icon icon='solar:trash-bin-minimalistic-linear' className='h-3 w-3' />
                }
                onPress={handleClearAllFilters}
                className='hover:bg-danger/15 ml-2 rounded-full transition-all duration-150 hover:shadow-sm'
              >
                {t('talentPool.filters.clearAll')}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Controls Panel - Only show when panel is open */}
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
            {/* Advanced Filters Panel */}
            <AnimatePresence>
              {showAdvancedFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className='border-divider/50 from-background/95 to-background/90 ring-primary/5 relative rounded-xl border bg-gradient-to-br shadow-xl ring-1 backdrop-blur-xl'
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
                            {t('talentPool.filters.advanced.title')}
                          </h3>
                          <p className='text-default-600 text-sm'>
                            {t('talentPool.filters.advanced.description')}
                          </p>
                        </div>
                      </div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          isIconOnly
                          size='sm'
                          variant='light'
                          onPress={() => {
                            setShowAdvancedFilters(false);
                            onToggleFiltersPanel?.();
                          }}
                          className='hover:bg-danger/10 hover:text-danger-600 rounded-full transition-all duration-200'
                        >
                          <Icon icon='solar:close-linear' className='h-4 w-4' />
                        </Button>
                      </motion.div>
                    </div>

                    {/* Filter Grid */}
                    <div className='mb-3 space-y-8'>
                      {/* Top Row - Country and Profession */}
                      <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
                        {/* Country Filter */}
                        <motion.div
                          className='from-primary/3 to-primary/1 border-primary/10 hover:border-primary/20 space-y-4 rounded-xl border bg-gradient-to-br p-5 transition-all duration-300 hover:shadow-md'
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className='mb-3 flex items-center gap-3'>
                            <div className='from-primary/10 to-secondary/10 border-primary/20 flex h-6 w-6 items-center justify-center rounded-lg border bg-gradient-to-r'>
                              <Icon
                                icon='solar:global-outline'
                                className='text-primary-600 h-3 w-3'
                              />
                            </div>
                            <span className='text-primary-700 text-sm font-medium'>
                              {t('talentPool.filters.categories.location')}
                            </span>
                          </div>
                          <CountryFilter
                            selectedCountries={filters.country ?? []}
                            onSelectionChange={handleCountriesChange}
                            countries={getCountryList(locale)}
                            className='w-full'
                          />
                        </motion.div>

                        {/* Profession Filter */}
                        <motion.div
                          className='from-secondary/3 to-secondary/1 border-secondary/10 hover:border-secondary/20 space-y-4 rounded-xl border bg-gradient-to-br p-5 transition-all duration-300 hover:shadow-md'
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className='mb-3 flex items-center gap-3'>
                            <div className='from-secondary/10 to-warning/10 border-secondary/20 flex h-6 w-6 items-center justify-center rounded-lg border bg-gradient-to-r'>
                              <Icon
                                icon='solar:case-minimalistic-outline'
                                className='text-secondary-600 h-3 w-3'
                              />
                            </div>
                            <span className='text-secondary-700 text-sm font-medium'>
                              {t('talentPool.filters.categories.profession')}
                            </span>
                          </div>
                          <ProfessionFilter
                            selectedProfession={filters.profession || null}
                            onSelectionChange={handleProfessionChange}
                            className='w-full'
                          />
                        </motion.div>
                      </div>

                      {/* Bottom Row - Availability and Experience Level */}
                      <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
                        {/* Availability Filter */}
                        <motion.div
                          className='from-success/3 to-success/1 border-success/10 hover:border-success/20 space-y-4 rounded-xl border bg-gradient-to-br p-5 transition-all duration-300 hover:shadow-md'
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className='mb-3 flex items-center gap-3'>
                            <div className='from-success/10 to-primary/10 border-success/20 flex h-6 w-6 items-center justify-center rounded-lg border bg-gradient-to-r'>
                              <Icon
                                icon='solar:clock-circle-outline'
                                className='text-success-600 h-3 w-3'
                              />
                            </div>
                            <span className='text-success-700 text-sm font-medium'>
                              {t('talentPool.filters.categories.availability')}
                            </span>
                          </div>
                          <AvailabilityFilter
                            selectedAvailability={filters.statusAviability}
                            onSelectionChange={handleAvailabilityChange}
                            className='w-full'
                          />
                        </motion.div>

                        {/* Experience Level Filter */}
                        <motion.div
                          className='from-warning/3 to-warning/1 border-warning/10 hover:border-warning/20 space-y-4 rounded-xl border bg-gradient-to-br p-5 transition-all duration-300 hover:shadow-md'
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className='mb-3 flex items-center gap-3'>
                            <div className='from-warning/10 to-danger/10 border-warning/20 flex h-6 w-6 items-center justify-center rounded-lg border bg-gradient-to-r'>
                              <Icon
                                icon='solar:medal-ribbons-star-outline'
                                className='text-warning-600 h-3 w-3'
                              />
                            </div>
                            <span className='text-warning-700 text-sm font-medium'>
                              {t('talentPool.filters.categories.experience')}
                            </span>
                          </div>
                          <ExperienceFilter
                            selectedLevels={filters.experienceLevel || []}
                            onSelectionChange={handleExperienceLevelChange}
                            className='w-full'
                          />
                        </motion.div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {/* <div className='border-divider/50 flex items-center justify-between border-t pt-4'>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant='light'
                          color='danger'
                          startContent={<Icon icon='solar:refresh-linear' className='h-4 w-4' />}
                          onPress={handleClearAllFilters}
                          className='hover:bg-danger/10 transition-all duration-150 hover:shadow-sm'
                        >
                          {t('talentPool.filters.resetAll')}
                        </Button>
                      </motion.div>

                      <div className='flex gap-3'>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            variant='bordered'
                            onPress={() => {
                              setShowAdvancedFilters(false);
                              onToggleFiltersPanel?.();
                            }}
                            className='hover:bg-default/50 transition-all duration-200 hover:shadow-sm'
                          >
                            {t('talentPool.filters.cancel')}
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            color='primary'
                            startContent={<Icon icon='solar:magnifer-linear' className='h-4 w-4' />}
                            onClick={() => {
                              // Update the name filter with the current search query
                              onFiltersChange({ ...filters, name: searchQuery || undefined });
                              onSearch();
                              setShowAdvancedFilters(false);
                              onToggleFiltersPanel?.();
                            }}
                            className='from-primary to-primary-600 bg-gradient-to-r transition-all duration-200 hover:shadow-lg'
                          >
                            {t('talentPool.filters.apply')}
                          </Button>
                        </motion.div>
                      </div>
                    </div> */}
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
