import React from 'react';

import { Button, Input, Select, SelectItem } from '@heroui/react';
import { Icon } from '@iconify/react';

interface FilterValues {
  expertise: string;
  availability: string;
  type: string;
  minEndorsements: string;
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
  const [minEndorsements, setMinEndorsements] = React.useState('');
  const [sortBy, setSortBy] = React.useState('Relevance');
  const [showFilters, setShowFilters] = React.useState(false);

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleFilterChange = () => {
    onFilterChange({ expertise, availability, type, minEndorsements });
  };

  return (
    <div className='w-full space-y-4 py-6'>
      <div className='flex flex-col items-center gap-4 md:flex-row'>
        <div className='relative w-full flex-1'>
          <Input
            placeholder='Search by expertise, skill, or keywords...'
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleSearch();
            }}
            startContent={<Icon icon='lucide:search' className='text-default-400' />}
            className='w-full'
          />
        </div>
        <div className='flex w-full items-center gap-4 md:w-auto'>
          <Button
            variant='bordered'
            startContent={<Icon icon='lucide:sliders-horizontal' />}
            className='w-full md:w-auto'
            onPress={() => {
              setShowFilters(!showFilters);
            }}
          >
            Filters
          </Button>

          <div className='flex w-full items-center gap-2 md:w-auto'>
            <span className='text-default-500 text-sm whitespace-nowrap'>Sort by:</span>
            <Select
              selectedKeys={[sortBy]}
              onSelectionChange={(keys) => {
                const value = [...keys][0] as string;
                setSortBy(value);
                onSortChange(value);
              }}
              className='w-[150px]'
            >
              <SelectItem key='Relevance'>Relevance</SelectItem>
              <SelectItem key='Newest'>Newest</SelectItem>
              <SelectItem key='Endorsements'>Endorsements</SelectItem>
            </Select>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <Select
            selectedKeys={[expertise]}
            onSelectionChange={(keys) => {
              const value = [...keys][0] as string;
              setExpertise(value);
              handleFilterChange();
            }}
            placeholder='All Expertise'
          >
            <SelectItem key='All Expertise'>All Expertise</SelectItem>
            <SelectItem key='Security'>Security</SelectItem>
            <SelectItem key='Cloud'>Cloud</SelectItem>
            <SelectItem key='Development'>Development</SelectItem>
            <SelectItem key='Design'>Design</SelectItem>
            <SelectItem key='Data Science'>Data Science</SelectItem>
          </Select>

          <Select
            selectedKeys={[availability]}
            onSelectionChange={(keys) => {
              const value = [...keys][0] as string;
              setAvailability(value);
              handleFilterChange();
            }}
            placeholder='Any Availability'
          >
            <SelectItem key='Any Availability'>Any Availability</SelectItem>
            <SelectItem key='Available now'>Available now</SelectItem>
            <SelectItem key='Busy'>Busy</SelectItem>
          </Select>

          <Select
            selectedKeys={[type]}
            onSelectionChange={(keys) => {
              const value = [...keys][0] as string;
              setType(value);
              handleFilterChange();
            }}
            placeholder='All Types'
          >
            <SelectItem key='All Types'>All Types</SelectItem>
            <SelectItem key='Individual'>Individual</SelectItem>
            <SelectItem key='Team'>Team</SelectItem>
          </Select>

          <Input
            type='number'
            placeholder='Minimum Endorsements'
            value={minEndorsements}
            onChange={(event) => {
              setMinEndorsements(event.target.value);
              handleFilterChange();
            }}
            startContent={<Icon icon='lucide:star' className='text-default-400' />}
          />
        </div>
      )}

      <div className='text-default-500 flex items-center justify-between pt-4 pl-4 text-sm'>
        <span>Showing {totalExperts} experts</span>
        {/* <Button variant='light' startContent={<Icon icon='lucide:layout-grid' />}>
          Grid View
        </Button> */}
      </div>
    </div>
  );
};
