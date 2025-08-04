'use client';

import { useEffect, useState } from 'react';

import type { Plan, RegistrationData } from '@/lib/types/auth';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { getSubscriptions } from '@root/modules/auth/services/auth.service';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import PlanSelection from './plan-selection';

interface PlanSelectionFormProperties {
  readonly onComplete: (data: Partial<RegistrationData>) => void;
  readonly onNext: (data: Partial<RegistrationData>) => void;
  readonly onBack: () => void;
  readonly initialData: Partial<RegistrationData>;
  readonly isLoading?: boolean;
  readonly showButtons?: boolean;
  readonly onFormDataChange?: (data: any) => void;
}

export default function PlanSelectionForm({
  onComplete,
  onNext,
  onBack,
  isLoading,
  initialData,
  showButtons = true,
  onFormDataChange
}: PlanSelectionFormProperties) {
  const t = useTranslations('registration');
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>(initialData.selectedPlan);
  const [plansData, setPlansData] = useState<Plan[]>([]);

  const { data: subscriptionsData, error } = useQuery<{ data: Plan[] }>({
    queryKey: ['subscriptions'],
    queryFn: getSubscriptions
  });

  useEffect(() => {
    if (!subscriptionsData?.data) return;

    const freelancerPlans =
      subscriptionsData.data.filter((plan: Plan) => plan.userCategory === 'FREELANCER') ?? [];
    setPlansData(freelancerPlans);

    // If there's a plan from URL or initial data, set it
    if (initialData.selectedPlan) {
      setSelectedPlan(initialData.selectedPlan);
    }
  }, [subscriptionsData, error, initialData.selectedPlan]);

  const handlePlanChange = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  // Update form data whenever selectedPlan changes
  useEffect(() => {
    if (onFormDataChange) {
      onFormDataChange({
        selectedPlan
      });
    }
  }, [selectedPlan, onFormDataChange]);

  const isFormValid = () => {
    return Boolean(selectedPlan);
  };

  const handleSubmit = () => {
    if (isFormValid() && selectedPlan) {
      const data: Partial<RegistrationData> = {
        selectedPlan,
        subPriceId: selectedPlan.stripePriceId ?? undefined
      };

      // If FREELANCER_EXPERT, go to billing info, otherwise complete
      if (selectedPlan.type === 'FREELANCER_EXPERT') {
        onNext(data);
      } else {
        onComplete(data);
      }
    }
  };

  return (
    <div className='flex h-full flex-col'>
      <div className='flex-1 pb-8'>
        <PlanSelection
          plans={plansData}
          selectedPlan={selectedPlan}
          onPlanChange={handlePlanChange}
        />
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
              endContent={
                !isLoading && (
                  <Icon
                    icon={
                      selectedPlan?.type === 'FREELANCER_EXPERT'
                        ? 'solar:alt-arrow-right-linear'
                        : 'solar:user-plus-bold'
                    }
                    className='h-5 w-5'
                  />
                )
              }
            >
              {isLoading
                ? t('creatingAccount')
                : selectedPlan?.type === 'FREELANCER_EXPERT'
                  ? t('continue')
                  : t('createAccount')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
