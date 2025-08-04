'use client';

import React from 'react';

import {
  Badge,
  Button,
  Card,
  CardBody,
  Checkbox,
  CheckboxGroup,
  Chip,
  Divider,
  Input,
  Select,
  SelectItem,
  Slider,
  Tab,
  Tabs
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';

import CountryFilter from '../CountryFilter/CountryFilter';

interface FilterValues {
  expertise: string;
  availability: string;
  type: string;
  minEndorsements: string;
  ratingRange: number[];
  priceRange: number[];
  location: string;
  countries: string[];
  languages: string[];
  timezones: string[];
  projectsRange: number[];
}

interface SearchInputProperties {
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterValues) => void;
  onSortChange: (sortBy: string) => void;
  totalExperts: number;
}

export const SearchInput: React.FC<SearchInputProperties> = ({
  onSearch,
  onFilterChange,
  onSortChange,
  totalExperts
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expertise, setExpertise] = React.useState('All Expertise');
  const [availability, setAvailability] = React.useState('Any Availability');
  const [type, setType] = React.useState('All Types');
  const [location, setLocation] = React.useState('All Locations');
  const [minEndorsements, setMinEndorsements] = React.useState('');
  const [ratingRange, setRatingRange] = React.useState([0, 5]);
  const [priceRange, setPriceRange] = React.useState([0, 200]);
  const [projectsRange, setProjectsRange] = React.useState([0, 200]);
  const [countries, setCountries] = React.useState<string[]>([]);
  const [languages, setLanguages] = React.useState<string[]>([]);
  const [timezones, setTimezones] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState('Relevance');
  const [showFilters, setShowFilters] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState<string[]>([]);
  const [activeTab, setActiveTab] = React.useState('basic');

  const updateActiveFilters = React.useCallback(() => {
    const filters: string[] = [];
    if (expertise !== 'All Expertise') filters.push(expertise);
    if (availability !== 'Any Availability') filters.push(availability);
    if (type !== 'All Types') filters.push(type);
    if (location !== 'All Locations') filters.push(location);
    if (minEndorsements) filters.push(`${minEndorsements}+ endorsements`);
    if ((ratingRange?.[0] ?? 0) > 0 || (ratingRange?.[1] ?? 5) < 5) {
      filters.push(`${ratingRange?.[0] ?? 0}+ rating`);
    }
    if ((priceRange?.[0] ?? 0) > 0 || (priceRange?.[1] ?? 200) < 200) {
      filters.push(`$${priceRange?.[0] ?? 0}-${priceRange?.[1] ?? 200}/hr`);
    }
    if ((projectsRange?.[0] ?? 0) > 0 || (projectsRange?.[1] ?? 200) < 200) {
      filters.push(`${projectsRange?.[0] ?? 0}+ projects`);
    }
    if (countries.length > 0) {
      filters.push(`${countries.length} countries`);
    }
    if (languages.length > 0) {
      filters.push(`${languages.length} languages`);
    }
    if (timezones.length > 0) {
      filters.push(`${timezones.length} timezones`);
    }
    setActiveFilters(filters);
  }, [
    expertise,
    availability,
    type,
    location,
    minEndorsements,
    ratingRange,
    priceRange,
    projectsRange,
    countries,
    languages,
    timezones
  ]);

  React.useEffect(() => {
    updateActiveFilters();
  }, [updateActiveFilters]);

  const handleSearch = React.useCallback(() => {
    onSearch(searchQuery);
  }, [searchQuery, onSearch]);

  const handleFilterChange = React.useCallback(() => {
    onFilterChange({
      expertise,
      availability,
      type,
      location,
      minEndorsements,
      ratingRange,
      priceRange,
      projectsRange,
      countries,
      languages,
      timezones
    });
  }, [
    expertise,
    availability,
    type,
    location,
    minEndorsements,
    ratingRange,
    priceRange,
    projectsRange,
    countries,
    languages,
    timezones,
    onFilterChange
  ]);

  React.useEffect(() => {
    handleFilterChange();
  }, [handleFilterChange]);

  const clearAllFilters = () => {
    setExpertise('All Expertise');
    setAvailability('Any Availability');
    setType('All Types');
    setLocation('All Locations');
    setMinEndorsements('');
    setRatingRange([0, 5]);
    setPriceRange([0, 200]);
    setProjectsRange([0, 200]);
    setCountries([]);
    setLanguages([]);
    setTimezones([]);
  };

  const removeFilter = (filterToRemove: string) => {
    if (filterToRemove === expertise) setExpertise('All Expertise');
    if (filterToRemove === availability) setAvailability('Any Availability');
    if (filterToRemove === type) setType('All Types');
    if (filterToRemove === location) setLocation('All Locations');
    if (filterToRemove.includes('endorsements')) setMinEndorsements('');
    if (filterToRemove.includes('rating')) setRatingRange([0, 5]);
    if (filterToRemove.includes('/hr')) setPriceRange([0, 200]);
    if (filterToRemove.includes('projects')) setProjectsRange([0, 200]);
    if (filterToRemove.includes('countries')) setCountries([]);
    if (filterToRemove.includes('languages')) setLanguages([]);
    if (filterToRemove.includes('timezones')) setTimezones([]);
  };

  // Available languages and timezones for the filter
  const availableLanguages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Chinese',
    'Japanese',
    'Korean',
    'Hindi',
    'Portuguese',
    'Russian',
    'Arabic',
    'Italian',
    'Dutch',
    'Swedish',
    'Norwegian',
    'Tamil'
  ];
  const availableTimezones = ['PST', 'MST', 'CST', 'EST', 'GMT', 'CET', 'IST', 'JST', 'AEST'];

  return (
    <div className='w-full space-y-6'>
      {/* Search Header */}
      <Card className='shadow-medium border-none'>
        <CardBody className='p-6'>
          <div className='flex flex-col gap-4'>
            {/* Main Search Bar */}
            <div className='flex flex-col items-center gap-4 lg:flex-row'>
              <div className='relative w-full flex-1'>
                <Input
                  placeholder='Search by name, skills, expertise, or keywords...'
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') handleSearch();
                  }}
                  startContent={<Icon icon='lucide:search' className='text-default-400' />}
                  endContent={
                    searchQuery && (
                      <Button
                        isIconOnly
                        size='sm'
                        variant='light'
                        onPress={() => {
                          setSearchQuery('');
                          onSearch('');
                        }}
                      >
                        <Icon icon='lucide:x' className='text-default-400' />
                      </Button>
                    )
                  }
                  size='lg'
                  className='w-full'
                />
              </div>

              <div className='flex w-full items-center gap-3 lg:w-auto'>
                <Button
                  variant={showFilters ? 'solid' : 'bordered'}
                  color={showFilters ? 'primary' : 'default'}
                  startContent={<Icon icon='lucide:sliders-horizontal' />}
                  endContent={
                    activeFilters.length > 0 && (
                      <Badge content={activeFilters.length} color='danger' size='sm'>
                        <div />
                      </Badge>
                    )
                  }
                  className='w-full lg:w-auto'
                  onPress={() => setShowFilters(!showFilters)}
                >
                  Filters
                </Button>

                <div className='flex w-full items-center gap-2 lg:w-auto'>
                  <span className='text-default-500 hidden text-sm whitespace-nowrap sm:block'>
                    Sort:
                  </span>
                  <Select
                    selectedKeys={[sortBy]}
                    onSelectionChange={(keys) => {
                      const value = [...keys][0] as string;
                      setSortBy(value);
                      onSortChange(value);
                    }}
                    className='w-full min-w-[140px] lg:w-[160px]'
                    size='sm'
                  >
                    <SelectItem key='Relevance'>Relevance</SelectItem>
                    <SelectItem key='Rating'>Highest Rated</SelectItem>
                    <SelectItem key='Endorsements'>Most Endorsed</SelectItem>
                    <SelectItem key='Newest'>Recently Joined</SelectItem>
                    <SelectItem key='Price Low'>Lowest Price</SelectItem>
                    <SelectItem key='Price High'>Highest Price</SelectItem>
                  </Select>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            <AnimatePresence>
              {activeFilters.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className='flex flex-wrap items-center gap-2'
                >
                  <span className='text-default-500 text-sm font-medium'>Active filters:</span>
                  {activeFilters.map((filter, index) => (
                    <Chip
                      key={index}
                      onClose={() => removeFilter(filter)}
                      variant='flat'
                      color='primary'
                      size='sm'
                    >
                      {filter}
                    </Chip>
                  ))}
                  <Button
                    size='sm'
                    variant='light'
                    color='danger'
                    onPress={clearAllFilters}
                    className='ml-2'
                  >
                    Clear all
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardBody>
      </Card>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Card className='shadow-medium border-none'>
              <CardBody className='p-6'>
                <div className='space-y-6'>
                  <div className='flex items-center gap-3'>
                    <Icon icon='lucide:filter' className='text-primary h-5 w-5' />
                    <h3 className='text-foreground text-lg font-semibold'>Advanced Filters</h3>
                  </div>

                  <Tabs
                    selectedKey={activeTab}
                    onSelectionChange={(key) => setActiveTab(String(key))}
                    color='primary'
                    variant='underlined'
                    classNames={{
                      tabList: 'gap-6 w-full relative rounded-none p-0 border-b border-divider',
                      cursor: 'w-full bg-primary',
                      tab: 'max-w-fit px-0 h-12',
                      tabContent: 'group-data-[selected=true]:text-primary'
                    }}
                  >
                    <Tab
                      key='basic'
                      title={
                        <div className='flex items-center gap-2'>
                          <Icon icon='lucide:settings' className='h-4 w-4' />
                          <span>Basic</span>
                        </div>
                      }
                    >
                      <div className='space-y-6 pt-4'>
                        {/* Basic Filters */}
                        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                          <div className='space-y-2'>
                            <div className='flex items-center gap-2'>
                              <Icon icon='lucide:brain' className='text-primary h-4 w-4' />
                              <span className='text-sm font-medium'>Expertise</span>
                            </div>
                            <Select
                              selectedKeys={[expertise]}
                              onSelectionChange={(keys) => {
                                const value = [...keys][0] as string;
                                setExpertise(value);
                              }}
                              variant='bordered'
                              size='sm'
                            >
                              <SelectItem key='All Expertise'>All Expertise</SelectItem>
                              <SelectItem key='Frontend Development'>
                                Frontend Development
                              </SelectItem>
                              <SelectItem key='Backend Development'>Backend Development</SelectItem>
                              <SelectItem key='Full-stack Development'>
                                Full-stack Development
                              </SelectItem>
                              <SelectItem key='Mobile Development'>Mobile Development</SelectItem>
                              <SelectItem key='DevOps'>DevOps</SelectItem>
                              <SelectItem key='Cloud Architecture'>Cloud Architecture</SelectItem>
                              <SelectItem key='Data Science'>Data Science</SelectItem>
                              <SelectItem key='UI/UX Design'>UI/UX Design</SelectItem>
                              <SelectItem key='Product Management'>Product Management</SelectItem>
                              <SelectItem key='Blockchain'>Blockchain</SelectItem>
                              <SelectItem key='Security'>Security</SelectItem>
                            </Select>
                          </div>

                          <div className='space-y-2'>
                            <div className='flex items-center gap-2'>
                              <Icon icon='lucide:clock' className='text-success h-4 w-4' />
                              <span className='text-sm font-medium'>Availability</span>
                            </div>
                            <Select
                              selectedKeys={[availability]}
                              onSelectionChange={(keys) => {
                                const value = [...keys][0] as string;
                                setAvailability(value);
                              }}
                              variant='bordered'
                              size='sm'
                            >
                              <SelectItem key='Any Availability'>Any Availability</SelectItem>
                              <SelectItem key='Available now'>Available now</SelectItem>
                              <SelectItem key='Busy'>Busy</SelectItem>
                            </Select>
                          </div>

                          <div className='space-y-2'>
                            <div className='flex items-center gap-2'>
                              <Icon icon='lucide:users' className='text-warning h-4 w-4' />
                              <span className='text-sm font-medium'>Type</span>
                            </div>
                            <Select
                              selectedKeys={[type]}
                              onSelectionChange={(keys) => {
                                const value = [...keys][0] as string;
                                setType(value);
                              }}
                              variant='bordered'
                              size='sm'
                            >
                              <SelectItem key='All Types'>All Types</SelectItem>
                              <SelectItem key='Individual'>Individual</SelectItem>
                              <SelectItem key='Team'>Team</SelectItem>
                            </Select>
                          </div>

                          <div className='space-y-2'>
                            <div className='flex items-center gap-2'>
                              <Icon icon='lucide:thumbs-up' className='text-secondary h-4 w-4' />
                              <span className='text-sm font-medium'>Min. Endorsements</span>
                            </div>
                            <Input
                              type='number'
                              placeholder='e.g., 10'
                              value={minEndorsements}
                              onChange={(event) => setMinEndorsements(event.target.value)}
                              startContent={
                                <Icon icon='lucide:hash' className='text-default-400' />
                              }
                              variant='bordered'
                              size='sm'
                            />
                          </div>
                        </div>

                        <Divider />

                        {/* Range Filters */}
                        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                          <div className='space-y-4'>
                            <div className='mb-2 flex items-center gap-2'>
                              <Icon icon='lucide:star' className='text-warning h-4 w-4' />
                              <label className='text-foreground text-sm font-medium'>
                                Rating Range
                              </label>
                              <span className='text-default-500 ml-auto text-sm'>
                                {ratingRange[0]} - {ratingRange[1]} stars
                              </span>
                            </div>
                            <Slider
                              step={0.1}
                              minValue={0}
                              maxValue={5}
                              value={ratingRange}
                              onChange={(value) => setRatingRange(value as number[])}
                              className='w-full'
                              color='warning'
                              showTooltip
                              formatOptions={{ maximumFractionDigits: 1 }}
                            />
                          </div>

                          <div className='space-y-4'>
                            <div className='mb-2 flex items-center gap-2'>
                              <Icon icon='lucide:dollar-sign' className='text-success h-4 w-4' />
                              <label className='text-foreground text-sm font-medium'>
                                Hourly Rate
                              </label>
                              <span className='text-default-500 ml-auto text-sm'>
                                ${priceRange[0]} - ${priceRange[1]}/hr
                              </span>
                            </div>
                            <Slider
                              step={5}
                              minValue={0}
                              maxValue={200}
                              value={priceRange}
                              onChange={(value) => setPriceRange(value as number[])}
                              className='w-full'
                              color='success'
                              showTooltip
                              formatOptions={{ style: 'currency', currency: 'USD' }}
                            />
                          </div>

                          <div className='space-y-4'>
                            <div className='mb-2 flex items-center gap-2'>
                              <Icon icon='lucide:briefcase' className='text-primary h-4 w-4' />
                              <label className='text-foreground text-sm font-medium'>
                                Completed Projects
                              </label>
                              <span className='text-default-500 ml-auto text-sm'>
                                {projectsRange[0]}+ projects
                              </span>
                            </div>
                            <Slider
                              step={1}
                              minValue={0}
                              maxValue={200}
                              value={projectsRange}
                              onChange={(value) => setProjectsRange(value as number[])}
                              className='w-full'
                              color='primary'
                              showTooltip
                            />
                          </div>
                        </div>
                      </div>
                    </Tab>

                    <Tab
                      key='location'
                      title={
                        <div className='flex items-center gap-2'>
                          <Icon icon='lucide:map-pin' className='h-4 w-4' />
                          <span>Location</span>
                        </div>
                      }
                    >
                      <div className='space-y-6 pt-4'>
                        <CountryFilter
                          selectedCountries={countries}
                          onSelectionChange={setCountries}
                        />
                      </div>
                    </Tab>

                    <Tab
                      key='skills'
                      title={
                        <div className='flex items-center gap-2'>
                          <Icon icon='lucide:languages' className='h-4 w-4' />
                          <span>Languages & Timezone</span>
                        </div>
                      }
                    >
                      <div className='space-y-6 pt-4'>
                        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                          {/* Languages Filter */}
                          <div className='space-y-4'>
                            <div className='flex items-center gap-2'>
                              <Icon icon='lucide:message-circle' className='text-primary h-4 w-4' />
                              <span className='text-foreground text-sm font-medium'>Languages</span>
                            </div>
                            <CheckboxGroup
                              value={languages}
                              onValueChange={setLanguages}
                              orientation='vertical'
                              className='gap-2'
                            >
                              <div className='grid grid-cols-2 gap-2'>
                                {availableLanguages.map((lang) => (
                                  <Checkbox key={lang} value={lang} size='sm'>
                                    <span className='text-sm'>{lang}</span>
                                  </Checkbox>
                                ))}
                              </div>
                            </CheckboxGroup>
                          </div>

                          {/* Timezone Filter */}
                          <div className='space-y-4'>
                            <div className='flex items-center gap-2'>
                              <Icon icon='lucide:clock-3' className='text-success h-4 w-4' />
                              <span className='text-foreground text-sm font-medium'>Timezones</span>
                            </div>
                            <CheckboxGroup
                              value={timezones}
                              onValueChange={setTimezones}
                              orientation='vertical'
                              className='gap-2'
                            >
                              <div className='grid grid-cols-1 gap-2'>
                                {availableTimezones.map((tz) => (
                                  <Checkbox key={tz} value={tz} size='sm'>
                                    <span className='font-mono text-sm'>{tz}</span>
                                  </Checkbox>
                                ))}
                              </div>
                            </CheckboxGroup>
                          </div>
                        </div>
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Summary */}
      <div className='flex items-center justify-between text-sm'>
        <div className='flex items-center gap-2'>
          <span className='text-default-600'>
            <strong className='text-foreground'>{totalExperts}</strong> experts found
          </span>
          {searchQuery && (
            <>
              <span className='text-default-400'>•</span>
              <span className='text-default-500'>for "{searchQuery}"</span>
            </>
          )}
        </div>

        <div className='flex items-center gap-2'>
          <Button
            size='sm'
            variant='light'
            startContent={<Icon icon='lucide:layout-grid' />}
            className='text-default-500'
          >
            Grid View
          </Button>
        </div>
      </div>
    </div>
  );
};
