'use client';

import { useEffect, useState } from 'react';

import type { AddressDetails, RegistrationData } from '@/lib/types/auth';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

import BillingAddressForm from './billing-address-form';
import TermsCheckbox from './terms-checkbox';

interface BillingFormProperties {
  readonly onComplete: (data: Partial<RegistrationData>) => void;
  readonly onBack: () => void;
  readonly initialData: Partial<RegistrationData>;
  readonly isLoading?: boolean;
  readonly showButtons?: boolean;
  readonly onFormDataChange?: (data: any) => void;
}

export default function BillingForm({
  onComplete,
  onBack,
  isLoading,
  initialData,
  showButtons = true,
  onFormDataChange
}: BillingFormProperties) {
  const t = useTranslations('registration');
  const [addressDetails, setAddressDetails] = useState<AddressDetails>(
    initialData.addressDetails ?? {
      street: '',
      city: '',
      postalCode: '',
      country: '',
      countryCode: '',
      houseNumber: '',
      VATNumber: '',
      companyName: '',
      type: 'BILLING' as const
    }
  );
  const [termsAccepted, setTermsAccepted] = useState(initialData.termsAccepted ?? false);

  const isFormValid = () => {
    return Boolean(
      addressDetails.street &&
        addressDetails.city &&
        addressDetails.postalCode &&
        addressDetails.country &&
        termsAccepted
    );
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      const data: Partial<RegistrationData> = {
        addressDetails,
        termsAccepted
      };
      onComplete(data);
    }
  };

  // Update form data whenever addressDetails or termsAccepted changes
  useEffect(() => {
    if (onFormDataChange) {
      onFormDataChange({
        addressDetails,
        termsAccepted
      });
    }
  }, [addressDetails, termsAccepted, onFormDataChange]);

  return (
    <div className='flex h-full flex-col'>
      <div className='flex-1 space-y-8 pb-8'>
        <BillingAddressForm
          addressDetails={addressDetails}
          onAddressDetailsChange={setAddressDetails}
        />

        <TermsCheckbox checked={termsAccepted} onChange={setTermsAccepted} />
      </div>

      {showButtons && (
        <div className='dark:bg-background/95 border-default-100 sticky bottom-0 mt-8 border-t bg-white/95 pt-6 backdrop-blur-xl'>
          <div className='flex justify-end gap-4'>
            <Button
              variant='light'
              size='lg'
              className='text-default-600 hover:text-primary hover:bg-default-100/50 font-medium tracking-[0.02em] transition-all duration-300'
              startContent={<Icon icon='solar:alt-arrow-left-linear' className='h-5 w-5' />}
              onPress={onBack}
            >
              {t('back')}
            </Button>

            <Button
              color='primary'
              size='lg'
              className='rounded-[18px] px-10 font-semibold tracking-[0.02em] shadow-lg transition-all duration-300 hover:shadow-xl'
              isDisabled={!isFormValid() || isLoading}
              isLoading={isLoading}
              onPress={handleSubmit}
              endContent={!isLoading && <Icon icon='solar:user-plus-bold' className='h-5 w-5' />}
            >
              {isLoading ? t('creatingAccount') : t('createAccount')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
