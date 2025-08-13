'use client';

import React, { useEffect, useState } from 'react';

import type { RegistrationData } from '@/lib/types/auth';

import { Button, Progress } from '@heroui/react';
import { Icon } from '@iconify/react';
import useRegister from '@root/modules/auth/hooks/use-register';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import BillingForm from './billing-form';
import CategorySelectionForm from './category-selection-form';
import EmailPasswordForm from './email-password-form';
import PlanSelectionForm from './plan-selection-form';

const allSteps = [
  {
    id: 'credentials',
    titleKey: 'personalInformation',
    subtitleKey: 'createAccountDetails',
    icon: 'solar:user-plus-bold-duotone',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'category',
    titleKey: 'chooseYourCategory',
    subtitleKey: 'selectWhatDescribesYou',
    icon: 'solar:users-group-rounded-bold-duotone',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'plan',
    titleKey: 'chooseYourPlan',
    subtitleKey: 'selectPlanThatFitsYou',
    icon: 'solar:gift-bold-duotone',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'billing',
    titleKey: 'billingInformation',
    subtitleKey: 'completeYourDetails',
    icon: 'solar:card-bold-duotone',
    color: 'from-orange-500 to-orange-600'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24
    }
  }
};

const pageTransition = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.8
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.8
  })
};

