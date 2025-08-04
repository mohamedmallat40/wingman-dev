'use client';

import React, { useEffect, useState } from 'react';

import type { RegistrationData } from '@/lib/types/auth';

import { Button } from '@heroui/react';
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
    opacity: 0,
    scale: 0.98
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 50 : -50,
    opacity: 0,
    scale: 0.98
  })
};

const sidebarVariants = {
  desktop: {
    width: 300,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  },
  mobile: {
    width: '100%',
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  }
};

export default function RegistrationWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [registrationData, setRegistrationData] = useState<Partial<RegistrationData>>({});
  const [subscriptionTypeFromUrl, setSubscriptionTypeFromUrl] = useState<string | undefined>();
  const [isMobile, setIsMobile] = useState(false);

  const { form, mutation } = useRegister();
  const parameters = useSearchParams();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      const newDirection = stepIndex > currentStep ? 1 : -1;
      setDirection(newDirection);
      setCurrentStep(stepIndex);
    }
  };

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

  const StepIndicator = ({
    step,
    index,
    isActive,
    isCompleted
  }: {
    step: (typeof steps)[0];
    index: number;
    isActive: boolean;
    isCompleted: boolean;
  }) => (
    <motion.div
      className={`flex cursor-pointer items-center gap-4 rounded-[16px] p-4 transition-all duration-300 ${
        isActive
          ? 'bg-primary/10 border-primary/20 border'
          : isCompleted
            ? 'bg-success/5 border-success/10 hover:bg-success/10 border'
            : 'hover:bg-default-50 dark:hover:bg-default-100/20'
      }`}
      onClick={() => isCompleted && goToStep(index)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-[12px] transition-all duration-300 ${
          isActive
            ? 'bg-primary text-white shadow-lg'
            : isCompleted
              ? 'bg-success text-white'
              : 'bg-default-100 dark:bg-default-200 text-default-500'
        }`}
      >
        {isCompleted ? (
          <Icon icon='solar:check-circle-bold' className='h-5 w-5' />
        ) : (
          <Icon icon={step.icon} className='h-5 w-5' />
        )}
      </div>
      <div className='min-w-0 flex-1'>
        <h3
          className={`font-semibold tracking-[0.02em] transition-colors duration-300 ${
            isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-foreground'
          }`}
        >
          {step.title}
        </h3>
        <p
          className={`text-sm transition-colors duration-300 ${
            isActive ? 'text-primary/80' : 'text-default-500'
          }`}
        >
          {step.description}
        </p>
      </div>
      {isActive && (
        <motion.div
          className='bg-primary h-2 w-2 rounded-full'
          layoutId='activeIndicator'
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </motion.div>
  );

  const MobileStepper = () => (
    <div className='flex items-center justify-center gap-2 p-4'>
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          className={`h-2 rounded-full transition-all duration-300 ${
            index <= currentStep ? 'bg-primary' : 'bg-default-200'
          }`}
          style={{ width: index === currentStep ? 32 : 16 }}
          animate={{ width: index === currentStep ? 32 : 16 }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );

  return (
    <div className='from-primary/5 to-secondary/5 flex h-screen overflow-hidden bg-gradient-to-br via-transparent'>
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

      {/* Left Empty Space - 15% */}
      <div className='hidden w-[15%] lg:block'></div>

      {/* Main Content - 70% */}
      <div className='flex h-full w-full lg:w-[70%]'>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <motion.div
            className='dark:bg-background/90 border-default-200 flex w-80 flex-col border-r bg-white/90 backdrop-blur-xl'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className='border-default-200 border-b p-6'>
              <div className='mb-6 flex items-center gap-3'>
                <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-[16px]'>
                  <Icon icon='solar:user-plus-bold' className='text-primary h-6 w-6' />
                </div>
                <div>
                  <h1 className='text-foreground text-xl font-bold tracking-[0.02em]'>
                    Join Wingman
                  </h1>
                  <p className='text-default-500 text-sm'>Create your account</p>
                </div>
              </div>

              {/* Progress */}
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-primary text-sm font-medium'>
                    Step {currentStep + 1} of {steps.length}
                  </span>
                  <span className='text-default-500 text-sm'>
                    {Math.round(((currentStep + 1) / steps.length) * 100)}%
                  </span>
                </div>
                <div className='bg-default-200 h-2 w-full rounded-full'>
                  <motion.div
                    className='from-primary to-primary-600 h-2 rounded-full bg-gradient-to-r'
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className='flex-1 space-y-3 p-6'>
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className={`flex cursor-pointer items-center gap-4 rounded-[16px] p-4 transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-primary/10 border-primary/20 border'
                      : index < currentStep
                        ? 'bg-success/5 border-success/10 hover:bg-success/10 border'
                        : 'hover:bg-default-50 dark:hover:bg-default-100/20'
                  }`}
                  onClick={() => index < currentStep && goToStep(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-[10px] text-sm font-bold transition-all duration-300 ${
                      index === currentStep
                        ? 'bg-primary text-white'
                        : index < currentStep
                          ? 'bg-success text-white'
                          : 'bg-default-100 dark:bg-default-200 text-default-500'
                    }`}
                  >
                    {index < currentStep ? (
                      <Icon icon='solar:check-bold' className='h-4 w-4' />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className='flex-1'>
                    <h3
                      className={`font-semibold tracking-[0.02em] transition-colors duration-300 ${
                        index === currentStep
                          ? 'text-primary'
                          : index < currentStep
                            ? 'text-success'
                            : 'text-foreground'
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`text-sm transition-colors duration-300 ${
                        index === currentStep ? 'text-primary/80' : 'text-default-500'
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className='border-default-200 border-t p-6'>
              <p className='text-default-500 text-center text-xs'>
                Already have an account?{' '}
                <a href='/' className='text-primary hover:text-primary/80 font-medium'>
                  Sign In
                </a>
              </p>
            </div>
          </motion.div>
        )}

        {/* Form Content Area */}
        <div className='h-full flex-1 overflow-hidden'>
          <motion.div
            className='dark:bg-background/90 h-full bg-white/90 backdrop-blur-xl'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className='flex h-full flex-col p-8'>
              {/* Mobile Header */}
              {isMobile && (
                <div className='mb-6 text-center'>
                  <div className='bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[24px]'>
                    <Icon icon='solar:user-plus-bold' className='text-primary h-8 w-8' />
                  </div>
                  <h1 className='text-foreground mb-2 text-2xl font-bold tracking-[0.02em]'>
                    Create Your Account
                  </h1>
                  <p className='text-default-500 font-normal tracking-[0.02em]'>
                    Join thousands of professionals on Wingman
                  </p>
                  <MobileStepper />
                </div>
              )}

              {/* Desktop Step Header */}
              {!isMobile && (
                <motion.div
                  className='mb-8'
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className='flex items-center gap-4'>
                    <div className='bg-primary/10 flex h-14 w-14 items-center justify-center rounded-[18px]'>
                      <Icon
                        icon={steps[currentStep]?.icon || 'solar:user-linear'}
                        className='text-primary h-7 w-7'
                      />
                    </div>
                    <div>
                      <div className='mb-1 flex items-center gap-2'>
                        <span className='text-primary text-sm font-medium'>
                          Step {currentStep + 1} of {steps.length}
                        </span>
                        <span className='bg-default-300 h-1 w-1 rounded-full'></span>
                        <span className='text-default-500 text-sm'>
                          {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
                        </span>
                      </div>
                      <h2 className='text-foreground mb-1 text-3xl font-bold tracking-[0.02em]'>
                        {steps[currentStep]?.title || 'Step'}
                      </h2>
                      <p className='text-default-500 font-normal tracking-[0.02em]'>
                        {steps[currentStep]?.description || 'Complete this step'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step Content */}
              <div className='flex-1 overflow-auto'>
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
                      opacity: { duration: 0.3 },
                      scale: { duration: 0.3 }
                    }}
                    className='h-full'
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              {currentStep > 0 && (
                <motion.div
                  className='border-default-200 mt-6 flex justify-start border-t pt-6'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <Button
                    variant='light'
                    className='text-default-500 hover:text-primary font-medium tracking-[0.02em]'
                    startContent={<Icon icon='solar:alt-arrow-left-linear' className='h-4 w-4' />}
                    onPress={prevStep}
                  >
                    Back to {steps[currentStep - 1]?.title || 'Previous Step'}
                  </Button>
                </motion.div>
              )}

              {/* Mobile Footer */}
              {isMobile && (
                <div className='border-default-200 mt-6 border-t pt-6 text-center'>
                  <p className='text-default-500 text-sm tracking-[0.02em]'>
                    Already have an account?{' '}
                    <a
                      href='/'
                      className='text-primary hover:text-primary/80 font-medium transition-colors duration-200'
                    >
                      Sign In
                    </a>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Empty Space - 15% */}
      <div className='hidden w-[15%] lg:block'></div>
    </div>
  );
}
