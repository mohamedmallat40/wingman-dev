'use client';

import React, { useEffect, useState } from 'react';

import useRegister from '@root/modules/auth/hooks/use-register';
import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

import Container from '@/components/container/container';
import { type RegistrationData } from '@/lib/types/auth';

import EmailPasswordForm from './components/email-password-form';
import RegistrationDetailsForm from './components/registration-details-form';

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0
  })
};

export default function Register() {
  const [pageState, setPage] = useState<[number, number]>([0, 0] as [number, number]);
  const [page, direction] = pageState;
  const [registrationData, setRegistrationData] = useState<Partial<RegistrationData>>({});
  const [subscriptionTypeFromUrl, setSubscriptionTypeFromUrl] = useState<string | undefined>();

  const { form, mutation } = useRegister();
  const parameters = useSearchParams();

  useEffect(() => {
    const subscriptionType = parameters.get('subscription_type');
    const senderId = parameters.get('senderId');
    console.log(parameters.toString());
    console.log(senderId);
    console.log(subscriptionType);
    const update: Partial<RegistrationData> = {};

    if (subscriptionType) {
      const isFreelancerPlan =
        subscriptionType === 'FREELANCER_EXPERT' || subscriptionType === 'FREELANCER_BASIC';
      update.kind = isFreelancerPlan ? 'FREELANCER' : (subscriptionType as 'COMPANY' | 'AGENCY');
      // Store the subscription type separately to resolve later
      setSubscriptionTypeFromUrl(subscriptionType);
    }

    if (senderId) {
      update.senderId = senderId;
    }

    if (Object.keys(update).length > 0) {
      setRegistrationData((previous) => ({ ...previous, ...update }));
    }
  }, []);

  const paginate = (newDirection: number) => {
    setPage((previous) => {
      const nextPage = previous[0] + newDirection;
      if (nextPage < 0 || nextPage > 1) return previous;
      return [nextPage, newDirection];
    });
  };

  const handleStepOneComplete = (data: { email: string; password: string }) => {
    setRegistrationData((previous) => ({ ...previous, ...data }));
    paginate(1);
  };

  const handleStepTwoComplete = (data: Partial<RegistrationData>) => {
    const finalData = { ...registrationData, ...data };
    const transformedData = {
      email: finalData.email ?? '',
      firstName: finalData.firstName ?? '',
      lastName: finalData.lastName ?? '',
      name: `${finalData.firstName ?? ''} ${finalData.lastName ?? ''}`,
      password: finalData.password ?? '',
      kind: finalData.kind ?? 'FREELANCER',
      language: 'EN',
      receiveEmail: false,
      ...(finalData.subPriceId && { subPriceId: finalData.subPriceId }),
      ...(finalData.addressDetails && { addressDetails: finalData.addressDetails }),
      ...(finalData.senderId && { senderId: finalData.senderId })
    };
    console.log('Final Registration Data:', transformedData);

    form.registerUser(transformedData);
  };

  const handleBack = () => {
    paginate(-1);
  };

  const renderCurrentStep = () => {
    switch (page) {
      case 0: {
        return (
          <EmailPasswordForm
            onComplete={handleStepOneComplete}
            initialData={{
              email: registrationData.email ?? '',
              password: registrationData.password ?? ''
            }}
          />
        );
      }
      case 1: {
        return (
          <RegistrationDetailsForm
            onComplete={handleStepTwoComplete}
            onBack={handleBack}
            initialData={{
              ...registrationData,
              // Pass the subscription type string for the component to resolve
              subscriptionTypeFromUrl
            }}
            isLoading={mutation.isLoading}
          />
        );
      }
      default: {
        return (
          <EmailPasswordForm
            onComplete={handleStepOneComplete}
            initialData={{ email: '', password: '' }}
          />
        );
      }
    }
  };

  return (
    <Container>
      <div className='mt-4 flex w-full flex-col items-center justify-center gap-2 px-4 sm:px-6 lg:px-8'>
        <div className='mt-4 text-center'>
          <h1 className='text-xl font-medium'>Create Your Account</h1>
          <p className='text-small text-default-500'>Step {page + 1} of 2</p>
        </div>
        <div className='relative w-full'>
          <LazyMotion features={domAnimation}>
            <AnimatePresence mode='wait' custom={direction}>
              <m.div
                key={page}
                custom={direction}
                animate='center'
                exit='exit'
                variants={variants}
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className='mx-auto max-w-4xl'
              >
                {renderCurrentStep()}
              </m.div>
            </AnimatePresence>
          </LazyMotion>
        </div>
      </div>
    </Container>
  );
}
