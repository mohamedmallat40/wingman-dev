import type { Key } from "@react-types/shared";

import React, { useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
  Avatar,
  Chip,
  Button,
} from "@heroui/react";
import { Icon } from "@iconify/react";

import { countries } from "../data/countries";
import { groupCountriesByContinent } from "../utils/countryUtils";

interface CountryFilterProps {
  selectedCountries: string[];
  onSelectionChange: (countries: string[]) => void;
  className?: string;
}

export default function CountryFilter({
  selectedCountries,
  onSelectionChange,
  className,
}: CountryFilterProps) {
  const [inputValue, setInputValue] = useState("");

  const groupedCountries = React.useMemo(
    () => groupCountriesByContinent(countries),
    [],
  );

  const handleSelection = (key: Key | null) => {
    if (!key) return;

    const keyStr = String(key);

    // Check if it's a continent selection
    if (keyStr.startsWith("continent:")) {
      const continentName = keyStr.replace("continent:", "");
      const continentCountries =
        groupedCountries[continentName]?.map((c) => c.code) || [];

      // Add all countries from this continent that aren't already selected
      const newCountries = continentCountries.filter(
        (code) => !selectedCountries.includes(code),
      );

      onSelectionChange([...selectedCountries, ...newCountries]);
    } else {
      // Individual country selection
      if (!selectedCountries.includes(keyStr)) {
        onSelectionChange([...selectedCountries, keyStr]);
      }
    }
    setInputValue("");
  };

  const handleRemoveCountry = (countryCode: string) => {
    onSelectionChange(selectedCountries.filter((code) => code !== countryCode));
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  return (
    <div className={`flex flex-col gap-3 w-full ${className || ""}`}>
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-default-700" icon="lucide:map-pin" />
        <span className="text-small font-medium text-default-700">
          Filter by Location
        </span>
      </div>

      <div style={{color: 'black'}} className="[&_input]:!text-black [&_*]:!text-black">
        <Autocomplete
          className="w-full"
          classNames={{
            trigger:
              "bg-default-100 border-1 border-transparent data-[hover=true]:bg-default-200",
            input: "text-small",
            inputWrapper: "[&_input]:!text-black [&_input]:[color:black!important]",
            clearButton: "text-default-400",
            listbox: "p-0",
            popoverContent: "p-1 bg-background border border-default-200",
          }}
        endContent={
          <Icon className="text-default-400" icon="lucide:search" width={16} />
        }
        inputValue={inputValue}
        label=""
        placeholder="Search countries..."
        size="sm"
        variant="flat"
        onInputChange={setInputValue}
        onSelectionChange={handleSelection}
      >
        {Object.entries(groupedCountries).map(
          ([continent, countriesInContinent]) => {
            const availableCountries = countriesInContinent.filter(
              (country) => !selectedCountries.includes(country.code),
            );

            if (availableCountries.length === 0) return null;

            return (
              <AutocompleteSection
                key={continent}
                className="mb-1"
                title={continent}
              >
                {/* Quick continent selection */}
                <AutocompleteItem
                  key={`continent:${continent}`}
                  className="border-b border-default-100 mb-1"
                  classNames={{
                    base: "data-[hover=true]:bg-primary-100 data-[selectable=true]:focus:bg-primary-100",
                    title: "!text-black"
                  }}
                  startContent={
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100">
                      <Icon
                        className="w-3 h-3 text-primary-600"
                        icon="lucide:globe"
                      />
                    </div>
                  }
                  textValue={`All ${continent}`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-medium !text-primary-600">
                      Select all {continent}
                    </span>
                    <span className="text-tiny text-default-400">
                      {countriesInContinent.length} countries
                    </span>
                  </div>
                </AutocompleteItem>

                {/* Individual countries */}
                {availableCountries.map((country) => (
                  <AutocompleteItem
                    key={country.code}
                    classNames={{
                      base: "data-[hover=true]:bg-primary-100 data-[selectable=true]:focus:bg-primary-100",
                      title: "!text-black"
                    }}
                    startContent={
                      <Avatar
                        alt={country.name}
                        className="w-5 h-5"
                        src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                      />
                    }
                    textValue={country.name}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="!text-black">{country.name}</span>
                      <span className="text-tiny !text-gray-600">
                        {country.code}
                      </span>
                    </div>
                  </AutocompleteItem>
                ))}
              </AutocompleteSection>
            );
          },
        )}
      </Autocomplete>
      </div>

      {selectedCountries.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-small text-default-600">
              {selectedCountries.length} countr
              {selectedCountries.length === 1 ? "y" : "ies"} selected
            </span>
            <Button
              className="h-6 min-w-unit-16 text-tiny"
              color="danger"
              size="sm"
              variant="light"
              onPress={handleClearAll}
            >
              Clear all
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto p-2 border border-default-200 rounded-medium">
            {selectedCountries.map((countryCode) => {
              const country = countries.find((c) => c.code === countryCode);

              return (
                <Chip
                  key={countryCode}
                  avatar={
                    <Avatar
                      alt={country?.name}
                      className="w-5 h-5"
                      src={`https://flagcdn.com/${countryCode.toLowerCase()}.svg`}
                    />
                  }
                  color="primary"
                  size="sm"
                  variant="flat"
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