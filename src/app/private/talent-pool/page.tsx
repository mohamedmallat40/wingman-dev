'use client';

import React, { useMemo, useState } from 'react';

import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  Checkbox,
  CheckboxGroup,
  Chip,
  Input,
  Select,
  SelectItem,
  Slider,
  Tab,
  Tabs
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';

import DashboardLayout from '@/components/layouts/dashboard-layout';

import CountryFilter from './components/CountryFilter/CountryFilter';
import { Pagination } from './components/pagination/pagination';
import { TalentPoolCard } from './components/TalentPoolCard/talentpool-card';
import { talentData } from './data';

interface FilterValues {
  expertise: string;
  availability: string;
  type: string;
  location: string;
  minEndorsements: string;
  ratingRange: number[];
  priceRange: number[];
  projectsRange: number[];
  countries: string[];
  languages: string[];
  timezones: string[];
}

const Page = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterValues>({
    expertise: 'All Expertise',
    availability: 'Any Availability',
    type: 'All Types',
    location: 'All Locations',
    minEndorsements: '',
    ratingRange: [0, 5],
    priceRange: [0, 200],
    projectsRange: [0, 200],
    countries: [],
    languages: [],
    timezones: []
  });
  const [sortBy, setSortBy] = useState('Relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('basic');

  // Available options for filters
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

  const featuredExperts = talentData
    .filter((talent) => talent.rating && talent.rating >= 4.8)
    .slice(0, 3);

  const filteredAndSortedTalent = useMemo(() => {
    const filtered = talentData.filter((talent) => {
      // Search query filter
      const matchesSearch = searchQuery
        ? talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          talent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          talent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          talent.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;

      // Expertise filter
      const matchesExpertise =
        filters.expertise === 'All Expertise' ||
        talent.title.toLowerCase().includes(filters.expertise.toLowerCase()) ||
        talent.tags.some((tag) => tag.toLowerCase().includes(filters.expertise.toLowerCase()));

      // Availability filter
      const matchesAvailability =
        filters.availability === 'Any Availability' ||
        (filters.availability === 'Available now' && talent.availability === 'available') ||
        (filters.availability === 'Busy' && talent.availability === 'busy');

      // Type filter
      const matchesType =
        filters.type === 'All Types' ||
        (filters.type === 'Individual' && !talent.isTeam) ||
        (filters.type === 'Team' && talent.isTeam);

      // Location filter
      const matchesLocation =
        filters.location === 'All Locations' ||
        talent.location?.toLowerCase().includes(filters.location.toLowerCase());

      // Countries filter
      const matchesCountries =
        filters.countries.length === 0 ||
        (talent.countryCode && filters.countries.includes(talent.countryCode));

      // Languages filter
      const matchesLanguages =
        filters.languages.length === 0 ||
        (talent.languages && talent.languages.some((lang) => filters.languages.includes(lang)));

      // Timezones filter
      const matchesTimezones =
        filters.timezones.length === 0 ||
        (talent.timezone && filters.timezones.includes(talent.timezone));

      // Minimum Endorsements filter
      const minEndorsementsNumber = Number.parseInt(filters.minEndorsements);
      const matchesMinEndorsements =
        Number.isNaN(minEndorsementsNumber) || talent.endorsements >= minEndorsementsNumber;

      // Rating filter
      const matchesRating =
        !talent.rating ||
        (talent.rating >= (filters.ratingRange?.[0] ?? 0) &&
          talent.rating <= (filters.ratingRange?.[1] ?? 5));

      // Price filter
      const matchesPrice = () => {
        if (!talent.hourlyRate) return true;
        const rate = Number.parseInt(talent.hourlyRate.replace(/[^0-9]/g, ''));
        return rate >= (filters.priceRange?.[0] ?? 0) && rate <= (filters.priceRange?.[1] ?? 200);
      };

      // Projects filter
      const matchesProjects =
        !talent.completedProjects || talent.completedProjects >= (filters.projectsRange?.[0] ?? 0);

      return (
        matchesSearch &&
        matchesExpertise &&
        matchesAvailability &&
        matchesType &&
        matchesLocation &&
        matchesCountries &&
        matchesLanguages &&
        matchesTimezones &&
        matchesMinEndorsements &&
        matchesRating &&
        matchesPrice() &&
        matchesProjects
      );
    });

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'Relevance': {
          return (b.rating ?? 0) * b.endorsements - (a.rating ?? 0) * a.endorsements;
        }
        case 'Rating': {
          return (b.rating ?? 0) - (a.rating ?? 0);
        }
        case 'Endorsements': {
          return b.endorsements - a.endorsements;
        }
        case 'Newest': {
          return Number.parseInt(b.id) - Number.parseInt(a.id);
        }
        case 'Price Low': {
          const aPrice = a.hourlyRate ? Number.parseInt(a.hourlyRate.replace(/[^0-9]/g, '')) : 0;
          const bPrice = b.hourlyRate ? Number.parseInt(b.hourlyRate.replace(/[^0-9]/g, '')) : 0;
          return aPrice - bPrice;
        }
        case 'Price High': {
          const aPrice = a.hourlyRate ? Number.parseInt(a.hourlyRate.replace(/[^0-9]/g, '')) : 0;
          const bPrice = b.hourlyRate ? Number.parseInt(b.hourlyRate.replace(/[^0-9]/g, '')) : 0;
          return bPrice - aPrice;
        }
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, filters, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedTalent.length / itemsPerPage);
  const paginatedTalent = filteredAndSortedTalent.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  return (
    <DashboardLayout
      pageTitle='Find Expert Talent'
      pageDescription='Discover and connect with top professionals for your projects'
      pageIcon='solar:users-group-rounded-linear'
      breadcrumbs={[
        { label: 'Home', href: '/private/dashboard', icon: 'solar:home-linear' },
        { label: 'Talent Pool' }
      ]}
      headerActions={
        <div className='flex items-center gap-2'>
          <Button
            variant='flat'
            size='sm'
            startContent={<Icon icon='solar:bookmark-linear' className='h-4 w-4' />}
          >
            Opgeslagen
          </Button>
          <Button
            color='primary'
            size='sm'
            startContent={<Icon icon='solar:user-plus-linear' className='h-4 w-4' />}
          >
            Uitnodigen
          </Button>
        </div>
      }
    >
      <div className='container mx-auto max-w-7xl px-4 py-8'>
        {/* Search and Filters */}
        <div className='mb-8 space-y-6'>
          {/* Search Bar */}
          <Card>
            <CardBody className='p-6'>
              <div className='flex flex-col gap-4 md:flex-row'>
                <div className='flex-1'>
                  <Input
                    placeholder='Search by name, skills, or expertise...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    startContent={<Icon icon='lucide:search' className='text-slate-400' />}
                    size='lg'
                    className='w-full'
                  />
                </div>
                <Button
                  variant={showFilters ? 'solid' : 'bordered'}
                  color={showFilters ? 'primary' : 'default'}
                  startContent={<Icon icon='lucide:filter' />}
                  onPress={() => setShowFilters(!showFilters)}
                  size='lg'
                >
                  Filters
                  {Object.values(filters).some(
                    (f) =>
                      (Array.isArray(f) && f.length > 0) ||
                      (typeof f === 'string' &&
                        !f.includes('All') &&
                        !f.includes('Any') &&
                        f !== '') ||
                      (Array.isArray(f) &&
                        f.length === 2 &&
                        ((f[0] as number) > 0 ||
                          (f[1] as number) < (f === filters.ratingRange ? 5 : 200)))
                  ) && (
                    <Badge color='danger' size='sm' content=''>
                      •
                    </Badge>
                  )}
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardBody className='p-6'>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
                      {/* Expertise */}
                      <div>
                        <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                          <Icon icon='lucide:brain' className='mr-2 inline h-4 w-4' />
                          Expertise
                        </label>
                        <Select
                          selectedKeys={[filters.expertise]}
                          onSelectionChange={(keys) => {
                            const value = [...keys][0] as string;
                            setFilters((prev) => ({ ...prev, expertise: value }));
                          }}
                          variant='bordered'
                        >
                          <SelectItem key='All Expertise'>All Expertise</SelectItem>
                          <SelectItem key='Frontend Development'>Frontend Development</SelectItem>
                          <SelectItem key='Backend Development'>Backend Development</SelectItem>
                          <SelectItem key='Full-stack Development'>
                            Full-stack Development
                          </SelectItem>
                          <SelectItem key='Mobile Development'>Mobile Development</SelectItem>
                          <SelectItem key='DevOps'>DevOps</SelectItem>
                          <SelectItem key='Data Science'>Data Science</SelectItem>
                          <SelectItem key='UI/UX Design'>UI/UX Design</SelectItem>
                          <SelectItem key='Blockchain'>Blockchain</SelectItem>
                        </Select>
                      </div>

                      {/* Availability */}
                      <div>
                        <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                          <Icon icon='lucide:clock' className='mr-2 inline h-4 w-4' />
                          Availability
                        </label>
                        <Select
                          selectedKeys={[filters.availability]}
                          onSelectionChange={(keys) => {
                            const value = [...keys][0] as string;
                            setFilters((prev) => ({ ...prev, availability: value }));
                          }}
                          variant='bordered'
                        >
                          <SelectItem key='Any Availability'>Any Availability</SelectItem>
                          <SelectItem key='Available now'>Available now</SelectItem>
                          <SelectItem key='Busy'>Busy</SelectItem>
                        </Select>
                      </div>

                      {/* Rating */}
                      <div>
                        <div className='mb-2 flex items-center justify-between'>
                          <label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
                            <Icon icon='lucide:star' className='mr-2 inline h-4 w-4' />
                            Rating
                          </label>
                          <span className='text-xs text-slate-500'>
                            {filters.ratingRange[0]}+ stars
                          </span>
                        </div>
                        <Slider
                          step={0.1}
                          minValue={0}
                          maxValue={5}
                          value={filters.ratingRange}
                          onChange={(value) =>
                            setFilters((prev) => ({ ...prev, ratingRange: value as number[] }))
                          }
                          className='w-full'
                          color='warning'
                        />
                      </div>

                      {/* Price Range */}
                      <div>
                        <div className='mb-2 flex items-center justify-between'>
                          <label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
                            <Icon icon='lucide:dollar-sign' className='mr-2 inline h-4 w-4' />
                            Hourly Rate
                          </label>
                          <span className='text-xs text-slate-500'>
                            ${filters.priceRange[0]}-${filters.priceRange[1]}
                          </span>
                        </div>
                        <Slider
                          step={5}
                          minValue={0}
                          maxValue={200}
                          value={filters.priceRange}
                          onChange={(value) =>
                            setFilters((prev) => ({ ...prev, priceRange: value as number[] }))
                          }
                          className='w-full'
                          color='success'
                        />
                      </div>
                    </div>

                    {/* Countries Filter */}
                    <div className='mt-6'>
                      <CountryFilter
                        selectedCountries={filters.countries}
                        onSelectionChange={(countries) =>
                          setFilters((prev) => ({ ...prev, countries }))
                        }
                      />
                    </div>

                    {/* Clear Filters */}
                    <div className='mt-6 border-t border-slate-200 pt-6 dark:border-slate-700'>
                      <Button
                        color='danger'
                        variant='light'
                        size='sm'
                        onPress={() => {
                          setFilters({
                            expertise: 'All Expertise',
                            availability: 'Any Availability',
                            type: 'All Types',
                            location: 'All Locations',
                            minEndorsements: '',
                            ratingRange: [0, 5],
                            priceRange: [0, 200],
                            projectsRange: [0, 200],
                            countries: [],
                            languages: [],
                            timezones: []
                          });
                        }}
                        startContent={<Icon icon='lucide:trash-2' />}
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Header */}
        <div className='mb-6'>
          <Card>
            <CardBody className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <h2 className='text-xl font-semibold text-slate-900 dark:text-white'>
                    {filteredAndSortedTalent.length} Experts Found
                  </h2>
                  <p className='text-sm text-slate-600 dark:text-slate-400'>
                    Page {currentPage} of {totalPages}
                  </p>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm text-slate-600 dark:text-slate-400'>Sort:</span>
                    <Select
                      selectedKeys={[sortBy]}
                      onSelectionChange={(keys) => setSortBy([...keys][0] as string)}
                      size='sm'
                      className='w-36'
                      variant='bordered'
                    >
                      <SelectItem key='Relevance'>Relevance</SelectItem>
                      <SelectItem key='Rating'>Highest Rated</SelectItem>
                      <SelectItem key='Price Low'>Lowest Price</SelectItem>
                      <SelectItem key='Price High'>Highest Price</SelectItem>
                    </Select>
                  </div>
                  <div className='flex rounded-lg border border-slate-200 dark:border-slate-700'>
                    <Button
                      isIconOnly
                      size='sm'
                      variant={viewMode === 'grid' ? 'solid' : 'light'}
                      color={viewMode === 'grid' ? 'primary' : 'default'}
                      onPress={() => setViewMode('grid')}
                      className='rounded-r-none'
                    >
                      <Icon icon='lucide:grid-3x3' />
                    </Button>
                    <Button
                      isIconOnly
                      size='sm'
                      variant={viewMode === 'list' ? 'solid' : 'light'}
                      color={viewMode === 'list' ? 'primary' : 'default'}
                      onPress={() => setViewMode('list')}
                      className='rounded-l-none'
                    >
                      <Icon icon='lucide:list' />
                    </Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Talent Grid */}
        <AnimatePresence mode='wait'>
          {paginatedTalent.length > 0 ? (
            <motion.div
              key='talent-grid'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                viewMode === 'grid'
                  ? 'mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'
                  : 'mb-8 space-y-4'
              }
            >
              {paginatedTalent.map((talent, index) => (
                <motion.div
                  key={talent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className='h-full'
                >
                  <TalentPoolCard talent={{ ...talent, isTeam: talent.isTeam ?? false }} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key='no-results'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='mb-8 py-16 text-center'
            >
              <Card>
                <CardBody className='p-12'>
                  <div className='space-y-4'>
                    <div className='mb-4 text-6xl'>🔍</div>
                    <h3 className='text-xl font-semibold text-slate-900 dark:text-white'>
                      No experts found
                    </h3>
                    <p className='text-slate-600 dark:text-slate-400'>
                      Try adjusting your search terms or filters to find more experts.
                    </p>
                    <Button
                      color='primary'
                      variant='flat'
                      onPress={() => {
                        setSearchQuery('');
                        setFilters({
                          expertise: 'All Expertise',
                          availability: 'Any Availability',
                          type: 'All Types',
                          location: 'All Locations',
                          minEndorsements: '',
                          ratingRange: [0, 5],
                          priceRange: [0, 200],
                          projectsRange: [0, 200],
                          countries: [],
                          languages: [],
                          timezones: []
                        });
                      }}
                      className='mt-4'
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {filteredAndSortedTalent.length > 0 && (
          <Card>
            <CardBody className='p-6'>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={filteredAndSortedTalent.length}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </CardBody>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Page;
