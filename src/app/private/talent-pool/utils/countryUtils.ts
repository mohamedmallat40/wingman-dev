import type { Country } from '../data/countries';

export interface GroupedCountries {
  [continent: string]: Country[];
}

export const groupCountriesByContinent = (countries: Country[]): GroupedCountries => {
  return countries.reduce((acc, country) => {
    if (!acc[country.continent]) {
      acc[country.continent] = [];
    }
    acc[country.continent]!.push(country);
    return acc;
  }, {} as GroupedCountries);
};

export const getCountryByCode = (countries: Country[], code: string): Country | undefined => {
  return countries.find((country) => country.code === code);
};

export const searchCountries = (countries: Country[], query: string): Country[] => {
  const lowercaseQuery = query.toLowerCase();
  return countries.filter(
    (country) =>
      country.name.toLowerCase().includes(lowercaseQuery) ||
      country.code.toLowerCase().includes(lowercaseQuery) ||
      country.continent.toLowerCase().includes(lowercaseQuery)
  );
};
