'use client';

import { useEffect, useState } from 'react';

import type React from 'react';

import { Button, Divider, Input } from '@heroui/react';
import { Icon } from '@iconify/react';
import useOAuth from '@root/modules/auth/hooks/use-oauth';
import { type IUserProfile } from '@root/modules/profile/types';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface OAuthResponse {
  success: boolean;
  data?: {
    user: IUserProfile;
    token: string;
  };
  error?: string;
}
interface EmailPasswordFormProperties {
  onComplete: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => void;
  initialData: { email: string; password: string; firstName: string; lastName: string };
  showButtons?: boolean;
  onFormDataChange?: (data: any) => void;
  onOAuthComplete?: (userData: { isCompleted: boolean; user: IUserProfile }) => void; // Add this prop
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
  initialData,
  showButtons = true,
  onFormDataChange,
  onOAuthComplete
}: Readonly<EmailPasswordFormProperties>) {
  const [email, setEmail] = useState(initialData.email);
  const [password, setPassword] = useState(initialData.password);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState(initialData.firstName);
  const [lastName, setLastName] = useState(initialData.lastName);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isOAuthUser, setIsOAuthUser] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
  }>({});

  const t = useTranslations('registration');

  const {
    loginWithGoogle,
    loginWithLinkedIn,
    isGoogleLoading,
    isLinkedInLoading,
    isLoading: isOAuthLoading
  } = useOAuth();

  const handleSubmit = () => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
      firstName?: string;
      lastName?: string;
    } = {};

    if (!firstName.trim()) {
      newErrors.firstName = t('firstNameRequired');
    }

    if (!lastName.trim()) {
      newErrors.lastName = t('lastNameRequired');
    }

    if (!email) {
      newErrors.email = t('emailRequired');
    } else if (!validateEmail(email)) {
      newErrors.email = t('emailInvalid');
    }

    if (!password) {
      newErrors.password = t('passwordRequired');
    } else if (!validatePassword(password)) {
      newErrors.password = t('passwordMinLength');
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t('confirmPasswordRequired');
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t('passwordsDoNotMatch');
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onComplete({ email, password, firstName: firstName.trim(), lastName: lastName.trim() });
    }
  };

  const isFormValid = Boolean(
    firstName.trim() &&
      lastName.trim() &&
      email &&
      password &&
      confirmPassword &&
      validateEmail(email) &&
      validatePassword(password) &&
      password === confirmPassword
  );

  // Update form data whenever any field changes
  useEffect(() => {
    if (onFormDataChange) {
      onFormDataChange({
        firstName,
        lastName,
        email,
        password,
        confirmPassword
      });
    }
  }, [firstName, lastName, email, password, confirmPassword, onFormDataChange]);

  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      if (!result.isCompleted && onOAuthComplete) {
        onOAuthComplete({
          isCompleted: result.isCompleted,
          user: result.user,
          token: result.token // Pass the token
        });
      }
    } catch (error) {
      console.error('Google OAuth failed:', error);
    }
  };
  const handleLinkedInLogin = async () => {
    try {
      const result = await loginWithLinkedIn();
      if (result && !result.isCompleted) {
        setIsOAuthUser(true);
        // Pre-fill form with OAuth data
        setEmail(result.user?.email ?? '');
        setFirstName(result.user?.firstName ?? '');
        setLastName(result.user?.lastName ?? '');
      }
      if (onOAuthComplete) {
        onOAuthComplete(result);
      }
    } catch (error) {
      console.error('Google OAuth failed:', error);
    }
  };
  return (
    <div className='flex h-full flex-col'>
      <div className='flex-1 space-y-6 pb-8'>
        {/* OAuth Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className='flex flex-col gap-3'
        >
          <Button
            className='border-default-300 hover:border-primary hover:bg-primary/5 h-12 rounded-[16px] font-medium tracking-[0.02em] transition-all duration-300'
            fullWidth
            startContent={<Icon icon='flat-color-icons:google' width={20} />}
            variant='bordered'
            onPress={handleGoogleLogin}
            isLoading={isGoogleLoading}
          >
            {isGoogleLoading ? t('connecting') : t('continueWithGoogle')}
          </Button>

          <Button
            className='border-default-300 hover:border-primary hover:bg-primary/5 h-12 rounded-[16px] font-medium tracking-[0.02em] transition-all duration-300'
            fullWidth
            startContent={<Icon icon='skill-icons:linkedin' width={20} />}
            variant='bordered'
            onPress={handleLinkedInLogin}
            isLoading={isLinkedInLoading}
          >
            {isLinkedInLoading ? t('connecting') : t('continueWithLinkedIn')}
          </Button>
          {isOAuthUser && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='bg-success-50 border-success-200 mb-4 flex items-center gap-2 rounded-lg border p-3'
            >
              <Icon icon='solar:check-circle-bold' className='text-success h-4 w-4' />
              <p className='text-success-700 text-sm font-medium'>
                Successfully authenticated! Please complete your registration.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className='flex items-center gap-4 py-4'
        >
          <Divider className='bg-default-200 flex-1' />
          <p className='text-default-500 shrink-0 text-sm font-medium tracking-[0.02em]'>
            {t('or')}
          </p>
          <Divider className='bg-default-200 flex-1' />
        </motion.div>

        {/* Form Fields */}
        <div className='space-y-4'>
          {/* Name Fields */}
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Input
                type='text'
                placeholder={t('firstName')}
                value={firstName}
                onChange={(event: { target: { value: React.SetStateAction<string> } }) => {
                  setFirstName(event.target.value);
                  if (errors.firstName) {
                    setErrors((previous) => ({ ...previous, firstName: undefined }));
                  }
                }}
                isInvalid={!!errors.firstName}
                variant='bordered'
                classNames={{
                  base: 'w-full',
                  mainWrapper: 'w-full',
                  inputWrapper:
                    'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] h-14 bg-white dark:bg-background transition-all duration-300',
                  input:
                    'text-foreground font-normal tracking-[0.02em] placeholder:text-default-400 text-base'
                }}
                startContent={
                  <Icon
                    icon='solar:user-linear'
                    className='text-default-400 h-5 w-5 flex-shrink-0'
                  />
                }
              />
              <AnimatePresence>
                {errors.firstName && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className='mt-2 flex items-center gap-2 px-1'
                  >
                    <Icon
                      icon='solar:danger-triangle-bold'
                      className='text-danger h-4 w-4 flex-shrink-0'
                    />
                    <p className='text-danger text-sm font-medium tracking-[0.02em]'>
                      {errors.firstName}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
            >
              <Input
                type='text'
                placeholder={t('lastName')}
                value={lastName}
                onChange={(event: { target: { value: React.SetStateAction<string> } }) => {
                  setLastName(event.target.value);
                  if (errors.lastName) {
                    setErrors((previous) => ({ ...previous, lastName: undefined }));
                  }
                }}
                isInvalid={!!errors.lastName}
                variant='bordered'
                classNames={{
                  base: 'w-full',
                  mainWrapper: 'w-full',
                  inputWrapper:
                    'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] h-14 bg-white dark:bg-background transition-all duration-300',
                  input:
                    'text-foreground font-normal tracking-[0.02em] placeholder:text-default-400 text-base'
                }}
                startContent={
                  <Icon
                    icon='solar:user-linear'
                    className='text-default-400 h-5 w-5 flex-shrink-0'
                  />
                }
              />
              <AnimatePresence>
                {errors.lastName && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className='mt-2 flex items-center gap-2 px-1'
                  >
                    <Icon
                      icon='solar:danger-triangle-bold'
                      className='text-danger h-4 w-4 flex-shrink-0'
                    />
                    <p className='text-danger text-sm font-medium tracking-[0.02em]'>
                      {errors.lastName}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
          >
            <Input
              type='email'
              placeholder={t('emailAddress')}
              value={email}
              onChange={(event: { target: { value: React.SetStateAction<string> } }) => {
                setEmail(event.target.value);
                if (errors.email) {
                  setErrors((previous) => ({ ...previous, email: undefined }));
                }
              }}
              isInvalid={!!errors.email}
              variant='bordered'
              classNames={{
                base: 'w-full',
                mainWrapper: 'w-full',
                inputWrapper:
                  'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] h-14 bg-white dark:bg-background transition-all duration-300',
                input:
                  'text-foreground font-normal tracking-[0.02em] placeholder:text-default-400 text-base'
              }}
              startContent={
                <Icon
                  icon='solar:letter-linear'
                  className='text-default-400 h-5 w-5 flex-shrink-0'
                />
              }
            />
            <AnimatePresence>
              {errors.email && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className='mt-2 flex items-center gap-2 px-1'
                >
                  <Icon
                    icon='solar:danger-triangle-bold'
                    className='text-danger h-4 w-4 flex-shrink-0'
                  />
                  <p className='text-danger text-sm font-medium tracking-[0.02em]'>
                    {errors.email}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <Input
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder={t('passwordPlaceholder')}
              value={password}
              onChange={(event: { target: { value: React.SetStateAction<string> } }) => {
                setPassword(event.target.value);
                if (errors.password) {
                  setErrors((previous) => ({ ...previous, password: undefined }));
                }
              }}
              isInvalid={!!errors.password}
              variant='bordered'
              classNames={{
                base: 'w-full',
                mainWrapper: 'w-full',
                inputWrapper:
                  'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] h-14 bg-white dark:bg-background transition-all duration-300',
                input:
                  'text-foreground font-normal tracking-[0.02em] placeholder:text-default-400 text-base'
              }}
              startContent={
                <Icon
                  icon='solar:lock-password-linear'
                  className='text-default-400 h-5 w-5 flex-shrink-0'
                />
              }
              endContent={
                <Button
                  isIconOnly
                  aria-label={isPasswordVisible ? t('hidePassword') : t('showPassword')}
                  className='text-default-400 hover:text-primary h-6 min-w-6 flex-shrink-0 transition-colors'
                  size='sm'
                  type='button'
                  variant='light'
                  onPress={() => {
                    setIsPasswordVisible(!isPasswordVisible);
                  }}
                >
                  {isPasswordVisible ? (
                    <Icon className='pointer-events-none text-xl' icon='solar:eye-closed-linear' />
                  ) : (
                    <Icon className='pointer-events-none text-xl' icon='solar:eye-bold' />
                  )}
                </Button>
              }
            />
            <AnimatePresence>
              {errors.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className='mt-2 flex items-center gap-2 px-1'
                >
                  <Icon
                    icon='solar:danger-triangle-bold'
                    className='text-danger h-4 w-4 flex-shrink-0'
                  />
                  <p className='text-danger text-sm font-medium tracking-[0.02em]'>
                    {errors.password}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.4 }}
          >
            <Input
              type={isConfirmPasswordVisible ? 'text' : 'password'}
              placeholder={t('confirmPassword')}
              value={confirmPassword}
              onChange={(event: { target: { value: React.SetStateAction<string> } }) => {
                setConfirmPassword(event.target.value);
                if (errors.confirmPassword) {
                  setErrors((previous) => ({ ...previous, confirmPassword: undefined }));
                }
              }}
              isInvalid={!!errors.confirmPassword}
              variant='bordered'
              classNames={{
                base: 'w-full',
                mainWrapper: 'w-full',
                inputWrapper:
                  'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] h-14 bg-white dark:bg-background transition-all duration-300',
                input:
                  'text-foreground font-normal tracking-[0.02em] placeholder:text-default-400 text-base'
              }}
              startContent={
                <Icon
                  icon='solar:lock-password-linear'
                  className='text-default-400 h-5 w-5 flex-shrink-0'
                />
              }
              endContent={
                <Button
                  isIconOnly
                  aria-label={isConfirmPasswordVisible ? t('hidePassword') : t('showPassword')}
                  className='text-default-400 hover:text-primary h-6 min-w-6 flex-shrink-0 transition-colors'
                  size='sm'
                  type='button'
                  variant='light'
                  onPress={() => {
                    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
                  }}
                >
                  {isConfirmPasswordVisible ? (
                    <Icon className='pointer-events-none text-xl' icon='solar:eye-closed-linear' />
                  ) : (
                    <Icon className='pointer-events-none text-xl' icon='solar:eye-bold' />
                  )}
                </Button>
              }
            />
            <AnimatePresence>
              {errors.confirmPassword && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className='mt-2 flex items-center gap-2 px-1'
                >
                  <Icon
                    icon='solar:danger-triangle-bold'
                    className='text-danger h-4 w-4 flex-shrink-0'
                  />
                  <p className='text-danger text-sm font-medium tracking-[0.02em]'>
                    {errors.confirmPassword}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Password Requirements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className='bg-default-50 dark:bg-default-100/20 rounded-[12px] p-4'
        >
          <div className='flex items-start gap-2'>
            <Icon
              icon='solar:info-circle-bold'
              className='text-primary mt-0.5 h-4 w-4 flex-shrink-0'
            />
            <div>
              <p className='text-foreground mb-1 text-sm font-medium'>
                {t('passwordRequirements')}:
              </p>
              <ul className='text-default-600 space-y-1 text-xs'>
                <li className='flex items-center gap-1'>
                  <Icon
                    icon={
                      password.length >= 8 ? 'solar:check-circle-bold' : 'solar:close-circle-bold'
                    }
                    className={`h-3 w-3 ${password.length >= 8 ? 'text-success' : 'text-default-400'}`}
                  />
                  {t('atLeast8Characters')}
                </li>
                <li className='flex items-center gap-1'>
                  <Icon
                    icon={
                      password && confirmPassword && password === confirmPassword
                        ? 'solar:check-circle-bold'
                        : 'solar:close-circle-bold'
                    }
                    className={`h-3 w-3 ${password && confirmPassword && password === confirmPassword ? 'text-success' : 'text-default-400'}`}
                  />
                  {t('passwordsMustMatch')}
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sticky Bottom Button */}
      {showButtons && (
        <div className='dark:bg-background/95 border-default-100 sticky bottom-0 mt-8 border-t bg-white/95 pt-6 backdrop-blur-xl'>
          <div className='flex justify-end'>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.4 }}
            >
              <Button
                color='primary'
                size='lg'
                className='rounded-[18px] px-10 font-semibold tracking-[0.02em] shadow-lg transition-all duration-300 hover:shadow-xl'
                isDisabled={!isFormValid || Boolean(isOAuthLoading)}
                onPress={handleSubmit}
                endContent={<Icon icon='solar:alt-arrow-right-linear' className='h-5 w-5' />}
              >
                Continue
              </Button>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
