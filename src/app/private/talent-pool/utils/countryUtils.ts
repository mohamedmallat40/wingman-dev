import type { Country } from "../data/countries";

export function groupCountriesByContinent(countries: Country[]) {
  return countries.reduce((groups, country) => {
    const continent = country.continent;
    if (!groups[continent]) {
      groups[continent] = [];
    }
    groups[continent].push(country);
    return groups;
  }, {} as Record<string, Country[]>);
}

export function getCountryByCode(countries: Country[], code: string): Country | undefined {
  return countries.find(country => country.code === code);
}

export function getCountriesByCodes(countries: Country[], codes: string[]): Country[] {
  return codes.map(code => getCountryByCode(countries, code)).filter(Boolean) as Country[];
}

export function searchCountries(countries: Country[], query: string): Country[] {
  const lowerQuery = query.toLowerCase();
  return countries.filter(country => 
    country.name.toLowerCase().includes(lowerQuery) ||
    country.code.toLowerCase().includes(lowerQuery)
  );
}