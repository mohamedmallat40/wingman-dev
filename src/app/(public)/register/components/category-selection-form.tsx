'use client';

import { useEffect, useState } from 'react';

import type { Plan, RegistrationData } from '@/lib/types/auth';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { getSubscriptions } from '@root/modules/auth/services/auth.service';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import CategorySelection from './category-selection';

interface CategorySelectionFormProperties {
  readonly onComplete: (data: Partial<RegistrationData>) => void;
  readonly onNext: (data: Partial<RegistrationData>) => void;
  readonly onBack: () => void;
  readonly initialData: Partial<RegistrationData> & { subscriptionTypeFromUrl?: string | null };
  readonly isLoading?: boolean;
  readonly showButtons?: boolean;
  readonly onFormDataChange?: (data: any) => void;
}

export default function CategorySelectionForm({
  onComplete,
  onNext,
  onBack,
  isLoading,
  initialData,
  showButtons = true,
  onFormDataChange
}: CategorySelectionFormProperties) {
  const t = useTranslations('registration');
  const [kind, setKind] = useState(initialData.kind ?? '');
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
  }, [subscriptionsData, error]);

  const handleKindChange = (newKind: string) => {
    setKind(newKind);
  };

  // Update form data whenever kind changes
  useEffect(() => {
    if (onFormDataChange) {
      onFormDataChange({
        kind
      });
    }
  }, [kind, onFormDataChange]);

  const isFormValid = () => {
    return Boolean(kind);
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      const data: Partial<RegistrationData> = {
        kind: kind as 'FREELANCER' | 'COMPANY' | 'AGENCY'
      };

      // If freelancer, go to plan selection, otherwise complete registration
      if (kind === 'FREELANCER') {
        onNext(data);
      } else {
        onComplete(data);
      }
    }
  };

  return (
    <div className='flex h-full flex-col'>
      <div className='flex-1 pb-8'>
        <CategorySelection
          categories={categoriesData}
          selectedCategory={kind}
          onCategoryChange={handleKindChange}
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
                      kind === 'FREELANCER'
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
                : kind === 'FREELANCER'
                  ? t('continue')
                  : t('createAccount')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
