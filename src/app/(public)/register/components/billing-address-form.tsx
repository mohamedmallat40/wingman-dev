'use client';

import { useState } from 'react';

import { Input, Select, SelectItem } from '@heroui/react';
import { Icon } from '@iconify/react';
import { checkValidEUVAT } from '@root/modules/auth/services/auth.service';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import frLocale from 'i18n-iso-countries/langs/fr.json';
import nlLocale from 'i18n-iso-countries/langs/nl.json';
import { useLocale } from 'next-intl';

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

const getCountryList = (locale: 'en' | 'fr' | 'nl') => {
  const names = countries.getNames(locale, { select: 'official' });
  return Object.entries(names).map(([code, name]) => ({
    code,
    name
  }));
};

export default function BillingAddressForm({
  addressDetails,
  onAddressDetailsChange
}: Readonly<BillingAddressFormProperties>) {
  const locale = useLocale() as 'en' | 'fr' | 'nl';
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
    <div className='space-y-4'>
      <div>
        <h2 className='mb-1 text-lg font-semibold text-gray-900 dark:text-white'>
          Billing Address
        </h2>
        <p className='text-sm text-gray-600 dark:text-gray-400'>Required for Expert plan billing</p>
      </div>
      <div className='space-y-3'>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
          <Input
            type='text'
            label='VAT Number'
            placeholder='BE12345678'
            value={addressDetails.VATNumber ?? ''}
            onChange={(event: { target: { value: string } }) => {
              void handleVATChange(event.target.value);
            }}
            startContent={
              <Icon icon='solar:document-text-outline' className='text-default-400' width={18} />
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
            size='sm'
            isInvalid={!!vatError}
            errorMessage={vatError}
            isDisabled={isValidatingVAT}
          />
          <Input
            type='text'
            label='Company name'
            placeholder='Enter your company name'
            value={addressDetails.companyName}
            onChange={(event: { target: { value: string } }) => {
              updateAddress('companyName', event.target.value);
            }}
            startContent={
              <Icon icon='solar:construction-outline' className='text-default-400' width={18} />
            }
            size='sm'
          />
        </div>
      </div>
      <div className='space-y-3'>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
          <Input
            type='text'
            label='Street Address'
            placeholder='Enter your street address'
            value={addressDetails.street}
            onChange={(event: { target: { value: string } }) => {
              updateAddress('street', event.target.value);
            }}
            startContent={
              <Icon icon='solar:home-outline' className='text-default-400' width={18} />
            }
            size='sm'
            isRequired
          />
          <Input
            type='text'
            label='House number'
            placeholder='Enter your house number'
            value={addressDetails.houseNumber}
            onChange={(event: { target: { value: string } }) => {
              updateAddress('houseNumber', event.target.value);
            }}
            startContent={
              <Icon icon='solar:home-outline' className='text-default-400' width={18} />
            }
            size='sm'
            isRequired
          />
        </div>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
          <Input
            type='text'
            label='City'
            placeholder='Enter your city'
            value={addressDetails.city}
            onChange={(event: { target: { value: string } }) => {
              updateAddress('city', event.target.value);
            }}
            startContent={
              <Icon icon='solar:city-outline' className='text-default-400' width={18} />
            }
            size='sm'
            isRequired
          />

          <Input
            type='text'
            label='Postal Code'
            placeholder='Enter postal code'
            value={addressDetails.postalCode}
            onChange={(event: { target: { value: string } }) => {
              updateAddress('postalCode', event.target.value);
            }}
            startContent={
              <Icon icon='solar:mailbox-outline' className='text-default-400' width={18} />
            }
            size='sm'
            isRequired
          />
        </div>

        <Select
          label='Country'
          placeholder='Select your country'
          selectedKeys={selectedCountryCode ? [selectedCountryCode] : []}
          onSelectionChange={(keys) => {
            const selectedKey = [...keys][0] as string;
            updateAddress('countryCode', selectedKey);
            // Clear VAT error when country changes
            setVatError('');
          }}
          startContent={
            <Icon icon='solar:global-outline' className='text-default-400' width={20} />
          }
          isRequired
        >
          {countryList.map((country) => (
            <SelectItem key={country.code}>{country.name}</SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
}
