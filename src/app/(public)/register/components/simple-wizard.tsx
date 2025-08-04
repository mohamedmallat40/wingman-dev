'use client';

import React, { useEffect, useState } from 'react';

import type { RegistrationData } from '@/lib/types/auth';

import { Button, Progress } from '@heroui/react';
import { Icon } from '@iconify/react';
import useRegister from '@root/modules/auth/hooks/use-register';
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

import EmailPasswordForm from './email-password-form';
import RegistrationDetailsForm from './registration-details-form';

const steps = [
  {
    id: 'credentials',
    title: 'Account Details',
    description: 'Create your login credentials',
    icon: 'solar:key-minimalistic-bold'
  },
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Tell us about yourself',
    icon: 'solar:user-bold'
  }
];

const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 50 : -50,
    opacity: 0
  })
};

export default function SimpleWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [registrationData, setRegistrationData] = useState<Partial<RegistrationData>>({});
  const [subscriptionTypeFromUrl, setSubscriptionTypeFromUrl] = useState<string | undefined>();

  const { form, mutation } = useRegister();
  const parameters = useSearchParams();

  useEffect(() => {
    const subscriptionType = parameters.get('subscription_type');
    const senderId = parameters.get('senderId');
    const update: Partial<RegistrationData> = {};

    if (subscriptionType) {
      const isFreelancerPlan =
        subscriptionType === 'FREELANCER_EXPERT' || subscriptionType === 'FREELANCER_BASIC';
      update.kind = isFreelancerPlan ? 'FREELANCER' : (subscriptionType as 'COMPANY' | 'AGENCY');
      setSubscriptionTypeFromUrl(subscriptionType);
    }

    if (senderId) {
      update.senderId = senderId;
    }

    if (Object.keys(update).length > 0) {
      setRegistrationData((previous) => ({ ...previous, ...update }));
    }
  }, [parameters]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepOneComplete = (data: { email: string; password: string }) => {
    setRegistrationData((previous) => ({ ...previous, ...data }));
    nextStep();
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

    form.registerUser(transformedData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <EmailPasswordForm
            onComplete={handleStepOneComplete}
            initialData={{
              email: registrationData.email ?? '',
              password: registrationData.password ?? '',
              firstName: registrationData.firstName ?? '',
              lastName: registrationData.lastName ?? ''
            }}
          />
        );
      case 1:
        return (
          <RegistrationDetailsForm
            onComplete={handleStepTwoComplete}
            onBack={prevStep}
            initialData={{
              ...registrationData,
              subscriptionTypeFromUrl
            }}
            isLoading={mutation.isLoading}
          />
        );
      default:
        return null;
    }
  };

  const progressValue = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className='from-primary/5 to-secondary/5 flex h-screen items-center justify-center overflow-hidden bg-gradient-to-br via-transparent'>
      {/* Background Elements */}
      <div className='pointer-events-none absolute inset-0'>
        <motion.div
          className='bg-primary/10 absolute top-20 left-20 h-72 w-72 rounded-full blur-3xl'
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className='bg-secondary/10 absolute right-20 bottom-20 h-96 w-96 rounded-full blur-3xl'
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Main Container - Web Application */}
      <motion.div
        className='dark:bg-background/90 h-[85vh] w-[85%] max-w-7xl overflow-hidden rounded-[24px] bg-white/90 shadow-[0px_24px_48px_rgba(0,0,0,0.12)] backdrop-blur-xl'
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Header */}
        <div className='dark:bg-background/95 border-default-200 border-b bg-white/95 p-8 backdrop-blur-sm'>
          <div className='mb-6 flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='bg-primary/10 flex h-16 w-16 items-center justify-center rounded-[20px]'>
                <Icon icon='solar:user-plus-bold' className='text-primary h-8 w-8' />
              </div>
              <div>
                <h1 className='text-foreground text-3xl font-bold tracking-[0.02em]'>
                  Create Your Account
                </h1>
                <p className='text-default-500 text-lg font-normal tracking-[0.02em]'>
                  Join thousands of professionals on Wingman
                </p>
              </div>
            </div>
            <div className='text-right'>
              <div className='text-primary mb-1 text-lg font-medium'>
                Step {currentStep + 1} of {steps.length}
              </div>
              <div className='text-default-500 text-sm'>{Math.round(progressValue)}% Complete</div>
            </div>
          </div>

          {/* Progress Bar */}
          <Progress
            value={progressValue}
            color='primary'
            size='md'
            className='w-full'
            classNames={{
              base: 'max-w-full',
              track: 'bg-default-200 h-3',
              indicator: 'bg-gradient-to-r from-primary to-primary-600'
            }}
          />

          {/* Step Indicators */}
          <div className='mt-6 flex justify-between'>
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-4 ${index < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div className='flex items-center gap-4'>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-[14px] text-lg font-bold transition-all duration-300 ${
                      index === currentStep
                        ? 'bg-primary text-white shadow-lg'
                        : index < currentStep
                          ? 'bg-success text-white'
                          : 'bg-default-100 text-default-500'
                    }`}
                  >
                    {index < currentStep ? (
                      <Icon icon='solar:check-bold' className='h-6 w-6' />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div>
                    <div
                      className={`text-lg font-semibold tracking-[0.02em] ${
                        index === currentStep
                          ? 'text-primary'
                          : index < currentStep
                            ? 'text-success'
                            : 'text-default-500'
                      }`}
                    >
                      {step.title}
                    </div>
                    <div className='text-default-400 text-sm'>{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-6 h-[3px] flex-1 transition-colors duration-500 ${
                      index < currentStep ? 'bg-success' : 'bg-default-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className='flex-1 overflow-auto p-10'>
          <AnimatePresence mode='wait' custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={pageVariants}
              initial='enter'
              animate='center'
              exit='exit'
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className='h-full'
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className='dark:bg-background/95 border-default-200 border-t bg-white/95 p-6 backdrop-blur-sm'>
          <div className='flex items-center justify-between'>
            <div>
              {currentStep > 0 ? (
                <Button
                  variant='light'
                  className='text-default-500 hover:text-primary font-medium tracking-[0.02em]'
                  startContent={<Icon icon='solar:alt-arrow-left-linear' className='h-4 w-4' />}
                  onPress={prevStep}
                >
                  Back to {steps[currentStep - 1]?.title || 'Previous Step'}
                </Button>
              ) : (
                <p className='text-default-500 text-sm tracking-[0.02em]'>
                  Already have an account?{' '}
                  <a
                    href='/'
                    className='text-primary hover:text-primary/80 font-medium transition-colors duration-200'
                  >
                    Sign In
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
