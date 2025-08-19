'use client';

import React, { useEffect, useState } from 'react';

import { Check, Loader2 } from 'lucide-react';

import wingManApi from '@/lib/axios';

import BasicInfoStep from './steps/basic-info-step';
import CategoriesPreferencesStep from './steps/categories-preferences';
import NotificationStep from './steps/notification-step';
import ProfileImageStep from './steps/profile-image-step';
import WelcomeStep from './steps/welcome-step';

const ONBOARDING_STEPS = [
  'basicInfo',
  'profileImage',
  'categories',
  'notifications'
] as const;

type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

const STEP_LABELS = {
  basicInfo: 'Basic Info',
  profileImage: 'Profile',
  categories: 'Categories',
  notifications: 'Notifications'
};

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setIsDataLoading(true);
      try {
        const userResponse = await wingManApi.get('/users/me');
        if (userResponse.status >= 200 && userResponse.status < 300) {
          setUserData(userResponse.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleNext = () => {
    const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);
    if (currentIndex < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(ONBOARDING_STEPS[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(ONBOARDING_STEPS[currentIndex - 1]);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Update user stepper to true to mark onboarding as complete
      await wingManApi.patch('/users/me', { stepper: true });
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStepComponent = () => {
    switch (currentStep) {
      case 'welcome': {
        return <WelcomeStep onNext={handleNext} />;
      }
      case 'basicInfo': {
        return (
          <BasicInfoStep
            onNext={handleNext}
            onPrevious={handlePrevious}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            userData={userData}
          />
        );
      }
      case 'profileImage': {
        return (
          <ProfileImageStep
            onNext={handleNext}
            onPrevious={handlePrevious}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            userData={userData}
          />
        );
      }
      case 'categories': {
        return (
          <CategoriesPreferencesStep
            onNext={handleNext}
            onPrevious={handlePrevious}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            userData={userData}
          />
        );
      }
      case 'notifications': {
        return (
          <NotificationStep
            onComplete={handleComplete}
            onPrevious={handlePrevious}
            isLoading={isLoading}
          />
        );
      }
      default: {
        return <WelcomeStep onNext={handleNext} />;
      }
    }
  };

  const currentStepIndex = ONBOARDING_STEPS.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100;

  // Show loading state while fetching user data
  if (isDataLoading) {
    return (
      <div className='from-background via-card to-background flex min-h-screen items-center justify-center bg-gradient-to-br'>
        <div className='flex flex-col items-center space-y-4'>
          <Loader2 className='text-primary h-8 w-8 animate-spin' />
          <p className='text-muted-foreground'>Loading your information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='from-background via-card to-background min-h-screen bg-gradient-to-br'>
      {/* Enhanced header with modern step indicators */}
      <div className='bg-background/80 border-border sticky top-0 z-10 border-b backdrop-blur-lg'>
        {/* Progress Bar */}
        <div className='bg-muted h-1 w-full'>
          <div
            className='from-primary to-accent h-1 bg-gradient-to-r transition-all duration-500 ease-out'
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step Indicators */}
        <div className='px-4 py-6'>
          <div className='mx-auto max-w-4xl'>
            <div className='flex items-center justify-between'>
              {ONBOARDING_STEPS.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={step} className='flex items-center'>
                    <div className='flex flex-col items-center'>
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all duration-300 ${
                          isCompleted
                            ? 'bg-primary text-primary-foreground shadow-lg'
                            : isCurrent
                              ? 'bg-accent text-accent-foreground ring-accent/20 shadow-md ring-2'
                              : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {isCompleted ? <Check className='h-5 w-5' /> : index + 1}
                      </div>
                      <span
                        className={`mt-2 hidden text-xs font-medium sm:block ${
                          isCurrent ? 'text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {STEP_LABELS[step]}
                      </span>
                    </div>
                    {index < ONBOARDING_STEPS.length - 1 && (
                      <div
                        className={`mx-2 h-0.5 w-8 transition-colors duration-300 sm:w-16 ${
                          isCompleted ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile step counter */}
            <div className='mt-4 text-center sm:hidden'>
              <span className='text-muted-foreground text-sm'>
                Step {currentStepIndex + 1} of {ONBOARDING_STEPS.length}: {STEP_LABELS[currentStep]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced step content with better spacing and animations */}
      <div className='flex flex-1 items-start justify-center p-4 sm:p-6 lg:p-8'>
        <div className='w-full max-w-4xl'>
          <div className='animate-in fade-in-50 slide-in-from-bottom-4 duration-500'>
            {getStepComponent()}
          </div>
        </div>
      </div>
    </div>
  );
}
