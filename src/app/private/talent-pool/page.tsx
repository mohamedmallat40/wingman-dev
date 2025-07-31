'use client';

import { useMemo, useState } from 'react';

import Container from '@/components/container/container';
import HeaderPage from '@/components/header-page/header-page';

import { SearchInput } from './components/searchInput/search-input';
import { TalentPoolCard } from './components/TalentPoolCard/talentpool-card';
import { talentData } from './data';

const Page = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    expertise: 'All Expertise',
    availability: 'Any Availability',
    type: 'All Types',
    minEndorsements: ''
  });
  const [sortBy, setSortBy] = useState('Relevance');

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

      // Minimum Endorsements filter
      const minEndorsementsNumber = Number.parseInt(filters.minEndorsements);
      const matchesMinEndorsements =
        Number.isNaN(minEndorsementsNumber) || talent.endorsements >= minEndorsementsNumber;

      return (
        matchesSearch &&
        matchesExpertise &&
        matchesAvailability &&
        matchesType &&
        matchesMinEndorsements
      );
    });

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'Relevance': {
          // For dummy data, relevance can be based on endorsements or just keep original order
          return b.endorsements - a.endorsements;
        }
        case 'Newest': {
          // For dummy data, we don't have a 'created date', so we'll just use ID as a proxy
          return Number.parseInt(b.id) - Number.parseInt(a.id);
        }
        case 'Endorsements': {
          return b.endorsements - a.endorsements;
        }
        // No default
      }
      return 0;
    });

    return filtered;
  }, [searchQuery, filters, sortBy]);

  return (
    <Container>
      <HeaderPage
        title='Talent Pool'
        description='Find and connect with the right experts for your projects.'
      />
      <div className='flex flex-col gap-4 px-4 sm:px-6 lg:px-8'>
        <SearchInput
          onSearch={setSearchQuery}
          onFilterChange={setFilters}
          onSortChange={setSortBy}
          totalExperts={filteredAndSortedTalent.length}
        />
        <div className='grid w-full grid-cols-1 justify-center gap-4 py-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4'>
          {filteredAndSortedTalent.length > 0 ? (
            filteredAndSortedTalent.map((talent) => (
              <TalentPoolCard
                key={talent.id}
                talent={{ ...talent, isTeam: talent.isTeam ?? false }}
              />
            ))
          ) : (
            <div className='text-muted-foreground col-span-full text-center'>
              No experts found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Page;
