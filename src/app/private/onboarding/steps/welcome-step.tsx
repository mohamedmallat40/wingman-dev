import React from 'react';

import { ArrowRight, CheckCircle } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className='space-y-8 text-center'>
      <div className='space-y-4'>
        <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100'>
          <CheckCircle className='h-10 w-10 text-blue-600' />
        </div>

        <h1 className='text-3xl font-bold text-gray-200'>Welcome to the Platform!</h1>

        <p className='mx-auto max-w-md text-lg text-gray-600'>
          Let's get you set up with a quick onboarding process. We'll help you complete your profile
          and customize your preferences.
        </p>
      </div>

      <button
        onClick={onNext}
        className='bg-default-600 inline-flex items-center space-x-2 rounded-lg px-8 py-3 font-medium text-gray-500 transition-colors hover:bg-blue-700 hover:text-white'
      >
        <span>Let's Get Started</span>
        <ArrowRight className='h-4 w-4' />
      </button>

      <p className='text-sm text-gray-500'>This will only take a few minutes</p>
    </div>
  );
}