export default function PremiumWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [registrationData, setRegistrationData] = useState<Partial<RegistrationData>>({});
  const [subscriptionTypeFromUrl, setSubscriptionTypeFromUrl] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentFormData, setCurrentFormData] = useState<any>({});
  const [isOAuthUser, setIsOAuthUser] = useState(false);
  const [oauthToken, setOauthToken] = useState<string | undefined>();

  const t = useTranslations('registration');
  const steps = allSteps;

  const isStepApplicableForUser = (stepId: string): boolean => {
    const kind = registrationData.kind;
    const selectedPlan = registrationData.selectedPlan;

    switch (stepId) {
      case 'credentials':
      case 'category': {
        return true;
      }
      case 'plan': {
        return kind === 'FREELANCER';
      }
      case 'billing': {
        return selectedPlan?.type === 'FREELANCER_EXPERT';
      }
      default: {
        return true;
      }
    }
  };

  const { form, mutation } = useRegister();
  const parameters = useSearchParams();

  useEffect(() => {
    const subscriptionType = parameters.get('subscription_type');
    const senderId = parameters.get('senderId');

    // Handle OAuth parameters
    const isOAuth = parameters.get('is_oauth') === 'true';
    const oauthEmail = parameters.get('oauth_email');
    const oauthFirstName = parameters.get('oauth_firstName');
    const oauthLastName = parameters.get('oauth_lastName');
    const oauthToken = parameters.get('oauth_token');
    const chatToken = parameters.get('chat_token');

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

    // Handle OAuth data
    if (isOAuth && oauthEmail && oauthFirstName && oauthLastName) {
      setIsOAuthUser(true);
      setOauthToken(oauthToken || undefined);

      update.email = oauthEmail;
      update.firstName = oauthFirstName;
      update.lastName = oauthLastName;

      // Skip to category step since credentials are already filled
      const categoryStepIndex = steps.findIndex((step) => step.id === 'category');
      if (categoryStepIndex !== -1) {
        setCurrentStep(categoryStepIndex);
      }
    }

    if (Object.keys(update).length > 0) {
      setRegistrationData((previous) => ({ ...previous, ...update }));
    }
  }, [parameters]);

  const nextStep = () => {
    const nextStepIndex = getNextValidStep(currentStep);
    if (nextStepIndex !== -1) {
      setDirection(1);
      setCurrentStep(nextStepIndex);
    }
  };

  const getNextValidStep = (currentIndex: number): number => {
    const kind = registrationData.kind;
    const selectedPlan = registrationData.selectedPlan;

    for (let index = currentIndex + 1; index < steps.length; index++) {
      const stepId = steps[index]?.id;

      // Skip plan step for non-freelancers
      if (stepId === 'plan' && kind !== 'FREELANCER') {
        continue;
      }

      // Skip billing step for non-expert plans
      if (stepId === 'billing' && selectedPlan?.type !== 'FREELANCER_EXPERT') {
        continue;
      }

      return index;
    }

    return -1; // No more valid steps
  };

  const previousStep = () => {
    const previousStepIndex = getPreviousValidStep(currentStep);
    if (previousStepIndex !== -1) {
      setDirection(-1);
      setCurrentStep(previousStepIndex);
    }
  };

  const getPreviousValidStep = (currentIndex: number): number => {
    const kind = registrationData.kind;
    const selectedPlan = registrationData.selectedPlan;

    for (let index = currentIndex - 1; index >= 0; index--) {
      const stepId = steps[index]?.id;

      // Skip plan step for non-freelancers
      if (stepId === 'plan' && kind !== 'FREELANCER') {
        continue;
      }

      // Skip billing step for non-expert plans
      if (stepId === 'billing' && selectedPlan?.type !== 'FREELANCER_EXPERT') {
        continue;
      }

      return index;
    }

    return -1; // No more valid steps
  };

  const handleStepOneComplete = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    chatToken?: string;
    token?: string;
  }) => {
    setIsLoading(true);
    setRegistrationData((previous) => ({ ...previous, ...data }));
    setIsLoading(false);
    nextStep();
  };

  const handleStepNext = (data: Partial<RegistrationData>) => {
    const updatedData = { ...registrationData, ...data };
    setRegistrationData(updatedData);

    // Check if there are more valid steps after updating data
    const nextStepIndex = getNextValidStepWithData(currentStep, updatedData);
    if (nextStepIndex === -1) {
      // No more valid steps, complete registration
      handleStepComplete(data);
    } else {
      setDirection(1);
      setCurrentStep(nextStepIndex);
    }
  };

  const getNextValidStepWithData = (
    currentIndex: number,
    data: Partial<RegistrationData>
  ): number => {
    const kind = data.kind;
    const selectedPlan = data.selectedPlan;

    for (let index = currentIndex + 1; index < steps.length; index++) {
      const stepId = steps[index]?.id;

      // Skip plan step for non-freelancers
      if (stepId === 'plan' && kind !== 'FREELANCER') {
        continue;
      }

      // Skip billing step for non-expert plans
      if (stepId === 'billing' && selectedPlan?.type !== 'FREELANCER_EXPERT') {
        continue;
      }

      return index;
    }

    return -1; // No more valid steps
  };

  const handleStepComplete = (data: Partial<RegistrationData>) => {
    const finalData = { ...registrationData, ...data };
    const transformedData = {
      email: finalData.email ?? '',
      firstName: finalData.firstName ?? '',
      lastName: finalData.lastName ?? '',
      name: `${finalData.firstName ?? ''} ${finalData.lastName ?? ''}`.trim(),
      password: finalData.password ?? '',
      kind: finalData.kind ?? 'FREELANCER',
      language: 'EN',
      receiveEmail: false,
      ...(finalData.selectedPlan?.stripePriceId && {
        subPriceId: finalData.selectedPlan.stripePriceId
      }),
      ...(finalData.addressDetails && { addressDetails: finalData.addressDetails }),
      ...(finalData.senderId && { senderId: finalData.senderId })
    };

    if (isOAuthUser && oauthToken) {
      form.completeProfile(transformedData, oauthToken);
    } else {
      form.registerUser(transformedData);
    }
  };

  const handleOAuthComplete = (oauthData: { isCompleted: boolean; user: any; token?: string }) => {
    if (oauthData.isCompleted) {
      return;
    }

    setIsOAuthUser(true);
    setOauthToken(oauthData.token); // Store OAuth token

    const updatedRegistrationData: Partial<RegistrationData> = {
      ...registrationData,
      email: oauthData.user.email ?? '',
      firstName: oauthData.user.firstName ?? '',
      lastName: oauthData.user.lastName ?? ''
    };

    setRegistrationData(updatedRegistrationData);

    // Move to next step (category selection) since credentials are filled via OAuth
    const nextStepIndex = getNextValidStep(currentStep);
    if (nextStepIndex !== -1) {
      setDirection(1);
      setCurrentStep(nextStepIndex);
    }
  };

  const renderStepContent = () => {
    const stepId = steps[currentStep]?.id;

    switch (stepId) {
      case 'credentials': {
        return (
          <EmailPasswordForm
            onComplete={handleStepOneComplete}
            initialData={{
              email: registrationData.email ?? '',
              password: registrationData.password ?? '',
              firstName: registrationData.firstName ?? '',
              lastName: registrationData.lastName ?? ''
            }}
            showButtons={false}
            onFormDataChange={setCurrentFormData}
            onOAuthComplete={handleOAuthComplete}
          />
        );
      }
      case 'category': {
        return (
          <CategorySelectionForm
            onComplete={handleStepComplete}
            onNext={handleStepNext}
            onBack={previousStep}
            initialData={{
              ...registrationData,
              subscriptionTypeFromUrl
            }}
            isLoading={mutation.isLoading}
            showButtons={false}
            onFormDataChange={setCurrentFormData}
          />
        );
      }
      case 'plan': {
        return (
          <PlanSelectionForm
            onComplete={handleStepComplete}
            onNext={handleStepNext}
            onBack={previousStep}
            initialData={registrationData}
            isLoading={mutation.isLoading}
            showButtons={false}
            onFormDataChange={setCurrentFormData}
          />
        );
      }
      case 'billing': {
        return (
          <BillingForm
            onComplete={handleStepComplete}
            onBack={previousStep}
            initialData={registrationData}
            isLoading={mutation.isLoading}
            showButtons={false}
            onFormDataChange={setCurrentFormData}
          />
        );
      }
      default: {
        return null;
      }
    }
  };

  const renderBottomButton = () => {
    const stepId = steps[currentStep]?.id;

    switch (stepId) {
      case 'credentials': {
        const isStep1Valid = Boolean(
          currentFormData.firstName &&
            currentFormData.lastName &&
            currentFormData.email &&
            currentFormData.password &&
            currentFormData.confirmPassword &&
            currentFormData.password === currentFormData.confirmPassword &&
            currentFormData.email.includes('@') &&
            currentFormData.password.length >= 8
        );
        return (
          <Button
            color='primary'
            size='lg'
            className='rounded-[18px] px-10 font-semibold tracking-[0.02em] shadow-lg transition-all duration-300 hover:shadow-xl'
            isDisabled={!isStep1Valid || isLoading}
            isLoading={isLoading}
            onPress={() =>
              handleStepOneComplete({
                email: currentFormData.email ?? '',
                password: currentFormData.password ?? '',
                firstName: currentFormData.firstName ?? '',
                lastName: currentFormData.lastName ?? ''
              })
            }
            endContent={<Icon icon='solar:alt-arrow-right-linear' className='h-5 w-5' />}
          >
            {t('continue')}
          </Button>
        );
      }
      case 'category': {
        const kind = currentFormData.kind || registrationData.kind;
        return (
          <Button
            color='primary'
            size='lg'
            className='rounded-[18px] px-10 font-semibold tracking-[0.02em] shadow-lg transition-all duration-300 hover:shadow-xl'
            isDisabled={!kind || mutation.isLoading}
            isLoading={mutation.isLoading}
            onPress={() => {
              const data = { kind: kind as 'FREELANCER' | 'COMPANY' | 'AGENCY' };
              if (kind === 'FREELANCER') {
                handleStepNext(data);
              } else {
                handleStepComplete(data);
              }
            }}
            endContent={
              <Icon
                icon={
                  kind === 'FREELANCER' ? 'solar:alt-arrow-right-linear' : 'solar:user-plus-bold'
                }
                className='h-5 w-5'
              />
            }
          >
            {mutation.isLoading
              ? t('creatingAccount')
              : kind === 'FREELANCER'
                ? t('continue')
                : t('createAccount')}
          </Button>
        );
      }
      case 'plan': {
        const selectedPlan = currentFormData.selectedPlan || registrationData.selectedPlan;
        return (
          <Button
            color='primary'
            size='lg'
            className='rounded-[18px] px-10 font-semibold tracking-[0.02em] shadow-lg transition-all duration-300 hover:shadow-xl'
            isDisabled={!selectedPlan || mutation.isLoading}
            isLoading={mutation.isLoading}
            onPress={() => {
              if (selectedPlan) {
                const data = { selectedPlan, subPriceId: selectedPlan.stripePriceId ?? undefined };
                if (selectedPlan.type === 'FREELANCER_EXPERT') {
                  handleStepNext(data);
                } else {
                  handleStepComplete(data);
                }
              }
            }}
            endContent={
              <Icon
                icon={
                  selectedPlan?.type === 'FREELANCER_EXPERT'
                    ? 'solar:alt-arrow-right-linear'
                    : 'solar:user-plus-bold'
                }
                className='h-5 w-5'
              />
            }
          >
            {mutation.isLoading
              ? t('creatingAccount')
              : selectedPlan?.type === 'FREELANCER_EXPERT'
                ? t('continue')
                : t('createAccount')}
          </Button>
        );
      }
      case 'billing': {
        const isFormValid = Boolean(
          (currentFormData.addressDetails?.street || registrationData.addressDetails?.street) &&
            (currentFormData.addressDetails?.city || registrationData.addressDetails?.city) &&
            (currentFormData.addressDetails?.postalCode ||
              registrationData.addressDetails?.postalCode) &&
            (currentFormData.addressDetails?.country || registrationData.addressDetails?.country) &&
            (currentFormData.termsAccepted || registrationData.termsAccepted)
        );
        return (
          <Button
            color='primary'
            size='lg'
            className='rounded-[18px] px-10 font-semibold tracking-[0.02em] shadow-lg transition-all duration-300 hover:shadow-xl'
            isDisabled={!isFormValid || mutation.isLoading}
            isLoading={mutation.isLoading}
            onPress={() => {
              handleStepComplete({
                addressDetails: currentFormData.addressDetails || registrationData.addressDetails,
                termsAccepted: currentFormData.termsAccepted || registrationData.termsAccepted
              });
            }}
            endContent={<Icon icon='solar:user-plus-bold' className='h-5 w-5' />}
          >
            {mutation.isLoading ? t('creatingAccount') : t('createAccount')}
          </Button>
        );
      }
      default: {
        return null;
      }
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className='flex h-[calc(100vh-80px)] items-center justify-center overflow-hidden py-4'>
      {/* Desktop-First Container */}
      <motion.div
        className='dark:bg-background/20 flex h-[calc(100vh-158px)] w-[95%] max-w-none min-w-[320px] flex-col overflow-hidden rounded-[16px] bg-white/20 shadow-[0px_24px_48px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:w-[70%] sm:min-w-[1100px] sm:flex-row sm:rounded-[24px]'
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Desktop Layout */}
        <div className='flex h-full w-full'>
          {/* Left Panel - Step Navigation */}
          <motion.div
            className='border-default-200 flex hidden w-[370px] min-w-[330px] flex-col border-r sm:flex sm:min-w-[370px]'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className='border-default-200 border-b p-8'>
              <div className='mb-6 flex items-center gap-4'>
                <div className='bg-primary/10 flex h-14 w-14 items-center justify-center rounded-[18px]'>
                  <Icon icon='solar:user-plus-bold' className='text-primary h-7 w-7' />
                </div>
                <div>
                  <h1 className='text-foreground text-2xl font-bold tracking-[0.02em]'>
                    {t('joinWingman')}
                  </h1>
                  <p className='text-default-500'>{t('createYourAccount')}</p>
                </div>
              </div>

              {/* Progress */}
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-primary text-sm font-medium'>
                    {t('step')} {currentStep + 1} {t('of')} {steps.length}
                  </span>
                  <span className='text-default-500 text-sm'>
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <Progress
                  value={progressPercentage}
                  color='primary'
                  size='md'
                  className='w-full'
                  classNames={{
                    track: 'bg-default-200',
                    indicator: 'bg-gradient-to-r from-primary to-primary-600'
                  }}
                />
              </div>
            </div>

            {/* Steps */}
            <div className='flex flex-1 flex-col justify-center p-8'>
              <div className='space-y-4'>
                {steps
                  .filter((step) => isStepApplicableForUser(step.id))
                  .map((step, filteredIndex) => {
                    const originalIndex = steps.findIndex((s) => s.id === step.id);
                    const isStepCompleted = originalIndex < currentStep;
                    const isCurrentStep = originalIndex === currentStep;

                    return (
                      <motion.div
                        key={step.id}
                        className={`flex items-center gap-4 rounded-[16px] p-4 transition-all duration-500 ${
                          isCurrentStep
                            ? 'bg-primary/10 border-primary/20 border'
                            : isStepCompleted
                              ? 'from-primary/5 to-primary/10 border-primary/15 border bg-gradient-to-r'
                              : 'bg-default-50 dark:bg-default-100/20'
                        }`}
                        animate={{
                          scale: isCurrentStep ? 1.02 : isStepCompleted ? 1.01 : 1,
                          opacity: isCurrentStep || isStepCompleted ? 1 : 0.6
                        }}
                        transition={{
                          duration: 0.4,
                          ease: 'easeOut',
                          type: 'spring',
                          stiffness: 200,
                          damping: 20
                        }}
                      >
                        <motion.div
                          className={`relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-[14px] font-bold transition-all duration-500 ${
                            isCurrentStep
                              ? 'bg-primary text-white shadow-lg'
                              : isStepCompleted
                                ? 'from-primary to-primary-600 bg-gradient-to-br text-white shadow-lg'
                                : 'bg-default-100 text-default-500'
                          }`}
                          animate={{
                            scale: isStepCompleted ? 1.05 : 1
                          }}
                          transition={{
                            duration: 0.5,
                            ease: 'easeOut',
                            type: 'spring',
                            stiffness: 300,
                            damping: 25
                          }}
                        >
                          {isStepCompleted ? (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{
                                duration: 0.5,
                                ease: 'backOut',
                                type: 'spring',
                                stiffness: 400,
                                damping: 15
                              }}
                              className='relative'
                            >
                              <Icon icon='solar:check-circle-bold-duotone' className='h-7 w-7' />
                              <motion.div
                                className='absolute inset-0 rounded-full bg-white/20'
                                initial={{ scale: 0, opacity: 1 }}
                                animate={{ scale: 2, opacity: 0 }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                              />
                            </motion.div>
                          ) : (
                            <motion.span
                              key={filteredIndex}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              {filteredIndex + 1}
                            </motion.span>
                          )}
                        </motion.div>
                        <div className='flex-1'>
                          <h3
                            className={`font-semibold tracking-[0.02em] transition-all duration-500 ${
                              isCurrentStep
                                ? 'text-primary'
                                : isStepCompleted
                                  ? 'text-primary font-bold'
                                  : 'text-foreground'
                            }`}
                          >
                            {t(step.titleKey)}
                          </h3>
                          <p
                            className={`text-sm transition-all duration-500 ${
                              isCurrentStep
                                ? 'text-primary/80'
                                : isStepCompleted
                                  ? 'text-primary/70 font-medium'
                                  : 'text-default-500'
                            }`}
                          >
                            {isStepCompleted ? t('completed') : t(step.subtitleKey)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </div>

            {/* Footer */}
            <div className='border-default-200 border-t p-8'>
              <div className='space-y-3 text-center'>
                <div className='text-default-400 flex items-center justify-center gap-2 text-xs'>
                  <Icon icon='solar:shield-check-linear' className='h-4 w-4' />
                  <span>{t('secureEncrypted')}</span>
                </div>
                <p className='text-default-500 text-xs'>
                  {t('alreadyHaveAccount')}{' '}
                  <a href='/' className='text-primary hover:text-primary/80 font-medium'>
                    {t('signIn')}
                  </a>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Mobile Progress Bar (only visible on small screens) */}
          <div className='border-default-200 w-full border-b p-4 sm:hidden'>
            <div className='mb-3 text-center'>
              <h1 className='text-foreground text-lg font-bold'>{t('joinWingman')}</h1>
              <p className='text-default-500 text-sm'>
                {t('step')} {currentStep + 1} {t('of')} {steps.length}
              </p>
            </div>
            <Progress value={progressPercentage} color='primary' size='sm' className='w-full' />
          </div>

          {/* Right Panel - Form Content */}
          <div className='flex min-w-0 flex-1 flex-col'>
            <motion.div
              className='flex-1'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            >
              <div className='flex h-full flex-col p-4 sm:p-6 lg:p-8'>
                {/* Step Header */}
                <motion.div
                  className='mb-3'
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className='mb-3 flex items-center gap-3'>
                    <div className='from-primary/15 to-primary/5 shadow-primary/10 flex h-12 w-12 items-center justify-center rounded-[16px] bg-gradient-to-br shadow-md'>
                      <Icon
                        icon={steps[currentStep]?.icon || 'solar:user-linear'}
                        className='text-primary h-6 w-6'
                      />
                    </div>
                    <div>
                      <h2 className='text-foreground mb-1 text-2xl leading-tight font-bold tracking-[-0.02em]'>
                        {t(steps[currentStep]?.titleKey || 'registration.default')}
                      </h2>
                      <p className='text-default-600 text-sm font-medium'>
                        {t(steps[currentStep]?.subtitleKey || 'registration.default')}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Content */}
                <div className='flex flex-1 flex-col overflow-hidden'>
                  <div className='flex flex-1 items-center justify-center px-12'>
                    <AnimatePresence mode='wait' custom={direction}>
                      <motion.div
                        key={currentStep}
                        custom={direction}
                        variants={pageTransition}
                        initial='enter'
                        animate='center'
                        exit='exit'
                        transition={{
                          x: { type: 'spring', stiffness: 300, damping: 30 },
                          opacity: { duration: 0.2 },
                          scale: { duration: 0.2 }
                        }}
                        className='w-full max-w-4xl'
                      >
                        {isLoading ? (
                          <div className='flex flex-col items-center justify-center py-20'>
                            <motion.div
                              className='border-primary/20 border-t-primary mb-4 h-12 w-12 rounded-full border-4'
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            />
                            <p className='text-default-600 font-medium'>
                              {t('verifyingInformation')}
                            </p>
                          </div>
                        ) : (
                          renderStepContent()
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Global Bottom Buttons - Aligned with sidebar footer */}
                <div className='border-default-200 dark:bg-background/20 border-t bg-white/20 px-12 py-[14px] backdrop-blur-xl'>
                  <div className='flex items-center justify-between'>
                    <div>
                      {currentStep > 0 && (
                        <Button
                          variant='light'
                          size='lg'
                          className='text-default-600 hover:text-primary hover:bg-default-100/50 font-medium tracking-[0.02em] transition-all duration-300'
                          startContent={
                            <Icon icon='solar:alt-arrow-left-linear' className='h-5 w-5' />
                          }
                          onPress={previousStep}
                        >
                          {t('back')}
                        </Button>
                      )}
                    </div>
                    <div>{renderBottomButton()}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
