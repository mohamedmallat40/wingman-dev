import React, { useState } from 'react';

import type { Key } from '@react-types/shared';

import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
  Avatar,
  Button,
  Chip
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

import { countries } from '../data/countries';
import { groupCountriesByContinent } from '../utils/countryUtils';

interface CountryFilterProps {
  selectedCountries: string[];
  onSelectionChange: (countries: string[]) => void;
  className?: string;
}

export default function CountryFilter({
  selectedCountries,
  onSelectionChange,
  className
}: CountryFilterProps) {
  const t = useTranslations();
  const [inputValue, setInputValue] = useState('');

  const groupedCountries = React.useMemo(() => groupCountriesByContinent(countries), []);

  const handleSelection = (key: Key | null) => {
    if (!key) return;

    const keyStr = String(key);

    // Check if it's a continent selection
    if (keyStr.startsWith('continent:')) {
      const continentName = keyStr.replace('continent:', '');
      const continentCountries = groupedCountries[continentName]?.map((c) => c.code) || [];

      // Add all countries from this continent that aren't already selected
      const newCountries = continentCountries.filter((code) => !selectedCountries.includes(code));

      onSelectionChange([...selectedCountries, ...newCountries]);
    } else {
      // Individual country selection
      if (!selectedCountries.includes(keyStr)) {
        onSelectionChange([...selectedCountries, keyStr]);
      }
    }
    setInputValue('');
  };

  const handleRemoveCountry = (countryCode: string) => {
    onSelectionChange(selectedCountries.filter((code) => code !== countryCode));
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  return (
    <div className={`flex w-full flex-col gap-3 ${className || ''}`}>
      <div className='w-full'>
        <Autocomplete
          className='w-full'
          classNames={{
            trigger: 'bg-default-100 border-1 border-transparent data-[hover=true]:bg-default-200',
            input: 'text-small text-foreground',
            inputWrapper: 'data-[focus=true]:border-primary',
            clearButton: 'text-default-400',
            listbox: 'p-0',
            popoverContent: 'p-1 bg-background border border-default-200'
          }}
          endContent={<Icon className='text-default-400' icon='lucide:search' width={16} />}
          inputValue={inputValue}
          label=''
          placeholder={t('talentPool.filters.country.placeholder')}
          size='sm'
          variant='flat'
          onInputChange={setInputValue}
          onSelectionChange={handleSelection}
        >
          {Object.entries(groupedCountries).map(([continent, countriesInContinent]) => {
            const availableCountries = countriesInContinent.filter(
              (country) => !selectedCountries.includes(country.code)
            );

            if (availableCountries.length === 0) return null;

            return (
              <AutocompleteSection key={continent} className='mb-1' title={continent}>
                {/* Quick continent selection */}
                <AutocompleteItem
                  key={`continent:${continent}`}
                  className='border-default-100 mb-1 border-b'
                  classNames={{
                    base: 'data-[hover=true]:bg-primary-100 data-[selectable=true]:focus:bg-primary-100',
                    title: 'text-foreground'
                  }}
                  startContent={
                    <div className='bg-primary-100 flex h-6 w-6 items-center justify-center rounded-full'>
                      <Icon className='text-primary-600 h-3 w-3' icon='lucide:globe' />
                    </div>
                  }
                  textValue={`All ${continent}`}
                >
                  <div className='flex w-full items-center justify-between'>
                    <span className='text-primary-600 font-medium'>
                      {t('talentPool.filters.country.selectAll', { continent })}
                    </span>
                    <span className='text-tiny text-default-500'>
                      {countriesInContinent.length} countries
                    </span>
                  </div>
                </AutocompleteItem>

                {/* Individual countries */}
                {availableCountries.map((country) => (
                  <AutocompleteItem
                    key={country.code}
                    classNames={{
                      base: 'data-[hover=true]:bg-primary-100 data-[selectable=true]:focus:bg-primary-100',
                      title: 'text-foreground'
                    }}
                    startContent={
                      <Avatar
                        alt={country.name}
                        className='h-5 w-5'
                        src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                      />
                    }
                    textValue={country.name}
                  >
                    <div className='flex w-full items-center justify-between'>
                      <span className='text-foreground'>{country.name}</span>
                      <span className='text-tiny text-default-500'>{country.code}</span>
                    </div>
                  </AutocompleteItem>
                ))}
              </AutocompleteSection>
            );
          })}
        </Autocomplete>
      </div>

      {selectedCountries.length > 0 && (
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between'>
            <span className='text-small text-default-600'>
              {t('talentPool.filters.country.selected', { count: selectedCountries.length })}
            </span>
            <Button
              className='min-w-unit-16 text-tiny h-6'
              color='danger'
              size='sm'
              variant='light'
              onPress={handleClearAll}
            >
              {t('talentPool.filters.country.clearAll')}
            </Button>
          </div>

          <div className='border-default-200 rounded-medium flex max-h-[100px] flex-wrap gap-2 overflow-y-auto border p-2'>
            {selectedCountries.map((countryCode) => {
              const country = countries.find((c) => c.code === countryCode);

              return (
                <Chip
                  key={countryCode}
                  avatar={
                    <Avatar
                      alt={country?.name}
                      className='h-5 w-5'
                      src={`https://flagcdn.com/${countryCode.toLowerCase()}.svg`}
                    />
                  }
                  color='primary'
                  size='sm'
                  variant='flat'
                  onClose={() => handleRemoveCountry(countryCode)}
                >
                  {country?.name}
                </Chip>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
