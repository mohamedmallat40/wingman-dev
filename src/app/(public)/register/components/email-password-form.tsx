'use client';

import { useState } from 'react';

import type React from 'react';

import { Button, Divider, Input } from '@heroui/react';
import { Icon } from '@iconify/react';
import useOAuth from '@root/modules/auth/hooks/use-oauth';
import { useTranslations } from 'next-intl';

interface EmailPasswordFormProperties {
  onComplete: (data: { email: string; password: string }) => void;
  initialData: { email: string; password: string };
}

const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string) => {
  return password.length >= 8;
};

export default function EmailPasswordForm({
  onComplete,
  initialData
}: Readonly<EmailPasswordFormProperties>) {
  const [email, setEmail] = useState(initialData.email);
  const [password, setPassword] = useState(initialData.password);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const t = useTranslations('AuthPage');

  const {
    loginWithGoogle,
    loginWithLinkedIn,
    isGoogleLoading,
    isLinkedInLoading,
    isLoading: isOAuthLoading
  } = useOAuth();

  const handleSubmit = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      // eslint-disable-next-line sonarjs/no-hardcoded-passwords
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      // eslint-disable-next-line sonarjs/no-hardcoded-passwords
      newErrors.password = 'Password must be at least 8 characters long';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onComplete({ email, password });
    }
  };

  const isFormValid = Boolean(
    email && password && validateEmail(email) && validatePassword(password)
  );

  return (
    <div className='mx-auto mt-4 max-w-md space-y-6'>
      <div className='flex flex-col gap-2'>
        <Button
          startContent={<Icon icon='flat-color-icons:google' width={24} />}
          variant='bordered'
          onPress={loginWithGoogle}
          isLoading={isGoogleLoading}
        >
          {isGoogleLoading ? 'Connecting...' : t('continueWithGoogle')}
        </Button>

        <Button
          startContent={<Icon className='text-default-500' icon='mdi:linkedin' width={24} />}
          variant='bordered'
          onPress={loginWithLinkedIn}
          isLoading={isLinkedInLoading}
        >
          {isLinkedInLoading ? 'Connecting...' : t('continueWithLinkedin')}
        </Button>
      </div>
      <div className='flex items-center gap-4 py-2'>
        <Divider className='flex-1' />
        <p className='text-tiny text-default-500 shrink-0'>{t('or')}</p>
        <Divider className='flex-1' />
      </div>

      <div className='space-y-4'>
        <Input
          type='email'
          label='Email Address'
          placeholder='Enter your email'
          value={email}
          onChange={(event: { target: { value: React.SetStateAction<string> } }) => {
            setEmail(event.target.value);
          }}
          isInvalid={!!errors.email}
          errorMessage={errors.email}
          startContent={
            <Icon icon='solar:letter-outline' className='text-default-400' width={18} />
          }
          size='sm'
        />

        <Input
          type={isPasswordVisible ? 'text' : 'password'}
          label='Password'
          placeholder='Enter your password (8+ characters)'
          value={password}
          onChange={(event: { target: { value: React.SetStateAction<string> } }) => {
            setPassword(event.target.value);
          }}
          isInvalid={!!errors.password}
          errorMessage={errors.password}
          startContent={<Icon icon='solar:lock-outline' className='text-default-400' width={18} />}
          endContent={
            <button
              type='button'
              onClick={() => {
                setIsPasswordVisible(!isPasswordVisible);
              }}
              className='cursor-pointer focus:outline-none'
            >
              <Icon
                icon={isPasswordVisible ? 'solar:eye-outline' : 'solar:eye-closed-outline'}
                className='text-default-400'
                width={18}
              />
            </button>
          }
          size='sm'
        />
      </div>

      <Button
        color='primary'
        size='lg'
        className='w-full font-medium'
        isDisabled={!isFormValid || Boolean(isOAuthLoading)}
        onPress={handleSubmit}
      >
        Continue to Next Step
        <Icon icon='solar:arrow-right-outline' width={20} />
      </Button>
    </div>
  );
}
