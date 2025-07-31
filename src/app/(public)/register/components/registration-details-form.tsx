'use client';

import { useEffect, useState } from 'react';

import type { Plan, RegistrationData } from '@/lib/types/auth';
import type React from 'react';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { getSubscriptions } from '@root/modules/auth/services/auth.service';
import { useQuery } from '@tanstack/react-query';

import BillingAddressForm from './billing-address-form';
import CategorySelection from './category-selection';
import PersonalInfoForm from './personal-info-form';
import PlanSelection from './plan-selection';
import TermsCheckbox from './terms-checkbox';

interface RegistrationDetailsFormProperties {
  readonly onComplete: (data: Partial<RegistrationData>) => void;
  readonly onBack: () => void;
  readonly initialData: Partial<RegistrationData> & { subscriptionTypeFromUrl?: string | null };
  readonly isLoading?: boolean;
}

export default function RegistrationDetailsForm({
  onComplete,
  isLoading,
  initialData
}: RegistrationDetailsFormProperties) {
  const [firstName, setFirstName] = useState(initialData.firstName ?? '');
  const [lastName, setLastName] = useState(initialData.lastName ?? '');
  const [kind, setKind] = useState(initialData.kind ?? '');
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>(initialData.selectedPlan);
  const [addressDetails, setAddressDetails] = useState(
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
  const [plansData, setPlansData] = useState<Plan[]>([]);
  const [categoriesData, setCategoriesData] = useState<Plan[]>([]);

  const { data: subscriptionsData, error } = useQuery<{ data: Plan[] }>({
    queryKey: ['subscriptions'],
    queryFn: getSubscriptions
  });

  useEffect(() => {
    if (!subscriptionsData?.data) return;

    const categories = [
      ...new Map(subscriptionsData.data.map((sub) => [sub.userCategory, sub])).values()
    ];
    setCategoriesData(categories);

    const freelancerPlans =
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      subscriptionsData.data.filter((plan: Plan) => plan.userCategory === 'FREELANCER') ?? [];
    setPlansData(freelancerPlans);

    // Resolve subscription type from URL to actual Plan object
    if (initialData.subscriptionTypeFromUrl && !selectedPlan) {
      const planFromUrl = subscriptionsData.data.find(
        (plan) => plan.type === initialData.subscriptionTypeFromUrl
      );
      if (planFromUrl) {
        setSelectedPlan(planFromUrl);
      }
    } else if (initialData.selectedPlan) {
      // This handles the case where selectedPlan is already a Plan object
      setSelectedPlan(initialData.selectedPlan);
    }
  }, [
    error,
    initialData.subscriptionTypeFromUrl,
    initialData.selectedPlan,
    subscriptionsData,
    selectedPlan
  ]);

  const handleKindChange = (newKind: string) => {
    setKind(newKind);
    if (newKind !== 'FREELANCER') {
      setSelectedPlan(undefined);
      setAddressDetails({
        street: '',
        city: '',
        postalCode: '',
        country: '',
        countryCode: '',
        houseNumber: '',
        VATNumber: '',
        companyName: '',
        type: 'BILLING' as const
      });
    }
  };

  const handlePlanChange = (plan: Plan) => {
    setSelectedPlan(plan);
    if (plan.type !== 'FREELANCER_EXPERT') {
      setAddressDetails({
        street: '',
        city: '',
        postalCode: '',
        country: '',
        countryCode: '',
        houseNumber: '',
        VATNumber: '',
        companyName: '',
        type: 'BILLING' as const
      });
    }
  };

  const isFormValid = () => {
    const basicValid =
      Boolean(firstName) && Boolean(lastName) && Boolean(kind) && Boolean(termsAccepted);

    if (kind === 'FREELANCER') {
      if (!selectedPlan) return false;

      if (selectedPlan.type === 'FREELANCER_EXPERT') {
        return (
          basicValid &&
          Boolean(addressDetails.street) &&
          Boolean(addressDetails.city) &&
          Boolean(addressDetails.postalCode) &&
          Boolean(addressDetails.country)
        );
      }
      return basicValid;
    }
    return basicValid;
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      const data: Partial<RegistrationData> = {
        firstName,
        lastName,
        kind: kind as 'FREELANCER' | 'COMPANY' | 'AGENCY',
        selectedPlan,
        ...(selectedPlan?.type === 'FREELANCER_EXPERT' && {
          subPriceId: selectedPlan.stripePriceId ?? undefined,
          addressDetails: addressDetails
        })
      };
      onComplete(data);
    }
  };

  const showPlanSelection = kind === 'FREELANCER';
  const showBillingAddress = selectedPlan?.type === 'FREELANCER_EXPERT';

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-1'>
        <CategorySelection
          categories={categoriesData}
          selectedCategory={kind}
          onCategoryChange={handleKindChange}
        />

        <PersonalInfoForm
          firstName={firstName}
          lastName={lastName}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
        />
        {showPlanSelection && (
          <PlanSelection
            plans={plansData}
            selectedPlan={selectedPlan}
            onPlanChange={handlePlanChange}
          />
        )}

        {showBillingAddress && (
          <BillingAddressForm
            addressDetails={addressDetails}
            onAddressDetailsChange={setAddressDetails}
          />
        )}
      </div>

      <TermsCheckbox checked={termsAccepted} onChange={setTermsAccepted} />

      <div className='flex gap-4'>
        <Button
          color='primary'
          size='lg'
          className='flex-1 font-medium'
          isDisabled={!isFormValid() || isLoading}
          onPress={handleSubmit}
        >
          Create Account
          <Icon icon='solar:user-plus-outline' width={20} />
        </Button>
      </div>
    </div>
  );
}
