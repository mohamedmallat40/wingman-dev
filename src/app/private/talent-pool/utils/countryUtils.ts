import type { Country } from '../data/countries';

export function groupCountriesByContinent(countries: Country[]) {
  return countries.reduce(
    (groups, country) => {
      const continent = country.continent;
      if (!groups[continent]) {
        groups[continent] = [];
      }
      groups[continent].push(country);
      return groups;
    },
    {} as Record<string, Country[]>
  );
}
