'use client';

import { useState } from 'react';

import { Autocomplete, AutocompleteItem, Input } from '@heroui/react';
import { Icon } from '@iconify/react';
import { checkValidEUVAT } from '@root/modules/auth/services/auth.service';
import { motion } from 'framer-motion';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import frLocale from 'i18n-iso-countries/langs/fr.json';
import nlLocale from 'i18n-iso-countries/langs/nl.json';
import { useLocale, useTranslations } from 'next-intl';

import { type AddressDetails } from '@/lib/types/auth';
import { parseAddress } from '@/lib/utils/utilities';

countries.registerLocale(enLocale);
countries.registerLocale(frLocale);
countries.registerLocale(nlLocale);

interface BillingAddressFormProperties {
  addressDetails: AddressDetails;
  onAddressDetailsChange: (address: AddressDetails) => void;
}
interface VATValidationResponse {
  data: {
    valid: boolean;
    address?: string;
    name?: string;
  };
}

// VAT validation utility
const isValidVAT = (vat: string) => {
  const vatRegex = /^[A-Z]{2}[0-9A-Z]+$/;
  const cleaned = vat.replaceAll(/\s/g, '').toUpperCase();
  return {
    valid: vatRegex.test(cleaned),
    cleaned: cleaned
  };
};

const getFallbackCountries = (locale: 'en' | 'fr' | 'nl') => {
  const countries = {
    en: [
      { code: 'US', name: 'United States' },
      { code: 'GB', name: 'United Kingdom' },
      { code: 'CA', name: 'Canada' },
      { code: 'DE', name: 'Germany' },
      { code: 'FR', name: 'France' },
      { code: 'NL', name: 'Netherlands' },
      { code: 'ES', name: 'Spain' },
      { code: 'IT', name: 'Italy' },
      { code: 'AU', name: 'Australia' },
      { code: 'JP', name: 'Japan' }
    ],
    fr: [
      { code: 'US', name: 'États-Unis' },
      { code: 'GB', name: 'Royaume-Uni' },
      { code: 'CA', name: 'Canada' },
      { code: 'DE', name: 'Allemagne' },
      { code: 'FR', name: 'France' },
      { code: 'NL', name: 'Pays-Bas' },
      { code: 'ES', name: 'Espagne' },
      { code: 'IT', name: 'Italie' },
      { code: 'AU', name: 'Australie' },
      { code: 'JP', name: 'Japon' }
    ],
    nl: [
      { code: 'US', name: 'Verenigde Staten' },
      { code: 'GB', name: 'Verenigd Koninkrijk' },
      { code: 'CA', name: 'Canada' },
      { code: 'DE', name: 'Duitsland' },
      { code: 'FR', name: 'Frankrijk' },
      { code: 'NL', name: 'Nederland' },
      { code: 'ES', name: 'Spanje' },
      { code: 'IT', name: 'Italië' },
      { code: 'AU', name: 'Australië' },
      { code: 'JP', name: 'Japan' }
    ]
  };

  return countries[locale].map((country) => ({
    ...country,
    flag: `https://flagcdn.com/w40/${country.code.toLowerCase()}.png`
  }));
};

