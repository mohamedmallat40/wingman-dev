import React, { useMemo, useState } from 'react';

import type { Country } from '../../data/countries';

import { Autocomplete, AutocompleteItem, Avatar, Button, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

import { groupCountriesByContinent } from '../../utils/countryUtils';

interface CountryFilterProps {
  selectedCountries: string[];
  onSelectionChange: (countries: string[]) => void;
  className?: string;
  countries?: Country[];
}

type CountryItem = {
  key: string;
  name: string;
  code: string;
  continent: string;
  type: 'continent' | 'country';
};

export default function CountryFilter({
  selectedCountries,
  onSelectionChange,
  className,
  countries
}: Readonly<CountryFilterProps>) {
  const t = useTranslations();
  const [inputValue, setInputValue] = useState('');

  const groupedCountries = useMemo(() => groupCountriesByContinent(countries ?? []), [countries]);

  const items = useMemo((): CountryItem[] => {
    const flatItems: CountryItem[] = [];

    Object.entries(groupedCountries).forEach(([continent, countriesInContinent]) => {
      const availableCountries = countriesInContinent.filter(
        (country: Country) => !selectedCountries.includes(country.code)
      );

      if (availableCountries.length === 0) return;

      // Add continent selection option
      flatItems.push({
        key: `continent:${continent}`,
        name: `All ${continent}`,
        code: `ALL_${continent.toUpperCase()}`,
        continent,
        type: 'continent'
      });

      // Add individual countries
      availableCountries.forEach((country: Country) => {
        flatItems.push({
          key: country.code,
          name: country.name,
          code: country.code,
          continent,
          type: 'country'
        });
      });
    });

    return flatItems;
  }, [groupedCountries, selectedCountries]);
  const filteredItems = useMemo(() => {
    if (!inputValue.trim()) return items;
    const lower = inputValue.toLowerCase();

    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.code.toLowerCase().includes(lower) ||
        item.continent.toLowerCase().includes(lower)
    );
  }, [items, inputValue]);
  const handleSelection = (key: React.Key | null) => {
    if (!key) return;

    const keyStr = String(key);

    // Check if it's a continent selection
    if (keyStr.startsWith('continent:')) {
      const continentName = keyStr.replace('continent:', '');
      const continentCountries = groupedCountries[continentName]?.map((c: Country) => c.code) || [];

      // Add all countries from this continent that aren't already selected
      const newCountries = continentCountries.filter(
        (code: string) => !selectedCountries.includes(code)
      );

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
    <div className={`space-y-3 ${className}`}>
      <div>
        <Autocomplete
          className='w-full'
          classNames={{
            base: 'bg-default-100 border-1 border-transparent data-[hover=true]:bg-default-200',
            clearButton: 'text-default-400',
            listbox: 'p-0',
            popoverContent: 'p-1 bg-background border border-default-200'
          }}
          endContent={<Icon className='text-default-400' icon='lucide:search' width={16} />}
          inputValue={inputValue}
          items={filteredItems}
          label=''
          placeholder={t('talentPool.filters.country.placeholder')}
          size='sm'
          variant='flat'
          onInputChange={setInputValue}
          onSelectionChange={handleSelection}
        >
          {(item) => (
            <AutocompleteItem
              key={item.key}
              startContent={
                item.type === 'continent' ? (
                  <div className='bg-primary-100 flex h-6 w-6 items-center justify-center rounded-full'>
                    <Icon className='text-primary-600 h-3 w-3' icon='lucide:globe' />
                  </div>
                ) : (
                  <Avatar
                    alt={item.name}
                    className='h-5 w-5'
                    src={`https://flagcdn.com/${item.code.toLowerCase()}.svg`}
                  />
                )
              }
              textValue={item.name}
              className={item.type === 'continent' ? 'border-default-100 mb-1 border-b' : ''}
            >
              <div className='flex w-full items-center justify-between'>
                <span
                  className={
                    item.type === 'continent' ? 'text-primary-600 font-medium' : 'text-foreground'
                  }
                >
                  {item.type === 'continent'
                    ? t('talentPool.filters.country.selectAll', { continent: item.continent })
                    : item.name}
                </span>
                <span className='text-tiny text-default-500'>
                  {item.type === 'continent'
                    ? `${groupedCountries[item.continent]?.length || 0} countries`
                    : item.code}
                </span>
              </div>
            </AutocompleteItem>
          )}
        </Autocomplete>
      </div>

      {selectedCountries.length > 0 && (
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between'>
            <span className='text-small text-default-600'>
              {t('talentPool.filters.country.selected', { count: selectedCountries.length })}
            </span>
            <Button
              size='sm'
              variant='light'
              color='danger'
              onPress={handleClearAll}
              className='text-danger hover:bg-danger/10'
              startContent={<Icon icon='solar:trash-bin-minimalistic-linear' width={14} />}
            >
              {t('talentPool.filters.country.clearAll')}
            </Button>
          </div>

          <div className='border-default-200 rounded-medium flex max-h-[100px] flex-wrap gap-2 overflow-y-auto border p-2'>
            {selectedCountries.map((countryCode) => {
              const country = countries?.find((c: Country) => c.code === countryCode);

              return (
                <Chip
                  key={countryCode}
                  size='sm'
                  variant='flat'
                  color='primary'
                  onClose={() => handleRemoveCountry(countryCode)}
                  startContent={
                    <Avatar
                      alt={country?.name}
                      className='h-4 w-4'
                      src={`https://flagcdn.com/${countryCode.toLowerCase()}.svg`}
                    />
                  }
                >
                  {country?.name || countryCode}
                </Chip>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