const getCountryList = (locale: 'en' | 'fr' | 'nl') => {
  try {
    const names = countries.getNames(locale, { select: 'official' });

    if (!names || Object.keys(names).length === 0) {
      console.warn('No countries loaded from i18n, using fallback');
      return getFallbackCountries(locale);
    }

    return Object.entries(names)
      .map(([code, name]) => ({
        code,
        name,
        flag: `https://flagcdn.com/w40/${code.toLowerCase()}.png`
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error loading countries:', error);
    return getFallbackCountries(locale);
  }
};

const getPlaceholderText = (locale: 'en' | 'fr' | 'nl') => {
  const placeholders = {
    en: 'Select your country',
    fr: 'Sélectionnez votre pays',
    nl: 'Selecteer uw land'
  };
  return placeholders[locale];
};

export default function BillingAddressForm({
  addressDetails,
  onAddressDetailsChange
}: Readonly<BillingAddressFormProperties>) {
  const locale = useLocale() as 'en' | 'fr' | 'nl';
  const t = useTranslations('billing');
  const [vatError, setVatError] = useState<string>('');
  const [isValidatingVAT, setIsValidatingVAT] = useState<boolean>(false);
  const [wasAutoPopulated, setWasAutoPopulated] = useState<boolean>(false);

  const getCountryCodeFromName = (countryName: string) => {
    const countryList = getCountryList(locale);
    const country = countryList.find((c) => c.name === countryName);
    return country?.code ?? '';
  };

  const getCountryNameFromCode = (countryCode: string) => {
    return countries.getName(countryCode, locale, { select: 'official' }) ?? '';
  };

  const selectedCountryCode =
    addressDetails.countryCode ||
    (addressDetails.country ? getCountryCodeFromName(addressDetails.country) : '');

  const countryList = getCountryList(locale);

  const updateAddress = (field: keyof AddressDetails, value: string) => {
    if (field === 'countryCode') {
      const countryName = getCountryNameFromCode(value);
      onAddressDetailsChange({
        ...addressDetails,
        country: countryName,
        countryCode: value
      });
    } else {
      onAddressDetailsChange({
        ...addressDetails,
        [field]: value
      });
    }
  };

  const clearAutoPopulatedFields = () => {
    if (wasAutoPopulated) {
      onAddressDetailsChange({
        ...addressDetails,
        street: '',
        houseNumber: '',
        city: '',
        postalCode: '',
        country: '',
        countryCode: '',
        VATNumber: ''
      });
      setWasAutoPopulated(false);
    }
  };

  const validateAndPopulateVAT = async (vatNumber: string) => {
    try {
      setIsValidatingVAT(true);
      setVatError('');

      // Extract country code (first 2 characters) and VAT number (rest)
      const countryCode = vatNumber.slice(0, 2);
      const vatNumberOnly = vatNumber.slice(2);

      // Call the EU VAT validation service
      const response = (await checkValidEUVAT(countryCode, vatNumberOnly)) as VATValidationResponse;

      if (response.data.valid) {
        if (response.data.address) {
          const parsedAddress = parseAddress(response.data.address);

          // Get country name from country code
          const countryName = getCountryNameFromCode(countryCode);

          onAddressDetailsChange({
            ...addressDetails,
            VATNumber: vatNumber,
            street: parsedAddress.street,
            houseNumber: parsedAddress.houseNumber,
            city: parsedAddress.city,
            postalCode: parsedAddress.postalCode,
            country: countryName,
            countryCode: countryCode,
            companyName: response.data.name ?? ''
          });

          setWasAutoPopulated(true);
        } else {
          // Valid VAT but no address info
          updateAddress('VATNumber', vatNumber);
          updateAddress('countryCode', countryCode);
        }
      } else {
        setVatError('VAT number is not valid in the EU VAT database');
        updateAddress('VATNumber', vatNumber);
      }
    } catch (error) {
      console.error('VAT validation error:', error);
      setVatError('Error validating VAT number. Please try again.');
      updateAddress('VATNumber', vatNumber);
    } finally {
      setIsValidatingVAT(false);
    }
  };

  const handleVATChange = async (value: string) => {
    setVatError('');

    if (!value.trim()) {
      clearAutoPopulatedFields();
      updateAddress('VATNumber', '');
      return;
    }

    const generalValidation = isValidVAT(value);

    if (value.length >= 4) {
      if (!generalValidation.valid) {
        setVatError('VAT format should be country code + number (e.g., FR12345678901)');
        clearAutoPopulatedFields();
        updateAddress('VATNumber', value.toUpperCase());
        return;
      }

      // Format is valid, now validate against EU VAT database
      await validateAndPopulateVAT(generalValidation.cleaned);
    } else {
      // Too short to validate
      clearAutoPopulatedFields();
      updateAddress('VATNumber', value.toUpperCase());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='space-y-6'
    >
      <div className='space-y-4'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <Input
            type='text'
            placeholder={t('vatNumber')}
            value={addressDetails.VATNumber ?? ''}
            onChange={(event: { target: { value: string } }) => {
              void handleVATChange(event.target.value);
            }}
            variant='bordered'
            classNames={{
              base: 'w-full',
              mainWrapper: 'w-full',
              inputWrapper:
                'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] h-14 bg-white dark:bg-background transition-all duration-300',
              input:
                'text-foreground font-normal tracking-[0.02em] placeholder:text-default-400 text-base'
            }}
            startContent={
              <Icon
                icon='solar:document-text-linear'
                className='text-default-400 h-5 w-5 flex-shrink-0'
              />
            }
            endContent={
              isValidatingVAT && (
                <Icon
                  icon='solar:refresh-outline'
                  className='text-default-400 animate-spin'
                  width={18}
                />
              )
            }
            isInvalid={!!vatError}
            errorMessage={vatError}
            isDisabled={isValidatingVAT}
          />
          <Input
            type='text'
            placeholder={t('companyName')}
            value={addressDetails.companyName}
            onChange={(event: { target: { value: string } }) => {
              updateAddress('companyName', event.target.value);
            }}
            variant='bordered'
            classNames={{
              base: 'w-full',
              mainWrapper: 'w-full',
              inputWrapper:
                'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] h-14 bg-white dark:bg-background transition-all duration-300',
              input:
                'text-foreground font-normal tracking-[0.02em] placeholder:text-default-400 text-base'
            }}
            startContent={
              <Icon
                icon='solar:buildings-linear'
                className='text-default-400 h-5 w-5 flex-shrink-0'
              />
            }
          />
        </div>
      </div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <Input
          type='text'
          placeholder={t('streetAddress')}
          value={addressDetails.street}
          onChange={(event: { target: { value: string } }) => {
            updateAddress('street', event.target.value);
          }}
          variant='bordered'
          classNames={{
            base: 'w-full',
            mainWrapper: 'w-full',
            inputWrapper:
              'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] h-14 bg-white dark:bg-background transition-all duration-300',
            input:
              'text-foreground font-normal tracking-[0.02em] placeholder:text-default-400 text-base'
          }}
          startContent={
            <Icon icon='solar:home-linear' className='text-default-400 h-5 w-5 flex-shrink-0' />
          }
          isRequired
        />
        <Input
          type='text'
          placeholder={t('houseNumber')}
          value={addressDetails.houseNumber}
          onChange={(event: { target: { value: string } }) => {
            updateAddress('houseNumber', event.target.value);
          }}
          variant='bordered'
          classNames={{
            base: 'w-full',
            mainWrapper: 'w-full',
            inputWrapper:
              'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] h-14 bg-white dark:bg-background transition-all duration-300',
            input:
              'text-foreground font-normal tracking-[0.02em] placeholder:text-default-400 text-base'
          }}
          startContent={
            <Icon icon='solar:hashtag-linear' className='text-default-400 h-5 w-5 flex-shrink-0' />
          }
          isRequired
        />
      </div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <Input
          type='text'
          placeholder={t('city')}
          value={addressDetails.city}
          onChange={(event: { target: { value: string } }) => {
            updateAddress('city', event.target.value);
          }}
          variant='bordered'
          classNames={{
            base: 'w-full',
            mainWrapper: 'w-full',
            inputWrapper:
              'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] h-14 bg-white dark:bg-background transition-all duration-300',
            input:
              'text-foreground font-normal tracking-[0.02em] placeholder:text-default-400 text-base'
          }}
          startContent={
            <Icon icon='solar:city-linear' className='text-default-400 h-5 w-5 flex-shrink-0' />
          }
          isRequired
        />

        <Input
          type='text'
          placeholder={t('postalCode')}
          value={addressDetails.postalCode}
          onChange={(event: { target: { value: string } }) => {
            updateAddress('postalCode', event.target.value);
          }}
          variant='bordered'
          classNames={{
            base: 'w-full',
            mainWrapper: 'w-full',
            inputWrapper:
              'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] h-14 bg-white dark:bg-background transition-all duration-300',
            input:
              'text-foreground font-normal tracking-[0.02em] placeholder:text-default-400 text-base'
          }}
          startContent={
            <Icon icon='solar:mailbox-linear' className='text-default-400 h-5 w-5 flex-shrink-0' />
          }
          isRequired
        />
      </div>

      {countryList.length > 0 ? (
        <Autocomplete
          placeholder={getPlaceholderText(locale)}
          selectedKey={selectedCountryCode || null}
          onSelectionChange={(key) => {
            if (key) {
              updateAddress('countryCode', key as string);
              setVatError('');
            }
          }}
          variant='bordered'
          allowsCustomValue={false}
          menuTrigger='focus'
          classNames={{
            base: 'w-full border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] h-[66px] bg-white dark:bg-background transition-all duration-300',
            selectorButton:
              'text-foreground font-normal tracking-[0.02em] placeholder:text-default-400 text-base'
          }}
          startContent={
            selectedCountryCode ? (
              <img
                src={`https://flagcdn.com/w40/${selectedCountryCode.toLowerCase()}.png`}
                alt={`${selectedCountryCode} flag`}
                className='h-5 w-5 flex-shrink-0 object-cover'
              />
            ) : (
              <Icon icon='solar:global-linear' className='text-default-400 h-5 w-5 flex-shrink-0' />
            )
          }
          isRequired
        >
          {countryList.map((country) => (
            <AutocompleteItem
              key={country.code}
              textValue={country.name}
              startContent={
                <img
                  src={country.flag}
                  alt={`${country.name} flag`}
                  className='h-5 w-5 flex-shrink-0 object-cover'
                />
              }
            >
              {country.name}
            </AutocompleteItem>
          ))}
        </Autocomplete>
      ) : (
        <div className='border-default-300 flex h-[66px] w-full items-center justify-center rounded-[16px] border'>
          <span className='text-default-500'>Loading countries...</span>
        </div>
      )}
    </motion.div>
  );
}
